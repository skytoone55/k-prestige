'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

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
  message: z.string().optional(),
  whatsapp: z.boolean().default(false),
});

type PessahDevisFormValues = z.infer<typeof formSchema>;

export function PessahDevisForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      message: '',
      whatsapp: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Enregistrer dans Supabase
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
          montant_du: null,
          info: [values.message, values.whatsapp ? 'Souhaite être recontacté par WhatsApp' : ''].filter(Boolean).join(' | '),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Envoyer l'email de notification
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'devis',
          data: values,
        }),
      });

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
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl mb-3 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Demande envoyée avec succès !
        </h3>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Nous vous répondrons sous 24h avec votre devis personnalisé.
        </p>
        <Button onClick={() => setSuccess(false)} className="btn-gold-outline">
          Faire une autre demande
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Composition famille */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Composition de votre famille
        </p>
        <div className="grid grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Adultes
            </label>
            <select
              {...form.register('nb_adultes', { valueAsNumber: true })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Bébés
            </label>
            <select
              {...form.register('nb_bebes', { valueAsNumber: true })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              2-3 ans
            </label>
            <select
              {...form.register('nb_enfants_2_3ans', { valueAsNumber: true })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              4-6 ans
            </label>
            <select
              {...form.register('nb_enfants_4_6ans', { valueAsNumber: true })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              7-11 ans
            </label>
            <select
              {...form.register('nb_enfants_7_11ans', { valueAsNumber: true })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
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
        <p className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Vos coordonnées
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Nom *
            </label>
            <input
              {...form.register('nom')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            />
            {form.formState.errors.nom && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.nom.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Prénom *
            </label>
            <input
              {...form.register('prenom')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            />
            {form.formState.errors.prenom && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.prenom.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Téléphone *
            </label>
            <input
              type="tel"
              {...form.register('telephone')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            />
            {form.formState.errors.telephone && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.telephone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Email *
            </label>
            <input
              type="email"
              {...form.register('email')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs text-gray-500 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Message ou demande particulière (optionnel)
        </label>
        <textarea
          {...form.register('message')}
          rows={2}
          placeholder="Ex: chambre communicante, régime alimentaire..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        />
      </div>

      {/* Checkbox WhatsApp + Info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...form.register('whatsapp')}
            className="w-4 h-4 text-[var(--gold)] border-gray-300 rounded focus:ring-[var(--gold)]"
          />
          <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Être recontacté par WhatsApp
          </span>
        </label>
        <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          ✓ Réponse sous 24h • ✓ Devis gratuit
        </p>
      </div>

      <div className="flex justify-center">
        <Button type="submit" className="btn-gold-primary px-12" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Recevoir mon devis'}
        </Button>
      </div>
    </form>
  );
}

