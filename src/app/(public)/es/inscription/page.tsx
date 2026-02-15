import { Metadata } from 'next';
import InscriptionContentES from './InscriptionContent';

export const metadata: Metadata = {
  title: 'Inscripción Pésaj 2026 | K Prestige',
  description: 'Inscríbase en Pésaj 2026 con K Prestige. Estancia de lujo todo incluido en un entorno excepcional.',
  openGraph: {
    title: 'Inscripción Pésaj 2026 | K Prestige',
    description: 'Inscríbase en Pésaj 2026 con K Prestige. Estancia de lujo todo incluido en un entorno excepcional.',
    url: 'https://k-prestige.com/es/inscription',
    locale: 'es_ES',
  },
};

export default function InscriptionPageES() {
  return <InscriptionContentES />;
}
