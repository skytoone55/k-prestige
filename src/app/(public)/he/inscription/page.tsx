import { Metadata } from 'next';
import InscriptionContentHE from './InscriptionContent';

export const metadata: Metadata = {
  title: 'הרשמה פסח 2026 | K Prestige',
  description: 'הירשמו לפסח 2026 עם K Prestige. שהייה יוקרתית במלון הכל כלול.',
  openGraph: {
    title: 'הרשמה פסח 2026 | K Prestige',
    url: 'https://k-prestige.com/he/inscription',
    locale: 'he_IL',
  },
};

export default function InscriptionPageHE() {
  return <InscriptionContentHE />;
}
