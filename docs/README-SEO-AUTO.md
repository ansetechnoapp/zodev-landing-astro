# Gestion automatique du SEO pour votre site portfolio

Ce document explique comment utiliser les outils SEO automatisés pour votre site portfolio.

## Installation des dépendances

Avant d'utiliser les scripts, installez les dépendances nécessaires :

```bash
npm install glob chalk fast-xml-parser linkedom
```

## Automatisation SEO

Les scripts SEO ont été configurés pour s'exécuter automatiquement à différentes étapes du processus de développement et de déploiement :

### 1. Avant le build (automatique)

Le script `seo:pre-deploy` s'exécute automatiquement avant chaque build grâce au hook `prebuild` dans package.json :

```bash
npm run build  # Exécute automatiquement npm run seo:pre-deploy avant le build
```

Ce script effectue les actions suivantes :
- Génère/met à jour le sitemap.xml
- Vérifie les images non optimisées
- Vérifie les balises meta essentielles

### 2. Avant le déploiement (automatique)

Le script `seo:auto` s'exécute automatiquement avant chaque déploiement grâce au hook `predeploy` dans package.json :

```bash
npm run deploy  # Exécute automatiquement npm run seo:auto avant le déploiement
```

Ce script effectue les actions suivantes :
- Met à jour le sitemap
- Optimise les images non optimisées
- Met à jour les références d'images dans le code

### 3. Outils SEO manuels

Vous pouvez également exécuter les outils SEO manuellement :

```bash
npm run seo           # Menu interactif des outils SEO
npm run seo:analyze   # Analyse complète du SEO
npm run seo:meta      # Générateur de balises meta
npm run seo:performance # Analyse des performances
```

## Workflow de développement avec SEO automatisé

1. **Développement** : Utilisez `npm run dev` pour le développement normal.

2. **Création de nouvelles pages** : Utilisez `npm run seo:meta` pour générer des balises meta pour les nouvelles pages.

3. **Avant le commit** : Exécutez `npm run seo:analyze` pour vérifier les problèmes SEO.

4. **Build** : Utilisez `npm run build` (le script `prebuild` exécutera automatiquement les vérifications SEO).

5. **Déploiement** : Utilisez `npm run deploy` (le script `predeploy` exécutera automatiquement les optimisations SEO).

## Structure des fichiers SEO

```
scripts/
  ├── seo-tools.js         # Menu principal des outils SEO
  ├── seo-manager.js       # Analyse SEO complète
  ├── generate-meta-tags.js # Générateur de balises meta
  ├── analyze-performance.js # Analyse des performances
  ├── pre-deploy-seo.js    # Vérifications SEO avant le build
  └── auto-seo.js          # Automatisation des tâches SEO
```

## Fonctionnalités SEO automatisées

1. **Génération du sitemap** : Le sitemap.xml est généré automatiquement avant chaque build et déploiement.

2. **Optimisation des images** : Les images sont automatiquement optimisées avant le déploiement.

3. **Mise à jour des références d'images** : Les références d'images dans le code sont mises à jour pour utiliser les versions optimisées.

4. **Vérification des balises meta** : Les balises meta essentielles sont vérifiées avant chaque build.

## Personnalisation

Vous pouvez personnaliser les scripts SEO en modifiant les fichiers dans le dossier `scripts/`. Par exemple :

- Modifiez `pre-deploy-seo.js` pour ajouter d'autres vérifications avant le build.
- Modifiez `auto-seo.js` pour ajouter d'autres tâches d'automatisation.
- Ajoutez de nouveaux scripts pour d'autres aspects du SEO.

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
