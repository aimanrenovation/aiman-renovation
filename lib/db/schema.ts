import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ---- employes ----
export const employes = pgTable("employes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("employe"), // employe | chef_chantier | patron
  hourlyRateCents: integer("hourly_rate_cents"),
  actif: boolean("actif").notNull().default(true),
  passwordMustChange: boolean("password_must_change").notNull().default(false),
  cguAcceptedAt: timestamp("cgu_accepted_at", { withTimezone: true }),
  cguVersion: text("cgu_version"),
  avatarUrl: text("avatar_url"),
  managerId: uuid("manager_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- employes_sessions (refresh tokens) ----
export const employesSessions = pgTable("employes_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  refreshTokenHash: text("refresh_token_hash").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

// ---- chantiers ----
export const chantiers = pgTable("chantiers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clientNom: text("client_nom").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  nom: text("nom").notNull(),
  adresse: text("adresse").notNull(),
  ville: text("ville"),
  codePostal: text("code_postal"),
  latChantier: numeric("lat_chantier", { precision: 10, scale: 7 }),
  lngChantier: numeric("lng_chantier", { precision: 10, scale: 7 }),
  radiusM: integer("radius_m").notNull().default(500),
  geocodedAt: timestamp("geocoded_at", { withTimezone: true }),
  geocodingSource: text("geocoding_source"), // mapbox | nominatim | manuel
  dateDebut: date("date_debut"),
  dateFinPrevue: date("date_fin_prevue"),
  dateFinReelle: date("date_fin_reelle"),
  statut: text("statut").default("prospect"),
  budgetPrevuCents: bigint("budget_prevu_cents", { mode: "number" }),
  budgetReelCents: bigint("budget_reel_cents", { mode: "number" }),
  devisId: text("devis_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- plannings ----
export const plannings = pgTable("plannings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  chantierId: uuid("chantier_id")
    .notNull()
    .references(() => chantiers.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  heureDebut: time("heure_debut"),
  heureFin: time("heure_fin"),
  mission: text("mission"),
  statut: text("statut").notNull().default("prevu"), // prevu | confirme | fait | annule
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- pointages ----
export const pointages = pgTable("pointages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  chantierId: uuid("chantier_id")
    .notNull()
    .references(() => chantiers.id, { onDelete: "restrict" }),
  date: date("date").notNull(),
  heureDebut: timestamp("heure_debut", { withTimezone: true }).notNull(),
  heureFin: timestamp("heure_fin", { withTimezone: true }),
  pauseMinutes: integer("pause_minutes").notNull().default(0),
  latDebut: numeric("lat_debut", { precision: 10, scale: 7 }),
  lngDebut: numeric("lng_debut", { precision: 10, scale: 7 }),
  latFin: numeric("lat_fin", { precision: 10, scale: 7 }),
  lngFin: numeric("lng_fin", { precision: 10, scale: 7 }),
  distanceDebutM: integer("distance_debut_m"),
  distanceFinM: integer("distance_fin_m"),
  onSiteDebut: boolean("on_site_debut"),
  onSiteFin: boolean("on_site_fin"),
  noGeoDebut: boolean("no_geo_debut").notNull().default(false),
  noGeoFin: boolean("no_geo_fin").notNull().default(false),
  notes: text("notes"),
  source: text("source").notNull().default("app"), // app | offline_sync | manuel_patron
  validationStatut: text("validation_statut").notNull().default("brut"), // brut | valide_manager | valide_patron | transmis_comptabilite
  validatedByManager: uuid("validated_by_manager"),
  validatedByPatron: uuid("validated_by_patron"),
  managerValidatedAt: timestamp("manager_validated_at", { withTimezone: true }),
  patronValidatedAt: timestamp("patron_validated_at", { withTimezone: true }),
  correctionNotes: text("correction_notes"),
  heureDebutCorrigee: timestamp("heure_debut_corrigee", { withTimezone: true }),
  heureFinCorrigee: timestamp("heure_fin_corrigee", { withTimezone: true }),
  pauseMinutesCorrigee: integer("pause_minutes_corrigee"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- rapports_journaliers ----
export const rapportsJournaliers = pgTable("rapports_journaliers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  chantierId: uuid("chantier_id")
    .notNull()
    .references(() => chantiers.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  description: text("description"),
  travauxRealises: jsonb("travaux_realises"),
  blocages: jsonb("blocages"),
  meteo: text("meteo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- photos_chantier ----
export const photosChantier = pgTable("photos_chantier", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  chantierId: uuid("chantier_id")
    .notNull()
    .references(() => chantiers.id, { onDelete: "cascade" }),
  rapportId: uuid("rapport_id").references(() => rapportsJournaliers.id, { onDelete: "set null" }),
  s3Key: text("s3_key").notNull(),
  caption: text("caption"),
  tags: jsonb("tags"),
  priseLe: timestamp("prise_le", { withTimezone: true }),
  width: integer("width"),
  height: integer("height"),
  bytes: bigint("bytes", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- demandes_materiel ----
export const demandesMateriel = pgTable("demandes_materiel", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  chantierId: uuid("chantier_id")
    .notNull()
    .references(() => chantiers.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  items: jsonb("items").notNull(),
  statut: text("statut").notNull().default("en_attente"), // en_attente | commandé | reçu | annulé
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- suivi_materiel ----
export const suiviMateriel = pgTable("suivi_materiel", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  chantierId: uuid("chantier_id").notNull().references(() => chantiers.id, { onDelete: "cascade" }),
  employeId: uuid("employe_id").notNull().references(() => employes.id, { onDelete: "cascade" }),
  materiau: text("materiau").notNull(),
  quantitePrevue: integer("quantite_prevue").notNull().default(0),
  quantiteUtilisee: integer("quantite_utilisee").notNull().default(0),
  unite: text("unite").notNull().default("unité"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- login_attempts (rate limit) ----
export const loginAttempts = pgTable("login_attempts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  identifier: text("identifier").notNull(),
  ip: text("ip"),
  success: boolean("success").notNull(),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- webauthn_credentials ----
export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: text("id").primaryKey(), // credential ID base64url
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  publicKey: text("public_key").notNull(), // base64url encoded
  counter: bigint("counter", { mode: "number" }).notNull().default(0),
  deviceName: text("device_name"), // "iPhone de Yassine"
  transports: jsonb("transports"), // ["internal", "hybrid"]
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
});

// ---- messages_chantier ----
export const messagesChantier = pgTable("messages_chantier", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  chantierId: uuid("chantier_id")
    .notNull()
    .references(() => chantiers.id, { onDelete: "cascade" }),
  employeId: uuid("employe_id")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  contenu: text("contenu").notNull(),
  lu: boolean("lu").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- webauthn_challenges (ephemeral, replaces in-memory store for serverless) ----
export const webauthnChallenges = pgTable("webauthn_challenges", {
  key: text("key").primaryKey(),
  challenge: text("challenge").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// ---- login_logs (connexion history for security) ----
export const loginLogs = pgTable("login_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  employeId: uuid("employe_id").references(() => employes.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  success: boolean("success").notNull(),
  newDevice: boolean("new_device").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- demandes_absence ----
export const demandesAbsence = pgTable("demandes_absence", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id").notNull().references(() => employes.id, { onDelete: "cascade" }),
  dateDebut: date("date_debut").notNull(),
  dateFin: date("date_fin").notNull(),
  type: text("type").notNull(), // conge_paye | maladie | accident_travail | sans_solde | formation | evenement_familial | autre
  raison: text("raison"),
  justificatifS3Key: text("justificatif_s3_key"),
  statut: text("statut").notNull().default("en_attente"), // en_attente | accepte | refuse
  reponsePatron: text("reponse_patron"),
  reponduLe: timestamp("repondu_le", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- solde_conges ----
export const soldeConges = pgTable("solde_conges", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  employeId: uuid("employe_id").notNull().unique().references(() => employes.id, { onDelete: "cascade" }),
  joursAcquis: numeric("jours_acquis", { precision: 5, scale: 1 }).notNull().default("25"),
  joursPris: numeric("jours_pris", { precision: 5, scale: 1 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- missions_urgentes ----
export const missionsUrgentes = pgTable("missions_urgentes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  titre: text("titre").notNull(),
  description: text("description").notNull(),
  chantierId: uuid("chantier_id").references(() => chantiers.id, { onDelete: "set null" }),
  bonusDescription: text("bonus_description"),
  bonusMontantCents: integer("bonus_montant_cents"),
  dateLimite: timestamp("date_limite", { withTimezone: true }).notNull(),
  statut: text("statut").notNull().default("ouverte"), // ouverte | prise | annulee | expiree
  acceptePar: uuid("accepte_par").references(() => employes.id, { onDelete: "set null" }),
  accepteLe: timestamp("accepte_le", { withTimezone: true }),
  creePar: uuid("cree_par")
    .notNull()
    .references(() => employes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- checklists_qualite ----
export const checklistsQualite = pgTable("checklists_qualite", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pointageId: uuid("pointage_id").notNull().references(() => pointages.id, { onDelete: "cascade" }),
  employeId: uuid("employe_id").notNull().references(() => employes.id, { onDelete: "cascade" }),
  chantierId: uuid("chantier_id").notNull().references(() => chantiers.id, { onDelete: "cascade" }),
  items: jsonb("items").notNull(), // [{ label: string, checked: boolean }]
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
});

// ---- chat_conversations ----
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorId: text("visitor_id").notNull(), // anonymous browser fingerprint
  messages: jsonb("messages").notNull().default(sql`'[]'::jsonb`), // [{role, content, timestamp}]
  qualificationData: jsonb("qualification_data"), // {type_travaux, surface, localisation, budget, urgence}
  prospectNom: text("prospect_nom"),
  prospectTel: text("prospect_tel"),
  prospectEmail: text("prospect_email"),
  prospectChaud: boolean("prospect_chaud").notNull().default(false),
  dossierCreated: boolean("dossier_created").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export type Employe = typeof employes.$inferSelect;
export type NewEmploye = typeof employes.$inferInsert;
export type Chantier = typeof chantiers.$inferSelect;
export type Pointage = typeof pointages.$inferSelect;
export type DemandeAbsence = typeof demandesAbsence.$inferSelect;
export type SoldeConges = typeof soldeConges.$inferSelect;
export type MissionUrgente = typeof missionsUrgentes.$inferSelect;
export type NewMissionUrgente = typeof missionsUrgentes.$inferInsert;
export type SuiviMateriel = typeof suiviMateriel.$inferSelect;
