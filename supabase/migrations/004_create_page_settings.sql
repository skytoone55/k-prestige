-- Migration: Create page_settings table for page visibility toggle
-- Run this in Supabase SQL Editor

-- Create table for page settings (visibility toggle)
CREATE TABLE IF NOT EXISTS page_settings (
  page_id TEXT PRIMARY KEY,
  disabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

-- Policies for page_settings
CREATE POLICY "Allow public read access to page_settings"
  ON page_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to modify page_settings"
  ON page_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default values (all pages active by default)
INSERT INTO page_settings (page_id, disabled) VALUES
  ('marbella', false),
  ('marrakech', false),
  ('hilloula', false),
  ('souccot', false),
  ('pessah-sejour', false),
  ('pessah-hotel', false),
  ('galerie', false)
ON CONFLICT (page_id) DO NOTHING;
