'use client';

import Image from 'next/image';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { PessahDevisForm } from '@/components/public/PessahDevisForm';
import { useTranslation, useLanguage } from '@/lib/LanguageContext';

export default function Pessah2026Page() {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <Image
            src="/images/hero/PANORAMIC VIEW.jpg"
            alt="Pessah 2026"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center text-white">
            <h1
              className="text-6xl md:text-8xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              {t('pessah.pessah2026')}
            </h1>
            <p className="text-xl md:text-2xl mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('pessah.hotelLocation')}
            </p>
            <p className="text-lg text-[var(--gold)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {t('pessah.dateRange')}
            </p>
            <button
              onClick={() => document.getElementById('devis-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold-primary px-8 py-3 text-base"
            >
              {t('pessah.demanderDevis')}
            </button>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Hôtel */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <h2
                  className="text-4xl md:text-5xl mb-4 text-foreground"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {t('hotel.cabogataTitle')}
                </h2>
                <p className="text-lg text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {t('pessah.hotelDescription')}
                </p>
                <ul className="space-y-2 text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li>✓ {t('pessah.nombreChambres')}</li>
                  <li>✓ {t('pessah.piedDansLeau')}</li>
                  <li>✓ {t('pessah.piscines')}</li>
                  <li>✓ {t('pessah.spaComplet')}</li>
                  <li>✓ {t('pessah.accesDirectPlage')}</li>
                </ul>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/hotel/FAÇADE.jpg"
                  alt={t('hotel.lHotel')}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Bandeau photo */}
          <div className="relative h-[50vh] mb-16 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/piscines/POOLS & SEA.jpg"
              alt={t('hotel.piscines')}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {t('pessah.piscines')}
              </p>
            </div>
          </div>

          {/* Dates */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {t('pessah.sejourPrincipal')}
                  </h3>
                  <p className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {t('pessah.dateRange')}
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {t('pessah.dixNuits')}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[var(--blue-mediterranean)]/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl mb-4 text-[var(--blue-mediterranean)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {t('pessah.weekendProlonge')}
                  </h3>
                  <p className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {t('pessah.dateRangeProlonge')}
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {t('pessah.plusDeuxNuits')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Bandeau photo */}
          <div className="relative h-[50vh] mb-16 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/chambres/MEDITERRANEAN SUITE.jpg"
              alt={t('pessah.nosChambres')}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {t('pessah.nosChambres')}
              </p>
            </div>
          </div>

          {/* Supervision Religieuse */}
          <section className="mb-16">
            <Card className="border-2 border-[var(--gold)]/30 bg-gradient-to-br from-[var(--gold-pale)]/20 to-transparent">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-6">✡️</div>
                <h2
                  className="text-3xl md:text-4xl mb-4 text-gray-800"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {t('pessah.glattKasher')}
                </h2>
                <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {t('pessah.sousLaSurveillance')}
                </p>
                <p className="text-xl font-semibold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  {t('pessah.ravMordehaiCohen')}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Bandeau photo */}
          <div className="relative h-[50vh] mb-16 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/restaurant/ORIGEN.jpg"
              alt={t('hotel.restaurant')}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {t('pessah.gastronomie')}
              </p>
            </div>
          </div>

          {/* Animation */}
          <section className="mb-16">
            <Card className="border-2 border-[var(--gold)]/30 bg-gradient-to-br from-[var(--dark-bg)] to-[var(--dark-surface)]">
              <CardContent className="p-8">
                <h2
                  className="text-3xl md:text-4xl mb-8 text-[var(--gold)] text-center"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {t('pessah.animationNonStop')}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--gold-pale)]/20 to-[var(--blue-mediterranean)]/20 flex items-center justify-center border-2 border-dashed border-[var(--gold)]/40">
                      <div className="text-6xl opacity-50">🎵</div>
                    </div>
                    <h3 className="text-xl mb-2 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      Laurent Folies Musical Band
                    </h3>
                    <p className="text-white/80" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      @laurentfolies
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--gold-pale)]/20 to-[var(--blue-mediterranean)]/20 flex items-center justify-center border-2 border-dashed border-[var(--gold)]/40">
                      <div className="text-6xl opacity-50">🎧</div>
                    </div>
                    <h3 className="text-xl mb-2 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      Yonni Chemla DJ Live
                    </h3>
                    <p className="text-white/80" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      @yonnichemla
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--gold-pale)]/20 to-[var(--blue-mediterranean)]/20 flex items-center justify-center border-2 border-dashed border-[var(--gold)]/40">
                      <div className="text-6xl opacity-50">🎤</div>
                    </div>
                    <h3 className="text-xl mb-2 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      Avi Ohayon
                    </h3>
                    <p className="text-white/80" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {t('pessah.rabbinPaytan')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bandeau photo SPA */}
          <div className="relative h-[50vh] mb-16 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/spa/SPA.jpg"
              alt={t('hotel.spa')}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {t('pessah.spaBienEtre')}
              </p>
            </div>
          </div>

          {/* Formulaire de devis */}
          <section id="devis-form" className="py-10 px-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#0077B6]/10 rounded-lg">
            <div className="max-w-xl mx-auto">
              <h2
                className="text-2xl md:text-3xl mb-6 text-center text-foreground"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {t('pessah.pretAVivre')}
              </h2>
              <PessahDevisForm />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
