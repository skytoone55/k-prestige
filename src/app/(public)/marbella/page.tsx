'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from '@/lib/images';
import { MapPin, Star, X, ZoomIn, Plus, Minus, RotateCcw } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { usePageContent } from '@/lib/usePageContent';

export default function MarbellaPage() {
  const { data } = usePageContent('marbella');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fonctions de zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const hero = data?.hero || {
    subtitle: 'Restaurant Casher',
    title: 'El Dorado',
    location: 'Marbella, Espagne',
    image: placeholderImages.restaurantExterior,
  };
  const main = data?.main || {
    title: 'Restaurant Casher Permanent',
    description: 'El Dorado est un restaurant casher permanent situé à Marbella, ouvert toute l\'année.\nCuisine viande, hamburgers, salades, grillades et tajines.',
    couverts: '70 couverts',
    address: 'Calle del pintor Jose Caballero 32D, 29870 Marbella, Espagne',
    phone: '06 99 95 19 63',
    image: placeholderImages.restaurantInterior,
  };
  const services = data?.services || [
    { title: 'Restaurant', desc: 'Réservations de tables pour déjeuner et dîner', image: placeholderImages.restaurantFood },
    { title: 'Traiteur Événementiel', desc: 'Mariages, Bar-mitzvahs, Shabbat, Hilloula, Réceptions', image: placeholderImages.eventMorocco },
    { title: 'Privatisation', desc: 'Privatisation complète du restaurant pour vos événements', image: placeholderImages.restaurantInterior },
  ];
  const cta = data?.cta || {
    title: 'Intéressé par nos services ?',
    description: 'Contactez-nous pour une réservation ou un devis personnalisé',
    button1_text: 'Nous contacter',
    button2_text: 'WhatsApp',
  };

  // Features dynamiques depuis le backoffice
  const features = data?.features || [
    { text: 'Glatt Kosher Laméhadrine' },
    { text: '70 couverts' },
    { text: 'Proximité Beth Habad de Marbella' },
    { text: 'Réservations tables' },
  ];
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={hero.image || placeholderImages.restaurantExterior}
              alt="El Dorado Marbella"
              fill
              className="object-cover scale-110 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/20 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {hero.subtitle}
                </span>
                <h1 
                  className="text-6xl md:text-7xl font-cormorant text-white mt-4 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  {hero.title}
                </h1>
                <p className="text-white/80 text-xl mt-4 max-w-xl mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {hero.location}
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-white/60" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <MapPin className="w-4 h-4" />
                    {main.couverts}
                  </span>
                  <span className="flex items-center gap-2 text-white/60" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <Star className="w-4 h-4 text-[var(--gold)]" />
                    Glatt Kosher
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Présentation */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 
                  className="text-4xl md:text-5xl mb-6 text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  {main.title}
                </h2>
                <p className="text-lg text-gray-700 mb-6 whitespace-pre-line" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {main.description}
                </p>
                <ul className="space-y-3 text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {(features || []).map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-[var(--gold)] text-xl">✓</span>
                      <span>{typeof feature === 'string' ? feature : feature.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[var(--gold-pale)] p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <strong>Adresse :</strong> {main.address}
                  </p>
                  {main.phone && (
                    <p className="text-sm text-gray-700 mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      <strong>Téléphone :</strong> <a href={`tel:${main.phone.replace(/\s/g, '')}`} className="text-[var(--gold)] hover:underline">{main.phone}</a>
                    </p>
                  )}
                </div>
              </div>
              <div
                className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={main.image || placeholderImages.restaurantInterior}
                  alt="El Dorado Marbella - Menu"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-4">
                    <ZoomIn className="w-8 h-8 text-[var(--gold)]" />
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute bottom-4 right-4 bg-[var(--gold)]/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                  Cliquez pour agrandir
                </div>
              </div>
            </div>
          </section>

          {/* Lightbox avec Zoom */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                onClick={closeLightbox}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Bouton fermer */}
                <button
                  className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                  onClick={closeLightbox}
                >
                  <X className="w-8 h-8 text-white" />
                </button>

                {/* Contrôles de zoom */}
                <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
                  <button
                    className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    title="Zoomer (+)"
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </button>
                  <button
                    className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    title="Dézoomer (-)"
                  >
                    <Minus className="w-6 h-6 text-white" />
                  </button>
                  <button
                    className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                    title="Réinitialiser"
                  >
                    <RotateCcw className="w-6 h-6 text-white" />
                  </button>
                  {/* Indicateur de zoom */}
                  <div className="bg-white/10 rounded-full px-3 py-2 text-white text-sm text-center">
                    {Math.round(zoomLevel * 100)}%
                  </div>
                </div>

                {/* Image avec zoom */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="relative w-full h-full max-w-6xl max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  onWheel={handleWheel}
                >
                  <div
                    className={`relative w-full h-full ${zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
                    onMouseDown={handleMouseDown}
                    style={{
                      transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    }}
                  >
                    <Image
                      src={main.image || placeholderImages.restaurantInterior}
                      alt="Menu El Dorado Marbella"
                      fill
                      className="object-contain select-none"
                      sizes="100vw"
                      priority
                      draggable={false}
                    />
                  </div>
                </motion.div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-white/60 text-sm mb-1">
                    Utilisez les boutons ou la molette pour zoomer
                  </p>
                  <p className="text-white/40 text-xs">
                    {zoomLevel > 1 ? 'Cliquez et glissez pour déplacer l\'image' : 'Cliquez n\'importe où pour fermer'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Services */}
          <section className="mb-16">
            <SectionTitle title="Nos Services" />
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image avec overlay au hover */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={service.image || placeholderImages.restaurantFood}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    </div>
                    
                    {/* Contenu */}
                    <CardContent className="p-6">
                      <div className="w-12 h-[2px] bg-[var(--gold)] mb-4 transition-all duration-500 group-hover:w-20" />
                      <h3 
                        className="text-xl font-cormorant font-semibold mb-3 group-hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {service.desc || service.description}
                      </p>
                    </CardContent>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-16 bg-gradient-to-br from-[var(--gold-pale)]/30 to-transparent rounded-lg">
            <h2 
              className="text-3xl md:text-4xl mb-6 text-gray-800"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="btn-gold-primary">
                  {cta.button1_text}
                </Button>
              </Link>
              <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer">
                <Button className="btn-gold-outline">
                  {cta.button2_text}
                </Button>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

