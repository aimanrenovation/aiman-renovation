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

- ✅ `seoTitle` + `seoDescription` + `relatedSlugs` + `faq` ajoutés pour les 5 services manquants : `peinture`, `sols-carrelage`, `renovation-complete`, `isolation`, `facade`
- ✅ Délai "sous 4 jours" uniformisé à "sous 48h" sur toutes les pages publiques (FR/DE/EN) : home, contact, devis, services, CTA, FAQ, avis
- ✅ URLs FAQ cassées corrigées : `/services/ravalement-facade` → `/services/facade`, `/services/bornes-irve` → `/services/borne-recharge`
- ✅ Faux numéro de téléphone dans `contact.seo_description` (03 56 89 44 03) → supprimé
- ✅ Pages `/devis-salle-de-bain`, `/devis-cuisine`, `/devis-facade` ajoutées au sitemap
- ✅ Home title : ajout "Bâle" pour capter le trafic transfrontalier CH/DE

### Points restants (hors périmètre SEO-contenu)

- **ICON_MAP manquant pour `depannage-urgence`** : la page `/services/depannage-urgence` n'a pas d'icône. À corriger dans la prochaine release.
- **ICON_MAP `isolation` pointe sur `icon-facade.png`** : créer `icon-isolation.png` distinct.
- **`devis-cuisine/page.tsx`** : `serviceJsonLd.provider.telephone` = `"+33389700000"` → numéro factice à remplacer.
- **Avis page** : le compteur affiche "30 avis" dans le seoDescription mais le schema JSON-LD indique 47 reviews. Synchroniser.
- **Schema `areaServed` du layout** : la version FR ne liste pas Mulhouse, Rixheim, Habsheim, Sierentz, Kembs. Ajouter dans `frenchCities[]`.
- **VILLES_FR incomplètes** : Rixheim, Habsheim, Sierentz mentionnées dans le contenu mais sans page dédiée `/renovation/[ville]`. Potentiel SEO local fort.
- **Pages devis spécialisées** : design différent du reste du site (fond blanc vs fond noir). SEO OK, cohérence visuelle à revoir.
- **`blog/page.tsx`** : CTA dit "Réponse sous 24h" — incohérent avec "48h" du reste du site.

### Axes prioritaires phase 3

1. **Google Business Profile** — levier n°1 SEO local, non adressable via le code
2. **Google Search Console** — soumettre le sitemap (`/sitemap.xml`) dès déploiement
3. **Pages villes manquantes** : créer Rixheim, Habsheim, Sierentz dans VILLES_FR
4. **Lien interne** : ajouter lien "Devis spécialisé" depuis `/services/cuisine` → `/devis-cuisine`, etc.
5. **Backlinks** : contacter Point P, Cedeo, Chambre des Métiers d'Alsace, sites MaPrimeRénov' pour liens entrants

---

---

## Phase 2 — Réalisé (avril 2026, branche seo/phase-2-content)

### Metadata services corrigés
- `peinture` : seoTitle, seoDescription et relatedSlugs ajoutés
- `sols-carrelage` : seoTitle, seoDescription et relatedSlugs ajoutés
- `renovation-complete` : seoTitle, seoDescription et relatedSlugs ajoutés
- `isolation` : seoTitle, seoDescription et relatedSlugs ajoutés
- Toutes les pages services ont maintenant un seoTitle (50-60 chars) et seoDescription (140-155 chars) optimisés

### Métadonnées pages clés améliorées
- Homepage FR : title renforcé avec "Artisan Rénovation Saint-Louis 68 | Haut-Rhin | Aiman" (54 chars, keyword-first), description réécrite avec mots-clés prioritaires en début de phrase (153 chars)
- Services FR : title "Services Rénovation Saint-Louis & Haut-Rhin | Artisan" (54 chars, +9 chars vs avant), description enrichie
- Services DE : title renforcé (51 chars vs 49 chars)
- Services EN : title renforcé (51 chars vs 41 chars)

### Security headers ajoutés (next.config.ts)
- `X-Frame-Options: SAMEORIGIN` — protection clickjacking
- `X-Content-Type-Options: nosniff` — protection MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — contrôle données referrer
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self)` — contrôle API navigateur
- Impact : confiance Google, meilleur score sécurité PageSpeed, signal indirect de qualité pour le ranking

### Maillage interne services
- Tous les services ont maintenant des `relatedSlugs` pour le maillage interne :
  - `peinture` → [sols-carrelage, facade, renovation-complete]
  - `sols-carrelage` → [salle-de-bain, cuisine, renovation-complete]
  - `renovation-complete` → [salle-de-bain, cuisine, isolation]
  - `isolation` → [facade, renovation-complete, panneaux-photovoltaiques]
- Les services peinture, sols-carrelage, renovation-complete, isolation ont donc maintenant des "Services Associés" affichés en bas de page

### Audit initial (phase 2) — points déjà couverts avant cette PR
- Structure JSON-LD complète : Organisation, Service, FAQ, LocalBusiness, AggregateRating
- Sitemap dynamique (600+ URLs, 3 locales)
- Robots.txt correct avec blocage API et espace-employés
- Hreflang FR/DE/EN sur toutes les pages
- 200+ pages géolocalisées (villes FR, DE, CH)
- Images AVIF/WebP auto-converties, lazy loading, alt text
- Redirections 301 en place (carrelage→sols-carrelage, peinture-finitions→peinture, facade-isolation→facade)

---

## Améliorations SEO phase 3 — Priorités

### Haute priorité
- **FAQ par service** : section FAQ avec schema `FAQPage` sur chaque page service — fort potentiel People Also Ask
- **Google Business Profile** : fiche Google optimisée = levier n°1 référencement local (photos avant/après, réponses avis, posts réguliers)
- **Google Search Console** : vérification propriété, soumission sitemap, monitoring erreurs
- **Articles blog géolocalisés** : 20+ articles ciblant la longue traîne (ex: "Combien coûte une rénovation salle de bain à Saint-Louis 2026 ?", "Aides isolation Alsace 2026", "Carreleur Mulhouse prix")

### Moyenne priorité
- `google-site-verification` : balise meta à ajouter dans `app/layout.tsx` → `metadata.verification`
- Manifests PWA multilingues : créer `/public/manifest-de.webmanifest` et `/manifest-en.webmanifest` + icône 512×512
- Intégration `Review` schema : quand avis Google disponibles, les intégrer avec `@type: Review` pour rich snippets étoiles
- Pages villes enrichies : ajouter section FAQ avec `FAQPage` schema par ville pour People Also Ask locaux

### Mots-clés non encore couverts (opportunités phase 3)
- "renovation maison 68300" (fort volume local)
- "artisan haut-rhin" (générique, fort volume)
- "renovation appartement bale" (transfrontalier CH)
- "devis renovation gratuit alsace"
- "Renovierung Wohnung Basel" (DE, potentiel CH)
- "Badezimmer renovieren Elsass" (DE, tri-frontière)
- "entreprise renovation mulhouse" (Mulhouse = 2e ville 68)
- "isolation thermique exterieure alsace" (ITE, fort volume, aides État)
- "peintre alsace" + "peintre mulhouse"

---

*Dernière mise à jour : phase 2 — avril 2026*
