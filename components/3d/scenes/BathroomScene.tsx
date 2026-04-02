'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/** Staggered progress: element appears between [start, end] of overall progress */
function stagger(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/** Generate tile grid positions */
function tileGrid(
  cols: number,
  rows: number,
  tileW: number,
  tileH: number,
  gap: number,
): [number, number][] {
  const positions: [number, number][] = [];
  const totalW = cols * tileW + (cols - 1) * gap;
  const totalH = rows * tileH + (rows - 1) * gap;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -totalW / 2 + tileW / 2 + c * (tileW + gap);
      const y = -totalH / 2 + tileH / 2 + r * (tileH + gap);
      positions.push([x, y]);
    }
  }
  return positions;
}

export default function BathroomScene({ progress }: SceneProps) {
  // --- Staggered sub-progresses ---
  const pStructure = stagger(progress, 0, 0.3);
  const pTiles = stagger(progress, 0.1, 0.5);
  const pFixtures = stagger(progress, 0.3, 0.7);
  const pShower = stagger(progress, 0.4, 0.8);
  const pDetails = stagger(progress, 0.6, 1.0);
  const pLighting = stagger(progress, 0.2, 0.9);

  // --- Colors ---
  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, pStructure);
  const floorColor = lerpColor(RUIN.floor, RENOVATED.floor, pStructure);
  const tileColor = lerpColor(RUIN.wall, '#f0ede6', pTiles);
  const groutColor = lerpColor(RUIN.dirt, '#d5d0c8', pTiles);
  const fixtureWhite = lerpColor(RUIN.accent, RENOVATED.clean, pFixtures);
  const chromeColor = lerpColor(RUIN.metal, '#e0e0e0', pFixtures);
  const vanityColor = lerpColor(RUIN.dirt, '#2c2c2c', pFixtures);
  const mirrorColor = lerpColor('#3a3530', '#c8dce8', pDetails);
  const frameColor = lerpColor(RUIN.metal, '#1a1a1a', pDetails);

  // Chrome material props
  const chromeMetalness = lerp(0.1, 0.95, pFixtures);
  const chromeRoughness = lerp(0.8, 0.05, pFixtures);

  // Room dimensions
  const roomW = 6;
  const roomD = 5;
  const roomH = 5;
  const floorY = -1;
  const ceilY = floorY + roomH;

  // Wall tile grid (back wall)
  const backWallTiles = tileGrid(18, 14, 0.3, 0.3, 0.02);
  // Side wall tile grid
  const sideWallTiles = tileGrid(15, 14, 0.3, 0.3, 0.02);

  return (
    <group>
      {/* ============ LIGHTING ============ */}
      <ambientLight intensity={lerp(0.2, 0.6, pLighting)} />
      <directionalLight
        position={[3, 5, 3]}
        intensity={lerp(0.2, 0.7, pLighting)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Warm atmospheric point light */}
      <pointLight
        position={[0, ceilY - 0.5, 0]}
        intensity={lerp(0.05, 0.6, pLighting)}
        color={lerpColor('#6b4a2a', '#fff0e0', pLighting)}
        distance={8}
        decay={2}
      />
      {/* Recessed ceiling light spot */}
      <spotLight
        position={[0, ceilY - 0.1, -0.5]}
        angle={Math.PI / 4}
        penumbra={0.6}
        intensity={lerp(0, 1.2, pDetails)}
        color="#fff5eb"
        castShadow
        target-position={[0, floorY, -0.5]}
      />
      {/* Shower area light */}
      <pointLight
        position={[2, ceilY - 1, -1.5]}
        intensity={lerp(0, 0.4, pShower)}
        color="#e8f0ff"
        distance={4}
        decay={2}
      />

      {/* ============ FLOOR ============ */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, floorY, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={lerp(0.9, 0.15, pStructure)}
          metalness={lerp(0, 0.05, pStructure)}
        />
      </mesh>

      {/* Floor drain (near shower) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[1.8, floorY + 0.005, -1.5]}
        receiveShadow
      >
        <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Drain grate lines */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, i) => (
        <mesh
          key={`drain-${i}`}
          rotation={[-Math.PI / 2, rot, 0]}
          position={[1.8, floorY + 0.01, -1.5]}
        >
          <boxGeometry args={[0.1, 0.005, 0.005]} />
          <meshStandardMaterial
            color={chromeColor}
            metalness={chromeMetalness}
            roughness={chromeRoughness}
          />
        </mesh>
      ))}

      {/* ============ CEILING ============ */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, ceilY, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, '#fafafa', pStructure)}
          roughness={0.9}
        />
      </mesh>

      {/* Recessed ceiling light fixture */}
      <mesh position={[0, ceilY - 0.05, -0.5]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial
          color={lerpColor('#333', '#ffffff', pDetails)}
          emissive={lerpColor('#000000', '#fff5eb', pDetails)}
          emissiveIntensity={lerp(0, 0.8, pDetails)}
        />
      </mesh>

      {/* ============ WALLS ============ */}
      {/* Back wall base */}
      <mesh position={[0, floorY + roomH / 2, -roomD / 2]} receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.85, 0.4, pStructure)} />
      </mesh>
      {/* Left wall base */}
      <mesh
        position={[-roomW / 2, floorY + roomH / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.85, 0.4, pStructure)} />
      </mesh>

      {/* ============ BACK WALL TILES ============ */}
      {backWallTiles.map(([tx, ty], i) => (
        <group key={`bwt-${i}`}>
          {/* Tile */}
          <mesh
            position={[tx, floorY + roomH / 2 + ty, -roomD / 2 + 0.005]}
            receiveShadow
          >
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial
              color={
                // Subtle alternating shade for visual interest
                (Math.floor(i / 18) + (i % 18)) % 2 === 0
                  ? tileColor
                  : lerpColor(RUIN.wall, '#ece8df', pTiles)
              }
              roughness={lerp(0.85, 0.2, pTiles)}
              metalness={lerp(0, 0.02, pTiles)}
            />
          </mesh>
        </group>
      ))}

      {/* Back wall grout overlay (visible grout lines = dark accents in ruin state) */}
      {/* Horizontal grout lines */}
      {Array.from({ length: 15 }).map((_, i) => {
        const y = floorY + 0.3 * i + 0.3;
        return (
          <mesh
            key={`bwg-h-${i}`}
            position={[0, y, -roomD / 2 + 0.003]}
          >
            <planeGeometry args={[roomW, 0.02]} />
            <meshStandardMaterial
              color={groutColor}
              roughness={0.9}
            />
          </mesh>
        );
      })}
      {/* Vertical grout lines */}
      {Array.from({ length: 19 }).map((_, i) => {
        const x = -roomW / 2 + 0.32 * i + 0.16;
        return (
          <mesh
            key={`bwg-v-${i}`}
            position={[x, floorY + roomH / 2, -roomD / 2 + 0.003]}
          >
            <planeGeometry args={[0.02, roomH]} />
            <meshStandardMaterial
              color={groutColor}
              roughness={0.9}
            />
          </mesh>
        );
      })}

      {/* ============ LEFT WALL TILES ============ */}
      {sideWallTiles.map(([tz, ty], i) => (
        <mesh
          key={`lwt-${i}`}
          position={[-roomW / 2 + 0.005, floorY + roomH / 2 + ty, tz]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial
            color={
              (Math.floor(i / 15) + (i % 15)) % 2 === 0
                ? tileColor
                : lerpColor(RUIN.wall, '#ece8df', pTiles)
            }
            roughness={lerp(0.85, 0.2, pTiles)}
          />
        </mesh>
      ))}

      {/* ============ WALK-IN SHOWER (Italian style) ============ */}
      {/* Shower tray / recessed floor */}
      <mesh
        position={[1.8, floorY + 0.02, -1.5]}
        receiveShadow
      >
        <boxGeometry args={[2.2, 0.04, 1.8]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.floor, '#e0ddd5', pShower)}
          roughness={lerp(0.9, 0.1, pShower)}
        />
      </mesh>
      {/* Shower tray lip */}
      <mesh position={[0.68, floorY + 0.06, -1.5]} castShadow>
        <boxGeometry args={[0.04, 0.12, 1.8]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.8, 0.15, pShower)}
        />
      </mesh>

      {/* Glass shower panel - transparent, appears with renovation */}
      <mesh
        position={[0.7, floorY + 1.1, -1.5]}
        castShadow
      >
        <boxGeometry args={[0.03, 2.1, 1.75]} />
        <meshPhysicalMaterial
          color={lerpColor('#4a4a3a', '#e8f4ff', pShower)}
          transparent
          opacity={lerp(0.05, 0.18, pShower)}
          roughness={lerp(0.9, 0.02, pShower)}
          metalness={lerp(0, 0.1, pShower)}
          transmission={lerp(0, 0.85, pShower)}
          thickness={0.03}
        />
      </mesh>
      {/* Glass panel top chrome rail */}
      <mesh position={[0.7, floorY + 2.15, -1.5]} castShadow>
        <boxGeometry args={[0.05, 0.04, 1.75]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Glass panel chrome clamp bottom */}
      <mesh position={[0.7, floorY + 0.15, -1.5]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Glass panel chrome clamp top */}
      <mesh position={[0.7, floorY + 2.0, -1.5]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>

      {/* Shower arm (horizontal pipe from wall) */}
      <mesh
        position={[2.2, floorY + 2.5, -1.5]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Rain showerhead (flat cylinder) */}
      <mesh
        position={[1.85, floorY + 2.5, -1.5]}
        castShadow
      >
        <cylinderGeometry args={[0.15, 0.15, 0.02, 24]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Showerhead face (bottom, dark dots illusion) */}
      <mesh position={[1.85, floorY + 2.49, -1.5]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.005, 24]} />
        <meshStandardMaterial
          color={lerpColor('#333', '#888888', pShower)}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Shower mixer valve (wall-mounted) */}
      <mesh position={[2.97, floorY + 1.4, -1.5]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Mixer handle */}
      <mesh
        position={[2.97, floorY + 1.4, -1.5]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <boxGeometry args={[0.14, 0.02, 0.02]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>

      {/* ============ WALL NICHE / SHELF (in shower area) ============ */}
      {/* Niche recess */}
      <mesh position={[2.98, floorY + 1.8, -1.5]}>
        <boxGeometry args={[0.1, 0.35, 0.5]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#d8d3ca', pDetails)}
          roughness={lerp(0.9, 0.15, pDetails)}
        />
      </mesh>
      {/* Niche shelf (horizontal divider) */}
      <mesh position={[2.95, floorY + 1.8, -1.5]}>
        <boxGeometry args={[0.08, 0.01, 0.48]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.metal, '#c0c0c0', pDetails)}
          metalness={lerp(0.1, 0.7, pDetails)}
          roughness={lerp(0.8, 0.2, pDetails)}
        />
      </mesh>
      {/* Niche frame top */}
      <mesh position={[2.96, floorY + 1.975, -1.5]}>
        <boxGeometry args={[0.09, 0.02, 0.52]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.8, 0.2, pDetails)} />
      </mesh>
      {/* Niche frame bottom */}
      <mesh position={[2.96, floorY + 1.625, -1.5]}>
        <boxGeometry args={[0.09, 0.02, 0.52]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.8, 0.2, pDetails)} />
      </mesh>

      {/* ============ FLOATING VANITY + VESSEL SINK ============ */}
      {/* Vanity cabinet (floating - wall-mounted) */}
      <mesh position={[-1.5, floorY + 1.0, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.45, 0.55]} />
        <meshStandardMaterial
          color={vanityColor}
          roughness={lerp(0.9, 0.3, pFixtures)}
          metalness={lerp(0, 0.05, pFixtures)}
        />
      </mesh>
      {/* Vanity countertop */}
      <mesh position={[-1.5, floorY + 1.24, -2.2]} castShadow>
        <boxGeometry args={[1.24, 0.03, 0.58]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.accent, '#f0ede6', pFixtures)}
          roughness={lerp(0.8, 0.08, pFixtures)}
          metalness={lerp(0, 0.03, pFixtures)}
        />
      </mesh>
      {/* Vanity handle (thin chrome bar) */}
      <mesh position={[-1.5, floorY + 0.85, -1.92]} castShadow>
        <boxGeometry args={[0.6, 0.015, 0.015]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>

      {/* Vessel sink basin (half-sphere effect: sphere clipped by countertop) */}
      <mesh position={[-1.5, floorY + 1.35, -2.2]} castShadow>
        <sphereGeometry args={[0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.7, 0.05, pFixtures)}
          metalness={lerp(0, 0.02, pFixtures)}
          side={2}
        />
      </mesh>
      {/* Sink rim */}
      <mesh
        position={[-1.5, floorY + 1.35, -2.2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.2, 0.012, 8, 24]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.7, 0.05, pFixtures)}
        />
      </mesh>

      {/* Sink faucet - base */}
      <mesh position={[-1.5, floorY + 1.26, -2.42]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 0.04, 12]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Faucet vertical stem */}
      <mesh position={[-1.5, floorY + 1.46, -2.42]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.38, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Faucet spout (horizontal) */}
      <mesh
        position={[-1.5, floorY + 1.63, -2.33]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.01, 0.18, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Faucet handle */}
      <mesh
        position={[-1.3, floorY + 1.38, -2.42]}
        rotation={[0, 0, Math.PI / 4]}
        castShadow
      >
        <boxGeometry args={[0.08, 0.015, 0.015]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>

      {/* ============ LARGE MIRROR WITH FRAME ============ */}
      {/* Mirror frame */}
      <mesh position={[-1.5, floorY + 2.3, -2.47]} castShadow>
        <boxGeometry args={[1.0, 1.2, 0.04]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={lerp(0.7, 0.3, pDetails)}
          metalness={lerp(0.1, 0.4, pDetails)}
        />
      </mesh>
      {/* Mirror surface */}
      <mesh position={[-1.5, floorY + 2.3, -2.44]}>
        <planeGeometry args={[0.9, 1.1]} />
        <meshStandardMaterial
          color={mirrorColor}
          metalness={lerp(0.2, 0.95, pDetails)}
          roughness={lerp(0.6, 0.02, pDetails)}
        />
      </mesh>

      {/* ============ WALL-MOUNTED TOILET ============ */}
      {/* Concealed cistern (in-wall, visible as flush plate only) */}
      {/* Toilet bowl back (attached to wall) */}
      <mesh position={[-2.7, floorY + 0.5, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.35, 0.55]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.7, 0.08, pFixtures)}
        />
      </mesh>
      {/* Toilet bowl front (rounded look with cylinder) */}
      <mesh
        position={[-2.55, floorY + 0.42, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.2, 0.22, 0.3, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.7, 0.08, pFixtures)}
          side={2}
        />
      </mesh>
      {/* Toilet seat */}
      <mesh
        position={[-2.55, floorY + 0.68, 1.2]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        castShadow
      >
        <torusGeometry args={[0.18, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.6, 0.1, pFixtures)}
        />
      </mesh>
      {/* Toilet lid (flat on top) */}
      <mesh
        position={[-2.65, floorY + 0.72, 1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.2, 0.2, 0.02, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial
          color={fixtureWhite}
          roughness={lerp(0.6, 0.1, pFixtures)}
        />
      </mesh>
      {/* Flush plate on wall */}
      <mesh position={[-2.97, floorY + 1.2, 1.2]}>
        <boxGeometry args={[0.02, 0.2, 0.3]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Flush plate buttons (two buttons) */}
      <mesh position={[-2.95, floorY + 1.2, 1.12]}>
        <boxGeometry args={[0.01, 0.14, 0.06]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.metal, '#f0f0f0', pFixtures)}
          metalness={lerp(0.2, 0.8, pFixtures)}
          roughness={lerp(0.7, 0.1, pFixtures)}
        />
      </mesh>
      <mesh position={[-2.95, floorY + 1.2, 1.28]}>
        <boxGeometry args={[0.01, 0.14, 0.06]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.metal, '#f0f0f0', pFixtures)}
          metalness={lerp(0.2, 0.8, pFixtures)}
          roughness={lerp(0.7, 0.1, pFixtures)}
        />
      </mesh>

      {/* ============ TOWEL RACK ============ */}
      {/* Wall bracket left */}
      <mesh position={[-2.97, floorY + 1.6, -0.4]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Wall bracket right */}
      <mesh position={[-2.97, floorY + 1.6, 0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Arm left (sticking out from wall) */}
      <mesh
        position={[-2.85, floorY + 1.6, -0.4]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Arm right */}
      <mesh
        position={[-2.85, floorY + 1.6, 0.2]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Horizontal towel bar */}
      <mesh
        position={[-2.75, floorY + 1.6, -0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Towel (draped box - simplified) */}
      <mesh position={[-2.72, floorY + 1.35, -0.1]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.5]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.accent, '#f5f5f0', pDetails)}
          roughness={lerp(0.95, 0.7, pDetails)}
        />
      </mesh>

      {/* Second towel bar (lower, for hand towel) */}
      <mesh
        position={[-2.75, floorY + 1.0, -0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Wall brackets for lower bar */}
      <mesh
        position={[-2.85, floorY + 1.0, -0.28]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      <mesh
        position={[-2.85, floorY + 1.0, 0.08]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Hand towel */}
      <mesh position={[-2.72, floorY + 0.82, -0.1]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.3]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.floor, '#e0ddd5', pDetails)}
          roughness={lerp(0.95, 0.7, pDetails)}
        />
      </mesh>

      {/* ============ TOILET PAPER HOLDER ============ */}
      {/* Bracket */}
      <mesh position={[-2.97, floorY + 0.8, 0.7]}>
        <boxGeometry args={[0.02, 0.04, 0.12]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Roll holder arm */}
      <mesh
        position={[-2.85, floorY + 0.8, 0.7]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
        <meshStandardMaterial
          color={chromeColor}
          metalness={chromeMetalness}
          roughness={chromeRoughness}
        />
      </mesh>
      {/* Toilet paper roll */}
      <mesh
        position={[-2.83, floorY + 0.8, 0.7]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
        <meshStandardMaterial
          color={lerpColor('#8a7a6a', '#f8f8f5', pDetails)}
          roughness={0.9}
        />
      </mesh>

      {/* ============ WALL NICHE ON LEFT WALL (decorative) ============ */}
      {/* Niche recess */}
      <mesh
        position={[-2.97, floorY + 2.0, -1.0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[0.4, 0.5, 0.08]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#e8e4dc', pDetails)}
          roughness={lerp(0.9, 0.15, pDetails)}
        />
      </mesh>
      {/* Niche frame (4 sides) */}
      <mesh position={[-2.96, floorY + 2.25, -1.0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.44, 0.02, 0.06]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.8, 0.2, pDetails)} />
      </mesh>
      <mesh position={[-2.96, floorY + 1.75, -1.0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.44, 0.02, 0.06]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.8, 0.2, pDetails)} />
      </mesh>
      <mesh position={[-2.96, floorY + 2.0, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.06]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.8, 0.2, pDetails)} />
      </mesh>
      <mesh position={[-2.96, floorY + 2.0, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.06]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.8, 0.2, pDetails)} />
      </mesh>

      {/* ============ BASEBOARD / PLINTH ============ */}
      {/* Back wall baseboard */}
      <mesh position={[0, floorY + 0.05, -2.48]}>
        <boxGeometry args={[roomW, 0.1, 0.04]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#e8e4dc', pStructure)}
          roughness={lerp(0.9, 0.3, pStructure)}
        />
      </mesh>
      {/* Left wall baseboard */}
      <mesh position={[-2.98, floorY + 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomD, 0.1, 0.04]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#e8e4dc', pStructure)}
          roughness={lerp(0.9, 0.3, pStructure)}
        />
      </mesh>
    </group>
  );
}
