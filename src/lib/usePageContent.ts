'use client';

import { useState, useEffect } from 'react';
import { fullPageContent } from './page-content-full';

// Constantes Supabase (hardcodées pour éviter les problèmes d'env)
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

export function usePageContent(pageId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('init');

  useEffect(() => {
    const loadContent = async () => {
      console.log(`[usePageContent] Loading content for page: ${pageId}`);
      console.log(`[usePageContent] Supabase URL: ${SUPABASE_URL}`);

      try {
        // Toujours charger depuis Supabase - pas de localStorage
        const timestamp = Date.now();
        const url = `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content&_t=${timestamp}`;

        console.log(`[usePageContent] Fetching: ${url}`);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        console.log(`[usePageContent] Response status: ${response.status}`);

        if (response.ok) {
          const result = await response.json();
          console.log(`[usePageContent] Result:`, result);

          if (result && result.length > 0 && result[0]?.content) {
            console.log(`[usePageContent] ✅ Données chargées depuis Supabase`);
            setData(result[0].content);
            setSource('supabase');
            setLoading(false);
            return;
          } else {
            console.log(`[usePageContent] ⚠️ Pas de données dans Supabase pour ${pageId}`);
          }
        } else {
          const errorText = await response.text();
          console.error(`[usePageContent] ❌ Erreur Supabase: ${response.status}`, errorText);
        }
      } catch (error) {
        console.error('[usePageContent] ❌ Erreur fetch:', error);
      }

      // Fallback: valeurs par défaut du code
      console.log(`[usePageContent] ⚠️ Utilisation des valeurs par défaut`);
      setData(fullPageContent[pageId] || null);
      setSource('default');
      setLoading(false);
    };

    loadContent();
  }, [pageId]);

  return { data, loading, source };
}
