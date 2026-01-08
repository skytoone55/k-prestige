# Structure Actuelle du Projet

## 📂 Organisation des Fichiers

### Espace Privé (Admin) - À CONSERVER
```
src/app/admin/              # Routes admin
src/components/admin/       # Composants admin
src/components/ui/          # Composants UI réutilisables (Button, Card, Input, etc.)
src/lib/supabase/          # Configuration Supabase
src/types/                 # Types TypeScript
src/middleware.ts          # Protection routes admin
```

### Espace Public - À REFAIRE
```
src/app/(public)/          # Routes publiques
  ├── page.tsx             # Accueil
  ├── pessah-2026/
  ├── tarifs/
  ├── contact/
  └── galerie/

src/components/public/      # Composants publics
src/components/layout/     # Navigation et Footer publics
```

## 🎨 Design System Actuel

### Admin (MZ Energy)
- **Fichier** : `src/app/globals.css`
- **Variables** : oklch color system
- **Fonts** : Cormorant Garamond (titres), DM Sans (body)
- **Style** : Épuré, moderne, espacements généreux

### Public (À refaire)
- Actuellement utilise les mêmes styles que l'admin
- À redéfinir complètement

## 🔐 Authentification

- **Route** : `/login`
- **Middleware** : Protection automatique des routes `/admin/*`
- **Supabase Auth** : Gestion des utilisateurs admin

## 💾 Base de Données (Supabase)

### Tables existantes
- `clients` - Gestion des clients
- `chambres` - Gestion des chambres
- `contenu_pages` - Contenu éditable des pages
- `galerie_generale` - Galerie photo centrale
- `demandes_devis` - Demandes de devis depuis le formulaire contact

### Storage
- Bucket `images` - Stockage des images uploadées

## 🛠️ Système de Gestion de Contenu

### Pages admin de contenu
- `/admin/contenu` - Contenu accueil
- `/admin/contenu/pessah-2026` - Contenu page Pessah
- `/admin/contenu/tarifs` - Contenu page tarifs
- `/admin/contenu/contact` - Contenu page contact

### Galeries
- `/admin/galerie-generale` - Galerie centrale (toutes les photos)
- `/admin/galerie` - Galerie catégorisée (ancien système)

## 📦 Dépendances Principales

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Supabase (client, auth, storage)
- react-hook-form
- zod (validation)
- lucide-react (icônes)

## ⚠️ Points d'Attention pour le Refactoring

1. **Ne pas toucher** aux routes `/admin/*`
2. **Ne pas modifier** les composants dans `/components/admin/`
3. **Ne pas modifier** les composants UI dans `/components/ui/`
4. **Conserver** le système d'authentification
5. **Conserver** la connexion Supabase
6. **Conserver** le middleware de protection

## ✅ Ce qui peut être modifié librement

- Toutes les pages dans `src/app/(public)/`
- Tous les composants dans `src/components/public/`
- `src/components/layout/PublicNavigation.tsx`
- `src/components/layout/Footer.tsx`
- Le design public dans `globals.css` (mais garder les variables admin)

