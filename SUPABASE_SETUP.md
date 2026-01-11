# Configuration Supabase Storage

## 🎯 Objectif

Configurer Supabase Storage pour stocker les images du site au lieu d'utiliser localStorage (qui a des limites de taille).

## ✅ Solution temporaire (déjà active)

Le système fonctionne **déjà** avec un fallback automatique :
- Si le bucket Supabase n'existe pas → les images sont stockées en base64 dans localStorage
- Si le bucket existe → les images sont uploadées vers Supabase Storage

## 🚀 Configuration Supabase Storage (recommandé)

### Étape 1 : Créer le bucket "galerie"

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet K Prestige
3. Dans le menu de gauche, cliquez sur **Storage**
4. Cliquez sur **New bucket**
5. Configurez :
   - **Name** : `galerie`
   - **Public bucket** : ✅ **OUI** (pour accès public aux images)
   - **File size limit** : `10485760` (10 MB)
   - **Allowed MIME types** : `image/jpeg,image/jpg,image/png,image/webp,image/gif`
6. Cliquez sur **Create bucket**

### Étape 2 : Créer le bucket "pages"

Répétez l'étape 1 avec :
- **Name** : `pages`
- **Public bucket** : ✅ **OUI**
- **File size limit** : `10485760` (10 MB)
- **Allowed MIME types** : `image/jpeg,image/jpg,image/png,image/webp,image/gif`

### Étape 3 : Configurer les politiques RLS (Row Level Security)

**Option A : Migration SQL automatique (recommandé)**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet K Prestige
3. Dans le menu de gauche, cliquez sur **SQL Editor**
4. Copiez-collez le contenu du fichier `supabase/migrations/002_fix_storage_rls.sql`
5. Cliquez sur **Run** pour exécuter la migration
6. Vérifiez que toutes les politiques sont créées sans erreur

**Option B : Bouton automatique dans l'admin**

1. Allez dans l'espace admin (`/admin`)
2. Cliquez sur "Galerie" dans le menu de gauche
3. Cliquez sur le bouton **"⚙️ Config Supabase"** en haut à droite
4. Le système créera les buckets automatiquement
5. **Important** : Exécutez ensuite la migration SQL `002_fix_storage_rls.sql` pour configurer les politiques RLS

**Option C : Configuration manuelle dans le dashboard**

Pour chaque bucket (`galerie` et `pages`) :

1. Allez dans **Storage** → Sélectionnez le bucket
2. Cliquez sur **Policies**
3. Créez les politiques suivantes :

#### Politique 1 : Lecture publique
- **Policy name** : `Public read access [nom_bucket]`
- **Allowed operation** : `SELECT`
- **Policy definition** :
```sql
bucket_id = 'galerie'
```

#### Politique 2 : Upload pour utilisateurs authentifiés
- **Policy name** : `Authenticated upload [nom_bucket]`
- **Allowed operation** : `INSERT`
- **Policy definition** :
```sql
bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
```

#### Politique 3 : Modification pour utilisateurs authentifiés
- **Policy name** : `Authenticated update [nom_bucket]`
- **Allowed operation** : `UPDATE`
- **Policy definition** :
```sql
bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
```

#### Politique 4 : Suppression pour utilisateurs authentifiés
- **Policy name** : `Authenticated delete [nom_bucket]`
- **Allowed operation** : `DELETE`
- **Policy definition** :
```sql
bucket_id = 'galerie' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
```

Répétez pour le bucket `pages`.

### Étape 4 : Vérifier

1. Rechargez la page admin
2. Essayez d'uploader une image dans la galerie
3. Vérifiez dans la console du navigateur : vous ne devriez plus voir le message de fallback
4. Vérifiez dans Supabase Storage : l'image devrait apparaître dans le bucket `galerie`

## 📝 Notes

- Le système fonctionne **déjà** sans Supabase Storage (fallback base64)
- Supabase Storage est **recommandé** pour de meilleures performances et pas de limite de quota
- Les images existantes en base64 continueront de fonctionner
- Les nouvelles images seront automatiquement uploadées vers Supabase une fois les buckets créés

## 🔧 Dépannage

### Erreur "Bucket not found"
- Vérifiez que le bucket `galerie` existe dans Supabase Storage
- Vérifiez que le nom du bucket est exactement `galerie` (minuscules, pas d'espaces)

### Erreur "new row violates row-level security policy"
- **C'est normal** : Les politiques RLS ne sont pas encore configurées
- **Solution** : Exécutez la migration SQL `002_fix_storage_rls.sql` dans le SQL Editor de Supabase
- Le système fonctionne temporairement en mode fallback base64 pendant la configuration

### Erreur "Permission denied"
- Vérifiez les politiques RLS du bucket
- Assurez-vous d'être connecté en tant qu'admin dans l'espace admin
- Vérifiez que les politiques incluent `auth.role() = 'authenticated'` pour les opérations d'écriture

### Les images ne s'affichent pas
- Vérifiez que le bucket est **public**
- Vérifiez les politiques RLS pour la lecture publique
