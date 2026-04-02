'use client';

import { useMemo } from 'react';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/** Staggered progress: element starts transitioning after `delay` and finishes at 1 */
function stagger(progress: number, delay: number): number {
  return Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
}

export default function KitchenScene({ progress }: SceneProps) {
  // Staggered progress values for different elements
  const pWalls = stagger(progress, 0);
  const pFloor = stagger(progress, 0.05);
  const pCabinets = stagger(progress, 0.1);
  const pCounter = stagger(progress, 0.15);
  const pAppliances = stagger(progress, 0.2);
  const pBacksplash = stagger(progress, 0.25);
  const pFixtures = stagger(progress, 0.3);
  const pHood = stagger(progress, 0.35);
  const pFridge = stagger(progress, 0.2);
  const pWindow = stagger(progress, 0.15);
  const pDecor = stagger(progress, 0.5);
  const pHandles = stagger(progress, 0.4);

  // Colors
  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, pWalls);
  const floorColor = lerpColor(RUIN.floor, RENOVATED.floor, pFloor);
  const cabinetColor = lerpColor('#3a2f20', '#f0ebe4', pCabinets);
  const counterColor = lerpColor(RUIN.accent, RENOVATED.clean, pCounter);
  const metalColor = lerpColor(RUIN.metal, RENOVATED.metal, pFixtures);
  const accentColor = lerpColor(RUIN.metal, '#E50000', pHandles);
  const backsplashColor = lerpColor('#2e2518', '#e8e4de', pBacksplash);
  const applianceColor = lerpColor('#2e2518', '#2a2a2a', pAppliances);
  const fridgeColor = lerpColor('#3a3025', '#e0e0e0', pFridge);
  const hoodColor = lerpColor('#3a2f20', '#d0d0d0', pHood);
  const windowFrameColor = lerpColor('#4a3f35', '#f0f0f0', pWindow);
  const ceilingColor = lerpColor('#4a4035', '#fafaf8', pWalls);
  const baseboardColor = lerpColor('#2e2518', '#e0dcd4', pWalls);
  const decorColor = lerpColor('#3a2f20', '#E50000', pDecor);

  // Backsplash tile grid
  const backsplashTiles = useMemo(() => {
    const tiles: { x: number; y: number }[] = [];
    for (let col = 0; col < 24; col++) {
      for (let row = 0; row < 4; row++) {
        tiles.push({ x: -2.85 + col * 0.25, y: 0.45 + row * 0.25 });
      }
    }
    return tiles;
  }, []);

  // Cabinet handle positions (lower cabinets)
  const lowerHandles = useMemo(() => {
    const handles: number[] = [];
    for (let i = 0; i < 5; i++) {
      handles.push(-2.2 + i * 1.1);
    }
    return handles;
  }, []);

  // Upper cabinet handle positions
  const upperHandles = useMemo(() => {
    const handles: number[] = [];
    for (let i = 0; i < 4; i++) {
      handles.push(-1.7 + i * 1.2);
    }
    return handles;
  }, []);

  // Stove burner positions
  const burners = useMemo(
    () => [
      { x: 0.8, z: -1.8 },
      { x: 1.2, z: -1.8 },
      { x: 0.8, z: -2.15 },
      { x: 1.2, z: -2.15 },
    ],
    [],
  );

  return (
    <group>
      {/* === LIGHTING === */}
      <ambientLight intensity={lerp(0.2, 0.6, progress)} />
      <directionalLight
        position={[5, 6, 3]}
        intensity={lerp(0.3, 0.9, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Fill light from window side */}
      <directionalLight
        position={[-2, 3, 2]}
        intensity={lerp(0.1, 0.4, progress)}
        color="#f0e8d8"
      />
      {/* Warm spotlight that intensifies with renovation */}
      <spotLight
        position={[0, 2.8, -1]}
        angle={0.6}
        penumbra={0.8}
        intensity={lerp(0, 1.2, progress)}
        color="#fff5e6"
        castShadow
        target-position={[0, 0, -2]}
      />
      {/* Under-cabinet accent light */}
      <pointLight
        position={[0, 0.35, -2.2]}
        intensity={lerp(0, 0.4, progress)}
        color="#fff0d0"
        distance={3}
        decay={2}
      />

      {/* === CEILING === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 3, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={ceilingColor} />
      </mesh>

      {/* === FLOOR === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={lerp(0.95, 0.5, pFloor)}
          metalness={lerp(0, 0.05, pFloor)}
        />
      </mesh>

      {/* === BACK WALL === */}
      <mesh position={[0, 1, -3]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* === LEFT WALL === */}
      <mesh position={[-4, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* === RIGHT WALL === */}
      <mesh position={[4, 1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* === BASEBOARD MOLDING - Back wall === */}
      <mesh position={[0, -0.9, -2.97]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.12, 0.06]} />
        <meshStandardMaterial color={baseboardColor} />
      </mesh>
      {/* Baseboard - Left wall */}
      <mesh position={[-3.97, -0.9, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.12, 0.06]} />
        <meshStandardMaterial color={baseboardColor} />
      </mesh>
      {/* Baseboard - Right wall */}
      <mesh position={[3.97, -0.9, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.12, 0.06]} />
        <meshStandardMaterial color={baseboardColor} />
      </mesh>

      {/* === WINDOW on back wall === */}
      <group position={[2.5, 1.5, -2.95]}>
        {/* Window frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.6, 0.08]} />
          <meshStandardMaterial color={windowFrameColor} />
        </mesh>
        {/* Window glass */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.2, 1.4, 0.02]} />
          <meshStandardMaterial
            color={lerpColor('#5a7a8a', '#b8d8e8', pWindow)}
            transparent
            opacity={lerp(0.3, 0.5, pWindow)}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        {/* Window cross bars */}
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[1.2, 0.04, 0.03]} />
          <meshStandardMaterial color={windowFrameColor} />
        </mesh>
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.04, 1.4, 0.03]} />
          <meshStandardMaterial color={windowFrameColor} />
        </mesh>
        {/* Window sill */}
        <mesh position={[0, -0.85, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.06, 0.3]} />
          <meshStandardMaterial color={windowFrameColor} />
        </mesh>
      </group>

      {/* === LOWER CABINETS === */}
      <mesh position={[0, -0.5, -2.1]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 0.85, 1.1]} />
        <meshStandardMaterial
          color={cabinetColor}
          roughness={lerp(0.9, 0.4, pCabinets)}
        />
      </mesh>
      {/* Cabinet door lines (vertical dividers) */}
      {[-1.65, -0.55, 0.55, 1.65].map((x, i) => (
        <mesh key={`cdiv-${i}`} position={[x, -0.5, -1.544]} castShadow>
          <boxGeometry args={[0.02, 0.8, 0.01]} />
          <meshStandardMaterial color={lerpColor('#2e2518', '#d8d4cc', pCabinets)} />
        </mesh>
      ))}

      {/* Lower cabinet handles */}
      {lowerHandles.map((x, i) => (
        <mesh
          key={`lh-${i}`}
          position={[x, -0.35, -1.52]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={lerp(0.3, 0.9, pHandles)}
            roughness={lerp(0.8, 0.2, pHandles)}
          />
        </mesh>
      ))}

      {/* === COUNTERTOP === */}
      <mesh position={[0, 0.02, -2.05]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 0.08, 1.2]} />
        <meshStandardMaterial
          color={counterColor}
          roughness={lerp(0.85, 0.15, pCounter)}
          metalness={lerp(0, 0.05, pCounter)}
        />
      </mesh>
      {/* Countertop edge (front lip) */}
      <mesh position={[0, -0.02, -1.48]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 0.04, 0.04]} />
        <meshStandardMaterial
          color={counterColor}
          roughness={lerp(0.85, 0.15, pCounter)}
        />
      </mesh>

      {/* === BACKSPLASH TILES === */}
      {backsplashTiles.map((tile, i) => {
        const tileProgress = stagger(pBacksplash, (i % 7) * 0.04);
        return (
          <mesh
            key={`tile-${i}`}
            position={[tile.x, tile.y, -2.62]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.22, 0.22, 0.03]} />
            <meshStandardMaterial
              color={lerpColor(
                i % 3 === 0 ? '#2a1f15' : '#3a2f22',
                i % 5 === 0 ? '#f0ede8' : backsplashColor,
                tileProgress,
              )}
              roughness={lerp(0.9, 0.3, tileProgress)}
            />
          </mesh>
        );
      })}

      {/* === UPPER CABINETS === */}
      <mesh position={[-0.5, 2.1, -2.75]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.1, 0.45]} />
        <meshStandardMaterial
          color={cabinetColor}
          roughness={lerp(0.9, 0.4, pCabinets)}
        />
      </mesh>
      {/* Upper cabinet door lines */}
      {[-1.1, 0.1].map((x, i) => (
        <mesh key={`ucdiv-${i}`} position={[x, 2.1, -2.524]} castShadow>
          <boxGeometry args={[0.02, 1.0, 0.01]} />
          <meshStandardMaterial color={lerpColor('#2e2518', '#d8d4cc', pCabinets)} />
        </mesh>
      ))}
      {/* Upper cabinet handles */}
      {upperHandles.map((x, i) => (
        <mesh
          key={`uh-${i}`}
          position={[x, 1.75, -2.5]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.012, 0.1, 8]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={lerp(0.3, 0.9, pHandles)}
            roughness={lerp(0.8, 0.2, pHandles)}
          />
        </mesh>
      ))}

      {/* === SINK BASIN === */}
      <group position={[-1, 0.06, -2]}>
        {/* Sink rim */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.06, 0.72]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={lerp(0.2, 0.85, pFixtures)}
            roughness={lerp(0.8, 0.15, pFixtures)}
          />
        </mesh>
        {/* Sink inset (darker recessed area) */}
        <mesh position={[0, -0.02, 0]} receiveShadow>
          <boxGeometry args={[0.9, 0.04, 0.58]} />
          <meshStandardMaterial
            color={lerpColor('#1a1510', '#a8a8a8', pFixtures)}
            metalness={lerp(0.1, 0.7, pFixtures)}
            roughness={lerp(0.9, 0.2, pFixtures)}
          />
        </mesh>
        {/* Sink divider */}
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.03, 0.05, 0.55]} />
          <meshStandardMaterial color={metalColor} metalness={0.7} />
        </mesh>
      </group>

      {/* === FAUCET === */}
      <group position={[-1, 0.06, -2.35]}>
        {/* Faucet base */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={lerp(0.3, 0.95, pFixtures)}
            roughness={lerp(0.7, 0.1, pFixtures)}
          />
        </mesh>
        {/* Faucet vertical pipe */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 10]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={lerp(0.3, 0.95, pFixtures)}
            roughness={lerp(0.7, 0.1, pFixtures)}
          />
        </mesh>
        {/* Faucet spout (curved top) */}
        <mesh position={[0, 0.52, 0.12]} rotation={[0.4, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.018, 8, 16, Math.PI]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={lerp(0.3, 0.95, pFixtures)}
            roughness={lerp(0.7, 0.1, pFixtures)}
          />
        </mesh>
        {/* Faucet handles */}
        <mesh position={[-0.08, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.06, 8]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} />
        </mesh>
        <mesh position={[0.08, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.06, 8]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} />
        </mesh>
      </group>

      {/* === STOVE / OVEN === */}
      <group position={[1, 0, -2.05]}>
        {/* Oven body */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 0.85, 1.1]} />
          <meshStandardMaterial
            color={applianceColor}
            roughness={lerp(0.9, 0.3, pAppliances)}
            metalness={lerp(0.1, 0.5, pAppliances)}
          />
        </mesh>
        {/* Oven door */}
        <mesh position={[0, -0.5, 0.02]} castShadow>
          <boxGeometry args={[0.85, 0.65, 0.02]} />
          <meshStandardMaterial
            color={lerpColor('#1a1510', '#1a1a1a', pAppliances)}
            roughness={lerp(0.8, 0.15, pAppliances)}
            metalness={lerp(0.1, 0.3, pAppliances)}
          />
        </mesh>
        {/* Oven door handle */}
        <mesh position={[0, -0.22, 0.06]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.03, 0.03]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={lerp(0.3, 0.9, pAppliances)}
          />
        </mesh>
        {/* Stovetop surface */}
        <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 0.05, 1.1]} />
          <meshStandardMaterial
            color={applianceColor}
            roughness={lerp(0.8, 0.2, pAppliances)}
          />
        </mesh>
        {/* Burners */}
        {burners.map((b, i) => (
          <group key={`burner-${i}`} position={[b.x - 1, 0.08, b.z + 2.05]}>
            {/* Burner ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.08, 0.012, 8, 20]} />
              <meshStandardMaterial
                color={lerpColor('#3a3020', '#444444', pAppliances)}
                metalness={lerp(0.2, 0.6, pAppliances)}
              />
            </mesh>
            {/* Burner center */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 16]} />
              <meshStandardMaterial
                color={lerpColor('#2a2015', '#333333', pAppliances)}
              />
            </mesh>
            {/* Grate bars */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.18, 0.015, 0.015]} />
              <meshStandardMaterial color={lerpColor('#2e2518', '#3a3a3a', pAppliances)} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[0.18, 0.015, 0.015]} />
              <meshStandardMaterial color={lerpColor('#2e2518', '#3a3a3a', pAppliances)} metalness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Stove knobs */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={`knob-${i}`} position={[x, 0.04, 0.53]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.metal, '#e0e0e0', pAppliances)}
              metalness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* === RANGE HOOD === */}
      <group position={[1, 2.2, -2.6]}>
        {/* Hood body (tapered) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.5, 0.55]} />
          <meshStandardMaterial
            color={hoodColor}
            roughness={lerp(0.8, 0.25, pHood)}
            metalness={lerp(0.1, 0.6, pHood)}
          />
        </mesh>
        {/* Hood taper / lower lip (wider) */}
        <mesh position={[0, -0.3, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.1, 0.65]} />
          <meshStandardMaterial
            color={hoodColor}
            roughness={lerp(0.8, 0.25, pHood)}
            metalness={lerp(0.1, 0.6, pHood)}
          />
        </mesh>
        {/* Hood chimney to ceiling */}
        <mesh position={[0, 0.6, -0.05]} castShadow>
          <boxGeometry args={[0.4, 0.7, 0.35]} />
          <meshStandardMaterial color={hoodColor} metalness={lerp(0.1, 0.5, pHood)} />
        </mesh>
        {/* Hood filter grille lines */}
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={`grille-${i}`} position={[x, -0.36, 0.05]} castShadow>
            <boxGeometry args={[0.25, 0.01, 0.5]} />
            <meshStandardMaterial
              color={lerpColor('#2a2015', '#b0b0b0', pHood)}
              metalness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* === REFRIGERATOR === */}
      <group position={[-3.1, 0.4, -2.2]}>
        {/* Fridge body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 2.7, 1]} />
          <meshStandardMaterial
            color={fridgeColor}
            roughness={lerp(0.85, 0.2, pFridge)}
            metalness={lerp(0.1, 0.5, pFridge)}
          />
        </mesh>
        {/* Fridge door line (upper) */}
        <mesh position={[0, 0.4, 0.505]}>
          <boxGeometry args={[0.9, 0.02, 0.01]} />
          <meshStandardMaterial color={lerpColor('#2a2015', '#c8c8c8', pFridge)} />
        </mesh>
        {/* Upper door handle */}
        <mesh position={[0.35, 0.9, 0.54]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={lerp(0.3, 0.9, pHandles)}
            roughness={lerp(0.8, 0.15, pHandles)}
          />
        </mesh>
        {/* Lower door handle */}
        <mesh position={[0.35, -0.3, 0.54]} castShadow>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={lerp(0.3, 0.9, pHandles)}
            roughness={lerp(0.8, 0.15, pHandles)}
          />
        </mesh>
        {/* Fridge top cap */}
        <mesh position={[0, 1.38, 0]} castShadow>
          <boxGeometry args={[1.02, 0.04, 1.02]} />
          <meshStandardMaterial color={fridgeColor} metalness={0.3} />
        </mesh>
      </group>

      {/* === FRUIT BOWL / DECORATIVE ELEMENT === */}
      <group position={[0, 0.1, -1.8]}>
        {/* Bowl base (flattened sphere via scaled cylinder) */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.12, 0.1, 16]} />
          <meshStandardMaterial
            color={decorColor}
            roughness={lerp(0.9, 0.3, pDecor)}
            metalness={lerp(0, 0.1, pDecor)}
            transparent
            opacity={lerp(0, 1, pDecor)}
          />
        </mesh>
        {/* Fruit - apple 1 */}
        <mesh position={[-0.05, 0.12, 0.02]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color={lerpColor('#2e2518', '#cc3333', pDecor)}
            transparent
            opacity={lerp(0, 1, pDecor)}
          />
        </mesh>
        {/* Fruit - apple 2 */}
        <mesh position={[0.06, 0.11, -0.03]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial
            color={lerpColor('#2e2518', '#44aa22', pDecor)}
            transparent
            opacity={lerp(0, 1, pDecor)}
          />
        </mesh>
        {/* Fruit - orange */}
        <mesh position={[0, 0.14, 0.06]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={lerpColor('#2e2518', '#ee8822', pDecor)}
            transparent
            opacity={lerp(0, 1, pDecor)}
          />
        </mesh>
        {/* Fruit - lemon */}
        <mesh position={[0.04, 0.1, -0.06]} castShadow>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial
            color={lerpColor('#2e2518', '#eedd33', pDecor)}
            transparent
            opacity={lerp(0, 1, pDecor)}
          />
        </mesh>
      </group>

      {/* === KITCHEN ISLAND / COUNTER EXTENSION (left side) === */}
      {/* Small cutting board on counter */}
      <mesh position={[2, 0.08, -1.85]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.02, 0.25]} />
        <meshStandardMaterial
          color={lerpColor('#3a2f20', '#c4a47a', pDecor)}
          roughness={lerp(0.9, 0.6, pDecor)}
          transparent
          opacity={lerp(0, 1, pDecor)}
        />
      </mesh>

      {/* === FLOOR TILES pattern (subtle grid lines) === */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={`fline-h-${i}`}
          position={[0, -0.99, -2.5 + i * 0.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[8, 0.015]} />
          <meshStandardMaterial
            color={lerpColor('#2a1f15', '#d8d2c8', pFloor)}
            transparent
            opacity={lerp(0.15, 0.25, pFloor)}
          />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh
          key={`fline-v-${i}`}
          position={[-3.5 + i * 0.88, -0.99, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          receiveShadow
        >
          <planeGeometry args={[6, 0.015]} />
          <meshStandardMaterial
            color={lerpColor('#2a1f15', '#d8d2c8', pFloor)}
            transparent
            opacity={lerp(0.15, 0.25, pFloor)}
          />
        </mesh>
      ))}
    </group>
  );
}
