# Devis Blueprint Interactif — Design Spec

## Résumé

Refonte du formulaire devis `/devis` : plan blueprint architectural interactif vue plongeante. Le client clique sur les pièces, zoome, sélectionne les travaux, puis envoie son devis.

## Décisions validées

- **Style** : Blueprint technique (fond bleu foncé, grille, lignes bleues, cotations) — réaliste
- **Maison** : Plan générique universel T5 ~120m², toutes pièces représentées
- **Layout plan** : Zone jour (salon+SAM) haut, cuisine bas-gauche, zone nuit bas, garage droite. Extérieur en ceinture (terrasse, jardin, haie)
- **Sélection** : Liste de travaux par pièce. Quand coché → sous-zone s'allume sur le plan
- **Rendu desktop** : Three.js (R3F) vue top-down maquette 3D (ombres, lumière spot, inclinaison)
- **Rendu mobile** : Canvas 2D fluide
- **UI travaux desktop** : Split screen (plan gauche, panneau droite)
- **UI travaux mobile** : Drawer coulissant depuis le bas
- **Switch** : `gpu-detector.ts` existant

## Flux utilisateur

1. Vue globale → clic pièce
2. Zoom animé GSAP → panneau travaux (split desktop / drawer mobile)
3. Cocher travaux → éléments s'allument sur plan
4. Retour → vue globale, pièces sélectionnées en surbrillance + badge
5. Bouton "Envoyer mon devis" → récap + formulaire contact
6. Submit → API `/api/devis` (Resend, existant)

## Zones

### Intérieur (9)
Salon/Séjour, Salle à manger, Cuisine, Vestibule, WC, SDB, Chambre 1, Chambre 2, Garage

### Extérieur (5)
Terrasse, Jardin/Gazon, Haie/Clôture, Façades, Toiture

### Sous-éléments par zone (exemples)
- Cuisine : Sol, Murs, Plafond, Plomberie, Électricité, Meubles cuisine, Plan de travail
- SDB : Sol, Murs, Douche, Baignoire, Lavabo, Plomberie, VMC
- Chambre : Sol, Murs, Plafond, Électricité, Peinture, Menuiserie (portes/fenêtres)
- Extérieur/Façade : Enduit, Isolation (ITE), Peinture, Nettoyage HP
- Jardin : Gazon, Haie, Clôture, Éclairage, Arrosage

## Architecture fichiers

```
components/devis/
  devis-page-content.tsx      — Switch 3D/2D (existant, adapter)
  devis-blueprint-3d.tsx      — Scène Three.js maquette top-down
  devis-blueprint-2d.tsx      — Canvas 2D mobile
  devis-zones-config.ts       — Config zones + sous-éléments + positions (refaire)
  devis-types.ts              — Types (enrichir)
  devis-reducer.ts            — State machine (adapter)
  gpu-detector.ts             — Détection GPU (existant)
  panels/
    panel-travaux.tsx          — Panneau sélection travaux
    panel-recap.tsx            — Récap + formulaire contact
  steps/
    step-success.tsx           — Confirmation (existant)
app/devis/page.tsx             — Page (existant)
app/api/devis/route.ts         — API Resend (existant)
```

## Plan blueprint SVG

Le SVG de référence est dans `.superpowers/brainstorm/*/content/blueprint-v9.html`. Servira de base pour les deux rendus (3D et 2D).
