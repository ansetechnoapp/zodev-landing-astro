// Script pour déplacer les images non utilisées vers un dossier d'archives
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function main() {
  try {
    // Lire la liste des images non utilisées
    const unusedImagesFile = path.join(rootDir, 'unused_images.txt');
    const unusedImagesContent = await fs.readFile(unusedImagesFile, 'utf-8');
    const unusedImages = unusedImagesContent.split('\n').filter(line => line.trim() !== '');
    
    console.log(`Nombre d'images à déplacer: ${unusedImages.length}`);
    
    // Créer le dossier d'archives s'il n'existe pas
    const archiveDir = path.join(rootDir, 'public/assets/unused_images');
    await fs.mkdir(archiveDir, { recursive: true });
    
    // Déplacer chaque image
    let movedCount = 0;
    let errorCount = 0;
    
    for (const imagePath of unusedImages) {
      try {
        // Chemin source complet
        const sourcePath = path.join(rootDir, 'public', imagePath);
        
        // Créer le chemin de destination en préservant la structure des dossiers
        const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        const destPath = path.join(archiveDir, path.basename(relativePath));
        
        // Vérifier si le fichier source existe
        try {
          await fs.access(sourcePath);
        } catch (error) {
          console.log(`Fichier non trouvé: ${sourcePath}`);
          errorCount++;
          continue;
        }
        
        // Déplacer le fichier
        await fs.rename(sourcePath, destPath);
        console.log(`Déplacé: ${sourcePath} -> ${destPath}`);
        movedCount++;
      } catch (error) {
        console.error(`Erreur lors du déplacement de ${imagePath}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\nOpération terminée:`);
    console.log(`- ${movedCount} images déplacées avec succès`);
    console.log(`- ${errorCount} erreurs rencontrées`);
    
    // Créer un fichier de log
    const logContent = `
Date: ${new Date().toISOString()}
Images déplacées: ${movedCount}
Erreurs: ${errorCount}
`;
    
    await fs.writeFile(path.join(rootDir, 'image_cleanup_log.txt'), logContent);
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  }
}

main();
