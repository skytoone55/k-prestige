'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Upload, X, Plus, Trash2, Edit3, Image as ImageIcon, Type, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/Textarea';
import { fullPageContent } from '@/lib/page-content-full';
import { ImageSelector } from '@/components/admin/ImageSelector';

// Configuration pour chaque page avec TOUS les éléments
const pageConfigs: Record<string, any> = {
  'accueil': {
    title: 'Page d\'accueil',
    icon: '🏠',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text', placeholder: 'Expérience Premium' },
          { id: 'title', label: 'Titre principal', type: 'text', placeholder: 'PESSAH 2026' },
          { id: 'location', label: 'Localisation', type: 'text', placeholder: 'Cabogata Beach Hotel 5★ • Espagne' },
          { id: 'date', label: 'Dates', type: 'text', placeholder: '31 MARS - 10 AVRIL' },
          { id: 'image', label: 'Image hero', type: 'image' },
          { id: 'animation_text', label: 'Texte animation', type: 'text', placeholder: 'Animation non-stop par...' },
        ],
      },
      {
        id: 'univers',
        title: 'Les 5 Univers',
        icon: '🌍',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'href', label: 'Lien (ex: /marbella)', type: 'text' },
        ],
      },
      {
        id: 'stats',
        title: 'Statistiques',
        icon: '📊',
        type: 'array',
        itemFields: [
          { id: 'value', label: 'Valeur (nombre)', type: 'number' },
          { id: 'suffix', label: 'Suffixe (ex: +, ans, %)', type: 'text' },
          { id: 'label', label: 'Label', type: 'text' },
        ],
      },
      {
        id: 'testimonials',
        title: 'Témoignages',
        icon: '💬',
        type: 'array',
        itemFields: [
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'location', label: 'Localisation', type: 'text' },
          { id: 'text', label: 'Texte du témoignage', type: 'textarea' },
          { id: 'rating', label: 'Note (1-5)', type: 'number' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'pessah-sejour': {
    title: 'Le Séjour',
    icon: '📅',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'dates',
        title: 'Dates du Séjour',
        icon: '📆',
        type: 'object',
        fields: [
          { id: 'principal.title', label: 'Titre séjour principal', type: 'text' },
          { id: 'principal.date', label: 'Date séjour principal', type: 'text' },
          { id: 'principal.nights', label: 'Nuits séjour principal', type: 'text' },
          { id: 'weekend.title', label: 'Titre weekend', type: 'text' },
          { id: 'weekend.date', label: 'Date weekend', type: 'text' },
          { id: 'weekend.nights', label: 'Nuits weekend', type: 'text' },
        ],
      },
      {
        id: 'supervision',
        title: 'Supervision Religieuse',
        icon: '✡️',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'rav', label: 'Nom du Rav', type: 'text' },
          { id: 'viandes', label: 'Surveillance viandes', type: 'text' },
        ],
      },
      {
        id: 'animations',
        title: 'Animations',
        icon: '🎵',
        type: 'array',
        itemFields: [
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'instagram', label: 'Lien Instagram (optionnel)', type: 'text' },
        ],
      },
    ],
  },
  'pessah-hotel': {
    title: 'L\'Hôtel',
    icon: '🏨',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'hotel',
        title: 'Informations Hôtel',
        icon: 'ℹ️',
        type: 'object',
        fields: [
          { id: 'name', label: 'Nom de l\'hôtel', type: 'text' },
          { id: 'location', label: 'Localisation', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image de présentation', type: 'image' },
        ],
      },
      {
        id: 'chambres',
        title: 'Types de Chambres',
        icon: '🛏️',
        type: 'array',
        itemFields: [
          { id: 'code', label: 'Code', type: 'text' },
          { id: 'nom', label: 'Nom', type: 'text' },
          { id: 'surface', label: 'Surface', type: 'text' },
          { id: 'vue', label: 'Vue', type: 'text' },
          { id: 'special', label: 'Spécial (optionnel)', type: 'text' },
        ],
      },
    ],
  },
  'marbella': {
    title: 'Marbella',
    icon: '🍽️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'location', label: 'Localisation', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'couverts', label: 'Nombre de couverts', type: 'text' },
          { id: 'address', label: 'Adresse', type: 'text' },
          { id: 'phone', label: 'Téléphone', type: 'text' },
          { id: 'image', label: 'Image présentation', type: 'image' },
        ],
      },
      {
        id: 'services',
        title: 'Services',
        icon: '🎯',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'desc', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'marrakech': {
    title: 'Marrakech',
    icon: '📍',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image présentation', type: 'image' },
        ],
      },
    ],
  },
  'hilloula': {
    title: 'Hilloula',
    icon: '❤️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  'souccot': {
    title: 'Souccot',
    icon: '🍃',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  'contact': {
    title: 'Contact',
    icon: '✉️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'contact',
        title: 'Coordonnées',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'phone1', label: 'Téléphone 1', type: 'text' },
          { id: 'phone2', label: 'Téléphone 2', type: 'text' },
          { id: 'email', label: 'Email', type: 'text' },
          { id: 'address', label: 'Adresse', type: 'textarea' },
        ],
      },
    ],
  },
};

interface PageEditorFullProps {
  pageId: string;
}

export function PageEditorFull({ pageId }: PageEditorFullProps) {
  const config = pageConfigs[pageId];
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionId: string, fieldId: string, index?: number} | null>(null);

  useEffect(() => {
    if (!config) return;
    
    loadPageData();
    
    // Activer le premier onglet par défaut
    if (config.sections.length > 0) {
      setActiveTab(config.sections[0].id);
    }
  }, [pageId, config]);

  const loadPageData = async () => {
    if (!config) return;

    try {
      // Charger directement depuis Supabase via fetch (sans cache)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        // Ajouter timestamp pour éviter tout cache navigateur
        const timestamp = Date.now();
        const response = await fetch(
          `${supabaseUrl}/rest/v1/page_content?page_id=eq.${pageId}&select=content&_t=${timestamp}`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
            },
            cache: 'no-store',
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result && result[0]?.content) {
            console.log('[PageEditorFull] Loaded from Supabase (no-cache)');
            setData(result[0].content);
            return;
          }
        }
      }
    } catch (error) {
      console.error('[PageEditorFull] Erreur Supabase:', error);
    }

    // Fallback localStorage
    const saved = localStorage.getItem(`page_content_full_${pageId}`);
    if (saved) {
      console.log('[PageEditorFull] Using localStorage fallback');
      setData(JSON.parse(saved));
    } else {
      // Utiliser les valeurs par défaut
      console.log('[PageEditorFull] Using default values');
      const defaults = fullPageContent[pageId];
      if (defaults) {
        setData(defaults);
      }
    }
  };

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
      // Sauvegarder dans Supabase
      const supabase = (await import('@/lib/supabase/client')).createClient();

      console.log('[PageEditorFull] Saving to Supabase...', {
        pageId,
        dataKeys: Object.keys(data),
        heroTitle: data?.hero?.title
      });

      const { data: upsertResult, error } = await supabase
        .from('page_content')
        .upsert(
          {
            page_id: pageId,
            content: data,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'page_id' }
        )
        .select();

      console.log('[PageEditorFull] Supabase upsert result:', {
        result: upsertResult,
        error: error?.message || null
      });

      if (error) {
        console.error('[PageEditorFull] Erreur Supabase:', error);
        // Fallback localStorage
        localStorage.setItem(`page_content_full_${pageId}`, JSON.stringify(data));
        alert('⚠️ Sauvegarde locale uniquement (erreur Supabase: ' + error.message + ')');
      } else {
        // Vérifier que la sauvegarde a bien fonctionné en relisant
        const { data: verifyData, error: verifyError } = await supabase
          .from('page_content')
          .select('content')
          .eq('page_id', pageId)
          .single();

        console.log('[PageEditorFull] Verification read:', {
          success: !verifyError,
          heroTitle: verifyData?.content?.hero?.title,
          error: verifyError?.message || null
        });

        // Aussi sauvegarder en localStorage pour le cache
        localStorage.setItem(`page_content_full_${pageId}`, JSON.stringify(data));
        alert('✅ Contenu sauvegardé avec succès dans Supabase !');
      }
    } catch (error) {
      console.error('[PageEditorFull] Erreur:', error);
      // Fallback localStorage
      localStorage.setItem(`page_content_full_${pageId}`, JSON.stringify(data));
      alert('⚠️ Sauvegarde locale uniquement (erreur de connexion)');
    }

    setLoading(false);
  };

  const updateNestedValue = (path: string, value: any) => {
    const keys = path.split('.');
    setData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const getNestedValue = (path: string) => {
    const keys = path.split('.');
    let current = data;
    for (const key of keys) {
      if (!current || typeof current !== 'object') return '';
      current = current[key];
    }
    return current || '';
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!currentImageField) return;
    
    const { sectionId, fieldId, index } = currentImageField;
    
    if (index !== undefined) {
      setData((prev: any) => {
        const newData = { ...prev };
        if (!newData[sectionId]) newData[sectionId] = [];
        if (!newData[sectionId][index]) newData[sectionId][index] = {};
        newData[sectionId][index][fieldId] = imageUrl;
        return newData;
      });
    } else if (fieldId.includes('.')) {
      updateNestedValue(`${sectionId}.${fieldId}`, imageUrl);
    } else {
      setData((prev: any) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [fieldId]: imageUrl,
        },
      }));
    }
    
    setImageSelectorOpen(false);
    setCurrentImageField(null);
  };

  const addArrayItem = (sectionId: string, itemFields: any[]) => {
    setData((prev: any) => {
      const newData = { ...prev };
      if (!newData[sectionId]) newData[sectionId] = [];
      const newItem: any = {};
      itemFields.forEach(field => {
        newItem[field.id] = field.type === 'number' ? 0 : '';
      });
      newData[sectionId].push(newItem);
      return newData;
    });
  };

  const removeArrayItem = (sectionId: string, index: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      setData((prev: any) => {
        const newData = { ...prev };
        if (newData[sectionId] && Array.isArray(newData[sectionId])) {
          newData[sectionId] = newData[sectionId].filter((_: any, i: number) => i !== index);
        }
        return newData;
      });
    }
  };

  const renderField = (sectionId: string, field: any, value: any, index?: number) => {
    const fieldId = field.id;
    let fieldValue: any;
    
    if (index !== undefined) {
      fieldValue = data[sectionId]?.[index]?.[fieldId] || '';
    } else if (fieldId.includes('.')) {
      fieldValue = getNestedValue(`${sectionId}.${fieldId}`);
    } else {
      fieldValue = data[sectionId]?.[fieldId] || '';
    }

    if (field.type === 'image') {
      return (
        <div key={fieldId} className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <ImageIcon className="w-3 h-3 text-[var(--gold)]" />
            {field.label}
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="URL de l'image ou cliquer sur 'Choisir'"
              value={fieldValue}
              onChange={(e) => {
                const value = e.target.value;
                if (index !== undefined) {
                  setData((prev: any) => {
                    const newData = { ...prev };
                    if (!newData[sectionId]) newData[sectionId] = [];
                    if (!newData[sectionId][index]) newData[sectionId][index] = {};
                    newData[sectionId][index][fieldId] = value;
                    return newData;
                  });
                } else if (fieldId.includes('.')) {
                  updateNestedValue(`${sectionId}.${fieldId}`, value);
                } else {
                  setData((prev: any) => ({
                    ...prev,
                    [sectionId]: {
                      ...prev[sectionId],
                      [fieldId]: value,
                    },
                  }));
                }
              }}
              className="flex-1 text-sm"
              size={1}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentImageField({ sectionId, fieldId, index });
                setImageSelectorOpen(true);
              }}
              className="text-xs whitespace-nowrap"
            >
              📁 Choisir
            </Button>
            {fieldValue && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (index !== undefined) {
                    setData((prev: any) => {
                      const newData = { ...prev };
                      if (newData[sectionId]?.[index]) {
                        delete newData[sectionId][index][fieldId];
                      }
                      return newData;
                    });
                  } else if (fieldId.includes('.')) {
                    updateNestedValue(`${sectionId}.${fieldId}`, '');
                  } else {
                    setData((prev: any) => ({
                      ...prev,
                      [sectionId]: {
                        ...prev[sectionId],
                        [fieldId]: '',
                      },
                    }));
                  }
                }}
                className="text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {fieldValue && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image src={fieldValue} alt={field.label} fill className="object-cover" />
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={fieldId} className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Type className="w-3 h-3 text-[var(--gold)]" />
            {field.label}
          </label>
          <Textarea
            value={fieldValue}
            onChange={(e) => {
              if (index !== undefined) {
                setData((prev: any) => {
                  const newData = { ...prev };
                  if (!newData[sectionId]) newData[sectionId] = [];
                  if (!newData[sectionId][index]) newData[sectionId][index] = {};
                  newData[sectionId][index][fieldId] = e.target.value;
                  return newData;
                });
              } else if (fieldId.includes('.')) {
                updateNestedValue(`${sectionId}.${fieldId}`, e.target.value);
              } else {
                setData((prev: any) => ({
                  ...prev,
                  [sectionId]: {
                    ...prev[sectionId],
                    [fieldId]: e.target.value,
                  },
                }));
              }
            }}
            rows={3}
            className="w-full text-sm"
            placeholder={field.placeholder}
          />
        </div>
      );
    }

    return (
      <div key={fieldId} className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          {field.type === 'number' ? (
            <Hash className="w-3 h-3 text-[var(--gold)]" />
          ) : (
            <Type className="w-3 h-3 text-[var(--gold)]" />
          )}
          {field.label}
        </label>
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={fieldValue}
          onChange={(e) => {
            const value = field.type === 'number' ? Number(e.target.value) : e.target.value;
            if (index !== undefined) {
              setData((prev: any) => {
                const newData = { ...prev };
                if (!newData[sectionId]) newData[sectionId] = [];
                if (!newData[sectionId][index]) newData[sectionId][index] = {};
                newData[sectionId][index][fieldId] = value;
                return newData;
              });
            } else if (fieldId.includes('.')) {
              updateNestedValue(`${sectionId}.${fieldId}`, value);
            } else {
              setData((prev: any) => ({
                ...prev,
                [sectionId]: {
                  ...prev[sectionId],
                  [fieldId]: value,
                },
              }));
            }
          }}
          className="w-full text-sm"
          placeholder={field.placeholder}
        />
      </div>
    );
  };

  const activeSection = config.sections.find((s: any) => s.id === activeTab);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-2">Page non trouvée</p>
          <p className="text-sm text-gray-400">La page "{pageId}" n'existe pas dans la configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ImageSelector
        isOpen={imageSelectorOpen}
        onClose={() => {
          setImageSelectorOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelect}
        currentImageUrl={
          currentImageField
            ? (currentImageField.index !== undefined
                ? data[currentImageField.sectionId]?.[currentImageField.index]?.[currentImageField.fieldId]
                : currentImageField.fieldId.includes('.')
                ? getNestedValue(`${currentImageField.sectionId}.${currentImageField.fieldId}`)
                : data[currentImageField.sectionId]?.[currentImageField.fieldId])
            : null
        }
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="text-3xl flex-shrink-0">{config.icon}</div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{config.title}</h1>
                <p className="text-xs text-gray-500 mt-0.5">Modifiez le contenu de cette page</p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="btn-gold-primary px-5 py-2.5 text-base shadow-lg hover:shadow-xl transition-all flex-shrink-0 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="whitespace-nowrap">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Onglets horizontaux */}
      <div className="sticky top-[65px] z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {config.sections.map((section: any) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  transition-all border-b-2
                  ${activeTab === section.id
                    ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu de la section active */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {activeSection && (
          <div className="space-y-6">
            {activeSection.type === 'object' && (
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{activeSection.icon}</span>
                    <span>{activeSection.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeSection.fields.map((field: any) => renderField(activeSection.id, field, undefined))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection.type === 'array' && (
              <div className="space-y-4">
                {/* Grille sur plusieurs lignes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(data[activeSection.id] || []).map((item: any, index: number) => (
                    <Card key={index} className="border-2 border-gray-200 shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-[var(--gold)]" />
                          Élément {index + 1}
                        </CardTitle>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(activeSection.id, index)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4 max-h-[500px] overflow-y-auto">
                        {activeSection.itemFields.map((field: any) => renderField(activeSection.id, field, item, index))}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Bouton ajouter */}
                  <Card className="border-2 border-dashed border-[var(--gold)]/30 flex items-center justify-center hover:border-[var(--gold)] transition-all cursor-pointer bg-gray-50 min-h-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => addArrayItem(activeSection.id, activeSection.itemFields)}
                      className="w-full h-full flex flex-col items-center justify-center gap-2 py-8"
                    >
                      <Plus className="w-8 h-8 text-[var(--gold)]" />
                      <span className="text-sm font-medium text-gray-700">Ajouter un élément</span>
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
