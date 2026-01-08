import Image from 'next/image';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Pessah2026Page() {
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
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white">
            <h1 
              className="text-6xl md:text-8xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              PESSAH 2026
            </h1>
            <p className="text-xl md:text-2xl mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Cabogata Beach Hotel 5★ • Espagne
            </p>
            <p className="text-lg text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              31 Mars - 10 Avril 2026
            </p>
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
                  Cabogata Beach Hotel 5★
                </h2>
                <p className="text-lg text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026
                </p>
                <ul className="space-y-2 text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li>✓ 257 chambres de standing</li>
                  <li>✓ Pied dans l&apos;eau</li>
                  <li>✓ 3 piscines dont 1 chauffée</li>
                  <li>✓ SPA complet</li>
                  <li>✓ Accès direct plage</li>
                </ul>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/hotel/FAÇADE.jpg"
                  alt="Hôtel"
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
              alt="Piscines"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                3 Piscines dont 1 chauffée
              </p>
            </div>
          </div>

          {/* Dates */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Séjour Principal
                  </h3>
                  <p className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    31 Mars - 10 Avril 2026
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    10 nuits
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[var(--blue-mediterranean)]/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl mb-4 text-[var(--blue-mediterranean)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Weekend Prolongé
                  </h3>
                  <p className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    10 - 12 Avril 2026
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    +2 nuits (optionnel)
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Bandeau photo */}
          <div className="relative h-[50vh] mb-16 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/chambres/MEDITERRANEAN SUITE.jpg"
              alt="Chambres"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Nos chambres de standing
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
                  Glatt Kasher Laméhadrine
                </h2>
                <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Sous la surveillance du
                </p>
                <p className="text-xl font-semibold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Rav Mordehai Cohen de Malaga
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Bandeau photo */}
          <div className="relative h-[50vh] mb-16 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/restaurant/ORIGEN.jpg"
              alt="Restauration"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Gastronomie Glatt Kasher
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
                  Animation Non-Stop
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
                      Rabbin & Paytan
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
              alt="SPA"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                SPA & Bien-être
              </p>
            </div>
          </div>

          {/* CTA Final */}
          <section className="text-center py-16 bg-gradient-to-br from-[#D4AF37]/10 to-[#0077B6]/10 rounded-lg">
            <h2 
              className="text-3xl md:text-4xl mb-6 text-foreground"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Prêt à vivre un Pessah inoubliable ?
            </h2>
            <Link href="/contact">
              <Button variant="gold" size="lg">
                Demander un devis
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
