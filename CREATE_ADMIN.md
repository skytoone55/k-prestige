# 🔐 Création du Compte Admin

## Identifiants
- **Email:** `malai.jonathan@gmail.com`
- **Password:** `@Kprestige1532`

## Méthode 1 : Dashboard Supabase (Plus Simple)

1. Ouvrir [https://supabase.com/dashboard/project/htemxbrbxazzatmjerij/auth/users](https://supabase.com/dashboard/project/htemxbrbxazzatmjerij/auth/users)

2. Cliquer sur **"Add user"** → **"Create new user"**

3. Remplir le formulaire :
   ```
   Email: malai.jonathan@gmail.com
   Password: @Kprestige1532
   ✅ Auto Confirm User (cocher)
   ```

4. Cliquer sur **"Create user"**

5. Tester la connexion sur `/login`

## Méthode 2 : Via l'API (si vous avez la Service Role Key)

1. Récupérer la **Service Role Key** :
   - Dashboard Supabase → Settings → API → `service_role` (secret)

2. Exécuter :
```bash
curl -X POST 'https://htemxbrbxazzatmjerij.supabase.co/auth/v1/admin/users' \
  -H "apikey: VOTRE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer VOTRE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "malai.jonathan@gmail.com",
    "password": "@Kprestige1532",
    "email_confirm": true
  }'
```

## Vérification

Une fois créé, vous pouvez vous connecter sur :
- URL: `http://localhost:3000/login` (en dev)
- Email: `malai.jonathan@gmail.com`
- Password: `@Kprestige1532`

Vous serez redirigé vers `/admin` après connexion.

