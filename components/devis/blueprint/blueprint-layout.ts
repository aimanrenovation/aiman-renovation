// Blueprint layout — viewBox 1000x720
// House: x=160→760, y=175→540

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
  // NORD (y=173, top edge) — segments between window/door openings
  { x: 158, y: 173, w: 42, h: 6, type: "exterior" },   // left corner → fenêtre salon 1
  { x: 315, y: 173, w: 85, h: 6, type: "exterior" },    // between fenêtres salon 1 & 2
  { x: 505, y: 173, w: 95, h: 6, type: "exterior" },    // fenêtre salon 2 → garage wall
  { x: 600, y: 173, w: 20, h: 6, type: "exterior" },    // garage wall → porte garage
  { x: 720, y: 173, w: 40, h: 6, type: "exterior" },    // porte garage → right corner

  // SUD (y=538, bottom edge) — segments between openings
  { x: 158, y: 538, w: 42, h: 6, type: "exterior" },    // left corner → fenêtre cuisine
  { x: 250, y: 538, w: 60, h: 6, type: "exterior" },    // fenêtre cuisine → porte entrée
  { x: 352, y: 538, w: 63, h: 6, type: "exterior" },    // porte entrée → fenêtre ch1
  { x: 490, y: 538, w: 110, h: 6, type: "exterior" },   // fenêtre ch1 → garage separation
  { x: 600, y: 538, w: 40, h: 6, type: "exterior" },    // garage sep → fenêtre ch2
  { x: 720, y: 538, w: 40, h: 6, type: "exterior" },    // fenêtre ch2 → right corner

  // OUEST (x=158, left edge) — segments between openings
  { x: 158, y: 173, w: 6, h: 87, type: "exterior" },    // top corner → fenêtre salon
  { x: 158, y: 345, w: 6, h: 193, type: "exterior" },   // fenêtre salon → bottom corner

  // EST (x=758, right edge) — segments between openings
  { x: 758, y: 173, w: 6, h: 82, type: "exterior" },    // top corner → fenêtre garage
  { x: 758, y: 320, w: 6, h: 120, type: "exterior" },   // fenêtre garage → fenêtre ch2
  { x: 758, y: 510, w: 6, h: 34, type: "exterior" },    // fenêtre ch2 → bottom corner
];

// ─── Interior walls (4px thick) ───────────────────────────────────

export const INTERIOR_WALLS: WallSegment[] = [
  // Séparation salon/garage (vertical x=600)
  { x: 598, y: 175, w: 4, h: 200, type: "interior" },

  // Séparation salon-SAM / couloir (horizontal y=375)
  { x: 160, y: 373, w: 440, h: 4, type: "interior" },

  // Séparation garage / rangée sud (horizontal y=375 côté garage)
  { x: 600, y: 373, w: 160, h: 4, type: "interior" },

  // Séparation couloir / pièces sud (horizontal y=420)
  { x: 290, y: 418, w: 310, h: 4, type: "interior" },

  // Cuisine mur est (vertical x=290)
  { x: 288, y: 375, w: 4, h: 165, type: "interior" },

  // Vestibule mur est (vertical x=345)
  { x: 343, y: 420, w: 4, h: 120, type: "interior" },

  // WC mur est (vertical x=400)
  { x: 398, y: 420, w: 4, h: 120, type: "interior" },

  // SDB mur est (vertical x=475)
  { x: 473, y: 420, w: 4, h: 120, type: "interior" },

  // Ch1 / Ch2 séparation (vertical x=600)
  { x: 598, y: 375, w: 4, h: 165, type: "interior" },
];

// ─── Windows ──────────────────────────────────────────────────────

export const WINDOWS: WindowSeg[] = [
  // NORD — fenêtre salon 1
  { x1: 200, y1: 173, x2: 315, y2: 173, orientation: "h", midpoint: 257 },
  // NORD — fenêtre salon 2
  { x1: 400, y1: 173, x2: 505, y2: 173, orientation: "h", midpoint: 452 },

  // SUD — fenêtre cuisine
  { x1: 200, y1: 540, x2: 250, y2: 540, orientation: "h", midpoint: 225 },
  // SUD — fenêtre ch1
  { x1: 415, y1: 540, x2: 490, y2: 540, orientation: "h", midpoint: 452 },
  // SUD — fenêtre ch2
  { x1: 640, y1: 540, x2: 720, y2: 540, orientation: "h", midpoint: 680 },

  // OUEST — fenêtre salon
  { x1: 160, y1: 260, x2: 160, y2: 345, orientation: "v", midpoint: 302 },

  // EST — fenêtre garage
  { x1: 760, y1: 255, x2: 760, y2: 320, orientation: "v", midpoint: 287 },
  // EST — fenêtre ch2
  { x1: 760, y1: 440, x2: 760, y2: 510, orientation: "v", midpoint: 475 },
];

// ─── Sliding doors (baies vitrées) ───────────────────────────────

export const SLIDING_DOORS = [
  // Baie vitrée salon → terrasse (sud)
  { x1: 160, y1: 540, x2: 240, y2: 540, orientation: "h" as const, width: 80 },
];

// ─── Garage door ──────────────────────────────────────────────────

export const GARAGE_DOOR = {
  x1: 620,
  y1: 173,
  x2: 720,
  y2: 173,
  orientation: "h" as const,
  width: 100,
};

// ─── Room labels ──────────────────────────────────────────────────

export const ROOM_LABELS = [
  { zoneId: "salon", x: 370, y: 280, text: "SALON / SÉJOUR + SAM", size: 14 },
  { zoneId: "garage", x: 680, y: 280, text: "GARAGE", size: 13 },
  { zoneId: "cuisine", x: 220, y: 460, text: "CUISINE", size: 12 },
  { zoneId: "couloir", x: 420, y: 398, text: "COULOIR", size: 10 },
  { zoneId: "vestibule", x: 316, y: 480, text: "VEST.", size: 9 },
  { zoneId: "wc", x: 370, y: 480, text: "WC", size: 9 },
  { zoneId: "sdb", x: 436, y: 480, text: "SDB", size: 10 },
  { zoneId: "chambre1", x: 536, y: 480, text: "CH. 1", size: 11 },
  { zoneId: "chambre2", x: 680, y: 470, text: "CH. 2", size: 12 },
  { zoneId: "terrasse", x: 540, y: 580, text: "TERRASSE", size: 11 },
  { zoneId: "entree", x: 316, y: 570, text: "ENTRÉE", size: 9 },
];
