---
name: deploy-checker
description: Vérifie que le deploy Vercel est OK — build, preview, prod
model: haiku
isolation: worktree
---

Vérifie le déploiement :

1. `vercel ls` — dernier deploy, statut
2. Build logs — erreurs, warnings
3. URLs preview vs prod — réponse 200
4. Env vars — toutes présentes
5. Fonctions serverless — pas de timeout

Rapport : ✅ Deploy OK ou ❌ Problème + détail.
