-- Add manager_id to employes
ALTER TABLE employes ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES employes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_employes_manager ON employes(manager_id);

-- Add validation workflow to pointages
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS validation_statut TEXT NOT NULL DEFAULT 'brut';
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS validated_by_manager UUID;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS validated_by_patron UUID;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS manager_validated_at TIMESTAMPTZ;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS patron_validated_at TIMESTAMPTZ;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS correction_notes TEXT;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS heure_debut_corrigee TIMESTAMPTZ;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS heure_fin_corrigee TIMESTAMPTZ;
ALTER TABLE pointages ADD COLUMN IF NOT EXISTS pause_minutes_corrigee INTEGER;

CREATE INDEX IF NOT EXISTS idx_pointages_validation ON pointages(validation_statut);
