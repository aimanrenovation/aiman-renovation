# Portail Employés — Design

## Résumé

Ajouter au site aiman-renovation.fr un **espace employés** (login par ID/MDP) où les
équipes terrain consultent leur planning, pointent leurs heures, rédigent un rapport
journalier, uploadent des photos de chantier et signalent le matériel manquant.
Chaque événement est relayé à **Super Jarvis** via webhook pour dispatch vers les
agents concernés (comptable, CM, planning).

Mobile-first, offline-tolérant sur le pointage, intégré au design existant (palette
`#E50000`, composants shadcn/ui, layout Next.js 16 App Router, i18n `next-intl`).

## Décisions

- **Stack** : Next.js 16.2.2 App Router (déjà en place) + Route Handlers pour l'API.
- **DB** : **Neon Postgres** via Vercel Marketplace (Postgres natif, Fluid Compute, 0 config).
  - Driver : `@neondatabase/serverless` (HTTP, compatible Fluid Compute).
  - ORM : **Drizzle** (léger, TS-first, migrations SQL versionnées — pas Prisma pour
    éviter l'overhead de génération).
- **Auth** : **custom JWT** (pas NextAuth ni Clerk).
  - Raison : contrôle total, pas de dépendance tierce, cohérent avec le flow RBAC
    interne (employe / chef_chantier / patron), coût zéro.
  - Libs : `jose` (JWT sign/verify, Web Crypto, compatible Fluid Compute) + `bcryptjs`
    (hash passwords, pas `bcrypt` natif pour rester portable).
- **Storage photos** : S3 Scaleway existant (bucket `aiman-renovation`), préfixe
  `employes/{employe_id}/{chantier_id}/{date}/`.
- **Webhook Jarvis** : `POST https://webhook.aiman-renovation.fr/employes-event`,
  HMAC-SHA256 signé via header `X-Jarvis-Signature`.
- **i18n** : l'espace employés est **FR uniquement** (équipe francophone). Pas de
  traduction DE/EN pour cette section → routes hors `[locale]`.
- **Mobile-first** : viewport fixe, tap targets ≥ 44px, bouton caméra natif via
  `<input type="file" accept="image/*" capture="environment">`.
- **Géolocalisation stricte** : `navigator.geolocation` au pointage avec **vérification
  distance Haversine** contre `chantiers.lat_chantier/lng_chantier` et rayon
  `chantiers.radius_m` (default 500m). Flags calculés : `on_site` / `no_geo` /
  `distance_m`. Hors zone ou refus → event `pointage_off_site` → alerte WhatsApp Jarvis.
- **Géocoding chantiers** : **Mapbox Geocoding API** (gratuit jusqu'à 100k req/mois,
  préféré à Google). Fallback : **Nominatim OSM** si quota dépassé. Géocoding fait à
  la création/maj d'un chantier (pas à chaque pointage).
- **RGPD** : CGU employés obligatoires. Checkbox consentement (géoloc + traitement
  données) au **premier login** — bloquant tant que non cochée.

## Architecture fichiers

```
app/
├── (employes)/                        # Route group hors [locale] — FR only
│   └── espace-employes/
│       ├── layout.tsx                 # Shell mobile (header sticky, bottom nav)
│       ├── login/page.tsx             # Public
│       ├── dashboard/page.tsx         # Aperçu du jour
│       ├── planning/page.tsx          # Calendrier mensuel
│       ├── pointage/page.tsx          # Start/stop + géoloc
│       ├── rapport/page.tsx           # Form rapport + photos + matériel
│       └── historique/page.tsx        # Pointages + rapports passés
├── api/
│   └── employes/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── reset-password-request/route.ts
│       │   └── reset-password/route.ts
│       ├── me/route.ts
│       ├── planning/route.ts
│       ├── pointage/route.ts          # POST (start/stop) + GET (list)
│       ├── rapport/route.ts           # POST + GET
│       ├── photos/route.ts            # POST multipart
│       ├── materiel/route.ts
│       └── chantiers/[id]/route.ts
lib/
├── db/
│   ├── client.ts                      # Neon + Drizzle instance
│   ├── schema.ts                      # Tables Drizzle
│   └── migrations/                    # SQL versionné
├── auth/
│   ├── jwt.ts                         # jose sign/verify
│   ├── password.ts                    # bcryptjs hash/compare
│   ├── session.ts                     # getEmployeSession() — helper Server Components
│   └── middleware.ts                  # requireAuth(roles[]) — wrapper route handlers
├── jarvis/
│   └── webhook.ts                     # dispatchJarvisEvent()
└── employes/
    ├── pointage.ts                    # logique métier pointage
    ├── rapport.ts
    └── photos.ts                      # upload S3 Scaleway
components/
└── employes/
    ├── login-form.tsx
    ├── dashboard-today.tsx
    ├── planning-calendar.tsx
    ├── pointage-button.tsx
    ├── rapport-form.tsx
    ├── photo-uploader.tsx
    └── materiel-list.tsx
middleware.ts                          # Déjà existant pour i18n — ajouter branche employes
```

## DB schema (Drizzle / Postgres)

### `employes`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK `default gen_random_uuid()` | |
| `firstname` | `text` not null | |
| `lastname` | `text` not null | |
| `email` | `text` unique not null | identifiant login (ou `username` si pas d'email) |
| `phone` | `text` | |
| `password_hash` | `text` not null | bcryptjs cost 12 |
| `role` | `text` not null `default 'employe'` | enum: `employe` \| `chef_chantier` \| `patron` |
| `hourly_rate_cents` | `integer` | pour calcul paies par Super Comptable |
| `actif` | `boolean` not null `default true` | |
| `created_at` | `timestamptz` `default now()` | |
| `cgu_accepted_at` | `timestamptz` | null tant que CGU non acceptées (bloquant) |
| `cgu_version` | `text` | version des CGU acceptées (ex: `2026-04-09`) |
| `updated_at` | `timestamptz` `default now()` | |

### `employes_sessions`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `employe_id` | `uuid` FK → `employes.id` on delete cascade | |
| `refresh_token_hash` | `text` not null | SHA-256 du refresh token |
| `ip` | `text` | |
| `user_agent` | `text` | |
| `created_at` | `timestamptz` `default now()` | |
| `expires_at` | `timestamptz` not null | 7 jours |
| `revoked_at` | `timestamptz` | |

Les access tokens JWT (15min) sont **stateless**, seuls les refresh tokens sont en DB.

### `chantiers`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `client_nom` | `text` not null | |
| `client_email` | `text` | |
| `client_phone` | `text` | |
| `nom` | `text` not null | nom affiché ("Villa Dupont") |
| `adresse` | `text` not null | |
| `ville` | `text` | |
| `code_postal` | `text` | |
| `lat_chantier` | `numeric(10,7)` | géocodé via Mapbox à la création/maj adresse |
| `lng_chantier` | `numeric(10,7)` | idem |
| `radius_m` | `integer` not null `default 500` | rayon de tolérance pointage |
| `geocoded_at` | `timestamptz` | dernier géocoding réussi |
| `geocoding_source` | `text` | `mapbox` \| `nominatim` \| `manuel` |
| `date_debut` | `date` | |
| `date_fin_prevue` | `date` | |
| `date_fin_reelle` | `date` | |
| `statut` | `text` | `prospect` \| `devis` \| `en_cours` \| `terminé` \| `annulé` |
| `budget_prevu_cents` | `bigint` | |
| `budget_reel_cents` | `bigint` | |
| `devis_id` | `text` | ref MagicPlan ou devis interne |
| `created_at` | `timestamptz` `default now()` | |

### `plannings`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `employe_id` | `uuid` FK | |
| `chantier_id` | `uuid` FK | |
| `date` | `date` not null | |
| `heure_debut` | `time` | planifié |
| `heure_fin` | `time` | planifié |
| `mission` | `text` | description courte |
| `statut` | `text` `default 'prevu'` | `prevu` \| `confirme` \| `fait` \| `annule` |
| `created_at` | `timestamptz` `default now()` | |

Index : `(employe_id, date)`, `(chantier_id, date)`.

### `pointages`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `employe_id` | `uuid` FK | |
| `chantier_id` | `uuid` FK | |
| `date` | `date` not null | |
| `heure_debut` | `timestamptz` not null | |
| `heure_fin` | `timestamptz` | null tant que pointage ouvert |
| `pause_minutes` | `integer` `default 0` | |
| `lat_debut` / `lng_debut` | `numeric(10,7)` | position GPS au start |
| `lat_fin` / `lng_fin` | `numeric(10,7)` | position GPS au stop |
| `distance_debut_m` | `integer` | distance Haversine au `chantiers.lat/lng` au start |
| `distance_fin_m` | `integer` | idem au stop |
| `on_site_debut` | `boolean` | `true` si `distance_debut_m ≤ radius_m` |
| `on_site_fin` | `boolean` | idem au stop |
| `no_geo_debut` | `boolean` `default false` | `true` si refus/erreur géoloc |
| `no_geo_fin` | `boolean` `default false` | idem stop |
| `notes` | `text` | |
| `source` | `text` `default 'app'` | `app` \| `offline_sync` \| `manuel_patron` |
| `created_at` | `timestamptz` `default now()` | |

Index : `(employe_id, date)`. Contrainte : un seul pointage ouvert (`heure_fin IS NULL`) par employé à la fois (trigger / check applicatif).

### `rapports_journaliers`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `employe_id` | `uuid` FK | |
| `chantier_id` | `uuid` FK | |
| `date` | `date` not null | |
| `description` | `text` | texte libre |
| `travaux_realises` | `jsonb` | `[{label, duration_minutes}]` |
| `blocages` | `jsonb` | `[{type, severity, description}]` |
| `meteo` | `text` | optionnel |
| `created_at` | `timestamptz` `default now()` | |

Unique : `(employe_id, chantier_id, date)` — un rapport par jour par chantier.

### `photos_chantier`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `employe_id` | `uuid` FK | |
| `chantier_id` | `uuid` FK | |
| `rapport_id` | `uuid` FK nullable | si attachée à un rapport |
| `s3_key` | `text` not null | `employes/{employe_id}/{chantier_id}/{date}/{uuid}.jpg` |
| `s3_url` | `text` | URL pré-signée générée à la lecture |
| `caption` | `text` | |
| `tags` | `jsonb` | `["avant", "après", "détail"]` |
| `prise_le` | `timestamptz` | EXIF si dispo sinon `now()` |
| `width` / `height` | `integer` | |
| `bytes` | `bigint` | |
| `created_at` | `timestamptz` `default now()` | |

### `demandes_materiel`
| Col | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `employe_id` | `uuid` FK | |
| `chantier_id` | `uuid` FK | |
| `date` | `date` not null | |
| `items` | `jsonb` not null | `[{name, qty, unite, urgence: 'normale'\|'urgente', notes}]` |
| `statut` | `text` `default 'en_attente'` | `en_attente` \| `commandé` \| `reçu` \| `annulé` |
| `notes` | `text` | |
| `created_at` | `timestamptz` `default now()` | |

### `login_attempts`
| Col | Type | Notes |
|---|---|---|
| `id` | `bigserial` PK | |
| `identifier` | `text` not null | email ou IP |
| `ip` | `text` | |
| `success` | `boolean` not null | |
| `attempted_at` | `timestamptz` `default now()` | |

Index : `(identifier, attempted_at)`. Rate limit : 5 fails / 15min par email+IP.

## API endpoints

Toutes les routes `/api/employes/*` sauf `/auth/login` et `/auth/reset-password-*`
nécessitent un **access token JWT** valide (header `Authorization: Bearer` OU
cookie httpOnly `employe_at`).

### Auth

| Méthode | Route | Body | Réponse |
|---|---|---|---|
| POST | `/api/employes/auth/login` | `{email, password}` | `{access_token, expires_in}` + set cookie refresh |
| POST | `/api/employes/auth/logout` | — | révoque session active |
| POST | `/api/employes/auth/refresh` | — | nouveau access_token via cookie refresh |
| POST | `/api/employes/auth/reset-password-request` | `{email}` | toujours 200 (anti-énumération) + email Resend si existe |
| POST | `/api/employes/auth/reset-password` | `{token, new_password}` | 200/400 |

### Ressources

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/employes/me` | Profil employé courant |
| GET | `/api/employes/planning?month=YYYY-MM` | Missions du mois |
| POST | `/api/employes/pointage` | `{action: 'start'\|'stop'\|'pause', chantier_id?, lat, lng, notes?}` |
| GET | `/api/employes/pointage?from=&to=` | Historique |
| POST | `/api/employes/rapport` | `{chantier_id, date, description, travaux_realises, blocages, meteo}` |
| GET | `/api/employes/rapport?from=&to=` | Historique |
| POST | `/api/employes/photos` | `multipart/form-data`: `file`, `chantier_id`, `rapport_id?`, `caption?`, `tags?` |
| POST | `/api/employes/materiel` | `{chantier_id, items[], notes?}` |
| GET | `/api/employes/chantiers/:id` | Infos chantier (si employé assigné) |

Toutes les mutations renvoient `{ok: true, id}` et **déclenchent `dispatchJarvisEvent()`** en background (pas de blocage de la réponse).

## Flux utilisateur

### Matin — pointage
1. Employé ouvre `/espace-employes/dashboard`, voit sa mission du jour (lecture `plannings`).
2. Tap "Démarrer ma journée" → `POST /pointage {action:'start', lat, lng, chantier_id}`.
3. Server : crée row `pointages` avec `heure_debut=now()`, push event Jarvis.
4. UI : timer visible, bouton "Pause" et "Terminer".

### Pendant — photos à la volée
1. Tap icône caméra → `<input capture>` ouvre caméra native.
2. Upload direct `POST /photos` (multipart) → lib/s3.ts upload Scaleway.
3. Thumbnail immédiat dans la vue rapport.

### Soir — rapport + matériel + clôture
1. Formulaire rapport : description, checklist travaux, blocages éventuels.
2. Section matériel : liste d'items à cocher/ajouter avec quantité + urgence.
3. Tap "Terminer ma journée" → `POST /pointage {action:'stop'}`.
4. Server : `heure_fin=now()`, calcule durée, push events Jarvis (rapport, matériel, fin pointage).
5. Redirection dashboard avec résumé (heures du jour + du mois en cours).

## Intégration Super Jarvis

**Endpoint** : `POST $JARVIS_WEBHOOK_URL/employes-event`

**Payload** :
```json
{
  "type": "pointage.start|pointage.stop|pointage.off_site|rapport.created|photo.uploaded|materiel.requested",
  "employe_id": "uuid",
  "employe_nom": "Prénom Nom",
  "chantier_id": "uuid",
  "chantier_nom": "Villa Dupont",
  "timestamp": "2026-04-09T07:32:11Z",
  "data": { /* payload spécifique au type */ }
}
```

**Signature** : header `X-Jarvis-Signature: sha256=<hmac>` calculé avec `JARVIS_WEBHOOK_SECRET`.

**Dispatch côté Jarvis** (hors scope T7, réalisé par T2) :
- `pointage.start` / `pointage.stop` → Super Comptable (heures, rentabilité, paie)
- `pointage.off_site` → **Alerte WhatsApp patron** via Jarvis (employé hors rayon chantier ou sans géoloc) + log Super Comptable
- `rapport.created` → Planning Agent (adaptation planning temps réel)
- `photo.uploaded` → CM Directeur Artistique (contenu social auto)
- `materiel.requested` → Super Comptable (budget) + Acheteur (fournisseurs)

**Fire-and-forget** : appel fait via `waitUntil()` (Next 16 / Fluid Compute) pour ne
pas bloquer la réponse HTTP à l'employé. Retry léger (3 tentatives, backoff) et log
d'échec dans une table `jarvis_events_failed` si besoin (phase 2).

## Sécurité

- **Hash password** : `bcryptjs` cost 12.
- **JWT** :
  - Access token : HS256, TTL 15 min, claims `{sub, role, iat, exp}`.
  - Refresh token : opaque (256 bits random), SHA-256 stocké en DB, TTL 7j, rotation à chaque refresh.
  - Secret : `JWT_SECRET` (env var, 256 bits random).
- **Cookies** : `employe_at` (access, httpOnly, secure, sameSite=strict, Path=/api/employes,
  Max-Age=900) et `employe_rt` (refresh, idem, Path=/api/employes/auth).
- **Rate limit login** : 5 échecs / 15min par `(email, ip)` via `login_attempts`.
- **CSRF** : sameSite=strict suffit pour cookies + header `Origin` vérifié sur mutations.
- **RBAC** : middleware `requireAuth([roles])` — patron voit tout, chef_chantier voit son équipe, employe voit soi.
- **HTTPS only** (géré par Vercel).
- **Anti-énumération** : `/reset-password-request` renvoie toujours 200.
- **Audit log** (phase 2) : table `employes_audit_log` pour actions sensibles.
- **RGPD** :
  - CGU employés (`app/(employes)/espace-employes/cgu/page.tsx`) listant : données
    collectées (identité, pointages, géoloc, photos, rapports), finalités (paie,
    planning, comptabilité), durée de conservation, droits (accès, rectification,
    effacement), responsable de traitement (Aiman Rénovation).
  - **Checkbox consentement bloquante au premier login** : tant que `cgu_accepted_at`
    est null, l'employé est redirigé vers `/espace-employes/cgu` et ne peut rien faire
    d'autre. Acceptation → `UPDATE employes SET cgu_accepted_at=now(), cgu_version='2026-04-09'`.
  - **Re-consentement** si version CGU change (comparaison `cgu_version` en DB vs
    constante `CGU_CURRENT_VERSION` côté code).

## Mobile-first

- Layout `max-w-md mx-auto`, bottom nav sticky 4 onglets (Accueil / Planning / Pointage / Rapport).
- Tap targets min 44×44px.
- Boutons principaux gros et contrastés (#E50000).
- Caméra : `<input type="file" accept="image/*" capture="environment">`.
- Pas de hover states critiques — tout doit marcher au tap.
- PWA (phase 2) : manifest + icônes + `installable`.

## Offline-first (bonus Phase 3.5)

- Pointage offline : stocké dans `localStorage` sous `pending_pointages[]`.
- À la reconnexion : sync vers `POST /pointage` avec `source: 'offline_sync'` et `timestamp` original.
- Service worker (phase 2) : cache shell + queue requêtes.

## Bouton "Espace employés" sur le site

- Ajout discret dans le footer du site principal (pas dans le header pour ne pas polluer l'UX client).
- Lien `/espace-employes/login`.
- Texte : "Espace équipe" (on évite "employés" côté public).

## Nouveaux fichiers

| Fichier | Rôle |
|---|---|
| `lib/db/client.ts` | Instance Drizzle + Neon |
| `lib/db/schema.ts` | Tables (toutes ci-dessus) |
| `lib/db/migrations/0001_init.sql` | Migration initiale |
| `lib/auth/jwt.ts` | sign/verify access + refresh |
| `lib/auth/password.ts` | hash/compare bcryptjs |
| `lib/auth/session.ts` | `getEmployeSession()` helper |
| `lib/auth/middleware.ts` | `requireAuth()` wrapper |
| `lib/jarvis/webhook.ts` | `dispatchJarvisEvent()` HMAC + `waitUntil` |
| `lib/employes/photos.ts` | upload S3 Scaleway (réutilise `lib/s3.ts`) |
| `app/(employes)/espace-employes/*` | Pages (login, dashboard, planning, pointage, rapport, historique) |
| `app/api/employes/**/route.ts` | Route handlers listés plus haut |
| `components/employes/*` | UI composants |
| `scripts/seed-employes.ts` | Crée quelques employés de test |

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `package.json` | +`@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`, `jose`, `bcryptjs`, `@types/bcryptjs` |
| `middleware.ts` | Exclure `/espace-employes` et `/api/employes` du i18n routing |
| `components/site/footer.tsx` (ou équivalent) | Ajout lien "Espace équipe" |
| `.env.local.example` | Ajout des nouvelles vars |
| `next.config.ts` | Rien a priori — à vérifier pour route groups hors locale |

## Env vars nécessaires

```
DATABASE_URL=                  # Neon Postgres (provisionné via Vercel Marketplace)
JWT_SECRET=                    # 256 bits random (openssl rand -base64 32)
JARVIS_WEBHOOK_URL=             # https://webhook.aiman-renovation.fr
JARVIS_WEBHOOK_SECRET=          # HMAC secret partagé avec T2
MAPBOX_TOKEN=                   # Mapbox Geocoding API (free 100k/mois)
# Déjà présents :
# S3_ACCESS_KEY / S3_SECRET_KEY / S3_BUCKET (Scaleway)
# RESEND_API_KEY (pour reset-password email)
```

Toutes ajoutées via `vercel env add NOM` interactif (pas de bash inline — règle Moniteur Vision).

## Questions ouvertes (à trancher avant Phase 2)

1. **Neon via Marketplace OK ?** Ou Aiman préfère autre provider Postgres (Supabase,
   Scaleway Managed DB) ? → recommandation : **Neon**, le plus simple sur Vercel.
2. **`email` comme login ou `username` dédié ?** → recommandation : **email** (les employés ont presque tous un email, sinon on met un alias `prenom@aiman-renovation.local`).
3. **Calendrier planning modulable** : **custom grid shadcn** pour le MVP (mois ×
   employés × jours), drag&drop phase 2. FullCalendar = overkill pour ce besoin.
4. ~~**Géoloc pointage** : juste logguée ou validation stricte ?~~
   → **TRANCHÉ 2026-04-09 par Moniteur Vision** : validation stricte Haversine contre
   `chantiers.lat_chantier/lng_chantier` avec `radius_m` (default 500m). Event
   `pointage.off_site` → alerte WhatsApp Jarvis si hors zone ou refus géoloc.
   Géocoding chantiers via Mapbox (fallback Nominatim OSM).
5. **Format rapport** : texte libre + checklist préremplie par métier ? → MVP **texte libre
   + checklist `travaux_realises` libre**. Templates par métier en phase 2.
6. **Offline pointage** : inclus dans Phase 3 MVP ou bonus Phase 3.5 ? → **bonus 3.5**.
7. **PWA installable** : MVP ou phase 2 ? → **phase 2**.
8. **Gestion photos → CM** : on envoie juste l'URL à Jarvis, ou on tague déjà
   `[avant/après/détail]` côté employé ? → **tag côté employé** (1 sélecteur simple).

## Critères de succès Phase 3 (MVP)

- [ ] Un employé peut se créer un compte (seed) et se connecter.
- [ ] Un employé voit son planning du mois courant.
- [ ] Un employé peut démarrer/terminer un pointage avec géoloc.
- [ ] Un employé peut uploader ≥3 photos sur un rapport.
- [ ] Un employé peut soumettre un rapport journalier + demande matériel.
- [ ] Chaque action émet un event webhook Jarvis signé (visible dans les logs Vercel).
- [ ] Le site principal a un lien discret vers `/espace-employes/login`.
- [ ] `npm run build` passe sans warning.
- [ ] Déploiement preview Vercel testé manuellement sur iPhone réel.
