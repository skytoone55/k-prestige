'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import { usePageContentWithLang } from '@/lib/usePageContent';
import { useTranslation } from '@/lib/LanguageContext';

export function HeroHome() {
  const { data } = usePageContentWithLang('accueil');
  const { t } = useTranslation();
  const hero = data?.hero || {
    subtitle: 'Expérience Premium',
    title: 'PESSAH 2026',
    location: 'Cabogata Beach Hotel 5★ • Espagne',
    date: '31 MARS - 10 AVRIL',
    image: '/images/hero/PANORAMIC.jpg',
    animation_text: 'Animation non-stop par Laurent Folies Musical Band × Yonni Chemla DJ Live',
  };

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Image de fond - overlay très léger */}
      <div className="absolute inset-0">
        <Image
          src={hero.image || '/images/hero/PANORAMIC.jpg'}
          alt="Pessah 2026 - Cabogata Beach Hotel"
          fill
          className="object-cover scale-105 animate-slow-zoom"
          priority
          quality={100}
          sizes="100vw"
        />
        {/* Overlay minimal pour garder l'image lumineuse */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
      </div>

      {/* Contenu - réparti sur toute la hauteur */}
      <div className="relative z-10 h-full flex flex-col justify-between items-center text-center px-6 pt-28 pb-20 md:pt-32 md:pb-24">
        {/* Groupe du haut : Subtitle */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[var(--gold)] uppercase tracking-[0.3em] text-sm px-5 py-2.5 bg-black/50 backdrop-blur-sm rounded-full font-bold"
          style={{ fontFamily: 'var(--font-dm-sans)', textShadow: '0 2px 10px rgba(0,0,0,0.9)', fontWeight: 700 }}
        >
          {hero.subtitle}
        </motion.span>

        {/* Groupe central : Title + Location + Date */}
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-cormorant text-white tracking-tight"
            style={{
              fontFamily: 'var(--font-lora)',
              fontWeight: 500,
              textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-white"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              textShadow: '0 2px 12px rgba(0,0,0,0.8)'
            }}
          >
            {hero.location}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[var(--gold)] tracking-[0.25em] px-5 py-2.5 bg-black/50 backdrop-blur-sm rounded-full font-bold"
            style={{ fontFamily: 'var(--font-cormorant)', textShadow: '0 2px 10px rgba(0,0,0,0.9)', fontWeight: 700 }}
          >
            {hero.date}
          </motion.p>
        </div>

        {/* Groupe du bas : Buttons + Bandeau */}
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Button
              onClick={() => document.getElementById('devis-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold-primary text-lg px-8 py-4 shadow-xl"
            >
              {t('hero.requestQuote')}
            </Button>
            <Link href="/pessah-2026/sejour">
              <Button className="btn-gold-outline border-white text-white hover:bg-white hover:text-[var(--dark-bg)] text-lg px-8 py-4 shadow-xl">
                {t('hero.discoverOffer')}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-6 py-4 bg-black/40 backdrop-blur-md border border-[var(--gold)]/40 rounded-xl shadow-2xl"
          >
            <p className="text-sm md:text-base text-white tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {hero.animation_text || 'Animation non-stop par Laurent Folies Musical Band × Yonni Chemla DJ Live'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-white/90 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
          {t('home.discover')}
        </span>
        <ChevronDown className="w-7 h-7 text-white/90" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.9))' }} />
      </motion.div>
    </section>
  );
}

