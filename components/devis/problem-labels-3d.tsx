// @ts-nocheck
"use client";

import { Html } from "@react-three/drei";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { DevisFormState, DevisAction } from "./devis-types";
import { getZoneConfig } from "./devis-zones-config";

interface ProblemLabels3DProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function ProblemLabels3D({ state, dispatch }: ProblemLabels3DProps) {
  if (state.currentStep !== 1 || !state.activeZone) return null;

  const zoneConfig = getZoneConfig(state.activeZone);
  if (!zoneConfig) return null;

  return (
    <>
      {zoneConfig.problems.map((problem) => {
        const isSelected = state.problems[state.activeZone!].includes(problem.id);
        return (
          <Html
            key={problem.id}
            position={problem.position3D}
            center
            distanceFactor={6}
          >
            <button
              onClick={() =>
                dispatch({
                  type: "TOGGLE_PROBLEM",
                  zone: state.activeZone!,
                  problemId: problem.id,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer hover:scale-110 ${
                isSelected
                  ? "bg-[#E50000] text-white shadow-lg shadow-red-500/40"
                  : "bg-white/95 text-gray-800 shadow-md hover:bg-white"
              }`}
            >
              {isSelected ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              )}
              {problem.label}
            </button>
          </Html>
        );
      })}
    </>
  );
}
