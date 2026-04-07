# 01 — Google Search Console : soumission sitemap

> **ROI** : 🔥🔥🔥 Action #1 absolue. Sans ça, les 268 pages SEO créées sont invisibles à Google.
> **Temps** : 10 min

---

## A. Vérifier la propriété du domaine

1. Aller sur **https://search.google.com/search-console/welcome**
2. Choisir **"Domain"** (pas URL prefix) — saisir : `aiman-renovation.fr`
3. Google demande un enregistrement **TXT** sur le DNS
4. Le copier puis aller sur **IONOS** → DNS du domaine `aiman-renovation.fr` → ajouter :
   - **Type** : TXT
   - **Hôte** : `@`
   - **Valeur** : `google-site-verification=XXXXXXXXXXXXXXX`
   - **TTL** : 1h
5. Attendre 5-15 min puis cliquer **"Verify"** dans Search Console

> ⚠️ Si déjà vérifié via un autre compte Google, passer directement au point B.

---

## B. Soumettre le sitemap

1. Dans Search Console, menu gauche → **Sitemaps**
2. Champ "Add a new sitemap" → coller : `sitemap.xml`
3. Cliquer **Submit**
4. Statut attendu sous 24h : **"Success — 324 URLs discovered"**

**URL complète du sitemap** : `https://aiman-renovation.fr/sitemap.xml`
**324 URLs indexables** (multilingue FR/DE/EN avec hreflang)

---

## C. Forcer l'indexation des pages prioritaires

Pour les **20 pages business critiques**, utiliser **URL Inspection** dans Search Console :

```
https://aiman-renovation.fr/
https://aiman-renovation.fr/devis
https://aiman-renovation.fr/services/peinture
https://aiman-renovation.fr/services/sols-carrelage
https://aiman-renovation.fr/services/renovation-complete
https://aiman-renovation.fr/services/isolation
https://aiman-renovation.fr/services/facade
https://aiman-renovation.fr/services/cuisine
https://aiman-renovation.fr/services/salle-de-bain
https://aiman-renovation.fr/services/electricite
https://aiman-renovation.fr/services/plomberie
https://aiman-renovation.fr/villes/saint-louis-68
https://aiman-renovation.fr/villes/mulhouse
https://aiman-renovation.fr/villes/huningue
https://aiman-renovation.fr/villes/saint-louis
https://aiman-renovation.fr/de/staedte/basel
https://aiman-renovation.fr/de/staedte/weil-am-rhein
https://aiman-renovation.fr/avis
https://aiman-renovation.fr/blog
https://aiman-renovation.fr/realisations
```

**Procédure pour chaque URL** :
1. Coller dans la barre "Inspect any URL"
2. Si "URL is not on Google" → cliquer **"Request indexing"**
3. Attendre confirmation (10-30 sec)

> 💡 Limite Google : ~10 demandes manuelles/jour. Étaler sur 2 jours.

---

## D. Configuration internationale (hreflang)

Le sitemap inclut déjà les `<xhtml:link rel="alternate" hreflang="...">` pour FR/DE/EN.

**Vérification** :
1. Search Console → **International Targeting** → onglet **"Language"**
2. Statut attendu : ✅ **"No errors"**

Si erreurs hreflang :
```bash
# Tester le sitemap multilingue
curl -s https://aiman-renovation.fr/sitemap.xml | grep -A 3 "hreflang" | head -20
```

---

## E. Search Console — KPIs à surveiller (1x / semaine)

| KPI | Où | Action si mauvais |
|---|---|---|
| **Pages indexées** | Indexing → Pages | Doit monter à 250+ en 30 jours |
| **Impressions** | Performance → Search results | Croissance attendue : +20-50%/semaine |
| **CTR moyen** | Performance | Cible : >3% (sinon revoir titles/descriptions) |
| **Position moyenne** | Performance | Top 20 sur "rénovation Saint-Louis 68" en 60 jours |
| **Core Web Vitals** | Experience → CWV | Tout en vert (déjà optimisé) |

---

## F. Alertes à activer

**Settings → Users and Permissions → Email notifications** :
- ☑ Critical issues
- ☑ New issues detected
- ☑ Indexing improvements

Email : `contact@aiman-renovation.fr`

---

## ✅ Checklist finale

- [ ] Propriété domaine vérifiée (TXT IONOS)
- [ ] Sitemap soumis et "Success"
- [ ] 20 URLs prioritaires demandées en indexation
- [ ] Hreflang validé dans International Targeting
- [ ] Alertes email activées
- [ ] Date première soumission notée : `__/__/____`

> **Suivant** : `02-citations-locales.md`
