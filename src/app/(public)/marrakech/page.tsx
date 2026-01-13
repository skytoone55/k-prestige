'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '@/lib/images';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { usePageContent } from '@/lib/usePageContent';

export default function MarrakechPage() {
  const { data, loading } = usePageContent('marrakech');

  // Données dynamiques avec fallback
  const hero = data?.hero || {
    subtitle: 'Service Traiteur',
    title: 'Marrakech',
    description: 'Traiteur casher pour vos événements au Maroc'
  };

  const main = data?.main || {
    title: 'Traiteur Événementiel',
    description: 'Service traiteur sur demande pour vos événements dans tout le Maroc. Disponible sur demande pour tous vos événements.',
    description2: 'Nous proposons une cuisine casher de qualité pour tous vos événements importants, partout au Maroc.'
  };

  const events = data?.events || [
    { image: placeholderImages.weddingMorocco, title: 'Mariages', desc: 'Organisation complète' },
    { image: placeholderImages.eventMorocco, title: 'Bar-mitzvahs', desc: 'Cérémonies et réceptions' },
    { image: placeholderImages.candles, title: 'Hilloula', desc: 'Pèlerinages et célébrations' },
    { image: placeholderImages.restaurantFood, title: 'Shabbat', desc: 'Repas de Shabbat' },
    { image: placeholderImages.eventMorocco, title: 'Réceptions', desc: 'Événements privés' },
    { image: placeholderImages.weddingMorocco, title: 'Anniversaires', desc: 'Célébrations familiales' },
    { image: placeholderImages.moroccanDecor, title: 'Événements corporatifs', desc: 'Séminaires et conférences' },
    { image: placeholderImages.eventMorocco, title: 'Autres', desc: 'Sur demande' },
  ];

  const cta = data?.cta || {
    title: 'Organisons votre événement ensemble',
    description: 'Contactez-nous pour discuter de votre projet et recevoir une proposition personnalisée'
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)]"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={placeholderImages.marrakechEvent}
              alt="Traiteur Marrakech"
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
                <p className="text-white/80 text-xl mt-4 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {hero.description}
                </p>
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
                <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {main.description}
                </p>
                <p className="text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {main.description2}
                </p>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={placeholderImages.weddingMorocco}
                  alt="Événement Marrakech"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Types d'événements */}
          <section className="mb-16">
            <SectionTitle title="Types d'Événements" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.05}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image || placeholderImages.eventMorocco}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    </div>
                    <CardContent className="p-6">
                      <div className="w-12 h-[2px] bg-[var(--gold)] mb-4 transition-all duration-500 group-hover:w-20" />
                      <h3
                        className="text-lg font-cormorant font-semibold mb-2 group-hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {event.desc}
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
                  Demander une proposition
                </Button>
              </Link>
              <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer">
                <Button className="btn-gold-outline">
                  WhatsApp
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
