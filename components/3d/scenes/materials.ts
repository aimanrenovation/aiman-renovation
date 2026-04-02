// Couleurs de la marque
export const BRAND = {
  red: '#E50000',
  black: '#0A0A0A',
  white: '#FFFFFF',
  blue: '#002395',
  triRed: '#ED2939',
} as const;

// Couleurs scènes : état dégradé
export const RUIN = {
  wall: '#4a3f35',
  floor: '#3d3428',
  accent: '#6b5b4a',
  metal: '#5c4f3d',
  dirt: '#2e2518',
} as const;

// Couleurs scènes : état rénové
export const RENOVATED = {
  wall: '#f5f5f0',
  floor: '#e8e0d4',
  accent: '#E50000',
  metal: '#c0c0c0',
  clean: '#fafaf8',
} as const;

/** Interpole linéairement entre deux couleurs hex en fonction du progress */
export function lerpColor(colorA: string, colorB: string, t: number): string {
  const a = parseInt(colorA.slice(1), 16);
  const b = parseInt(colorB.slice(1), 16);

  const rA = (a >> 16) & 0xff, gA = (a >> 8) & 0xff, bA = a & 0xff;
  const rB = (b >> 16) & 0xff, gB = (b >> 8) & 0xff, bB = b & 0xff;

  const r = Math.round(rA + (rB - rA) * t);
  const g = Math.round(gA + (gB - gA) * t);
  const bl = Math.round(bA + (bB - bA) * t);

  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}

/** Interpole linéairement entre deux nombres */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
