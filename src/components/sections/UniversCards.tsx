'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { placeholderImages } from '@/lib/images';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const univers = [
  {
    title: 'Séjours Pessah',
    description: 'Vivez des fêtes inoubliables dans les plus beaux hôtels',
    image: '/images/hero/PANORAMIC.jpg',
    href: '/pessah-2026/sejour',
  },
  {
    title: 'El Dorado Marbella',
    description: 'Restaurant casher & traiteur événementiel',
    image: placeholderImages.restaurantInterior,
    href: '/marbella',
  },
  {
    title: 'Traiteur Marrakech',
    description: 'Traiteur casher pour vos événements au Maroc',
    image: placeholderImages.marrakechEvent,
    href: '/marrakech',
  },
  {
    title: 'Hilloula',
    description: 'Pèlerinages sur les tombes des Tsadikim',
    image: placeholderImages.candles,
    href: '/hilloula',
  },
  {
    title: 'Arba Minim',
    description: 'Loulav & Etrog de qualité pour Souccot',
    image: placeholderImages.loulav,
    href: '/soucott',
  },
];

export function UniversCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {univers.map((item, index) => (
        <ScrollReveal key={item.href} delay={index * 0.1}>
          <Link href={item.href} className="block">
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Image avec overlay au hover */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
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
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {item.description}
                </p>
                
                {/* Bouton avec animation */}
                <span className="inline-flex items-center text-[var(--gold)] text-sm font-medium group-hover:gap-2 transition-all" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Découvrir
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                </span>
              </CardContent>
            </motion.div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}

