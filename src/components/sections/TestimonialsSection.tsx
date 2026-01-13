'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Card, CardContent } from '@/components/ui/Card';
import { Quote } from 'lucide-react';
import { usePageContent } from '@/lib/usePageContent';

const defaultTestimonials = [
  {
    name: 'Sarah M.',
    location: 'Paris',
    text: 'Un séjour exceptionnel pour Pessah 2025. L\'organisation était parfaite, la kashrout irréprochable, et l\'animation de qualité. Nous reviendrons !',
    rating: 5,
  },
  {
    name: 'David L.',
    location: 'Lyon',
    text: 'K Prestige a organisé notre mariage à Marrakech. Service au top, cuisine délicieuse, et équipe très professionnelle. Je recommande vivement.',
    rating: 5,
  },
  {
    name: 'Rivka K.',
    location: 'Strasbourg',
    text: 'Notre pèlerinage Hilloula était magnifique. Tout était bien organisé, les repas excellents, et l\'ambiance spirituelle au rendez-vous. Merci !',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { data } = usePageContent('accueil');
  const allTestimonials = data?.testimonials || defaultTestimonials;
  // Filtrer les éléments masqués
  const testimonials = allTestimonials.filter((item: any) => !item.hidden);
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-cormorant mt-4 text-[var(--dark-bg)]" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
              Ce que disent nos clients
            </h2>
            <div className="w-24 h-[1px] bg-[var(--gold)] mx-auto mt-6" />
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="w-full">
                <Card className="p-6 h-full hover:shadow-xl transition-shadow">
                  <Quote className="w-8 h-8 text-[var(--gold)] mb-4" />
                  <p className="text-gray-700 mb-6 italic" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[var(--dark-bg)]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-[var(--gold)]">★</span>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

