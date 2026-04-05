// @ts-nocheck
"use client";

import { useReducer, useCallback } from "react";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { DevisScene } from "./devis-scene";
import { StepZoneSelectionOverlay } from "./steps/step-zone-selection";
import { StepProblemsOverlay } from "./steps/step-problems";
import { StepRenovationOverlay } from "./steps/step-renovation";
import { StepSurfaceBudgetOverlay } from "./steps/step-surface-budget";
import { StepPhotosContactOverlay } from "./steps/step-photos-contact";
import { StepRecapOverlay } from "./steps/step-recap";
import { StepSuccessOverlay } from "./steps/step-success";

async function submitDevis(state: typeof initialDevisState) {
  const res = await fetch("/api/devis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...state,
      photos: [],
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de l'envoi");
  }
}

export function DevisWizard3D() {
  const [state, dispatch] = useReducer(devisReducer, initialDevisState);

  const handleSubmit = useCallback(async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      await submitDevis(state);
      dispatch({ type: "SET_SUBMITTED" });
    } catch (err: any) {
      dispatch({
        type: "SET_ERROR",
        error: err.message || "Erreur lors de l'envoi. Veuillez reessayer.",
      });
    }
  }, [state]);

  if (state.isSubmitted) {
    return (
      <div className="relative w-full h-screen bg-[#0A0A0A]">
        <DevisScene state={state} dispatch={dispatch} />
        <StepSuccessOverlay dispatch={dispatch} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Scene 3D en arriere-plan */}
      <DevisScene state={state} dispatch={dispatch} />

      {/* Overlay UI selon l'etape */}
      {state.currentStep === 0 && (
        <StepZoneSelectionOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 1 && (
        <StepProblemsOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 2 && (
        <StepRenovationOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 3 && (
        <StepSurfaceBudgetOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 4 && (
        <StepPhotosContactOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 5 && (
        <StepRecapOverlay state={state} dispatch={dispatch} onSubmit={handleSubmit} />
      )}

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === state.currentStep
                ? "bg-[#E50000] scale-125"
                : i < state.currentStep
                ? "bg-[#E50000]/50"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
