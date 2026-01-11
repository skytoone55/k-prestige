import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[var(--dark-bg)] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image
                src="/K PRETIGE OR.png"
                alt="K PRESTIGE"
                width={300}
                height={100}
                className="h-24 w-auto"
              />
            </div>
            <p className="text-sm text-white/70 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              K PRESTIGE EVENT
            </p>
            <p className="text-sm text-white/60" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Société d&apos;événementiel complète
            </p>
            <div className="mt-4">
              <a
                href="https://www.instagram.com/k_prestige__events"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gold)] hover:text-[var(--gold-shine)] transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                @k_prestige__events
              </a>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl mb-6 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Contact
            </h3>
            <div className="space-y-3 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <p>
                <a href="tel:+33699951963" className="text-white/80 hover:text-[var(--gold)] transition-colors">
                  06 99 95 19 63
                </a>
              </p>
              <p>
                <a href="tel:+33651701978" className="text-white/80 hover:text-[var(--gold)] transition-colors">
                  06 51 70 19 78
                </a>
              </p>
              <p>
                <a href="mailto:k-prestige@outlook.fr" className="text-white/80 hover:text-[var(--gold)] transition-colors">
                  k-prestige@outlook.fr
                </a>
              </p>
            </div>
          </div>
          
          {/* Informations Légales */}
          <div>
            <h3 className="text-xl mb-6 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Informations
            </h3>
            <div className="space-y-3 text-sm text-white/80" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <p>33 Avenue Philippe Auguste</p>
              <p>75011 Paris, France</p>
              <p className="pt-2">SIRET: 894 067 594</p>
              <p>R.C.S. Paris</p>
            </div>
          </div>
          
          {/* Navigation Rapide */}
          <div>
            <h3 className="text-xl mb-6 text-[var(--gold)] font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Navigation
            </h3>
            <div className="space-y-3 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <Link href="/pessah-2026" className="block text-white/80 hover:text-[var(--gold)] transition-colors">
                Pessah 2026
              </Link>
              <Link href="/marbella" className="block text-white/80 hover:text-[var(--gold)] transition-colors">
                Marbella
              </Link>
              <Link href="/marrakech" className="block text-white/80 hover:text-[var(--gold)] transition-colors">
                Marrakech
              </Link>
              <Link href="/hilloula" className="block text-white/80 hover:text-[var(--gold)] transition-colors">
                Hilloula
              </Link>
              <Link href="/soucott" className="block text-white/80 hover:text-[var(--gold)] transition-colors">
                Soucott
              </Link>
              <Link href="/contact" className="block text-white/80 hover:text-[var(--gold)] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/50" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            © 2026 K PRESTIGE EVENT. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
