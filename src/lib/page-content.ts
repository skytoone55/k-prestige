// Contenu par défaut extrait des pages existantes

export const defaultPageContent: Record<string, {
  content: Record<string, string>;
  images: Record<string, string>;
}> = {
  'accueil': {
    content: {
      hero_subtitle: 'Expérience Premium',
      hero_title: 'PESSAH 2026',
      hero_location: 'Cabogata Beach Hotel 5★ • Espagne',
      hero_date: '31 MARS - 10 AVRIL',
      animation_text: 'Animation non-stop par Laurent Folies Musical Band × Yonni Chemla DJ Live',
    },
    images: {
      hero_image: '/images/hero/PANORAMIC.jpg',
    },
  },
  'pessah-main': {
    content: {
      hero_title: 'PESSAH 2026',
      hero_location: 'Cabogata Beach Hotel 5★ • Espagne',
      hero_date: '31 Mars - 10 Avril 2026',
      hotel_title: 'Cabogata Beach Hotel 5★',
      hotel_description: 'Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026',
    },
    images: {
      hero_image: '/images/hero/PANORAMIC VIEW.jpg',
      hotel_image: '/images/hotel/FAÇADE.jpg',
    },
  },
  'pessah-sejour': {
    content: {
      hero_subtitle: 'Séjour Premium',
      hero_title: 'Le Séjour',
      hero_description: 'Pessah 2026 • Cabogata Beach Hotel 5★',
      date_principal: '31 Mars - 10 Avril 2026',
      date_weekend: '10 - 12 Avril 2026',
      supervision_title: 'Glatt Kasher Laméhadrine',
      supervision_rav: 'Rav Mordehai Cohen de Malaga',
      supervision_viandes: 'Viandes sous surveillance Rav Ephraïm Cremisi',
    },
    images: {
      hero_image: '/images/hero/PANORAMIC VIEW.jpg',
    },
  },
  'pessah-hotel': {
    content: {
      hero_subtitle: 'Hôtel 5 Étoiles',
      hero_title: 'L\'Hôtel',
      hero_description: 'Cabogata Beach Hotel 5★ • El Toyo - Retamar, Almería',
      hotel_name: 'Cabogata Beach Hotel 5★',
      hotel_location: 'El Toyo - Retamar, Almería, Espagne',
      presentation_text: 'Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026',
    },
    images: {
      hero_image: '/images/hotel/FAÇADE.jpg',
    },
  },
  'marbella': {
    content: {
      hero_subtitle: 'Restaurant Casher',
      hero_title: 'El Dorado',
      hero_location: 'Marbella, Espagne',
      main_title: 'Restaurant Casher Permanent',
      main_description: 'El Dorado est un restaurant casher permanent situé à Marbella, ouvert toute l\'année.\nCuisine viande, hamburgers, salades, grillades et tajines.',
      couverts: '70 couverts',
      address: 'Calle del pintor Jose Caballero 32D, 29870 Marbella, Espagne',
    },
    images: {
      hero_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    },
  },
  'marrakech': {
    content: {
      hero_subtitle: 'Service Traiteur',
      hero_title: 'Marrakech',
      hero_description: 'Traiteur casher pour vos événements au Maroc',
      main_title: 'Traiteur Événementiel',
      presentation_text: 'Service traiteur sur demande pour vos événements dans tout le Maroc. Disponible sur demande pour tous vos événements.\n\nNous proposons une cuisine casher de qualité pour tous vos événements importants, partout au Maroc.',
    },
    images: {
      hero_image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
      presentation_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    },
  },
  'hilloula': {
    content: {
      hero_subtitle: 'Pèlerinages Spirituels',
      hero_title: 'Hilloula',
      hero_description: 'Pèlerinages sur les tombes des Tsadikim',
      main_title: 'Voyages Organisés',
      presentation_text: 'K Prestige organise des voyages pour pèlerinages sur tombes de Tsadikim plusieurs fois par an, vers différentes destinations.',
    },
    images: {
      hero_image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80',
    },
  },
  'souccot': {
    content: {
      hero_subtitle: 'E-commerce',
      hero_title: 'Souccot',
      hero_description: 'Loulav & Etrog de qualité pour Souccot',
      presentation_text: 'Commandez vos Arba Minim (Loulav & Etrog) pour Souccot. Qualité certifiée, livraison rapide.',
    },
    images: {
      hero_image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80',
    },
  },
  'contact': {
    content: {
      hero_subtitle: 'Contactez-nous',
      hero_title: 'Contactez-nous',
      hero_description: 'Notre équipe est à votre écoute pour répondre à toutes vos questions',
      phone1: '06 99 95 19 63',
      phone2: '06 51 70 19 78',
      email: 'k-prestige@outlook.fr',
      address: '33 Avenue Philippe Auguste\n75011 Paris, France',
    },
    images: {
      hero_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    },
  },
};
