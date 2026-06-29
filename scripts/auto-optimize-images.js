#!/usr/bin/env node
/**
 * Script d'optimisation automatique des images
 * S'exécute automatiquement lors du build pour optimiser les nouvelles images
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Configuration
const config = {
  // Formats de sortie avec qualité
  outputFormats: [
    { format: 'webp', quality: 80 },
    { format: 'avif', quality: 65 }
  ],
  
  // Tailles responsives
  responsiveSizes: [320, 480, 640, 1024, 1440],
  
  // Extensions supportées
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  
  // Dossiers à surveiller
  watchDirectories: [
    'assets', // Dossier racine pour capturer toutes les nouvelles images
    'assets/myprojects',
    'assets/img',
    'assets/backgrounds',
    'assets/otty_kevin_optimized',
    'assets/icone'
  ]
};

/**
 * Vérifie si une image a déjà été optimisée
 */
async function isImageOptimized(imagePath) {
  const fileInfo = path.parse(imagePath);

  // Si l'image est déjà dans unused_images, elle a été optimisée
  if (imagePath.includes('unused_images')) {
    return true;
  }

  // Vérifier si les versions optimisées existent
  const webpPath = path.join(fileInfo.dir, `${fileInfo.name}_optimized.webp`);
  const avifPath = path.join(fileInfo.dir, `${fileInfo.name}_optimized.avif`);

  try {
    await fs.access(webpPath);
    await fs.access(avifPath);

    // Si les versions optimisées existent, vérifier si l'original doit être déplacé
    const unusedDir = path.join(publicDir, 'assets', 'unused_images');
    const originalInUnused = path.join(unusedDir, path.basename(imagePath));

    try {
      await fs.access(originalInUnused);
      // L'original est déjà dans unused_images
      return true;
    } catch {
      // L'original existe encore, le déplacer
      console.log(`   📦 Déplacement de l'original déjà optimisé: ${path.relative(publicDir, imagePath)}`);
      await moveToUnusedImages(imagePath);
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Crée le dossier unused_images s'il n'existe pas
 */
async function ensureUnusedImagesDir() {
  const unusedDir = path.join(publicDir, 'assets', 'unused_images');
  try {
    await fs.access(unusedDir);
  } catch {
    await fs.mkdir(unusedDir, { recursive: true });
    console.log(`📁 Dossier unused_images créé: ${path.relative(publicDir, unusedDir)}`);
  }
  return unusedDir;
}

/**
 * Déplace l'image originale vers unused_images
 */
async function moveToUnusedImages(imagePath) {
  try {
    const unusedDir = await ensureUnusedImagesDir();
    const fileName = path.basename(imagePath);
    const destinationPath = path.join(unusedDir, fileName);

    // Vérifier si le fichier existe déjà dans unused_images
    let finalDestination = destinationPath;
    let counter = 1;

    while (true) {
      try {
        await fs.access(finalDestination);
        // Le fichier existe, ajouter un suffixe
        const fileInfo = path.parse(destinationPath);
        finalDestination = path.join(unusedDir, `${fileInfo.name}_${counter}${fileInfo.ext}`);
        counter++;
      } catch {
        // Le fichier n'existe pas, on peut l'utiliser
        break;
      }
    }

    await fs.rename(imagePath, finalDestination);
    console.log(`   📦 Original déplacé vers: ${path.relative(publicDir, finalDestination)}`);

  } catch (error) {
    console.error(`⚠️  Erreur lors du déplacement de ${imagePath}:`, error.message);
  }
}

/**
 * Optimise une image individuelle
 */
async function optimizeImage(imagePath) {
  const fileInfo = path.parse(imagePath);

  if (!config.supportedExtensions.includes(fileInfo.ext.toLowerCase())) {
    return;
  }

  // Skip si déjà optimisé
  if (fileInfo.name.includes('_optimized') || fileInfo.name.includes('_320w') ||
      fileInfo.name.includes('_480w') || fileInfo.name.includes('_640w') ||
      fileInfo.name.includes('_1024w') || fileInfo.name.includes('_1440w')) {
    return;
  }

  console.log(`🖼️  Optimisation de: ${path.relative(publicDir, imagePath)}`);

  try {
    const imageBuffer = await fs.readFile(imagePath);
    const metadata = await sharp(imageBuffer).metadata();

    // Créer les versions optimisées dans les formats modernes
    for (const { format, quality } of config.outputFormats) {
      const outputPath = path.join(fileInfo.dir, `${fileInfo.name}_optimized.${format}`);

      await sharp(imageBuffer)
        .toFormat(format, { quality })
        .toFile(outputPath);

      console.log(`   ✅ Créé: ${path.relative(publicDir, outputPath)}`);
    }

    // Créer les versions responsives
    const applicableSizes = config.responsiveSizes.filter(size => size < metadata.width);

    for (const size of applicableSizes) {
      for (const { format, quality } of config.outputFormats) {
        const outputPath = path.join(fileInfo.dir, `${fileInfo.name}_${size}w.${format}`);

        await sharp(imageBuffer)
          .resize(size)
          .toFormat(format, { quality })
          .toFile(outputPath);

        console.log(`   📱 Créé: ${path.relative(publicDir, outputPath)}`);
      }
    }

    // Déplacer l'image originale vers unused_images après optimisation réussie
    await moveToUnusedImages(imagePath);

  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${imagePath}:`, error.message);
  }
}

/**
 * Trouve toutes les images dans un dossier
 */
async function findImagesInDirectory(dirPath) {
  const images = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Exclure le dossier unused_images de l'analyse
      if (entry.isDirectory() && entry.name === 'unused_images') {
        continue;
      }

      if (entry.isDirectory()) {
        // Récursion dans les sous-dossiers
        const subImages = await findImagesInDirectory(fullPath);
        images.push(...subImages);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (config.supportedExtensions.includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Dossier non accessible, on ignore
  }

  return images;
}

/**
 * Trouve toutes les images non optimisées
 */
async function findUnoptimizedImages() {
  const unoptimizedImages = [];

  for (const dir of config.watchDirectories) {
    const fullDirPath = path.join(publicDir, dir);

    try {
      await fs.access(fullDirPath);
      console.log(`🔍 Analyse du dossier: ${dir}`);

      // Chercher toutes les images dans ce dossier
      const images = dir === 'assets'
        ? await findImagesInDirectory(fullDirPath).then(imgs =>
            imgs.filter(img => path.dirname(img) === fullDirPath) // Seulement le niveau racine pour assets
          )
        : await findImagesInDirectory(fullDirPath);

      console.log(`   📁 ${images.length} image(s) trouvée(s) dans ${dir}`);

      for (const imagePath of images) {
        const fileInfo = path.parse(imagePath);

        // Skip si déjà optimisé (nom contient des suffixes d'optimisation)
        if (fileInfo.name.includes('_optimized') ||
            fileInfo.name.includes('_320w') ||
            fileInfo.name.includes('_480w') ||
            fileInfo.name.includes('_640w') ||
            fileInfo.name.includes('_1024w') ||
            fileInfo.name.includes('_1440w')) {
          continue;
        }

        const isOptimized = await isImageOptimized(imagePath);
        console.log(`   🖼️  ${path.relative(publicDir, imagePath)} - ${isOptimized ? 'Optimisée' : 'À optimiser'}`);

        if (!isOptimized) {
          unoptimizedImages.push(imagePath);
        }
      }

    } catch (error) {
      console.log(`⚠️  Dossier non trouvé: ${dir}`);
    }
  }

  return unoptimizedImages;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de l\'optimisation automatique des images...\n');

  const startTime = Date.now();

  try {
    console.log('📂 Dossier public:', publicDir);
    console.log('🔍 Dossiers surveillés:', config.watchDirectories);
    console.log('');

    const unoptimizedImages = await findUnoptimizedImages();

    if (unoptimizedImages.length === 0) {
      console.log('✨ Toutes les images sont déjà optimisées !');
      return;
    }

    console.log(`📊 ${unoptimizedImages.length} image(s) à optimiser\n`);

    // Optimiser chaque image
    for (const imagePath of unoptimizedImages) {
      await optimizeImage(imagePath);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n✅ Optimisation terminée en ${duration.toFixed(2)} secondes`);
    console.log(`📈 ${unoptimizedImages.length} image(s) optimisée(s)`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main().catch(error => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
  }
}

export { main as autoOptimizeImages };
