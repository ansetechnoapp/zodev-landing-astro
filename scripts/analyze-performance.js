// Script pour analyser les performances du site
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { glob } from 'glob';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== ANALYSE DES PERFORMANCES ==='));
  console.log(chalk.blue('Cet outil analyse les performances de votre site'));
  console.log('');

  try {
    // 1. Analyser la taille des images
    await analyzeImageSizes();

    // 2. Analyser les scripts et styles
    await analyzeScriptsAndStyles();

    // 3. Analyser les polices
    await analyzeFonts();

    // 4. Suggérer des améliorations
    suggestPerformanceImprovements();

  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'analyse des performances:'), error);
  }
}

// Analyser la taille des images
async function analyzeImageSizes() {
  console.log(chalk.yellow.bold('1. Analyse des images'));

  // Trouver toutes les images
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];
  const imagePatterns = imageExtensions.map(ext => `**/*.${ext}`);
  
  const imageFiles = await glob(imagePatterns, { 
    cwd: publicDir,
    ignore: ['**/node_modules/**', '**/unused_images/**']
  });

  console.log(`Nombre d'images trouvées: ${imageFiles.length}`);

  // Analyser la taille des images
  let totalSize = 0;
  let largeImages = [];

  for (const file of imageFiles) {
    const filePath = path.join(publicDir, file);
    const stats = await fs.stat(filePath);
    const sizeInKB = stats.size / 1024;
    totalSize += sizeInKB;

    // Identifier les images de grande taille (> 200KB)
    if (sizeInKB > 200) {
      largeImages.push({
        file,
        size: sizeInKB.toFixed(2)
      });
    }
  }

  // Afficher les résultats
  console.log(`Taille totale des images: ${(totalSize / 1024).toFixed(2)} MB`);
  
  if (largeImages.length > 0) {
    console.log(chalk.yellow(`\n${largeImages.length} images de grande taille (> 200KB):`));
    largeImages.sort((a, b) => b.size - a.size).slice(0, 10).forEach(img => {
      console.log(`- ${img.file}: ${img.size} KB`);
    });
  } else {
    console.log(chalk.green('Aucune image de grande taille trouvée.'));
  }

  // Vérifier si les images sont optimisées
  const nonOptimizedImages = imageFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && 
           !file.includes('_optimized') && 
           !file.includes('_640w') && 
           !file.includes('_1024w');
  });

  if (nonOptimizedImages.length > 0) {
    console.log(chalk.yellow(`\n${nonOptimizedImages.length} images non optimisées trouvées:`));
    nonOptimizedImages.slice(0, 10).forEach(img => {
      console.log(`- ${img}`);
    });
    console.log(chalk.blue('Suggestion: Exécutez "npm run optimize-images" pour optimiser ces images.'));
  } else {
    console.log(chalk.green('Toutes les images semblent être optimisées.'));
  }
}

// Analyser les scripts et styles
async function analyzeScriptsAndStyles() {
  console.log(chalk.yellow.bold('\n2. Analyse des scripts et styles'));

  // Trouver tous les fichiers JS et CSS
  const jsFiles = await glob('**/*.js', { 
    cwd: publicDir,
    ignore: ['**/node_modules/**']
  });

  const cssFiles = await glob('**/*.css', { 
    cwd: publicDir,
    ignore: ['**/node_modules/**']
  });

  console.log(`Nombre de fichiers JS: ${jsFiles.length}`);
  console.log(`Nombre de fichiers CSS: ${cssFiles.length}`);

  // Analyser la taille des fichiers
  let totalJsSize = 0;
  let totalCssSize = 0;
  let largeJsFiles = [];
  let largeCssFiles = [];

  for (const file of jsFiles) {
    const filePath = path.join(publicDir, file);
    const stats = await fs.stat(filePath);
    const sizeInKB = stats.size / 1024;
    totalJsSize += sizeInKB;

    // Identifier les fichiers JS de grande taille (> 100KB)
    if (sizeInKB > 100) {
      largeJsFiles.push({
        file,
        size: sizeInKB.toFixed(2)
      });
    }
  }

  for (const file of cssFiles) {
    const filePath = path.join(publicDir, file);
    const stats = await fs.stat(filePath);
    const sizeInKB = stats.size / 1024;
    totalCssSize += sizeInKB;

    // Identifier les fichiers CSS de grande taille (> 50KB)
    if (sizeInKB > 50) {
      largeCssFiles.push({
        file,
        size: sizeInKB.toFixed(2)
      });
    }
  }

  // Afficher les résultats
  console.log(`Taille totale des fichiers JS: ${(totalJsSize / 1024).toFixed(2)} MB`);
  console.log(`Taille totale des fichiers CSS: ${(totalCssSize / 1024).toFixed(2)} MB`);

  if (largeJsFiles.length > 0) {
    console.log(chalk.yellow(`\n${largeJsFiles.length} fichiers JS de grande taille (> 100KB):`));
    largeJsFiles.sort((a, b) => b.size - a.size).forEach(file => {
      console.log(`- ${file.file}: ${file.size} KB`);
    });
  }

  if (largeCssFiles.length > 0) {
    console.log(chalk.yellow(`\n${largeCssFiles.length} fichiers CSS de grande taille (> 50KB):`));
    largeCssFiles.sort((a, b) => b.size - a.size).forEach(file => {
      console.log(`- ${file.file}: ${file.size} KB`);
    });
  }
}

// Analyser les polices
async function analyzeFonts() {
  console.log(chalk.yellow.bold('\n3. Analyse des polices'));

  // Vérifier les polices chargées dans les fichiers Astro
  const astroFiles = await glob('**/*.astro', { 
    cwd: srcDir,
    ignore: ['**/node_modules/**']
  });

  let fontImports = new Set();
  let googleFontsCount = 0;

  for (const file of astroFiles) {
    const filePath = path.join(srcDir, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Rechercher les imports de polices Google
    const googleFontsMatches = content.match(/fonts\.googleapis\.com\/css2\?[^"']*/g) || [];
    googleFontsMatches.forEach(match => {
      fontImports.add(match);
      googleFontsCount++;
    });
  }

  console.log(`Nombre de polices Google Fonts importées: ${fontImports.size}`);

  if (fontImports.size > 0) {
    console.log(chalk.yellow('\nPolices Google Fonts importées:'));
    [...fontImports].forEach(font => {
      console.log(`- ${font}`);
    });

    if (fontImports.size > 2) {
      console.log(chalk.yellow('\nAttention: Vous importez plusieurs polices Google Fonts, ce qui peut affecter les performances.'));
      console.log(chalk.blue('Suggestion: Envisagez de réduire le nombre de polices ou d\'utiliser des polices locales.'));
    }
  }

  // Vérifier les polices locales
  const fontFiles = await glob('**/*.{woff,woff2,ttf,otf}', { 
    cwd: publicDir,
    ignore: ['**/node_modules/**']
  });

  console.log(`\nNombre de fichiers de polices locales: ${fontFiles.length}`);

  if (fontFiles.length > 0) {
    let totalFontSize = 0;

    for (const file of fontFiles) {
      const filePath = path.join(publicDir, file);
      const stats = await fs.stat(filePath);
      totalFontSize += stats.size / 1024;
    }

    console.log(`Taille totale des polices locales: ${(totalFontSize / 1024).toFixed(2)} MB`);
  }
}

// Suggérer des améliorations de performance
function suggestPerformanceImprovements() {
  console.log(chalk.yellow.bold('\n4. Suggestions d\'améliorations de performance'));

  const suggestions = [
    "1. Optimisez toutes les images avec WebP et AVIF",
    "2. Utilisez le chargement paresseux (lazy loading) pour les images",
    "3. Minimisez et compressez les fichiers JS et CSS",
    "4. Réduisez le nombre de polices utilisées",
    "5. Utilisez des polices locales au lieu de Google Fonts",
    "6. Activez la mise en cache du navigateur pour les ressources statiques",
    "7. Utilisez un CDN pour les ressources statiques",
    "8. Réduisez le nombre de requêtes HTTP",
    "9. Utilisez la préconnexion pour les ressources tierces",
    "10. Implémentez le chargement différé (defer) pour les scripts non critiques"
  ];

  suggestions.forEach(suggestion => {
    console.log(chalk.blue(`• ${suggestion}`));
  });

  console.log(chalk.yellow.bold('\nOutils recommandés pour l\'analyse des performances:'));
  console.log(chalk.blue("• Google PageSpeed Insights: https://pagespeed.web.dev/"));
  console.log(chalk.blue("• Chrome DevTools > Lighthouse"));
  console.log(chalk.blue("• WebPageTest: https://www.webpagetest.org/"));
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
  process.exit(1);
});
