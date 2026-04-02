'use client';

import { useMemo } from 'react';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

/* Staggered progress: each element transitions at a different phase */
function stagger(progress: number, index: number, total: number): number {
  const segmentWidth = 1 / total;
  const start = index * segmentWidth * 0.5;
  const end = start + 0.6;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

/* Reusable pipe segment */
function Pipe({
  position,
  rotation = [0, 0, 0],
  length,
  radius,
  color,
  metalness,
  roughness,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  radius: number;
  color: string;
  metalness: number;
  roughness: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/* Elbow joint using a torus segment */
function ElbowJoint({
  position,
  rotation = [0, 0, 0],
  tubeRadius,
  bendRadius,
  color,
  metalness,
  roughness,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  tubeRadius: number;
  bendRadius: number;
  color: string;
  metalness: number;
  roughness: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <torusGeometry args={[bendRadius, tubeRadius, 12, 16, Math.PI / 2]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/* T-joint: a torus ring at a pipe intersection */
function TJoint({
  position,
  rotation = [0, 0, 0],
  tubeRadius,
  ringRadius,
  color,
  metalness,
  roughness,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  tubeRadius: number;
  ringRadius: number;
  color: string;
  metalness: number;
  roughness: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <torusGeometry args={[ringRadius, tubeRadius * 0.4, 12, 24]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/* Pipe clamp mounted on the wall */
function PipeClamp({
  position,
  rotation = [0, 0, 0],
  radius,
  color,
  metalness,
  roughness,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius: number;
  color: string;
  metalness: number;
  roughness: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <torusGeometry args={[radius * 1.5, radius * 0.2, 8, 16, Math.PI]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/* Shut-off valve: sphere body + cylinder handle */
function ShutOffValve({
  position,
  p,
}: {
  position: [number, number, number];
  p: number;
}) {
  const bodyColor = lerpColor('#993300', '#cc3333', p);
  const handleColor = lerpColor('#664422', '#dddddd', p);
  return (
    <group position={position}>
      {/* Valve body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[lerp(0.09, 0.065, p), 16, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={lerp(0.4, 0.85, p)}
          roughness={lerp(0.8, 0.15, p)}
        />
      </mesh>
      {/* Handle */}
      <mesh position={[0, lerp(0.12, 0.09, p), 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.015, 0.015, lerp(0.15, 0.12, p), 8]} />
        <meshStandardMaterial color={handleColor} metalness={lerp(0.3, 0.7, p)} roughness={lerp(0.7, 0.25, p)} />
      </mesh>
      {/* Handle knob */}
      <mesh position={[0, lerp(0.2, 0.16, p), 0]} castShadow receiveShadow>
        <cylinderGeometry args={[lerp(0.04, 0.03, p), lerp(0.04, 0.03, p), 0.02, 12]} />
        <meshStandardMaterial color={handleColor} metalness={lerp(0.3, 0.7, p)} roughness={lerp(0.7, 0.25, p)} />
      </mesh>
    </group>
  );
}

/* Pressure gauge */
function PressureGauge({
  position,
  p,
}: {
  position: [number, number, number];
  p: number;
}) {
  const gaugeColor = lerpColor('#554433', '#eeeeee', p);
  return (
    <group position={position}>
      {/* Gauge body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshStandardMaterial color={gaugeColor} metalness={lerp(0.3, 0.6, p)} roughness={lerp(0.8, 0.3, p)} />
      </mesh>
      {/* Gauge face (glass dome) */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.055, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={lerpColor('#887766', '#ffffff', p)}
          metalness={lerp(0.1, 0.3, p)}
          roughness={lerp(0.6, 0.1, p)}
          transparent
          opacity={lerp(0.5, 0.8, p)}
        />
      </mesh>
      {/* Connector stem */}
      <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
        <meshStandardMaterial color={lerpColor('#665544', '#bbbbbb', p)} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* Water meter: box body + small cylinder dial */
function WaterMeter({
  position,
  p,
}: {
  position: [number, number, number];
  p: number;
}) {
  const bodyColor = lerpColor('#443322', '#dddddd', p);
  return (
    <group position={position}>
      {/* Meter body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
        <meshStandardMaterial color={bodyColor} metalness={lerp(0.3, 0.5, p)} roughness={lerp(0.8, 0.3, p)} />
      </mesh>
      {/* Display window */}
      <mesh position={[0, 0.02, 0.051]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.06, 0.005]} />
        <meshStandardMaterial
          color={lerpColor('#222211', '#aaeeff', p)}
          metalness={0.1}
          roughness={lerp(0.9, 0.2, p)}
          emissive={lerpColor('#000000', '#002233', p)}
          emissiveIntensity={lerp(0, 0.3, p)}
        />
      </mesh>
      {/* Dial */}
      <mesh position={[0.08, -0.04, 0.051]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
        <meshStandardMaterial color={lerpColor('#554433', '#ff3333', p)} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Input/output connectors */}
      {[-0.15, 0.15].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.06, 8]} />
          <meshStandardMaterial
            color={lerpColor('#665544', '#bbbbbb', p)}
            metalness={lerp(0.4, 0.75, p)}
            roughness={lerp(0.7, 0.2, p)}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Wall-mounted water heater */
function WaterHeater({
  position,
  p,
}: {
  position: [number, number, number];
  p: number;
}) {
  const tankColor = lerpColor('#554433', '#f0f0f0', p);
  return (
    <group position={position}>
      {/* Main tank */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 1.2, 24]} />
        <meshStandardMaterial color={tankColor} metalness={lerp(0.2, 0.4, p)} roughness={lerp(0.8, 0.35, p)} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.61, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.35, 0.04, 24]} />
        <meshStandardMaterial color={lerpColor('#443322', '#dddddd', p)} metalness={lerp(0.3, 0.6, p)} roughness={lerp(0.7, 0.25, p)} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -0.61, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.36, 0.04, 24]} />
        <meshStandardMaterial color={lerpColor('#443322', '#dddddd', p)} metalness={lerp(0.3, 0.6, p)} roughness={lerp(0.7, 0.25, p)} />
      </mesh>
      {/* Thermostat control box */}
      <mesh position={[0, -0.1, 0.36]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.25, 0.06]} />
        <meshStandardMaterial color={lerpColor('#332211', '#cccccc', p)} metalness={lerp(0.2, 0.5, p)} roughness={lerp(0.8, 0.3, p)} />
      </mesh>
      {/* Thermostat dial */}
      <mesh position={[0, -0.1, 0.395]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
        <meshStandardMaterial color={lerpColor('#664422', '#ff6600', p)} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Temperature indicator LED */}
      <mesh position={[0.06, -0.02, 0.395]} castShadow receiveShadow>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial
          color={lerpColor('#331100', '#00ff44', p)}
          emissive={lerpColor('#000000', '#00ff44', p)}
          emissiveIntensity={lerp(0, 0.8, p)}
        />
      </mesh>
      {/* Inlet/outlet pipes on top */}
      {[-0.12, 0.12].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial
            color={lerpColor('#8B4513', i === 0 ? '#2266cc' : '#cc4444', p)}
            metalness={lerp(0.3, 0.8, p)}
            roughness={lerp(0.8, 0.2, p)}
          />
        </mesh>
      ))}
      {/* Wall mounting brackets */}
      {[-0.3, 0.3].map((yOff, i) => (
        <mesh key={`bracket-${i}`} position={[0, yOff, -0.36]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.04, 0.08]} />
          <meshStandardMaterial color={lerpColor('#555555', '#999999', p)} metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* Colored band / label ring on a pipe */
function PipeLabel({
  position,
  rotation = [0, 0, 0],
  radius,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius: number;
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius * 1.15, radius * 1.15, 0.03, 12]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
    </mesh>
  );
}

/* Water drops for leak effect */
function WaterDrops({
  position,
  count,
  spread,
  opacity,
}: {
  position: [number, number, number];
  count: number;
  spread: number;
  opacity: number;
}) {
  const drops = useMemo(() => {
    const arr: { x: number; y: number; z: number; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.sin(i * 2.39996) * spread * 0.5),
        y: -(i / count) * spread * 2,
        z: (Math.cos(i * 2.39996) * spread * 0.3),
        scale: 0.008 + (i % 3) * 0.004,
      });
    }
    return arr;
  }, [count, spread]);

  if (opacity <= 0.01) return null;

  return (
    <group position={position}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} castShadow>
          <sphereGeometry args={[d.scale, 8, 8]} />
          <meshStandardMaterial
            color="#4488aa"
            metalness={0.2}
            roughness={0.1}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Water stain on wall */
function WaterStain({
  position,
  opacity,
}: {
  position: [number, number, number];
  opacity: number;
}) {
  if (opacity <= 0.01) return null;
  return (
    <mesh position={position} receiveShadow>
      <planeGeometry args={[0.6, 0.8]} />
      <meshStandardMaterial
        color="#5a4a35"
        transparent
        opacity={opacity}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

export default function PlumbingScene({ progress }: SceneProps) {
  const totalElements = 12;
  const wallZ = -1.95;
  const pipeZ = lerp(-1.4, -1.85, progress);

  // Staggered progress values for each section
  const p = (i: number) => stagger(progress, i, totalElements);

  // Pipe material helpers
  const hotPipeColor = (i: number) => lerpColor('#7a4520', '#cc6644', p(i)); // rusty brown -> copper
  const coldPipeColor = (i: number) => lerpColor('#4a5a3a', '#c0c0c0', p(i)); // corroded green -> chrome
  const pipeRadius = (i: number) => lerp(0.042, 0.032, p(i));
  const pipeMetal = (i: number) => lerp(0.25, 0.88, p(i));
  const pipeRough = (i: number) => lerp(0.92, 0.15, p(i));

  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, progress);
  const floorColor = lerpColor(RUIN.floor, RENOVATED.floor, progress);

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={lerp(0.25, 0.7, progress)} />
      <directionalLight
        position={[4, 5, 3]}
        intensity={lerp(0.4, 1.0, progress)}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-1, 2, 0]}
        intensity={lerp(0.1, 0.3, progress)}
        color={lerpColor('#ffaa66', '#ffffff', progress)}
      />

      {/* ===== WALLS & FLOOR ===== */}
      {/* Back wall */}
      <mesh position={[0, 1, -2]} receiveShadow>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color={wallColor} roughness={lerp(0.95, 0.6, progress)} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color={floorColor} roughness={lerp(0.95, 0.5, progress)} />
      </mesh>

      {/* Water stains on wall (ruined state) */}
      <WaterStain position={[-1.95, 0.2, wallZ + 0.01]} opacity={lerp(0.45, 0, progress)} />
      <WaterStain position={[0.8, -0.5, wallZ + 0.01]} opacity={lerp(0.35, 0, progress)} />

      {/* ===== HOT WATER LINE (left side, red labels) ===== */}
      {/* Hot vertical main pipe */}
      <Pipe
        position={[-2, 0.5, pipeZ]}
        length={3}
        radius={pipeRadius(0)}
        color={hotPipeColor(0)}
        metalness={pipeMetal(0)}
        roughness={pipeRough(0)}
      />
      {/* Pipe clamps on hot vertical */}
      <PipeClamp position={[-2, 1.5, pipeZ + pipeRadius(0)]} rotation={[Math.PI / 2, 0, 0]} radius={pipeRadius(0)} color={coldPipeColor(1)} metalness={pipeMetal(1)} roughness={pipeRough(1)} />
      <PipeClamp position={[-2, -0.2, pipeZ + pipeRadius(0)]} rotation={[Math.PI / 2, 0, 0]} radius={pipeRadius(0)} color={coldPipeColor(1)} metalness={pipeMetal(1)} roughness={pipeRough(1)} />

      {/* Hot pipe red labels */}
      <PipeLabel position={[-2, 1.8, pipeZ]} radius={pipeRadius(0)} color="#cc2222" />
      <PipeLabel position={[-2, 0.4, pipeZ]} radius={pipeRadius(0)} color="#cc2222" />

      {/* Elbow: hot vertical to horizontal (top) */}
      <ElbowJoint
        position={[-1.85, 2.0, pipeZ]}
        rotation={[0, Math.PI, Math.PI / 2]}
        tubeRadius={pipeRadius(1) * 0.9}
        bendRadius={0.15}
        color={hotPipeColor(1)}
        metalness={pipeMetal(1)}
        roughness={pipeRough(1)}
      />

      {/* Hot horizontal pipe (top, goes to water heater) */}
      <Pipe
        position={[-0.2, 2.0, pipeZ]}
        rotation={[0, 0, Math.PI / 2]}
        length={3.1}
        radius={pipeRadius(2)}
        color={hotPipeColor(2)}
        metalness={pipeMetal(2)}
        roughness={pipeRough(2)}
      />
      <PipeLabel position={[0.5, 2.0, pipeZ]} rotation={[0, 0, Math.PI / 2]} radius={pipeRadius(2)} color="#cc2222" />

      {/* T-joint where hot horizontal meets middle vertical */}
      <TJoint
        position={[-0.5, 2.0, pipeZ]}
        rotation={[Math.PI / 2, 0, 0]}
        tubeRadius={pipeRadius(2)}
        ringRadius={pipeRadius(2) * 1.8}
        color={hotPipeColor(2)}
        metalness={pipeMetal(2)}
        roughness={pipeRough(2)}
      />

      {/* ===== COLD WATER LINE (right side, blue labels) ===== */}
      {/* Cold vertical main pipe */}
      <Pipe
        position={[1.5, 0.5, pipeZ]}
        length={3}
        radius={pipeRadius(3)}
        color={coldPipeColor(3)}
        metalness={pipeMetal(3)}
        roughness={pipeRough(3)}
      />
      {/* Pipe clamps on cold vertical */}
      <PipeClamp position={[1.5, 1.5, pipeZ + pipeRadius(3)]} rotation={[Math.PI / 2, 0, 0]} radius={pipeRadius(3)} color={coldPipeColor(4)} metalness={pipeMetal(4)} roughness={pipeRough(4)} />
      <PipeClamp position={[1.5, -0.2, pipeZ + pipeRadius(3)]} rotation={[Math.PI / 2, 0, 0]} radius={pipeRadius(3)} color={coldPipeColor(4)} metalness={pipeMetal(4)} roughness={pipeRough(4)} />

      {/* Cold pipe blue labels */}
      <PipeLabel position={[1.5, 1.8, pipeZ]} radius={pipeRadius(3)} color="#2244cc" />
      <PipeLabel position={[1.5, 0.4, pipeZ]} radius={pipeRadius(3)} color="#2244cc" />

      {/* Cold horizontal pipe (middle) */}
      <Pipe
        position={[0.0, 0.8, pipeZ]}
        rotation={[0, 0, Math.PI / 2]}
        length={4}
        radius={pipeRadius(4) * 0.85}
        color={coldPipeColor(4)}
        metalness={pipeMetal(4)}
        roughness={pipeRough(4)}
      />
      <PipeLabel position={[0.5, 0.8, pipeZ]} rotation={[0, 0, Math.PI / 2]} radius={pipeRadius(4) * 0.85} color="#2244cc" />

      {/* T-joint at cold horizontal / vertical intersection */}
      <TJoint
        position={[1.5, 0.8, pipeZ]}
        rotation={[Math.PI / 2, 0, 0]}
        tubeRadius={pipeRadius(4)}
        ringRadius={pipeRadius(4) * 1.8}
        color={coldPipeColor(4)}
        metalness={pipeMetal(4)}
        roughness={pipeRough(4)}
      />

      {/* Elbow: cold vertical to horizontal (top) */}
      <ElbowJoint
        position={[1.35, 2.0, pipeZ]}
        rotation={[0, 0, Math.PI / 2]}
        tubeRadius={pipeRadius(5) * 0.9}
        bendRadius={0.15}
        color={coldPipeColor(5)}
        metalness={pipeMetal(5)}
        roughness={pipeRough(5)}
      />

      {/* ===== MIDDLE VERTICAL (branch down from hot horizontal) ===== */}
      <Pipe
        position={[-0.5, 1.2, pipeZ]}
        length={1.5}
        radius={pipeRadius(5) * 0.85}
        color={hotPipeColor(5)}
        metalness={pipeMetal(5)}
        roughness={pipeRough(5)}
      />

      {/* Elbow at bottom of middle vertical going right */}
      <ElbowJoint
        position={[-0.35, 0.4, pipeZ]}
        rotation={[0, Math.PI / 2, 0]}
        tubeRadius={pipeRadius(5) * 0.8}
        bendRadius={0.12}
        color={hotPipeColor(5)}
        metalness={pipeMetal(5)}
        roughness={pipeRough(5)}
      />

      {/* ===== DRAIN PIPE going into floor ===== */}
      <Pipe
        position={[0.5, -0.5, pipeZ + 0.15]}
        length={2.0}
        radius={lerp(0.055, 0.045, p(6))}
        color={lerpColor('#3a3a2a', '#888888', p(6))}
        metalness={lerp(0.2, 0.5, p(6))}
        roughness={lerp(0.95, 0.4, p(6))}
      />
      {/* Drain collar at floor level */}
      <mesh position={[0.5, -1.48, pipeZ + 0.15]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[lerp(0.08, 0.065, p(6)), lerp(0.08, 0.065, p(6)), 0.04, 16]} />
        <meshStandardMaterial
          color={lerpColor('#444433', '#aaaaaa', p(6))}
          metalness={lerp(0.3, 0.6, p(6))}
          roughness={lerp(0.8, 0.3, p(6))}
        />
      </mesh>
      {/* Drain elbow connecting horizontal to vertical drain */}
      <ElbowJoint
        position={[0.5, 0.5, pipeZ + 0.08]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        tubeRadius={lerp(0.05, 0.04, p(6))}
        bendRadius={0.12}
        color={lerpColor('#3a3a2a', '#888888', p(6))}
        metalness={lerp(0.2, 0.5, p(6))}
        roughness={lerp(0.95, 0.4, p(6))}
      />

      {/* ===== SHUT-OFF VALVES ===== */}
      {/* Hot water shut-off */}
      <ShutOffValve position={[-2, -0.3, pipeZ]} p={p(7)} />
      {/* Cold water shut-off */}
      <ShutOffValve position={[1.5, -0.3, pipeZ]} p={p(8)} />
      {/* Main shut-off near water meter */}
      <ShutOffValve position={[-2, -0.9, pipeZ]} p={p(7)} />

      {/* ===== WATER METER ===== */}
      <WaterMeter position={[-2.5, -0.6, pipeZ + 0.08]} p={p(9)} />

      {/* Pipe connecting water meter to main line */}
      <Pipe
        position={[-2.25, -0.6, pipeZ]}
        rotation={[0, 0, Math.PI / 2]}
        length={0.3}
        radius={pipeRadius(9) * 0.8}
        color={coldPipeColor(9)}
        metalness={pipeMetal(9)}
        roughness={pipeRough(9)}
      />

      {/* ===== PRESSURE GAUGE ===== */}
      <PressureGauge position={[-0.5, 2.15, pipeZ]} p={p(10)} />

      {/* ===== WATER HEATER ===== */}
      <WaterHeater position={[2.5, 0.5, lerp(-1.5, -1.8, progress)]} p={p(11)} />

      {/* Pipe from cold line to water heater (horizontal) */}
      <Pipe
        position={[2.0, 2.0, pipeZ]}
        rotation={[0, 0, Math.PI / 2]}
        length={0.8}
        radius={pipeRadius(5) * 0.8}
        color={coldPipeColor(5)}
        metalness={pipeMetal(5)}
        roughness={pipeRough(5)}
      />

      {/* Elbow: horizontal to down into water heater */}
      <ElbowJoint
        position={[2.38, 1.85, pipeZ]}
        rotation={[0, -Math.PI / 2, 0]}
        tubeRadius={pipeRadius(5) * 0.7}
        bendRadius={0.1}
        color={coldPipeColor(5)}
        metalness={pipeMetal(5)}
        roughness={pipeRough(5)}
      />

      {/* Vertical pipe down into water heater */}
      <Pipe
        position={[2.38, 1.4, pipeZ]}
        length={0.8}
        radius={pipeRadius(5) * 0.8}
        color={coldPipeColor(5)}
        metalness={pipeMetal(5)}
        roughness={pipeRough(5)}
      />

      {/* ===== LEAK / DRIP EFFECTS (ruined state) ===== */}
      {/* Drip below hot valve */}
      <WaterDrops
        position={[-2, -0.6, pipeZ + 0.05]}
        count={8}
        spread={0.15}
        opacity={lerp(0.7, 0, progress)}
      />
      {/* Drip below a T-joint */}
      <WaterDrops
        position={[-0.5, 1.7, pipeZ + 0.05]}
        count={6}
        spread={0.1}
        opacity={lerp(0.55, 0, progress)}
      />
      {/* Major leak on cold horizontal */}
      <WaterDrops
        position={[0.8, 0.5, pipeZ + 0.05]}
        count={12}
        spread={0.2}
        opacity={lerp(0.8, 0, progress)}
      />
      {/* Drip at drain connection */}
      <WaterDrops
        position={[0.5, 0.2, pipeZ + 0.2]}
        count={5}
        spread={0.12}
        opacity={lerp(0.5, 0, progress)}
      />
    </group>
  );
}
