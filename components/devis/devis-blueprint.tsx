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
    <div className="flex min-h-[calc(100vh-64px)] w-full bg-[#091428]">
      {/* Plan area — instructions et bouton gérés dans BlueprintComponent */}
      <div className="relative flex-1 min-h-[500px]">
        <BlueprintComponent state={state} dispatch={dispatch} />
      </div>

      {/* Travaux panel (zoomed only) */}
      {state.view === "zoomed" && (
        <PanelTravaux state={state} dispatch={dispatch} isMobile={isMobile} />
      )}
    </div>
  );
}
