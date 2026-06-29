import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/assets/icone_optimized');
const files = fs.readdirSync(sourceDir);

async function optimizeImages() {
  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    
    const inputPath = path.join(sourceDir, file);
    const fileNameWithoutExt = path.parse(file).name;
    
    // Create optimized versions
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(path.join(sourceDir, `${fileNameWithoutExt}_optimized.webp`));
    
    await sharp(inputPath)
      .avif({ quality: 65 })
      .toFile(path.join(sourceDir, `${fileNameWithoutExt}_optimized.avif`));
    
    console.log(`Optimized ${file}`);
  }
}

optimizeImages().catch(err => console.error('Error optimizing images:', err));
