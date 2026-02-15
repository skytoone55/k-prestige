'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import InscriptionContent from '../../inscription/InscriptionContent';

export default function InscriptionEnglishPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('en');
  }, [setLang]);

  return <InscriptionContent />;
}
