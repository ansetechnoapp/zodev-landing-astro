// Script pour identifier et nettoyer les images non utilisées
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Dossiers à analyser pour les références d'images
const dirsToAnalyze = [
  'src',
];

// Dossiers d'images à vérifier
const imageDirs = [
  'public/assets/zoddev_logo',
  'public/assets/backgrounds',
  'public/assets/icone',
  'public/assets/icone_optimized',
  'public/assets/img',
  'public/assets/myprojects',
  'public/assets/otty_kevin_optimized',
];

// Extensions de fichiers à analyser
const fileExtensions = [
  '.astro',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.json',
  '.md',
  '.mdx',
];

// Extensions d'images à vérifier
const imageExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
];

// Fonction pour lister tous les fichiers dans un répertoire de manière récursive
async function listFiles(dir, extensions = null) {
  const files = [];

  async function traverse(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        await traverse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!extensions || extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  await traverse(dir);
  return files;
}

// Fonction pour trouver toutes les références d'images dans un fichier
async function findImageReferences(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const references = new Set();

    // Recherche de chemins d'images dans le contenu du fichier
    // Différents patterns pour différents types de références

    // Pattern 1: "/assets/..."
    const assetPattern = /["'`]\/assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]/g;
    let match;
    while ((match = assetPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 2: "assets/..."
    const relativeAssetPattern = /["'`]assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]/g;
    while ((match = relativeAssetPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 3: url(/assets/...)
    const cssUrlPattern = /url\(["'`]?\/assets\/([^"'`\)]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]?\)/g;
    while ((match = cssUrlPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 4: url(assets/...)
    const cssRelativeUrlPattern = /url\(["'`]?assets\/([^"'`\)]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]?\)/g;
    while ((match = cssRelativeUrlPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 5: src="/assets/..."
    const srcPattern = /src=["'`]\/assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]/g;
    while ((match = srcPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 6: srcset="/assets/..."
    const srcsetPattern = /srcset=["'`]\/assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))/g;
    while ((match = srcsetPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 7: img: "/assets/..."
    const imgPattern = /img:\s*["'`]\/assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]/g;
    while ((match = imgPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 8: heroImage: "/assets/..."
    const heroImagePattern = /heroImage:\s*["'`]\/assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]/g;
    while ((match = heroImagePattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    // Pattern 9: url: "/assets/..."
    const urlPattern = /url:\s*["'`]\/assets\/([^"'`]+\.(jpg|jpeg|png|gif|webp|avif|svg))["'`]/g;
    while ((match = urlPattern.exec(content)) !== null) {
      references.add(`/assets/${match[1]}`);
    }

    return references;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return new Set();
  }
}

// Fonction pour lister toutes les images dans les dossiers d'images
async function listAllImages() {
  const allImages = new Set();

  for (const dir of imageDirs) {
    try {
      const fullDir = path.join(rootDir, dir);
      const files = await listFiles(fullDir, imageExtensions);

      for (const file of files) {
        // Ignorer les versions optimisées et les variantes responsives
        if (file.includes('_optimized.') || file.includes('_640w.') ||
            file.includes('_1024w.') || file.includes('_320w.') ||
            file.includes('_480w.') || file.includes('_1440w.')) {
          continue;
        }

        const relativePath = path.relative(path.join(rootDir, 'public'), file).replace(/\\/g, '/');
        allImages.add(`/${relativePath}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture du dossier ${dir}:`, error);
    }
  }

  return allImages;
}

// Fonction principale
async function main() {
  console.log('Analyse des fichiers en cours...');

  // Récupérer tous les fichiers à analyser
  let allFiles = [];
  for (const dir of dirsToAnalyze) {
    const dirPath = path.join(rootDir, dir);
    const files = await listFiles(dirPath, fileExtensions);
    allFiles = [...allFiles, ...files];
  }

  console.log(`Nombre total de fichiers analysés: ${allFiles.length}`);

  // Trouver toutes les références d'images
  const usedImages = new Set();

  for (const file of allFiles) {
    const references = await findImageReferences(file);
    for (const ref of references) {
      usedImages.add(ref);

      // Ajouter également les versions optimisées et responsives
      if (ref.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const basePath = ref.replace(/\.(jpg|jpeg|png|gif)$/i, '');
        usedImages.add(`${basePath}_optimized.webp`);
        usedImages.add(`${basePath}_optimized.avif`);
        usedImages.add(`${basePath}_640w.webp`);
        usedImages.add(`${basePath}_640w.avif`);
        usedImages.add(`${basePath}_1024w.webp`);
        usedImages.add(`${basePath}_1024w.avif`);
      }
    }
  }

  console.log(`Nombre d'images référencées: ${usedImages.size}`);

  // Lister toutes les images existantes
  const allImages = await listAllImages();
  console.log(`Nombre total d'images: ${allImages.size}`);

  // Liste des images importantes à conserver même si elles ne sont pas référencées directement
  const importantImages = new Set([
    '/assets/zoddev_logo/zoddev_logo_dark.png',
    '/assets/zoddev_logo/zoddev_logo_dark_mode.png',
    '/assets/zoddev_logo/zoddev_logo_light_mode.png',
    '/assets/favicon.svg'
  ]);

  // Trouver les images non utilisées
  const unusedImages = new Set();
  for (const img of allImages) {
    if (!usedImages.has(img) && !importantImages.has(img)) {
      unusedImages.add(img);
    }
  }

  console.log(`\nImages potentiellement non utilisées: ${unusedImages.size}`);

  // Créer un dossier pour les images non utilisées
  const unusedDir = path.join(rootDir, 'public/assets/unused_images');
  try {
    await fs.mkdir(unusedDir, { recursive: true });
  } catch (error) {
    console.error(`Erreur lors de la création du dossier ${unusedDir}:`, error);
  }

  // Écrire la liste des images non utilisées dans un fichier
  const unusedImagesFile = path.join(rootDir, 'unused_images.txt');
  await fs.writeFile(unusedImagesFile, Array.from(unusedImages).join('\n'));

  console.log(`\nListe des images non utilisées écrite dans ${unusedImagesFile}`);
  console.log('\nPour déplacer les images non utilisées, exécutez:');
  console.log('node scripts/move-unused-images.js');
}

main().catch(console.error);
