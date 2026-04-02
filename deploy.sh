#!/bin/bash
set -e

echo "=== 1. Commit du site ==="
cd /Users/Aiman/aiman-renovation
git add -A
git commit -m "feat: site complet aiman-renovation.fr" || echo "Déjà commité"

echo ""
echo "=== 2. Création repo GitHub ==="
gh repo create aiman-renovation --public --source=. --push 2>/dev/null || {
  echo "Repo existe déjà, on push..."
  git remote add origin https://github.com/aimanrenovation/aiman-renovation.git 2>/dev/null || true
  git push -u origin main
}

echo ""
echo "=== 3. Déploiement Vercel ==="
npx vercel --yes --prod

echo ""
echo "=== TERMINÉ ==="
echo "Le site est déployé ! L'URL est affichée ci-dessus."
echo "Prochaine étape : pointer le domaine aiman-renovation.fr dans Vercel."
