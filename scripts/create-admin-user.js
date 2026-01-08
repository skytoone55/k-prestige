/**
 * Script pour créer le compte admin dans Supabase
 * 
 * Usage:
 * 1. Récupérer la clé service_role depuis le dashboard Supabase
 * 2. L'ajouter dans .env.local comme SUPABASE_SERVICE_ROLE_KEY
 * 3. Exécuter: node scripts/create-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY (depuis dashboard Supabase)');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  const email = 'malai.jonathan@gmail.com';
  const password = '@Kprestige1532';

  console.log('🔐 Création du compte admin...');
  console.log(`   Email: ${email}`);

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ L\'utilisateur existe déjà dans Supabase Auth');
        console.log('   Vous pouvez vous connecter directement avec ces identifiants');
      } else {
        console.error('❌ Erreur:', error.message);
      }
    } else {
      console.log('✅ Compte admin créé avec succès!');
      console.log(`   ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
    }
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

createAdminUser();

