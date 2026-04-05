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
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
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
      <div className="relative h-screen w-full bg-[#0A0A0A]">
        <BlueprintComponent state={state} dispatch={dispatch} />
        <StepSuccessOverlay dispatch={dispatch} />
      </div>
    );
  }

  // ─── Recap view ─────────────────────────────────────────────────────

  if (state.view === "recap") {
    return (
      <div className="relative h-screen w-full bg-[#0A0A0A]">
        <BlueprintComponent state={state} dispatch={dispatch} />
        <PanelRecap state={state} dispatch={dispatch} onSubmit={handleSubmit} />
      </div>
    );
  }

  // ─── Global / Zoomed view ───────────────────────────────────────────

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A]">
      {/* Plan area */}
      <div className="relative flex-1">
        <BlueprintComponent state={state} dispatch={dispatch} />

        {/* Instruction overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-6">
          <div className="rounded-full bg-black/60 backdrop-blur-sm px-5 py-2 text-sm text-white/70">
            {state.view === "zoomed"
              ? "Selectionnez les travaux souhaites"
              : "Cliquez sur une piece pour commencer"}
          </div>
        </div>

        {/* Submit button (global view, when works selected) */}
        {state.view === "global" && totalWorks > 0 && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6">
            <button
              onClick={() => dispatch({ type: "SHOW_RECAP" })}
              className="rounded-2xl bg-[#E50000] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 hover:shadow-red-500/30 active:scale-95"
            >
              Envoyer mon devis ({totalWorks} travaux)
            </button>
          </div>
        )}
      </div>

      {/* Travaux panel (zoomed only) */}
      {state.view === "zoomed" && (
        <PanelTravaux state={state} dispatch={dispatch} isMobile={isMobile} />
      )}
    </div>
  );
}
