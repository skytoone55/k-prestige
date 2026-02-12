// Test d'envoi d'email avec Resend
// Usage: npx ts-node scripts/test-email.ts

import { Resend } from 'resend';

const RESEND_API_KEY = 're_in94G72i_NWk177AuJqmWyC7ESytzXvk9';
const FROM_EMAIL = 'K Prestige <onboarding@resend.dev>';
// Note: Sans domaine vérifié, on ne peut envoyer qu'à l'email du compte Resend
const TO_EMAIL = 'malai.jonathan@gmail.com';

// Génération d'un code de dossier (format: KP + 2 chiffres année + 3 chiffres aléatoires)
function generateDossierCode(): string {
  const year = new Date().getFullYear().toString().slice(-2); // "26" pour 2026
  const random = Math.floor(Math.random() * 900 + 100); // 100-999
  return `KP${year}${random}`;
}

async function testEmail() {
  const resend = new Resend(RESEND_API_KEY);
  const dossierCode = generateDossierCode();

  console.log('📧 Test d\'envoi d\'email K Prestige');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Code dossier généré: ${dossierCode}`);
  console.log(`Destinataire: ${TO_EMAIL}`);
  console.log('');

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
        .footer a { color: #C9A227; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>K Prestige</h1>
          <div class="subtitle">Pessah 2026 • Cabogata Beach Hotel 5*</div>
        </div>
        <div class="content">
          <p style="font-size: 18px; color: #1a1a2e;">Bonjour,</p>

          <p class="info-text">Votre dossier d'inscription a été créé. Voici votre numéro de dossier :</p>

          <div class="code-box">
            <div class="code-label">Numéro de dossier</div>
            <div class="code">${dossierCode}</div>
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
          <p><a href="https://kprestige.com">kprestige.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Votre dossier K Prestige : ${dossierCode}`,
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log('✅ Email envoyé avec succès !');
    console.log(`   ID: ${data?.id}`);
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

testEmail();
