# NOTES SEO — Aiman Renovation

Fichier de suivi des observations hors périmètre SEO et des axes d'amélioration futurs.
Ne pas modifier le code ici — traiter séparément.

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

---

## Phase 2 — mai 2026 — Réalisé dans cette session

### Implémentés

- **seoTitle / seoDescription / relatedSlugs** : Ajouté aux 5 services qui en manquaient (peinture, sols-carrelage, renovation-complete, isolation, facade). Tous les 15 services ont maintenant leurs métadonnées SEO complètes.
- **FAQ par service avec FAQPage JSON-LD** : Ajout de 3 questions/réponses géolocalisées sur les 9 services principaux (salle-de-bain, cuisine, électricité, plomberie, peinture, sols-carrelage, renovation-complete, isolation, facade). Section FAQ visuelle avec Accordion sur les pages service. Rich snippets Google (FAQ accordéons dans les SERP) activés.
- **Amélioration meta home** : Ajout de "Bâle" dans le title homepage. Description enrichie (Mulhouse, Bâle).
- **Amélioration meta services/FAQ/contact/devis/a-propos/réalisations/avis** : Mots-clés "68300", "Mulhouse", "Bâle" ajoutés ou renforcés dans les titres/descriptions.
- **Sitemap priorités** : Les 9 services principaux passent à 0.85–0.9, les services secondaires à 0.75.
- **Blog** : Titre et description améliorés (ajout "Haut-Rhin", longueur description corrigée à 148 chars).

### Recommandations prioritaires restantes

1. **Google Business Profile** (levier n°1 local) — Créer/optimiser la fiche Google My Business avec photos avant/après, services détaillés, horaires, réponses aux avis. Ne nécessite pas de code.
2. **Schema HowTo** sur les pages services — Les étapes "processus" pourraient utiliser `schema.org/HowTo` pour des rich snippets supplémentaires. Implémenter dans le template service.
3. **Title renovierung-schweiz (DE)** — Le titre allemand fait 77 chars (cible : 60). À rogner : "Renovierung Basel & Schweiz | AIMAN RENOVATION Elsass" (54 chars).
4. **Balise `google-site-verification`** — Ajouter dans `app/layout.tsx` `metadata.verification.google` pour valider la Search Console.
5. **Pages devis-cuisine/devis-salle-de-bain** — Ces pages spécialisées (`/devis-cuisine`, `/devis-salle-de-bain`) ont-elles des métadonnées SEO ? À vérifier et enrichir.
6. **Calculateur** — La page `/calculateur` mérite un seo_title et seo_description dédiés orientés "prix rénovation Haut-Rhin".
7. **Maillage FAQ ↔ Services** — Les pages services renvoient vers la FAQ générale ? Sinon, ajouter un lien "Plus de questions ? Voir notre FAQ" dans la section FAQ service.
8. **Images WebP/AVIF** — `next.config.ts` : `images.formats: ['image/avif', 'image/webp']`

*Dernière mise à jour : phase 2 — mai 2026*
