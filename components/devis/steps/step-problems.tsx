// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";
import { ZONES_CONFIG, getZoneConfig } from "../devis-zones-config";

interface StepProblemsProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepProblemsOverlay({ state, dispatch }: StepProblemsProps) {
  const activeZone = state.activeZone;
  const zoneConfig = activeZone ? getZoneConfig(activeZone) : null;
  const hasMultipleZones = state.selectedZones.length > 1;

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 gap-4">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Etape 2 / 6</p>
          <h2 className="text-2xl font-bold text-white">Quel est l&apos;etat actuel ?</h2>
          <p className="text-gray-300 mt-2">
            Cliquez sur les problemes visibles dans votre {zoneConfig?.label.toLowerCase()}
          </p>
        </div>

        {/* Tabs navigation zones */}
        {hasMultipleZones && (
          <div className="pointer-events-auto flex gap-2">
            {state.selectedZones.map((zoneId) => {
              const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
              const problemCount = state.problems[zoneId].length;
              return (
                <button
                  key={zoneId}
                  onClick={() => dispatch({ type: "SET_ACTIVE_ZONE", zone: zoneId })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeZone === zoneId
                      ? "bg-[#E50000] text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {zone?.label}
                  {problemCount > 0 && (
                    <span className="ml-1 bg-white/30 rounded-full px-1.5 text-xs">
                      {problemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Panneau lateral : liste des problemes */}
      {zoneConfig && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 w-64 space-y-2">
            <h3 className="text-white font-semibold text-sm mb-3">
              Problemes — {zoneConfig.label}
            </h3>
            {zoneConfig.problems.map((problem) => {
              const isSelected = state.problems[activeZone!].includes(problem.id);
              return (
                <button
                  key={problem.id}
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_PROBLEM",
                      zone: activeZone!,
                      problemId: problem.id,
                    })
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isSelected
                      ? "bg-[#E50000]/20 text-[#E50000] border border-[#E50000]/40"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 flex-shrink-0" />
                  )}
                  {problem.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation bas */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="pointer-events-auto border-white/30 text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour
        </Button>
        <Button
          size="lg"
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="pointer-events-auto bg-[#E50000] hover:bg-red-700 text-white text-lg px-10 py-6 rounded-xl shadow-2xl"
        >
          Continuer <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
