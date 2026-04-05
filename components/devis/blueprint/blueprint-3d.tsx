"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

import { BP } from "./blueprint-colors";
import { EXTERIOR_WALLS, INTERIOR_WALLS, ROOM_LABELS } from "./blueprint-layout";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

// ─── SVG → World conversion ────────────────────────────────────────
const SVG_TO_WORLD = 0.02;
const SVG_W = 1000;
const SVG_H = 720;
const OFFSET_X = (SVG_W / 2) * SVG_TO_WORLD;
const OFFSET_Z = (SVG_H / 2) * SVG_TO_WORLD;

function svgToWorld(x: number, y: number): [number, number] {
  return [x * SVG_TO_WORLD - OFFSET_X, y * SVG_TO_WORLD - OFFSET_Z];
}

// ─── Global camera defaults ────────────────────────────────────────
const GLOBAL_CAM_POS = new THREE.Vector3(0, 16, 0.01);
const GLOBAL_CAM_TARGET = new THREE.Vector3(0, 0, 0);

// ─── Props ─────────────────────────────────────────────────────────
interface Blueprint3DProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

// ─── Wall meshes ───────────────────────────────────────────────────
function Walls() {
  const wallColor = new THREE.Color(BP.wallFill);
  const emissive = new THREE.Color(BP.wall).multiplyScalar(0.15);

  return (
    <group>
      {EXTERIOR_WALLS.map((w, i) => {
        const [wx, wz] = svgToWorld(w.x + w.w / 2, w.y + w.h / 2);
        const sx = w.w * SVG_TO_WORLD;
        const sz = w.h * SVG_TO_WORLD;
        const height = 0.5;
        return (
          <mesh key={`ext-${i}`} position={[wx, height / 2, wz]}>
            <boxGeometry args={[sx, height, sz]} />
            <meshStandardMaterial color={wallColor} emissive={emissive} />
          </mesh>
        );
      })}
      {INTERIOR_WALLS.map((w, i) => {
        const [wx, wz] = svgToWorld(w.x + w.w / 2, w.y + w.h / 2);
        const sx = w.w * SVG_TO_WORLD;
        const sz = w.h * SVG_TO_WORLD;
        const height = 0.35;
        return (
          <mesh key={`int-${i}`} position={[wx, height / 2, wz]}>
            <boxGeometry args={[sx, height, sz]} />
            <meshStandardMaterial color={wallColor} emissive={emissive} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Floor plane ───────────────────────────────────────────────────
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[SVG_W * SVG_TO_WORLD, SVG_H * SVG_TO_WORLD]} />
      <meshStandardMaterial color={BP.bg} />
    </mesh>
  );
}

// ─── Zone overlay (clickable) ──────────────────────────────────────
function ZoneOverlay({
  zoneId,
  bounds,
  hasWorks,
  isGlobal,
  dispatch,
}: {
  zoneId: ZoneId;
  bounds: { x: number; y: number; w: number; h: number };
  hasWorks: boolean;
  isGlobal: boolean;
  dispatch: React.Dispatch<DevisAction>;
}) {
  const [cx, cz] = svgToWorld(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
  const sx = bounds.w * SVG_TO_WORLD;
  const sz = bounds.h * SVG_TO_WORLD;

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as unknown as { stopPropagation: () => void }).stopPropagation();
      if (isGlobal) {
        dispatch({ type: "ZOOM_ZONE", zone: zoneId });
      }
    },
    [isGlobal, zoneId, dispatch],
  );

  return (
    <mesh
      position={[cx, 0.005, cz]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[sx, sz]} />
      <meshBasicMaterial
        color={hasWorks ? BP.red : BP.wall}
        transparent
        opacity={hasWorks ? 0.2 : 0.05}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Room labels (Text as sprites) ────────────────────────────────
function RoomLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const [wx, wz] = svgToWorld(x, y);
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = BP.label;
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 32);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text]);

  return (
    <sprite position={[wx, 0.3, wz]} scale={[1.5, 0.4, 1]}>
      <spriteMaterial map={canvasTexture} transparent depthWrite={false} />
    </sprite>
  );
}

// ─── Camera controller with GSAP animation ────────────────────────
function CameraController({
  state,
}: {
  state: DevisState;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const posRef = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Animate on state change
  useMemo(() => {
    if (!initialized.current) {
      camera.position.copy(GLOBAL_CAM_POS);
      camera.lookAt(GLOBAL_CAM_TARGET);
      posRef.current.copy(GLOBAL_CAM_POS);
      targetRef.current.copy(GLOBAL_CAM_TARGET);
      initialized.current = true;
    }

    if (state.view === "zoomed" && state.activeZone) {
      const zone = ZONES_CONFIG.find((z) => z.id === state.activeZone);
      if (zone) {
        const [px, py, pz] = zone.camera3D.position;
        const [tx, ty, tz] = zone.camera3D.target;
        gsap.to(posRef.current, {
          x: px,
          y: py,
          z: pz,
          duration: 1.2,
          ease: "power2.inOut",
        });
        gsap.to(targetRef.current, {
          x: tx,
          y: ty,
          z: tz,
          duration: 1.2,
          ease: "power2.inOut",
        });
      }
    } else if (state.view === "global" || state.view === "recap") {
      gsap.to(posRef.current, {
        x: GLOBAL_CAM_POS.x,
        y: GLOBAL_CAM_POS.y,
        z: GLOBAL_CAM_POS.z,
        duration: 1.2,
        ease: "power2.inOut",
      });
      gsap.to(targetRef.current, {
        x: GLOBAL_CAM_TARGET.x,
        y: GLOBAL_CAM_TARGET.y,
        z: GLOBAL_CAM_TARGET.z,
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.view, state.activeZone]);

  useFrame(() => {
    camera.position.lerp(posRef.current, 0.1);
    (camera as THREE.PerspectiveCamera).lookAt(targetRef.current);
  });

  return null;
}

// ─── Main component ────────────────────────────────────────────────
export function Blueprint3D({ state, dispatch }: Blueprint3DProps) {
  const isGlobal = state.view === "global";

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        style={{ background: BP.bg }}
      >
        <PerspectiveCamera makeDefault position={[0, 16, 0.01]} fov={50} />
        <CameraController state={state} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 6, -3]} intensity={0.3} />

        {/* Scene */}
        <Floor />
        <Walls />

        {/* Zone overlays */}
        {ZONES_CONFIG.map((zone) => {
          const hasWorks =
            state.selectedWorks[zone.id] &&
            state.selectedWorks[zone.id].length > 0;
          return (
            <ZoneOverlay
              key={zone.id}
              zoneId={zone.id}
              bounds={zone.bounds}
              hasWorks={hasWorks}
              isGlobal={isGlobal}
              dispatch={dispatch}
            />
          );
        })}

        {/* Room labels */}
        {ROOM_LABELS.map((label) => (
          <RoomLabel
            key={label.zoneId}
            x={label.x}
            y={label.y}
            text={label.text}
          />
        ))}
      </Canvas>
    </div>
  );
}
