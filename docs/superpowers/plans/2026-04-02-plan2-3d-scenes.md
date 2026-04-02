# Plan 2 — Moteur 3D + Scènes Scroll-Driven "De la Ruine au Rêve"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter le moteur 3D et les scènes scroll-driven au site Aiman Renovation. Chaque service a une scène où le scroll transforme un espace dégradé vers son état rénové. Concept : "De la ruine au rêve".

**Architecture:** React Three Fiber pour le rendu 3D, GSAP ScrollTrigger pour le pilotage scroll, Lenis pour le smooth scroll. Toutes les scènes utilisent des géométries primitives Three.js comme placeholders (cubes, plans, cylindres). Les vrais modèles GLB seront intégrés ultérieurement.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, @react-three/fiber, @react-three/drei, three, gsap (avec ScrollTrigger), lenis

**Spec:** `docs/superpowers/specs/2026-04-02-site-aiman-renovation-design.md`

**Identité visuelle:**
- Rouge: `#E50000`
- Noir: `#0A0A0A`
- Blanc: `#FFFFFF`
- Tricolore: Bleu `#002395` / Blanc `#FFFFFF` / Rouge `#ED2939`

**IMPORTANT:** Ce plan travaille dans `/Users/Aiman/aiman-renovation/`. Il crée uniquement dans `components/3d/` et modifie les pages pour intégrer les scènes. Il ne touche PAS au scaffold Next.js (fait par Plan 1) ni à `components/devis/` (Plan 3).

---

## Tâche 1 — Installer les dépendances 3D et scroll

**But:** Ajouter toutes les libs nécessaires au moteur 3D et au smooth scroll.

### Step 1.1 — Installer les packages npm
- [ ] Exécuter la commande d'installation

```bash
cd /Users/Aiman/aiman-renovation && npm install three @react-three/fiber @react-three/drei gsap lenis
```

### Step 1.2 — Installer les types TypeScript
- [ ] Ajouter les types Three.js

```bash
cd /Users/Aiman/aiman-renovation && npm install -D @types/three
```

### Step 1.3 — Vérifier l'installation
- [ ] Vérifier que les packages sont dans package.json

```bash
cd /Users/Aiman/aiman-renovation && cat package.json | grep -E "three|fiber|drei|gsap|lenis"
```

Résultat attendu : les 5 packages apparaissent dans `dependencies`, `@types/three` dans `devDependencies`.

---

## Tâche 2 — Créer le provider Smooth Scroll (Lenis + GSAP)

**But:** Mettre en place le smooth scroll global via Lenis synchronisé avec GSAP ScrollTrigger.

### Step 2.1 — Créer le fichier `components/3d/providers/SmoothScrollProvider.tsx`
- [ ] Créer le provider Lenis qui wrap l'application

**Fichier:** `components/3d/providers/SmoothScrollProvider.tsx`

```tsx
'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
```

### Step 2.2 — Créer le barrel export `components/3d/providers/index.ts`
- [ ] Exporter le provider

**Fichier:** `components/3d/providers/index.ts`

```ts
export { default as SmoothScrollProvider } from './SmoothScrollProvider';
```

### Step 2.3 — Intégrer le provider dans le layout racine
- [ ] Modifier `app/layout.tsx` pour wrapper le contenu avec SmoothScrollProvider

Dans `app/layout.tsx`, ajouter l'import et wrapper `{children}` :

```tsx
// Ajouter l'import en haut du fichier
import SmoothScrollProvider from '@/components/3d/providers/SmoothScrollProvider';

// Dans le JSX du layout, wrapper children :
// Avant:
//   <body>{children}</body>
// Après:
//   <body>
//     <SmoothScrollProvider>
//       {children}
//     </SmoothScrollProvider>
//   </body>
```

**Note :** Adapter l'emplacement exact dans le layout selon la structure créée par Plan 1 (navbar, footer, etc.). Le provider doit englober le contenu scrollable, pas la navbar fixe si elle est hors du flux.

---

## Tâche 3 — Créer le wrapper scène 3D (Canvas R3F + Suspense + Loader)

**But:** Composant réutilisable qui encapsule un Canvas React Three Fiber avec Suspense, loader de progression, et lazy loading au scroll.

### Step 3.1 — Créer le loader de progression `components/3d/SceneLoader.tsx`
- [ ] Créer le composant loader 3D

**Fichier:** `components/3d/SceneLoader.tsx`

```tsx
'use client';

import { useProgress, Html } from '@react-three/drei';

export default function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E50000] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/60 text-sm font-mono">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}
```

### Step 3.2 — Créer le wrapper Canvas `components/3d/SceneCanvas.tsx`
- [ ] Créer le composant Canvas R3F avec Suspense et lazy loading

**Fichier:** `components/3d/SceneCanvas.tsx`

```tsx
'use client';

import { Suspense, useRef, useEffect, useState, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneLoader from './SceneLoader';

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  /** Hauteur du conteneur CSS (ex: "100vh", "80vh") */
  height?: string;
  /** Couleur de fond du canvas */
  bgColor?: string;
  /** ID pour le ScrollTrigger */
  id?: string;
}

export default function SceneCanvas({
  children,
  className = '',
  height = '100vh',
  bgColor = '#0A0A0A',
  id,
}: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy loading : n'affiche le Canvas que quand le conteneur entre dans le viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      {isVisible ? (
        <Canvas
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 2, 5], fov: 50 }}
          style={{ background: bgColor }}
        >
          <Suspense fallback={<SceneLoader />}>
            {children}
          </Suspense>
        </Canvas>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className="w-8 h-8 border-2 border-[#E50000] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
```

### Step 3.3 — Créer le barrel export `components/3d/index.ts`
- [ ] Exporter tous les composants 3D de base

**Fichier:** `components/3d/index.ts`

```ts
export { default as SceneCanvas } from './SceneCanvas';
export { default as SceneLoader } from './SceneLoader';
```

---

## Tâche 4 — Créer le composant ScrollScene (liaison scroll <-> animation)

**But:** Composant qui lie le progrès du scroll (0 à 1) à l'animation d'une scène 3D via GSAP ScrollTrigger. Chaque scène reçoit un `progress` entre 0 (ruine) et 1 (rénové).

### Step 4.1 — Créer le hook `components/3d/hooks/useScrollProgress.ts`
- [ ] Hook qui retourne un progress 0-1 basé sur le scroll d'un trigger element

**Fichier:** `components/3d/hooks/useScrollProgress.ts`

```ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollProgressOptions {
  /** ID de l'élément trigger (le conteneur de la scène) */
  triggerId: string;
  /** Début du trigger (ex: "top center") */
  start?: string;
  /** Fin du trigger (ex: "bottom center") */
  end?: string;
  /** Activer le pin du trigger */
  pin?: boolean;
}

export default function useScrollProgress({
  triggerId,
  start = 'top top',
  end = 'bottom top',
  pin = false,
}: UseScrollProgressOptions) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start,
      end,
      pin,
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [triggerId, start, end, pin]);

  return { progress, progressRef };
}
```

### Step 4.2 — Créer le composant wrapper `components/3d/ScrollScene.tsx`
- [ ] Composant qui combine SceneCanvas + useScrollProgress

**Fichier:** `components/3d/ScrollScene.tsx`

```tsx
'use client';

import { useId, ReactNode } from 'react';
import SceneCanvas from './SceneCanvas';

interface ScrollSceneProps {
  children: (progress: number) => ReactNode;
  /** Hauteur du conteneur scrollable (ex: "300vh" pour 3 écrans de scroll) */
  scrollHeight?: string;
  /** Hauteur du canvas (fixe dans le viewport) */
  canvasHeight?: string;
  /** Classe CSS additionnelle */
  className?: string;
  /** ID personnalisé */
  id?: string;
}

export default function ScrollScene({
  children,
  scrollHeight = '300vh',
  canvasHeight = '100vh',
  className = '',
  id,
}: ScrollSceneProps) {
  const autoId = useId();
  const sceneId = id || `scene-${autoId}`;

  return (
    <div
      id={sceneId}
      className={`relative ${className}`}
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0" style={{ height: canvasHeight }}>
        <SceneCanvas height={canvasHeight} id={`${sceneId}-canvas`}>
          <ScrollSceneInner triggerId={sceneId}>
            {children}
          </ScrollSceneInner>
        </SceneCanvas>
      </div>
    </div>
  );
}

// Composant interne pour accéder au hook dans le contexte R3F
import useScrollProgress from './hooks/useScrollProgress';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useCallback } from 'react';

interface ScrollSceneInnerProps {
  triggerId: string;
  children: (progress: number) => ReactNode;
}

function ScrollSceneInner({ triggerId, children }: ScrollSceneInnerProps) {
  const { progressRef } = useScrollProgress({
    triggerId,
    start: 'top top',
    end: 'bottom bottom',
  });

  const [renderProgress, setRenderProgress] = useState(0);

  useFrame(() => {
    // Sync le progress du scroll vers le rendu R3F
    if (Math.abs(progressRef.current - renderProgress) > 0.001) {
      setRenderProgress(progressRef.current);
    }
  });

  return <>{children(renderProgress)}</>;
}
```

### Step 4.3 — Mettre à jour le barrel export
- [ ] Ajouter les nouveaux exports

**Fichier:** `components/3d/index.ts` (remplacer le contenu)

```ts
export { default as SceneCanvas } from './SceneCanvas';
export { default as SceneLoader } from './SceneLoader';
export { default as ScrollScene } from './ScrollScene';
export { default as useScrollProgress } from './hooks/useScrollProgress';
```

---

## Tâche 5 — Créer les 10 scènes placeholder avec géométries primitives

**But:** Chaque scène montre la transformation d'un espace dégradé vers son état rénové. Le `progress` (0-1) pilote le morphing : couleurs, positions, opacités. Géométries primitives Three.js pour l'instant.

### Step 5.1 — Créer les matériaux partagés `components/3d/scenes/materials.ts`
- [ ] Définir les couleurs et constantes réutilisées dans toutes les scènes

**Fichier:** `components/3d/scenes/materials.ts`

```ts
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
```

### Step 5.2 — Créer la scène Cuisine `components/3d/scenes/KitchenScene.tsx`
- [ ] Scène 1 : Vieille cuisine -> cuisine moderne

**Fichier:** `components/3d/scenes/KitchenScene.tsx`

```tsx
'use client';

import { useRef } from 'react';
import { Mesh } from 'three';
import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function KitchenScene({ progress }: SceneProps) {
  const counterRef = useRef<Mesh>(null);

  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, progress);
  const floorColor = lerpColor(RUIN.floor, RENOVATED.floor, progress);
  const counterColor = lerpColor(RUIN.accent, RENOVATED.clean, progress);
  const accentColor = lerpColor(RUIN.metal, RENOVATED.accent, progress);

  return (
    <group>
      {/* Éclairage */}
      <ambientLight intensity={lerp(0.3, 0.8, progress)} />
      <directionalLight position={[5, 5, 5]} intensity={lerp(0.4, 1, progress)} />
      <pointLight position={[0, 2, 0]} intensity={lerp(0.2, 0.6, progress)} color={accentColor} />

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Mur du fond */}
      <mesh position={[0, 1, -3]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Mur gauche */}
      <mesh position={[-4, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Plan de travail (comptoir) */}
      <mesh ref={counterRef} position={[0, 0, -2]}>
        <boxGeometry args={[6, 0.15, 1.2]} />
        <meshStandardMaterial color={counterColor} roughness={lerp(0.9, 0.3, progress)} />
      </mesh>

      {/* Meubles bas (placards) */}
      <mesh position={[0, -0.5, -2]}>
        <boxGeometry args={[6, 0.85, 1.2]} />
        <meshStandardMaterial color={lerpColor('#3a2f20', '#f0ebe4', progress)} />
      </mesh>

      {/* Meubles hauts */}
      <mesh position={[0, 2, -2.8]}>
        <boxGeometry args={[5, 1.2, 0.5]} />
        <meshStandardMaterial color={lerpColor('#3a2f20', '#f0ebe4', progress)} />
      </mesh>

      {/* Évier (creux simplifié) */}
      <mesh position={[-1, 0.12, -2]}>
        <boxGeometry args={[1, 0.08, 0.7]} />
        <meshStandardMaterial color={lerpColor(RUIN.metal, '#d4d4d4', progress)} metalness={lerp(0.2, 0.8, progress)} />
      </mesh>

      {/* Robinet */}
      <mesh position={[-1, 0.5, -2.3]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6]} />
        <meshStandardMaterial color={lerpColor(RUIN.metal, '#c0c0c0', progress)} metalness={0.9} />
      </mesh>

      {/* Plaque de cuisson */}
      <mesh position={[1, 0.12, -2]}>
        <boxGeometry args={[0.9, 0.05, 0.7]} />
        <meshStandardMaterial color={lerpColor(RUIN.dirt, '#1a1a1a', progress)} />
      </mesh>
    </group>
  );
}
```

### Step 5.3 — Créer la scène Salle de bain `components/3d/scenes/BathroomScene.tsx`
- [ ] Scène 2 : Carrelage cassé -> salle de bain design

**Fichier:** `components/3d/scenes/BathroomScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function BathroomScene({ progress }: SceneProps) {
  const tileColor = lerpColor(RUIN.floor, '#e0ddd5', progress);
  const wallColor = lerpColor(RUIN.wall, '#f8f8f6', progress);
  const fixtureColor = lerpColor(RUIN.metal, '#ffffff', progress);

  return (
    <group>
      <ambientLight intensity={lerp(0.3, 0.9, progress)} />
      <directionalLight position={[3, 5, 3]} intensity={lerp(0.3, 0.8, progress)} />
      <pointLight position={[0, 2.5, 0]} intensity={lerp(0.1, 0.5, progress)} color="#f0e6d3" />

      {/* Sol carrelé */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={tileColor} roughness={lerp(0.9, 0.2, progress)} />
      </mesh>

      {/* Murs */}
      <mesh position={[0, 1.5, -2.5]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Baignoire / douche */}
      <mesh position={[1.5, -0.3, -1.5]}>
        <boxGeometry args={[2, 0.8, 1.2]} />
        <meshStandardMaterial color={fixtureColor} roughness={lerp(0.8, 0.1, progress)} />
      </mesh>

      {/* Lavabo */}
      <mesh position={[-1.5, 0.5, -2.2]}>
        <boxGeometry args={[1, 0.15, 0.6]} />
        <meshStandardMaterial color={fixtureColor} />
      </mesh>

      {/* Meuble sous lavabo */}
      <mesh position={[-1.5, 0, -2.2]}>
        <boxGeometry args={[1, 0.8, 0.6]} />
        <meshStandardMaterial color={lerpColor(RUIN.accent, '#3a3a3a', progress)} />
      </mesh>

      {/* Miroir */}
      <mesh position={[-1.5, 1.5, -2.45]}>
        <planeGeometry args={[0.8, 1]} />
        <meshStandardMaterial color={lerpColor('#555', '#ddeeff', progress)} metalness={lerp(0.2, 0.9, progress)} />
      </mesh>

      {/* WC */}
      <mesh position={[1.5, -0.3, 1]}>
        <boxGeometry args={[0.5, 0.7, 0.7]} />
        <meshStandardMaterial color={fixtureColor} />
      </mesh>
    </group>
  );
}
```

### Step 5.4 — Créer la scène Électricité `components/3d/scenes/ElectricityScene.tsx`
- [ ] Scène 3 : Fils apparents -> installation aux normes

**Fichier:** `components/3d/scenes/ElectricityScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function ElectricityScene({ progress }: SceneProps) {
  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, progress);
  const wireColor = lerpColor('#8B4513', '#2563eb', progress);

  return (
    <group>
      <ambientLight intensity={lerp(0.2, 0.7, progress)} />
      <directionalLight position={[3, 4, 2]} intensity={lerp(0.3, 0.9, progress)} />

      {/* Mur principal */}
      <mesh position={[0, 1, -2]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={lerpColor(RUIN.floor, RENOVATED.floor, progress)} />
      </mesh>

      {/* Fils apparents (visibles en ruine, disparaissent en rénové) */}
      {[0, 0.5, 1, 1.5, 2].map((offset, i) => (
        <mesh key={`wire-${i}`} position={[-2 + offset * 1.5, lerp(1 + Math.sin(i) * 0.3, 2.2, progress), lerp(-1.5, -1.95, progress)]}>
          <cylinderGeometry args={[0.02, 0.02, lerp(2, 0.01, progress)]} />
          <meshStandardMaterial color={wireColor} opacity={lerp(1, 0, progress)} transparent />
        </mesh>
      ))}

      {/* Tableau électrique (apparaît au rénové) */}
      <mesh position={[-2.5, 1.5, -1.9]}>
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial color={lerpColor(RUIN.dirt, '#e0e0e0', progress)} opacity={lerp(0.3, 1, progress)} transparent />
      </mesh>

      {/* Prises (apparaissent progressivement) */}
      {[-1, 0, 1, 2].map((x, i) => (
        <mesh key={`outlet-${i}`} position={[x, 0.2, -1.9]}>
          <boxGeometry args={[0.12, 0.12, 0.03]} />
          <meshStandardMaterial color={lerpColor(RUIN.wall, '#f5f5f5', progress)} opacity={lerp(0.1, 1, progress)} transparent />
        </mesh>
      ))}

      {/* Interrupteurs */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={`switch-${i}`} position={[x, 1.2, -1.9]}>
          <boxGeometry args={[0.1, 0.15, 0.03]} />
          <meshStandardMaterial color={lerpColor(RUIN.wall, '#f5f5f5', progress)} opacity={lerp(0.1, 1, progress)} transparent />
        </mesh>
      ))}

      {/* Spot lumineux (apparaît en rénové) */}
      <pointLight position={[0, 2.5, -1]} intensity={lerp(0, 1.5, progress)} color="#fff5e6" />
    </group>
  );
}
```

### Step 5.5 — Créer la scène Plomberie `components/3d/scenes/PlumbingScene.tsx`
- [ ] Scène 4 : Tuyaux rouillés -> tuyauterie neuve

**Fichier:** `components/3d/scenes/PlumbingScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function PlumbingScene({ progress }: SceneProps) {
  const pipeColor = lerpColor('#8B4513', '#c0c0c0', progress);
  const wallColor = lerpColor(RUIN.wall, RENOVATED.wall, progress);

  return (
    <group>
      <ambientLight intensity={lerp(0.3, 0.8, progress)} />
      <directionalLight position={[4, 5, 3]} intensity={lerp(0.4, 0.9, progress)} />

      {/* Mur */}
      <mesh position={[0, 1, -2]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color={lerpColor(RUIN.floor, RENOVATED.floor, progress)} />
      </mesh>

      {/* Tuyaux verticaux */}
      {[-2, -0.5, 1.5].map((x, i) => (
        <mesh key={`vpipe-${i}`} position={[x, 0.5, lerp(-1.2, -1.9, progress)]}>
          <cylinderGeometry args={[lerp(0.08, 0.04, progress), lerp(0.08, 0.04, progress), 3]} />
          <meshStandardMaterial
            color={pipeColor}
            metalness={lerp(0.3, 0.8, progress)}
            roughness={lerp(0.9, 0.2, progress)}
          />
        </mesh>
      ))}

      {/* Tuyaux horizontaux */}
      {[0, 1.5].map((y, i) => (
        <mesh key={`hpipe-${i}`} position={[0, y, lerp(-1.2, -1.9, progress)]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[lerp(0.06, 0.03, progress), lerp(0.06, 0.03, progress), 5]} />
          <meshStandardMaterial
            color={pipeColor}
            metalness={lerp(0.3, 0.8, progress)}
            roughness={lerp(0.9, 0.2, progress)}
          />
        </mesh>
      ))}

      {/* Robinet d'arrêt */}
      <mesh position={[-2, -0.5, -1.5]}>
        <sphereGeometry args={[lerp(0.15, 0.1, progress)]} />
        <meshStandardMaterial color={lerpColor('#993300', '#E50000', progress)} metalness={0.7} />
      </mesh>

      {/* Chauffe-eau (apparaît en rénové) */}
      <mesh position={[2.5, 0.5, -1.8]}>
        <cylinderGeometry args={[0.4, 0.4, 1.5]} />
        <meshStandardMaterial color={lerpColor(RUIN.dirt, '#f0f0f0', progress)} opacity={lerp(0.2, 1, progress)} transparent />
      </mesh>
    </group>
  );
}
```

### Step 5.6 — Créer la scène Carrelage `components/3d/scenes/TilingScene.tsx`
- [ ] Scène 5 : Sol abîmé -> carrelage posé

**Fichier:** `components/3d/scenes/TilingScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function TilingScene({ progress }: SceneProps) {
  const tiles: Array<{ x: number; z: number }> = [];
  for (let x = -3; x <= 3; x += 0.55) {
    for (let z = -2; z <= 2; z += 0.55) {
      tiles.push({ x, z });
    }
  }

  return (
    <group>
      <ambientLight intensity={lerp(0.4, 0.9, progress)} />
      <directionalLight position={[2, 6, 3]} intensity={lerp(0.3, 0.8, progress)} castShadow />

      {/* Mur fond */}
      <mesh position={[0, 1, -2.5]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={lerpColor(RUIN.wall, RENOVATED.wall, progress)} />
      </mesh>

      {/* Base sol (sous-couche) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={RUIN.dirt} />
      </mesh>

      {/* Carreaux individuels — montent et se colorent avec le progress */}
      {tiles.map((tile, i) => {
        const delay = (i / tiles.length) * 0.6;
        const localProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

        return (
          <mesh
            key={i}
            position={[tile.x, lerp(-1.1, -1, localProgress), tile.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.5, 0.5]} />
            <meshStandardMaterial
              color={lerpColor(RUIN.floor, i % 2 === 0 ? '#e8dfd2' : '#d4c9b8', localProgress)}
              roughness={lerp(0.95, 0.3, localProgress)}
              opacity={lerp(0.2, 1, localProgress)}
              transparent
            />
          </mesh>
        );
      })}
    </group>
  );
}
```

### Step 5.7 — Créer la scène Façade/Isolation `components/3d/scenes/FacadeScene.tsx`
- [ ] Scène 6 : Mur décrépi -> façade isolée

**Fichier:** `components/3d/scenes/FacadeScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function FacadeScene({ progress }: SceneProps) {
  const facadeColor = lerpColor('#7a6b58', '#f2efe8', progress);

  return (
    <group>
      <ambientLight intensity={lerp(0.5, 1, progress)} />
      <directionalLight position={[5, 8, 5]} intensity={lerp(0.4, 1, progress)} castShadow />
      <hemisphereLight args={['#87CEEB', '#3a5a2f', lerp(0.3, 0.6, progress)]} />

      {/* Sol / Trottoir */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={lerpColor('#666', '#999', progress)} />
      </mesh>

      {/* Mur principal (façade) */}
      <mesh position={[0, 1, -3]}>
        <boxGeometry args={[8, 6, 0.3]} />
        <meshStandardMaterial color={facadeColor} roughness={lerp(0.95, 0.5, progress)} />
      </mesh>

      {/* Couche d'isolation (apparaît avec le progress) */}
      <mesh position={[0, 1, -2.6]}>
        <boxGeometry args={[8, 6, lerp(0, 0.15, progress)]} />
        <meshStandardMaterial color="#f5e6c8" opacity={lerp(0, 0.7, progress)} transparent />
      </mesh>

      {/* Enduit final (apparaît en fin de progress) */}
      <mesh position={[0, 1, -2.4]}>
        <boxGeometry args={[8, 6, lerp(0, 0.05, progress)]} />
        <meshStandardMaterial color={lerpColor(facadeColor, RENOVATED.wall, progress)} opacity={lerp(0, 1, Math.max(0, progress * 2 - 1))} transparent />
      </mesh>

      {/* Fenêtres */}
      {[[-2, 2], [2, 2], [-2, 0], [2, 0]].map(([x, y], i) => (
        <mesh key={`win-${i}`} position={[x, y, -2.3]}>
          <boxGeometry args={[1.2, 1.4, 0.1]} />
          <meshStandardMaterial color={lerpColor('#4a3f35', '#88bbdd', progress)} metalness={lerp(0, 0.3, progress)} />
        </mesh>
      ))}

      {/* Porte d'entrée */}
      <mesh position={[0, -0.5, -2.3]}>
        <boxGeometry args={[1, 2.5, 0.12]} />
        <meshStandardMaterial color={lerpColor('#3a2a1a', RENOVATED.accent, progress)} />
      </mesh>

      {/* Toit simplifié */}
      <mesh position={[0, 4.5, -3]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[9, 0.15, 2]} />
        <meshStandardMaterial color={lerpColor('#5a4a3a', '#8B4513', progress)} />
      </mesh>
    </group>
  );
}
```

### Step 5.8 — Créer la scène Paysager `components/3d/scenes/LandscapeScene.tsx`
- [ ] Scène 7 : Terrain en friche -> jardin aménagé

**Fichier:** `components/3d/scenes/LandscapeScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function LandscapeScene({ progress }: SceneProps) {
  const grassColor = lerpColor('#5a4a2a', '#4a8c3f', progress);

  return (
    <group>
      <ambientLight intensity={lerp(0.5, 0.9, progress)} />
      <directionalLight position={[5, 8, 3]} intensity={lerp(0.5, 1.2, progress)} castShadow />
      <hemisphereLight args={['#87CEEB', grassColor, 0.5]} />

      {/* Terrain / Pelouse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={grassColor} />
      </mesh>

      {/* Allée en pierre */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`path-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -3 + i * 0.9]}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial color={lerpColor('#666', '#d4c9b8', progress)} opacity={lerp(0.2, 1, progress)} transparent />
        </mesh>
      ))}

      {/* Arbustes (sphères) */}
      {[[-3, 0], [-4, -2], [3, 1], [4, -1.5], [-2, 3]].map(([x, z], i) => (
        <mesh key={`bush-${i}`} position={[x, lerp(-0.8, 0, progress), z]}>
          <sphereGeometry args={[lerp(0.2, 0.6 + Math.random() * 0.3, progress)]} />
          <meshStandardMaterial color={lerpColor('#3a3a1a', '#2d6b1e', progress)} />
        </mesh>
      ))}

      {/* Arbre */}
      <group position={[4, 0, -2]}>
        {/* Tronc */}
        <mesh position={[0, lerp(-0.5, 0.5, progress), 0]}>
          <cylinderGeometry args={[0.15, 0.2, lerp(0.5, 2, progress)]} />
          <meshStandardMaterial color="#5a3a1a" />
        </mesh>
        {/* Feuillage */}
        <mesh position={[0, lerp(0, 2, progress), 0]}>
          <sphereGeometry args={[lerp(0.3, 1.2, progress)]} />
          <meshStandardMaterial color={lerpColor('#4a3a1a', '#1a6b1a', progress)} opacity={lerp(0.3, 1, progress)} transparent />
        </mesh>
      </group>

      {/* Clôture */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`fence-${i}`} position={[-5 + i * 1.1, lerp(-1, -0.2, progress), -4.5]}>
          <boxGeometry args={[0.08, lerp(0.2, 1.2, progress), 0.08]} />
          <meshStandardMaterial color={lerpColor('#666', '#8B6914', progress)} opacity={lerp(0.2, 1, progress)} transparent />
        </mesh>
      ))}

      {/* Terrasse */}
      <mesh position={[-2, -0.9, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 2.5]} />
        <meshStandardMaterial color={lerpColor(RUIN.dirt, '#b5956b', progress)} opacity={lerp(0.1, 1, progress)} transparent />
      </mesh>
    </group>
  );
}
```

### Step 5.9 — Créer la scène Peinture `components/3d/scenes/PaintScene.tsx`
- [ ] Scène 8 : Murs bruts -> finitions parfaites

**Fichier:** `components/3d/scenes/PaintScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function PaintScene({ progress }: SceneProps) {
  // La peinture "coule" du haut vers le bas selon le progress
  const paintProgress = progress;

  return (
    <group>
      <ambientLight intensity={lerp(0.3, 0.9, progress)} />
      <directionalLight position={[3, 5, 4]} intensity={lerp(0.4, 1, progress)} />

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={lerpColor(RUIN.floor, RENOVATED.floor, progress)} />
      </mesh>

      {/* Mur fond — partie haute (peinte selon progress) */}
      <mesh position={[0, lerp(3, 1.5, 0), -2.5]}>
        <planeGeometry args={[8, lerp(0, 5, paintProgress)]} />
        <meshStandardMaterial color={RENOVATED.wall} opacity={paintProgress} transparent />
      </mesh>

      {/* Mur fond — base brute */}
      <mesh position={[0, 1.5, -2.6]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={RUIN.wall} />
      </mesh>

      {/* Mur gauche — base */}
      <mesh position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={RUIN.wall} />
      </mesh>

      {/* Mur gauche — peint */}
      <mesh position={[-3.95, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, lerp(0, 5, paintProgress)]} />
        <meshStandardMaterial color={RENOVATED.wall} opacity={paintProgress} transparent />
      </mesh>

      {/* Rouleau de peinture (outil visible pendant la transition) */}
      <mesh position={[lerp(-3, 3, progress), lerp(3, 0, progress), -2.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color="#E50000" opacity={progress < 0.95 ? 1 : lerp(1, 0, (progress - 0.95) * 20)} transparent />
      </mesh>

      {/* Scotch / protections (visibles en milieu de transition) */}
      <mesh position={[0, -0.5, -2.4]}>
        <boxGeometry args={[8, 0.05, 0.02]} />
        <meshStandardMaterial color="#1e90ff" opacity={progress > 0.1 && progress < 0.9 ? 0.8 : 0} transparent />
      </mesh>

      {/* Plinthes (apparaissent en fin) */}
      <mesh position={[0, -1.4, -2.4]}>
        <boxGeometry args={[8, 0.15, 0.05]} />
        <meshStandardMaterial color={lerpColor(RUIN.dirt, '#f5f5f5', Math.max(0, progress * 2 - 1))} opacity={lerp(0.3, 1, progress)} transparent />
      </mesh>
    </group>
  );
}
```

### Step 5.10 — Créer la scène Borne recharge `components/3d/scenes/ChargingScene.tsx`
- [ ] Scène 9 : Garage vide -> borne installée

**Fichier:** `components/3d/scenes/ChargingScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function ChargingScene({ progress }: SceneProps) {
  const wallColor = lerpColor(RUIN.wall, '#e8e8e8', progress);

  return (
    <group>
      <ambientLight intensity={lerp(0.3, 0.7, progress)} />
      <directionalLight position={[4, 6, 4]} intensity={lerp(0.3, 0.9, progress)} />

      {/* Sol garage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color={lerpColor('#3a3a3a', '#666', progress)} roughness={lerp(0.95, 0.6, progress)} />
      </mesh>

      {/* Murs */}
      <mesh position={[0, 1.5, -4]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Borne de recharge (apparaît avec le progress) */}
      <group position={[-3, 0, -3.5]}>
        {/* Corps de la borne */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.4, 1.8, 0.25]} />
          <meshStandardMaterial color={lerpColor(RUIN.dirt, '#1a1a1a', progress)} opacity={lerp(0.1, 1, progress)} transparent />
        </mesh>
        {/* Écran */}
        <mesh position={[0, 0.8, 0.13]}>
          <planeGeometry args={[0.25, 0.2]} />
          <meshStandardMaterial
            color={lerpColor('#333', '#00ff88', progress)}
            emissive={lerpColor('#000', '#00ff44', progress)}
            emissiveIntensity={lerp(0, 0.5, progress)}
          />
        </mesh>
        {/* Câble */}
        <mesh position={[0.3, -0.2, 0.2]} rotation={[0.3, 0, 0.5]}>
          <cylinderGeometry args={[0.02, 0.02, lerp(0, 1.5, progress)]} />
          <meshStandardMaterial color="#222" opacity={lerp(0, 1, progress)} transparent />
        </mesh>
      </group>

      {/* Voiture placeholder (simple box) */}
      <group position={[0.5, -0.5, 0]}>
        {/* Carrosserie */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2, 0.8, 4]} />
          <meshStandardMaterial color={lerpColor('#555', '#2a2a2a', progress)} opacity={lerp(0.2, 0.7, progress)} transparent />
        </mesh>
        {/* Toit */}
        <mesh position={[0, 0.8, -0.3]}>
          <boxGeometry args={[1.6, 0.6, 2]} />
          <meshStandardMaterial color={lerpColor('#555', '#2a2a2a', progress)} opacity={lerp(0.2, 0.7, progress)} transparent />
        </mesh>
        {/* Roues */}
        {[[-0.9, -0.3, 1.3], [0.9, -0.3, 1.3], [-0.9, -0.3, -1.3], [0.9, -0.3, -1.3]].map(([x, y, z], i) => (
          <mesh key={`wheel-${i}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15]} />
            <meshStandardMaterial color="#111" opacity={lerp(0.2, 0.8, progress)} transparent />
          </mesh>
        ))}
      </group>

      {/* Éclairage LED (apparaît en rénové) */}
      <pointLight position={[0, 3, 0]} intensity={lerp(0, 1.5, progress)} color="#fff5e6" />
      <pointLight position={[-3, 1.5, -3]} intensity={lerp(0, 0.5, progress)} color="#00ff88" />
    </group>
  );
}
```

### Step 5.11 — Créer la scène Photovoltaïque `components/3d/scenes/SolarScene.tsx`
- [ ] Scène 10 : Toit nu -> panneaux solaires

**Fichier:** `components/3d/scenes/SolarScene.tsx`

```tsx
'use client';

import { RUIN, RENOVATED, lerpColor, lerp } from './materials';

interface SceneProps {
  progress: number;
}

export default function SolarScene({ progress }: SceneProps) {
  const roofColor = lerpColor('#6b5b4a', '#8B6B4A', progress);

  // Grille de panneaux solaires
  const panels: Array<{ x: number; z: number }> = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      panels.push({ x: -2.5 + col * 1.5, z: -1 + row * 1.2 });
    }
  }

  return (
    <group>
      <ambientLight intensity={lerp(0.5, 1, progress)} />
      <directionalLight position={[5, 10, 5]} intensity={lerp(0.5, 1.2, progress)} castShadow />
      <hemisphereLight args={['#87CEEB', '#666', 0.4]} />

      {/* Ciel (fond) */}
      <mesh position={[0, 5, -10]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color={lerpColor('#aab', '#87CEEB', progress)} />
      </mesh>

      {/* Maison — Murs */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[6, 3, 5]} />
        <meshStandardMaterial color={lerpColor(RUIN.wall, RENOVATED.wall, progress)} />
      </mesh>

      {/* Toit (incliné — simplifié en box inclinée) */}
      <mesh position={[0, 1, 0]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[7, 0.15, 6]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      {/* Panneaux solaires (apparaissent avec le progress) */}
      {panels.map((panel, i) => {
        const delay = (i / panels.length) * 0.5;
        const localProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

        return (
          <mesh
            key={`panel-${i}`}
            position={[panel.x, lerp(0.8, 1.3, localProgress), panel.z]}
            rotation={[0.25, 0, 0]}
          >
            <boxGeometry args={[1.2, 0.05, 0.9]} />
            <meshStandardMaterial
              color={lerpColor(roofColor, '#1a2744', localProgress)}
              metalness={lerp(0, 0.7, localProgress)}
              roughness={lerp(0.9, 0.2, localProgress)}
              opacity={lerp(0, 1, localProgress)}
              transparent
            />
          </mesh>
        );
      })}

      {/* Câbles / Onduleur (petit boîtier sur le mur) */}
      <mesh position={[3.1, -0.5, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.3]} />
        <meshStandardMaterial color={lerpColor(RUIN.wall, '#e0e0e0', progress)} opacity={lerp(0, 1, Math.max(0, progress * 2 - 1))} transparent />
      </mesh>

      {/* Soleil (indicateur visuel d'énergie) */}
      <mesh position={[6, 8, -5]}>
        <sphereGeometry args={[lerp(0.5, 1, progress)]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={lerp(0.2, 1.5, progress)}
        />
      </mesh>
    </group>
  );
}
```

### Step 5.12 — Créer le barrel export des scènes `components/3d/scenes/index.ts`
- [ ] Exporter toutes les scènes

**Fichier:** `components/3d/scenes/index.ts`

```ts
export { default as KitchenScene } from './KitchenScene';
export { default as BathroomScene } from './BathroomScene';
export { default as ElectricityScene } from './ElectricityScene';
export { default as PlumbingScene } from './PlumbingScene';
export { default as TilingScene } from './TilingScene';
export { default as FacadeScene } from './FacadeScene';
export { default as LandscapeScene } from './LandscapeScene';
export { default as PaintScene } from './PaintScene';
export { default as ChargingScene } from './ChargingScene';
export { default as SolarScene } from './SolarScene';
```

### Step 5.13 — Créer la map slug -> scène `components/3d/scenes/sceneMap.ts`
- [ ] Mapping entre les slugs de service et les composants scène

**Fichier:** `components/3d/scenes/sceneMap.ts`

```ts
import { ComponentType } from 'react';
import KitchenScene from './KitchenScene';
import BathroomScene from './BathroomScene';
import ElectricityScene from './ElectricityScene';
import PlumbingScene from './PlumbingScene';
import TilingScene from './TilingScene';
import FacadeScene from './FacadeScene';
import LandscapeScene from './LandscapeScene';
import PaintScene from './PaintScene';
import ChargingScene from './ChargingScene';
import SolarScene from './SolarScene';

export interface SceneConfig {
  component: ComponentType<{ progress: number }>;
  title: string;
  ruinLabel: string;
  renovatedLabel: string;
  fallbackImage: string;
}

export const SCENE_MAP: Record<string, SceneConfig> = {
  cuisine: {
    component: KitchenScene,
    title: 'Cuisine',
    ruinLabel: 'Vieille cuisine',
    renovatedLabel: 'Cuisine moderne',
    fallbackImage: '/images/fallback/cuisine.jpg',
  },
  'salle-de-bain': {
    component: BathroomScene,
    title: 'Salle de bain',
    ruinLabel: 'Carrelage cassé',
    renovatedLabel: 'Salle de bain design',
    fallbackImage: '/images/fallback/salle-de-bain.jpg',
  },
  electricite: {
    component: ElectricityScene,
    title: 'Électricité',
    ruinLabel: 'Fils apparents',
    renovatedLabel: 'Installation aux normes',
    fallbackImage: '/images/fallback/electricite.jpg',
  },
  plomberie: {
    component: PlumbingScene,
    title: 'Plomberie',
    ruinLabel: 'Tuyaux rouillés',
    renovatedLabel: 'Tuyauterie neuve',
    fallbackImage: '/images/fallback/plomberie.jpg',
  },
  carrelage: {
    component: TilingScene,
    title: 'Carrelage',
    ruinLabel: 'Sol abîmé',
    renovatedLabel: 'Carrelage posé',
    fallbackImage: '/images/fallback/carrelage.jpg',
  },
  'facade-isolation': {
    component: FacadeScene,
    title: 'Façade & Isolation',
    ruinLabel: 'Mur décrépi',
    renovatedLabel: 'Façade isolée',
    fallbackImage: '/images/fallback/facade-isolation.jpg',
  },
  paysager: {
    component: LandscapeScene,
    title: 'Aménagement paysager',
    ruinLabel: 'Terrain en friche',
    renovatedLabel: 'Jardin aménagé',
    fallbackImage: '/images/fallback/paysager.jpg',
  },
  peinture: {
    component: PaintScene,
    title: 'Peinture',
    ruinLabel: 'Murs bruts',
    renovatedLabel: 'Finitions parfaites',
    fallbackImage: '/images/fallback/peinture.jpg',
  },
  'borne-recharge': {
    component: ChargingScene,
    title: 'Borne de recharge',
    ruinLabel: 'Garage vide',
    renovatedLabel: 'Borne installée',
    fallbackImage: '/images/fallback/borne-recharge.jpg',
  },
  photovoltaique: {
    component: SolarScene,
    title: 'Photovoltaïque',
    ruinLabel: 'Toit nu',
    renovatedLabel: 'Panneaux solaires',
    fallbackImage: '/images/fallback/photovoltaique.jpg',
  },
};

/** Les 3 scènes phares pour la page d'accueil */
export const HERO_SCENES = ['cuisine', 'facade-isolation', 'paysager'] as const;
```

---

## Tâche 6 — Intégrer les 3 scènes phares dans la page d'accueil

**But:** La homepage affiche 3 scènes condensées (cuisine, façade, extérieur/paysager), chacune dans un ScrollScene de hauteur réduite (200vh au lieu de 300vh).

### Step 6.1 — Créer le composant `components/3d/HeroScenes.tsx`
- [ ] Composant d'accueil avec les 3 scènes phares

**Fichier:** `components/3d/HeroScenes.tsx`

```tsx
'use client';

import { HERO_SCENES, SCENE_MAP } from './scenes/sceneMap';
import ScrollScene from './ScrollScene';
import GPUFallback from './GPUFallback';
import useGPUDetect from './hooks/useGPUDetect';

export default function HeroScenes() {
  const { isLowEnd } = useGPUDetect();

  if (isLowEnd) {
    return (
      <div className="space-y-0">
        {HERO_SCENES.map((slug) => {
          const config = SCENE_MAP[slug];
          return (
            <GPUFallback
              key={slug}
              title={config.title}
              ruinLabel={config.ruinLabel}
              renovatedLabel={config.renovatedLabel}
              fallbackImage={config.fallbackImage}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {HERO_SCENES.map((slug) => {
        const config = SCENE_MAP[slug];
        const SceneComponent = config.component;

        return (
          <section key={slug} className="relative">
            {/* Labels de transition */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <p className="text-white/60 text-sm font-mono">{config.ruinLabel}</p>
            </div>
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
              <p className="text-white/60 text-sm font-mono">{config.renovatedLabel}</p>
            </div>

            <ScrollScene
              scrollHeight="200vh"
              canvasHeight="100vh"
              id={`hero-${slug}`}
            >
              {(progress) => <SceneComponent progress={progress} />}
            </ScrollScene>
          </section>
        );
      })}
    </div>
  );
}
```

### Step 6.2 — Intégrer HeroScenes dans la page d'accueil
- [ ] Modifier `app/page.tsx` (ou `app/(main)/page.tsx` selon la structure de Plan 1)

Ajouter dans la page d'accueil, après la section hero statique et avant la section services :

```tsx
// Ajouter l'import
import HeroScenes from '@/components/3d/HeroScenes';

// Dans le JSX, ajouter la section 3D :
<section id="transformation-3d" aria-label="Nos transformations en 3D">
  <HeroScenes />
</section>
```

**Note :** L'emplacement exact dépend de la structure HTML créée par Plan 1. L'insérer dans la zone principale de scroll, typiquement après le hero banner et avant la grille de services.

---

## Tâche 7 — Intégrer les scènes dans les pages service [slug]

**But:** Chaque page `/services/[slug]` affiche sa scène 3D complète en pleine page avec un scroll de 300vh.

### Step 7.1 — Créer le composant `components/3d/ServiceScene.tsx`
- [ ] Composant générique qui charge la bonne scène selon le slug

**Fichier:** `components/3d/ServiceScene.tsx`

```tsx
'use client';

import { SCENE_MAP } from './scenes/sceneMap';
import ScrollScene from './ScrollScene';
import GPUFallback from './GPUFallback';
import useGPUDetect from './hooks/useGPUDetect';

interface ServiceSceneProps {
  slug: string;
}

export default function ServiceScene({ slug }: ServiceSceneProps) {
  const config = SCENE_MAP[slug];
  const { isLowEnd } = useGPUDetect();

  if (!config) {
    return null;
  }

  if (isLowEnd) {
    return (
      <GPUFallback
        title={config.title}
        ruinLabel={config.ruinLabel}
        renovatedLabel={config.renovatedLabel}
        fallbackImage={config.fallbackImage}
      />
    );
  }

  const SceneComponent = config.component;

  return (
    <section className="relative" aria-label={`Transformation 3D : ${config.title}`}>
      {/* Indicateur de scroll */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <p className="text-white/80 text-lg font-semibold mb-1">
          {config.title}
        </p>
        <p className="text-white/50 text-sm">
          Scrollez pour voir la transformation
        </p>
        <div className="mt-3 w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
          <div className="w-1.5 h-3 bg-[#E50000] rounded-full mt-1.5 animate-bounce" />
        </div>
      </div>

      {/* Labels ruine / rénové */}
      <div className="absolute top-20 left-6 z-10 pointer-events-none">
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider">{config.ruinLabel}</p>
      </div>
      <div className="absolute top-20 right-6 z-10 pointer-events-none">
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider">{config.renovatedLabel}</p>
      </div>

      <ScrollScene
        scrollHeight="300vh"
        canvasHeight="100vh"
        id={`service-${slug}`}
      >
        {(progress) => <SceneComponent progress={progress} />}
      </ScrollScene>
    </section>
  );
}
```

### Step 7.2 — Intégrer ServiceScene dans la page dynamique [slug]
- [ ] Modifier `app/services/[slug]/page.tsx` (ou selon la structure Plan 1)

Ajouter dans la page service, typiquement en haut avant le contenu textuel :

```tsx
// Ajouter l'import
import ServiceScene from '@/components/3d/ServiceScene';

// Dans le composant page, récupérer le slug depuis les params :
// export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;

// Ajouter dans le JSX, en haut de la page :
<ServiceScene slug={slug} />
```

**Note :** Adapter selon la signature exacte du composant page créé par Plan 1. En Next.js 16 App Router, `params` est une Promise.

---

## Tâche 8 — Détection GPU + fallback images

**But:** Détecter les GPU faibles ou l'absence de WebGL et afficher des images statiques à la place des scènes 3D.

### Step 8.1 — Créer le hook `components/3d/hooks/useGPUDetect.ts`
- [ ] Hook de détection GPU

**Fichier:** `components/3d/hooks/useGPUDetect.ts`

```ts
'use client';

import { useState, useEffect } from 'react';

interface GPUInfo {
  isLowEnd: boolean;
  renderer: string;
  vendor: string;
  hasWebGL: boolean;
}

const LOW_END_KEYWORDS = [
  'swiftshader',
  'llvmpipe',
  'software',
  'microsoft basic',
  'vmware',
  'virtualbox',
];

export default function useGPUDetect(): GPUInfo {
  const [gpuInfo, setGPUInfo] = useState<GPUInfo>({
    isLowEnd: false,
    renderer: '',
    vendor: '',
    hasWebGL: true,
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

      if (!gl) {
        setGPUInfo({ isLowEnd: true, renderer: 'none', vendor: 'none', hasWebGL: false });
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : 'unknown';
      const vendor = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : 'unknown';

      const rendererLower = renderer.toLowerCase();
      const isLowEnd = LOW_END_KEYWORDS.some((kw) => rendererLower.includes(kw));

      // Check for mobile with limited GPU
      const isMobileWithLowRAM =
        /Android|iPhone|iPad/.test(navigator.userAgent) &&
        (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
        ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4) < 4;

      setGPUInfo({
        isLowEnd: isLowEnd || isMobileWithLowRAM,
        renderer,
        vendor,
        hasWebGL: true,
      });

      // Cleanup
      const loseContext = gl.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
    } catch {
      setGPUInfo({ isLowEnd: true, renderer: 'error', vendor: 'error', hasWebGL: false });
    }
  }, []);

  return gpuInfo;
}
```

### Step 8.2 — Créer le composant fallback `components/3d/GPUFallback.tsx`
- [ ] Composant qui affiche une image statique avec les labels de transition

**Fichier:** `components/3d/GPUFallback.tsx`

```tsx
'use client';

import Image from 'next/image';

interface GPUFallbackProps {
  title: string;
  ruinLabel: string;
  renovatedLabel: string;
  fallbackImage: string;
}

export default function GPUFallback({
  title,
  ruinLabel,
  renovatedLabel,
  fallbackImage,
}: GPUFallbackProps) {
  return (
    <div className="relative w-full h-[70vh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <Image
        src={fallbackImage}
        alt={`${title} — ${ruinLabel} vers ${renovatedLabel}`}
        fill
        className="object-cover opacity-60"
        sizes="100vw"
        loading="lazy"
        // Placeholder en cas d'image manquante
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />

      {/* Contenu */}
      <div className="relative z-10 text-center px-6">
        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-white/50 font-mono">{ruinLabel}</span>
          <div className="w-16 h-0.5 bg-[#E50000]" />
          <span className="text-white/80 font-mono">{renovatedLabel}</span>
        </div>
      </div>
    </div>
  );
}
```

### Step 8.3 — Créer les images fallback placeholder
- [ ] Créer le dossier et les fichiers placeholder SVG

```bash
mkdir -p /Users/Aiman/aiman-renovation/public/images/fallback
```

Puis créer un script pour générer des placeholders SVG pour chaque service :

**Fichier:** `scripts/generate-fallback-placeholders.sh`

```bash
#!/bin/bash
# Génère des images SVG placeholder pour le fallback 3D

FALLBACK_DIR="/Users/Aiman/aiman-renovation/public/images/fallback"
mkdir -p "$FALLBACK_DIR"

SERVICES=("cuisine" "salle-de-bain" "electricite" "plomberie" "carrelage" "facade-isolation" "paysager" "peinture" "borne-recharge" "photovoltaique")
TITLES=("Cuisine" "Salle de bain" "Électricité" "Plomberie" "Carrelage" "Façade & Isolation" "Paysager" "Peinture" "Borne recharge" "Photovoltaïque")

for i in "${!SERVICES[@]}"; do
  slug="${SERVICES[$i]}"
  title="${TITLES[$i]}"
  cat > "$FALLBACK_DIR/$slug.svg" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0A0A0A"/>
  <rect x="0" y="0" width="1920" height="1080" fill="url(#grad)" opacity="0.3"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E50000;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#0A0A0A;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <text x="960" y="520" font-family="Arial,sans-serif" font-size="48" fill="white" text-anchor="middle" opacity="0.8">$title</text>
  <text x="960" y="580" font-family="Arial,sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.4">De la ruine au rêve</text>
  <line x1="860" y1="550" x2="1060" y2="550" stroke="#E50000" stroke-width="2"/>
</svg>
SVGEOF
done

echo "Fallback SVG placeholders generated in $FALLBACK_DIR"
```

Exécuter :

```bash
chmod +x /Users/Aiman/aiman-renovation/scripts/generate-fallback-placeholders.sh
bash /Users/Aiman/aiman-renovation/scripts/generate-fallback-placeholders.sh
```

**Note :** Mettre à jour `sceneMap.ts` pour utiliser `.svg` au lieu de `.jpg` tant que les vraies images ne sont pas disponibles. Ou bien, modifier le `fallbackImage` dans `sceneMap.ts` :

Dans `components/3d/scenes/sceneMap.ts`, remplacer toutes les extensions `.jpg` par `.svg` :

```
fallbackImage: '/images/fallback/cuisine.svg',
// ... etc pour chaque service
```

### Step 8.4 — Mettre à jour le barrel export principal
- [ ] Ajouter les nouveaux composants au barrel export

**Fichier:** `components/3d/index.ts` (contenu final)

```ts
export { default as SceneCanvas } from './SceneCanvas';
export { default as SceneLoader } from './SceneLoader';
export { default as ScrollScene } from './ScrollScene';
export { default as HeroScenes } from './HeroScenes';
export { default as ServiceScene } from './ServiceScene';
export { default as GPUFallback } from './GPUFallback';
export { default as useScrollProgress } from './hooks/useScrollProgress';
export { default as useGPUDetect } from './hooks/useGPUDetect';
export { SCENE_MAP, HERO_SCENES } from './scenes/sceneMap';
```

---

## Tâche 9 — Build + Vérification

**But:** S'assurer que tout compile, pas d'erreurs TypeScript, et que le site fonctionne.

### Step 9.1 — Vérifier la structure des fichiers
- [ ] Lister les fichiers créés

```bash
find /Users/Aiman/aiman-renovation/components/3d -type f | sort
```

Résultat attendu :

```
components/3d/GPUFallback.tsx
components/3d/HeroScenes.tsx
components/3d/SceneCanvas.tsx
components/3d/SceneLoader.tsx
components/3d/ScrollScene.tsx
components/3d/ServiceScene.tsx
components/3d/hooks/useGPUDetect.ts
components/3d/hooks/useScrollProgress.ts
components/3d/index.ts
components/3d/providers/SmoothScrollProvider.tsx
components/3d/providers/index.ts
components/3d/scenes/BathroomScene.tsx
components/3d/scenes/ChargingScene.tsx
components/3d/scenes/ElectricityScene.tsx
components/3d/scenes/FacadeScene.tsx
components/3d/scenes/KitchenScene.tsx
components/3d/scenes/LandscapeScene.tsx
components/3d/scenes/PaintScene.tsx
components/3d/scenes/PlumbingScene.tsx
components/3d/scenes/SolarScene.tsx
components/3d/scenes/TilingScene.tsx
components/3d/scenes/index.ts
components/3d/scenes/materials.ts
components/3d/scenes/sceneMap.ts
```

### Step 9.2 — Vérifier TypeScript
- [ ] Lancer la vérification de types

```bash
cd /Users/Aiman/aiman-renovation && npx tsc --noEmit
```

Corriger toute erreur de type signalée.

### Step 9.3 — Lancer le build Next.js
- [ ] Build production

```bash
cd /Users/Aiman/aiman-renovation && npm run build
```

### Step 9.4 — Tester en local
- [ ] Démarrer le serveur de développement et vérifier manuellement

```bash
cd /Users/Aiman/aiman-renovation && npm run dev
```

Vérifications manuelles :
1. Page d'accueil : les 3 scènes phares s'affichent et répondent au scroll
2. Pages service : naviguer vers `/services/cuisine`, `/services/facade-isolation`, etc. — la scène 3D se charge
3. Performance : vérifier dans les DevTools que le Canvas ne cause pas de lag
4. Fallback : dans les DevTools, émuler un GPU faible (throttle CPU) ou bloquer WebGL — vérifier que les images fallback s'affichent

### Step 9.5 — Corriger les éventuels problèmes
- [ ] Si des erreurs surviennent, les corriger et relancer le build

Points de vigilance courants :
- `'use client'` manquant sur un composant qui utilise des hooks
- Import de Three.js dans un Server Component (interdit)
- Canvas R3F qui ne se monte pas en SSR (doit être client-only)
- GSAP ScrollTrigger qui ne trouve pas l'élément trigger (timing)

---

## Arborescence finale des fichiers créés

```
components/3d/
├── GPUFallback.tsx              # Fallback image pour GPU faibles
├── HeroScenes.tsx               # 3 scènes phares pour l'accueil
├── SceneCanvas.tsx              # Wrapper Canvas R3F + Suspense + lazy
├── SceneLoader.tsx              # Loader de progression 3D
├── ScrollScene.tsx              # Liaison scroll ↔ animation 3D
├── ServiceScene.tsx             # Scène complète par slug de service
├── index.ts                     # Barrel export principal
├── hooks/
│   ├── useGPUDetect.ts          # Détection GPU faible / WebGL
│   └── useScrollProgress.ts     # Hook progress 0-1 via ScrollTrigger
├── providers/
│   ├── SmoothScrollProvider.tsx  # Lenis + GSAP smooth scroll
│   └── index.ts
└── scenes/
    ├── BathroomScene.tsx         # Salle de bain
    ├── ChargingScene.tsx         # Borne recharge
    ├── ElectricityScene.tsx      # Électricité
    ├── FacadeScene.tsx           # Façade / isolation
    ├── KitchenScene.tsx          # Cuisine
    ├── LandscapeScene.tsx        # Paysager
    ├── PaintScene.tsx            # Peinture
    ├── PlumbingScene.tsx         # Plomberie
    ├── SolarScene.tsx            # Photovoltaïque
    ├── TilingScene.tsx           # Carrelage
    ├── index.ts                  # Barrel export scènes
    ├── materials.ts              # Couleurs + utilitaires lerp
    └── sceneMap.ts               # Map slug → config scène

public/images/fallback/
├── cuisine.svg
├── salle-de-bain.svg
├── electricite.svg
├── plomberie.svg
├── carrelage.svg
├── facade-isolation.svg
├── paysager.svg
├── peinture.svg
├── borne-recharge.svg
└── photovoltaique.svg

scripts/
└── generate-fallback-placeholders.sh
```

## Dépendances entre Plans

| Fichier modifié | Plan responsable | Action Plan 2 |
|---|---|---|
| `app/layout.tsx` | Plan 1 crée | Plan 2 ajoute `SmoothScrollProvider` |
| `app/page.tsx` | Plan 1 crée | Plan 2 ajoute `<HeroScenes />` |
| `app/services/[slug]/page.tsx` | Plan 1 crée | Plan 2 ajoute `<ServiceScene slug={slug} />` |
| `components/3d/**` | Plan 2 crée | Exclusif à Plan 2 |
| `public/images/fallback/**` | Plan 2 crée | Exclusif à Plan 2 |

## Notes pour l'évolution future

1. **Modèles GLB** : Remplacer les géométries primitives par des modèles GLB via `useGLTF` de drei. Chaque scène n'aura qu'à changer les `<mesh>` par des `<primitive object={gltf.scene}>`.
2. **Animations avancées** : Ajouter des morph targets dans les GLB pour des transitions plus fluides.
3. **Post-processing** : Ajouter `@react-three/postprocessing` pour bloom, vignette, etc.
4. **Son** : Ajouter des effets sonores subtils liés au progress (ex: bruit de perceuse, eau).
5. **Accessibilité** : Ajouter `prefers-reduced-motion` pour désactiver les animations scroll.
