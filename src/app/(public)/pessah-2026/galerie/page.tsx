'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { placeholderImages } from '@/lib/images';

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
  const [activeCategory, setActiveCategory] = useState<string>('Tout');
  
  // Images placeholder si galerie vide
  const placeholderGalleryImages = [
    { src: placeholderImages.hotelExterior, category: 'Hôtel', alt: 'Hôtel extérieur' },
    { src: placeholderImages.hotelPool, category: 'Piscines', alt: 'Piscine' },
    { src: placeholderImages.hotelRoom, category: 'Chambres', alt: 'Chambre' },
    { src: placeholderImages.hotelBeach, category: 'Plage', alt: 'Plage' },
    { src: placeholderImages.hotelRestaurant, category: 'Restaurant', alt: 'Restaurant' },
  ];

  useEffect(() => {
    const savedCategories = localStorage.getItem('galerie_categories');
    if (savedCategories) {
      const parsedCategories: Category[] = JSON.parse(savedCategories);
      setCategories(parsedCategories);
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
  
  const categoriesList = ['Tout', ...categories.map(c => c.name)];
  
  const displayImages = images.length > 0 
    ? (activeCategory === 'Tout' ? images : images.filter(img => {
        const cat = categories.find(c => c.id === img.category_id);
        return cat?.name === activeCategory;
      }))
    : placeholderGalleryImages;

  const allImagesFlat = images.length > 0 ? images : placeholderGalleryImages;
  const currentIndex = selectedImage ? allImagesFlat.findIndex((img: any) => (img.src || img) === selectedImage) : -1;

  const nextImage = () => {
    if (currentIndex >= 0 && currentIndex < allImagesFlat.length - 1) {
      const nextImg = allImagesFlat[currentIndex + 1];
      const imgSrc = typeof nextImg === 'string' ? nextImg : (nextImg as any).src || nextImg;
      setSelectedImage(imgSrc);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      const prevImg = allImagesFlat[currentIndex - 1];
      const imgSrc = typeof prevImg === 'string' ? prevImg : (prevImg as any).src || prevImg;
      setSelectedImage(imgSrc);
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

          {/* Filtres - Centrés */}
          <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b mb-8">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                {categoriesList.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-[var(--gold)] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid - Photos réduites (3-4 colonnes) */}
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {displayImages.map((img: any, i: number) => {
                const imgSrc = img.src || img;
                const imgAlt = img.alt || img.category || 'Image galerie';
                return (
                  <motion.div
                    key={imgSrc}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedImage(imgSrc)}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Voir
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-[80vw] h-[80vh]"
            >
              <Image
                src={selectedImage}
                alt=""
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
            
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-6 text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
            )}
            
            {currentIndex < allImagesFlat.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-6 text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            )}
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {currentIndex + 1} / {allImagesFlat.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

