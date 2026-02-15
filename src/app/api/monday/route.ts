import { NextRequest, NextResponse } from 'next/server';
import { MONDAY_COLUMNS, MONDAY_OPTIONS } from '@/lib/monday-config';
import { sendConfirmationEmail, type ConfirmationEmailData, type Language } from '@/app/api/inscription/draft/route';

const MONDAY_API_KEY = process.env.MONDAY_API_KEY;
const BOARD_ID = '5088974391';
const MONDAY_API_URL = 'https://api.monday.com/v2';
const MONDAY_FILE_URL = 'https://api.monday.com/v2/file';

interface FormData {
  // Contact principal
  nomPrenom: string;
  telephone: string;
  email: string;

  // Composition groupe
  nbAdultes: number;
  nbBebe: number;
  nbEnfants3ans: number;
  nbEnfants4a6: number;
  nbEnfants7a11: number;

  // Référence
  numDevis?: string;

  // Dates de séjour (différent des navettes)
  dateSejourArrivee?: string;
  dateSejourDepart?: string;

  // Navettes
  navetteChoix: string;
  dateArrivee?: string;
  heureArrivee?: string;
  volArrivee?: string;
  dateRetour?: string;
  heureDepart?: string;
  volDepart?: string;

  // Nombre de personnes et participants
  nbPersonnesTotal: string;
  participants: Array<{
    nom: string;
    dateNaissance: string;
  }>;

  // Préférences alimentaires
  questionnaireOuiNon: string;
  preferenceAlimentaire?: number[];
  autrePreciser?: string;
  salades?: number[];
  preferenceAlcool?: number[];
  carteVins?: string;

  // Informations complémentaires
  famillesTable?: string;
  infosComplementaires?: string;

  // Passeports
  passportUrls?: string[];

  // Monday item existant (si inscription reprise)
  mondayItemId?: string;
  dossierCode?: string;

  // Langue pour les emails
  language?: 'fr' | 'en' | 'he' | 'es';
}

async function mondayRequest(query: string) {
  const response = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': MONDAY_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}

// Upload a file to Monday.com file column
async function uploadFileToMonday(itemId: string, columnId: string, fileUrl: string, fileName: string) {
  try {
    // Fetch the file from Supabase URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      console.error('Failed to fetch file from URL:', fileUrl);
      return null;
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

    // Create multipart form data manually for Monday.com
    const boundary = '----MondayFormBoundary' + Math.random().toString(36).substring(2);

    const query = `mutation ($file: File!) { add_file_to_column(file: $file, item_id: ${itemId}, column_id: "${columnId}") { id } }`;

    // Build multipart body
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="query"\r\n\r\n`;
    body += `${query}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="variables[file]"; filename="${fileName}"\r\n`;
    body += `Content-Type: ${contentType}\r\n\r\n`;

    // Combine text parts with binary file data
    const textEncoder = new TextEncoder();
    const bodyStart = textEncoder.encode(body);
    const bodyEnd = textEncoder.encode(`\r\n--${boundary}--\r\n`);

    const fullBody = new Uint8Array(bodyStart.length + fileBuffer.byteLength + bodyEnd.length);
    fullBody.set(bodyStart, 0);
    fullBody.set(new Uint8Array(fileBuffer), bodyStart.length);
    fullBody.set(bodyEnd, bodyStart.length + fileBuffer.byteLength);

    const response = await fetch(MONDAY_FILE_URL, {
      method: 'POST',
      headers: {
        'Authorization': MONDAY_API_KEY || '',
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: fullBody,
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Monday file upload error:', result.errors);
      return null;
    }

    return result.data?.add_file_to_column?.id;
  } catch (error) {
    console.error('Error uploading file to Monday:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    // Construire les column_values pour Monday
    const columnValues: Record<string, unknown> = {};

    // Téléphone
    if (data.telephone) {
      const cleanPhone = data.telephone.replace(/\s/g, '');
      columnValues[MONDAY_COLUMNS.phone] = {
        phone: cleanPhone,
        countryShortName: cleanPhone.startsWith('+33') ? 'FR' : 'FR',
      };
    }

    // Email
    if (data.email) {
      columnValues[MONDAY_COLUMNS.email] = {
        email: data.email,
        text: data.email,
      };
    }

    // Statut = INSCRIT (inscription terminée)
    columnValues[MONDAY_COLUMNS.status] = { index: parseInt(MONDAY_OPTIONS.statut.INSCRIT) };

    // Code dossier dans LIAISON
    if (data.dossierCode) {
      columnValues[MONDAY_COLUMNS.liaison] = data.dossierCode;
    }

    // Composition groupe
    if (data.nbAdultes) columnValues[MONDAY_COLUMNS.nbAdultes] = String(data.nbAdultes);
    if (data.nbBebe) columnValues[MONDAY_COLUMNS.nbBebe] = String(data.nbBebe);
    if (data.nbEnfants3ans) columnValues[MONDAY_COLUMNS.nbEnfants3ans] = String(data.nbEnfants3ans);
    if (data.nbEnfants4a6) columnValues[MONDAY_COLUMNS.nbEnfants4a6] = String(data.nbEnfants4a6);
    if (data.nbEnfants7a11) columnValues[MONDAY_COLUMNS.nbEnfants7a11] = String(data.nbEnfants7a11);

    // N° Devis
    if (data.numDevis) columnValues[MONDAY_COLUMNS.numDevis] = data.numDevis;

    // Dates de séjour (différent des navettes)
    if (data.dateSejourArrivee) {
      columnValues[MONDAY_COLUMNS.dateSejourArrivee] = { date: data.dateSejourArrivee };
    }
    if (data.dateSejourDepart) {
      columnValues[MONDAY_COLUMNS.dateSejourDepart] = { date: data.dateSejourDepart };
    }

    // Nombre de personnes total (status)
    if (data.nbPersonnesTotal) {
      const nbPersonnesIndex = MONDAY_OPTIONS.nbPersonnes[data.nbPersonnesTotal as keyof typeof MONDAY_OPTIONS.nbPersonnes];
      if (nbPersonnesIndex !== undefined) {
        columnValues[MONDAY_COLUMNS.nbPersonnesTotal] = { index: parseInt(nbPersonnesIndex) };
      }
    }

    // Navettes - la valeur est directement l'index ('0', '1', '2', '3')
    if (data.navetteChoix) {
      columnValues[MONDAY_COLUMNS.navetteChoix] = { index: parseInt(data.navetteChoix) };
    }

    // Dates et infos navette arrivée (seulement si navette arrivée choisie: '0' ou '2')
    const needsArrival = data.navetteChoix === '0' || data.navetteChoix === '2';
    if (needsArrival) {
      if (data.dateArrivee) {
        columnValues[MONDAY_COLUMNS.dateArrivee] = { date: data.dateArrivee };
      }
      if (data.heureArrivee) {
        columnValues[MONDAY_COLUMNS.heureArrivee] = data.heureArrivee;
      }
      if (data.volArrivee) {
        columnValues[MONDAY_COLUMNS.volArrivee] = data.volArrivee;
      }
    }

    // Dates et infos navette retour (seulement si navette départ choisie: '1' ou '2')
    const needsDeparture = data.navetteChoix === '1' || data.navetteChoix === '2';
    if (needsDeparture) {
      if (data.dateRetour) {
        columnValues[MONDAY_COLUMNS.dateRetour] = { date: data.dateRetour };
      }
      if (data.heureDepart) {
        columnValues[MONDAY_COLUMNS.heureDepart] = data.heureDepart;
      }
      if (data.volDepart) {
        columnValues[MONDAY_COLUMNS.volDepart] = data.volDepart;
      }
    }

    // Participants (jusqu'à 7)
    if (data.participants && data.participants.length > 0) {
      const persFields = [
        { nom: MONDAY_COLUMNS.pers1Nom, date: MONDAY_COLUMNS.pers1DateNaissance },
        { nom: MONDAY_COLUMNS.pers2Nom, date: MONDAY_COLUMNS.pers2DateNaissance },
        { nom: MONDAY_COLUMNS.pers3Nom, date: MONDAY_COLUMNS.pers3DateNaissance },
        { nom: MONDAY_COLUMNS.pers4Nom, date: MONDAY_COLUMNS.pers4DateNaissance },
        { nom: MONDAY_COLUMNS.pers5Nom, date: MONDAY_COLUMNS.pers5DateNaissance },
        { nom: MONDAY_COLUMNS.pers6Nom, date: MONDAY_COLUMNS.pers6DateNaissance },
        { nom: MONDAY_COLUMNS.pers7Nom, date: MONDAY_COLUMNS.pers7DateNaissance },
      ];

      data.participants.forEach((participant, index) => {
        if (index < 7 && persFields[index]) {
          if (participant.nom) {
            columnValues[persFields[index].nom] = participant.nom;
          }
          if (participant.dateNaissance) {
            columnValues[persFields[index].date] = { date: participant.dateNaissance };
          }
        }
      });
    }

    // Questionnaire alimentaire
    if (data.questionnaireOuiNon) {
      const questionnaireIndex = MONDAY_OPTIONS.questionnaireOuiNon[data.questionnaireOuiNon as keyof typeof MONDAY_OPTIONS.questionnaireOuiNon];
      if (questionnaireIndex !== undefined) {
        columnValues[MONDAY_COLUMNS.questionnaireOuiNon] = { index: parseInt(questionnaireIndex) };
      }
    }

    // Préférences alimentaires (dropdown multi-select)
    if (data.preferenceAlimentaire && data.preferenceAlimentaire.length > 0) {
      columnValues[MONDAY_COLUMNS.preferenceAlimentaire] = { ids: data.preferenceAlimentaire };
    }

    // Autre préciser
    if (data.autrePreciser) {
      columnValues[MONDAY_COLUMNS.autrePreciser] = { text: data.autrePreciser };
    }

    // Salades (dropdown multi-select)
    if (data.salades && data.salades.length > 0) {
      columnValues[MONDAY_COLUMNS.salades] = { ids: data.salades };
    }

    // Préférences alcool (dropdown multi-select)
    if (data.preferenceAlcool && data.preferenceAlcool.length > 0) {
      columnValues[MONDAY_COLUMNS.preferenceAlcool] = { ids: data.preferenceAlcool };
    }

    // Carte des vins
    if (data.carteVins) {
      const carteVinsIndex = MONDAY_OPTIONS.carteVins[data.carteVins as keyof typeof MONDAY_OPTIONS.carteVins];
      if (carteVinsIndex !== undefined) {
        columnValues[MONDAY_COLUMNS.carteVins] = { index: parseInt(carteVinsIndex) };
      }
    }

    // Familles table
    if (data.famillesTable) {
      columnValues[MONDAY_COLUMNS.famillesTable] = { text: data.famillesTable };
    }

    // Infos complémentaires
    if (data.infosComplementaires) {
      columnValues[MONDAY_COLUMNS.infosComplementaires] = { text: data.infosComplementaires };
    }

    let itemId: string | undefined;
    let result;

    // Si un item Monday existe déjà, on le met à jour
    if (data.mondayItemId) {
      const updateQuery = `
        mutation {
          change_multiple_column_values (
            board_id: ${BOARD_ID},
            item_id: ${data.mondayItemId},
            column_values: ${JSON.stringify(JSON.stringify(columnValues))}
          ) {
            id
            name
          }
        }
      `;

      result = await mondayRequest(updateQuery);

      if (result.errors) {
        console.error('Monday API update errors:', result.errors);
        // En cas d'erreur de mise à jour, on crée un nouvel item
      } else {
        itemId = result.data?.change_multiple_column_values?.id;
      }
    }

    // Si pas d'item existant ou erreur de mise à jour, créer un nouvel item
    if (!itemId) {
      const createQuery = `
        mutation {
          create_item (
            board_id: ${BOARD_ID},
            item_name: "${data.nomPrenom.replace(/"/g, '\\"')}",
            column_values: ${JSON.stringify(JSON.stringify(columnValues))}
          ) {
            id
            name
          }
        }
      `;

      result = await mondayRequest(createQuery);

      if (result.errors) {
        console.error('Monday API errors:', result.errors);
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la création sur Monday' },
          { status: 500 }
        );
      }

      itemId = result.data?.create_item?.id;
    }

    // Upload passeports vers la colonne fichier Monday
    if (itemId && data.passportUrls && data.passportUrls.length > 0) {
      const uploadResults = [];
      for (let i = 0; i < data.passportUrls.length; i++) {
        const url = data.passportUrls[i];
        // Extraire le nom du fichier depuis l'URL
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1] || `passeport_${i + 1}.pdf`;

        const uploadResult = await uploadFileToMonday(
          itemId,
          MONDAY_COLUMNS.passeport,
          url,
          fileName
        );
        uploadResults.push({ url, success: !!uploadResult });
      }
      console.log('Passport upload results:', uploadResults);
    }

    // Envoyer l'email de confirmation au client
    if (data.email && process.env.RESEND_API_KEY) {
      try {
        const nbEnfantsTotal = (data.nbEnfants3ans || 0) + (data.nbEnfants4a6 || 0) + (data.nbEnfants7a11 || 0);

        const confirmationData: ConfirmationEmailData = {
          nomPrenom: data.nomPrenom,
          email: data.email,
          telephone: data.telephone,
          dossierCode: data.dossierCode || '',
          nbAdultes: data.nbAdultes,
          nbEnfants: nbEnfantsTotal,
          nbBebes: data.nbBebe,
          navetteArrivee: data.dateArrivee ? {
            date: data.dateArrivee,
            heure: data.heureArrivee,
            vol: data.volArrivee,
          } : undefined,
          navetteRetour: data.dateRetour ? {
            date: data.dateRetour,
            heure: data.heureDepart,
            vol: data.volDepart,
          } : undefined,
        };

        await sendConfirmationEmail(confirmationData, (data.language || 'fr') as Language);
        console.log('Email de confirmation envoyé à:', data.email);
      } catch (emailError) {
        console.error('Erreur envoi email de confirmation:', emailError);
        // On continue même si l'email échoue - l'inscription est enregistrée
      }
    }

    return NextResponse.json({
      success: true,
      itemId: itemId,
      itemName: result.data?.create_item?.name,
    });
  } catch (error) {
    console.error('Error creating Monday item:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
