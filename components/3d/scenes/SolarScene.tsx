'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/* ------------------------------------------------------------------ */
/*  Helper: clamp a sub-progress with staggered delay                 */
/* ------------------------------------------------------------------ */
function stagger(progress: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Pitched roof — two angled planes meeting at a ridge */
function PitchedRoof({ progress }: { progress: number }) {
  const roofColor = lerpColor('#5a4a3a', '#8B4513', progress);
  const ridgeY = 2.6;
  const eaveY = 1.5;
  const halfW = 3.5;
  const depth = 5.4;
  // angle so that roof rises from eaveY at edge to ridgeY at center
  const roofLen = Math.sqrt((ridgeY - eaveY) ** 2 + halfW ** 2);
  const angle = Math.atan2(ridgeY - eaveY, halfW);

  return (
    <group>
      {/* Left slope */}
      <mesh
        position={[-halfW / 2, (ridgeY + eaveY) / 2, 0]}
        rotation={[0, 0, angle]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[roofLen, 0.1, depth]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      {/* Right slope */}
      <mesh
        position={[halfW / 2, (ridgeY + eaveY) / 2, 0]}
        rotation={[0, 0, -angle]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[roofLen, 0.1, depth]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      {/* Ridge cap */}
      <mesh position={[0, ridgeY + 0.05, 0]} castShadow>
        <boxGeometry args={[0.3, 0.08, depth]} />
        <meshStandardMaterial color={lerpColor('#4a3a2a', '#6B3410', progress)} />
      </mesh>
      {/* Front gable triangle */}
      <mesh position={[0, (ridgeY + eaveY) / 2, depth / 2]} receiveShadow>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              -halfW, eaveY, 0,
               halfW, eaveY, 0,
               0,     ridgeY, 0,
            ]), 3]}
          />
          <bufferAttribute
            attach="index"
            args={[new Uint16Array([0, 1, 2]), 1]}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, RENOVATED.wall, progress)}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Back gable triangle */}
      <mesh position={[0, (ridgeY + eaveY) / 2, -depth / 2]} receiveShadow>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              -halfW, eaveY, 0,
               halfW, eaveY, 0,
               0,     ridgeY, 0,
            ]), 3]}
          />
          <bufferAttribute
            attach="index"
            args={[new Uint16Array([0, 2, 1]), 1]}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, RENOVATED.wall, progress)}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** Single solar panel with frame, dark glass, and cell grid lines */
function SolarPanel({ localProgress }: { localProgress: number }) {
  const w = 1.0;
  const h = 0.7;
  const frameThickness = 0.03;

  return (
    <group>
      {/* Aluminum frame */}
      <mesh castShadow>
        <boxGeometry args={[w + frameThickness * 2, 0.04, h + frameThickness * 2]} />
        <meshStandardMaterial
          color={lerpColor('#666666', '#C0C0C0', localProgress)}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      {/* Dark glass surface */}
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[w, 0.01, h]} />
        <meshStandardMaterial
          color={lerpColor('#333344', '#0a1628', localProgress)}
          metalness={lerp(0, 0.7, localProgress)}
          roughness={lerp(0.8, 0.15, localProgress)}
        />
      </mesh>
      {/* Horizontal cell grid lines (5 lines) */}
      {[...Array(5)].map((_, i) => (
        <mesh key={`h-${i}`} position={[0, 0.031, -h / 2 + ((i + 1) * h) / 6]}>
          <boxGeometry args={[w - 0.02, 0.005, 0.008]} />
          <meshStandardMaterial
            color={lerpColor('#444455', '#1a2a44', localProgress)}
            metalness={0.5}
          />
        </mesh>
      ))}
      {/* Vertical cell grid lines (3 lines) */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`v-${i}`} position={[-w / 2 + ((i + 1) * w) / 4, 0.031, 0]}>
          <boxGeometry args={[0.008, 0.005, h - 0.02]} />
          <meshStandardMaterial
            color={lerpColor('#444455', '#1a2a44', localProgress)}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Chimney */
function Chimney({ progress }: { progress: number }) {
  return (
    <mesh position={[2.2, 3.0, -1.0]} castShadow receiveShadow>
      <boxGeometry args={[0.5, 1.2, 0.5]} />
      <meshStandardMaterial color={lerpColor('#5a3a2a', '#8B5A3A', progress)} />
    </mesh>
  );
}

/** Window */
function Window({ position, progress }: { position: [number, number, number]; progress: number }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.9, 0.08]} />
        <meshStandardMaterial color={lerpColor('#3a3028', '#f0f0f0', progress)} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.55, 0.75, 0.02]} />
        <meshStandardMaterial
          color={lerpColor('#2a3040', '#87CEEB', progress)}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Cross bar horizontal */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.55, 0.04, 0.02]} />
        <meshStandardMaterial color={lerpColor('#3a3028', '#e8e8e8', progress)} />
      </mesh>
      {/* Cross bar vertical */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.04, 0.75, 0.02]} />
        <meshStandardMaterial color={lerpColor('#3a3028', '#e8e8e8', progress)} />
      </mesh>
    </group>
  );
}

/** Front door */
function Door({ progress }: { progress: number }) {
  return (
    <group position={[0, -0.6, 2.52]}>
      {/* Door frame */}
      <mesh>
        <boxGeometry args={[0.9, 1.8, 0.08]} />
        <meshStandardMaterial color={lerpColor('#2a2018', '#4a2a15', progress)} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.75, 1.65, 0.04]} />
        <meshStandardMaterial color={lerpColor('#3a2a1a', '#6B3410', progress)} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.28, 0, 0.06]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={lerpColor('#5c4f3d', '#FFD700', progress)}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Micro-inverter box on the side of the house */
function InverterBox({ progress }: { progress: number }) {
  const p = stagger(progress, 0.55, 0.75);
  return (
    <group position={[3.55, 0.2, 0.5]} scale={[p, p, p]}>
      {/* Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.5, 0.35]} />
        <meshStandardMaterial color={lerpColor('#555', '#e0e0e0', progress)} />
      </mesh>
      {/* Status LED */}
      <mesh position={[0.08, 0.15, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color={progress > 0.8 ? '#00ff00' : '#333'}
          emissive={progress > 0.8 ? '#00ff00' : '#000'}
          emissiveIntensity={progress > 0.8 ? 2 : 0}
        />
      </mesh>
      {/* Label */}
      <mesh position={[0.081, -0.05, 0]}>
        <boxGeometry args={[0.005, 0.12, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}

/** Smart meter box near the door */
function SmartMeter({ progress }: { progress: number }) {
  const p = stagger(progress, 0.6, 0.8);
  return (
    <group position={[1.2, -0.3, 2.53]} scale={[p, p, p]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color={lerpColor('#444', '#d0d0d0', progress)} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.04, 0.051]}>
        <boxGeometry args={[0.2, 0.15, 0.005]} />
        <meshStandardMaterial
          color={progress > 0.8 ? '#003300' : '#111'}
          emissive={progress > 0.8 ? '#00aa44' : '#000'}
          emissiveIntensity={progress > 0.8 ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
}

/** Electrical conduit: thin cylinders from roof to inverter */
function Conduit({ progress }: { progress: number }) {
  const p = stagger(progress, 0.5, 0.7);
  if (p <= 0) return null;
  const color = lerpColor('#555', '#aaaaaa', progress);

  return (
    <group>
      {/* Vertical run down the side wall */}
      <mesh position={[3.52, 1.2, 0.5]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} opacity={p} transparent />
      </mesh>
      {/* Horizontal run along roof edge */}
      <mesh position={[2.0, 2.2, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 3.0, 8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} opacity={p} transparent />
      </mesh>
      {/* Small bracket clips */}
      {[0, 0.8, 1.6].map((y, i) => (
        <mesh key={i} position={[3.54, 0.3 + y, 0.5]}>
          <boxGeometry args={[0.06, 0.04, 0.06]} />
          <meshStandardMaterial color={color} opacity={p} transparent />
        </mesh>
      ))}
    </group>
  );
}

/** Animated sun with rotating rays */
function Sun({ progress }: { progress: number }) {
  const raysRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (raysRef.current) {
      raysRef.current.rotation.z += delta * 0.15;
    }
  });

  const sunSize = lerp(0.4, 0.9, progress);
  const intensity = lerp(0.1, 1.8, progress);

  return (
    <group position={[7, 9, -6]}>
      {/* Sun sphere */}
      <mesh>
        <sphereGeometry args={[sunSize, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={intensity}
        />
      </mesh>
      {/* Animated rays */}
      <group ref={raysRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const len = lerp(0.6, 1.4, progress);
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * (sunSize + len / 2 + 0.15),
                Math.sin(angle) * (sunSize + len / 2 + 0.15),
                0,
              ]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[len, 0.06, 0.06]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={intensity * 0.6}
                transparent
                opacity={lerp(0.2, 0.8, progress)}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/** Subtle light beams from sun to panels */
function SunBeams({ progress }: { progress: number }) {
  const beamOpacity = lerp(0, 0.08, stagger(progress, 0.5, 1));
  if (beamOpacity <= 0) return null;

  return (
    <group>
      {[[-1.0, 0], [0.5, 0], [2.0, 0]].map(([x, z], i) => (
        <mesh
          key={i}
          position={[
            (7 + x) / 2,
            (9 + 2.7) / 2,
            (-6 + z) / 2,
          ]}
          rotation={[0.25, 0.15, -0.35]}
        >
          <cylinderGeometry args={[0.05, 0.6, 7, 8, 1, true]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
            transparent
            opacity={beamOpacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Small emissive spheres traveling from panels to inverter */
function EnergyFlow({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const flowActive = progress > 0.7;

  // Path: from panel area (roof) -> down the conduit -> to inverter
  const pathPoints = useMemo(() => [
    new THREE.Vector3(0, 2.6, 0.5),
    new THREE.Vector3(2.0, 2.2, 0.5),
    new THREE.Vector3(3.5, 2.2, 0.5),
    new THREE.Vector3(3.5, 1.2, 0.5),
    new THREE.Vector3(3.5, 0.2, 0.5),
  ], []);

  useFrame((state) => {
    if (!groupRef.current || !flowActive) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const offset = i / groupRef.current!.children.length;
      const param = ((t * 0.4 + offset) % 1);
      const segCount = pathPoints.length - 1;
      const segFloat = param * segCount;
      const segIdx = Math.min(Math.floor(segFloat), segCount - 1);
      const segT = segFloat - segIdx;
      const p = new THREE.Vector3().lerpVectors(pathPoints[segIdx], pathPoints[segIdx + 1], segT);
      child.position.copy(p);
    });
  });

  if (!flowActive) return null;

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={2.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Clouds that thin out as progress increases */
function Clouds({ progress }: { progress: number }) {
  const cloudOpacity = lerp(0.8, 0.05, progress);
  const cloudData = useMemo(() => [
    { pos: [-5, 8, -8] as const, scale: 1.8 },
    { pos: [3, 9.5, -9] as const, scale: 2.2 },
    { pos: [-8, 7, -7] as const, scale: 1.5 },
    { pos: [8, 8.5, -10] as const, scale: 1.9 },
    { pos: [0, 10, -11] as const, scale: 2.5 },
    { pos: [-3, 9, -9.5] as const, scale: 1.6 },
    { pos: [6, 10.5, -8.5] as const, scale: 1.4 },
  ], []);

  return (
    <group>
      {cloudData.map((cloud, ci) => (
        <group key={ci} position={[cloud.pos[0], cloud.pos[1], cloud.pos[2]]}>
          {/* Each cloud = cluster of spheres */}
          {[
            [0, 0, 0, cloud.scale * 0.5],
            [0.6, 0.1, 0.2, cloud.scale * 0.4],
            [-0.5, 0.15, -0.1, cloud.scale * 0.35],
            [0.3, -0.1, 0.3, cloud.scale * 0.3],
            [-0.3, 0.05, 0.15, cloud.scale * 0.38],
          ].map(([x, y, z, r], si) => (
            <mesh key={si} position={[x, y, z]}>
              <sphereGeometry args={[r, 8, 8]} />
              <meshStandardMaterial
                color="#e8e8e8"
                transparent
                opacity={cloudOpacity}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Grass / ground plane */
function Ground({ progress }: { progress: number }) {
  return (
    <group>
      {/* Main ground */}
      <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color={lerpColor('#2a3a1a', '#4a8a2a', progress)} />
      </mesh>
      {/* Gravel path to door */}
      <mesh position={[0, -1.54, 4.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, 4]} />
        <meshStandardMaterial color={lerpColor('#4a4035', '#b0a898', progress)} />
      </mesh>
      {/* Small bushes along house front */}
      {[-2.2, -1.3, 1.3, 2.2].map((x, i) => (
        <mesh key={i} position={[x, -1.2, 2.8]} castShadow>
          <sphereGeometry args={[lerp(0.15, 0.3, progress), 8, 8]} />
          <meshStandardMaterial color={lerpColor('#2a3a1a', '#2d7a1a', progress)} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Main scene                                                         */
/* ------------------------------------------------------------------ */

export default function SolarScene({ progress }: SceneProps) {
  // Staged progress: house cleanup -> panel install -> wiring -> activation
  const houseP = stagger(progress, 0, 0.3);       // 0..0.3 => house cleanup
  const panelP = stagger(progress, 0.25, 0.7);    // 0.25..0.7 => panels install
  const wireP = stagger(progress, 0.5, 0.75);     // 0.5..0.75 => wiring
  const activP = stagger(progress, 0.75, 1.0);    // 0.75..1.0 => activation glow

  // Panel grid: 3 rows x 4 cols
  const panels = useMemo(() => {
    const arr: Array<{ x: number; z: number; idx: number }> = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        arr.push({ x: -1.6 + col * 1.1, z: -0.9 + row * 0.85, idx: arr.length });
      }
    }
    return arr;
  }, []);

  // Roof geometry: ridge at y=2.6, eaves at y=1.5
  const roofAngle = Math.atan2(1.1, 3.5); // ~17 degrees pitch

  return (
    <group>
      {/* ---- Lighting ---- */}
      <ambientLight intensity={lerp(0.3, 0.8, progress)} />
      <directionalLight
        position={[7, 10, 5]}
        intensity={lerp(0.3, 1.4, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <hemisphereLight
        args={[
          lerpColor('#6688aa', '#87CEEB', progress),
          lerpColor('#333322', '#556B2F', progress),
          lerp(0.2, 0.5, progress),
        ]}
      />

      {/* ---- Sky backdrop ---- */}
      <mesh position={[0, 6, -12]}>
        <planeGeometry args={[35, 20]} />
        <meshStandardMaterial
          color={lerpColor('#667788', '#87CEEB', progress)}
          emissive={lerpColor('#222', '#4488bb', progress)}
          emissiveIntensity={lerp(0, 0.15, progress)}
        />
      </mesh>

      {/* ---- Ground ---- */}
      <Ground progress={houseP} />

      {/* ---- House walls ---- */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 3, 5]} />
        <meshStandardMaterial color={lerpColor(RUIN.wall, RENOVATED.wall, houseP)} />
      </mesh>

      {/* ---- Pitched roof ---- */}
      <PitchedRoof progress={houseP} />

      {/* ---- Chimney ---- */}
      <Chimney progress={houseP} />

      {/* ---- Windows (front face, z = 2.51) ---- */}
      <Window position={[-2.0, 0.3, 2.51]} progress={houseP} />
      <Window position={[2.0, 0.3, 2.51]} progress={houseP} />
      {/* Side windows */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Window position={[-1.2, 0.3, 3.51]} progress={houseP} />
        <Window position={[1.2, 0.3, 3.51]} progress={houseP} />
      </group>

      {/* ---- Front door ---- */}
      <Door progress={houseP} />

      {/* ---- Solar panel mounting rails on left roof slope ---- */}
      {panelP > 0 && (
        <group
          position={[-1.75, 2.05, 0]}
          rotation={[0, 0, roofAngle]}
        >
          {/* Horizontal rails */}
          {[-0.7, 0.1, 0.9].map((z, i) => (
            <mesh key={`rail-${i}`} position={[0, 0.06, z]}>
              <boxGeometry args={[4.8, 0.04, 0.04]} />
              <meshStandardMaterial
                color={lerpColor('#666', RENOVATED.metal, panelP)}
                metalness={0.8}
                roughness={0.3}
                opacity={panelP}
                transparent
              />
            </mesh>
          ))}
          {/* Mounting brackets */}
          {panels.map((panel, i) => {
            const pLocal = stagger(panelP, i / 12 * 0.6, i / 12 * 0.6 + 0.4);
            if (pLocal <= 0) return null;
            return (
              <mesh
                key={`bracket-${i}`}
                position={[panel.x, 0.03, panel.z]}
              >
                <boxGeometry args={[0.06, 0.06, 0.06]} />
                <meshStandardMaterial
                  color="#999"
                  metalness={0.8}
                  opacity={pLocal}
                  transparent
                />
              </mesh>
            );
          })}

          {/* Solar panels — staggered installation */}
          {panels.map((panel, i) => {
            const pLocal = stagger(panelP, i / 12 * 0.6, i / 12 * 0.6 + 0.4);
            if (pLocal <= 0) return null;

            return (
              <group
                key={`panel-${i}`}
                position={[panel.x, lerp(0.3, 0.1, pLocal), panel.z]}
                scale={[pLocal, pLocal, pLocal]}
              >
                <SolarPanel localProgress={pLocal * progress} />
                {/* Panel activation glow when fully activated */}
                {activP > 0 && pLocal > 0.9 && (
                  <mesh position={[0, 0.035, 0]}>
                    <boxGeometry args={[0.95, 0.005, 0.65]} />
                    <meshStandardMaterial
                      color="#4488ff"
                      emissive="#4488ff"
                      emissiveIntensity={lerp(0, 1.5, activP)}
                      transparent
                      opacity={lerp(0, 0.25, activP)}
                      depthWrite={false}
                    />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* ---- Electrical conduit ---- */}
      <Conduit progress={progress} />

      {/* ---- Inverter box ---- */}
      <InverterBox progress={progress} />

      {/* ---- Smart meter ---- */}
      <SmartMeter progress={progress} />

      {/* ---- Sun with animated rays ---- */}
      <Sun progress={progress} />

      {/* ---- Sun beams hitting panels ---- */}
      <SunBeams progress={progress} />

      {/* ---- Clouds ---- */}
      <Clouds progress={progress} />

      {/* ---- Energy flow visualization ---- */}
      <EnergyFlow progress={progress} />
    </group>
  );
}
