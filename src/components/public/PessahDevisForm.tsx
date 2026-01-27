'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { useLanguage, useTranslation } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';

export function PessahDevisForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { dir, lang } = useLanguage();
  const { t } = useTranslation();

  // Dynamic validation messages
  const formSchema = z.object({
    nom: z.string().min(2, { message: t('validation.nameRequired') }),
    prenom: z.string().min(2, { message: t('validation.firstNameRequired') }),
    telephone: z.string().min(10, { message: t('validation.phoneRequired') }),
    email: z.string().email({ message: t('validation.emailInvalid') }),
    nb_adultes: z.number().min(1).max(10),
    nb_bebes: z.number().min(0).max(5),
    nb_enfants_2_3ans: z.number().min(0).max(5),
    nb_enfants_4_6ans: z.number().min(0).max(5),
    nb_enfants_7_11ans: z.number().min(0).max(5),
    message: z.string().optional(),
    whatsapp: z.boolean().default(false),
  });

  type PessahDevisFormValues = z.infer<typeof formSchema>;

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
      // Envoyer à l'API qui gère Supabase + email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'devis',
          data: values,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Erreur:', error);
      alert(t('contactForm.errorMessage'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={cn("text-center py-8", dir === 'rtl' && 'text-right')} dir={dir}>
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl mb-3 text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
          {t('devisForm.successTitle')}
        </h3>
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {t('devisForm.successDesc')}
        </p>
        <Button onClick={() => setSuccess(false)} className="btn-gold-outline">
          {t('devisForm.makeAnotherRequest')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir={dir}>
      {/* Composition famille */}
      <div>
        <p className={cn("text-sm font-medium text-gray-700 mb-3", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {t('devisForm.familyComposition')}
        </p>
        <div className={cn("grid grid-cols-5 gap-3", dir === 'rtl' && 'direction-rtl')}>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('devisForm.adults')}
            </label>
            <select
              {...form.register('nb_adultes', { valueAsNumber: true })}
              className={cn("w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('devisForm.babies')}
            </label>
            <select
              {...form.register('nb_bebes', { valueAsNumber: true })}
              className={cn("w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('devisForm.children2to3')}
            </label>
            <select
              {...form.register('nb_enfants_2_3ans', { valueAsNumber: true })}
              className={cn("w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('devisForm.children4to6')}
            </label>
            <select
              {...form.register('nb_enfants_4_6ans', { valueAsNumber: true })}
              className={cn("w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('devisForm.children7to11')}
            </label>
            <select
              {...form.register('nb_enfants_7_11ans', { valueAsNumber: true })}
              className={cn("w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
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
        <p className={cn("text-sm font-medium text-gray-700 mb-3", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {t('devisForm.yourDetails')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('contactForm.lastName')} *
            </label>
            <input
              {...form.register('nom')}
              className={cn("w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            />
            {form.formState.errors.nom && (
              <p className={cn("text-xs text-red-500 mt-1", dir === 'rtl' && 'text-right')}>{form.formState.errors.nom.message}</p>
            )}
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('contactForm.firstName')} *
            </label>
            <input
              {...form.register('prenom')}
              className={cn("w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            />
            {form.formState.errors.prenom && (
              <p className={cn("text-xs text-red-500 mt-1", dir === 'rtl' && 'text-right')}>{form.formState.errors.prenom.message}</p>
            )}
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('contactForm.phone')} *
            </label>
            <PhoneInput
              value={form.watch('telephone')}
              onChange={(phone) => form.setValue('telephone', phone, { shouldValidate: true })}
              required
              dir={dir}
            />
            {form.formState.errors.telephone && (
              <p className={cn("text-xs text-red-500 mt-1", dir === 'rtl' && 'text-right')}>{form.formState.errors.telephone.message}</p>
            )}
          </div>
          <div>
            <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {t('contactForm.email')} *
            </label>
            <input
              type="email"
              {...form.register('email')}
              className={cn("w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent", dir === 'rtl' && 'text-right')}
            />
            {form.formState.errors.email && (
              <p className={cn("text-xs text-red-500 mt-1", dir === 'rtl' && 'text-right')}>{form.formState.errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={cn("block text-xs text-gray-500 mb-1", dir === 'rtl' && 'text-right')} style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {t('devisForm.messageOptional')}
        </label>
        <textarea
          {...form.register('message')}
          rows={2}
          placeholder={t('devisForm.messagePlaceholder')}
          className={cn("w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none", dir === 'rtl' && 'text-right')}
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        />
      </div>

      {/* Checkbox WhatsApp + Info */}
      <div className={cn("flex items-center justify-between flex-wrap gap-3", dir === 'rtl' && 'flex-row-reverse')}>
        <label className={cn("flex items-center gap-2 cursor-pointer", dir === 'rtl' && 'flex-row-reverse')}>
          <input
            type="checkbox"
            {...form.register('whatsapp')}
            className="w-4 h-4 text-[var(--gold)] border-gray-300 rounded focus:ring-[var(--gold)]"
          />
          <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {t('devisForm.whatsappContact')}
          </span>
        </label>
        <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {t('devisForm.responseTime')}
        </p>
      </div>

      <div className="flex justify-center">
        <Button type="submit" className="btn-gold-primary px-12" disabled={loading}>
          {loading ? t('devisForm.sendingInProgress') : t('devisForm.receiveQuote')}
        </Button>
      </div>
    </form>
  );
}
