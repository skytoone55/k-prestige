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
        // 1. Essayer de charger depuis Supabase
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        console.log(`[usePageContent] Fetching from Supabase...`);

        const { data: supabaseData, error } = await supabase
          .from('page_content')
          .select('content')
          .eq('page_id', pageId)
          .single();

        console.log(`[usePageContent] Supabase response:`, {
          hasData: !!supabaseData,
          hasContent: !!supabaseData?.content,
          error: error?.message || null
        });

        if (!error && supabaseData?.content) {
          console.log(`[usePageContent] ✅ Using Supabase data`);
          setData(supabaseData.content);
          setSource('supabase');
          // Mettre en cache localStorage
          try {
            localStorage.setItem(`page_content_full_${pageId}`, JSON.stringify(supabaseData.content));
          } catch (e) {
            console.warn('[usePageContent] Could not save to localStorage:', e);
          }
          setLoading(false);
          return;
        }

        // Si erreur Supabase, log et continue vers fallback
        if (error) {
          console.warn(`[usePageContent] Supabase error: ${error.message}`);
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
