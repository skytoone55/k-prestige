'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import InscriptionContent from '../../inscription/InscriptionContent';

export default function InscriptionHebrewPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('he');
  }, [setLang]);

  return <InscriptionContent />;
}
