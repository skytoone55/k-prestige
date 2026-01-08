'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Plus, Search, Mail, Phone, Eye } from 'lucide-react';

interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  statut: string;
  montant_du: number;
  chambre_id: string | null;
  nb_adultes: number;
  nb_bebes: number;
  nb_enfants_3ans: number;
  nb_enfants_4_6ans: number;
  nb_enfants_7_11ans: number;
  acompte1_montant: number | null;
  acompte2_montant: number | null;
  acompte3_montant: number | null;
  acompte4_montant: number | null;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const supabase = createClient();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        let query = supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (statusFilter !== 'ALL') {
          query = query.eq('statut', statusFilter);
        }

        if (search) {
          query = query.or(`nom.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [supabase, statusFilter, search]);

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

  const formatComposition = (client: Client) => {
    const total = client.nb_adultes + client.nb_bebes + client.nb_enfants_3ans + client.nb_enfants_4_6ans + client.nb_enfants_7_11ans;
    return total;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Gestion de tous vos clients
          </p>
        </div>
        <Link href="/admin/clients/nouveau">
          <Button>
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher (nom, email, téléphone)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="NOUVEAU">Nouveau</option>
              <option value="DEVIS ENVOYÉ">Devis envoyé</option>
              <option value="ATTENTE ACOMPTE">Attente acompte</option>
              <option value="VALIDÉ">Validé</option>
              <option value="HS">Hors sujet</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nb personnes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Montant devis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      Aucun client trouvé
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{client.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {client.telephone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {client.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatComposition(client)} personne{formatComposition(client) > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {Number(client.montant_du || 0).toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(client.statut)}>
                          {client.statut}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link href={`/admin/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
