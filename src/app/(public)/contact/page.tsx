'use client';

import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ContactForm } from '@/components/public/ContactForm';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Image from 'next/image';
import { placeholderImages } from '@/lib/images';

export default function ContactPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={placeholderImages.hotelExterior}
              alt="Contact K Prestige"
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
                  Contactez-nous
                </span>
                <h1 
                  className="text-6xl md:text-7xl font-cormorant text-white mt-4 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  Contactez-nous
                </h1>
                <p className="text-white/80 text-xl mt-4 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Notre équipe est à votre écoute pour répondre à toutes vos questions
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section principale - Design épuré style MZ Energy */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Coordonnées - Design minimaliste */}
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl font-cormorant text-[var(--gold)] mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Nos coordonnées
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-5 h-5 text-[var(--gold)]" />
                        <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                          Téléphone
                        </h3>
                      </div>
                      <div className="pl-8 space-y-2">
                        <a href="tel:+33699951963" className="block text-gray-700 hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          06 99 95 19 63
                        </a>
                        <a href="tel:+33651701978" className="block text-gray-700 hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          06 51 70 19 78
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-5 h-5 text-[var(--gold)]" />
                        <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                          Email
                        </h3>
                      </div>
                      <div className="pl-8">
                        <a href="mailto:k-prestige@outlook.fr" className="text-gray-700 hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          k-prestige@outlook.fr
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Adresse
                      </h3>
                      <p className="text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        K PRESTIGE EVENT<br />
                        33 Avenue Philippe Auguste<br />
                        75011 Paris, France
                      </p>
                      <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        SIRET: 894 067 594 R.C.S. Paris
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Formulaire - Design épuré */}
              <ScrollReveal delay={0.1}>
                <div>
                  <h2 className="text-3xl font-cormorant text-[var(--gold)] mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Envoyez-nous un message
                  </h2>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-8">
                      <ContactForm />
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>

            {/* Options de contact rapide - Design minimaliste */}
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-cormorant text-gray-800 mb-8 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Autres moyens de contact
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <ScrollReveal delay={0}>
                  <Card className="border border-gray-200 hover:border-[var(--gold)]/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-[#25D366]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                            WhatsApp
                          </h3>
                          <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            Contactez-nous directement
                          </p>
                          <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                              Ouvrir WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <Card className="border border-gray-200 hover:border-[var(--gold)]/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-[var(--gold)]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                            Être rappelé
                          </h3>
                          <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            Formulaire rapide
                          </p>
                          <Button variant="outline" size="sm" className="w-full border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white">
                            Formulaire rappel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
