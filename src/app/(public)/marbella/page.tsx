import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function MarbellaPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🍽️</div>
              <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Photo à venir
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center text-white">
            <h1 
              className="text-5xl md:text-7xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              El Dorado
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Restaurant Casher • Marbella, Espagne
            </p>
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
                  Restaurant Casher Permanent
                </h2>
                <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  El Dorado est un restaurant casher permanent situé à Marbella, ouvert toute l&apos;année.
                  Cuisine viande, hamburgers, salades, grillades et tajines.
                </p>
                <ul className="space-y-3 text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Glatt Kosher Laméhadrine</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>70 couverts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Proximité Beth Habad de Marbella</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Réservations tables</span>
                  </li>
                </ul>
                <div className="bg-[var(--gold-pale)] p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <strong>Adresse :</strong> Calle del pintor Jose Caballero 32D, 29870 Marbella, Espagne
                  </p>
                  <p className="text-sm text-gray-700 mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <strong>Téléphone :</strong> <a href="tel:+33699951963" className="text-[var(--gold)] hover:underline">06 99 95 19 63</a>
                  </p>
                </div>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🍽️</div>
                    <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Photo restaurant à venir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Nos Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="text-5xl mb-4">🍴</div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Restaurant
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Réservations de tables pour déjeuner et dîner
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Traiteur Événementiel
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Mariages, Bar-mitzvahs, Shabbat, Hilloula, Réceptions
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Privatisation
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Privatisation complète du restaurant pour vos événements
                </p>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-16 bg-gradient-to-br from-[var(--gold-pale)]/30 to-transparent rounded-lg">
            <h2 
              className="text-3xl md:text-4xl mb-6 text-gray-800"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Intéressé par nos services ?
            </h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Contactez-nous pour une réservation ou un devis personnalisé
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="btn-gold-primary">
                  Nous contacter
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

