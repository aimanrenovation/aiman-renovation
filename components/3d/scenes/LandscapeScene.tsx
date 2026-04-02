'use client';

import { RUIN, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/* ── Staggered progress helpers ──────────────────────────────────────
   ground:     0.00 → 0.30   (first to change)
   plants:     0.15 → 0.55
   structures: 0.35 → 0.75
   decor:      0.55 → 1.00   (last to appear)
   ──────────────────────────────────────────────────────────────────── */
function stage(p: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (p - start) / (end - start)));
}

export default function LandscapeScene({ progress }: SceneProps) {
  const gnd = stage(progress, 0.0, 0.3);
  const plt = stage(progress, 0.15, 0.55);
  const str = stage(progress, 0.35, 0.75);
  const dec = stage(progress, 0.55, 1.0);

  const grassColor = lerpColor('#3d3020', '#4a8c3f', gnd);
  const dirtColor = lerpColor(RUIN.dirt, '#6b5a3a', gnd);
  const stoneColor = lerpColor('#555548', '#d4c9b8', str);
  const woodColor = lerpColor('#3a3020', '#a07848', str);
  const fenceWood = lerpColor('#4a3a28', '#8B6914', str);
  const trunkColor = lerpColor('#3a2a14', '#5a3a1a', plt);
  const leafColor = lerpColor('#3a3a1a', '#1a6b1a', plt);
  const hedgeColor = lerpColor('#2a2a12', '#2d6b1e', plt);

  return (
    <group>
      {/* ── Lighting ─────────────────────────────────────────── */}
      <ambientLight intensity={lerp(0.3, 0.6, progress)} />
      <hemisphereLight
        args={[
          lerpColor('#888899', '#87CEEB', progress),
          lerpColor('#2a2018', '#4a8c3f', progress),
          lerp(0.4, 0.7, progress),
        ]}
      />
      <directionalLight
        position={[6, 10, 4]}
        intensity={lerp(0.4, 1.3, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 6, -3]} intensity={lerp(0.1, 0.3, progress)} />

      {/* ── Ground plane ─────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color={grassColor} />
      </mesh>

      {/* Dirt patches (fade out with renovation) */}
      {[[-2, 1], [3, -1], [1, 3], [-4, -2]].map(([x, z], i) => (
        <mesh
          key={`dirt-${i}`}
          rotation={[-Math.PI / 2, i * 0.4, 0]}
          position={[x, -0.98, z]}
          receiveShadow
        >
          <circleGeometry args={[lerp(1.2, 0.0, gnd), 16]} />
          <meshStandardMaterial color={dirtColor} />
        </mesh>
      ))}

      {/* ── Background house wall ────────────────────────────── */}
      <group position={[-6, 0.2, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, lerp(2.5, 3.5, str), 8]} />
          <meshStandardMaterial color={lerpColor('#5a4a3a', '#f0ece4', str)} />
        </mesh>
        {/* Window */}
        <mesh position={[0.22, lerp(0.2, 0.6, str), -1.5]}>
          <boxGeometry args={[0.05, 0.8, 0.6]} />
          <meshStandardMaterial
            color={lerpColor('#3a3a4a', '#88bbdd', str)}
            metalness={lerp(0, 0.4, str)}
          />
        </mesh>
        <mesh position={[0.22, lerp(0.2, 0.6, str), 1.5]}>
          <boxGeometry args={[0.05, 0.8, 0.6]} />
          <meshStandardMaterial
            color={lerpColor('#3a3a4a', '#88bbdd', str)}
            metalness={lerp(0, 0.4, str)}
          />
        </mesh>
      </group>

      {/* ── Wooden deck terrace ──────────────────────────────── */}
      <group position={[-4, -0.88, 0]}>
        {/* Terrace base */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3, 0.12, 4]} />
          <meshStandardMaterial
            color={woodColor}
            opacity={lerp(0.15, 1, str)}
            transparent
          />
        </mesh>
        {/* Plank lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={`plank-${i}`}
            position={[0, 0.07, -1.75 + i * 0.32]}
            receiveShadow
          >
            <boxGeometry args={[2.9, 0.02, 0.28]} />
            <meshStandardMaterial
              color={lerpColor('#3a3020', '#c4955c', str)}
              opacity={lerp(0.1, 1, str)}
              transparent
            />
          </mesh>
        ))}
        {/* Plank gaps (dark lines) */}
        {Array.from({ length: 11 }).map((_, i) => (
          <mesh
            key={`gap-${i}`}
            position={[0, 0.065, -1.59 + i * 0.32]}
          >
            <boxGeometry args={[2.9, 0.015, 0.02]} />
            <meshStandardMaterial color="#1a1208" opacity={lerp(0, 0.6, str)} transparent />
          </mesh>
        ))}
      </group>

      {/* ── Stone pathway (stepping stones) ──────────────────── */}
      {Array.from({ length: 10 }).map((_, i) => {
        const xOff = Math.sin(i * 1.3) * 0.15;
        const rot = (i * 0.7 - 1.5) * 0.15;
        return (
          <mesh
            key={`stone-${i}`}
            rotation={[-Math.PI / 2, rot, 0]}
            position={[-1 + xOff, -0.96, -4.5 + i * 0.95]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[lerp(0.15, 0.35, str), lerp(0.15, 0.4, str), 0.06, 8]} />
            <meshStandardMaterial
              color={stoneColor}
              roughness={0.8}
              opacity={lerp(0.15, 1, str)}
              transparent
            />
          </mesh>
        );
      })}

      {/* ── Trees ────────────────────────────────────────────── */}
      {/* Large deciduous tree */}
      <group position={[4, 0, -2]}>
        <mesh position={[0, lerp(-0.6, 0.4, plt), 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, lerp(0.4, 2.2, plt), 8]} />
          <meshStandardMaterial color={trunkColor} />
        </mesh>
        {[
          [0, 0, 0, 1.3],
          [-0.5, 0.3, 0.2, 0.8],
          [0.4, -0.2, -0.3, 0.9],
          [0.1, 0.5, 0.4, 0.7],
        ].map(([ox, oy, oz, s], i) => (
          <mesh
            key={`tree1-canopy-${i}`}
            position={[ox * lerp(0, 1, plt), lerp(-0.2, 2.0 + oy * 0.5, plt), oz * lerp(0, 1, plt)]}
            castShadow
          >
            <sphereGeometry args={[lerp(0.1, (s as number) * 0.7, plt), 12, 10]} />
            <meshStandardMaterial
              color={lerpColor('#4a3a1a', '#228822', plt)}
              opacity={lerp(0.15, 0.95, plt)}
              transparent
            />
          </mesh>
        ))}
      </group>

      {/* Medium tree */}
      <group position={[2, 0, 3.5]}>
        <mesh position={[0, lerp(-0.5, 0.2, plt), 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.14, lerp(0.3, 1.6, plt), 6]} />
          <meshStandardMaterial color={trunkColor} />
        </mesh>
        {[
          [0, 0, 0, 1.0],
          [-0.3, 0.2, 0.1, 0.7],
          [0.3, 0.1, -0.2, 0.65],
        ].map(([ox, oy, oz, s], i) => (
          <mesh
            key={`tree2-canopy-${i}`}
            position={[ox * lerp(0, 1, plt), lerp(-0.1, 1.4 + oy * 0.4, plt), oz * lerp(0, 1, plt)]}
            castShadow
          >
            <sphereGeometry args={[lerp(0.08, (s as number) * 0.55, plt), 10, 8]} />
            <meshStandardMaterial
              color={lerpColor('#4a3a1a', '#1a7a1a', plt)}
              opacity={lerp(0.15, 0.95, plt)}
              transparent
            />
          </mesh>
        ))}
      </group>

      {/* Cypress tree (cone shape) */}
      <group position={[5.5, 0, 1]}>
        <mesh position={[0, lerp(-0.5, 0.3, plt), 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, lerp(0.2, 1.2, plt), 6]} />
          <meshStandardMaterial color={trunkColor} />
        </mesh>
        <mesh position={[0, lerp(-0.2, 1.8, plt), 0]} castShadow>
          <coneGeometry args={[lerp(0.1, 0.5, plt), lerp(0.2, 2.4, plt), 8]} />
          <meshStandardMaterial
            color={lerpColor('#2a2a12', '#1a5a2a', plt)}
            opacity={lerp(0.15, 1, plt)}
            transparent
          />
        </mesh>
      </group>

      {/* Small cypress */}
      <group position={[5.5, 0, -1.5]}>
        <mesh position={[0, lerp(-0.5, 0.2, plt), 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, lerp(0.15, 0.8, plt), 6]} />
          <meshStandardMaterial color={trunkColor} />
        </mesh>
        <mesh position={[0, lerp(-0.2, 1.2, plt), 0]} castShadow>
          <coneGeometry args={[lerp(0.08, 0.35, plt), lerp(0.15, 1.8, plt), 8]} />
          <meshStandardMaterial
            color={lerpColor('#2a2a12', '#1a5a2a', plt)}
            opacity={lerp(0.12, 1, plt)}
            transparent
          />
        </mesh>
      </group>

      {/* ── Bushes / shrubs ──────────────────────────────────── */}
      {[
        [-3, -0.7, 0.5, 0.55],
        [-4.2, -0.7, -2, 0.45],
        [3.2, -0.7, 1.5, 0.5],
        [1.5, -0.7, -3.5, 0.4],
        [-2.5, -0.7, 3.2, 0.48],
        [0.5, -0.7, 4, 0.42],
      ].map(([x, y, z, s], i) => (
        <mesh
          key={`bush-${i}`}
          position={[x, lerp(y, -0.55, plt), z]}
          castShadow
        >
          <sphereGeometry args={[lerp(0.08, s as number, plt), 10, 8]} />
          <meshStandardMaterial
            color={lerpColor('#3a3a1a', i % 2 === 0 ? '#2d6b1e' : '#348828', plt)}
          />
        </mesh>
      ))}

      {/* ── Hedge row (back boundary) ────────────────────────── */}
      <group position={[2, lerp(-0.9, -0.4, plt), -5]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`hedge-${i}`} position={[-3 + i * 1.2, 0, 0]} castShadow>
            <sphereGeometry
              args={[lerp(0.1, 0.7, plt), 10, 8]}
            />
            <meshStandardMaterial color={hedgeColor} />
          </mesh>
        ))}
        {/* Hedge connector (stretched boxes) */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={`hedge-conn-${i}`} position={[-2.4 + i * 1.2, 0, 0]} castShadow>
            <boxGeometry args={[lerp(0.1, 0.8, plt), lerp(0.1, 1.0, plt), lerp(0.1, 0.8, plt)]} />
            <meshStandardMaterial color={hedgeColor} />
          </mesh>
        ))}
      </group>

      {/* ── Flower beds ──────────────────────────────────────── */}
      {/* Bed 1: along pathway */}
      {[
        { pos: [0.8, -0.92, -3], color: '#cc2222' },
        { pos: [1.1, -0.92, -2.2], color: '#ddaa00' },
        { pos: [0.9, -0.92, -1.5], color: '#aa22aa' },
        { pos: [1.2, -0.92, -0.7], color: '#dd3366' },
        { pos: [0.7, -0.92, 0.1], color: '#cc2222' },
        { pos: [1.0, -0.92, 0.8], color: '#ddaa00' },
        { pos: [0.85, -0.92, 1.6], color: '#9922cc' },
        { pos: [1.15, -0.92, 2.3], color: '#dd3366' },
      ].map((f, i) => (
        <group key={`flower-a-${i}`} position={f.pos as [number, number, number]}>
          {/* Stem */}
          <mesh position={[0, lerp(0, 0.08, plt), 0]}>
            <cylinderGeometry args={[0.01, 0.01, lerp(0, 0.16, plt), 4]} />
            <meshStandardMaterial color={lerpColor('#2a2a12', '#338833', plt)} />
          </mesh>
          {/* Flower head */}
          <mesh position={[0, lerp(0, 0.18, plt), 0]} castShadow>
            <sphereGeometry args={[lerp(0, 0.06, plt), 8, 6]} />
            <meshStandardMaterial
              color={lerpColor('#4a3a2a', f.color, plt)}
              opacity={lerp(0, 1, plt)}
              transparent
            />
          </mesh>
        </group>
      ))}

      {/* Bed 2: along house wall */}
      {[
        { pos: [-5.5, -0.92, -2.5], color: '#ff4466' },
        { pos: [-5.5, -0.92, -1.8], color: '#ffcc00' },
        { pos: [-5.5, -0.92, -1.1], color: '#cc44dd' },
        { pos: [-5.5, -0.92, 2.5], color: '#ff4466' },
        { pos: [-5.5, -0.92, 3.2], color: '#ffcc00' },
        { pos: [-5.5, -0.92, 3.9], color: '#dd3388' },
      ].map((f, i) => (
        <group key={`flower-b-${i}`} position={f.pos as [number, number, number]}>
          <mesh position={[0, lerp(0, 0.08, plt), 0]}>
            <cylinderGeometry args={[0.01, 0.01, lerp(0, 0.14, plt), 4]} />
            <meshStandardMaterial color={lerpColor('#2a2a12', '#338833', plt)} />
          </mesh>
          <mesh position={[0, lerp(0, 0.16, plt), 0]} castShadow>
            <sphereGeometry args={[lerp(0, 0.055, plt), 8, 6]} />
            <meshStandardMaterial
              color={lerpColor('#4a3a2a', f.color, plt)}
              opacity={lerp(0, 1, plt)}
              transparent
            />
          </mesh>
        </group>
      ))}

      {/* ── Wooden fence ─────────────────────────────────────── */}
      <group position={[0, 0, -4.5]}>
        {/* Posts */}
        {Array.from({ length: 11 }).map((_, i) => {
          const postHeight = lerp(0.15, 1.2, str);
          const lean = lerp((i % 3 - 1) * 0.3, 0, str);
          return (
            <mesh
              key={`fpost-${i}`}
              position={[-5 + i * 1.0, lerp(-1, -0.4, str), 0]}
              rotation={[lean * 0.1, 0, lean * 0.15]}
              castShadow
            >
              <boxGeometry args={[0.1, postHeight, 0.1]} />
              <meshStandardMaterial
                color={fenceWood}
                opacity={lerp(0.25, 1, str)}
                transparent
              />
            </mesh>
          );
        })}
        {/* Top rail */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={`frail-t-${i}`}
            position={[-4.5 + i * 1.0, lerp(-0.85, 0.0, str), 0]}
            castShadow
          >
            <boxGeometry args={[lerp(0.6, 0.95, str), 0.06, 0.06]} />
            <meshStandardMaterial
              color={fenceWood}
              opacity={lerp(0.15, 1, str)}
              transparent
            />
          </mesh>
        ))}
        {/* Bottom rail */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={`frail-b-${i}`}
            position={[-4.5 + i * 1.0, lerp(-0.95, -0.55, str), 0]}
            castShadow
          >
            <boxGeometry args={[lerp(0.5, 0.95, str), 0.06, 0.06]} />
            <meshStandardMaterial
              color={fenceWood}
              opacity={lerp(0.1, 1, str)}
              transparent
            />
          </mesh>
        ))}
      </group>

      {/* ── Garden table (on terrace) ────────────────────────── */}
      <group position={[-4, lerp(-1.5, -0.55, dec), -0.5]}>
        {/* Table top */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.06, 0.7]} />
          <meshStandardMaterial
            color={lerpColor('#2a2018', '#b08050', dec)}
            opacity={lerp(0, 1, dec)}
            transparent
          />
        </mesh>
        {/* Table legs */}
        {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([lx, lz], i) => (
          <mesh key={`tleg-${i}`} position={[lx, 0.05, lz]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, lerp(0, 0.55, dec), 6]} />
            <meshStandardMaterial
              color={lerpColor('#2a2018', '#9a7040', dec)}
              opacity={lerp(0, 1, dec)}
              transparent
            />
          </mesh>
        ))}
      </group>

      {/* ── Chairs (on terrace) ──────────────────────────────── */}
      {[[-4.8, -0.5], [-3.2, -0.5]].map(([cx, cz], ci) => (
        <group key={`chair-${ci}`} position={[cx, lerp(-1.5, -0.65, dec), cz]}>
          {/* Seat */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.04, 0.45]} />
            <meshStandardMaterial
              color={lerpColor('#2a2018', '#a07040', dec)}
              opacity={lerp(0, 1, dec)}
              transparent
            />
          </mesh>
          {/* Back rest */}
          <mesh position={[ci === 0 ? -0.2 : 0.2, 0.38, 0]} castShadow>
            <boxGeometry args={[0.04, 0.4, 0.42]} />
            <meshStandardMaterial
              color={lerpColor('#2a2018', '#a07040', dec)}
              opacity={lerp(0, 1, dec)}
              transparent
            />
          </mesh>
          {/* Legs */}
          {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([lx, lz], li) => (
            <mesh key={`cleg-${li}`} position={[lx, -0.05, lz]}>
              <cylinderGeometry args={[0.02, 0.02, lerp(0, 0.42, dec), 4]} />
              <meshStandardMaterial
                color={lerpColor('#2a2018', '#907038', dec)}
                opacity={lerp(0, 1, dec)}
                transparent
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Birdbath / water feature ─────────────────────────── */}
      <group position={[2.5, lerp(-1.2, -0.45, dec), 0.5]}>
        {/* Pedestal */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, lerp(0, 0.7, dec), 8]} />
          <meshStandardMaterial
            color={lerpColor('#4a4a3a', '#c8c0b0', dec)}
            opacity={lerp(0, 1, dec)}
            transparent
          />
        </mesh>
        {/* Bowl */}
        <mesh position={[0, lerp(0, 0.25, dec), 0]} castShadow>
          <cylinderGeometry args={[lerp(0, 0.35, dec), lerp(0, 0.15, dec), 0.12, 12]} />
          <meshStandardMaterial
            color={lerpColor('#4a4a3a', '#c8c0b0', dec)}
            opacity={lerp(0, 1, dec)}
            transparent
          />
        </mesh>
        {/* Water surface */}
        <mesh position={[0, lerp(0, 0.31, dec), 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[lerp(0, 0.3, dec), 12]} />
          <meshStandardMaterial
            color={lerpColor('#3a3a3a', '#5588bb', dec)}
            opacity={lerp(0, 0.7, dec)}
            transparent
            metalness={0.3}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ── Garden path lights ───────────────────────────────── */}
      {Array.from({ length: 5 }).map((_, i) => {
        const xOff = Math.sin(i * 1.3) * 0.15 + 0.6;
        return (
          <group
            key={`light-${i}`}
            position={[-0.5 + xOff, lerp(-1.1, -0.78, dec), -3.8 + i * 1.9]}
          >
            {/* Pole */}
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, lerp(0, 0.4, dec), 6]} />
              <meshStandardMaterial
                color={lerpColor('#3a3a3a', '#222222', dec)}
                metalness={0.6}
                opacity={lerp(0, 1, dec)}
                transparent
              />
            </mesh>
            {/* Light globe */}
            <mesh position={[0, lerp(0, 0.25, dec), 0]}>
              <sphereGeometry args={[lerp(0, 0.05, dec), 8, 6]} />
              <meshStandardMaterial
                color={lerpColor('#3a3a2a', '#ffeeaa', dec)}
                emissive={lerpColor('#000000', '#ffdd66', dec)}
                emissiveIntensity={lerp(0, 0.8, dec)}
                opacity={lerp(0, 1, dec)}
                transparent
              />
            </mesh>
            {/* Actual point light from globe */}
            {dec > 0.3 && (
              <pointLight
                position={[0, lerp(0, 0.25, dec), 0]}
                intensity={lerp(0, 0.3, dec)}
                distance={2}
                color="#ffdd88"
              />
            )}
          </group>
        );
      })}

      {/* ── Decorative gravel border (around terrace) ────────── */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const rx = Math.cos(angle) * 1.8;
        const rz = Math.sin(angle) * 2.3;
        return (
          <mesh
            key={`gravel-${i}`}
            position={[-4 + rx, -0.97, rz]}
            rotation={[-Math.PI / 2, angle, 0]}
            receiveShadow
          >
            <circleGeometry args={[lerp(0, 0.08, str), 6]} />
            <meshStandardMaterial
              color={lerpColor('#4a4a3a', '#c4bca8', str)}
              opacity={lerp(0, 0.8, str)}
              transparent
            />
          </mesh>
        );
      })}

      {/* ── Small rocks / rubble (fade out on renovation) ────── */}
      {[
        [1, -0.97, -1.5, 0.12],
        [3, -0.97, 0.5, 0.1],
        [-1, -0.97, 2, 0.09],
        [2, -0.97, -3, 0.11],
        [-3, -0.97, -3, 0.08],
      ].map(([x, y, z, s], i) => (
        <mesh
          key={`rubble-${i}`}
          position={[x, y, z]}
          rotation={[i * 0.5, i * 0.7, i * 0.3]}
        >
          <dodecahedronGeometry args={[lerp(s as number, 0, gnd), 0]} />
          <meshStandardMaterial
            color={lerpColor('#5a5040', '#5a5040', gnd)}
            opacity={lerp(0.8, 0, gnd)}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}
