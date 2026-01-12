-- Table pour stocker le contenu des pages
CREATE TABLE IF NOT EXISTS page_content (
  page_id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les catégories de galerie
CREATE TABLE IF NOT EXISTS galerie_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les images de galerie
CREATE TABLE IF NOT EXISTS galerie_images (
  id TEXT PRIMARY KEY,
  images JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour la galerie (format simplifié)
CREATE TABLE IF NOT EXISTS galerie_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categories JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer une ligne par défaut pour galerie_content
INSERT INTO galerie_content (id, categories, images)
VALUES ('00000000-0000-0000-0000-000000000001', '[]', '[]')
ON CONFLICT (id) DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_page_content_updated ON page_content(updated_at);
CREATE INDEX IF NOT EXISTS idx_galerie_categories_slug ON galerie_categories(slug);

-- RLS (Row Level Security) - Permettre lecture et écriture publique (pas d'auth dans l'admin)
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerie_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerie_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerie_content ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour page_content (accès public complet)
CREATE POLICY "Public read access" ON page_content FOR SELECT USING (true);
CREATE POLICY "Public write access" ON page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON page_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON page_content FOR DELETE USING (true);

-- Politiques RLS pour galerie_categories (accès public complet)
CREATE POLICY "Public read access" ON galerie_categories FOR SELECT USING (true);
CREATE POLICY "Public write access" ON galerie_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_categories FOR DELETE USING (true);

-- Politiques RLS pour galerie_images (accès public complet)
CREATE POLICY "Public read access" ON galerie_images FOR SELECT USING (true);
CREATE POLICY "Public write access" ON galerie_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_images FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_images FOR DELETE USING (true);

-- Politiques RLS pour galerie_content (accès public complet)
CREATE POLICY "Public read access" ON galerie_content FOR SELECT USING (true);
CREATE POLICY "Public write access" ON galerie_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_content FOR DELETE USING (true);
