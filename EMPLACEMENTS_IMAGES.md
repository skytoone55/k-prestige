# 📍 Emplacements des Images sur le Site K Prestige

## Images Locales (dans `/public/images/`)

### Images existantes :
- **Hero** : `/public/images/hero/PANORAMIC.jpg` et `PANORAMIC VIEW.jpg`
- **Hôtel** : `/public/images/hotel/FAÇADE.jpg`
- **Chambres** : `/public/images/chambres/` (5 images)
- **Piscines** : `/public/images/piscines/POOL.jpg` et `POOLS & SEA.jpg`
- **Restaurant** : `/public/images/restaurant/ORIGEN.jpg`
- **SPA** : `/public/images/spa/SPA.jpg`
- **Événements** : `/public/images/events/EVENTS.jpg`

### Images à ajouter :

#### 1. Pour la page d'accueil - Marbella (côtelettes d'agneau)
**Chemin requis** : `/public/images/restaurant/marbella-lamb.jpg`
**Utilisé dans** : `src/components/sections/UniversCards.tsx` (ligne 22)

#### 2. Pour la page d'accueil - Souccot (Arba Minim - Loulav & Etrog)
**Chemin requis** : `/public/images/souccot/arba-minim.jpg`
**Utilisé dans** : `src/components/sections/UniversCards.tsx` (ligne 40)

## Images Unsplash (temporaires)

Les images suivantes utilisent des URLs Unsplash en attendant les vraies photos :
- Marrakech : `placeholderImages.marrakechEvent`
- Hilloula : `placeholderImages.candles`
- Et toutes les autres dans `src/lib/images.ts`

## Logos

- **Logo doré** : `/public/K PRETIGE OR.png` (footer, admin, login)
- **Logo noir** : `/public/K PRESTIGE NOIR.png` (menu)
- **Logo blanc** : `/public/K PRESTIGE BLANC.png` (non utilisé actuellement)

## Comment ajouter les nouvelles images

1. Placez l'image des côtelettes d'agneau dans :
   ```
   /Users/john/JARVIS/k-prestige/public/images/restaurant/marbella-lamb.jpg
   ```

2. Placez l'image Arba Minim dans :
   ```
   /Users/john/JARVIS/k-prestige/public/images/souccot/arba-minim.jpg
   ```

3. Redémarrez le serveur de développement si nécessaire
