'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RUIN, lerpColor, lerp } from './materials';
import * as THREE from 'three';

interface SceneProps {
  progress: number;
}

/* ── Stagger helpers ─────────────────────────────────────────────────── */
// progress 0→1 is split into phases so elements appear sequentially
function stage(p: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

export default function ChargingScene({ progress }: SceneProps) {
  const pFloor   = stage(progress, 0.00, 0.20);  // floor first
  const pWalls   = stage(progress, 0.10, 0.35);  // walls clean up
  const pStation = stage(progress, 0.25, 0.55);  // station appears
  const pCar     = stage(progress, 0.40, 0.70);  // car materialises
  const pCable   = stage(progress, 0.60, 0.85);  // cable connects
  const pGlow    = stage(progress, 0.75, 1.00);  // glow effects

  /* ── Animated refs ─────────────────────────────────────────────────── */
  const ledRef = useRef<THREE.Mesh>(null);
  const statusLedRef = useRef<THREE.Mesh>(null);
  const cableGlowRef = useRef<THREE.Mesh>(null);
  const headlightLRef = useRef<THREE.Mesh>(null);
  const headlightRRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Pulsing LED status indicator on station
    if (statusLedRef.current) {
      const mat = statusLedRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = lerp(0, 0.6 + Math.sin(t * 3) * 0.4, pGlow);
    }
    // Subtle cable glow pulse
    if (cableGlowRef.current) {
      const mat = cableGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = lerp(0, 0.5 + Math.sin(t * 2.5 + 1) * 0.3, pGlow);
    }
    // Overhead LED strip flicker at low progress
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      const flicker = pGlow < 0.3 ? (Math.sin(t * 20) > 0.7 ? 0.2 : 0) : 0;
      mat.emissiveIntensity = lerp(0, 1.0, pGlow) + flicker;
    }
    // Headlight glow
    if (headlightLRef.current) {
      const mat = headlightLRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = lerp(0, 0.8 + Math.sin(t * 1.5) * 0.2, pGlow);
    }
    if (headlightRRef.current) {
      const mat = headlightRRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = lerp(0, 0.8 + Math.sin(t * 1.5) * 0.2, pGlow);
    }
  });

  /* ── Colours ───────────────────────────────────────────────────────── */
  const wallColor = lerpColor(RUIN.wall, '#e8e8e8', pWalls);
  const floorBase = lerpColor(RUIN.floor, '#808b8e', pFloor);
  const epoxyColor = lerpColor(RUIN.floor, '#a8b8bc', pFloor);
  const stationBody = lerpColor(RUIN.dirt, '#1a1a2a', pStation);
  const carBody = lerpColor('#333333', '#1c2b4a', pCar);
  const carCabin = lerpColor('#333333', '#222e42', pCar);

  return (
    <group>
      {/* ── Lighting ───────────────────────────────────────────────── */}
      <ambientLight intensity={lerp(0.15, 0.5, progress)} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={lerp(0.2, 1.0, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 3.5, 0]} intensity={lerp(0, 1.8, pGlow)} color="#fff5e6" />
      <pointLight position={[-3.5, 2, -3]} intensity={lerp(0, 0.6, pGlow)} color="#00ff88" />

      {/* ── Floor: concrete → epoxy ────────────────────────────────── */}
      {/* Base concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial
          color={floorBase}
          roughness={lerp(0.95, 0.7, pFloor)}
        />
      </mesh>
      {/* Epoxy coating overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]} receiveShadow>
        <planeGeometry args={[9.6, 7.6]} />
        <meshStandardMaterial
          color={epoxyColor}
          roughness={lerp(0.9, 0.2, pFloor)}
          metalness={lerp(0, 0.15, pFloor)}
          opacity={lerp(0, 0.9, pFloor)}
          transparent
        />
      </mesh>

      {/* ── Parking lines (thin yellow planes) ─────────────────────── */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh
          key={`pline-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, -1.48, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.06, 5]} />
          <meshStandardMaterial
            color="#e8c800"
            opacity={lerp(0, 0.8, pFloor)}
            transparent
          />
        </mesh>
      ))}
      {/* Front stop line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 2]} receiveShadow>
        <planeGeometry args={[2.4, 0.06]} />
        <meshStandardMaterial
          color="#e8c800"
          opacity={lerp(0, 0.8, pFloor)}
          transparent
        />
      </mesh>

      {/* ── Back wall ──────────────────────────────────────────────── */}
      <mesh position={[0, 1.5, -4]} receiveShadow>
        <boxGeometry args={[10, 6, 0.2]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.9, 0.5, pWalls)} />
      </mesh>

      {/* ── Left wall ─────────────────────────────────────────────── */}
      <mesh position={[-5, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 8]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.9, 0.5, pWalls)} />
      </mesh>

      {/* ── Right wall ────────────────────────────────────────────── */}
      <mesh position={[5, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 8]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.9, 0.5, pWalls)} />
      </mesh>

      {/* ── Ceiling ───────────────────────────────────────────────── */}
      <mesh position={[0, 4.5, 0]} receiveShadow>
        <boxGeometry args={[10, 0.15, 8]} />
        <meshStandardMaterial color={lerpColor(RUIN.wall, '#d8d8d8', pWalls)} />
      </mesh>

      {/* ── Sectional garage door (front, horizontal slats) ────────── */}
      <group position={[0, 1.5, 3.95]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const slotH = 0.7;
          const y = -2.7 + i * slotH + slotH / 2;
          return (
            <mesh key={`door-${i}`} position={[0, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, slotH - 0.03, 0.08]} />
              <meshStandardMaterial
                color={lerpColor(RUIN.metal, '#c0c0c8', pWalls)}
                roughness={lerp(0.85, 0.4, pWalls)}
                metalness={lerp(0.1, 0.3, pWalls)}
              />
            </mesh>
          );
        })}
        {/* Door frame */}
        {[-3.05, 3.05].map((x, i) => (
          <mesh key={`dframe-${i}`} position={[x, -0.2, 0.02]} castShadow>
            <boxGeometry args={[0.1, 5.8, 0.12]} />
            <meshStandardMaterial color={lerpColor(RUIN.metal, '#888888', pWalls)} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── Overhead LED strip lighting ────────────────────────────── */}
      <mesh ref={ledRef} position={[0, 4.35, 0]} castShadow>
        <boxGeometry args={[8, 0.06, 0.15]} />
        <meshStandardMaterial
          color={lerpColor('#333', '#ffffff', pGlow)}
          emissive={lerpColor('#000000', '#fff5e6', pGlow)}
          emissiveIntensity={lerp(0, 1.0, pGlow)}
        />
      </mesh>
      {/* Secondary LED strip perpendicular */}
      <mesh position={[0, 4.35, -1.5]} castShadow>
        <boxGeometry args={[0.15, 0.06, 5]} />
        <meshStandardMaterial
          color={lerpColor('#333', '#ffffff', pGlow)}
          emissive={lerpColor('#000000', '#fff5e6', pGlow)}
          emissiveIntensity={lerp(0, 0.8, pGlow)}
        />
      </mesh>

      {/* ── Wall-mounted electrical panel ──────────────────────────── */}
      <group position={[-4.8, 1.8, -2.5]}>
        {/* Panel box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.8, 0.55]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#888888', pStation)}
            metalness={lerp(0.1, 0.5, pStation)}
            roughness={0.5}
            opacity={lerp(0.15, 1, pStation)}
            transparent
          />
        </mesh>
        {/* Panel door line */}
        <mesh position={[0.065, 0, 0]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#999999', pStation)}
            metalness={0.4}
            opacity={lerp(0.1, 1, pStation)}
            transparent
          />
        </mesh>
        {/* Breaker indicators */}
        {[0.12, 0, -0.12].map((z, i) => (
          <mesh key={`breaker-${i}`} position={[0.07, 0.1, z]}>
            <boxGeometry args={[0.02, 0.06, 0.08]} />
            <meshStandardMaterial
              color={lerpColor('#333', '#cc3333', pStation)}
              opacity={lerp(0, 1, pStation)}
              transparent
            />
          </mesh>
        ))}
        {/* Conduit pipe going down to station */}
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.6]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.metal, '#777777', pStation)}
            metalness={0.4}
            opacity={lerp(0, 1, pStation)}
            transparent
          />
        </mesh>
      </group>

      {/* ── Shelving unit (right wall) ─────────────────────────────── */}
      <group position={[4.6, 0.2, -2]}>
        {/* Vertical uprights */}
        {[-0.5, 0.5].map((z, i) => (
          <mesh key={`upright-${i}`} position={[0, 0.8, z]} castShadow>
            <boxGeometry args={[0.06, 3.2, 0.06]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.metal, '#666666', pWalls)}
              metalness={0.3}
              opacity={lerp(0.2, 1, pWalls)}
              transparent
            />
          </mesh>
        ))}
        {/* Shelves (3 levels) */}
        {[0, 0.9, 1.8].map((y, i) => (
          <group key={`shelf-${i}`}>
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.35, 0.04, 1.1]} />
              <meshStandardMaterial
                color={lerpColor(RUIN.accent, '#888888', pWalls)}
                metalness={0.2}
                opacity={lerp(0.2, 1, pWalls)}
                transparent
              />
            </mesh>
            {/* Objects on shelves */}
            {i === 0 && (
              <>
                <mesh position={[0, y + 0.15, -0.2]} castShadow>
                  <boxGeometry args={[0.2, 0.25, 0.2]} />
                  <meshStandardMaterial
                    color={lerpColor('#444', '#cc4444', pWalls)}
                    opacity={lerp(0.15, 0.9, pWalls)}
                    transparent
                  />
                </mesh>
                <mesh position={[0, y + 0.1, 0.25]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.18]} />
                  <meshStandardMaterial
                    color={lerpColor('#444', '#3366aa', pWalls)}
                    opacity={lerp(0.15, 0.9, pWalls)}
                    transparent
                  />
                </mesh>
              </>
            )}
            {i === 1 && (
              <mesh position={[0, y + 0.1, 0]} castShadow>
                <boxGeometry args={[0.25, 0.18, 0.35]} />
                <meshStandardMaterial
                  color={lerpColor('#444', '#44aa44', pWalls)}
                  opacity={lerp(0.15, 0.9, pWalls)}
                  transparent
                />
              </mesh>
            )}
            {i === 2 && (
              <>
                <mesh position={[0, y + 0.08, -0.2]} castShadow>
                  <boxGeometry args={[0.15, 0.14, 0.15]} />
                  <meshStandardMaterial
                    color={lerpColor('#444', '#ddaa22', pWalls)}
                    opacity={lerp(0.15, 0.9, pWalls)}
                    transparent
                  />
                </mesh>
                <mesh position={[0, y + 0.06, 0.2]} castShadow>
                  <boxGeometry args={[0.12, 0.1, 0.12]} />
                  <meshStandardMaterial
                    color={lerpColor('#444', '#8844cc', pWalls)}
                    opacity={lerp(0.15, 0.9, pWalls)}
                    transparent
                  />
                </mesh>
              </>
            )}
          </group>
        ))}
      </group>

      {/* ── IRVE Charging station ──────────────────────────────────── */}
      <group position={[-3.5, -1.5, -3.5]}>
        {/* Base plate */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 0.4]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.dirt, '#333333', pStation)}
            metalness={0.3}
            opacity={lerp(0.08, 1, pStation)}
            transparent
          />
        </mesh>

        {/* Main post */}
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 1.9, 0.2]} />
          <meshStandardMaterial
            color={stationBody}
            roughness={lerp(0.9, 0.3, pStation)}
            metalness={lerp(0, 0.2, pStation)}
            opacity={lerp(0.08, 1, pStation)}
            transparent
          />
        </mesh>

        {/* Brand accent stripe (red) */}
        <mesh position={[0.18, 1.05, 0.02]}>
          <boxGeometry args={[0.02, 1.6, 0.16]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.dirt, '#E50000', pStation)}
            emissive={lerpColor('#000000', '#660000', pStation)}
            emissiveIntensity={lerp(0, 0.3, pStation)}
            opacity={lerp(0, 1, pStation)}
            transparent
          />
        </mesh>

        {/* Screen panel */}
        <mesh position={[0, 1.35, 0.115]}>
          <boxGeometry args={[0.26, 0.3, 0.02]} />
          <meshStandardMaterial
            color={lerpColor('#222222', '#001a0a', pStation)}
            emissive={lerpColor('#000000', '#00ff88', pGlow)}
            emissiveIntensity={lerp(0, 0.6, pGlow)}
            roughness={0.1}
            opacity={lerp(0.05, 1, pStation)}
            transparent
          />
        </mesh>

        {/* Screen bezel */}
        <mesh position={[0, 1.35, 0.105]}>
          <boxGeometry args={[0.3, 0.34, 0.01]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.dirt, '#111111', pStation)}
            opacity={lerp(0.05, 1, pStation)}
            transparent
          />
        </mesh>

        {/* LED status indicator (pulsing) */}
        <mesh ref={statusLedRef} position={[0, 1.6, 0.12]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial
            color={lerpColor('#333333', '#00ff66', pGlow)}
            emissive={lerpColor('#000000', '#00ff44', pGlow)}
            emissiveIntensity={lerp(0, 0.8, pGlow)}
            opacity={lerp(0.05, 1, pStation)}
            transparent
          />
        </mesh>

        {/* Cable holster / connector dock */}
        <mesh position={[0.22, 0.6, 0.08]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
          <meshStandardMaterial
            color={lerpColor(RUIN.dirt, '#222222', pStation)}
            opacity={lerp(0, 1, pStation)}
            transparent
          />
        </mesh>

        {/* ── Charging cable (curves from station to car) ──────────── */}
        {/* Cable segment 1: down from holster */}
        <mesh position={[0.22, 0.3, 0.2]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.5]} />
          <meshStandardMaterial
            color="#1a1a1a"
            opacity={lerp(0, 1, pCable)}
            transparent
          />
        </mesh>
        {/* Cable segment 2: arc toward car (angled) */}
        <mesh
          position={[0.8, 0.1, 0.8]}
          rotation={[0.4, 0.6, 1.2]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.018, 1.2]} />
          <meshStandardMaterial
            color="#1a1a1a"
            opacity={lerp(0, 1, pCable)}
            transparent
          />
        </mesh>
        {/* Cable segment 3: along ground to car */}
        <mesh
          position={[1.8, 0.05, 1.8]}
          rotation={[0, 0.5, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.018, 1.4]} />
          <meshStandardMaterial
            color="#1a1a1a"
            opacity={lerp(0, 1, pCable)}
            transparent
          />
        </mesh>

        {/* Cable glow overlay (emissive green along cable path) */}
        <mesh
          ref={cableGlowRef}
          position={[0.8, 0.1, 0.8]}
          rotation={[0.4, 0.6, 1.2]}
        >
          <cylinderGeometry args={[0.025, 0.025, 1.2]} />
          <meshStandardMaterial
            color={lerpColor('#000000', '#00ff66', pGlow)}
            emissive={lerpColor('#000000', '#00ff44', pGlow)}
            emissiveIntensity={lerp(0, 0.5, pGlow)}
            opacity={lerp(0, 0.35, pGlow)}
            transparent
          />
        </mesh>
        {/* Connector plug at car end */}
        <mesh position={[2.6, 0.1, 2.6]} rotation={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.025, 0.12, 12]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#222222', pCable)}
            opacity={lerp(0, 1, pCable)}
            transparent
          />
        </mesh>
      </group>

      {/* ── Electric car ───────────────────────────────────────────── */}
      <group position={[0.5, -1.5, 0.3]}>
        {/* Lower body */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.55, 4.2]} />
          <meshStandardMaterial
            color={carBody}
            roughness={lerp(0.8, 0.25, pCar)}
            metalness={lerp(0, 0.4, pCar)}
            opacity={lerp(0.08, 0.95, pCar)}
            transparent
          />
        </mesh>

        {/* Side skirts */}
        {[-1, 1].map((side, i) => (
          <mesh key={`skirt-${i}`} position={[side * 0.9, 0.18, 0]} castShadow>
            <boxGeometry args={[0.12, 0.15, 3.8]} />
            <meshStandardMaterial
              color={lerpColor('#222', '#111122', pCar)}
              opacity={lerp(0.05, 0.9, pCar)}
              transparent
            />
          </mesh>
        ))}

        {/* Cabin / greenhouse (slightly tapered) */}
        <mesh position={[0, 0.95, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.55, 2.2]} />
          <meshStandardMaterial
            color={carCabin}
            roughness={lerp(0.8, 0.3, pCar)}
            metalness={lerp(0, 0.35, pCar)}
            opacity={lerp(0.08, 0.95, pCar)}
            transparent
          />
        </mesh>

        {/* Roof taper (narrower box on top of cabin) */}
        <mesh position={[0, 1.18, -0.2]} castShadow>
          <boxGeometry args={[1.35, 0.12, 1.8]} />
          <meshStandardMaterial
            color={carCabin}
            roughness={lerp(0.8, 0.3, pCar)}
            metalness={lerp(0, 0.35, pCar)}
            opacity={lerp(0.06, 0.9, pCar)}
            transparent
          />
        </mesh>

        {/* Windshield (front, angled transparent plane) */}
        <mesh position={[0, 0.88, 0.85]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[1.45, 0.6]} />
          <meshStandardMaterial
            color={lerpColor('#444466', '#aaccee', pCar)}
            roughness={0.05}
            metalness={0.1}
            opacity={lerp(0.05, 0.45, pCar)}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Rear window */}
        <mesh position={[0, 0.88, -1.2]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[1.35, 0.5]} />
          <meshStandardMaterial
            color={lerpColor('#444466', '#8899bb', pCar)}
            roughness={0.05}
            opacity={lerp(0.04, 0.4, pCar)}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Headlights (front, small emissive cylinders) */}
        <mesh ref={headlightLRef} position={[-0.65, 0.45, 2.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial
            color={lerpColor('#555', '#ffffff', pGlow)}
            emissive={lerpColor('#000000', '#ffffdd', pGlow)}
            emissiveIntensity={lerp(0, 0.8, pGlow)}
            opacity={lerp(0.06, 1, pCar)}
            transparent
          />
        </mesh>
        <mesh ref={headlightRRef} position={[0.65, 0.45, 2.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial
            color={lerpColor('#555', '#ffffff', pGlow)}
            emissive={lerpColor('#000000', '#ffffdd', pGlow)}
            emissiveIntensity={lerp(0, 0.8, pGlow)}
            opacity={lerp(0.06, 1, pCar)}
            transparent
          />
        </mesh>

        {/* Tail lights (rear, red emissive) */}
        {[-0.65, 0.65].map((x, i) => (
          <mesh key={`tail-${i}`} position={[x, 0.45, -2.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial
              color={lerpColor('#444', '#cc0000', pCar)}
              emissive={lerpColor('#000000', '#880000', pGlow)}
              emissiveIntensity={lerp(0, 0.5, pGlow)}
              opacity={lerp(0.05, 1, pCar)}
              transparent
            />
          </mesh>
        ))}

        {/* Charge port (left side, small recessed circle) */}
        <mesh position={[-0.96, 0.5, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#00aa55', pCable)}
            emissive={lerpColor('#000000', '#00ff44', pGlow)}
            emissiveIntensity={lerp(0, 0.4, pGlow)}
            opacity={lerp(0.04, 1, pCar)}
            transparent
          />
        </mesh>
        {/* Charge port ring */}
        <mesh position={[-0.97, 0.5, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.07, 0.01, 8, 24]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#00cc66', pGlow)}
            emissive={lerpColor('#000000', '#00ff44', pGlow)}
            emissiveIntensity={lerp(0, 0.6, pGlow)}
            opacity={lerp(0, 1, pCable)}
            transparent
          />
        </mesh>

        {/* Front bumper */}
        <mesh position={[0, 0.2, 2.15]} castShadow>
          <boxGeometry args={[1.8, 0.25, 0.12]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#1a1a2a', pCar)}
            opacity={lerp(0.06, 0.95, pCar)}
            transparent
          />
        </mesh>

        {/* Rear bumper */}
        <mesh position={[0, 0.2, -2.15]} castShadow>
          <boxGeometry args={[1.8, 0.25, 0.12]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#1a1a2a', pCar)}
            opacity={lerp(0.06, 0.95, pCar)}
            transparent
          />
        </mesh>

        {/* 4 Wheels */}
        {[
          [-0.85, 0.05, 1.35],
          [0.85, 0.05, 1.35],
          [-0.85, 0.05, -1.35],
          [0.85, 0.05, -1.35],
        ].map(([x, y, z], i) => (
          <group key={`wheel-${i}`} position={[x, y, z]}>
            {/* Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.18, 20]} />
              <meshStandardMaterial
                color="#111111"
                roughness={0.9}
                opacity={lerp(0.08, 0.95, pCar)}
                transparent
              />
            </mesh>
            {/* Rim / hubcap */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.19, 16]} />
              <meshStandardMaterial
                color={lerpColor('#333', '#999999', pCar)}
                metalness={lerp(0, 0.6, pCar)}
                roughness={0.3}
                opacity={lerp(0.06, 0.95, pCar)}
                transparent
              />
            </mesh>
          </group>
        ))}

        {/* Side mirrors */}
        {[-0.95, 0.95].map((x, i) => (
          <mesh key={`mirror-${i}`} position={[x * 1.05, 0.75, 0.6]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.14]} />
            <meshStandardMaterial
              color={carBody}
              opacity={lerp(0.05, 0.9, pCar)}
              transparent
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
