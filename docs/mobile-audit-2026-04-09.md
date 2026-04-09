# Audit mobile responsive — 2026-04-09

> **Mission :** T1-SITE-SEO via Moniteur Vision.
> **Scope :** toutes zones hors formulaire devis (T4 travaille dessus en parallèle).
> **Breakpoints cibles :** 360px (Galaxy S), 375px (iPhone SE/12 mini), 390px (iPhone 15), 414px (iPhone Plus).

---

## Méthode

1. Subagent Explore lancé sur toutes les zones du site hors `components/devis/**`, `app/**/devis/**`, `lib/magicplan.ts`, `lib/validation*`.
2. Vérification manuelle sur les zones critiques et les trous de couverture du subagent (popup saisonnier, pages canton hub).
3. Fixes atomiques par zone, build Next.js complet avant chaque commit.

---

## Résumé des résultats

| Zone | Statut | Détail |
|---|---|---|
| Header / Navbar | ✅ OK | Breakpoints corrects, logo scaling, burger fonctionnel |
| Hero vidéo scroll-driven | ✅ OK | Canvas 500vh, text scaling responsive |
| Footer | ⚠️ P2 **→ FIXÉ** | Social icons 36px → 44px (WCAG 2.5.5) |
| Popup saisonnier (jardin) | ⚠️ P2 **→ FIXÉ** | Close button sous 44px, modal padding serré 360px |
| Pages villes FR | ✅ OK | Grille `md:grid-cols-2 lg:grid-cols-3`, fallback 1 col |
| Pages villes Suisse | ✅ OK | Same |
| Pages villes Allemagne | ✅ OK | Same |
| Pages hub canton BS/BL/SO | ✅ OK | `text-4xl md:text-6xl`, sections `py-20 px-6`, grid fallback |
| Blog articles | ✅ OK | Hero `h-[50vh] min-h-[320px]`, prose scaling OK |
| Page À propos | ✅ OK | Process section alternating flex responsive |
| Page Carrières | ✅ OK | Grille 1→2→4, modal centered |
| Page Partenaires | ✅ OK | Grille responsive |
| Page Avis | ✅ OK | Filtres `<span>` non-interactifs — pas de critère touch target |
| Pages services (liste + détail) | ✅ déjà fixé | Voir commit `1d3ddf9` (padding hero + title scaling) |

**Total issues :** 2 P2 trouvés, **2 fixés**. 0 P0, 0 P1.

---

## Fixes appliqués

### 1. Footer — Social icons touch targets
**Commit :** `071406a`
**Fichier :** `components/layout/footer.tsx`

Avant : `w-9 h-9` (36px) sur les 4 icônes sociales (Facebook, Instagram, LinkedIn, TikTok).
Après : `w-11 h-11` (44px), conforme WCAG 2.5.5 minimum.

### 2. Popup saisonnier jardin — Close button + modal padding
**Commit :** `071406a`
**Fichier :** `components/seasonal-popup.tsx`

- Close button : ajout de `p-2.5` autour de `X w-5 h-5` → zone tactile ~44px (était ~20px).
- Modal : `p-8` constant → `p-6 sm:p-8` pour libérer 16px horizontal sur les viewports 360px.
- Ajout de `aria-label="Close"` pour l'accessibilité.

### 3. Pages services (déjà fixé la session précédente)
**Commit :** `1d3ddf9`
**Fichiers :** `app/[locale]/services/[slug]/page.tsx`, `components/services/services-page-content.tsx`

- Hero détail service : `pt-40 pb-20` → `pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20` (gagne 48–96px de contenu utile sur mobile).
- Hero liste services : `text-4xl sm:text-5xl md:text-7xl` → `text-3xl sm:text-5xl md:text-7xl`.

---

## Non-issues et faux positifs

- **Filtres page Avis** : le subagent signalait un risque d'overflow sur les filter pills. Vérification : les pills sont des `<span>` purement décoratifs (pas d'interactivité), `flex flex-wrap` les gère déjà correctement. Aucun fix.
- **Grille villes Suisse** : le subagent suggérait `grid-cols-1 sm:grid-cols-2`. Vérification : le layout existant `grid md:grid-cols-2 lg:grid-cols-3` a bien un fallback implicite à 1 colonne sous `md`. Aucun fix.
- **Pages hub canton** : le subagent ne les a pas trouvées. Elles existent bien à `app/[locale]/renovierung-schweiz/kanton/[kanton]/page.tsx` (BS, BL, SO). Check manuel : responsive OK.
- **Popup saisonnier** : le subagent ne l'a pas trouvé. Il existe à `components/seasonal-popup.tsx` et est importé dans le layout. Check manuel + fix appliqué.

---

## Zones intentionnellement non touchées

Sur ordre du Moniteur Vision (T4 travaille en parallèle sur le formulaire devis et son upload) :

- `app/[locale]/devis/**`
- `app/api/devis/**`
- `components/devis/**`
- `lib/magicplan.ts`
- `lib/validation*`

Si des bugs responsive existent dans ces zones, ils sont à remonter à T4 via son propre audit.

---

## Prochaines actions recommandées

1. **Test device réel** : passer sur un iPhone SE (375px) et un petit Android (360px) en conditions réelles pour valider les fixes.
2. **Lighthouse mobile** : lancer un audit Lighthouse mobile post-deploy pour capturer d'éventuels problèmes de CLS / touch target restants.
3. **Mode paysage** : le mode paysage mobile n'a pas été audité explicitement ; certains `min-h-[85vh]` sur les heros pourraient poser problème en landscape. À checker si des reports utilisateurs remontent.

---

*Rapport généré par T1-SITE-SEO sous commandement du Moniteur Vision.*
