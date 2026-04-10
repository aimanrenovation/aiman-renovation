CREATE TABLE IF NOT EXISTS demandes_absence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  type TEXT NOT NULL,
  raison TEXT,
  justificatif_s3_key TEXT,
  statut TEXT NOT NULL DEFAULT 'en_attente',
  reponse_patron TEXT,
  repondu_le TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solde_conges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id UUID NOT NULL UNIQUE REFERENCES employes(id) ON DELETE CASCADE,
  jours_acquis NUMERIC(5,1) NOT NULL DEFAULT 25,
  jours_pris NUMERIC(5,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_demandes_absence_employe ON demandes_absence(employe_id);
CREATE INDEX idx_demandes_absence_statut ON demandes_absence(statut);
