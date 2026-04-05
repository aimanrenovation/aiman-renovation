// @ts-nocheck
"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import type { ZoneId, DevisFormState, DevisAction } from "./devis-types";
import { getZoneConfig } from "./devis-zones-config";
import { House3D } from "./house-3d";

interface DevisSceneProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

function CameraController({
  targetPosition,
  targetLookAt,
}: {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    gsap.to(camera.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: 1.2,
      ease: "power2.inOut",
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: targetLookAt[0],
        y: targetLookAt[1],
        z: targetLookAt[2],
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    }
  }, [targetPosition, targetLookAt, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3}
      maxDistance={15}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
}

function SceneContent({ state, dispatch }: DevisSceneProps) {
  const getCameraConfig = () => {
    const defaultPos: [number, number, number] = [0, 5, 10];
    const defaultTarget: [number, number, number] = [0, 1, 0];

    if (state.activeZone && state.currentStep > 0) {
      const zoneConfig = getZoneConfig(state.activeZone);
      if (zoneConfig) {
        return {
          position: zoneConfig.cameraPosition,
          target: zoneConfig.cameraTarget,
        };
      }
    }

    return { position: defaultPos, target: defaultTarget };
  };

  const { position: cameraPos, target: cameraTarget } = getCameraConfig();

  const renovationProgress: Record<ZoneId, number> = {
    cuisine: 0,
    "salle-de-bain": 0,
    facade: 0,
    toit: 0,
    garage: 0,
    exterieur: 0,
  };

  if (state.currentStep >= 3) {
    for (const zone of state.selectedZones) {
      const zoneConfig = getZoneConfig(zone);
      if (zoneConfig) {
        const totalOptions = zoneConfig.renovationOptions.length;
        const selectedOptions = state.renovationOptions[zone].length;
        renovationProgress[zone] = totalOptions > 0 ? selectedOptions / totalOptions : 0;
      }
    }
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPos} fov={50} />
      <CameraController targetPosition={cameraPos} targetLookAt={cameraTarget} />
      <Environment preset="city" />

      <House3D
        selectedZones={state.selectedZones}
        activeZone={state.activeZone}
        onZoneClick={(zone) => {
          if (state.currentStep === 0) {
            dispatch({ type: "TOGGLE_ZONE", zone });
          } else {
            dispatch({ type: "SET_ACTIVE_ZONE", zone });
          }
        }}
        onZoneHover={() => {}}
        showDamage={state.currentStep <= 2}
        renovationProgress={renovationProgress}
      />
    </>
  );
}

export function DevisScene({ state, dispatch }: DevisSceneProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows>
        <Suspense fallback={null}>
          <SceneContent state={state} dispatch={dispatch} />
        </Suspense>
      </Canvas>
    </div>
  );
}
