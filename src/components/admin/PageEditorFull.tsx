'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Upload, X, Plus, Trash2, Edit3, Image as ImageIcon, Type, Hash, ChevronLeft, ChevronRight, Eye, EyeOff, Globe, Languages, RefreshCw, Check, AlertCircle, Lock, Unlock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/Textarea';
import { fullPageContent } from '@/lib/page-content-full';
import { ImageSelector } from '@/components/admin/ImageSelector';

// Constantes Supabase hardcodées pour éviter les problèmes d'env
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI0MjQsImV4cCI6MjA4MzM3ODQyNH0.6RiC65zsSb9INtYpRC7PLurvoHmbb_LX3NkPBM4wodw';

// Configuration pour chaque page avec TOUS les éléments
const pageConfigs: Record<string, any> = {
  'accueil': {
    title: 'Page d\'accueil',
    icon: '🏠',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text', placeholder: 'Expérience Premium' },
          { id: 'title', label: 'Titre principal', type: 'text', placeholder: 'PESSAH 2026' },
          { id: 'location', label: 'Localisation', type: 'text', placeholder: 'Cabogata Beach Hotel 5★ • Espagne' },
          { id: 'date', label: 'Dates', type: 'text', placeholder: '31 MARS - 10 AVRIL' },
          { id: 'image', label: 'Image hero', type: 'image' },
          { id: 'animation_text', label: 'Texte animation', type: 'text', placeholder: 'Animation non-stop par...' },
        ],
      },
      {
        id: 'univers',
        title: 'Les 5 Univers',
        icon: '🌍',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'href', label: 'Lien (ex: /marbella)', type: 'text' },
        ],
      },
      {
        id: 'stats',
        title: 'Statistiques',
        icon: '📊',
        type: 'array',
        itemFields: [
          { id: 'value', label: 'Valeur (nombre)', type: 'number' },
          { id: 'suffix', label: 'Suffixe (ex: +, ans, %)', type: 'text' },
          { id: 'label', label: 'Label', type: 'text' },
        ],
      },
      {
        id: 'testimonials',
        title: 'Témoignages',
        icon: '💬',
        type: 'array',
        itemFields: [
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'location', label: 'Localisation', type: 'text' },
          { id: 'text', label: 'Texte du témoignage', type: 'textarea' },
          { id: 'rating', label: 'Note (1-5)', type: 'number' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'pessah-sejour': {
    title: 'Le Séjour',
    icon: '📅',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'dates',
        title: 'Dates du Séjour',
        icon: '📆',
        type: 'object',
        fields: [
          { id: 'principal.title', label: 'Titre séjour principal', type: 'text' },
          { id: 'principal.dates', label: 'Dates séjour principal', type: 'text' },
          { id: 'principal.duration', label: 'Durée séjour principal', type: 'text' },
          { id: 'prolonge.title', label: 'Titre weekend prolongé', type: 'text' },
          { id: 'prolonge.dates', label: 'Dates weekend prolongé', type: 'text' },
          { id: 'prolonge.duration', label: 'Durée weekend prolongé', type: 'text' },
        ],
      },
      {
        id: 'supervision',
        title: 'Supervision Religieuse',
        icon: '✡️',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'rav', label: 'Nom du Rav', type: 'text' },
          { id: 'viandes', label: 'Surveillance viandes', type: 'text' },
        ],
      },
      {
        id: 'animations',
        title: 'Animations',
        icon: '🎵',
        type: 'array',
        itemFields: [
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'instagram', label: 'Lien Instagram (optionnel)', type: 'text' },
        ],
      },
      {
        id: 'services',
        title: 'Services Inclus',
        icon: '🎯',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'desc', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
    ],
  },
  'pessah-hotel': {
    title: 'L\'Hôtel',
    icon: '🏨',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'hotel',
        title: 'Informations Hôtel',
        icon: 'ℹ️',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Nom de l\'hôtel', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'location', label: 'Localisation', type: 'text' },
          { id: 'image', label: 'Image de présentation', type: 'image' },
        ],
      },
      {
        id: 'chambres',
        title: 'Types de Chambres',
        icon: '🛏️',
        type: 'array',
        itemFields: [
          { id: 'code', label: 'Code', type: 'text' },
          { id: 'nom', label: 'Nom', type: 'text' },
          { id: 'surface', label: 'Surface', type: 'text' },
          { id: 'vue', label: 'Vue', type: 'text' },
          { id: 'special', label: 'Spécial (optionnel)', type: 'text' },
        ],
      },
      {
        id: 'services',
        title: 'Services & Équipements',
        icon: '🎯',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'desc', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
    ],
  },
  'marbella': {
    title: 'Marbella',
    icon: '🍽️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'location', label: 'Localisation', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'couverts', label: 'Nombre de couverts', type: 'text' },
          { id: 'address', label: 'Adresse', type: 'text' },
          { id: 'phone', label: 'Téléphone', type: 'text' },
          { id: 'image', label: 'Image présentation', type: 'image' },
        ],
      },
      {
        id: 'features',
        title: 'Caractéristiques',
        icon: '✓',
        type: 'array',
        itemFields: [
          { id: 'text', label: 'Texte', type: 'text' },
        ],
      },
      {
        id: 'services',
        title: 'Services',
        icon: '🎯',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'desc', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'marrakech': {
    title: 'Marrakech',
    icon: '📍',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description paragraphe 1', type: 'textarea' },
          { id: 'description2', label: 'Description paragraphe 2', type: 'textarea' },
          { id: 'image', label: 'Image présentation', type: 'image' },
        ],
      },
      {
        id: 'events',
        title: 'Types d\'Événements',
        icon: '🎉',
        type: 'array',
        itemFields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'desc', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'hilloula': {
    title: 'Hilloula',
    icon: '❤️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'note', label: 'Note importante', type: 'textarea' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
      {
        id: 'features',
        title: 'Caractéristiques incluses',
        icon: '✓',
        type: 'array',
        itemFields: [
          { id: 'text', label: 'Texte', type: 'text' },
        ],
      },
      {
        id: 'event',
        title: 'Prochain Événement',
        icon: '📅',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre section', type: 'text' },
          { id: 'name', label: 'Nom de l\'événement', type: 'text' },
          { id: 'dates', label: 'Dates', type: 'text' },
          { id: 'duration', label: 'Durée', type: 'text' },
          { id: 'lieu', label: 'Lieu', type: 'text' },
          { id: 'price', label: 'Prix', type: 'text' },
          { id: 'kashrout', label: 'Kashrout', type: 'text' },
          { id: 'inclus', label: 'Inclus', type: 'text' },
          { id: 'link', label: 'Lien vers détails', type: 'text' },
          { id: 'button_text', label: 'Texte bouton', type: 'text' },
        ],
      },
      {
        id: 'gallery',
        title: 'Galerie Images',
        icon: '🖼️',
        type: 'array',
        itemFields: [
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'alt', label: 'Description', type: 'text' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'souccot': {
    title: 'Souccot',
    icon: '🍃',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'main',
        title: 'Contenu Principal',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'especes',
        title: 'Les 4 Espèces',
        icon: '🌿',
        type: 'array',
        itemFields: [
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'desc', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image', type: 'image' },
        ],
      },
      {
        id: 'kits',
        title: 'Niveaux de Qualité',
        icon: '📦',
        type: 'array',
        itemFields: [
          { id: 'level', label: 'Niveau (א, אא, ב, ג)', type: 'text' },
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'nameHe', label: 'Nom hébreu', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'price', label: 'Prix', type: 'text' },
          { id: 'available', label: 'Disponible (true/false)', type: 'text' },
        ],
      },
      {
        id: 'livraison',
        title: 'Livraison',
        icon: '🚚',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'note', label: 'Note', type: 'text' },
        ],
      },
      {
        id: 'gallery',
        title: 'Galerie Photos',
        icon: '🖼️',
        type: 'array',
        itemFields: [
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'alt', label: 'Description', type: 'text' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'note', label: 'Note importante', type: 'textarea' },
          { id: 'button1_text', label: 'Texte bouton 1', type: 'text' },
          { id: 'button2_text', label: 'Texte bouton 2', type: 'text' },
        ],
      },
    ],
  },
  'contact': {
    title: 'Contact',
    icon: '✉️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'subtitle', label: 'Sous-titre', type: 'text' },
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'coordonnees',
        title: 'Coordonnées',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre section', type: 'text' },
          { id: 'phone1', label: 'Téléphone 1', type: 'text' },
          { id: 'phone2', label: 'Téléphone 2', type: 'text' },
          { id: 'email', label: 'Email', type: 'text' },
          { id: 'address.name', label: 'Nom société', type: 'text' },
          { id: 'address.street', label: 'Rue', type: 'text' },
          { id: 'address.city', label: 'Ville', type: 'text' },
          { id: 'address.siret', label: 'SIRET', type: 'text' },
        ],
      },
      {
        id: 'form',
        title: 'Formulaire',
        icon: '📝',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre formulaire', type: 'text' },
        ],
      },
      {
        id: 'quickContact',
        title: 'Contact Rapide',
        icon: '⚡',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre section', type: 'text' },
          { id: 'whatsapp.title', label: 'WhatsApp - Titre', type: 'text' },
          { id: 'whatsapp.description', label: 'WhatsApp - Description', type: 'text' },
          { id: 'whatsapp.button', label: 'WhatsApp - Texte bouton', type: 'text' },
          { id: 'callback.title', label: 'Rappel - Titre', type: 'text' },
          { id: 'callback.description', label: 'Rappel - Description', type: 'text' },
          { id: 'callback.button', label: 'Rappel - Texte bouton', type: 'text' },
        ],
      },
    ],
  },
};

interface PageEditorFullProps {
  pageId: string;
}

// Langues disponibles
const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
];

// Pages avec support multilingue - TOUTES les pages publiques
const MULTILINGUAL_PAGES = ['accueil', 'pessah-sejour', 'pessah-hotel', 'marbella', 'marrakech', 'hilloula', 'souccot', 'contact'];

export function PageEditorFull({ pageId }: PageEditorFullProps) {
  const config = pageConfigs[pageId];
  const [data, setData] = useState<any>({}); // Contenu FR (principal)
  const [translations, setTranslations] = useState<any>({}); // Traductions EN, ES, HE
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionId: string, fieldId: string, index?: number} | null>(null);
  const [currentLang, setCurrentLang] = useState<string>('fr');

  // Vérifier si cette page supporte le multilingue
  const isMultilingual = MULTILINGUAL_PAGES.includes(pageId);

  // Obtenir les données actuelles selon la langue sélectionnée
  const currentData = currentLang === 'fr' ? data : (translations[currentLang] || {});

  // Fonction pour mettre à jour les données selon la langue
  const setCurrentData = (newData: any) => {
    if (currentLang === 'fr') {
      setData(newData);
    } else {
      setTranslations((prev: any) => ({
        ...prev,
        [currentLang]: newData
      }));
    }
  };

  useEffect(() => {
    if (!config) return;
    
    loadPageData();
    
    // Activer le premier onglet par défaut
    if (config.sections.length > 0) {
      setActiveTab(config.sections[0].id);
    }
  }, [pageId, config]);

  const loadPageData = async () => {
    if (!config) return;

    // Initialiser avec les valeurs par défaut pour éviter le flash
    const defaults = fullPageContent[pageId];
    if (defaults) {
      setData(defaults);
    }

    try {
      // Charger content ET translations depuis Supabase
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content,translations`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result && result[0]) {
          console.log('[PageEditorFull] ✅ Loaded from Supabase');
          if (result[0].content) {
            setData(result[0].content);
          }
          if (result[0].translations) {
            setTranslations(result[0].translations);
            console.log('[PageEditorFull] ✅ Translations loaded:', Object.keys(result[0].translations));
          }
        } else {
          console.log('[PageEditorFull] ⚠️ No data in Supabase, using defaults');
        }
      } else {
        console.error('[PageEditorFull] ❌ Supabase error:', response.status);
      }
    } catch (error) {
      console.error('[PageEditorFull] ❌ Erreur Supabase:', error);
      // PAS de fallback localStorage - on garde les valeurs par défaut
    }
  };

  if (!config) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Page non trouvée</p>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);

    try {
      // Sauvegarder UNIQUEMENT dans Supabase - PAS de localStorage
      const supabase = (await import('@/lib/supabase/client')).createClient();

      // Préparer l'objet de sauvegarde selon la langue courante
      const langLabel = LANGUAGES.find(l => l.code === currentLang)?.label || currentLang;

      if (currentLang === 'fr') {
        // Sauvegarder le contenu français + les traductions existantes
        console.log('[PageEditorFull] Saving FR content to Supabase...', {
          pageId,
          dataKeys: Object.keys(data),
          heroTitle: data?.hero?.title,
          translationKeys: Object.keys(translations)
        });

        const { data: upsertResult, error } = await supabase
          .from('page_content')
          .upsert(
            {
              page_id: pageId,
              content: data,
              translations: translations,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'page_id' }
          )
          .select();

        if (error) {
          console.error('[PageEditorFull] ❌ Erreur Supabase:', error);
          alert('❌ Erreur Supabase: ' + error.message);
        } else {
          alert(`✅ Contenu français sauvegardé avec succès !`);
        }
      } else {
        // Sauvegarder uniquement la traduction pour la langue sélectionnée
        const updatedTranslations = {
          ...translations,
          [currentLang]: translations[currentLang] || {}
        };

        console.log(`[PageEditorFull] Saving ${currentLang.toUpperCase()} translation to Supabase...`, {
          pageId,
          translationKeys: Object.keys(updatedTranslations[currentLang] || {})
        });

        const { data: upsertResult, error } = await supabase
          .from('page_content')
          .upsert(
            {
              page_id: pageId,
              content: data, // Garder le contenu FR
              translations: updatedTranslations,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'page_id' }
          )
          .select();

        if (error) {
          console.error('[PageEditorFull] ❌ Erreur Supabase:', error);
          alert('❌ Erreur Supabase: ' + error.message);
        } else {
          alert(`✅ Traduction ${langLabel} sauvegardée avec succès !`);
        }
      }
    } catch (error) {
      console.error('[PageEditorFull] ❌ Erreur:', error);
      alert('❌ Erreur de connexion: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }

    setLoading(false);
  };

  const updateNestedValue = (path: string, value: any) => {
    const keys = path.split('.');
    const updateFn = (prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    };

    if (currentLang === 'fr') {
      setData(updateFn);
    } else {
      setTranslations((prev: any) => ({
        ...prev,
        [currentLang]: updateFn(prev[currentLang] || {})
      }));
    }
  };

  const getNestedValue = (path: string) => {
    const keys = path.split('.');
    const dataSource = currentLang === 'fr' ? data : (translations[currentLang] || {});
    let current = dataSource;
    for (const key of keys) {
      if (!current || typeof current !== 'object') return '';
      current = current[key];
    }
    return current || '';
  };

  // Helper générique pour modifier les données selon la langue courante
  const updateCurrentData = (updateFn: (prev: any) => any) => {
    if (currentLang === 'fr') {
      setData(updateFn);
    } else {
      setTranslations((prev: any) => ({
        ...prev,
        [currentLang]: updateFn(prev[currentLang] || {})
      }));
    }
  };

  // Helper pour obtenir les données courantes
  const getCurrentData = () => {
    return currentLang === 'fr' ? data : (translations[currentLang] || {});
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!currentImageField) return;

    const { sectionId, fieldId, index } = currentImageField;

    if (index !== undefined) {
      updateCurrentData((prev: any) => {
        const newData = { ...prev };
        if (!newData[sectionId]) newData[sectionId] = [];
        if (!newData[sectionId][index]) newData[sectionId][index] = {};
        newData[sectionId][index][fieldId] = imageUrl;
        return newData;
      });
    } else if (fieldId.includes('.')) {
      updateNestedValue(`${sectionId}.${fieldId}`, imageUrl);
    } else {
      updateCurrentData((prev: any) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [fieldId]: imageUrl,
        },
      }));
    }

    setImageSelectorOpen(false);
    setCurrentImageField(null);
  };

  const addArrayItem = (sectionId: string, itemFields: any[]) => {
    updateCurrentData((prev: any) => {
      const newData = { ...prev };
      if (!newData[sectionId]) newData[sectionId] = [];
      const newItem: any = {};
      itemFields.forEach(field => {
        newItem[field.id] = field.type === 'number' ? 0 : '';
      });
      newData[sectionId].push(newItem);
      return newData;
    });
  };

  const removeArrayItem = (sectionId: string, index: number) => {
    console.log('[removeArrayItem] Called with sectionId:', sectionId, 'index:', index);
    const shouldDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?');
    console.log('[removeArrayItem] User confirmed:', shouldDelete);
    if (shouldDelete) {
      updateCurrentData((prev: any) => {
        const newData = { ...prev };
        if (newData[sectionId] && Array.isArray(newData[sectionId])) {
          // Créer un nouveau tableau sans l'élément supprimé
          const newArray = newData[sectionId].filter((_: any, i: number) => i !== index);
          newData[sectionId] = newArray;
          console.log('[removeArrayItem] New array length:', newArray.length);
        }
        return newData;
      });
    }
  };

  // Masquer/afficher un élément du tableau
  const toggleArrayItemVisibility = (sectionId: string, index: number) => {
    console.log('[toggleArrayItemVisibility] sectionId:', sectionId, 'index:', index);
    updateCurrentData((prev: any) => {
      const newData = { ...prev };
      if (newData[sectionId] && Array.isArray(newData[sectionId]) && newData[sectionId][index]) {
        // Créer une copie du tableau
        const newArray = [...newData[sectionId]];
        // Modifier l'élément avec toggle hidden
        newArray[index] = {
          ...newArray[index],
          hidden: !newArray[index].hidden
        };
        newData[sectionId] = newArray;
        console.log('[toggleArrayItemVisibility] New hidden value:', newArray[index].hidden);
      }
      return newData;
    });
  };

  const renderField = (sectionId: string, field: any, value: any, index?: number) => {
    const fieldId = field.id;
    const dataSource = getCurrentData();
    let fieldValue: any;

    if (index !== undefined) {
      fieldValue = dataSource[sectionId]?.[index]?.[fieldId] || '';
    } else if (fieldId.includes('.')) {
      fieldValue = getNestedValue(`${sectionId}.${fieldId}`);
    } else {
      fieldValue = dataSource[sectionId]?.[fieldId] || '';
    }

    if (field.type === 'image') {
      return (
        <div key={fieldId} className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <ImageIcon className="w-3 h-3 text-[var(--gold)]" />
            {field.label}
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="URL de l'image ou cliquer sur 'Choisir'"
              value={fieldValue}
              onChange={(e) => {
                const value = e.target.value;
                if (index !== undefined) {
                  updateCurrentData((prev: any) => {
                    const newData = { ...prev };
                    if (!newData[sectionId]) newData[sectionId] = [];
                    if (!newData[sectionId][index]) newData[sectionId][index] = {};
                    newData[sectionId][index][fieldId] = value;
                    return newData;
                  });
                } else if (fieldId.includes('.')) {
                  updateNestedValue(`${sectionId}.${fieldId}`, value);
                } else {
                  updateCurrentData((prev: any) => ({
                    ...prev,
                    [sectionId]: {
                      ...prev[sectionId],
                      [fieldId]: value,
                    },
                  }));
                }
              }}
              className="flex-1 text-sm"
              size={1}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentImageField({ sectionId, fieldId, index });
                setImageSelectorOpen(true);
              }}
              className="text-xs whitespace-nowrap"
            >
              📁 Choisir
            </Button>
            {fieldValue && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (index !== undefined) {
                    updateCurrentData((prev: any) => {
                      const newData = { ...prev };
                      if (newData[sectionId]?.[index]) {
                        delete newData[sectionId][index][fieldId];
                      }
                      return newData;
                    });
                  } else if (fieldId.includes('.')) {
                    updateNestedValue(`${sectionId}.${fieldId}`, '');
                  } else {
                    updateCurrentData((prev: any) => ({
                      ...prev,
                      [sectionId]: {
                        ...prev[sectionId],
                        [fieldId]: '',
                      },
                    }));
                  }
                }}
                className="text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {fieldValue && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image src={fieldValue} alt={field.label} fill className="object-cover" />
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      // Simuler l'état de traduction pour le visuel (sera remplacé par la vraie logique)
      const isTextareaLocked = false; // TODO: lire depuis _meta.locked
      const showTextareaTranslateButton = isMultilingual && currentLang !== 'fr';

      return (
        <div key={fieldId} className={`space-y-2 ${isTextareaLocked ? 'bg-amber-50/50 p-3 rounded-lg border border-amber-200' : ''}`}>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Type className="w-3 h-3 text-[var(--gold)]" />
              {field.label}
              {/* Badge verrouillé */}
              {showTextareaTranslateButton && isTextareaLocked && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Verrouillé
                </span>
              )}
            </label>
            {/* Bouton traduire pour textarea */}
            {showTextareaTranslateButton && !isTextareaLocked && (
              <button
                type="button"
                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs font-medium flex items-center gap-1 transition-colors border border-blue-200"
                title={fieldValue ? "Re-traduire depuis le français" : "Traduire depuis le français"}
              >
                <Languages className="w-3 h-3" />
                {fieldValue ? 'Re-traduire' : 'Traduire'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {/* Bouton verrouiller/déverrouiller - visible uniquement sur EN/ES/HE */}
            {showTextareaTranslateButton && (
              <button
                type="button"
                className={`p-2 rounded-lg transition-colors border self-start ${
                  isTextareaLocked
                    ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
                }`}
                title={isTextareaLocked ? "Déverrouiller (permettre la traduction auto)" : "Verrouiller (protéger de la traduction auto)"}
              >
                {isTextareaLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            )}
            <Textarea
              value={fieldValue}
              onChange={(e) => {
                if (index !== undefined) {
                  updateCurrentData((prev: any) => {
                    const newData = { ...prev };
                    if (!newData[sectionId]) newData[sectionId] = [];
                    if (!newData[sectionId][index]) newData[sectionId][index] = {};
                    newData[sectionId][index][fieldId] = e.target.value;
                    return newData;
                  });
                } else if (fieldId.includes('.')) {
                  updateNestedValue(`${sectionId}.${fieldId}`, e.target.value);
                } else {
                  updateCurrentData((prev: any) => ({
                    ...prev,
                    [sectionId]: {
                      ...prev[sectionId],
                      [fieldId]: e.target.value,
                    },
                  }));
                }
              }}
              rows={3}
              className={`flex-1 text-sm ${isTextareaLocked ? 'border-amber-300' : ''}`}
              placeholder={showTextareaTranslateButton ? `Traduction ${currentLang.toUpperCase()} de "${field.label}"` : field.placeholder}
            />
          </div>
          {/* Afficher le texte français de référence */}
          {showTextareaTranslateButton && (
            <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border-l-2 border-gray-200">
              <span className="font-medium text-gray-500">🇫🇷 FR :</span> {field.placeholder || '(texte français non défini)'}
            </div>
          )}
        </div>
      );
    }

    // Simuler l'état de traduction pour le visuel (sera remplacé par la vraie logique)
    const isLocked = false; // TODO: lire depuis _meta.locked
    const isTranslatedAuto = false; // TODO: lire depuis _meta
    const showTranslateButton = isMultilingual && currentLang !== 'fr' && field.type === 'text';

    return (
      <div key={fieldId} className={`space-y-2 ${isLocked ? 'bg-amber-50/50 p-3 rounded-lg border border-amber-200' : ''}`}>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            {field.type === 'number' ? (
              <Hash className="w-3 h-3 text-[var(--gold)]" />
            ) : (
              <Type className="w-3 h-3 text-[var(--gold)]" />
            )}
            {field.label}
            {/* Badge verrouillé */}
            {showTranslateButton && isLocked && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Verrouillé
              </span>
            )}
          </label>
          {/* Indicateur de statut */}
          {showTranslateButton && fieldValue && !isLocked && (
            <span className="text-xs flex items-center gap-1 text-gray-400">
              {isTranslatedAuto ? (
                <>
                  <RefreshCw className="w-3 h-3" />
                  Traduit auto
                </>
              ) : null}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {/* Bouton verrouiller/déverrouiller - visible uniquement sur EN/HE */}
          {showTranslateButton && (
            <button
              type="button"
              className={`p-2 rounded-lg transition-colors border ${
                isLocked
                  ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
                  : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
              }`}
              title={isLocked ? "Déverrouiller (permettre la traduction auto)" : "Verrouiller (protéger de la traduction auto)"}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          )}
          <Input
            type={field.type === 'number' ? 'number' : 'text'}
            value={fieldValue}
            onChange={(e) => {
              const value = field.type === 'number' ? Number(e.target.value) : e.target.value;
              if (index !== undefined) {
                updateCurrentData((prev: any) => {
                  const newData = { ...prev };
                  if (!newData[sectionId]) newData[sectionId] = [];
                  if (!newData[sectionId][index]) newData[sectionId][index] = {};
                  newData[sectionId][index][fieldId] = value;
                  return newData;
                });
              } else if (fieldId.includes('.')) {
                updateNestedValue(`${sectionId}.${fieldId}`, value);
              } else {
                updateCurrentData((prev: any) => ({
                  ...prev,
                  [sectionId]: {
                    ...prev[sectionId],
                    [fieldId]: value,
                  },
                }));
              }
            }}
            className={`flex-1 text-sm ${isLocked ? 'border-amber-300' : ''}`}
            placeholder={showTranslateButton ? `Traduction ${currentLang.toUpperCase()} de "${field.label}"` : field.placeholder}
          />
          {/* Bouton traduire - visible uniquement sur EN/HE et si non verrouillé */}
          {showTranslateButton && !isLocked && (
            <button
              type="button"
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-blue-200"
              title={fieldValue ? "Re-traduire depuis le français" : "Traduire depuis le français"}
            >
              <Languages className="w-4 h-4" />
              {fieldValue ? 'Re-traduire' : 'Traduire'}
            </button>
          )}
        </div>
        {/* Afficher le texte français de référence */}
        {showTranslateButton && (
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border-l-2 border-gray-200">
            <span className="font-medium text-gray-500">🇫🇷 FR :</span> {field.placeholder || '(texte français non défini)'}
          </div>
        )}
      </div>
    );
  };

  const activeSection = config.sections.find((s: any) => s.id === activeTab);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-2">Page non trouvée</p>
          <p className="text-sm text-gray-400">La page "{pageId}" n'existe pas dans la configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ImageSelector
        isOpen={imageSelectorOpen}
        onClose={() => {
          setImageSelectorOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelect}
        currentImageUrl={
          currentImageField
            ? (currentImageField.index !== undefined
                ? getCurrentData()[currentImageField.sectionId]?.[currentImageField.index]?.[currentImageField.fieldId]
                : currentImageField.fieldId.includes('.')
                ? getNestedValue(`${currentImageField.sectionId}.${currentImageField.fieldId}`)
                : getCurrentData()[currentImageField.sectionId]?.[currentImageField.fieldId])
            : null
        }
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="text-3xl flex-shrink-0">{config.icon}</div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{config.title}</h1>
                <p className="text-xs text-gray-500 mt-0.5">Modifiez le contenu de cette page</p>
              </div>
            </div>

            {/* Bouton SAUVEGARDER - toujours présent, décalé à gauche */}
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="btn-gold-primary h-10 px-8 text-base shadow-lg hover:shadow-xl transition-all flex-shrink-0 whitespace-nowrap mr-4 flex flex-row items-center gap-2 rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4 flex-shrink-0" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>

            {/* Sélecteur de langues - AU MILIEU */}
            {isMultilingual && (
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                      ${currentLang === lang.code
                        ? 'bg-white text-[var(--gold)] shadow-sm border border-[var(--gold)]/20'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Boutons de traduction - À DROITE */}
            {isMultilingual && (
              <>
                {currentLang !== 'fr' ? (
                  /* Sur EN/ES/HE : bouton pour traduire les champs vides uniquement */
                  <button
                    type="button"
                    onClick={async () => {
                      const langLabel = LANGUAGES.find(l => l.code === currentLang)?.label || currentLang;
                      if (window.confirm(`⚠️ Traduire les champs vides en ${langLabel} ?\n\nCette action va traduire automatiquement depuis le français tous les champs qui sont actuellement vides.\n\nLes champs déjà remplis ne seront pas modifiés.`)) {
                        try {
                          setLoading(true);
                          const response = await fetch('/api/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ pageId, targetLangs: [currentLang] }),
                          });
                          const result = await response.json();
                          if (response.ok && result.success) {
                            alert(`✅ Traduction en ${langLabel} terminée !\n\nRechargez la page pour voir les changements.`);
                            window.location.reload();
                          } else {
                            alert(`❌ Erreur de traduction: ${result.error || 'Erreur inconnue'}`);
                          }
                        } catch (error) {
                          console.error('Translation error:', error);
                          alert(`❌ Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    disabled={loading}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-blue-300 disabled:opacity-50"
                    title="Traduire les champs vides depuis le français (ne touche pas aux champs déjà remplis)"
                  >
                    <Languages className="w-4 h-4" />
                    {loading ? 'Traduction...' : 'Traduire vides'}
                  </button>
                ) : (
                  /* Sur FR : bouton pour forcer la re-traduction de TOUT (y compris verrouillés) */
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm(`⚠️ ATTENTION : Re-traduction forcée !\n\nCette action va :\n• Déverrouiller TOUS les champs verrouillés\n• Re-traduire TOUS les champs EN, ES et HE\n• Écraser toutes les traductions manuelles\n\nÀ utiliser uniquement après une grosse modification du contenu français.\n\nÊtes-vous sûr de vouloir continuer ?`)) {
                        try {
                          setLoading(true);
                          const response = await fetch('/api/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ pageId, targetLangs: ['en', 'es', 'he'] }),
                          });
                          const result = await response.json();
                          if (response.ok && result.success) {
                            alert(`✅ Re-traduction forcée terminée !\n\nLangues traduites: EN, ES, HE\n\nRechargez la page pour voir les changements.`);
                            window.location.reload();
                          } else {
                            alert(`❌ Erreur de traduction: ${result.error || 'Erreur inconnue'}`);
                          }
                        } catch (error) {
                          console.error('Translation error:', error);
                          alert(`❌ Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    disabled={loading}
                    className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-orange-300 disabled:opacity-50"
                    title="Forcer la re-traduction de TOUS les champs EN/ES/HE (y compris les champs verrouillés)"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {loading ? 'Traduction...' : 'Forcer re-trad.'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Onglets horizontaux */}
      <div className="sticky top-[65px] z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {config.sections.map((section: any) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  transition-all border-b-2
                  ${activeTab === section.id
                    ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu de la section active */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Indicateur de langue actuelle pour les pages multilingues */}
        {isMultilingual && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-gray-600">Vous éditez le contenu en :</span>
              <span className="font-semibold text-[var(--gold)]">
                {LANGUAGES.find(l => l.code === currentLang)?.flag} {LANGUAGES.find(l => l.code === currentLang)?.label}
              </span>
            </div>
            {currentLang === 'fr' ? (
              <p className="text-xs text-gray-500 mt-2">
                💡 <strong>Important :</strong> Quand vous sauvegardez en français, les traductions automatiques seront générées pour EN, ES et HE (sauf pour les champs verrouillés).
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                💡 Les champs vides utiliseront automatiquement la version française. Utilisez le cadenas 🔒 pour protéger vos traductions manuelles.
              </p>
            )}
          </div>
        )}

        {activeSection && (
          <div className="space-y-6">
            {activeSection.type === 'object' && (
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{activeSection.icon}</span>
                    <span>{activeSection.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeSection.fields.map((field: any) => renderField(activeSection.id, field, undefined))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection.type === 'array' && (
              <div className="space-y-4">
                {/* Grille sur plusieurs lignes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(getCurrentData()[activeSection.id] || []).map((item: any, index: number) => {
                    const isHidden = item?.hidden === true;
                    return (
                      <Card key={index} className={`border-2 shadow-lg transition-all ${isHidden ? 'border-red-300 bg-red-50/30 opacity-60' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b">
                          <div className="flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-[var(--gold)]" />
                            <span className="text-base font-semibold">Élément {index + 1}</span>
                            {isHidden && <span className="text-xs text-red-500 font-normal">(masqué)</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Bouton Masquer/Afficher */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleArrayItemVisibility(activeSection.id, index);
                              }}
                              className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${isHidden ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                              title={isHidden ? 'Afficher cet élément' : 'Masquer cet élément'}
                            >
                              {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            {/* Bouton Supprimer */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeArrayItem(activeSection.id, index);
                              }}
                              className="h-8 w-8 rounded-md flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
                              title="Supprimer cet élément"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <CardContent className="space-y-4 pt-4 max-h-[500px] overflow-y-auto">
                          {activeSection.itemFields.map((field: any) => renderField(activeSection.id, field, item, index))}
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {/* Bouton ajouter */}
                  <Card className="border-2 border-dashed border-[var(--gold)]/30 flex items-center justify-center hover:border-[var(--gold)] transition-all cursor-pointer bg-gray-50 min-h-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => addArrayItem(activeSection.id, activeSection.itemFields)}
                      className="w-full h-full flex flex-col items-center justify-center gap-2 py-8"
                    >
                      <Plus className="w-8 h-8 text-[var(--gold)]" />
                      <span className="text-sm font-medium text-gray-700">Ajouter un élément</span>
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
