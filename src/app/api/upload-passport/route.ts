import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Vérifier que les variables d'environnement sont configurées
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variables Supabase manquantes:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      });
      return NextResponse.json(
        { success: false, error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const clientName = formData.get('clientName') as string;

    console.log('Upload passeport - fichiers:', files.length, 'client:', clientName);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Créer un client Supabase avec la clé service (bypass RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Type de fichier non autorisé: ${file.type}` },
          { status: 400 }
        );
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Fichier trop volumineux (max 10MB)' },
          { status: 400 }
        );
      }

      // Générer un nom de fichier unique
      const sanitizedClientName = clientName
        ? clientName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)
        : 'unknown';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileName = `passeports/${sanitizedClientName}/${timestamp}-${randomId}.${fileExt}`;

      // Convertir le fichier en ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('inscriptions')
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);

        // Si le bucket n'existe pas, on le crée
        if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
          // Essayer de créer le bucket
          const { error: bucketError } = await supabase.storage.createBucket('inscriptions', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });

          if (!bucketError) {
            // Réessayer l'upload
            const { data: retryData, error: retryError } = await supabase.storage
              .from('inscriptions')
              .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
              });

            if (retryError) {
              return NextResponse.json(
                { success: false, error: `Erreur upload après création bucket: ${retryError.message}` },
                { status: 500 }
              );
            }

            // Récupérer l'URL publique
            const { data: { publicUrl } } = supabase.storage
              .from('inscriptions')
              .getPublicUrl(fileName);

            uploadedUrls.push(publicUrl);
            continue;
          }
        }

        return NextResponse.json(
          { success: false, error: `Erreur upload: ${error.message}` },
          { status: 500 }
        );
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('inscriptions')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length
    });

  } catch (error) {
    console.error('Error uploading passports:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}
