# Configuration SEO Monitor

## Option 1 : Google Search Console API (automatisé)

1. Créer un projet Google Cloud sur https://console.cloud.google.com
2. Activer l'API Search Console (Search Console API)
3. Créer un compte de service (IAM > Comptes de service)
4. Télécharger le fichier JSON de clé
5. Ajouter le compte de service comme utilisateur dans Search Console
   - Aller sur https://search.google.com/search-console
   - Paramètres > Utilisateurs et autorisations > Ajouter un utilisateur
   - Utiliser l'email du compte de service (ex: xxx@projet.iam.gserviceaccount.com)
   - Donner les droits "Lecture seule"
6. Définir les variables d'environnement :
   ```bash
   export GOOGLE_SEARCH_CONSOLE_KEY_FILE=/path/to/key.json
   export GSC_SITE_URL=https://aiman-renovation.fr
   ```

## Option 2 : Mode manuel

Lancer :
```bash
node scripts/seo/seo-monitor.mjs --manual
```
Cela génère un template à remplir manuellement avec les 20 mots-clés à vérifier.

## Installation des dépendances

```bash
npm install googleapis
```

## Utilisation

```bash
# Mode automatique (nécessite les credentials GSC)
node scripts/seo/seo-monitor.mjs

# Mode manuel (pas de credentials nécessaires)
node scripts/seo/seo-monitor.mjs --manual
```

## Planification

Recommandé : exécuter 1x par semaine (lundi matin)

```bash
# Cron (ajuster le chemin)
0 8 * * 1 cd /path/to/aiman-renovation && node scripts/seo/seo-monitor.mjs
```
