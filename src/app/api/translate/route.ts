import { NextRequest, NextResponse } from 'next/server';

// Supabase config
const SUPABASE_URL = 'https://htemxbrbxazzatmjerij.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Dictionnaire de traductions manuelles pour les termes courants
const manualTranslations: Record<string, Record<string, string>> = {
  // Titres et sections communs
  'Contactez-nous': { en: 'Contact Us', es: 'Contáctenos', he: 'צור קשר' },
  'Nous contacter': { en: 'Contact Us', es: 'Contáctenos', he: 'צור קשר' },
  'Contactez-nous dès aujourd\'hui': { en: 'Contact Us Today', es: 'Contáctenos Hoy', he: 'צרו קשר היום' },
  'Demander un devis': { en: 'Request a Quote', es: 'Solicitar Presupuesto', he: 'בקשת הצעת מחיר' },
  'Nous contacter sur WhatsApp': { en: 'Contact Us on WhatsApp', es: 'Contáctenos por WhatsApp', he: 'צרו קשר בוואטסאפ' },
  'Prêt à vivre l\'expérience K Prestige ?': { en: 'Ready to Experience K Prestige?', es: '¿Listo para vivir la experiencia K Prestige?', he: 'מוכנים לחוות את K Prestige?' },
  'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans l\'organisation de votre événement.': {
    en: 'Our team is at your service to answer all your questions and assist you in organizing your event.',
    es: 'Nuestro equipo está a su disposición para responder a todas sus preguntas y acompañarle en la organización de su evento.',
    he: 'הצוות שלנו עומד לרשותכם לענות על כל שאלותיכם וללוות אתכם בארגון האירוע שלכם.'
  },

  // Pessah / Hôtel
  'Expérience Premium': { en: 'Premium Experience', es: 'Experiencia Premium', he: 'חוויה פרימיום' },
  'PESSAH 2026': { en: 'PASSOVER 2026', es: 'PÉSAJ 2026', he: 'פסח 2026' },
  'Le Séjour': { en: 'The Stay', es: 'La Estancia', he: 'השהייה' },
  'L\'Hôtel': { en: 'The Hotel', es: 'El Hotel', he: 'המלון' },
  'Hôtel 5 Étoiles': { en: '5-Star Hotel', es: 'Hotel 5 Estrellas', he: 'מלון 5 כוכבים' },
  'Notre Écrin de Luxe': { en: 'Our Luxury Gem', es: 'Nuestro Joyero de Lujo', he: 'פנינת היוקרה שלנו' },
  'Notre écrin de luxe au bord de la Méditerranée pour Pessah 2026': {
    en: 'Our luxury gem on the Mediterranean coast for Passover 2026',
    es: 'Nuestro joyero de lujo a orillas del Mediterráneo para Pésaj 2026',
    he: 'פנינת היוקרה שלנו על חוף הים התיכון לפסח 2026'
  },
  'Séjour Premium': { en: 'Premium Stay', es: 'Estancia Premium', he: 'שהייה פרימיום' },

  // Services
  'Pied dans l\'eau': { en: 'Beachfront', es: 'Frente al Mar', he: 'על חוף הים' },
  'Accès direct plage': { en: 'Direct beach access', es: 'Acceso directo a la playa', he: 'גישה ישירה לחוף' },
  '3 Piscines': { en: '3 Pools', es: '3 Piscinas', he: '3 בריכות' },
  'Dont une chauffée': { en: 'Including one heated', es: 'Una de ellas climatizada', he: 'כולל אחת מחוממת' },
  'SPA Luxueux': { en: 'Luxury SPA', es: 'SPA de Lujo', he: 'ספא יוקרתי' },
  'Centre bien-être complet': { en: 'Complete wellness center', es: 'Centro de bienestar completo', he: 'מרכז ספא מלא' },
  'Gastronomie': { en: 'Gastronomy', es: 'Gastronomía', he: 'גסטרונומיה' },
  'Cuisine française et orientale': { en: 'French and Oriental cuisine', es: 'Cocina francesa y oriental', he: 'מטבח צרפתי ומזרחי' },
  'Sport & Fitness': { en: 'Sport & Fitness', es: 'Deporte y Fitness', he: 'ספורט וכושר' },
  'Salle équipée, coach': { en: 'Equipped gym, coach', es: 'Gimnasio equipado, entrenador', he: 'חדר כושר מאובזר, מאמן' },
  'Clubs Enfants': { en: 'Kids Clubs', es: 'Clubes Infantiles', he: 'מועדוני ילדים' },
  'Baby, Mini, Kids Club': { en: 'Baby, Mini, Kids Club', es: 'Club Baby, Mini, Kids', he: 'מועדון תינוקות, פעוטות, ילדים' },
  'Barbecue': { en: 'Barbecue', es: 'Barbacoa', he: 'מנגל' },
  'Grillades royale': { en: 'Royal Grilled Meats', es: 'Parrillada Real', he: 'מנגל מלכותי' },
  'Les petits kif': { en: 'Little pleasures', es: 'Pequeños placeres', he: 'תענוגות קטנים' },
  'La base du séjour': { en: 'The essence of the stay', es: 'La esencia de la estancia', he: 'הבסיס של השהייה' },

  // Stats
  'Familles accompagnées': { en: 'Families Served', es: 'Familias Atendidas', he: 'משפחות שליווינו' },
  'D\'expérience': { en: 'Of experience', es: 'De experiencia', he: 'שנות ניסיון' },
  'Destinations': { en: 'Destinations', es: 'Destinos', he: 'יעדים' },
  'Kashrout certifiée': { en: 'Certified Kashrut', es: 'Kashrut Certificada', he: 'כשרות מאושרת' },

  // Univers / Sections
  'Séjours Pessah': { en: 'Passover Stays', es: 'Estancias de Pésaj', he: 'חופשות פסח' },
  'Vivez des fêtes inoubliables dans les plus beaux hôtels': { en: 'Experience unforgettable holidays in the finest hotels', es: 'Viva fiestas inolvidables en los mejores hoteles', he: 'חוו חגים בלתי נשכחים במלונות היפים ביותר' },
  'El Dorado Marbella': { en: 'El Dorado Marbella', es: 'El Dorado Marbella', he: 'אל דוראדו מרבייה' },
  'Restaurant casher & traiteur événementiel': { en: 'Kosher restaurant & event catering', es: 'Restaurante kosher y catering para eventos', he: 'מסעדה כשרה וקייטרינג לאירועים' },
  'Traiteur Marrakech': { en: 'Marrakech Catering', es: 'Catering Marrakech', he: 'קייטרינג מרקש' },
  'Traiteur casher pour vos événements au Maroc': { en: 'Kosher catering for your events in Morocco', es: 'Catering kosher para sus eventos en Marruecos', he: 'קייטרינג כשר לאירועים שלכם במרוקו' },
  'Hilloula': { en: 'Hilloula', es: 'Hilloula', he: 'הילולא' },
  'Pèlerinages sur les tombes des Tsadikim': { en: 'Pilgrimages to the tombs of Tzadikim', es: 'Peregrinaciones a las tumbas de los Tzadikim', he: 'עליות לקברי צדיקים' },
  'Arba Minim': { en: 'Arba Minim', es: 'Arba Minim', he: 'ארבע מינים' },
  'Loulav & Etrog de qualité pour Souccot': { en: 'Quality Lulav & Etrog for Sukkot', es: 'Lulav y Etrog de calidad para Sucot', he: 'לולב ואתרוג איכותיים לסוכות' },

  // Témoignages
  'Un séjour exceptionnel pour Pessah 2025. L\'organisation était parfaite, la kashrout irréprochable, et l\'animation de qualité. Nous reviendrons !': {
    en: 'An exceptional stay for Passover 2025. The organization was perfect, the kashrut impeccable, and the entertainment top quality. We will return!',
    es: 'Una estancia excepcional para Pésaj 2025. La organización fue perfecta, el kashrut impecable y la animación de calidad. ¡Volveremos!',
    he: 'שהייה יוצאת דופן לפסח 2025. הארגון היה מושלם, הכשרות ללא דופי, והבידור ברמה גבוהה. נחזור!'
  },
  'K Prestige a organisé notre mariage à Marrakech. Service au top, cuisine délicieuse, et équipe très professionnelle. Je recommande vivement.': {
    en: 'K Prestige organized our wedding in Marrakech. Top service, delicious food, and very professional team. I highly recommend.',
    es: 'K Prestige organizó nuestra boda en Marrakech. Servicio de primera, comida deliciosa y equipo muy profesional. Lo recomiendo encarecidamente.',
    he: 'K Prestige ארגנו את החתונה שלנו במרקש. שירות מעולה, אוכל טעים, וצוות מקצועי מאוד. ממליץ בחום.'
  },
  'Notre pèlerinage Hilloula était magnifique. Tout était bien organisé, les repas excellents, et l\'ambiance spirituelle au rendez-vous. Merci !': {
    en: 'Our Hilloula pilgrimage was magnificent. Everything was well organized, the meals were excellent, and the spiritual atmosphere was present. Thank you!',
    es: 'Nuestra peregrinación Hilloula fue magnífica. Todo estaba bien organizado, las comidas excelentes y el ambiente espiritual presente. ¡Gracias!',
    he: 'ההילולא שלנו הייתה מדהימה. הכל היה מאורגן היטב, הארוחות מצוינות, והאווירה הרוחנית הייתה בשיא. תודה!'
  },

  // Contact
  'Envoyez-nous un message': { en: 'Send Us a Message', es: 'Envíenos un Mensaje', he: 'שלחו לנו הודעה' },
  'Notre équipe est à votre écoute pour répondre à toutes vos questions': {
    en: 'Our team is here to answer all your questions',
    es: 'Nuestro equipo está a su disposición para responder a todas sus preguntas',
    he: 'הצוות שלנו כאן לענות על כל שאלותיכם'
  },
  'Nos coordonnées': { en: 'Our Contact Details', es: 'Nuestros Datos de Contacto', he: 'פרטי התקשרות' },
  'Autres moyens de contact': { en: 'Other Contact Methods', es: 'Otros Medios de Contacto', he: 'דרכי יצירת קשר נוספות' },
  'WhatsApp': { en: 'WhatsApp', es: 'WhatsApp', he: 'וואטסאפ' },
  'Contactez-nous directement': { en: 'Contact us directly', es: 'Contáctenos directamente', he: 'צרו קשר ישירות' },
  'Ouvrir WhatsApp': { en: 'Open WhatsApp', es: 'Abrir WhatsApp', he: 'פתח וואטסאפ' },
  'Être rappelé': { en: 'Get a Callback', es: 'Ser Contactado', he: 'שיחזרו אלי' },
  'Formulaire rapide': { en: 'Quick Form', es: 'Formulario Rápido', he: 'טופס מהיר' },
  'Formulaire rappel': { en: 'Callback Form', es: 'Formulario de Devolución', he: 'טופס חזרה' },

  // Marbella
  'Restaurant Casher': { en: 'Kosher Restaurant', es: 'Restaurante Kosher', he: 'מסעדה כשרה' },
  'Restaurant Casher Permanent': { en: 'Permanent Kosher Restaurant', es: 'Restaurante Kosher Permanente', he: 'מסעדה כשרה קבועה' },
  'El Dorado est un restaurant casher permanent situé à Marbella, ouvert toute l\'année.\nCuisine viande, hamburgers, salades, grillades et tajines.': {
    en: 'El Dorado is a permanent kosher restaurant located in Marbella, open all year round.\nMeat cuisine, burgers, salads, grills and tagines.',
    es: 'El Dorado es un restaurante kosher permanente ubicado en Marbella, abierto todo el año.\nCocina de carne, hamburguesas, ensaladas, parrillas y tajines.',
    he: 'אל דוראדו הוא מסעדה כשרה קבועה במרבייה, פתוחה כל השנה.\nמטבח בשרי, המבורגרים, סלטים, מנגל וטאג\'ין.'
  },
  'Intéressé par nos services ?': { en: 'Interested in Our Services?', es: '¿Interesado en Nuestros Servicios?', he: 'מעוניינים בשירותים שלנו?' },
  'Contactez-nous pour une réservation ou un devis personnalisé': {
    en: 'Contact us for a reservation or personalized quote',
    es: 'Contáctenos para una reserva o presupuesto personalizado',
    he: 'צרו קשר להזמנה או הצעת מחיר אישית'
  },
  'Restaurant': { en: 'Restaurant', es: 'Restaurante', he: 'מסעדה' },
  'Réservations de tables pour déjeuner et dîner': { en: 'Table reservations for lunch and dinner', es: 'Reservas de mesa para almuerzo y cena', he: 'הזמנת שולחנות לארוחת צהריים וערב' },
  'Traiteur Événementiel': { en: 'Event Catering', es: 'Catering para Eventos', he: 'קייטרינג לאירועים' },
  'Mariages, Bar-mitzvahs, Shabbat, Hilloula, Réceptions': { en: 'Weddings, Bar Mitzvahs, Shabbat, Hilloula, Receptions', es: 'Bodas, Bar Mitzvahs, Shabat, Hilloula, Recepciones', he: 'חתונות, בר מצוות, שבת, הילולא, קבלות פנים' },
  'Privatisation': { en: 'Private Events', es: 'Privatización', he: 'אירועים פרטיים' },
  'Privatisation complète du restaurant pour vos événements': { en: 'Full restaurant privatization for your events', es: 'Privatización completa del restaurante para sus eventos', he: 'השכרה פרטית מלאה של המסעדה לאירועים שלכם' },

  // Hilloula
  'Pèlerinages Spirituels': { en: 'Spiritual Pilgrimages', es: 'Peregrinaciones Espirituales', he: 'עליות רוחניות' },
  'Voyages Organisés': { en: 'Organized Tours', es: 'Viajes Organizados', he: 'סיורים מאורגנים' },
  'K Prestige organise des voyages pour pèlerinages sur tombes de Tsadikim plusieurs fois par an, vers différentes destinations.': {
    en: 'K Prestige organizes pilgrimages to the tombs of Tzadikim several times a year, to various destinations.',
    es: 'K Prestige organiza peregrinaciones a las tumbas de los Tzadikim varias veces al año, a diversos destinos.',
    he: 'K Prestige מארגן עליות לקברי צדיקים מספר פעמים בשנה, ליעדים שונים.'
  },
  'Les prix sont affichés pour chaque événement. Le contenu change fréquemment, consultez régulièrement les nouvelles dates.': {
    en: 'Prices are displayed for each event. Content changes frequently, check regularly for new dates.',
    es: 'Los precios se muestran para cada evento. El contenido cambia con frecuencia, consulte regularmente las nuevas fechas.',
    he: 'המחירים מוצגים לכל אירוע. התוכן משתנה לעתים קרובות, בדקו באופן קבוע לגבי תאריכים חדשים.'
  },
  'Prochain Événement': { en: 'Next Event', es: 'Próximo Evento', he: 'האירוע הבא' },
  'Voir le programme complet': { en: 'View Full Program', es: 'Ver Programa Completo', he: 'צפה בתוכנית המלאה' },
  'Intéressé par un pèlerinage ?': { en: 'Interested in a Pilgrimage?', es: '¿Interesado en una Peregrinación?', he: 'מעוניינים בעלייה לרגל?' },
  'Contactez-nous pour plus d\'informations sur les prochains événements': {
    en: 'Contact us for more information about upcoming events',
    es: 'Contáctenos para más información sobre los próximos eventos',
    he: 'צרו קשר למידע נוסף על האירועים הקרובים'
  },
  'Pension complète': { en: 'Full board', es: 'Pensión completa', he: 'פנסיון מלא' },
  'Transferts organisés': { en: 'Organized transfers', es: 'Traslados organizados', he: 'העברות מאורגנות' },
  'Kashrout certifié': { en: 'Certified Kashrut', es: 'Kashrut certificado', he: 'כשרות מאושרת' },
  'Programme complet': { en: 'Full program', es: 'Programa completo', he: 'תוכנית מלאה' },
  'Pension complète, transferts (vols exclus)': { en: 'Full board, transfers (flights excluded)', es: 'Pensión completa, traslados (vuelos excluidos)', he: 'פנסיון מלא, העברות (לא כולל טיסות)' },
  'Glatt Kosher Beth Yossef': { en: 'Glatt Kosher Beth Yosef', es: 'Glatt Kosher Beth Yosef', he: 'גלאט כשר בית יוסף' },

  // Souccot
  'Souccot': { en: 'Sukkot', es: 'Sucot', he: 'סוכות' },
  'Les 4 Espèces': { en: 'The 4 Species', es: 'Las 4 Especies', he: 'ארבעת המינים' },
  'Kits Arba Minim (4 espèces) de qualité': { en: 'Quality Arba Minim (4 species) Kits', es: 'Kits de Arba Minim (4 especies) de calidad', he: 'ערכות ארבעת המינים באיכות גבוהה' },
  'Passer vos commandes en ligne': { en: 'Place your orders online', es: 'Realice sus pedidos en línea', he: 'הזמינו אונליין' },
  'Vente en ligne de kits Arba Minim pour la fête de Souccot. Période : Avant Souccot (Aout-septembre-octobre)': {
    en: 'Online sale of Arba Minim kits for the Sukkot holiday. Period: Before Sukkot (August-September-October)',
    es: 'Venta en línea de kits de Arba Minim para la fiesta de Sucot. Período: Antes de Sucot (Agosto-Septiembre-Octubre)',
    he: 'מכירה מקוונת של ערכות ארבעת המינים לחג הסוכות. תקופה: לפני סוכות (אוגוסט-ספטמבר-אוקטובר)'
  },
  'Loulav': { en: 'Lulav', es: 'Lulav', he: 'לולב' },
  'Branche de palmier': { en: 'Palm branch', es: 'Rama de palma', he: 'כפת תמרים' },
  'Etrog': { en: 'Etrog', es: 'Etrog', he: 'אתרוג' },
  'Cédrat': { en: 'Citron', es: 'Cidra', he: 'אתרוג' },
  'Hadassim': { en: 'Hadassim', es: 'Hadassim', he: 'הדסים' },
  '3 branches de myrte': { en: '3 myrtle branches', es: '3 ramas de mirto', he: '3 בדי הדס' },
  'Aravot': { en: 'Aravot', es: 'Aravot', he: 'ערבות' },
  '2 branches de saule': { en: '2 willow branches', es: '2 ramas de sauce', he: '2 בדי ערבה' },
  'Standard / Kosher': { en: 'Standard / Kosher', es: 'Estándar / Kosher', he: 'רגיל / כשר' },
  'Valide halakhiquement': { en: 'Halachically valid', es: 'Válido halájicamente', he: 'כשר הלכתית' },
  'Méhoudar': { en: 'Mehudar', es: 'Mehudar', he: 'מהודר' },
  'Qualité améliorée': { en: 'Enhanced quality', es: 'Calidad mejorada', he: 'איכות משופרת' },
  'Méhoudar min haméhoudar': { en: 'Mehudar min Hamehudar', es: 'Mehudar min Hamehudar', he: 'מהודר מן המהודר' },
  'Très haute qualité': { en: 'Very high quality', es: 'Muy alta calidad', he: 'איכות גבוהה מאוד' },
  'Premium / Luxe': { en: 'Premium / Luxury', es: 'Premium / Lujo', he: 'פרימיום / יוקרה' },
  'Qualité exceptionnelle': { en: 'Exceptional quality', es: 'Calidad excepcional', he: 'איכות יוצאת דופן' },
  'Livraison': { en: 'Delivery', es: 'Entrega', he: 'משלוח' },
  'Livraison en France principalement. Architecture prête pour expansion vers Israël.': {
    en: 'Delivery mainly in France. Ready for expansion to Israel.',
    es: 'Entrega principalmente en Francia. Listo para expansión a Israel.',
    he: 'משלוחים בעיקר בצרפת. מוכנים להרחבה לישראל.'
  },
  'Frais de livraison conditionnels selon la quantité et la période.': {
    en: 'Shipping costs vary based on quantity and period.',
    es: 'Gastos de envío condicionales según cantidad y período.',
    he: 'דמי משלוח תלויים בכמות ובתקופה.'
  },
  'Prêt à commander votre kit ?': { en: 'Ready to Order Your Kit?', es: '¿Listo para Pedir su Kit?', he: 'מוכנים להזמין את הערכה שלכם?' },
  'Sélectionnez votre niveau de qualité et passez commande': {
    en: 'Select your quality level and place your order',
    es: 'Seleccione su nivel de calidad y haga su pedido',
    he: 'בחרו את רמת האיכות והזמינו'
  },
  'Le système e-commerce complet sera disponible prochainement. En attendant, contactez-nous directement.': {
    en: 'The complete e-commerce system will be available soon. In the meantime, contact us directly.',
    es: 'El sistema de comercio electrónico completo estará disponible próximamente. Mientras tanto, contáctenos directamente.',
    he: 'מערכת המסחר המלאה תהיה זמינה בקרוב. בינתיים, צרו קשר ישירות.'
  },
  'Commander par WhatsApp': { en: 'Order via WhatsApp', es: 'Pedir por WhatsApp', he: 'הזמינו בוואטסאפ' },

  // Dates
  'Séjour Principal': { en: 'Main Stay', es: 'Estancia Principal', he: 'שהייה עיקרית' },
  'Weekend Prolongé': { en: 'Extended Weekend', es: 'Fin de Semana Extendido', he: 'סוף שבוע מורחב' },
  '+2 nuits (optionnel)': { en: '+2 nights (optional)', es: '+2 noches (opcional)', he: '+2 לילות (אופציונלי)' },
  '10 nuits': { en: '10 nights', es: '10 noches', he: '10 לילות' },
  '31 Mars - 10 Avril 2026': { en: 'March 31 - April 10, 2026', es: '31 de Marzo - 10 de Abril de 2026', he: '31 במרץ - 10 באפריל 2026' },
  '10 - 12 Avril 2026': { en: 'April 10 - 12, 2026', es: '10 - 12 de Abril de 2026', he: '10-12 באפריל 2026' },
  '31 MARS - 12 AVRIL': { en: 'MARCH 31 - APRIL 12', es: '31 MARZO - 12 ABRIL', he: '31 במרץ - 12 באפריל' },
  '29 Janvier - 1er Février 2026': { en: 'January 29 - February 1, 2026', es: '29 de Enero - 1 de Febrero de 2026', he: '29 בינואר - 1 בפברואר 2026' },
  '4 jours / 3 nuits': { en: '4 days / 3 nights', es: '4 días / 3 noches', he: '4 ימים / 3 לילות' },

  // Supervision kashrout
  'Glatt Kasher Laméhadrine': { en: 'Glatt Kosher Lamehadrin', es: 'Glatt Kosher Lamehadrin', he: 'גלאט כשר למהדרין' },
  'Rav Mordehai Cohen de Malaga': { en: 'Rabbi Mordechai Cohen of Malaga', es: 'Rav Mordejai Cohen de Málaga', he: 'הרב מרדכי כהן ממלגה' },
  'Viandes sous surveillance Rav Ephraïm Cremisi': { en: 'Meat under supervision of Rabbi Ephraim Cremisi', es: 'Carnes bajo supervisión del Rav Efraím Cremisi', he: 'בשר תחת השגחת הרב אפרים קרמיזי' },

  // Animation
  'Animation Enfants': { en: 'Kids Entertainment', es: 'Animación Infantil', he: 'בידור לילדים' },
};

// Fonction de traduction avec dictionnaire puis fallback
function translateText(text: string, targetLang: string): string {
  if (!text || text.trim() === '') return '';

  // Vérifier si on a une traduction manuelle
  if (manualTranslations[text] && manualTranslations[text][targetLang]) {
    return manualTranslations[text][targetLang];
  }

  // Sinon retourner le texte original (sera marqué pour traduction manuelle)
  return text;
}

// Traduire récursivement un objet
function translateObject(obj: any, targetLang: string): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Ne pas traduire les URLs, emails, numéros de téléphone, etc.
    if (
      obj.startsWith('http') ||
      obj.startsWith('/') ||
      obj.includes('@') ||
      obj.match(/^\+?\d[\d\s-]+$/) ||
      obj.length < 2 ||
      obj.match(/^\d+$/) ||
      obj.match(/^[A-Z]{1,3}$/) // Codes comme "S", "P", "EC", etc.
    ) {
      return obj;
    }

    return translateText(obj, targetLang);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, targetLang));
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      // Ne pas traduire les clés qui commencent par _
      if (key.startsWith('_')) {
        result[key] = obj[key];
        continue;
      }
      result[key] = translateObject(obj[key], targetLang);
    }
    return result;
  }

  return obj;
}

export async function POST(request: NextRequest) {
  try {
    const { pageId, targetLangs } = await request.json();

    if (!pageId) {
      return NextResponse.json({ error: 'pageId required' }, { status: 400 });
    }

    const langs = targetLangs || ['en', 'es', 'he'];

    // 1. Récupérer le contenu français depuis Supabase
    const getResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!getResponse.ok) {
      return NextResponse.json({ error: 'Failed to get content' }, { status: 500 });
    }

    const data = await getResponse.json();
    if (!data || data.length === 0 || !data[0].content) {
      return NextResponse.json({ error: 'No content found' }, { status: 404 });
    }

    const frenchContent = data[0].content;
    const translations: Record<string, any> = { fr: frenchContent };

    // 2. Traduire vers chaque langue cible
    for (const lang of langs) {
      console.log(`Translating ${pageId} to ${lang}...`);
      translations[lang] = translateObject(frenchContent, lang);
    }

    // 3. Sauvegarder les traductions dans Supabase
    const saveResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          translations: translations,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!saveResponse.ok) {
      const error = await saveResponse.text();
      console.error('Save error:', error);
      return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pageId,
      languages: ['fr', ...langs],
      message: `Translated ${pageId} to ${langs.join(', ')}`,
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Traduction batch de toutes les pages
export async function PUT(request: NextRequest) {
  try {
    const pages = ['accueil', 'pessah-sejour', 'pessah-hotel', 'galerie', 'marbella', 'marrakech', 'hilloula', 'souccot', 'contact'];
    const langs = ['en', 'es', 'he'];
    const results: any[] = [];

    for (const pageId of pages) {
      try {
        // Récupérer le contenu français
        const getResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}&select=content`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
          }
        );

        if (!getResponse.ok) {
          results.push({ pageId, status: 'error', message: 'Failed to get content' });
          continue;
        }

        const data = await getResponse.json();
        if (!data || data.length === 0 || !data[0].content) {
          results.push({ pageId, status: 'skipped', message: 'No content' });
          continue;
        }

        const frenchContent = data[0].content;
        const translations: Record<string, any> = { fr: frenchContent };

        // Traduire vers chaque langue
        for (const lang of langs) {
          console.log(`Translating ${pageId} to ${lang}...`);
          translations[lang] = translateObject(frenchContent, lang);
        }

        // Sauvegarder les traductions
        const saveResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/page_content?page_id=eq.${pageId}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              translations: translations,
              updated_at: new Date().toISOString(),
            }),
          }
        );

        if (saveResponse.ok) {
          results.push({ pageId, status: 'success', languages: langs });
        } else {
          results.push({ pageId, status: 'error', message: 'Failed to save' });
        }

      } catch (error) {
        results.push({ pageId, status: 'error', message: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: pages.length,
        success: results.filter(r => r.status === 'success').length,
        errors: results.filter(r => r.status === 'error').length,
        skipped: results.filter(r => r.status === 'skipped').length,
      },
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
