# NOTES SEO — Aiman Renovation

Fichier de suivi des observations hors périmètre SEO et des axes d'amélioration futurs.
Ne pas modifier le code ici — traiter séparément.

---

## Phase 2 — 2026-05-03 : Améliorations réalisées

| Élément | Avant | Après |
|---------|-------|-------|
| Services sans seoTitle | 5 (peinture, sols-carrelage, renovation-complete, isolation, facade) | 0 — tous les services ont seoTitle + seoDescription + relatedSlugs |
| Homepage title (fr) | "Aiman Renovation — Rénovation sur mesure à Saint-Louis (68)" | "Artisan Rénovation Saint-Louis 68300 \| Haut-Rhin & Bâle" |
| Homepage description (fr) | 163 chars — trop long | 148 chars ✓ |
| Services page title (fr) | "Nos Services de Rénovation à Saint-Louis (68)" (46 chars) | "Services Rénovation Saint-Louis 68 \| Artisan Haut-Rhin" (55 chars) |
| Avis page title (fr) | 67 chars — trop long | 53 chars ✓ |
| sameAs schema | URLs divergentes des comptes réels | Corrigé — cohérent avec COMPANY.social |
| Hub Suisse title DE | "Renovierung in der Schweiz \| AIMAN RENOVATION — Französische Handwerker Basel" (77 chars) | "Renovierung in der Schweiz — Elsässer Handwerker Basel" (54 chars) |
| Hub Allemagne title DE | "Renovierung in Deutschland \| AIMAN RENOVATION — Französische Handwerker im Dreiländereck" (90 chars) | "Renovierung Lörrach, Weil am Rhein \| Handwerker Aiman" (53 chars) |
| Homepage title/desc (de) | "Renovation" (non-standard allemand) | "Renovierung" (standard) + villes Basel/Lörrach |
| Services title (de) | 49 chars, pas de villes | 57 chars, villes Basel/Lörrach ajoutées |

---

## Observations hors-scope (à traiter en Phase 3+)

### Incohérences données entreprise
- `COMPANY.experience: 19` mais `COMPANY.founded: 2024` — incohérent (19 ans d'expérience depuis 2024 ?). Clarifier si c'est l'expérience personnelle du fondateur ou la création de la SASU.
- `COMPANY.projects: 50` — faible pour un artisan avec 19 ans d'expérience. À mettre à jour régulièrement.
- `aggregateRating.reviewCount: "47"` dans le schema layout mais la page avis affiche "30 avis vérifiés" — incohérence à corriger.

### Schema markup
- `logo` dans Organization schema pointe vers `/images/logo.png` — fichier inexistant (c'est `/logo/logo-full.png`). À corriger pour que Google indexe le bon logo.
- `availableLanguage: ["French", "Arabic"]` dans ContactPoint — envisager d'ajouter "German" pour renforcer le signal tri-frontière.

### Performance (hors SEO direct)
- Page `/devis` charge Three.js — LCP probablement élevé. Envisager un import dynamique ou lazy-load au clic.
- Images de villes (`/images/villes/*.webp`) : vérifier qu'elles existent toutes en production (certaines peuvent être manquantes et générer des 404).

### SEO technique prioritaire (Phase 3)
- **Google Search Console** : ajouter la balise de vérification dans `app/layout.tsx`. Sans GSC, impossible de mesurer réellement les performances.
- **Google Business Profile** : c'est LE facteur #1 pour le SEO local. Vérifier que la fiche est réclamée, complète avec photos, horaires, services et zone d'intervention.
- **Core Web Vitals** : mesurer INP et LCP sur les pages service et ville — objectif LCP < 2,5s.

### Contenu (Phase 3)
- Blog : 21 articles actuels. Objectif : 2-3 nouveaux articles/mois sur keywords longue traîne (ex: "prix isolation combles Mulhouse", "plombier urgence Bartenheim 24h", "rénovation appartement investissement locatif Haut-Rhin").
- Pages ville : le texte vient de fr.json — vérifier que chaque ville a un contenu unique et non dupliqué.
- Termes allemands à enrichir dans les pages Suisse/Allemagne : Badsanierung, Küchensanierung, Malerarbeiten, Bodenbelag, Wärmedämmung, Fassadenrenovierung.

### Maillage interne (Phase 3)
- Les articles de blog ne lient pas systématiquement vers les services dans le corps du texte.
- La navbar ne comporte pas de lien direct vers le blog.
- Footer : ajouter des liens directs vers les principales villes (Saint-Louis, Mulhouse, Bâle).

### Manifest
- `manifest.webmanifest` ne couvre que le français. Envisager des manifests localisés pour /de et /en si indexation PWA multi-locale souhaitée.
