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
import { usePageContent } from '@/lib/usePageContent';

export default function ContactPage() {
  const { data, loading } = usePageContent('contact');

  // Données dynamiques avec fallback
  const hero = data?.hero || {
    subtitle: 'Contactez-nous',
    title: 'Contactez-nous',
    description: 'Notre équipe est à votre écoute pour répondre à toutes vos questions',
    image: placeholderImages.hotelExterior,
  };

  // Coordonnées avec gestion des deux formats (phones[] ou phone1/phone2)
  const rawCoordonnees = data?.coordonnees || {};
  const coordonnees = {
    title: rawCoordonnees.title || 'Nos coordonnées',
    // Supporte soit phones[] soit phone1/phone2
    phones: rawCoordonnees.phones || [
      rawCoordonnees.phone1 || '+33 6 99 95 19 63',
      rawCoordonnees.phone2 || '+33 6 51 70 19 78',
    ].filter(Boolean),
    email: rawCoordonnees.email || 'k-prestige@outlook.fr',
    address: rawCoordonnees.address || {
      name: 'K PRESTIGE EVENT',
      street: '33 Avenue Philippe Auguste',
      city: '75011 Paris, France',
      siret: 'SIRET: 894 067 594 R.C.S. Paris',
    },
  };

  const form = data?.form || {
    title: 'Envoyez-nous un message',
  };

  const quickContact = data?.quickContact || {
    title: 'Autres moyens de contact',
    whatsapp: {
      title: 'WhatsApp',
      description: 'Contactez-nous directement',
      button: 'Ouvrir WhatsApp',
    },
    callback: {
      title: 'Être rappelé',
      description: 'Formulaire rapide',
      button: 'Formulaire rappel',
    },
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)]"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={hero.image || placeholderImages.hotelExterior}
              alt="Contact K Prestige"
              fill
              className="object-cover scale-110 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/20 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {hero.subtitle}
                </span>
                <h1
                  className="text-6xl md:text-7xl font-cormorant text-white mt-4 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                >
                  {hero.title}
                </h1>
                <p className="text-white/80 text-xl mt-4 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {hero.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section principale - Design épuré style MZ Energy */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Colonne gauche: Coordonnées + Autres moyens de contact */}
              <ScrollReveal>
                <div className="h-full flex flex-col">
                  <h2 className="text-3xl font-cormorant text-[var(--gold)] mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {coordonnees.title}
                  </h2>
                  <div className="space-y-8 mb-10">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-5 h-5 text-[var(--gold)]" />
                        <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                          Téléphone
                        </h3>
                      </div>
                      <div className="pl-8 space-y-2">
                        {(coordonnees.phones || []).map((phone: string, idx: number) => (
                          <a key={idx} href={`tel:+33${phone.replace(/\s/g, '').replace(/^0/, '')}`} className="block text-gray-700 hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {phone}
                          </a>
                        ))}
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
                        <a href={`mailto:${coordonnees.email}`} className="text-gray-700 hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {coordonnees.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Adresse
                      </h3>
                      <p className="text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {coordonnees.address?.name}<br />
                        {coordonnees.address?.street}<br />
                        {coordonnees.address?.city}
                      </p>
                      <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {coordonnees.address?.siret}
                      </p>
                    </div>
                  </div>

                  {/* Autres moyens de contact - sur la même ligne */}
                  <div className="border-t border-gray-200 pt-8 mt-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border border-gray-200 hover:border-[var(--gold)]/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-[#25D366]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                                {quickContact.whatsapp?.title}
                              </h4>
                              <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                                {quickContact.whatsapp?.description}
                              </p>
                            </div>
                            <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer" className="w-full">
                              <Button variant="outline" size="sm" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs">
                                {quickContact.whatsapp?.button}
                              </Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200 hover:border-[var(--gold)]/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                              <Phone className="w-5 h-5 text-[var(--gold)]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                                {quickContact.callback?.title}
                              </h4>
                              <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                                {quickContact.callback?.description}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white text-xs">
                              {quickContact.callback?.button}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Colonne droite: Formulaire */}
              <ScrollReveal delay={0.1}>
                <div className="h-full flex flex-col">
                  <h2 className="text-3xl font-cormorant text-[var(--gold)] mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {form.title}
                  </h2>
                  <Card className="border border-gray-200 shadow-sm flex-1">
                    <CardContent className="p-8 h-full">
                      <ContactForm />
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
