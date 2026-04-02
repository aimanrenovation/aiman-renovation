'use client';

import { useMemo } from 'react';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

/* ------------------------------------------------------------------ */
/*  Helper: clamp a sub-range of progress into 0-1                    */
/* ------------------------------------------------------------------ */
function phase(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/* ------------------------------------------------------------------ */
/*  Timeline phases                                                    */
/*  0.00-0.10  Protection setup (drop cloth, tape, tray appear)        */
/*  0.10-0.70  Painting walls bottom-to-top (bands)                    */
/*  0.55-0.80  Baseboards painted                                      */
/*  0.60-0.85  Door frame painted                                      */
/*  0.85-0.95  Cleanup (tools fade, tape removed)                      */
/*  0.95-1.00  Light switch reappears, final touches                   */
/* ------------------------------------------------------------------ */

const WALL_BANDS = 8; // horizontal strips per wall
const ROOM_W = 6;
const ROOM_H = 4;
const ROOM_D = 5;
const FLOOR_Y = -2;
const CEIL_Y = FLOOR_Y + ROOM_H;

const ACCENT_COLOR = '#E50000';
const TAPE_BLUE = '#2266dd';
const WOOD_RAW = '#8B7355';
const WOOD_PAINTED = '#f0f0ec';
const PLASTER_STAIN_1 = '#5a4d3f';
const PLASTER_STAIN_2 = '#6b5e4e';
const BUCKET_GRAY = '#888888';

export default function PaintScene({ progress }: { progress: number }) {
  // Phase values
  const protectionPhase = phase(progress, 0.0, 0.10);
  const paintPhase = phase(progress, 0.10, 0.70);
  const baseboardPhase = phase(progress, 0.55, 0.80);
  const doorFramePhase = phase(progress, 0.60, 0.85);
  const cleanupPhase = phase(progress, 0.85, 0.95);
  const finalPhase = phase(progress, 0.95, 1.0);

  // Tape visible mid-progress
  const tapeOpacity = protectionPhase > 0.5 && cleanupPhase < 1 ? lerp(0, 0.9, Math.min(1, protectionPhase * 2)) * (1 - cleanupPhase) : 0;

  // Tools fade out during cleanup
  const toolsOpacity = cleanupPhase < 1 ? 1 - cleanupPhase : 0;

  // Light switch: removed during painting, reappears at end
  const switchVisible = progress < 0.05 || finalPhase > 0.3;
  const switchOpacity = progress < 0.05 ? lerp(1, 0, progress / 0.05) : lerp(0, 1, phase(finalPhase, 0.3, 1));

  // Roller position along the wall (moves up with paint progress)
  const rollerY = FLOOR_Y + 0.5 + paintPhase * (ROOM_H - 1);
  const rollerX = lerp(-ROOM_W / 2 + 1, ROOM_W / 2 - 1, (paintPhase * 3) % 1);

  // Wall band colors
  const wallBands = useMemo(() => {
    const bands: { ruinColor: string; renovatedColor: string; isAccent: boolean }[] = [];
    for (let i = 0; i < WALL_BANDS; i++) {
      // Stagger stain colors for ruined look
      const stain = i % 3 === 0 ? RUIN.wall : i % 3 === 1 ? PLASTER_STAIN_1 : PLASTER_STAIN_2;
      bands.push({ ruinColor: stain, renovatedColor: RENOVATED.wall, isAccent: false });
    }
    return bands;
  }, []);

  const bandHeight = ROOM_H / WALL_BANDS;

  /* Render horizontal bands for a wall */
  function renderWallBands(
    wallPos: [number, number, number],
    wallRot: [number, number, number],
    wallWidth: number,
    isAccent: boolean,
  ) {
    return Array.from({ length: WALL_BANDS }, (_, i) => {
      // Each band paints sequentially bottom-to-top
      const bandStart = i / WALL_BANDS;
      const bandEnd = (i + 1) / WALL_BANDS;
      const bandProgress = phase(paintPhase, bandStart, bandEnd);

      const baseColor = wallBands[i].ruinColor;
      const targetColor = isAccent ? ACCENT_COLOR : RENOVATED.wall;
      const color = lerpColor(baseColor, targetColor, bandProgress);

      const yOffset = FLOOR_Y + bandHeight * i + bandHeight / 2;

      return (
        <mesh
          key={`band-${i}`}
          position={[
            wallPos[0],
            yOffset,
            wallPos[2],
          ]}
          rotation={wallRot}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[wallWidth, bandHeight]} />
          <meshStandardMaterial
            color={color}
            roughness={lerp(0.9, 0.3, bandProgress)}
          />
        </mesh>
      );
    });
  }

  return (
    <group>
      {/* ========== LIGHTING ========== */}
      <ambientLight intensity={lerp(0.25, 0.7, progress)} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={lerp(0.3, 1.0, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[0, CEIL_Y - 0.3, 0]}
        intensity={lerp(0.1, 0.5, progress)}
        color={lerpColor('#ffd599', '#ffffff', progress)}
      />

      {/* ========== FLOOR ========== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.floor, RENOVATED.floor, progress)}
          roughness={lerp(0.95, 0.4, progress)}
        />
      </mesh>

      {/* ========== CEILING ========== */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, CEIL_Y, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial
          color={lerpColor('#5a5248', '#fafafa', progress)}
          roughness={lerp(0.8, 0.2, progress)}
        />
      </mesh>

      {/* ========== BACK WALL (accent wall) ========== */}
      <group position={[0, 0, -ROOM_D / 2]}>
        {renderWallBands([0, 0, 0], [0, 0, 0], ROOM_W, true)}
      </group>

      {/* ========== LEFT WALL ========== */}
      <group position={[-ROOM_W / 2, 0, 0]}>
        {renderWallBands([0, 0, 0], [0, Math.PI / 2, 0], ROOM_D, false)}
      </group>

      {/* ========== RIGHT WALL (has door frame) ========== */}
      <group position={[ROOM_W / 2, 0, 0]}>
        {/* Upper portion */}
        {renderWallBands([0, 0, 0], [0, -Math.PI / 2, 0], ROOM_D, false)}
      </group>

      {/* ========== DOOR FRAME on right wall ========== */}
      <group position={[ROOM_W / 2 - 0.01, 0, 0.8]}>
        {/* Door opening (dark recess) */}
        <mesh position={[0, FLOOR_Y + 1.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.9, 2.2]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Left jamb */}
        <mesh position={[-0.03, FLOOR_Y + 1.1, -0.47]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 2.2, 0.06]} />
          <meshStandardMaterial
            color={lerpColor(WOOD_RAW, WOOD_PAINTED, doorFramePhase)}
            roughness={lerp(0.8, 0.3, doorFramePhase)}
          />
        </mesh>
        {/* Right jamb */}
        <mesh position={[-0.03, FLOOR_Y + 1.1, 0.47]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 2.2, 0.06]} />
          <meshStandardMaterial
            color={lerpColor(WOOD_RAW, WOOD_PAINTED, doorFramePhase)}
            roughness={lerp(0.8, 0.3, doorFramePhase)}
          />
        </mesh>
        {/* Header */}
        <mesh position={[-0.03, FLOOR_Y + 2.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.08, 1.0]} />
          <meshStandardMaterial
            color={lerpColor(WOOD_RAW, WOOD_PAINTED, doorFramePhase)}
            roughness={lerp(0.8, 0.3, doorFramePhase)}
          />
        </mesh>
      </group>

      {/* ========== BASEBOARDS ========== */}
      {/* Back wall baseboard */}
      <mesh position={[0, FLOOR_Y + 0.06, -ROOM_D / 2 + 0.03]} castShadow receiveShadow>
        <boxGeometry args={[ROOM_W, 0.12, 0.04]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#f5f5f5', baseboardPhase)}
          roughness={lerp(0.9, 0.25, baseboardPhase)}
        />
      </mesh>
      {/* Left wall baseboard */}
      <mesh position={[-ROOM_W / 2 + 0.03, FLOOR_Y + 0.06, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[ROOM_D, 0.12, 0.04]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#f5f5f5', baseboardPhase)}
          roughness={lerp(0.9, 0.25, baseboardPhase)}
        />
      </mesh>
      {/* Right wall baseboard */}
      <mesh position={[ROOM_W / 2 - 0.03, FLOOR_Y + 0.06, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[ROOM_D, 0.12, 0.04]} />
        <meshStandardMaterial
          color={lerpColor(RUIN.dirt, '#f5f5f5', baseboardPhase)}
          roughness={lerp(0.9, 0.25, baseboardPhase)}
        />
      </mesh>

      {/* ========== PAINTER'S TAPE (blue) ========== */}
      {/* Tape along back wall top edge */}
      <mesh position={[0, CEIL_Y - 0.02, -ROOM_D / 2 + 0.02]}>
        <boxGeometry args={[ROOM_W, 0.03, 0.01]} />
        <meshStandardMaterial color={TAPE_BLUE} opacity={tapeOpacity} transparent />
      </mesh>
      {/* Tape along back wall bottom (above baseboard) */}
      <mesh position={[0, FLOOR_Y + 0.14, -ROOM_D / 2 + 0.02]}>
        <boxGeometry args={[ROOM_W, 0.03, 0.01]} />
        <meshStandardMaterial color={TAPE_BLUE} opacity={tapeOpacity} transparent />
      </mesh>
      {/* Tape along left wall top */}
      <mesh position={[-ROOM_W / 2 + 0.02, CEIL_Y - 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM_D, 0.03, 0.01]} />
        <meshStandardMaterial color={TAPE_BLUE} opacity={tapeOpacity} transparent />
      </mesh>
      {/* Tape along door frame */}
      <mesh position={[ROOM_W / 2 - 0.02, FLOOR_Y + 1.1, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.01, 2.3, 0.01]} />
        <meshStandardMaterial color={TAPE_BLUE} opacity={tapeOpacity} transparent />
      </mesh>

      {/* ========== DROP CLOTH / PROTECTION SHEET ========== */}
      <mesh
        position={[0, FLOOR_Y + 0.01, -0.5]}
        rotation={[-Math.PI / 2 + 0.02, 0.015, 0.01]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_W - 0.5, ROOM_D - 1.5]} />
        <meshStandardMaterial
          color="#d9d4c8"
          opacity={lerp(0, 0.85, protectionPhase) * (1 - cleanupPhase)}
          transparent
          roughness={0.95}
          side={2}
        />
      </mesh>
      {/* Wrinkle ridges on drop cloth */}
      {protectionPhase > 0.3 && cleanupPhase < 1 && (
        <>
          <mesh position={[-1.2, FLOOR_Y + 0.025, -0.8]} rotation={[-Math.PI / 2 + 0.08, 0.03, 0.4]}>
            <planeGeometry args={[1.5, 0.15]} />
            <meshStandardMaterial
              color="#ccc7bb"
              opacity={0.5 * (1 - cleanupPhase)}
              transparent
              side={2}
            />
          </mesh>
          <mesh position={[0.8, FLOOR_Y + 0.02, 0.3]} rotation={[-Math.PI / 2 + 0.05, -0.02, -0.3]}>
            <planeGeometry args={[1.2, 0.12]} />
            <meshStandardMaterial
              color="#cec9bd"
              opacity={0.45 * (1 - cleanupPhase)}
              transparent
              side={2}
            />
          </mesh>
        </>
      )}

      {/* ========== PAINT BUCKET ========== */}
      {toolsOpacity > 0 && (
        <group position={[1.8, FLOOR_Y, 1.2]}>
          {/* Bucket body */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.16, 0.35, 16]} />
            <meshStandardMaterial
              color={BUCKET_GRAY}
              opacity={toolsOpacity}
              transparent
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          {/* Paint inside bucket */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
            <meshStandardMaterial
              color={ACCENT_COLOR}
              opacity={toolsOpacity}
              transparent
              roughness={0.1}
            />
          </mesh>
          {/* Bucket rim */}
          <mesh position={[0, 0.375, 0]} castShadow>
            <torusGeometry args={[0.18, 0.012, 8, 24]} />
            <meshStandardMaterial
              color="#999999"
              opacity={toolsOpacity}
              transparent
              metalness={0.5}
            />
          </mesh>
          {/* Paint drip on side */}
          <mesh position={[0.17, 0.28, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.025, 0.12, 0.04]} />
            <meshStandardMaterial
              color={ACCENT_COLOR}
              opacity={toolsOpacity}
              transparent
              roughness={0.15}
            />
          </mesh>
          {/* Bucket handle */}
          <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.15, 0.008, 6, 20, Math.PI]} />
            <meshStandardMaterial
              color="#aaaaaa"
              opacity={toolsOpacity}
              transparent
              metalness={0.6}
            />
          </mesh>
        </group>
      )}

      {/* ========== PAINT TRAY ========== */}
      {toolsOpacity > 0 && (
        <group position={[-1.5, FLOOR_Y, 1.0]}>
          {/* Tray base */}
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.04, 0.35]} />
            <meshStandardMaterial
              color="#555555"
              opacity={toolsOpacity}
              transparent
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>
          {/* Paint pool in tray */}
          <mesh position={[-0.05, 0.045, 0]}>
            <boxGeometry args={[0.25, 0.01, 0.28]} />
            <meshStandardMaterial
              color={ACCENT_COLOR}
              opacity={toolsOpacity * 0.9}
              transparent
              roughness={0.05}
            />
          </mesh>
          {/* Tray ramp / ridged area */}
          <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.15, 0.02, 0.28]} />
            <meshStandardMaterial
              color="#666666"
              opacity={toolsOpacity}
              transparent
              roughness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* ========== PAINT ROLLER ON EXTENSION POLE ========== */}
      {toolsOpacity > 0 && (
        <group position={[lerp(-1.5, rollerX, Math.min(1, paintPhase * 2)), rollerY, -ROOM_D / 2 + 0.25]}>
          {/* Extension pole (long thin cylinder) */}
          <mesh
            position={[0, -1.2, 0.3]}
            rotation={[0.25, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.015, 0.018, 2.5, 8]} />
            <meshStandardMaterial
              color="#cccccc"
              opacity={toolsOpacity}
              transparent
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          {/* Roller handle connector */}
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
            <meshStandardMaterial
              color="#999999"
              opacity={toolsOpacity}
              transparent
              metalness={0.4}
            />
          </mesh>
          {/* Roller cylinder (fuzzy look via larger rough cylinder) */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
            <meshStandardMaterial
              color={lerpColor('#e8e0d0', ACCENT_COLOR, paintPhase > 0.1 ? 0.8 : 0)}
              opacity={toolsOpacity}
              transparent
              roughness={1.0}
            />
          </mesh>
          {/* Roller fuzzy texture layer */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.38, 12]} />
            <meshStandardMaterial
              color={lerpColor('#f0e8d8', ACCENT_COLOR, paintPhase > 0.1 ? 0.6 : 0)}
              opacity={toolsOpacity * 0.5}
              transparent
              roughness={1.0}
            />
          </mesh>
          {/* Roller end caps */}
          <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#333" opacity={toolsOpacity} transparent />
          </mesh>
          <mesh position={[-0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#333" opacity={toolsOpacity} transparent />
          </mesh>
        </group>
      )}

      {/* ========== LADDER ========== */}
      {toolsOpacity > 0 && (
        <group position={[-2.0, FLOOR_Y, 0.5]} rotation={[0, 0.3, 0]}>
          {/* Left rail */}
          <mesh position={[-0.2, 1.2, 0]} rotation={[0.12, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 2.8, 6]} />
            <meshStandardMaterial
              color="#c0c0c0"
              opacity={toolsOpacity}
              transparent
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          {/* Right rail */}
          <mesh position={[0.2, 1.2, 0]} rotation={[0.12, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 2.8, 6]} />
            <meshStandardMaterial
              color="#c0c0c0"
              opacity={toolsOpacity}
              transparent
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          {/* Rungs */}
          {[0.3, 0.7, 1.1, 1.5, 1.9].map((ry, i) => (
            <mesh key={`rung-${i}`} position={[0, ry, -0.02 * i]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.4, 6]} />
              <meshStandardMaterial
                color="#b0b0b0"
                opacity={toolsOpacity}
                transparent
                metalness={0.5}
                roughness={0.35}
              />
            </mesh>
          ))}
          {/* Ladder top platform */}
          <mesh position={[0, 2.2, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 0.03, 0.2]} />
            <meshStandardMaterial
              color="#aaaaaa"
              opacity={toolsOpacity}
              transparent
              metalness={0.4}
            />
          </mesh>
        </group>
      )}

      {/* ========== LIGHT SWITCH PLATE (right wall) ========== */}
      {switchVisible && (
        <group position={[ROOM_W / 2 - 0.02, FLOOR_Y + 1.3, -0.5]}>
          {/* Plate */}
          <mesh rotation={[0, -Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.01]} />
            <meshStandardMaterial
              color={lerpColor('#d5cfc5', '#f5f5f0', finalPhase)}
              opacity={switchOpacity}
              transparent
            />
          </mesh>
          {/* Switch toggle */}
          <mesh position={[-0.008, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[0.02, 0.04, 0.015]} />
            <meshStandardMaterial
              color="#e8e8e4"
              opacity={switchOpacity}
              transparent
            />
          </mesh>
        </group>
      )}

      {/* ========== WALL STAINS / MARKS (visible when ruined) ========== */}
      {progress < 0.6 && (
        <>
          {/* Water stain on back wall */}
          <mesh position={[1.2, FLOOR_Y + 2.8, -ROOM_D / 2 + 0.02]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshStandardMaterial
              color="#3a3020"
              opacity={lerp(0.6, 0, phase(progress, 0.3, 0.6))}
              transparent
            />
          </mesh>
          {/* Crack mark on left wall */}
          <mesh position={[-ROOM_W / 2 + 0.02, FLOOR_Y + 1.5, -0.8]} rotation={[0, Math.PI / 2, 0.3]}>
            <planeGeometry args={[0.03, 1.2]} />
            <meshStandardMaterial
              color="#2a2015"
              opacity={lerp(0.7, 0, phase(progress, 0.2, 0.5))}
              transparent
            />
          </mesh>
          {/* Mold spot on right wall */}
          <mesh position={[ROOM_W / 2 - 0.02, FLOOR_Y + 0.6, -1.5]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.25, 16]} />
            <meshStandardMaterial
              color="#1a2a1a"
              opacity={lerp(0.5, 0, phase(progress, 0.25, 0.55))}
              transparent
            />
          </mesh>
          {/* Peeling patch */}
          <mesh position={[-0.5, FLOOR_Y + 3.2, -ROOM_D / 2 + 0.015]} rotation={[0.05, 0, 0.02]}>
            <planeGeometry args={[0.6, 0.35]} />
            <meshStandardMaterial
              color="#7a6e5e"
              opacity={lerp(0.55, 0, phase(progress, 0.15, 0.45))}
              transparent
            />
          </mesh>
        </>
      )}
    </group>
  );
}
