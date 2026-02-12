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

    const response = await fetch(MONDAY_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_CONFIG.API_KEY,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    return result.data?.create_item?.id || null;
  } catch (error) {
    console.error('Erreur création Monday:', error);
    return null;
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
    const { action, code, formData, currentStep, email, telephone, nomPrenom } = body;

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
      let mondayItemId: string | null = null;
      if (nomPrenom && email) {
        mondayItemId = await createMondayDraft(nomPrenom, email, telephone || '', dossierCode);
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
          await sendDossierEmail(email, dossierCode, nomPrenom);
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

      return NextResponse.json({ success: true, message: 'Sauvegardé' });
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

    return NextResponse.json({
      success: true,
      code: data.code,
      formData: data.form_data,
      currentStep: data.current_step,
      email: data.email,
      telephone: data.telephone,
      nomPrenom: data.nom_prenom,
      mondayItemId: data.monday_item_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Fonction d'envoi d'email
async function sendDossierEmail(email: string, code: string, nomPrenom?: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'K Prestige <inscription@k-prestige.com>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; color: #C9A227; }
        .header .subtitle { margin-top: 10px; opacity: 0.9; font-size: 14px; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; }
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
          <p style="font-size: 18px; color: #1a1a2e;">Bonjour${nomPrenom ? ` ${nomPrenom}` : ''},</p>

          <p class="info-text">Votre dossier d'inscription a été créé. Voici votre numéro de dossier :</p>

          <div class="code-box">
            <div class="code-label">Numéro de dossier</div>
            <div class="code">${code}</div>
          </div>

          <p class="info-text">
            <strong>Conservez précieusement ce numéro !</strong><br>
            Il vous permettra de reprendre votre inscription à tout moment si vous devez l'interrompre.
          </p>

          <div class="link-box">
            <p style="margin: 0 0 10px 0; color: #555;">Pour reprendre votre inscription :</p>
            <a href="https://kprestige.com/inscription">kprestige.com/inscription</a>
          </div>

          <p class="info-text" style="font-size: 13px; color: #888;">
            Votre progression est sauvegardée automatiquement. Vous pouvez fermer cette page et revenir plus tard.
          </p>
        </div>
        <div class="footer">
          <p>© 2026 K Prestige • Séjour de luxe pour Pessah</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: `Votre dossier K Prestige : ${code}`,
    html: htmlContent,
  });
}
