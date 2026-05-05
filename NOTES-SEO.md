# NOTES SEO — Aiman Renovation

Observations faites lors de l'audit SEO Phase 2. Ces éléments ne sont PAS corrigés dans cette branche — à traiter séparément.

---

## Phase 2 — 2026-05-04 : Améliorations réalisées

| Élément | Avant | Après |
|---------|-------|-------|
| Services sans seoTitle | 5 (peinture, sols-carrelage, renovation-complete, isolation, facade) | 0 — tous les services ont seoTitle + seoDescription + relatedSlugs |
| FAQ rich results | Aucune page service | 14 services avec FAQ (3 Q&A chacun) + FAQPage + HowTo JSON-LD |
| Homepage title (fr) | "Aiman Renovation — Rénovation sur mesure à Saint-Louis (68)" | "Artisan Rénovation Saint-Louis 68300 \| Haut-Rhin & Bâle" |
| Homepage description (fr) | 163 chars — trop long | 148 chars ✓ |
| Homepage title/desc (de) | "Renovation" (non-standard allemand) | "Renovierung" (standard) + villes Basel/Lörrach |
| Contact description (fr) | Manquait "Bâle", délai "4 jours" | Inclut zone Bâle, délai "48h" |
| sameAs schema | URLs divergentes | Corrigé — cohérent avec données réelles |

---

## Observations hors-scope (à traiter en Phase 3+)

### Incohérences données entreprise
- `COMPANY.experience: 19` mais `COMPANY.founded: 2024` — incohérent (19 ans d'expérience depuis 2024 ?). Clarifier si c'est l'expérience personnelle du fondateur ou la création de la SASU. Le JSON-LD Organisation a `foundingDate: "2024"` — à corriger pour E-E-A-T.
- `COMPANY.projects: 50` — faible pour un artisan avec 19 ans d'expérience. À mettre à jour régulièrement.
- `aggregateRating.reviewCount: "47"` dans le schema layout mais la page avis peut afficher un chiffre différent — incohérence à corriger.

### Schema markup
- `logo` dans Organization schema pointe vers `/images/logo.png` — vérifier que ce fichier existe (sinon corriger vers `/logo/logo-full.png`). Google indexe le bon logo via ce champ.
- `availableLanguage: ["French", "Arabic"]` dans ContactPoint — envisager d'ajouter "German" pour renforcer le signal tri-frontière.

### Performance (hors SEO direct)
- Page `/devis` charge Three.js — LCP probablement élevé. Envisager un import dynamique ou lazy-load au clic.
- Images de villes (`/images/villes/*.webp`) : vérifier qu'elles existent toutes en production (certaines peuvent générer des 404).
- Favicon : seul `/favicon.png` configuré. Ajouter un `/favicon.ico` pour compatibilité maximale.

### SEO technique prioritaire (Phase 3)
- **Google Search Console** : ajouter la balise de vérification dans `app/layout.tsx`. Sans GSC, impossible de mesurer les performances réelles.
- **Google Business Profile** : facteur #1 pour le SEO local. Vérifier que la fiche est réclamée, complète avec photos, horaires, services et zone d'intervention. Catégories recommandées : "Entrepreneur en rénovation", "Plombier", "Électricien", "Carreleur", "Peintre en bâtiment".
- **Core Web Vitals** : mesurer INP et LCP sur les pages service et ville — objectif LCP < 2,5s mobile.

### Contenu (Phase 3)
- Blog : objectif 2-3 nouveaux articles/mois sur keywords longue traîne (ex: "prix isolation combles Mulhouse", "plombier urgence Bartenheim 24h", "rénovation appartement investissement locatif Haut-Rhin").
- Pages ville : vérifier que chaque ville a un contenu unique — pas de duplication qui pénaliserait le crawl.
- Termes allemands à enrichir dans les pages Suisse/Allemagne : Badsanierung, Küchensanierung, Malerarbeiten, Bodenbelag, Wärmedämmung, Fassadenrenovierung.

### Maillage interne (Phase 3)
- Les articles de blog ne lient pas systématiquement vers les services dans le corps du texte.
- Footer : envisager des liens directs vers les principales villes (Saint-Louis, Mulhouse, Bâle).

---

## Points forts à conserver

- Sitemap dynamique multi-locale (FR/DE/EN) avec alternates hreflang : OK
- 14 services avec seoTitle/seoDescription/relatedSlugs + FAQ : OK (Phase 2)
- Schema ItemList sur /services (liste tous les services avec URL + description) : OK (Phase 2)
- 48+ pages villes France avec contenu unique : OK
- Pages Suisse et Allemagne en allemand : OK
- JSON-LD Organisation très complet + Service + FAQPage + HowTo : OK
- Robots.txt bloquant les crawlers IA : OK
- Images AVIF/WebP avec cache 1 an : OK

---

### Observations additionnelles (mai 2026)

- `ICON_MAP["renovation-complete"]` pointe vers `icon-cuisine.png` — devrait avoir sa propre icône
- `PHOTO_MAP["isolation"]` et `ICON_MAP["isolation"]` pointent vers les fichiers façade — prévoir des visuels dédiés isolation
- `/blog/[slug]` : JSON-LD breadcrumb présent, mais pas de composant visuel `<Breadcrumb>` dans le template article
- Les pages devis spécialisées (`devis-cuisine`, `devis-salle-de-bain`, `devis-facade`) n'ont pas de breadcrumb visuel
- Chaque page service a une section processus en étapes sans schema `HowTo / HowToStep` — fort potentiel rich snippets Google

*Dernière mise à jour : phase 2 — mai 2026*
