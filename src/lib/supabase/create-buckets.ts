import { createClient } from './client';

/**
 * Crée les buckets Supabase Storage nécessaires
 * À appeler une fois depuis la console du navigateur ou depuis l'admin
 */
export async function createStorageBuckets() {
  const supabase = createClient();
  
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
      const { data: existing, error: checkError } = await supabase.storage.listBuckets();
      
      if (existing && existing.find(b => b.name === bucketConfig.name)) {
        console.log(`✅ Bucket "${bucketConfig.name}" existe déjà`);
        results.push({ bucket: bucketConfig.name, status: 'exists' });
        continue;
      }
      
      // Créer le bucket
      // Note: La création de bucket nécessite généralement les permissions admin
      // Cette fonction peut ne pas fonctionner avec la clé anon
      const { data, error } = await supabase.storage.createBucket(bucketConfig.name, {
        public: bucketConfig.public,
        fileSizeLimit: bucketConfig.fileSizeLimit,
        allowedMimeTypes: bucketConfig.allowedMimeTypes
      });
      
      if (error) {
        console.error(`❌ Erreur lors de la création du bucket "${bucketConfig.name}":`, error);
        results.push({ bucket: bucketConfig.name, status: 'error', error: error.message });
      } else {
        console.log(`✅ Bucket "${bucketConfig.name}" créé avec succès`);
        results.push({ bucket: bucketConfig.name, status: 'created' });
      }
    } catch (error: any) {
      console.error(`❌ Erreur lors de la création du bucket "${bucketConfig.name}":`, error);
      results.push({ bucket: bucketConfig.name, status: 'error', error: error.message });
    }
  }
  
  return results;
}

/**
 * Fonction helper pour créer les buckets depuis la console du navigateur
 * Usage: Dans la console du navigateur sur la page admin, tapez:
 * import('/src/lib/supabase/create-buckets').then(m => m.createStorageBuckets())
 */
if (typeof window !== 'undefined') {
  (window as any).createSupabaseBuckets = createStorageBuckets;
}
