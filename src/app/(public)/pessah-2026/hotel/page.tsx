'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { placeholderImages } from '@/lib/images';
import { usePageContentWithLang } from '@/lib/usePageContent';
import { useTranslation, useLanguage } from '@/lib/LanguageContext';
import { PessahDevisForm } from '@/components/public/PessahDevisForm';

export default function PessahHotelPage() {
  const { data, loading } = usePageContentWithLang('pessah-hotel');
  const { t } = useTranslation();
  const { dir } = useLanguage();

  // Données dynamiques avec fallback
  const hero = data?.hero || {
    subtitle: t('hotel.hotel5Etoiles'),
    title: t('hotel.lHotel'),
    description: t('hotel.cabogataLocation'),
    image: '/images/hotel/FAÇADE.jpg'
  };

  const hotel = data?.hotel || {
    subtitle: t('hotel.notreEcrinDeLuxe'),
    title: t('hotel.cabogataTitle'),
    description: t('pessah.hotelDescription'),
    location: t('hotel.locationAlmeria'),
    image: '/images/hotel/FAÇADE.jpg'
  };

  const allChambres = data?.chambres || [
    { code: 'S', nom: 'Superior', nombre: 98, surface: '27m²', vue: 'Jardins/Montagnes' },
    { code: 'P', nom: 'Premium Vue Mer', nombre: 79, surface: '27m²', vue: 'Mer' },
    { code: 'EC', nom: 'Exclusive Communicantes', nombre: 28, surface: '35m²', vue: 'Montagnes', special: 'Communicante' },
    { code: 'ACC', nom: 'Exclusive Adaptées', nombre: 10, surface: '35m²', vue: 'RDC', special: 'PMR' },
    { code: 'ECV', nom: 'Exclusive Comm. Vue Mer', nombre: 8, surface: '35m²', vue: 'Mer', special: 'Communicante' },
    { code: 'EVM', nom: 'Exclusive Vue Mer', nombre: 4, surface: '35m²', vue: 'Mer' },
    { code: 'SSU', nom: 'Junior Suite Comm.', nombre: 10, surface: '70-80m²', vue: 'Variable', special: 'Suite, Communicante' },
    { code: 'TSU', nom: 'Terrace Suite', nombre: 7, surface: '43-70m²', vue: 'Mer', special: 'Suite, Terrasse' },
    { code: 'MED', nom: 'Mediterranean Suite', nombre: 13, surface: '66-84m²', vue: 'Mer', special: 'Suite Premium' },
  ];
  // Filtrer les éléments masqués
  const chambres = allChambres.filter((item: any) => !item.hidden);

  const allServices = data?.services || [
    { image: placeholderImages.beachAccess, title: t('pessah.piedDansLeau'), desc: t('pessah.accesDirectPlage') },
    { image: placeholderImages.pool, title: t('pessah.piscines'), desc: '' },
    { image: placeholderImages.spa, title: t('pessah.spaComplet'), desc: '' },
    { image: placeholderImages.restaurant, title: t('pessah.gastronomie'), desc: '' },
    { image: placeholderImages.fitness, title: 'Sport & Fitness', desc: '' },
    { image: placeholderImages.kidsClub, title: t('pessah.animationEnfants'), desc: '' },
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
              src={hero.image || '/images/hotel/FAÇADE.jpg'}
              alt={t('hotel.cabogataTitle')}
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
                  {hero.subtitle || t('hotel.hotel5Etoiles')}
                </span>
                <h1
                  className="text-6xl md:text-7xl font-cormorant text-white mt-4 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  {hero.title || t('hotel.lHotel')}
                </h1>
                <p className="text-white/80 text-xl mt-4 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {hero.description || t('hotel.cabogataLocation')}
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button
                  onClick={() => document.getElementById('devis-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-gold-primary px-8 py-3 text-base whitespace-nowrap"
                >
                  {t('pessah.demanderDevis')}
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Présentation */}
          <section className="mb-16">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <SectionTitle subtitle={hotel.subtitle || t('hotel.notreEcrinDeLuxe')} title={hotel.title || t('hotel.cabogataTitle')} centered={false} />
                  <p className="text-lg text-gray-700 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {hotel.description || t('pessah.hotelDescription')}
                  </p>
                  <div className="bg-[var(--gold-pale)] p-4 rounded-lg mb-8">
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      <strong>{t('hotel.lieu')} :</strong> {hotel.location || t('hotel.locationAlmeria')}
                    </p>
                  </div>
                </div>
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={hotel.image || '/images/hotel/FAÇADE.jpg'}
                    alt={t('hotel.cabogataTitle')}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Types de chambres */}
          <section className="mb-16">
            <SectionTitle title={t('hotel.typesChambres')} />
            <p className="text-center text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('hotel.chambresReparties')}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chambres.map((chambre: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.05}>
                  <Card className="p-6 hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[var(--gold)] mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {chambre.nom}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <p><strong>{t('hotel.surface')} :</strong> {chambre.surface}</p>
                    <p><strong>{t('hotel.vue')} :</strong> {chambre.vue}</p>
                    {chambre.special && (
                      <p className="text-[var(--gold)] font-semibold">
                        {chambre.special}
                      </p>
                    )}
                  </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <SectionTitle title={t('hotel.servicesEquipements')} />
            <div className="flex flex-wrap justify-center gap-6">
              {services.map((service: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <div className="w-[calc(33.333%-1rem)] min-w-[300px] max-w-[380px]">
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={service.image || placeholderImages.beachAccess}
                          alt={service.title}
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
            <Link href="/pessah-2026/sejour">
              <Button className="btn-gold-outline">
                {t('hotel.voirSejour')}
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
