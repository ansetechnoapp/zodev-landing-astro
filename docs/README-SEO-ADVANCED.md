# Fonctionnalités SEO avancées pour votre site portfolio

Ce document explique les fonctionnalités SEO avancées qui ont été ajoutées à votre site portfolio.

## Nouvelles fonctionnalités SEO

### 1. Génération automatique du sitemap

Le script `generate-sitemap.js` analyse automatiquement votre site pour générer un sitemap.xml complet :

- Détecte toutes les pages statiques dans `src/pages`
- Détecte toutes les pages de contenu dynamiques dans `src/content`
- Génère un sitemap.xml avec les priorités et fréquences de changement appropriées
- Prend en charge les versions multilingues (fr/en)

```bash
npm run seo:sitemap
```

### 2. Correction automatique des problèmes SEO

Le script `auto-fix-seo.js` vérifie et corrige automatiquement les problèmes SEO courants :

- Ajoute les balises meta manquantes
- Ajoute les attributs alt aux images qui n'en ont pas
- Ajoute les liens canoniques manquants
- Ajoute les données structurées Schema.org manquantes

```bash
npm run seo:fix
```

### 3. Intégration SEO Astro

L'intégration `seo-integration.js` ajoute des fonctionnalités SEO directement dans le processus de build d'Astro :

- Génère automatiquement le sitemap.xml lors du build
- Génère automatiquement le robots.txt lors du build
- Ajoute des routes virtuelles pour le sitemap et robots.txt

Cette intégration est configurée dans `astro.config.mjs`.

### 4. Composant SEO pour les pages

Le composant `SEO.astro` simplifie l'ajout de balises meta et Schema.org à chaque page :

```astro
---
import SEO from '../components/SEO.astro';
---

<head>
  <SEO
    title="Ma page"
    description="Description de ma page"
    image="/assets/ma-image.jpg"
    type="article"
    article={{
      publishedTime: "2023-01-01T00:00:00Z",
      modifiedTime: "2023-01-02T00:00:00Z",
      tags: ["tag1", "tag2"],
      authors: ["Auteur 1"]
    }}
  />
</head>
```

## Comment utiliser ces fonctionnalités

### Utilisation du composant SEO

1. Importez le composant SEO dans vos pages :

```astro
---
import SEO from '../components/SEO.astro';
---

<html>
  <head>
    <SEO
      title="Titre de la page"
      description="Description de la page"
    />
    <!-- Autres balises head -->
  </head>
  <body>
    <!-- Contenu de la page -->
  </body>
</html>
```

2. Personnalisez les propriétés SEO selon vos besoins :

```astro
<SEO
  title="Mon projet"
  description="Description détaillée de mon projet"
  image="/assets/projects/mon-projet.jpg"
  type="project"
/>
```

### Correction automatique des problèmes SEO

Exécutez la commande suivante pour corriger automatiquement les problèmes SEO :

```bash
npm run seo:fix
```

Cette commande :
- Vérifie les balises meta manquantes
- Ajoute des attributs alt aux images
- Vérifie les liens canoniques
- Ajoute les données structurées Schema.org

### Génération manuelle du sitemap

Vous pouvez générer manuellement le sitemap avec :

```bash
npm run seo:sitemap
```

Le sitemap est également généré automatiquement lors du build.

## Workflow SEO complet

Avec ces nouvelles fonctionnalités, votre workflow SEO complet ressemble à ceci :

1. **Développement** :
   - Utilisez le composant `SEO.astro` dans vos pages
   - Exécutez `npm run seo:fix` pour corriger les problèmes SEO

2. **Avant le commit** :
   - Le pre-commit hook vérifie automatiquement le SEO

3. **Avant le push** :
   - Le pre-push hook optimise automatiquement le SEO

4. **Build** :
   - L'intégration SEO génère automatiquement le sitemap et robots.txt
   - Les scripts pre-build vérifient et optimisent le SEO

5. **Déploiement** :
   - Les scripts pre-deploy effectuent des optimisations SEO finales

## Personnalisation

### Configuration de l'intégration SEO

Vous pouvez personnaliser l'intégration SEO dans `astro.config.mjs` :

```javascript
seoIntegration({
  titleTemplate: '%s | Mon Site',
  defaultTitle: 'Mon Site',
  defaultDescription: 'Description de mon site',
  defaultImage: '/assets/social-preview.jpg',
  siteUrl: 'https://monsite.com',
  twitterHandle: '@moncompte',
  language: 'fr',
})
```

### Personnalisation du composant SEO

Vous pouvez modifier le composant `SEO.astro` pour ajouter d'autres balises meta ou fonctionnalités.

### Personnalisation du sitemap

Vous pouvez modifier `generate-sitemap.js` pour personnaliser les priorités et fréquences de changement des pages.
