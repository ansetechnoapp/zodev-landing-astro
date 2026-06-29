#!/usr/bin/env node
/**
 * Script pour nettoyer et organiser les images existantes
 * Déplace les images originales déjà optimisées vers unused_images
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Configuration
const config = {
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  watchDirectories: [
    'assets',
    'assets/myprojects',
    'assets/img',
    'assets/backgrounds',
    'assets/otty_kevin_optimized',
    'assets/icone'
  ]
};

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
 * Déplace une image vers unused_images
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
    console.log(`   📦 Déplacé: ${path.relative(publicDir, imagePath)} → ${path.relative(publicDir, finalDestination)}`);
    return true;
    
  } catch (error) {
    console.error(`⚠️  Erreur lors du déplacement de ${imagePath}:`, error.message);
    return false;
  }
}

/**
 * Vérifie si une image a des versions optimisées
 */
async function hasOptimizedVersions(imagePath) {
  const fileInfo = path.parse(imagePath);
  
  // Vérifier si les versions optimisées existent
  const webpPath = path.join(fileInfo.dir, `${fileInfo.name}_optimized.webp`);
  const avifPath = path.join(fileInfo.dir, `${fileInfo.name}_optimized.avif`);
  
  try {
    await fs.access(webpPath);
    await fs.access(avifPath);
    return true;
  } catch {
    return false;
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
      
      // Exclure le dossier unused_images
      if (entry.isDirectory() && entry.name === 'unused_images') {
        continue;
      }
      
      if (entry.isDirectory()) {
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
 * Fonction principale
 */
async function main() {
  console.log('🧹 Nettoyage et organisation des images existantes...\n');
  
  const startTime = Date.now();
  let movedCount = 0;
  let totalImages = 0;
  
  try {
    for (const dir of config.watchDirectories) {
      const fullDirPath = path.join(publicDir, dir);
      
      try {
        await fs.access(fullDirPath);
        console.log(`🔍 Analyse du dossier: ${dir}`);
        
        // Chercher toutes les images dans ce dossier
        const images = dir === 'assets' 
          ? await findImagesInDirectory(fullDirPath).then(imgs => 
              imgs.filter(img => path.dirname(img) === fullDirPath)
            )
          : await findImagesInDirectory(fullDirPath);
        
        console.log(`   📁 ${images.length} image(s) trouvée(s)`);
        totalImages += images.length;
        
        for (const imagePath of images) {
          const fileInfo = path.parse(imagePath);
          
          // Skip si c'est déjà une version optimisée
          if (fileInfo.name.includes('_optimized') || 
              fileInfo.name.includes('_320w') || 
              fileInfo.name.includes('_480w') || 
              fileInfo.name.includes('_640w') || 
              fileInfo.name.includes('_1024w') || 
              fileInfo.name.includes('_1440w')) {
            continue;
          }
          
          // Vérifier si cette image a des versions optimisées
          const hasOptimized = await hasOptimizedVersions(imagePath);
          
          if (hasOptimized) {
            console.log(`   🖼️  ${path.relative(publicDir, imagePath)} - Déjà optimisée, déplacement...`);
            const moved = await moveToUnusedImages(imagePath);
            if (moved) movedCount++;
          } else {
            console.log(`   🖼️  ${path.relative(publicDir, imagePath)} - Pas encore optimisée`);
          }
        }
        
      } catch (error) {
        console.log(`⚠️  Dossier non trouvé: ${dir}`);
      }
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n✅ Nettoyage terminé en ${duration.toFixed(2)} secondes`);
    console.log(`📊 Statistiques:`);
    console.log(`   - Images analysées: ${totalImages}`);
    console.log(`   - Images déplacées: ${movedCount}`);
    console.log(`   - Images à optimiser: ${totalImages - movedCount}`);
    
    if (movedCount > 0) {
      console.log(`\n💡 Conseil: Lancez 'pnpm optimize-images' pour optimiser les images restantes`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
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

export { main as cleanupExistingImages };
