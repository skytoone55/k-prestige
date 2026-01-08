'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Save } from 'lucide-react';
import { useState } from 'react';
import type { Client, PaymentMethod } from '@/types';

export default function NewClientPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<Partial<Client>>({
    statut: 'NOUVEAU',
    nb_adultes: 2,
    nb_bebes: 0,
    nb_enfants_3ans: 0,
    nb_enfants_4_6ans: 0,
    nb_enfants_7_11ans: 0,
    montant_du: 0,
  });

  const handleSave = async () => {
    if (!client.nom) {
      alert('Le nom est requis');
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      if (error) throw error;
      router.push(`/admin/clients/${data.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 
        className="text-4xl mb-8 text-stone-900"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        Nouveau client
      </h1>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <Input
            label="Nom *"
            value={client.nom || ''}
            onChange={(e) => setClient({ ...client, nom: e.target.value })}
            required
          />
          <Input
            label="Téléphone"
            value={client.telephone || ''}
            onChange={(e) => setClient({ ...client, telephone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={client.email || ''}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Création...' : 'Créer le client'}
        </Button>
      </div>
    </div>
  );
}

