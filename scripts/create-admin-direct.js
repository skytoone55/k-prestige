const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htemxbrbxazzatmjerij.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Pour créer un utilisateur, on a besoin de la service_role key
// Mais on peut essayer de le créer via l'API publique avec signUp
const supabase = createClient(supabaseUrl, anonKey);

async function createAdmin() {
  const email = 'malai.jonathan@gmail.com';
  const password = '@Kprestige1532';

  console.log('🔐 Tentative de création du compte admin...');
  console.log(`   Email: ${email}`);

  try {
    // Méthode 1: Essayer signUp (nécessite confirmation email désactivée)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${supabaseUrl}/admin`
      }
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        console.log('✅ L\'utilisateur existe déjà !');
        console.log('   Vous pouvez vous connecter directement.');
      } else {
        console.error('❌ Erreur:', error.message);
        console.log('\n💡 Solution: Créez le compte via le dashboard Supabase:');
        console.log('   https://supabase.com/dashboard/project/htemxbrbxazzatmjerij/auth/users');
      }
    } else {
      console.log('✅ Compte créé avec succès!');
      console.log(`   ID: ${data.user?.id}`);
      console.log(`   Email: ${data.user?.email}`);
      if (data.user && !data.session) {
        console.log('⚠️  Vérifiez votre email pour confirmer le compte');
      }
    }
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

createAdmin();
