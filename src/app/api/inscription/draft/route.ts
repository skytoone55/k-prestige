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
  dateArrivee?: string;
  heureArrivee?: string;
  volArrivee?: string;
  dateRetour?: string;
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

    // Navettes
    if (formData.navetteChoix !== undefined) {
      columnValues[MONDAY_COLUMNS.navetteChoix] = { index: parseInt(formData.navetteChoix) };
    }

    // Dates et infos navette arrivée
    if (formData.dateArrivee) {
      columnValues[MONDAY_COLUMNS.dateArrivee] = { date: formData.dateArrivee };
    }
    if (formData.heureArrivee) {
      columnValues[MONDAY_COLUMNS.heureArrivee] = formData.heureArrivee;
    }
    if (formData.volArrivee) {
      columnValues[MONDAY_COLUMNS.volArrivee] = formData.volArrivee;
    }

    // Dates et infos navette retour
    if (formData.dateRetour) {
      columnValues[MONDAY_COLUMNS.dateRetour] = { date: formData.dateRetour };
    }
    if (formData.heureDepart) {
      columnValues[MONDAY_COLUMNS.heureDepart] = formData.heureDepart;
    }
    if (formData.volDepart) {
      columnValues[MONDAY_COLUMNS.volDepart] = formData.volDepart;
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
    const { action, code, formData, currentStep, email, telephone, nomPrenom, language } = body;
    const lang = language || 'fr'; // Langue par défaut: français

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
          language: lang,
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
          await sendDossierEmail(email, dossierCode, nomPrenom, lang);
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

      return NextResponse.json({ success: true, message: 'Inscription soumise' });
    }

    // Action: renvoyer l'email avec le code
    if (action === 'resend_email' && code && email) {
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: 'Service email non configuré' }, { status: 500 });
      }

      try {
        await sendDossierEmail(email, code, nomPrenom, lang);
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
const emailTranslations = {
  dossier: {
    subject: {
      fr: 'Votre dossier K Prestige',
      en: 'Your K Prestige file',
      he: 'תיק K Prestige שלך',
      es: 'Su expediente K Prestige',
    },
    greeting: {
      fr: 'Bonjour',
      en: 'Hello',
      he: 'שלום',
      es: 'Hola',
    },
    intro: {
      fr: 'Votre dossier d\'inscription a été créé. Voici votre numéro de dossier :',
      en: 'Your registration file has been created. Here is your file number:',
      he: 'תיק ההרשמה שלך נוצר. הנה מספר התיק שלך:',
      es: 'Su expediente de inscripción ha sido creado. Aquí está su número de expediente:',
    },
    codeLabel: {
      fr: 'Numéro de dossier',
      en: 'File number',
      he: 'מספר תיק',
      es: 'Número de expediente',
    },
    keepCode: {
      fr: 'Conservez précieusement ce numéro !',
      en: 'Keep this number safe!',
      he: 'שמור על מספר זה!',
      es: '¡Guarde este número con cuidado!',
    },
    keepCodeDesc: {
      fr: 'Il vous permettra de reprendre votre inscription à tout moment si vous devez l\'interrompre.',
      en: 'It will allow you to resume your registration at any time if you need to interrupt it.',
      he: 'הוא יאפשר לך לחדש את ההרשמה שלך בכל עת אם תצטרך להפסיק אותה.',
      es: 'Le permitirá reanudar su inscripción en cualquier momento si necesita interrumpirla.',
    },
    resumeLabel: {
      fr: 'Pour reprendre votre inscription :',
      en: 'To resume your registration:',
      he: 'לחידוש ההרשמה שלך:',
      es: 'Para reanudar su inscripción:',
    },
    autoSave: {
      fr: 'Votre progression est sauvegardée automatiquement. Vous pouvez fermer cette page et revenir plus tard.',
      en: 'Your progress is saved automatically. You can close this page and come back later.',
      he: 'ההתקדמות שלך נשמרת אוטומטית. אתה יכול לסגור את הדף הזה ולחזור מאוחר יותר.',
      es: 'Su progreso se guarda automáticamente. Puede cerrar esta página y volver más tarde.',
    },
    footer: {
      fr: 'Séjour de luxe pour Pessah',
      en: 'Luxury stay for Passover',
      he: 'חופשת יוקרה לפסח',
      es: 'Estancia de lujo para Pésaj',
    },
  },
  confirmation: {
    subject: {
      fr: 'Confirmation de votre inscription - K Prestige Pessah 2026',
      en: 'Registration confirmation - K Prestige Passover 2026',
      he: 'אישור הרשמה - K Prestige פסח 2026',
      es: 'Confirmación de inscripción - K Prestige Pésaj 2026',
    },
    greeting: {
      fr: 'Bonjour',
      en: 'Hello',
      he: 'שלום',
      es: 'Hola',
    },
    thankYou: {
      fr: 'Merci pour votre inscription !',
      en: 'Thank you for your registration!',
      he: 'תודה על ההרשמה שלך!',
      es: '¡Gracias por su inscripción!',
    },
    confirmed: {
      fr: 'Votre inscription pour le séjour Pessah 2026 au Cabogata Beach Hotel 5* a bien été enregistrée.',
      en: 'Your registration for the Passover 2026 stay at Cabogata Beach Hotel 5* has been recorded.',
      he: 'ההרשמה שלך לחופשת פסח 2026 במלון Cabogata Beach 5* נרשמה.',
      es: 'Su inscripción para la estancia de Pésaj 2026 en el Cabogata Beach Hotel 5* ha sido registrada.',
    },
    summaryTitle: {
      fr: 'Récapitulatif de votre dossier',
      en: 'Your file summary',
      he: 'סיכום התיק שלך',
      es: 'Resumen de su expediente',
    },
    fileNumber: {
      fr: 'N° de dossier',
      en: 'File number',
      he: 'מספר תיק',
      es: 'Número de expediente',
    },
    contact: {
      fr: 'Contact',
      en: 'Contact',
      he: 'איש קשר',
      es: 'Contacto',
    },
    composition: {
      fr: 'Composition',
      en: 'Group composition',
      he: 'הרכב הקבוצה',
      es: 'Composición',
    },
    adults: {
      fr: 'adulte(s)',
      en: 'adult(s)',
      he: 'מבוגר(ים)',
      es: 'adulto(s)',
    },
    children: {
      fr: 'enfant(s)',
      en: 'child(ren)',
      he: 'ילד(ים)',
      es: 'niño(s)',
    },
    babies: {
      fr: 'bébé(s)',
      en: 'baby(ies)',
      he: 'תינוק(ות)',
      es: 'bebé(s)',
    },
    shuttles: {
      fr: 'Navettes',
      en: 'Shuttles',
      he: 'הסעות',
      es: 'Traslados',
    },
    arrival: {
      fr: 'Arrivée',
      en: 'Arrival',
      he: 'הגעה',
      es: 'Llegada',
    },
    departure: {
      fr: 'Départ',
      en: 'Departure',
      he: 'יציאה',
      es: 'Salida',
    },
    nextSteps: {
      fr: 'Prochaines étapes',
      en: 'Next steps',
      he: 'צעדים הבאים',
      es: 'Próximos pasos',
    },
    nextStepsDesc: {
      fr: 'Notre équipe va étudier votre dossier et vous recontactera très prochainement pour finaliser votre réservation.',
      en: 'Our team will review your file and contact you very soon to finalize your reservation.',
      he: 'הצוות שלנו יבדוק את התיק שלך וייצור איתך קשר בקרוב מאוד כדי לסיים את ההזמנה.',
      es: 'Nuestro equipo revisará su expediente y le contactará muy pronto para finalizar su reserva.',
    },
    questions: {
      fr: 'Des questions ?',
      en: 'Questions?',
      he: 'שאלות?',
      es: '¿Preguntas?',
    },
    contactUs: {
      fr: 'N\'hésitez pas à nous contacter',
      en: 'Feel free to contact us',
      he: 'אל תהסס לפנות אלינו',
      es: 'No dude en contactarnos',
    },
    footer: {
      fr: 'Séjour de luxe pour Pessah',
      en: 'Luxury stay for Passover',
      he: 'חופשת יוקרה לפסח',
      es: 'Estancia de lujo para Pésaj',
    },
  },
};

type Language = 'fr' | 'en' | 'he' | 'es';

// Fonction d'envoi d'email avec code de dossier
async function sendDossierEmail(email: string, code: string, nomPrenom?: string, language: Language = 'fr') {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'K Prestige <inscription@k-prestige.com>';
  const t = emailTranslations.dossier;
  const lang = language as Language;
  const isRTL = lang === 'he';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; direction: ${dir}; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; color: #C9A227; }
        .header .subtitle { margin-top: 10px; opacity: 0.9; font-size: 14px; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; text-align: ${textAlign}; }
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
          <p style="font-size: 18px; color: #1a1a2e;">${t.greeting[lang]}${nomPrenom ? ` ${nomPrenom}` : ''},</p>

          <p class="info-text">${t.intro[lang]}</p>

          <div class="code-box">
            <div class="code-label">${t.codeLabel[lang]}</div>
            <div class="code">${code}</div>
          </div>

          <p class="info-text">
            <strong>${t.keepCode[lang]}</strong><br>
            ${t.keepCodeDesc[lang]}
          </p>

          <div class="link-box">
            <p style="margin: 0 0 10px 0; color: #555;">${t.resumeLabel[lang]}</p>
            <a href="https://kprestige.com/inscription">kprestige.com/inscription</a>
          </div>

          <p class="info-text" style="font-size: 13px; color: #888;">
            ${t.autoSave[lang]}
          </p>
        </div>
        <div class="footer">
          <p>© 2026 K Prestige • ${t.footer[lang]}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: `${t.subject[lang]} : ${code}`,
    html: htmlContent,
  });
}

// Interface pour les données du formulaire d'email de confirmation
interface ConfirmationEmailData {
  nomPrenom: string;
  email: string;
  telephone?: string;
  dossierCode: string;
  nbAdultes?: number;
  nbEnfants?: number;
  nbBebes?: number;
  navetteArrivee?: { date?: string; heure?: string; vol?: string };
  navetteRetour?: { date?: string; heure?: string; vol?: string };
}

// Fonction d'envoi d'email de confirmation finale
async function sendConfirmationEmail(data: ConfirmationEmailData, language: Language = 'fr') {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'K Prestige <inscription@k-prestige.com>';
  const t = emailTranslations.confirmation;
  const lang = language as Language;
  const isRTL = lang === 'he';
  const dir = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';

  // Construire le récapitulatif de composition
  const compositionParts = [];
  if (data.nbAdultes && data.nbAdultes > 0) {
    compositionParts.push(`${data.nbAdultes} ${t.adults[lang]}`);
  }
  if (data.nbEnfants && data.nbEnfants > 0) {
    compositionParts.push(`${data.nbEnfants} ${t.children[lang]}`);
  }
  if (data.nbBebes && data.nbBebes > 0) {
    compositionParts.push(`${data.nbBebes} ${t.babies[lang]}`);
  }
  const compositionText = compositionParts.join(', ') || '-';

  // Navettes
  let shuttleHtml = '';
  if (data.navetteArrivee?.date || data.navetteRetour?.date) {
    shuttleHtml = `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${t.shuttles[lang]}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e;">
          ${data.navetteArrivee?.date ? `<strong>${t.arrival[lang]}:</strong> ${data.navetteArrivee.date}${data.navetteArrivee.heure ? ` ${data.navetteArrivee.heure}` : ''}${data.navetteArrivee.vol ? ` (${data.navetteArrivee.vol})` : ''}<br>` : ''}
          ${data.navetteRetour?.date ? `<strong>${t.departure[lang]}:</strong> ${data.navetteRetour.date}${data.navetteRetour.heure ? ` ${data.navetteRetour.heure}` : ''}${data.navetteRetour.vol ? ` (${data.navetteRetour.vol})` : ''}` : ''}
        </td>
      </tr>
    `;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; direction: ${dir}; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; color: #C9A227; }
        .header .subtitle { margin-top: 10px; opacity: 0.9; font-size: 14px; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; text-align: ${textAlign}; }
        .success-badge { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 25px; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px; margin-bottom: 20px; }
        .summary-box { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .summary-title { font-size: 18px; font-weight: bold; color: #1a1a2e; margin-bottom: 15px; }
        .summary-table { width: 100%; }
        .summary-table td { padding: 12px 0; border-bottom: 1px solid #eee; }
        .next-steps { background: linear-gradient(135deg, #f8f6f0 0%, #fff9e6 100%); border: 2px solid #C9A227; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .next-steps-title { font-size: 16px; font-weight: bold; color: #C9A227; margin-bottom: 10px; }
        .contact-box { background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
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
          <div style="text-align: center;">
            <span class="success-badge">✓ ${t.thankYou[lang]}</span>
          </div>

          <p style="font-size: 18px; color: #1a1a2e;">${t.greeting[lang]} ${data.nomPrenom},</p>

          <p style="color: #555;">${t.confirmed[lang]}</p>

          <div class="summary-box">
            <div class="summary-title">${t.summaryTitle[lang]}</div>
            <table class="summary-table">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${t.fileNumber[lang]}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e; font-weight: bold; font-family: monospace; font-size: 18px;">${data.dossierCode}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${t.contact[lang]}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e;">${data.nomPrenom}<br><span style="color: #666; font-size: 14px;">${data.email}${data.telephone ? `<br>${data.telephone}` : ''}</span></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${t.composition[lang]}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e;">${compositionText}</td>
              </tr>
              ${shuttleHtml}
            </table>
          </div>

          <div class="next-steps">
            <div class="next-steps-title">${t.nextSteps[lang]}</div>
            <p style="margin: 0; color: #555;">${t.nextStepsDesc[lang]}</p>
          </div>

          <div class="contact-box">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #1a1a2e;">${t.questions[lang]}</p>
            <p style="margin: 0; color: #555;">${t.contactUs[lang]}</p>
            <p style="margin: 10px 0 0 0;">
              <a href="mailto:contact@kprestige.com" style="color: #C9A227; text-decoration: none;">contact@kprestige.com</a>
            </p>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 K Prestige • ${t.footer[lang]}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [data.email],
    subject: t.subject[lang],
    html: htmlContent,
  });
}

// Export pour utilisation dans d'autres routes
export { sendConfirmationEmail, type ConfirmationEmailData, type Language };
