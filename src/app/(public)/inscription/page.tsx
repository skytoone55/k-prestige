import { Metadata } from 'next';
import Image from 'next/image';

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
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/images/hero/PANORAMIC.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Card principale */}
      <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 max-w-xl w-full">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/K PRESTIGE NOIR.png"
            alt="K Prestige"
            width={130}
            height={80}
            className="h-20 w-auto"
          />
        </div>

        {/* Titre */}
        <h1
          className="text-3xl md:text-4xl text-gray-800 mb-6"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Informations importantes
        </h1>

        {/* Contenu */}
        <div className="space-y-4 text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          <p>
            <strong>Merci de remplir un formulaire par famille.</strong>
          </p>

          <p>
            Chaque famille (parents + enfants) doit compléter <strong>son propre formulaire</strong>, même si la réservation a été faite par une seule personne pour plusieurs proches.
          </p>

          <div className="py-2">
            <p className="flex items-center gap-2 mb-3">
              <span className="text-xl">👉</span>
              <span>Si vous avez réservé pour :</span>
            </p>
            <ul className="list-disc list-inside ml-8 space-y-1 text-gray-600">
              <li>vos parents</li>
              <li>vos enfants</li>
              <li>des cousins</li>
              <li>une autre famille</li>
            </ul>
          </div>

          <p>
            Alors <strong>chaque foyer doit remplir un formulaire séparé</strong> avec ses propres informations (noms, dates de séjour, passeports, etc.).
          </p>

          <p>
            Cela nous permet d&apos;organiser correctement les chambres, transferts et formalités administratives.
          </p>

          <div className="pt-2 text-gray-600">
            <p>Merci pour votre collaboration.</p>
            <p className="font-medium">L&apos;équipe K PRESTIGE</p>
          </div>
        </div>

        {/* Bouton Commencer */}
        <div className="mt-8">
          <a
            href="https://wkf.ms/3Zy1HJe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[#1a1a1a] text-white rounded-md hover:bg-[#2d2d2d] transition-colors font-medium"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Commencer
          </a>
        </div>
      </div>
    </div>
  );
}
