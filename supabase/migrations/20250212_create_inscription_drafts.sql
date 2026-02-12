-- Table pour stocker les brouillons d'inscription
-- Permet aux clients de reprendre leur inscription plus tard

CREATE TABLE IF NOT EXISTS inscription_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL, -- Format: KP26XXX

  -- Données du formulaire (JSON complet)
  form_data JSONB NOT NULL DEFAULT '{}',

  -- Métadonnées
  current_step INTEGER DEFAULT 1,
  email VARCHAR(255), -- Pour pouvoir renvoyer le code
  telephone VARCHAR(50),
  nom_prenom VARCHAR(255),

  -- État
  is_submitted BOOLEAN DEFAULT FALSE,
  monday_item_id VARCHAR(50), -- ID Monday.com une fois soumis

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,

  -- Expiration (30 jours par défaut)
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index pour recherche rapide par code
CREATE INDEX IF NOT EXISTS idx_inscription_drafts_code ON inscription_drafts(code);

-- Index pour recherche par email
CREATE INDEX IF NOT EXISTS idx_inscription_drafts_email ON inscription_drafts(email);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_inscription_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS trigger_inscription_drafts_updated_at ON inscription_drafts;
CREATE TRIGGER trigger_inscription_drafts_updated_at
  BEFORE UPDATE ON inscription_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_inscription_drafts_updated_at();

-- RLS (Row Level Security)
ALTER TABLE inscription_drafts ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion anonyme (formulaire public)
CREATE POLICY "Allow anonymous insert" ON inscription_drafts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Politique pour permettre la lecture par code (formulaire public)
CREATE POLICY "Allow read by code" ON inscription_drafts
  FOR SELECT TO anon
  USING (true);

-- Politique pour permettre la mise à jour (formulaire public)
CREATE POLICY "Allow anonymous update" ON inscription_drafts
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Commentaires
COMMENT ON TABLE inscription_drafts IS 'Brouillons d''inscription Pessah - permet de reprendre plus tard';
COMMENT ON COLUMN inscription_drafts.code IS 'Code unique format KP26XXX pour reprendre l''inscription';
COMMENT ON COLUMN inscription_drafts.form_data IS 'Données complètes du formulaire en JSON';
COMMENT ON COLUMN inscription_drafts.expires_at IS 'Date d''expiration du brouillon (30 jours)';
