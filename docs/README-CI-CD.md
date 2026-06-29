# CI/CD et Git Hooks pour l'automatisation SEO

Ce document explique comment utiliser les Git Hooks et GitHub Actions pour automatiser les vérifications et optimisations SEO de votre site portfolio.

## Git Hooks

Les Git Hooks sont des scripts qui s'exécutent automatiquement à certaines étapes du workflow Git. Nous avons configuré deux hooks :

### 1. Pre-commit Hook

Ce hook s'exécute avant chaque commit et vérifie les problèmes SEO de base :

- Exécute `npm run seo:analyze`
- Empêche le commit si des problèmes SEO critiques sont détectés

### 2. Pre-push Hook

Ce hook s'exécute avant chaque push et effectue des optimisations SEO complètes :

- Exécute `npm run seo:auto`
- Optimise les images
- Met à jour le sitemap
- Met à jour les références d'images
- Empêche le push si les optimisations échouent

### Installation des Git Hooks

Les Git Hooks sont installés automatiquement lors de l'installation des dépendances grâce au script `postinstall` :

```bash
npm install
```

Vous pouvez également les installer manuellement :

```bash
npm run setup-git-hooks
```

## GitHub Actions

Les GitHub Actions automatisent les vérifications et déploiements au niveau du dépôt GitHub. Nous avons configuré deux workflows :

### 1. SEO Checks

Ce workflow s'exécute à chaque push et pull request :

- Exécute `npm run seo:analyze`
- Vérifie le sitemap
- Construit le site
- Archive les rapports SEO

### 2. Deploy with SEO Optimization

Ce workflow s'exécute à chaque push sur la branche principale :

- Exécute `npm run seo:auto` pour les optimisations SEO
- Construit le site
- Déploie le site (exemple avec GitHub Pages)

### Configuration des GitHub Actions

Les workflows GitHub Actions sont déjà configurés dans le dossier `.github/workflows/`. Aucune action supplémentaire n'est nécessaire.

## Workflow complet

Avec ces outils en place, votre workflow de développement avec automatisation SEO ressemble à ceci :

1. **Développement local** :
   - Créez/modifiez des fichiers
   - Utilisez `npm run seo:meta` pour générer des balises meta
   - Utilisez `npm run seo:analyze` pour vérifier manuellement le SEO

2. **Commit** :
   - Le pre-commit hook vérifie automatiquement les problèmes SEO
   - Les problèmes critiques bloquent le commit

3. **Push** :
   - Le pre-push hook optimise automatiquement le SEO
   - Les optimisations échouées bloquent le push

4. **CI/CD** :
   - GitHub Actions vérifie le SEO à chaque push/pull request
   - GitHub Actions optimise le SEO et déploie le site

## Personnalisation

### Git Hooks

Vous pouvez personnaliser les Git Hooks en modifiant les fichiers dans `.git/hooks/` :

- `pre-commit` : Pour changer les vérifications avant commit
- `pre-push` : Pour changer les optimisations avant push

### GitHub Actions

Vous pouvez personnaliser les workflows GitHub Actions en modifiant les fichiers dans `.github/workflows/` :

- `seo-checks.yml` : Pour changer les vérifications CI
- `deploy.yml` : Pour changer le processus de déploiement

## Dépannage

### Git Hooks ne s'exécutent pas

Si les Git Hooks ne s'exécutent pas :

1. Vérifiez qu'ils sont exécutables :
   ```bash
   chmod +x .git/hooks/pre-commit .git/hooks/pre-push
   ```

2. Réinstallez-les :
   ```bash
   npm run setup-git-hooks
   ```

### GitHub Actions échoue

Si les GitHub Actions échouent :

1. Vérifiez les logs dans l'onglet "Actions" de votre dépôt GitHub
2. Assurez-vous que toutes les dépendances sont correctement installées
3. Vérifiez que les scripts SEO fonctionnent localement
