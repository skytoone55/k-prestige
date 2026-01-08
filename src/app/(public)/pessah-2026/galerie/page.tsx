'use client';

import { useState, useEffect } from 'react';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category_id: string;
  uploaded_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function PessahGaleriePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const savedCategories = localStorage.getItem('galerie_categories');
    if (savedCategories) {
      const parsedCategories: Category[] = JSON.parse(savedCategories);
      setCategories(parsedCategories);
      if (parsedCategories.length > 0) {
        setActiveCategory(parsedCategories[0].id);
      }
    }

    const allImages: GalleryImage[] = [];
    if (savedCategories) {
      JSON.parse(savedCategories).forEach((cat: Category) => {
        const savedImages = localStorage.getItem(`galerie_images_${cat.id}`);
        if (savedImages) {
          allImages.push(...JSON.parse(savedImages));
        }
      });
    }
    setImages(allImages);
  }, []);

  const filteredImages = activeCategory
    ? images.filter(img => img.category_id === activeCategory)
    : images;

  const allImagesFlat = images;
  const currentIndex = selectedImage ? allImagesFlat.findIndex(img => img.src === selectedImage) : -1;

  const nextImage = () => {
    if (currentIndex >= 0 && currentIndex < allImagesFlat.length - 1) {
      setSelectedImage(allImagesFlat[currentIndex + 1].src);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setSelectedImage(allImagesFlat[currentIndex - 1].src);
    }
  };

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 
            className="text-5xl md:text-6xl mb-4 text-[var(--gold)] text-center"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
          >
            Galerie Photos
          </h1>
          <p className="text-center text-gray-600 mb-12" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Plongez dans l&apos;univers du Cabogata Beach Hotel 5★
          </p>

          {/* Filtres */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[var(--gold)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Grid - 2-3 colonnes max, photos grandes */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p style={{ fontFamily: 'var(--font-dm-sans)' }}>Aucune image dans cette catégorie.</p>
              <p className="text-sm mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Ajoutez des images via l&apos;espace d&apos;administration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((img, index) => (
                <Card
                  key={index}
                  className="p-0 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <div className="relative aspect-[4/3] min-h-[400px]">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
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
            <img
              src={selectedImage}
              alt=""
              className="max-w-full max-h-full object-contain"
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
            {currentIndex < allImagesFlat.length - 1 && (
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
              {currentIndex + 1} / {allImagesFlat.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

