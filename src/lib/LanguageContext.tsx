'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGES, isRTL, getDir } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'k-prestige-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  // Charger la langue depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && LANGUAGES.some(l => l.code === stored)) {
      setLangState(stored);
    } else {
      // Détecter la langue du navigateur
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en' || browserLang === 'es' || browserLang === 'he') {
        setLangState(browserLang as Language);
      }
    }
    setMounted(true);
  }, []);

  // Mettre à jour le document dir et lang
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
      document.documentElement.dir = getDir(lang);
    }
  }, [lang, mounted]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    // Émettre un événement custom pour les autres composants
    window.dispatchEvent(new CustomEvent('k-prestige-lang-change', { detail: newLang }));
  };

  const value: LanguageContextType = {
    lang,
    setLang,
    isRTL: isRTL(lang),
    dir: getDir(lang),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook pour obtenir une traduction
export function useTranslation() {
  const { lang } = useLanguage();

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any;

    // Import dynamique serait mieux mais pour simplifier on va importer statiquement
    const { translations } = require('./translations');
    result = translations;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        console.warn(`Translation not found: ${path}`);
        return path;
      }
    }

    if (typeof result === 'object' && lang in result) {
      return result[lang];
    }

    // Fallback to French
    if (typeof result === 'object' && 'fr' in result) {
      return result['fr'];
    }

    return path;
  };

  return { t, lang };
}
