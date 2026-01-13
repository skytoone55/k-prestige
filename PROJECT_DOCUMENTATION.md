# K PRESTIGE - Documentation Projet

> **Document de référence** pour le développement et la maintenance du site K Prestige.
> Mis à jour le : 2026-01-13

---

## 1. Informations Générales

| Info | Valeur |
|------|--------|
| **Nom du projet** | K Prestige |
| **URL Production** | https://www.k-prestige.com |
| **Hébergement** | Vercel |
| **Base de données** | Supabase (ID: `htemxbrbxazzatmjerij`) |
| **Framework** | Next.js 14+ (App Router) |
| **Langage** | TypeScript |
| **CSS** | Tailwind CSS |

---

## 2. Structure du Projet

```
k-prestige/
├── src/
│   ├── app/
│   │   ├── (public)/          # Pages publiques (accueil, contact, etc.)
│   │   ├── (auth)/            # Authentification (login)
│   │   ├── admin/             # BackOffice admin
│   │   └── api/               # Routes API
│   ├── components/
│   │   ├── admin/             # Composants BackOffice
│   │   ├── layout/            # Navigation, Footer
│   │   ├── sections/          # Sections réutilisables
│   │   └── ui/                # Composants UI (Button, Card, etc.)
│   ├── lib/
│   │   ├── supabase/          # Client et utilitaires Supabase
│   │   └── images.ts          # Gestion des images placeholder
│   └── types/                 # Types TypeScript
├── public/
│   └── images/                # Images statiques
└── supabase/
    └── migrations/            # Migrations SQL
```

---

## 3. Accès Admin

| Info | Valeur |
|------|--------|
| **URL** | https://www.k-prestige.com/login |
| **Email** | malai.jonathan@gmail.com |
| **Password** | @Kprestige1532 |

---

## 4. Base de Données Supabase

### Tables Principales

| Table | Description |
|-------|-------------|
| `page_content` | Contenu des pages (textes, titres) |
| `galerie_content` | Catégories et images de la galerie |
| `demandes_devis` | Demandes de devis du formulaire contact |

### Buckets Storage

| Bucket | Description |
|--------|-------------|
| `galerie` | Images de la galerie photos |
| `pages` | Images des pages du site |

---

## 5. Problèmes Résolus et Solutions

### 5.1 Problème de Synchronisation Local/Production (IMPORTANT)

**Problème** : Les modifications en local ne se synchronisaient pas avec la production.

**Cause** : Le système utilisait localStorage comme cache ET comme fallback, créant des désynchronisations.

**Solution appliquée** :
1. Ajout d'un bouton "Resynchroniser" dans le BackOffice
2. localStorage vidé et rechargement depuis Supabase

**Bonnes pratiques** :
- Toujours cliquer sur "Resynchroniser" avant de modifier
- Vérifier dans Supabase Dashboard que les modifications sont bien sauvegardées
- Après déploiement, resynchroniser en production

**Documentation complète** : Voir `PROBLEME_SYNCHRONISATION.md`

### 5.2 Erreur RLS Storage

**Problème** : `new row violates row-level security policy`

**Solution** : Exécuter la migration `002_fix_storage_rls.sql` dans le SQL Editor de Supabase.

### 5.3 Format des numéros de téléphone

**Format standard** : `+33 6 XX XX XX XX`

**Solution** : Fonction `formatPhoneDisplay()` dans `contact/page.tsx` transforme automatiquement les formats `06...` en `+33 6...`

---

## 6. Déploiement

### Commande de déploiement
```bash
cd /Users/john/JARVIS/k-prestige
npx vercel --prod
```

### Checklist avant déploiement
- [ ] Vérifier que les modifications sont sauvegardées dans Supabase
- [ ] Tester en local (`npm run dev`)
- [ ] Vérifier qu'il n'y a pas d'erreurs TypeScript

### Après déploiement
- [ ] Tester le site en production
- [ ] Cliquer sur "Resynchroniser" dans le BackOffice si besoin

---

## 7. Configurations Importantes

### Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://htemxbrbxazzatmjerij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Images

Les images sont gérées de deux façons :
1. **Images statiques** : Dans `/public/images/`
2. **Images dynamiques** : Uploadées vers Supabase Storage

**Voir** : `EMPLACEMENTS_IMAGES.md` pour les chemins des images.

---

## 8. Conventions de Code

### Nommage
- **Fichiers composants** : PascalCase (`PublicNavigation.tsx`)
- **Fichiers utilitaires** : camelCase (`images.ts`)
- **Routes** : kebab-case (`/pessah-2026`)

### Structure des composants
```tsx
'use client'; // Si nécessaire

import { ... } from '...';

export function ComponentName() {
  // State
  // Effects
  // Handlers
  // Render
}
```

---

## 9. Contacts et Ressources

### Liens utiles
- **Supabase Dashboard** : https://supabase.com/dashboard/project/htemxbrbxazzatmjerij
- **Vercel Dashboard** : https://vercel.com
- **GitHub** : (si configuré)

### Coordonnées affichées sur le site
- **Téléphone 1** : +33 6 99 95 19 63
- **Téléphone 2** : +33 6 51 70 19 78
- **Email** : k-prestige@outlook.fr
- **Adresse** : 33 Avenue Philippe Auguste, 75011 Paris

---

## 10. Notes de Développement

### Ce qu'il ne faut PAS modifier sans précaution
- Les tables Supabase (risque de perte de données)
- Le middleware d'authentification (`middleware.ts`)
- Les composants UI de base (`/components/ui/`)

### Points d'attention
- Toujours tester les formulaires après modification
- Vérifier la responsivité mobile
- S'assurer que les overlays des heroes ne sont pas trop sombres (opacité ~25-30%)

---

## 11. Historique des Modifications Importantes

| Date | Modification |
|------|--------------|
| 2026-01-13 | Éclaircissement des overlays de toutes les pages |
| 2026-01-13 | Réorganisation page contact (blocs côte à côte) |
| 2026-01-13 | Centrage du menu navigation + agrandissement logo |
| 2026-01-13 | Format téléphone unifié en +33 |
| 2026-01-13 | Renommage "Galerie" → "Galerie photos" |

---

*Document créé le 2026-01-13*
