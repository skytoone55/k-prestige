'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { usePageContent } from '@/lib/usePageContent';

const defaultStats = [
  { value: 7000, suffix: '+', label: 'Familles accompagnées' },
  { value: 10, suffix: ' ans', label: "D'expérience" },
  { value: 15, suffix: '+', label: 'Destinations' },
  { value: 100, suffix: '%', label: 'Kashrout certifiée' },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-cormorant text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const { data } = usePageContent('accueil');
  const allStats = data?.stats || defaultStats;
  // Filtrer les éléments masqués
  const stats = allStats.filter((item: any) => !item.hidden);

  return (
    <section className="py-24 bg-[var(--dark-bg)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="text-center w-[calc(50%-1rem)] md:w-auto md:min-w-[150px]">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <p className="text-white/60 mt-2 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

