import { useState, useEffect } from 'react';
import { fullPageContent } from './page-content-full';

export function usePageContent(pageId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // 1. Essayer de charger depuis Supabase
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data: supabaseData, error } = await supabase
          .from('page_content')
          .select('content')
          .eq('page_id', pageId)
          .single();

        if (!error && supabaseData?.content) {
          setData(supabaseData.content);
          // Mettre en cache localStorage
          localStorage.setItem(`page_content_full_${pageId}`, JSON.stringify(supabaseData.content));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Erreur Supabase:', error);
      }

      // 2. Fallback localStorage
      const saved = localStorage.getItem(`page_content_full_${pageId}`);
      if (saved) {
        try {
          setData(JSON.parse(saved));
          setLoading(false);
          return;
        } catch (e) {
          console.error('Erreur parsing localStorage:', e);
        }
      }

      // 3. Valeurs par défaut
      setData(fullPageContent[pageId] || null);
      setLoading(false);
    };

    loadContent();
  }, [pageId]);

  return { data, loading };
}
