# Configuration Mode Voiture -- CarPlay / iOS

## Comment ca marche

Quand Aiman se connecte a CarPlay (ou active un raccourci iOS), son iPhone envoie automatiquement une requete a Jarvis. Jarvis repond par WhatsApp avec :

- Prochain rendez-vous (nom client, heure)
- Lien GPS (Waze deeplink + Google Maps)
- Resume du dossier client
- Materiel a avoir
- Temps de trajet estime

## Configuration du raccourci iOS

### Etape 1 : Creer le raccourci

1. Ouvrir l'app **Raccourcis** sur iPhone
2. Appuyer sur **+** pour creer un nouveau raccourci
3. Nommer le raccourci : **"Jarvis Mode Voiture"**

### Etape 2 : Ajouter l'action

1. Chercher **"Obtenir le contenu de l'URL"** (Get Contents of URL)
2. Configurer :
   - **URL** : `https://aiman-renovation.fr/api/jarvis/carplay`
   - **Methode** : POST
   - **En-tetes** :
     - `Authorization` : `Bearer VOTRE_CARPLAY_SECRET`
     - `Content-Type` : `application/json`
   - **Corps** : JSON -> `{}`

### Etape 3 : Configurer le declencheur automatique

1. Aller dans l'onglet **Automatisation**
2. Appuyer sur **+** -> **Creer une automatisation personnelle**
3. Choisir le declencheur : **"CarPlay"** -> **"Se connecte"**
4. Action : **Executer le raccourci** -> **"Jarvis Mode Voiture"**
5. Desactiver **"Demander avant d'executer"** pour que ce soit automatique

### Alternative : Declencheur Bluetooth

Si pas de CarPlay :
1. Declencheur : **"Bluetooth"** -> Se connecte a **[nom du systeme audio voiture]**
2. Meme action que ci-dessus

### Etape 4 : Configurer la variable d'environnement Vercel

```bash
vercel env add CARPLAY_SECRET production
# Entrer un token secret (ex: generer avec `openssl rand -hex 32`)
```

## Test manuel

```bash
curl -X POST https://aiman-renovation.fr/api/jarvis/carplay \
  -H "Authorization: Bearer $CARPLAY_SECRET" \
  -H "Content-Type: application/json"
```

## Commandes vocales alternatives

En plus du declencheur automatique, Aiman peut envoyer par WhatsApp :
- "je suis en voiture"
- "mode voiture"
- "en route"
- "prochain rdv"

Jarvis repond avec le meme briefing.

## Variables d'environnement requises

| Variable | Description | Ou |
|----------|-------------|-----|
| CARPLAY_SECRET | Token d'authentification du raccourci iOS | Vercel |
| JARVIS_API_URL | URL de l'API Jarvis (optionnel si webhook) | Vercel |
| JARVIS_API_KEY | Cle API Jarvis (optionnel) | Vercel |
| EMPLOYES_WEBHOOK_URL | Fallback webhook vers Jarvis | Vercel (deja configure) |
