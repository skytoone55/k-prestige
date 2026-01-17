'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage, useTranslation } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';

export function ContactForm() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { dir } = useLanguage();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          data: formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      setFormData({ prenom: '', nom: '', email: '', telephone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur:', error);
      alert(t('contactForm.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={dir}>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label={`${t('contactForm.firstName')} *`}
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          required
          className={cn(dir === 'rtl' && 'text-right')}
        />
        <Input
          label={`${t('contactForm.lastName')} *`}
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
          className={cn(dir === 'rtl' && 'text-right')}
        />
      </div>
      <Input
        label={`${t('contactForm.email')} *`}
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className={cn(dir === 'rtl' && 'text-right')}
      />
      <Input
        label={`${t('contactForm.phone')} *`}
        type="tel"
        value={formData.telephone}
        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
        required
        className={cn(dir === 'rtl' && 'text-right')}
      />
      <div>
        <label className={cn("text-sm font-medium leading-none mb-2 block", dir === 'rtl' && 'text-right')}>
          {t('contactForm.message')}
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            dir === 'rtl' && 'text-right'
          )}
        />
      </div>
      {success && (
        <div className={cn(
          "p-4 bg-[var(--status-valide)]/10 text-[var(--status-valide)] rounded-lg border border-[var(--status-valide)]/20",
          dir === 'rtl' && 'text-right'
        )}>
          {t('contactForm.successMessage')}
        </div>
      )}
      <Button type="submit" variant="gold" className="w-full" disabled={loading}>
        {loading ? t('contactForm.sending') : t('contactForm.send')}
      </Button>
    </form>
  );
}
