'use client';

import { Card } from '@/components/ui/Card';

export default function StatistiquesPage() {
  return (
    <div>
      <h1 
        className="text-4xl mb-8 text-stone-900"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Statistiques
      </h1>
      <Card className="p-12 text-center">
        <p className="text-stone-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Page en cours de développement
        </p>
      </Card>
    </div>
  );
}

