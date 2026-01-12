-- Migration pour configurer les politiques RLS des buckets Storage
-- Cette migration crée les politiques nécessaires pour permettre :
-- - Lecture publique des images
-- - Upload/modification/suppression publique (pas d'auth pour simplifier)

-- ============================================
-- IMPORTANT: Les buckets doivent être créés manuellement dans le Dashboard Supabase:
-- 1. Aller dans Storage
-- 2. Créer le bucket "galerie" avec Public = true
-- 3. Créer le bucket "pages" avec Public = true
-- ============================================

-- Supprimer les anciennes politiques si elles existent (pour éviter les conflits)
DO $$
BEGIN
    -- Bucket 'galerie'
    DROP POLICY IF EXISTS "Public read access galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated upload galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated update galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated delete galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Public upload galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Public update galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Public delete galerie" ON storage.objects;

    -- Bucket 'pages'
    DROP POLICY IF EXISTS "Public read access pages" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated upload pages" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated update pages" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated delete pages" ON storage.objects;
    DROP POLICY IF EXISTS "Public upload pages" ON storage.objects;
    DROP POLICY IF EXISTS "Public update pages" ON storage.objects;
    DROP POLICY IF EXISTS "Public delete pages" ON storage.objects;
END $$;

-- Politiques RLS pour le bucket 'galerie' (accès public complet)

-- Lecture publique (pour afficher les images sur le site public)
CREATE POLICY "Public read access galerie" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'galerie');

-- Upload public (pas d'auth pour simplifier l'admin)
CREATE POLICY "Public upload galerie" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'galerie');

-- Modification publique
CREATE POLICY "Public update galerie" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'galerie')
  WITH CHECK (bucket_id = 'galerie');

-- Suppression publique
CREATE POLICY "Public delete galerie" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'galerie');

-- Politiques RLS pour le bucket 'pages' (accès public complet)

-- Lecture publique
CREATE POLICY "Public read access pages" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pages');

-- Upload public
CREATE POLICY "Public upload pages" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'pages');

-- Modification publique
CREATE POLICY "Public update pages" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'pages')
  WITH CHECK (bucket_id = 'pages');

-- Suppression publique
CREATE POLICY "Public delete pages" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'pages');
