'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    nouveau: 0,
    devis_envoye: 0,
    attente_acompte: 0,
    valide: 0,
    total_amount: 0,
    total_paid: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: clients } = await supabase.from('clients').select('statut, montant_du, acompte1_montant, acompte2_montant, acompte3_montant, acompte4_montant');

        if (clients) {
          const counts = {
            NOUVEAU: 0,
            'DEVIS ENVOYÉ': 0,
            'ATTENTE ACOMPTE': 0,
            VALIDÉ: 0,
          };

          let totalAmount = 0;
          let totalPaid = 0;

          clients.forEach((c) => {
            const statut = c.statut as keyof typeof counts;
            if (statut in counts) counts[statut]++;
            totalAmount += Number(c.montant_du || 0);
            totalPaid += 
              Number(c.acompte1_montant || 0) +
              Number(c.acompte2_montant || 0) +
              Number(c.acompte3_montant || 0) +
              Number(c.acompte4_montant || 0);
          });

          setStats({
            nouveau: counts.NOUVEAU,
            devis_envoye: counts['DEVIS ENVOYÉ'],
            attente_acompte: counts['ATTENTE ACOMPTE'],
            valide: counts.VALIDÉ,
            total_amount: totalAmount,
            total_paid: totalPaid,
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  const kpiCards = [
    {
      label: 'Nouvelles demandes',
      value: stats.nouveau,
      variant: 'nouveau' as const,
      icon: FileText,
    },
    {
      label: 'Devis envoyés',
      value: stats.devis_envoye,
      variant: 'devis' as const,
      icon: Clock,
    },
    {
      label: 'En attente acompte',
      value: stats.attente_acompte,
      variant: 'attente' as const,
      icon: Clock,
    },
    {
      label: 'Validées',
      value: stats.valide,
      variant: 'valide' as const,
      icon: CheckCircle,
    },
  ];

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
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${kpi.variant}/10`}>
                    <Icon className={`w-6 h-6 text-${kpi.variant}`} />
                  </div>
                  <Badge variant={kpi.variant}>{kpi.value}</Badge>
                </div>
                <CardTitle className="mt-4">{kpi.label}</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Finances */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Montant total dû</CardTitle>
            <CardDescription>Somme de tous les montants dus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.total_amount.toLocaleString('fr-FR')} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montant encaissé</CardTitle>
            <CardDescription>Total des acomptes reçus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--status-valide)]">
              {stats.total_paid.toLocaleString('fr-FR')} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reste à percevoir</CardTitle>
            <CardDescription>Montant restant à encaisser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--gold)]">
              {(stats.total_amount - stats.total_paid).toLocaleString('fr-FR')} €
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
