'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background image avec overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/PANORAMIC.jpg"
          alt="Cabogata Beach Hotel"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo K Prestige */}
        <div className="mb-8 flex justify-center">
          <div className="inline-block p-6 bg-white/95 backdrop-blur-sm rounded-lg border-2 border-[var(--gold)] shadow-xl">
            <Image
              src="/K PRETIGE OR.png"
              alt="K PRESTIGE"
              width={200}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
        </div>

        <h1 
          className="text-6xl md:text-8xl lg:text-9xl mb-6 text-[var(--gold)] tracking-tight drop-shadow-2xl"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
        >
          PESSAH 2026
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-4 drop-shadow-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Cabogata Beach Hotel 5★ • Espagne
        </p>

        <p className="text-lg md:text-xl text-[var(--gold)] mb-8 tracking-[0.3em] drop-shadow-lg" style={{ fontFamily: 'var(--font-cormorant)' }}>
          31 MARS - 10 AVRIL
        </p>

        {/* Badge prix */}
        <div className="inline-block px-8 py-4 gradient-button-gold text-white rounded-full mb-8 shadow-xl">
          <p className="text-xl font-semibold" style={{ fontFamily: 'var(--font-cormorant)' }}>
            À PARTIR DE 2 190€
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/contact">
            <Button className="btn-gold-primary">
              Demander un devis
            </Button>
          </Link>
          
          <Link href="/pessah-2026">
            <Button className="btn-gold-outline border-white text-white hover:bg-white hover:text-[var(--dark-bg)]">
              Découvrir le séjour
            </Button>
          </Link>
        </div>

        {/* Bandeau animation */}
        <div className="px-6 py-4 bg-white/10 backdrop-blur-md border border-[var(--gold)]/30 rounded-lg">
          <p className="text-sm text-white tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Animation non-stop par <strong className="text-[var(--gold)]">Laurent Folies Musical Band</strong> × <strong className="text-[var(--gold)]">Yonni Chemla DJ Live</strong>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/80" />
      </div>
    </section>
  );
}
