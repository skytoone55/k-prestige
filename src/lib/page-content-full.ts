// Contenu complet par défaut pour TOUTES les pages - Extrait du code réel

export const fullPageContent: Record<string, any> = {
  'accueil': {
    hero: {
      subtitle: 'Expérience Premium',
      title: 'PESSAH 2026',
      location: 'Cabogata Beach Hotel 5★ • Espagne',
      date: '31 MARS - 10 AVRIL',
      image: '/images/hero/PANORAMIC.jpg',
      animation_text: 'Animation non-stop par Laurent Folies Musical Band × Yonni Chemla DJ Live',
    },
    univers: [
      {
        title: 'Séjours Pessah',
        description: 'Vivez des fêtes inoubliables dans les plus beaux hôtels',
        image: '/images/hero/PANORAMIC.jpg',
        href: '/pessah-2026/sejour',
      },
      {
        title: 'El Dorado Marbella',
        description: 'Restaurant casher & traiteur événementiel',
        image: '/images/restaurant/marbella-lamb.jpg',
        href: '/marbella',
      },
      {
        title: 'Traiteur Marrakech',
        description: 'Traiteur casher pour vos événements au Maroc',
        image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
        href: '/marrakech',
      },
      {
        title: 'Hilloula',
        description: 'Pèlerinages sur les tombes des Tsadikim',
        image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80',
        href: '/hilloula',
      },
      {
        title: 'Arba Minim',
        description: 'Loulav & Etrog de qualité pour Souccot',
        image: '/images/souccot/arba-minim.jpg',
        href: '/soucott',
      },
    ],
    stats: [
      { value: 7000, suffix: '+', label: 'Familles accompagnées' },
      { value: 10, suffix: ' ans', label: "D'expérience" },
      { value: 15, suffix: '+', label: 'Destinations' },
      { value: 100, suffix: '%', label: 'Kashrout certifiée' },
    ],
    testimonials: [
      {
        name: 'Sarah M.',
        location: 'Paris',
        text: 'Un séjour exceptionnel pour Pessah 2025. L\'organisation était parfaite, la kashrout irréprochable, et l\'animation de qualité. Nous reviendrons !',
        rating: 5,
      },
      {
        name: 'David L.',
        location: 'Lyon',
        text: 'K Prestige a organisé notre mariage à Marrakech. Service au top, cuisine délicieuse, et équipe très professionnelle. Je recommande vivement.',
        rating: 5,
      },
      {
        name: 'Rivka K.',
        location: 'Strasbourg',
        text: 'Notre pèlerinage Hilloula était magnifique. Tout était bien organisé, les repas excellents, et l\'ambiance spirituelle au rendez-vous. Merci !',
        rating: 5,
      },
    ],
    cta: {
      subtitle: 'Prêt à vivre l\'expérience K Prestige ?',
      title: 'Contactez-nous dès aujourd\'hui',
      description: 'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans l\'organisation de votre événement.',
      button1_text: 'Demander un devis',
      button2_text: 'Nous contacter sur WhatsApp',
    },
  },
  'pessah-sejour': {
    hero: {
      subtitle: 'Séjour Premium',
      title: 'Le Séjour',
      description: 'Pessah 2026 • Cabogata Beach Hotel 5★',
      image: '/images/hero/PANORAMIC VIEW.jpg',
    },
    dates: {
      principal: {
        title: 'Séjour Principal',
        date: '31 Mars - 10 Avril 2026',
        nights: '10 nuits',
      },
      weekend: {
        title: 'Weekend Prolongé',
        date: '10 - 12 Avril 2026',
        nights: '+2 nuits (optionnel)',
      },
    },
    supervision: {
      title: 'Glatt Kasher Laméhadrine',
      rav: 'Rav Mordehai Cohen de Malaga',
      viandes: 'Viandes sous surveillance Rav Ephraïm Cremisi',
    },
    animations: [
      {
        name: 'Laurent Folies Musical Band',
        description: '@laurentfolies',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        instagram: 'https://www.instagram.com/laurentfolies',
      },
      {
        name: 'Yonni Chemla DJ Live',
        description: '@yonnichemla',
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80',
        instagram: 'https://www.instagram.com/yonnichemla',
      },
      {
        name: 'Avi Ohayon',
        description: 'Rabbin & Paytan',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        instagram: null,
      },
      {
        name: 'Gueoula Animation',
        description: 'Animation Enfants',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        instagram: 'https://www.instagram.com/gueoula_animation',
      },
    ],
  },
  'pessah-hotel': {
    hero: {
      subtitle: 'Hôtel 5 Étoiles',
      title: 'L\'Hôtel',
      description: 'Cabogata Beach Hotel 5★ • El Toyo - Retamar, Almería',
      image: '/images/hotel/FAÇADE.jpg',
    },
    hotel: {
      name: 'Cabogata Beach Hotel 5★',
      location: 'El Toyo - Retamar, Almería, Espagne',
      description: 'Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026',
    },
    chambres: [
      { code: 'S', nom: 'Superior', surface: '27m²', vue: 'Jardins/Montagnes' },
      { code: 'P', nom: 'Premium Vue Mer', surface: '27m²', vue: 'Mer' },
      { code: 'EC', nom: 'Exclusive Communicantes', surface: '35m²', vue: 'Montagnes', special: 'Communicante' },
      { code: 'ACC', nom: 'Exclusive Adaptées', surface: '35m²', vue: 'RDC', special: 'PMR' },
      { code: 'ECV', nom: 'Exclusive Comm. Vue Mer', surface: '35m²', vue: 'Mer', special: 'Communicante' },
      { code: 'EVM', nom: 'Exclusive Vue Mer', surface: '35m²', vue: 'Mer' },
      { code: 'SSU', nom: 'Junior Suite Comm.', surface: '70-80m²', vue: 'Variable', special: 'Suite, Communicante' },
      { code: 'TSU', nom: 'Terrace Suite', surface: '43-70m²', vue: 'Mer', special: 'Suite, Terrasse' },
      { code: 'MED', nom: 'Mediterranean Suite', surface: '66-84m²', vue: 'Mer', special: 'Suite Premium' },
    ],
  },
  'marbella': {
    hero: {
      subtitle: 'Restaurant Casher',
      title: 'El Dorado',
      location: 'Marbella, Espagne',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    },
    main: {
      title: 'Restaurant Casher Permanent',
      description: 'El Dorado est un restaurant casher permanent situé à Marbella, ouvert toute l\'année.\nCuisine viande, hamburgers, salades, grillades et tajines.',
      couverts: '70 couverts',
      address: 'Calle del pintor Jose Caballero 32D, 29870 Marbella, Espagne',
      phone: '06 99 95 19 63',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    },
    services: [
      {
        title: 'Restaurant',
        desc: 'Réservations de tables pour déjeuner et dîner',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      },
      {
        title: 'Traiteur Événementiel',
        desc: 'Mariages, Bar-mitzvahs, Shabbat, Hilloula, Réceptions',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      },
      {
        title: 'Privatisation',
        desc: 'Privatisation complète du restaurant pour vos événements',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      },
    ],
    cta: {
      title: 'Intéressé par nos services ?',
      description: 'Contactez-nous pour une réservation ou un devis personnalisé',
      button1_text: 'Nous contacter',
      button2_text: 'WhatsApp',
    },
  },
  'marrakech': {
    hero: {
      subtitle: 'Service Traiteur',
      title: 'Marrakech',
      description: 'Traiteur casher pour vos événements au Maroc',
      image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
    },
    main: {
      title: 'Traiteur Événementiel',
      description: 'Service traiteur sur demande pour vos événements dans tout le Maroc. Disponible sur demande pour tous vos événements.\n\nNous proposons une cuisine casher de qualité pour tous vos événements importants, partout au Maroc.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    },
  },
  'hilloula': {
    hero: {
      subtitle: 'Pèlerinages Spirituels',
      title: 'Hilloula',
      description: 'Pèlerinages sur les tombes des Tsadikim',
      image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80',
    },
    main: {
      title: 'Voyages Organisés',
      description: 'K Prestige organise des voyages pour pèlerinages sur tombes de Tsadikim plusieurs fois par an, vers différentes destinations.',
    },
  },
  'souccot': {
    hero: {
      subtitle: 'E-commerce',
      title: 'Souccot',
      description: 'Loulav & Etrog de qualité pour Souccot',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80',
    },
    main: {
      description: 'Commandez vos Arba Minim (Loulav & Etrog) pour Souccot. Qualité certifiée, livraison rapide.',
    },
  },
  'contact': {
    hero: {
      subtitle: 'Contactez-nous',
      title: 'Contactez-nous',
      description: 'Notre équipe est à votre écoute pour répondre à toutes vos questions',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    },
    contact: {
      phone1: '06 99 95 19 63',
      phone2: '06 51 70 19 78',
      email: 'k-prestige@outlook.fr',
      address: '33 Avenue Philippe Auguste\n75011 Paris, France',
    },
  },
};
