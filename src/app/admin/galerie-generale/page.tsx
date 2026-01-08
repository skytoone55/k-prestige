'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Upload, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
// Utilisation de img standard pour compatibilité Supabase

interface GalleryImage {
  id: string;
  nom: string;
  description: string | null;
  url: string;
  tags: string[];
  categorie: string | null;
  taille: number | null;
  largeur: number | null;
  hauteur: number | null;
  created_at: string;
}

export default function GalerieGeneralePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newImageName, setNewImageName] = useState('');
  const [newImageDescription, setNewImageDescription] = useState('');
  const [newImageTags, setNewImageTags] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('galerie_generale')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Si la table n'existe pas, utiliser localStorage comme fallback
        const saved = localStorage.getItem('galerie_generale');
        if (saved) {
          setImages(JSON.parse(saved));
        }
      } else if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const saved = localStorage.getItem('galerie_generale');
      if (saved) {
        setImages(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveImages = async (newImages: GalleryImage[]) => {
    setImages(newImages);
    localStorage.setItem('galerie_generale', JSON.stringify(newImages));
    
    // Essayer de sauvegarder dans Supabase aussi
    try {
      // Pour chaque image, essayer de l'insérer/mettre à jour
      for (const img of newImages) {
        const { error } = await supabase
          .from('galerie_generale')
          .upsert({
            id: img.id,
            nom: img.nom,
            description: img.description,
            url: img.url,
            tags: img.tags,
            categorie: img.categorie,
            taille: img.taille,
            largeur: img.largeur,
            hauteur: img.hauteur,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('Erreur sauvegarde Supabase:', error);
      }
    } catch (error) {
      // Ignorer les erreurs Supabase, on utilise localStorage
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 52428800) {
      alert('Le fichier est trop volumineux. Taille maximale : 50MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `galerie-generale/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Obtenir les dimensions de l'image
      const img = new window.Image();
      img.src = publicUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const tags = newImageTags.split(',').map(t => t.trim()).filter(t => t);
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        nom: newImageName || file.name.replace(/\.[^/.]+$/, ''),
        description: newImageDescription || null,
        url: publicUrl,
        tags,
        categorie: newImageCategory || null,
        taille: file.size,
        largeur: img.width,
        hauteur: img.height,
        created_at: new Date().toISOString(),
      };

      await saveImages([...images, newImage]);
      
      setNewImageName('');
      setNewImageDescription('');
      setNewImageTags('');
      setNewImageCategory('');
      e.target.value = '';
      alert('Image ajoutée avec succès !');
    } catch (error: any) {
      console.error('Erreur upload:', error);
      alert(error.message || 'Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    const image = images.find(img => img.id === id);
    if (!image) return;

    try {
      // Supprimer de Supabase Storage
      if (image.url.includes('supabase.co')) {
        const urlParts = image.url.split('/storage/v1/object/public/images/');
        if (urlParts[1]) {
          await supabase.storage
            .from('images')
            .remove([urlParts[1]]);
        }
      }

      // Supprimer de la base de données
      try {
        await supabase
          .from('galerie_generale')
          .delete()
          .eq('id', id);
      } catch (error) {
        // Ignorer si la table n'existe pas
      }

      const updated = images.filter(img => img.id !== id);
      await saveImages(updated);
      alert('Image supprimée avec succès !');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const categories = Array.from(new Set(images.map(img => img.categorie).filter(Boolean))) as string[];
  const filteredImages = images.filter(img => {
    const matchesSearch = !searchTerm || 
      img.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || img.categorie === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Galerie Photo Générale</h1>
        <p className="text-muted-foreground mt-1">
          Gérez toutes vos photos centralement. Elles seront disponibles dans tous les éditeurs de contenu.
        </p>
      </div>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une photo</CardTitle>
          <CardDescription>Uploader une nouvelle image dans la galerie générale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nom de l'image"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
              placeholder="Nom descriptif"
            />
            <Input
              label="Catégorie (optionnel)"
              value={newImageCategory}
              onChange={(e) => setNewImageCategory(e.target.value)}
              placeholder="ex: Hôtel, Piscine, Chambre..."
            />
          </div>
          <Input
            label="Description (optionnel)"
            value={newImageDescription}
            onChange={(e) => setNewImageDescription(e.target.value)}
            placeholder="Description de l'image"
          />
          <Input
            label="Tags (séparés par des virgules)"
            value={newImageTags}
            onChange={(e) => setNewImageTags(e.target.value)}
            placeholder="ex: hôtel, extérieur, vue mer"
          />
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                {uploading ? 'Upload en cours...' : 'Cliquez pour uploader'}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher (nom, description, tags)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grille d'images */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {filteredImages.length} image{filteredImages.length > 1 ? 's' : ''} trouvée{filteredImages.length > 1 ? 's' : ''}
        </p>
        {filteredImages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucune image trouvée.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <Card key={img.id} className="overflow-hidden">
                <div className="relative aspect-video group">
                  <img
                    src={img.url}
                    alt={img.nom}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteImage(img.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm truncate">{img.nom}</h3>
                  {img.categorie && (
                    <p className="text-xs text-muted-foreground">{img.categorie}</p>
                  )}
                  {img.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {img.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-secondary px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

