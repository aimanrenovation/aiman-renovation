// Blueprint layout — viewBox 1000x720
// Matches Gemini reference: blueprint.jpeg
// House: x=130→830, y=100→510 (15m x 9.5m)
//
// NORD (haut)
// ┌──────────────┬─────┬────┬──────────────┐ y=100
// │   CUISINE    │ SDB │ WC │   GARAGE     │
// │   (plan L)   │     │    │  (véhicule)  │
// ├──────────────┴─────┴────┼──────────────┤ y=290
// │      CORRIDOR DISTRIBUTIVE             │
// ├────────┬───────┬────────┼──────────────┤ y=340
// │ SALON  │  SAM  │ CH. 1  │  CHAMBRE 2   │
// │  (TV)  │(table)│Parent. │ (lit+bureau) │
// └────────┴───────┴────────┴──────────────┘ y=510
// SUD (bas = Jardin)
//      TERRASSE (y=515→580)
// x=130  x=390 x=480 x=540              x=830

export interface WallSegment {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "exterior" | "interior";
}

export interface WindowSeg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  orientation: "h" | "v";
  midpoint: number;
}

// ─── Exterior walls (6px thick) ───────────────────────────────────

export const EXTERIOR_WALLS: WallSegment[] = [
  // NORD (y=98) — segments avec ouvertures
  { x: 128, y: 98, w: 52, h: 6, type: "exterior" },    // coin gauche → fenêtre cuisine
  { x: 320, y: 98, w: 70, h: 6, type: "exterior" },     // fenêtre cuisine → SDB
  { x: 460, y: 98, w: 80, h: 6, type: "exterior" },     // SDB → porte garage (mur entre WC et garage)
  { x: 540, y: 98, w: 80, h: 6, type: "exterior" },     // début garage → porte garage
  { x: 790, y: 98, w: 42, h: 6, type: "exterior" },     // porte garage → coin droit

  // SUD (y=508) — segments avec ouvertures
  { x: 128, y: 508, w: 12, h: 6, type: "exterior" },    // coin gauche → baie vitrée salon
  { x: 270, y: 508, w: 30, h: 6, type: "exterior" },    // baie vitrée → entre salon/SAM
  { x: 300, y: 508, w: 70, h: 6, type: "exterior" },    // porte entrée zone
  { x: 370, y: 508, w: 100, h: 6, type: "exterior" },   // → fenêtre ch1
  { x: 560, y: 508, w: 100, h: 6, type: "exterior" },   // fenêtre ch1 → fenêtre ch2
  { x: 780, y: 508, w: 52, h: 6, type: "exterior" },    // fenêtre ch2 → coin droit

  // OUEST (x=128) — segments avec ouvertures
  { x: 128, y: 100, w: 6, h: 50, type: "exterior" },    // coin haut → fenêtre cuisine
  { x: 128, y: 240, w: 6, h: 50, type: "exterior" },    // fenêtre cuisine → corridor
  { x: 128, y: 290, w: 6, h: 80, type: "exterior" },    // corridor → fenêtre salon
  { x: 128, y: 460, w: 6, h: 54, type: "exterior" },    // fenêtre salon → coin bas

  // EST (x=828) — segments avec ouvertures
  { x: 828, y: 100, w: 6, h: 50, type: "exterior" },    // coin haut → fenêtre garage
  { x: 828, y: 230, w: 6, h: 60, type: "exterior" },    // fenêtre garage → corridor
  { x: 828, y: 290, w: 6, h: 90, type: "exterior" },    // corridor → fenêtre ch2
  { x: 828, y: 460, w: 6, h: 54, type: "exterior" },    // fenêtre ch2 → coin bas
];

// ─── Interior walls (4px thick) ───────────────────────────────────

export const INTERIOR_WALLS: WallSegment[] = [
  // ── Rangée haute ──
  // Cuisine | SDB (vertical x=390)
  { x: 388, y: 100, w: 4, h: 190, type: "interior" },
  // SDB | WC (vertical x=480)
  { x: 478, y: 100, w: 4, h: 190, type: "interior" },
  // WC | Garage (vertical x=540)
  { x: 538, y: 100, w: 4, h: 190, type: "interior" },

  // ── Corridor ──
  // Mur haut corridor (y=290, pleine largeur)
  { x: 130, y: 288, w: 700, h: 4, type: "interior" },
  // Mur bas corridor (y=340, pleine largeur)
  { x: 130, y: 338, w: 700, h: 4, type: "interior" },

  // ── Rangée basse ──
  // Salon | SAM (vertical x=310)
  { x: 308, y: 340, w: 4, h: 170, type: "interior" },
  // SAM | Ch1 (vertical x=440)
  { x: 438, y: 340, w: 4, h: 170, type: "interior" },
  // Ch1 | Ch2 (vertical x=600)
  { x: 598, y: 340, w: 4, h: 170, type: "interior" },
];

// ─── Windows ──────────────────────────────────────────────────────

export const WINDOWS: WindowSeg[] = [
  // NORD — fenêtre cuisine
  { x1: 180, y1: 100, x2: 320, y2: 100, orientation: "h", midpoint: 250 },
  // NORD — fenêtre SDB (petite)
  { x1: 410, y1: 100, x2: 460, y2: 100, orientation: "h", midpoint: 435 },

  // SUD — fenêtre ch1
  { x1: 470, y1: 512, x2: 560, y2: 512, orientation: "h", midpoint: 515 },
  // SUD — fenêtre ch2
  { x1: 660, y1: 512, x2: 780, y2: 512, orientation: "h", midpoint: 720 },

  // OUEST — fenêtre cuisine
  { x1: 130, y1: 150, x2: 130, y2: 240, orientation: "v", midpoint: 195 },
  // OUEST — fenêtre salon
  { x1: 130, y1: 370, x2: 130, y2: 460, orientation: "v", midpoint: 415 },

  // EST — fenêtre garage
  { x1: 832, y1: 150, x2: 832, y2: 230, orientation: "v", midpoint: 190 },
  // EST — fenêtre ch2
  { x1: 832, y1: 380, x2: 832, y2: 460, orientation: "v", midpoint: 420 },
];

// ─── Sliding doors (baies vitrées) ───────────────────────────────

export const SLIDING_DOORS = [
  // Baie vitrée salon → terrasse (sud)
  { x1: 140, y1: 512, x2: 270, y2: 512, orientation: "h" as const, width: 130 },
];

// ─── Garage door ──────────────────────────────────────────────────

export const GARAGE_DOOR = {
  x1: 620,
  y1: 100,
  x2: 790,
  y2: 100,
  orientation: "h" as const,
  width: 170,
};

// ─── Room labels ──────────────────────────────────────────────────

export const ROOM_LABELS = [
  { zoneId: "cuisine", x: 260, y: 200, text: "CUISINE", size: 13 },
  { zoneId: "sdb", x: 435, y: 200, text: "SDB", size: 10 },
  { zoneId: "wc", x: 509, y: 200, text: "WC", size: 10 },
  { zoneId: "garage", x: 685, y: 195, text: "GARAGE", size: 13 },
  { zoneId: "couloir", x: 480, y: 315, text: "CORRIDOR", size: 10 },
  { zoneId: "salon", x: 220, y: 420, text: "SALON", size: 13 },
  { zoneId: "sam", x: 375, y: 420, text: "SAM", size: 11 },
  { zoneId: "chambre1", x: 520, y: 420, text: "CH. 1", size: 12 },
  { zoneId: "chambre2", x: 715, y: 420, text: "CH. 2", size: 12 },
  { zoneId: "terrasse", x: 480, y: 550, text: "TERRASSE", size: 10 },
  { zoneId: "entree", x: 300, y: 530, text: "ENTRÉE", size: 9 },
];
