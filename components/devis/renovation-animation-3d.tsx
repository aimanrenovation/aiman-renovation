// @ts-nocheck
"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import type { DevisFormState, ZoneId } from "./devis-types";
import { getZoneConfig } from "./devis-zones-config";

interface RenovationAnimation3DProps {
  state: DevisFormState;
}

function OptionMesh({
  zoneId,
  optionId,
  isActive,
  index,
}: {
  zoneId: ZoneId;
  optionId: string;
  isActive: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: isActive ? 1 : 0,
        y: isActive ? 1 : 0,
        z: isActive ? 1 : 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
      gsap.to(meshRef.current.material as THREE.MeshStandardMaterial, {
        opacity: isActive ? 0.7 : 0,
        duration: 0.4,
      });
    }
  }, [isActive]);

  const zonePositions: Record<ZoneId, [number, number, number]> = {
    cuisine: [-1.2, 0.75, 0.8],
    "salle-de-bain": [1.2, 0.75, 0.8],
    facade: [0, 1.5, -1.3],
    toit: [0, 3.5, 0],
    garage: [3, 0.6, 0],
    exterieur: [-3, 0.2, 0],
  };

  const basePos = zonePositions[zoneId];
  const offset = index * 0.4;

  return (
    <mesh
      ref={meshRef}
      position={[basePos[0] + offset * 0.3, basePos[1] + 0.2 + offset * 0.15, basePos[2] + 0.3]}
      scale={[0, 0, 0]}
    >
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial
        color="#E50000"
        transparent
        opacity={0}
        emissive="#E50000"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export function RenovationAnimation3D({ state }: RenovationAnimation3DProps) {
  if (state.currentStep !== 2) return null;

  return (
    <>
      {state.selectedZones.map((zoneId) => {
        const zoneConfig = getZoneConfig(zoneId);
        if (!zoneConfig) return null;

        return zoneConfig.renovationOptions.map((option, index) => (
          <OptionMesh
            key={`${zoneId}-${option.id}`}
            zoneId={zoneId}
            optionId={option.id}
            isActive={state.renovationOptions[zoneId].includes(option.id)}
            index={index}
          />
        ));
      })}
    </>
  );
}
