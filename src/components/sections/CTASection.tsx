'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { usePageContentWithLang } from '@/lib/usePageContent';

export function CTASection() {
  const { data } = usePageContentWithLang('accueil');
  const cta = data?.cta || {
    subtitle: 'Prêt à vivre l\'expérience K Prestige ?',
    title: 'Contactez-nous dès aujourd\'hui',
    description: 'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans l\'organisation de votre événement.',
    button1_text: 'Demander un devis',
    button2_text: 'Nous contacter sur WhatsApp',
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[var(--gold-pale)]/30 via-[var(--gold-pale)]/20 to-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <ScrollReveal>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            {cta.subtitle}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-cormorant mt-4 mb-6 text-[var(--dark-bg)]"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
          >
            {cta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            {cta.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/contact">
              <Button className="btn-gold-primary text-lg px-8 py-4">
                {cta.button1_text}
              </Button>
            </Link>
            <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer">
              <Button className="btn-gold-outline text-lg px-8 py-4">
                {cta.button2_text}
              </Button>
            </a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

