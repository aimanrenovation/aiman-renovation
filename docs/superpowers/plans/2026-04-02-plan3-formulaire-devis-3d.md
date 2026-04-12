# Plan 3 — Formulaire de devis 3D immersif

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le placeholder `/devis` par un formulaire de devis immersif en 6 etapes ou le client interagit avec une maison 3D pour construire sa demande de renovation, avec fallback 2D pour mobile/GPU faible et envoi email via Resend.

**Architecture:** Wizard multi-etapes 3D avec React Three Fiber. State global via useReducer. 6 etapes : zone > problemes > resultat > surface/budget > photos/contact > recap. Panneau formulaire via Html de drei integre dans la scene 3D. Fallback 2D complet avec shadcn/ui.

**Tech Stack:** Next.js 16, React 19, TypeScript, React Three Fiber, @react-three/drei (Html, OrbitControls, useGLTF, PerspectiveCamera), Three.js, GSAP, shadcn/ui, Resend

**Spec:** `docs/superpowers/specs/2026-04-02-site-aiman-renovation-design.md`

**Depends on:** Plan 1 (scaffold Next.js, shadcn/ui installe, page `/devis` placeholder existante, `lib/constants.ts`), Plan 2 (moteur 3D `components/3d/scene-wrapper.tsx`, fallback detection GPU)

**IMPORTANT:** Ce plan travaille dans `components/devis/`, `app/devis/`, `app/api/devis/`, et `lib/`. Il ne touche PAS aux fichiers des Plans 1 et 2 sauf la page `/devis` (remplacement du placeholder).

---

## Tache 1 — Installer Resend + creer route API envoi email

### Objectif
Configurer Resend pour envoyer des emails de demande de devis au client et a Aiman Renovation.

### Steps

- [ ] **1.1** Installer le package Resend :
```bash
cd /Users/Aiman/aiman-renovation && npm install resend
```

- [ ] **1.2** Ajouter la variable d'environnement dans `.env.local` :
```bash
# Ne pas commiter ce fichier
echo 'RESEND_API_KEY=re_xxxxxxxxxxxxx' >> .env.local
echo 'DEVIS_RECIPIENT_EMAIL=contact@aiman-renovation.fr' >> .env.local
```

- [ ] **1.3** Creer le fichier `lib/email.ts` avec la configuration Resend :

```typescript
// lib/email.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const DEVIS_FROM_EMAIL = "devis@aiman-renovation.fr";
export const DEVIS_RECIPIENT_EMAIL =
  process.env.DEVIS_RECIPIENT_EMAIL || "contact@aiman-renovation.fr";
```

- [ ] **1.4** Creer le template email `lib/email-templates/devis-confirmation.tsx` :

```tsx
// lib/email-templates/devis-confirmation.tsx
import type { DevisFormState } from "@/components/devis/devis-types";

interface DevisEmailProps {
  data: DevisFormState;
  isClientCopy: boolean;
}

export function generateDevisEmailHtml({
  data,
  isClientCopy,
}: DevisEmailProps): string {
  const zonesLabels: Record<string, string> = {
    cuisine: "Cuisine",
    "salle-de-bain": "Salle de bain",
    facade: "Facade / Isolation",
    toit: "Toiture",
    garage: "Garage",
    exterieur: "Exterieur / Jardin",
  };

  const selectedZonesText = data.selectedZones
    .map((z) => zonesLabels[z] || z)
    .join(", ");

  const problemsText = Object.entries(data.problems)
    .filter(([, problems]) => problems.length > 0)
    .map(([zone, problems]) => `${zonesLabels[zone] || zone}: ${problems.join(", ")}`)
    .join("<br/>");

  const optionsText = Object.entries(data.renovationOptions)
    .filter(([, options]) => options.length > 0)
    .map(([zone, options]) => `${zonesLabels[zone] || zone}: ${options.join(", ")}`)
    .join("<br/>");

  const budgetLabels: Record<string, string> = {
    "< 5000": "Moins de 5 000 EUR",
    "5000-15000": "5 000 - 15 000 EUR",
    "15000-30000": "15 000 - 30 000 EUR",
    "30000-50000": "30 000 - 50 000 EUR",
    "> 50000": "Plus de 50 000 EUR",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Inter, Arial, sans-serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0A0A0A; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FFFFFF; font-size: 24px; margin: 0;">
          ${isClientCopy ? "Votre demande de devis" : "Nouvelle demande de devis"}
        </h1>
        <p style="color: #E50000; font-size: 14px; margin: 8px 0 0;">Aiman Renovation</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        ${isClientCopy ? "<p>Merci pour votre demande ! Voici le recapitulatif. Nous vous recontactons sous 24h.</p>" : ""}

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Contact</h2>
        <p><strong>Nom :</strong> ${data.contact.firstName} ${data.contact.lastName}</p>
        <p><strong>Telephone :</strong> ${data.contact.phone}</p>
        <p><strong>Email :</strong> ${data.contact.email}</p>
        <p><strong>Adresse du chantier :</strong> ${data.contact.address}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Zones a renover</h2>
        <p>${selectedZonesText}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Problemes constates</h2>
        <p>${problemsText || "Non renseigne"}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Renovation souhaitee</h2>
        <p>${optionsText || "Non renseigne"}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Surface et budget</h2>
        <p><strong>Surface :</strong> ${data.surface ? `${data.surface} m²` : "Non renseigne"}</p>
        <p><strong>Budget :</strong> ${data.budget ? budgetLabels[data.budget] || data.budget : "Non renseigne"}</p>

        ${data.photos.length > 0 ? `<p><strong>Photos jointes :</strong> ${data.photos.length} fichier(s)</p>` : ""}
        ${data.message ? `<h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Message</h2><p>${data.message}</p>` : ""}

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            Aiman Renovation — 14 rue de la Paix, 68300 Saint-Louis<br/>
            03 56 89 44 03 — contact@aiman-renovation.fr
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
```

- [ ] **1.5** Creer la route API `app/api/devis/route.ts` :

```typescript
// app/api/devis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { generateDevisEmailHtml } from "@/lib/email-templates/devis-confirmation";
import type { DevisFormState } from "@/components/devis/devis-types";

export async function POST(request: NextRequest) {
  try {
    const data: DevisFormState = await request.json();

    // Validation basique
    if (
      !data.contact.email ||
      !data.contact.firstName ||
      !data.contact.phone ||
      data.selectedZones.length === 0
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const zonesLabels: Record<string, string> = {
      cuisine: "Cuisine",
      "salle-de-bain": "SDB",
      facade: "Facade",
      toit: "Toit",
      garage: "Garage",
      exterieur: "Exterieur",
    };

    const zonesShort = data.selectedZones
      .map((z) => zonesLabels[z] || z)
      .join(", ");

    // Email a Aiman Renovation
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `Nouvelle demande de devis — ${data.contact.firstName} ${data.contact.lastName} — ${zonesShort}`,
      html: generateDevisEmailHtml({ data, isClientCopy: false }),
    });

    // Email de confirmation au client
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: data.contact.email,
      subject: "Votre demande de devis — Aiman Renovation",
      html: generateDevisEmailHtml({ data, isClientCopy: true }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du devis" },
      { status: 500 }
    );
  }
}
```

### Validation
- Le fichier `lib/email.ts` exporte `resend`, `DEVIS_FROM_EMAIL`, `DEVIS_RECIPIENT_EMAIL`
- Le fichier `lib/email-templates/devis-confirmation.tsx` genere du HTML valide
- La route `POST /api/devis` accepte un body JSON et envoie 2 emails

---

## Tache 2 — Creer les types et le state management du formulaire (useReducer)

### Objectif
Definir toutes les interfaces TypeScript et le reducer qui pilote les 6 etapes du wizard.

### Steps

- [ ] **2.1** Creer le fichier de types `components/devis/devis-types.ts` :

```typescript
// components/devis/devis-types.ts

export type ZoneId =
  | "cuisine"
  | "salle-de-bain"
  | "facade"
  | "toit"
  | "garage"
  | "exterieur";

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  icon: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  problems: ProblemOption[];
  renovationOptions: RenovationOption[];
}

export interface ProblemOption {
  id: string;
  label: string;
  position3D: [number, number, number]; // position du label flottant
}

export interface RenovationOption {
  id: string;
  label: string;
  description: string;
}

export type BudgetRange =
  | "< 5000"
  | "5000-15000"
  | "15000-30000"
  | "30000-50000"
  | "> 50000";

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export interface DevisFormState {
  currentStep: number; // 0-5 (6 etapes)
  selectedZones: ZoneId[];
  activeZone: ZoneId | null; // zone actuellement focusee
  problems: Record<ZoneId, string[]>;
  renovationOptions: Record<ZoneId, string[]>;
  surface: number | null;
  budget: BudgetRange | null;
  message: string;
  photos: File[];
  contact: ContactInfo;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export type DevisAction =
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "TOGGLE_ZONE"; zone: ZoneId }
  | { type: "SET_ACTIVE_ZONE"; zone: ZoneId | null }
  | { type: "TOGGLE_PROBLEM"; zone: ZoneId; problemId: string }
  | { type: "TOGGLE_RENOVATION_OPTION"; zone: ZoneId; optionId: string }
  | { type: "SET_SURFACE"; surface: number | null }
  | { type: "SET_BUDGET"; budget: BudgetRange | null }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "ADD_PHOTOS"; files: File[] }
  | { type: "REMOVE_PHOTO"; index: number }
  | { type: "SET_CONTACT"; field: keyof ContactInfo; value: string }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_SUBMITTED" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

export const TOTAL_STEPS = 6;
```

- [ ] **2.2** Creer le reducer `components/devis/devis-reducer.ts` :

```typescript
// components/devis/devis-reducer.ts
import type { DevisFormState, DevisAction, ZoneId, TOTAL_STEPS } from "./devis-types";

function createEmptyProblems(): Record<ZoneId, string[]> {
  return {
    cuisine: [],
    "salle-de-bain": [],
    facade: [],
    toit: [],
    garage: [],
    exterieur: [],
  };
}

function createEmptyOptions(): Record<ZoneId, string[]> {
  return {
    cuisine: [],
    "salle-de-bain": [],
    facade: [],
    toit: [],
    garage: [],
    exterieur: [],
  };
}

export const initialDevisState: DevisFormState = {
  currentStep: 0,
  selectedZones: [],
  activeZone: null,
  problems: createEmptyProblems(),
  renovationOptions: createEmptyOptions(),
  surface: null,
  budget: null,
  message: "",
  photos: [],
  contact: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  },
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export function devisReducer(
  state: DevisFormState,
  action: DevisAction
): DevisFormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step, error: null };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 5),
        error: null,
      };

    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
        error: null,
      };

    case "TOGGLE_ZONE": {
      const zones = state.selectedZones.includes(action.zone)
        ? state.selectedZones.filter((z) => z !== action.zone)
        : [...state.selectedZones, action.zone];
      return {
        ...state,
        selectedZones: zones,
        activeZone: zones.includes(action.zone) ? action.zone : zones[0] || null,
      };
    }

    case "SET_ACTIVE_ZONE":
      return { ...state, activeZone: action.zone };

    case "TOGGLE_PROBLEM": {
      const current = state.problems[action.zone];
      const updated = current.includes(action.problemId)
        ? current.filter((p) => p !== action.problemId)
        : [...current, action.problemId];
      return {
        ...state,
        problems: { ...state.problems, [action.zone]: updated },
      };
    }

    case "TOGGLE_RENOVATION_OPTION": {
      const current = state.renovationOptions[action.zone];
      const updated = current.includes(action.optionId)
        ? current.filter((o) => o !== action.optionId)
        : [...current, action.optionId];
      return {
        ...state,
        renovationOptions: { ...state.renovationOptions, [action.zone]: updated },
      };
    }

    case "SET_SURFACE":
      return { ...state, surface: action.surface };

    case "SET_BUDGET":
      return { ...state, budget: action.budget };

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    case "ADD_PHOTOS":
      return { ...state, photos: [...state.photos, ...action.files] };

    case "REMOVE_PHOTO":
      return {
        ...state,
        photos: state.photos.filter((_, i) => i !== action.index),
      };

    case "SET_CONTACT":
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
      };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting, error: null };

    case "SET_SUBMITTED":
      return { ...state, isSubmitted: true, isSubmitting: false };

    case "SET_ERROR":
      return { ...state, error: action.error, isSubmitting: false };

    case "RESET":
      return initialDevisState;

    default:
      return state;
  }
}
```

- [ ] **2.3** Creer les donnees de configuration des zones `components/devis/devis-zones-config.ts` :

```typescript
// components/devis/devis-zones-config.ts
import type { ZoneConfig } from "./devis-types";

export const ZONES_CONFIG: ZoneConfig[] = [
  {
    id: "cuisine",
    label: "Cuisine",
    icon: "ChefHat",
    cameraPosition: [2, 2, 4],
    cameraTarget: [0, 0.5, 0],
    problems: [
      { id: "murs-fissures", label: "Murs fissures", position3D: [-1, 1.5, 0] },
      { id: "carrelage-casse", label: "Carrelage casse", position3D: [0, 0.1, 1] },
      { id: "electricite-vetuste", label: "Electricite vetuste", position3D: [1, 2, 0] },
      { id: "plomberie-defaillante", label: "Plomberie defaillante", position3D: [-0.5, 0.5, 0.5] },
      { id: "meubles-abimes", label: "Meubles abimes", position3D: [0.5, 1, -0.5] },
    ],
    renovationOptions: [
      { id: "nouveau-carrelage", label: "Nouveau carrelage", description: "Pose de carrelage moderne" },
      { id: "peinture-murs", label: "Peinture murs", description: "Peinture fraiche et finitions" },
      { id: "electricite-normes", label: "Electricite aux normes", description: "Mise aux normes electriques" },
      { id: "plomberie-neuve", label: "Plomberie neuve", description: "Remplacement tuyauterie" },
      { id: "meubles-cuisine", label: "Mobilier de cuisine", description: "Cuisine equipee moderne" },
    ],
  },
  {
    id: "salle-de-bain",
    label: "Salle de bain",
    icon: "Bath",
    cameraPosition: [-2, 2, 4],
    cameraTarget: [0, 0.5, 0],
    problems: [
      { id: "carrelage-fissure", label: "Carrelage fissure", position3D: [0, 0.1, 1] },
      { id: "joints-moisis", label: "Joints moisis", position3D: [1, 1, 0] },
      { id: "robinetterie-vetuste", label: "Robinetterie vetuste", position3D: [-0.5, 1, 0.5] },
      { id: "ventilation-absente", label: "Ventilation absente", position3D: [0, 2, -0.5] },
      { id: "baignoire-abimee", label: "Baignoire / douche abimee", position3D: [0.5, 0.5, 0] },
    ],
    renovationOptions: [
      { id: "douche-italienne", label: "Douche a l'italienne", description: "Douche moderne sans seuil" },
      { id: "carrelage-sdb", label: "Nouveau carrelage", description: "Carrelage sol et murs" },
      { id: "meuble-vasque", label: "Meuble vasque", description: "Meuble vasque contemporain" },
      { id: "robinetterie", label: "Robinetterie neuve", description: "Mitigeurs et douchette neufs" },
      { id: "vmc", label: "VMC", description: "Ventilation mecanique controlee" },
    ],
  },
  {
    id: "facade",
    label: "Facade / Isolation",
    icon: "Building",
    cameraPosition: [0, 3, 8],
    cameraTarget: [0, 2, 0],
    problems: [
      { id: "enduit-decolle", label: "Enduit decolle", position3D: [-2, 3, 0] },
      { id: "fissures-facade", label: "Fissures facade", position3D: [1, 2, 0] },
      { id: "isolation-absente", label: "Isolation absente", position3D: [0, 1.5, 0] },
      { id: "humidite", label: "Problemes d'humidite", position3D: [-1, 0.5, 0] },
    ],
    renovationOptions: [
      { id: "ite", label: "Isolation par l'exterieur (ITE)", description: "Isolation thermique facade" },
      { id: "enduit-facade", label: "Enduit de facade", description: "Ravalement complet" },
      { id: "peinture-facade", label: "Peinture facade", description: "Mise en peinture exterieure" },
      { id: "traitement-humidite", label: "Traitement humidite", description: "Traitement des remontees capillaires" },
    ],
  },
  {
    id: "toit",
    label: "Toiture",
    icon: "Home",
    cameraPosition: [0, 6, 6],
    cameraTarget: [0, 4, 0],
    problems: [
      { id: "tuiles-cassees", label: "Tuiles cassees", position3D: [0, 4.5, 0] },
      { id: "charpente-abimee", label: "Charpente abimee", position3D: [-1, 4, 0] },
      { id: "gouttiere-defaillante", label: "Gouttiere defaillante", position3D: [2, 3, 0] },
      { id: "isolation-combles", label: "Isolation combles absente", position3D: [0, 3.5, 0] },
    ],
    renovationOptions: [
      { id: "refection-toiture", label: "Refection toiture", description: "Remplacement couverture complete" },
      { id: "isolation-toiture", label: "Isolation toiture", description: "Isolation sous rampants ou combles" },
      { id: "gouttiere-neuve", label: "Gouttieres neuves", description: "Remplacement gouttieres et descentes" },
      { id: "velux", label: "Fenetre de toit", description: "Pose de Velux" },
    ],
  },
  {
    id: "garage",
    label: "Garage",
    icon: "Car",
    cameraPosition: [4, 2, 4],
    cameraTarget: [2, 1, 0],
    problems: [
      { id: "sol-abime", label: "Sol abime", position3D: [2, 0.1, 1] },
      { id: "porte-defaillante", label: "Porte defaillante", position3D: [3, 1.5, 0] },
      { id: "electricite-garage", label: "Electricite vetuste", position3D: [1.5, 2, 0] },
      { id: "humidite-garage", label: "Humidite", position3D: [2.5, 0.5, 0] },
    ],
    renovationOptions: [
      { id: "sol-resine", label: "Sol resine", description: "Revetement sol resine epoxy" },
      { id: "porte-garage", label: "Porte de garage", description: "Porte sectionnelle motorisee" },
      { id: "borne-recharge", label: "Borne de recharge IRVE", description: "Installation borne vehicule electrique" },
      { id: "electricite-garage-opt", label: "Electricite aux normes", description: "Mise aux normes electrique" },
    ],
  },
  {
    id: "exterieur",
    label: "Exterieur / Jardin",
    icon: "Trees",
    cameraPosition: [-4, 3, 6],
    cameraTarget: [-2, 0, 0],
    problems: [
      { id: "terrain-friche", label: "Terrain en friche", position3D: [-3, 0.1, 2] },
      { id: "cloture-abimee", label: "Cloture abimee", position3D: [-4, 1, 0] },
      { id: "terrasse-degradee", label: "Terrasse degradee", position3D: [-2, 0.2, 1] },
      { id: "eclairage-absent", label: "Eclairage absent", position3D: [-1, 1.5, 1] },
    ],
    renovationOptions: [
      { id: "amenagement-jardin", label: "Amenagement jardin", description: "Creation espaces verts" },
      { id: "terrasse", label: "Terrasse", description: "Construction terrasse bois ou carrelage" },
      { id: "cloture-neuve", label: "Cloture neuve", description: "Pose cloture et portail" },
      { id: "eclairage-ext", label: "Eclairage exterieur", description: "Mise en lumiere du jardin" },
    ],
  },
];

export function getZoneConfig(zoneId: string): ZoneConfig | undefined {
  return ZONES_CONFIG.find((z) => z.id === zoneId);
}
```

### Validation
- `devis-types.ts` exporte `DevisFormState`, `DevisAction`, `ZoneId`, `ZoneConfig`, `TOTAL_STEPS`
- `devis-reducer.ts` exporte `devisReducer`, `initialDevisState`
- `devis-zones-config.ts` exporte `ZONES_CONFIG`, `getZoneConfig`
- Le reducer gere toutes les actions sans mutation de state

---

## Tache 3 — Creer la scene 3D maison interactive (geometries primitives)

### Objectif
Construire une maison 3D avec des geometries Three.js primitives (Box, Cylinder, Cone). Chaque zone est un mesh cliquable avec highlight au hover.

### Steps

- [ ] **3.1** Creer `components/devis/house-3d.tsx` — la maison complete :

```tsx
// components/devis/house-3d.tsx
"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import type { ZoneId } from "./devis-types";

interface House3DProps {
  selectedZones: ZoneId[];
  activeZone: ZoneId | null;
  onZoneClick: (zone: ZoneId) => void;
  onZoneHover: (zone: ZoneId | null) => void;
  showDamage: boolean; // true aux etapes 1-2
  renovationProgress: Record<ZoneId, number>; // 0-1 par zone
}

interface ZoneMeshProps {
  zoneId: ZoneId;
  isSelected: boolean;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  showDamage: boolean;
  renovationProgress: number;
}

const COLORS = {
  red: "#E50000",
  black: "#0A0A0A",
  white: "#FFFFFF",
  damaged: "#8B7355",
  renovated: "#F5F5F0",
  selected: "#E50000",
  hover: "#FF3333",
  default: "#D4C5A9",
  roof: "#8B4513",
  roofRenovated: "#A0522D",
  grass: "#4A7C59",
  grassDamaged: "#8B7355",
  concrete: "#999999",
};

function ZoneMesh({
  zoneId,
  isSelected,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  showDamage,
  renovationProgress,
}: ZoneMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const getColor = () => {
    if (isActive) return COLORS.selected;
    if (isHovered) return COLORS.hover;
    if (isSelected) return new THREE.Color(COLORS.selected).lerp(new THREE.Color(COLORS.renovated), 0.5).getStyle();
    if (showDamage) return COLORS.damaged;
    return THREE.MathUtils.lerp(0, 1, renovationProgress) > 0.5 ? COLORS.renovated : COLORS.default;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  // Position et geometrie selon la zone
  const zoneGeometry: Record<ZoneId, { position: [number, number, number]; args: [number, number, number] }> = {
    cuisine: { position: [-1.2, 0.75, 0.8], args: [1.8, 1.5, 1.4] },
    "salle-de-bain": { position: [1.2, 0.75, 0.8], args: [1.4, 1.5, 1.4] },
    facade: { position: [0, 1.5, -1.5], args: [4.2, 3, 0.15] },
    toit: { position: [0, 3.5, 0], args: [4.6, 0.15, 3.6] },
    garage: { position: [3, 0.6, 0], args: [1.8, 1.2, 2.8] },
    exterieur: { position: [-3, 0.05, 0], args: [2, 0.1, 3] },
  };

  const config = zoneGeometry[zoneId];

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onPointerOut();
        document.body.style.cursor = "default";
      }}
    >
      {zoneId === "toit" ? (
        <coneGeometry args={[2.8, 1.5, 4]} />
      ) : (
        <boxGeometry args={config.args} />
      )}
      <meshStandardMaterial
        color={getColor()}
        transparent={isHovered && !isSelected}
        opacity={isHovered && !isSelected ? 0.8 : 1}
        emissive={isActive ? COLORS.selected : "#000000"}
        emissiveIntensity={isActive ? 0.15 : 0}
      />
    </mesh>
  );
}

export function House3D({
  selectedZones,
  activeZone,
  onZoneClick,
  onZoneHover,
  showDamage,
  renovationProgress,
}: House3DProps) {
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);

  const zones: ZoneId[] = ["cuisine", "salle-de-bain", "facade", "toit", "garage", "exterieur"];

  return (
    <group>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#3A5F3A" />
      </mesh>

      {/* Structure principale de la maison */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 2.8]} />
        <meshStandardMaterial color={showDamage ? "#B8A88A" : "#F0EBE0"} />
      </mesh>

      {/* Zones cliquables (overlays) */}
      {zones.map((zoneId) => (
        <ZoneMesh
          key={zoneId}
          zoneId={zoneId}
          isSelected={selectedZones.includes(zoneId)}
          isActive={activeZone === zoneId}
          isHovered={hoveredZone === zoneId}
          onClick={() => onZoneClick(zoneId)}
          onPointerOver={() => {
            setHoveredZone(zoneId);
            onZoneHover(zoneId);
          }}
          onPointerOut={() => {
            setHoveredZone(null);
            onZoneHover(null);
          }}
          showDamage={showDamage}
          renovationProgress={renovationProgress[zoneId] || 0}
        />
      ))}

      {/* Eclairage */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
    </group>
  );
}
```

- [ ] **3.2** Creer `components/devis/devis-scene.tsx` — wrapper Canvas R3F avec camera animee :

```tsx
// components/devis/devis-scene.tsx
"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import { House3D } from "./house-3d";
import type { ZoneId, DevisFormState, DevisAction } from "./devis-types";
import { getZoneConfig } from "./devis-zones-config";

interface DevisSceneProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

function CameraController({
  targetPosition,
  targetLookAt,
}: {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    gsap.to(camera.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: 1.2,
      ease: "power2.inOut",
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: targetLookAt[0],
        y: targetLookAt[1],
        z: targetLookAt[2],
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    }
  }, [targetPosition, targetLookAt, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3}
      maxDistance={15}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
}

function SceneContent({ state, dispatch }: DevisSceneProps) {
  // Determiner la position camera selon l'etape et la zone active
  const getCameraConfig = () => {
    const defaultPos: [number, number, number] = [0, 5, 10];
    const defaultTarget: [number, number, number] = [0, 1, 0];

    if (state.activeZone && state.currentStep > 0) {
      const zoneConfig = getZoneConfig(state.activeZone);
      if (zoneConfig) {
        return {
          position: zoneConfig.cameraPosition,
          target: zoneConfig.cameraTarget,
        };
      }
    }

    return { position: defaultPos, target: defaultTarget };
  };

  const { position: cameraPos, target: cameraTarget } = getCameraConfig();

  // Calculer le progres de renovation par zone (etape 3)
  const renovationProgress: Record<ZoneId, number> = {
    cuisine: 0,
    "salle-de-bain": 0,
    facade: 0,
    toit: 0,
    garage: 0,
    exterieur: 0,
  };

  if (state.currentStep >= 3) {
    for (const zone of state.selectedZones) {
      const zoneConfig = getZoneConfig(zone);
      if (zoneConfig) {
        const totalOptions = zoneConfig.renovationOptions.length;
        const selectedOptions = state.renovationOptions[zone].length;
        renovationProgress[zone] = totalOptions > 0 ? selectedOptions / totalOptions : 0;
      }
    }
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPos} fov={50} />
      <CameraController targetPosition={cameraPos} targetLookAt={cameraTarget} />
      <Environment preset="city" />

      <House3D
        selectedZones={state.selectedZones}
        activeZone={state.activeZone}
        onZoneClick={(zone) => {
          if (state.currentStep === 0) {
            dispatch({ type: "TOGGLE_ZONE", zone });
          } else {
            dispatch({ type: "SET_ACTIVE_ZONE", zone });
          }
        }}
        onZoneHover={() => {}}
        showDamage={state.currentStep <= 2}
        renovationProgress={renovationProgress}
      />
    </>
  );
}

export function DevisScene({ state, dispatch }: DevisSceneProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows>
        <Suspense fallback={null}>
          <SceneContent state={state} dispatch={dispatch} />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

### Validation
- `house-3d.tsx` rend 6 zones cliquables avec highlight visuel
- `devis-scene.tsx` rend un Canvas R3F avec camera animee GSAP
- Les zones reagissent au hover (cursor pointer, couleur) et au click (dispatch action)
- La camera zoome vers la zone active via GSAP

---

## Tache 4 — Etape 1 : selection zone avec zoom camera

### Objectif
Premier ecran du wizard : la maison 3D complete, le client clique sur les zones a renover. Multi-selection. Instructions en overlay. Bouton "Suivant" quand au moins 1 zone selectionnee.

### Steps

- [ ] **4.1** Creer `components/devis/steps/step-zone-selection.tsx` :

```tsx
// components/devis/steps/step-zone-selection.tsx
"use client";

import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { DevisFormState, DevisAction, ZoneId } from "../devis-types";
import { ZONES_CONFIG } from "../devis-zones-config";

interface StepZoneSelectionProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepZoneSelectionOverlay({ state, dispatch }: StepZoneSelectionProps) {
  const selectedCount = state.selectedZones.length;

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      {/* Header instruction */}
      <div className="flex flex-col items-center pt-8 gap-4">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Etape 1 / 6</p>
          <h2 className="text-2xl font-bold text-white">Ou souhaitez-vous renover ?</h2>
          <p className="text-gray-300 mt-2">Cliquez sur les zones de la maison a renover</p>
        </div>
      </div>

      {/* Zones selectionnees */}
      {selectedCount > 0 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap px-4">
          {state.selectedZones.map((zoneId) => {
            const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
            return (
              <Badge
                key={zoneId}
                variant="default"
                className="pointer-events-auto bg-[#E50000] text-white px-3 py-1.5 text-sm cursor-pointer hover:bg-red-700"
                onClick={() => dispatch({ type: "TOGGLE_ZONE", zone: zoneId })}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {zone?.label}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Bouton suivant */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <Button
          size="lg"
          disabled={selectedCount === 0}
          onClick={() => {
            dispatch({ type: "SET_ACTIVE_ZONE", zone: state.selectedZones[0] });
            dispatch({ type: "NEXT_STEP" });
          }}
          className="pointer-events-auto bg-[#E50000] hover:bg-red-700 text-white text-lg px-10 py-6 rounded-xl shadow-2xl disabled:opacity-30"
        >
          Continuer ({selectedCount} zone{selectedCount > 1 ? "s" : ""})
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **4.2** Creer les labels flottants 3D pour les zones dans `components/devis/zone-label-3d.tsx` :

```tsx
// components/devis/zone-label-3d.tsx
"use client";

import { Html } from "@react-three/drei";
import type { ZoneId } from "./devis-types";
import { ZONES_CONFIG } from "./devis-zones-config";

interface ZoneLabel3DProps {
  zoneId: ZoneId;
  isSelected: boolean;
  visible: boolean;
}

const ZONE_LABEL_POSITIONS: Record<ZoneId, [number, number, number]> = {
  cuisine: [-1.2, 2, 0.8],
  "salle-de-bain": [1.2, 2, 0.8],
  facade: [0, 2.8, -1.5],
  toit: [0, 4.5, 0],
  garage: [3, 1.8, 0],
  exterieur: [-3, 0.8, 0],
};

export function ZoneLabel3D({ zoneId, isSelected, visible }: ZoneLabel3DProps) {
  if (!visible) return null;
  const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
  if (!zone) return null;

  return (
    <Html
      position={ZONE_LABEL_POSITIONS[zoneId]}
      center
      distanceFactor={8}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          isSelected
            ? "bg-[#E50000] text-white shadow-lg shadow-red-500/30"
            : "bg-white/90 text-black shadow-md"
        }`}
      >
        {zone.label}
      </div>
    </Html>
  );
}
```

### Validation
- L'overlay affiche les instructions, les badges des zones selectionnees, et le bouton "Continuer"
- Les labels 3D flottent au-dessus de chaque zone de la maison
- Le bouton "Continuer" est desactive si aucune zone n'est selectionnee
- Au clic sur "Continuer", on passe a l'etape 2 et la camera zoome vers la premiere zone

---

## Tache 5 — Etape 2 : selection problemes avec labels flottants

### Objectif
Pour chaque zone selectionnee, afficher les problemes cliquables avec des labels Html flottants dans la scene 3D. Navigation entre zones via tabs.

### Steps

- [ ] **5.1** Creer `components/devis/steps/step-problems.tsx` :

```tsx
// components/devis/steps/step-problems.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from "lucide-react";
import type { DevisFormState, DevisAction, ZoneId } from "../devis-types";
import { ZONES_CONFIG, getZoneConfig } from "../devis-zones-config";

interface StepProblemsProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepProblemsOverlay({ state, dispatch }: StepProblemsProps) {
  const activeZone = state.activeZone;
  const zoneConfig = activeZone ? getZoneConfig(activeZone) : null;
  const currentIndex = activeZone ? state.selectedZones.indexOf(activeZone) : 0;
  const hasMultipleZones = state.selectedZones.length > 1;

  const goToZone = (direction: "prev" | "next") => {
    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, state.selectedZones.length - 1)
        : Math.max(currentIndex - 1, 0);
    dispatch({ type: "SET_ACTIVE_ZONE", zone: state.selectedZones[newIndex] });
  };

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 gap-4">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Etape 2 / 6</p>
          <h2 className="text-2xl font-bold text-white">Quel est l'etat actuel ?</h2>
          <p className="text-gray-300 mt-2">
            Cliquez sur les problemes visibles dans votre {zoneConfig?.label.toLowerCase()}
          </p>
        </div>

        {/* Tabs navigation zones */}
        {hasMultipleZones && (
          <div className="pointer-events-auto flex gap-2">
            {state.selectedZones.map((zoneId) => {
              const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
              const problemCount = state.problems[zoneId].length;
              return (
                <button
                  key={zoneId}
                  onClick={() => dispatch({ type: "SET_ACTIVE_ZONE", zone: zoneId })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeZone === zoneId
                      ? "bg-[#E50000] text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {zone?.label}
                  {problemCount > 0 && (
                    <span className="ml-1 bg-white/30 rounded-full px-1.5 text-xs">
                      {problemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Panneau lateral : liste des problemes */}
      {zoneConfig && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 w-64 space-y-2">
            <h3 className="text-white font-semibold text-sm mb-3">
              Problemes — {zoneConfig.label}
            </h3>
            {zoneConfig.problems.map((problem) => {
              const isSelected = state.problems[activeZone!].includes(problem.id);
              return (
                <button
                  key={problem.id}
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_PROBLEM",
                      zone: activeZone!,
                      problemId: problem.id,
                    })
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isSelected
                      ? "bg-[#E50000]/20 text-[#E50000] border border-[#E50000]/40"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 flex-shrink-0" />
                  )}
                  {problem.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation bas */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="pointer-events-auto border-white/30 text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour
        </Button>
        <Button
          size="lg"
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="pointer-events-auto bg-[#E50000] hover:bg-red-700 text-white text-lg px-10 py-6 rounded-xl shadow-2xl"
        >
          Continuer <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **5.2** Creer les labels 3D des problemes `components/devis/problem-labels-3d.tsx` :

```tsx
// components/devis/problem-labels-3d.tsx
"use client";

import { Html } from "@react-three/drei";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { DevisFormState, DevisAction, ZoneId } from "./devis-types";
import { getZoneConfig } from "./devis-zones-config";

interface ProblemLabels3DProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function ProblemLabels3D({ state, dispatch }: ProblemLabels3DProps) {
  if (state.currentStep !== 1 || !state.activeZone) return null;

  const zoneConfig = getZoneConfig(state.activeZone);
  if (!zoneConfig) return null;

  return (
    <>
      {zoneConfig.problems.map((problem) => {
        const isSelected = state.problems[state.activeZone!].includes(problem.id);
        return (
          <Html
            key={problem.id}
            position={problem.position3D}
            center
            distanceFactor={6}
          >
            <button
              onClick={() =>
                dispatch({
                  type: "TOGGLE_PROBLEM",
                  zone: state.activeZone!,
                  problemId: problem.id,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer hover:scale-110 ${
                isSelected
                  ? "bg-[#E50000] text-white shadow-lg shadow-red-500/40"
                  : "bg-white/95 text-gray-800 shadow-md hover:bg-white"
              }`}
            >
              {isSelected ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              )}
              {problem.label}
            </button>
          </Html>
        );
      })}
    </>
  );
}
```

### Validation
- Chaque probleme a un label 3D flottant cliquable positionne dans la scene
- Le panneau lateral liste les problemes avec un etat visuel clair (selectionne / non selectionne)
- Navigation entre zones via tabs si multi-selection
- La camera zoome vers la zone active

---

## Tache 6 — Etape 3 : configuration resultat avec animations

### Objectif
Le client active les options de renovation. Chaque option declenchee provoque une animation de transformation sur la zone 3D (changement de couleur/materiau). Toggle on/off.

### Steps

- [ ] **6.1** Creer `components/devis/steps/step-renovation.tsx` :

```tsx
// components/devis/steps/step-renovation.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";
import { ZONES_CONFIG, getZoneConfig } from "../devis-zones-config";

interface StepRenovationProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepRenovationOverlay({ state, dispatch }: StepRenovationProps) {
  const activeZone = state.activeZone;
  const zoneConfig = activeZone ? getZoneConfig(activeZone) : null;
  const hasMultipleZones = state.selectedZones.length > 1;

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      {/* Header */}
      <div className="flex flex-col items-center pt-8 gap-4">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Etape 3 / 6</p>
          <h2 className="text-2xl font-bold text-white">
            <Sparkles className="inline w-6 h-6 mr-2 text-[#E50000]" />
            Quel resultat souhaitez-vous ?
          </h2>
          <p className="text-gray-300 mt-2">Activez les options de renovation</p>
        </div>

        {/* Tabs zones */}
        {hasMultipleZones && (
          <div className="pointer-events-auto flex gap-2">
            {state.selectedZones.map((zoneId) => {
              const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
              return (
                <button
                  key={zoneId}
                  onClick={() => dispatch({ type: "SET_ACTIVE_ZONE", zone: zoneId })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeZone === zoneId
                      ? "bg-[#E50000] text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {zone?.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Panneau options renovation */}
      {zoneConfig && activeZone && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 w-72 space-y-2">
            <h3 className="text-white font-semibold text-sm mb-3">
              Options — {zoneConfig.label}
            </h3>
            {zoneConfig.renovationOptions.map((option) => {
              const isSelected = state.renovationOptions[activeZone].includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_RENOVATION_OPTION",
                      zone: activeZone,
                      optionId: option.id,
                    })
                  }
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                    isSelected
                      ? "bg-[#E50000]/20 border border-[#E50000]/40"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-[#E50000]" : "border border-white/40"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="pointer-events-auto border-white/30 text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour
        </Button>
        <Button
          size="lg"
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="pointer-events-auto bg-[#E50000] hover:bg-red-700 text-white text-lg px-10 py-6 rounded-xl shadow-2xl"
        >
          Continuer <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **6.2** Creer `components/devis/renovation-animation-3d.tsx` — animations de transformation dans la scene :

```tsx
// components/devis/renovation-animation-3d.tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import type { DevisFormState, ZoneId } from "./devis-types";
import { getZoneConfig } from "./devis-zones-config";

interface RenovationAnimation3DProps {
  state: DevisFormState;
}

// Mesh qui represente visuellement une option activee
function OptionMesh({
  zoneId,
  optionId,
  isActive,
  index,
}: {
  zoneId: ZoneId;
  optionId: string;
  isActive: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: isActive ? 1 : 0,
        y: isActive ? 1 : 0,
        z: isActive ? 1 : 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
      gsap.to(meshRef.current.material as THREE.MeshStandardMaterial, {
        opacity: isActive ? 0.7 : 0,
        duration: 0.4,
      });
    }
  }, [isActive]);

  // Positions decoratives autour de la zone
  const zonePositions: Record<ZoneId, [number, number, number]> = {
    cuisine: [-1.2, 0.75, 0.8],
    "salle-de-bain": [1.2, 0.75, 0.8],
    facade: [0, 1.5, -1.3],
    toit: [0, 3.5, 0],
    garage: [3, 0.6, 0],
    exterieur: [-3, 0.2, 0],
  };

  const basePos = zonePositions[zoneId];
  const offset = index * 0.4;

  return (
    <mesh
      ref={meshRef}
      position={[basePos[0] + offset * 0.3, basePos[1] + 0.2 + offset * 0.15, basePos[2] + 0.3]}
      scale={[0, 0, 0]}
    >
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial
        color="#E50000"
        transparent
        opacity={0}
        emissive="#E50000"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export function RenovationAnimation3D({ state }: RenovationAnimation3DProps) {
  if (state.currentStep !== 2) return null;

  return (
    <>
      {state.selectedZones.map((zoneId) => {
        const zoneConfig = getZoneConfig(zoneId);
        if (!zoneConfig) return null;

        return zoneConfig.renovationOptions.map((option, index) => (
          <OptionMesh
            key={`${zoneId}-${option.id}`}
            zoneId={zoneId}
            optionId={option.id}
            isActive={state.renovationOptions[zoneId].includes(option.id)}
            index={index}
          />
        ));
      })}
    </>
  );
}
```

### Validation
- Chaque option de renovation activee fait apparaitre un indicateur 3D avec animation GSAP (scale from 0)
- Desactiver l'option fait disparaitre l'indicateur
- Le panneau lateral liste toutes les options avec checkbox visuel
- Navigation entre zones multi-selectionnees via tabs

---

## Tache 7 — Etapes 4-5 : panneaux formulaire flottants (Html drei + shadcn)

### Objectif
Etape 4 = surface et budget dans un panneau Html flottant. Etape 5 = upload photos + coordonnees contact. Les deux utilisent des composants shadcn/ui rendus via `<Html>` de drei.

### Steps

- [ ] **7.1** Creer `components/devis/steps/step-surface-budget.tsx` :

```tsx
// components/devis/steps/step-surface-budget.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Ruler, Wallet } from "lucide-react";
import type { DevisFormState, DevisAction, BudgetRange } from "../devis-types";

interface StepSurfaceBudgetProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "< 5000", label: "< 5 000 EUR" },
  { value: "5000-15000", label: "5 000 - 15 000 EUR" },
  { value: "15000-30000", label: "15 000 - 30 000 EUR" },
  { value: "30000-50000", label: "30 000 - 50 000 EUR" },
  { value: "> 50000", label: "> 50 000 EUR" },
];

export function StepSurfaceBudgetOverlay({ state, dispatch }: StepSurfaceBudgetProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Panneau central */}
      <div className="pointer-events-auto bg-black/85 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-white/10">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 text-center">Etape 4 / 6</p>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Surface et budget</h2>

        {/* Surface */}
        <div className="space-y-2 mb-6">
          <Label className="text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#E50000]" />
            Surface approximative (m²)
          </Label>
          <Input
            type="number"
            placeholder="Ex: 25"
            value={state.surface || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_SURFACE",
                surface: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-lg h-12"
          />
        </div>

        {/* Budget */}
        <div className="space-y-2 mb-6">
          <Label className="text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#E50000]" />
            Fourchette de budget
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => dispatch({ type: "SET_BUDGET", budget: option.value })}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                  state.budget === option.value
                    ? "bg-[#E50000] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message optionnel */}
        <div className="space-y-2 mb-6">
          <Label className="text-white">Message complementaire (optionnel)</Label>
          <Textarea
            placeholder="Decrivez votre projet en quelques mots..."
            value={state.message}
            onChange={(e) => dispatch({ type: "SET_MESSAGE", message: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[80px]"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <Button
            size="lg"
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="bg-[#E50000] hover:bg-red-700 text-white px-8"
          >
            Continuer <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **7.2** Creer `components/devis/steps/step-photos-contact.tsx` :

```tsx
// components/devis/steps/step-photos-contact.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Image,
} from "lucide-react";
import type { DevisFormState, DevisAction } from "../devis-types";

interface StepPhotosContactProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
}

export function StepPhotosContactOverlay({ state, dispatch }: StepPhotosContactProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      dispatch({ type: "ADD_PHOTOS", files: Array.from(files) });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isValid =
    state.contact.firstName.trim() !== "" &&
    state.contact.phone.trim() !== "" &&
    state.contact.email.trim() !== "";

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/85 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-white/10 max-h-[85vh] overflow-y-auto">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 text-center">Etape 5 / 6</p>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Photos et coordonnees</h2>

        {/* Upload photos */}
        <div className="space-y-3 mb-6">
          <Label className="text-white flex items-center gap-2">
            <Image className="w-4 h-4 text-[#E50000]" />
            Photos de l'existant (optionnel)
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-[#E50000]/50 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-white text-sm">Cliquez pour ajouter des photos</p>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG — max 10 Mo par fichier</p>
          </button>

          {/* Apercu photos */}
          {state.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {state.photos.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_PHOTO", index })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <p className="text-[10px] text-gray-500 truncate w-16 mt-0.5">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coordonnees */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white text-sm flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#E50000]" /> Prenom *
              </Label>
              <Input
                value={state.contact.firstName}
                onChange={(e) => dispatch({ type: "SET_CONTACT", field: "firstName", value: e.target.value })}
                placeholder="Prenom"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white text-sm">Nom</Label>
              <Input
                value={state.contact.lastName}
                onChange={(e) => dispatch({ type: "SET_CONTACT", field: "lastName", value: e.target.value })}
                placeholder="Nom"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white text-sm flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#E50000]" /> Telephone *
            </Label>
            <Input
              type="tel"
              value={state.contact.phone}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
              placeholder="06 12 34 56 78"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white text-sm flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#E50000]" /> Email *
            </Label>
            <Input
              type="email"
              value={state.contact.email}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
              placeholder="votre@email.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E50000]" /> Adresse du chantier
            </Label>
            <Input
              value={state.contact.address}
              onChange={(e) => dispatch({ type: "SET_CONTACT", field: "address", value: e.target.value })}
              placeholder="14 rue de la Paix, 68300 Saint-Louis"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <Button
            size="lg"
            disabled={!isValid}
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="bg-[#E50000] hover:bg-red-700 text-white px-8 disabled:opacity-30"
          >
            Voir le recapitulatif <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Validation
- Etape 4 : champ surface (number input), 5 boutons budget mutuellement exclusifs, textarea message
- Etape 5 : upload multi-photos avec apercu, champs contact (prenom*, nom, tel*, email*, adresse)
- Le bouton "Voir le recapitulatif" est desactive tant que les champs obligatoires (*) ne sont pas remplis
- Les deux panneaux sont centres en overlay, fond noir semi-transparent, style coherent

---

## Tache 8 — Etape 6 : recap avant/apres split view

### Objectif
Split view finale : gauche = etat initial (problemes), droite = resultat (options activees). Bouton "Envoyer ma demande". Animation de transition entre les deux vues.

### Steps

- [ ] **8.1** Creer `components/devis/steps/step-recap.tsx` :

```tsx
// components/devis/steps/step-recap.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { DevisFormState, DevisAction, ZoneId } from "../devis-types";
import { ZONES_CONFIG, getZoneConfig } from "../devis-zones-config";

interface StepRecapProps {
  state: DevisFormState;
  dispatch: React.Dispatch<DevisAction>;
  onSubmit: () => Promise<void>;
}

export function StepRecapOverlay({ state, dispatch, onSubmit }: StepRecapProps) {
  const [showAfter, setShowAfter] = useState(false);

  const budgetLabels: Record<string, string> = {
    "< 5000": "< 5 000 EUR",
    "5000-15000": "5 000 - 15 000 EUR",
    "15000-30000": "15 000 - 30 000 EUR",
    "30000-50000": "30 000 - 50 000 EUR",
    "> 50000": "> 50 000 EUR",
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 text-center">Etape 6 / 6</p>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Recapitulatif de votre demande</h2>

        {/* Toggle Avant / Apres */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 rounded-full p-1 flex">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !showAfter ? "bg-[#E50000] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-1" /> Avant
            </button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showAfter ? "bg-[#E50000] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" /> Apres
            </button>
          </div>
        </div>

        {/* Split content */}
        <div className="space-y-4 mb-6">
          {state.selectedZones.map((zoneId) => {
            const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
            const zoneConfig = getZoneConfig(zoneId);
            if (!zone || !zoneConfig) return null;

            const problems = state.problems[zoneId];
            const options = state.renovationOptions[zoneId];

            return (
              <div key={zoneId} className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">{zone.label}</h3>

                {!showAfter ? (
                  // Avant — problemes
                  <div className="space-y-1">
                    {problems.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucun probleme signale</p>
                    ) : (
                      problems.map((problemId) => {
                        const problem = zoneConfig.problems.find((p) => p.id === problemId);
                        return (
                          <div key={problemId} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="text-gray-300">{problem?.label || problemId}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  // Apres — options
                  <div className="space-y-1">
                    {options.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucune option selectionnee</p>
                    ) : (
                      options.map((optionId) => {
                        const option = zoneConfig.renovationOptions.find((o) => o.id === optionId);
                        return (
                          <div key={optionId} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-300">{option?.label || optionId}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Infos complementaires */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Surface</p>
            <p className="text-white font-medium">
              {state.surface ? `${state.surface} m²` : "Non renseignee"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Budget</p>
            <p className="text-white font-medium">
              {state.budget ? budgetLabels[state.budget] : "Non renseigne"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Contact</p>
            <p className="text-white font-medium">
              {state.contact.firstName} {state.contact.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Telephone</p>
            <p className="text-white font-medium">{state.contact.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400">Email</p>
            <p className="text-white font-medium">{state.contact.email}</p>
          </div>
          {state.contact.address && (
            <div className="col-span-2">
              <p className="text-gray-400">Adresse du chantier</p>
              <p className="text-white font-medium">{state.contact.address}</p>
            </div>
          )}
          {state.photos.length > 0 && (
            <div className="col-span-2">
              <p className="text-gray-400">Photos jointes</p>
              <p className="text-white font-medium">{state.photos.length} fichier(s)</p>
            </div>
          )}
        </div>

        {/* Erreur */}
        {state.error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 mb-4 text-red-300 text-sm text-center">
            {state.error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            disabled={state.isSubmitting}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Modifier
          </Button>
          <Button
            size="lg"
            onClick={onSubmit}
            disabled={state.isSubmitting}
            className="bg-[#E50000] hover:bg-red-700 text-white px-8 text-lg"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" /> Envoyer ma demande
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **8.2** Creer `components/devis/steps/step-success.tsx` — ecran de confirmation :

```tsx
// components/devis/steps/step-success.tsx
"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { DevisAction } from "../devis-types";

interface StepSuccessProps {
  dispatch: React.Dispatch<DevisAction>;
}

export function StepSuccessOverlay({ dispatch }: StepSuccessProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-md rounded-3xl p-10 w-full max-w-md mx-4 shadow-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">Demande envoyee !</h2>
        <p className="text-gray-300 mb-6">
          Merci pour votre confiance. Nous avons bien recu votre demande de devis et vous recontactons sous 24h.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Un email de confirmation a ete envoye a votre adresse.
        </p>

        <div className="space-y-3">
          <Button
            asChild
            size="lg"
            className="w-full bg-[#E50000] hover:bg-red-700 text-white"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour a l'accueil
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <a href="tel:0939245515">
              <Phone className="w-4 h-4 mr-2" /> Appeler maintenant
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Validation
- Le recap affiche un toggle Avant/Apres avec la liste des problemes vs options par zone
- Les infos contact, surface, budget, photos sont resumees
- Le bouton "Envoyer" montre un spinner pendant la soumission
- L'ecran de succes propose de revenir a l'accueil ou d'appeler

---

## Tache 9 — Fallback 2D pour mobile/GPU faible

### Objectif
Creer un wizard 2D classique avec shadcn/ui qui remplace la version 3D sur les appareils ne supportant pas WebGL ou ayant un GPU faible. Detection automatique.

### Steps

- [ ] **9.1** Creer `components/devis/gpu-detector.ts` — detection des capacites :

```typescript
// components/devis/gpu-detector.ts
export function canRender3D(): boolean {
  if (typeof window === "undefined") return false;

  // Verifier WebGL support
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
  } catch {
    return false;
  }

  // Verifier taille ecran (mobile petit = fallback 2D)
  if (window.innerWidth < 768) return false;

  // Verifier si device a peu de memoire
  if ("deviceMemory" in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) return false;
  }

  // Verifier preference de mouvement reduit
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  return true;
}
```

- [ ] **9.2** Creer `components/devis/devis-wizard-2d.tsx` — wizard 2D complet :

```tsx
// components/devis/devis-wizard-2d.tsx
"use client";

import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Phone,
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { ZONES_CONFIG, getZoneConfig } from "./devis-zones-config";
import type { DevisFormState, DevisAction, ZoneId, BudgetRange } from "./devis-types";

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "< 5000", label: "< 5 000 EUR" },
  { value: "5000-15000", label: "5 000 - 15 000 EUR" },
  { value: "15000-30000", label: "15 000 - 30 000 EUR" },
  { value: "30000-50000", label: "30 000 - 50 000 EUR" },
  { value: "> 50000", label: "> 50 000 EUR" },
];

async function submitDevis(state: DevisFormState) {
  const res = await fetch("/api/devis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...state,
      photos: [], // les photos ne sont pas serialisables directement en JSON
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de l'envoi");
  }
}

export function DevisWizard2D() {
  const [state, dispatch] = useReducer(devisReducer, initialDevisState);

  const handleSubmit = async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      await submitDevis(state);
      dispatch({ type: "SET_SUBMITTED" });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message || "Erreur lors de l'envoi" });
    }
  };

  // Ecran succes
  if (state.isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="bg-[#111111] rounded-3xl p-10 w-full max-w-md text-center border border-white/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Demande envoyee !</h2>
          <p className="text-gray-300 mb-6">Nous vous recontactons sous 24h.</p>
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full bg-[#E50000] hover:bg-red-700 text-white">
              <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour a l'accueil</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-white/30 text-white hover:bg-white/10">
              <a href="tel:0939245515"><Phone className="w-4 h-4 mr-2" /> Appeler</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = [
    "Zones a renover",
    "Etat actuel",
    "Renovation souhaitee",
    "Surface et budget",
    "Photos et coordonnees",
    "Recapitulatif",
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">
              Etape {state.currentStep + 1} / 6
            </span>
            <span className="text-sm text-white font-medium">
              {stepTitles[state.currentStep]}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E50000] rounded-full transition-all duration-500"
              style={{ width: `${((state.currentStep + 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#111111] rounded-3xl p-8 border border-white/10">
          {/* Etape 0 : Zones */}
          {state.currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Ou souhaitez-vous renover ?</h2>
              <div className="grid grid-cols-2 gap-3">
                {ZONES_CONFIG.map((zone) => {
                  const isSelected = state.selectedZones.includes(zone.id);
                  return (
                    <button
                      key={zone.id}
                      onClick={() => dispatch({ type: "TOGGLE_ZONE", zone: zone.id })}
                      className={`p-4 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-[#E50000]/20 border-2 border-[#E50000]"
                          : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-[#E50000]" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500" />
                        )}
                        <span className={`font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>
                          {zone.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Etape 1 : Problemes */}
          {state.currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Quel est l'etat actuel ?</h2>
              {state.selectedZones.map((zoneId) => {
                const zoneConfig = getZoneConfig(zoneId);
                if (!zoneConfig) return null;
                return (
                  <div key={zoneId} className="space-y-2">
                    <h3 className="text-white font-semibold">{zoneConfig.label}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {zoneConfig.problems.map((problem) => {
                        const isSelected = state.problems[zoneId].includes(problem.id);
                        return (
                          <button
                            key={problem.id}
                            onClick={() => dispatch({ type: "TOGGLE_PROBLEM", zone: zoneId, problemId: problem.id })}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              isSelected
                                ? "bg-[#E50000]/20 text-[#E50000] border border-[#E50000]/40"
                                : "bg-white/5 text-white hover:bg-white/10"
                            }`}
                          >
                            {isSelected ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            {problem.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Etape 2 : Options renovation */}
          {state.currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Quel resultat souhaitez-vous ?</h2>
              {state.selectedZones.map((zoneId) => {
                const zoneConfig = getZoneConfig(zoneId);
                if (!zoneConfig) return null;
                return (
                  <div key={zoneId} className="space-y-2">
                    <h3 className="text-white font-semibold">{zoneConfig.label}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {zoneConfig.renovationOptions.map((option) => {
                        const isSelected = state.renovationOptions[zoneId].includes(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => dispatch({ type: "TOGGLE_RENOVATION_OPTION", zone: zoneId, optionId: option.id })}
                            className={`flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-all ${
                              isSelected
                                ? "bg-[#E50000]/20 border border-[#E50000]/40"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                              isSelected ? "bg-[#E50000]" : "border border-white/40"
                            }`}>
                              {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${isSelected ? "text-[#E50000]" : "text-white"}`}>{option.label}</p>
                              <p className="text-xs text-gray-400">{option.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Etape 3 : Surface / Budget */}
          {state.currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Surface et budget</h2>
              <div className="space-y-2">
                <Label className="text-white">Surface approximative (m²)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 25"
                  value={state.surface || ""}
                  onChange={(e) => dispatch({ type: "SET_SURFACE", surface: e.target.value ? Number(e.target.value) : null })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Fourchette de budget</Label>
                <div className="grid grid-cols-1 gap-2">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => dispatch({ type: "SET_BUDGET", budget: option.value })}
                      className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                        state.budget === option.value ? "bg-[#E50000] text-white" : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Message (optionnel)</Label>
                <Textarea
                  placeholder="Decrivez votre projet..."
                  value={state.message}
                  onChange={(e) => dispatch({ type: "SET_MESSAGE", message: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          {/* Etape 4 : Photos + Contact */}
          {state.currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Photos et coordonnees</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm">Prenom *</Label>
                    <Input value={state.contact.firstName} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "firstName", value: e.target.value })} placeholder="Prenom" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white text-sm">Nom</Label>
                    <Input value={state.contact.lastName} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "lastName", value: e.target.value })} placeholder="Nom" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-sm">Telephone *</Label>
                  <Input type="tel" value={state.contact.phone} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })} placeholder="06 12 34 56 78" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-sm">Email *</Label>
                  <Input type="email" value={state.contact.email} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })} placeholder="votre@email.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-sm">Adresse du chantier</Label>
                  <Input value={state.contact.address} onChange={(e) => dispatch({ type: "SET_CONTACT", field: "address", value: e.target.value })} placeholder="14 rue de la Paix, 68300 Saint-Louis" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
                </div>
              </div>
            </div>
          )}

          {/* Etape 5 : Recap */}
          {state.currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Recapitulatif</h2>
              {state.selectedZones.map((zoneId) => {
                const zoneConfig = getZoneConfig(zoneId);
                if (!zoneConfig) return null;
                return (
                  <div key={zoneId} className="bg-white/5 rounded-xl p-4 space-y-2">
                    <h3 className="text-white font-semibold">{zoneConfig.label}</h3>
                    {state.problems[zoneId].length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Problemes</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {state.problems[zoneId].map((pId) => {
                            const p = zoneConfig.problems.find((prob) => prob.id === pId);
                            return <Badge key={pId} variant="secondary" className="bg-amber-500/20 text-amber-300 text-xs">{p?.label}</Badge>;
                          })}
                        </div>
                      </div>
                    )}
                    {state.renovationOptions[zoneId].length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Renovation</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {state.renovationOptions[zoneId].map((oId) => {
                            const o = zoneConfig.renovationOptions.find((opt) => opt.id === oId);
                            return <Badge key={oId} variant="secondary" className="bg-green-500/20 text-green-300 text-xs">{o?.label}</Badge>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="bg-white/5 rounded-xl p-4 text-sm space-y-1">
                <p className="text-white"><span className="text-gray-400">Contact :</span> {state.contact.firstName} {state.contact.lastName}</p>
                <p className="text-white"><span className="text-gray-400">Tel :</span> {state.contact.phone}</p>
                <p className="text-white"><span className="text-gray-400">Email :</span> {state.contact.email}</p>
                {state.surface && <p className="text-white"><span className="text-gray-400">Surface :</span> {state.surface} m²</p>}
                {state.budget && <p className="text-white"><span className="text-gray-400">Budget :</span> {state.budget}</p>}
              </div>
              {state.error && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm text-center">{state.error}</div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {state.currentStep > 0 ? (
              <Button variant="outline" onClick={() => dispatch({ type: "PREV_STEP" })} className="border-white/30 text-white hover:bg-white/10">
                <ChevronLeft className="w-4 h-4 mr-1" /> Retour
              </Button>
            ) : (
              <div />
            )}

            {state.currentStep < 5 ? (
              <Button
                size="lg"
                disabled={state.currentStep === 0 && state.selectedZones.length === 0}
                onClick={() => {
                  if (state.currentStep === 0 && state.selectedZones.length > 0) {
                    dispatch({ type: "SET_ACTIVE_ZONE", zone: state.selectedZones[0] });
                  }
                  dispatch({ type: "NEXT_STEP" });
                }}
                className="bg-[#E50000] hover:bg-red-700 text-white px-8 disabled:opacity-30"
              >
                Continuer <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={state.isSubmitting}
                className="bg-[#E50000] hover:bg-red-700 text-white px-8"
              >
                {state.isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Envoyer</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Validation
- Le wizard 2D reproduit les 6 etapes sans aucune dependance WebGL/Three.js
- L'interface utilise les memes couleurs (#E50000, #0A0A0A, blanc) et composants shadcn/ui
- La barre de progression indique l'etape courante
- Le formulaire est utilisable sur mobile (responsive, pas de 3D)

---

## Tache 10 — Orchestrateur principal et integration page /devis

### Objectif
Creer le composant principal `DevisWizard3D` qui orchestre scene 3D + overlays selon l'etape. Detecter les capacites GPU et basculer vers le wizard 2D si necessaire. Remplacer le placeholder de la page `/devis`.

### Steps

- [ ] **10.1** Creer `components/devis/devis-wizard-3d.tsx` — orchestrateur 3D :

```tsx
// components/devis/devis-wizard-3d.tsx
"use client";

import { useReducer, useCallback } from "react";
import { devisReducer, initialDevisState } from "./devis-reducer";
import { DevisScene } from "./devis-scene";
import { StepZoneSelectionOverlay } from "./steps/step-zone-selection";
import { StepProblemsOverlay } from "./steps/step-problems";
import { StepRenovationOverlay } from "./steps/step-renovation";
import { StepSurfaceBudgetOverlay } from "./steps/step-surface-budget";
import { StepPhotosContactOverlay } from "./steps/step-photos-contact";
import { StepRecapOverlay } from "./steps/step-recap";
import { StepSuccessOverlay } from "./steps/step-success";

async function submitDevis(state: typeof initialDevisState) {
  const res = await fetch("/api/devis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...state,
      photos: [], // File objects ne sont pas serialisables
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de l'envoi");
  }
}

export function DevisWizard3D() {
  const [state, dispatch] = useReducer(devisReducer, initialDevisState);

  const handleSubmit = useCallback(async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      await submitDevis(state);
      dispatch({ type: "SET_SUBMITTED" });
    } catch (err: any) {
      dispatch({
        type: "SET_ERROR",
        error: err.message || "Erreur lors de l'envoi. Veuillez reessayer.",
      });
    }
  }, [state]);

  if (state.isSubmitted) {
    return (
      <div className="relative w-full h-screen bg-[#0A0A0A]">
        <DevisScene state={state} dispatch={dispatch} />
        <StepSuccessOverlay dispatch={dispatch} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Scene 3D en arriere-plan */}
      <DevisScene state={state} dispatch={dispatch} />

      {/* Overlay UI selon l'etape */}
      {state.currentStep === 0 && (
        <StepZoneSelectionOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 1 && (
        <StepProblemsOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 2 && (
        <StepRenovationOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 3 && (
        <StepSurfaceBudgetOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 4 && (
        <StepPhotosContactOverlay state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 5 && (
        <StepRecapOverlay state={state} dispatch={dispatch} onSubmit={handleSubmit} />
      )}

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === state.currentStep
                ? "bg-[#E50000] scale-125"
                : i < state.currentStep
                ? "bg-[#E50000]/50"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **10.2** Creer `components/devis/devis-page-content.tsx` — composant qui choisit 3D ou 2D :

```tsx
// components/devis/devis-page-content.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { canRender3D } from "./gpu-detector";
import { DevisWizard2D } from "./devis-wizard-2d";

// Import dynamique du wizard 3D (evite le chargement de Three.js si inutile)
const DevisWizard3D = dynamic(
  () => import("./devis-wizard-3d").then((mod) => ({ default: mod.DevisWizard3D })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement de l'experience 3D...</p>
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

  // En attente de detection
  if (use3D === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback 2D
  if (!use3D) {
    return <DevisWizard2D />;
  }

  // Experience 3D
  return <DevisWizard3D />;
}
```

- [ ] **10.3** Remplacer le contenu de `app/devis/page.tsx` :

```tsx
// app/devis/page.tsx
import type { Metadata } from "next";
import { DevisPageContent } from "@/components/devis/devis-page-content";

export const metadata: Metadata = {
  title: "Devis gratuit — Aiman Renovation",
  description:
    "Demandez votre devis de renovation gratuit en ligne. Experience interactive 3D pour visualiser votre projet. Saint-Louis 68300.",
  openGraph: {
    title: "Devis gratuit — Aiman Renovation",
    description:
      "Configurez votre projet de renovation en 3D et recevez un devis gratuit.",
  },
};

export default function DevisPage() {
  return <DevisPageContent />;
}
```

### Validation
- `DevisPageContent` detecte les capacites GPU et charge le composant adequat
- Le wizard 3D est importe dynamiquement (code splitting — Three.js n'est pas charge sur mobile)
- Le loading state affiche un spinner rouge
- La page `/devis` a ses metadata SEO
- Les 6 etapes fonctionnent de bout en bout en 3D et en 2D

---

## Tache 11 — Envoi email + confirmation

### Objectif
Verifier que le flux complet fonctionne : soumission du formulaire, envoi des 2 emails (client + entreprise), ecran de confirmation.

### Steps

- [ ] **11.1** Verifier que la variable `RESEND_API_KEY` est configuree dans `.env.local` :

```bash
cd /Users/Aiman/aiman-renovation && grep RESEND_API_KEY .env.local
```

Si absent :
```bash
echo 'RESEND_API_KEY=re_xxxxxxxxxxxxx' >> .env.local
echo 'DEVIS_RECIPIENT_EMAIL=contact@aiman-renovation.fr' >> .env.local
```

- [ ] **11.2** Verifier que le domaine `aiman-renovation.fr` est configure dans Resend (panneau Resend > Domains). L'email `devis@aiman-renovation.fr` doit etre autorise comme expediteur.

- [ ] **11.3** Tester l'API manuellement :

```bash
cd /Users/Aiman/aiman-renovation && npm run dev
```

Dans un autre terminal :
```bash
curl -X POST http://localhost:3000/api/devis \
  -H "Content-Type: application/json" \
  -d '{
    "selectedZones": ["cuisine"],
    "activeZone": "cuisine",
    "currentStep": 5,
    "problems": {"cuisine": ["murs-fissures"], "salle-de-bain": [], "facade": [], "toit": [], "garage": [], "exterieur": []},
    "renovationOptions": {"cuisine": ["nouveau-carrelage"], "salle-de-bain": [], "facade": [], "toit": [], "garage": [], "exterieur": []},
    "surface": 20,
    "budget": "5000-15000",
    "message": "Test devis",
    "photos": [],
    "contact": {
      "firstName": "Test",
      "lastName": "Utilisateur",
      "phone": "0612345678",
      "email": "test@example.com",
      "address": "14 rue de la Paix, 68300 Saint-Louis"
    },
    "isSubmitting": false,
    "isSubmitted": false,
    "error": null
  }'
```

Resultat attendu : `{"success":true}`

- [ ] **11.4** Verifier reception des 2 emails (via Resend dashboard > Logs)

### Validation
- L'API `/api/devis` retourne `{"success":true}` avec un body valide
- L'API retourne `{"error":"Champs obligatoires manquants"}` (400) si champs manquants
- 2 emails sont envoyes : un a `contact@aiman-renovation.fr`, un au client

---

## Tache 12 — Build + test

### Objectif
Verifier que le projet compile sans erreur et que toutes les pages sont accessibles.

### Steps

- [ ] **12.1** Verifier les imports et types :

```bash
cd /Users/Aiman/aiman-renovation && npx tsc --noEmit
```

Corriger toutes les erreurs TypeScript.

- [ ] **12.2** Build de production :

```bash
cd /Users/Aiman/aiman-renovation && npm run build
```

Aucune erreur attendue.

- [ ] **12.3** Test manuel des 6 etapes :

```bash
cd /Users/Aiman/aiman-renovation && npm run dev
```

Ouvrir `http://localhost:3000/devis` et verifier :

1. La maison 3D s'affiche, les 6 zones sont cliquables
2. Cliquer sur "Cuisine" → badge rouge, zone highlight, camera ne zoome pas encore
3. Cliquer "Continuer" → etape 2, camera zoome vers la cuisine, labels problemes flottants
4. Selectionner des problemes → etape 3, options renovation avec animations
5. Continuer → etape 4, panneau surface/budget
6. Continuer → etape 5, formulaire contact
7. Continuer → etape 6, recap avant/apres
8. "Envoyer" → spinner puis ecran succes

- [ ] **12.4** Test fallback 2D — ouvrir dans Chrome DevTools, activer "Toggle device toolbar" (mobile), recharger `/devis`. Le wizard 2D doit s'afficher sans Canvas WebGL.

- [ ] **12.5** Test responsive du wizard 2D sur les tailles : 375px (iPhone), 768px (iPad), 1024px.

### Validation
- `tsc --noEmit` : 0 erreur
- `npm run build` : succes
- Les 6 etapes fonctionnent en 3D sur desktop
- Le fallback 2D fonctionne sur mobile
- L'envoi email fonctionne de bout en bout

---

## Arborescence des fichiers crees

```
components/devis/
├── devis-types.ts                    # Types et interfaces
├── devis-reducer.ts                  # Reducer + state initial
├── devis-zones-config.ts             # Configuration des 6 zones
├── house-3d.tsx                      # Maison 3D interactive
├── devis-scene.tsx                   # Canvas R3F + camera animee
├── zone-label-3d.tsx                 # Labels 3D flottants zones
├── problem-labels-3d.tsx             # Labels 3D flottants problemes
├── renovation-animation-3d.tsx       # Animations transformation
├── devis-wizard-3d.tsx               # Orchestrateur wizard 3D
├── devis-wizard-2d.tsx               # Wizard 2D fallback complet
├── devis-page-content.tsx            # Switch 3D/2D + dynamic import
├── gpu-detector.ts                   # Detection capacites GPU
└── steps/
    ├── step-zone-selection.tsx       # Etape 1 overlay
    ├── step-problems.tsx             # Etape 2 overlay
    ├── step-renovation.tsx           # Etape 3 overlay
    ├── step-surface-budget.tsx       # Etape 4 overlay
    ├── step-photos-contact.tsx       # Etape 5 overlay
    ├── step-recap.tsx                # Etape 6 overlay
    └── step-success.tsx              # Ecran confirmation

lib/
├── email.ts                          # Configuration Resend
└── email-templates/
    └── devis-confirmation.tsx        # Template HTML email

app/
├── devis/page.tsx                    # Page /devis (remplace placeholder)
└── api/devis/route.ts                # Route API envoi email
```

## Commandes a executer (dans l'ordre)

```bash
# 1. Installer Resend
cd /Users/Aiman/aiman-renovation && npm install resend

# 2. Configurer env
echo 'RESEND_API_KEY=re_xxxxxxxxxxxxx' >> .env.local
echo 'DEVIS_RECIPIENT_EMAIL=contact@aiman-renovation.fr' >> .env.local

# 3. Verifier types
npx tsc --noEmit

# 4. Build
npm run build

# 5. Test
npm run dev
```
