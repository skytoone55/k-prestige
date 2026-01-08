# Configuration Admin K PRESTIGE

## Création du compte admin

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. Aller sur [https://supabase.com/dashboard/project/htemxbrbxazzatmjerij](https://supabase.com/dashboard/project/htemxbrbxazzatmjerij)
2. Aller dans **Authentication** → **Users**
3. Cliquer sur **Add user** → **Create new user**
4. Remplir :
   - **Email:** `malai.jonathan@gmail.com`
   - **Password:** `@Kprestige1532`
   - Cocher **Auto Confirm User**
5. Cliquer sur **Create user**

### Option 2 : Via le script Node.js

1. Récupérer la **Service Role Key** depuis le dashboard Supabase :
   - Settings → API → `service_role` key (secret)

2. Ajouter dans `.env.local` :
```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

3. Exécuter le script :
```bash
node scripts/create-admin-user.js
```

### Option 3 : Via l'API (curl)

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

## Connexion

Une fois le compte créé, vous pouvez vous connecter sur `/login` avec :
- **Email:** `malai.jonathan@gmail.com`
- **Password:** `@Kprestige1532`

