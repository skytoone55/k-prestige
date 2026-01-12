-- Migration pour corriger les politiques RLS (permettre accès public)
-- À exécuter sur une base existante pour corriger les permissions

-- ============================================
-- IMPORTANT: Exécuter ce script dans l'éditeur SQL de Supabase
-- pour corriger les permissions sur une base existante
-- ============================================

-- 1. Supprimer les anciennes politiques restrictives
DO $$
BEGIN
    -- page_content
    DROP POLICY IF EXISTS "Admin write access" ON page_content;
    DROP POLICY IF EXISTS "Public write access" ON page_content;
    DROP POLICY IF EXISTS "Public update access" ON page_content;
    DROP POLICY IF EXISTS "Public delete access" ON page_content;

    -- galerie_categories
    DROP POLICY IF EXISTS "Admin write access" ON galerie_categories;
    DROP POLICY IF EXISTS "Public write access" ON galerie_categories;
    DROP POLICY IF EXISTS "Public update access" ON galerie_categories;
    DROP POLICY IF EXISTS "Public delete access" ON galerie_categories;

    -- galerie_images
    DROP POLICY IF EXISTS "Admin write access" ON galerie_images;
    DROP POLICY IF EXISTS "Public write access" ON galerie_images;
    DROP POLICY IF EXISTS "Public update access" ON galerie_images;
    DROP POLICY IF EXISTS "Public delete access" ON galerie_images;

    -- galerie_content
    DROP POLICY IF EXISTS "Admin write access" ON galerie_content;
    DROP POLICY IF EXISTS "Public write access" ON galerie_content;
    DROP POLICY IF EXISTS "Public update access" ON galerie_content;
    DROP POLICY IF EXISTS "Public delete access" ON galerie_content;
END $$;

-- 2. Créer les nouvelles politiques avec accès public complet

-- page_content
CREATE POLICY "Public write access" ON page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON page_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON page_content FOR DELETE USING (true);

-- galerie_categories
CREATE POLICY "Public write access" ON galerie_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_categories FOR DELETE USING (true);

-- galerie_images
CREATE POLICY "Public write access" ON galerie_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_images FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_images FOR DELETE USING (true);

-- galerie_content (créer la table si elle n'existe pas)
CREATE TABLE IF NOT EXISTS galerie_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categories JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur galerie_content
ALTER TABLE galerie_content ENABLE ROW LEVEL SECURITY;

-- Créer les politiques pour galerie_content
DROP POLICY IF EXISTS "Public read access" ON galerie_content;
CREATE POLICY "Public read access" ON galerie_content FOR SELECT USING (true);
CREATE POLICY "Public write access" ON galerie_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_content FOR DELETE USING (true);

-- 3. Insérer la ligne par défaut pour galerie_content si elle n'existe pas
INSERT INTO galerie_content (id, categories, images)
VALUES ('00000000-0000-0000-0000-000000000001', '[]', '[]')
ON CONFLICT (id) DO NOTHING;

-- 4. Vérification - afficher les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('page_content', 'galerie_content', 'galerie_categories', 'galerie_images')
ORDER BY tablename, policyname;
