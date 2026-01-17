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
import { usePageContentWithLang } from '@/lib/usePageContent';
import { useTranslation, useLanguage } from '@/lib/LanguageContext';

export default function SoucottPage() {
  const { data, loading } = usePageContentWithLang('souccot');
  const { t } = useTranslation();
  const { dir } = useLanguage();

  // Données dynamiques avec fallback
  const hero = data?.hero || {
    subtitle: 'E-commerce',
    title: 'Souccot',
    description: 'Kits Arba Minim (4 espèces) de qualité',
    image: placeholderImages.loulav,
  };

  const main = data?.main || {
    title: 'Les 4 Espèces',
    description: 'Vente en ligne de kits Arba Minim pour la fête de Souccot. Période : Avant Souccot (septembre-octobre)',
  };

  const allEspeces = data?.especes || [
    { image: placeholderImages.palm, name: 'Loulav', desc: 'Branche de palmier' },
    { image: placeholderImages.nature, name: 'Etrog', desc: 'Cédrat' },
    { image: placeholderImages.plants, name: 'Hadassim', desc: '3 branches de myrte' },
    { image: placeholderImages.loulav, name: 'Aravot', desc: '2 branches de saule' },
  ];
  // Filtrer les éléments masqués
  const especes = allEspeces.filter((item: any) => !item.hidden);

  const allKits = data?.kits || [
    { level: 'א', name: 'Standard / Kosher', nameHe: 'א', description: 'Valide halakhiquement', price: '~50€', available: true },
    { level: 'אא', name: 'Méhoudar', nameHe: 'אא', description: 'Qualité améliorée', price: '~70-80€', available: true },
    { level: 'ב', name: 'Méhoudar min haméhoudar', nameHe: 'ב', description: 'Très haute qualité', price: '~100-120€', available: true },
    { level: 'ג', name: 'Premium / Luxe', nameHe: 'ג', description: 'Qualité exceptionnelle', price: '150€+', available: true },
  ];
  // Filtrer les éléments masqués
  const kits = allKits.filter((item: any) => !item.hidden);

  const livraison = data?.livraison || {
    title: 'Livraison',
    description: 'Livraison en France principalement. Architecture prête pour expansion vers Israël.',
    note: 'Frais de livraison conditionnels selon la quantité et la période.',
  };

  const cta = data?.cta || {
    title: 'Prêt à commander votre kit ?',
    description: 'Sélectionnez votre niveau de qualité et passez commande',
    note: 'Le système e-commerce complet sera disponible prochainement. En attendant, contactez-nous directement.',
    button1_text: 'Nous contacter',
    button2_text: 'Commander par WhatsApp',
  };

  // Gallery dynamique depuis le backoffice
  const allGallery = data?.gallery || [
    { image: placeholderImages.loulav, alt: 'Loulav' },
    { image: placeholderImages.palm, alt: 'Palmier' },
    { image: placeholderImages.nature, alt: 'Nature' },
    { image: placeholderImages.plants, alt: 'Plantes' },
  ];
  // Filtrer les éléments masqués
  const gallery = allGallery.filter((item: any) => !item.hidden);

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
              src={hero.image || placeholderImages.loulav}
              alt="Arba Minim - Souccot"
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
            <div className="max-w-4xl mx-auto text-center">
              <h2
                className="text-4xl md:text-5xl mb-6 text-[var(--gold)]"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
              >
                {main.title}
              </h2>
              <p className="text-lg text-gray-700 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {main.description}
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {especes.map((espece: any, idx: number) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <div className="flex-1 min-w-[200px] max-w-[290px]">
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                      >
                        {/* Image avec overlay au hover */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={espece.image}
                            alt={espece.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        </div>

                        {/* Contenu */}
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-[2px] bg-[var(--gold)] mb-3 mx-auto transition-all duration-500 group-hover:w-20" />
                          <h3
                            className="font-semibold text-[var(--gold)] mb-1 group-hover:text-[var(--gold-shine)] transition-colors"
                            style={{ fontFamily: 'var(--font-cormorant)' }}
                          >
                            {espece.name}
                          </h3>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {espece.desc}
                          </p>
                        </CardContent>
                      </motion.div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Catalogue */}
          <section className="mb-16">
            <h2
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              {t('souccot.niveauxQualite')}
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {kits.map((kit: any, idx: number) => (
                <div key={idx} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] min-w-[220px] max-w-[280px]">
                  <Card className="p-6 text-center hover:shadow-xl transition-shadow border-2 border-[var(--gold)]/20 h-full">
                    <div className="text-5xl mb-4 font-bold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {kit.nameHe}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {kit.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {kit.description}
                    </p>
                    <div className="text-2xl font-bold text-[var(--gold)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {kit.price}
                    </div>
                    <Button
                      className="btn-gold-primary w-full"
                      disabled={!kit.available}
                    >
                      {kit.available ? t('souccot.ajouterPanier') : t('souccot.bientotDisponible')}
                    </Button>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          {/* Info Livraison */}
          <section className="mb-16">
            <Card className="bg-gradient-to-br from-[var(--gold-pale)]/20 to-transparent border-2 border-[var(--gold)]/30">
              <CardContent className="p-8">
                <h2
                  className="text-3xl mb-6 text-center text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  {livraison.title}
                </h2>
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {livraison.description}
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {livraison.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Galerie photos */}
          <section className="mb-16">
            <div className="flex flex-wrap justify-center gap-4">
              {(gallery || []).map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] min-w-[150px] max-w-[280px] relative h-48 md:h-64 rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={item.image || placeholderImages.loulav}
                    alt={item.alt || `Souccot ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
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
            <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <strong>{t('hilloula.note')} :</strong> {cta.note}
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

