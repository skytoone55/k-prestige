-- Migration: Fix page_settings table - rename page_slug to page_id if needed
-- Run this in Supabase SQL Editor

-- Option 1: Si la table existe avec page_slug, renommer la colonne
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_settings' AND column_name = 'page_slug'
  ) THEN
    ALTER TABLE page_settings RENAME COLUMN page_slug TO page_id;
    RAISE NOTICE 'Colonne page_slug renommée en page_id';
  ELSE
    RAISE NOTICE 'Colonne page_slug non trouvée, rien à faire';
  END IF;
END $$;

-- Option 2: Ou si vous préférez supprimer et recréer la table proprement
-- (décommenter les lignes ci-dessous si l'option 1 ne fonctionne pas)
/*
DROP TABLE IF EXISTS page_settings;

CREATE TABLE page_settings (
  page_id TEXT PRIMARY KEY,
  disabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to page_settings"
  ON page_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to modify page_settings"
  ON page_settings FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO page_settings (page_id, disabled) VALUES
  ('marbella', false),
  ('marrakech', false),
  ('hilloula', false),
  ('souccot', false),
  ('pessah-sejour', false),
  ('pessah-hotel', false),
  ('galerie', false)
ON CONFLICT (page_id) DO NOTHING;
*/
