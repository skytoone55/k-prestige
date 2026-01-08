import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function MarrakechPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🎉</div>
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
              Marrakech
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Service Traiteur sur Mesure
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
                  Traiteur Événementiel
                </h2>
                <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Service traiteur sur demande pour vos événements dans tout le Maroc. 
                  Disponible sur demande pour tous vos événements.
                </p>
                <p className="text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Nous proposons une cuisine casher de qualité pour tous vos événements importants, partout au Maroc.
                </p>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎉</div>
                    <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Photo événement à venir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Types d'événements */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Types d&apos;Événements
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💍', title: 'Mariages', desc: 'Organisation complète' },
                { icon: '🎊', title: 'Bar-mitzvahs', desc: 'Cérémonies et réceptions' },
                { icon: '🕯️', title: 'Hilloula', desc: 'Pèlerinages et célébrations' },
                { icon: '🕊️', title: 'Shabbat', desc: 'Repas de Shabbat' },
                { icon: '🎈', title: 'Réceptions', desc: 'Événements privés' },
                { icon: '🎂', title: 'Anniversaires', desc: 'Célébrations familiales' },
                { icon: '🏛️', title: 'Événements corporatifs', desc: 'Séminaires et conférences' },
                { icon: '✨', title: 'Autres', desc: 'Sur demande' },
              ].map((event, idx) => (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{event.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {event.desc}
                  </p>
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
              Organisons votre événement ensemble
            </h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Contactez-nous pour discuter de votre projet et recevoir une proposition personnalisée
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="btn-gold-primary">
                  Demander une proposition
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

