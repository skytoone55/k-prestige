'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '@/lib/images';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function SoucottPage() {
  const kits = [
    {
      level: 'א',
      name: 'Standard / Kosher',
      nameHe: 'א',
      description: 'Valide halakhiquement',
      price: '~50€',
      available: true,
    },
    {
      level: 'אא',
      name: 'Méhoudar',
      nameHe: 'אא',
      description: 'Qualité améliorée',
      price: '~70-80€',
      available: true,
    },
    {
      level: 'ב',
      name: 'Méhoudar min haméhoudar',
      nameHe: 'ב',
      description: 'Très haute qualité',
      price: '~100-120€',
      available: true,
    },
    {
      level: 'ג',
      name: 'Premium / Luxe',
      nameHe: 'ג',
      description: 'Qualité exceptionnelle',
      price: '150€+',
      available: true,
    },
  ];

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={placeholderImages.loulav}
              alt="Arba Minim - Souccot"
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
                  E-commerce
                </span>
                <h1 
                  className="text-6xl md:text-7xl font-cormorant text-white mt-4 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  Souccot
                </h1>
                <p className="text-white/80 text-xl mt-4 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Kits Arba Minim (4 espèces) de qualité
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Présentation */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 
                className="text-4xl md:text-5xl mb-6 text-[var(--gold)]"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
              >
                Les 4 Espèces
              </h2>
              <p className="text-lg text-gray-700 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Vente en ligne de kits Arba Minim pour la fête de Souccot. 
                Période : Avant Souccot (septembre-octobre)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[
                  { image: placeholderImages.palm, name: 'Loulav', desc: 'Branche de palmier' },
                  { image: placeholderImages.nature, name: 'Etrog', desc: 'Cédrat' },
                  { image: placeholderImages.plants, name: 'Hadassim', desc: '3 branches de myrte' },
                  { image: placeholderImages.loulav, name: 'Aravot', desc: '2 branches de saule' },
                ].map((espece, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Image avec overlay au hover */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={espece.image}
                          alt={espece.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      </div>
                      
                      {/* Contenu */}
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-[2px] bg-[var(--gold)] mb-3 mx-auto transition-all duration-500 group-hover:w-20" />
                        <h3 
                          className="font-semibold text-[var(--gold)] mb-1 group-hover:text-[var(--gold-shine)] transition-colors"
                          style={{ fontFamily: 'var(--font-cormorant)' }}
                        >
                          {espece.name}
                        </h3>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {espece.desc}
                        </p>
                      </CardContent>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Catalogue */}
          <section className="mb-16">
            <h2 
              className="text-4xl md:text-5xl mb-8 text-center text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Niveaux de Qualité
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kits.map((kit, idx) => (
                <Card key={idx} className="p-6 text-center hover:shadow-xl transition-shadow border-2 border-[var(--gold)]/20">
                  <div className="text-5xl mb-4 font-bold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {kit.nameHe}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {kit.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {kit.description}
                  </p>
                  <div className="text-2xl font-bold text-[var(--gold)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {kit.price}
                  </div>
                  <Button 
                    className="btn-gold-primary w-full"
                    disabled={!kit.available}
                  >
                    {kit.available ? 'Ajouter au panier' : 'Bientôt disponible'}
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Info Livraison */}
          <section className="mb-16">
            <Card className="bg-gradient-to-br from-[var(--gold-pale)]/20 to-transparent border-2 border-[var(--gold)]/30">
              <CardContent className="p-8">
                <h2 
                  className="text-3xl mb-6 text-center text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  Livraison
                </h2>
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Livraison en France principalement. Architecture prête pour expansion vers Israël.
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Frais de livraison conditionnels selon la quantité et la période.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-16 bg-gradient-to-br from-[var(--gold-pale)]/30 to-transparent rounded-lg">
            <h2 
              className="text-3xl md:text-4xl mb-6 text-gray-800"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Prêt à commander votre kit ?
            </h2>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Sélectionnez votre niveau de qualité et passez commande
            </p>
            <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <strong>Note :</strong> Le système e-commerce complet sera disponible prochainement. 
              En attendant, contactez-nous directement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="btn-gold-primary">
                  Nous contacter
                </Button>
              </Link>
              <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer">
                <Button className="btn-gold-outline">
                  Commander par WhatsApp
                </Button>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

