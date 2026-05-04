# NOTES SEO — Aiman Renovation

Observations faites lors de l'audit SEO Phase 2. Ces éléments ne sont PAS corrigés dans cette branche — à traiter séparément.

---

## Problèmes critiques

### 1. Incohérence `foundingDate` vs contenu marketing
- **Fichier** : `app/[locale]/layout.tsx`, ligne ~83
- **Problème** : Le JSON-LD Organisation déclare `foundingDate: "2024"`, alors que le contenu du site revendique "19 ans d'expérience" (ce qui implique ~2005-2006). L'incohérence nuit au score E-E-A-T.
- **Action** : Corriger `foundingDate` avec la vraie date de création, ou supprimer le champ.

### 2. Absence de `favicon.ico`
- **Problème** : Seul un `favicon.png` est configuré. Certains navigateurs et outils (Google Search Console) attendent un `/favicon.ico`.
- **Action** : Générer un `favicon.ico` 32×32 et l'ajouter dans `public/`.

---

## Améliorations recommandées

### 3. Balise `canonical` — vérification post-déploiement
- Les canonicals sont générés via `alternates` dans `generateMetadata`. Vérifier après déploiement que le `<head>` contient bien `<link rel="canonical">` absolu sur chaque page dynamique (services/[slug], renovation/[ville]).
- Commande de vérification : `curl -s https://aiman-renovation.fr/services/cuisine | grep canonical`

### 4. Images — audit des `alt` dans les composants sections
- Certaines images de contenu dans `components/sections/` pourraient avoir des `alt` insuffisamment descriptifs.
- Action : Audit manuel des composants `Hero`, `SavoirFaire`, `RealisationsGrid`.

### 5. Schema `WebSite` avec `SearchAction`
- Opportunité : Ajouter un schema WebSite avec SearchAction dans le layout pour activer la sitelinks searchbox Google. Nécessite une page de recherche fonctionnelle.

### 6. Pages de devis spécialisées — metadata à vérifier
- `/devis-cuisine`, `/devis-salle-de-bain`, `/devis-facade` existent mais n'ont pas été auditées.
- Action : Vérifier que chaque page a un title/description ciblé sur les mots-clés locaux.

### 7. Blog — cadence de publication
- Publier au minimum 2 articles par mois ciblant des requêtes longue-traîne (ex : "coût renovation salle de bain Mulhouse 2025", "prix isolation maison Alsace").

### 8. Google Business Profile (hors code)
- Vérifier que la fiche GBP est complète, vérifiée, et synchronisée avec les données du site.
- Catégories GBP recommandées : "Entrepreneur en rénovation", "Plombier", "Électricien", "Carreleur", "Peintre en bâtiment".

### 9. Core Web Vitals — scènes 3D mobile
- Les scènes Three.js/R3F peuvent dégrader le LCP sur mobile. Vérifier que `GPUFallback` se déclenche sur les appareils faibles.
- Action : Audit Lighthouse mobile sur la page d'accueil.

---

## Points forts à conserver

- Sitemap dynamique multi-locale (FR/DE/EN) avec alternates : OK
- hreflang sur toutes les pages : OK
- JSON-LD Organisation très complet : OK (à corriger sur foundingDate)
- 48+ pages villes France avec contenu unique : OK
- Pages Suisse et Allemagne en allemand : OK
- Robots.txt bloquant les crawlers IA : OK
- Images AVIF/WebP avec cache 1 an : OK
