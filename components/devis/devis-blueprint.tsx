"use client";

import { useReducer, useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { DevisState, DevisAction } from "./devis-types";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { PanelTravaux } from "./panels/panel-travaux";
import { PanelRecap } from "./panels/panel-recap";
import { StepSuccessOverlay } from "./steps/step-success";

// --- Props ---

interface DevisBlueprintProps {
  BlueprintComponent: React.ComponentType<{
    state: DevisState;
    dispatch: React.Dispatch<DevisAction>;
  }>;
}

// --- Helpers ---

function countTotalWorks(state: DevisState): number {
  return Object.values(state.selectedWorks).reduce(
    (sum, works) => sum + works.length,
    0,
  );
}

// --- Component ---

function getStorageKey(locale: string) {
  return `devis-state-${locale}`;
}

function loadSavedState(locale: string): DevisState {
  if (typeof window === "undefined") return initialDevisState;

  // Reset if ?reset=1 or if previous state was "success"
  const params = new URLSearchParams(window.location.search);
  if (params.get("reset") === "1") {
    localStorage.removeItem(getStorageKey(locale));
    const zone = params.get("zone");
    const work = params.get("work");
    if (zone && work) {
      return {
        ...initialDevisState,
        view: "zoomed",
        activeZone: zone as DevisState["activeZone"],
        selectedWorks: {
          ...initialDevisState.selectedWorks,
          [zone]: [work],
        },
      };
    }
    return initialDevisState;
  }

  try {
    const saved = localStorage.getItem(getStorageKey(locale));
    if (!saved) return initialDevisState;
    const parsed = JSON.parse(saved);
    // Never restore a "success" view — start fresh
    if (parsed.view === "success") {
      localStorage.removeItem(getStorageKey(locale));
      return initialDevisState;
    }
    return {
      ...initialDevisState,
      ...parsed,
      zonePhotos: initialDevisState.zonePhotos,
      isSubmitting: false,
      error: null,
    };
  } catch {
    return initialDevisState;
  }
}

export function DevisBlueprint({ BlueprintComponent }: DevisBlueprintProps) {
  const locale = useLocale();
  const t = useTranslations("devis.panel_recap");
  const [state, dispatch] = useReducer(
    devisReducer,
    initialDevisState,
    () => loadSavedState(locale),
  );
  const [isMobile, setIsMobile] = useState(false);

  // Persist state to localStorage (locale-specific)
  useEffect(() => {
    const { zonePhotos, isSubmitting, error, ...toSave } = state;
    localStorage.setItem(getStorageKey(locale), JSON.stringify(toSave));
  }, [state, locale]);

  // Track viewport width
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      const formData = new FormData();

      // State sans les photos (pas serialisable)
      const { zonePhotos, ...stateWithoutPhotos } = state;
      formData.append("data", JSON.stringify(stateWithoutPhotos));
      formData.append("locale", locale);

      // Ajouter les photos avec le format zone__filename
      for (const [zoneId, files] of Object.entries(zonePhotos)) {
        for (const file of files) {
          formData.append(`photo_${zoneId}`, file, file.name);
        }
      }

      const res = await fetch("/api/devis", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(t("error_server"));

      const result = await res.json();
      if (result.magicplanProjectId) {
        dispatch({ type: "SET_MAGICPLAN_PROJECT", projectId: result.magicplanProjectId });
      }
      dispatch({ type: "SET_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error:
          err instanceof Error
            ? err.message
            : t("error_generic"),
      });
    }
  }, [state, locale, t]);

  const totalWorks = countTotalWorks(state);

  // --- Success view ---

  if (state.view === "success") {
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ paddingTop: 64 }}>
        <StepSuccessOverlay
          dispatch={dispatch}
          magicplanProjectId={state.magicplanProjectId}
          clientEmail={state.contact.email}
          clientName={`${state.contact.firstName} ${state.contact.lastName}`.trim()}
        />
      </div>
    );
  }

  // --- Recap view ---

  if (state.view === "recap") {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ paddingTop: 64 }}>
        <div data-lenis-prevent className="relative w-full max-w-2xl max-h-[85dvh] mx-4 overflow-y-auto overscroll-contain rounded-2xl shadow-2xl border border-white/10 [-webkit-overflow-scrolling:touch]">
          <PanelRecap state={state} dispatch={dispatch} onSubmit={handleSubmit} />
        </div>
      </div>
    );
  }

  // --- Global / Zoomed view ---

  return (
    <div className="flex w-full bg-[#091428] overflow-hidden" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Plan area */}
      <div className="relative flex-1 h-full" style={{ touchAction: "manipulation" }}>
        <BlueprintComponent state={state} dispatch={dispatch} />
      </div>

      {/* Travaux panel (zoomed only) */}
      {state.view === "zoomed" && (
        <PanelTravaux state={state} dispatch={dispatch} isMobile={isMobile} />
      )}
    </div>
  );
}
