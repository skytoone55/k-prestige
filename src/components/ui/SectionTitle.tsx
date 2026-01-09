'use client';

import { ScrollReveal } from './ScrollReveal';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionTitle({ subtitle, title, centered = true, light = false }: SectionTitleProps) {
  return (
    <ScrollReveal>
      <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
        {subtitle && (
          <span className={`uppercase tracking-[0.2em] text-sm ${light ? 'text-[var(--gold-light)]' : 'text-[var(--gold)]'}`}>
            {subtitle}
          </span>
        )}
        <h2 className={`text-4xl md:text-5xl font-cormorant mt-4 ${light ? 'text-white' : 'text-[var(--dark-bg)]'}`} style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
          {title}
        </h2>
        <div className={`w-24 h-[1px] mt-6 ${centered ? 'mx-auto' : ''} ${light ? 'bg-[var(--gold-light)]/50' : 'bg-[var(--gold)]'}`} />
      </div>
    </ScrollReveal>
  );
}

