# 05 — Stratégie Google.ch : domination Bâle / Suisse 🇨🇭

> **ROI** : 🔥🔥🔥 La clientèle suisse paye 30-50% de plus en moyenne. Bâle = 200k habitants à 5 km de Saint-Louis.
> **Temps total** : 2-3h sur 1 mois
> **Cible** : top 10 sur "Renovierung Basel" et "rénovation Bâle" en 90 jours

---

## Pourquoi google.ch est différent de google.fr

Google traite chaque ccTLD (`.fr`, `.ch`, `.de`) comme un index séparé. Notre site `aiman-renovation.fr` est par défaut associé à google.fr. Pour ranker sur google.ch, on a besoin de signaux supplémentaires :

1. ✅ **hreflang** déjà en place pour `de-CH` et `fr-CH`
2. ⏳ **Google Business Profile** secondaire ciblant Bâle (à créer)
3. ⏳ **Backlinks .ch** depuis sites suisses (annuaires, partenaires)
4. ⏳ **Mentions de villes suisses** dans le contenu (déjà fait — 16 pages villes Suisse)
5. ⏳ **Structured data avec areaServed** étendu à la Suisse (déjà fait)

---

## A. Vérifier la config existante

### 1. hreflang
```bash
curl -s https://aiman-renovation.fr/sitemap.xml | grep -E "hreflang.*ch|de-CH|fr-CH" | head -5
```

Doit contenir :
- `hreflang="de-CH"` pour la version DE pour Suisse
- `hreflang="fr-CH"` (optionnel mais utile)
- `hreflang="x-default"` pour fallback

### 2. Schema.org areaServed
Dans le JSON-LD du site, vérifier :
```json
"areaServed": [
  {
    "@type": "Country",
    "name": "Switzerland"
  },
  {
    "@type": "City",
    "name": "Basel"
  }
]
```

### 3. Pages villes Suisse
Vérifier que les 16 pages villes suisses sont bien indexables et linkées :
```
/de/staedte/basel
/de/staedte/binningen
/de/staedte/birsfelden
/de/staedte/muttenz
/de/staedte/pratteln
/de/staedte/reinach-bl
... (16 au total)
```

---

## B. Google Business Profile — Service Area Business (SAB)

### Créer un GBP "Service Area" pour la Suisse

⚠️ **Important** : pas de double fiche pour la même entreprise. Mais on peut :
- Ajouter la **Suisse** comme zone de service sur la fiche existante
- Lister explicitement les villes suisses

**Procédure** :
1. Google Business Profile → fiche AIMAN RENOVATION
2. Info → **Service Area**
3. Ajouter : Basel, Binningen, Birsfelden, Muttenz, Pratteln, Reinach BL, Allschwil, Bottmingen, Oberwil, Riehen, Bettingen, Liestal, Aesch, Arlesheim, Münchenstein, Therwil
4. Ajouter aussi : **Canton de Bâle-Ville**, **Canton de Bâle-Campagne**

**Catégories à ajouter** :
- Renovierungsunternehmen (entreprise de rénovation)
- Maler (peintre)
- Plattenleger (carreleur)
- Sanitärinstallateur (plombier)

**Description en allemand** (à ajouter en plus du français) :
> AIMAN RENOVATION — Ihr zuverlässiger Renovierungspartner aus Saint-Louis (Frankreich), nur 5 km von Basel entfernt. Komplettrenovierung, Malerarbeiten, Plattenleger, Sanitär, Elektro. Kostenlose Offerte innerhalb von 48 Stunden. Wir sprechen Deutsch und Französisch.

---

## C. Annuaires Suisse prioritaires (rappel du fichier 02)

| # | Annuaire | URL | Action |
|---|---|---|---|
| 1 | **local.ch** | https://welcome.local.ch | Inscription gratuite — DA 88 |
| 2 | **search.ch** | https://www.search.ch | Inscription via Swisscom Directories |
| 3 | **moneyhouse.ch** | https://www.moneyhouse.ch | Inscription B2B |
| 4 | **renovero.ch** | https://www.renovero.ch | Plateforme renovation suisse — leads |
| 5 | **buildigo.ch** | https://www.buildigo.ch | Marketplace artisans CH |
| 6 | **houzz.ch** | https://www.houzz.ch/pro | Vitrine pro avec photos |
| 7 | **renovating.ch** | https://www.renovating.ch | Annuaire spécialisé |

---

## D. Stratégie contenu — Pages cantonales

Créer (ou enrichir) ces pages :

### Pages cibles à compléter
- [ ] `/de/staedte/basel` — Page hub Bâle (top niveau)
- [ ] `/de/kantone/basel-stadt` — NOUVEAU — Canton de Bâle-Ville
- [ ] `/de/kantone/basel-landschaft` — NOUVEAU — Canton de Bâle-Campagne

### Mots-clés cibles allemands
| Mot-clé | Volume mensuel CH | Difficulté |
|---|---|---|
| Renovierung Basel | 880 | Moyenne |
| Maler Basel | 1,200 | Élevée |
| Badezimmer Renovierung Basel | 320 | Faible |
| Küche renovieren Basel | 480 | Moyenne |
| Renovationsfirma Basel | 210 | Faible |
| Komplettsanierung Basel | 170 | Faible |
| Renovierung günstig Basel | 90 | Très faible ⭐ |
| Französische Handwerker Basel | 30 | Très faible ⭐ |

> ⭐ = quick wins à attaquer en priorité

### Mots-clés cibles français-CH
- "rénovation Bâle" (+ "Bâle-Ville", "Bâle-Campagne")
- "entreprise rénovation Suisse Bâle"
- "rénovation transfrontalière France Suisse"

---

## E. Backlinks .ch ciblés

**Stratégie spéciale Suisse** :

### Cibles prioritaires
1. **Chambre de Commerce France-Suisse (CCIFS)** : https://www.ccifs.ch
   - Inscription possible si entreprise FR avec activité CH
   - DA 55, fort signal

2. **Pôle Métropolitain Trinational** : https://www.eurodistrictbasel.eu
   - Annuaire entreprises transfrontalières
   - DA 50

3. **Canton de Bâle-Ville Wirtschaftsförderung** : https://www.bs.ch/wirtschaft
   - Page artisans frontaliers — demander inscription

4. **Forums BTP suisses** :
   - https://forum.cadwork.com
   - https://www.swissrenovation.com
   - **Stratégie** : participer aux discussions, signature avec lien (sans spam)

5. **Articles sponsorisés presse CH** :
   - Basler Zeitung (BaZ) : article rénovation transfrontalière
   - 20 minutes Basel : sujet "où trouver des artisans français pour rénover à Bâle"

---

## F. Google Ads complémentaire (budget 50€/mois)

Pour accélérer le ranking sur les mots-clés cantonaux suisses :

**Campagne dédiée** :
- **Région cible** : 25 km autour de Bâle
- **Langue** : allemand + français
- **Mots-clés exact match** :
  - [Renovierung Basel]
  - [Renovationsfirma Basel-Stadt]
  - [Badezimmer renovieren Basel]
  - [französische Handwerker Basel]
- **Budget** : 50 €/mois
- **Page de destination** : `/de/staedte/basel`

**Objectif Ads** : drainer du trafic qualifié + signaux d'engagement → boost SEO indirect

---

## G. Google Search Console — Targeting Suisse

1. Search Console → **Settings → International Targeting**
2. **Country** : ne PAS associer à un seul pays (laisser "unlisted") car le site sert FR + CH + DE
3. **Language** : vérifier que les pages `/de/*` apparaissent en allemand dans la query Performance

---

## H. Vérification ranking Suisse

**Outils gratuits** :
- **SE Ranking** (essai gratuit) : tracking de positions sur google.ch
- **Google Search Console** : filtrer par pays = Switzerland
- **Test manuel** : VPN suisse + recherche en navigation privée sur google.ch

**Mots-clés à tracker chaque semaine** :
1. Renovierung Basel
2. Komplettrenovierung Basel-Stadt
3. Badezimmer Renovierung Basel günstig
4. Französische Handwerker Basel
5. rénovation Bâle France
6. entreprise rénovation Saint-Louis Bâle

---

## ✅ Checklist 30 jours

### Semaine 1
- [ ] Vérifier hreflang sitemap (de-CH présent)
- [ ] GBP : ajouter 16 villes suisses en service area
- [ ] GBP : description allemande ajoutée
- [ ] local.ch : inscription faite

### Semaine 2
- [ ] search.ch : inscription faite
- [ ] houzz.ch : vitrine pro créée avec 10 photos chantiers
- [ ] renovero.ch : profil créé
- [ ] CCIFS contactée pour inscription

### Semaine 3
- [ ] 2 pages cantonales créées (Basel-Stadt + Basel-Landschaft)
- [ ] 1 article blog en allemand : "Renovieren in Basel — Vorteile französischer Handwerker"
- [ ] Google Ads campagne Suisse lancée

### Semaine 4
- [ ] Suivi positions sur les 6 mots-clés cibles
- [ ] 1 article presse local CH démarché
- [ ] Bilan : nombre d'impressions Google.ch dans Search Console

---

## 🎯 KPIs 90 jours

| KPI | Baseline | Cible J+90 |
|---|---|---|
| Impressions Google.ch | ~0 | 1,000+ /mois |
| Clics depuis Suisse | ~0 | 50+ /mois |
| Position moy. "Renovierung Basel" | >50 | Top 20 |
| Backlinks .ch | 0 | 5+ |
| Demandes devis depuis CH | quelques | 5+ /mois |

---

> **Suivant** : `README.md` (vue d'ensemble Phase 4)
