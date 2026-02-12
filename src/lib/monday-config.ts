// Configuration Monday.com pour K Prestige
// Board: K PRESTIGE (ID: 5088974391)

export const MONDAY_CONFIG = {
  API_KEY: process.env.MONDAY_API_KEY || '',
  BOARD_ID: '5088974391',
  API_URL: 'https://api.monday.com/v2',
};

// Mapping des colonnes Monday.com
export const MONDAY_COLUMNS = {
  // Informations client
  name: 'name', // Nom + prenom (obligatoire - c'est le nom de l'item)
  phone: 'phone_mkym16bq', // Téléphone portable
  email: 'email_mkymggcj', // E-mail
  status: 'color_mkymgn0s', // STATUT
  liaison: 'text_mkym4mae', // LIAISON

  // Composition groupe
  nbAdultes: 'numeric_mkym71hm', // Nb d'adultes
  nbBebe: 'numeric_mkymw5h0', // Nb bébé
  nbEnfants3ans: 'numeric_mkyms4a7', // Nb d'enfants de 3 ans
  nbEnfants4a6: 'numeric_mkymwagf', // Nb d'enfants de 4 à 6 ans
  nbEnfants7a11: 'numeric_mkymh7he', // Nb d'enfants de 7 à 11 ans
  nbPersonnesTotal: 'single_selecti8kw646', // Nombre de personnes totales (status: 1-8)

  // Référence
  numDevis: 'text_mkym8td0', // N° DEVIS
  info: 'long_text_mkymvzjn', // INFO

  // Navettes
  navetteChoix: 'single_selectk3d7j6g', // Veuillez choisir les navettes souhaitées
  dateArrivee: 'date_mkymcxhm', // Date d'arrivée
  heureArrivee: 'short_text7ct1e4cu', // Heure d'arrivée
  volArrivee: 'text_mkymddrx', // Numéro de vol - arrivé
  navetteArriveeNb: 'numeric_mkym8455', // NAVETTE ARRIVER - Nombre
  heureVolArrivee: 'hour_mm0g86wt', // Heure vol d'arrivée

  dateRetour: 'date_mkymqqv2', // Date de retour
  heureDepart: 'short_text446v8hln', // Heure départ
  volDepart: 'text_mkymfxfd', // Numéro de vol - départ
  navetteRetourNb: 'numeric_mkym8scx', // NAVETTE RETOUR - Nombre
  heureVolDepart: 'hour_mm0g3he7', // Heure vol de départ

  // Participants (Personne 1-7)
  pers1Nom: 'text_mkym95jr', // Pers 1 - nom + prénom
  pers1DateNaissance: 'date_mkym1twn', // Pers 1 - date de naissance

  pers2Nom: 'text_mkym7gsv', // Pers 2 - nom + prénom
  pers2DateNaissance: 'date_mkym9ntb', // Pers 2 - date de naissance

  pers3Nom: 'text_mkyma1m6', // Pers 3 - nom + prénom
  pers3DateNaissance: 'date_mkymvmgy', // Pers 3 - date de naissance

  pers4Nom: 'text_mkymq2y0', // Pers 4 - nom + prénom
  pers4DateNaissance: 'date_mkymjz1v', // Pers 4 - date de naissance

  pers5Nom: 'text_mkymb6es', // Pers 5 - nom + prénom
  pers5DateNaissance: 'date_mkymgb9f', // Pers 5 - date de naissance

  pers6Nom: 'text_mkymesfa', // Pers 6 - nom + prénom
  pers6DateNaissance: 'date_mkymfd2f', // Pers 6 - date de naissance

  pers7Nom: 'text_mkympd75', // Pers 7 - nom + prénom
  pers7DateNaissance: 'date_mkym2mkx', // Pers 7 - date de naissance

  // Préférences alimentaires
  questionnaireOuiNon: 'single_selectsg45vyc', // Souhaitez-vous répondre au questionnaire ?
  preferenceAlimentaire: 'multi_selecttfh1v4kh', // Préférence alimentaire (dropdown)
  autrePreciser: 'long_text4rh72w7d', // Autre préciser
  preferenceAlcool: 'multi_selectcmrbbj8m', // Vos préférences alcool
  carteVins: 'single_select87ldffo', // Souhaitez-vous recevoir notre carte des vins payante ?
  salades: 'multi_select45jakzdc', // Quelles sont vos 5 salades

  // Informations complémentaires
  famillesTable: 'long_text7ll6jsvn', // Familles avec lesquelles vous asseoir
  infosComplementaires: 'long_textufjsazvk', // Informations complémentaires

  // Fichiers
  passeport: 'file_mkymzb2b', // Passeport
  devis: 'file_mkymarej', // DEVIS

  // Chambres (relations)
  chambre1: 'board_relation_mkym2r5m', // CHAMBRE
  chambre2: 'board_relation_mm0ftrm', // CHAMBRE 2
  chambre3: 'board_relation_mm0f5m7c', // CHAMBRE 3

  // Finances
  doit: 'numeric_mkymk82t', // DOIT
  reste: 'numeric_mkymw20h', // RESTE

  // Acomptes
  acompte1Montant: 'numeric_mkymgah1',
  acompte1MP: 'color_mkymeaqd',
  acompte1Date: 'date_mkymwent',
  acompte2Montant: 'numeric_mkymtcta',
  acompte2MP: 'color_mkym5tk4',
  acompte2Date: 'date_mkym4fka',
  acompte3Montant: 'numeric_mkympf8y',
  acompte3MP: 'color_mkymed7e',
  acompte3Date: 'date_mkymkgkv',
  acompte4Montant: 'numeric_mkymjkm0',
  acompte4MP: 'color_mkymnak1',
  acompte4Date: 'date_mkyms42g',
};

// Options pour les status/dropdown
export const MONDAY_OPTIONS = {
  statut: {
    INSCRIT: '0',       // Inscription terminée
    VALIDE: '1',        // Validé
    HS: '2',            // Hors service
    ATTENTE_ACOMPTE: '3',
    EN_COURS: '4',      // Inscription en cours
    NOUVEAU: '5',       // Nouveau (devis)
  },

  nbPersonnes: {
    '1': '0',
    '2': '1',
    '3': '2',
    '4': '3',
    '5': '4',
    '6': '6',
    '7': '7',
    '8': '8',
  },

  navetteChoix: {
    ARRIVEE_SEULEMENT: '0',
    DEPART_SEULEMENT: '1',
    ARRIVEE_DEPART: '2',
    PAS_DE_BESOIN: '3',
  },

  questionnaireOuiNon: {
    OUI: '0',
    NON: '1',
  },

  carteVins: {
    OUI: '0',
    NON: '1',
  },

  preferenceAlimentaire: {
    MAROCAIN: 0,
    TUNISIEN: 1,
    VEGETARIEN: 2,
    PAS_AGNEAU: 3,
    PAS_CANNELLE: 4,
    AUTRE: 5,
  },

  preferenceAlcool: {
    VIN_ROUGE: 0,
    VIN_BLANC: 1,
    ROSE: 2,
    MOSCATO_BLANC: 3,
    MOSCATO_ROSE: 4,
    ANISETTE: 5,
    BOUHA: 6,
    PASTIS: 7,
    ARAK: 8,
    VODKA: 9,
    PAS_ALCOOL: 10,
  },

  salades: {
    AUBERGINE_FRIT: 0,
    AVOCAT: 1,
    BETTERAVE: 2,
    CAROTTE_RAPE: 3,
    CAVIAR_AUBERGINES: 4,
    CHAMPIGNON: 5,
    CHOUX_BLANC: 6,
    CHOUX_ROUGE: 7,
    CONCOMBRE: 8,
    CONCOMBRE_TOMATE_OIGNON: 9,
    COLESLAW: 10,
    FENOUILS: 11,
    FEVE_CUMIN: 12,
    NAVET: 13,
    OEUF_MAYONNAISE: 14,
    PIMENT_FRIT: 15,
    POIVRON_GRILLE: 16,
    PDT_HARISSA: 17,
    PDT_MAYONNAISE: 18,
    RADIS: 19,
    SALADE_MAKBOUBA: 20,
    ARTICHAUT_CUIT: 21,
    OLIVE_SAUCE_ROUGE: 22,
    CAROTTES_CUITE: 23,
    THON_MAYONNAISE: 24,
    TOMATE_OIGNON: 25,
    VARIANTE: 26,
  },

  modePaiement: {
    VIREMENT: '0',
    CB: '1',
    CERFA: '2',
    ESPECE: '3',
  },
};

// Labels lisibles pour le formulaire
export const MONDAY_LABELS = {
  preferenceAlimentaire: [
    { id: 0, label: 'Marocain' },
    { id: 1, label: 'Tunisien' },
    { id: 2, label: 'Végétarien' },
    { id: 3, label: "J'aime pas l'agneau" },
    { id: 4, label: "J'aime pas la cannelle" },
    { id: 5, label: 'Autre' },
  ],

  preferenceAlcool: [
    { id: 0, label: 'Vin rouge' },
    { id: 1, label: 'Vin blanc' },
    { id: 2, label: 'Rosé' },
    { id: 3, label: 'Moscato blanc' },
    { id: 4, label: 'Moscato Rosé' },
    { id: 5, label: 'Anisette' },
    { id: 6, label: 'Bouha' },
    { id: 7, label: 'Pastis' },
    { id: 8, label: 'Arak' },
    { id: 9, label: 'Vodka' },
    { id: 10, label: "Je ne bois pas d'alcool" },
  ],

  salades: [
    { id: 0, label: 'Aubergine frit' },
    { id: 1, label: 'Avocat' },
    { id: 2, label: 'Betterave' },
    { id: 3, label: 'Carotte rapé' },
    { id: 4, label: "Caviar d'aubergines" },
    { id: 5, label: 'Champignon' },
    { id: 6, label: 'Choux blanc' },
    { id: 7, label: 'Choux rouge' },
    { id: 8, label: 'Concombre' },
    { id: 9, label: 'Concombre tomate oignon' },
    { id: 10, label: 'Coleslaw' },
    { id: 11, label: 'Fenouils' },
    { id: 12, label: 'Fève au cumin' },
    { id: 13, label: 'Navet' },
    { id: 14, label: 'Oeuf mayonnaise' },
    { id: 15, label: 'Piment frit' },
    { id: 16, label: 'Poivron grillé' },
    { id: 17, label: 'Pomme de terre harissa' },
    { id: 18, label: 'Pomme de terre mayonnaise' },
    { id: 19, label: 'Radis' },
    { id: 20, label: 'Salade cuite makbouba' },
    { id: 21, label: "Salade d'artichaut cuit" },
    { id: 22, label: "Salade d'olive sauce rouge" },
    { id: 23, label: 'Salade de carottes cuite' },
    { id: 24, label: 'Thon mayonnaise' },
    { id: 25, label: 'Tomate oignon' },
    { id: 26, label: 'Variante' },
  ],

  navetteChoix: [
    { value: '0', label: 'Arrivée seulement' },
    { value: '1', label: 'Départ seulement' },
    { value: '2', label: 'Arrivée + départ' },
    { value: '3', label: 'Pas de besoin' },
  ],
};
