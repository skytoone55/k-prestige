import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { PessahDevisForm } from '@/components/public/PessahDevisForm';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PessahSejourPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <Image
            src="/images/hero/PANORAMIC VIEW.jpg"
            alt="Pessah 2026"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white">
            <h1 
              className="text-5xl md:text-7xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Le Séjour
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Pessah 2026 • Cabogata Beach Hotel 5★
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Dates */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[var(--gold)]/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Séjour Principal
                  </h3>
                  <p className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    31 Mars - 10 Avril 2026
                  </p>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    10 nuits
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-[var(--blue-mediterranean)]/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl mb-4 text-[var(--blue-mediterranean)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Weekend Prolongé
                  </h3>
                  <p className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    10 - 12 Avril 2026
                  </p>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    +2 nuits (optionnel)
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

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
                <p className="text-2xl font-semibold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Rav Mordehai Cohen de Malaga
                </p>
                <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Viandes sous surveillance Rav Ephraïm Cremisi
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Animation */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Animation Non-Stop
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center p-6">
                <div className="text-5xl mb-4">🎵</div>
                <h3 className="text-xl mb-2 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Laurent Folies Musical Band
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  @laurentfolies
                </p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-5xl mb-4">🎧</div>
                <h3 className="text-xl mb-2 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Yonni Chemla DJ Live
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  @yonnichemla
                </p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-5xl mb-4">🎤</div>
                <h3 className="text-xl mb-2 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Avi Ohayon
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Rabbin & Paytan
                </p>
              </Card>
            </div>
            <Card className="bg-[var(--dark-bg)] text-white p-6">
              <CardContent>
                <h3 className="text-xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Animation Enfants
                </h3>
                <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <strong>Gueoula Animation</strong>
                </p>
                <a
                  href="https://www.instagram.com/gueoula_animation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--gold)] hover:underline"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  @gueoula_animation
                </a>
              </CardContent>
            </Card>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Services Inclus
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🏖️', title: 'Pied dans l\'eau', desc: 'Accès direct plage' },
                { icon: '🏊', title: '3 Piscines', desc: 'Dont une chauffée' },
                { icon: '💆', title: 'SPA Luxueux', desc: 'Centre bien-être complet' },
                { icon: '🍽️', title: 'Gastronomie', desc: 'Cuisine française et orientale' },
                { icon: '👶', title: 'Clubs Enfants', desc: 'Baby, Mini, Kids Club' },
                { icon: '💪', title: 'Sport & Fitness', desc: 'Salle équipée, coach' },
              ].map((service, idx) => (
                <Card key={idx} className="p-6 text-center">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {service.desc}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Formulaire Devis */}
          <section className="mb-16">
            <div className="max-w-2xl mx-auto">
              <PessahDevisForm />
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Link href="/pessah-2026/hotel">
              <Button className="btn-gold-outline">
                Découvrir l&apos;hôtel
              </Button>
            </Link>
            <Link href="/pessah-2026/galerie">
              <Button className="btn-gold-outline">
                Voir la galerie
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

