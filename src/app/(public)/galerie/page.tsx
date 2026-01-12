'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function GaleriePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [images, setImages] = useState<Array<{ id: string; src: string; alt: string; category_id: string }>>([]);

  useEffect(() => {
    const loadGalerie = async () => {
      // Fetch direct avec no-store pour éviter tout cache
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        const response = await fetch(
          `${supabaseUrl}/rest/v1/galerie_content?id=eq.00000000-0000-0000-0000-000000000001&select=categories,images`,
          {
            headers: {
              'apikey': supabaseKey!,
              'Authorization': `Bearer ${supabaseKey}`,
            },
            cache: 'no-store', // Force pas de cache
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data[0]) {
            const galerieData = data[0];
            console.log('[Galerie] Loaded from Supabase (no-cache):', {
              categories: galerieData.categories?.length || 0,
              images: galerieData.images?.length || 0
            });
            const cats = galerieData.categories || [];
            setCategories(cats);
            setImages(galerieData.images || []);
            if (cats.length > 0) {
              setActiveCategory(cats[0].id);
            }
            return;
          }
        }

        console.warn('[Galerie] Fetch error:', response.status);
      } catch (error) {
        console.error('[Galerie] Error loading from Supabase:', error);
      }

      // Fallback localStorage uniquement si Supabase échoue
      console.log('[Galerie] Using localStorage fallback');
      const savedCategories = localStorage.getItem('galerie_categories');
      const savedImages = localStorage.getItem('galerie_images');

      if (savedCategories) {
        const cats = JSON.parse(savedCategories);
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategory(cats[0].id);
        }
      }

      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    };

    loadGalerie();
  }, []);

  const allImages = images;
  const currentIndex = selectedImage ? allImages.findIndex(img => img.src === selectedImage) : -1;

  const nextImage = () => {
    if (currentIndex >= 0 && currentIndex < allImages.length - 1) {
      setSelectedImage(allImages[currentIndex + 1].src);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setSelectedImage(allImages[currentIndex - 1].src);
    }
  };

  const currentCategoryImages = activeCategory 
    ? images.filter(img => img.category_id === activeCategory)
    : [];

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 
            className="text-5xl md:text-6xl mb-4 text-foreground text-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Galerie Photos
          </h1>
          <p className="text-center text-muted-foreground mb-12" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Plongez dans l&apos;univers du Cabogata Beach Hotel 5★
          </p>

          {categories.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Aucune catégorie n&apos;a été créée.
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Créez des catégories dans l&apos;espace admin pour commencer.
              </p>
            </Card>
          ) : (
            <>
              {/* Filtres */}
              <div className="flex flex-wrap gap-2 justify-center mb-12">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Grid - 2-3 colonnes max, photos grandes */}
              {currentCategoryImages.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Aucune image dans cette catégorie.
                  </p>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Ajoutez des images depuis l&apos;espace admin.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCategoryImages.map((img) => (
                    <Card
                      key={img.id}
                      className="p-0 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
                      onClick={() => setSelectedImage(img.src)}
                    >
                      <div className="relative aspect-[4/3] min-h-[400px]">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt=""
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
              >
                ←
              </button>
            )}
            {currentIndex < allImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
              >
                →
              </button>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
