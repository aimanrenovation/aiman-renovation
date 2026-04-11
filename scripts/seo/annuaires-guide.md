# Guide Inscription Annuaires — AIMAN RENOVATION

> **Date** : Avril 2026
> **Objectif** : Inscrire AIMAN RENOVATION sur tous les annuaires pertinents pour le SEO local tri-frontière (FR/CH/DE).

---

## Informations de l'entreprise (NAP)

```
Nom         : AIMAN RENOVATION
Adresse     : 11 rue de Bâle, 68300 Saint-Louis, France
Téléphone   : +33 6 33 49 69 25
Site web    : https://aiman-renovation.fr
Email       : contact@aiman-renovation.fr
SIRET       : SIRET_PLACEHOLDER
Catégories  : Entreprise de rénovation, Artisan du bâtiment, Rénovation intérieure, Rénovation extérieure
Horaires    : Lun-Ven 7h-18h, Sam 8h-12h
Zone        : Haut-Rhin (68), Bâle (Suisse), Lörrach (Allemagne)
```

---

## Automatisé (script)

Lancer le script pour générer les fichiers :

```bash
node scripts/seo/annuaires-submit.mjs
```

Fichiers générés :
- [x] `bing-places-bulk.csv` — Fichier CSV prêt pour l'import Bing Places
- [x] `output/listing-structured.json` — Données structurées JSON complètes
- [x] `output/pages-jaunes.txt` — Fiche copier-coller Pages Jaunes
- [x] `output/yelp.txt` — Fiche copier-coller Yelp
- [x] `output/houzz.txt` — Fiche copier-coller Houzz

---

## Manuel — Bing Places

1. Aller sur **[bingplaces.com](https://www.bingplaces.com)**
2. Se connecter avec un compte Microsoft
3. Cliquer **« Importer depuis un fichier »** (Import from file)
4. Uploader le fichier `scripts/seo/bing-places-bulk.csv`
5. Vérifier que toutes les colonnes sont correctement mappées
6. Soumettre — Bing vérifie en 3-7 jours (parfois par courrier ou téléphone)

---

## Manuel — Google Business Profile

> Le plus important de tous les annuaires pour le SEO local.

1. Aller sur **[business.google.com](https://business.google.com)**
2. Cliquer **« Gérer maintenant »**
3. Taper « AIMAN RENOVATION » — si l'entreprise n'apparaît pas, cliquer **« Ajouter votre entreprise »**
4. Remplir :
   - **Nom** : `AIMAN RENOVATION`
   - **Catégorie** : `Entreprise de rénovation`
   - **Adresse** : `11 rue de Bâle, 68300 Saint-Louis`
   - **Zone desservie** : ajouter `Mulhouse, Colmar, Huningue, Basel, Lörrach`
   - **Téléphone** : `+33 6 33 49 69 25`
   - **Site web** : `https://aiman-renovation.fr`
5. Ajouter les **horaires** : Lun-Ven 7h-18h, Sam 8h-12h
6. Ajouter la **description** :
   > Aiman Renovation — artisan de rénovation intérieure et extérieure à Saint-Louis (68300) et dans le Haut-Rhin. Salle de bain, cuisine, façade, peinture, électricité, plomberie. Devis gratuit sous 48h. Garantie décennale.
7. Ajouter **au minimum 5 photos** : logo, façade, chantiers réalisés
8. Lancer la **vérification** (courrier postal ~5 jours ou téléphone)
9. Une fois vérifié, ajouter les **services** individuellement :
   - Rénovation salle de bain
   - Rénovation cuisine
   - Peinture intérieure/extérieure
   - Ravalement de façade
   - Électricité
   - Plomberie

---

## Manuel — Apple Maps Connect

> Pas d'API — inscription manuelle uniquement.

1. Aller sur **[mapsconnect.apple.com](https://mapsconnect.apple.com)**
2. Se connecter avec un **Apple ID** (en créer un si nécessaire)
3. Cliquer **« Ajouter un nouveau lieu »**
4. Remplir :
   - **Nom** : `AIMAN RENOVATION`
   - **Adresse** : `11 rue de Bâle, 68300 Saint-Louis, France`
   - **Téléphone** : `+33 6 33 49 69 25`
   - **Site web** : `https://aiman-renovation.fr`
   - **Catégorie** : `Entrepreneur en rénovation` ou `Construction`
5. Vérifier la position sur la carte (déplacer le pin si nécessaire)
6. Soumettre — Apple vérifie en **1 à 7 jours**

---

## Manuel — Pages Jaunes

1. Aller sur **[pagesjaunes.fr/inscription](https://www.pagesjaunes.fr/inscription)**
2. Cliquer **« Créer un compte professionnel »**
3. Entrer le SIRET : `SIRET_PLACEHOLDER`
4. Remplir :
   - **Nom** : `AIMAN RENOVATION`
   - **Adresse** : `11 rue de Bâle, 68300 Saint-Louis`
   - **Téléphone** : `+33 6 33 49 69 25`
   - **Site web** : `https://aiman-renovation.fr`
   - **Catégorie** : `Entreprise de rénovation`
5. Ajouter la description (copier depuis `output/pages-jaunes.txt`)
6. Ajouter **5 photos minimum** (logo + chantiers)
7. Ajouter les horaires : Lun-Ven 7h-18h, Sam 8h-12h
8. **Valider par téléphone** (SMS ou appel au +33 6 33 49 69 25)
9. L'inscription gratuite de base est suffisante (ne pas payer les options premium sauf si budget dédié)

---

## Manuel — Yelp

1. Aller sur **[biz.yelp.fr](https://biz.yelp.fr)**
2. Cliquer **« Ajouter votre entreprise »**
3. Chercher d'abord si l'entreprise existe déjà
4. Si non, cliquer **« Ajouter une nouvelle entreprise »**
5. Remplir :
   - **Nom** : `AIMAN RENOVATION`
   - **Adresse** : `11 rue de Bâle, 68300 Saint-Louis, France`
   - **Téléphone** : `+33 6 33 49 69 25`
   - **Site web** : `https://aiman-renovation.fr`
   - **Catégorie** : `Rénovation intérieure` + `Rénovation extérieure`
6. Ajouter la description (copier depuis `output/yelp.txt`)
7. Ajouter des photos de réalisations
8. Valider le compte propriétaire par téléphone ou email

---

## Manuel — Houzz

1. Aller sur **[houzz.fr/pro](https://www.houzz.fr/pro)**
2. Cliquer **« Inscrivez votre entreprise »**
3. Créer un compte professionnel
4. Remplir :
   - **Nom** : `AIMAN RENOVATION`
   - **Type de pro** : `Entreprise générale de rénovation`
   - **Adresse** : `11 rue de Bâle, 68300 Saint-Louis`
   - **Téléphone** : `+33 6 33 49 69 25`
   - **Site web** : `https://aiman-renovation.fr`
5. Ajouter la description (copier depuis `output/houzz.txt`)
6. **Créer des projets** avec photos avant/après (très important sur Houzz)
7. Ajouter les spécialités :
   - Rénovation intérieure
   - Rénovation extérieure
   - Salle de bain
   - Cuisine
   - Façade
   - Peinture
8. Ajouter la zone d'intervention : Saint-Louis, Mulhouse, Colmar, Huningue, Basel, Lörrach

---

## Annuaires FR supplémentaires recommandés

### 118712.fr
1. Aller sur **[118712.fr](https://www.118712.fr)**
2. Chercher « Ajouter un professionnel » ou « Inscription gratuite »
3. Remplir les infos NAP (nom, adresse, téléphone)
4. Catégorie : `Entreprise de rénovation`

### Batiweb.com
1. Aller sur **[batiweb.com](https://www.batiweb.com)**
2. Créer un compte professionnel
3. Remplir la fiche entreprise avec les infos ci-dessus
4. Spécialité BTP : Rénovation tous corps d'état

### Habitatpresto.com
1. Aller sur **[habitatpresto.com](https://www.habitatpresto.com)**
2. S'inscrire comme professionnel
3. Remplir les infos + zone d'intervention
4. Ce site envoie des demandes de devis (leads payants — vérifier les tarifs)

### StarOfService.com
1. Aller sur **[starofservice.com](https://www.starofservice.com)**
2. S'inscrire comme professionnel
3. Choisir les services proposés : rénovation, peinture, plomberie, etc.
4. Zone : Saint-Louis + 50 km
5. Système de crédits pour répondre aux demandes

### Travaux.com
1. Aller sur **[travaux.com](https://www.travaux.com)**
2. S'inscrire comme artisan
3. Remplir les infos + spécialités
4. Zone d'intervention : Haut-Rhin (68)
5. Système de leads similaire à Habitatpresto

---

## Annuaires tri-frontiere (bonus)

Pour maximiser la visibilité dans la zone tri-frontière :

### local.ch (Suisse)
1. Aller sur **[local.ch](https://www.local.ch)**
2. Inscrire l'entreprise avec l'adresse française
3. Mentionner dans la description que vous intervenez à Bâle et environs

### Gelbe Seiten / Das Telefonbuch (Allemagne)
1. Aller sur **[gelbeseiten.de](https://www.gelbeseiten.de)**
2. Inscrire l'entreprise (utiliser la description en allemand)
3. Zone : Lörrach, Weil am Rhein

---

## Conseils importants

1. **Cohérence NAP** : Utiliser exactement les mêmes informations (nom, adresse, téléphone) sur TOUS les annuaires. La moindre différence nuit au SEO local.
2. **Photos** : Préparer au moins 10 photos de qualité (logo, équipe, chantiers avant/après).
3. **Avis clients** : Demander aux clients satisfaits de laisser un avis sur Google et Pages Jaunes.
4. **Mise à jour** : Vérifier les fiches tous les 3 mois pour s'assurer que les infos sont toujours correctes.
5. **Ne pas payer** pour les options premium au début — l'inscription gratuite suffit pour le SEO.
