"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { phaseProgress } from "./constants";
import { copperMaterial } from "./materials";

interface PlumbingProps {
  progressRef: React.RefObject<number>;
}

const PIPES = [
  { points: [[-6,0.3,2],[-4,0.3,2],[-3,0.3,2.5]], radius: 0.03 },
  { points: [[-6,0.15,2],[-4,0.15,2],[-3,0.15,2.5]], radius: 0.03 },
  { points: [[-3,0.05,2.5],[-4,0.05,2.5],[-6,0.05,2.5]], radius: 0.05 },
  { points: [[-3,0.05,2.5],[-3,0.9,2.5]], radius: 0.03 },
];

export function Plumbing({ progressRef }: PlumbingProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const geometries = useMemo(() => {
    return PIPES.map((pipe) => {
      const curve = new THREE.CatmullRomCurve3(
        pipe.points.map(([x,y,z]) => new THREE.Vector3(x,y,z))
      );
      return new THREE.TubeGeometry(curve, 16, pipe.radius, 8, false);
    });
  }, []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const pp = phaseProgress(p, "PLUMBING");

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (pp <= 0) { mesh.visible = false; return; }
      const stagger = i / PIPES.length;
      const frac = Math.max(0, (pp - stagger * 0.3) / (1 - stagger * 0.3));
      mesh.visible = frac > 0;
      if (frac > 0 && mesh.geometry.index) {
        mesh.geometry.setDrawRange(0, Math.floor(mesh.geometry.index.count * frac));
      }
    });
  });

  return (
    <group>
      {geometries.map((geom, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          geometry={geom}
          material={copperMaterial}
          visible={false}
        />
      ))}
    </group>
  );
}
