// Script pour exécuter différents outils SEO
import { spawn } from 'child_process';
import readline from 'readline';
import chalk from 'chalk';

// Créer une interface readline pour l'interaction avec l'utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour poser une question et obtenir une réponse
function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// Fonction pour exécuter une commande
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue(`Exécution de: ${command} ${args.join(' ')}`));

    const process = spawn(command, args, { stdio: 'inherit' });

    process.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`La commande a échoué avec le code: ${code}`));
      }
    });

    process.on('error', err => {
      reject(err);
    });
  });
}

// Menu principal
async function showMenu() {
  console.log(chalk.blue.bold('\n=== OUTILS SEO ==='));
  console.log('1. Analyser le SEO du site');
  console.log('2. Générer des balises meta');
  console.log('3. Analyser les performances');
  console.log('4. Générer/mettre à jour le sitemap');
  console.log('5. Optimiser les images');
  console.log('6. Corriger automatiquement les problèmes SEO');
  console.log('7. Exécuter toutes les optimisations SEO');
  console.log('8. Quitter');

  const choice = await question('\nChoisissez une option (1-8): ');

  switch (choice) {
    case '1':
      await runSEOAnalysis();
      break;
    case '2':
      await generateMetaTags();
      break;
    case '3':
      await analyzePerformance();
      break;
    case '4':
      await generateSitemap();
      break;
    case '5':
      await optimizeImages();
      break;
    case '6':
      await fixSEOIssues();
      break;
    case '7':
      await runAllSEOOptimizations();
      break;
    case '8':
      console.log(chalk.green('Au revoir!'));
      rl.close();
      return;
    default:
      console.log(chalk.red('Option invalide. Veuillez réessayer.'));
  }

  // Retourner au menu principal
  await showMenu();
}

// Analyser le SEO du site
async function runSEOAnalysis() {
  try {
    await runCommand('node', ['scripts/seo-manager.js']);
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'analyse SEO:'), error.message);
  }
}

// Générer des balises meta
async function generateMetaTags() {
  try {
    await runCommand('node', ['scripts/generate-meta-tags.js']);
  } catch (error) {
    console.error(chalk.red('Erreur lors de la génération des balises meta:'), error.message);
  }
}

// Analyser les performances
async function analyzePerformance() {
  try {
    await runCommand('node', ['scripts/analyze-performance.js']);
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'analyse des performances:'), error.message);
  }
}

// Générer/mettre à jour le sitemap
async function generateSitemap() {
  console.log(chalk.yellow('Génération du sitemap...'));

  try {
    // Utiliser le nouveau script de génération du sitemap
    await runCommand('node', ['scripts/generate-sitemap.js']);
    console.log(chalk.green('Sitemap généré avec succès!'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la génération du sitemap:'), error.message);
  }
}

// Corriger automatiquement les problèmes SEO
async function fixSEOIssues() {
  console.log(chalk.yellow('Correction automatique des problèmes SEO...'));

  try {
    await runCommand('node', ['scripts/auto-fix-seo.js']);
    console.log(chalk.green('Problèmes SEO corrigés avec succès!'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la correction des problèmes SEO:'), error.message);
  }
}

// Exécuter toutes les optimisations SEO
async function runAllSEOOptimizations() {
  console.log(chalk.yellow('Exécution de toutes les optimisations SEO...'));

  try {
    console.log(chalk.blue('1. Analyse SEO...'));
    await runCommand('node', ['scripts/seo-manager.js']);

    console.log(chalk.blue('\n2. Correction des problèmes SEO...'));
    await runCommand('node', ['scripts/auto-fix-seo.js']);

    console.log(chalk.blue('\n3. Optimisation des images...'));
    await runCommand('npm', ['run', 'optimize-images']);

    console.log(chalk.blue('\n4. Mise à jour des références d\'images...'));
    await runCommand('npm', ['run', 'update-image-references']);

    console.log(chalk.blue('\n5. Génération du sitemap...'));
    await runCommand('node', ['scripts/generate-sitemap.js']);

    console.log(chalk.green('\nToutes les optimisations SEO ont été exécutées avec succès!'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'exécution des optimisations SEO:'), error.message);
  }
}

// Optimiser les images
async function optimizeImages() {
  console.log(chalk.yellow('Optimisation des images...'));

  try {
    await runCommand('npm', ['run', 'optimize-images']);
    console.log(chalk.green('Images optimisées avec succès!'));

    const updateRefs = await question('Voulez-vous mettre à jour les références d\'images dans le code? (o/n): ');

    if (updateRefs.toLowerCase() === 'o') {
      await runCommand('npm', ['run', 'update-image-references']);
      console.log(chalk.green('Références d\'images mises à jour avec succès!'));
    }
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'optimisation des images:'), error.message);
  }
}

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== OUTILS SEO POUR VOTRE SITE PORTFOLIO ==='));
  console.log(chalk.blue('Ce script vous permet d\'exécuter différents outils SEO'));

  await showMenu();
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur:'), error);
  rl.close();
  process.exit(1);
});
