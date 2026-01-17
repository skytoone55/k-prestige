'use client';

import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation, useLanguage } from '@/lib/LanguageContext';

// Exemple de données - À remplacer par Supabase plus tard
const events: Record<string, any> = {
  'rabbi-itshak-abouhassira-2026': {
    title: 'Hilloula Rabbi Itshak Abouhassira 2026',
    rabbi: 'Rabbi Itshak Abouhassira',
    location: 'Midelt, Maroc',
    hotel: 'Hôtel Taddart 4★',
    startDate: '29 Janvier 2026',
    endDate: '1er Février 2026',
    duration: '4 jours / 3 nuits',
    price: 990,
    kashrut: 'Glatt Kosher Beth Yossef',
    included: 'Pension complète, transferts (vols exclus)',
    program: [
      {
        day: 'Jour 1',
        events: [
          'Départ Fès',
          'Erfoud',
          'Buffet',
          'Minha/Arvit',
          'Dîner musique',
        ],
      },
      {
        day: 'Jour 2',
        events: [
          'Shaharit',
          'Pèlerinage Risani (tombes Tsadikim)',
          'Kabbalat Shabbat',
          'Seoudat Shabbat',
        ],
      },
      {
        day: 'Jour 3',
        events: [
          'Shabbat complet',
          'Départ 20h vers Tsadik',
          'Arrivée Toulal 22h',
          'Aéroport 2h',
        ],
      },
    ],
  },
};

export default function HilloulaEventPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const event = events[slug];

  if (!event) {
    return (
      <>
        <PublicNavigation />
        <main className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <p className="text-gray-600">Page non trouvée</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20" dir={dir}>
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🕯️</div>
              <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {t('hilloulaDetail.photoAVenir')}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center text-white">
            <h1
              className="text-4xl md:text-6xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              {event.title}
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {event.location}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Informations principales */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {t('hilloula.dates')}
                  </h3>
                  <p className="text-2xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {event.startDate} - {event.endDate}
                  </p>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {event.duration}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {t('hilloula.prix')}
                  </h3>
                  <p className="text-3xl font-bold mb-2 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {event.price}€ {t('hilloulaDetail.perPersonne')}
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {event.included}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {t('hilloulaDetail.hotel')}
                  </h3>
                  <p className="text-lg text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {event.hotel}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {t('hilloula.kashrout')}
                  </h3>
                  <p className="text-lg text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {event.kashrut}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Programme */}
          <section className="mb-16">
            <h2
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              {t('hilloulaDetail.programme')}
            </h2>
            <div className="space-y-6">
              {event.program.map((day: any, idx: number) => (
                <Card key={idx} className="border-2 border-[var(--gold)]/30">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {day.day}
                    </h3>
                    <ul className="space-y-2">
                      {day.events.map((eventItem: string, eventIdx: number) => (
                        <li key={eventIdx} className="flex items-center gap-3 text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          <span className="text-[var(--gold)] text-xl">✓</span>
                          <span>{eventItem}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-16 bg-gradient-to-br from-[var(--gold-pale)]/30 to-transparent rounded-lg">
            <h2
              className="text-3xl md:text-4xl mb-6 text-gray-800"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {t('hilloulaDetail.interessePelerinage')}
            </h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('hilloulaDetail.contactezPourInscrire')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="btn-gold-primary">
                  {t('common.contactUs')}
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
