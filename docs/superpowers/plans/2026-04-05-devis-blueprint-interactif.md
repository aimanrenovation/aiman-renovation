# Devis Blueprint Interactif — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le formulaire devis existant par un plan blueprint interactif où le client clique sur les pièces d'une maison, zoome, sélectionne les travaux, puis envoie son devis.

**Architecture:** Three.js (R3F) maquette 3D vue top-down sur desktop, Canvas 2D sur mobile. State partagé via `useReducer`. Le plan blueprint SVG de référence (`blueprint-v9.html`) définit les positions et proportions des pièces. Split screen desktop (plan + panneau travaux), drawer mobile.

**Tech Stack:** Next.js 16, React Three Fiber + Drei, Canvas 2D API, GSAP, Tailwind CSS 4, Resend (existant)

---

## File Structure

```
components/devis/
  devis-types.ts              — MODIFY: Nouveaux ZoneId, WorkItem, simplifier le state
  devis-zones-config.ts       — REWRITE: 14 zones avec sous-éléments, positions 2D/3D
  devis-reducer.ts            — REWRITE: Nouveau state simplifié (vue blueprint, pas wizard steps)
  devis-page-content.tsx      — MODIFY: Pointer vers les nouveaux composants
  gpu-detector.ts             — KEEP AS IS
  blueprint/
    blueprint-layout.ts       — CREATE: Coordonnées des murs, pièces, portes, fenêtres, mobilier
    blueprint-3d.tsx           — CREATE: Scène Three.js maquette top-down
    blueprint-2d.tsx           — CREATE: Canvas 2D mobile
    blueprint-colors.ts        — CREATE: Palette blueprint partagée
  panels/
    panel-travaux.tsx          — CREATE: Panneau sélection travaux (desktop split + mobile drawer)
    panel-recap.tsx            — CREATE: Récap + formulaire contact + envoi
  devis-blueprint.tsx          — CREATE: Orchestrateur principal (state + layout + panels)
  steps/step-success.tsx       — KEEP AS IS
app/devis/page.tsx             — KEEP AS IS
app/api/devis/route.ts         — MODIFY: Adapter au nouveau format de données
lib/email-templates/devis-confirmation.tsx — MODIFY: Adapter au nouveau format
```

---

### Task 1: Types et configuration des zones

**Files:**
- Modify: `components/devis/devis-types.ts`
- Rewrite: `components/devis/devis-zones-config.ts`

- [ ] **Step 1: Réécrire devis-types.ts**

```typescript
// components/devis/devis-types.ts

export type ZoneId =
  // Intérieur
  | "salon"
  | "sam"
  | "cuisine"
  | "vestibule"
  | "wc"
  | "sdb"
  | "chambre1"
  | "chambre2"
  | "garage"
  // Extérieur
  | "terrasse"
  | "jardin"
  | "haie"
  | "facades"
  | "toiture";

export interface WorkItem {
  id: string;
  label: string;
}

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  category: "interieur" | "exterieur";
  workItems: WorkItem[];
  // Bounding box dans le SVG viewBox (0-1000 x 0-720)
  bounds: { x: number; y: number; w: number; h: number };
  // Position caméra 3D pour le zoom
  camera3D: { position: [number, number, number]; target: [number, number, number] };
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export type BudgetRange =
  | "< 5000"
  | "5000-15000"
  | "15000-30000"
  | "30000-50000"
  | "> 50000";

export type DevisView = "global" | "zoomed" | "recap" | "success";

export interface DevisState {
  view: DevisView;
  activeZone: ZoneId | null;
  selectedWorks: Record<ZoneId, string[]>; // zoneId -> workItem ids
  budget: BudgetRange | null;
  message: string;
  contact: ContactInfo;
  isSubmitting: boolean;
  error: string | null;
}

export type DevisAction =
  | { type: "ZOOM_ZONE"; zone: ZoneId }
  | { type: "ZOOM_OUT" }
  | { type: "SHOW_RECAP" }
  | { type: "TOGGLE_WORK"; zone: ZoneId; workId: string }
  | { type: "SET_BUDGET"; budget: BudgetRange | null }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "SET_CONTACT"; field: keyof ContactInfo; value: string }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_SUCCESS" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };
```

- [ ] **Step 2: Réécrire devis-zones-config.ts**

```typescript
// components/devis/devis-zones-config.ts

import type { ZoneConfig } from "./devis-types";

export const ZONES_CONFIG: ZoneConfig[] = [
  // ─── INTÉRIEUR ───
  {
    id: "salon",
    label: "Salon / Séjour",
    category: "interieur",
    bounds: { x: 160, y: 175, w: 438, h: 200 },
    camera3D: { position: [0, 12, 4], target: [0, 0, 1] },
    workItems: [
      { id: "sol", label: "Sol / Parquet / Carrelage" },
      { id: "murs", label: "Murs / Peinture" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité / Prises" },
      { id: "menuiserie", label: "Menuiserie (portes, fenêtres)" },
      { id: "chauffage", label: "Chauffage / Radiateurs" },
    ],
  },
  {
    id: "sam",
    label: "Salle à manger",
    category: "interieur",
    bounds: { x: 440, y: 195, w: 155, h: 178 },
    camera3D: { position: [3, 12, 2], target: [3, 0, 0] },
    workItems: [
      { id: "sol", label: "Sol / Parquet / Carrelage" },
      { id: "murs", label: "Murs / Peinture" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité / Luminaires" },
    ],
  },
  {
    id: "cuisine",
    label: "Cuisine",
    category: "interieur",
    bounds: { x: 160, y: 375, w: 130, h: 165 },
    camera3D: { position: [-3, 10, -2], target: [-3, 0, -2] },
    workItems: [
      { id: "sol", label: "Sol / Carrelage" },
      { id: "murs", label: "Murs / Crédence" },
      { id: "plomberie", label: "Plomberie / Évier" },
      { id: "electricite", label: "Électricité / Prises" },
      { id: "meubles", label: "Meubles de cuisine" },
      { id: "plan-travail", label: "Plan de travail" },
      { id: "electromenager", label: "Électroménager" },
    ],
  },
  {
    id: "vestibule",
    label: "Vestibule / Entrée",
    category: "interieur",
    bounds: { x: 293, y: 420, w: 50, h: 120 },
    camera3D: { position: [-1, 8, -3], target: [-1, 0, -3] },
    workItems: [
      { id: "sol", label: "Sol / Carrelage" },
      { id: "murs", label: "Murs / Peinture" },
      { id: "porte-entree", label: "Porte d'entrée" },
      { id: "eclairage", label: "Éclairage" },
    ],
  },
  {
    id: "wc",
    label: "WC",
    category: "interieur",
    bounds: { x: 345, y: 420, w: 53, h: 120 },
    camera3D: { position: [0, 6, -3], target: [0, 0, -3] },
    workItems: [
      { id: "sol", label: "Sol / Carrelage" },
      { id: "murs", label: "Murs / Faïence" },
      { id: "wc", label: "Cuvette / Mécanisme" },
      { id: "lave-mains", label: "Lave-mains" },
      { id: "plomberie", label: "Plomberie" },
    ],
  },
  {
    id: "sdb",
    label: "Salle de bain",
    category: "interieur",
    bounds: { x: 398, y: 420, w: 77, h: 120 },
    camera3D: { position: [1, 8, -3], target: [1, 0, -3] },
    workItems: [
      { id: "sol", label: "Sol / Carrelage" },
      { id: "murs", label: "Murs / Faïence" },
      { id: "douche", label: "Douche / Paroi" },
      { id: "baignoire", label: "Baignoire" },
      { id: "lavabo", label: "Lavabo / Vasque" },
      { id: "plomberie", label: "Plomberie" },
      { id: "vmc", label: "VMC / Ventilation" },
      { id: "chauffage", label: "Sèche-serviettes" },
    ],
  },
  {
    id: "chambre1",
    label: "Chambre 1 (parentale)",
    category: "interieur",
    bounds: { x: 475, y: 420, w: 125, h: 120 },
    camera3D: { position: [2, 10, -3], target: [2, 0, -3] },
    workItems: [
      { id: "sol", label: "Sol / Parquet / Moquette" },
      { id: "murs", label: "Murs / Peinture / Papier peint" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité / Prises" },
      { id: "menuiserie", label: "Menuiserie (portes, fenêtres)" },
      { id: "placard", label: "Placard / Dressing" },
    ],
  },
  {
    id: "chambre2",
    label: "Chambre 2",
    category: "interieur",
    bounds: { x: 600, y: 420, w: 160, h: 120 },
    camera3D: { position: [4, 10, -3], target: [4, 0, -3] },
    workItems: [
      { id: "sol", label: "Sol / Parquet / Moquette" },
      { id: "murs", label: "Murs / Peinture / Papier peint" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité / Prises" },
      { id: "menuiserie", label: "Menuiserie (portes, fenêtres)" },
      { id: "placard", label: "Placard / Rangement" },
    ],
  },
  {
    id: "garage",
    label: "Garage",
    category: "interieur",
    bounds: { x: 600, y: 175, w: 160, h: 200 },
    camera3D: { position: [4, 12, 2], target: [4, 0, 2] },
    workItems: [
      { id: "sol", label: "Sol / Résine époxy" },
      { id: "murs", label: "Murs / Peinture" },
      { id: "electricite", label: "Électricité / Éclairage" },
      { id: "porte-garage", label: "Porte de garage" },
      { id: "borne-irve", label: "Borne de recharge IRVE" },
      { id: "rangement", label: "Rangement / Étagères" },
    ],
  },
  // ─── EXTÉRIEUR ───
  {
    id: "terrasse",
    label: "Terrasse",
    category: "exterieur",
    bounds: { x: 160, y: 540, w: 440, h: 75 },
    camera3D: { position: [0, 10, -6], target: [0, 0, -5] },
    workItems: [
      { id: "dallage", label: "Dallage / Carrelage extérieur" },
      { id: "bois", label: "Terrasse bois / Composite" },
      { id: "etancheite", label: "Étanchéité" },
      { id: "garde-corps", label: "Garde-corps / Rambarde" },
      { id: "eclairage", label: "Éclairage extérieur" },
    ],
  },
  {
    id: "jardin",
    label: "Jardin / Gazon",
    category: "exterieur",
    bounds: { x: 50, y: 40, w: 900, h: 640 },
    camera3D: { position: [0, 20, 0], target: [0, 0, 0] },
    workItems: [
      { id: "gazon", label: "Gazon / Pelouse" },
      { id: "plantation", label: "Plantations / Massifs" },
      { id: "arrosage", label: "Arrosage automatique" },
      { id: "eclairage", label: "Éclairage jardin" },
      { id: "amenagement", label: "Aménagement paysager" },
    ],
  },
  {
    id: "haie",
    label: "Haie / Clôture",
    category: "exterieur",
    bounds: { x: 42, y: 32, w: 916, h: 666 },
    camera3D: { position: [0, 22, 0], target: [0, 0, 0] },
    workItems: [
      { id: "taille", label: "Taille de haie" },
      { id: "cloture", label: "Clôture / Grillage" },
      { id: "portail", label: "Portail / Portillon" },
      { id: "mur-cloture", label: "Mur de clôture" },
    ],
  },
  {
    id: "facades",
    label: "Façades",
    category: "exterieur",
    bounds: { x: 155, y: 170, w: 612, h: 375 },
    camera3D: { position: [0, 8, 10], target: [0, 2, 0] },
    workItems: [
      { id: "enduit", label: "Enduit / Ravalement" },
      { id: "peinture", label: "Peinture extérieure" },
      { id: "isolation-ite", label: "Isolation par l'extérieur (ITE)" },
      { id: "nettoyage-hp", label: "Nettoyage haute pression" },
      { id: "joints", label: "Joints / Fissures" },
    ],
  },
  {
    id: "toiture",
    label: "Toiture",
    category: "exterieur",
    bounds: { x: 155, y: 170, w: 612, h: 375 },
    camera3D: { position: [0, 20, 5], target: [0, 5, 0] },
    workItems: [
      { id: "couverture", label: "Couverture / Tuiles" },
      { id: "charpente", label: "Charpente" },
      { id: "gouttiere", label: "Gouttières / Descentes" },
      { id: "isolation", label: "Isolation combles" },
      { id: "velux", label: "Fenêtre de toit / Velux" },
      { id: "nettoyage", label: "Nettoyage / Démoussage" },
    ],
  },
];

export function getZoneConfig(zoneId: ZoneId): ZoneConfig | undefined {
  return ZONES_CONFIG.find((z) => z.id === zoneId);
}

export function getZonesWithWorks(selectedWorks: Record<string, string[]>): ZoneConfig[] {
  return ZONES_CONFIG.filter((z) => (selectedWorks[z.id]?.length ?? 0) > 0);
}
```

- [ ] **Step 3: Commit**

```bash
git add components/devis/devis-types.ts components/devis/devis-zones-config.ts
git commit -m "feat(devis): rewrite types and zones config for blueprint interactif"
```

---

### Task 2: State machine (reducer)

**Files:**
- Rewrite: `components/devis/devis-reducer.ts`

- [ ] **Step 1: Réécrire le reducer**

```typescript
// components/devis/devis-reducer.ts

import type { DevisState, DevisAction, ZoneId } from "./devis-types";

function createEmptyWorks(): Record<ZoneId, string[]> {
  return {
    salon: [], sam: [], cuisine: [], vestibule: [], wc: [], sdb: [],
    chambre1: [], chambre2: [], garage: [],
    terrasse: [], jardin: [], haie: [], facades: [], toiture: [],
  };
}

export const initialDevisState: DevisState = {
  view: "global",
  activeZone: null,
  selectedWorks: createEmptyWorks(),
  budget: null,
  message: "",
  contact: { firstName: "", lastName: "", phone: "", email: "", address: "" },
  isSubmitting: false,
  error: null,
};

export function devisReducer(state: DevisState, action: DevisAction): DevisState {
  switch (action.type) {
    case "ZOOM_ZONE":
      return { ...state, view: "zoomed", activeZone: action.zone, error: null };

    case "ZOOM_OUT":
      return { ...state, view: "global", activeZone: null, error: null };

    case "SHOW_RECAP":
      return { ...state, view: "recap", activeZone: null, error: null };

    case "TOGGLE_WORK": {
      const current = state.selectedWorks[action.zone];
      const updated = current.includes(action.workId)
        ? current.filter((w) => w !== action.workId)
        : [...current, action.workId];
      return { ...state, selectedWorks: { ...state.selectedWorks, [action.zone]: updated } };
    }

    case "SET_BUDGET":
      return { ...state, budget: action.budget };

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    case "SET_CONTACT":
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting, error: null };

    case "SET_SUCCESS":
      return { ...state, view: "success", isSubmitting: false };

    case "SET_ERROR":
      return { ...state, error: action.error, isSubmitting: false };

    case "RESET":
      return initialDevisState;

    default:
      return state;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add components/devis/devis-reducer.ts
git commit -m "feat(devis): rewrite reducer for blueprint navigation"
```

---

### Task 3: Palette de couleurs et layout du blueprint

**Files:**
- Create: `components/devis/blueprint/blueprint-colors.ts`
- Create: `components/devis/blueprint/blueprint-layout.ts`

- [ ] **Step 1: Créer blueprint-colors.ts**

```typescript
// components/devis/blueprint/blueprint-colors.ts

export const BP = {
  bg: "#091428",
  grid: "#0f2a52",
  gridMajor: "#122e58",
  wall: "#4A9EFF",
  wallFill: "#0c1c38",
  glass: "#6ab7ff",
  fixture: "#2a6ab5",
  fixtureFill: "#091830",
  grass: "#1a7a3a",
  grassBg: "rgba(10,40,20,0.15)",
  dalles: "#1a4a7a",
  hoverFill: "rgba(74,158,255,0.12)",
  hoverStroke: "#4A9EFF",
  selectedFill: "rgba(229,0,0,0.15)",
  selectedStroke: "#E50000",
  label: "#4A9EFF",
  labelDim: "#1e5a9e",
  red: "#E50000",
} as const;
```

- [ ] **Step 2: Créer blueprint-layout.ts**

Ce fichier contient toutes les coordonnées du plan. Il sera long (~300 lignes) car il encode murs, portes, fenêtres, mobilier. Le SVG de référence (`blueprint-v9.html`) sert de source.

```typescript
// components/devis/blueprint/blueprint-layout.ts

// Coordonnées dans le viewBox 0-1000 x 0-720
// Maison : x=160→760, y=175→540

export interface WallSegment {
  x: number; y: number; w: number; h: number;
  type: "exterior" | "interior";
}

export interface DoorArc {
  // Pivot point, radius, start angle, direction
  px: number; py: number; r: number;
  lineEnd: { x: number; y: number };
  arcEnd: { x: number; y: number };
}

export interface WindowSeg {
  x1: number; y1: number; x2: number; y2: number;
  orientation: "h" | "v"; // horizontal or vertical
  midpoint: number; // position du meneau
}

// Murs extérieurs (segments avec trous pour portes/fenêtres)
export const EXTERIOR_WALLS: WallSegment[] = [
  // NORD
  { x: 158, y: 173, w: 42, h: 6, type: "exterior" },
  { x: 315, y: 173, w: 85, h: 6, type: "exterior" },
  { x: 505, y: 173, w: 95, h: 6, type: "exterior" },
  { x: 720, y: 173, w: 42, h: 6, type: "exterior" },
  // SUD
  { x: 158, y: 538, w: 42, h: 6, type: "exterior" },
  { x: 250, y: 538, w: 45, h: 6, type: "exterior" },
  { x: 355, y: 538, w: 60, h: 6, type: "exterior" },
  { x: 490, y: 538, w: 90, h: 6, type: "exterior" },
  { x: 720, y: 538, w: 42, h: 6, type: "exterior" },
  // OUEST
  { x: 158, y: 175, w: 6, h: 85, type: "exterior" },
  { x: 158, y: 345, w: 6, h: 195, type: "exterior" },
  // EST
  { x: 758, y: 175, w: 6, h: 80, type: "exterior" },
  { x: 758, y: 320, w: 6, h: 55, type: "exterior" },
  { x: 758, y: 420, w: 6, h: 20, type: "exterior" },
  { x: 758, y: 510, w: 6, h: 32, type: "exterior" },
];

// Cloisons intérieures
export const INTERIOR_WALLS: WallSegment[] = [
  // Zone jour / zone bas
  { x: 158, y: 373, w: 445, h: 4, type: "interior" },
  // Salon | Garage
  { x: 598, y: 179, w: 5, h: 196, type: "interior" },
  // Garage | Zone nuit (horizontal)
  { x: 598, y: 418, w: 164, h: 5, type: "interior" },
  // Garage | Zone nuit (vertical)
  { x: 598, y: 375, w: 5, h: 45, type: "interior" },
  // Cuisine | Couloir
  { x: 289, y: 377, w: 4, h: 163, type: "interior" },
  // Couloir mur sud
  { x: 293, y: 418, w: 307, h: 4, type: "interior" },
  // Vestibule
  { x: 343, y: 422, w: 4, h: 118, type: "interior" },
  // WC
  { x: 398, y: 422, w: 4, h: 118, type: "interior" },
  // SDB
  { x: 473, y: 422, w: 4, h: 118, type: "interior" },
  // CH1 | CH2
  { x: 598, y: 422, w: 5, h: 118, type: "interior" },
];

// Fenêtres (triple trait : mur, verre, mur + meneau)
export const WINDOWS: WindowSeg[] = [
  // Salon nord 1
  { x1: 200, y1: 176, x2: 315, y2: 176, orientation: "h", midpoint: 257 },
  // Salon nord 2
  { x1: 400, y1: 176, x2: 505, y2: 176, orientation: "h", midpoint: 452 },
  // Salon ouest
  { x1: 161, y1: 260, x2: 161, y2: 345, orientation: "v", midpoint: 302 },
  // Garage est
  { x1: 761, y1: 255, x2: 761, y2: 320, orientation: "v", midpoint: 287 },
  // Ch2 est
  { x1: 761, y1: 440, x2: 761, y2: 510, orientation: "v", midpoint: 475 },
  // Cuisine sud
  { x1: 200, y1: 541, x2: 250, y2: 541, orientation: "h", midpoint: 225 },
  // Ch1 sud
  { x1: 465, y1: 541, x2: 555, y2: 541, orientation: "h", midpoint: 510 },
  // Ch2 sud
  { x1: 645, y1: 541, x2: 720, y2: 541, orientation: "h", midpoint: 682 },
];

// Baies vitrées
export const SLIDING_DOORS = [
  // Salon → terrasse
  { x1: 160, y1: 539, x2: 240, y2: 539 },
  // Salon → terrasse (2e baie near SAM)
  { x1: 295, y1: 539, x2: 415, y2: 539 },
];

// Porte garage basculante
export const GARAGE_DOOR = { x1: 620, y1: 176, x2: 720, y2: 176 };

// Labels des pièces (pour le rendu)
export const ROOM_LABELS: { zoneId: string; x: number; y: number; text: string; size: number }[] = [
  { zoneId: "salon", x: 350, y: 280, text: "SALON", size: 13 },
  { zoneId: "sam", x: 478, y: 248, text: "S.À MANGER", size: 10 },
  { zoneId: "cuisine", x: 225, y: 470, text: "CUISINE", size: 10 },
  { zoneId: "vestibule", x: 318, y: 488, text: "VEST.", size: 8 },
  { zoneId: "wc", x: 375, y: 488, text: "WC", size: 8 },
  { zoneId: "sdb", x: 440, y: 488, text: "SDB", size: 8 },
  { zoneId: "chambre1", x: 540, y: 495, text: "CH. 1", size: 10 },
  { zoneId: "chambre2", x: 690, y: 488, text: "CH. 2", size: 10 },
  { zoneId: "garage", x: 680, y: 330, text: "GARAGE", size: 12 },
  { zoneId: "terrasse", x: 380, y: 582, text: "TERRASSE", size: 10 },
  { zoneId: "jardin", x: 500, y: 670, text: "JARDIN", size: 9 },
  { zoneId: "haie", x: 500, y: 30, text: "HAIE", size: 8 },
  { zoneId: "facades", x: 400, y: 167, text: "FAÇADES", size: 8 },
  { zoneId: "toiture", x: 770, y: 170, text: "TOITURE", size: 8 },
];
```

- [ ] **Step 3: Commit**

```bash
mkdir -p components/devis/blueprint
git add components/devis/blueprint/blueprint-colors.ts components/devis/blueprint/blueprint-layout.ts
git commit -m "feat(devis): blueprint colors palette and layout coordinates"
```

---

### Task 4: Composant Blueprint 2D (Canvas mobile)

**Files:**
- Create: `components/devis/blueprint/blueprint-2d.tsx`

- [ ] **Step 1: Créer le composant Canvas 2D**

Ce composant dessine le plan sur un `<canvas>` en utilisant les coordonnées de `blueprint-layout.ts`. Il gère le zoom via transformation de matrice et les clics via hit detection sur les bounds des pièces.

```typescript
// components/devis/blueprint/blueprint-2d.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { BP } from "./blueprint-colors";
import {
  EXTERIOR_WALLS, INTERIOR_WALLS, WINDOWS, SLIDING_DOORS,
  GARAGE_DOOR, ROOM_LABELS,
} from "./blueprint-layout";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

interface Blueprint2DProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

const VB_W = 1000;
const VB_H = 720;

export function Blueprint2D({ state, dispatch }: Blueprint2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const targetTransformRef = useRef({ x: 0, y: 0, scale: 1 });
  const hoveredZoneRef = useRef<ZoneId | null>(null);
  const rafRef = useRef<number>(0);

  // Fit the viewbox into the canvas
  const getBaseTransform = useCallback((canvas: HTMLCanvasElement) => {
    const scale = Math.min(canvas.width / VB_W, canvas.height / VB_H);
    const x = (canvas.width - VB_W * scale) / 2;
    const y = (canvas.height - VB_H * scale) / 2;
    return { x, y, scale };
  }, []);

  // Convert screen coords to viewbox coords
  const screenToVB = useCallback((sx: number, sy: number, canvas: HTMLCanvasElement) => {
    const t = transformRef.current;
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (sx * dpr - t.x) / t.scale,
      y: (sy * dpr - t.y) / t.scale,
    };
  }, []);

  // Hit test: which zone is at this viewbox point?
  const hitTest = useCallback((vx: number, vy: number): ZoneId | null => {
    // Test interior zones first (smaller, more specific), then exterior
    const sorted = [...ZONES_CONFIG].sort((a, b) => {
      const areaA = a.bounds.w * a.bounds.h;
      const areaB = b.bounds.w * b.bounds.h;
      return areaA - areaB; // smallest first
    });
    for (const zone of sorted) {
      const b = zone.bounds;
      if (vx >= b.x && vx <= b.x + b.w && vy >= b.y && vy <= b.y + b.h) {
        return zone.id;
      }
    }
    return null;
  }, []);

  // Draw the full blueprint
  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const t = transformRef.current;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.scale, t.scale);

    // Background
    ctx.fillStyle = BP.bg;
    ctx.fillRect(0, 0, VB_W, VB_H);

    // Grid
    ctx.strokeStyle = BP.grid;
    ctx.lineWidth = 0.3;
    for (let x = 0; x < VB_W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, VB_H); ctx.stroke();
    }
    for (let y = 0; y < VB_H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(VB_W, y); ctx.stroke();
    }

    // Haie
    ctx.strokeStyle = BP.grass;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([7, 4]);
    ctx.strokeRect(48, 38, 904, 654);
    ctx.setLineDash([]);

    // Terrasse
    ctx.fillStyle = "rgba(9,20,40,0.5)";
    ctx.strokeStyle = BP.dalles;
    ctx.lineWidth = 1;
    ctx.fillRect(160, 540, 440, 75);
    ctx.strokeRect(160, 540, 440, 75);

    // Zone highlights (hover + selected)
    for (const zone of ZONES_CONFIG) {
      const b = zone.bounds;
      const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
      const isHovered = hoveredZoneRef.current === zone.id;
      const isActive = state.activeZone === zone.id;

      if (isActive) {
        ctx.fillStyle = BP.selectedFill;
        ctx.strokeStyle = BP.selectedStroke;
        ctx.lineWidth = 2;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      } else if (hasWorks) {
        ctx.fillStyle = "rgba(229,0,0,0.08)";
        ctx.strokeStyle = "rgba(229,0,0,0.4)";
        ctx.lineWidth = 1.5;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      } else if (isHovered) {
        ctx.fillStyle = BP.hoverFill;
        ctx.strokeStyle = BP.hoverStroke;
        ctx.lineWidth = 1.5;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    }

    // Walls
    for (const wall of [...EXTERIOR_WALLS, ...INTERIOR_WALLS]) {
      ctx.fillStyle = BP.wallFill;
      ctx.strokeStyle = BP.wall;
      ctx.lineWidth = wall.type === "exterior" ? 1.5 : 1;
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    }

    // Windows
    ctx.lineWidth = 1;
    for (const win of WINDOWS) {
      ctx.strokeStyle = BP.wall;
      if (win.orientation === "h") {
        ctx.beginPath(); ctx.moveTo(win.x1, win.y1 - 3); ctx.lineTo(win.x2, win.y2 - 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(win.x1, win.y1 + 3); ctx.lineTo(win.x2, win.y2 + 3); ctx.stroke();
        // Meneau
        ctx.beginPath(); ctx.moveTo(win.midpoint, win.y1 - 3); ctx.lineTo(win.midpoint, win.y1 + 3); ctx.stroke();
        // Glass
        ctx.strokeStyle = BP.glass;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(win.x1, win.y1); ctx.lineTo(win.x2, win.y2); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(win.x1 - 3, win.y1); ctx.lineTo(win.x2 - 3, win.y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(win.x1 + 3, win.y1); ctx.lineTo(win.x2 + 3, win.y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(win.x1 - 3, win.midpoint); ctx.lineTo(win.x1 + 3, win.midpoint); ctx.stroke();
        ctx.strokeStyle = BP.glass;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(win.x1, win.y1); ctx.lineTo(win.x2, win.y2); ctx.stroke();
      }
      ctx.lineWidth = 1;
    }

    // Sliding doors
    ctx.strokeStyle = BP.glass;
    ctx.lineWidth = 1.8;
    for (const sd of SLIDING_DOORS) {
      ctx.beginPath(); ctx.moveTo(sd.x1, sd.y1); ctx.lineTo(sd.x2, sd.y2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sd.x1, sd.y1 + 4); ctx.lineTo(sd.x2, sd.y2 + 4); ctx.stroke();
    }

    // Garage door
    ctx.strokeStyle = BP.wall;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(GARAGE_DOOR.x1, GARAGE_DOOR.y1);
    ctx.lineTo(GARAGE_DOOR.x2, GARAGE_DOOR.y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Room labels
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const lbl of ROOM_LABELS) {
      const zone = ZONES_CONFIG.find((z) => z.id === lbl.zoneId);
      const hasWorks = zone ? (state.selectedWorks[zone.id]?.length ?? 0) > 0 : false;
      ctx.fillStyle = hasWorks ? BP.red : BP.label;
      ctx.font = `${lbl.size * (dpr > 1 ? 1 : 1)}px 'Courier New', monospace`;
      ctx.fillText(lbl.text, lbl.x, lbl.y);

      // Badge compteur
      if (hasWorks && zone) {
        const count = state.selectedWorks[zone.id].length;
        const tw = ctx.measureText(lbl.text).width;
        ctx.fillStyle = BP.red;
        ctx.beginPath();
        ctx.arc(lbl.x + tw / 2 + 12, lbl.y - 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px Arial";
        ctx.fillText(String(count), lbl.x + tw / 2 + 12, lbl.y - 1);
      }
    }

    // Cartouche
    ctx.strokeStyle = BP.labelDim;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(790, 640, 150, 48);
    ctx.fillStyle = BP.label;
    ctx.font = "bold 8px 'Courier New'";
    ctx.fillText("AIMAN RÉNOVATION", 865, 652);
    ctx.fillStyle = BP.labelDim;
    ctx.font = "6px 'Courier New'";
    ctx.fillText("DEVIS INTERACTIF", 865, 667);

    ctx.restore();
  }, [state]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      if (state.view === "global") {
        const base = getBaseTransform(canvas);
        transformRef.current = base;
        targetTransformRef.current = base;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      // Lerp toward target
      const t = transformRef.current;
      const tgt = targetTransformRef.current;
      t.x += (tgt.x - t.x) * 0.08;
      t.y += (tgt.y - t.y) * 0.08;
      t.scale += (tgt.scale - t.scale) * 0.08;

      draw(ctx, canvas);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw, state.view, getBaseTransform]);

  // Zoom to zone
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (state.view === "zoomed" && state.activeZone) {
      const zone = ZONES_CONFIG.find((z) => z.id === state.activeZone);
      if (!zone) return;
      const dpr = window.devicePixelRatio || 1;
      const b = zone.bounds;
      const padding = 60;
      const zoneW = b.w + padding * 2;
      const zoneH = b.h + padding * 2;
      const scale = Math.min(canvas.width / zoneW, canvas.height / zoneH);
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      targetTransformRef.current = {
        x: canvas.width / 2 - cx * scale,
        y: canvas.height / 2 - cy * scale,
        scale,
      };
    } else if (state.view === "global") {
      targetTransformRef.current = getBaseTransform(canvas);
    }
  }, [state.view, state.activeZone, getBaseTransform]);

  // Click handler
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { x, y } = screenToVB(e.clientX - rect.left, e.clientY - rect.top, canvas);
    const zone = hitTest(x, y);
    if (zone) {
      dispatch({ type: "ZOOM_ZONE", zone });
    }
  }, [screenToVB, hitTest, dispatch]);

  // Hover handler
  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { x, y } = screenToVB(e.clientX - rect.left, e.clientY - rect.top, canvas);
    const zone = hitTest(x, y);
    hoveredZoneRef.current = zone;
    canvas.style.cursor = zone ? "pointer" : "default";
  }, [screenToVB, hitTest]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onClick={handleClick}
      onMouseMove={handleMove}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/devis/blueprint/blueprint-2d.tsx
git commit -m "feat(devis): canvas 2D blueprint for mobile"
```

---

### Task 5: Composant Blueprint 3D (Three.js desktop)

**Files:**
- Create: `components/devis/blueprint/blueprint-3d.tsx`

- [ ] **Step 1: Créer la scène Three.js maquette top-down**

```typescript
// components/devis/blueprint/blueprint-3d.tsx
"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { BP } from "./blueprint-colors";
import { EXTERIOR_WALLS, INTERIOR_WALLS, ROOM_LABELS } from "./blueprint-layout";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

interface Blueprint3DProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

// Convert SVG viewbox coords to 3D world coords
// viewBox 1000x720 → world ~20x14.4 centered at origin
const SVG_TO_WORLD = 0.02;
const OX = -10; // offset x (center the 1000px viewbox)
const OZ = -7.2; // offset z
function toWorld(svgX: number, svgY: number): [number, number] {
  return [svgX * SVG_TO_WORLD + OX, svgY * SVG_TO_WORLD + OZ];
}

// Wall mesh from svg rect
function WallMesh({ x, y, w, h, height = 0.4, isExterior = true }: {
  x: number; y: number; w: number; h: number; height?: number; isExterior?: boolean;
}) {
  const [wx, wz] = toWorld(x + w / 2, y + h / 2);
  const ww = w * SVG_TO_WORLD;
  const wd = h * SVG_TO_WORLD;

  return (
    <mesh position={[wx, height / 2, wz]} castShadow receiveShadow>
      <boxGeometry args={[ww, height, wd]} />
      <meshStandardMaterial
        color={isExterior ? "#1a3a6a" : "#152a50"}
        emissive="#4A9EFF"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

// Clickable zone floor
function ZoneFloor({ zone, state, dispatch }: {
  zone: typeof ZONES_CONFIG[0]; state: DevisState; dispatch: React.Dispatch<DevisAction>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const b = zone.bounds;
  const [wx, wz] = toWorld(b.x + b.w / 2, b.y + b.h / 2);
  const ww = b.w * SVG_TO_WORLD;
  const wd = b.h * SVG_TO_WORLD;
  const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
  const isActive = state.activeZone === zone.id;

  const color = isActive ? BP.selectedStroke : hasWorks ? "#E50000" : "#091428";
  const opacity = isActive ? 0.2 : hasWorks ? 0.1 : 0;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (state.view === "global") {
      dispatch({ type: "ZOOM_ZONE", zone: zone.id });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[wx, 0.01, wz]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      <planeGeometry args={[ww, wd]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity > 0 ? opacity : 0.001}
        depthWrite={false}
      />
    </mesh>
  );
}

// Camera controller with GSAP
function CameraRig({ state }: { state: DevisState }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 16, 2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (state.view === "zoomed" && state.activeZone) {
      const zone = ZONES_CONFIG.find((z) => z.id === state.activeZone);
      if (!zone) return;
      const cam = zone.camera3D;
      gsap.to(targetPos.current, {
        x: cam.position[0], y: cam.position[1], z: cam.position[2],
        duration: 1.2, ease: "power2.inOut",
      });
      gsap.to(targetLookAt.current, {
        x: cam.target[0], y: cam.target[1], z: cam.target[2],
        duration: 1.2, ease: "power2.inOut",
      });
    } else {
      // Vue globale top-down
      gsap.to(targetPos.current, { x: 0, y: 16, z: 2, duration: 1.2, ease: "power2.inOut" });
      gsap.to(targetLookAt.current, { x: 0, y: 0, z: 0, duration: 1.2, ease: "power2.inOut" });
    }
  }, [state.view, state.activeZone]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.08);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

function SceneContent({ state, dispatch }: Blueprint3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 16, 2]} fov={50} />
      <CameraRig state={state} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 15, 5]} intensity={0.8} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 10, -3]} intensity={0.2} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial color={BP.bg} />
      </mesh>

      {/* Walls */}
      {EXTERIOR_WALLS.map((w, i) => (
        <WallMesh key={`ext-${i}`} {...w} height={0.5} isExterior />
      ))}
      {INTERIOR_WALLS.map((w, i) => (
        <WallMesh key={`int-${i}`} {...w} height={0.35} isExterior={false} />
      ))}

      {/* Clickable zone floors */}
      {ZONES_CONFIG.map((zone) => (
        <ZoneFloor key={zone.id} zone={zone} state={state} dispatch={dispatch} />
      ))}
    </>
  );
}

export function Blueprint3D({ state, dispatch }: Blueprint3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }} style={{ background: BP.bg }}>
        <SceneContent state={state} dispatch={dispatch} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/devis/blueprint/blueprint-3d.tsx
git commit -m "feat(devis): Three.js 3D blueprint maquette top-down"
```

---

### Task 6: Panneau de sélection des travaux

**Files:**
- Create: `components/devis/panels/panel-travaux.tsx`

- [ ] **Step 1: Créer le panneau travaux (desktop split + mobile drawer)**

```typescript
// components/devis/panels/panel-travaux.tsx
"use client";

import { CheckCircle, Circle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getZoneConfig } from "../devis-zones-config";
import type { DevisState, DevisAction } from "../devis-types";

interface PanelTravauxProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
  isMobile: boolean;
}

export function PanelTravaux({ state, dispatch, isMobile }: PanelTravauxProps) {
  const zone = state.activeZone ? getZoneConfig(state.activeZone) : null;
  if (!zone) return null;

  const selectedWorks = state.selectedWorks[zone.id] || [];

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "ZOOM_OUT" })}
          className="text-white hover:bg-white/10 -ml-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-lg font-bold text-white">{zone.label}</h2>
          <p className="text-sm text-gray-400">
            {selectedWorks.length > 0
              ? `${selectedWorks.length} travaux sélectionnés`
              : "Sélectionnez les travaux à réaliser"}
          </p>
        </div>
      </div>

      {/* Work items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {zone.workItems.map((item) => {
          const isSelected = selectedWorks.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "TOGGLE_WORK", zone: zone.id, workId: item.id })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-[#E50000]/15 border border-[#E50000]/40"
                  : "bg-white/5 border border-transparent hover:bg-white/10"
              }`}
            >
              {isSelected ? (
                <CheckCircle className="w-5 h-5 text-[#E50000] flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={() => dispatch({ type: "ZOOM_OUT" })}
          className="w-full bg-[#E50000] hover:bg-red-700 text-white"
        >
          Valider et retour au plan
        </Button>
      </div>
    </div>
  );

  // Desktop: panneau fixe à droite
  if (!isMobile) {
    return (
      <div className="w-[380px] h-full bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10 flex-shrink-0">
        {content}
      </div>
    );
  }

  // Mobile: drawer depuis le bas
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl">
      {/* Handle */}
      <div className="flex justify-center py-2">
        <div className="w-10 h-1 rounded-full bg-white/30" />
      </div>
      {content}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p components/devis/panels
git add components/devis/panels/panel-travaux.tsx
git commit -m "feat(devis): panel travaux selection (split desktop + drawer mobile)"
```

---

### Task 7: Panneau récap + formulaire contact

**Files:**
- Create: `components/devis/panels/panel-recap.tsx`

- [ ] **Step 1: Créer le panneau récap avec formulaire**

```typescript
// components/devis/panels/panel-recap.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { DevisState, DevisAction, BudgetRange } from "../devis-types";

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "< 5000", label: "< 5 000 €" },
  { value: "5000-15000", label: "5 000 – 15 000 €" },
  { value: "15000-30000", label: "15 000 – 30 000 €" },
  { value: "30000-50000", label: "30 000 – 50 000 €" },
  { value: "> 50000", label: "> 50 000 €" },
];

interface PanelRecapProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
  onSubmit: () => void;
}

export function PanelRecap({ state, dispatch, onSubmit }: PanelRecapProps) {
  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => (state.selectedWorks[z.id]?.length ?? 0) > 0
  );

  const totalWorks = Object.values(state.selectedWorks).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "ZOOM_OUT" })}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">Récapitulatif</h2>
            <p className="text-gray-400 text-sm">{totalWorks} travaux dans {zonesWithWorks.length} zones</p>
          </div>
        </div>

        {/* Zones sélectionnées */}
        <div className="space-y-3">
          {zonesWithWorks.map((zone) => (
            <div key={zone.id} className="bg-[#111] rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">{zone.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {state.selectedWorks[zone.id].map((workId) => {
                  const work = zone.workItems.find((w) => w.id === workId);
                  return (
                    <Badge key={workId} className="bg-[#E50000]/15 text-[#E50000] border-[#E50000]/30 text-xs">
                      {work?.label || workId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Budget */}
        <div className="bg-[#111] rounded-xl p-4 border border-white/10 space-y-3">
          <Label className="text-white font-semibold">Fourchette de budget</Label>
          <div className="grid grid-cols-1 gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => dispatch({ type: "SET_BUDGET", budget: opt.value })}
                className={`px-4 py-2.5 rounded-lg text-sm text-left transition-all ${
                  state.budget === opt.value
                    ? "bg-[#E50000] text-white"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="bg-[#111] rounded-xl p-4 border border-white/10 space-y-2">
          <Label className="text-white font-semibold">Message (optionnel)</Label>
          <Textarea
            value={state.message}
            onChange={(e) => dispatch({ type: "SET_MESSAGE", message: e.target.value })}
            placeholder="Décrivez votre projet, vos contraintes, vos délais..."
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Contact */}
        <div className="bg-[#111] rounded-xl p-4 border border-white/10 space-y-3">
          <h3 className="text-white font-semibold">Vos coordonnées</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs">Prénom *</Label>
              <Input
                value={state.contact.firstName}
                onChange={(e) => dispatch({ type: "SET_CONTACT", field: "firstName", value: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs">Nom</Label>
              <Input
                value={state.contact.lastName}
                onChange={(e) => dispatch({ type: "SET_CONTACT", field: "lastName", value: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Téléphone *</Label>
            <Input
              type="tel"
              value={state.contact.phone}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
              placeholder="06 12 34 56 78"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Email *</Label>
            <Input
              type="email"
              value={state.contact.email}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Adresse du chantier</Label>
            <Input
              value={state.contact.address}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "address", value: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center">
            {state.error}
          </div>
        )}

        {/* Submit */}
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={state.isSubmitting || !state.contact.firstName || !state.contact.phone || !state.contact.email || totalWorks === 0}
          className="w-full bg-[#E50000] hover:bg-red-700 text-white text-lg py-6 disabled:opacity-30"
        >
          {state.isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...</>
          ) : (
            <><Send className="w-5 h-5 mr-2" /> Envoyer mon devis</>
          )}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/devis/panels/panel-recap.tsx
git commit -m "feat(devis): recap panel with contact form and budget selection"
```

---

### Task 8: Orchestrateur principal

**Files:**
- Create: `components/devis/devis-blueprint.tsx`
- Modify: `components/devis/devis-page-content.tsx`

- [ ] **Step 1: Créer l'orchestrateur**

```typescript
// components/devis/devis-blueprint.tsx
"use client";

import { useReducer, useCallback, useState, useEffect } from "react";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { PanelTravaux } from "./panels/panel-travaux";
import { PanelRecap } from "./panels/panel-recap";
import { StepSuccessOverlay } from "./steps/step-success";
import type { DevisState } from "./devis-types";

interface DevisBlueprintProps {
  BlueprintComponent: React.ComponentType<{
    state: DevisState;
    dispatch: React.Dispatch<any>;
  }>;
}

async function submitDevis(state: DevisState) {
  const res = await fetch("/api/devis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de l'envoi");
  }
}

export function DevisBlueprint({ BlueprintComponent }: DevisBlueprintProps) {
  const [state, dispatch] = useReducer(devisReducer, initialDevisState);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSubmit = useCallback(async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      await submitDevis(state);
      dispatch({ type: "SET_SUCCESS" });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message });
    }
  }, [state]);

  // Écran succès
  if (state.view === "success") {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <StepSuccessOverlay dispatch={dispatch} />
      </div>
    );
  }

  // Écran récap
  if (state.view === "recap") {
    return <PanelRecap state={state} dispatch={dispatch} onSubmit={handleSubmit} />;
  }

  // Vue plan (global ou zoomé)
  const totalWorks = Object.values(state.selectedWorks).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <div className="h-screen bg-[#0A0A0A] flex overflow-hidden">
      {/* Blueprint (prend tout l'espace restant) */}
      <div className="flex-1 relative">
        <BlueprintComponent state={state} dispatch={dispatch} />

        {/* Instruction en haut */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
            <h2 className="text-lg font-bold text-white">
              {state.view === "zoomed" ? "Sélectionnez les travaux" : "Cliquez sur une pièce"}
            </h2>
            <p className="text-sm text-gray-400">
              {state.view === "zoomed" ? "Cochez les éléments à rénover" : "Choisissez les zones à rénover"}
            </p>
          </div>
        </div>

        {/* Bouton récap (vue globale, si travaux sélectionnés) */}
        {state.view === "global" && totalWorks > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={() => dispatch({ type: "SHOW_RECAP" })}
              className="bg-[#E50000] hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-2xl shadow-red-500/20 transition-all"
            >
              Envoyer mon devis ({totalWorks} travaux)
            </button>
          </div>
        )}
      </div>

      {/* Panneau travaux (desktop: split droite, mobile: drawer bas) */}
      {state.view === "zoomed" && (
        <PanelTravaux state={state} dispatch={dispatch} isMobile={isMobile} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Modifier devis-page-content.tsx**

```typescript
// components/devis/devis-page-content.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { canRender3D } from "./gpu-detector";
import { DevisBlueprint } from "./devis-blueprint";
import { Blueprint2D } from "./blueprint/blueprint-2d";

const Blueprint3D = dynamic(
  () => import("./blueprint/blueprint-3d").then((mod) => ({ default: mod.Blueprint3D })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement du plan interactif...</p>
        </div>
      </div>
    ),
  }
);

export function DevisPageContent() {
  const [use3D, setUse3D] = useState<boolean | null>(null);

  useEffect(() => {
    setUse3D(canRender3D());
  }, []);

  if (use3D === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <DevisBlueprint BlueprintComponent={use3D ? Blueprint3D : Blueprint2D} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/devis/devis-blueprint.tsx components/devis/devis-page-content.tsx
git commit -m "feat(devis): orchestrator + page content wiring 3D/2D"
```

---

### Task 9: Adapter l'API et le template email

**Files:**
- Modify: `app/api/devis/route.ts`
- Modify: `lib/email-templates/devis-confirmation.tsx`

- [ ] **Step 1: Adapter l'API route**

```typescript
// app/api/devis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { generateDevisEmailHtml } from "@/lib/email-templates/devis-confirmation";
import type { DevisState } from "@/components/devis/devis-types";

export async function POST(request: NextRequest) {
  try {
    const data: DevisState = await request.json();

    if (
      !data.contact.email ||
      !data.contact.firstName ||
      !data.contact.phone
    ) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Vérifier qu'il y a au moins un travail sélectionné
    const totalWorks = Object.values(data.selectedWorks).reduce(
      (sum, arr) => sum + arr.length, 0
    );
    if (totalWorks === 0) {
      return NextResponse.json({ error: "Aucun travail sélectionné" }, { status: 400 });
    }

    const zonesWithWorks = Object.entries(data.selectedWorks)
      .filter(([, works]) => works.length > 0)
      .map(([zone]) => zone);

    const subject = `Devis interactif — ${data.contact.firstName} ${data.contact.lastName} — ${zonesWithWorks.length} zones`;

    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject,
      html: generateDevisEmailHtml({ data, isClientCopy: false }),
    });

    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: data.contact.email,
      subject: "Votre demande de devis — Aiman Rénovation",
      html: generateDevisEmailHtml({ data, isClientCopy: true }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi devis:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du devis" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Adapter le template email**

```typescript
// lib/email-templates/devis-confirmation.tsx
import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";

interface DevisEmailProps {
  data: DevisState;
  isClientCopy: boolean;
}

export function generateDevisEmailHtml({ data, isClientCopy }: DevisEmailProps): string {
  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => (data.selectedWorks[z.id]?.length ?? 0) > 0
  );

  const worksHtml = zonesWithWorks
    .map((zone) => {
      const works = data.selectedWorks[zone.id]
        .map((wId) => {
          const w = zone.workItems.find((wi) => wi.id === wId);
          return w?.label || wId;
        })
        .join(", ");
      return `<p><strong>${zone.label} :</strong> ${works}</p>`;
    })
    .join("");

  const budgetLabels: Record<string, string> = {
    "< 5000": "Moins de 5 000 €",
    "5000-15000": "5 000 – 15 000 €",
    "15000-30000": "15 000 – 30 000 €",
    "30000-50000": "30 000 – 50 000 €",
    "> 50000": "Plus de 50 000 €",
  };

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:Inter,Arial,sans-serif;color:#0A0A0A;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#0A0A0A;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;font-size:24px;margin:0;">
      ${isClientCopy ? "Votre demande de devis" : "Nouveau devis interactif"}
    </h1>
    <p style="color:#E50000;font-size:14px;margin:8px 0 0;">Aiman Rénovation</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    ${isClientCopy ? "<p>Merci pour votre demande ! Voici le récapitulatif. Nous vous recontactons sous 4 jours.</p>" : ""}
    <h2 style="color:#E50000;font-size:18px;border-bottom:2px solid #E50000;padding-bottom:8px;">Contact</h2>
    <p><strong>Nom :</strong> ${data.contact.firstName} ${data.contact.lastName}</p>
    <p><strong>Téléphone :</strong> ${data.contact.phone}</p>
    <p><strong>Email :</strong> ${data.contact.email}</p>
    ${data.contact.address ? `<p><strong>Adresse :</strong> ${data.contact.address}</p>` : ""}
    <h2 style="color:#E50000;font-size:18px;border-bottom:2px solid #E50000;padding-bottom:8px;">Travaux demandés</h2>
    ${worksHtml}
    <h2 style="color:#E50000;font-size:18px;border-bottom:2px solid #E50000;padding-bottom:8px;">Budget</h2>
    <p>${data.budget ? budgetLabels[data.budget] || data.budget : "Non renseigné"}</p>
    ${data.message ? `<h2 style="color:#E50000;font-size:18px;border-bottom:2px solid #E50000;padding-bottom:8px;">Message</h2><p>${data.message}</p>` : ""}
    <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;text-align:center;">
      <p style="margin:0;color:#6b7280;font-size:12px;">Aiman Rénovation — Saint-Louis, 68300<br/>09 39 24 55 15 — contact@aiman-renovation.fr</p>
    </div>
  </div>
</body></html>`;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/devis/route.ts lib/email-templates/devis-confirmation.tsx
git commit -m "feat(devis): adapt API route and email template for blueprint format"
```

---

### Task 10: Build, test et push

**Files:** aucun nouveau

- [ ] **Step 1: Vérifier que le build passe**

```bash
cd /Users/Aiman/aiman-renovation && npm run build
```

Expected: Build réussi. Si erreurs de types, les corriger.

- [ ] **Step 2: Lancer le dev server et tester**

```bash
npm run dev -- -p 3001
```

Ouvrir http://localhost:3001/devis et vérifier :
1. Le plan s'affiche (3D desktop ou 2D mobile)
2. Clic sur une pièce → zoom + panneau travaux
3. Cocher des travaux → retour au plan → badge compteur
4. Bouton "Envoyer mon devis" → récap → formulaire → submit

- [ ] **Step 3: Push**

```bash
git push origin main
```
