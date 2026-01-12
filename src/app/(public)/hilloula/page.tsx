'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '@/lib/images';
import { usePageContent } from '@/lib/usePageContent';

export default function HilloulaPage() {
  const { data, loading } = usePageContent('hilloula');

  // Données dynamiques avec fallback
  const hero = data?.hero || {
    subtitle: 'Pèlerinages Spirituels',
    title: 'Hilloula',
    description: 'Pèlerinages sur les tombes des Tsadikim',
    image: placeholderImages.candles,
  };

  const main = data?.main || {
    title: 'Voyages Organisés',
    description: 'K Prestige organise des voyages pour pèlerinages sur tombes de Tsadikim plusieurs fois par an, vers différentes destinations.',
    note: 'Les prix sont affichés pour chaque événement. Le contenu change fréquemment, consultez régulièrement les nouvelles dates.',
    image: placeholderImages.pilgrimage,
  };

  // Features peut être soit dans main.features (ancien format) soit en section séparée (nouveau format backoffice)
  const features = data?.features || main.features || [
    { text: 'Pension complète' },
    { text: 'Transferts organisés' },
    { text: 'Kashrout certifié' },
    { text: 'Programme complet' },
  ];

  // Gallery dynamique depuis le backoffice
  const gallery = data?.gallery || [
    { image: placeholderImages.candles, alt: 'Bougies' },
    { image: placeholderImages.synagogue, alt: 'Synagogue' },
    { image: placeholderImages.prayer, alt: 'Prière' },
    { image: placeholderImages.pilgrimage, alt: 'Pèlerinage' },
  ];

  const event = data?.event || {
    title: 'Prochain Événement',
    name: 'Hilloula Rabbi Itshak Abouhassira 2026',
    dates: '29 Janvier - 1er Février 2026',
    duration: '4 jours / 3 nuits',
    lieu: 'Hôtel Taddart 4★, Midelt, Maroc',
    price: '990€ / personne',
    kashrout: 'Glatt Kosher Beth Yossef',
    inclus: 'Pension complète, transferts (vols exclus)',
    link: '/hilloula/rabbi-itshak-abouhassira-2026',
    button_text: 'Voir le programme complet',
  };

  const cta = data?.cta || {
    title: 'Intéressé par un pèlerinage ?',
    description: 'Contactez-nous pour plus d\'informations sur les prochains événements',
    button1_text: 'Nous contacter',
    button2_text: 'WhatsApp',
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
              src={hero.image || placeholderImages.candles}
              alt="Hilloula - Pèlerinage"
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
                <ul className="space-y-3 text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {(features || []).map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-[var(--gold)] text-xl">✓</span>
                      <span>{typeof feature === 'string' ? feature : feature.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <strong>Note :</strong> {main.note}
                </p>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={main.image || placeholderImages.pilgrimage}
                  alt="Pèlerinage Hilloula"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Exemple événement */}
          <section className="mb-16">
            <Card className="border-2 border-[var(--gold)]/30 bg-gradient-to-br from-[var(--gold-pale)]/20 to-transparent">
              <CardContent className="p-8">
                <h2
                  className="text-3xl md:text-4xl mb-6 text-center text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  {event.title}
                </h2>
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h3
                      className="text-2xl mb-4 text-gray-800"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {event.name}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Dates</p>
                        <p className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {event.dates}
                        </p>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>{event.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Lieu</p>
                        <p className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {event.lieu}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Prix</p>
                        <p className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                          {event.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Kashrout</p>
                        <p className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {event.kashrout}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        <strong>Inclus :</strong> {event.inclus}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href={event.link || '/hilloula/rabbi-itshak-abouhassira-2026'}>
                      <Button className="btn-gold-primary">
                        {event.button_text}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bande d'images décoratives */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(gallery || []).map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative h-48 md:h-64 rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={item.image || placeholderImages.candles}
                    alt={item.alt || `Hilloula ${idx + 1}`}
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

