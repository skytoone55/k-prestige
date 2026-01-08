'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, X, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
// Utilisation de img standard pour compatibilité Supabase

interface GalleryImage {
  id: string;
  nom: string;
  url: string;
  tags: string[];
  categorie: string | null;
}

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentImageUrl?: string | null;
}

export function ImageSelector({ isOpen, onClose, onSelect, currentImageUrl }: ImageSelectorProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('galerie_generale')
        .select('id, nom, url, tags, categorie')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback localStorage
        const saved = localStorage.getItem('galerie_generale');
        if (saved) {
          const allImages = JSON.parse(saved);
          setImages(allImages.map((img: any) => ({
            id: img.id,
            nom: img.nom,
            url: img.url,
            tags: img.tags || [],
            categorie: img.categorie,
          })));
        }
      } else if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const saved = localStorage.getItem('galerie_generale');
      if (saved) {
        const allImages = JSON.parse(saved);
        setImages(allImages.map((img: any) => ({
          id: img.id,
          nom: img.nom,
          url: img.url,
          tags: img.tags || [],
          categorie: img.categorie,
        })));
      }
    } finally {
      setLoading(false);
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
      alert('Type de fichier non autorisé');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `galerie-generale/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Ajouter à la liste locale
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        nom: file.name.replace(/\.[^/.]+$/, ''),
        url: publicUrl,
        tags: [],
        categorie: null,
      };

      setImages([newImage, ...images]);
      
      // Sauvegarder dans localStorage
      const saved = localStorage.getItem('galerie_generale');
      const allImages = saved ? JSON.parse(saved) : [];
      allImages.unshift({
        ...newImage,
        description: null,
        taille: file.size,
        largeur: null,
        hauteur: null,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('galerie_generale', JSON.stringify(allImages));

      // Sélectionner automatiquement la nouvelle image
      onSelect(publicUrl);
      e.target.value = '';
    } catch (error: any) {
      console.error('Erreur upload:', error);
      alert(error.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const categories = Array.from(new Set(images.map(img => img.categorie).filter(Boolean))) as string[];
  const filteredImages = images.filter(img => {
    const matchesSearch = !searchTerm || 
      img.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || img.categorie === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sélectionner une image</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {/* Filtres */}
          <div className="grid md:grid-cols-2 gap-4 sticky top-0 bg-background pb-4 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher..."
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

          {/* Upload rapide */}
          <div className="border-2 border-dashed rounded-lg p-4">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mb-2">
                {uploading ? 'Upload en cours...' : 'Uploader une nouvelle image'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Grille d'images */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune image trouvée.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    onSelect(img.url);
                    onClose();
                  }}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageUrl === img.url
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-transparent hover:border-primary'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.nom}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                    {img.nom}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

