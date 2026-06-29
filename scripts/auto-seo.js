// Script pour automatiser les tâches SEO
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'src/pages');
const publicDir = path.join(rootDir, 'public');
const contentDir = path.join(rootDir, 'src/content');

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== AUTOMATISATION SEO ==='));
  console.log(chalk.blue('Exécution des tâches SEO automatiques'));
  console.log('');

  try {
    // 1. Mettre à jour le sitemap
    await updateSitemap();

    // 2. Optimiser les images non optimisées
    await optimizeImages();

    // 3. Vérifier et mettre à jour les références d'images
    await updateImageReferences();

    console.log('');
    console.log(chalk.green.bold('✓ Tâches SEO automatiques terminées avec succès'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'exécution des tâches SEO:'), error);
  }
}

// Mettre à jour le sitemap
async function updateSitemap() {
  console.log(chalk.yellow.bold('1. Mise à jour du sitemap'));
  
  try {
    // Exécuter le script de génération du sitemap
    await execAsync('node scripts/pre-deploy-seo.js');
    console.log(chalk.green('Sitemap mis à jour avec succès.'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la mise à jour du sitemap:'), error.message);
  }
}

// Optimiser les images
async function optimizeImages() {
  console.log(chalk.yellow.bold('\n2. Optimisation des images'));
  
  try {
    // Trouver les images non optimisées
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const imagePatterns = imageExtensions.map(ext => `**/*.${ext}`);
    
    const imageFiles = await glob(imagePatterns, { 
      cwd: publicDir,
      ignore: ['**/node_modules/**', '**/unused_images/**']
    });

    // Filtrer les images non optimisées
    const nonOptimizedImages = imageFiles.filter(file => {
      return !file.includes('_optimized') && 
             !file.includes('_640w') && 
             !file.includes('_1024w');
    });

    if (nonOptimizedImages.length > 0) {
      console.log(chalk.yellow(`${nonOptimizedImages.length} images non optimisées trouvées.`));
      
      // Exécuter le script d'optimisation des images
      await execAsync('npm run optimize-images');
      console.log(chalk.green('Images optimisées avec succès.'));
    } else {
      console.log(chalk.green('Toutes les images sont déjà optimisées.'));
    }
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'optimisation des images:'), error.message);
  }
}

// Mettre à jour les références d'images
async function updateImageReferences() {
  console.log(chalk.yellow.bold('\n3. Mise à jour des références d\'images'));
  
  try {
    // Exécuter le script de mise à jour des références d'images
    await execAsync('npm run update-image-references');
    console.log(chalk.green('Références d\'images mises à jour avec succès.'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la mise à jour des références d\'images:'), error.message);
  }
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
});
