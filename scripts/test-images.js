import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Images à tester
const imagesToTest = [
  '/assets/otty_kevin_optimized/2.png',
  '/assets/otty_kevin_optimized/2_optimized.webp',
  '/assets/otty_kevin_optimized/2_optimized.avif',
  '/assets/otty_kevin_optimized/2_320w.webp',
  '/assets/otty_kevin_optimized/2_320w.avif',
  '/assets/otty_kevin_optimized/2_480w.webp',
  '/assets/otty_kevin_optimized/2_480w.avif',
  '/assets/otty_kevin_optimized/2_640w.webp',
  '/assets/otty_kevin_optimized/2_640w.avif',
  '/assets/otty_kevin_optimized/2_1024w.webp',
  '/assets/otty_kevin_optimized/2_1024w.avif',
  '/assets/otty_kevin_optimized/6.png',
  '/assets/otty_kevin_optimized/6_optimized.webp',
  '/assets/otty_kevin_optimized/6_optimized.avif',
  '/assets/otty_kevin_optimized/6_320w.webp',
  '/assets/otty_kevin_optimized/6_320w.avif',
  '/assets/otty_kevin_optimized/6_480w.webp',
  '/assets/otty_kevin_optimized/6_480w.avif',
  '/assets/otty_kevin_optimized/6_640w.webp',
  '/assets/otty_kevin_optimized/6_640w.avif',
  '/assets/otty_kevin_optimized/6_1024w.webp',
  '/assets/otty_kevin_optimized/6_1024w.avif'
];

function testImages() {
  console.log('🔍 Test de l\'existence des images...\n');
  
  let allExist = true;
  let totalSize = 0;
  
  imagesToTest.forEach(imagePath => {
    const fullPath = path.join(publicDir, imagePath);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      const stats = fs.statSync(fullPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      console.log(`✅ ${imagePath} (${sizeKB} KB)`);
    } else {
      console.log(`❌ ${imagePath} - MANQUANT`);
      allExist = false;
    }
  });
  
  console.log(`\n📊 Résumé:`);
  console.log(`- Images testées: ${imagesToTest.length}`);
  console.log(`- Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (allExist) {
    console.log(`✅ Toutes les images sont présentes et accessibles !`);
    console.log(`\n🚀 L'image /assets/otty_kevin_optimized/2.png devrait maintenant s'afficher correctement.`);
  } else {
    console.log(`❌ Certaines images sont manquantes.`);
  }
  
  return allExist;
}

// Test des chemins dans index.astro
function testIndexAstroReferences() {
  console.log('\n🔍 Vérification des références dans index.astro...\n');
  
  const indexPath = path.join(__dirname, '../src/pages/index.astro');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Fichier index.astro non trouvé');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf-8');
  
  // Vérifier les références d'images
  const img1References = [
    '/assets/otty_kevin_optimized/2.png',
    '/assets/otty_kevin_optimized/2_optimized.webp',
    '/assets/otty_kevin_optimized/2_optimized.avif'
  ];
  
  const img2References = [
    '/assets/otty_kevin_optimized/6.png',
    '/assets/otty_kevin_optimized/6_optimized.webp',
    '/assets/otty_kevin_optimized/6_optimized.avif'
  ];
  
  let allReferencesFound = true;
  
  [...img1References, ...img2References].forEach(ref => {
    if (content.includes(ref)) {
      console.log(`✅ Référence trouvée: ${ref}`);
    } else {
      console.log(`❌ Référence manquante: ${ref}`);
      allReferencesFound = false;
    }
  });
  
  return allReferencesFound;
}

// Exécuter les tests
console.log('🧪 Test des images otty_kevin_optimized\n');
console.log('=' .repeat(60));

const imagesExist = testImages();
const referencesOk = testIndexAstroReferences();

console.log('\n' + '=' .repeat(60));
console.log('📋 RÉSULTAT FINAL:');

if (imagesExist && referencesOk) {
  console.log('🎉 SUCCÈS: Toutes les images et références sont correctes !');
  console.log('💡 L\'image devrait maintenant s\'afficher sur votre site.');
} else {
  console.log('⚠️  PROBLÈME DÉTECTÉ: Vérifiez les erreurs ci-dessus.');
}
