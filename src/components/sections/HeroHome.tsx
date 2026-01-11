'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

export function HeroHome() {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Video ou Image avec parallax */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/PANORAMIC.jpg"
          alt="Pessah 2026 - Cabogata Beach Hotel"
          fill
          className="object-cover scale-110 animate-slow-zoom"
          priority
          quality={90}
        />
        {/* Overlay dégradé multicouche */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/20 to-transparent" />
      </div>
      
      {/* Contenu avec animations */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[var(--gold)] uppercase tracking-[0.3em] text-sm mb-4 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg"
          style={{ fontFamily: 'var(--font-dm-sans)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          Expérience Premium
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-cormorant text-white mb-6 tracking-tight drop-shadow-2xl"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
        >
          PESSAH 2026
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-white mb-2 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          Cabogata Beach Hotel 5★ • Espagne
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-[var(--gold)] mb-8 tracking-[0.3em] px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg"
          style={{ fontFamily: 'var(--font-cormorant)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
        >
          31 MARS - 10 AVRIL
        </motion.p>
        
        {/* Ligne décorative animée */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mb-8"
        />
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/contact">
            <Button className="btn-gold-primary text-lg px-8 py-4">
              Demander un devis
            </Button>
          </Link>
          <Link href="/pessah-2026/sejour">
            <Button className="btn-gold-outline border-white text-white hover:bg-white hover:text-[var(--dark-bg)] text-lg px-8 py-4">
              Découvrir le séjour
            </Button>
          </Link>
        </motion.div>
        
        {/* Bandeau animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="px-6 py-4 bg-white/10 backdrop-blur-md border border-[var(--gold)]/30 rounded-lg"
        >
          <p className="text-sm text-white tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Animation non-stop par <strong className="text-[var(--gold)]">Laurent Folies Musical Band</strong> × <strong className="text-[var(--gold)]">Yonni Chemla DJ Live</strong>
          </p>
        </motion.div>
      </div>
      
      {/* Scroll indicator - Plus visible */}
      <motion.div 
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/80 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Découvrir
        </span>
        <ChevronDown className="w-8 h-8 text-white/80" />
      </motion.div>
    </section>
  );
}

