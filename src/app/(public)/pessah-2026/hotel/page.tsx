import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function PessahHotelPage() {
  const chambres = [
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

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <Image
            src="/images/hotel/FAÇADE.jpg"
            alt="Cabogata Beach Hotel 5★"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white">
            <h1 
              className="text-5xl md:text-7xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              L&apos;Hôtel
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Cabogata Beach Hotel 5★ • El Toyo - Retamar, Almería
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
                  Cabogata Beach Hotel 5★
                </h2>
                <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026
                </p>
                <ul className="space-y-3 text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>257 chambres de standing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Pied dans l&apos;eau</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>3 piscines dont 1 chauffée</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>SPA complet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-xl">✓</span>
                    <span>Accès direct plage</span>
                  </li>
                </ul>
                <div className="bg-[var(--gold-pale)] p-4 rounded-lg">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <strong>Lieu :</strong> El Toyo - Retamar, Almería, Espagne
                  </p>
                </div>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hotel/FAÇADE.jpg"
                  alt="Cabogata Beach Hotel 5★"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Types de chambres */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Types de Chambres
            </h2>
            <p className="text-center text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              257 chambres réparties en 9 catégories différentes
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chambres.map((chambre, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--gold)] mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {chambre.nom}
                      </h3>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Code: {chambre.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {chambre.nombre}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        chambres
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <p><strong>Surface :</strong> {chambre.surface}</p>
                    <p><strong>Vue :</strong> {chambre.vue}</p>
                    {chambre.special && (
                      <p className="text-[var(--gold)] font-semibold">
                        {chambre.special}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Services & Équipements
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🏖️', title: 'Pied dans l\'eau', desc: 'Accès direct plage' },
                { icon: '🏊', title: '3 Piscines', desc: 'Dont une chauffée' },
                { icon: '💆', title: 'SPA Luxueux', desc: 'Centre bien-être complet' },
                { icon: '🍽️', title: 'Gastronomie', desc: 'Cuisine française et orientale' },
                { icon: '💪', title: 'Sport & Fitness', desc: 'Salle équipée, coach' },
                { icon: '👶', title: 'Clubs Enfants', desc: 'Baby, Mini, Kids Club' },
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

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Link href="/pessah-2026/sejour">
              <Button className="btn-gold-outline">
                Voir le séjour
              </Button>
            </Link>
            <Link href="/pessah-2026/galerie">
              <Button className="btn-gold-outline">
                Voir la galerie
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="btn-gold-primary">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

