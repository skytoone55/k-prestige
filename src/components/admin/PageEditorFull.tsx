'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Upload, X, Plus, Trash2, Edit3, Image as ImageIcon, Type, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
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
  'pessah-2026': {
    title: 'Pessah 2026 (Index)',
    icon: '✡️',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        icon: '🎬',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre principal', type: 'text', placeholder: 'PESSAH 2026' },
          { id: 'location', label: 'Localisation', type: 'text', placeholder: 'Cabogata Beach Hotel 5★ • Espagne' },
          { id: 'dates', label: 'Dates', type: 'text', placeholder: '31 Mars - 10 Avril 2026' },
          { id: 'image', label: 'Image hero', type: 'image' },
        ],
      },
      {
        id: 'hotel',
        title: 'Section Hôtel',
        icon: '🏨',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text', placeholder: 'Cabogata Beach Hotel 5★' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'image', label: 'Image hôtel', type: 'image' },
        ],
      },
      {
        id: 'features',
        title: 'Caractéristiques Hôtel',
        icon: '✓',
        type: 'array',
        itemFields: [
          { id: 'text', label: 'Texte', type: 'text' },
        ],
      },
      {
        id: 'bandeaux',
        title: 'Bandeaux Photos',
        icon: '🖼️',
        type: 'array',
        itemFields: [
          { id: 'image', label: 'Image', type: 'image' },
          { id: 'caption', label: 'Légende', type: 'text' },
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
          { id: 'title', label: 'Titre kashrout', type: 'text' },
          { id: 'rav', label: 'Nom du Rav', type: 'text' },
        ],
      },
      {
        id: 'animation',
        title: 'Animation',
        icon: '🎵',
        type: 'array',
        itemFields: [
          { id: 'name', label: 'Nom', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'icon', label: 'Emoji icône', type: 'text', placeholder: '🎵' },
        ],
      },
      {
        id: 'cta',
        title: 'Section CTA',
        icon: '📞',
        type: 'object',
        fields: [
          { id: 'title', label: 'Titre', type: 'text' },
          { id: 'button_text', label: 'Texte bouton', type: 'text' },
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

export function PageEditorFull({ pageId }: PageEditorFullProps) {
  const config = pageConfigs[pageId];
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionId: string, fieldId: string, index?: number} | null>(null);

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
      // Charger UNIQUEMENT depuis Supabase - PAS de localStorage
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content`,
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
        if (result && result[0]?.content) {
          console.log('[PageEditorFull] ✅ Loaded from Supabase');
          setData(result[0].content);
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

      console.log('[PageEditorFull] Saving to Supabase...', {
        pageId,
        dataKeys: Object.keys(data),
        heroTitle: data?.hero?.title
      });

      const { data: upsertResult, error } = await supabase
        .from('page_content')
        .upsert(
          {
            page_id: pageId,
            content: data,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'page_id' }
        )
        .select();

      console.log('[PageEditorFull] Supabase upsert result:', {
        result: upsertResult,
        error: error?.message || null
      });

      if (error) {
        console.error('[PageEditorFull] ❌ Erreur Supabase:', error);
        alert('❌ Erreur Supabase: ' + error.message);
      } else {
        // Vérifier que la sauvegarde a bien fonctionné en relisant
        const { data: verifyData, error: verifyError } = await supabase
          .from('page_content')
          .select('content')
          .eq('page_id', pageId)
          .single();

        console.log('[PageEditorFull] Verification read:', {
          success: !verifyError,
          heroTitle: verifyData?.content?.hero?.title,
          error: verifyError?.message || null
        });

        alert('✅ Contenu sauvegardé avec succès dans Supabase !');
      }
    } catch (error) {
      console.error('[PageEditorFull] ❌ Erreur:', error);
      alert('❌ Erreur de connexion: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }

    setLoading(false);
  };

  const updateNestedValue = (path: string, value: any) => {
    const keys = path.split('.');
    setData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const getNestedValue = (path: string) => {
    const keys = path.split('.');
    let current = data;
    for (const key of keys) {
      if (!current || typeof current !== 'object') return '';
      current = current[key];
    }
    return current || '';
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!currentImageField) return;
    
    const { sectionId, fieldId, index } = currentImageField;
    
    if (index !== undefined) {
      setData((prev: any) => {
        const newData = { ...prev };
        if (!newData[sectionId]) newData[sectionId] = [];
        if (!newData[sectionId][index]) newData[sectionId][index] = {};
        newData[sectionId][index][fieldId] = imageUrl;
        return newData;
      });
    } else if (fieldId.includes('.')) {
      updateNestedValue(`${sectionId}.${fieldId}`, imageUrl);
    } else {
      setData((prev: any) => ({
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
    setData((prev: any) => {
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      setData((prev: any) => {
        const newData = { ...prev };
        if (newData[sectionId] && Array.isArray(newData[sectionId])) {
          newData[sectionId] = newData[sectionId].filter((_: any, i: number) => i !== index);
        }
        return newData;
      });
    }
  };

  const renderField = (sectionId: string, field: any, value: any, index?: number) => {
    const fieldId = field.id;
    let fieldValue: any;
    
    if (index !== undefined) {
      fieldValue = data[sectionId]?.[index]?.[fieldId] || '';
    } else if (fieldId.includes('.')) {
      fieldValue = getNestedValue(`${sectionId}.${fieldId}`);
    } else {
      fieldValue = data[sectionId]?.[fieldId] || '';
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
                  setData((prev: any) => {
                    const newData = { ...prev };
                    if (!newData[sectionId]) newData[sectionId] = [];
                    if (!newData[sectionId][index]) newData[sectionId][index] = {};
                    newData[sectionId][index][fieldId] = value;
                    return newData;
                  });
                } else if (fieldId.includes('.')) {
                  updateNestedValue(`${sectionId}.${fieldId}`, value);
                } else {
                  setData((prev: any) => ({
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
                    setData((prev: any) => {
                      const newData = { ...prev };
                      if (newData[sectionId]?.[index]) {
                        delete newData[sectionId][index][fieldId];
                      }
                      return newData;
                    });
                  } else if (fieldId.includes('.')) {
                    updateNestedValue(`${sectionId}.${fieldId}`, '');
                  } else {
                    setData((prev: any) => ({
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
      return (
        <div key={fieldId} className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Type className="w-3 h-3 text-[var(--gold)]" />
            {field.label}
          </label>
          <Textarea
            value={fieldValue}
            onChange={(e) => {
              if (index !== undefined) {
                setData((prev: any) => {
                  const newData = { ...prev };
                  if (!newData[sectionId]) newData[sectionId] = [];
                  if (!newData[sectionId][index]) newData[sectionId][index] = {};
                  newData[sectionId][index][fieldId] = e.target.value;
                  return newData;
                });
              } else if (fieldId.includes('.')) {
                updateNestedValue(`${sectionId}.${fieldId}`, e.target.value);
              } else {
                setData((prev: any) => ({
                  ...prev,
                  [sectionId]: {
                    ...prev[sectionId],
                    [fieldId]: e.target.value,
                  },
                }));
              }
            }}
            rows={3}
            className="w-full text-sm"
            placeholder={field.placeholder}
          />
        </div>
      );
    }

    return (
      <div key={fieldId} className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          {field.type === 'number' ? (
            <Hash className="w-3 h-3 text-[var(--gold)]" />
          ) : (
            <Type className="w-3 h-3 text-[var(--gold)]" />
          )}
          {field.label}
        </label>
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={fieldValue}
          onChange={(e) => {
            const value = field.type === 'number' ? Number(e.target.value) : e.target.value;
            if (index !== undefined) {
              setData((prev: any) => {
                const newData = { ...prev };
                if (!newData[sectionId]) newData[sectionId] = [];
                if (!newData[sectionId][index]) newData[sectionId][index] = {};
                newData[sectionId][index][fieldId] = value;
                return newData;
              });
            } else if (fieldId.includes('.')) {
              updateNestedValue(`${sectionId}.${fieldId}`, value);
            } else {
              setData((prev: any) => ({
                ...prev,
                [sectionId]: {
                  ...prev[sectionId],
                  [fieldId]: value,
                },
              }));
            }
          }}
          className="w-full text-sm"
          placeholder={field.placeholder}
        />
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
                ? data[currentImageField.sectionId]?.[currentImageField.index]?.[currentImageField.fieldId]
                : currentImageField.fieldId.includes('.')
                ? getNestedValue(`${currentImageField.sectionId}.${currentImageField.fieldId}`)
                : data[currentImageField.sectionId]?.[currentImageField.fieldId])
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
            <Button
              onClick={handleSave}
              disabled={loading}
              className="btn-gold-primary h-10 px-5 text-base shadow-lg hover:shadow-xl transition-all flex-shrink-0 inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Save className="w-4 h-4 flex-shrink-0" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
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
                  {(data[activeSection.id] || []).map((item: any, index: number) => (
                    <Card key={index} className="border-2 border-gray-200 shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-[var(--gold)]" />
                          Élément {index + 1}
                        </CardTitle>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(activeSection.id, index)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4 max-h-[500px] overflow-y-auto">
                        {activeSection.itemFields.map((field: any) => renderField(activeSection.id, field, item, index))}
                      </CardContent>
                    </Card>
                  ))}
                  
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
