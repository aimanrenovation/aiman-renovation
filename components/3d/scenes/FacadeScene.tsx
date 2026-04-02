'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/* ── Helpers for staggered sub-animations ─────────────────────── */
function stage(p: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (p - start) / (end - start)));
}

/* ── Dimensions ───────────────────────────────────────────────── */
const WALL_W = 8;
const WALL_H = 6.5;
const WALL_D = 0.3;
const WALL_Y = WALL_H / 2 - 2; // base at y = -2

const FLOOR_Y = -2;

/* window grid */
const WIN_W = 1.1;
const WIN_H = 1.5;
const WIN_POSITIONS: [number, number][] = [
  [-2.2, 2.8],
  [2.2, 2.8],
  [-2.2, 0.2],
  [2.2, 0.2],
];

export default function FacadeScene({ progress }: SceneProps) {
  /* ── Staged progress values ──────────────────────────────────── */
  const pInsulation = stage(progress, 0.25, 0.55);
  const pRendering = stage(progress, 0.55, 0.85);
  const pDetails = stage(progress, 0.4, 1.0);
  const pShutters = stage(progress, 0.5, 0.9);
  const pCracks = 1 - stage(progress, 0.0, 0.5);
  const pGarden = stage(progress, 0.6, 1.0);
  const pClean = stage(progress, 0.3, 1.0);

  /* ── Derived colours ─────────────────────────────────────────── */
  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, pClean);
  const roofColor = lerpColor('#5a4a3a', '#8B4513', progress);
  const doorColor = lerpColor('#3a2a1a', '#E50000', pDetails);
  const shutterColor = lerpColor(RUIN.accent, '#2e5e4e', pShutters);
  const glassColor = lerpColor('#4a4a40', '#88bbdd', progress);
  const metalColor = lerpColor(RUIN.metal, RENOVATED.metal, pDetails);
  const groundColor = lerpColor('#3d3428', '#999', progress);
  const grassColor = lerpColor('#3a4a2a', '#4a8a3a', pGarden);
  const gutterColor = lerpColor(RUIN.metal, '#7a7a7a', pDetails);

  const FACADE_Z = -3;
  const FRONT_Z = FACADE_Z + WALL_D / 2 + 0.01;

  /* insulation + rendering layer thicknesses */
  const insulThick = lerp(0, 0.12, pInsulation);
  const renderThick = lerp(0, 0.04, pRendering);
  const totalSkin = WALL_D / 2 + insulThick + renderThick;
  const skinFrontZ = FACADE_Z + totalSkin;

  return (
    <group>
      {/* ════════ LIGHTING ════════ */}
      <ambientLight intensity={lerp(0.35, 0.7, progress)} />
      <directionalLight
        position={[6, 10, 8]}
        intensity={lerp(0.4, 1.2, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight
        args={[
          lerpColor('#6688aa', '#87CEEB', progress),
          lerpColor('#2a3a1f', '#3a5a2f', progress),
          lerp(0.25, 0.55, progress),
        ]}
      />
      {/* Fill light from the left */}
      <directionalLight position={[-4, 3, 5]} intensity={lerp(0.1, 0.3, progress)} />

      {/* ════════ GROUND / SIDEWALK ════════ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={groundColor} roughness={0.9} />
      </mesh>

      {/* Sidewalk strip */}
      <mesh position={[0, FLOOR_Y + 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 2]} />
        <meshStandardMaterial color={lerpColor('#555', '#bbb', progress)} roughness={0.8} />
      </mesh>

      {/* ════════ MAIN WALL (base masonry) ════════ */}
      <mesh position={[0, WALL_Y, FACADE_Z]} castShadow receiveShadow>
        <boxGeometry args={[WALL_W, WALL_H, WALL_D]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={lerp(0.95, 0.55, progress)}
        />
      </mesh>

      {/* ════════ ITE INSULATION LAYER ════════ */}
      {pInsulation > 0 && (
        <mesh
          position={[0, WALL_Y, FACADE_Z + WALL_D / 2 + insulThick / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[WALL_W + 0.02, WALL_H + 0.02, insulThick]} />
          <meshStandardMaterial
            color="#f5e6c8"
            roughness={0.8}
            opacity={lerp(0.3, 0.85, pInsulation)}
            transparent
          />
        </mesh>
      )}

      {/* Insulation panel grid lines (visible during mid-progress) */}
      {pInsulation > 0.1 && pInsulation < 0.95 && (
        <group position={[0, WALL_Y, FACADE_Z + WALL_D / 2 + insulThick + 0.005]}>
          {[-2.6, -1.3, 0, 1.3, 2.6].map((x) => (
            <mesh key={`iv-${x}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.02, WALL_H, 0.005]} />
              <meshStandardMaterial color="#c4a86a" />
            </mesh>
          ))}
          {[-1.8, -0.5, 0.8, 2.1].map((y) => (
            <mesh key={`ih-${y}`} position={[0, y, 0]}>
              <boxGeometry args={[WALL_W, 0.02, 0.005]} />
              <meshStandardMaterial color="#c4a86a" />
            </mesh>
          ))}
        </group>
      )}

      {/* ════════ RENDERING COAT ════════ */}
      {pRendering > 0 && (
        <mesh
          position={[0, WALL_Y, FACADE_Z + WALL_D / 2 + insulThick + renderThick / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[WALL_W + 0.04, WALL_H + 0.04, renderThick]} />
          <meshStandardMaterial
            color={lerpColor('#e8e0d0', RENOVATED.wall, pRendering)}
            roughness={lerp(0.7, 0.35, pRendering)}
            opacity={lerp(0.2, 1, pRendering)}
            transparent
          />
        </mesh>
      )}

      {/* ════════ CRACKS / DAMAGE OVERLAYS ════════ */}
      {pCracks > 0.05 && (
        <group position={[0, WALL_Y, skinFrontZ + 0.01]}>
          {/* Diagonal crack top-left */}
          <mesh position={[-2.5, 2.2, 0]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[1.8, 0.04, 0.005]} />
            <meshStandardMaterial color={RUIN.dirt} opacity={pCracks * 0.9} transparent />
          </mesh>
          {/* Horizontal crack mid */}
          <mesh position={[1.5, 0.8, 0]}>
            <boxGeometry args={[2.2, 0.03, 0.005]} />
            <meshStandardMaterial color={RUIN.dirt} opacity={pCracks * 0.8} transparent />
          </mesh>
          {/* Branch crack */}
          <mesh position={[-0.8, -0.5, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[1.4, 0.035, 0.005]} />
            <meshStandardMaterial color={RUIN.dirt} opacity={pCracks * 0.85} transparent />
          </mesh>
          <mesh position={[-0.3, -0.9, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.9, 0.03, 0.005]} />
            <meshStandardMaterial color={RUIN.dirt} opacity={pCracks * 0.7} transparent />
          </mesh>
          {/* Damp patch top-right */}
          <mesh position={[3.0, 2.5, 0]}>
            <boxGeometry args={[1.4, 1.0, 0.005]} />
            <meshStandardMaterial color="#3a3020" opacity={pCracks * 0.35} transparent />
          </mesh>
          {/* Damp patch bottom */}
          <mesh position={[-1.5, -1.6, 0]}>
            <boxGeometry args={[2.0, 0.8, 0.005]} />
            <meshStandardMaterial color="#3a3520" opacity={pCracks * 0.3} transparent />
          </mesh>
        </group>
      )}

      {/* ════════ WINDOWS (4x) ════════ */}
      {WIN_POSITIONS.map(([wx, wy], i) => {
        const winZ = skinFrontZ + 0.02;
        const frameD = 0.06;
        const frameW = 0.08;
        const shutterOpen = lerp(0, Math.PI / 2.5, pShutters);

        return (
          <group key={`win-${i}`} position={[wx, wy, winZ]}>
            {/* Window recess (dark backing) */}
            <mesh position={[0, 0, -0.04]} receiveShadow>
              <boxGeometry args={[WIN_W + 0.04, WIN_H + 0.04, 0.08]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>

            {/* Glass pane */}
            <mesh receiveShadow>
              <planeGeometry args={[WIN_W - 0.04, WIN_H - 0.04]} />
              <meshStandardMaterial
                color={glassColor}
                metalness={lerp(0.1, 0.4, progress)}
                roughness={lerp(0.8, 0.15, progress)}
                opacity={lerp(0.5, 0.7, progress)}
                transparent
              />
            </mesh>

            {/* Glazing bars (cross) */}
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[WIN_W - 0.04, 0.03, 0.02]} />
              <meshStandardMaterial color={metalColor} />
            </mesh>
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[0.03, WIN_H - 0.04, 0.02]} />
              <meshStandardMaterial color={metalColor} />
            </mesh>

            {/* Frame – top */}
            <mesh position={[0, WIN_H / 2, 0]} castShadow>
              <boxGeometry args={[WIN_W + frameW, frameW, frameD]} />
              <meshStandardMaterial color={metalColor} />
            </mesh>
            {/* Frame – bottom */}
            <mesh position={[0, -WIN_H / 2, 0]} castShadow>
              <boxGeometry args={[WIN_W + frameW, frameW, frameD]} />
              <meshStandardMaterial color={metalColor} />
            </mesh>
            {/* Frame – left */}
            <mesh position={[-WIN_W / 2, 0, 0]} castShadow>
              <boxGeometry args={[frameW, WIN_H, frameD]} />
              <meshStandardMaterial color={metalColor} />
            </mesh>
            {/* Frame – right */}
            <mesh position={[WIN_W / 2, 0, 0]} castShadow>
              <boxGeometry args={[frameW, WIN_H, frameD]} />
              <meshStandardMaterial color={metalColor} />
            </mesh>

            {/* Window sill */}
            <mesh position={[0, -WIN_H / 2 - 0.06, 0.04]} castShadow receiveShadow>
              <boxGeometry args={[WIN_W + 0.3, 0.06, 0.14]} />
              <meshStandardMaterial color={lerpColor('#666', '#ddd', pDetails)} roughness={0.6} />
            </mesh>

            {/* Left shutter */}
            <group position={[-WIN_W / 2 - 0.04, 0, 0.02]}>
              <group rotation={[0, -shutterOpen, 0]}>
                <mesh position={[-0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.4, WIN_H + 0.08, 0.04]} />
                  <meshStandardMaterial
                    color={shutterColor}
                    opacity={lerp(0.15, 1, pShutters)}
                    transparent
                  />
                </mesh>
                {/* Shutter slats */}
                {[-0.45, -0.25, -0.05, 0.15, 0.35].map((sy) => (
                  <mesh key={`sl-${sy}`} position={[-0.2, sy, 0.025]} castShadow>
                    <boxGeometry args={[0.34, 0.06, 0.005]} />
                    <meshStandardMaterial
                      color={lerpColor(shutterColor, '#1e4e3e', 0.3)}
                      opacity={lerp(0.1, 1, pShutters)}
                      transparent
                    />
                  </mesh>
                ))}
              </group>
            </group>

            {/* Right shutter */}
            <group position={[WIN_W / 2 + 0.04, 0, 0.02]}>
              <group rotation={[0, shutterOpen, 0]}>
                <mesh position={[0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.4, WIN_H + 0.08, 0.04]} />
                  <meshStandardMaterial
                    color={shutterColor}
                    opacity={lerp(0.15, 1, pShutters)}
                    transparent
                  />
                </mesh>
                {[-0.45, -0.25, -0.05, 0.15, 0.35].map((sy) => (
                  <mesh key={`sr-${sy}`} position={[0.2, sy, 0.025]} castShadow>
                    <boxGeometry args={[0.34, 0.06, 0.005]} />
                    <meshStandardMaterial
                      color={lerpColor(shutterColor, '#1e4e3e', 0.3)}
                      opacity={lerp(0.1, 1, pShutters)}
                      transparent
                    />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        );
      })}

      {/* ════════ FRONT DOOR ════════ */}
      <group position={[0, -0.65, skinFrontZ + 0.02]}>
        {/* Door recess */}
        <mesh position={[0, 0, -0.06]} receiveShadow>
          <boxGeometry args={[1.2, 2.6, 0.12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Door panel */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 2.4, 0.08]} />
          <meshStandardMaterial
            color={doorColor}
            roughness={lerp(0.85, 0.4, pDetails)}
          />
        </mesh>

        {/* Door panels (raised insets) */}
        <mesh position={[0, 0.55, 0.045]}>
          <boxGeometry args={[0.7, 0.8, 0.015]} />
          <meshStandardMaterial color={lerpColor('#2a1a0a', '#cc0000', pDetails)} />
        </mesh>
        <mesh position={[0, -0.35, 0.045]}>
          <boxGeometry args={[0.7, 0.9, 0.015]} />
          <meshStandardMaterial color={lerpColor('#2a1a0a', '#cc0000', pDetails)} />
        </mesh>

        {/* Door frame – top */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.1]} />
          <meshStandardMaterial color={lerpColor('#555', '#eee', pDetails)} />
        </mesh>
        {/* Door frame – left */}
        <mesh position={[-0.55, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 2.5, 0.1]} />
          <meshStandardMaterial color={lerpColor('#555', '#eee', pDetails)} />
        </mesh>
        {/* Door frame – right */}
        <mesh position={[0.55, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 2.5, 0.1]} />
          <meshStandardMaterial color={lerpColor('#555', '#eee', pDetails)} />
        </mesh>

        {/* Door handle */}
        <mesh position={[0.35, -0.1, 0.07]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <meshStandardMaterial
            color={lerpColor('#4a3a2a', '#d4af37', pDetails)}
            metalness={lerp(0.2, 0.8, pDetails)}
            roughness={lerp(0.8, 0.3, pDetails)}
          />
        </mesh>
        {/* Handle plate */}
        <mesh position={[0.35, -0.1, 0.05]} castShadow>
          <boxGeometry args={[0.08, 0.22, 0.02]} />
          <meshStandardMaterial
            color={lerpColor('#4a3a2a', '#c0a030', pDetails)}
            metalness={lerp(0.2, 0.7, pDetails)}
          />
        </mesh>

        {/* Doorstep */}
        <mesh position={[0, -1.25, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.08, 0.3]} />
          <meshStandardMaterial color={lerpColor('#555', '#aaa', pDetails)} roughness={0.7} />
        </mesh>
      </group>

      {/* ════════ HOUSE NUMBER PLATE ════════ */}
      <group position={[0.8, 0.8, skinFrontZ + 0.04]}>
        {/* Plate background */}
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshStandardMaterial
            color={lerpColor('#5a5040', '#1a3a6a', pDetails)}
            roughness={0.4}
            opacity={lerp(0.4, 1, pDetails)}
            transparent
          />
        </mesh>
        {/* Number "17" using thin boxes */}
        <mesh position={[-0.05, 0, 0.015]}>
          <boxGeometry args={[0.03, 0.12, 0.005]} />
          <meshStandardMaterial color={lerpColor('#888', '#fff', pDetails)} />
        </mesh>
        <mesh position={[0.05, 0, 0.015]}>
          <boxGeometry args={[0.03, 0.12, 0.005]} />
          <meshStandardMaterial color={lerpColor('#888', '#fff', pDetails)} />
        </mesh>
        <mesh position={[0.05, 0.055, 0.015]}>
          <boxGeometry args={[0.08, 0.02, 0.005]} />
          <meshStandardMaterial color={lerpColor('#888', '#fff', pDetails)} />
        </mesh>
      </group>

      {/* ════════ OUTDOOR LIGHT FIXTURE ════════ */}
      <group position={[-0.85, 0.5, skinFrontZ + 0.08]}>
        {/* Wall mount bracket */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.08, 0.06]} />
          <meshStandardMaterial color={lerpColor('#444', '#222', pDetails)} metalness={0.5} />
        </mesh>
        {/* Arm */}
        <mesh position={[0, -0.06, 0.06]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.12]} />
          <meshStandardMaterial color={lerpColor('#444', '#222', pDetails)} metalness={0.5} />
        </mesh>
        {/* Lantern body */}
        <mesh position={[0, -0.06, 0.14]} castShadow>
          <boxGeometry args={[0.12, 0.18, 0.1]} />
          <meshStandardMaterial
            color={lerpColor('#3a3a3a', '#1a1a1a', pDetails)}
            metalness={0.4}
          />
        </mesh>
        {/* Lantern glass */}
        <mesh position={[0, -0.06, 0.2]}>
          <boxGeometry args={[0.08, 0.12, 0.01]} />
          <meshStandardMaterial
            color={lerpColor('#665520', '#ffdd66', pDetails)}
            emissive={lerpColor('#000000', '#ffcc33', pDetails)}
            emissiveIntensity={lerp(0, 0.6, pDetails)}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Lantern top */}
        <mesh position={[0, 0.04, 0.14]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.12]} />
          <meshStandardMaterial color={lerpColor('#444', '#222', pDetails)} metalness={0.5} />
        </mesh>
      </group>

      {/* ════════ PITCHED ROOF ════════ */}
      <group position={[0, WALL_H - 2 + 0.15, FACADE_Z]}>
        {/* Left roof slope */}
        <mesh
          position={[-2.2, 1.1, 0]}
          rotation={[0, 0, 0.55]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4.8, 0.12, 2.2]} />
          <meshStandardMaterial color={roofColor} roughness={lerp(0.9, 0.6, progress)} />
        </mesh>
        {/* Right roof slope */}
        <mesh
          position={[2.2, 1.1, 0]}
          rotation={[0, 0, -0.55]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4.8, 0.12, 2.2]} />
          <meshStandardMaterial color={roofColor} roughness={lerp(0.9, 0.6, progress)} />
        </mesh>
        {/* Ridge beam */}
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[0.14, 0.14, 2.4]} />
          <meshStandardMaterial color={lerpColor('#4a3a2a', '#6a4a2a', progress)} />
        </mesh>

        {/* Left gable triangle fill */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[WALL_W, 0.06, 0.1]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>

        {/* Gutter – left side (thin box along bottom edge of left slope) */}
        <mesh position={[-WALL_W / 2 + 0.3, -0.05, 0.95]} castShadow>
          <boxGeometry args={[0.12, 0.1, 2.2]} />
          <meshStandardMaterial color={gutterColor} metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Gutter – right side */}
        <mesh position={[WALL_W / 2 - 0.3, -0.05, 0.95]} castShadow>
          <boxGeometry args={[0.12, 0.1, 2.2]} />
          <meshStandardMaterial color={gutterColor} metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Gutter front horizontal */}
        <mesh position={[0, -0.05, 1.05]} castShadow>
          <boxGeometry args={[WALL_W - 0.2, 0.08, 0.08]} />
          <meshStandardMaterial color={gutterColor} metalness={0.3} roughness={0.5} />
        </mesh>

        {/* Roof overhang fascia */}
        <mesh position={[0, -0.12, 1.1]} castShadow>
          <boxGeometry args={[WALL_W + 0.6, 0.15, 0.04]} />
          <meshStandardMaterial color={lerpColor('#5a4a3a', '#f0ebe0', progress)} />
        </mesh>
      </group>

      {/* ════════ DRAINPIPE (right side) ════════ */}
      <group position={[WALL_W / 2 - 0.2, WALL_Y - 0.3, skinFrontZ + 0.06]}>
        {/* Vertical pipe */}
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, WALL_H - 0.5, 8]} />
          <meshStandardMaterial color={gutterColor} metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Pipe brackets */}
        {[-1.5, 0, 1.5].map((by) => (
          <mesh key={`pb-${by}`} position={[0, by, -0.03]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshStandardMaterial color={gutterColor} metalness={0.4} />
          </mesh>
        ))}
        {/* Top bend towards gutter */}
        <mesh position={[0.08, WALL_H / 2 - 0.5, 0]} rotation={[0, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshStandardMaterial color={gutterColor} metalness={0.3} />
        </mesh>
        {/* Bottom elbow */}
        <mesh
          position={[0.06, -WALL_H / 2 + 0.5, 0.04]}
          rotation={[0.6, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
          <meshStandardMaterial color={gutterColor} metalness={0.3} />
        </mesh>
      </group>

      {/* ════════ FRONT GARDEN AREA ════════ */}
      <group position={[0, FLOOR_Y, 2.5]}>
        {/* Grass ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[8, 3]} />
          <meshStandardMaterial color={grassColor} roughness={0.95} />
        </mesh>

        {/* Garden border stones */}
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={`stone-${i}`}
            position={[-4 + i * 1, 0.04, -1.5]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.9, 0.08, 0.15]} />
            <meshStandardMaterial
              color={lerpColor('#666', '#bbb', pGarden)}
              roughness={0.8}
            />
          </mesh>
        ))}

        {/* Small fence – posts */}
        {[-3.5, -2.5, -1.5, 1.5, 2.5, 3.5].map((fx) => (
          <mesh key={`fp-${fx}`} position={[fx, 0.25, 1.3]} castShadow>
            <boxGeometry args={[0.06, 0.5, 0.06]} />
            <meshStandardMaterial
              color={lerpColor('#5a4a3a', '#ddd', pGarden)}
              opacity={lerp(0.3, 1, pGarden)}
              transparent
            />
          </mesh>
        ))}
        {/* Fence rails */}
        {[0.15, 0.35].map((fy) => (
          <group key={`fr-${fy}`}>
            {/* Left section */}
            <mesh position={[-2.5, fy, 1.3]} castShadow>
              <boxGeometry args={[2.2, 0.04, 0.03]} />
              <meshStandardMaterial
                color={lerpColor('#5a4a3a', '#ddd', pGarden)}
                opacity={lerp(0.3, 1, pGarden)}
                transparent
              />
            </mesh>
            {/* Right section */}
            <mesh position={[2.5, fy, 1.3]} castShadow>
              <boxGeometry args={[2.2, 0.04, 0.03]} />
              <meshStandardMaterial
                color={lerpColor('#5a4a3a', '#ddd', pGarden)}
                opacity={lerp(0.3, 1, pGarden)}
                transparent
              />
            </mesh>
          </group>
        ))}

        {/* Gate (center opening) */}
        <mesh position={[0, 0.22, 1.3]} castShadow>
          <boxGeometry args={[1.0, 0.45, 0.04]} />
          <meshStandardMaterial
            color={lerpColor('#4a3a2a', metalColor, pGarden)}
            metalness={lerp(0.1, 0.5, pGarden)}
            opacity={lerp(0.2, 1, pGarden)}
            transparent
          />
        </mesh>
        {/* Gate posts */}
        {[-0.55, 0.55].map((gx) => (
          <mesh key={`gp-${gx}`} position={[gx, 0.3, 1.3]} castShadow>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshStandardMaterial
              color={lerpColor('#555', '#ccc', pGarden)}
              opacity={lerp(0.3, 1, pGarden)}
              transparent
            />
          </mesh>
        ))}

        {/* Mailbox */}
        <group position={[3.8, 0.6, 1.3]}>
          {/* Post */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.06, 0.6, 0.06]} />
            <meshStandardMaterial color={lerpColor('#555', '#333', pGarden)} />
          </mesh>
          {/* Box body */}
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.2, 0.18]} />
            <meshStandardMaterial
              color={lerpColor('#5a4a3a', '#1a4a8a', pGarden)}
              roughness={0.5}
            />
          </mesh>
          {/* Mail slot */}
          <mesh position={[0, 0.02, 0.095]}>
            <boxGeometry args={[0.16, 0.03, 0.005]} />
            <meshStandardMaterial color={lerpColor('#333', '#111', pGarden)} />
          </mesh>
          {/* Mailbox top */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.27, 0.03, 0.2]} />
            <meshStandardMaterial color={lerpColor('#4a3a2a', '#153a6a', pGarden)} />
          </mesh>
        </group>
      </group>

      {/* ════════ FOUNDATION / PLINTH ════════ */}
      <mesh position={[0, FLOOR_Y + 0.15, skinFrontZ]} castShadow receiveShadow>
        <boxGeometry args={[WALL_W + 0.1, 0.3, 0.08]} />
        <meshStandardMaterial
          color={lerpColor('#4a4a4a', '#888', pClean)}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
