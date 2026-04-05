// @ts-nocheck
"use client";

import { Html } from "@react-three/drei";
import type { ZoneId } from "./devis-types";
import { ZONES_CONFIG } from "./devis-zones-config";

interface ZoneLabel3DProps {
  zoneId: ZoneId;
  isSelected: boolean;
  visible: boolean;
}

const ZONE_LABEL_POSITIONS: Record<ZoneId, [number, number, number]> = {
  cuisine: [-1.2, 2, 0.8],
  "salle-de-bain": [1.2, 2, 0.8],
  facade: [0, 2.8, -1.5],
  toit: [0, 4.5, 0],
  garage: [3, 1.8, 0],
  exterieur: [-3, 0.8, 0],
};

export function ZoneLabel3D({ zoneId, isSelected, visible }: ZoneLabel3DProps) {
  if (!visible) return null;
  const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
  if (!zone) return null;

  return (
    <Html
      position={ZONE_LABEL_POSITIONS[zoneId]}
      center
      distanceFactor={8}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          isSelected
            ? "bg-[#E50000] text-white shadow-lg shadow-red-500/30"
            : "bg-white/90 text-black shadow-md"
        }`}
      >
        {zone.label}
      </div>
    </Html>
  );
}
