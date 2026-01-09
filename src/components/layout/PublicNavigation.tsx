'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, MessageCircle } from 'lucide-react';

export function PublicNavigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pessahDropdownOpen, setPessahDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (!mounted) return false;
    return pathname === path || pathname.startsWith(path);
  };

  // Pages avec Hero (menu transparent + texte blanc)
  const pagesWithHero = [
    '/',
    '/marbella',
    '/marrakech',
    '/hilloula',
    '/soucott',
    '/pessah-2026',
    '/pessah-2026/sejour',
    '/pessah-2026/hotel',
    '/contact',
  ];
  
  const hasHero = pagesWithHero.some(path => pathname === path || pathname.startsWith(path));
  // Logique simplifiée : texte blanc si Hero ET pas scrollé, sinon texte gris
  const shouldUseLightText = hasHero && !scrolled;
  
  // Helper pour les classes de texte de manière uniforme
  const getTextClasses = (isActive: boolean) => {
    if (isActive) {
      return 'text-[var(--gold)]';
    }
    return shouldUseLightText 
      ? 'text-white hover:text-[var(--gold)]' 
      : 'text-gray-700 hover:text-[var(--gold)]';
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    {
      name: 'Pessah 2026',
      href: '/pessah-2026',
      dropdown: [
        { name: 'Le Séjour', href: '/pessah-2026/sejour' },
        { name: 'L\'Hôtel', href: '/pessah-2026/hotel' },
        { name: 'Galerie', href: '/pessah-2026/galerie' },
      ],
    },
    { name: 'Marbella', href: '/marbella' },
    { name: 'Marrakech', href: '/marrakech' },
    { name: 'Hilloula', href: '/hilloula' },
    { name: 'Soucott', href: '/soucott' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-10">
              <Image
                src="/logo.jpg"
                alt="K PRESTIGE"
                width={140}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                if (item.dropdown) {
                  return (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => setPessahDropdownOpen(true)}
                      onMouseLeave={() => setPessahDropdownOpen(false)}
                    >
                      <button
                        className={cn(
                          'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg',
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
                        <div className="absolute top-full left-0 pt-2">
                          <div className="w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  'block px-4 py-2 text-sm transition-colors',
                                  isActive(subItem.href)
                                    ? 'text-[var(--gold)] bg-[var(--gold-pale)]/20'
                                    : 'text-gray-700 hover:text-[var(--gold)] hover:bg-gray-50'
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
                      'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                      getTextClasses(isActive(item.href))
                    )}
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <Link href="/login" className="ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    shouldUseLightText
                      ? 'border-white text-white hover:bg-white hover:text-[var(--dark-bg)]'
                      : 'border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white'
                  )}
                >
                  Connexion
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "lg:hidden p-2 z-10 transition-colors",
                shouldUseLightText ? "text-white" : "text-gray-700"
              )}
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
              {navigation.map((item) => {
                if (item.dropdown) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setPessahDropdownOpen(!pessahDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
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
                        <div className="pl-4 mt-1 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive(subItem.href)
                                  ? 'text-[var(--gold)] bg-[var(--gold-pale)]/20'
                                  : 'text-gray-600 hover:text-[var(--gold)] hover:bg-gray-50'
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
                        : 'text-gray-700 hover:text-[var(--gold)] hover:bg-gray-50'
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
                  Connexion
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
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          1
        </span>
      </a>
    </>
  );
}
