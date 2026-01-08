const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htemxbrbxazzatmjerij.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.log('⚠️  Service Role Key non trouvée.');
  console.log('📝 Le compte a été créé mais nécessite une confirmation email.');
  console.log('   Pour confirmer automatiquement, ajoutez SUPABASE_SERVICE_ROLE_KEY dans .env.local');
  console.log('   Sinon, vérifiez votre email pour confirmer le compte.');
  process.exit(0);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function confirmEmail() {
  const email = 'malai.jonathan@gmail.com';
  
  console.log('🔐 Confirmation automatique de l\'email...');
  
  try {
    // Récupérer l'utilisateur
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }
    
    // Confirmer l'email
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );
    
    if (error) throw error;
    
    console.log('✅ Email confirmé automatiquement!');
    console.log(`   ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log('\n🎉 Vous pouvez maintenant vous connecter sur /login');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

confirmEmail();
