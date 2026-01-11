-- Migration pour configurer les politiques RLS des buckets Storage
-- Cette migration crée les politiques nécessaires pour permettre :
-- - Lecture publique des images
-- - Upload/modification/suppression par les utilisateurs authentifiés

-- Supprimer les anciennes politiques si elles existent (pour éviter les conflits)
DO $$ 
BEGIN
    -- Bucket 'galerie'
    DROP POLICY IF EXISTS "Public read access galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated upload galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated update galerie" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated delete galerie" ON storage.objects;
    
    -- Bucket 'pages'
    DROP POLICY IF EXISTS "Public read access pages" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated upload pages" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated update pages" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated delete pages" ON storage.objects;
END $$;

-- Politiques RLS pour le bucket 'galerie'

-- Lecture publique (pour afficher les images sur le site public)
CREATE POLICY "Public read access galerie" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'galerie');

-- Upload pour utilisateurs authentifiés (admin)
CREATE POLICY "Authenticated upload galerie" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'galerie' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- Modification pour utilisateurs authentifiés
CREATE POLICY "Authenticated update galerie" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'galerie' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  )
  WITH CHECK (
    bucket_id = 'galerie' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- Suppression pour utilisateurs authentifiés
CREATE POLICY "Authenticated delete galerie" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'galerie' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- Politiques RLS pour le bucket 'pages'

-- Lecture publique
CREATE POLICY "Public read access pages" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pages');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated upload pages" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'pages' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- Modification pour utilisateurs authentifiés
CREATE POLICY "Authenticated update pages" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'pages' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  )
  WITH CHECK (
    bucket_id = 'pages' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );

-- Suppression pour utilisateurs authentifiés
CREATE POLICY "Authenticated delete pages" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'pages' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  );
