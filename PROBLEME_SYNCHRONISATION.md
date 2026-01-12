# 🔄 Problème de Synchronisation Local ↔ Production

## 📋 Résumé Exécutif

**Problème principal** : Les modifications effectuées en local ne se synchronisent pas correctement avec la production, et vice versa. Les photos uploadées en local n'apparaissent pas en production après déploiement, et les modifications faites en production ne sont pas visibles en local.

**Cause racine** : Le système utilise un double stockage (Supabase + localStorage) où localStorage sert à la fois de cache ET de source de données, créant des conflits et des désynchronisations entre les environnements.

---

## 🏗️ Architecture Actuelle

### 1. Système de Stockage Double

Le système utilise deux sources de données :

1. **Supabase** (Base de données PostgreSQL + Storage)
   - Tables : `page_content`, `galerie_content`
   - Storage : Buckets `galerie` et `pages`
   - Source de vérité théorique

2. **localStorage** (Navigateur)
   - Clés : `galerie_categories`, `galerie_images`, `page_content_full_*`
   - Utilisé comme cache ET comme fallback
   - Spécifique à chaque navigateur/machine

### 2. Flux de Données Actuel

#### Chargement des Données

```typescript
// Exemple dans GalerieManager.tsx (lignes 37-93)
const loadData = async () => {
  try {
    // 1. Essayer de charger depuis Supabase
    const response = await fetch(
      `${supabaseUrl}/rest/v1/galerie_content?id=eq.00000000-0000-0000-0000-000000000001`,
      { headers: { 'apikey': supabaseKey, ... } }
    );
    
    if (response.ok) {
      const data = await response.json();
      setCategories(data[0].categories || []);
      setImages(data[0].images || []);
      
      // 2. Mettre en cache dans localStorage
      localStorage.setItem('galerie_categories', JSON.stringify(data[0].categories));
      localStorage.setItem('galerie_images', JSON.stringify(data[0].images));
      return;
    }
  } catch (error) {
    console.error('Error loading from Supabase:', error);
  }
  
  // 3. Fallback : charger depuis localStorage
  const savedCategories = localStorage.getItem('galerie_categories');
  if (savedCategories) {
    setCategories(JSON.parse(savedCategories));
  }
};
```

#### Sauvegarde des Données

```typescript
// Exemple dans GalerieManager.tsx (lignes 95-127)
const saveToSupabase = async (newCategories: Category[], newImages: GalleryImage[]) => {
  const supabase = createClient();
  
  // 1. Sauvegarder dans Supabase
  const { error } = await supabase
    .from('galerie_content')
    .update({
      categories: newCategories,
      images: newImages,
      updated_at: new Date().toISOString()
    })
    .eq('id', '00000000-0000-0000-0000-000000000001');
  
  // 2. Toujours sauvegarder dans localStorage aussi
  localStorage.setItem('galerie_categories', JSON.stringify(newCategories));
  localStorage.setItem('galerie_images', JSON.stringify(newImages));
};
```

---

## 🐛 Problèmes Identifiés

### Problème 1 : localStorage comme Cache Persistant et Source de Données

**Description** : localStorage est utilisé à la fois comme cache (après chargement depuis Supabase) ET comme source de données (fallback si Supabase échoue).

**Code problématique** :

```typescript
// Dans GalerieManager.tsx ligne 70-71
localStorage.setItem('galerie_categories', JSON.stringify(galerieData.categories || []));
localStorage.setItem('galerie_images', JSON.stringify(galerieData.images || []));

// Plus tard, si Supabase échoue (ligne 84-92)
const savedCategories = localStorage.getItem('galerie_categories');
if (savedCategories) {
  setCategories(JSON.parse(savedCategories)); // Utilise les données en cache
}
```

**Conséquences** :

1. **Données obsolètes en cache** : Si vous modifiez en local, le state React change, mais localStorage peut contenir d'anciennes données qui seront utilisées en fallback.

2. **Écrasement silencieux** : Si Supabase a des données plus récentes mais que localStorage contient des données anciennes, le fallback peut utiliser les anciennes données.

3. **Pas de timestamp** : localStorage ne stocke pas de timestamp, donc impossible de savoir si les données sont à jour.

**Exemple de scénario** :
- Jour 1 : Vous chargez la galerie → localStorage contient 10 images
- Jour 2 : Quelqu'un ajoute 5 images en production → Supabase a 15 images
- Jour 3 : Vous ouvrez en local, Supabase est temporairement inaccessible → localStorage charge les 10 anciennes images
- Résultat : Vous ne voyez pas les 5 nouvelles images

---

### Problème 2 : Pas de Détection de Conflits ou de Versions

**Description** : Le code ne vérifie pas si les données dans Supabase ont changé depuis le dernier chargement local.

**Code actuel** :

```typescript
// Dans PageEditorFull.tsx ligne 448-457
const { data: upsertResult, error } = await supabase
  .from('page_content')
  .upsert({
    page_id: pageId,
    content: data,
    updated_at: new Date().toISOString()
  }, { onConflict: 'page_id' })
  .select();
```

**Problème** : L'upsert écrase toujours les données sans vérifier si quelqu'un d'autre a modifié entre-temps.

**Conséquences** :

1. **Perte de données** : Si deux personnes modifient en même temps, la dernière modification écrase la première.

2. **Pas de merge** : Les modifications ne sont pas fusionnées, elles sont remplacées.

3. **Pas d'alerte** : L'utilisateur n'est pas averti qu'il écrase des modifications récentes.

**Exemple de scénario** :
- 10h00 : Vous modifiez le titre "PESSAH 2026" en local (mais ne sauvegardez pas encore)
- 10h05 : Quelqu'un modifie la description en production → Supabase mis à jour
- 10h10 : Vous sauvegardez votre modification → Écrase la description modifiée en production
- Résultat : La description modifiée en production est perdue

---

### Problème 3 : Sauvegarde Automatique sans Rechargement

**Description** : Les modifications sont sauvegardées automatiquement dans Supabase, mais le state React n'est pas rechargé depuis Supabase après sauvegarde.

**Code problématique** :

```typescript
// Dans GalerieManager.tsx ligne 129-133
const saveCategories = (newCategories: Category[]) => {
  setCategories(newCategories); // Met à jour le state React
  saveToSupabase(newCategories, images); // Sauvegarde dans Supabase
  // ❌ Mais ne recharge PAS depuis Supabase pour vérifier
};
```

**Conséquences** :

1. **Désynchronisation silencieuse** : Le state React peut être différent de ce qui est dans Supabase.

2. **Modifications multiples** : Si vous modifiez plusieurs fois sans recharger, localStorage peut être désynchronisé.

3. **Pas de validation** : Aucune vérification que la sauvegarde a bien fonctionné et que les données sont cohérentes.

**Exemple de scénario** :
- Vous ajoutez une catégorie → `saveCategories()` appelé
- La sauvegarde Supabase échoue silencieusement (erreur réseau)
- Le state React pense que la catégorie est ajoutée
- localStorage est mis à jour avec la nouvelle catégorie
- Résultat : En local, vous voyez la catégorie, mais en production elle n'existe pas

---

### Problème 4 : Fallback localStorage Prioritaire dans Certains Cas

**Description** : Les pages publiques peuvent charger depuis localStorage même si Supabase a des données plus récentes.

**Code problématique** :

```typescript
// Dans galerie/page.tsx (page publique) ligne 60-75
// Fallback localStorage uniquement si Supabase échoue
const savedCategories = localStorage.getItem('galerie_categories');
const savedImages = localStorage.getItem('galerie_images');

if (savedCategories) {
  const cats = JSON.parse(savedCategories);
  setCategories(cats); // Utilise localStorage même si Supabase a des données plus récentes
}
```

**Conséquences** :

1. **Données obsolètes affichées** : Les visiteurs peuvent voir d'anciennes données si leur localStorage contient un cache.

2. **Pas de refresh automatique** : Les pages publiques ne rechargent pas automatiquement depuis Supabase.

3. **Cache navigateur persistant** : Le localStorage persiste entre les sessions, donc les anciennes données peuvent rester affichées.

**Exemple de scénario** :
- Vous visitez la galerie en production → localStorage mis en cache avec 10 images
- Vous ajoutez 5 images en local → Supabase a 15 images
- Vous revenez sur la page publique → localStorage charge toujours les 10 anciennes images
- Résultat : Les 5 nouvelles images ne sont pas visibles

---

### Problème 5 : Pas de Synchronisation Bidirectionnelle Automatique

**Description** : Le bouton "Resynchroniser" existe mais nécessite une action manuelle et ne détecte pas automatiquement les changements.

**Code actuel** :

```typescript
// Dans AdminSidebar.tsx ligne 105-129
const handleResync = async () => {
  setIsSyncing(true);
  
  // Supprimer toutes les entrées localStorage
  const keysToRemove = Object.keys(localStorage).filter(
    key => key.includes('page_content') || key.includes('galerie')
  );
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Recharger la page
  window.location.reload();
};
```

**Limitations** :

1. **Action manuelle requise** : L'utilisateur doit cliquer sur le bouton.

2. **Pas de détection automatique** : Le système ne détecte pas si Supabase a été modifié.

3. **Pas de prévention de conflits** : Ne prévient pas les conflits, les résout seulement après coup.

4. **Rechargement complet** : Recharge toute la page, ce qui peut être lent.

---

## 📊 Scénarios de Désynchronisation Détaillés

### Scénario 1 : Modification en Local puis en Production

**Chronologie** :

1. **10h00 - Local** : Vous modifiez le titre "PESSAH 2026" → `handleSave()` appelé
   - Supabase mis à jour : `{ title: "PESSAH 2026" }`
   - localStorage mis à jour : `{ title: "PESSAH 2026" }`
   - ✅ Synchronisé

2. **10h05 - Production** : Quelqu'un modifie la description → `handleSave()` appelé
   - Supabase mis à jour : `{ title: "PESSAH 2026", description: "Nouvelle description" }`
   - localStorage production mis à jour
   - ✅ Synchronisé en production

3. **10h10 - Local** : Vous rechargez la page → `loadPageData()` appelé
   - Charge depuis Supabase : `{ title: "PESSAH 2026", description: "Nouvelle description" }`
   - localStorage local mis à jour
   - ✅ Vous voyez les modifications de production

4. **10h15 - Local** : Vous modifiez le titre sans sauvegarder → state React change
   - state React : `{ title: "PESSAH 2027", description: "Nouvelle description" }`
   - Supabase : `{ title: "PESSAH 2026", description: "Nouvelle description" }`
   - localStorage : `{ title: "PESSAH 2026", description: "Nouvelle description" }`
   - ⚠️ Désynchronisé temporairement

5. **10h20 - Local** : Vous sauvegardez → `handleSave()` appelé
   - Supabase mis à jour : `{ title: "PESSAH 2027", description: "Nouvelle description" }`
   - localStorage mis à jour
   - ✅ Synchronisé

**Résultat** : Fonctionne si vous sauvegardez toujours vos modifications.

---

### Scénario 2 : Modification en Production puis en Local (PROBLÉMATIQUE)

**Chronologie** :

1. **10h00 - Production** : Quelqu'un ajoute 5 images → `handleAddImage()` appelé
   - Supabase mis à jour : 15 images
   - localStorage production mis à jour : 15 images
   - ✅ Synchronisé en production

2. **10h05 - Local** : Vous ouvrez la galerie → `loadData()` appelé
   - Essaie de charger depuis Supabase
   - **ERREUR** : Supabase temporairement inaccessible (timeout, erreur réseau)
   - Fallback localStorage : Charge les 10 anciennes images
   - ⚠️ Vous ne voyez pas les 5 nouvelles images

3. **10h10 - Local** : Vous ajoutez 2 images → `handleAddImage()` appelé
   - Upload vers Supabase Storage : 2 nouvelles images
   - Supabase Database mis à jour : 17 images (15 + 2)
   - localStorage local mis à jour : 12 images (10 + 2)
   - ⚠️ localStorage local est désynchronisé

4. **10h15 - Local** : Vous supprimez une image → `handleDeleteImage()` appelé
   - Supprime depuis Supabase : 16 images restantes
   - localStorage local mis à jour : 11 images
   - ⚠️ Mais localStorage pense qu'il y a 11 images alors qu'il devrait y en avoir 16

5. **10h20 - Local** : Vous rechargez la page → `loadData()` appelé
   - Charge depuis Supabase : 16 images
   - localStorage mis à jour : 16 images
   - ✅ Synchronisé

**Résultat** : Pendant la période où Supabase était inaccessible, vous avez travaillé avec des données obsolètes.

---

### Scénario 3 : Images Uploadées en Local (PROBLÉMATIQUE)

**Chronologie** :

1. **10h00 - Local** : Vous uploadez 10 images → `handleAddImage()` appelé 10 fois
   - Upload vers Supabase Storage : 10 images uploadées
   - URLs générées : `https://htemxbrbxazzatmjerij.supabase.co/storage/v1/object/public/galerie/...`
   - Supabase Database mis à jour : 10 nouvelles entrées dans `galerie_content.images`
   - localStorage local mis à jour : 10 nouvelles images
   - ✅ Images dans Supabase Storage
   - ✅ Métadonnées dans Supabase Database

2. **10h05 - Local** : Vous déployez le code → `git push` + Vercel déploie
   - ✅ Code déployé
   - ✅ Images toujours dans Supabase Storage (elles ne sont pas dans le code)
   - ✅ Métadonnées toujours dans Supabase Database

3. **10h10 - Production** : Vous ouvrez la galerie → `loadData()` appelé
   - Charge depuis Supabase : Devrait charger les 10 nouvelles images
   - **MAIS** : Si le localStorage production contient un cache, il peut charger les anciennes données
   - ⚠️ Les 10 nouvelles images peuvent ne pas apparaître immédiatement

4. **10h15 - Production** : Vous cliquez sur "Resynchroniser" → `handleResync()` appelé
   - localStorage vidé
   - Page rechargée
   - Charge depuis Supabase : 10 nouvelles images
   - ✅ Les images apparaissent

**Résultat** : Les images sont bien dans Supabase, mais le cache localStorage peut masquer les nouvelles données jusqu'à ce que vous resynchronisiez.

---

### Scénario 4 : Conflit de Modifications Simultanées (CRITIQUE)

**Chronologie** :

1. **10h00 - Local** : Vous modifiez le titre "PESSAH 2026" → `updateNestedValue()` appelé
   - state React : `{ title: "PESSAH 2027" }`
   - ⚠️ Pas encore sauvegardé dans Supabase

2. **10h01 - Production** : Quelqu'un modifie la description → `handleSave()` appelé
   - Supabase mis à jour : `{ title: "PESSAH 2026", description: "Nouvelle description" }`
   - ✅ Sauvegardé

3. **10h02 - Local** : Vous sauvegardez votre modification → `handleSave()` appelé
   - Supabase mis à jour : `{ title: "PESSAH 2027", description: "" }` (description perdue car votre state React n'avait pas la nouvelle description)
   - ❌ La description modifiée en production est perdue

**Résultat** : Perte de données due à l'écrasement sans merge.

---

## 🔍 Analyse Technique Détaillée

### Structure des Tables Supabase

#### Table `page_content`

```sql
CREATE TABLE IF NOT EXISTS page_content (
  page_id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Problème** : Pas de champ `version` ou `etag` pour détecter les conflits.

#### Table `galerie_content`

```sql
CREATE TABLE IF NOT EXISTS galerie_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categories JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Problème** : Même problème, pas de versioning.

### Flux de Données Complet

```
┌─────────────────┐
│   Supabase DB   │ ← Source de vérité théorique
└────────┬────────┘
         │
         │ (1) Chargement initial
         ▼
┌─────────────────┐
│  React State    │ ← State du composant
└────────┬────────┘
         │
         │ (2) Mise en cache
         ▼
┌─────────────────┐
│  localStorage   │ ← Cache persistant
└─────────────────┘
         │
         │ (3) Fallback si Supabase échoue
         ▼
┌─────────────────┐
│  React State    │ ← Peut être désynchronisé
└─────────────────┘
```

**Problème** : Le flux est unidirectionnel (Supabase → localStorage), mais localStorage peut être utilisé comme source si Supabase échoue, créant une désynchronisation.

### Gestion des Images

#### Upload d'Images

```typescript
// Dans GalerieManager.tsx ligne 197-229
const handleAddImage = async (categoryId: string, file: File): Promise<void> => {
  // 1. Upload vers Supabase Storage
  const imageUrl = await uploadImageToSupabase(file, 'galerie', `categories/${categoryId}`);
  
  // 2. Créer l'entrée dans le state React
  const newImage: GalleryImage = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category_id: categoryId,
    src: imageUrl, // URL Supabase
    alt: file.name,
  };
  
  // 3. Ajouter au state
  const updatedImages = [...images, newImage];
  setImages(updatedImages);
  
  // 4. Sauvegarder dans Supabase Database
  saveToSupabase(categories, updatedImages);
};
```

**Points positifs** :
- ✅ Les images sont uploadées dans Supabase Storage (pas en base64)
- ✅ Les URLs sont persistantes
- ✅ Les images ne sont pas perdues lors du déploiement

**Points négatifs** :
- ⚠️ Si `saveToSupabase()` échoue, l'image est dans Storage mais pas dans Database
- ⚠️ Pas de rollback si l'upload Storage réussit mais la sauvegarde Database échoue

---

## 💡 Solutions Recommandées

### Solution 1 : Utiliser Supabase comme Source Unique (Recommandée)

**Principe** : Supprimer complètement localStorage et utiliser uniquement Supabase.

**Avantages** :
- ✅ Source de vérité unique
- ✅ Synchronisation automatique entre local et production
- ✅ Pas de conflits de cache

**Inconvénients** :
- ⚠️ Nécessite une connexion Internet
- ⚠️ Peut être plus lent (requêtes réseau)

**Implémentation** :
1. Supprimer tous les `localStorage.setItem()` et `localStorage.getItem()`
2. Toujours charger depuis Supabase
3. Gérer les erreurs réseau avec des messages clairs
4. Ajouter un mode offline avec queue de modifications (optionnel)

---

### Solution 2 : localStorage comme Cache avec Invalidation

**Principe** : Utiliser localStorage uniquement comme cache avec timestamp et invalidation automatique.

**Avantages** :
- ✅ Performance améliorée (cache local)
- ✅ Fonctionne offline temporairement
- ✅ Synchronisation contrôlée

**Implémentation** :
1. Stocker un timestamp avec chaque entrée localStorage
2. Vérifier `updated_at` dans Supabase avant d'utiliser le cache
3. Invalider le cache si Supabase a des données plus récentes
4. Ajouter un TTL (Time To Live) pour le cache

**Exemple de structure** :
```typescript
interface CachedData<T> {
  data: T;
  timestamp: number;
  supabaseUpdatedAt: string;
}

// Stocker
localStorage.setItem('galerie_categories', JSON.stringify({
  data: categories,
  timestamp: Date.now(),
  supabaseUpdatedAt: '2024-01-15T10:00:00Z'
}));

// Charger avec vérification
const cached = JSON.parse(localStorage.getItem('galerie_categories'));
if (cached && cached.supabaseUpdatedAt === currentSupabaseUpdatedAt) {
  // Utiliser le cache
} else {
  // Recharger depuis Supabase
}
```

---

### Solution 3 : Versioning et Détection de Conflits

**Principe** : Ajouter un système de versioning pour détecter et résoudre les conflits.

**Implémentation** :
1. Ajouter un champ `version` dans les tables Supabase
2. Vérifier la version avant de sauvegarder
3. Alerter l'utilisateur en cas de conflit
4. Proposer un merge ou un écrasement

**Exemple** :
```sql
ALTER TABLE page_content ADD COLUMN version INTEGER DEFAULT 1;

-- Avant update, vérifier la version
SELECT version FROM page_content WHERE page_id = 'accueil';
-- Si version différente, alerter l'utilisateur
```

---

### Solution 4 : Synchronisation Bidirectionnelle avec WebSockets

**Principe** : Utiliser Supabase Realtime pour synchroniser automatiquement les changements.

**Avantages** :
- ✅ Synchronisation en temps réel
- ✅ Pas besoin de recharger la page
- ✅ Détection automatique des changements

**Implémentation** :
```typescript
// S'abonner aux changements
const channel = supabase
  .channel('galerie_changes')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'galerie_content' },
    (payload) => {
      // Mettre à jour le state React automatiquement
      setCategories(payload.new.categories);
      setImages(payload.new.images);
    }
  )
  .subscribe();
```

---

## 🎯 Recommandations Immédiates (Sans Modification de Code)

### Pour l'Utilisateur

1. **Toujours cliquer sur "Resynchroniser" avant de modifier**
   - Vide le cache localStorage
   - Recharge les données depuis Supabase
   - Garantit que vous travaillez avec les données à jour

2. **Vérifier dans Supabase Dashboard**
   - Aller sur https://supabase.com/dashboard
   - Vérifier la table `galerie_content` et `page_content`
   - Confirmer que les modifications sont bien sauvegardées

3. **Vider le localStorage manuellement si besoin**
   - Ouvrir la console du navigateur (F12)
   - Exécuter : `localStorage.clear()`
   - Recharger la page

4. **Utiliser le même navigateur/environnement**
   - Éviter de modifier en local sur Chrome et en production sur Firefox
   - Chaque navigateur a son propre localStorage

5. **Sauvegarder immédiatement après modification**
   - Ne pas laisser des modifications non sauvegardées
   - Cliquer sur "Sauvegarder" après chaque modification importante

---

## 📝 Checklist de Vérification

Avant de modifier en local :
- [ ] Cliquer sur "Resynchroniser" dans le BackOffice
- [ ] Vérifier que les données chargées sont à jour
- [ ] Vérifier la connexion Internet (pour Supabase)

Après modification en local :
- [ ] Cliquer sur "Sauvegarder"
- [ ] Vérifier le message de confirmation
- [ ] Vérifier dans Supabase Dashboard que les données sont sauvegardées

Avant de déployer :
- [ ] Vérifier que toutes les modifications sont sauvegardées dans Supabase
- [ ] Vérifier que les images sont bien dans Supabase Storage
- [ ] Tester en production après déploiement

Après déploiement :
- [ ] Cliquer sur "Resynchroniser" en production
- [ ] Vérifier que les nouvelles données apparaissent
- [ ] Vérifier que les nouvelles images s'affichent

---

## 🔧 Fichiers Concernés

### Fichiers Principaux

1. **`src/components/admin/GalerieManager.tsx`**
   - Lignes 37-93 : `loadData()` - Chargement avec fallback localStorage
   - Lignes 95-127 : `saveToSupabase()` - Sauvegarde double
   - Lignes 129-139 : `saveCategories()` et `saveImages()` - Sauvegarde automatique

2. **`src/components/admin/PageEditorFull.tsx`**
   - Lignes 375-425 : `loadPageData()` - Chargement avec fallback localStorage
   - Lignes 435-496 : `handleSave()` - Sauvegarde avec fallback localStorage

3. **`src/components/admin/AdminSidebar.tsx`**
   - Lignes 105-129 : `handleResync()` - Resynchronisation manuelle

4. **`src/app/(public)/galerie/page.tsx`**
   - Lignes 19-79 : Chargement avec fallback localStorage

5. **`src/lib/supabase/storage.ts`**
   - Lignes 10-100 : Upload vers Supabase Storage avec fallback base64

### Tables Supabase

1. **`page_content`** : Contenu des pages
2. **`galerie_content`** : Catégories et images de la galerie

### Migrations SQL

1. **`supabase/migrations/001_create_content_tables.sql`** : Création des tables
2. **`supabase/migrations/003_fix_rls_policies.sql`** : Politiques RLS

---

## 📊 Métriques et Indicateurs

### Problèmes Fréquents

1. **Images uploadées en local mais pas visibles en production**
   - Fréquence : Élevée
   - Cause : Cache localStorage en production
   - Solution : Resynchroniser en production

2. **Modifications en production perdues après modification en local**
   - Fréquence : Moyenne
   - Cause : Écrasement sans détection de conflit
   - Solution : Resynchroniser avant de modifier

3. **Données différentes entre local et production**
   - Fréquence : Élevée
   - Cause : localStorage désynchronisé
   - Solution : Resynchroniser régulièrement

---

## 🚀 Conclusion

Le problème principal est que **localStorage sert à la fois de cache ET de source de données**, créant des conflits entre les environnements local et production. Les modifications sont bien sauvegardées dans Supabase, mais le localStorage peut contenir des données obsolètes qui interfèrent avec la synchronisation.

**Solution immédiate** : Utiliser le bouton "Resynchroniser" avant chaque modification et après chaque déploiement.

**Solution à long terme** : Refactoriser pour utiliser Supabase comme source unique, avec localStorage uniquement comme cache avec invalidation automatique.

---

## 📞 Support

Si vous rencontrez des problèmes de synchronisation :

1. Vérifier la console du navigateur pour les erreurs
2. Vérifier Supabase Dashboard pour confirmer les données
3. Utiliser le bouton "Resynchroniser"
4. Vider le localStorage si nécessaire

---

**Document créé le** : 2024-01-15  
**Dernière mise à jour** : 2024-01-15  
**Version** : 1.0
