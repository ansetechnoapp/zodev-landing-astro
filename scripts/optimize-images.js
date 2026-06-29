// This script helps convert and optimize images in the public directory
// to modern formats (WebP and AVIF) with proper quality settings
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
const srcDir = path.join(__dirname, '../src');

// Directories to process - add more as needed
const imageDirs = [
  path.join(publicDir, 'assets/myprojects'),
  path.join(publicDir, 'assets/backgrounds'),
  path.join(publicDir, 'assets/img'),
  path.join(publicDir, 'assets/otty_kevin_optimized'),
  path.join(publicDir, 'assets/icone'),
  path.join(publicDir, 'assets/zoddev_logo'),
  // Add more directories as needed
];

// Image formats to process
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif'];

// Output formats to generate
const outputFormats = [
  { format: 'webp', quality: 80 },
  { format: 'avif', quality: 65 }, // Réduire la qualité AVIF pour une meilleure compression
];

// Size variants for responsive images (width in pixels)
// Ajout de tailles plus petites pour les mobiles
const sizeVariants = [320, 480, 640, 1024, 1440];

async function processImage(imagePath) {
  const fileInfo = path.parse(imagePath);

  if (!supportedFormats.includes(fileInfo.ext.toLowerCase())) {
    return;
  }

  console.log(`Processing: ${imagePath}`);
  const imageBuffer = await fs.readFile(imagePath);

  // Get image dimensions
  const metadata = await sharp(imageBuffer).metadata();

  // Skip if already optimized (checking for _optimized in filename)
  if (fileInfo.name.includes('_optimized')) {
    return;
  }

  // Only create size variants for images larger than the target size
  const applicableSizes = sizeVariants.filter(size => size < metadata.width);

  // Original size conversion to modern formats
  for (const { format, quality } of outputFormats) {
    const outputPath = path.join(
      fileInfo.dir,
      `${fileInfo.name}_optimized.${format}`
    );

    await sharp(imageBuffer)
      .toFormat(format, { quality })
      .toFile(outputPath);

    console.log(`Created: ${outputPath}`);
  }

  // Size variants for responsive images
  for (const size of applicableSizes) {
    for (const { format, quality } of outputFormats) {
      const outputPath = path.join(
        fileInfo.dir,
        `${fileInfo.name}_${size}w.${format}`
      );

      await sharp(imageBuffer)
        .resize(size)
        .toFormat(format, { quality })
        .toFile(outputPath);

      console.log(`Created: ${outputPath}`);
    }
  }
}

async function processDirectory(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        await processImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

async function main() {
  for (const dir of imageDirs) {
    try {
      await fs.access(dir);
      console.log(`Processing directory: ${dir}`);
      await processDirectory(dir);
    } catch (error) {
      console.error(`Directory ${dir} does not exist or is not accessible`);
    }
  }

  console.log('Image optimization complete!');
}

main().catch(console.error);