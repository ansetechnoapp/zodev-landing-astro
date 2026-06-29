# 🖼️ Guide d'Optimisation d'Images - Portfolio Astro

## 📋 Vue d'ensemble

Ce projet dispose d'un système d'optimisation d'images automatique et performant qui :
- ✅ Optimise automatiquement les nouvelles images lors du build
- ✅ Génère des formats modernes (WebP, AVIF)
- ✅ Crée des images responsives (320w, 480w, 640w, 1024w, 1440w)
- ✅ Maintient les fallbacks pour la compatibilité
- ✅ Compatible avec Vercel

## 🚀 Utilisation Rapide

### Pour ajouter une nouvelle image :

1. **Placez l'image** dans `public/assets/` ou un sous-dossier approprié
2. **Lancez le build** : `pnpm build`
3. **L'image sera automatiquement optimisée** ✨
4. **L'original sera déplacé** vers `unused_images/` 📦

### Commandes disponibles :
```bash
pnpm optimize-images    # Optimise les nouvelles images
pnpm cleanup-images     # Organise les images existantes
pnpm setup-images       # Nettoyage + optimisation complète
```

### ✨ **Fonctionnalités Intelligentes**
- **Pas de re-optimisation** : Les images déjà traitées sont ignorées
- **Déplacement automatique** : Les originaux vont dans `unused_images/`
- **Gestion des doublons** : Suffixes automatiques pour éviter les conflits
- **Exclusion intelligente** : Le dossier `unused_images/` est ignoré

## 🧩 Composants Disponibles

### 1. OptimizedImage (Recommandé)
```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
---

<OptimizedImage
  src="/assets/mon-image.jpg"
  alt="Description de l'image"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

### 2. Image Astro natif
```astro
---
import { Image } from "astro:assets";
---

<Image
  src="/assets/mon-image.jpg"
  alt="Description"
  width={800}
  height={600}
  format="webp"
  quality={80}
/>
```

### 3. Picture element manuel (pour un contrôle total)
```astro
<picture>
  <source
    type="image/avif"
    srcset="/assets/image_optimized.avif 1x, /assets/image_640w.avif 640w"
    sizes="(max-width: 768px) 100vw, 800px"
  />
  <source
    type="image/webp"
    srcset="/assets/image_optimized.webp 1x, /assets/image_640w.webp 640w"
    sizes="(max-width: 768px) 100vw, 800px"
  />
  <img
    src="/assets/image.jpg"
    alt="Description"
    loading="lazy"
    decoding="async"
  />
</picture>
```

## 📁 Structure des Fichiers Optimisés

### Avant optimisation :
```
public/assets/
└── mon-image.jpg                    # Image originale
```

### Après optimisation :
```
public/assets/
├── mon-image_optimized.webp         # WebP optimisé
├── mon-image_optimized.avif         # AVIF optimisé
├── mon-image_320w.webp             # Responsive 320px
├── mon-image_480w.webp             # Responsive 480px
├── mon-image_640w.webp             # Responsive 640px
├── mon-image_1024w.webp            # Responsive 1024px
├── mon-image_1440w.webp            # Responsive 1440px
├── ... (versions AVIF correspondantes)
└── unused_images/
    └── mon-image.jpg               # Original déplacé automatiquement
```

### 🗂️ **Organisation Intelligente**
- **Images optimisées** : Restent dans leur dossier d'origine
- **Images originales** : Déplacées automatiquement vers `unused_images/`
- **Gestion des doublons** : Suffixes `_1`, `_2`, etc. si nécessaire
- **Exclusion automatique** : `unused_images/` ignoré lors des analyses

## ⚙️ Configuration

### Formats et qualité (astro.config.mjs)
```javascript
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp',
    config: {
      quality: 80,
      formats: ['webp', 'avif', 'png', 'jpg', 'jpeg'],
    },
  },
  experimentalResponsiveImages: true,
}
```

### Dossiers surveillés (scripts/auto-optimize-images.js)
```javascript
watchDirectories: [
  'assets',
  'assets/myprojects',
  'assets/img',
  'assets/backgrounds',
  'assets/otty_kevin_optimized',
  'assets/icone'
]
```

## 📊 Performance

### Gains typiques :
- **WebP** : 25-35% plus petit que JPEG
- **AVIF** : 50-60% plus petit que JPEG
- **Images responsives** : Réduction de 60-80% sur mobile

### Métriques Core Web Vitals :
- ✅ **LCP** amélioré grâce aux formats modernes
- ✅ **CLS** stable avec dimensions spécifiées
- ✅ **FID** non impacté

## 🛠️ Scripts Disponibles

```bash
# Optimisation automatique (incluse dans le build)
pnpm build

# Optimisation manuelle uniquement
pnpm optimize-images

# Build sans optimisation
pnpm build:only

# Test d'optimisation
node scripts/test-optimization.js
```

## 🔧 Dépannage

### Image non optimisée ?
1. Vérifiez que l'image est dans un dossier surveillé
2. Lancez `pnpm optimize-images`
3. Vérifiez les logs pour les erreurs

### Formats non supportés ?
Extensions supportées : `.jpg`, `.jpeg`, `.png`, `.gif`

### Performance lente ?
- Les images sont optimisées une seule fois
- Les versions optimisées sont réutilisées
- Le cache Sharp améliore les builds suivants

## 📈 Bonnes Pratiques

1. **Utilisez OptimizedImage** pour la plupart des cas
2. **Spécifiez toujours alt, width, height**
3. **Utilisez loading="lazy"** sauf pour les images above-the-fold
4. **Optimisez les images source** avant de les ajouter au projet
5. **Testez sur différents appareils** pour valider les images responsives

## 🎯 Prochaines Améliorations

- [ ] Support des images WebP/AVIF en source
- [ ] Optimisation automatique des images importées via ESM
- [ ] Génération automatique de placeholders blur
- [ ] Intégration avec un CDN pour les images externes
