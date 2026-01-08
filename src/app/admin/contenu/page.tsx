'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, X, Upload } from 'lucide-react';
// Utilisation de img standard pour compatibilité

// Configuration pour images Supabase
const supabaseImageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return src;
};

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  image_url: string | null;
  ordre: number;
}

// Liste des images disponibles dans public/images
const availableImages = [
  { path: '/images/piscines/POOLS & SEA.jpg', label: 'Piscines & Mer' },
  { path: '/images/piscines/POOL.jpg', label: 'Piscine' },
  { path: '/images/spa/SPA.jpg', label: 'SPA' },
  { path: '/images/restaurant/ORIGEN.jpg', label: 'Restaurant Origen' },
  { path: '/images/events/EVENTS.jpg', label: 'Événements' },
  { path: '/images/hotel/FAÇADE.jpg', label: 'Façade Hôtel' },
  { path: '/images/chambres/MEDITERRANEAN SUITE.jpg', label: 'Suite Méditerranée' },
  { path: '/images/chambres/ROOM SEA VIEW.jpg', label: 'Chambre Vue Mer' },
];

export default function ContenuPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImageFor, setSelectedImageFor] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      // Charger depuis localStorage ou utiliser les valeurs par défaut
      const saved = localStorage.getItem('contenu_features');
      if (saved) {
        setFeatures(JSON.parse(saved));
      } else {
        const defaultFeatures: Feature[] = [
          { id: '1', icon: '🏖️', title: 'Pied dans l\'eau', description: 'Accès direct plage', image_url: '/images/piscines/POOLS & SEA.jpg', ordre: 1 },
          { id: '2', icon: '🏊', title: '3 Piscines', description: 'Dont une chauffée', image_url: '/images/piscines/POOL.jpg', ordre: 2 },
          { id: '3', icon: '💆', title: 'SPA Luxueux', description: 'Centre bien-être, jacuzzi', image_url: '/images/spa/SPA.jpg', ordre: 3 },
          { id: '4', icon: '🍽️', title: 'Gastronomie', description: 'Cuisine française et orientale', image_url: '/images/restaurant/ORIGEN.jpg', ordre: 4 },
          { id: '5', icon: '✡️', title: 'Glatt Kasher', description: 'Supervision Rav Mordehai Cohen', image_url: null, ordre: 5 },
          { id: '6', icon: '👶', title: 'Clubs Enfants', description: 'Baby, Mini, Kids Club', image_url: null, ordre: 6 },
          { id: '7', icon: '🎵', title: 'Animation Live', description: 'Orchestre et DJ', image_url: '/images/events/EVENTS.jpg', ordre: 7 },
          { id: '8', icon: '💪', title: 'Sport & Fitness', description: 'Salle équipée, coach', image_url: null, ordre: 8 },
        ];
        setFeatures(defaultFeatures);
        localStorage.setItem('contenu_features', JSON.stringify(defaultFeatures));
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (feature: Feature) => {
    setSaving(true);
    try {
      const updated = features.map(f => f.id === feature.id ? feature : f);
      setFeatures(updated);
      localStorage.setItem('contenu_features', JSON.stringify(updated));
      alert('Contenu sauvegardé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, featureId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `contenu/accueil/${fileName}`;

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

      setFeatures(features.map(f => 
        f.id === featureId 
          ? { ...f, image_url: publicUrl }
          : f
      ));
      
      e.target.value = '';
      alert('Image uploadée avec succès !');
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

  const handleSelectImage = (imageUrl: string) => {
    if (selectedImageFor) {
      setFeatures(features.map(f => 
        f.id === selectedImageFor 
          ? { ...f, image_url: imageUrl }
          : f
      ));
      setSelectedImageFor(null);
    }
  };

  const handleRemoveImage = (featureId: string) => {
    setFeatures(features.map(f => 
      f.id === featureId 
        ? { ...f, image_url: null }
        : f
    ));
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
      <div>
        <h1 className="text-3xl font-bold">Contenu Accueil</h1>
        <p className="text-muted-foreground mt-1">
          Modifiez les textes et images des features de la page d&apos;accueil
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>Feature #{feature.ordre}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Icône"
                value={feature.icon}
                onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? { ...f, icon: e.target.value } : f))}
                placeholder="🏖️"
              />
              <Input
                label="Titre"
                value={feature.title}
                onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? { ...f, title: e.target.value } : f))}
              />
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">Description</label>
                <textarea
                  value={feature.description}
                  onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? { ...f, description: e.target.value } : f))}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              
              {/* Sélection d'image */}
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">Image</label>
                {feature.image_url ? (
                  <div className="space-y-2">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                      <img
                        src={feature.image_url}
                        alt={feature.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, feature.id)}
                          disabled={uploading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={uploading}
                          asChild
                        >
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Upload...' : 'Uploader'}
                          </span>
                        </Button>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImageFor(feature.id)}
                        className="flex-1"
                      >
                        Changer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage(feature.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, feature.id)}
                        disabled={uploading}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {}}
                        disabled={uploading}
                        className="w-full"
                        asChild
                      >
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Upload...' : 'Uploader'}
                        </span>
                      </Button>
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImageFor(feature.id)}
                      className="flex-1"
                    >
                      Sélectionner
                    </Button>
                  </div>
                )}
              </div>

              <Button onClick={() => handleSave(feature)} disabled={saving} className="w-full">
                <Save className="w-4 h-4" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal sélection image existante */}
      {selectedImageFor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sélectionner une image existante</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedImageFor(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableImages.map((img) => (
                  <button
                    key={img.path}
                    onClick={() => {
                      handleSelectImage(img.path);
                      setSelectedImageFor(null);
                    }}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={img.path}
                      alt={img.label}
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
