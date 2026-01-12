'use client';

import { useState, useEffect } from 'react';
import { fullPageContent } from './page-content-full';

// Constantes Supabase (hardcodées pour éviter les problèmes d'env)
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

export function usePageContent(pageId: string) {
  // Initialiser avec les valeurs par défaut pour éviter le flash
  const [data, setData] = useState<any>(fullPageContent[pageId] || null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('default');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      console.log(`[usePageContent] Loading content for page: ${pageId}`);

      try {
        // Toujours charger depuis Supabase - PAS de localStorage
        const url = `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const result = await response.json();

          if (result && result.length > 0 && result[0]?.content) {
            console.log(`[usePageContent] ✅ Données chargées depuis Supabase pour ${pageId}`);
            setData(result[0].content);
            setSource('supabase');
            setError(null);
          } else {
            // Pas de données dans Supabase = utiliser les valeurs par défaut (déjà initialisées)
            console.log(`[usePageContent] ⚠️ Pas de données Supabase pour ${pageId}, utilisation des valeurs par défaut`);
            setSource('default');
          }
        } else {
          const errorText = await response.text();
          console.error(`[usePageContent] ❌ Erreur Supabase: ${response.status}`, errorText);
          setError(`Erreur Supabase: ${response.status}`);
          // Garde les valeurs par défaut (déjà initialisées)
          setSource('default-error');
        }
      } catch (err) {
        console.error('[usePageContent] ❌ Erreur fetch:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        // Garde les valeurs par défaut (déjà initialisées)
        setSource('default-error');
      }

      setLoading(false);
    };

    loadContent();
  }, [pageId]);

  return { data, loading, source, error };
}
