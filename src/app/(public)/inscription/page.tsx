import { Metadata } from 'next';

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
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl mb-4 text-[var(--gold)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Inscription Pessah 2026
          </h1>
          <p
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Réservez votre séjour d&apos;exception pour Pessah 2026
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Card principale */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center mb-8">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-[var(--gold)]/10 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2
                className="text-2xl md:text-3xl mb-4 text-gray-800"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Formulaire d&apos;inscription
              </h2>
              <p
                className="text-gray-600 mb-8 max-w-lg mx-auto"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                Complétez notre formulaire d&apos;inscription pour réserver votre place.
                Notre équipe vous recontactera rapidement pour finaliser votre réservation.
              </p>
            </div>

            <a
              href="https://wkf.ms/3Zy1HJe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--gold)] text-white rounded-lg hover:bg-[var(--gold-dark)] transition-all transform hover:scale-105 shadow-lg"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              <span className="text-lg font-medium">Accéder au formulaire</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <p
              className="mt-6 text-sm text-gray-500"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Le formulaire s&apos;ouvrira dans un nouvel onglet
            </p>
          </div>

          {/* Informations incluses */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3
              className="text-xl mb-6 text-[var(--gold)] text-center"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Ce qui est inclus dans votre séjour
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Pension complète cachère Glatt',
                'Hébergement en hôtel de luxe',
                'Animations et spectacles',
                'Programme pour enfants',
                'Sedarim communautaires',
                'Synagogue sur place',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[var(--gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3
              className="text-xl mb-4 text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Besoin d&apos;aide ?
            </h3>
            <p
              className="text-gray-600 mb-6"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Notre équipe est disponible pour répondre à toutes vos questions
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="tel:+33699951963"
                className="flex items-center gap-2 text-gray-700 hover:text-[var(--gold)] transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +33 6 99 95 19 63
              </a>
              <a
                href="https://wa.me/33699951963"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-[var(--gold)] transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="mailto:contact@kprestige.com"
                className="flex items-center gap-2 text-gray-700 hover:text-[var(--gold)] transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@kprestige.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
