import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Cette route nécessite la clé service_role de Supabase
// À utiliser UNE SEULE FOIS pour créer le compte admin initial
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Utiliser la clé service_role depuis les variables d'environnement
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: data.user.id, email: data.user.email } 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

