CREATE TABLE missions_urgentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  chantier_id UUID REFERENCES chantiers(id) ON DELETE SET NULL,
  bonus_description TEXT,
  bonus_montant_cents INTEGER,
  date_limite TIMESTAMP WITH TIME ZONE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'ouverte' CHECK (statut IN ('ouverte','prise','annulee','expiree')),
  accepte_par UUID REFERENCES employes(id) ON DELETE SET NULL,
  accepte_le TIMESTAMP WITH TIME ZONE,
  cree_par UUID NOT NULL REFERENCES employes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_missions_urgentes_statut ON missions_urgentes(statut);
CREATE INDEX idx_missions_urgentes_date_limite ON missions_urgentes(date_limite);
