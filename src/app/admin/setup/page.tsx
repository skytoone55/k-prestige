'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

type TestResult = 'pending' | 'loading' | 'success' | 'error';

interface TestStatus {
  pageContentRead: TestResult;
  pageContentWrite: TestResult;
  galerieContentRead: TestResult;
  galerieContentWrite: TestResult;
  storageGalerie: TestResult;
  storagePages: TestResult;
  error?: string;
}

export default function AdminSetupPage() {
  const [status, setStatus] = useState<TestStatus>({
    pageContentRead: 'pending',
    pageContentWrite: 'pending',
    galerieContentRead: 'pending',
    galerieContentWrite: 'pending',
    storageGalerie: 'pending',
    storagePages: 'pending',
  });
  const [running, setRunning] = useState(false);
  const [sqlResult, setSqlResult] = useState<string>('');

  const runTests = async () => {
    setRunning(true);
    setSqlResult('');

    const newStatus: TestStatus = {
      pageContentRead: 'loading',
      pageContentWrite: 'pending',
      galerieContentRead: 'pending',
      galerieContentWrite: 'pending',
      storageGalerie: 'pending',
      storagePages: 'pending',
    };
    setStatus(newStatus);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // Test 1: page_content READ
      const { data: readData, error: readError } = await supabase
        .from('page_content')
        .select('page_id')
        .limit(1);

      newStatus.pageContentRead = readError ? 'error' : 'success';
      if (readError) {
        newStatus.error = `page_content READ: ${readError.message}`;
        setStatus({ ...newStatus });
        setRunning(false);
        return;
      }
      setStatus({ ...newStatus });

      // Test 2: page_content WRITE (upsert)
      newStatus.pageContentWrite = 'loading';
      setStatus({ ...newStatus });

      const testPageId = '_test_setup_' + Date.now();
      const { error: writeError } = await supabase
        .from('page_content')
        .upsert({
          page_id: testPageId,
          content: { test: true },
          updated_at: new Date().toISOString()
        });

      if (writeError) {
        newStatus.pageContentWrite = 'error';
        newStatus.error = `page_content WRITE: ${writeError.message}\n\nSolution: Exécutez le script SQL ci-dessous dans l'éditeur SQL de Supabase`;
        setSqlResult(getFixSql());
        setStatus({ ...newStatus });
        setRunning(false);
        return;
      }

      // Clean up test row
      await supabase.from('page_content').delete().eq('page_id', testPageId);
      newStatus.pageContentWrite = 'success';
      setStatus({ ...newStatus });

      // Test 3: galerie_content READ
      newStatus.galerieContentRead = 'loading';
      setStatus({ ...newStatus });

      const { data: galerieData, error: galerieReadError } = await supabase
        .from('galerie_content')
        .select('id')
        .limit(1);

      if (galerieReadError) {
        newStatus.galerieContentRead = 'error';
        newStatus.error = `galerie_content READ: ${galerieReadError.message}\n\nSolution: Créez la table galerie_content avec le script SQL ci-dessous`;
        setSqlResult(getFixSql());
        setStatus({ ...newStatus });
        setRunning(false);
        return;
      }
      newStatus.galerieContentRead = 'success';
      setStatus({ ...newStatus });

      // Test 4: galerie_content WRITE
      newStatus.galerieContentWrite = 'loading';
      setStatus({ ...newStatus });

      const { error: galerieWriteError } = await supabase
        .from('galerie_content')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (galerieWriteError) {
        newStatus.galerieContentWrite = 'error';
        newStatus.error = `galerie_content WRITE: ${galerieWriteError.message}\n\nSolution: Exécutez le script SQL ci-dessous`;
        setSqlResult(getFixSql());
        setStatus({ ...newStatus });
        setRunning(false);
        return;
      }
      newStatus.galerieContentWrite = 'success';
      setStatus({ ...newStatus });

      // Test 5: Storage bucket 'galerie'
      newStatus.storageGalerie = 'loading';
      setStatus({ ...newStatus });

      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

      const galerieExists = buckets?.some(b => b.name === 'galerie');
      const pagesExists = buckets?.some(b => b.name === 'pages');

      newStatus.storageGalerie = galerieExists ? 'success' : 'error';
      newStatus.storagePages = pagesExists ? 'success' : 'error';

      if (!galerieExists || !pagesExists) {
        const missing = [];
        if (!galerieExists) missing.push('galerie');
        if (!pagesExists) missing.push('pages');
        newStatus.error = `Buckets manquants: ${missing.join(', ')}\n\nSolution: Créez ces buckets dans Supabase Dashboard > Storage > New bucket (Public = true)`;
      }

      setStatus({ ...newStatus });
      setRunning(false);

    } catch (error: any) {
      setStatus({
        ...newStatus,
        error: `Erreur: ${error.message}`
      });
      setRunning(false);
    }
  };

  const getFixSql = () => `-- Script de correction des permissions RLS
-- Copiez-collez ce script dans l'éditeur SQL de Supabase (SQL Editor)

-- 1. Corriger les politiques pour page_content
DROP POLICY IF EXISTS "Admin write access" ON page_content;
DROP POLICY IF EXISTS "Public write access" ON page_content;
DROP POLICY IF EXISTS "Public update access" ON page_content;
DROP POLICY IF EXISTS "Public delete access" ON page_content;

CREATE POLICY "Public write access" ON page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON page_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON page_content FOR DELETE USING (true);

-- 2. Créer la table galerie_content si elle n'existe pas
CREATE TABLE IF NOT EXISTS galerie_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categories JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE galerie_content ENABLE ROW LEVEL SECURITY;

-- Créer les politiques
DROP POLICY IF EXISTS "Public read access" ON galerie_content;
DROP POLICY IF EXISTS "Public write access" ON galerie_content;
DROP POLICY IF EXISTS "Public update access" ON galerie_content;
DROP POLICY IF EXISTS "Public delete access" ON galerie_content;

CREATE POLICY "Public read access" ON galerie_content FOR SELECT USING (true);
CREATE POLICY "Public write access" ON galerie_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON galerie_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON galerie_content FOR DELETE USING (true);

-- 3. Insérer la ligne par défaut
INSERT INTO galerie_content (id, categories, images)
VALUES ('00000000-0000-0000-0000-000000000001', '[]', '[]')
ON CONFLICT (id) DO NOTHING;

-- 4. Vérification
SELECT 'OK - Script exécuté avec succès!' as status;`;

  const StatusIcon = ({ status }: { status: TestResult }) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full bg-gray-200" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const allSuccess =
    status.pageContentRead === 'success' &&
    status.pageContentWrite === 'success' &&
    status.galerieContentRead === 'success' &&
    status.galerieContentWrite === 'success' &&
    status.storageGalerie === 'success' &&
    status.storagePages === 'success';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Configuration Supabase</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test de connexion Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Ce test vérifie que votre base de données Supabase est correctement configurée
              pour permettre les lectures et écritures depuis l'admin.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <StatusIcon status={status.pageContentRead} />
                <span className="font-medium">page_content - Lecture</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <StatusIcon status={status.pageContentWrite} />
                <span className="font-medium">page_content - Écriture</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <StatusIcon status={status.galerieContentRead} />
                <span className="font-medium">galerie_content - Lecture</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <StatusIcon status={status.galerieContentWrite} />
                <span className="font-medium">galerie_content - Écriture</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <StatusIcon status={status.storageGalerie} />
                <span className="font-medium">Storage - Bucket "galerie"</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <StatusIcon status={status.storagePages} />
                <span className="font-medium">Storage - Bucket "pages"</span>
              </div>
            </div>

            <Button onClick={runTests} disabled={running} className="w-full">
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                'Lancer les tests'
              )}
            </Button>

            {allSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Tout est configuré correctement !</p>
                  <p className="text-sm text-green-700">
                    Votre base de données Supabase est prête. Les modifications dans l'admin seront synchronisées avec le frontend.
                  </p>
                </div>
              </div>
            )}

            {status.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Erreur détectée</p>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap mt-2">{status.error}</pre>
                  </div>
                </div>
              </div>
            )}

            {sqlResult && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Script SQL de correction :</h3>
                <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  {sqlResult}
                </pre>
                <p className="text-sm text-gray-600 mt-2">
                  Copiez ce script et exécutez-le dans l'éditeur SQL de votre projet Supabase :
                  <br />
                  <a
                    href="https://supabase.com/dashboard/project/_/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ouvrir l'éditeur SQL Supabase
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions manuelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Créer les buckets Storage</h3>
              <p className="text-sm text-gray-600">
                Allez dans Supabase Dashboard &gt; Storage &gt; New bucket :
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                <li>Créer un bucket "galerie" avec Public = true</li>
                <li>Créer un bucket "pages" avec Public = true</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Configurer les politiques RLS</h3>
              <p className="text-sm text-gray-600">
                Exécutez le script SQL dans l'éditeur SQL de Supabase pour permettre
                les lectures et écritures publiques sur les tables de contenu.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Vérifier les variables d'environnement</h3>
              <p className="text-sm text-gray-600">
                Assurez-vous que les variables suivantes sont définies :
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
