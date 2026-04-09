CREATE TABLE "chantiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_nom" text NOT NULL,
	"client_email" text,
	"client_phone" text,
	"nom" text NOT NULL,
	"adresse" text NOT NULL,
	"ville" text,
	"code_postal" text,
	"lat_chantier" numeric(10, 7),
	"lng_chantier" numeric(10, 7),
	"radius_m" integer DEFAULT 500 NOT NULL,
	"geocoded_at" timestamp with time zone,
	"geocoding_source" text,
	"date_debut" date,
	"date_fin_prevue" date,
	"date_fin_reelle" date,
	"statut" text DEFAULT 'prospect',
	"budget_prevu_cents" bigint,
	"budget_reel_cents" bigint,
	"devis_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demandes_materiel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employe_id" uuid NOT NULL,
	"chantier_id" uuid NOT NULL,
	"date" date NOT NULL,
	"items" jsonb NOT NULL,
	"statut" text DEFAULT 'en_attente' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'employe' NOT NULL,
	"hourly_rate_cents" integer,
	"actif" boolean DEFAULT true NOT NULL,
	"cgu_accepted_at" timestamp with time zone,
	"cgu_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employes_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "employes_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employe_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"ip" text,
	"success" boolean NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos_chantier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employe_id" uuid NOT NULL,
	"chantier_id" uuid NOT NULL,
	"rapport_id" uuid,
	"s3_key" text NOT NULL,
	"caption" text,
	"tags" jsonb,
	"prise_le" timestamp with time zone,
	"width" integer,
	"height" integer,
	"bytes" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plannings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employe_id" uuid NOT NULL,
	"chantier_id" uuid NOT NULL,
	"date" date NOT NULL,
	"heure_debut" time,
	"heure_fin" time,
	"mission" text,
	"statut" text DEFAULT 'prevu' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pointages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employe_id" uuid NOT NULL,
	"chantier_id" uuid NOT NULL,
	"date" date NOT NULL,
	"heure_debut" timestamp with time zone NOT NULL,
	"heure_fin" timestamp with time zone,
	"pause_minutes" integer DEFAULT 0 NOT NULL,
	"lat_debut" numeric(10, 7),
	"lng_debut" numeric(10, 7),
	"lat_fin" numeric(10, 7),
	"lng_fin" numeric(10, 7),
	"distance_debut_m" integer,
	"distance_fin_m" integer,
	"on_site_debut" boolean,
	"on_site_fin" boolean,
	"no_geo_debut" boolean DEFAULT false NOT NULL,
	"no_geo_fin" boolean DEFAULT false NOT NULL,
	"notes" text,
	"source" text DEFAULT 'app' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rapports_journaliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employe_id" uuid NOT NULL,
	"chantier_id" uuid NOT NULL,
	"date" date NOT NULL,
	"description" text,
	"travaux_realises" jsonb,
	"blocages" jsonb,
	"meteo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "demandes_materiel" ADD CONSTRAINT "demandes_materiel_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demandes_materiel" ADD CONSTRAINT "demandes_materiel_chantier_id_chantiers_id_fk" FOREIGN KEY ("chantier_id") REFERENCES "public"."chantiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employes_sessions" ADD CONSTRAINT "employes_sessions_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos_chantier" ADD CONSTRAINT "photos_chantier_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos_chantier" ADD CONSTRAINT "photos_chantier_chantier_id_chantiers_id_fk" FOREIGN KEY ("chantier_id") REFERENCES "public"."chantiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos_chantier" ADD CONSTRAINT "photos_chantier_rapport_id_rapports_journaliers_id_fk" FOREIGN KEY ("rapport_id") REFERENCES "public"."rapports_journaliers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_chantier_id_chantiers_id_fk" FOREIGN KEY ("chantier_id") REFERENCES "public"."chantiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointages" ADD CONSTRAINT "pointages_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointages" ADD CONSTRAINT "pointages_chantier_id_chantiers_id_fk" FOREIGN KEY ("chantier_id") REFERENCES "public"."chantiers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rapports_journaliers" ADD CONSTRAINT "rapports_journaliers_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rapports_journaliers" ADD CONSTRAINT "rapports_journaliers_chantier_id_chantiers_id_fk" FOREIGN KEY ("chantier_id") REFERENCES "public"."chantiers"("id") ON DELETE cascade ON UPDATE no action;