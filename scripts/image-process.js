// Script principal pour l'optimisation et le nettoyage des images
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Fonction pour exécuter une commande shell
async function runCommand(command) {
  console.log(`Exécution de la commande: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${error.message}`);
    return false;
  }
}

// Fonction pour créer un dossier s'il n'existe pas
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Dossier créé: ${dirPath}`);
  }
}

// Fonction pour optimiser les images
async function optimizeImages() {
  console.log('\n=== ÉTAPE 1: OPTIMISATION DES IMAGES ===');

  // Exécuter le script d'optimisation des images
  const optimizeScript = path.join(rootDir, 'scripts', 'optimize-images.js');
  return runCommand(`node ${optimizeScript}`);
}

// Fonction pour mettre à jour les références d'images dans le code
async function updateImageReferences() {
  console.log('\n=== ÉTAPE 2: MISE À JOUR DES RÉFÉRENCES D\'IMAGES ===');

  // Vérifier si les composants utilisent déjà des images optimisées
  // Si ce n'est pas le cas, mettre à jour les références

  // Liste des fichiers à vérifier
  const filesToCheck = [
    'src/pages/work/[...slug].astro',
    'src/pages/blog/[...slug].astro',
    'src/components/reactJS/PortfolioPreview.tsx'
  ];

  let updatesNeeded = false;

  for (const filePath of filesToCheck) {
    const fullPath = path.join(rootDir, filePath);
    try {
      const content = await fs.readFile(fullPath, 'utf-8');

      // Vérifier si le fichier utilise déjà des images optimisées
      if (filePath.includes('[...slug].astro') && !content.includes('_optimized.webp')) {
        console.log(`Le fichier ${filePath} doit être mis à jour pour utiliser des images optimisées.`);
        updatesNeeded = true;
      }

      if (filePath.includes('PortfolioPreview.tsx') && !content.includes('_optimized.webp')) {
        console.log(`Le fichier ${filePath} doit être mis à jour pour utiliser des images optimisées.`);
        updatesNeeded = true;
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier ${filePath}: ${error.message}`);
    }
  }

  if (updatesNeeded) {
    console.log('Des mises à jour sont nécessaires. Exécution du script de mise à jour des références...');
    const updateScript = path.join(rootDir, 'scripts', 'update-image-references.js');
    return runCommand(`node ${updateScript}`);
  } else {
    console.log('Tous les fichiers utilisent déjà des images optimisées. Aucune mise à jour nécessaire.');
    return true;
  }
}

// Fonction pour détecter et déplacer les images non utilisées
async function cleanupUnusedImages() {
  console.log('\n=== ÉTAPE 3: NETTOYAGE DES IMAGES NON UTILISÉES ===');

  // Créer le dossier pour les images non utilisées s'il n'existe pas
  const unusedImagesDir = path.join(rootDir, 'public', 'assets', 'unused_images');
  await ensureDirectoryExists(unusedImagesDir);

  // Exécuter le script de détection des images non utilisées
  const cleanupScript = path.join(rootDir, 'scripts', 'cleanup-images.js');
  const success1 = await runCommand(`node ${cleanupScript}`);

  if (success1) {
    // Exécuter le script de déplacement des images non utilisées
    const moveScript = path.join(rootDir, 'scripts', 'move-unused-images.js');
    return runCommand(`node ${moveScript}`);
  }

  return false;
}

// Fonction principale
async function main() {
  console.log('=== DÉBUT DU PROCESSUS D\'OPTIMISATION ET DE NETTOYAGE DES IMAGES ===');

  const startTime = Date.now();

  // Étape 1: Optimiser les images
  const optimizeSuccess = await optimizeImages();

  // Étape 2: Mettre à jour les références d'images
  const updateSuccess = await updateImageReferences();

  // Étape 3: Nettoyer les images non utilisées
  const cleanupSuccess = await cleanupUnusedImages();

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log(`\n=== FIN DU PROCESSUS (${duration.toFixed(2)} secondes) ===`);

  if (optimizeSuccess && updateSuccess && cleanupSuccess) {
    console.log('Toutes les étapes ont été exécutées avec succès.');
  } else {
    console.log('Certaines étapes ont échoué. Vérifiez les messages d\'erreur ci-dessus.');
  }
}

main().catch(error => {
  console.error('Erreur lors de l\'exécution du script principal:', error);
  process.exit(1);
});
