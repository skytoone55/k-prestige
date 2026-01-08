'use client';

import { useState } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/Card';

const formSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom est requis.' }),
  prenom: z.string().min(2, { message: 'Le prénom est requis.' }),
  telephone: z.string().min(10, { message: 'Le numéro de téléphone est requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }),
  nb_adultes: z.number().min(1).max(10),
  nb_bebes: z.number().min(0).max(5),
  nb_enfants_2_3ans: z.number().min(0).max(5),
  nb_enfants_4_6ans: z.number().min(0).max(5),
  nb_enfants_7_11ans: z.number().min(0).max(5),
  whatsapp: z.boolean().default(false),
});

type PessahDevisFormValues = z.infer<typeof formSchema>;

// Tarifs selon le brief
const TARIFS = {
  adulte: 2190,
  bebe: 0,
  enfant_2_3: 390,
  enfant_4_6: 990,
  enfant_7_11: 1390,
};

export function PessahDevisForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      nb_adultes: 2,
      nb_bebes: 0,
      nb_enfants_2_3ans: 0,
      nb_enfants_4_6ans: 0,
      nb_enfants_7_11ans: 0,
      whatsapp: false,
    },
  });

  // Calcul du prix estimé en temps réel
  const calculatePrice = (values: Partial<PessahDevisFormValues>) => {
    const total =
      (values.nb_adultes || 0) * TARIFS.adulte +
      (values.nb_bebes || 0) * TARIFS.bebe +
      (values.nb_enfants_2_3ans || 0) * TARIFS.enfant_2_3 +
      (values.nb_enfants_4_6ans || 0) * TARIFS.enfant_4_6 +
      (values.nb_enfants_7_11ans || 0) * TARIFS.enfant_7_11;
    setEstimatedPrice(total);
  };

  // Écouter les changements pour recalculer
  const watchedValues = form.watch();
  
  // Recalculer le prix quand les valeurs changent
  React.useEffect(() => {
    calculatePrice(watchedValues);
  }, [watchedValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
          const { error } = await supabase.from('clients').insert([
        {
          nom: values.nom,
          prenom: values.prenom,
          telephone: values.telephone,
          email: values.email,
          nb_adultes: values.nb_adultes,
          nb_bebes: values.nb_bebes,
          nb_enfants_2_3ans: values.nb_enfants_2_3ans,
          nb_enfants_4_6ans: values.nb_enfants_4_6ans,
          nb_enfants_7_11ans: values.nb_enfants_7_11ans,
          statut: 'NOUVEAU',
          montant_du: estimatedPrice,
          info: values.whatsapp ? 'Souhaite être recontacté par WhatsApp' : '',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      form.reset();
      
      // Redirection WhatsApp si demandé
      if (values.whatsapp) {
        const message = encodeURIComponent(
          `Bonjour, j'ai fait une demande de devis pour Pessah 2026. Composition: ${values.nb_adultes} adulte(s), ${values.nb_bebes} bébé(s), ${values.nb_enfants_2_3ans + values.nb_enfants_4_6ans + values.nb_enfants_7_11ans} enfant(s).`
        );
        window.open(`https://wa.me/33699951963?text=${message}`, '_blank');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl mb-4 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Demande envoyée avec succès !
        </h3>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Nous vous répondrons sous 24h avec votre devis personnalisé.
        </p>
        <Button onClick={() => setSuccess(false)} className="btn-gold-outline">
          Faire une autre demande
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <h3 
        className="text-3xl mb-6 text-[var(--gold)]"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Demande de devis
      </h3>

      {/* Estimation prix */}
      {estimatedPrice > 0 && (
        <div className="mb-6 p-4 bg-[var(--gold-pale)] rounded-lg border-2 border-[var(--gold)]">
          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Estimation pour 10 nuits :
          </p>
          <p className="text-3xl font-bold text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {estimatedPrice.toLocaleString('fr-FR')} €
          </p>
          <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            * Prix indicatif. Devis personnalisé sous 24h.
          </p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Composition famille */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Composition de votre famille
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Adultes
              </label>
              <select
                {...form.register('nb_adultes', { valueAsNumber: true })}
                onChange={(e) => {
                  form.setValue('nb_adultes', parseInt(e.target.value));
                  calculatePrice({ ...form.getValues(), nb_adultes: parseInt(e.target.value) });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Bébés (0-24 mois)
              </label>
              <select
                {...form.register('nb_bebes', { valueAsNumber: true })}
                onChange={(e) => {
                  form.setValue('nb_bebes', parseInt(e.target.value));
                  calculatePrice({ ...form.getValues(), nb_bebes: parseInt(e.target.value) });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Enfants 2-3 ans
              </label>
              <select
                {...form.register('nb_enfants_2_3ans', { valueAsNumber: true })}
                onChange={(e) => {
                  form.setValue('nb_enfants_2_3ans', parseInt(e.target.value));
                  calculatePrice({ ...form.getValues(), nb_enfants_2_3ans: parseInt(e.target.value) });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Enfants 4-6 ans
              </label>
              <select
                {...form.register('nb_enfants_4_6ans', { valueAsNumber: true })}
                onChange={(e) => {
                  form.setValue('nb_enfants_4_6ans', parseInt(e.target.value));
                  calculatePrice({ ...form.getValues(), nb_enfants_4_6ans: parseInt(e.target.value) });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Enfants 7-11 ans
              </label>
              <select
                {...form.register('nb_enfants_7_11ans', { valueAsNumber: true })}
                onChange={(e) => {
                  form.setValue('nb_enfants_7_11ans', parseInt(e.target.value));
                  calculatePrice({ ...form.getValues(), nb_enfants_7_11ans: parseInt(e.target.value) });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Vos coordonnées
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nom *"
                {...form.register('nom')}
              />
              {form.formState.errors.nom && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.nom.message}</p>
              )}
            </div>
            <div>
              <Input
                label="Prénom *"
                {...form.register('prenom')}
              />
              {form.formState.errors.prenom && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.prenom.message}</p>
              )}
            </div>
            <div>
              <Input
                label="Téléphone *"
                type="tel"
                {...form.register('telephone')}
              />
              {form.formState.errors.telephone && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.telephone.message}</p>
              )}
            </div>
            <div>
              <Input
                label="Email *"
                type="email"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Checkbox WhatsApp */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="whatsapp"
            {...form.register('whatsapp')}
            className="w-4 h-4 text-[var(--gold)] border-gray-300 rounded focus:ring-[var(--gold)]"
          />
          <label htmlFor="whatsapp" className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Je souhaite être recontacté par WhatsApp
          </label>
        </div>

        {/* Messages marketing */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <strong>✓ Réponse sous 24h</strong> • <strong>✓ Devis gratuit sans engagement</strong>
          </p>
        </div>

        <Button type="submit" className="btn-gold-primary w-full" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Recevoir mon devis'}
        </Button>
      </form>
    </Card>
  );
}

