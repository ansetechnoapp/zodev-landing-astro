import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/assets/otty_kevin_optimized');
const files = ['2.png', '6.png'];

async function optimizeImages() {
  const responsiveSizes = [320, 480, 640, 1024];

  for (const file of files) {
    const inputPath = path.join(sourceDir, file);

    if (!fs.existsSync(inputPath)) {
      console.log(`File not found: ${inputPath}`);
      continue;
    }

    const baseName = path.parse(file).name;

    try {
      // Create optimized versions (original size)
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(path.join(sourceDir, `${baseName}_optimized.webp`));

      await sharp(inputPath)
        .avif({ quality: 65 })
        .toFile(path.join(sourceDir, `${baseName}_optimized.avif`));

      // Create responsive versions for each size
      for (const size of responsiveSizes) {
        await sharp(inputPath)
          .resize(size)
          .webp({ quality: 80 })
          .toFile(path.join(sourceDir, `${baseName}_${size}w.webp`));

        await sharp(inputPath)
          .resize(size)
          .avif({ quality: 65 })
          .toFile(path.join(sourceDir, `${baseName}_${size}w.avif`));
      }

      console.log(`Optimized ${file} with all responsive sizes`);
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error);
    }
  }
}

optimizeImages().catch(err => console.error('Error optimizing images:', err));
