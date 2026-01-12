'use client';

import { useState, useEffect } from 'react';

// Memes constantes que usePageContent
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

export default function TestSupabase() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        const url = `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.accueil&select=content`;
        console.log('Fetching:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const text = await response.text();
          setError(`HTTP ${response.status}: ${text}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Data:', data);
        setResult(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    test();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Test Connexion Supabase</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>URL:</strong> {SUPABASE_URL}</p>
        <p><strong>Key:</strong> {SUPABASE_ANON_KEY.substring(0, 30)}...</p>
      </div>

      {loading && <p className="text-blue-600">Chargement...</p>}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded mb-4">
          <p className="text-red-700 font-bold">Erreur:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-green-700 font-bold mb-2">Succes! Donnees recues:</p>
          <pre className="bg-white p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>

          {result[0]?.content?.hero && (
            <div className="mt-4 p-4 bg-yellow-100 rounded">
              <p className="font-bold">Hero subtitle dans Supabase:</p>
              <p className="text-xl">{result[0].content.hero.subtitle}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
