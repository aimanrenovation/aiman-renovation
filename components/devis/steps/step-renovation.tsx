// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";
import { ZONES_CONFIG, getZoneConfig } from "../devis-zones-config";

interface StepRenovationProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepRenovationOverlay({ state, dispatch }: StepRenovationProps) {
  const activeZone = state.activeZone;
  const zoneConfig = activeZone ? getZoneConfig(activeZone) : null;
  const hasMultipleZones = state.selectedZones.length > 1;

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 gap-4">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Etape 3 / 6</p>
          <h2 className="text-2xl font-bold text-white">
            <Sparkles className="inline w-6 h-6 mr-2 text-[#E50000]" />
            Quel resultat souhaitez-vous ?
          </h2>
          <p className="text-gray-300 mt-2">Activez les options de renovation</p>
        </div>

        {/* Tabs zones */}
        {hasMultipleZones && (
          <div className="pointer-events-auto flex gap-2">
            {state.selectedZones.map((zoneId) => {
              const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
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
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Panneau options renovation */}
      {zoneConfig && activeZone && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 w-72 space-y-2">
            <h3 className="text-white font-semibold text-sm mb-3">
              Options — {zoneConfig.label}
            </h3>
            {zoneConfig.renovationOptions.map((option) => {
              const isSelected = state.renovationOptions[activeZone].includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_RENOVATION_OPTION",
                      zone: activeZone,
                      optionId: option.id,
                    })
                  }
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                    isSelected
                      ? "bg-[#E50000]/20 border border-[#E50000]/40"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-[#E50000]" : "border border-white/40"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
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
