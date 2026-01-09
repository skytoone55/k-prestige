import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { HeroHome } from '@/components/sections/HeroHome';
import { UniversCards } from '@/components/sections/UniversCards';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { SectionTitle } from '@/components/ui/SectionTitle';

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

        {/* 3. BANDEAU DE CONFIANCE */}
        <section className="py-6 bg-[var(--dark-bg)] border-y border-[var(--gold)]/20">
          <div className="max-w-7xl mx-auto px-6 flex justify-center items-center gap-12 text-white/60 text-sm flex-wrap" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <span>✓ 10+ ans d&apos;expérience</span>
            <span className="w-px h-4 bg-[var(--gold)]/30" />
            <span>✓ Kashrout irréprochable</span>
            <span className="w-px h-4 bg-[var(--gold)]/30" />
            <span>✓ 500+ familles satisfaites</span>
          </div>
        </section>

        {/* 4. SECTION STATS ANIMÉES */}
        <StatsSection />

        {/* 5. SECTION TÉMOIGNAGES */}
        <TestimonialsSection />

        {/* 6. SECTION CTA PREMIUM */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
