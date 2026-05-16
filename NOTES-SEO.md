# NOTES SEO — Aiman Renovation

Fichier de suivi des observations hors périmètre SEO et des axes d'amélioration futurs.
Ne pas modifier le code ici — traiter séparément.

---

## ✅ Phase 2 — Réalisé le 2026-05-16 (branche seo/phase-2-content)

### Métadonnées services
- Ajout `seoTitle`, `seoDescription`, `relatedSlugs` manquants sur 5 services : `peinture`, `sols-carrelage`, `renovation-complete`, `isolation`, `facade`
- Amélioration du titre de la page `/services` : 45 → 54 chars avec mot-clé "Artisan Haut-Rhin"
- Correction incohérence : "30 avis" → "47 avis" dans fr.json (3 occurrences)

### Sections FAQ (impact People Also Ask / rich snippets)
- Champ `faq` ajouté à l'interface `Service` dans `lib/services.ts`
- 4 questions/réponses ciblées ajoutées pour chacun des 14 services
- Section FAQ visuelle (accordion `<details>`) sur toutes les pages `/services/[slug]`
- Schema `FAQPage` JSON-LD injecté sur chaque page service concernée
- Impact attendu : apparition dans les "People Also Ask" Google + rich snippets

### Nouveaux articles blog
- `renovation-maison-mulhouse-artisan` : cible "artisan renovation Mulhouse", "renovation appartement Mulhouse" (FR/DE/EN)
- `devis-renovation-gratuit-saint-louis` : cible "devis renovation gratuit saint-louis", "devis artisan haut-rhin" (FR/DE/EN)
- Sitemap : 471 URLs indexées (vs 465 avant)

### SEO technique
- `/calculateur` : ajout des alternates hreflang manquants (via `getAlternates`)

---

---

## Bugs / problèmes identifiés (hors SEO)

- `COMPANY.address` et `COMPANY.zip` étaient vides dans `lib/constants.ts` → corrigé dans cette PR
- Le `experience: 19` dans constants.ts semble incohérent avec `founded: 2024` — à clarifier avec le client (19 ans d'expérience personnelle du fondateur ?)
- `COMPANY.projects: 50` → valeur faible, à mettre à jour régulièrement

---

## Améliorations SEO futures (phase 3+)

### Contenu

- **Blog / actualités** : Créer une section blog avec des articles géolocalisés (ex: "Combien coûte une rénovation de salle de bain à Saint-Louis ?", "Les aides à la rénovation en Alsace en 2025") pour capter du trafic longue traîne. Impact SEO très fort.
- **Pages villes** : Créer des pages dédiées par zone (ex: `/renovation-mulhouse`, `/renovation-huningue`) avec du contenu unique par ville. Fort potentiel pour dominer les recherches locales.
- **Section témoignages structurés** : Ajouter schema `Review` / `AggregateRating` dès que des avis Google seront disponibles. Afficher les étoiles dans les résultats de recherche (rich snippets).
- **FAQ par service** : Ajouter une section FAQ sur chaque page service avec schema `FAQPage` pour capter les People Also Ask de Google.

### Technique

- **Google Search Console** : Vérifier que le site est indexé, soumettre le sitemap, surveiller les erreurs d'exploration.
- **Google Business Profile** : Créer / optimiser la fiche Google (anciennement Google My Business) avec photos, services, horaires, réponses aux avis. C'est LE levier n°1 pour le référencement local.
- **Vérification propriété** : Ajouter la balise meta de vérification Google (`google-site-verification`) dans `app/layout.tsx` → métadonnée `verification`.
- **Core Web Vitals** : La page `/devis` charge Three.js (bibliothèque 3D lourde). Vérifier LCP, CLS et INP avec PageSpeed Insights. Envisager le lazy-loading de la scène 3D.
- **Images WebP/AVIF** : Ajouter `formats: ['image/avif', 'image/webp']` dans `next.config.ts` pour activer la conversion automatique. Gain de poids significatif.
- **Compression** : Activer `compress: true` dans `next.config.ts` (devrait être actif par défaut sur Vercel).
- **Manifest i18n** : Le fichier `manifest.webmanifest` ne supporte qu'une seule langue (FR). Créer `/manifest-de.webmanifest` et `/manifest-en.webmanifest` si le public DE/EN est ciblé.
- **Icône 512x512** : Le manifest ne référence qu'une icône 192x192. Ajouter une version 512x512 pour une meilleure compatibilité PWA.
- **Headers de sécurité** : Ajouter dans `next.config.ts` les headers `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Impact indirect sur la confiance Google.

### Maillage interne

- **Footer enrichi** : Ajouter dans le footer une liste complète des services avec liens. Actuellement, le footer ne semble pas lier chaque service individuellement.
- **Liens depuis la homepage** : Vérifier que chaque service a un lien direct depuis la homepage (via ServicesPreview) — c'est probablement déjà le cas.
- **Liens croisés FAQ ↔ Services** : La page FAQ référence les services, mais les pages services ne renvoient pas vers la FAQ. À envisager.

### Réseaux sociaux

- **Instagram** : Ajouter un profil Instagram pour partager les réalisations "avant/après". Ajouter l'URL dans `sameAs` du schema.
- **LinkedIn** : Profil professionnel pour crédibiliser la SASU.
- **Twitter/X card** : Le handle `@twitter` est vide dans les métadonnées — à remplir si un compte existe.

---

## Mots-clés non couverts (opportunités)

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

Les slugs actuels ne correspondent pas exactement à certaines requêtes cibles :
- `/services/peinture-finitions` → les internautes cherchent `/services/peinture` — envisager un redirect ou un alias
- `/services/carrelage` → les internautes cherchent aussi "sols" — slug OK car "carrelage" est le terme principal
- `/services/facade-isolation` → deux services différents dans un seul slug ; à long terme, les séparer en `/services/facade` et `/services/isolation` aurait plus de poids SEO

---

*Dernière mise à jour : phase 2 — avril 2026*
