# Plan d'exécution — Portail Employés

**Spec associée** : `docs/superpowers/specs/2026-04-09-employes-portal-design.md`
**Branche** : `feat/employes-portal`
**Validations Moniteur Vision (2026-04-09)** :
- ✅ Neon Postgres via Vercel Marketplace
- ✅ Login par email
- ✅ PWA & offline-first → phase 2 (post-MVP)
- ✅ **Géoloc stricte avec Haversine + rayon + alerte WhatsApp off-site** (mise à jour majeure)
- ✅ **RGPD : CGU + consentement bloquant au premier login**

## Conventions

- **1 task = 1 commit atomique** (feat/fix/chore/docs scope).
- Chaque task liste : fichiers touchés, critère de validation, commande de test.
- Build `npm run build` doit passer **avant** chaque push.
- Les tasks marquées ⚠️ dépendent d'une action Aiman (provisioning env var, seed manuel).

---

## Étape A — Fondations (DB + Auth)

### A1. Setup Neon Postgres + Drizzle ⚠️
- [ ] Provisionner Neon via Vercel Marketplace → `DATABASE_URL` auto-injectée.
- [ ] `npm i @neondatabase/serverless drizzle-orm && npm i -D drizzle-kit`
- [ ] `lib/db/client.ts` : `neon(process.env.DATABASE_URL!)` + `drizzle()`
- [ ] `drizzle.config.ts` : `out: './lib/db/migrations'`, driver `pg`.
- [ ] `lib/db/schema.ts` : tables `employes`, `chantiers`, `plannings`, `pointages`, `rapports_journaliers`, `photos_chantier`, `demandes_materiel`, `employes_sessions`, `login_attempts` (+ nouvelles colonnes géoloc et CGU).
- [ ] `npx drizzle-kit generate` → `lib/db/migrations/0001_init.sql`
- [ ] Run migration sur Neon (script `scripts/db-migrate.ts`).
- **Validation** : `psql $DATABASE_URL -c '\dt'` liste 9 tables.
- **Commit** : `feat(employes): setup neon postgres + drizzle schema`

### A2. Auth — password + JWT
- [ ] `npm i jose bcryptjs && npm i -D @types/bcryptjs`
- [ ] `lib/auth/password.ts` : `hashPassword`, `verifyPassword` (cost 12).
- [ ] `lib/auth/jwt.ts` : `signAccessToken(employeId, role)`, `verifyAccessToken(token)`, `generateRefreshToken()` (opaque 256 bits + SHA-256 storage).
- [ ] `lib/auth/session.ts` : `getEmployeSession()` lit cookie `employe_at`, renvoie `{employeId, role}` ou `null`.
- [ ] `lib/auth/middleware.ts` : `requireAuth(roles[])(handler)` wrapper Route Handler.
- **Validation** : test unitaire rapide `scripts/test-auth.ts` (sign/verify round-trip).
- **Commit** : `feat(employes): custom jwt auth (jose + bcryptjs)`

### A3. Routes auth
- [ ] `app/api/employes/auth/login/route.ts` : rate limit via `login_attempts`, vérifie password, émet access+refresh, set cookies httpOnly.
- [ ] `app/api/employes/auth/logout/route.ts` : révoque refresh en DB, clear cookies.
- [ ] `app/api/employes/auth/refresh/route.ts` : rotation refresh + nouveau access.
- [ ] `app/api/employes/auth/reset-password-request/route.ts` : toujours 200, email Resend si employé existe (template FR).
- [ ] `app/api/employes/auth/reset-password/route.ts` : vérifie token (JWT court 1h), update password_hash.
- **Validation** : `curl -X POST .../login` avec seed → reçoit 200 + cookies.
- **Commit** : `feat(employes): auth routes (login/logout/refresh/reset)`

### A4. Seed + script de test
- [ ] `scripts/seed-employes.ts` : crée 1 patron, 1 chef_chantier, 2 employes, 2 chantiers avec géocoding Mapbox.
- [ ] `npx tsx scripts/seed-employes.ts`
- **Validation** : `SELECT email, role FROM employes;` → 4 lignes.
- **Commit** : `chore(employes): seed script (4 users + 2 chantiers)`

---

## Étape B — Géocoding & Haversine

### B1. Module géocoding Mapbox + fallback Nominatim ⚠️
- [ ] ⚠️ Provisionner `MAPBOX_TOKEN` via `vercel env add MAPBOX_TOKEN` (interactif).
- [ ] `lib/geo/geocoding.ts` :
  - `geocodeMapbox(address): {lat, lng} | null` — appel API, `language=fr`, country=fr+de+ch.
  - `geocodeNominatim(address)` — fallback HTTP `nominatim.openstreetmap.org`.
  - `geocodeChantier(address)` — essaie Mapbox, fallback Nominatim, throw si les deux échouent.
- **Validation** : `npx tsx scripts/test-geocoding.ts "10 rue des Lilas, Mulhouse"` → coords valides.
- **Commit** : `feat(employes): geocoding mapbox + nominatim fallback`

### B2. Module Haversine + flags
- [ ] `lib/geo/haversine.ts` : `haversineMeters(lat1, lng1, lat2, lng2): number`.
- [ ] `lib/geo/pointage-check.ts` : `checkPointageLocation({userLat, userLng, chantier}): {distance_m, on_site, no_geo}`.
- **Validation** : tests unitaires `scripts/test-haversine.ts` (Mulhouse↔Paris ≈ 460km, même point = 0).
- **Commit** : `feat(employes): haversine distance check`

### B3. Hook auto-géocoding chantiers
- [ ] Helper `lib/employes/chantiers.ts` : `createChantier(data)` et `updateChantierAddress(id, newAddress)` → appel `geocodeChantier()` avant INSERT/UPDATE, set `lat_chantier`, `lng_chantier`, `geocoded_at`, `geocoding_source`.
- **Validation** : seed script exploite cette fonction, rows `chantiers` ont lat/lng non null.
- **Commit** : `feat(employes): auto-geocode chantiers on create/update`

---

## Étape C — Webhook Jarvis

### C1. Dispatcher fire-and-forget ⚠️
- [ ] ⚠️ Provisionner `JARVIS_WEBHOOK_URL` et `JARVIS_WEBHOOK_SECRET` via `vercel env add` (interactif).
- [ ] `lib/jarvis/webhook.ts` :
  - `dispatchJarvisEvent(type, payload)` → calcule HMAC-SHA256, `fetch()` avec `waitUntil()`.
  - `JarvisEventType` enum strict (inclut `pointage.off_site`).
  - Logs erreurs mais ne throw jamais.
- **Validation** : `npx tsx scripts/test-jarvis-webhook.ts` → event arrive sur endpoint mock local.
- **Commit** : `feat(employes): jarvis webhook dispatcher (hmac + waitUntil)`

---

## Étape D — RGPD / CGU

### D1. Page CGU + enforcement
- [ ] `lib/employes/cgu-version.ts` : `export const CGU_CURRENT_VERSION = '2026-04-09'`.
- [ ] `app/(employes)/espace-employes/cgu/page.tsx` : texte CGU FR (données, finalités, droits, contact DPO).
- [ ] `components/employes/cgu-accept-form.tsx` : checkbox + bouton "J'accepte".
- [ ] `app/api/employes/cgu/accept/route.ts` : `UPDATE employes SET cgu_accepted_at=now(), cgu_version=$1`.
- [ ] `lib/auth/session.ts` : après login, si `cgu_accepted_at IS NULL` ou `cgu_version != CGU_CURRENT_VERSION` → redirect `/espace-employes/cgu`.
- **Validation** : seed employé non consenti → login → redirigé vers CGU → accepte → accède dashboard.
- **Commit** : `feat(employes): cgu rgpd + consentement bloquant au premier login`

---

## Étape E — Frontend mobile-first (shell)

### E1. Layout + auth guard
- [ ] `app/(employes)/espace-employes/layout.tsx` : shell mobile, bottom nav (Accueil/Planning/Pointage/Rapport), header sticky, palette `#E50000`.
- [ ] `middleware.ts` : exclure `/espace-employes` et `/api/employes` du routing i18n.
- **Validation** : route `/espace-employes/login` accessible directement (pas de `/fr/...`).
- **Commit** : `feat(employes): layout mobile-first + exclude i18n routing`

### E2. Login page
- [ ] `app/(employes)/espace-employes/login/page.tsx` : form email + password, call `/api/employes/auth/login`, redirect dashboard on success.
- [ ] `components/employes/login-form.tsx` : UI + gestion erreurs (mauvais creds, rate limit).
- **Validation** : login avec seed → dashboard.
- **Commit** : `feat(employes): login page`

### E3. Dashboard
- [ ] `app/(employes)/espace-employes/dashboard/page.tsx` : Server Component, lit `planning` du jour + statut pointage courant.
- [ ] `components/employes/dashboard-today.tsx` : card mission du jour + CTA "Démarrer journée".
- **Validation** : dashboard affiche la mission seed du jour.
- **Commit** : `feat(employes): dashboard today view`

---

## Étape F — Pointage avec géoloc stricte

### F1. Route pointage
- [ ] `app/api/employes/pointage/route.ts` :
  - `POST {action, chantier_id, lat?, lng?, notes?}` → charge `chantier`, call `checkPointageLocation`, INSERT/UPDATE `pointages` avec tous flags, dispatch event Jarvis.
  - Si `!on_site || no_geo` → dispatch `pointage.off_site` (en plus de `pointage.start/stop`).
  - `GET ?from=&to=` → liste historique de l'employé.
- **Validation** : curl avec coords OK → `on_site=true`, coords hors rayon → `pointage.off_site` envoyé.
- **Commit** : `feat(employes): pointage api with strict geoloc haversine`

### F2. UI pointage
- [ ] `app/(employes)/espace-employes/pointage/page.tsx`
- [ ] `components/employes/pointage-button.tsx` :
  - `navigator.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 10000})`
  - Si refus → confirm "Pointer sans géoloc ?" (alerte patron)
  - POST avec lat/lng (ou null+flag)
  - Affiche statut `on_site`/`hors zone`/`sans géoloc` après réponse.
- **Validation** : test iPhone réel — accepter géoloc, voir timer démarrer, voir badge "✓ Sur site".
- **Commit** : `feat(employes): pointage ui with geoloc prompt`

---

## Étape G — Rapport + Photos + Matériel

### G1. Route rapport
- [ ] `app/api/employes/rapport/route.ts` : POST crée rapport (unique par `(employe, chantier, date)`), GET liste.
- **Commit** : `feat(employes): rapport journalier api`

### G2. Upload photos S3 Scaleway
- [ ] `lib/employes/photos.ts` : réutilise `lib/s3.ts` existant, upload sous `employes/{employeId}/{chantierId}/{date}/{uuid}.jpg`.
- [ ] `app/api/employes/photos/route.ts` : POST multipart, insère row `photos_chantier`, dispatch `photo.uploaded`.
- **Commit** : `feat(employes): photos upload s3 scaleway + jarvis dispatch`

### G3. Route matériel
- [ ] `app/api/employes/materiel/route.ts` : POST crée demande, dispatch `materiel.requested`.
- **Commit** : `feat(employes): demande materiel api`

### G4. UI rapport complet
- [ ] `app/(employes)/espace-employes/rapport/page.tsx`
- [ ] `components/employes/rapport-form.tsx` : textarea description, checklist travaux, blocages.
- [ ] `components/employes/photo-uploader.tsx` : `<input capture>` + preview + upload progressif.
- [ ] `components/employes/materiel-list.tsx` : add/remove items {name, qty, urgence}.
- [ ] Bouton "Terminer ma journée" → POST rapport + POST matériel + POST pointage stop en séquence.
- **Validation** : iPhone réel, upload 3 photos + rapport + matériel → 3 rows DB + 4 events Jarvis.
- **Commit** : `feat(employes): rapport ui with photos and materiel`

---

## Étape H — Planning + Historique

### H1. Route planning + page
- [ ] `app/api/employes/planning/route.ts` : `GET ?month=YYYY-MM` retourne missions du mois.
- [ ] `app/(employes)/espace-employes/planning/page.tsx` : grid shadcn simple (semaine × jours), highlight du jour courant.
- **Commit** : `feat(employes): planning monthly view`

### H2. Historique
- [ ] `app/(employes)/espace-employes/historique/page.tsx` : liste pointages + rapports des 30 derniers jours, totaux heures.
- **Commit** : `feat(employes): historique pointages et rapports`

---

## Étape I — Intégration site principal

### I1. Lien footer
- [ ] Trouver composant footer existant, ajouter lien discret "Espace équipe" → `/espace-employes/login`.
- **Validation** : build OK, footer du site affiche le lien sur toutes les pages publiques.
- **Commit** : `feat(site): lien espace equipe dans footer`

---

## Étape J — Tests & déploiement

### J1. Script E2E smoke
- [ ] `scripts/e2e-smoke.ts` : login → pointage start (on_site) → pointage start (off_site → vérifie event) → rapport → photos (mock) → matériel → pointage stop.
- **Commit** : `test(employes): e2e smoke script`

### J2. Build + preview Vercel
- [ ] `npm run build` local — 0 warning bloquant.
- [ ] Push → preview Vercel auto.
- [ ] Test manuel iPhone sur l'URL preview (login, pointage géoloc, upload photo, rapport).
- **Validation** : tous les critères de succès Phase 3 de la spec sont verts.
- **Commit** : `chore(employes): build clean for preview`

### J3. Rapport final
- [ ] Mettre à jour `project_employes_portal_progress.md` avec URL preview, checklist critères de succès cochés, notes pour T2 (côté Jarvis).
- [ ] Ping Moniteur Vision pour review avant PR vers main.
- **Commit** : aucun (mémoire uniquement).

---

## Récapitulatif — ordre d'exécution et dépendances

```
A1 → A2 → A3 → A4
       ↓
       B1 → B2 → B3
              ↓
              C1
              ↓
              D1
              ↓
              E1 → E2 → E3
                          ↓
                          F1 → F2
                                ↓
                                G1 → G2 → G3 → G4
                                              ↓
                                              H1 → H2
                                                    ↓
                                                    I1
                                                    ↓
                                                    J1 → J2 → J3
```

**Parallélisable** : E1-E3 peut démarrer en parallèle de B/C/D une fois A terminé (l'UI
login/dashboard peut mocker les données de pointage/rapport). Non-parallélisé par défaut
pour rester en mode mono-terminal (worktree T7).

## Blocages potentiels / actions Aiman

- **A1** : provisioning Neon via Vercel Marketplace (5 min Aiman).
- **B1** : création compte Mapbox + récup token → `vercel env add MAPBOX_TOKEN`.
- **C1** : récup `JARVIS_WEBHOOK_URL` + `JARVIS_WEBHOOK_SECRET` auprès de T2 (Jarvis).
- **J2** : accès iPhone réel pour test terrain.

Toutes les autres étapes sont 100% autonomes côté T7.
