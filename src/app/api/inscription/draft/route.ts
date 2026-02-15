import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { MONDAY_CONFIG, MONDAY_COLUMNS, MONDAY_OPTIONS } from '@/lib/monday-config';

// Supabase client avec service role pour accès complet
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Créer un item Monday avec statut "EN COURS"
async function createMondayDraft(nomPrenom: string, email: string, telephone: string, dossierCode: string) {
  try {
    console.log('=== createMondayDraft START ===');
    console.log('Params:', { nomPrenom, email, telephone, dossierCode });

    // Lire la clé API directement pour s'assurer qu'elle est disponible
    const mondayApiKey = process.env.MONDAY_API_KEY;
    console.log('MONDAY_API_KEY présente:', !!mondayApiKey, 'longueur:', mondayApiKey?.length);

    if (!mondayApiKey) {
      console.error('MONDAY_API_KEY non configurée');
      return null;
    }

    const columnValues: Record<string, unknown> = {
      [MONDAY_COLUMNS.status]: { index: parseInt(MONDAY_OPTIONS.statut.EN_COURS) },
      [MONDAY_COLUMNS.email]: { email, text: email },
      [MONDAY_COLUMNS.liaison]: dossierCode,
    };

    if (telephone) {
      columnValues[MONDAY_COLUMNS.phone] = { phone: telephone.replace(/\s/g, ''), countryShortName: 'FR' };
    }

    const mutation = `
      mutation {
        create_item (
          board_id: ${MONDAY_CONFIG.BOARD_ID},
          item_name: "${nomPrenom.replace(/"/g, '\\"')}",
          column_values: ${JSON.stringify(JSON.stringify(columnValues))}
        ) {
          id
          name
        }
      }
    `;

    console.log('Création Monday draft pour:', nomPrenom, 'code:', dossierCode);
    console.log('Mutation:', mutation.substring(0, 200) + '...');
    console.log('API URL:', MONDAY_CONFIG.API_URL);

    const response = await fetch(MONDAY_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': mondayApiKey,
      },
      body: JSON.stringify({ query: mutation }),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response body:', JSON.stringify(result).substring(0, 500));

    if (result.errors) {
      console.error('Erreur API Monday:', JSON.stringify(result.errors));
      return null;
    }

    const itemId = result.data?.create_item?.id;
    console.log('Monday item créé:', itemId);
    console.log('=== createMondayDraft END ===');
    return itemId || null;
  } catch (error) {
    console.error('Erreur création Monday:', error);
    return null;
  }
}

// Mettre à jour l'item Monday avec les infos en cours (navettes, composition, etc.)
interface FormDataType {
  navetteChoix?: string;
  dateArrivee?: string;  // Date de séjour (Step 2)
  heureArrivee?: string;
  volArrivee?: string;
  dateRetour?: string;   // Date de séjour (Step 2)
  heureDepart?: string;
  volDepart?: string;
  nbAdultes?: number;
  nbBebe?: number;
  nbEnfants3ans?: number;
  nbEnfants4a6?: number;
  nbEnfants7a11?: number;
  nbPersonnesTotal?: string;
}

async function updateMondayDraft(mondayItemId: string, formData: FormDataType) {
  try {
    // Lire la clé API directement
    const mondayApiKey = process.env.MONDAY_API_KEY;
    if (!mondayApiKey) {
      console.error('MONDAY_API_KEY non configurée pour update');
      return false;
    }

    const columnValues: Record<string, unknown> = {};

    // Navettes - gérer le reset des champs quand le choix change
    if (formData.navetteChoix !== undefined) {
      columnValues[MONDAY_COLUMNS.navetteChoix] = { index: parseInt(formData.navetteChoix) };

      // Si "Pas de besoin" (3), effacer tous les champs navette
      if (formData.navetteChoix === '3') {
        columnValues[MONDAY_COLUMNS.heureArrivee] = '';
        columnValues[MONDAY_COLUMNS.volArrivee] = '';
        columnValues[MONDAY_COLUMNS.heureDepart] = '';
        columnValues[MONDAY_COLUMNS.volDepart] = '';
      } else {
        // Navette arrivée (choix 0 ou 2)
        if (formData.navetteChoix === '0' || formData.navetteChoix === '2') {
          if (formData.heureArrivee) {
            columnValues[MONDAY_COLUMNS.heureArrivee] = formData.heureArrivee;
          }
          if (formData.volArrivee) {
            columnValues[MONDAY_COLUMNS.volArrivee] = formData.volArrivee;
          }
        } else {
          // Pas de navette arrivée, effacer
          columnValues[MONDAY_COLUMNS.heureArrivee] = '';
          columnValues[MONDAY_COLUMNS.volArrivee] = '';
        }

        // Navette retour (choix 1 ou 2)
        if (formData.navetteChoix === '1' || formData.navetteChoix === '2') {
          if (formData.heureDepart) {
            columnValues[MONDAY_COLUMNS.heureDepart] = formData.heureDepart;
          }
          if (formData.volDepart) {
            columnValues[MONDAY_COLUMNS.volDepart] = formData.volDepart;
          }
        } else {
          // Pas de navette retour, effacer
          columnValues[MONDAY_COLUMNS.heureDepart] = '';
          columnValues[MONDAY_COLUMNS.volDepart] = '';
        }
      }
    }

    // Dates de séjour (Step 2 - Groupe) → colonnes dateSejourArrivee et dateSejourDepart
    if (formData.dateArrivee) {
      columnValues[MONDAY_COLUMNS.dateSejourArrivee] = { date: formData.dateArrivee };
    }
    if (formData.dateRetour) {
      columnValues[MONDAY_COLUMNS.dateSejourDepart] = { date: formData.dateRetour };
    }

    // Composition groupe
    if (formData.nbAdultes) {
      columnValues[MONDAY_COLUMNS.nbAdultes] = String(formData.nbAdultes);
    }
    if (formData.nbBebe) {
      columnValues[MONDAY_COLUMNS.nbBebe] = String(formData.nbBebe);
    }
    if (formData.nbEnfants3ans) {
      columnValues[MONDAY_COLUMNS.nbEnfants3ans] = String(formData.nbEnfants3ans);
    }
    if (formData.nbEnfants4a6) {
      columnValues[MONDAY_COLUMNS.nbEnfants4a6] = String(formData.nbEnfants4a6);
    }
    if (formData.nbEnfants7a11) {
      columnValues[MONDAY_COLUMNS.nbEnfants7a11] = String(formData.nbEnfants7a11);
    }

    // Nombre de personnes total
    if (formData.nbPersonnesTotal) {
      const nbPersonnesIndex = MONDAY_OPTIONS.nbPersonnes[formData.nbPersonnesTotal as keyof typeof MONDAY_OPTIONS.nbPersonnes];
      if (nbPersonnesIndex !== undefined) {
        columnValues[MONDAY_COLUMNS.nbPersonnesTotal] = { index: parseInt(nbPersonnesIndex) };
      }
    }

    // Si aucune donnée à mettre à jour, on ne fait rien
    if (Object.keys(columnValues).length === 0) {
      return true;
    }

    const mutation = `
      mutation {
        change_multiple_column_values (
          board_id: ${MONDAY_CONFIG.BOARD_ID},
          item_id: ${mondayItemId},
          column_values: ${JSON.stringify(JSON.stringify(columnValues))}
        ) {
          id
        }
      }
    `;

    console.log('Update Monday draft:', mondayItemId, 'colonnes:', Object.keys(columnValues));

    const response = await fetch(MONDAY_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': mondayApiKey,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error('Erreur update Monday:', JSON.stringify(result.errors));
      return false;
    }
    console.log('Monday update réussi pour item:', mondayItemId);
    return true;
  } catch (error) {
    console.error('Erreur update Monday:', error);
    return false;
  }
}

// Génération d'un code de dossier unique (format: KP + 2 chiffres année + 3 chiffres aléatoires)
function generateDossierCode(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 900 + 100);
  return `KP${year}${random}`;
}

// POST: Créer un nouveau brouillon ou mettre à jour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, code, formData, currentStep, email, telephone, nomPrenom, lang = 'fr' } = body;

    // Action: créer un nouveau dossier
    if (action === 'create') {
      // Générer un code unique
      let dossierCode = generateDossierCode();
      let attempts = 0;

      // S'assurer que le code est unique
      while (attempts < 10) {
        const { data: existing } = await supabase
          .from('inscription_drafts')
          .select('code')
          .eq('code', dossierCode)
          .single();

        if (!existing) break;
        dossierCode = generateDossierCode();
        attempts++;
      }

      // Créer l'item Monday avec statut "EN COURS"
      console.log('=== ACTION CREATE ===');
      console.log('nomPrenom:', nomPrenom, 'email:', email, 'telephone:', telephone);

      let mondayItemId: string | null = null;
      if (nomPrenom && email) {
        console.log('Appel createMondayDraft...');
        mondayItemId = await createMondayDraft(nomPrenom, email, telephone || '', dossierCode);
        console.log('Résultat mondayItemId:', mondayItemId);
      } else {
        console.log('nomPrenom ou email manquant, skip Monday');
      }

      // Insérer le brouillon
      const { data, error } = await supabase
        .from('inscription_drafts')
        .insert({
          code: dossierCode,
          form_data: formData || {},
          current_step: currentStep || 1,
          email: email || null,
          telephone: telephone || null,
          nom_prenom: nomPrenom || null,
          monday_item_id: mondayItemId,
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur création brouillon:', error);
        return NextResponse.json({ error: 'Erreur lors de la création du dossier' }, { status: 500 });
      }

      // Envoyer l'email si email fourni et Resend configuré
      if (email && process.env.RESEND_API_KEY) {
        try {
          await sendDossierEmail(email, dossierCode, nomPrenom, lang as Lang);
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
          // On continue même si l'email échoue
        }
      }

      return NextResponse.json({
        success: true,
        code: dossierCode,
        mondayItemId,
        message: 'Dossier créé avec succès'
      });
    }

    // Action: mettre à jour un brouillon existant
    if (action === 'update' && code) {
      const updateData: Record<string, unknown> = {};

      if (formData !== undefined) updateData.form_data = formData;
      if (currentStep !== undefined) updateData.current_step = currentStep;
      if (email !== undefined) updateData.email = email;
      if (telephone !== undefined) updateData.telephone = telephone;
      if (nomPrenom !== undefined) updateData.nom_prenom = nomPrenom;

      const { error } = await supabase
        .from('inscription_drafts')
        .update(updateData)
        .eq('code', code)
        .eq('is_submitted', false);

      if (error) {
        console.error('Erreur mise à jour brouillon:', error);
        return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
      }

      // Récupérer le monday_item_id depuis la DB si non fourni
      let mondayItemId = body.mondayItemId;
      if (!mondayItemId) {
        const { data: draftData } = await supabase
          .from('inscription_drafts')
          .select('monday_item_id, nom_prenom, email, telephone')
          .eq('code', code)
          .single();

        mondayItemId = draftData?.monday_item_id;

        // Si toujours pas de monday_item_id, le créer maintenant
        if (!mondayItemId && draftData?.nom_prenom && draftData?.email) {
          console.log('Création Monday item pour dossier sans monday_item_id (update)');
          mondayItemId = await createMondayDraft(draftData.nom_prenom, draftData.email, draftData.telephone || '', code);
          if (mondayItemId) {
            await supabase
              .from('inscription_drafts')
              .update({ monday_item_id: mondayItemId })
              .eq('code', code);
          }
        }
      }

      // Mettre à jour Monday avec les infos navettes et composition
      console.log('Update draft - mondayItemId:', mondayItemId, 'hasFormData:', !!formData);
      if (mondayItemId && formData) {
        const updateResult = await updateMondayDraft(mondayItemId, formData);
        console.log('Monday update result:', updateResult);
      } else if (!mondayItemId) {
        console.log('Pas de mondayItemId disponible pour update Monday');
      }

      return NextResponse.json({ success: true, mondayItemId, message: 'Sauvegardé' });
    }

    // Action: marquer comme soumis
    if (action === 'submit' && code) {
      // Récupérer les infos COMPLÈTES du dossier pour l'email de confirmation
      const { data: draftData } = await supabase
        .from('inscription_drafts')
        .select('email, nom_prenom, form_data, telephone')
        .eq('code', code)
        .single();

      const { error } = await supabase
        .from('inscription_drafts')
        .update({
          is_submitted: true,
          submitted_at: new Date().toISOString(),
          monday_item_id: body.mondayItemId || null,
        })
        .eq('code', code);

      if (error) {
        console.error('Erreur soumission:', error);
        return NextResponse.json({ error: 'Erreur lors de la soumission' }, { status: 500 });
      }

      // Envoyer l'email de confirmation finale avec récapitulatif
      if (draftData?.email && process.env.RESEND_API_KEY) {
        try {
          await sendConfirmationEmail(
            draftData.email,
            code,
            draftData.nom_prenom,
            lang as Lang,
            draftData.form_data,
            draftData.telephone
          );
          console.log('Email de confirmation envoyé à:', draftData.email);
        } catch (emailError) {
          console.error('Erreur envoi email confirmation:', emailError);
          // On continue même si l'email échoue
        }
      }

      return NextResponse.json({ success: true, message: 'Inscription soumise' });
    }

    // Action: renvoyer l'email avec le code
    if (action === 'resend_email' && code && email) {
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: 'Service email non configuré' }, { status: 500 });
      }

      try {
        await sendDossierEmail(email, code, nomPrenom);
        return NextResponse.json({ success: true, message: 'Email envoyé' });
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET: Récupérer un brouillon par code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code requis' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('inscription_drafts')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Dossier non trouvé' }, { status: 404 });
    }

    // Vérifier si expiré
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Ce dossier a expiré' }, { status: 410 });
    }

    // Vérifier si déjà soumis
    if (data.is_submitted) {
      return NextResponse.json({
        error: 'Cette inscription a déjà été soumise',
        submitted: true,
        submitted_at: data.submitted_at
      }, { status: 400 });
    }

    // Si pas de monday_item_id, créer l'item Monday maintenant
    let mondayItemId = data.monday_item_id;
    if (!mondayItemId && data.nom_prenom && data.email) {
      console.log('Création Monday item pour dossier existant sans monday_item_id:', data.code);
      mondayItemId = await createMondayDraft(data.nom_prenom, data.email, data.telephone || '', data.code);

      // Mettre à jour le dossier avec le monday_item_id
      if (mondayItemId) {
        await supabase
          .from('inscription_drafts')
          .update({ monday_item_id: mondayItemId })
          .eq('code', data.code);
      }
    }

    return NextResponse.json({
      success: true,
      code: data.code,
      formData: data.form_data,
      currentStep: data.current_step,
      email: data.email,
      telephone: data.telephone,
      nomPrenom: data.nom_prenom,
      mondayItemId: mondayItemId,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Traductions pour les emails
const EMAIL_TRANSLATIONS = {
  fr: {
    greeting: 'Bonjour',
    draftSubject: 'Votre dossier K Prestige',
    draftTitle: 'Votre dossier d\'inscription a été créé. Voici votre numéro de dossier :',
    codeLabel: 'Numéro de dossier',
    keepCode: 'Conservez précieusement ce numéro !',
    keepCodeDesc: 'Il vous permettra de reprendre votre inscription à tout moment si vous devez l\'interrompre.',
    resumeTitle: 'Pour reprendre votre inscription :',
    resumeLink: 'kprestige.com/inscription',
    autoSave: 'Votre progression est sauvegardée automatiquement. Vous pouvez fermer cette page et revenir plus tard.',
    footer: 'Séjour de luxe pour Pessah',
    confirmSubject: 'Confirmation de votre inscription Pessah 2026',
    confirmTitle: 'Votre inscription a été confirmée !',
    confirmText: 'Nous avons bien reçu votre inscription pour le séjour Pessah 2026 au Cabogata Beach Hotel 5*.',
    confirmShuttle: 'Vous avez demandé le service de navette. L\'équipe K PRESTIGE reviendra vers vous avec les informations détaillées dès que le planning des transferts sera finalisé.',
    // Récapitulatif
    summaryTitle: 'Récapitulatif de votre inscription',
    contactInfo: 'Coordonnées',
    phone: 'Téléphone',
    stayDates: 'Dates de séjour',
    arrival: 'Arrivée',
    departure: 'Départ',
    groupComposition: 'Composition du groupe',
    adults: 'Adultes',
    babies: 'Bébés (0-2 ans)',
    children3: 'Enfants 3 ans',
    children4to6: 'Enfants 4-6 ans',
    children7to11: 'Enfants 7-11 ans',
    totalPersons: 'Total personnes',
    shuttleService: 'Service navette',
    shuttleArrivalOnly: 'Navette arrivée uniquement',
    shuttleDepartureOnly: 'Navette départ uniquement',
    shuttleBoth: 'Navette arrivée + départ',
    shuttleNone: 'Pas de navette',
    arrivalFlight: 'Vol arrivée',
    departureFlight: 'Vol départ',
    participants: 'Participants',
    foodPreferences: 'Préférences alimentaires',
    wineCard: 'Carte des vins',
    wineCardYes: 'Souhaite recevoir la carte',
    wineCardNo: 'Ne souhaite pas recevoir la carte',
    tableWith: 'Souhaite être à table avec',
    additionalInfo: 'Informations complémentaires',
    yes: 'Oui',
    no: 'Non',
    confirmThanks: 'Merci pour votre confiance et au plaisir de vous accueillir !',
    teamSignature: 'L\'équipe K PRESTIGE',
    quoteNumber: 'Numéro de devis',
    reference: 'Référence',
  },
  en: {
    greeting: 'Hello',
    draftSubject: 'Your K Prestige file',
    draftTitle: 'Your registration file has been created. Here is your file number:',
    codeLabel: 'File number',
    keepCode: 'Keep this number safe!',
    keepCodeDesc: 'It will allow you to resume your registration at any time if you need to interrupt it.',
    resumeTitle: 'To resume your registration:',
    resumeLink: 'kprestige.com/en/inscription',
    autoSave: 'Your progress is saved automatically. You can close this page and come back later.',
    footer: 'Luxury Passover retreat',
    confirmSubject: 'Confirmation of your Passover 2026 registration',
    confirmTitle: 'Your registration has been confirmed!',
    confirmText: 'We have received your registration for the Passover 2026 stay at the Cabogata Beach Hotel 5*.',
    confirmShuttle: 'You requested the shuttle service. The K PRESTIGE team will contact you with detailed information once the transfer schedule is finalized.',
    confirmThanks: 'Thank you for your trust and we look forward to welcoming you!',
    teamSignature: 'The K PRESTIGE team',
    // Summary
    summaryTitle: 'Summary of your registration',
    contactInfo: 'Contact information',
    phone: 'Phone',
    stayDates: 'Stay dates',
    arrival: 'Arrival',
    departure: 'Departure',
    groupComposition: 'Group composition',
    adults: 'Adults',
    babies: 'Babies (0-2 years)',
    children3: 'Children 3 years',
    children4to6: 'Children 4-6 years',
    children7to11: 'Children 7-11 years',
    totalPersons: 'Total persons',
    shuttleService: 'Shuttle service',
    shuttleArrivalOnly: 'Arrival shuttle only',
    shuttleDepartureOnly: 'Departure shuttle only',
    shuttleBoth: 'Arrival + departure shuttle',
    shuttleNone: 'No shuttle',
    arrivalFlight: 'Arrival flight',
    departureFlight: 'Departure flight',
    participants: 'Participants',
    foodPreferences: 'Food preferences',
    wineCard: 'Wine card',
    wineCardYes: 'Would like to receive the card',
    wineCardNo: 'Does not wish to receive the card',
    tableWith: 'Would like to sit with',
    additionalInfo: 'Additional information',
    yes: 'Yes',
    no: 'No',
    quoteNumber: 'Quote number',
    reference: 'Reference',
  },
  he: {
    greeting: 'שלום',
    draftSubject: 'התיק שלך ב-K Prestige',
    draftTitle: 'תיק ההרשמה שלך נוצר. הנה מספר התיק שלך:',
    codeLabel: 'מספר תיק',
    keepCode: 'שמרו על מספר זה!',
    keepCodeDesc: 'הוא יאפשר לכם להמשיך את ההרשמה בכל עת אם תצטרכו להפסיק.',
    resumeTitle: 'להמשך ההרשמה:',
    resumeLink: 'kprestige.com/he/inscription',
    autoSave: 'ההתקדמות שלכם נשמרת אוטומטית. תוכלו לסגור את הדף ולחזור מאוחר יותר.',
    footer: 'חופשת פסח יוקרתית',
    confirmSubject: 'אישור הרשמתכם לפסח 2026',
    confirmTitle: 'ההרשמה שלכם אושרה!',
    confirmText: 'קיבלנו את הרשמתכם לשהייה בפסח 2026 במלון Cabogata Beach Hotel 5*.',
    confirmShuttle: 'ביקשתם שירות הסעות. צוות K PRESTIGE ייצור אתכם קשר עם פרטים מלאים לאחר סיום תכנון ההסעות.',
    confirmThanks: 'תודה על אמונכם ונשמח לארח אתכם!',
    teamSignature: 'צוות K PRESTIGE',
    // סיכום
    summaryTitle: 'סיכום ההרשמה שלכם',
    contactInfo: 'פרטי קשר',
    phone: 'טלפון',
    stayDates: 'תאריכי שהייה',
    arrival: 'הגעה',
    departure: 'עזיבה',
    groupComposition: 'הרכב הקבוצה',
    adults: 'מבוגרים',
    babies: 'תינוקות (0-2)',
    children3: 'ילדים בני 3',
    children4to6: 'ילדים 4-6',
    children7to11: 'ילדים 7-11',
    totalPersons: 'סה"כ נפשות',
    shuttleService: 'שירות הסעות',
    shuttleArrivalOnly: 'הסעה בהגעה בלבד',
    shuttleDepartureOnly: 'הסעה בעזיבה בלבד',
    shuttleBoth: 'הסעה בהגעה + עזיבה',
    shuttleNone: 'ללא הסעה',
    arrivalFlight: 'טיסת הגעה',
    departureFlight: 'טיסת עזיבה',
    participants: 'משתתפים',
    foodPreferences: 'העדפות אוכל',
    wineCard: 'כרטיס יינות',
    wineCardYes: 'מעוניין לקבל את הכרטיס',
    wineCardNo: 'לא מעוניין לקבל את הכרטיס',
    tableWith: 'מעוניין לשבת עם',
    additionalInfo: 'מידע נוסף',
    yes: 'כן',
    no: 'לא',
    quoteNumber: 'מספר הצעת מחיר',
    reference: 'מספר אסמכתא',
  },
  es: {
    greeting: 'Hola',
    draftSubject: 'Su expediente K Prestige',
    draftTitle: 'Su expediente de inscripción ha sido creado. Aquí está su número de expediente:',
    codeLabel: 'Número de expediente',
    keepCode: '¡Guarde este número con cuidado!',
    keepCodeDesc: 'Le permitirá continuar su inscripción en cualquier momento si necesita interrumpirla.',
    resumeTitle: 'Para continuar su inscripción:',
    resumeLink: 'kprestige.com/es/inscription',
    autoSave: 'Su progreso se guarda automáticamente. Puede cerrar esta página y volver más tarde.',
    footer: 'Estancia de lujo para Pésaj',
    confirmSubject: 'Confirmación de su inscripción Pésaj 2026',
    confirmTitle: '¡Su inscripción ha sido confirmada!',
    confirmText: 'Hemos recibido su inscripción para la estancia de Pésaj 2026 en el Cabogata Beach Hotel 5*.',
    confirmShuttle: 'Ha solicitado el servicio de traslado. El equipo de K PRESTIGE se pondrá en contacto con usted con información detallada una vez que se finalice el horario de traslados.',
    confirmThanks: '¡Gracias por su confianza y esperamos darle la bienvenida!',
    teamSignature: 'El equipo K PRESTIGE',
    // Resumen
    summaryTitle: 'Resumen de su inscripción',
    contactInfo: 'Información de contacto',
    phone: 'Teléfono',
    stayDates: 'Fechas de estancia',
    arrival: 'Llegada',
    departure: 'Salida',
    groupComposition: 'Composición del grupo',
    adults: 'Adultos',
    babies: 'Bebés (0-2 años)',
    children3: 'Niños 3 años',
    children4to6: 'Niños 4-6 años',
    children7to11: 'Niños 7-11 años',
    totalPersons: 'Total personas',
    shuttleService: 'Servicio de traslado',
    shuttleArrivalOnly: 'Traslado llegada únicamente',
    shuttleDepartureOnly: 'Traslado salida únicamente',
    shuttleBoth: 'Traslado llegada + salida',
    shuttleNone: 'Sin traslado',
    arrivalFlight: 'Vuelo llegada',
    departureFlight: 'Vuelo salida',
    participants: 'Participantes',
    foodPreferences: 'Preferencias alimentarias',
    wineCard: 'Carta de vinos',
    wineCardYes: 'Desea recibir la carta',
    wineCardNo: 'No desea recibir la carta',
    tableWith: 'Desea sentarse con',
    additionalInfo: 'Información adicional',
    yes: 'Sí',
    no: 'No',
    quoteNumber: 'Número de presupuesto',
    reference: 'Referencia',
  },
};

type Lang = 'fr' | 'en' | 'he' | 'es';

// Fonction d'envoi d'email pour le code dossier
async function sendDossierEmail(email: string, code: string, nomPrenom?: string, lang: Lang = 'fr') {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'K Prestige <inscription@k-prestige.com>';
  const t = EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS.fr;
  const isRTL = lang === 'he';

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; direction: ${isRTL ? 'rtl' : 'ltr'}; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; color: #C9A227; }
        .header .subtitle { margin-top: 10px; opacity: 0.9; font-size: 14px; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; text-align: ${isRTL ? 'right' : 'left'}; }
        .code-box { background: linear-gradient(135deg, #f8f6f0 0%, #fff9e6 100%); border: 2px solid #C9A227; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0; }
        .code-label { font-size: 14px; color: #666; margin-bottom: 10px; }
        .code { font-size: 36px; font-weight: bold; color: #1a1a2e; letter-spacing: 3px; font-family: 'Courier New', monospace; }
        .info-text { color: #555; font-size: 15px; margin: 20px 0; }
        .link-box { background: #f0f7ff; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
        .link-box a { color: #C9A227; font-weight: bold; text-decoration: none; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>K Prestige</h1>
          <div class="subtitle">Pessah 2026 • Cabogata Beach Hotel 5*</div>
        </div>
        <div class="content">
          <p style="font-size: 18px; color: #1a1a2e;">${t.greeting}${nomPrenom ? ` ${nomPrenom}` : ''},</p>

          <p class="info-text">${t.draftTitle}</p>

          <div class="code-box">
            <div class="code-label">${t.codeLabel}</div>
            <div class="code">${code}</div>
          </div>

          <p class="info-text">
            <strong>${t.keepCode}</strong><br>
            ${t.keepCodeDesc}
          </p>

          <div class="link-box">
            <p style="margin: 0 0 10px 0; color: #555;">${t.resumeTitle}</p>
            <a href="https://${t.resumeLink}">${t.resumeLink}</a>
          </div>

          <p class="info-text" style="font-size: 13px; color: #888;">
            ${t.autoSave}
          </p>
        </div>
        <div class="footer">
          <p>© 2026 K Prestige • ${t.footer}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: `${t.draftSubject} : ${code}`,
    html: htmlContent,
  });
}

// Interface pour les données du formulaire
interface ConfirmationFormData {
  nomPrenom?: string;
  numDevis?: string;
  dateArrivee?: string;
  dateRetour?: string;
  nbAdultes?: number;
  nbBebe?: number;
  nbEnfants3ans?: number;
  nbEnfants4a6?: number;
  nbEnfants7a11?: number;
  navetteChoix?: string;
  heureArrivee?: string;
  volArrivee?: string;
  heureDepart?: string;
  volDepart?: string;
  participants?: Array<{ nom: string; dateNaissance: string }>;
  questionnaireOuiNon?: string;
  preferenceAlimentaire?: number[];
  carteVins?: string;
  famillesTable?: string;
  infosComplementaires?: string;
}

// Labels pour les préférences alimentaires
const FOOD_LABELS: Record<string, Record<number, string>> = {
  fr: { 0: 'Marocain', 1: 'Tunisien', 2: 'Végétarien', 3: "Pas d'agneau", 4: 'Pas de cannelle', 5: 'Autre' },
  en: { 0: 'Moroccan', 1: 'Tunisian', 2: 'Vegetarian', 3: 'No lamb', 4: 'No cinnamon', 5: 'Other' },
  he: { 0: 'מרוקאי', 1: 'תוניסאי', 2: 'צמחוני', 3: 'ללא כבש', 4: 'ללא קינמון', 5: 'אחר' },
  es: { 0: 'Marroquí', 1: 'Tunecino', 2: 'Vegetariano', 3: 'Sin cordero', 4: 'Sin canela', 5: 'Otro' },
};

// Fonction d'envoi d'email de confirmation finale avec récapitulatif
async function sendConfirmationEmail(
  email: string,
  code: string,
  nomPrenom?: string,
  lang: Lang = 'fr',
  formData?: ConfirmationFormData,
  telephone?: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'K Prestige <inscription@k-prestige.com>';
  const t = EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS.fr;
  const isRTL = lang === 'he';

  // Calculer le total de personnes
  const totalPersons = (formData?.nbAdultes || 0) + (formData?.nbBebe || 0) +
    (formData?.nbEnfants3ans || 0) + (formData?.nbEnfants4a6 || 0) + (formData?.nbEnfants7a11 || 0);

  // Déterminer le type de navette
  const getShuttleLabel = (choice?: string) => {
    switch (choice) {
      case '0': return t.shuttleArrivalOnly;
      case '1': return t.shuttleDepartureOnly;
      case '2': return t.shuttleBoth;
      case '3': return t.shuttleNone;
      default: return t.shuttleNone;
    }
  };

  // Vérifier si navette demandée (pas "3" = pas de besoin)
  const hasShuttle = formData?.navetteChoix && formData.navetteChoix !== '3';

  // Formater une date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Générer les labels des préférences alimentaires
  const foodLabels = formData?.preferenceAlimentaire?.map(id => FOOD_LABELS[lang]?.[id] || FOOD_LABELS.fr[id]).join(', ') || '-';

  // Générer la liste des participants
  const participantsList = formData?.participants?.filter(p => p.nom)
    .map((p, i) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${i + 1}. ${p.nom}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(p.dateNaissance)}</td></tr>`)
    .join('') || '';

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; direction: ${isRTL ? 'rtl' : 'ltr'}; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; color: #C9A227; }
        .header .subtitle { margin-top: 10px; opacity: 0.9; font-size: 14px; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; text-align: ${isRTL ? 'right' : 'left'}; }
        .success-icon { text-align: center; margin: 20px 0; }
        .success-icon span { display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); border-radius: 50%; line-height: 80px; font-size: 40px; }
        .code-box { background: linear-gradient(135deg, #f8f6f0 0%, #fff9e6 100%); border: 2px solid #C9A227; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0; }
        .code-label { font-size: 12px; color: #666; margin-bottom: 5px; }
        .code { font-size: 24px; font-weight: bold; color: #1a1a2e; letter-spacing: 2px; font-family: 'Courier New', monospace; }
        .info-text { color: #555; font-size: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
        .signature { color: #C9A227; font-weight: bold; font-size: 16px; margin-top: 30px; }
        .summary-section { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 30px 0; }
        .summary-title { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #C9A227; }
        .summary-group { margin-bottom: 20px; }
        .summary-group-title { font-size: 14px; font-weight: 600; color: #C9A227; margin-bottom: 10px; text-transform: uppercase; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e5e5e5; }
        .summary-label { color: #666; font-size: 14px; }
        .summary-value { color: #1a1a2e; font-weight: 500; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { text-align: ${isRTL ? 'right' : 'left'}; padding: 8px; background: #e5e5e5; font-size: 13px; }
        .shuttle-info { background: #e8f4fd; border-radius: 8px; padding: 15px; margin-top: 15px; }
        .shuttle-info p { margin: 5px 0; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>K Prestige</h1>
          <div class="subtitle">Pessah 2026 • Cabogata Beach Hotel 5*</div>
        </div>
        <div class="content">
          <div class="success-icon"><span>✓</span></div>

          <h2 style="text-align: center; color: #1a1a2e; margin-bottom: 30px;">${t.confirmTitle}</h2>

          <p style="font-size: 18px; color: #1a1a2e;">${t.greeting}${nomPrenom ? ` ${nomPrenom}` : ''},</p>

          <p class="info-text">${t.confirmText}</p>

          <!-- RÉCAPITULATIF -->
          <div class="summary-section">
            <div class="summary-title">${t.summaryTitle}</div>

            <!-- Référence / Devis -->
            ${formData?.numDevis ? `
            <div class="summary-group">
              <div class="summary-group-title">${t.reference}</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 50%;">${t.quoteNumber}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; text-align: ${isRTL ? 'left' : 'right'};">${formData.numDevis}</td>
                </tr>
              </table>
            </div>` : ''}

            <!-- Coordonnées -->
            <div class="summary-group">
              <div class="summary-group-title">${t.contactInfo}</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5; width: 50%;">Email</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${email}</td>
                </tr>
                ${telephone ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.phone}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${telephone}</td>
                </tr>` : ''}
              </table>
            </div>

            <!-- Dates de séjour -->
            <div class="summary-group">
              <div class="summary-group-title">${t.stayDates}</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5; width: 50%;">${t.arrival}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formatDate(formData?.dateArrivee)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.departure}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formatDate(formData?.dateRetour)}</td>
                </tr>
              </table>
            </div>

            <!-- Composition du groupe -->
            <div class="summary-group">
              <div class="summary-group-title">${t.groupComposition}</div>
              <table style="width: 100%; border-collapse: collapse;">
                ${(formData?.nbAdultes || 0) > 0 ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5; width: 50%;">${t.adults}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formData?.nbAdultes}</td>
                </tr>` : ''}
                ${(formData?.nbBebe || 0) > 0 ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.babies}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formData?.nbBebe}</td>
                </tr>` : ''}
                ${(formData?.nbEnfants3ans || 0) > 0 ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.children3}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formData?.nbEnfants3ans}</td>
                </tr>` : ''}
                ${(formData?.nbEnfants4a6 || 0) > 0 ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.children4to6}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formData?.nbEnfants4a6}</td>
                </tr>` : ''}
                ${(formData?.nbEnfants7a11 || 0) > 0 ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.children7to11}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formData?.nbEnfants7a11}</td>
                </tr>` : ''}
                <tr style="border-top: 2px solid #C9A227;">
                  <td style="padding: 12px 0 8px 0; color: #1a1a2e; font-weight: 600;">${t.totalPersons}</td>
                  <td style="padding: 12px 0 8px 0; color: #C9A227; font-weight: 700; font-size: 16px; text-align: ${isRTL ? 'left' : 'right'};">${totalPersons}</td>
                </tr>
              </table>
            </div>

            <!-- Navettes -->
            <div class="summary-group">
              <div class="summary-group-title">${t.shuttleService}</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5; width: 50%;">${t.shuttleService}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${getShuttleLabel(formData?.navetteChoix)}</td>
                </tr>
              </table>
              ${hasShuttle && (formData?.navetteChoix === '0' || formData?.navetteChoix === '2') && formData?.volArrivee ? `
              <div class="shuttle-info">
                <p><strong>${t.arrivalFlight} :</strong> ${formData?.volArrivee} ${formData?.heureArrivee ? `(${formData?.heureArrivee})` : ''}</p>
              </div>` : ''}
              ${hasShuttle && (formData?.navetteChoix === '1' || formData?.navetteChoix === '2') && formData?.volDepart ? `
              <div class="shuttle-info">
                <p><strong>${t.departureFlight} :</strong> ${formData?.volDepart} ${formData?.heureDepart ? `(${formData?.heureDepart})` : ''}</p>
              </div>` : ''}
            </div>

            <!-- Participants -->
            ${participantsList ? `
            <div class="summary-group">
              <div class="summary-group-title">${t.participants}</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <th style="text-align: ${isRTL ? 'right' : 'left'}; padding: 8px; background: #e5e5e5; font-size: 13px;">Nom</th>
                  <th style="text-align: ${isRTL ? 'right' : 'left'}; padding: 8px; background: #e5e5e5; font-size: 13px;">Date de naissance</th>
                </tr>
                ${participantsList}
              </table>
            </div>` : ''}

            <!-- Préférences alimentaires -->
            ${formData?.questionnaireOuiNon === 'OUI' ? `
            <div class="summary-group">
              <div class="summary-group-title">${t.foodPreferences}</div>
              <table style="width: 100%; border-collapse: collapse;">
                ${formData?.preferenceAlimentaire && formData.preferenceAlimentaire.length > 0 ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5; width: 50%;">${t.foodPreferences}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${foodLabels}</td>
                </tr>` : ''}
                ${formData?.carteVins ? `<tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #e5e5e5;">${t.wineCard}</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 500; border-bottom: 1px solid #e5e5e5; text-align: ${isRTL ? 'left' : 'right'};">${formData.carteVins === 'OUI' ? t.wineCardYes : t.wineCardNo}</td>
                </tr>` : ''}
              </table>
            </div>` : ''}

            <!-- Tables et infos complémentaires -->
            ${formData?.famillesTable ? `
            <div class="summary-group">
              <div class="summary-group-title">${t.tableWith}</div>
              <p style="color: #555; font-size: 14px; margin: 0;">${formData.famillesTable}</p>
            </div>` : ''}

            ${formData?.infosComplementaires ? `
            <div class="summary-group">
              <div class="summary-group-title">${t.additionalInfo}</div>
              <p style="color: #555; font-size: 14px; margin: 0;">${formData.infosComplementaires}</p>
            </div>` : ''}
          </div>

          ${hasShuttle ? `<p class="info-text">${t.confirmShuttle}</p>` : ''}

          <p class="info-text">${t.confirmThanks}</p>

          <p class="signature">${t.teamSignature}</p>
        </div>
        <div class="footer">
          <p>© 2026 K Prestige • ${t.footer}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: t.confirmSubject,
    html: htmlContent,
  });
}
