import { Metadata } from 'next';
import InscriptionFormContent from './InscriptionFormContent';

export const metadata: Metadata = {
  title: 'Inscription Pessah 2026 | K Prestige',
  description: 'Inscrivez-vous pour Pessah 2026 avec K Prestige. Séjour luxueux en pension complète dans un cadre exceptionnel.',
  openGraph: {
    title: 'Inscription Pessah 2026 | K Prestige',
    description: 'Inscrivez-vous pour Pessah 2026 avec K Prestige. Séjour luxueux en pension complète dans un cadre exceptionnel.',
    url: 'https://kprestige.com/inscription',
    images: [
      {
        url: 'https://kprestige.com/images/hero/PANORAMIC.jpg',
        width: 1200,
        height: 630,
        alt: 'K Prestige - Pessah 2026',
      },
    ],
    type: 'website',
    siteName: 'K Prestige',
    locale: 'fr_FR',
  },
};

export default function InscriptionTestPage() {
  return <InscriptionFormContent />;
}
