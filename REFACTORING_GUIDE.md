# Guide de Refactoring - K Prestige

## 🎯 Objectif
Refaire complètement le site public tout en conservant l'espace privé (admin) avec son design ergonomique inspiré de MZ Energy.

## ✅ À CONSERVER (Espace Privé / Admin)

### Structure Admin
- `/src/app/admin/` - Toute la structure admin
- `/src/components/admin/` - Composants admin
- `/src/components/ui/` - Composants UI réutilisables (Button, Card, Input, etc.)
- Design system MZ Energy pour l'admin :
  - Couleurs oklch
  - Typographie (Cormorant Garamond pour titres, DM Sans pour body)
  - Espacements généreux
  - Ombres subtiles
  - Design épuré et moderne

### Pages Admin à conserver
- `/admin` - Dashboard
- `/admin/clients` - Liste des clients (format table)
- `/admin/chambres` - Gestion des chambres
- `/admin/statistiques` - Statistiques
- `/admin/contenu/*` - Gestion de contenu
- `/admin/galerie*` - Gestion des galeries
- `/admin/parametres` - Paramètres

### Composants Admin à conserver
- `AdminNav.tsx` - Navigation sidebar avec menu déroulant
- `DataTable.tsx` - Tableau de données
- Tous les composants UI dans `/components/ui/`

### Système Backend
- Supabase (base de données, auth, storage)
- Tables existantes : `clients`, `chambres`, `contenu_pages`, `galerie_generale`
- Système d'authentification admin
- Middleware de protection des routes admin

## 🔄 À REFAIRE (Site Public)

### Pages Publiques
- `/` - Page d'accueil
- `/pessah-2026` - Page séjour
- `/tarifs` - Page tarifs
- `/contact` - Page contact
- `/galerie` - Galerie photos

### Composants Publics
- `/src/components/public/` - Tous les composants publics peuvent être refaits
- `/src/components/layout/PublicNavigation.tsx` - Navigation publique
- `/src/components/layout/Footer.tsx` - Footer

### Design Public
- Tout le design public peut être complètement revu
- Identité visuelle K Prestige (or, bleu méditerranéen) à redéfinir
- Structure et contenu à repenser

## 📁 Structure Recommandée pour le Refactoring

```
src/
├── app/
│   ├── (public)/          # ← À REFAIRE COMPLÈTEMENT
│   │   ├── page.tsx       # Accueil
│   │   ├── pessah-2026/
│   │   ├── tarifs/
│   │   ├── contact/
│   │   └── galerie/
│   │
│   ├── (admin)/           # ← À CONSERVER
│   │   └── ... (tous les fichiers admin)
│   │
│   ├── (auth)/            # ← À CONSERVER
│   │   └── login/
│   │
│   └── api/               # ← À CONSERVER
│
├── components/
│   ├── admin/             # ← À CONSERVER
│   ├── public/             # ← À REFAIRE
│   ├── layout/             # ← À REFAIRE (sauf si utilisé par admin)
│   └── ui/                 # ← À CONSERVER
│
├── lib/                    # ← À CONSERVER (Supabase, utils)
└── types/                  # ← À CONSERVER
```

## 🎨 Design System

### Admin (MZ Energy - À CONSERVER)
- **Couleurs** : Variables oklch dans `globals.css`
- **Typographie** : Cormorant Garamond (titres), DM Sans (body)
- **Espacements** : Généreux, aérés
- **Composants** : Card, Button, Input avec style MZ Energy

### Public (À REDÉFINIR)
- **Couleurs** : Or (#D4AF37), Bleu Méditerranéen (#0077B6), Noir
- **Typographie** : À définir
- **Style** : Luxe, élégant, moderne
- **Composants** : À créer selon nouveau design

## 🔧 Préparations Utiles

### 1. Séparer les styles
- Garder les styles admin dans `globals.css` (variables oklch)
- Créer un fichier séparé pour les styles publics si nécessaire

### 2. Routes claires
- Les routes `(public)` sont complètement indépendantes
- Les routes `(admin)` restent intactes

### 3. Composants réutilisables
- Les composants UI (`/components/ui/`) peuvent être utilisés par les deux
- Les composants admin restent dans `/components/admin/`
- Les nouveaux composants publics iront dans `/components/public/`

## 📝 Notes Importantes

1. **L'authentification admin doit rester fonctionnelle**
2. **Les données Supabase (clients, chambres, etc.) doivent rester accessibles**
3. **Le système de gestion de contenu admin doit continuer à fonctionner**
4. **Le design admin MZ Energy doit être préservé**

## 🚀 Prochaines Étapes

1. Définir le nouveau design public
2. Créer les nouvelles pages publiques
3. Créer les nouveaux composants publics
4. Tester que l'admin reste fonctionnel
5. Intégrer le nouveau design public avec le système de contenu admin existant

