'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Plus, Trash2 } from 'lucide-react';
import { ImageSelector } from '@/components/admin/ImageSelector';
// Utilisation de img standard pour compatibilité Supabase

interface Section {
  id: string;
  type: 'titre' | 'texte' | 'image' | 'liste' | 'bouton';
  contenu: any;
  ordre: number;
}

const defaultSections: Section[] = [
  {
    id: 'hero-titre',
    type: 'titre',
    contenu: { texte: 'PESSAH 2026', niveau: 1 },
    ordre: 1,
  },
  {
    id: 'hero-sous-titre',
    type: 'texte',
    contenu: { texte: 'Cabogata Beach Hotel 5★ • Espagne' },
    ordre: 2,
  },
  {
    id: 'hero-dates',
    type: 'texte',
    contenu: { texte: '31 Mars - 10 Avril 2026' },
    ordre: 3,
  },
  {
    id: 'hotel-titre',
    type: 'titre',
    contenu: { texte: 'Cabogata Beach Hotel 5★', niveau: 2 },
    ordre: 4,
  },
  {
    id: 'hotel-description',
    type: 'texte',
    contenu: { texte: 'Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026' },
    ordre: 5,
  },
  {
    id: 'hotel-image',
    type: 'image',
    contenu: { url: '/images/hotel/FAÇADE.jpg', alt: 'Hôtel' },
    ordre: 6,
  },
];

export default function Pessah2026ContenuPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImageFor, setSelectedImageFor] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('contenu_pages')
        .select('*')
        .eq('page_id', 'pessah-2026')
        .order('ordre', { ascending: true });

      if (error || !data || data.length === 0) {
        // Utiliser les valeurs par défaut
        setSections(defaultSections);
      } else {
        setSections(data.map(item => ({
          id: item.section_id,
          type: item.type as Section['type'],
          contenu: item.contenu,
          ordre: item.ordre,
        })));
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSections(defaultSections);
    } finally {
      setLoading(false);
    }
  };

  const saveSections = async () => {
    setSaving(true);
    try {
      // Supprimer les anciennes sections
      await supabase
        .from('contenu_pages')
        .delete()
        .eq('page_id', 'pessah-2026');

      // Insérer les nouvelles
      const toInsert = sections.map(section => ({
        page_id: 'pessah-2026',
        section_id: section.id,
        type: section.type,
        contenu: section.contenu,
        ordre: section.ordre,
      }));

      const { error } = await supabase
        .from('contenu_pages')
        .insert(toInsert);

      if (error) throw error;

      // Sauvegarder aussi dans localStorage comme backup
      localStorage.setItem('contenu_pessah_2026', JSON.stringify(sections));
      
      alert('Contenu sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      // Fallback localStorage
      localStorage.setItem('contenu_pessah_2026', JSON.stringify(sections));
      alert('Contenu sauvegardé localement (Supabase non disponible)');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      contenu: type === 'titre' ? { texte: 'Nouveau titre', niveau: 2 } :
               type === 'image' ? { url: '', alt: '' } :
               type === 'liste' ? { items: [] } :
               type === 'bouton' ? { texte: 'Bouton', url: '' } :
               { texte: '' },
      ordre: sections.length + 1,
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (id: string) => {
    if (confirm('Supprimer cette section ?')) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contenu - Pessah 2026</h1>
          <p className="text-muted-foreground mt-1">
            Modifiez le contenu de la page Pessah 2026
          </p>
        </div>
        <Button onClick={saveSections} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Boutons ajouter section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => addSection('titre')}>
              <Plus className="w-4 h-4 mr-2" />
              Titre
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('texte')}>
              <Plus className="w-4 h-4 mr-2" />
              Texte
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('image')}>
              <Plus className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('liste')}>
              <Plus className="w-4 h-4 mr-2" />
              Liste
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('bouton')}>
              <Plus className="w-4 h-4 mr-2" />
              Bouton
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">{section.type}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.type === 'titre' && (
                <>
                  <Input
                    label="Texte"
                    value={section.contenu.texte || ''}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, texte: e.target.value }
                    })}
                  />
                  <select
                    value={section.contenu.niveau || 2}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, niveau: parseInt(e.target.value) }
                    })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                  </select>
                </>
              )}

              {section.type === 'texte' && (
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">Texte</label>
                  <textarea
                    value={section.contenu.texte || ''}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, texte: e.target.value }
                    })}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              )}

              {section.type === 'image' && (
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">Image</label>
                  {section.contenu.url ? (
                    <div className="space-y-2">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <img
                          src={section.contenu.url}
                          alt={section.contenu.alt || ''}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedImageFor(section.id)}
                        >
                          Changer l&apos;image
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSection(section.id, {
                            contenu: { url: '', alt: '' }
                          })}
                          className="text-destructive"
                        >
                          Supprimer
                        </Button>
                      </div>
                      <Input
                        label="Texte alternatif"
                        value={section.contenu.alt || ''}
                        onChange={(e) => updateSection(section.id, {
                          contenu: { ...section.contenu, alt: e.target.value }
                        })}
                      />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImageFor(section.id)}
                      className="w-full"
                    >
                      Sélectionner une image
                    </Button>
                  )}
                </div>
              )}

              {section.type === 'liste' && (
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">Éléments de la liste</label>
                  {(section.contenu.items || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const items = [...(section.contenu.items || [])];
                          items[idx] = e.target.value;
                          updateSection(section.id, {
                            contenu: { ...section.contenu, items }
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const items = [...(section.contenu.items || [])];
                          items.splice(idx, 1);
                          updateSection(section.id, {
                            contenu: { ...section.contenu, items }
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const items = [...(section.contenu.items || []), ''];
                      updateSection(section.id, {
                        contenu: { ...section.contenu, items }
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un élément
                  </Button>
                </div>
              )}

              {section.type === 'bouton' && (
                <>
                  <Input
                    label="Texte du bouton"
                    value={section.contenu.texte || ''}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, texte: e.target.value }
                    })}
                  />
                  <Input
                    label="URL"
                    value={section.contenu.url || ''}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, url: e.target.value }
                    })}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sélecteur d'images */}
      <ImageSelector
        isOpen={selectedImageFor !== null}
        onClose={() => setSelectedImageFor(null)}
        onSelect={(url) => {
          if (selectedImageFor) {
            updateSection(selectedImageFor, {
              contenu: { ...sections.find(s => s.id === selectedImageFor)?.contenu, url }
            });
          }
          setSelectedImageFor(null);
        }}
        currentImageUrl={selectedImageFor ? sections.find(s => s.id === selectedImageFor)?.contenu.url : null}
      />
    </div>
  );
}

