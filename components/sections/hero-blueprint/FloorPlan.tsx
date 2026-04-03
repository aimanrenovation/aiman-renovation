"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { WALL_SEGMENTS, ROOM, COLORS, phaseProgress } from "./constants";

interface FloorPlanProps {
  progressRef: React.RefObject<number>;
}

export function FloorPlan({ progressRef }: FloorPlanProps) {
  const groupRef = useRef<THREE.Group>(null);

  const wallLines = useMemo(() => {
    return WALL_SEGMENTS.map(([x1, z1, x2, z2], i) => ({
      key: i,
      points: [new THREE.Vector3(x1, 0.01, z1), new THREE.Vector3(x2, 0.01, z2)] as [THREE.Vector3, THREE.Vector3],
    }));
  }, []);

  // Mutate opacity each frame — no re-renders
  useFrame(() => {
    if (!groupRef.current) return;
    const p = progressRef.current ?? 0;
    const opacity = 1 - phaseProgress(p, "EXTRUSION");
    groupRef.current.visible = opacity > 0;
    // Update material opacity on all line children
    groupRef.current.traverse((child) => {
      if ((child as THREE.Line).material) {
        const mat = (child as THREE.Line).material as THREE.Material;
        if ('opacity' in mat) {
          (mat as THREE.LineBasicMaterial).opacity = opacity;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {wallLines.map((line) => (
        <Line
          key={line.key}
          points={line.points}
          color={COLORS.blueprintLine}
          lineWidth={4}
          transparent
          opacity={1}
        />
      ))}
      {[
        { position: [0, 0.02, -5.5] as [number, number, number], text: `${ROOM.width}m` },
        { position: [-7.5, 0.02, 0] as [number, number, number], text: `${ROOM.depth}m` },
        { position: [-3, 0.02, 2.8] as [number, number, number], text: "CUISINE" },
        { position: [2.5, 0.02, 0] as [number, number, number], text: "SÉJOUR / SAM" },
      ].map((label, i) => (
        <Text
          key={i}
          position={label.position}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.8}
          color={COLORS.blueprintLine}
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}
