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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_page_content_updated ON page_content(updated_at);
CREATE INDEX IF NOT EXISTS idx_galerie_categories_slug ON galerie_categories(slug);

-- RLS (Row Level Security) - Permettre la lecture publique, écriture seulement pour les admins
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerie_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerie_images ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour page_content
CREATE POLICY "Public read access" ON page_content FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON page_content FOR ALL USING (auth.role() = 'authenticated');

-- Politiques RLS pour galerie_categories
CREATE POLICY "Public read access" ON galerie_categories FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON galerie_categories FOR ALL USING (auth.role() = 'authenticated');

-- Politiques RLS pour galerie_images
CREATE POLICY "Public read access" ON galerie_images FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON galerie_images FOR ALL USING (auth.role() = 'authenticated');
