'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { PessahDevisForm } from '@/components/public/PessahDevisForm';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { placeholderImages } from '@/lib/images';
import { ArrowRight } from 'lucide-react';
import { usePageContentWithLang } from '@/lib/usePageContent';
import { useTranslation, useLanguage } from '@/lib/LanguageContext';

export default function PessahSejourPage() {
  const { data, loading } = usePageContentWithLang('pessah-sejour');
  const { t } = useTranslation();
  const { dir } = useLanguage();

  // Données dynamiques avec fallback
  const hero = data?.hero || {
    subtitle: 'Séjour Premium',
    title: 'Le Séjour',
    description: 'Pessah 2026 • Cabogata Beach Hotel 5★',
    image: '/images/hero/PANORAMIC VIEW.jpg'
  };

  const dates = data?.dates || {
    principal: { title: 'Séjour Principal', dates: '31 Mars - 10 Avril 2026', duration: '10 nuits' },
    prolonge: { title: 'Weekend Prolongé', dates: '10 - 12 Avril 2026', duration: '+2 nuits (optionnel)' }
  };

  const supervision = data?.supervision || {
    title: 'Glatt Kasher Laméhadrine',
    rav: 'Rav Mordehai Cohen de Malaga',
    viandes: 'Viandes sous surveillance Rav Ephraïm Cremisi'
  };

  const allAnimations = data?.animations || [
    { image: placeholderImages.musicBand, name: 'Laurent Folies Musical Band', description: '@laurentfolies', instagram: 'https://www.instagram.com/laurentfolies' },
    { image: placeholderImages.dj, name: 'Yonni Chemla DJ Live', description: '@yonnichemla', instagram: 'https://www.instagram.com/yonnichemla' },
    { image: placeholderImages.singer, name: 'Avi Ohayon', description: 'Rabbin & Paytan', instagram: null },
    { image: placeholderImages.kidsAnimation, name: 'Gueoula Animation', description: 'Animation Enfants', instagram: 'https://www.instagram.com/gueoula_animation' },
  ];
  // Filtrer les éléments masqués
  const animations = allAnimations.filter((item: any) => !item.hidden);

  const allServices = data?.services || [
    { image: placeholderImages.beachAccess, title: 'Pied dans l\'eau', desc: 'Accès direct plage' },
    { image: placeholderImages.pool, title: '3 Piscines', desc: 'Dont une chauffée' },
    { image: placeholderImages.spa, title: 'SPA Luxueux', desc: 'Centre bien-être complet' },
    { image: placeholderImages.restaurant, title: 'Gastronomie', desc: 'Cuisine française et orientale' },
    { image: placeholderImages.kidsClub, title: 'Clubs Enfants', desc: 'Baby, Mini, Kids Club' },
    { image: placeholderImages.fitness, title: 'Sport & Fitness', desc: 'Salle équipée, coach' },
  ];
  // Filtrer les éléments masqués
  const services = allServices.filter((item: any) => !item.hidden);

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
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={hero.image || '/images/hero/PANORAMIC VIEW.jpg'}
              alt="Pessah 2026"
              fill
              className="object-cover scale-110 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/20 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6">
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button
                  onClick={() => document.getElementById('devis-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-gold-primary px-8 py-3 text-base whitespace-nowrap"
                >
                  {t('home.requestQuote')}
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Dates + Supervision - 3 colonnes */}
          <section className="mb-16">
            <SectionTitle title={t('pessah.datesDuSejour')} />
            <div className="grid md:grid-cols-3 gap-6">
              {/* Séjour Principal */}
              <ScrollReveal delay={0}>
                <motion.div whileHover={{ y: -4 }} className="h-full">
                  <Card className="border border-[var(--gold)]/30 hover:shadow-xl transition-all bg-white h-full">
                    <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {dates.principal?.title || 'Séjour Principal'}
                      </h3>
                      <p className="text-2xl font-semibold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {dates.principal?.dates || '31 Mars - 10 Avril 2026'}
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {dates.principal?.duration || '10 nuits'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>

              {/* Weekend Prolongé */}
              <ScrollReveal delay={0.1}>
                <motion.div whileHover={{ y: -4 }} className="h-full">
                  <Card className="border border-[var(--blue-mediterranean)]/30 hover:shadow-xl transition-all bg-white h-full">
                    <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--blue-mediterranean)]/10 flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h3 className="text-2xl mb-4 text-[var(--blue-mediterranean)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {dates.prolonge?.title || 'Weekend Prolongé'}
                      </h3>
                      <p className="text-2xl font-semibold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {dates.prolonge?.dates || '10 - 12 Avril 2026'}
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {dates.prolonge?.duration || '+2 nuits (optionnel)'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>

              {/* Supervision Religieuse */}
              <ScrollReveal delay={0.2}>
                <motion.div whileHover={{ y: -4 }} className="h-full">
                  <Card className="border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--gold-pale)]/10 to-white hover:shadow-xl transition-all h-full">
                    <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                        <span className="text-2xl">✡️</span>
                      </div>
                      <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {supervision.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {supervision.rav}
                      </p>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {supervision.viandes}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            </div>
          </section>

          {/* Animation */}
          <section className="mb-16">
            <SectionTitle title={t('pessah.animationNonStop')} />
            <div className="flex flex-wrap justify-center gap-6">
              {animations.map((anim: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <div className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] min-w-[250px] max-w-[300px]">
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={anim.image || placeholderImages.musicBand}
                          alt={anim.title || 'Animation'}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 bg-[var(--gold)]/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {t('pessah.premium')}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="w-12 h-[2px] bg-[var(--gold)] mb-4 transition-all duration-500 group-hover:w-20" />
                        <h3
                          className="text-xl font-cormorant font-semibold mb-2 group-hover:text-[var(--gold)] transition-colors"
                          style={{ fontFamily: 'var(--font-cormorant)' }}
                        >
                          {anim.title || anim.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {anim.desc || anim.description}
                        </p>
                        {anim.instagram && (
                          <a
                            href={anim.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[var(--gold)] text-sm font-medium group-hover:gap-2 transition-all"
                            style={{ fontFamily: 'var(--font-dm-sans)' }}
                          >
                            {t('pessah.voirInstagram')}
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                          </a>
                        )}
                      </CardContent>
                    </motion.div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <SectionTitle title={t('pessah.servicesInclus')} />
            <div className="flex flex-wrap justify-center gap-6">
              {services.map((service: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <div className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] min-w-[280px] max-w-[380px]">
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={service.image || placeholderImages.beachAccess}
                          alt={service.title || 'Service'}
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
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {service.desc}
                        </p>
                      </CardContent>
                    </motion.div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Formulaire Devis */}
          <section id="devis-form" className="mb-16 pt-4 scroll-mt-24">
            <SectionTitle title={t('pessah.demandeDevis')} subtitle={t('pessah.contactezNous')} />
            <ScrollReveal>
              <div className="max-w-xl mx-auto">
                <Card className="border border-[var(--gold)]/20 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <PessahDevisForm />
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </section>

          {/* Navigation */}
          <div className={`flex justify-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Link href="/pessah-2026/hotel">
              <Button className="btn-gold-outline">
                {t('pessah.decouvrirHotel')}
              </Button>
            </Link>
            <Link href="/pessah-2026/galerie">
              <Button className="btn-gold-outline">
                {t('pessah.voirGalerie')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
