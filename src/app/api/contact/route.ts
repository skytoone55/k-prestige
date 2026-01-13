import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email destination - configurable via environment variable
const TO_EMAIL = process.env.CONTACT_EMAIL || 'contact@kprestige.com';
// Email expéditeur - utilisez onboarding@resend.dev pour tester, puis votre domaine vérifié
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'K Prestige <onboarding@resend.dev>';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let subject = '';
    let htmlContent = '';

    if (type === 'contact') {
      // Formulaire de contact simple
      subject = `Nouveau message de contact - ${data.prenom} ${data.nom}`;
      htmlContent = generateContactEmail(data);
    } else if (type === 'devis') {
      // Demande de devis Pessah
      subject = `Nouvelle demande de devis Pessah - ${data.prenom} ${data.nom}`;
      htmlContent = generateDevisEmail(data);
    } else {
      return NextResponse.json(
        { error: 'Type de formulaire invalide' },
        { status: 400 }
      );
    }

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      html: htmlContent,
      replyTo: data.email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: emailData?.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

function generateContactEmail(data: {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  message?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #C9A227 0%, #D4AF37 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #C9A227; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; border-left: 3px solid #C9A227; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 3px solid #C9A227; white-space: pre-wrap; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouveau Message de Contact</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nom complet</div>
            <div class="value">${data.prenom} ${data.nom}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Telephone</div>
            <div class="value"><a href="tel:${data.telephone}">${data.telephone}</a></div>
          </div>
          ${data.message ? `
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${data.message}</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Email envoye depuis le site K Prestige</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateDevisEmail(data: {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nb_adultes: number;
  nb_bebes: number;
  nb_enfants_2_3ans: number;
  nb_enfants_4_6ans: number;
  nb_enfants_7_11ans: number;
  whatsapp?: boolean;
  message?: string;
}) {
  const totalPersonnes =
    data.nb_adultes +
    data.nb_bebes +
    data.nb_enfants_2_3ans +
    data.nb_enfants_4_6ans +
    data.nb_enfants_7_11ans;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #C9A227 0%, #D4AF37 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header .subtitle { margin-top: 10px; opacity: 0.9; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; color: #C9A227; border-bottom: 2px solid #C9A227; padding-bottom: 5px; margin-bottom: 15px; }
        .field { margin-bottom: 10px; display: flex; }
        .label { font-weight: bold; width: 150px; color: #555; }
        .value { flex: 1; }
        .guests-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .guests-table th, .guests-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .guests-table th { background: #C9A227; color: white; }
        .guests-table tr:nth-child(even) { background: #f5f5f5; }
        .total-row { font-weight: bold; background: #fff3cd !important; }
        .whatsapp-badge { display: inline-block; background: #25D366; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Demande de Devis Pessah 2026</h1>
          <div class="subtitle">Sejour au Cabogata Beach Hotel 5*</div>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Informations Client</div>
            <div class="field">
              <span class="label">Nom complet:</span>
              <span class="value">${data.prenom} ${data.nom}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>
            <div class="field">
              <span class="label">Telephone:</span>
              <span class="value"><a href="tel:${data.telephone}">${data.telephone}</a></span>
            </div>
            ${data.whatsapp ? `
            <div class="field">
              <span class="label">WhatsApp:</span>
              <span class="value"><span class="whatsapp-badge">Prefere WhatsApp</span></span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">Composition du Groupe</div>
            <table class="guests-table">
              <tr>
                <th>Categorie</th>
                <th>Nombre</th>
              </tr>
              <tr>
                <td>Adultes (12 ans et +)</td>
                <td>${data.nb_adultes}</td>
              </tr>
              <tr>
                <td>Bebes (0-2 ans)</td>
                <td>${data.nb_bebes}</td>
              </tr>
              <tr>
                <td>Enfants 2-3 ans</td>
                <td>${data.nb_enfants_2_3ans}</td>
              </tr>
              <tr>
                <td>Enfants 4-6 ans</td>
                <td>${data.nb_enfants_4_6ans}</td>
              </tr>
              <tr>
                <td>Enfants 7-11 ans</td>
                <td>${data.nb_enfants_7_11ans}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL PERSONNES</td>
                <td>${totalPersonnes}</td>
              </tr>
            </table>
          </div>

          ${data.message ? `
          <div class="section">
            <div class="section-title">Message</div>
            <p style="background: white; padding: 15px; border-radius: 5px; border-left: 3px solid #C9A227;">${data.message}</p>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Email envoye depuis le site K Prestige</p>
          <p>Date de la demande: ${new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
