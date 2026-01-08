import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  return (
    <>
      <PublicNavigation />
      <main className="pt-20">
        {/* 1. HERO SLIDER - Pessah 2026 */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hero/PANORAMIC.jpg"
              alt="Pessah 2026 - Cabogata Beach Hotel"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl mb-6 text-[var(--gold)] tracking-tight drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              PESSAH 2026
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Cabogata Beach Hotel 5★ - Almería, Espagne
            </p>

            <Link href="/pessah-2026/sejour">
              <Button className="btn-gold-primary text-lg px-8 py-4">
                Découvrir le séjour
              </Button>
            </Link>
          </div>
        </section>

        {/* 2. SECTION "NOS ACTIVITÉS" */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl mb-4 text-[var(--gold)]"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
              >
                Nos Univers
              </h2>
              <p 
                className="text-xl text-gray-600"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                Découvrez K Prestige
              </p>
            </div>

            {/* Grille 5 cards - 3+2 sur desktop, 1 colonne mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Card 1 - Pessah */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-64 mb-4">
                  <Image
                    src="/images/hero/PANORAMIC.jpg"
                    alt="Séjours Pessah"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 
                    className="text-2xl mb-3 text-[var(--gold)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    Séjours Pessah
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Vivez des fêtes inoubliables dans les plus beaux hôtels
                  </p>
                  <Link href="/pessah-2026/sejour">
                    <Button className="btn-gold-outline w-full">
                      Découvrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Card 2 - Marbella */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-64 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🍽️</div>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Photo à venir
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 
                    className="text-2xl mb-3 text-[var(--gold)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    El Dorado Marbella
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Restaurant casher & traiteur événementiel
                  </p>
                  <Link href="/marbella">
                    <Button className="btn-gold-outline w-full">
                      Découvrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Card 3 - Marrakech */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-64 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🎉</div>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Photo à venir
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 
                    className="text-2xl mb-3 text-[var(--gold)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    Traiteur Marrakech
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Traiteur casher pour vos événements au Maroc
                  </p>
                  <Link href="/marrakech">
                    <Button className="btn-gold-outline w-full">
                      Découvrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Card 4 - Hilloula */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-64 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🕯️</div>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Photo à venir
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 
                    className="text-2xl mb-3 text-[var(--gold)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    Hilloula
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Pèlerinages sur les tombes des Tsadikim
                  </p>
                  <Link href="/hilloula">
                    <Button className="btn-gold-outline w-full">
                      Découvrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Card 5 - Soucott */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-64 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🌿</div>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Photo à venir
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 
                    className="text-2xl mb-3 text-[var(--gold)] font-semibold"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    Arba Minim
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Loulav & Etrog de qualité pour Souccot
                  </p>
                  <Link href="/soucott">
                    <Button className="btn-gold-outline w-full">
                      Découvrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 3. SECTION RÉASSURANCE */}
        <section className="py-24 px-6 bg-[var(--cream)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl mb-12 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Pourquoi K Prestige ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl mb-4">✓</div>
                <p className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  10+ ans d&apos;expérience
                </p>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Une expertise reconnue dans l&apos;événementiel casher
                </p>
              </div>
              <div>
                <div className="text-5xl mb-4">✓</div>
                <p className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Kashrout irréprochable
                </p>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Supervision rabbinique de confiance
                </p>
              </div>
              <div>
                <div className="text-5xl mb-4">✓</div>
                <p className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Service personnalisé
                </p>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Un accompagnement sur mesure pour chaque projet
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
