CREATE TABLE IF NOT EXISTS "messages_chantier" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "chantier_id" uuid NOT NULL REFERENCES "chantiers"("id") ON DELETE CASCADE,
  "employe_id" uuid NOT NULL REFERENCES "employes"("id") ON DELETE CASCADE,
  "contenu" text NOT NULL,
  "lu" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
