'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

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
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('demandes_devis')
        .insert({
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          message: formData.message,
          nb_adultes: 2,
          nb_bebes: 0,
          nb_enfants_2_3ans: 0,
          nb_enfants_4_6ans: 0,
          nb_enfants_7_11ans: 0,
        });

      if (error) throw error;

      setSuccess(true);
      setFormData({ prenom: '', nom: '', email: '', telephone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Prénom *"
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          required
        />
        <Input
          label="Nom *"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />
      </div>
      <Input
        label="Email *"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Téléphone *"
        type="tel"
        value={formData.telephone}
        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
        required
      />
      <div>
        <label className="text-sm font-medium leading-none mb-2 block">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      {success && (
        <div className="p-4 bg-[var(--status-valide)]/10 text-[var(--status-valide)] rounded-lg border border-[var(--status-valide)]/20">
          Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
        </div>
      )}
      <Button type="submit" variant="gold" className="w-full" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer le message'}
      </Button>
    </form>
  );
}

