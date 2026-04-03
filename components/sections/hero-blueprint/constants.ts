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

export type PhaseName = keyof typeof PHASES;

// Normalized progress within a phase (0-1)
export function phaseProgress(progress: number, phase: PhaseName): number {
  const { start, end } = PHASES[phase];
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

// Room layout — all units in meters, origin at center
export const ROOM = {
  width: 12,
  depth: 8,
  wallHeight: 2.7,
  wallThickness: 0.15,
  kitchen: { x: -3, z: -2.5, width: 4, depth: 3 },
  living: { x: 2, z: 0, width: 8, depth: 8 },
} as const;

// Wall segments as [startX, startZ, endX, endZ]
export const WALL_SEGMENTS: [number, number, number, number][] = [
  [-6, -4, 6, -4],   // bottom
  [6, -4, 6, 4],     // right
  [6, 4, -6, 4],     // top
  [-6, 4, -6, -4],   // left
  [-1, 4, -1, 1],    // kitchen partition
];

// Overlay texts per phase
export const OVERLAY_TEXTS: { phase: PhaseName; text: string }[] = [
  { phase: 'BLUEPRINT', text: 'Votre projet commence ici' },
  { phase: 'EXTRUSION', text: 'Structure & gros œuvre' },
  { phase: 'ELECTRICAL', text: 'Électricité aux normes' },
  { phase: 'PLUMBING', text: 'Plomberie & raccordements' },
  { phase: 'FLOORING', text: 'Revêtements de sol' },
  { phase: 'PAINT', text: 'Finitions & peinture' },
  { phase: 'FURNITURE', text: 'Prêt à vivre' },
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
