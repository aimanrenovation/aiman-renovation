# 🚨 HOTFIX PRIORITAIRE — Bug MagicPlan en prod

**Priorité : CRITIQUE — bug prod signalé par Aiman le 2026-04-08**
**Assigné par : Moniteur Vision → T1-SITE-SEO**

## ✅ STATUT 2026-04-08 21h52
- **Fix 1 DONE** — App Store + Play Store buttons live en prod (commit `d706713`, deploy `8u4a5ppdj`)
- **Fix 2 BLOQUÉ** — attente décision Aiman : option A (lien partage public API), B (workflow email recommandé), C (QR + instructions)
- **Fix 3 TODO** — vérifier `vercel logs --prod | grep magicplan` pour confirmer les erreurs

## 📢 Symptômes rapportés par Aiman

1. **Les clients ne peuvent pas télécharger MagicPlan** depuis la page devis
2. **Quand certains y arrivent, message "projet introuvable"**

## 🔍 Diagnostic du Moniteur Vision

### Bug 1 — Aucun fallback install

**Fichier :** `components/devis/steps/step-success.tsx` lignes 62-67

Le bouton MagicPlan utilise uniquement le deep link custom :
```tsx
<a href={deepLink}>  // magicplanstd://project/XXX
```

**Problème :**
- `magicplanstd://` est un **schéma custom iOS/Android**
- Si l'app n'est pas installée → le lien échoue silencieusement (iPhone) ou ouvre rien (Android)
- **Aucun lien de téléchargement vers App Store / Play Store** n'est affiché
- C'est pour ça que les clients "ne peuvent pas télécharger" → il n'y a nulle part où aller

### Bug 2 — "Projet introuvable"

**Fichiers :** `lib/magicplan.ts` + `app/api/devis/route.ts`

Le projet est créé côté serveur avec les credentials Aiman :
```ts
customer: process.env.MAGICPLAN_CUSTOMER_ID,  // compte AIMAN
key: process.env.MAGICPLAN_API_KEY,
```

Puis le deep link `magicplanstd://project/${project.id}` est envoyé au client. Quand le client ouvre MagicPlan **avec son propre compte**, l'app cherche ce `projectId` dans SES projets → **introuvable**, car le projet appartient au compte AIMAN.

**Confirmation probable** : `magicplanstd://` est le schéma **MagicPlan Standard (pro)**. Le grand public a "MagicPlan" qui utilise `magicplan://`. Double cause de fail.

## ✅ Plan de fix proposé

### Fix 1 (rapide, obligatoire) — Ajouter fallback install

Dans `step-success.tsx`, ajouter sous le deep link :

```tsx
<div className="flex gap-2 mt-4">
  <a href="https://apps.apple.com/app/magicplan/id427424432"
     target="_blank" rel="noopener"
     className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg text-center">
    📱 iOS App Store
  </a>
  <a href="https://play.google.com/store/apps/details?id=com.sensopia.magicplan"
     target="_blank" rel="noopener"
     className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg text-center">
    🤖 Play Store
  </a>
</div>
```

Et ajouter une détection fallback (optionnel) : si après 2s l'app n'a pas ouvert, rediriger vers le store.

### Fix 2 (critique) — Régler "projet introuvable"

**Trois options**, à discuter avec Aiman selon docs MagicPlan API :

**Option A — Lien de partage public**
Vérifier dans la doc MagicPlan API v2 s'il existe un endpoint `POST /projects/{id}/share` qui retourne un lien d'invitation/partage public. C'est la vraie solution.

**Option B — Retirer le deep link, laisser le client créer son projet**
Le client télécharge MagicPlan, crée son propre projet, scanne, et envoie le plan directement à Aiman. Le webhook MagicPlan attrape le plan via l'email `contact@aiman-renovation.fr` (déjà configuré dans `lib/magicplan.ts:29`).

**Option C — Fallback QR code avec instructions**
Garder le QR code + texte clair "Scannez avec l'app MagicPlan pour ouvrir le projet (si déjà connecté avec votre compte pro)". Et dire aux clients normaux : "Téléchargez MagicPlan, scannez votre logement, envoyez le plan à contact@aiman-renovation.fr".

**Recommandation Moniteur Vision : Option B** (la plus simple, aligne avec le webhook existant qui accepte déjà les plans par email).

### Fix 3 (vérif) — Logs Vercel

Lancer `vercel logs --prod` pour voir :
- Erreurs récentes sur `/api/devis`
- Erreurs sur `/api/magicplan/webhook`
- Voir si `createMagicPlanProject` échoue souvent

## 🎯 Plan d'action pour T1-SITE-SEO

1. **Vérifier les logs Vercel** → confirmer le diagnostic
2. **Fix 1 immédiat** → ajouter liens App Store / Play Store (push rapide, déblocage clients)
3. **Demander à Aiman** quelle option (A/B/C) appliquer pour Fix 2
4. **Tester en preview Vercel** avant push en prod
5. **Reporter à Moniteur Vision** via `~/.claude/INCIDENTS.md` ou mémoire si blocage

## 📚 Contexte complet

- Lib : `lib/magicplan.ts`
- Webhook : `app/api/magicplan/webhook/route.ts`
- Route devis : `app/api/devis/route.ts`
- UI success : `components/devis/steps/step-success.tsx`
- Plan d'origine : `docs/superpowers/plans/2026-04-06-magicplan-api.md`
- Spec : `docs/superpowers/specs/2026-04-06-magicplan-api-design.md`
- Credentials : `.env.local` et Vercel env (`MAGICPLAN_API_KEY`, `MAGICPLAN_CUSTOMER_ID`)

## ⚠️ Règles

- Commit + push après CHAQUE fix
- Tester en preview Vercel AVANT prod (`vercel` puis `vercel --prod` seulement si OK)
- Si blocage sur docs MagicPlan API : lire `docs/superpowers/specs/2026-04-06-magicplan-api-design.md` ou fetch `https://cloud.magicplan.app/api/v2/docs`
- **NE PAS** hardcoder de clés API

---
*Dossier de hotfix préparé par le Moniteur Vision — T1 prends la main*
