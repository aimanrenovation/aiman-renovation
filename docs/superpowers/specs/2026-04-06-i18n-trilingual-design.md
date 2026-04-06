# i18n Trilingue — FR / DE / EN

## Objectif
Rendre le site aiman-renovation.fr accessible en français, allemand et anglais pour capter la clientèle suisse alémanique, allemande et anglophone de la région tri-frontière (Saint-Louis / Bâle / Weil am Rhein).

## URLs et routing

- **FR (défaut)** : `/services`, `/devis`, `/contact` — pas de préfixe
- **DE** : `/de/services`, `/de/devis`, `/de/contact`
- **EN** : `/en/services`, `/en/devis`, `/en/contact`

### Structure fichiers
```
app/
  [locale]/
    layout.tsx       ← injecte locale + dictionary dans le context
    page.tsx         ← homepage
    services/page.tsx
    services/[slug]/page.tsx
    devis/page.tsx
    realisations/page.tsx
    a-propos/page.tsx
    contact/page.tsx
    faq/page.tsx
    cgv/page.tsx
    mentions-legales/page.tsx
    politique-confidentialite/page.tsx
    not-found.tsx
  api/               ← hors locale (inchangé)
```

### Middleware (proxy.ts ou middleware.ts)
1. Lit le cookie `locale` — si présent, utilise cette locale
2. Sinon, détecte `Accept-Language` header du navigateur
3. Redirige vers la bonne locale si différent de FR
4. Set le cookie `locale` pour les visites suivantes

## Système de traduction

### Fichiers
```
lib/i18n/
  config.ts              ← locales: ['fr','de','en'], defaultLocale: 'fr'
  get-dictionary.ts      ← import dynamique du bon JSON
  dictionaries/
    fr.json              ← ~300 clés
    de.json
    en.json
```

### Pas de librairie externe
Simple `getDictionary(locale)` qui retourne un objet typé. Zero dépendance.

### Organisation des clés
```json
{
  "nav": { "services": "...", "devis": "...", "contact": "...", "about": "...", "realisations": "..." },
  "home": { "hero_title": "...", "hero_subtitle": "...", ... },
  "services": { "title": "...", "subtitle": "...", ... },
  "devis": { "click_room": "...", "touch_room": "...", "send_quote": "...", ... },
  "devis_zones": { "cuisine": "...", "sdb": "...", ... },
  "devis_works": { "sol": "...", "murs_peinture": "...", ... },
  "devis_recap": { "summary": "...", "budget": "...", "magicplan_title": "...", ... },
  "devis_magicplan": { "step1_title": "...", ... },
  "contact": { "title": "...", "form_name": "...", ... },
  "about": { ... },
  "realisations": { ... },
  "404": { "variant1_title": "...", "variant1_subtitle": "...", ... },
  "common": { "phone": "...", "email": "...", "address": "...", "back": "...", "next": "...", "send": "..." },
  "footer": { ... },
  "seo": { "home_title": "...", "home_description": "...", ... }
}
```

## Blueprints par langue

3 images (même dimensions ~2814x1536, mêmes coordonnées de zones) :
- `public/images/blueprint-plan-fr.jpeg` — existant (renommé depuis blueprint-plan.jpeg)
- `public/images/blueprint-plan-de.jpeg` — depuis ~/Downloads/blueprint allemand.jpg
- `public/images/blueprint-plan-en.jpeg` — depuis ~/Downloads/blueprint anglais.jpg

Le composant `blueprint-interactive.tsx` reçoit la locale et charge la bonne image. Le viewBox passe à `0 0 2814 1536` pour les versions DE/EN (2px de plus en largeur).

## Sélecteur de langue (navbar)

### Drapeaux
- **FR** : drapeau français standard (tricolore)
- **DE** : drapeau split diagonal — Allemagne (noir/rouge/or) en haut-gauche + Suisse (croix blanche/rouge) en bas-droite, séparés par une diagonale
- **EN** : Union Jack (drapeau britannique)

Composant SVG inline pour chaque drapeau, ~20x14px dans la navbar. Au clic, dropdown avec les 3 options. Change le cookie `locale` et redirige vers la même page dans la nouvelle langue.

## Pages traduites (exhaustif)

### Toutes les pages
- Homepage (hero, sections, testimonials, CTA)
- Services listing + 12 pages service individuelles
- Réalisations
- À propos (histoire, étapes, engagements, certifications)
- Contact (formulaire, horaires, adresse)
- FAQ
- CGV
- Mentions légales
- Politique de confidentialité
- Page 404 (8 variantes × 3 langues)

### Devis complet
- Instructions blueprint ("Cliquez/Touchez une pièce")
- Labels des 14 zones
- Labels de tous les travaux par zone (~80 items)
- Panel travaux (header, boutons, upload photos, message encouragement)
- Panel récap (budget, message, contact, autocomplete)
- Wizard MagicPlan (5 étapes)
- Champ lien MagicPlan
- Overlay succès
- Emails de confirmation (template HTML)

### SEO
- Metadata `<title>` et `<meta description>` par page × par langue
- JSON-LD schema avec `@language` adapté
- `hreflang` tags dans le `<head>` pour chaque page
- Sitemap multilingue

## Traductions — Adaptation locale

### Allemand
- Hochdeutsch standard mais avec termes suisses quand pertinent (ex: "Offerte" au lieu de "Kostenvoranschlag")
- Termes bâtiment suisse/alsacien quand applicables
- Monnaie : € (pas CHF, on facture en euros)

### Anglais
- British English (clientèle UK/expat en Suisse)
- Termes standards du bâtiment UK

## Contraintes techniques
- Le `localStorage` du devis doit inclure la locale
- L'API `/api/devis` reçoit la locale pour envoyer l'email dans la bonne langue
- L'autocomplete Nominatim fonctionne déjà en tri-pays (FR/DE/CH)
- Les slugs de services restent en français dans toutes les langues (pas de traduction d'URL pour les services)
