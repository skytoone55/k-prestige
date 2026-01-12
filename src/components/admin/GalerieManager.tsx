'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Upload, X, Save, Edit3, Check } from 'lucide-react';
import Image from 'next/image';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/supabase/storage';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GalleryImage {
  id: string;
  category_id: string;
  src: string;
  alt: string;
}

export function GalerieManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger depuis Supabase
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data: galerieData, error } = await supabase
        .from('galerie_content')
        .select('categories, images')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (!error && galerieData) {
        console.log('[GalerieManager] Loaded from Supabase:', {
          categories: galerieData.categories?.length || 0,
          images: galerieData.images?.length || 0
        });
        setCategories(galerieData.categories || []);
        setImages(galerieData.images || []);
        // Cache en localStorage
        localStorage.setItem('galerie_categories', JSON.stringify(galerieData.categories || []));
        localStorage.setItem('galerie_images', JSON.stringify(galerieData.images || []));
        return;
      }

      if (error) {
        console.warn('[GalerieManager] Supabase error:', error.message);
      }
    } catch (error) {
      console.error('[GalerieManager] Error loading from Supabase:', error);
    }

    // Fallback localStorage
    const savedCategories = localStorage.getItem('galerie_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    const savedImages = localStorage.getItem('galerie_images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    // Sauvegarder dans localStorage (solution simple qui fonctionne)
    localStorage.setItem('galerie_categories', JSON.stringify(newCategories));
  };

  const saveImages = (newImages: GalleryImage[]) => {
    setImages(newImages);
    
    // Sauvegarder par catégorie dans localStorage (solution simple qui fonctionne)
    const imagesByCategory: Record<string, GalleryImage[]> = {};
    newImages.forEach(img => {
      if (!imagesByCategory[img.category_id]) {
        imagesByCategory[img.category_id] = [];
      }
      imagesByCategory[img.category_id].push(img);
    });
    
    // Sauvegarder globalement
    localStorage.setItem('galerie_images', JSON.stringify(newImages));
    
    // Sauvegarder par catégorie (pour la page publique)
    Object.keys(imagesByCategory).forEach(catId => {
      localStorage.setItem(`galerie_images_${catId}`, JSON.stringify(imagesByCategory[catId]));
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug,
    };
    
    saveCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('Supprimer cette catégorie et toutes ses photos ?')) return;
    
    // Supprimer les images de la catégorie
    const remainingImages = images.filter(img => img.category_id !== id);
    saveImages(remainingImages);
    
    // Supprimer la catégorie de localStorage
    localStorage.removeItem(`galerie_images_${id}`);
    
    // Supprimer la catégorie
    saveCategories(categories.filter(c => c.id !== id));
    if (selectedCategory === id) setSelectedCategory(null);
  };

  const handleStartEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleSaveEditCategory = (id: string) => {
    if (!editingCategoryName.trim()) {
      setEditingCategoryId(null);
      return;
    }
    
    const updatedCategories = categories.map(cat => 
      cat.id === id 
        ? { ...cat, name: editingCategoryName.trim(), slug: editingCategoryName.trim().toLowerCase().replace(/\s+/g, '-') }
        : cat
    );
    
    saveCategories(updatedCategories);
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleAddImage = async (categoryId: string, file: File): Promise<void> => {
    try {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('⚠️ Image trop grande ! Veuillez sélectionner une image de moins de 10MB.');
        throw new Error('Fichier trop grand');
      }

      // Upload vers Supabase Storage (solution durable)
      const imageUrl = await uploadImageToSupabase(
        file,
        'galerie',
        `categories/${categoryId}`
      );

      const newImage: GalleryImage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category_id: categoryId,
        src: imageUrl, // URL Supabase ou base64 en fallback
        alt: file.name,
      };
      
      // Utiliser setImages avec callback pour éviter les conflits avec plusieurs uploads simultanés
      setImages((prevImages) => {
        const updatedImages = [...prevImages, newImage];
        saveImages(updatedImages);
        return updatedImages;
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      alert(`Erreur lors de l'upload de l'image: ${error.message || 'Erreur inconnue'}`);
      throw error;
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    
    const imageToDelete = images.find(img => img.id === id);
    if (!imageToDelete) return;
    
    // Si l'image est dans Supabase Storage (URL publique), la supprimer
    if (imageToDelete.src.startsWith('http') && imageToDelete.src.includes('supabase')) {
      try {
        await deleteImageFromSupabase(imageToDelete.src, 'galerie');
      } catch (error) {
        console.error('Erreur lors de la suppression de Supabase:', error);
        // Continuer quand même pour supprimer de localStorage
      }
    }
    
    // Supprimer de la liste
    saveImages(images.filter(img => img.id !== id));
  };

  const categoryImages = selectedCategory 
    ? images.filter(img => img.category_id === selectedCategory)
    : [];

  const handleSave = async () => {
    setLoading(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      console.log('[GalerieManager] Saving to Supabase...', {
        categories: categories.length,
        images: images.length
      });

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('galerie_content')
        .update({
          categories,
          images,
          updated_at: new Date().toISOString()
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      // Toujours sauvegarder en localStorage
      localStorage.setItem('galerie_categories', JSON.stringify(categories));
      localStorage.setItem('galerie_images', JSON.stringify(images));

      if (error) {
        console.error('[GalerieManager] Supabase error:', error);
        alert('⚠️ Sauvegarde locale uniquement. Erreur Supabase: ' + error.message);
      } else {
        console.log('[GalerieManager] ✅ Saved to Supabase');
        alert('✅ Galerie sauvegardée avec succès !');
      }
    } catch (error) {
      console.error('[GalerieManager] Error:', error);
      // Sauvegarder en localStorage comme fallback
      localStorage.setItem('galerie_categories', JSON.stringify(categories));
      localStorage.setItem('galerie_images', JSON.stringify(images));
      alert('⚠️ Sauvegarde locale uniquement. Erreur de connexion.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="text-3xl flex-shrink-0">🖼️</div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">Gestion de la galerie</h1>
                <p className="text-xs text-gray-500 mt-0.5">Créez des catégories et ajoutez des photos</p>
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

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">

      {/* Création de catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nom de la catégorie"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={selectedCategory === category.id ? 'ring-2 ring-[var(--gold)]' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                {editingCategoryId === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSaveEditCategory(category.id);
                        if (e.key === 'Escape') handleCancelEditCategory();
                      }}
                      className="flex-1 text-lg font-semibold"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveEditCategory(category.id)}
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEditCategory}
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle 
                      className="text-lg flex-1 cursor-pointer hover:text-[var(--gold)] transition-colors"
                      onClick={() => handleStartEditCategory(category)}
                      title="Cliquez pour modifier"
                    >
                      {category.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEditCategory(category)}
                        title="Modifier le nom"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {images.filter(img => img.category_id === category.id).length} photo(s)
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                {selectedCategory === category.id ? 'Masquer' : 'Voir photos'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Photos de la catégorie sélectionnée */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle>
              Photos - {categories.find(c => c.id === selectedCategory)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;
                  
                  // Vérifier le nombre d'images existantes dans la catégorie
                  const existingCount = images.filter(img => img.category_id === selectedCategory).length;
                  const MAX_IMAGES_PER_CATEGORY = 20;
                  
                  if (existingCount + files.length > MAX_IMAGES_PER_CATEGORY) {
                    const remaining = MAX_IMAGES_PER_CATEGORY - existingCount;
                    if (remaining <= 0) {
                      alert(`⚠️ Limite atteinte ! Maximum ${MAX_IMAGES_PER_CATEGORY} images par catégorie. Veuillez supprimer des images existantes.`);
                      e.target.value = '';
                      return;
                    }
                    alert(`⚠️ Vous pouvez ajouter maximum ${remaining} image(s) de plus. Seules les ${remaining} premières seront ajoutées.`);
                    files.splice(remaining);
                  }
                  
                  // Traiter tous les fichiers en séquence pour éviter le quota
                  let processed = 0;
                  const processNext = () => {
                    if (processed < files.length) {
                      handleAddImage(selectedCategory, files[processed]).finally(() => {
                        processed++;
                        // Petit délai entre chaque upload pour éviter le quota
                        setTimeout(processNext, 200);
                      });
                    }
                  };
                  processNext();
                  
                  // Réinitialiser l'input pour permettre de sélectionner les mêmes fichiers à nouveau
                  e.target.value = '';
                }}
                className="hidden"
                id="upload-images"
              />
              <label htmlFor="upload-images">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Ajouter plusieurs photos
                  </span>
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Maximum 20 images par catégorie (actuellement: {images.filter(img => img.category_id === selectedCategory).length}/20)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
