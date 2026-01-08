'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
// Utilisation de img standard pour les images Supabase

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category_id: string;
  uploaded_at: string;
}

export default function GaleriePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newImageAlt, setNewImageAlt] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
    loadImages();
  }, []);

  const loadCategories = async () => {
    const saved = localStorage.getItem('galerie_categories');
    if (saved) {
      const cats = JSON.parse(saved);
      setCategories(cats);
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].id);
      }
    }
  };

  const loadImages = async () => {
    const saved = localStorage.getItem('galerie_images');
    if (saved) {
      setImages(JSON.parse(saved));
    }
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('galerie_categories', JSON.stringify(newCategories));
  };

  const saveImages = (newImages: GalleryImage[]) => {
    setImages(newImages);
    localStorage.setItem('galerie_images', JSON.stringify(newImages));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      slug,
    };

    saveCategories([...categories, newCategory]);
    setNewCategoryName('');
    if (!selectedCategory) {
      setSelectedCategory(newCategory.id);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Toutes les images associées seront également supprimées.')) {
      const updated = categories.filter(cat => cat.id !== id);
      saveCategories(updated);
      
      // Supprimer aussi les images de cette catégorie
      const updatedImages = images.filter(img => img.category_id !== id);
      saveImages(updatedImages);

      if (selectedCategory === id && updated.length > 0) {
        setSelectedCategory(updated[0].id);
      } else if (updated.length === 0) {
        setSelectedCategory(null);
      }
    }
  };

  const handleUpdateCategoryName = (id: string, newName: string) => {
    const updated = categories.map(cat => 
      cat.id === id 
        ? { ...cat, name: newName.trim() }
        : cat
    );
    saveCategories(updated);
    setEditingCategory(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCategory) return;

    // Vérifier la taille du fichier (50MB max)
    if (file.size > 52428800) {
      alert('Le fichier est trop volumineux. Taille maximale : 50MB');
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF');
      return;
    }

    setUploading(true);
    try {
      const category = categories.find(c => c.id === selectedCategory);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `galerie/${category.slug}/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: publicUrl,
        alt: newImageAlt || file.name.replace(/\.[^/.]+$/, ''),
        category_id: selectedCategory,
        uploaded_at: new Date().toISOString(),
      };

      saveImages([...images, newImage]);
      setNewImageAlt('');
      e.target.value = '';
      alert('Image ajoutée avec succès !');
    } catch (error: any) {
      console.error('Erreur upload:', error);
      let errorMessage = 'Erreur lors de l\'upload de l\'image';
      
      if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Le bucket "images" n\'existe pas. Veuillez le créer dans Supabase Storage.';
      } else if (error.message?.includes('new row violates row-level security')) {
        errorMessage = 'Permission refusée. Vérifiez les politiques RLS du bucket.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectExistingImage = (imagePath: string) => {
    if (!selectedCategory) return;

    const newImage: GalleryImage = {
      id: Date.now().toString(),
      src: imagePath,
      alt: newImageAlt || imagePath.split('/').pop() || 'Image',
      category_id: selectedCategory,
      uploaded_at: new Date().toISOString(),
    };

    saveImages([...images, newImage]);
    setNewImageAlt('');
    setShowImageSelector(false);
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    const image = images.find(img => img.id === id);
    if (!image) return;

    try {
      // Si l'image est dans Supabase Storage, la supprimer
      if (image.src.includes('supabase.co') || image.src.includes('storage.googleapis.com')) {
        // Extraire le chemin depuis l'URL
        let filePath = '';
        
        if (image.src.includes('/storage/v1/object/public/images/')) {
          filePath = image.src.split('/storage/v1/object/public/images/')[1];
        } else if (image.src.includes('/storage/v1/object/sign/images/')) {
          // Pour les URLs signées, on doit extraire différemment
          const match = image.src.match(/images\/(.+?)(\?|$)/);
          if (match) filePath = match[1];
        }

        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([filePath]);

          if (deleteError) {
            console.error('Erreur suppression:', deleteError);
            // On continue quand même à supprimer de la liste locale
          }
        }
      }

      const updated = images.filter(img => img.id !== id);
      saveImages(updated);
      alert('Image supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  };

  const [showImageSelector, setShowImageSelector] = useState(false);
  const availableImages = [
    '/images/piscines/POOLS & SEA.jpg',
    '/images/piscines/POOL.jpg',
    '/images/spa/SPA.jpg',
    '/images/restaurant/ORIGEN.jpg',
    '/images/events/EVENTS.jpg',
    '/images/hotel/FAÇADE.jpg',
    '/images/chambres/MEDITERRANEAN SUITE.jpg',
    '/images/chambres/ROOM SEA VIEW.jpg',
    '/images/chambres/ROOM.jpg',
    '/images/chambres/MEDITERRANEAN 1.jpg',
    '/images/chambres/MEDITERRANEAN 2.jpg',
    '/images/hero/PANORAMIC.jpg',
    '/images/hero/PANORAMIC VIEW.jpg',
  ];

  const currentCategoryImages = selectedCategory 
    ? images.filter(img => img.category_id === selectedCategory)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion de la galerie</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les catégories et les images de votre galerie
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Colonne gauche - Catégories */}
        <div className="space-y-6">
          {/* Ajouter une catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
              <CardDescription>Créez et gérez vos catégories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de la catégorie"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1"
                />
                <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune catégorie. Créez-en une pour commencer.
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        selectedCategory === category.id ? 'bg-primary/10 border-primary' : 'hover:bg-secondary/50'
                      }`}
                    >
                      {editingCategory === category.id ? (
                        <Input
                          defaultValue={category.name}
                          onBlur={(e) => handleUpdateCategoryName(category.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCategoryName(category.id, (e.target as HTMLInputElement).value);
                            }
                            if (e.key === 'Escape') {
                              setEditingCategory(null);
                            }
                          }}
                          autoFocus
                          className="flex-1"
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedCategory(category.id)}
                            className="flex-1 text-left"
                          >
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {images.filter(img => img.category_id === category.id).length} image(s)
                            </p>
                          </button>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCategory(category.id)}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Images */}
        <div className="space-y-6">
          {selectedCategory ? (
            <>
              {/* Ajouter des images */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter des images</CardTitle>
                  <CardDescription>
                    Catégorie: {categories.find(c => c.id === selectedCategory)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Description de l'image (alt)"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Description de l'image"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">Uploader</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowImageSelector(true)}
                      className="h-32 flex flex-col items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span>Sélectionner</span>
                    </Button>
                  </div>
                  
                  {uploading && (
                    <p className="text-sm text-muted-foreground text-center">Upload en cours...</p>
                  )}
                </CardContent>
              </Card>

              {/* Liste des images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images de la catégorie</CardTitle>
                  <CardDescription>
                    {currentCategoryImages.length} image(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentCategoryImages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucune image dans cette catégorie.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {currentCategoryImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
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
                          <p className="text-xs text-muted-foreground mt-1 truncate">{img.alt}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Sélectionnez une catégorie pour gérer ses images
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal sélection image existante */}
      {showImageSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sélectionner une image existante</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowImageSelector(false);
                    setNewImageAlt('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableImages.map((imgPath) => (
                  <button
                    key={imgPath}
                    onClick={() => handleSelectExistingImage(imgPath)}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={imgPath}
                      alt={imgPath}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
