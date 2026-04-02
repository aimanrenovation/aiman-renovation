'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/** Stagger helper: remaps progress into a sub-range [start, end] clamped 0-1 */
function stagger(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/** Spark / flicker group that pulses in ruined state */
function SparkEffect({ position, progress }: { position: [number, number, number]; progress: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const flicker = Math.sin(t * 12) * 0.5 + Math.sin(t * 19) * 0.3 + Math.sin(t * 31) * 0.2;
    const intensity = Math.max(0, flicker) * (1 - progress);
    ref.current.visible = intensity > 0.1;
    ref.current.scale.setScalar(0.5 + intensity * 0.8);
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6600"
          emissiveIntensity={3}
          transparent
          opacity={lerp(0.9, 0, progress)}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.12, 0.01, 0.01]} />
        <meshStandardMaterial
          color="#ffee00"
          emissive="#ffaa00"
          emissiveIntensity={4}
          transparent
          opacity={lerp(0.7, 0, progress)}
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.09, 0.01, 0.01]} />
        <meshStandardMaterial
          color="#ffee00"
          emissive="#ffaa00"
          emissiveIntensity={4}
          transparent
          opacity={lerp(0.6, 0, progress)}
        />
      </mesh>
    </group>
  );
}

export default function ElectricityScene({ progress }: SceneProps) {
  const panelDoorRef = useRef<THREE.Mesh>(null);
  const bulbRef = useRef<THREE.Mesh>(null);
  const wiresGroupRef = useRef<THREE.Group>(null);

  // Staggered sub-progresses
  const pPanel = stagger(progress, 0.0, 0.3);
  const pWires = stagger(progress, 0.1, 0.5);
  const pConduit = stagger(progress, 0.3, 0.6);
  const pOutlets = stagger(progress, 0.4, 0.7);
  const pSwitches = stagger(progress, 0.5, 0.75);
  const pLight = stagger(progress, 0.6, 0.85);
  const pFinish = stagger(progress, 0.8, 1.0);

  // Colors
  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, progress);
  const floorColor = lerpColor(RUIN.floor, RENOVATED.floor, progress);
  const panelBodyColor = lerpColor(RUIN.dirt, '#d0d0d0', pPanel);
  const panelDoorColor = lerpColor(RUIN.metal, '#e8e8e8', pPanel);
  const wireColor = lerpColor('#8B4513', '#2563eb', pWires);
  const conduitColor = lerpColor(RUIN.metal, '#cccccc', pConduit);
  const outletColor = lerpColor(RUIN.wall, '#f5f5f5', pOutlets);
  const switchColor = lerpColor(RUIN.wall, '#f5f5f5', pSwitches);

  // Animate panel door and bulb glow
  useFrame(({ clock }) => {
    if (panelDoorRef.current) {
      // Door rotates from open (ruined) to closed (renovated)
      const doorAngle = lerp(Math.PI * 0.55, 0, pPanel);
      panelDoorRef.current.rotation.y = doorAngle;
    }
    if (bulbRef.current) {
      const t = clock.getElapsedTime();
      const mat = bulbRef.current.material as THREE.MeshStandardMaterial;
      // Ruined: flickering dim, Renovated: steady bright
      const flicker = progress < 0.7 ? Math.sin(t * 8) * 0.3 + 0.3 : 1;
      mat.emissiveIntensity = lerp(0.2 * flicker, 2.5, pLight);
    }
  });

  // Wire paths: bezier-like positions for dangling wires
  const danglingWires = [
    { start: [-2.8, 2.0, -1.92] as const, mid: [-2.6, 0.5, -1.4] as const, end: [-2.8, 1.8, -1.97] as const },
    { start: [-2.4, 2.0, -1.92] as const, mid: [-2.2, 0.2, -1.3] as const, end: [-2.4, 1.6, -1.97] as const },
    { start: [-2.0, 2.0, -1.92] as const, mid: [-1.7, 0.8, -1.5] as const, end: [-2.0, 1.8, -1.97] as const },
    { start: [-2.8, 1.0, -1.92] as const, mid: [-2.5, -0.3, -1.2] as const, end: [-2.8, 0.8, -1.97] as const },
    { start: [-2.4, 1.0, -1.92] as const, mid: [-2.1, -0.5, -1.0] as const, end: [-2.4, 0.6, -1.97] as const },
  ];

  const wireSegments = 6;

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={lerp(0.15, 0.6, progress)} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={lerp(0.2, 0.8, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Back wall */}
      <mesh position={[0, 1, -2]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.95, 0.6, progress)} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={floorColor} roughness={lerp(0.9, 0.4, progress)} />
      </mesh>

      {/* Side wall (left) */}
      <mesh position={[-4, 1, 1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={lerpColor(RUIN.wall, RENOVATED.wall, progress * 0.9)} roughness={0.8} />
      </mesh>

      {/* ==================== ELECTRICAL PANEL ==================== */}
      <group position={[-2.8, 1.5, -1.9]}>
        {/* Panel body (recessed into wall) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 1.0, 0.12]} />
          <meshStandardMaterial
            color={panelBodyColor}
            roughness={lerp(0.9, 0.3, pPanel)}
            metalness={lerp(0.1, 0.6, pPanel)}
          />
        </mesh>

        {/* Panel interior back plate */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.6, 0.9, 0.02]} />
          <meshStandardMaterial color={lerpColor('#1a1510', '#aaaaaa', pPanel)} metalness={0.5} />
        </mesh>

        {/* Circuit breakers - two columns of small toggles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i < 6 ? -0.12 : 0.12;
          const row = (i % 6) * 0.12 - 0.3;
          const breakerOn = pPanel > 0.5 + i * 0.03;
          return (
            <group key={`breaker-${i}`} position={[col, row, 0.07]}>
              {/* Breaker body */}
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.09, 0.04]} />
                <meshStandardMaterial
                  color={lerpColor('#222', '#1a1a2e', pPanel)}
                  roughness={0.6}
                  metalness={0.3}
                />
              </mesh>
              {/* Toggle switch */}
              <mesh
                position={[0, breakerOn ? 0.015 : -0.015, 0.025]}
                castShadow
              >
                <boxGeometry args={[0.03, 0.04, 0.015]} />
                <meshStandardMaterial
                  color={breakerOn ? '#4488ff' : '#ff4444'}
                  emissive={breakerOn ? '#112244' : '#441111'}
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          );
        })}

        {/* Main breaker at top */}
        <mesh position={[0, 0.38, 0.07]} castShadow>
          <boxGeometry args={[0.25, 0.1, 0.05]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#222244', pPanel)}
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>

        {/* Panel door - hinges on left side */}
        <group position={[-0.35, 0, 0.06]}>
          <mesh
            ref={panelDoorRef}
            position={[0.35, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.7, 1.02, 0.03]} />
            <meshStandardMaterial
              color={panelDoorColor}
              roughness={lerp(0.85, 0.25, pPanel)}
              metalness={lerp(0.2, 0.7, pPanel)}
            />
          </mesh>
        </group>

        {/* Door handle */}
        <mesh position={[0.25, 0, lerp(0.12, 0.09, pPanel)]} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.02]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Dust / grime overlay in ruined state */}
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[0.72, 1.02, 0.005]} />
          <meshStandardMaterial
            color={RUIN.dirt}
            transparent
            opacity={lerp(0.4, 0, pPanel)}
            roughness={1}
          />
        </mesh>
      </group>

      {/* ==================== DANGLING / CONCEALED WIRES ==================== */}
      <group ref={wiresGroupRef}>
        {danglingWires.map((wire, wi) => {
          const segments: React.ReactNode[] = [];
          for (let s = 0; s < wireSegments; s++) {
            const t1 = s / wireSegments;
            const t2 = (s + 1) / wireSegments;

            // Quadratic bezier interpolation
            const pos1 = [
              lerp(
                (1 - t1) * (1 - t1) * wire.start[0] + 2 * (1 - t1) * t1 * wire.mid[0] + t1 * t1 * wire.end[0],
                wire.end[0],
                pWires
              ),
              lerp(
                (1 - t1) * (1 - t1) * wire.start[1] + 2 * (1 - t1) * t1 * wire.mid[1] + t1 * t1 * wire.end[1],
                wire.end[1],
                pWires
              ),
              lerp(
                (1 - t1) * (1 - t1) * wire.start[2] + 2 * (1 - t1) * t1 * wire.mid[2] + t1 * t1 * wire.end[2],
                wire.end[2],
                pWires
              ),
            ] as [number, number, number];

            const pos2 = [
              lerp(
                (1 - t2) * (1 - t2) * wire.start[0] + 2 * (1 - t2) * t2 * wire.mid[0] + t2 * t2 * wire.end[0],
                wire.end[0],
                pWires
              ),
              lerp(
                (1 - t2) * (1 - t2) * wire.start[1] + 2 * (1 - t2) * t2 * wire.mid[1] + t2 * t2 * wire.end[1],
                wire.end[1],
                pWires
              ),
              lerp(
                (1 - t2) * (1 - t2) * wire.start[2] + 2 * (1 - t2) * t2 * wire.mid[2] + t2 * t2 * wire.end[2],
                wire.end[2],
                pWires
              ),
            ] as [number, number, number];

            const midPt: [number, number, number] = [
              (pos1[0] + pos2[0]) / 2,
              (pos1[1] + pos2[1]) / 2,
              (pos1[2] + pos2[2]) / 2,
            ];

            const dx = pos2[0] - pos1[0];
            const dy = pos2[1] - pos1[1];
            const dz = pos2[2] - pos1[2];
            const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Direction to rotation
            const rotX = Math.atan2(dz, dy);
            const rotZ = -Math.atan2(dx, Math.sqrt(dy * dy + dz * dz));

            const wireColors = ['#8B4513', '#cc3333', '#2244aa', '#228822', '#886600'];

            segments.push(
              <mesh
                key={`wire-${wi}-${s}`}
                position={midPt}
                rotation={[rotX, 0, rotZ]}
                castShadow
              >
                <cylinderGeometry args={[0.012, 0.012, len, 6]} />
                <meshStandardMaterial
                  color={lerpColor(wireColors[wi % wireColors.length], '#2563eb', pWires)}
                  roughness={lerp(0.8, 0.5, pWires)}
                />
              </mesh>
            );
          }

          return (
            <group key={`wire-group-${wi}`}>
              {segments}
              {/* Glowing wire tip in ruined state */}
              {pWires < 0.8 && (
                <SparkEffect
                  position={[
                    lerp(wire.mid[0], wire.end[0], pWires),
                    lerp(wire.mid[1] - 0.2, wire.end[1], pWires),
                    lerp(wire.mid[2], wire.end[2], pWires),
                  ]}
                  progress={progress}
                />
              )}
            </group>
          );
        })}
      </group>

      {/* ==================== CONDUIT TUBES ==================== */}
      {/* Vertical conduits from panel down to outlets */}
      {[-1, 0, 1, 2].map((x, i) => (
        <group key={`conduit-v-${i}`}>
          {/* Vertical run */}
          <mesh
            position={[x, lerp(0.2, 0.7, pConduit), -1.96]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.025, 0.025, lerp(0.01, 1.8, pConduit), 8]} />
            <meshStandardMaterial
              color={conduitColor}
              roughness={lerp(0.8, 0.3, pConduit)}
              metalness={lerp(0.1, 0.6, pConduit)}
              transparent
              opacity={lerp(0, 1, pConduit)}
            />
          </mesh>
          {/* Elbow at top - horizontal piece */}
          <mesh
            position={[x - 0.15, lerp(0.2, 1.6, pConduit), -1.96]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, lerp(0.01, 0.3, pConduit), 8]} />
            <meshStandardMaterial
              color={conduitColor}
              roughness={0.3}
              metalness={0.6}
              transparent
              opacity={lerp(0, 1, pConduit)}
            />
          </mesh>
        </group>
      ))}

      {/* Horizontal conduit run along top of wall */}
      <mesh
        position={[-0.5, lerp(2.0, 2.2, pConduit), -1.96]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.03, 0.03, lerp(0.01, 5.5, pConduit), 8]} />
        <meshStandardMaterial
          color={conduitColor}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={lerp(0, 1, pConduit)}
        />
      </mesh>

      {/* ==================== CABLE TRAY (top of wall) ==================== */}
      <group position={[0, 2.8, -1.9]}>
        {/* Tray bottom */}
        <mesh receiveShadow>
          <boxGeometry args={[lerp(0.01, 4.0, pConduit), 0.02, 0.15]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#aaaaaa', pConduit)}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={lerp(0, 1, pConduit)}
          />
        </mesh>
        {/* Tray sides */}
        {[-0.07, 0.07].map((z, i) => (
          <mesh key={`tray-side-${i}`} position={[0, 0.04, z]}>
            <boxGeometry args={[lerp(0.01, 4.0, pConduit), 0.08, 0.01]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.metal, '#aaaaaa', pConduit)}
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={lerp(0, 1, pConduit)}
            />
          </mesh>
        ))}
      </group>

      {/* ==================== JUNCTION BOXES ==================== */}
      {[
        [-1.5, 2.2, -1.95] as const,
        [0.5, 2.2, -1.95] as const,
        [2.5, 1.5, -1.95] as const,
      ].map((pos, i) => (
        <group key={`jbox-${i}`} position={[pos[0], pos[1], pos[2]]}>
          {/* Box body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.15, 0.06]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.dirt, '#cccccc', pConduit)}
              roughness={lerp(0.9, 0.3, pConduit)}
              metalness={lerp(0.1, 0.5, pConduit)}
            />
          </mesh>
          {/* Cover plate */}
          <mesh position={[0, 0, 0.035]} castShadow>
            <boxGeometry args={[0.13, 0.13, 0.01]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.metal, '#dddddd', pConduit)}
              roughness={0.25}
              metalness={0.6}
            />
          </mesh>
          {/* Screw dots */}
          {[
            [-0.04, 0.04],
            [0.04, -0.04],
          ].map((s, si) => (
            <mesh key={`screw-${si}`} position={[s[0], s[1], 0.042]}>
              <cylinderGeometry args={[0.008, 0.008, 0.005, 8]} />
              <meshStandardMaterial color="#999" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ==================== OUTLETS WITH FRAMES ==================== */}
      {[-1, 0, 1, 2].map((x, i) => {
        const op = stagger(pOutlets, i * 0.15, i * 0.15 + 0.6);
        return (
          <group key={`outlet-${i}`} position={[x, 0.3, -1.93]}>
            {/* Wall plate / frame */}
            <mesh receiveShadow castShadow>
              <boxGeometry args={[0.14, 0.2, 0.015]} />
              <meshStandardMaterial
                color={outletColor}
                roughness={lerp(0.9, 0.3, op)}
                transparent
                opacity={lerp(0.15, 1, op)}
              />
            </mesh>
            {/* Outlet body (recessed) */}
            <mesh position={[0, 0, 0.01]} castShadow>
              <boxGeometry args={[0.1, 0.16, 0.01]} />
              <meshStandardMaterial
                color={lerpColor(RUIN.wall, '#eeeeee', op)}
                roughness={0.4}
                transparent
                opacity={lerp(0.1, 1, op)}
              />
            </mesh>
            {/* Socket holes (two per outlet, French style) */}
            {[-0.03, 0.03].map((yOff, hi) => (
              <group key={`hole-${hi}`} position={[0, yOff, 0.018]}>
                {/* Round socket */}
                <mesh>
                  <cylinderGeometry args={[0.018, 0.018, 0.005, 12]} />
                  <meshStandardMaterial
                    color={lerpColor('#1a1510', '#333333', op)}
                    roughness={0.7}
                    transparent
                    opacity={lerp(0.1, 1, op)}
                  />
                </mesh>
                {/* Pin holes */}
                {[-0.006, 0.006].map((px, pi) => (
                  <mesh key={`pin-${pi}`} position={[px, 0, 0.003]}>
                    <cylinderGeometry args={[0.003, 0.003, 0.005, 6]} />
                    <meshStandardMaterial color="#111" transparent opacity={lerp(0, 1, op)} />
                  </mesh>
                ))}
                {/* Ground pin (protruding, French style) */}
                <mesh position={[0, 0.008, 0.004]}>
                  <cylinderGeometry args={[0.002, 0.002, 0.008, 6]} />
                  <meshStandardMaterial
                    color={lerpColor(RUIN.metal, '#cccccc', op)}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={lerp(0, 1, op)}
                  />
                </mesh>
              </group>
            ))}
            {/* Frame screw */}
            <mesh position={[0, 0.09, 0.02]}>
              <cylinderGeometry args={[0.006, 0.006, 0.004, 8]} />
              <meshStandardMaterial
                color="#aaa"
                metalness={0.7}
                roughness={0.3}
                transparent
                opacity={lerp(0, 1, op)}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== LIGHT SWITCHES WITH TOGGLE ==================== */}
      {[-1.5, 1.5].map((x, i) => {
        const sp = stagger(pSwitches, i * 0.2, i * 0.2 + 0.7);
        const toggleAngle = lerp(0.3, -0.3, sp);
        return (
          <group key={`switch-${i}`} position={[x, 1.2, -1.93]}>
            {/* Switch plate */}
            <mesh receiveShadow castShadow>
              <boxGeometry args={[0.12, 0.18, 0.015]} />
              <meshStandardMaterial
                color={switchColor}
                roughness={lerp(0.9, 0.3, sp)}
                transparent
                opacity={lerp(0.15, 1, sp)}
              />
            </mesh>
            {/* Switch body */}
            <mesh position={[0, 0, 0.01]} castShadow>
              <boxGeometry args={[0.08, 0.14, 0.01]} />
              <meshStandardMaterial
                color={lerpColor(RUIN.wall, '#f0f0f0', sp)}
                roughness={0.4}
                transparent
                opacity={lerp(0.1, 1, sp)}
              />
            </mesh>
            {/* Toggle rocker */}
            <mesh position={[0, 0, 0.02]} rotation={[toggleAngle, 0, 0]} castShadow>
              <boxGeometry args={[0.04, 0.06, 0.015]} />
              <meshStandardMaterial
                color={lerpColor('#555', '#ffffff', sp)}
                roughness={0.3}
                transparent
                opacity={lerp(0.2, 1, sp)}
              />
            </mesh>
            {/* LED indicator dot */}
            <mesh position={[0.03, 0.06, 0.02]}>
              <sphereGeometry args={[0.005, 8, 8]} />
              <meshStandardMaterial
                color={sp > 0.5 ? '#00ff44' : '#ff3300'}
                emissive={sp > 0.5 ? '#00ff44' : '#ff3300'}
                emissiveIntensity={lerp(0.5, 1.5, sp)}
                transparent
                opacity={lerp(0.2, 1, sp)}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== CEILING LIGHT FIXTURE ==================== */}
      <group position={[0, 3.2, -0.5]}>
        {/* Ceiling mount / canopy */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#ffffff', pLight)}
            roughness={lerp(0.9, 0.2, pLight)}
            metalness={lerp(0.1, 0.5, pLight)}
          />
        </mesh>

        {/* Hanging rod */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#cccccc', pLight)}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Fixture body (flat disc) */}
        <mesh position={[0, -0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.06, 16]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#e0e0e0', pLight)}
            roughness={lerp(0.85, 0.15, pLight)}
            metalness={lerp(0.2, 0.7, pLight)}
          />
        </mesh>

        {/* Light diffuser ring */}
        <mesh position={[0, -0.46, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial
            color={lerpColor('#554430', '#ffffff', pLight)}
            transparent
            opacity={lerp(0.3, 0.85, pLight)}
            roughness={0.1}
          />
        </mesh>

        {/* LED Bulb */}
        <mesh ref={bulbRef} position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={lerpColor('#443322', '#ffffee', pLight)}
            emissive={lerpColor('#221100', '#ffffcc', pLight)}
            emissiveIntensity={lerp(0.2, 2.5, pLight)}
            transparent
            opacity={lerp(0.5, 1, pLight)}
          />
        </mesh>

        {/* Point light from fixture */}
        <pointLight
          position={[0, -0.5, 0]}
          intensity={lerp(0, 2.5, pLight)}
          color={lerpColor('#ff9944', '#fff5e6', pLight)}
          distance={6}
          castShadow
        />
      </group>

      {/* ==================== SECONDARY WALL SCONCE ==================== */}
      <group position={[2.5, 2.0, -1.93]}>
        {/* Backplate */}
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.14, 0.02]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#dddddd', pLight)}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {/* Arm */}
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.1, 8]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#cccccc', pLight)}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Small bulb */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color={lerpColor('#332211', '#ffffee', pLight)}
            emissive={lerpColor('#110800', '#ffffaa', pLight)}
            emissiveIntensity={lerp(0, 2, pLight)}
          />
        </mesh>
        <pointLight
          position={[0, 0, 0.15]}
          intensity={lerp(0, 1.0, pLight)}
          color="#fff5e6"
          distance={3}
        />
      </group>

      {/* ==================== EXPOSED CONNECTIONS (ruined state) ==================== */}
      {/* Burnt marks on wall near panel */}
      <mesh position={[-2.2, 2.3, -1.98]} receiveShadow>
        <planeGeometry args={[0.4, 0.25]} />
        <meshStandardMaterial
          color="#1a1008"
          transparent
          opacity={lerp(0.6, 0, pPanel)}
          roughness={1}
        />
      </mesh>

      {/* Dust particles on floor near panel */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`dust-${i}`}
          position={[
            -2.8 + (i % 4) * 0.25 + Math.sin(i * 2.1) * 0.1,
            -1.48,
            -1.2 + Math.cos(i * 1.7) * 0.3,
          ]}
          rotation={[-Math.PI / 2, 0, i * 0.8]}
          receiveShadow
        >
          <planeGeometry args={[0.08 + i * 0.01, 0.06 + i * 0.008]} />
          <meshStandardMaterial
            color={RUIN.dirt}
            transparent
            opacity={lerp(0.5, 0, pPanel)}
            roughness={1}
          />
        </mesh>
      ))}

      {/* ==================== ADDITIONAL SPARK EFFECTS (ruined) ==================== */}
      {progress < 0.5 && (
        <>
          <SparkEffect position={[-2.5, 1.9, -1.85]} progress={progress} />
          <SparkEffect position={[-2.9, 0.9, -1.8]} progress={progress} />
        </>
      )}

      {/* ==================== FINISHING DETAILS (renovated) ==================== */}
      {/* Baseboard / plinth */}
      <mesh position={[0, -1.35, -1.95]} receiveShadow>
        <boxGeometry args={[8, 0.12, 0.04]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, '#f0f0f0', pFinish)}
          roughness={lerp(0.9, 0.3, pFinish)}
          transparent
          opacity={lerp(0.2, 1, pFinish)}
        />
      </mesh>

      {/* Trunking / dado rail for cables */}
      <mesh position={[0, 0.6, -1.96]} receiveShadow>
        <boxGeometry args={[lerp(0, 6, pFinish), 0.06, 0.03]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, '#f5f5f5', pFinish)}
          roughness={0.3}
          transparent
          opacity={lerp(0, 1, pFinish)}
        />
      </mesh>

      {/* Clean label on panel */}
      <mesh position={[-2.8, 2.15, -1.88]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.005]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={lerp(0, 1, pFinish)}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
