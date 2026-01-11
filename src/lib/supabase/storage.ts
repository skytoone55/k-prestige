import { createClient } from './client';

/**
 * Upload une image vers Supabase Storage
 * @param file - Le fichier à uploader
 * @param bucket - Le bucket Supabase (défaut: 'galerie')
 * @param folder - Le dossier dans le bucket (défaut: 'images')
 * @returns L'URL publique de l'image uploadée
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: string = 'galerie',
  folder: string = 'images'
): Promise<string> {
  const supabase = createClient();
  
  // Générer un nom de fichier unique
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Compresser l'image avant upload si c'est une image
  let fileToUpload: File | Blob = file;
  if (file.type.startsWith('image/')) {
    fileToUpload = await compressImageFile(file);
  }
  
  // Upload vers Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileToUpload, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    // Si le bucket n'existe pas, fallback vers base64
    if (error.message.includes('Bucket not found') || error.message.includes('not found') || error.message.includes('does not exist')) {
      console.warn(`⚠️ Bucket "${bucket}" non trouvé dans Supabase. Utilisation du fallback base64.`);
      console.warn('💡 Pour activer Supabase Storage, créez le bucket dans le dashboard Supabase.');
      
      // Convertir en base64 comme fallback
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          // Compresser encore plus si c'est trop gros
          if (base64.length > 1.5 * 1024 * 1024) {
            // Réessayer avec compression plus agressive
            compressImageFile(file, 1280, 1280, 0.6).then(blob => {
              const reader2 = new FileReader();
              reader2.onload = (e2) => resolve(e2.target?.result as string);
              reader2.onerror = reject;
              reader2.readAsDataURL(blob);
            }).catch(reject);
          } else {
            resolve(base64);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileToUpload as Blob);
      });
    }
    
    // Si erreur RLS, message clair avec instructions
    if (error.message.includes('row-level security') || error.message.includes('RLS') || error.message.includes('policy')) {
      console.error('❌ Erreur RLS Supabase Storage:', error.message);
      console.error('💡 Pour corriger, exécutez la migration SQL: supabase/migrations/002_fix_storage_rls.sql');
      console.error('💡 Ou cliquez sur le bouton "⚙️ Config Supabase" dans l\'admin pour configurer automatiquement.');
      
      // Fallback base64 temporairement
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          if (base64.length > 1.5 * 1024 * 1024) {
            compressImageFile(file, 1280, 1280, 0.6).then(blob => {
              const reader2 = new FileReader();
              reader2.onload = (e2) => resolve(e2.target?.result as string);
              reader2.onerror = reject;
              reader2.readAsDataURL(blob);
            }).catch(reject);
          } else {
            resolve(base64);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileToUpload as Blob);
      });
    }
    
    throw new Error(`Erreur lors de l'upload: ${error.message}`);
  }
  
  // Récupérer l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return publicUrl;
}

/**
 * Supprime une image de Supabase Storage
 */
export async function deleteImageFromSupabase(
  url: string,
  bucket: string = 'galerie'
): Promise<void> {
  const supabase = createClient();
  
  // Extraire le nom du fichier de l'URL
  const urlParts = url.split('/');
  const fileName = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/');
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);
  
  if (error) {
    console.error('Erreur lors de la suppression:', error);
    // Ne pas throw pour éviter de bloquer si l'image n'existe plus
  }
}

/**
 * Compresse une image avant upload
 */
async function compressImageFile(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculer les nouvelles dimensions en gardant le ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Erreur lors de la compression'));
            }
          },
          file.type || 'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
