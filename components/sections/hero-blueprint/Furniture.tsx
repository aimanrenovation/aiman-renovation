"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { phaseProgress, COLORS } from "./constants";

interface FurnitureProps {
  progressRef: React.RefObject<number>;
}

const ITEMS = [
  { type: "box" as const, pos: [3,0.35,1], size: [2.2,0.7,0.9], color: "#D4CBC2", delay: 0 },
  { type: "box" as const, pos: [3,0.05,1], size: [2.4,0.1,1.0], color: "#5C4033", delay: 0.05 },
  { type: "box" as const, pos: [1,0.38,-1.5], size: [1.6,0.04,0.9], color: COLORS.wood, delay: 0.15 },
  { type: "box" as const, pos: [0.2,0.25,-1.5], size: [0.4,0.5,0.4], color: "#D4CBC2", delay: 0.25 },
  { type: "box" as const, pos: [1.8,0.25,-1.5], size: [0.4,0.5,0.4], color: "#D4CBC2", delay: 0.3 },
  { type: "box" as const, pos: [1,0.25,-2.0], size: [0.4,0.5,0.4], color: "#D4CBC2", delay: 0.35 },
  { type: "box" as const, pos: [1,0.25,-1.0], size: [0.4,0.5,0.4], color: "#D4CBC2", delay: 0.4 },
  { type: "box" as const, pos: [-3.5,0.45,2.8], size: [2.5,0.9,0.6], color: "#F0EDE8", delay: 0.5 },
  { type: "box" as const, pos: [-3,0.55,1.8], size: [1.5,1.1,0.6], color: "#E0E0E0", delay: 0.55 },
  { type: "cyl" as const, pos: [1,2.4,-1.5], size: [0.3,0.05,0.3], color: "#222", delay: 0.7 },
  { type: "cyl" as const, pos: [-3,2.4,2.5], size: [0.2,0.05,0.2], color: "#222", delay: 0.75 },
];

export function Furniture({ progressRef }: FurnitureProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const fp = phaseProgress(p, "FURNITURE");

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (fp <= 0) { mesh.visible = false; return; }
      const t = Math.max(0, Math.min(1, (fp - ITEMS[i].delay) / 0.3));
      mesh.visible = t > 0;
      if (t > 0) {
        const s = t < 1 ? t * (2 - t) : 1;
        mesh.scale.setScalar(s);
      }
    });

    if (light1Ref.current) light1Ref.current.intensity = fp * 2;
    if (light2Ref.current) light2Ref.current.intensity = fp * 1.5;
  });

  return (
    <group>
      {ITEMS.map((item, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={item.pos as [number, number, number]}
          visible={false}
        >
          {item.type === "box" ? (
            <boxGeometry args={item.size as [number, number, number]} />
          ) : (
            <cylinderGeometry args={[item.size[0], item.size[2], item.size[1], 16]} />
          )}
          <meshStandardMaterial color={item.color} roughness={0.6} />
        </mesh>
      ))}
      <pointLight ref={light1Ref} position={[1,2.3,-1.5]} color="#FFF0D4" intensity={0} distance={8} />
      <pointLight ref={light2Ref} position={[-3,2.3,2.5]} color="#FFF0D4" intensity={0} distance={6} />
    </group>
  );
}
