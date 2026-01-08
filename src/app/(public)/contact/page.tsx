import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ContactForm } from '@/components/public/ContactForm';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-white pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 
            className="text-5xl md:text-6xl mb-4 text-[var(--gold)] text-center"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
          >
            Contactez-nous
          </h1>
          <p className="text-center text-gray-600 mb-12" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Notre équipe est à votre écoute pour répondre à toutes vos questions
          </p>

          {/* 3 Options de Contact */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Option 1: Être rappelé */}
            <Card className="border-2 border-[var(--gold)]/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4 text-center">📞</div>
                <CardTitle className="text-center text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Être rappelé
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Formulaire rapide pour être rappelé sous 2h
                </p>
                <Button className="btn-gold-outline w-full">
                  Formulaire rappel
                </Button>
              </CardContent>
            </Card>

            {/* Option 2: WhatsApp */}
            <Card className="border-2 border-[#25D366]/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4 text-center">💬</div>
                <CardTitle className="text-center text-[#25D366]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Contactez-nous directement sur WhatsApp
                </p>
                <a href="https://wa.me/33699951963" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white border-none">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ouvrir WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Option 3: Email */}
            <Card className="border-2 border-[var(--blue-mediterranean)]/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4 text-center">✉️</div>
                <CardTitle className="text-center text-[var(--blue-mediterranean)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Envoyez-nous un message complet
                </p>
                <a href="mailto:k-prestige@outlook.fr">
                  <Button className="btn-gold-outline w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer un email
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Coordonnées */}
            <Card className="border-2 border-[var(--gold)]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Nos coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    <Phone className="w-5 h-5 text-[var(--gold)]" />
                    Téléphone
                  </h3>
                  <div className="space-y-2">
                    <a href="tel:+33699951963" className="block text-[var(--blue-mediterranean)] hover:text-[var(--gold)] hover:underline transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      06 99 95 19 63
                    </a>
                    <a href="tel:+33651701978" className="block text-[var(--blue-mediterranean)] hover:text-[var(--gold)] hover:underline transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      06 51 70 19 78
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    <Mail className="w-5 h-5 text-[var(--gold)]" />
                    Email
                  </h3>
                  <a href="mailto:k-prestige@outlook.fr" className="text-[var(--blue-mediterranean)] hover:text-[var(--gold)] hover:underline transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    k-prestige@outlook.fr
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
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

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Instagram
                  </h3>
                  <a
                    href="https://www.instagram.com/k_prestige__events"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--blue-mediterranean)] hover:text-[var(--gold)] hover:underline transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    @k_prestige__events
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire */}
            <Card className="border-2 border-[var(--gold)]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
