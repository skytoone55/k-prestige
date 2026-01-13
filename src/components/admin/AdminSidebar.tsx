'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Home,
  Calendar,
  UtensilsCrossed,
  MapPin,
  Heart,
  Leaf,
  Mail,
  ChevronRight,
  ChevronDown,
  Globe,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

// Constantes Supabase
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

interface MenuCategory {
  id: string;
  name: string;
  icon: any;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  icon: any;
  children?: { id: string; name: string }[];
}

const menuCategories: MenuCategory[] = [
  {
    id: 'site-internet',
    name: 'SITE INTERNET',
    icon: Globe,
    items: [
      {
        id: 'accueil',
        name: 'Accueil',
        icon: Home,
      },
      {
        id: 'pessah',
        name: 'Pessah 2026',
        icon: Calendar,
        children: [
          { id: 'pessah-sejour', name: 'Le Séjour' },
          { id: 'pessah-hotel', name: 'L\'Hôtel' },
          { id: 'galerie', name: 'Galerie photos' },
        ],
      },
      {
        id: 'marbella',
        name: 'Marbella',
        icon: UtensilsCrossed,
      },
      {
        id: 'marrakech',
        name: 'Marrakech',
        icon: MapPin,
      },
      {
        id: 'hilloula',
        name: 'Hilloula',
        icon: Heart,
      },
      {
        id: 'souccot',
        name: 'Souccot',
        icon: Leaf,
      },
      {
        id: 'contact',
        name: 'Contact',
        icon: Mail,
      },
    ],
  },
  // D'autres catégories pourront être ajoutées ici plus tard
  // {
  //   id: 'parametres',
  //   name: 'PARAMÈTRES',
  //   icon: Settings,
  //   items: [...]
  // },
];

interface AdminSidebarProps {
  selectedPage: string | null;
  onSelectPage: (pageId: string) => void;
}

// Pages qui peuvent être désactivées (pas accueil ni contact)
const TOGGLEABLE_PAGES = ['marbella', 'marrakech', 'hilloula', 'souccot', 'pessah-sejour', 'pessah-hotel', 'galerie'];

export function AdminSidebar({ selectedPage, onSelectPage }: AdminSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['site-internet']));
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['pessah']));
  const [disabledPages, setDisabledPages] = useState<Set<string>>(new Set());
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);

  // Charger l'état des pages désactivées depuis Supabase
  useEffect(() => {
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
          const disabled = new Set<string>();
          data.forEach((item: any) => {
            if (item.disabled) {
              disabled.add(item.page_id);
            }
          });
          setDisabledPages(disabled);
        }
      } catch (error) {
        console.error('Erreur chargement page_settings:', error);
      }
    };
    loadDisabledPages();
  }, []);

  // Toggle une page activée/désactivée
  const togglePageVisibility = async (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingToggle(pageId);

    const isCurrentlyDisabled = disabledPages.has(pageId);
    const newDisabled = !isCurrentlyDisabled;

    try {
      // Upsert dans Supabase
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/page_settings`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            page_id: pageId,
            disabled: newDisabled,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const newSet = new Set(disabledPages);
        if (newDisabled) {
          newSet.add(pageId);
        } else {
          newSet.delete(pageId);
        }
        setDisabledPages(newSet);
      }
    } catch (error) {
      console.error('Erreur toggle page:', error);
    }

    setLoadingToggle(null);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--gold)] to-[var(--gold-pale)] flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Administration</h2>
            <p className="text-xs text-gray-500">K Prestige</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        {menuCategories.map((category) => {
          const CategoryIcon = category.icon;
          const isCategoryExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id} className="space-y-2">
              {/* Catégorie principale */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all',
                  'bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100',
                  'border border-gray-200 shadow-sm'
                )}
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon className="w-5 h-5 text-[var(--gold)]" />
                  <span className="text-gray-800 uppercase tracking-wide">{category.name}</span>
                </div>
                {isCategoryExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {/* Items de la catégorie */}
              {isCategoryExpanded && (
                <div className="ml-2 space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedMenus.has(item.id);
                    const isActive = selectedPage === item.id || 
                      (hasChildren && item.children?.some(child => selectedPage === child.id));

                    return (
                      <div key={item.id}>
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() => toggleMenu(item.id)}
                              className={cn(
                                'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                                isActive
                                  ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                                  : 'text-gray-700 hover:bg-gray-100'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                              </div>
                              {isExpanded ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </button>
                            {isExpanded && (
                              <div className="ml-6 mt-1 space-y-1">
                                {item.children?.map((child) => {
                                  const isChildDisabled = disabledPages.has(child.id);
                                  const canToggle = TOGGLEABLE_PAGES.includes(child.id);
                                  return (
                                    <div key={child.id} className="flex items-center gap-1">
                                      <button
                                        onClick={() => onSelectPage(child.id)}
                                        className={cn(
                                          'flex-1 text-left px-4 py-2 rounded-lg text-sm transition-all',
                                          selectedPage === child.id
                                            ? 'bg-[var(--gold)]/15 text-[var(--gold)] font-semibold border-l-2 border-[var(--gold)]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                          isChildDisabled && 'opacity-50'
                                        )}
                                      >
                                        {child.name}
                                      </button>
                                      {canToggle && (
                                        <button
                                          onClick={(e) => togglePageVisibility(child.id, e)}
                                          className={cn(
                                            'p-1.5 rounded-md transition-all',
                                            isChildDisabled
                                              ? 'text-red-400 hover:bg-red-50'
                                              : 'text-green-500 hover:bg-green-50',
                                            loadingToggle === child.id && 'animate-pulse'
                                          )}
                                          title={isChildDisabled ? 'Page désactivée - Cliquer pour activer' : 'Page active - Cliquer pour désactiver'}
                                        >
                                          {isChildDisabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onSelectPage(item.id)}
                              className={cn(
                                'flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                                selectedPage === item.id
                                  ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                                  : 'text-gray-700 hover:bg-gray-100',
                                disabledPages.has(item.id) && 'opacity-50'
                              )}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </button>
                            {TOGGLEABLE_PAGES.includes(item.id) && (
                              <button
                                onClick={(e) => togglePageVisibility(item.id, e)}
                                className={cn(
                                  'p-1.5 rounded-md transition-all',
                                  disabledPages.has(item.id)
                                    ? 'text-red-400 hover:bg-red-50'
                                    : 'text-green-500 hover:bg-green-50',
                                  loadingToggle === item.id && 'animate-pulse'
                                )}
                                title={disabledPages.has(item.id) ? 'Page désactivée - Cliquer pour activer' : 'Page active - Cliquer pour désactiver'}
                              >
                                {disabledPages.has(item.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          <p>K Prestige Admin v1.0</p>
        </div>
      </div>
    </div>
  );
}
