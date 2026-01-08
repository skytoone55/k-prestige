import Image from 'next/image';
import { Card } from '@/components/ui/Card';

const features = [
  { icon: '🏖️', title: 'Pied dans l\'eau', description: 'Accès direct plage', image: '/images/piscines/POOLS & SEA.jpg' },
  { icon: '🏊', title: '3 Piscines', description: 'Dont une chauffée', image: '/images/piscines/POOL.jpg' },
  { icon: '💆', title: 'SPA Luxueux', description: 'Centre bien-être, jacuzzi', image: '/images/spa/SPA.jpg' },
  { icon: '🍽️', title: 'Gastronomie', description: 'Cuisine française et orientale', image: '/images/restaurant/ORIGEN.jpg' },
  { icon: '✡️', title: 'Glatt Kasher', description: 'Supervision Rav Mordehai Cohen', image: null, placeholder: true },
  { icon: '👶', title: 'Clubs Enfants', description: 'Baby, Mini, Kids Club', image: null, placeholder: true },
  { icon: '🎵', title: 'Animation Live', description: 'Orchestre et DJ', image: '/images/events/EVENTS.jpg' },
  { icon: '💪', title: 'Sport & Fitness', description: 'Salle équipée, coach', image: null, placeholder: true },
];

export function Features() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-5xl md:text-6xl mb-4 text-foreground"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
          >
            L&apos;expérience K Prestige
          </h2>
          <p 
            className="text-xl text-muted-foreground"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Un séjour d&apos;exception
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-0 overflow-hidden text-center hover:shadow-lg transition-shadow bg-card border">
              {feature.image ? (
                <div className="relative h-48 mb-4">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : feature.placeholder ? (
                <div className="relative h-48 mb-4 bg-gradient-to-br from-[var(--gold-pale)]/20 to-[var(--blue-mediterranean)]/20 flex items-center justify-center">
                  <div className="text-6xl opacity-50">{feature.icon}</div>
                  <div className="absolute inset-0 border-2 border-dashed border-[var(--gold)]/30" />
                </div>
              ) : (
                <div className="text-5xl mb-4 pt-6">{feature.icon}</div>
              )}
              <div className="px-4 pb-6">
                <h3 
                  className="text-lg font-semibold mb-2 text-[var(--gold)]"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
