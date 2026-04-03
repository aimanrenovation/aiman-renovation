"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { phaseProgress, COLORS } from "./constants";

interface ElectricalProps {
  progressRef: React.RefObject<number>;
}

const WIRES = [
  { pts: [[-6,1.2,3.85],[-2,1.2,3.85],[2,1.2,3.85],[5.9,1.2,3.85]], color: COLORS.electricRed, isDrop: false },
  { pts: [[-6,1.0,3.85],[-2,1.0,3.85],[2,1.0,3.85],[5.9,1.0,3.85]], color: COLORS.electricBlue, isDrop: false },
  { pts: [[-2,1.2,3.85],[-2,0.4,3.85]], color: COLORS.electricRed, isDrop: true },
  { pts: [[2,1.2,3.85],[2,0.4,3.85]], color: COLORS.electricRed, isDrop: true },
  { pts: [[5,1.2,3.85],[5,0.4,3.85]], color: COLORS.electricBlue, isDrop: true },
  { pts: [[-1.1,1.2,2],[-1.1,0.9,2]], color: COLORS.electricRed, isDrop: true },
  { pts: [[-1.1,1.0,3],[-1.1,0.4,3]], color: COLORS.electricBlue, isDrop: true },
];

export function Electrical({ progressRef }: ElectricalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const geometries = useMemo(() => {
    return WIRES.map((wire) => {
      const curve = new THREE.CatmullRomCurve3(
        wire.pts.map(([x,y,z]) => new THREE.Vector3(x,y,z))
      );
      return new THREE.TubeGeometry(curve, 20, 0.025, 8, false);
    });
  }, []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const ep = phaseProgress(p, "ELECTRICAL");

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (ep <= 0) { mesh.visible = false; return; }
      const wire = WIRES[i];
      const frac = wire.isDrop ? Math.max(0, (ep - 0.5) * 2) : ep;
      mesh.visible = frac > 0;
      if (frac > 0 && mesh.geometry.index) {
        const total = mesh.geometry.index.count;
        mesh.geometry.setDrawRange(0, Math.floor(total * frac));
      }
    });
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geom, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          geometry={geom}
          visible={false}
        >
          <meshBasicMaterial color={WIRES[i].color} />
        </mesh>
      ))}
    </group>
  );
}
