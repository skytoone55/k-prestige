/**
 * Fichier de traductions pour K Prestige
 * Langues supportées: FR (Français), EN (English), ES (Español), HE (עברית)
 *
 * Structure: translations[section][key][languageCode]
 */

export type Language = 'fr' | 'en' | 'es' | 'he';

export const LANGUAGES = [
  { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
  { code: 'he' as Language, label: 'עברית', flag: '🇮🇱', rtl: true },
];

export const translations = {
  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    home: {
      fr: 'Accueil',
      en: 'Home',
      es: 'Inicio',
      he: 'בית',
    },
    pessah2026: {
      fr: 'Pessah 2026',
      en: 'Passover 2026',
      es: 'Pésaj 2026',
      he: 'פסח 2026',
    },
    theSejour: {
      fr: 'Le Séjour',
      en: 'The Stay',
      es: 'La Estancia',
      he: 'השהייה',
    },
    theHotel: {
      fr: "L'Hôtel",
      en: 'The Hotel',
      es: 'El Hotel',
      he: 'המלון',
    },
    photoGallery: {
      fr: 'Galerie photos',
      en: 'Photo Gallery',
      es: 'Galería de fotos',
      he: 'גלריית תמונות',
    },
    marbella: {
      fr: 'Marbella',
      en: 'Marbella',
      es: 'Marbella',
      he: 'מרבייה',
    },
    marrakech: {
      fr: 'Marrakech',
      en: 'Marrakech',
      es: 'Marrakech',
      he: 'מרקש',
    },
    hilloula: {
      fr: 'Hilloula',
      en: 'Hilloula',
      es: 'Hilloula',
      he: 'הילולא',
    },
    souccot: {
      fr: 'Soucott',
      en: 'Sukkot',
      es: 'Sucot',
      he: 'סוכות',
    },
    contact: {
      fr: 'Contact',
      en: 'Contact',
      es: 'Contacto',
      he: 'צור קשר',
    },
    login: {
      fr: 'Connexion',
      en: 'Login',
      es: 'Iniciar sesión',
      he: 'התחברות',
    },
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    companyName: {
      fr: 'K PRESTIGE EVENT',
      en: 'K PRESTIGE EVENT',
      es: 'K PRESTIGE EVENT',
      he: 'K PRESTIGE EVENT',
    },
    companyDesc: {
      fr: "Société d'événementiel complète",
      en: 'Complete event management company',
      es: 'Empresa de eventos completa',
      he: 'חברת אירועים מלאה',
    },
    contactTitle: {
      fr: 'Contact',
      en: 'Contact',
      es: 'Contacto',
      he: 'צור קשר',
    },
    infoTitle: {
      fr: 'Informations',
      en: 'Information',
      es: 'Información',
      he: 'מידע',
    },
    navigationTitle: {
      fr: 'Navigation',
      en: 'Navigation',
      es: 'Navegación',
      he: 'ניווט',
    },
    allRightsReserved: {
      fr: '© 2026 K PRESTIGE EVENT. Tous droits réservés.',
      en: '© 2026 K PRESTIGE EVENT. All rights reserved.',
      es: '© 2026 K PRESTIGE EVENT. Todos los derechos reservados.',
      he: '© 2026 K PRESTIGE EVENT. כל הזכויות שמורות.',
    },
  },

  // ============================================
  // CONTACT FORM
  // ============================================
  contactForm: {
    firstName: {
      fr: 'Prénom',
      en: 'First Name',
      es: 'Nombre',
      he: 'שם פרטי',
    },
    lastName: {
      fr: 'Nom',
      en: 'Last Name',
      es: 'Apellido',
      he: 'שם משפחה',
    },
    email: {
      fr: 'Email',
      en: 'Email',
      es: 'Correo electrónico',
      he: 'אימייל',
    },
    phone: {
      fr: 'Téléphone',
      en: 'Phone',
      es: 'Teléfono',
      he: 'טלפון',
    },
    message: {
      fr: 'Message',
      en: 'Message',
      es: 'Mensaje',
      he: 'הודעה',
    },
    send: {
      fr: 'Envoyer le message',
      en: 'Send message',
      es: 'Enviar mensaje',
      he: 'שלח הודעה',
    },
    sending: {
      fr: 'Envoi...',
      en: 'Sending...',
      es: 'Enviando...',
      he: 'שולח...',
    },
    successMessage: {
      fr: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      en: 'Message sent successfully! We will respond as soon as possible.',
      es: '¡Mensaje enviado con éxito! Le responderemos lo antes posible.',
      he: 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.',
    },
    errorMessage: {
      fr: 'Une erreur est survenue. Veuillez réessayer.',
      en: 'An error occurred. Please try again.',
      es: 'Se produjo un error. Por favor, inténtelo de nuevo.',
      he: 'אירעה שגיאה. אנא נסה שוב.',
    },
    required: {
      fr: '(obligatoire)',
      en: '(required)',
      es: '(obligatorio)',
      he: '(חובה)',
    },
  },

  // ============================================
  // DEVIS FORM (Pessah)
  // ============================================
  devisForm: {
    familyComposition: {
      fr: 'Composition de votre famille',
      en: 'Family composition',
      es: 'Composición de su familia',
      he: 'הרכב המשפחה',
    },
    adults: {
      fr: 'Adultes',
      en: 'Adults',
      es: 'Adultos',
      he: 'מבוגרים',
    },
    babies: {
      fr: 'Bébés',
      en: 'Babies',
      es: 'Bebés',
      he: 'תינוקות',
    },
    children2to3: {
      fr: '2-3 ans',
      en: '2-3 years',
      es: '2-3 años',
      he: 'גיל 2-3',
    },
    children4to6: {
      fr: '4-6 ans',
      en: '4-6 years',
      es: '4-6 años',
      he: 'גיל 4-6',
    },
    children7to11: {
      fr: '7-11 ans',
      en: '7-11 years',
      es: '7-11 años',
      he: 'גיל 7-11',
    },
    yourDetails: {
      fr: 'Vos coordonnées',
      en: 'Your details',
      es: 'Sus datos',
      he: 'הפרטים שלך',
    },
    messageOptional: {
      fr: 'Message ou demande particulière (optionnel)',
      en: 'Message or special request (optional)',
      es: 'Mensaje o solicitud especial (opcional)',
      he: 'הודעה או בקשה מיוחדת (אופציונלי)',
    },
    messagePlaceholder: {
      fr: 'Ex: chambre communicante, régime alimentaire...',
      en: 'Ex: connecting room, dietary requirements...',
      es: 'Ej: habitación comunicada, requisitos dietéticos...',
      he: 'לדוגמה: חדרים מחוברים, דרישות תזונתיות...',
    },
    whatsappContact: {
      fr: 'Être recontacté par WhatsApp',
      en: 'Be contacted via WhatsApp',
      es: 'Ser contactado por WhatsApp',
      he: 'צור קשר דרך WhatsApp',
    },
    responseTime: {
      fr: '✓ Réponse sous 24h • ✓ Devis gratuit',
      en: '✓ Response within 24h • ✓ Free quote',
      es: '✓ Respuesta en 24h • ✓ Presupuesto gratuito',
      he: '✓ מענה תוך 24 שעות • ✓ הצעת מחיר חינם',
    },
    receiveQuote: {
      fr: 'Recevoir mon devis',
      en: 'Get my quote',
      es: 'Recibir mi presupuesto',
      he: 'קבל הצעת מחיר',
    },
    sendingInProgress: {
      fr: 'Envoi en cours...',
      en: 'Sending...',
      es: 'Enviando...',
      he: 'שולח...',
    },
    successTitle: {
      fr: 'Demande envoyée avec succès !',
      en: 'Request sent successfully!',
      es: '¡Solicitud enviada con éxito!',
      he: 'הבקשה נשלחה בהצלחה!',
    },
    successDesc: {
      fr: 'Nous vous répondrons sous 24h avec votre devis personnalisé.',
      en: 'We will respond within 24 hours with your personalized quote.',
      es: 'Le responderemos en 24 horas con su presupuesto personalizado.',
      he: 'נחזור אליך תוך 24 שעות עם הצעת מחיר מותאמת אישית.',
    },
    makeAnotherRequest: {
      fr: 'Faire une autre demande',
      en: 'Make another request',
      es: 'Hacer otra solicitud',
      he: 'שלח בקשה נוספת',
    },
  },

  // ============================================
  // VALIDATION MESSAGES
  // ============================================
  validation: {
    nameRequired: {
      fr: 'Le nom est requis.',
      en: 'Name is required.',
      es: 'El nombre es obligatorio.',
      he: 'השם נדרש.',
    },
    firstNameRequired: {
      fr: 'Le prénom est requis.',
      en: 'First name is required.',
      es: 'El nombre es obligatorio.',
      he: 'שם פרטי נדרש.',
    },
    phoneRequired: {
      fr: 'Le numéro de téléphone est requis.',
      en: 'Phone number is required.',
      es: 'El número de teléfono es obligatorio.',
      he: 'מספר טלפון נדרש.',
    },
    emailInvalid: {
      fr: 'Adresse email invalide.',
      en: 'Invalid email address.',
      es: 'Dirección de correo electrónico inválida.',
      he: 'כתובת אימייל לא תקינה.',
    },
  },

  // ============================================
  // COMMON BUTTONS & ACTIONS
  // ============================================
  common: {
    submit: {
      fr: 'Envoyer',
      en: 'Submit',
      es: 'Enviar',
      he: 'שלח',
    },
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      es: 'Cancelar',
      he: 'ביטול',
    },
    save: {
      fr: 'Sauvegarder',
      en: 'Save',
      es: 'Guardar',
      he: 'שמור',
    },
    close: {
      fr: 'Fermer',
      en: 'Close',
      es: 'Cerrar',
      he: 'סגור',
    },
    back: {
      fr: 'Retour',
      en: 'Back',
      es: 'Volver',
      he: 'חזור',
    },
    next: {
      fr: 'Suivant',
      en: 'Next',
      es: 'Siguiente',
      he: 'הבא',
    },
    previous: {
      fr: 'Précédent',
      en: 'Previous',
      es: 'Anterior',
      he: 'הקודם',
    },
    learnMore: {
      fr: 'En savoir plus',
      en: 'Learn more',
      es: 'Saber más',
      he: 'למד עוד',
    },
    seeMore: {
      fr: 'Voir plus',
      en: 'See more',
      es: 'Ver más',
      he: 'ראה עוד',
    },
    bookNow: {
      fr: 'Réserver maintenant',
      en: 'Book now',
      es: 'Reservar ahora',
      he: 'הזמן עכשיו',
    },
    contactUs: {
      fr: 'Nous contacter',
      en: 'Contact us',
      es: 'Contáctenos',
      he: 'צור קשר',
    },
    loading: {
      fr: 'Chargement...',
      en: 'Loading...',
      es: 'Cargando...',
      he: 'טוען...',
    },
    error: {
      fr: 'Erreur',
      en: 'Error',
      es: 'Error',
      he: 'שגיאה',
    },
    success: {
      fr: 'Succès',
      en: 'Success',
      es: 'Éxito',
      he: 'הצלחה',
    },
    yes: {
      fr: 'Oui',
      en: 'Yes',
      es: 'Sí',
      he: 'כן',
    },
    no: {
      fr: 'Non',
      en: 'No',
      es: 'No',
      he: 'לא',
    },
    confirm: {
      fr: 'Confirmer',
      en: 'Confirm',
      es: 'Confirmar',
      he: 'אשר',
    },
  },

  // ============================================
  // HERO / CTA
  // ============================================
  hero: {
    discoverOffer: {
      fr: 'Découvrir notre offre',
      en: 'Discover our offer',
      es: 'Descubrir nuestra oferta',
      he: 'גלה את ההצעה שלנו',
    },
    requestQuote: {
      fr: 'Demander un devis',
      en: 'Request a quote',
      es: 'Solicitar un presupuesto',
      he: 'בקש הצעת מחיר',
    },
  },

  // ============================================
  // WHATSAPP
  // ============================================
  whatsapp: {
    contactVia: {
      fr: 'Contacter sur WhatsApp',
      en: 'Contact via WhatsApp',
      es: 'Contactar por WhatsApp',
      he: 'צור קשר דרך WhatsApp',
    },
  },

  // ============================================
  // DATES & TIME
  // ============================================
  dates: {
    from: {
      fr: 'Du',
      en: 'From',
      es: 'Del',
      he: 'מ-',
    },
    to: {
      fr: 'au',
      en: 'to',
      es: 'al',
      he: 'עד',
    },
    nights: {
      fr: 'nuits',
      en: 'nights',
      es: 'noches',
      he: 'לילות',
    },
    days: {
      fr: 'jours',
      en: 'days',
      es: 'días',
      he: 'ימים',
    },
  },

  // ============================================
  // PRICING
  // ============================================
  pricing: {
    from: {
      fr: 'À partir de',
      en: 'From',
      es: 'Desde',
      he: 'החל מ-',
    },
    perPerson: {
      fr: 'par personne',
      en: 'per person',
      es: 'por persona',
      he: 'לאדם',
    },
    perNight: {
      fr: 'par nuit',
      en: 'per night',
      es: 'por noche',
      he: 'ללילה',
    },
    allInclusive: {
      fr: 'Tout inclus',
      en: 'All inclusive',
      es: 'Todo incluido',
      he: 'הכל כלול',
    },
  },

  // ============================================
  // TESTIMONIALS
  // ============================================
  testimonials: {
    title: {
      fr: 'Témoignages',
      en: 'Testimonials',
      es: 'Testimonios',
      he: 'המלצות',
    },
    subtitle: {
      fr: 'Ce que nos clients disent de nous',
      en: 'What our clients say about us',
      es: 'Lo que dicen nuestros clientes',
      he: 'מה הלקוחות שלנו אומרים עלינו',
    },
  },

  // ============================================
  // 404 / ERROR PAGES
  // ============================================
  errorPages: {
    notFoundTitle: {
      fr: 'Page non trouvée',
      en: 'Page not found',
      es: 'Página no encontrada',
      he: 'הדף לא נמצא',
    },
    notFoundDesc: {
      fr: "La page que vous recherchez n'existe pas ou a été déplacée.",
      en: 'The page you are looking for does not exist or has been moved.',
      es: 'La página que busca no existe o ha sido movida.',
      he: 'הדף שאתה מחפש לא קיים או הועבר.',
    },
    backToHome: {
      fr: "Retour à l'accueil",
      en: 'Back to home',
      es: 'Volver al inicio',
      he: 'חזרה לדף הבית',
    },
  },

  // ============================================
  // HOME PAGE
  // ============================================
  home: {
    ourUniverses: {
      fr: 'Nos Univers',
      en: 'Our Universes',
      es: 'Nuestros Universos',
      he: 'העולמות שלנו',
    },
    discover: {
      fr: 'Découvrez',
      en: 'Discover',
      es: 'Descubra',
      he: 'גלה',
    },
    requestQuote: {
      fr: 'Demander un devis',
      en: 'Request a quote',
      es: 'Solicitar presupuesto',
      he: 'בקש הצעת מחיר',
    },
  },

  // ============================================
  // PESSAH PAGE
  // ============================================
  pessah: {
    pessah2026: {
      fr: 'PESSAH 2026',
      en: 'PASSOVER 2026',
      es: 'PÉSAJ 2026',
      he: 'פסח 2026',
    },
    hotelLocation: {
      fr: 'Cabogata Beach Hotel 5★ • Espagne',
      en: 'Cabogata Beach Hotel 5★ • Spain',
      es: 'Cabogata Beach Hotel 5★ • España',
      he: 'מלון קבוגאטה ביץ\' 5★ • ספרד',
    },
    dateRange: {
      fr: '31 Mars - 10 Avril 2026',
      en: 'March 31 - April 10, 2026',
      es: '31 de Marzo - 10 de Abril 2026',
      he: '31 במרץ - 10 באפריל 2026',
    },
    dateRangeProlonge: {
      fr: '10 - 12 Avril 2026',
      en: 'April 10 - 12, 2026',
      es: '10 - 12 de Abril 2026',
      he: '10-12 באפריל 2026',
    },
    demanderDevis: {
      fr: 'Demander un devis',
      en: 'Request a quote',
      es: 'Solicitar presupuesto',
      he: 'בקש הצעת מחיר',
    },
    sejourPrincipal: {
      fr: 'Séjour Principal',
      en: 'Main Stay',
      es: 'Estancia Principal',
      he: 'שהייה ראשית',
    },
    weekendProlonge: {
      fr: 'Weekend Prolongé',
      en: 'Extended Weekend',
      es: 'Fin de Semana Extendido',
      he: 'סוף שבוע מורחב',
    },
    optionnel: {
      fr: '(optionnel)',
      en: '(optional)',
      es: '(opcional)',
      he: '(אופציונלי)',
    },
    dixNuits: {
      fr: '10 nuits',
      en: '10 nights',
      es: '10 noches',
      he: '10 לילות',
    },
    plusDeuxNuits: {
      fr: '+2 nuits (optionnel)',
      en: '+2 nights (optional)',
      es: '+2 noches (opcional)',
      he: '+2 לילות (אופציונלי)',
    },
    nuits: {
      fr: 'nuits',
      en: 'nights',
      es: 'noches',
      he: 'לילות',
    },
    glattKasher: {
      fr: 'Glatt Kasher Laméhadrine',
      en: 'Glatt Kosher Lamehadrin',
      es: 'Glatt Kosher Lamehadrin',
      he: 'גלאט כשר למהדרין',
    },
    sousLaSurveillance: {
      fr: 'Sous la surveillance du',
      en: 'Under the supervision of',
      es: 'Bajo la supervisión del',
      he: 'תחת השגחת',
    },
    ravMordehaiCohen: {
      fr: 'Rav Mordehai Cohen de Malaga',
      en: 'Rabbi Mordechai Cohen of Malaga',
      es: 'Rav Mordejai Cohen de Málaga',
      he: 'הרב מרדכי כהן ממלגה',
    },
    animationNonStop: {
      fr: 'Animation Non-Stop',
      en: 'Non-Stop Entertainment',
      es: 'Animación Sin Parar',
      he: 'בידור ללא הפסקה',
    },
    servicesInclus: {
      fr: 'Services Inclus',
      en: 'Included Services',
      es: 'Servicios Incluidos',
      he: 'שירותים כלולים',
    },
    datesDuSejour: {
      fr: 'Dates du Séjour',
      en: 'Stay Dates',
      es: 'Fechas de la Estancia',
      he: 'תאריכי השהייה',
    },
    demandeDevis: {
      fr: 'Demande de Devis',
      en: 'Quote Request',
      es: 'Solicitud de Presupuesto',
      he: 'בקשת הצעת מחיר',
    },
    contactezNous: {
      fr: 'Contactez-nous',
      en: 'Contact us',
      es: 'Contáctenos',
      he: 'צור קשר',
    },
    decouvrirHotel: {
      fr: "Découvrir l'hôtel",
      en: 'Discover the hotel',
      es: 'Descubrir el hotel',
      he: 'גלה את המלון',
    },
    voirGalerie: {
      fr: 'Voir la galerie',
      en: 'View gallery',
      es: 'Ver galería',
      he: 'צפה בגלריה',
    },
    voirInstagram: {
      fr: 'Voir Instagram',
      en: 'View Instagram',
      es: 'Ver Instagram',
      he: 'צפה באינסטגרם',
    },
    premium: {
      fr: 'Premium',
      en: 'Premium',
      es: 'Premium',
      he: 'פרימיום',
    },
    pretAVivre: {
      fr: 'Prêt à vivre un Pessah inoubliable ?',
      en: 'Ready to experience an unforgettable Passover?',
      es: '¿Listo para vivir un Pésaj inolvidable?',
      he: 'מוכן לחוות פסח בלתי נשכח?',
    },
    hotelDescription: {
      fr: 'Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026',
      en: 'Our luxury haven by the Mediterranean for Passover 2026',
      es: 'Nuestro refugio de lujo junto al Mediterráneo para Pésaj 2026',
      he: 'מקלט היוקרה שלנו לחופי הים התיכון לפסח 2026',
    },
    nombreChambres: {
      fr: '257 chambres de standing',
      en: '257 upscale rooms',
      es: '257 habitaciones de lujo',
      he: '257 חדרים יוקרתיים',
    },
    rooms: {
      fr: 'chambres de standing',
      en: 'upscale rooms',
      es: 'habitaciones de lujo',
      he: 'חדרים יוקרתיים',
    },
    piedDansLeau: {
      fr: "Pied dans l'eau",
      en: 'Beachfront',
      es: 'Frente al mar',
      he: 'על חוף הים',
    },
    piscines: {
      fr: '3 piscines dont 1 chauffée',
      en: '3 pools including 1 heated',
      es: '3 piscinas incluyendo 1 climatizada',
      he: '3 בריכות כולל 1 מחוממת',
    },
    spaComplet: {
      fr: 'SPA complet',
      en: 'Full SPA',
      es: 'SPA completo',
      he: 'ספא מלא',
    },
    accesDirectPlage: {
      fr: 'Accès direct plage',
      en: 'Direct beach access',
      es: 'Acceso directo a la playa',
      he: 'גישה ישירה לחוף',
    },
    gastronomie: {
      fr: 'Gastronomie Glatt Kasher',
      en: 'Glatt Kosher Gastronomy',
      es: 'Gastronomía Glatt Kosher',
      he: 'גסטרונומיה גלאט כשר',
    },
    nosChambres: {
      fr: 'Nos chambres de standing',
      en: 'Our upscale rooms',
      es: 'Nuestras habitaciones de lujo',
      he: 'החדרים היוקרתיים שלנו',
    },
    spaBienEtre: {
      fr: 'SPA & Bien-être',
      en: 'SPA & Wellness',
      es: 'SPA & Bienestar',
      he: 'ספא ורווחה',
    },
    rabbinPaytan: {
      fr: 'Rabbin & Paytan',
      en: 'Rabbi & Paytan',
      es: 'Rabino & Paytan',
      he: 'רב ופייטן',
    },
    animationEnfants: {
      fr: 'Animation Enfants',
      en: 'Kids Entertainment',
      es: 'Animación Infantil',
      he: 'בידור לילדים',
    },
  },

  // ============================================
  // HOTEL PAGE
  // ============================================
  hotel: {
    lHotel: {
      fr: "L'Hôtel",
      en: 'The Hotel',
      es: 'El Hotel',
      he: 'המלון',
    },
    hotel5Etoiles: {
      fr: 'Hôtel 5 Étoiles',
      en: '5 Star Hotel',
      es: 'Hotel 5 Estrellas',
      he: 'מלון 5 כוכבים',
    },
    cabogataTitle: {
      fr: 'Cabogata Beach Hotel 5★',
      en: 'Cabogata Beach Hotel 5★',
      es: 'Cabogata Beach Hotel 5★',
      he: 'מלון קבוגאטה ביץ\' 5★',
    },
    cabogataLocation: {
      fr: 'Cabogata Beach Hotel 5★ • El Toyo - Retamar, Almería',
      en: 'Cabogata Beach Hotel 5★ • El Toyo - Retamar, Almería',
      es: 'Cabogata Beach Hotel 5★ • El Toyo - Retamar, Almería',
      he: 'מלון קבוגאטה ביץ\' 5★ • אל טויו - רטמר, אלמריה',
    },
    notreEcrinDeLuxe: {
      fr: 'Notre Écrin de Luxe',
      en: 'Our Luxury Haven',
      es: 'Nuestro Refugio de Lujo',
      he: 'מקלט היוקרה שלנו',
    },
    locationAlmeria: {
      fr: 'El Toyo - Retamar, Almería, Espagne',
      en: 'El Toyo - Retamar, Almería, Spain',
      es: 'El Toyo - Retamar, Almería, España',
      he: 'אל טויו - רטמר, אלמריה, ספרד',
    },
    lieu: {
      fr: 'Lieu',
      en: 'Location',
      es: 'Ubicación',
      he: 'מיקום',
    },
    typesChambres: {
      fr: 'Types de Chambres',
      en: 'Room Types',
      es: 'Tipos de Habitaciones',
      he: 'סוגי חדרים',
    },
    chambresReparties: {
      fr: '257 chambres réparties en 9 catégories différentes',
      en: '257 rooms distributed across 9 different categories',
      es: '257 habitaciones distribuidas en 9 categorías diferentes',
      he: '257 חדרים מחולקים ל-9 קטגוריות שונות',
    },
    surface: {
      fr: 'Surface',
      en: 'Area',
      es: 'Superficie',
      he: 'שטח',
    },
    vue: {
      fr: 'Vue',
      en: 'View',
      es: 'Vista',
      he: 'נוף',
    },
    servicesEquipements: {
      fr: 'Services & Équipements',
      en: 'Services & Facilities',
      es: 'Servicios y Equipamientos',
      he: 'שירותים ומתקנים',
    },
    espaces: {
      fr: 'Les Espaces',
      en: 'The Spaces',
      es: 'Los Espacios',
      he: 'החללים',
    },
    restaurant: {
      fr: 'Restaurant',
      en: 'Restaurant',
      es: 'Restaurante',
      he: 'מסעדה',
    },
    piscines: {
      fr: 'Piscines',
      en: 'Pools',
      es: 'Piscinas',
      he: 'בריכות',
    },
    spa: {
      fr: 'SPA',
      en: 'SPA',
      es: 'SPA',
      he: 'ספא',
    },
    plage: {
      fr: 'Plage',
      en: 'Beach',
      es: 'Playa',
      he: 'חוף',
    },
    voirSejour: {
      fr: 'Voir le séjour',
      en: 'View the stay',
      es: 'Ver la estancia',
      he: 'צפה בשהייה',
    },
  },

  // ============================================
  // MARBELLA PAGE
  // ============================================
  marbella: {
    title: {
      fr: 'Marbella',
      en: 'Marbella',
      es: 'Marbella',
      he: 'מרבייה',
    },
    subtitle: {
      fr: 'Vacances de luxe sur la Costa del Sol',
      en: 'Luxury holidays on the Costa del Sol',
      es: 'Vacaciones de lujo en la Costa del Sol',
      he: 'חופשת יוקרה בקוסטה דל סול',
    },
    restaurantCasher: {
      fr: 'Restaurant Casher',
      en: 'Kosher Restaurant',
      es: 'Restaurante Kosher',
      he: 'מסעדה כשרה',
    },
    glattKosher: {
      fr: 'Glatt Kosher',
      en: 'Glatt Kosher',
      es: 'Glatt Kosher',
      he: 'גלאט כשר',
    },
    nosServices: {
      fr: 'Nos Services',
      en: 'Our Services',
      es: 'Nuestros Servicios',
      he: 'השירותים שלנו',
    },
    cliquezAgrandir: {
      fr: 'Cliquez pour agrandir',
      en: 'Click to enlarge',
      es: 'Haga clic para ampliar',
      he: 'לחץ להגדלה',
    },
    utilisezBoutons: {
      fr: 'Utilisez les boutons ou la molette pour zoomer',
      en: 'Use buttons or scroll to zoom',
      es: 'Use los botones o la rueda para hacer zoom',
      he: 'השתמש בכפתורים או בגלגלת לזום',
    },
    cliquezGlissez: {
      fr: "Cliquez et glissez pour déplacer l'image",
      en: 'Click and drag to move the image',
      es: 'Haga clic y arrastre para mover la imagen',
      he: 'לחץ וגרור להזזת התמונה',
    },
    cliquezFermer: {
      fr: "Cliquez n'importe où pour fermer",
      en: 'Click anywhere to close',
      es: 'Haga clic en cualquier lugar para cerrar',
      he: 'לחץ בכל מקום לסגירה',
    },
    adresse: {
      fr: 'Adresse',
      en: 'Address',
      es: 'Dirección',
      he: 'כתובת',
    },
    telephone: {
      fr: 'Téléphone',
      en: 'Phone',
      es: 'Teléfono',
      he: 'טלפון',
    },
  },

  // ============================================
  // HILLOULA PAGE
  // ============================================
  hilloula: {
    title: {
      fr: 'Hilloula',
      en: 'Hilloula',
      es: 'Hilloula',
      he: 'הילולא',
    },
    subtitle: {
      fr: 'Pèlerinage aux tombeaux des Tsadikim',
      en: 'Pilgrimage to the tombs of the Tzadikim',
      es: 'Peregrinación a las tumbas de los Tzadikim',
      he: 'עלייה לקברי הצדיקים',
    },
    pelerinagesSpirituel: {
      fr: 'Pèlerinages Spirituels',
      en: 'Spiritual Pilgrimages',
      es: 'Peregrinaciones Espirituales',
      he: 'עליות רוחניות',
    },
    note: {
      fr: 'Note',
      en: 'Note',
      es: 'Nota',
      he: 'הערה',
    },
    dates: {
      fr: 'Dates',
      en: 'Dates',
      es: 'Fechas',
      he: 'תאריכים',
    },
    lieu: {
      fr: 'Lieu',
      en: 'Location',
      es: 'Lugar',
      he: 'מיקום',
    },
    prix: {
      fr: 'Prix',
      en: 'Price',
      es: 'Precio',
      he: 'מחיר',
    },
    kashrout: {
      fr: 'Kashrout',
      en: 'Kashrut',
      es: 'Kashrut',
      he: 'כשרות',
    },
    inclus: {
      fr: 'Inclus',
      en: 'Included',
      es: 'Incluido',
      he: 'כלול',
    },
  },

  // ============================================
  // SOUCCOT PAGE
  // ============================================
  souccot: {
    title: {
      fr: 'Souccot',
      en: 'Sukkot',
      es: 'Sucot',
      he: 'סוכות',
    },
    subtitle: {
      fr: 'Fête des Cabanes',
      en: 'Feast of Tabernacles',
      es: 'Fiesta de los Tabernáculos',
      he: 'חג הסוכות',
    },
    niveauxQualite: {
      fr: 'Niveaux de Qualité',
      en: 'Quality Levels',
      es: 'Niveles de Calidad',
      he: 'רמות איכות',
    },
    ajouterPanier: {
      fr: 'Ajouter au panier',
      en: 'Add to cart',
      es: 'Añadir al carrito',
      he: 'הוסף לסל',
    },
    bientotDisponible: {
      fr: 'Bientôt disponible',
      en: 'Coming soon',
      es: 'Próximamente',
      he: 'בקרוב',
    },
  },

  // ============================================
  // MARRAKECH PAGE
  // ============================================
  marrakech: {
    title: {
      fr: 'Marrakech',
      en: 'Marrakech',
      es: 'Marrakech',
      he: 'מרקש',
    },
    typeEvenements: {
      fr: "Types d'Événements",
      en: 'Event Types',
      es: 'Tipos de Eventos',
      he: 'סוגי אירועים',
    },
    demanderProposition: {
      fr: 'Demander une proposition',
      en: 'Request a proposal',
      es: 'Solicitar una propuesta',
      he: 'בקש הצעה',
    },
  },

  // ============================================
  // CONTACT PAGE
  // ============================================
  contactPage: {
    title: {
      fr: 'Contact',
      en: 'Contact',
      es: 'Contacto',
      he: 'צור קשר',
    },
    subtitle: {
      fr: 'Une question ? Contactez-nous',
      en: 'Have a question? Contact us',
      es: '¿Tiene una pregunta? Contáctenos',
      he: 'יש שאלה? צור איתנו קשר',
    },
    formTitle: {
      fr: 'Envoyez-nous un message',
      en: 'Send us a message',
      es: 'Envíenos un mensaje',
      he: 'שלח לנו הודעה',
    },
    ourCoordinates: {
      fr: 'Nos coordonnées',
      en: 'Our contact details',
      es: 'Nuestros datos de contacto',
      he: 'פרטי ההתקשרות שלנו',
    },
    address: {
      fr: 'Adresse',
      en: 'Address',
      es: 'Dirección',
      he: 'כתובת',
    },
    phone: {
      fr: 'Téléphone',
      en: 'Phone',
      es: 'Teléfono',
      he: 'טלפון',
    },
    email: {
      fr: 'Email',
      en: 'Email',
      es: 'Correo electrónico',
      he: 'אימייל',
    },
    followUs: {
      fr: 'Suivez-nous',
      en: 'Follow us',
      es: 'Síguenos',
      he: 'עקבו אחרינו',
    },
  },

  // ============================================
  // GALLERY
  // ============================================
  gallery: {
    title: {
      fr: 'Galerie Photos',
      en: 'Photo Gallery',
      es: 'Galería de Fotos',
      he: 'גלריית תמונות',
    },
    subtitle: {
      fr: 'Découvrez nos événements en images',
      en: 'Discover our events in pictures',
      es: 'Descubra nuestros eventos en imágenes',
      he: 'גלה את האירועים שלנו בתמונות',
    },
    plongezUnivers: {
      fr: "Plongez dans l'univers du Cabogata Beach Hotel 5★",
      en: 'Dive into the world of Cabogata Beach Hotel 5★',
      es: 'Sumérjase en el universo del Cabogata Beach Hotel 5★',
      he: 'צללו לעולם של מלון קבוגאטה ביץ\' 5★',
    },
    voir: {
      fr: 'Voir',
      en: 'View',
      es: 'Ver',
      he: 'צפה',
    },
    all: {
      fr: 'Tous',
      en: 'All',
      es: 'Todos',
      he: 'הכל',
    },
    hotel: {
      fr: 'Hôtel',
      en: 'Hotel',
      es: 'Hotel',
      he: 'מלון',
    },
    restaurant: {
      fr: 'Restaurant',
      en: 'Restaurant',
      es: 'Restaurante',
      he: 'מסעדה',
    },
    pool: {
      fr: 'Piscine',
      en: 'Pool',
      es: 'Piscina',
      he: 'בריכה',
    },
    rooms: {
      fr: 'Chambres',
      en: 'Rooms',
      es: 'Habitaciones',
      he: 'חדרים',
    },
    spa: {
      fr: 'SPA',
      en: 'SPA',
      es: 'SPA',
      he: 'ספא',
    },
    events: {
      fr: 'Événements',
      en: 'Events',
      es: 'Eventos',
      he: 'אירועים',
    },
    noCategories: {
      fr: "Aucune catégorie n'a été créée.",
      en: 'No categories have been created.',
      es: 'No se han creado categorías.',
      he: 'לא נוצרו קטגוריות.',
    },
    createCategoriesAdmin: {
      fr: "Créez des catégories dans l'espace admin pour commencer.",
      en: 'Create categories in the admin area to get started.',
      es: 'Cree categorías en el área de administración para comenzar.',
      he: 'צור קטגוריות באזור הניהול כדי להתחיל.',
    },
    noImagesInCategory: {
      fr: 'Aucune image dans cette catégorie.',
      en: 'No images in this category.',
      es: 'No hay imágenes en esta categoría.',
      he: 'אין תמונות בקטגוריה זו.',
    },
    addImagesAdmin: {
      fr: "Ajoutez des images depuis l'espace admin.",
      en: 'Add images from the admin area.',
      es: 'Añada imágenes desde el área de administración.',
      he: 'הוסף תמונות מאזור הניהול.',
    },
  },

  // ============================================
  // SECTION TITLES
  // ============================================
  sections: {
    ourServices: {
      fr: 'Nos Services',
      en: 'Our Services',
      es: 'Nuestros Servicios',
      he: 'השירותים שלנו',
    },
    ourTeam: {
      fr: 'Notre Équipe',
      en: 'Our Team',
      es: 'Nuestro Equipo',
      he: 'הצוות שלנו',
    },
    ourPartners: {
      fr: 'Nos Partenaires',
      en: 'Our Partners',
      es: 'Nuestros Socios',
      he: 'השותפים שלנו',
    },
    faq: {
      fr: 'Questions Fréquentes',
      en: 'Frequently Asked Questions',
      es: 'Preguntas Frecuentes',
      he: 'שאלות נפוצות',
    },
    included: {
      fr: 'Inclus',
      en: 'Included',
      es: 'Incluido',
      he: 'כלול',
    },
    notIncluded: {
      fr: 'Non inclus',
      en: 'Not included',
      es: 'No incluido',
      he: 'לא כלול',
    },
  },

  // ============================================
  // TARIFS PAGE
  // ============================================
  tarifs: {
    title: {
      fr: 'Tarifs',
      en: 'Rates',
      es: 'Tarifas',
      he: 'מחירון',
    },
    sejour10Nuits: {
      fr: 'Séjour 10 nuits (31 Mars - 10 Avril 2026)',
      en: 'Stay 10 nights (March 31 - April 10, 2026)',
      es: 'Estancia 10 noches (31 Marzo - 10 Abril 2026)',
      he: 'שהייה 10 לילות (31 במרץ - 10 באפריל 2026)',
    },
    weekendProlonge: {
      fr: 'Weekend Prolongé (10-12 Avril)',
      en: 'Extended Weekend (April 10-12)',
      es: 'Fin de Semana Extendido (10-12 Abril)',
      he: 'סוף שבוע מורחב (10-12 באפריל)',
    },
    adulteDouble: {
      fr: 'Adulte (chambre double)',
      en: 'Adult (double room)',
      es: 'Adulto (habitación doble)',
      he: 'מבוגר (חדר זוגי)',
    },
    bebe: {
      fr: 'Bébé (0-24 mois)',
      en: 'Baby (0-24 months)',
      es: 'Bebé (0-24 meses)',
      he: 'תינוק (0-24 חודשים)',
    },
    enfant23: {
      fr: 'Enfant (2-3 ans)',
      en: 'Child (2-3 years)',
      es: 'Niño (2-3 años)',
      he: 'ילד (2-3 שנים)',
    },
    enfant46: {
      fr: 'Enfant (4-6 ans)',
      en: 'Child (4-6 years)',
      es: 'Niño (4-6 años)',
      he: 'ילד (4-6 שנים)',
    },
    enfant711: {
      fr: 'Enfant (7-11 ans)',
      en: 'Child (7-11 years)',
      es: 'Niño (7-11 años)',
      he: 'ילד (7-11 שנים)',
    },
    adulte: {
      fr: 'Adulte',
      en: 'Adult',
      es: 'Adulto',
      he: 'מבוגר',
    },
    enfant: {
      fr: 'Enfant',
      en: 'Child',
      es: 'Niño',
      he: 'ילד',
    },
    gratuit: {
      fr: 'GRATUIT',
      en: 'FREE',
      es: 'GRATIS',
      he: 'חינם',
    },
    demanderDevis: {
      fr: 'Demander un devis personnalisé',
      en: 'Request a personalized quote',
      es: 'Solicitar un presupuesto personalizado',
      he: 'בקש הצעת מחיר מותאמת אישית',
    },
  },

  // ============================================
  // HILLOULA DETAIL PAGE
  // ============================================
  // ============================================
  // INSCRIPTION PAGE
  // ============================================
  inscription: {
    pageTitle: {
      fr: "Formulaire d'inscription",
      en: 'Registration Form',
      es: 'Formulario de inscripción',
      he: 'טופס הרשמה',
    },
    pageSubtitle: {
      fr: 'Complétez votre inscription pour le séjour Pessah 2026 au Cabogata Beach Hotel 5★',
      en: 'Complete your registration for the Passover 2026 stay at Cabogata Beach Hotel 5★',
      es: 'Complete su inscripción para la estancia de Pésaj 2026 en el Cabogata Beach Hotel 5★',
      he: 'השלם את ההרשמה שלך לשהיית פסח 2026 במלון קבוגאטה ביץ\' 5★',
    },
    importantInfo: {
      fr: 'Informations importantes',
      en: 'Important Information',
      es: 'Información importante',
      he: 'מידע חשוב',
    },
    oneFormPerFamily: {
      fr: 'Merci de remplir un formulaire par famille.',
      en: 'Please fill out one form per family.',
      es: 'Por favor complete un formulario por familia.',
      he: 'נא למלא טופס אחד לכל משפחה.',
    },
    familyExplanation: {
      fr: 'Chaque famille (parents + enfants) doit compléter son propre formulaire, même si la réservation a été faite par une seule personne pour plusieurs proches.',
      en: 'Each family (parents + children) must complete their own form, even if the reservation was made by one person for several relatives.',
      es: 'Cada familia (padres + hijos) debe completar su propio formulario, incluso si la reserva fue realizada por una sola persona para varios familiares.',
      he: 'כל משפחה (הורים + ילדים) חייבת למלא טופס משלה, גם אם ההזמנה בוצעה על ידי אדם אחד עבור מספר קרובים.',
    },
    ifYouReservedFor: {
      fr: 'Si vous avez réservé pour :',
      en: 'If you have reserved for:',
      es: 'Si ha reservado para:',
      he: 'אם הזמנת עבור:',
    },
    yourParents: {
      fr: 'Vos parents',
      en: 'Your parents',
      es: 'Sus padres',
      he: 'ההורים שלך',
    },
    yourChildren: {
      fr: 'Vos enfants',
      en: 'Your children',
      es: 'Sus hijos',
      he: 'הילדים שלך',
    },
    cousins: {
      fr: 'Des cousins',
      en: 'Cousins',
      es: 'Primos',
      he: 'בני דודים',
    },
    anotherFamily: {
      fr: 'Une autre famille',
      en: 'Another family',
      es: 'Otra familia',
      he: 'משפחה אחרת',
    },
    separateFormRequired: {
      fr: 'Alors chaque foyer doit remplir un formulaire séparé avec ses propres informations (noms, dates de séjour, passeports, etc.).',
      en: 'Then each household must fill out a separate form with their own information (names, stay dates, passports, etc.).',
      es: 'Entonces cada hogar debe completar un formulario separado con su propia información (nombres, fechas de estancia, pasaportes, etc.).',
      he: 'אז כל משק בית חייב למלא טופס נפרד עם המידע שלו (שמות, תאריכי שהייה, דרכונים וכו\').',
    },
    organizationNote: {
      fr: "Cela nous permet d'organiser correctement les chambres, transferts et formalités administratives.",
      en: 'This allows us to properly organize rooms, transfers, and administrative formalities.',
      es: 'Esto nos permite organizar correctamente las habitaciones, traslados y trámites administrativos.',
      he: 'זה מאפשר לנו לארגן כראוי חדרים, העברות ופורמליות מנהליות.',
    },
    thanksForCooperation: {
      fr: 'Merci pour votre collaboration.',
      en: 'Thank you for your cooperation.',
      es: 'Gracias por su colaboración.',
      he: 'תודה על שיתוף הפעולה.',
    },
    teamSignature: {
      fr: "L'équipe K PRESTIGE",
      en: 'The K PRESTIGE Team',
      es: 'El equipo K PRESTIGE',
      he: 'צוות K PRESTIGE',
    },
    startButton: {
      fr: 'Commencer',
      en: 'Start',
      es: 'Comenzar',
      he: 'התחל',
    },
    whatsIncluded: {
      fr: 'Ce qui est inclus',
      en: "What's included",
      es: 'Qué está incluido',
      he: 'מה כלול',
    },
    fullBoardKosher: {
      fr: 'Pension complète cachère Glatt',
      en: 'Full board Glatt Kosher',
      es: 'Pensión completa Glatt Kosher',
      he: 'פנסיון מלא גלאט כשר',
    },
    luxuryAccommodation: {
      fr: 'Hébergement en hôtel de luxe',
      en: 'Luxury hotel accommodation',
      es: 'Alojamiento en hotel de lujo',
      he: 'לינה במלון יוקרה',
    },
    entertainmentShows: {
      fr: 'Animations et spectacles',
      en: 'Entertainment and shows',
      es: 'Animaciones y espectáculos',
      he: 'בידור ומופעים',
    },
    kidsProgram: {
      fr: 'Programme pour enfants',
      en: 'Kids program',
      es: 'Programa para niños',
      he: 'תוכנית לילדים',
    },
    communitySeders: {
      fr: 'Sedarim communautaires',
      en: 'Community Seders',
      es: 'Sedarim comunitarios',
      he: 'סדרים קהילתיים',
    },
    onSiteSynagogue: {
      fr: 'Synagogue sur place',
      en: 'On-site synagogue',
      es: 'Sinagoga en el lugar',
      he: 'בית כנסת במקום',
    },
    needHelp: {
      fr: "Besoin d'aide ?",
      en: 'Need help?',
      es: '¿Necesita ayuda?',
      he: 'צריך עזרה?',
    },
    teamAvailable: {
      fr: 'Notre équipe est disponible pour répondre à toutes vos questions',
      en: 'Our team is available to answer all your questions',
      es: 'Nuestro equipo está disponible para responder a todas sus preguntas',
      he: 'הצוות שלנו זמין לענות על כל השאלות שלך',
    },
    phoneLabel: {
      fr: 'Téléphone',
      en: 'Phone',
      es: 'Teléfono',
      he: 'טלפון',
    },
    whatsappLabel: {
      fr: 'WhatsApp',
      en: 'WhatsApp',
      es: 'WhatsApp',
      he: 'WhatsApp',
    },
    contactUs: {
      fr: 'Nous contacter',
      en: 'Contact us',
      es: 'Contáctenos',
      he: 'צור קשר',
    },
    emailLabel: {
      fr: 'Email',
      en: 'Email',
      es: 'Correo electrónico',
      he: 'אימייל',
    },
  },

  hilloulaDetail: {
    photoAVenir: {
      fr: 'Photo à venir',
      en: 'Photo coming soon',
      es: 'Foto próximamente',
      he: 'תמונה בקרוב',
    },
    programme: {
      fr: 'Programme',
      en: 'Program',
      es: 'Programa',
      he: 'תוכנית',
    },
    hotel: {
      fr: 'Hôtel',
      en: 'Hotel',
      es: 'Hotel',
      he: 'מלון',
    },
    interessePelerinage: {
      fr: 'Intéressé par ce pèlerinage ?',
      en: 'Interested in this pilgrimage?',
      es: '¿Interesado en esta peregrinación?',
      he: 'מעוניין בעלייה זו?',
    },
    contactezPourInscrire: {
      fr: 'Contactez-nous pour vous inscrire',
      en: 'Contact us to register',
      es: 'Contáctenos para inscribirse',
      he: 'צור קשר כדי להירשם',
    },
    perPersonne: {
      fr: '/ personne',
      en: '/ person',
      es: '/ persona',
      he: '/ אדם',
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a translation by path
 * @param path - Dot notation path (e.g., 'navigation.home')
 * @param lang - Language code
 * @returns Translated string
 */
export function t(path: string, lang: Language = 'fr'): string {
  const keys = path.split('.');
  let result: any = translations;

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
}

/**
 * Get all translations for a section
 * @param section - Section key
 * @param lang - Language code
 * @returns Object with all translations for that section
 */
export function getSection(section: keyof typeof translations, lang: Language = 'fr'): Record<string, string> {
  const sectionData = translations[section];
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(sectionData)) {
    if (typeof value === 'object' && lang in value) {
      result[key] = (value as Record<Language, string>)[lang];
    }
  }

  return result;
}

/**
 * Check if language is RTL
 * @param lang - Language code
 * @returns boolean
 */
export function isRTL(lang: Language): boolean {
  return lang === 'he';
}

/**
 * Get direction attribute value
 * @param lang - Language code
 * @returns 'rtl' or 'ltr'
 */
export function getDir(lang: Language): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}
