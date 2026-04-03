"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FloorPlan } from "./FloorPlan";
import { Walls } from "./Walls";
import { Electrical } from "./Electrical";
import { Plumbing } from "./Plumbing";
import { Flooring } from "./Flooring";
import { Furniture } from "./Furniture";

// Camera keyframes
const CAM_TOP = new THREE.Vector3(0, 18, 0.01);
const CAM_PERSP = new THREE.Vector3(8, 12, 12);
const LOOK_AT = new THREE.Vector3(0, 0, 0);

function CameraController({ progressRef }: { progressRef: React.RefObject<number> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  // Set initial lookAt
  camera.lookAt(LOOK_AT);

  useFrame(() => {
    const p = progressRef.current ?? 0;

    if (p < 0.15) {
      target.current.copy(CAM_TOP);
    } else if (p < 0.25) {
      const t = (p - 0.15) / 0.10;
      target.current.copy(CAM_TOP).lerp(CAM_PERSP, t);
    } else {
      const orbitT = (p - 0.25) / 0.75;
      const angle = orbitT * Math.PI * 0.3;
      const radius = 16;
      const height = 12 - orbitT * 3;
      target.current.set(
        Math.sin(angle) * radius,
        height,
        Math.cos(angle) * radius
      );
    }

    camera.position.lerp(target.current, 0.08);
    camera.lookAt(LOOK_AT);
  });

  return null;
}

interface BlueprintSceneProps {
  progressRef: React.RefObject<number>;
}

export function BlueprintScene({ progressRef }: BlueprintSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 18, 0.01], fov: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#0A0A0A" }}
      dpr={[1, 1.5]}
    >
      <CameraController progressRef={progressRef} />

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0A0A0A" roughness={1} />
      </mesh>

      {/* All phase components read progressRef directly via useFrame */}
      <FloorPlan progressRef={progressRef} />
      <Walls progressRef={progressRef} />
      <Electrical progressRef={progressRef} />
      <Plumbing progressRef={progressRef} />
      <Flooring progressRef={progressRef} />
      <Furniture progressRef={progressRef} />
    </Canvas>
  );
}
