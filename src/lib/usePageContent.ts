import { useState, useEffect } from 'react';
import { fullPageContent } from './page-content-full';

export function usePageContent(pageId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('init');

  useEffect(() => {
    const loadContent = async () => {
      console.log(`[usePageContent] Loading content for page: ${pageId}`);

      try {
        // 1. Charger directement depuis Supabase via fetch (sans cache)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          // Ajouter timestamp pour éviter tout cache navigateur
          const timestamp = Date.now();
          const response = await fetch(
            `${supabaseUrl}/rest/v1/page_content?page_id=eq.${pageId}&select=content&_t=${timestamp}`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
              },
              cache: 'no-store',
            }
          );

          console.log(`[usePageContent] Fetch response status: ${response.status}`);

          if (response.ok) {
            const result = await response.json();
            console.log(`[usePageContent] Supabase response:`, {
              hasData: result && result.length > 0,
              hasContent: result?.[0]?.content ? true : false,
            });

            if (result && result[0]?.content) {
              console.log(`[usePageContent] ✅ Using Supabase data (no-cache)`);
              setData(result[0].content);
              setSource('supabase');
              // Mettre en cache localStorage
              try {
                localStorage.setItem(`page_content_full_${pageId}`, JSON.stringify(result[0].content));
              } catch (e) {
                console.warn('[usePageContent] Could not save to localStorage:', e);
              }
              setLoading(false);
              return;
            }
          } else {
            console.warn(`[usePageContent] Supabase fetch error: ${response.status}`);
          }
        }
      } catch (error) {
        console.error('[usePageContent] Erreur Supabase:', error);
      }

      // 2. Fallback localStorage
      try {
        const saved = localStorage.getItem(`page_content_full_${pageId}`);
        if (saved) {
          console.log(`[usePageContent] ✅ Using localStorage data`);
          setData(JSON.parse(saved));
          setSource('localStorage');
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('[usePageContent] Erreur parsing localStorage:', e);
      }

      // 3. Valeurs par défaut
      console.log(`[usePageContent] ⚠️ Using default data`);
      setData(fullPageContent[pageId] || null);
      setSource('default');
      setLoading(false);
    };

    loadContent();
  }, [pageId]);

  // Log when data changes
  useEffect(() => {
    if (data) {
      console.log(`[usePageContent] Data loaded from: ${source}`, {
        pageId,
        heroTitle: data?.hero?.title
      });
    }
  }, [data, source, pageId]);

  return { data, loading, source };
}
