import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function TarifsPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 
            className="text-5xl mb-12 text-stone-900 text-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Tarifs
          </h1>

          <Card className="p-8 mb-8">
            <h2 className="text-3xl mb-6 text-stone-900" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Séjour 10 nuits (31 Mars - 10 Avril 2026)
            </h2>
            <div className="space-y-4">
              {[
                { category: 'Adulte (chambre double)', price: '2 190 €' },
                { category: 'Bébé (0-24 mois)', price: 'GRATUIT' },
                { category: 'Enfant (2-3 ans)', price: '390 €' },
                { category: 'Enfant (4-6 ans)', price: '990 €' },
                { category: 'Enfant (7-11 ans)', price: '1 390 €' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-stone-200 last:border-0">
                  <span className="text-stone-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>{item.category}</span>
                  <span className="text-xl font-semibold text-[#B8860B]" style={{ fontFamily: 'var(--font-cormorant)' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-3xl mb-6 text-stone-900" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Weekend Prolongé (10-12 Avril)
            </h2>
            <div className="space-y-4">
              {[
                { category: 'Adulte', price: '+290 €' },
                { category: 'Enfant', price: '+190 €' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-stone-200 last:border-0">
                  <span className="text-stone-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>{item.category}</span>
                  <span className="text-xl font-semibold text-[#B8860B]" style={{ fontFamily: 'var(--font-cormorant)' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center mb-8">
            <Link href="/contact">
              <Button variant="gold" size="lg">
                Demander un devis personnalisé
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
