// Exécuter la migration pour créer la table inscription_drafts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htemxbrbxazzatmjerij.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW14YnJieGF6emF0bWplcmlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgwMjQyNCwiZXhwIjoyMDgzMzc4NDI0fQ.Kyx2FdgJhAi5x-I2k8h5g5HBsJKJQLlWVJHwSM6yyes';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Création de la table inscription_drafts...\n');

  // Créer la table
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS inscription_drafts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        form_data JSONB NOT NULL DEFAULT '{}',
        current_step INTEGER DEFAULT 1,
        email VARCHAR(255),
        telephone VARCHAR(50),
        nom_prenom VARCHAR(255),
        is_submitted BOOLEAN DEFAULT FALSE,
        monday_item_id VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        submitted_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
      );
    `
  });

  if (tableError) {
    // Si rpc n'existe pas, on utilise une autre méthode
    console.log('RPC non disponible, création via insert test...');

    // Test direct avec la table
    const { data, error } = await supabase
      .from('inscription_drafts')
      .select('code')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('❌ La table n\'existe pas. Veuillez la créer manuellement dans Supabase Dashboard.');
      console.log('\nSQL à exécuter dans le SQL Editor de Supabase:');
      console.log('https://supabase.com/dashboard/project/htemxbrbxazzatmjerij/sql/new\n');
      return;
    } else if (error) {
      console.log('Erreur:', error.message);
    } else {
      console.log('✅ La table inscription_drafts existe déjà!');
    }
    return;
  }

  console.log('✅ Table créée avec succès!');
}

runMigration();
