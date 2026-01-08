'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Plus, Trash2 } from 'lucide-react';
import { ImageSelector } from '@/components/admin/ImageSelector';

interface Section {
  id: string;
  type: 'titre' | 'texte' | 'image' | 'liste' | 'bouton' | 'tarif';
  contenu: any;
  ordre: number;
}

export default function TarifsContenuPage() {
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
        .eq('page_id', 'tarifs')
        .order('ordre', { ascending: true });

      if (error || !data || data.length === 0) {
        setSections([]);
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
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSections = async () => {
    setSaving(true);
    try {
      await supabase
        .from('contenu_pages')
        .delete()
        .eq('page_id', 'tarifs');

      const toInsert = sections.map(section => ({
        page_id: 'tarifs',
        section_id: section.id,
        type: section.type,
        contenu: section.contenu,
        ordre: section.ordre,
      }));

      const { error } = await supabase
        .from('contenu_pages')
        .insert(toInsert);

      if (error) throw error;
      
      localStorage.setItem('contenu_tarifs', JSON.stringify(sections));
      alert('Contenu sauvegardé avec succès !');
    } catch (error) {
      localStorage.setItem('contenu_tarifs', JSON.stringify(sections));
      alert('Contenu sauvegardé localement');
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
               type === 'tarif' ? { categorie: '', prix: '' } :
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
          <h1 className="text-3xl font-bold">Contenu - Tarifs</h1>
          <p className="text-muted-foreground mt-1">
            Modifiez le contenu de la page Tarifs
          </p>
        </div>
        <Button onClick={saveSections} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

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
            <Button variant="outline" size="sm" onClick={() => addSection('tarif')}>
              <Plus className="w-4 h-4 mr-2" />
              Tarif
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('bouton')}>
              <Plus className="w-4 h-4 mr-2" />
              Bouton
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  className="text-destructive"
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

              {section.type === 'tarif' && (
                <>
                  <Input
                    label="Catégorie"
                    value={section.contenu.categorie || ''}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, categorie: e.target.value }
                    })}
                    placeholder="ex: Adulte (chambre double)"
                  />
                  <Input
                    label="Prix"
                    value={section.contenu.prix || ''}
                    onChange={(e) => updateSection(section.id, {
                      contenu: { ...section.contenu, prix: e.target.value }
                    })}
                    placeholder="ex: 2 190 €"
                  />
                </>
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
      />
    </div>
  );
}

