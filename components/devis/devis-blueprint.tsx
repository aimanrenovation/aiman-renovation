"use client";

import { useReducer, useState, useEffect, useCallback } from "react";
import type { DevisState, DevisAction } from "./devis-types";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { PanelTravaux } from "./panels/panel-travaux";
import { PanelRecap } from "./panels/panel-recap";
import { StepSuccessOverlay } from "./steps/step-success";

// ─── Props ──────────────────────────────────────────────────────────────────

interface DevisBlueprintProps {
  BlueprintComponent: React.ComponentType<{
    state: DevisState;
    dispatch: React.Dispatch<DevisAction>;
  }>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function countTotalWorks(state: DevisState): number {
  return Object.values(state.selectedWorks).reduce(
    (sum, works) => sum + works.length,
    0,
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function DevisBlueprint({ BlueprintComponent }: DevisBlueprintProps) {
  const [state, dispatch] = useReducer(devisReducer, initialDevisState);
  const [isMobile, setIsMobile] = useState(false);

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

      // State sans les photos (pas sérialisable)
      const { zonePhotos, ...stateWithoutPhotos } = state;
      formData.append("data", JSON.stringify(stateWithoutPhotos));

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
      if (!res.ok) throw new Error("Erreur serveur");
      dispatch({ type: "SET_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue. Veuillez reessayer.",
      });
    }
  }, [state]);

  const totalWorks = countTotalWorks(state);

  // ─── Success view ───────────────────────────────────────────────────

  if (state.view === "success") {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#091428]">
        <BlueprintComponent state={state} dispatch={dispatch} />
        <StepSuccessOverlay dispatch={dispatch} />
      </div>
    );
  }

  // ─── Recap view ─────────────────────────────────────────────────────

  if (state.view === "recap") {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#091428]">
        <BlueprintComponent state={state} dispatch={dispatch} />
        <PanelRecap state={state} dispatch={dispatch} onSubmit={handleSubmit} />
      </div>
    );
  }

  // ─── Global / Zoomed view ───────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#091428] overflow-hidden">
      {/* Plan area — hauteur fixe, pas de scroll */}
      <div className="relative flex-1 h-full">
        <BlueprintComponent state={state} dispatch={dispatch} />
      </div>

      {/* Travaux panel (zoomed only) */}
      {state.view === "zoomed" && (
        <PanelTravaux state={state} dispatch={dispatch} isMobile={isMobile} />
      )}
    </div>
  );
}
