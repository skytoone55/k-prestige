'use client';

import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { HeroHome } from '@/components/sections/HeroHome';
import { UniversCards } from '@/components/sections/UniversCards';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { PessahDevisForm } from '@/components/public/PessahDevisForm';

export default function Home() {
  return (
    <>
      <PublicNavigation />
      <main>
        {/* 1. HERO SLIDER - Pessah 2026 */}
        <HeroHome />

        {/* 2. SECTION "NOS ACTIVITÉS" */}
        <section className="py-12 px-6 bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto">
            <SectionTitle subtitle="Découvrez" title="Nos Univers" />
            <UniversCards />
          </div>
        </section>

        {/* 3. SECTION STATS ANIMÉES */}
        <StatsSection />

        {/* 5. SECTION TÉMOIGNAGES */}
        <TestimonialsSection />

        {/* 6. SECTION DEVIS PESSAH */}
        <section id="devis-form" className="py-12 px-6 bg-[var(--cream)]">
          <div className="max-w-xl mx-auto">
            <SectionTitle subtitle="Pessah 2026" title="Demander un devis" />
            <PessahDevisForm />
          </div>
        </section>

        {/* 7. SECTION CTA PREMIUM */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
