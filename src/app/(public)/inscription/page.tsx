import { Metadata } from 'next';
import InscriptionContent from './InscriptionContent';

export const metadata: Metadata = {
  title: 'Inscription Pessah 2026 | K Prestige',
  description: 'Inscrivez-vous pour Pessah 2026 avec K Prestige. Séjour luxueux en pension complète dans un cadre exceptionnel.',
  openGraph: {
    title: 'Inscription Pessah 2026 | K Prestige',
    description: 'Inscrivez-vous pour Pessah 2026 avec K Prestige. Séjour luxueux en pension complète dans un cadre exceptionnel.',
    images: [
      {
        url: '/images/hero/PANORAMIC.jpg',
        width: 1200,
        height: 630,
        alt: 'K Prestige - Pessah 2026',
      },
    ],
    type: 'website',
    siteName: 'K Prestige',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inscription Pessah 2026 | K Prestige',
    description: 'Inscrivez-vous pour Pessah 2026 avec K Prestige.',
    images: ['/images/hero/PANORAMIC.jpg'],
  },
};

export default function InscriptionPage() {
  return <InscriptionContent />;
}
