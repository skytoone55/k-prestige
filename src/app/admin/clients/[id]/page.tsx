'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import type { Client, PaymentMethod } from '@/types';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setClient(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClient();
    }
  }, [params.id, supabase]);

  const handleSave = async () => {
    if (!client) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', client.id);

      if (error) throw error;
      alert('Client mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const calculateReste = () => {
    if (!client) return 0;
    const totalPaid = 
      Number(client.acompte1_montant || 0) +
      Number(client.acompte2_montant || 0) +
      Number(client.acompte3_montant || 0) +
      Number(client.acompte4_montant || 0);
    return Number(client.montant_du || 0) - totalPaid;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Client non trouvé</p>
      </div>
    );
  }

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'VIREMENT', label: 'Virement' },
    { value: 'CB', label: 'Carte bancaire' },
    { value: 'CERFA', label: 'Cerfa' },
    { value: 'ESPÈCE', label: 'Espèce' },
  ];

  const getStatusVariant = (statut: string) => {
    const map: Record<string, 'nouveau' | 'devis' | 'attente' | 'valide' | 'hs'> = {
      'NOUVEAU': 'nouveau',
      'DEVIS ENVOYÉ': 'devis',
      'ATTENTE ACOMPTE': 'attente',
      'VALIDÉ': 'valide',
      'HS': 'hs',
    };
    return map[statut] || 'nouveau';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{client.nom}</h1>
          <p className="text-muted-foreground mt-1">Fiche client détaillée</p>
        </div>
        <Badge variant={getStatusVariant(client.statut)}>{client.statut}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations Client */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Client</CardTitle>
            <CardDescription>Données de contact et informations générales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nom"
              value={client.nom}
              onChange={(e) => setClient({ ...client, nom: e.target.value })}
            />
            <Input
              label="Liaison"
              value={client.liaison || ''}
              onChange={(e) => setClient({ ...client, liaison: e.target.value })}
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
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">Informations</label>
              <textarea
                value={client.info || ''}
                onChange={(e) => setClient({ ...client, info: e.target.value })}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statut */}
        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
            <CardDescription>Statut actuel du client</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              value={client.statut}
              onChange={(e) => setClient({ ...client, statut: e.target.value as Client['statut'] })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="NOUVEAU">Nouveau</option>
              <option value="DEVIS ENVOYÉ">Devis envoyé</option>
              <option value="ATTENTE ACOMPTE">Attente acompte</option>
              <option value="VALIDÉ">Validé</option>
              <option value="HS">Hors sujet</option>
            </select>
          </CardContent>
        </Card>

        {/* Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Composition du groupe</CardTitle>
            <CardDescription>Nombre de personnes par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Adultes"
                type="number"
                value={client.nb_adultes}
                onChange={(e) => setClient({ ...client, nb_adultes: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Bébés (0-24 mois)"
                type="number"
                value={client.nb_bebes}
                onChange={(e) => setClient({ ...client, nb_bebes: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Enfants (2-3 ans)"
                type="number"
                value={client.nb_enfants_3ans}
                onChange={(e) => setClient({ ...client, nb_enfants_3ans: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Enfants (4-6 ans)"
                type="number"
                value={client.nb_enfants_4_6ans}
                onChange={(e) => setClient({ ...client, nb_enfants_4_6ans: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Enfants (7-11 ans)"
                type="number"
                value={client.nb_enfants_7_11ans}
                onChange={(e) => setClient({ ...client, nb_enfants_7_11ans: parseInt(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financier */}
        <Card>
          <CardHeader>
            <CardTitle>Financier</CardTitle>
            <CardDescription>Montants et paiements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="N° Devis"
              value={client.numero_devis || ''}
              onChange={(e) => setClient({ ...client, numero_devis: e.target.value })}
            />
            <Input
              label="Montant total dû"
              type="number"
              value={client.montant_du}
              onChange={(e) => setClient({ ...client, montant_du: parseFloat(e.target.value) || 0 })}
            />
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Reste à payer</p>
              <p className="text-2xl font-bold text-[var(--gold)]">{calculateReste().toLocaleString('fr-FR')} €</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acomptes */}
      <Card>
        <CardHeader>
          <CardTitle>Acomptes</CardTitle>
          <CardDescription>Suivi des paiements reçus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((num) => {
              const montantKey = `acompte${num}_montant` as keyof Client;
              const modeKey = `acompte${num}_mode` as keyof Client;
              const dateKey = `acompte${num}_date` as keyof Client;
              return (
                <div key={num} className="p-4 border rounded-lg space-y-3">
                  <h3 className="font-semibold">Acompte {num}</h3>
                  <Input
                    label="Montant"
                    type="number"
                    value={client[montantKey] || ''}
                    onChange={(e) => setClient({ ...client, [montantKey]: parseFloat(e.target.value) || null })}
                  />
                  <div>
                    <label className="text-sm font-medium leading-none mb-2 block">Mode de paiement</label>
                    <select
                      value={client[modeKey] || ''}
                      onChange={(e) => setClient({ ...client, [modeKey]: e.target.value as PaymentMethod || null })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Sélectionner...</option>
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Date"
                    type="date"
                    value={client[dateKey] || ''}
                    onChange={(e) => setClient({ ...client, [dateKey]: e.target.value || null })}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
}
