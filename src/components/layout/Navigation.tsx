'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#B8860B] flex items-center justify-center">
            <span className="text-[#B8860B] font-bold text-xl" style={{ fontFamily: 'var(--font-cormorant)' }}>K</span>
          </div>
          <span className="text-lg tracking-[0.3em] text-[#B8860B]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            PRESTIGE
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {['Accueil', 'Séjour', 'Hôtel', 'Tarifs', 'Galerie', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace('é', 'e').replace('ô', 'o')}`}
              className="text-sm tracking-wider text-stone-700 hover:text-[#B8860B] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              {item}
            </Link>
          ))}
        </div>

        <Link href="/reservation">
          <Button variant="gold" className="text-sm">
            Demander un devis
          </Button>
        </Link>
      </div>
    </nav>
  );
}

