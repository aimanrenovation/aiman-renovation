"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM, phaseProgress, COLORS } from "./constants";

interface FlooringProps {
  progressRef: React.RefObject<number>;
}

const PLANK = { width: 0.15, length: 0.9 };
const TILE = { size: 0.4 };

export function Flooring({ progressRef }: FlooringProps) {
  const plankRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tileRefs = useRef<(THREE.Mesh | null)[]>([]);

  const planks = useMemo(() => {
    const result: { position: [number, number, number]; delay: number }[] = [];
    const sx = -1 + ROOM.wallThickness, ex = 6 - ROOM.wallThickness;
    const sz = -4 + ROOM.wallThickness, ez = 4 - ROOM.wallThickness;
    const maxDist = Math.sqrt((ex - sx) ** 2 + (ez - sz) ** 2);
    for (let x = sx; x < ex; x += PLANK.width + 0.01) {
      for (let z = sz; z < ez; z += PLANK.length + 0.01) {
        const dist = Math.sqrt((x - sx) ** 2 + (z - sz) ** 2);
        result.push({ position: [x + PLANK.width / 2, 0.01, z + PLANK.length / 2], delay: dist / maxDist });
      }
    }
    return result;
  }, []);

  const tiles = useMemo(() => {
    const result: { position: [number, number, number]; delay: number }[] = [];
    const sx = -6 + ROOM.wallThickness, ex = -1 - ROOM.wallThickness;
    const sz = 1, ez = 4 - ROOM.wallThickness;
    const maxDist = Math.sqrt((ex - sx) ** 2 + (ez - sz) ** 2);
    for (let x = sx; x < ex; x += TILE.size + 0.02) {
      for (let z = sz; z < ez; z += TILE.size + 0.02) {
        const dist = Math.sqrt((x - sx) ** 2 + (z - sz) ** 2);
        result.push({ position: [x + TILE.size / 2, 0.01, z + TILE.size / 2], delay: dist / maxDist });
      }
    }
    return result;
  }, []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const fp = phaseProgress(p, "FLOORING");

    plankRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (fp <= 0) { mesh.visible = false; return; }
      const t = Math.max(0, Math.min(1, (fp - planks[i].delay * 0.7) / 0.3));
      mesh.visible = t > 0;
      if (t > 0) mesh.scale.y = t;
    });

    tileRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (fp <= 0) { mesh.visible = false; return; }
      const t = Math.max(0, Math.min(1, (fp - tiles[i].delay * 0.7) / 0.3));
      mesh.visible = t > 0;
      if (t > 0) { mesh.scale.x = t; mesh.scale.z = t; }
    });
  });

  return (
    <group>
      {planks.map((plank, i) => (
        <mesh
          key={`p${i}`}
          ref={(el) => { plankRefs.current[i] = el; }}
          position={plank.position}
          visible={false}
        >
          <boxGeometry args={[PLANK.width, 0.02, PLANK.length]} />
          <meshStandardMaterial color={COLORS.wood} roughness={0.7} />
        </mesh>
      ))}
      {tiles.map((tile, i) => (
        <mesh
          key={`t${i}`}
          ref={(el) => { tileRefs.current[i] = el; }}
          position={tile.position}
          visible={false}
        >
          <boxGeometry args={[TILE.size, 0.01, TILE.size]} />
          <meshStandardMaterial color={COLORS.tile} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
