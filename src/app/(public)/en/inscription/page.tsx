import { Metadata } from 'next';
import InscriptionContentEN from './InscriptionContent';

export const metadata: Metadata = {
  title: 'Registration Pessah 2026 | K Prestige',
  description: 'Register for Pessah 2026 with K Prestige. Luxury all-inclusive stay in an exceptional setting.',
  openGraph: {
    title: 'Registration Pessah 2026 | K Prestige',
    description: 'Register for Pessah 2026 with K Prestige. Luxury all-inclusive stay in an exceptional setting.',
    url: 'https://k-prestige.com/en/inscription',
    locale: 'en_US',
  },
};

export default function InscriptionPageEN() {
  return <InscriptionContentEN />;
}
