# K PRESTIGE - Pessah 2026

Site vitrine et espace d'administration pour le séjour Pessah 2026 au Cabogata Beach Hotel 5★ en Espagne.

## Stack Technique

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Base de données + Auth)
- **Vercel** (Déploiement)

## Installation

```bash
npm install
```

## Configuration

1. Créer un fichier `.env.local` avec :

```env
NEXT_PUBLIC_SUPABASE_URL=https://htemxbrbxazzatmjerij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

- `/` - Homepage publique
- `/reservation` - Formulaire de demande de devis
- `/admin` - Espace d'administration (nécessite authentification)

## Déploiement

Le projet est configuré pour être déployé sur Vercel via le MCP Vercel JO.
