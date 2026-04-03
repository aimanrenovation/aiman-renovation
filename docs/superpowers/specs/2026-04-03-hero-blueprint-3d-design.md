# Hero Blueprint 3D — Aiman Renovation

## Concept

Le hero de la homepage est remplace par une scene Three.js plein ecran. Un plan 2D blueprint d'un sejour/salle a manger avec cuisine ouverte se transforme progressivement en piece 3D renovee, pilote par le scroll. Chaque etape du scroll revele un corps de metier.

## Sequence d'animation (7 phases, scroll-driven)

| Phase | Scroll % | Description |
|-------|----------|-------------|
| 1 — Blueprint | 0-15% | Plan 2D flat, lignes blanches sur fond sombre, cotes et labels ("Sejour", "Cuisine") |
| 2 — Extrusion | 15-25% | Les murs se levent, camera bascule de top-down vers perspective 3D. Structure brute, beton/platre |
| 3 — Electricite | 25-40% | Gaines et fils apparaissent dans les murs (lignes colorees rouge/bleu), tableaux electriques |
| 4 — Plomberie | 40-55% | Tuyaux cuivre/PVC visibles, raccords cuisine et evier |
| 5 — Sol | 55-70% | Parquet se pose lame par lame (sejour), carrelage dans la cuisine |
| 6 — Peinture | 70-85% | Murs se colorent progressivement du bas vers le haut, blanc/gris clair |
| 7 — Fini | 85-100% | Meubles et luminaires apparaissent, eclairage final chaud. Piece renovee complete |

## Stack technique

- **React Three Fiber** (`@react-three/fiber`) + **Drei** (`@react-three/drei`) — scene 3D dans React
- **GSAP ScrollTrigger** — lie la progression de l'animation au scroll via un hook `useScrollPhase`
- **Lenis** — smooth scroll deja en place sur le site
- **Geometries procedurales** — murs, sols, tuyaux, fils construits en code (pas de fichiers .glb)
- **Shaders/materiaux custom** — effet blueprint (lignes techniques) et transitions de materiaux

## Architecture composants

```
components/
  sections/
    hero-blueprint/
      HeroBlueprint.tsx        — conteneur principal, setup scroll + overlay texte
      BlueprintScene.tsx       — Canvas R3F, camera, lumieres
      FloorPlan.tsx            — lignes 2D du plan (phase 1)
      Walls.tsx                — murs extrudes (phase 2)
      Electrical.tsx           — fils et gaines (phase 3)
      Plumbing.tsx             — tuyaux (phase 4)
      Flooring.tsx             — parquet + carrelage (phase 5)
      Paint.tsx                — animation peinture murs (phase 6)
      Furniture.tsx            — meubles finaux (phase 7)
      materials.ts             — materiaux partages (blueprint, beton, bois, etc.)
      useScrollPhase.ts        — hook: GSAP ScrollTrigger → progression 0-1
```

### Responsabilites des composants

**HeroBlueprint.tsx** (client component)
- Div conteneur `h-[500vh]` pour creer l'espace de scroll
- Position sticky pour le canvas 3D
- Overlay texte avec opacite liee a la phase active
- Initialise GSAP ScrollTrigger

**BlueprintScene.tsx**
- `<Canvas>` React Three Fiber
- Camera orthographique (phase 1) qui transite vers perspective (phase 2+)
- Lumieres : ambient + directional, intensite liee a la progression
- Recoit `progress` (0-1) et le passe aux enfants

**FloorPlan.tsx**
- Lignes 2D avec `<Line>` de Drei
- Plan du sejour/SAM/cuisine ouverte : ~12m x 8m
- Labels texte avec `<Text>` de Drei
- Opacite diminue quand progress > 0.15

**Walls.tsx**
- `BoxGeometry` pour chaque segment de mur
- Hauteur animee de 0 a 2.5m entre progress 0.15 et 0.25
- Materiau beton/platre (gris clair, rugueux)

**Electrical.tsx**
- `TubeGeometry` le long de chemins predefinies dans les murs
- Couleur rouge (phase) et bleu (neutre)
- Apparition progressive avec `drawRange` ou clip shader
- Visible entre progress 0.25 et fin

**Plumbing.tsx**
- `TubeGeometry` plus epais, couleur cuivre
- Chemins : arrive d'eau cuisine, evacuation evier
- Apparition progressive entre 0.40 et 0.55

**Flooring.tsx**
- Grille de `PlaneGeometry` pour les lames de parquet (sejour)
- Grille carrelee pour la cuisine
- Chaque lame/carreau apparait sequentiellement (wave effect)

**Paint.tsx**
- Shader custom sur les murs : `uniform float paintProgress`
- La couleur du mur transite de beton gris vers blanc/couleur finale
- Progression du bas vers le haut du mur

**Furniture.tsx**
- Geometries simples et stylisees (BoxGeometry, CylinderGeometry)
- Canape, table, chaises, ilot cuisine, luminaires
- Apparition avec scale de 0 a 1 (pop-in)
- Eclairage warm qui monte en intensite

**materials.ts**
- `blueprintMaterial` : MeshBasicMaterial bleu/blanc, wireframe-like
- `concreteMaterial` : MeshStandardMaterial gris, roughness 0.9
- `woodMaterial` : MeshStandardMaterial brun, roughness 0.7
- `tileMaterial` : MeshStandardMaterial blanc, roughness 0.3
- `paintMaterial` : ShaderMaterial custom avec uniform de progression

**useScrollPhase.ts**
- Cree un GSAP ScrollTrigger sur le conteneur
- Retourne `progress` (0-1) comme ref ou state
- Calcule aussi `phase` (1-7) et `phaseProgress` (0-1 dans la phase)

## Overlay texte par phase

| Phase | Texte |
|-------|-------|
| 1 | "Votre projet commence ici" |
| 2 | "Structure & gros oeuvre" |
| 3 | "Electricite aux normes" |
| 4 | "Plomberie & raccordements" |
| 5 | "Revetements de sol" |
| 6 | "Finitions & peinture" |
| 7 | "Pret a vivre" |

Texte en `font-heading`, blanc, avec fond semi-transparent. Apparition/disparition en fondu avec la phase.

## Plan de la piece (dimensions)

```
+--------------------------------------------------+
|                                                  |
|    CUISINE          |     SEJOUR / SAM           |
|    (4m x 3m)        |     (8m x 5m)              |
|                     |                            |
|   [ilot]            |   [canape]                 |
|   [evier]           |   [table + chaises]        |
|                     |                            |
+---------------------+                            |
                      |                            |
                      +----------------------------+
```

Murs exterieurs : 12m x 8m environ. Separation partielle cuisine/sejour (muret ou ilot).

## Style visuel

- **Blueprint** : fond noir (#0A0A0A), lignes blanc/bleu clair (#4A9EFF), police mono pour cotes
- **Construction** : gris beton (#8B8B8B), platre (#D4CBC2)
- **Electricite** : rouge (#E50000), bleu (#4A9EFF)
- **Plomberie** : cuivre (#B87333)
- **Sol parquet** : brun chaud (#8B6914)
- **Sol carrelage** : blanc casse (#F0EDE8)
- **Peinture finale** : blanc (#F5F5F5), accent gris (#E0E0E0)
- **Eclairage final** : warm (color temperature ~3200K)

## Performance

- Geometries procedurales uniquement, pas de fichiers 3D externes
- Pas de textures bitmap — tout en couleurs/shaders
- Lazy load du Canvas avec `React.lazy` + `Suspense`
- Instanced meshes pour les elements repetitifs (lames de parquet, carreaux)
- Target : < 200KB JS additionnel compresse
- 60fps sur MacBook Air M1, 30fps minimum sur mobile milieu de gamme

## Mobile (< 768px)

- Geometries simplifiees : moins de lames de parquet, meubles plus simples
- Memes 7 phases, meme scroll behavior
- Si `navigator.gpu` absent et WebGL1 seulement : fallback image statique du blueprint + image finale
- Hauteur de scroll reduite a `h-[400vh]`

## Integration dans le site

- Remplace le composant `<Hero />` dans `app/page.tsx`
- Le composant suivant (`<SavoirFaire />`) commence apres la zone de scroll
- Le logo et la nav restent visibles par-dessus (z-index superieur)
- Fond noir du hero se fond naturellement avec le design existant du site

## Fallback et accessibilite

- `<noscript>` : image statique du blueprint
- `aria-label` sur le conteneur : "Animation 3D montrant les etapes de renovation d'un sejour"
- `prefers-reduced-motion` : affiche directement l'etat final sans animation
- Loading : spinner ou skeleton pendant le chargement du canvas
