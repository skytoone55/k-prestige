'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from '@/lib/images';
import { MapPin, Star } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { usePageContent } from '@/lib/usePageContent';

export default function MarbellaPage() {
  const { data } = usePageContent('marbella');
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
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
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={main.image || placeholderImages.restaurantInterior}
                  alt="El Dorado Marbella - Intérieur"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

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

