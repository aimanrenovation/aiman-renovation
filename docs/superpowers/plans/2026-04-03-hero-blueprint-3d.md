# Hero Blueprint 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero with a scroll-driven Three.js animation that transforms a 2D architectural blueprint into a fully renovated 3D living room, revealing each renovation trade (electrical, plumbing, flooring, painting) progressively.

**Architecture:** A `<HeroBlueprint>` client component wraps a sticky R3F `<Canvas>` inside a tall scroll container (500vh). A GSAP ScrollTrigger maps scroll position to a 0-1 progress value. Each child component (FloorPlan, Walls, Electrical, etc.) reads progress and animates accordingly. Overlay text fades in/out per phase.

**Tech Stack:** Next.js 16, React Three Fiber 9, Drei 10, Three.js 0.183, GSAP 3.14 (ScrollTrigger), Lenis (already configured)

---

## File Structure

```
components/sections/hero-blueprint/
  index.ts                 — barrel export
  HeroBlueprint.tsx        — scroll container, sticky canvas wrapper, overlay text
  BlueprintScene.tsx       — R3F Canvas, camera, lights, passes progress to children
  FloorPlan.tsx            — 2D blueprint lines + labels (phase 1)
  Walls.tsx                — extruded walls (phase 2)
  Electrical.tsx           — wires and conduits (phase 3)
  Plumbing.tsx             — copper pipes (phase 4)
  Flooring.tsx             — parquet + tile (phase 5)
  Paint.tsx                — wall color transition (phase 6)
  Furniture.tsx            — furniture pop-in (phase 7)
  materials.ts             — shared materials (blueprint, concrete, wood, tile, paint shader)
  useScrollProgress.ts     — GSAP ScrollTrigger hook returning progress 0-1
  constants.ts             — room dimensions, wall segments, phase thresholds, overlay texts
```

**Modified files:**
- `app/page.tsx` — swap `<Hero />` for `<HeroBlueprint />` (final task)

---

### Task 1: Constants and room geometry data

**Files:**
- Create: `components/sections/hero-blueprint/constants.ts`

- [ ] **Step 1: Create constants file with room dimensions and wall segments**

```ts
// components/sections/hero-blueprint/constants.ts

// Phase thresholds (scroll progress 0-1)
export const PHASES = {
  BLUEPRINT:    { start: 0.00, end: 0.15 },
  EXTRUSION:    { start: 0.15, end: 0.25 },
  ELECTRICAL:   { start: 0.25, end: 0.40 },
  PLUMBING:     { start: 0.40, end: 0.55 },
  FLOORING:     { start: 0.55, end: 0.70 },
  PAINT:        { start: 0.70, end: 0.85 },
  FURNITURE:    { start: 0.85, end: 1.00 },
} as const;

// Normalized progress within a phase (0-1)
export function phaseProgress(progress: number, phase: keyof typeof PHASES): number {
  const { start, end } = PHASES[phase];
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

// Room layout — all units in meters, origin at center of full floor plan
export const ROOM = {
  // Overall bounding box
  width: 12,   // x-axis
  depth: 8,    // z-axis
  wallHeight: 2.7,
  wallThickness: 0.15,

  // Kitchen zone (top-left quadrant)
  kitchen: { x: -3, z: -2.5, width: 4, depth: 3 },
  // Living/dining zone (remaining space)
  living: { x: 2, z: 0, width: 8, depth: 8 },
} as const;

// Wall segments as [startX, startZ, endX, endZ]
export const WALL_SEGMENTS: [number, number, number, number][] = [
  // Outer walls
  [-6, -4, 6, -4],   // bottom
  [6, -4, 6, 4],     // right
  [6, 4, -6, 4],     // top
  [-6, 4, -6, -4],   // left
  // Kitchen partition (partial wall with opening)
  [-1, 4, -1, 1],    // vertical partition
];

// Overlay texts per phase
export const OVERLAY_TEXTS = [
  { phase: 'BLUEPRINT' as const, text: 'Votre projet commence ici' },
  { phase: 'EXTRUSION' as const, text: 'Structure & gros œuvre' },
  { phase: 'ELECTRICAL' as const, text: 'Électricité aux normes' },
  { phase: 'PLUMBING' as const, text: 'Plomberie & raccordements' },
  { phase: 'FLOORING' as const, text: 'Revêtements de sol' },
  { phase: 'PAINT' as const, text: 'Finitions & peinture' },
  { phase: 'FURNITURE' as const, text: 'Prêt à vivre' },
];

// Colors
export const COLORS = {
  blueprintBg: '#0A0A0A',
  blueprintLine: '#4A9EFF',
  concrete: '#8B8B8B',
  plaster: '#D4CBC2',
  electricRed: '#E50000',
  electricBlue: '#4A9EFF',
  copper: '#B87333',
  wood: '#8B6914',
  tile: '#F0EDE8',
  paintWhite: '#F5F5F5',
  paintGrey: '#E0E0E0',
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/constants.ts
git commit -m "feat(hero-3d): add constants — room geometry, phases, colors"
```

---

### Task 2: Scroll progress hook

**Files:**
- Create: `components/sections/hero-blueprint/useScrollProgress.ts`

- [ ] **Step 1: Create the GSAP ScrollTrigger hook**

```ts
// components/sections/hero-blueprint/useScrollProgress.ts
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Returns a mutable ref whose `.current` is the scroll progress (0-1).
 * Using a ref instead of state avoids re-renders on every scroll frame —
 * R3F components read it inside useFrame.
 */
export function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef]);

  return progress;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/useScrollProgress.ts
git commit -m "feat(hero-3d): add useScrollProgress hook with GSAP ScrollTrigger"
```

---

### Task 3: Shared materials

**Files:**
- Create: `components/sections/hero-blueprint/materials.ts`

- [ ] **Step 1: Create materials file**

```ts
// components/sections/hero-blueprint/materials.ts
import * as THREE from "three";
import { COLORS } from "./constants";

export const blueprintLineMaterial = new THREE.LineBasicMaterial({
  color: COLORS.blueprintLine,
  transparent: true,
});

export const concreteMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.concrete,
  roughness: 0.9,
  metalness: 0.0,
});

export const woodMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.wood,
  roughness: 0.7,
  metalness: 0.0,
});

export const tileMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.tile,
  roughness: 0.3,
  metalness: 0.0,
});

export const copperMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.copper,
  roughness: 0.4,
  metalness: 0.7,
});

export const electricRedMaterial = new THREE.MeshBasicMaterial({
  color: COLORS.electricRed,
});

export const electricBlueMaterial = new THREE.MeshBasicMaterial({
  color: COLORS.electricBlue,
});

// Paint shader — transitions from concrete grey to final white
// uniform paintProgress: 0 = concrete, 1 = painted
export const paintShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    paintProgress: { value: 0 },
    concreteColor: { value: new THREE.Color(COLORS.plaster) },
    paintColor: { value: new THREE.Color(COLORS.paintWhite) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float paintProgress;
    uniform vec3 concreteColor;
    uniform vec3 paintColor;
    varying vec2 vUv;
    void main() {
      // Paint rises from bottom: vUv.y goes 0 (bottom) to 1 (top)
      float edge = smoothstep(paintProgress - 0.05, paintProgress + 0.05, vUv.y);
      vec3 color = mix(paintColor, concreteColor, edge);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/materials.ts
git commit -m "feat(hero-3d): add shared materials — blueprint, concrete, wood, paint shader"
```

---

### Task 4: FloorPlan component (Phase 1 — Blueprint)

**Files:**
- Create: `components/sections/hero-blueprint/FloorPlan.tsx`

- [ ] **Step 1: Create 2D blueprint floor plan**

```tsx
// components/sections/hero-blueprint/FloorPlan.tsx
"use client";

import { useMemo } from "react";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { WALL_SEGMENTS, ROOM, COLORS, phaseProgress } from "./constants";

interface FloorPlanProps {
  progress: number;
}

export function FloorPlan({ progress }: FloorPlanProps) {
  // Fade out during extrusion phase
  const opacity = 1 - phaseProgress(progress, "EXTRUSION");

  const wallLines = useMemo(() => {
    return WALL_SEGMENTS.map(([x1, z1, x2, z2], i) => {
      const points = [
        new THREE.Vector3(x1, 0.01, z1),
        new THREE.Vector3(x2, 0.01, z2),
      ];
      return (
        <Line
          key={i}
          points={points}
          color={COLORS.blueprintLine}
          lineWidth={2}
          transparent
          opacity={opacity}
        />
      );
    });
  }, [opacity]);

  // Dimension annotations (dashed lines + text)
  const labels = useMemo(() => [
    { position: [0, 0.01, -5.5] as [number, number, number], text: `${ROOM.width}m`, rotation: 0 },
    { position: [-7.5, 0.01, 0] as [number, number, number], text: `${ROOM.depth}m`, rotation: Math.PI / 2 },
    { position: [-3, 0.01, 2.8] as [number, number, number], text: "CUISINE", rotation: 0 },
    { position: [2.5, 0.01, 0] as [number, number, number], text: "SÉJOUR / SAM", rotation: 0 },
  ], []);

  if (opacity <= 0) return null;

  return (
    <group>
      {wallLines}
      {labels.map((label, i) => (
        <Text
          key={i}
          position={label.position}
          rotation={[-Math.PI / 2, 0, label.rotation]}
          fontSize={0.5}
          color={COLORS.blueprintLine}
          anchorX="center"
          anchorY="middle"
          font="/fonts/mono.woff"
          fillOpacity={opacity}
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/FloorPlan.tsx
git commit -m "feat(hero-3d): add FloorPlan — 2D blueprint lines and labels"
```

---

### Task 5: Walls component (Phase 2 — Extrusion)

**Files:**
- Create: `components/sections/hero-blueprint/Walls.tsx`

- [ ] **Step 1: Create walls with animated height**

```tsx
// components/sections/hero-blueprint/Walls.tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WALL_SEGMENTS, ROOM, phaseProgress } from "./constants";
import { concreteMaterial, paintShaderMaterial } from "./materials";

interface WallsProps {
  progress: number;
}

interface WallMeshData {
  position: [number, number, number];
  scale: [number, number, number];
  rotationY: number;
}

export function Walls({ progress }: WallsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-compute wall mesh data from segments
  const wallData: WallMeshData[] = useMemo(() => {
    return WALL_SEGMENTS.map(([x1, z1, x2, z2]) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const cx = (x1 + x2) / 2;
      const cz = (z1 + z2) / 2;
      return {
        position: [cx, 0, cz] as [number, number, number],
        scale: [ROOM.wallThickness, ROOM.wallHeight, length] as [number, number, number],
        rotationY: angle,
      };
    });
  }, []);

  const extrusionProgress = phaseProgress(progress, "EXTRUSION");
  const paintProgress = phaseProgress(progress, "PAINT");

  // Determine which material to use based on paint progress
  const activeMaterial = paintProgress > 0 ? paintShaderMaterial : concreteMaterial;

  // Update paint shader uniform
  if (paintProgress > 0) {
    paintShaderMaterial.uniforms.paintProgress.value = paintProgress;
  }

  if (extrusionProgress <= 0) return null;

  const heightScale = extrusionProgress;

  return (
    <group ref={groupRef}>
      {wallData.map((wall, i) => (
        <mesh
          key={i}
          position={[wall.position[0], (wall.scale[1] * heightScale) / 2, wall.position[2]]}
          rotation={[0, wall.rotationY, 0]}
          scale={[wall.scale[0], wall.scale[1] * heightScale, wall.scale[2]]}
          material={activeMaterial}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/Walls.tsx
git commit -m "feat(hero-3d): add Walls — animated extrusion with paint shader"
```

---

### Task 6: Electrical component (Phase 3)

**Files:**
- Create: `components/sections/hero-blueprint/Electrical.tsx`

- [ ] **Step 1: Create electrical wires along walls**

```tsx
// components/sections/hero-blueprint/Electrical.tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ROOM, phaseProgress, COLORS } from "./constants";

interface ElectricalProps {
  progress: number;
}

// Wire paths: arrays of [x, y, z] points running along walls
const WIRE_PATHS = {
  phase: [
    // Horizontal run along back wall at 1.2m height
    [-6, 1.2, 3.9], [-2, 1.2, 3.9], [2, 1.2, 3.9], [5.9, 1.2, 3.9],
  ],
  neutral: [
    // Horizontal run along back wall at 1.0m height
    [-6, 1.0, 3.9], [-2, 1.0, 3.9], [2, 1.0, 3.9], [5.9, 1.0, 3.9],
  ],
  drops: [
    // Vertical drops for switches/outlets
    { points: [[-2, 1.2, 3.9], [-2, 0.4, 3.9]], color: COLORS.electricRed },
    { points: [[2, 1.2, 3.9], [2, 0.4, 3.9]], color: COLORS.electricRed },
    { points: [[5, 1.2, 3.9], [5, 0.4, 3.9]], color: COLORS.electricBlue },
    // Kitchen wall drops
    { points: [[-1.1, 1.2, 2], [-1.1, 0.9, 2]], color: COLORS.electricRed },
    { points: [[-1.1, 1.0, 3], [-1.1, 0.4, 3]], color: COLORS.electricBlue },
  ],
};

function WireTube({ points, color, drawFraction }: {
  points: number[][];
  color: string;
  drawFraction: number;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    );
    return new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
  }, [points]);

  // Animate draw range
  const count = Math.floor(geometry.index!.count * drawFraction);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} />
      <primitive object={geometry} attach="geometry" drawRange={{ start: 0, count }} />
    </mesh>
  );
}

export function Electrical({ progress }: ElectricalProps) {
  const elecProgress = phaseProgress(progress, "ELECTRICAL");

  if (elecProgress <= 0) return null;

  return (
    <group>
      {/* Main phase wire (red) */}
      <WireTube
        points={WIRE_PATHS.phase}
        color={COLORS.electricRed}
        drawFraction={elecProgress}
      />
      {/* Main neutral wire (blue) */}
      <WireTube
        points={WIRE_PATHS.neutral}
        color={COLORS.electricBlue}
        drawFraction={elecProgress}
      />
      {/* Vertical drops — appear after main runs are 50% done */}
      {WIRE_PATHS.drops.map((drop, i) => (
        <WireTube
          key={i}
          points={drop.points}
          color={drop.color}
          drawFraction={Math.max(0, (elecProgress - 0.5) * 2)}
        />
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/Electrical.tsx
git commit -m "feat(hero-3d): add Electrical — wires with progressive draw"
```

---

### Task 7: Plumbing component (Phase 4)

**Files:**
- Create: `components/sections/hero-blueprint/Plumbing.tsx`

- [ ] **Step 1: Create copper pipes for kitchen**

```tsx
// components/sections/hero-blueprint/Plumbing.tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { phaseProgress } from "./constants";
import { copperMaterial } from "./materials";

interface PlumbingProps {
  progress: number;
}

// Pipe paths — kitchen area water supply and drain
const PIPE_PATHS = [
  // Cold water supply — enters from left wall, runs to sink area
  { points: [[-6, 0.3, 2], [-4, 0.3, 2], [-3, 0.3, 2.5]], radius: 0.03 },
  // Hot water supply — parallel, slightly lower
  { points: [[-6, 0.15, 2], [-4, 0.15, 2], [-3, 0.15, 2.5]], radius: 0.03 },
  // Drain — larger pipe, lower position
  { points: [[-3, 0.05, 2.5], [-4, 0.05, 2.5], [-6, 0.05, 2.5]], radius: 0.05 },
  // Vertical riser to sink
  { points: [[-3, 0.05, 2.5], [-3, 0.9, 2.5]], radius: 0.03 },
];

export function Plumbing({ progress }: PlumbingProps) {
  const plumbProgress = phaseProgress(progress, "PLUMBING");

  const pipes = useMemo(() => {
    return PIPE_PATHS.map((pipe, i) => {
      const curve = new THREE.CatmullRomCurve3(
        pipe.points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
      );
      const geometry = new THREE.TubeGeometry(curve, 16, pipe.radius, 8, false);
      return { geometry, key: i };
    });
  }, []);

  if (plumbProgress <= 0) return null;

  return (
    <group>
      {pipes.map(({ geometry, key }, i) => {
        // Stagger each pipe's appearance
        const stagger = i / pipes.length;
        const pipeProgress = Math.max(0, (plumbProgress - stagger * 0.3) / (1 - stagger * 0.3));
        const count = Math.floor(geometry.index!.count * pipeProgress);

        return (
          <mesh key={key} geometry={geometry} material={copperMaterial}>
            <primitive object={geometry} attach="geometry" drawRange={{ start: 0, count }} />
          </mesh>
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/Plumbing.tsx
git commit -m "feat(hero-3d): add Plumbing — copper pipes with staggered draw"
```

---

### Task 8: Flooring component (Phase 5)

**Files:**
- Create: `components/sections/hero-blueprint/Flooring.tsx`

- [ ] **Step 1: Create parquet and tile flooring with wave effect**

```tsx
// components/sections/hero-blueprint/Flooring.tsx
"use client";

import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { ROOM, phaseProgress, COLORS } from "./constants";
import { woodMaterial, tileMaterial } from "./materials";

interface FlooringProps {
  progress: number;
}

// Parquet plank dimensions
const PLANK = { width: 0.15, length: 0.9, gap: 0.01 };
// Tile dimensions
const TILE = { size: 0.4, gap: 0.02 };

export function Flooring({ progress }: FlooringProps) {
  const floorProgress = phaseProgress(progress, "FLOORING");

  // Generate plank positions for living area
  const planks = useMemo(() => {
    const result: { position: [number, number, number]; delay: number }[] = [];
    const startX = -1 + ROOM.wallThickness;
    const endX = 6 - ROOM.wallThickness;
    const startZ = -4 + ROOM.wallThickness;
    const endZ = 4 - ROOM.wallThickness;

    let idx = 0;
    for (let x = startX; x < endX; x += PLANK.width + PLANK.gap) {
      for (let z = startZ; z < endZ; z += PLANK.length + PLANK.gap) {
        // Wave delay based on distance from bottom-left
        const dist = Math.sqrt((x - startX) ** 2 + (z - startZ) ** 2);
        const maxDist = Math.sqrt((endX - startX) ** 2 + (endZ - startZ) ** 2);
        result.push({
          position: [x + PLANK.width / 2, 0.01, z + PLANK.length / 2],
          delay: dist / maxDist,
        });
        idx++;
      }
    }
    return result;
  }, []);

  // Generate tile positions for kitchen area
  const tiles = useMemo(() => {
    const result: { position: [number, number, number]; delay: number }[] = [];
    const startX = -6 + ROOM.wallThickness;
    const endX = -1 - ROOM.wallThickness;
    const startZ = 1;
    const endZ = 4 - ROOM.wallThickness;

    for (let x = startX; x < endX; x += TILE.size + TILE.gap) {
      for (let z = startZ; z < endZ; z += TILE.size + TILE.gap) {
        const dist = Math.sqrt((x - startX) ** 2 + (z - startZ) ** 2);
        const maxDist = Math.sqrt((endX - startX) ** 2 + (endZ - startZ) ** 2);
        result.push({
          position: [x + TILE.size / 2, 0.01, z + TILE.size / 2],
          delay: dist / maxDist,
        });
      }
    }
    return result;
  }, []);

  if (floorProgress <= 0) return null;

  return (
    <group>
      {/* Parquet planks — living area */}
      {planks.map((plank, i) => {
        const t = Math.max(0, Math.min(1, (floorProgress - plank.delay * 0.7) / 0.3));
        if (t <= 0) return null;
        return (
          <mesh key={`p${i}`} position={plank.position} scale={[1, t, 1]}>
            <boxGeometry args={[PLANK.width, 0.02, PLANK.length]} />
            <meshStandardMaterial color={COLORS.wood} roughness={0.7} />
          </mesh>
        );
      })}

      {/* Tiles — kitchen area */}
      {tiles.map((tile, i) => {
        const t = Math.max(0, Math.min(1, (floorProgress - tile.delay * 0.7) / 0.3));
        if (t <= 0) return null;
        return (
          <mesh key={`t${i}`} position={tile.position} scale={[t, 1, t]}>
            <boxGeometry args={[TILE.size, 0.01, TILE.size]} />
            <meshStandardMaterial color={COLORS.tile} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/Flooring.tsx
git commit -m "feat(hero-3d): add Flooring — parquet wave + kitchen tiles"
```

---

### Task 9: Paint component (Phase 6)

**Files:**
- Create: `components/sections/hero-blueprint/Paint.tsx`

- [ ] **Step 1: Create paint component that updates the shader uniform**

The paint effect is handled by `Walls.tsx` via the `paintShaderMaterial`. This component just needs to exist as documentation and could add visual extras (paint splatter, roller, etc.). For MVP, the paint logic is in Walls. We create a minimal component:

```tsx
// components/sections/hero-blueprint/Paint.tsx
"use client";

import { phaseProgress } from "./constants";

interface PaintProps {
  progress: number;
}

/**
 * Paint phase visual effects.
 * The main wall color transition is handled by paintShaderMaterial in Walls.tsx.
 * This component can add extra effects like paint drips or roller marks.
 * For MVP, it serves as a placeholder for future enhancements.
 */
export function Paint({ progress }: PaintProps) {
  const paintProgress = phaseProgress(progress, "PAINT");

  // MVP: paint effect is fully handled by the shader in Walls.tsx
  // Future: add paint drip particles, roller mesh, etc.
  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/Paint.tsx
git commit -m "feat(hero-3d): add Paint — phase 6 placeholder, shader in Walls"
```

---

### Task 10: Furniture component (Phase 7)

**Files:**
- Create: `components/sections/hero-blueprint/Furniture.tsx`

- [ ] **Step 1: Create stylized furniture with pop-in animation**

```tsx
// components/sections/hero-blueprint/Furniture.tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { phaseProgress, COLORS } from "./constants";

interface FurnitureProps {
  progress: number;
}

interface FurnitureItem {
  type: "box" | "cylinder";
  position: [number, number, number];
  size: [number, number, number]; // width, height, depth (or radius, height, radius for cylinder)
  color: string;
  delay: number; // stagger 0-1
}

const ITEMS: FurnitureItem[] = [
  // Living room
  { type: "box", position: [3, 0.35, 1], size: [2.2, 0.7, 0.9], color: "#D4CBC2", delay: 0 },      // Canapé
  { type: "box", position: [3, 0.05, 1], size: [2.4, 0.1, 1.0], color: "#5C4033", delay: 0.05 },    // Base canapé
  { type: "box", position: [1, 0.38, -1.5], size: [1.6, 0.04, 0.9], color: "#8B6914", delay: 0.15 },// Table
  { type: "cylinder", position: [1, 0.19, -1.5], size: [0.04, 0.38, 0.04], color: "#333", delay: 0.15 }, // Pied table
  // Chaises autour de la table
  { type: "box", position: [0.2, 0.25, -1.5], size: [0.4, 0.5, 0.4], color: "#D4CBC2", delay: 0.25 },
  { type: "box", position: [1.8, 0.25, -1.5], size: [0.4, 0.5, 0.4], color: "#D4CBC2", delay: 0.3 },
  { type: "box", position: [1, 0.25, -2.0], size: [0.4, 0.5, 0.4], color: "#D4CBC2", delay: 0.35 },
  { type: "box", position: [1, 0.25, -1.0], size: [0.4, 0.5, 0.4], color: "#D4CBC2", delay: 0.4 },
  // Kitchen
  { type: "box", position: [-3.5, 0.45, 2.8], size: [2.5, 0.9, 0.6], color: "#F0EDE8", delay: 0.5 },// Plan de travail
  { type: "box", position: [-3, 0.55, 1.8], size: [1.5, 1.1, 0.6], color: "#E0E0E0", delay: 0.55 }, // Îlot
  // Luminaire (ceiling pendant — simplified cylinder)
  { type: "cylinder", position: [1, 2.4, -1.5], size: [0.3, 0.05, 0.3], color: "#222", delay: 0.7 },
  { type: "cylinder", position: [-3, 2.4, 2.5], size: [0.2, 0.05, 0.2], color: "#222", delay: 0.75 },
];

export function Furniture({ progress }: FurnitureProps) {
  const furnitureProgress = phaseProgress(progress, "FURNITURE");

  if (furnitureProgress <= 0) return null;

  return (
    <group>
      {ITEMS.map((item, i) => {
        // Staggered pop-in
        const t = Math.max(0, Math.min(1, (furnitureProgress - item.delay) / 0.3));
        if (t <= 0) return null;

        // Ease-out bounce-like scale
        const scale = t < 1 ? t * (2 - t) : 1; // ease-out quad

        return item.type === "box" ? (
          <mesh key={i} position={item.position} scale={scale}>
            <boxGeometry args={item.size} />
            <meshStandardMaterial color={item.color} roughness={0.6} />
          </mesh>
        ) : (
          <mesh key={i} position={item.position} scale={scale}>
            <cylinderGeometry args={[item.size[0], item.size[2], item.size[1], 16]} />
            <meshStandardMaterial color={item.color} roughness={0.5} metalness={0.2} />
          </mesh>
        );
      })}

      {/* Warm point light that fades in with furniture */}
      <pointLight
        position={[1, 2.3, -1.5]}
        color="#FFF0D4"
        intensity={furnitureProgress * 2}
        distance={8}
      />
      <pointLight
        position={[-3, 2.3, 2.5]}
        color="#FFF0D4"
        intensity={furnitureProgress * 1.5}
        distance={6}
      />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/Furniture.tsx
git commit -m "feat(hero-3d): add Furniture — pop-in furniture with warm lighting"
```

---

### Task 11: BlueprintScene — R3F Canvas with camera animation

**Files:**
- Create: `components/sections/hero-blueprint/BlueprintScene.tsx`

- [ ] **Step 1: Create the main 3D scene**

```tsx
// components/sections/hero-blueprint/BlueprintScene.tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FloorPlan } from "./FloorPlan";
import { Walls } from "./Walls";
import { Electrical } from "./Electrical";
import { Plumbing } from "./Plumbing";
import { Flooring } from "./Flooring";
import { Furniture } from "./Furniture";

interface BlueprintSceneProps {
  progressRef: React.RefObject<{ current: number }>;
}

/**
 * Inner scene component — runs inside R3F Canvas context.
 * Reads progress from ref each frame to avoid re-renders.
 */
function Scene({ progressRef }: { progressRef: React.RefObject<{ current: number }> }) {
  const { camera } = useThree();
  const progressValue = useRef(0);

  // Camera positions
  const topDown = new THREE.Vector3(0, 18, 0);
  const perspective = new THREE.Vector3(8, 12, 12);
  const lookAt = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    const p = progressRef.current?.current ?? 0;
    progressValue.current = p;

    // Camera transition: top-down (0-0.15) → perspective (0.15-0.25) → slow orbit (0.25-1.0)
    let camPos: THREE.Vector3;

    if (p < 0.15) {
      // Pure top-down
      camPos = topDown.clone();
    } else if (p < 0.25) {
      // Transition to perspective
      const t = (p - 0.15) / 0.10;
      camPos = topDown.clone().lerp(perspective, t);
    } else {
      // Slow orbit around the scene
      const orbitT = (p - 0.25) / 0.75;
      const angle = orbitT * Math.PI * 0.3; // 54 degrees total rotation
      const radius = 16;
      const height = 12 - orbitT * 3; // slowly descend
      camPos = new THREE.Vector3(
        Math.sin(angle) * radius,
        height,
        Math.cos(angle) * radius
      );
    }

    camera.position.lerp(camPos, 0.1);
    camera.lookAt(lookAt);
  });

  const p = progressValue.current;

  return (
    <>
      {/* Ambient light — always on, increases with progress */}
      <ambientLight intensity={0.3 + p * 0.4} />
      {/* Directional light — simulates sun */}
      <directionalLight position={[5, 10, 5]} intensity={0.5 + p * 0.5} castShadow={false} />

      {/* Ground plane — subtle grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>

      {/* Phase components — all receive progress */}
      <SceneChildren progressRef={progressRef} />
    </>
  );
}

/**
 * Separate component that re-reads progress in useFrame
 * and passes it as props to children.
 */
function SceneChildren({ progressRef }: { progressRef: React.RefObject<{ current: number }> }) {
  const progress = useRef(0);

  useFrame(() => {
    progress.current = progressRef.current?.current ?? 0;
  });

  // Force re-render at ~30fps for smooth animations
  // We use a state trick to trigger re-renders
  const [, setTick] = (await import("react")).useState(0);
  useFrame(() => {
    setTick((t: number) => t + 1);
  });

  const p = progress.current;

  return (
    <>
      <FloorPlan progress={p} />
      <Walls progress={p} />
      <Electrical progress={p} />
      <Plumbing progress={p} />
      <Flooring progress={p} />
      <Furniture progress={p} />
    </>
  );
}

export function BlueprintScene({ progressRef }: BlueprintSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 18, 0], fov: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#0A0A0A" }}
      dpr={[1, 1.5]}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
```

**IMPORTANT:** The `SceneChildren` component above uses a bad pattern (dynamic import inside component). Fix this in implementation by using `useState` directly:

```tsx
import { useRef, useState } from "react";
// ... and in SceneChildren:
const [, setTick] = useState(0);
useFrame(() => { setTick(t => t + 1); });
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/hero-blueprint/BlueprintScene.tsx
git commit -m "feat(hero-3d): add BlueprintScene — R3F canvas with camera animation"
```

---

### Task 12: HeroBlueprint — main container with scroll and overlay

**Files:**
- Create: `components/sections/hero-blueprint/HeroBlueprint.tsx`
- Create: `components/sections/hero-blueprint/index.ts`

- [ ] **Step 1: Create HeroBlueprint container**

```tsx
// components/sections/hero-blueprint/HeroBlueprint.tsx
"use client";

import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { OVERLAY_TEXTS, PHASES, phaseProgress } from "./constants";

const BlueprintScene = lazy(() =>
  import("./BlueprintScene").then((m) => ({ default: m.BlueprintScene }))
);

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

export function HeroBlueprint() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useScrollProgress(containerRef);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Update overlay text based on scroll
  useEffect(() => {
    let raf: number;
    const update = () => {
      const p = progressRef.current;
      const phases = Object.values(PHASES);
      let phase = 0;
      for (let i = phases.length - 1; i >= 0; i--) {
        if (p >= phases[i].start) { phase = i; break; }
      }
      setCurrentPhase(phase);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  // Reduced motion: show static fallback
  if (reducedMotion) {
    return (
      <section className="relative h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-heading text-4xl md:text-6xl text-white">
            RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
          </h1>
          <p className="mt-4 text-white/60 text-lg">
            Du plan à la réalisation — chaque étape compte
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0A0A0A] md:h-[500vh] h-[400vh]"
      aria-label="Animation 3D montrant les étapes de rénovation d'un séjour"
    >
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Suspense fallback={<Loader />}>
          <BlueprintScene progressRef={progressRef} />
        </Suspense>

        {/* Overlay text */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-24 md:pb-32">
          {OVERLAY_TEXTS.map((item, i) => {
            const isActive = i === currentPhase;
            return (
              <p
                key={i}
                className={`absolute font-heading text-2xl md:text-4xl text-white transition-all duration-700 ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {item.text}
              </p>
            );
          })}
        </div>

        {/* Scroll indicator — only visible at start */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-500 ${
            currentPhase === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="animate-bounce">
            <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
      </div>

      {/* noscript fallback */}
      <noscript>
        <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
          <p className="font-heading text-3xl text-white text-center px-6">
            RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
          </p>
        </div>
      </noscript>
    </section>
  );
}
```

- [ ] **Step 2: Create barrel export**

```ts
// components/sections/hero-blueprint/index.ts
export { HeroBlueprint } from "./HeroBlueprint";
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/hero-blueprint/HeroBlueprint.tsx components/sections/hero-blueprint/index.ts
git commit -m "feat(hero-3d): add HeroBlueprint — scroll container, overlay text, lazy loading"
```

---

### Task 13: Wire up to homepage

**Files:**
- Modify: `app/page.tsx` — replace `<Hero />` with `<HeroBlueprint />`

- [ ] **Step 1: Update page.tsx import and usage**

In `app/page.tsx`, make these changes:

Replace:
```tsx
import { Hero } from "@/components/sections/hero";
```
With:
```tsx
import { HeroBlueprint } from "@/components/sections/hero-blueprint";
```

Replace:
```tsx
<Hero />
```
With:
```tsx
<HeroBlueprint />
```

Keep the old `Hero` import commented out for easy rollback:
```tsx
// import { Hero } from "@/components/sections/hero";
```

- [ ] **Step 2: Run dev server and test**

```bash
cd /Users/Aiman/aiman-renovation && npm run dev
```

Open `http://localhost:3000`. Verify:
- Black background with blue blueprint lines visible on load
- Scrolling progresses through all 7 phases
- Camera transitions from top-down to perspective
- Overlay text changes per phase
- No console errors

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(hero-3d): wire HeroBlueprint to homepage, replacing video hero"
```

---

### Task 14: Visual polish and bug fixes

**Files:**
- May modify any file in `components/sections/hero-blueprint/`

- [ ] **Step 1: Test and fix visual issues**

Run the dev server and scroll through the full animation. Check each phase:
1. Blueprint lines are visible and properly positioned
2. Walls extrude smoothly upward
3. Electrical wires draw progressively
4. Plumbing pipes appear with copper color
5. Flooring lays down with wave effect
6. Paint shader transitions walls from grey to white
7. Furniture pops in with warm lighting

Fix any z-fighting, positioning, or timing issues found.

- [ ] **Step 2: Test mobile responsive**

Open Chrome DevTools, switch to iPhone viewport. Verify:
- Scroll container uses `h-[400vh]` on mobile
- Scene renders (may be simplified)
- No performance lag

- [ ] **Step 3: Final commit**

```bash
git add -A components/sections/hero-blueprint/
git commit -m "feat(hero-3d): visual polish and mobile adjustments"
```

---

### Task 15: Font file for blueprint labels

**Files:**
- Add: `public/fonts/mono.woff` — a monospace font for blueprint annotations

- [ ] **Step 1: Check if a mono font exists or use system font**

If no mono font is in `/public/fonts/`, update `FloorPlan.tsx` to remove the `font` prop from `<Text>` (Drei will use a default sans font). Or download a free mono font like JetBrains Mono and place it at `public/fonts/mono.woff`.

Alternative: change the `<Text>` component to not specify a font, using Drei's built-in default:

```tsx
// In FloorPlan.tsx, remove font prop:
<Text ... font={undefined}>
```

- [ ] **Step 2: Commit if any changes**

```bash
git add public/fonts/ components/sections/hero-blueprint/FloorPlan.tsx
git commit -m "feat(hero-3d): configure blueprint label font"
```
