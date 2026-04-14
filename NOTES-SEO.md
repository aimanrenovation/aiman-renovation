# NOTES SEO — Aiman Renovation

Fichier de suivi des observations hors périmètre SEO et des axes d'amélioration futurs.
Ne pas modifier le code ici — traiter séparément.

---

## Bugs / problèmes identifiés (hors SEO)

- `COMPANY.address` et `COMPANY.zip` étaient vides dans `lib/constants.ts` → corrigé dans phase 1
- Le `experience: 19` dans constants.ts semble incohérent avec `founded: 2024` — à clarifier avec le client (19 ans d'expérience personnelle du fondateur ?)
- `COMPANY.projects: 50` → valeur faible, à mettre à jour régulièrement
- `ICON_MAP` dans `lib/services.ts` ne couvre pas `entretien-exterieur` et `depannage-urgence` → ces pages service n'affichent pas d'icône

---

## Phase 2 — Travaux réalisés (avril 2026)

### SEO technique

- **5 services manquants de seoTitle/seoDescription** → ajoutés dans `lib/services.ts` :
  - `peinture` : "Peintre Bâtiment Saint-Louis 68 | Artisan Qualifié"
  - `sols-carrelage` : "Carreleur Saint-Louis 68 | Parquet & Carrelage Alsace"
  - `renovation-complete` : "Rénovation Complète Saint-Louis 68 | Clé en Main"
  - `isolation` : "Isolation Thermique Saint-Louis 68 | ITE ITI RGE"
  - `facade` : "Ravalement Façade Saint-Louis 68 | Artisan Haut-Rhin"
  - Ajout des `relatedSlugs` pour le maillage interne sur ces 5 services

- **Root layout** (`app/layout.tsx`) amélioré :
  - Ajout `title.default` + `description` de fallback
  - Ajout `robots` avec directives GoogleBot explicites (max-snippet -1, max-image-preview large)
  - Ajout `openGraph.locale` par défaut (`fr_FR`)

- **WebSite JSON-LD schema** ajouté dans `app/[locale]/layout.tsx` :
  - `@type: WebSite` avec `potentialAction SearchAction` → sitelinks search box Google
  - Lié à l'`@id` Organization

- **Twitter cards manquantes** ajoutées sur :
  - `app/[locale]/a-propos/page.tsx`
  - `app/[locale]/faq/page.tsx`
  - `app/[locale]/avis/page.tsx`
  - `app/[locale]/contact/page.tsx`
  - `app/[locale]/services/page.tsx`

- **Breadcrumb** + `BreadcrumbList` JSON-LD ajouté sur `app/[locale]/services/page.tsx`

### Contenu SEO (messages/fr.json)

- **Numéro de téléphone corrigé** dans `contact.seo_description` : "03 56 89 44 03" → "06 33 49 69 25"
- **Titres et descriptions améliorés** sur toutes les pages clés :
  - Homepage : localisation 68300 + "Haut-Rhin" ajoutés
  - Services index : "68300" + "Artisan Qualifié" + termes précis
  - Devis : "48h" au lieu de "4 jours" (plus rassurant)
  - FAQ : mention "MaPrimeRénov'" ajoutée
  - Réalisations : "avant/après" + "68300" ajoutés
  - À propos : "zone tri-frontière" ajouté
  - Avis : "Bâle" ajouté pour capter le trafic transfrontalier

---

## Améliorations SEO futures (phase 3+)

### Contenu

- **Blog / actualités** : Créer une section blog avec des articles géolocalisés (ex: "Combien coûte une rénovation de salle de bain à Saint-Louis ?", "Les aides à la rénovation en Alsace en 2025") pour capter du trafic longue traîne. Impact SEO très fort.
- **FAQ par service** : Ajouter une section FAQ sur chaque page service avec schema `FAQPage`. Les FAQ permettent de figurer dans les "People Also Ask" de Google — très fort pour le CTR.
- **Contenu en allemand** : Renforcer les pages `renovierung-deutschland` et `renovierung-schweiz` avec du contenu de qualité. Les mots-clés "Badezimmer renovieren Basel", "Renovierung Wohnung Basel" ont un fort potentiel.
- **Pages villes enrichies** : Vérifier que toutes les villes de `VILLES_FR` ont du contenu unique dans `messages/fr.json` (ville_fr_items).

### Technique

- **Google Search Console** : Vérifier indexation, soumettre le sitemap XML, surveiller les erreurs d'exploration. Priorité absolue après déploiement.
- **Google Business Profile** : Créer / optimiser la fiche (anciennement GMB) avec photos, services, horaires, réponses aux avis. Levier n°1 SEO local.
- **Vérification propriété Google** : Ajouter `google-site-verification` dans `app/layout.tsx` → métadonnée `verification.google`.
- **Core Web Vitals** : La page `/devis` charge Three.js. Vérifier LCP, CLS et INP avec PageSpeed Insights. Envisager lazy-loading de la scène 3D.
- **Icônes ICON_MAP manquantes** : Ajouter des entrées pour `entretien-exterieur` et `depannage-urgence` dans `lib/services.ts`.
- **Manifest i18n** : Créer `/manifest-de.webmanifest` et `/manifest-en.webmanifest`.
- **Headers de sécurité** : Ajouter `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` dans `next.config.ts`. Impact indirect sur la confiance Google.

### Maillage interne

- **Footer enrichi** : Ajouter dans le footer une liste complète des services avec liens. Actuellement le footer ne liste pas tous les services individuellement.
- **Liens FAQ ↔ Services** : Les pages services ne renvoient pas vers la FAQ. À envisager.
- **Liens vers les pages villes** depuis la homepage et les pages services.

### Réseaux sociaux & notoriété

- **Avis Google** : Encourager les clients à laisser des avis sur Google Business Profile. Les étoiles dans les SERP augmentent le CTR de 15-30%.
- **Instagram** : Alimenter régulièrement avec des photos avant/après.
- **LinkedIn** : Profil SASU pour crédibilité B2B.

---

## Mots-clés prioritaires non encore couverts

- "renovation maison 68300" (fort volume local)
- "artisan haut-rhin" (générique, fort volume)
- "renovation appartement bale" (transfrontalier)
- "devis renovation gratuit alsace"
- "Renovierung Wohnung Basel" (allemand, potentiel CH)
- "Badezimmer renovieren Elsass" (allemand)
- "entreprise renovation mulhouse" (Mulhouse = 2e ville 68)
- "renovation maison tri-frontiere"
- "peintre alsace" + "peintre mulhouse"
- "isolation thermique exterieure alsace" (ITE, fort volume, aides État)

---

## Structure URLs — observations

Les slugs actuels sont bien optimisés. Redirects déjà en place dans `next.config.ts` :
- `/services/carrelage` → `/services/sols-carrelage`
- `/services/peinture-finitions` → `/services/peinture`
- `/services/facade-isolation` → `/services/facade`

À terme : envisager une page `/services/isolation` distincte de `/services/facade` pour capter les mots-clés "isolation" séparément.

---

---

## Observations phase 2 — avril 2026

### Corrections appliquées dans cette phase

- ✅ `seoTitle` + `seoDescription` + `relatedSlugs` ajoutés pour les 5 services manquants : `peinture`, `sols-carrelage`, `renovation-complete`, `isolation`, `facade`
- ✅ URLs FAQ cassées corrigées : `/services/ravalement-facade` → `/services/facade`, `/services/bornes-irve` → `/services/borne-recharge`
- ✅ Home page description trop longue (162 chars) trimée à 155 chars, titre optimisé avec "artisan"
- ✅ Pages `/devis-salle-de-bain`, `/devis-cuisine`, `/devis-facade` ajoutées au sitemap

### Points restants (hors périmètre SEO-contenu)

- **ICON_MAP manquant pour `depannage-urgence`** : la page `/services/depannage-urgence` n'a pas d'icône (aucune entrée dans `ICON_MAP`). L'icône s'affiche vide. À corriger dans la prochaine release.
- **ICON_MAP `isolation` pointe sur `icon-facade.png`** : les services `isolation` et `facade` partagent la même icône. Créer `icon-isolation.png` distinct.
- **`renovation-loft-mulhouse-idees`** référencé comme related dans `peinture-interieure-mulhouse-tendances` mais ce slug n'a pas encore de traduction dans `article_items` — vérifier que le rendu ne plante pas (notFound en cas de 404).
- **Avis page** : le compteur affiche "30 avis" dans le seoDescription mais le schema JSON-LD indique 47 reviews. Synchroniser.
- **`devis-salle-de-bain` et `devis-cuisine`** : ces pages ont-elles leur propre `generateMetadata` avec `seoTitle` / `seoDescription` optimisés ? À vérifier (vus rapidement — semblent déléguer au namespace "devis" générique).
- **Schema `areaServed` du layout** : la version FR ne liste pas Mulhouse, Rixheim, Habsheim, Sierentz, Kembs — villes pourtant mentionnées dans le contenu. Ajouter dans `frenchCities[]`.
- **VILLES_FR incomplètes** : les villes Rixheim, Habsheim, Sierentz sont mentionnées dans le contenu des services mais n'ont pas de page dédiée `/renovation/[ville]` (non présentes dans `VILLES_FR`). Potentiel SEO local fort.

### Axes prioritaires phase 3

1. **Google Business Profile** — levier n°1 SEO local non adressable via le code
2. **Google Search Console** — soumettre le sitemap (`/sitemap.xml`) dès déploiement
3. **Pages villes manquantes** : créer Rixheim, Habsheim, Sierentz dans VILLES_FR
4. **FAQ par service** : ajouter une section FAQ JSON-LD sur les pages salle-de-bain et cuisine (services à plus fort volume de recherche)
5. **Backlinks** : contacter les fournisseurs (Point P, Cedeo, Grohe), la Chambre des Métiers d'Alsace, les sites d'aides énergétiques (MaPrimeRénov') pour obtenir des liens entrants

*Dernière mise à jour : phase 2 — avril 2026*
