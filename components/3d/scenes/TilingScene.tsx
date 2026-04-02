'use client';

import { useMemo } from 'react';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

/* ── Tile colors ── */
const TILE_CREAM = '#e8dfd2';
const TILE_BEIGE = '#d4c9b8';
const WALL_TILE_LIGHT = '#f0ece6';
const WALL_TILE_WARM = '#e5ddd2';
const SUBFLOOR_COLOR = '#1a1410';
const GROUT_RENO = '#c8bfb2';
const GROUT_RUIN = '#2a2015';

/* ── Dimensions ── */
const FLOOR_TILE = 0.48;
const FLOOR_GAP = 0.04;
const FLOOR_STEP = FLOOR_TILE + FLOOR_GAP;
const FLOOR_THICK = 0.04;

const WALL_TILE_W = 0.3;
const WALL_TILE_H = 0.2;
const WALL_GAP = 0.03;
const WALL_STEP_X = WALL_TILE_W + WALL_GAP;
const WALL_STEP_Y = WALL_TILE_H + WALL_GAP;
const WALL_THICK = 0.02;

interface FloorTile {
  x: number;
  z: number;
  col: number;
  row: number;
  checker: boolean;
  dist: number;
}

interface WallTile {
  x: number;
  y: number;
  col: number;
  row: number;
  alt: boolean;
  dist: number;
}

function buildFloorGrid(): FloorTile[] {
  const tiles: FloorTile[] = [];
  const cols = 12;
  const rows = 8;
  const ox = -((cols - 1) * FLOOR_STEP) / 2;
  const oz = -((rows - 1) * FLOOR_STEP) / 2;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = ox + c * FLOOR_STEP;
      const z = oz + r * FLOOR_STEP;
      // distance from back-left corner for wave install
      const dist = Math.sqrt((c / cols) ** 2 + ((rows - 1 - r) / rows) ** 2);
      tiles.push({ x, z, col: c, row: r, checker: (c + r) % 2 === 0, dist });
    }
  }
  return tiles; // 96 floor tiles
}

function buildWallGrid(): WallTile[] {
  const tiles: WallTile[] = [];
  const cols = 10;
  const rows = 3;
  const ox = -((cols - 1) * WALL_STEP_X) / 2;
  const oy = 0.1;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      // brick offset: odd rows shift half a tile
      const xOff = r % 2 === 1 ? WALL_STEP_X * 0.5 : 0;
      const x = ox + c * WALL_STEP_X + xOff;
      const y = oy + r * WALL_STEP_Y;
      const dist = Math.sqrt((c / cols) ** 2 + (r / rows) ** 2);
      tiles.push({ x, y, col: c, row: r, alt: (c + r) % 2 === 0, dist });
    }
  }
  return tiles; // 30 wall tiles => total ~126
}

/* pseudo-random from index, deterministic */
function prand(i: number): number {
  return ((Math.sin(i * 127.1 + i * 311.7) * 43758.5453) % 1 + 1) % 1;
}

export default function TilingScene({ progress }: { progress: number }) {
  const floorTiles = useMemo(buildFloorGrid, []);
  const wallTiles = useMemo(buildWallGrid, []);

  // max dist for normalization
  const maxFloorDist = useMemo(
    () => Math.max(...floorTiles.map((t) => t.dist)),
    [floorTiles],
  );
  const maxWallDist = useMemo(
    () => Math.max(...wallTiles.map((t) => t.dist)),
    [wallTiles],
  );

  // Tool visibility: tools appear mid-progress, fade at end
  const toolOpacity =
    progress < 0.1
      ? progress / 0.1
      : progress > 0.85
        ? (1 - progress) / 0.15
        : 1;
  const showTools = progress > 0.02 && progress < 0.98;

  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={lerp(0.3, 0.7, progress)} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={lerp(0.3, 0.9, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-2, 3, 1]}
        intensity={lerp(0.1, 0.3, progress)}
        color={lerp(0.9, 1, progress) > 0.95 ? '#fff5e6' : '#aa8866'}
      />

      {/* ── Back wall surface ── */}
      <mesh position={[0, 1.2, -2.6]} receiveShadow>
        <boxGeometry args={[7, 4, 0.15]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, RENOVATED.wall, progress)}
          roughness={lerp(0.9, 0.4, progress)}
        />
      </mesh>

      {/* ── Subfloor (dark, visible through missing tiles) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.08, 0]}
        receiveShadow
      >
        <boxGeometry args={[7, 5, 0.05]} />
        <meshStandardMaterial
          color={lerpColor(SUBFLOOR_COLOR, '#3a3228', progress)}
          roughness={0.95}
        />
      </mesh>

      {/* ── Grout base layer for floor ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.04, 0]}
        receiveShadow
      >
        <planeGeometry args={[6.2, 4.5]} />
        <meshStandardMaterial
          color={lerpColor(GROUT_RUIN, GROUT_RENO, progress)}
          roughness={lerp(0.95, 0.6, progress)}
          transparent
          opacity={lerp(0.3, 0.9, progress)}
        />
      </mesh>

      {/* ── Floor tiles ── */}
      {floorTiles.map((tile, i) => {
        const normDist = tile.dist / maxFloorDist;
        // wave: tiles install from low dist to high dist
        const delay = normDist * 0.7;
        const lp = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

        // Ruin: some tiles missing, some rotated/displaced
        const rng = prand(i);
        const isMissing = rng < 0.15; // 15% missing in ruin state
        const isCracked = rng > 0.15 && rng < 0.3;
        const missingFade = isMissing ? lp : 1;

        // Ruin displacement
        const ruinRotX = isCracked ? (1 - lp) * (prand(i + 1) - 0.5) * 0.3 : 0;
        const ruinRotZ = isCracked ? (1 - lp) * (prand(i + 2) - 0.5) * 0.2 : 0;
        const ruinOffX = isCracked ? (1 - lp) * (prand(i + 3) - 0.5) * 0.06 : 0;
        const ruinOffY = isCracked ? (1 - lp) * (prand(i + 4) - 0.5) * 0.03 : 0;

        // Checkerboard color
        const renoColor = tile.checker ? TILE_CREAM : TILE_BEIGE;
        const tileColor = lerpColor(RUIN.floor, renoColor, lp);

        // Tile height: slight 3D in renovated, more uneven in ruin
        const yBase = -1.02;
        const yPos = yBase + lerp(-0.02, 0, lp) + ruinOffY;

        if (isMissing && lp < 0.5) {
          // show dark gap in ruin, tile fades in during renovation
          return (
            <mesh
              key={`f${i}`}
              position={[tile.x, yPos, tile.z]}
              rotation={[-Math.PI / 2 + ruinRotX, 0, ruinRotZ]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[FLOOR_TILE, FLOOR_TILE, FLOOR_THICK]} />
              <meshStandardMaterial
                color={tileColor}
                roughness={lerp(0.95, 0.25, lp)}
                transparent
                opacity={missingFade}
              />
            </mesh>
          );
        }

        return (
          <mesh
            key={`f${i}`}
            position={[tile.x + ruinOffX, yPos, tile.z]}
            rotation={[-Math.PI / 2 + ruinRotX, 0, ruinRotZ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[FLOOR_TILE, FLOOR_TILE, FLOOR_THICK]} />
            <meshStandardMaterial
              color={tileColor}
              roughness={lerp(0.95, 0.25, lp)}
              metalness={lerp(0, 0.05, lp)}
              transparent
              opacity={lerp(0.5, 1, lp)}
            />
          </mesh>
        );
      })}

      {/* ── Wall tiles (back wall) ── */}
      {wallTiles.map((tile, i) => {
        const normDist = tile.dist / maxWallDist;
        const delay = 0.2 + normDist * 0.6;
        const lp = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

        const rng = prand(i + 200);
        const isMissing = rng < 0.2;
        const isCracked = rng > 0.2 && rng < 0.35;

        const ruinRotY = isCracked ? (1 - lp) * (prand(i + 201) - 0.5) * 0.15 : 0;
        const ruinOffZ = isCracked ? (1 - lp) * prand(i + 202) * 0.04 : 0;

        const wallColor = tile.alt ? WALL_TILE_LIGHT : WALL_TILE_WARM;
        const color = lerpColor(RUIN.wall, wallColor, lp);
        const opacity = isMissing ? lp : lerp(0.4, 1, lp);

        return (
          <mesh
            key={`w${i}`}
            position={[tile.x, tile.y + 0.7, -2.5 + ruinOffZ]}
            rotation={[0, ruinRotY, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[WALL_TILE_W, WALL_TILE_H, WALL_THICK]} />
            <meshStandardMaterial
              color={color}
              roughness={lerp(0.9, 0.2, lp)}
              metalness={lerp(0, 0.08, lp)}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}

      {/* ── Grout lines on back wall ── */}
      <mesh position={[0, 1.05, -2.52]} receiveShadow>
        <planeGeometry args={[3.8, 0.85]} />
        <meshStandardMaterial
          color={lerpColor(GROUT_RUIN, GROUT_RENO, progress)}
          roughness={0.8}
          transparent
          opacity={lerp(0.2, 0.7, progress)}
        />
      </mesh>

      {/* ── Partial side wall section (showing different tile format) ── */}
      <mesh position={[-3.2, 0.8, -1]} receiveShadow>
        <boxGeometry args={[0.15, 2.5, 2.5]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.wall, RENOVATED.wall, progress)}
          roughness={lerp(0.9, 0.5, progress)}
        />
      </mesh>
      {/* Side wall tiles - larger format */}
      {Array.from({ length: 8 }).map((_, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const delay = 0.3 + (i / 8) * 0.5;
        const lp = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
        const y = 0.15 + row * 0.52;
        const z = -1.6 + col * 0.62;
        return (
          <mesh
            key={`sw${i}`}
            position={[-3.1, y, z]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.56, 0.46, 0.02]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.accent, i % 2 === 0 ? '#ebe5db' : '#ddd5c8', lp)}
              roughness={lerp(0.9, 0.2, lp)}
              transparent
              opacity={lerp(0.3, 1, lp)}
            />
          </mesh>
        );
      })}

      {/* ══════════════════════════════════════════
          TILING TOOLS (visible during renovation)
          ══════════════════════════════════════════ */}
      {showTools && (
        <group>
          {/* ── Tile cutter (box shape with blade) ── */}
          <group position={[2.5, -0.75, 1.5]}>
            {/* base */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.15, 0.45]} />
              <meshStandardMaterial
                color="#888888"
                roughness={0.6}
                metalness={0.3}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* blade rail */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <boxGeometry args={[0.65, 0.04, 0.03]} />
              <meshStandardMaterial
                color="#aaaaaa"
                roughness={0.3}
                metalness={0.7}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* handle */}
            <mesh position={[0.2, 0.22, 0]} castShadow>
              <boxGeometry args={[0.12, 0.12, 0.06]} />
              <meshStandardMaterial
                color="#cc4422"
                roughness={0.7}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
          </group>

          {/* ── Adhesive bucket (cylinder) ── */}
          <group position={[-2.4, -0.7, 1.8]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.22, 0.4, 12]} />
              <meshStandardMaterial
                color="#3366aa"
                roughness={0.7}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* rim */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.03, 12]} />
              <meshStandardMaterial
                color="#aaaaaa"
                roughness={0.4}
                metalness={0.5}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* adhesive visible inside */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
              <meshStandardMaterial
                color="#d4c8a0"
                roughness={0.95}
                transparent
                opacity={toolOpacity * 0.9}
              />
            </mesh>
          </group>

          {/* ── Trowel (flat box + handle) ── */}
          <group
            position={[-1, -0.92, 2]}
            rotation={[0, 0.4, 0]}
          >
            {/* blade */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.28, 0.01, 0.14]} />
              <meshStandardMaterial
                color="#b0b0b0"
                roughness={0.3}
                metalness={0.6}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* notches (simplified as thinner box) */}
            <mesh position={[0, 0.008, 0]} castShadow>
              <boxGeometry args={[0.26, 0.005, 0.12]} />
              <meshStandardMaterial
                color="#999999"
                roughness={0.3}
                metalness={0.7}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* handle neck */}
            <mesh position={[-0.18, 0.03, 0]} castShadow>
              <boxGeometry args={[0.04, 0.05, 0.02]} />
              <meshStandardMaterial
                color="#888888"
                metalness={0.5}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
            {/* handle grip */}
            <mesh position={[-0.28, 0.03, 0]} castShadow>
              <boxGeometry args={[0.16, 0.04, 0.035]} />
              <meshStandardMaterial
                color="#5b3a1a"
                roughness={0.8}
                transparent
                opacity={toolOpacity}
              />
            </mesh>
          </group>

          {/* ── Tile spacers (tiny crosses scattered) ── */}
          {Array.from({ length: 10 }).map((_, i) => {
            const sx = -1.5 + prand(i + 50) * 3;
            const sz = -0.8 + prand(i + 60) * 2.5;
            const spacerOpacity = toolOpacity * (progress > 0.15 + i * 0.05 ? 1 : 0);
            if (spacerOpacity <= 0) return null;
            return (
              <group
                key={`sp${i}`}
                position={[sx, -0.98, sz]}
                rotation={[0, prand(i + 70) * Math.PI, 0]}
              >
                {/* cross arm 1 */}
                <mesh castShadow>
                  <boxGeometry args={[0.04, 0.01, 0.008]} />
                  <meshStandardMaterial
                    color="#ff6633"
                    transparent
                    opacity={spacerOpacity}
                  />
                </mesh>
                {/* cross arm 2 */}
                <mesh castShadow>
                  <boxGeometry args={[0.008, 0.01, 0.04]} />
                  <meshStandardMaterial
                    color="#ff6633"
                    transparent
                    opacity={spacerOpacity}
                  />
                </mesh>
              </group>
            );
          })}

          {/* ── Spare tile stack ── */}
          <group position={[2.6, -0.9, -0.5]}>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh
                key={`st${i}`}
                position={[0, i * 0.045, (prand(i + 80) - 0.5) * 0.03]}
                rotation={[0, (prand(i + 90) - 0.5) * 0.1, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[0.48, 0.04, 0.48]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? TILE_CREAM : TILE_BEIGE}
                  roughness={0.3}
                  transparent
                  opacity={toolOpacity}
                />
              </mesh>
            ))}
          </group>
        </group>
      )}
    </group>
  );
}
