import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HilloulaPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🕯️</div>
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
              Hilloula
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Pèlerinages sur Tombes de Tsadikim
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
                  Voyages Organisés
                </h2>
                <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  K Prestige organise des voyages pour pèlerinages sur tombes de Tsadikim plusieurs fois par an, 
                  vers différentes destinations.
                </p>
                <ul className="space-y-3 text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Pension complète</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Transferts organisés</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Kashrout certifié</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Programme complet</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <strong>Note :</strong> Les prix sont affichés pour chaque événement. 
                  Le contenu change fréquemment, consultez régulièrement les nouvelles dates.
                </p>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--gold-light)] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🕯️</div>
                    <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Photo pèlerinage à venir
                    </p>
                  </div>
                </div>
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
                  Prochain Événement
                </h2>
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h3 
                      className="text-2xl mb-4 text-gray-800"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      Hilloula Rabbi Itshak Abouhassira 2026
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Dates</p>
                        <p className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          29 Janvier - 1er Février 2026
                        </p>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>4 jours / 3 nuits</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Lieu</p>
                        <p className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          Hôtel Taddart 4★, Midelt, Maroc
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Prix</p>
                        <p className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                          990€ / personne
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Kashrout</p>
                        <p className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          Glatt Kosher Beth Yossef
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        <strong>Inclus :</strong> Pension complète, transferts (vols exclus)
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/hilloula/rabbi-itshak-abouhassira-2026">
                      <Button className="btn-gold-primary">
                        Voir le programme complet
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-16 bg-gradient-to-br from-[var(--gold-pale)]/30 to-transparent rounded-lg">
            <h2 
              className="text-3xl md:text-4xl mb-6 text-gray-800"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Intéressé par un pèlerinage ?
            </h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Contactez-nous pour plus d&apos;informations sur les prochains événements
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

