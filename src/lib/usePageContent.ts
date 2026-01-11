import { useState, useEffect } from 'react';
import { fullPageContent } from './page-content-full';

export function usePageContent(pageId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger depuis localStorage ou utiliser les valeurs par défaut
    const saved = localStorage.getItem(`page_content_full_${pageId}`);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // En cas d'erreur, utiliser les valeurs par défaut
        setData(fullPageContent[pageId] || null);
      }
    } else {
      // Utiliser les valeurs par défaut
      setData(fullPageContent[pageId] || null);
    }
    setLoading(false);
  }, [pageId]);

  return { data, loading };
}
