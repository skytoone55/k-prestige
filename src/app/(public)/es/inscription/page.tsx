'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import InscriptionContent from '../../inscription/InscriptionContent';

export default function InscriptionSpanishPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('es');
  }, [setLang]);

  return <InscriptionContent />;
}
