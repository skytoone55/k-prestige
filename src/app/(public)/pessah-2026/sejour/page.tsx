'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { PessahDevisForm } from '@/components/public/PessahDevisForm';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { placeholderImages } from '@/lib/images';
import { ArrowRight } from 'lucide-react';

export default function PessahSejourPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hero/PANORAMIC VIEW.jpg"
              alt="Pessah 2026"
              fill
              className="object-cover scale-110 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/20 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Séjour Premium
                </span>
                <h1 
                  className="text-6xl md:text-7xl font-cormorant text-white mt-4 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  Le Séjour
                </h1>
                <p className="text-white/80 text-xl mt-4 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Pessah 2026 • Cabogata Beach Hotel 5★
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Dates */}
          <section className="mb-16">
            <SectionTitle title="Dates du Séjour" />
            <div className="grid md:grid-cols-2 gap-6">
              <ScrollReveal delay={0}>
                <motion.div whileHover={{ y: -4 }}>
                  <Card className="border border-[var(--gold)]/30 hover:shadow-xl transition-all bg-white">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Séjour Principal
                      </h3>
                      <p className="text-2xl font-semibold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        31 Mars - 10 Avril 2026
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        10 nuits
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <motion.div whileHover={{ y: -4 }}>
                  <Card className="border border-[var(--blue-mediterranean)]/30 hover:shadow-xl transition-all bg-white">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--blue-mediterranean)]/10 flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h3 className="text-2xl mb-4 text-[var(--blue-mediterranean)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Weekend Prolongé
                      </h3>
                      <p className="text-2xl font-semibold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        10 - 12 Avril 2026
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        +2 nuits (optionnel)
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            </div>
          </section>

          {/* Supervision Religieuse */}
          <section className="mb-16">
            <ScrollReveal>
              <Card className="border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--gold-pale)]/10 to-white hover:shadow-xl transition-all">
                <CardContent className="p-12">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                      <span className="text-4xl">✡️</span>
                    </div>
                    <h2 
                      className="text-3xl md:text-4xl mb-4 text-gray-800"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      Glatt Kasher Laméhadrine
                    </h2>
                  </div>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="text-center">
                      <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Sous la surveillance du
                      </p>
                      <p className="text-2xl font-semibold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Rav Mordehai Cohen de Malaga
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-4 text-center">
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Viandes sous surveillance Rav Ephraïm Cremisi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </section>

          {/* Animation */}
          <section className="mb-16">
            <SectionTitle title="Animation Non-Stop" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { image: placeholderImages.musicBand, title: 'Laurent Folies Musical Band', desc: '@laurentfolies', instagram: 'https://www.instagram.com/laurentfolies' },
                { image: placeholderImages.dj, title: 'Yonni Chemla DJ Live', desc: '@yonnichemla', instagram: 'https://www.instagram.com/yonnichemla' },
                { image: placeholderImages.singer, title: 'Avi Ohayon', desc: 'Rabbin & Paytan', instagram: null },
                { image: placeholderImages.kidsAnimation, title: 'Gueoula Animation', desc: 'Animation Enfants', instagram: 'https://www.instagram.com/gueoula_animation' },
              ].map((anim, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image avec overlay au hover */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={anim.image}
                        alt={anim.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Badge flottant */}
                      <div className="absolute top-4 right-4 bg-[var(--gold)]/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Premium
                      </div>
                    </div>
                    
                    {/* Contenu avec ligne dorée animée */}
                    <CardContent className="p-6">
                      <div className="w-12 h-[2px] bg-[var(--gold)] mb-4 transition-all duration-500 group-hover:w-20" />
                      <h3 
                        className="text-xl font-cormorant font-semibold mb-2 group-hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {anim.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {anim.desc}
                      </p>
                      
                      {/* Lien Instagram si disponible */}
                      {anim.instagram && (
                        <a
                          href={anim.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[var(--gold)] text-sm font-medium group-hover:gap-2 transition-all"
                          style={{ fontFamily: 'var(--font-dm-sans)' }}
                        >
                          Voir Instagram
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                        </a>
                      )}
                    </CardContent>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-16">
            <SectionTitle title="Services Inclus" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { image: placeholderImages.beachAccess, title: 'Pied dans l\'eau', desc: 'Accès direct plage' },
                { image: placeholderImages.pool, title: '3 Piscines', desc: 'Dont une chauffée' },
                { image: placeholderImages.spa, title: 'SPA Luxueux', desc: 'Centre bien-être complet' },
                { image: placeholderImages.restaurant, title: 'Gastronomie', desc: 'Cuisine française et orientale' },
                { image: placeholderImages.kidsClub, title: 'Clubs Enfants', desc: 'Baby, Mini, Kids Club' },
                { image: placeholderImages.fitness, title: 'Sport & Fitness', desc: 'Salle équipée, coach' },
              ].map((service, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image avec overlay au hover */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    </div>
                    
                    {/* Contenu */}
                    <CardContent className="p-6">
                      <div className="w-12 h-[2px] bg-[var(--gold)] mb-4 transition-all duration-500 group-hover:w-20" />
                      <h3 
                        className="text-lg font-cormorant font-semibold mb-2 group-hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {service.desc}
                      </p>
                    </CardContent>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Formulaire Devis */}
          <section className="mb-16">
            <SectionTitle title="Demande de Devis" subtitle="Contactez-nous" />
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <Card className="border border-[var(--gold)]/30 shadow-xl bg-white">
                  <CardContent className="p-8 md:p-12">
                    <PessahDevisForm />
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </section>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Link href="/pessah-2026/hotel">
              <Button className="btn-gold-outline">
                Découvrir l&apos;hôtel
              </Button>
            </Link>
            <Link href="/pessah-2026/galerie">
              <Button className="btn-gold-outline">
                Voir la galerie
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

