CREATE TABLE IF NOT EXISTS login_logs (
  id BIGSERIAL PRIMARY KEY,
  employe_id UUID REFERENCES employes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  new_device BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_logs_employe ON login_logs(employe_id);
CREATE INDEX idx_login_logs_created ON login_logs(created_at);
