'use client';

import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useTranslation, useLanguage } from '@/lib/LanguageContext';

export default function TarifsPage() {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const mainPrices = [
    { categoryKey: 'adulteDouble', price: '2 190 €' },
    { categoryKey: 'bebe', priceKey: 'gratuit' },
    { categoryKey: 'enfant23', price: '390 €' },
    { categoryKey: 'enfant46', price: '990 €' },
    { categoryKey: 'enfant711', price: '1 390 €' },
  ];

  const weekendPrices = [
    { categoryKey: 'adulte', price: '+290 €' },
    { categoryKey: 'enfant', price: '+190 €' },
  ];

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-24 pb-12" dir={dir}>
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-5xl mb-12 text-stone-900 text-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t('tarifs.title')}
          </h1>

          <Card className="p-8 mb-8">
            <h2 className="text-3xl mb-6 text-stone-900" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {t('tarifs.sejour10Nuits')}
            </h2>
            <div className="space-y-4">
              {mainPrices.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-stone-200 last:border-0">
                  <span className="text-stone-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {t(`tarifs.${item.categoryKey}`)}
                  </span>
                  <span className="text-xl font-semibold text-[#B8860B]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {item.priceKey ? t(`tarifs.${item.priceKey}`) : item.price}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-3xl mb-6 text-stone-900" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {t('tarifs.weekendProlonge')}
            </h2>
            <div className="space-y-4">
              {weekendPrices.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-stone-200 last:border-0">
                  <span className="text-stone-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {t(`tarifs.${item.categoryKey}`)}
                  </span>
                  <span className="text-xl font-semibold text-[#B8860B]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center mb-8">
            <Link href="/contact">
              <Button variant="gold" size="lg">
                {t('tarifs.demanderDevis')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
