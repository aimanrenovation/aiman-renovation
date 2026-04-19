-- Migration 0011 : table realisations
-- Publiees automatiquement par Jarvis agent #16 CM Site Web

CREATE TABLE IF NOT EXISTS "realisations" (
  "id"                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug"              text NOT NULL UNIQUE,
  "titre"             text NOT NULL,
  "titre_de"          text,
  "titre_en"          text,
  "meta_title"        text,
  "meta_description"  text,
  "description"       text NOT NULL DEFAULT '',
  "description_de"    text,
  "description_en"    text,
  "ville"             text NOT NULL DEFAULT 'Saint-Louis',
  "type_chantier"     text NOT NULL DEFAULT 'renovation',
  "reference_dossier" text,
  "photos_avant"      jsonb NOT NULL DEFAULT '[]'::jsonb,
  "photos_apres"      jsonb NOT NULL DEFAULT '[]'::jsonb,
  "photos_pendant"    jsonb NOT NULL DEFAULT '[]'::jsonb,
  "tags"              jsonb NOT NULL DEFAULT '[]'::jsonb,
  "schema_org"        jsonb,
  "date_publication"  text,
  "publiee"           boolean NOT NULL DEFAULT true,
  "created_at"        timestamptz NOT NULL DEFAULT now(),
  "updated_at"        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "realisations_slug_idx" ON "realisations" ("slug");
CREATE INDEX IF NOT EXISTS "realisations_publiee_idx" ON "realisations" ("publiee");
CREATE INDEX IF NOT EXISTS "realisations_date_publication_idx" ON "realisations" ("date_publication" DESC);
