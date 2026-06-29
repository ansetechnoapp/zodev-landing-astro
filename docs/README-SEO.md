# Outils SEO pour votre site portfolio

Ce document explique comment utiliser les outils SEO créés pour votre site portfolio.

## Installation des dépendances

Avant d'utiliser les scripts, installez les dépendances nécessaires :

```bash
npm install glob chalk fast-xml-parser linkedom
```

## Scripts disponibles

Les scripts suivants ont été ajoutés à votre projet :

### 1. Outil SEO principal

```bash
npm run seo
```

Ce script lance un menu interactif qui vous permet d'accéder à tous les outils SEO.

### 2. Analyse SEO

```bash
npm run seo:analyze
```

Ce script analyse votre site pour les problèmes SEO courants :
- Vérification des balises meta
- Vérification de la structure des headings
- Vérification des images (attributs alt, lazy loading)
- Vérification du sitemap
- Vérification des données structurées Schema.org
- Suggestions d'améliorations SEO

### 3. Générateur de balises meta

```bash
npm run seo:meta
```

Ce script vous aide à générer des balises meta pour vos nouvelles pages :
- Titre
- Description
- Image
- Type de page (article, projet, personne)
- Balises Open Graph et Twitter Card
- Données structurées Schema.org

### 4. Analyse des performances

```bash
npm run seo:performance
```

Ce script analyse les performances de votre site :
- Taille des images
- Taille des scripts et styles
- Utilisation des polices
- Suggestions d'améliorations de performance

## Structure des fichiers

```
scripts/
  ├── seo-tools.js         # Menu principal des outils SEO
  ├── seo-manager.js       # Analyse SEO complète
  ├── generate-meta-tags.js # Générateur de balises meta
  └── analyze-performance.js # Analyse des performances
```

## Fonctionnalités SEO déjà en place

Votre site dispose déjà de plusieurs fonctionnalités SEO :

1. **Balises meta** dans le composant `MainHead.astro`
2. **Données structurées Schema.org** dans le composant `SchemaOrg.astro`
3. **Sitemap XML** dans `public/sitemap.xml`
4. **Fichier robots.txt** dans `public/robots.txt`
5. **Optimisation des images** avec les scripts existants

## Bonnes pratiques SEO

1. **Titres et descriptions** : Chaque page doit avoir un titre unique (10-60 caractères) et une description attrayante (50-160 caractères).

2. **Structure des headings** : Utilisez une structure logique (H1 > H2 > H3) avec un seul H1 par page.

3. **Images** : Toutes les images doivent avoir des attributs alt descriptifs et être optimisées (WebP/AVIF).

4. **Données structurées** : Utilisez Schema.org pour aider les moteurs de recherche à comprendre votre contenu.

5. **Performance** : Optimisez les temps de chargement en minimisant les fichiers JS/CSS et en optimisant les images.

6. **Mobile-friendly** : Assurez-vous que votre site est responsive et fonctionne bien sur tous les appareils.

7. **URLs conviviales** : Utilisez des URLs descriptives et lisibles.

8. **Contenu de qualité** : Créez du contenu original, utile et bien structuré.

9. **Liens internes** : Liez vos pages entre elles de manière logique.

10. **Mise à jour régulière** : Maintenez votre contenu à jour et ajoutez régulièrement du nouveau contenu.

## Ressources utiles

- [Google Search Console](https://search.google.com/search-console)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org](https://schema.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
