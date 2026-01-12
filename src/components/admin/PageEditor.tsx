'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/Textarea';
import { defaultPageContent } from '@/lib/page-content';

// Constantes Supabase hardcodées pour éviter les problèmes d'env
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

// Configuration spécifique pour chaque page
const pageConfigs: Record<string, {
  title: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'date';
    description?: string;
  }>;
}> = {
  'accueil': {
    title: 'Page d\'accueil',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Expérience Premium)', type: 'text' },
      { id: 'hero_title', label: 'Titre principal (PESSAH 2026)', type: 'text' },
      { id: 'hero_location', label: 'Localisation (Cabogata Beach Hotel 5★ • Espagne)', type: 'text' },
      { id: 'hero_date', label: 'Dates (31 MARS - 10 AVRIL)', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'animation_text', label: 'Texte animation (Laurent Folies...)', type: 'text' },
    ],
  },
  'pessah-main': {
    title: 'Pessah 2026 - Page principale',
    fields: [
      { id: 'hero_title', label: 'Titre principal (PESSAH 2026)', type: 'text' },
      { id: 'hero_location', label: 'Localisation (Cabogata Beach Hotel 5★ • Espagne)', type: 'text' },
      { id: 'hero_date', label: 'Dates (31 Mars - 10 Avril 2026)', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'hotel_title', label: 'Titre section hôtel', type: 'text' },
      { id: 'hotel_description', label: 'Description hôtel', type: 'textarea' },
      { id: 'hotel_image', label: 'Image hôtel', type: 'image' },
    ],
  },
  'pessah-sejour': {
    title: 'Le Séjour',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Séjour Premium)', type: 'text' },
      { id: 'hero_title', label: 'Titre (Le Séjour)', type: 'text' },
      { id: 'hero_description', label: 'Description hero', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'date_principal', label: 'Date séjour principal (31 Mars - 10 Avril 2026)', type: 'text' },
      { id: 'date_weekend', label: 'Date weekend prolongé (10 - 12 Avril 2026)', type: 'text' },
      { id: 'supervision_title', label: 'Titre supervision (Glatt Kasher Laméhadrine)', type: 'text' },
      { id: 'supervision_rav', label: 'Nom du Rav (Rav Mordehai Cohen de Malaga)', type: 'text' },
      { id: 'supervision_viandes', label: 'Surveillance viandes (Rav Ephraïm Cremisi)', type: 'text' },
    ],
  },
  'pessah-hotel': {
    title: 'L\'Hôtel',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Hôtel 5 Étoiles)', type: 'text' },
      { id: 'hero_title', label: 'Titre (L\'Hôtel)', type: 'text' },
      { id: 'hero_description', label: 'Description hero', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'hotel_name', label: 'Nom de l\'hôtel', type: 'text' },
      { id: 'hotel_location', label: 'Localisation', type: 'text' },
      { id: 'presentation_text', label: 'Texte de présentation', type: 'textarea' },
    ],
  },
  'marbella': {
    title: 'Marbella',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Restaurant Casher)', type: 'text' },
      { id: 'hero_title', label: 'Titre (El Dorado)', type: 'text' },
      { id: 'hero_location', label: 'Localisation (Marbella, Espagne)', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'main_title', label: 'Titre principal section', type: 'text' },
      { id: 'main_description', label: 'Description principale', type: 'textarea' },
      { id: 'couverts', label: 'Nombre de couverts', type: 'text' },
      { id: 'address', label: 'Adresse du restaurant', type: 'text' },
    ],
  },
  'marrakech': {
    title: 'Marrakech',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Service Traiteur)', type: 'text' },
      { id: 'hero_title', label: 'Titre principal (Marrakech)', type: 'text' },
      { id: 'hero_description', label: 'Description hero', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'main_title', label: 'Titre section principale', type: 'text' },
      { id: 'presentation_text', label: 'Texte de présentation', type: 'textarea' },
      { id: 'presentation_image', label: 'Image présentation', type: 'image' },
    ],
  },
  'hilloula': {
    title: 'Hilloula',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Pèlerinages Spirituels)', type: 'text' },
      { id: 'hero_title', label: 'Titre principal (Hilloula)', type: 'text' },
      { id: 'hero_description', label: 'Description hero', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'main_title', label: 'Titre section principale (Voyages Organisés)', type: 'text' },
      { id: 'presentation_text', label: 'Texte de présentation', type: 'textarea' },
    ],
  },
  'souccot': {
    title: 'Souccot',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (E-commerce)', type: 'text' },
      { id: 'hero_title', label: 'Titre principal (Souccot)', type: 'text' },
      { id: 'hero_description', label: 'Description hero', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'presentation_text', label: 'Texte de présentation', type: 'textarea' },
    ],
  },
  'contact': {
    title: 'Contact',
    fields: [
      { id: 'hero_subtitle', label: 'Sous-titre hero (Contactez-nous)', type: 'text' },
      { id: 'hero_title', label: 'Titre (Contactez-nous)', type: 'text' },
      { id: 'hero_description', label: 'Description hero', type: 'text' },
      { id: 'hero_image', label: 'Image hero', type: 'image' },
      { id: 'phone1', label: 'Téléphone 1', type: 'text' },
      { id: 'phone2', label: 'Téléphone 2', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' },
      { id: 'address', label: 'Adresse', type: 'textarea' },
    ],
  },
};

interface PageEditorProps {
  pageId: string;
}

export function PageEditor({ pageId }: PageEditorProps) {
  const config = pageConfigs[pageId];
  const [content, setContent] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!config) return;

    // Charger UNIQUEMENT depuis Supabase - PAS de localStorage
    const loadData = async () => {
      // Initialiser avec valeurs par défaut
      const defaults = defaultPageContent[pageId];
      if (defaults) {
        setContent(defaults.content || {});
        setImages(defaults.images || {});
      }

      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            cache: 'no-store',
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result && result[0]?.content) {
            console.log('[PageEditor] ✅ Loaded from Supabase');
            // Adapter le format si nécessaire
            const supabaseContent = result[0].content;
            if (supabaseContent.content) {
              setContent(supabaseContent.content);
            }
            if (supabaseContent.images) {
              setImages(supabaseContent.images);
            }
          }
        }
      } catch (error) {
        console.error('[PageEditor] ❌ Erreur Supabase:', error);
      }
    };

    loadData();
  }, [pageId, config]);

  if (!config) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Page non trouvée</p>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);

    try {
      // Sauvegarder UNIQUEMENT dans Supabase - PAS de localStorage
      const supabase = (await import('@/lib/supabase/client')).createClient();

      const { error } = await supabase
        .from('page_content')
        .upsert(
          {
            page_id: pageId,
            content: { content, images },
            updated_at: new Date().toISOString()
          },
          { onConflict: 'page_id' }
        );

      if (error) {
        console.error('[PageEditor] ❌ Erreur Supabase:', error);
        alert('❌ Erreur Supabase: ' + error.message);
      } else {
        console.log('[PageEditor] ✅ Saved to Supabase');
        alert('✅ Contenu sauvegardé avec succès dans Supabase !');
      }
    } catch (error) {
      console.error('[PageEditor] ❌ Erreur:', error);
      alert('❌ Erreur de connexion');
    }

    setLoading(false);
  };

  const handleImageUpload = (field: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages({ ...images, [field]: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <p className="text-muted-foreground mt-1">Modifiez le contenu de cette page</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenu texte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.fields
            .filter(f => f.type !== 'image')
            .map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                  {field.description && (
                    <span className="text-xs text-gray-500 ml-2">({field.description})</span>
                  )}
                </label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={content[field.id] || ''}
                    onChange={(e) => setContent({ ...content, [field.id]: e.target.value })}
                    rows={4}
                    className="w-full"
                  />
                ) : (
                  <Input
                    value={content[field.id] || ''}
                    onChange={(e) => setContent({ ...content, [field.id]: e.target.value })}
                    placeholder={`Entrez ${field.label.toLowerCase()}`}
                    className="w-full"
                  />
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.fields
            .filter(f => f.type === 'image')
            .map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-2">{field.label}</label>
                {images[field.id] ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image src={images[field.id]} alt={field.label} fill className="object-cover" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        const newImages = { ...images };
                        delete newImages[field.id];
                        setImages(newImages);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(field.id, file);
                      }}
                      className="hidden"
                      id={field.id}
                    />
                    <label htmlFor={field.id}>
                      <Button variant="outline" asChild>
                        <span>Choisir une image</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 sticky bottom-0 bg-gray-50 p-4 -mx-8 border-t">
        <Button onClick={handleSave} disabled={loading} className="btn-gold-primary">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
}
