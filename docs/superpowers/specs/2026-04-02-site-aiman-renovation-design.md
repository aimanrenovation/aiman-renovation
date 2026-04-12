# Site Internet aiman-renovation.fr — Design Spec

## Résumé

Site vitrine 3D scroll-driven pour **Aiman Renovation**, entreprise de rénovation second oeuvre basée à Saint-Louis (68300). Le concept central : chaque spécialité est illustrée par une scène 3D où le scroll pilote la transformation d'un espace dégradé vers son état rénové — "De la ruine au rêve".

Le site cible trois audiences : particuliers propriétaires, copropriétés/syndics, et professionnels.

## Identité visuelle

### Couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#E50000` | Couleur primaire, CTA, accents |
| `--black` | `#0A0A0A` | Fonds hero, sections 3D |
| `--white` | `#FFFFFF` | Texte sur fond sombre, fonds clairs |
| `--blue-france` | `#002B7F` | Tricolore, accents secondaires |
| `--red-france` | `#CE1126` | Tricolore |
| `--gray-900` | `#111111` | Fond sections alternées |
| `--gray-400` | `#9CA3AF` | Texte secondaire |

### Typographie

| Usage | Police | Poids |
|-------|--------|-------|
| Titres / hero | Archivo Black | 900 |
| Sous-titres | Inter | 700 |
| Corps | Inter | 400 |
| Boutons / CTA | Inter | 600-700 |

### Logo

Logo existant sur Canva (ID: `DAEtEjkEGvA`) : lettre "A" stylisée en forme de maison (bleu + rouge) + "AIMAN RENOVATION" avec trait tricolore. Deux versions : fond clair (logo couleur) et fond sombre (logo blanc).

### Slogan

"Nous rénovons jusqu'au bout de vos rêves !"

## Architecture des pages

### Pages principales

1. **Accueil** (`/`)
   - Hero 3D immersif (fond noir, titre massif, CTA rouge)
   - 2-3 scènes 3D phares au scroll (cuisine, façade, extérieur)
   - Section confiance (chiffres : 19 ans, +50 projets, Saint-Louis)
   - Témoignages clients
   - CTA devis gratuit

2. **Services** (`/services`)
   - Vue d'ensemble des 10 spécialités avec visuels
   - Liens vers chaque page service dédiée

3. **Pages service dédiées** (10 pages) — Chacune avec sa scène 3D scroll-driven :
   - `/services/cuisine` — Vieille cuisine → cuisine moderne équipée
   - `/services/salle-de-bain` — Carrelage cassé → salle de bain design
   - `/services/electricite` — Fils apparents → installation aux normes
   - `/services/plomberie` — Tuyaux rouillés → tuyauterie neuve
   - `/services/carrelage` — Sol abîmé → carrelage posé
   - `/services/facade-isolation` — Mur décrépi → façade isolée enduite
   - `/services/paysager` — Terrain en friche → jardin aménagé
   - `/services/peinture-finitions` — Murs bruts → finitions parfaites
   - `/services/borne-recharge` — Garage vide → borne IRVE installée
   - `/services/panneaux-photovoltaiques` — Toit nu → panneaux solaires

   Structure commune de chaque page service :
   - Scène 3D scroll-driven (ruine → rénové)
   - Description du service
   - Étapes du processus
   - Galerie avant/après
   - CTA devis

### Pages secondaires

4. **Réalisations** (`/realisations`)
   - Galerie filtrable par type de service
   - Avant/après avec slider
   - Images générées par IA

5. **À propos** (`/a-propos`)
   - Histoire d'Aiman Renovation (19 ans d'expérience)
   - Valeurs (qualité, transparence, engagement)
   - Zone d'intervention (Saint-Louis et environs, 68)
   - Certifications / assurances

6. **Devis** (`/devis`)
   - Formulaire multi-étapes guidé (détail ci-dessous)

7. **Contact** (`/contact`)
   - Coordonnées : 03 56 89 44 03 / 09 39 24 55 15
   - Email : contact@aiman-renovation.fr
   - Adresse : 14 rue de la Paix, 68300 Saint-Louis
   - Carte interactive (Google Maps embed)
   - Horaires

8. **FAQ** (`/faq`)
   - Questions fréquentes organisées par thème
   - Schema markup FAQ pour le SEO

## Formulaire de devis 3D immersif

Le formulaire de devis EST une expérience 3D. Le client interagit avec une maison 3D pour construire sa demande.

### Étapes

1. **Choix de la zone** — Une maison 3D apparaît. Le client clique sur la zone à rénover (cuisine, salle de bain, façade, toit, garage, extérieur...). La caméra zoome vers la zone sélectionnée. Possibilité de sélectionner plusieurs zones.
2. **État actuel** — La zone apparaît en état dégradé. Le client sélectionne les problèmes visibles en cliquant sur les éléments 3D (murs fissurés, carrelage cassé, fils apparents, tuyaux rouillés...). Des labels flottants identifient chaque élément cliquable.
3. **Résultat souhaité** — La zone se rénove progressivement avec les options que le client active (nouveau carrelage, peinture, isolation, nouveau mobilier...). Chaque option cochée déclenche une animation de transformation.
4. **Surface et budget** — Formulaire UI intégré dans la scène 3D (panneau flottant). Surface en m², fourchette budget.
5. **Photos et coordonnées** — Upload photos de l'existant + nom, téléphone, email, adresse du chantier. Panneau UI flottant dans la scène.
6. **Récap avant/après** — Vue split-screen 3D : à gauche l'état initial sélectionné, à droite le résultat configuré. Animation de transition. Bouton "Envoyer ma demande".

### Fallback mobile/GPU faible

Sur appareils peu performants, le formulaire bascule en mode 2D avec des illustrations avant/après statiques et un wizard classique shadcn/ui.

### Traitement

- Envoi email récapitulatif via Resend (au client + à Aiman Renovation)
- Connexion future avec Jarvis (webhook ou API) pour injection automatique dans le protocole devis

## Concept 3D — "De la ruine au rêve"

### Principe

Chaque page service contient une scène 3D (canvas WebGL) qui occupe le viewport. Le scroll de l'utilisateur contrôle la progression de la rénovation : en haut de la page, l'espace est dégradé/en ruine ; en bas, la rénovation est terminée.

### Architecture technique 3D

- **React Three Fiber** (@react-three/fiber) — Three.js dans React
- **@react-three/drei** — Helpers (Environment, ContactShadows, useGLTF, useProgress)
- **GSAP + ScrollTrigger** — Liaison scroll ↔ progression animation
- **Lenis** — Smooth scroll synchronisé avec GSAP

### Approche d'animation

Deux approches possibles par scène (à déterminer par spécialité) :

1. **Morph targets** — Un modèle 3D avec des shape keys (état ruine → état rénové). Le scroll interpole entre les deux états.
2. **Animation séquentielle** — Plusieurs objets 3D qui apparaissent/se positionnent au fur et à mesure du scroll (ex: mur → isolation → enduit → peinture).

### Modèles 3D

- Format : glTF / GLB (standard web)
- Source : modélisation Blender ou achat sur Sketchfab/CGTrader
- Optimisation : draco compression, LOD, lazy loading par page
- Fallback : pour les appareils peu performants, afficher des images statiques avant/après avec un slider

### Scènes phares (accueil)

3 scènes condensées sur la page d'accueil :
1. **Cuisine** — La plus parlante pour les particuliers
2. **Façade/Isolation** — Parlante pour copropriétés
3. **Extérieur/Paysager** — Visuellement impressionnante

### Performance

- Lazy loading des scènes 3D (chargement au scroll vers la section)
- Suspense + fallback pendant le chargement des modèles
- `useProgress` pour barre de chargement
- Détection GPU faible → fallback images statiques
- Preload des modèles de la page d'accueil, lazy pour les sous-pages

## Stack technique

### Frontend

| Package | Rôle |
|---------|------|
| Next.js 16 | Framework, App Router, SSR, SEO |
| React 19 | UI |
| TypeScript | Typage |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Composants UI (formulaire, navigation, cards) |
| @react-three/fiber | Three.js dans React |
| @react-three/drei | Helpers 3D |
| three | Moteur 3D |
| gsap + ScrollTrigger | Animations scroll-driven |
| lenis | Smooth scroll |
| framer-motion | Animations UI (transitions pages, hover) |
| resend | Envoi emails devis |

### Hébergement

- **Vercel** — Déploiement, Edge, optimisation images, analytics
- **IONOS** — Domaine `aiman-renovation.fr` → DNS pointé vers Vercel

### SEO

- Metadata dynamique par page (`generateMetadata`)
- Schema markup : LocalBusiness, Service, FAQ
- Sitemap automatique
- robots.txt
- Open Graph images par page
- Balises alt sur toutes les images

## Structure du projet

```
aiman-renovation/
├── app/
│   ├── layout.tsx              # Layout global (nav, footer, smooth scroll)
│   ├── page.tsx                # Accueil
│   ├── services/
│   │   ├── page.tsx            # Vue d'ensemble services
│   │   ├── cuisine/page.tsx
│   │   ├── salle-de-bain/page.tsx
│   │   ├── electricite/page.tsx
│   │   ├── plomberie/page.tsx
│   │   ├── carrelage/page.tsx
│   │   ├── facade-isolation/page.tsx
│   │   ├── paysager/page.tsx
│   │   ├── peinture-finitions/page.tsx
│   │   ├── borne-recharge/page.tsx
│   │   └── panneaux-photovoltaiques/page.tsx
│   ├── realisations/page.tsx
│   ├── a-propos/page.tsx
│   ├── devis/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   └── api/
│       └── devis/route.ts      # Endpoint envoi email devis
├── components/
│   ├── ui/                     # shadcn/ui
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── smooth-scroll.tsx
│   ├── 3d/
│   │   ├── scene-wrapper.tsx   # Wrapper R3F + Suspense + fallback
│   │   ├── scroll-scene.tsx    # Logique scroll ↔ GSAP ↔ animation
│   │   ├── scenes/
│   │   │   ├── cuisine.tsx
│   │   │   ├── salle-de-bain.tsx
│   │   │   ├── electricite.tsx
│   │   │   ├── plomberie.tsx
│   │   │   ├── carrelage.tsx
│   │   │   ├── facade.tsx
│   │   │   ├── paysager.tsx
│   │   │   ├── peinture.tsx
│   │   │   ├── borne-recharge.tsx
│   │   │   └── photovoltaique.tsx
│   │   └── fallback-image.tsx  # Fallback GPU faible
│   ├── devis/
│   │   ├── devis-wizard.tsx    # Orchestrateur multi-étapes
│   │   ├── step-type.tsx
│   │   ├── step-details.tsx
│   │   ├── step-surface.tsx
│   │   ├── step-photos.tsx
│   │   ├── step-contact.tsx
│   │   └── step-confirm.tsx
│   └── sections/
│       ├── hero.tsx
│       ├── trust-bar.tsx
│       ├── testimonials.tsx
│       └── cta-banner.tsx
├── lib/
│   ├── email.ts                # Config Resend
│   └── constants.ts            # Services, coordonnées, etc.
├── public/
│   ├── models/                 # Fichiers GLB/glTF
│   ├── images/                 # Images IA générées
│   └── logo/                   # Logo variations
└── next.config.ts
```

## Coordonnées intégrées

- **Entreprise** : Aiman Renovation (SASU, créée 2024)
- **Téléphone fixe** : 03 56 89 44 03
- **Téléphone mobile** : 09 39 24 55 15
- **Email** : contact@aiman-renovation.fr
- **Adresse** : 14 rue de la Paix, 68300 Saint-Louis
- **Zone** : Saint-Louis et environs (Haut-Rhin, Alsace)
- **Expérience** : 19 ans
- **Projets** : +50 réalisés

## Contenu textuel

Rédigé par Claude, basé sur les informations de l'entreprise et le slogan. Ton professionnel, direct, chaleureux. Adapté aux trois cibles (particuliers, copropriétés, pros).

## Connexion future avec Jarvis

Le formulaire de devis envoie un email via Resend en V1. En V2, il pourra envoyer un webhook vers l'API Jarvis pour injecter automatiquement la demande dans le protocole devis (agent intake → orchestrateur).

## Livrables hors scope

- Modélisation 3D des scènes (nécessite Blender ou achat de modèles)
- Génération des images IA (à faire séparément)
- Configuration DNS IONOS → Vercel (à faire au déploiement)
- Intégration Jarvis V2 (après mise en prod du site)
