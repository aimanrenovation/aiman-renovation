"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WALL_SEGMENTS, ROOM, phaseProgress } from "./constants";
import { concreteMaterial, paintShaderMaterial } from "./materials";

interface WallsProps {
  progressRef: React.RefObject<number>;
}

export function Walls({ progressRef }: WallsProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const wallData = useMemo(() => {
    return WALL_SEGMENTS.map(([x1, z1, x2, z2]) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      return {
        cx: (x1 + x2) / 2,
        cz: (z1 + z2) / 2,
        length,
        rotationY: angle,
      };
    });
  }, []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const ext = phaseProgress(p, "EXTRUSION");
    const paint = phaseProgress(p, "PAINT");

    if (paint > 0) {
      paintShaderMaterial.uniforms.paintProgress.value = paint;
    }

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (ext <= 0) { mesh.visible = false; return; }
      mesh.visible = true;
      const h = ROOM.wallHeight * ext;
      mesh.position.y = h / 2;
      mesh.scale.y = h;
      mesh.material = paint > 0 ? paintShaderMaterial : concreteMaterial;
    });
  });

  return (
    <group>
      {wallData.map((wall, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={[wall.cx, 0, wall.cz]}
          rotation={[0, wall.rotationY, 0]}
          scale={[ROOM.wallThickness, 0, wall.length]}
          visible={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial />
        </mesh>
      ))}
    </group>
  );
}
