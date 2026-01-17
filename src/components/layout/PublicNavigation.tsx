'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, MessageCircle, Globe } from 'lucide-react';
import { useLanguage, useTranslation } from '@/lib/LanguageContext';
import { LANGUAGES, Language } from '@/lib/translations';

// Constantes Supabase
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

// Mapping des page_id vers les href
const PAGE_ID_TO_HREF: Record<string, string> = {
  'marbella': '/marbella',
  'marrakech': '/marrakech',
  'hilloula': '/hilloula',
  'souccot': '/soucott',
  'pessah-sejour': '/pessah-2026/sejour',
  'pessah-hotel': '/pessah-2026/hotel',
  'galerie': '/pessah-2026/galerie',
};

export function PublicNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pessahDropdownOpen, setPessahDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [disabledPages, setDisabledPages] = useState<Set<string>>(new Set());

  const { lang, setLang, dir } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);

    // Charger les pages désactivées
    const loadDisabledPages = async () => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/page_settings?select=*`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const disabledHrefs = new Set<string>();
          data.forEach((item: any) => {
            if (item.disabled && PAGE_ID_TO_HREF[item.page_id]) {
              disabledHrefs.add(PAGE_ID_TO_HREF[item.page_id]);
            }
          });
          setDisabledPages(disabledHrefs);
        }
      } catch (error) {
        console.error('Erreur chargement page_settings:', error);
      }
    };
    loadDisabledPages();
  }, []);

  // Logique isActive corrigée : pour Accueil, vérifier exactement '/', pour les autres utiliser startsWith
  const isActive = (path: string) => {
    if (!mounted) return false;
    // Pour "Accueil", vérifier exactement la racine
    if (path === '/') {
      return pathname === '/';
    }
    // Pour les autres pages, utiliser startsWith pour inclure les sous-pages
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Helper pour les classes de texte de manière uniforme
  const getTextClasses = (isActiveItem: boolean) => {
    if (isActiveItem) {
      return 'text-[var(--gold)]';
    }
    return 'text-gray-700 hover:text-[var(--gold)]';
  };

  // Navigation avec traductions
  const navigationItems = [
    { name: t('navigation.home'), href: '/' },
    {
      name: t('navigation.pessah2026'),
      href: '/pessah-2026',
      dropdown: [
        { name: t('navigation.theSejour'), href: '/pessah-2026/sejour' },
        { name: t('navigation.theHotel'), href: '/pessah-2026/hotel' },
        { name: t('navigation.photoGallery'), href: '/pessah-2026/galerie' },
      ],
    },
    { name: t('navigation.marbella'), href: '/marbella' },
    { name: t('navigation.marrakech'), href: '/marrakech' },
    { name: t('navigation.hilloula'), href: '/hilloula' },
    { name: t('navigation.souccot'), href: '/soucott' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  // En RTL (hébreu), inverser l'ordre des éléments de navigation
  const navigation = dir === 'rtl' ? [...navigationItems].reverse() : navigationItems;

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300 w-full" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={cn("flex items-center justify-between h-16 w-full", dir === 'rtl' && 'flex-row-reverse')}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-10 flex-shrink-0">
              <Image
                src="/K PRESTIGE NOIR.png"
                alt="K PRESTIGE"
                width={160}
                height={56}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation - centré */}
            <nav className={cn("hidden lg:flex items-center justify-center gap-1 mx-4", dir === 'rtl' && 'flex-row-reverse')}>
              {navigation.filter(item => !disabledPages.has(item.href)).map((item) => {
                if (item.dropdown) {
                  // Filtrer les sous-éléments désactivés
                  const visibleDropdown = item.dropdown.filter(sub => !disabledPages.has(sub.href));
                  if (visibleDropdown.length === 0) return null;

                  return (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => setPessahDropdownOpen(true)}
                      onMouseLeave={() => setPessahDropdownOpen(false)}
                    >
                      <button
                        className={cn(
                          'flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors rounded-lg',
                          getTextClasses(isActive(item.href))
                        )}
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                      >
                        {item.name}
                        <ChevronDown className={cn(
                          'w-4 h-4 transition-transform',
                          pessahDropdownOpen && 'rotate-180'
                        )} />
                      </button>

                      {/* Dropdown Menu avec padding-top invisible pour combler le gap */}
                      {pessahDropdownOpen && (
                        <div className={cn("absolute top-full pt-2", dir === 'rtl' ? 'right-0' : 'left-0')}>
                          <div className="w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                            {visibleDropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  'block px-4 py-2 text-sm transition-colors',
                                  isActive(subItem.href)
                                    ? 'text-[var(--gold)] bg-[var(--gold-pale)]/20'
                                    : 'text-gray-700 hover:text-[var(--gold)] hover:bg-gray-50',
                                  dir === 'rtl' && 'text-right'
                                )}
                                style={{ fontFamily: 'var(--font-dm-sans)' }}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 text-[15px] font-medium transition-colors rounded-lg',
                      getTextClasses(isActive(item.href))
                    )}
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Language Selector + Connexion - à droite */}
            <div className={cn("hidden lg:flex items-center gap-2 flex-shrink-0", dir === 'rtl' && 'flex-row-reverse')}>
              {/* Language Selector */}
              <div
                className="relative"
                onMouseEnter={() => setLangDropdownOpen(true)}
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[var(--gold)] transition-colors rounded-lg hover:bg-gray-50",
                    dir === 'rtl' && 'flex-row-reverse'
                  )}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  <span className="text-base">{currentLang?.flag}</span>
                  <span className="text-sm">{currentLang?.label}</span>
                  <ChevronDown className={cn(
                    'w-3 h-3 transition-transform',
                    langDropdownOpen && 'rotate-180'
                  )} />
                </button>

                {langDropdownOpen && (
                  <div className={cn("absolute top-full pt-2", dir === 'rtl' ? 'left-0' : 'right-0')}>
                    <div className="w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                      {LANGUAGES.map((langOption) => (
                        <button
                          key={langOption.code}
                          onClick={() => {
                            setLang(langOption.code);
                            setLangDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                            lang === langOption.code
                              ? 'text-[var(--gold)] bg-[var(--gold-pale)]/20'
                              : 'text-gray-700 hover:text-[var(--gold)] hover:bg-gray-50',
                            dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                          )}
                          style={{ fontFamily: 'var(--font-dm-sans)' }}
                        >
                          <span className="text-lg">{langOption.flag}</span>
                          <span>{langOption.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Connexion */}
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
                >
                  {t('navigation.login')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={cn("lg:hidden p-2 z-10 transition-colors text-gray-700", dir === 'rtl' ? 'mr-auto' : 'ml-auto')}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">
            <nav className="px-4 py-4 space-y-1">
              {/* Language Selector Mobile */}
              <div className="pb-3 mb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-2 px-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {lang === 'fr' ? 'Langue' : lang === 'en' ? 'Language' : lang === 'es' ? 'Idioma' : 'שפה'}
                </p>
                <div className="flex gap-2 px-3">
                  {LANGUAGES.map((langOption) => (
                    <button
                      key={langOption.code}
                      onClick={() => {
                        setLang(langOption.code);
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        lang === langOption.code
                          ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                      style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                      <span className="text-lg">{langOption.flag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {navigation.filter(item => !disabledPages.has(item.href)).map((item) => {
                if (item.dropdown) {
                  // Filtrer les sous-éléments désactivés
                  const visibleDropdown = item.dropdown.filter(sub => !disabledPages.has(sub.href));
                  if (visibleDropdown.length === 0) return null;

                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setPessahDropdownOpen(!pessahDropdownOpen)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors",
                          dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                        )}
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          isActive(item.href) ? 'text-[var(--gold)]' : 'text-gray-700'
                        )}>
                          {item.name}
                        </span>
                        <ChevronDown className={cn(
                          'w-4 h-4 transition-transform',
                          pessahDropdownOpen && 'rotate-180'
                        )} />
                      </button>
                      {pessahDropdownOpen && (
                        <div className={cn("mt-1 space-y-1", dir === 'rtl' ? 'pr-4' : 'pl-4')}>
                          {visibleDropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive(subItem.href)
                                  ? 'text-[var(--gold)] bg-[var(--gold-pale)]/20'
                                  : 'text-gray-600 hover:text-[var(--gold)] hover:bg-gray-50',
                                dir === 'rtl' && 'text-right'
                              )}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setPessahDropdownOpen(false);
                              }}
                              style={{ fontFamily: 'var(--font-dm-sans)' }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-[var(--gold)] bg-[var(--gold-pale)]/20'
                        : 'text-gray-700 hover:text-[var(--gold)] hover:bg-gray-50',
                      dir === 'rtl' && 'text-right'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block mt-4">
                <Button className="w-full" variant="outline" size="sm">
                  {t('navigation.login')}
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/33699951963"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group",
          dir === 'rtl' ? 'left-6' : 'right-6'
        )}
        aria-label={t('whatsapp.contactVia')}
      >
        <MessageCircle className="w-6 h-6" />
        <span className={cn(
          "absolute -top-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse",
          dir === 'rtl' ? '-left-2' : '-right-2'
        )}>
          1
        </span>
      </a>
    </>
  );
}
