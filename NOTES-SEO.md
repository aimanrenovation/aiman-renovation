# NOTES SEO — Aiman Renovation

Observations faites lors de l'audit SEO Phase 2. Ces éléments ne sont PAS corrigés dans cette branche — à traiter séparément.

---

## Phase 2 — Mai 2026 (branche seo/phase-2-content)

### Ce qui a été fait

- **seoTitle / seoDescription / relatedSlugs** ajoutés aux 5 services qui en manquaient : `peinture`, `sols-carrelage`, `renovation-complete`, `isolation`, `facade`
- **FAQ avec JSON-LD FAQPage** ajoutée sur chaque page service (3 à 4 questions par service, ciblées sur les requêtes locales)
- **Sitemap.ts** mis à jour : ajout de `/devis-cuisine`, `/devis-salle-de-bain`, `/devis-facade`, `/calculateur` (priorité 0.85 pour les pages devis haute conversion)
- **Homepage metadata** optimisée dans `messages/fr.json` :
  - Titre : "Rénovation Saint-Louis 68 — Artisan Haut-Rhin & Bâle" (keyword-first, 53 chars)
  - Description : inclut maintenant Mulhouse et Bâle explicitement (150 chars)
- **devis-salle-de-bain** : description tronquée de 179 → 162 chars (respect des 160 chars max)

---

## Bugs / problèmes identifiés (hors SEO)

- `COMPANY.address` et `COMPANY.zip` étaient vides dans `lib/constants.ts` → corrigé dans PR précédente
- Le `experience: 19` dans constants.ts semble incohérent avec `founded: 2024` — à clarifier avec le client (19 ans d'expérience personnelle du fondateur ?)
- `COMPANY.projects: 50` → valeur faible, à mettre à jour régulièrement

---

## Observations hors-scope (à traiter en Phase 3+)

### Incohérences données entreprise
- `COMPANY.experience: 19` mais `COMPANY.founded: 2024` — incohérent (19 ans d'expérience depuis 2024 ?). Clarifier si c'est l'expérience personnelle du fondateur ou la création de la SASU. Le JSON-LD Organisation a `foundingDate: "2024"` — à corriger pour E-E-A-T.
- `COMPANY.projects: 50` — faible pour un artisan avec 19 ans d'expérience. À mettre à jour régulièrement.
- `aggregateRating.reviewCount: "47"` dans le schema layout mais la page avis peut afficher un chiffre différent — incohérence à corriger.

- **Blog / actualités** : Créer des articles géolocalisés (ex: "Combien coûte une rénovation de salle de bain à Saint-Louis ?", "Les aides à la rénovation en Alsace en 2026") pour capter du trafic longue traîne. Impact SEO très fort.
- **Pages villes supplémentaires** : Ajouter Rixheim, Habsheim, Sierentz, Rosenau dans VILLES_FR si pas déjà présentes. Chaque ville = une page dédiée indexable.
- **Section témoignages structurés** : Le schema `AggregateRating` est en place (4.9/5, 47 avis) mais les avis individuels ne sont pas sérialisés en schema `Review`. À faire dès que les avis Google/Trustpilot sont disponibles en masse.
- **FAQ inter-services** : Les pages services ne renvoient pas vers la page FAQ globale. Ajouter un lien "Voir toutes nos FAQ" en bas de chaque section FAQ.
- **Contenu en allemand sur les pages services** : Ajouter des paragraphes ou sections en allemand pour capter le trafic transfrontalier suisse/allemand (Renovierung, Badezimmer renovieren, Küche renovieren Elsass…)

### Performance (hors SEO direct)
- Page `/devis` charge Three.js — LCP probablement élevé. Envisager un import dynamique ou lazy-load au clic.
- Images de villes (`/images/villes/*.webp`) : vérifier qu'elles existent toutes en production (certaines peuvent générer des 404).
- Favicon : seul `/favicon.png` configuré. Ajouter un `/favicon.ico` pour compatibilité maximale.

- **Google Search Console** : Vérifier que le site est indexé, soumettre le sitemap `https://aiman-renovation.fr/sitemap.xml`, surveiller les erreurs d'exploration.
- **Google Business Profile** : Créer/optimiser la fiche Google Maps (anciennement Google My Business) avec photos réalisations, services, horaires, réponses aux avis. C'est LE levier n°1 pour le référencement local dans le Haut-Rhin.
- **Vérification propriété Google** : Ajouter la balise meta `google-site-verification` dans `app/layout.tsx` → `metadata.verification.google`.
- **Core Web Vitals** : La page `/devis` charge Three.js (bibliothèque 3D lourde). Vérifier LCP, CLS et INP avec PageSpeed Insights. Envisager le lazy-loading de la scène 3D.
- **Images WebP/AVIF** : Déjà configuré dans `next.config.ts` — vérifier que les images servies en production sont bien en AVIF/WebP.
- **Headers de sécurité** : Ajouter dans `next.config.ts` les headers `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Impact indirect sur la confiance Google.
- **Balises `<details>` FAQ** : L'accordion FAQ sur les pages service utilise `<details>/<summary>` natif HTML. Vérifier que Google indexe bien le contenu des `<details>` fermés (généralement oui depuis 2020, mais à confirmer via Search Console après déploiement).

### Contenu (Phase 3)
- Blog : objectif 2-3 nouveaux articles/mois sur keywords longue traîne (ex: "prix isolation combles Mulhouse", "plombier urgence Bartenheim 24h", "rénovation appartement investissement locatif Haut-Rhin").
- Pages ville : vérifier que chaque ville a un contenu unique — pas de duplication qui pénaliserait le crawl.
- Termes allemands à enrichir dans les pages Suisse/Allemagne : Badsanierung, Küchensanierung, Malerarbeiten, Bodenbelag, Wärmedämmung, Fassadenrenovierung.

- **Footer enrichi** : Ajouter dans le footer une liste complète des services avec liens directs. Actuellement, le footer ne semble pas lier chaque service individuellement.
- **Liens croisés FAQ ↔ Services** : La page FAQ globale référence les services via `relatedServices`, mais les sections FAQ des pages service ne renvoient pas vers la FAQ globale. Ajouter un lien "Voir toutes les questions →" pointant vers `/faq`.
- **Breadcrumbs JSON-LD** : Déjà présent sur les pages service. Vérifier avec l'outil de test des données structurées Google qu'ils sont correctement sérialisés.

### Réseaux sociaux

- **Instagram** : Profil `@aiman_renovation` actif — s'assurer que l'URL dans `COMPANY.social.instagram` est à jour dans `lib/constants.ts`.
- **LinkedIn** : Profil `aiman-renovation-68` présent. À alimenter régulièrement avec photos de chantiers.
- **TikTok** : Profil `@aiman.renovation` présent. Vidéos "avant/après" = fort potentiel de viralité et de backlinks.

---

## Mots-clés non couverts / opportunités

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
- "carreleur mulhouse" (non couvert)
- "electricien mulhouse" (non couvert)

---

### Observations additionnelles (mai 2026)

Les slugs actuels correspondent bien aux requêtes principales :
- `/services/peinture` → OK
- `/services/sols-carrelage` → OK (carrelage = terme principal)
- `/services/facade` → OK
- `/services/isolation` → OK
- `/services/renovation-complete` → OK

---

## État SEO global au 06/05/2026

| Élément | Statut | Notes |
|---------|--------|-------|
| Robots.ts | ✓ | Blocage crawlers IA, sitemap déclaré |
| Sitemap.ts | ✓ | 67+ entrées dont devis pages et calculateur |
| Metadata toutes pages | ✓ | 100 % couvertes |
| seoTitle services | ✓ | Tous les 14 services optimisés |
| FAQ JSON-LD services | ✓ | Ajouté phase 2 |
| Hreflang multilingue | ✓ | FR/DE/EN via alternates |
| OpenGraph | ✓ | Complet sur toutes les pages |
| JSON-LD Organization | ✓ | LocalBusiness complet dans locale layout |
| JSON-LD Service | ✓ | Sur chaque page service |
| JSON-LD FAQPage | ✓ | FAQ globale + chaque service |
| Images optimisées | ✓ | AVIF/WebP, CDN Scaleway |
| Breadcrumbs + JSON-LD | ✓ | Sur pages service, blog, FAQ |
| H1 homepage | ✓ | "RÉNOVATION SUR MESURE" dans Hero |
| Maillage interne | ✓ | relatedSlugs sur tous les services |
| Pages villes FR | ✓ | 50+ villes avec contenu unique |
| Pages villes CH/DE | ✓ | Cantons + villes suisses et allemandes |
| Google Business Profile | ✗ | À créer/optimiser — priorité absolue |
| Google Search Console | ✗ | Sitemap à soumettre |

*Dernière mise à jour : phase 2 — mai 2026*
