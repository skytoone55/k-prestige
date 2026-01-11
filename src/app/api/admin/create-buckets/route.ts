import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Route API pour créer les buckets Supabase Storage
 * Utilise la clé service_role pour avoir les permissions nécessaires
 */
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    // Créer un client admin avec service_role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const buckets = [
      {
        name: 'galerie',
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      },
      {
        name: 'pages',
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      }
    ];

    const results = [];

    for (const bucketConfig of buckets) {
      try {
        // Vérifier si le bucket existe déjà
        const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets();

        if (existingBuckets?.find(b => b.name === bucketConfig.name)) {
          results.push({
            bucket: bucketConfig.name,
            status: 'exists',
            message: `Bucket "${bucketConfig.name}" existe déjà`
          });
          continue;
        }

        // Créer le bucket
        const { data, error } = await supabaseAdmin.storage.createBucket(bucketConfig.name, {
          public: bucketConfig.public,
          fileSizeLimit: bucketConfig.fileSizeLimit,
          allowedMimeTypes: bucketConfig.allowedMimeTypes
        });

        if (error) {
          results.push({
            bucket: bucketConfig.name,
            status: 'error',
            error: error.message
          });
        } else {
          // Configurer les politiques RLS après la création du bucket
          try {
            // Exécuter les politiques RLS via SQL
            const policies = bucketConfig.name === 'galerie' 
              ? {
                  select: `CREATE POLICY IF NOT EXISTS "Public read access galerie" ON storage.objects FOR SELECT USING (bucket_id = 'galerie');`,
                  insert: `CREATE POLICY IF NOT EXISTS "Authenticated upload galerie" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));`,
                  update: `CREATE POLICY IF NOT EXISTS "Authenticated update galerie" ON storage.objects FOR UPDATE USING (bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')) WITH CHECK (bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));`,
                  delete: `CREATE POLICY IF NOT EXISTS "Authenticated delete galerie" ON storage.objects FOR DELETE USING (bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));`
                }
              : {
                  select: `CREATE POLICY IF NOT EXISTS "Public read access pages" ON storage.objects FOR SELECT USING (bucket_id = 'pages');`,
                  insert: `CREATE POLICY IF NOT EXISTS "Authenticated upload pages" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pages' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));`,
                  update: `CREATE POLICY IF NOT EXISTS "Authenticated update pages" ON storage.objects FOR UPDATE USING (bucket_id = 'pages' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')) WITH CHECK (bucket_id = 'pages' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));`,
                  delete: `CREATE POLICY IF NOT EXISTS "Authenticated delete pages" ON storage.objects FOR DELETE USING (bucket_id = 'pages' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));`
                };

            // Exécuter chaque politique via rpc ou via SQL direct
            // Note: Les politiques doivent être créées via SQL, pas via l'API JS
            // On retourne un message indiquant qu'il faut exécuter la migration SQL
            results.push({
              bucket: bucketConfig.name,
              status: 'created',
              message: `Bucket "${bucketConfig.name}" créé avec succès. Exécutez la migration SQL 002_fix_storage_rls.sql pour configurer les politiques RLS.`
            });
          } catch (policyError: any) {
            results.push({
              bucket: bucketConfig.name,
              status: 'created',
              message: `Bucket "${bucketConfig.name}" créé, mais erreur lors de la configuration RLS: ${policyError.message}. Exécutez manuellement la migration SQL.`
            });
          }
        }
      } catch (error: any) {
        results.push({
          bucket: bucketConfig.name,
          status: 'error',
          error: error.message
        });
      }
    }

    const hasErrors = results.some(r => r.status === 'error');
    const allCreated = results.every(r => r.status === 'created' || r.status === 'exists');

    return NextResponse.json({
      success: allCreated,
      results
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création des buckets' },
      { status: 500 }
    );
  }
}
