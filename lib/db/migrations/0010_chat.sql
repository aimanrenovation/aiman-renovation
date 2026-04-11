CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  qualification_data JSONB,
  prospect_nom TEXT,
  prospect_tel TEXT,
  prospect_email TEXT,
  prospect_chaud BOOLEAN NOT NULL DEFAULT false,
  dossier_created BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_visitor ON chat_conversations(visitor_id);
CREATE INDEX idx_chat_prospect ON chat_conversations(prospect_chaud) WHERE prospect_chaud = true;
