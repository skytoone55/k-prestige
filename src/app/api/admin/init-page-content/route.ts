import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY non configurée' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Créer la table page_content si elle n'existe pas
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS page_content (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          page_id TEXT UNIQUE NOT NULL,
          content JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Index pour recherche rapide par page_id
        CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON page_content(page_id);

        -- Trigger pour mettre à jour updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
        CREATE TRIGGER update_page_content_updated_at
          BEFORE UPDATE ON page_content
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

        -- RLS policies
        ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

        -- Politique de lecture publique
        DROP POLICY IF EXISTS "Allow public read" ON page_content;
        CREATE POLICY "Allow public read" ON page_content
          FOR SELECT USING (true);

        -- Politique d'écriture pour les utilisateurs authentifiés
        DROP POLICY IF EXISTS "Allow authenticated write" ON page_content;
        CREATE POLICY "Allow authenticated write" ON page_content
          FOR ALL USING (auth.role() = 'authenticated');
      `
    });

    // Si exec_sql n'existe pas, essayer avec une approche directe
    if (createError) {
      // Créer la table directement
      const { error: directError } = await supabase
        .from('page_content')
        .select('id')
        .limit(1);

      if (directError && directError.code === '42P01') {
        // Table n'existe pas - on ne peut pas la créer sans exec_sql
        return NextResponse.json({
          error: 'La table page_content doit être créée manuellement dans Supabase Dashboard',
          sql: `
CREATE TABLE page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON page_content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON page_content FOR ALL USING (auth.role() = 'authenticated');
          `
        }, { status: 400 });
      }

      // Table existe déjà
      return NextResponse.json({
        success: true,
        message: 'Table page_content existe déjà'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Table page_content créée avec succès'
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la table' },
      { status: 500 }
    );
  }
}
