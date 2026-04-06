# Intégration MagicPlan API

## Résumé

Remplacer le wizard MagicPlan 5 étapes par une intégration API complète :
deep link automatique après soumission du devis, webhook pour recevoir les plans scannés,
stockage S3 Scaleway, notification Jarvis WhatsApp.

## Décisions

- **Flow** : Devis d'abord → MagicPlan ensuite (deep link avec projet pré-créé)
- **Architecture** : Webhook direct sur le site (Approche A)
- **Stockage** : S3 Scaleway (bucket existant)
- **Notifications** : Jarvis WhatsApp + email enrichi

## Flow complet

1. Client remplit devis (zones, travaux, contact, photos)
2. Client soumet le formulaire
3. `POST /api/devis` → envoie emails (existant) + crée projet MagicPlan via API REST
4. Réponse inclut le deep link `magicplanstd://project/{id}`
5. Page de confirmation affiche le deep link + QR code
6. Client ouvre MagicPlan → scanne ses pièces → appuie "Exporter"
7. MagicPlan `POST /api/magicplan/webhook`
8. Webhook : télécharge fichiers (PDF, SVG, JPG) → upload S3 Scaleway
9. Webhook : notifie Jarvis via WhatsApp + envoie email enrichi à Aiman

## API MagicPlan utilisée

- **Auth** : headers `customer` + `key`
- **Base URL** : `https://cloud.magicplan.app/api/v2`
- **Créer projet** : `POST /projects` avec `name`, `external_reference_id`, `address_1`, `city`, `zip`
- **Deep link** : `magicplanstd://project/{projectId}`
- **Webhook** : configuré via `PUT /workspace` (champ `webhook_url`)
- **Payload webhook** : `key`, `email`, `title`, `planid`, `project_id`, `pdf`, `jpg0..N`, `svg0..N`, `xml`
- **URLs fichiers** : valides 60 minutes

## Nouveaux fichiers

| Fichier | Rôle |
|---------|------|
| `lib/magicplan.ts` | Client API MagicPlan (auth, create project) |
| `lib/s3.ts` | Client S3 Scaleway (upload fichiers webhook) |
| `app/api/magicplan/webhook/route.ts` | Endpoint webhook |
| `components/devis/magicplan-confirmation.tsx` | UI post-soumission : deep link + QR code |

## Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `app/api/devis/route.ts` | Après emails → créer projet MagicPlan |
| `components/devis/panels/panel-recap.tsx` | Retirer wizard 5 étapes, simplifier |
| `components/devis/devis-blueprint.tsx` | Afficher confirmation MagicPlan après soumission |
| `messages/{fr,de,en}.json` | Nouvelles clés confirmation MagicPlan |

## Sécurité webhook

Vérifier `key === MAGICPLAN_API_KEY` dans le payload. Si invalide → 401.

## Stockage S3

```
s3://bucket/magicplan/{external_reference_id}/
  ├── plan.pdf
  ├── floor-0.svg
  ├── floor-0.jpg
  └── metadata.json
```

## Notification Jarvis

POST webhook Jarvis avec : nom client, lien S3 PDF, nombre pièces, `external_reference_id`.

## Env vars nécessaires

- `MAGICPLAN_API_KEY` (existe)
- `MAGICPLAN_CUSTOMER_ID` (existe)
- `SCW_ACCESS_KEY` / `SCW_SECRET_KEY` / `SCW_BUCKET` (à vérifier)
- `JARVIS_WEBHOOK_URL` (à ajouter)
