"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";
import { ZONES_CONFIG } from "../devis-zones-config";

interface StepZoneSelectionProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepZoneSelectionOverlay({ state, dispatch }: StepZoneSelectionProps) {
  const selectedCount = state.selectedZones.length;

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      {/* Header instruction */}
      <div className="flex flex-col items-center pt-8 gap-4">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Etape 1 / 6</p>
          <h2 className="text-2xl font-bold text-white">Ou souhaitez-vous renover ?</h2>
          <p className="text-gray-300 mt-2">Cliquez sur les zones de la maison a renover</p>
        </div>
      </div>

      {/* Zones selectionnees */}
      {selectedCount > 0 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap px-4">
          {state.selectedZones.map((zoneId) => {
            const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
            return (
              <Badge
                key={zoneId}
                variant="default"
                className="pointer-events-auto bg-[#E50000] text-white px-3 py-1.5 text-sm cursor-pointer hover:bg-red-700"
                onClick={() => dispatch({ type: "TOGGLE_ZONE", zone: zoneId })}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {zone?.label}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Bouton suivant */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <Button
          size="lg"
          disabled={selectedCount === 0}
          onClick={() => {
            dispatch({ type: "SET_ACTIVE_ZONE", zone: state.selectedZones[0] });
            dispatch({ type: "NEXT_STEP" });
          }}
          className="pointer-events-auto bg-[#E50000] hover:bg-red-700 text-white text-lg px-10 py-6 rounded-xl shadow-2xl disabled:opacity-30"
        >
          Continuer ({selectedCount} zone{selectedCount > 1 ? "s" : ""})
        </Button>
      </div>
    </div>
  );
}
