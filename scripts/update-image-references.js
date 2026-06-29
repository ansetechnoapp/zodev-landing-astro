// Script pour mettre à jour les références d'images dans le code
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Fonction pour mettre à jour les références d'images dans un fichier
async function updateFileReferences(filePath, updateFn) {
  try {
    const fullPath = path.join(rootDir, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const updatedContent = updateFn(content);
    
    if (content !== updatedContent) {
      await fs.writeFile(fullPath, updatedContent);
      console.log(`Fichier mis à jour: ${filePath}`);
      return true;
    } else {
      console.log(`Aucune modification nécessaire pour: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du fichier ${filePath}: ${error.message}`);
    return false;
  }
}

// Fonction pour mettre à jour les références dans work/[...slug].astro
async function updateWorkSlug() {
  const filePath = 'src/pages/work/[...slug].astro';
  
  return updateFileReferences(filePath, (content) => {
    // Mise à jour de l'image principale
    let updatedContent = content.replace(
      /{entry\.data\.img && \(\s*<div class="main-image">\s*<img src={entry\.data\.img} alt={entry\.data\.img_alt \|\| ""} \/>\s*<\/div>\s*\)}/s,
      `{entry.data.img && (
        <div class="main-image">
          <picture>
            {/* AVIF format */}
            <source
              type="image/avif"
              srcset={\`\${entry.data.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.avif')} 1x, \${entry.data.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.avif')} 640w, \${entry.data.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.avif')} 1024w\`}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* WebP format */}
            <source
              type="image/webp"
              srcset={\`\${entry.data.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.webp')} 1x, \${entry.data.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.webp')} 640w, \${entry.data.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.webp')} 1024w\`}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Fallback format */}
            <img src={entry.data.img} alt={entry.data.img_alt || ""} loading="lazy" decoding="async" />
          </picture>
        </div>
      )}`
    );
    
    // Mise à jour des images additionnelles
    updatedContent = updatedContent.replace(
      /{entry\.data\.additionalImages\.map\(\(img\) => \(\s*<div class="gallery-image">\s*<img src={img\.url} alt={img\.alt \|\| ""} \/>\s*<\/div>\s*\)\)}/s,
      `{entry.data.additionalImages.map((img) => (
                  <div class="gallery-image">
                    <picture>
                      {/* AVIF format */}
                      <source
                        type="image/avif"
                        srcset={\`\${img.url.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.avif')} 1x, \${img.url.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.avif')} 640w, \${img.url.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.avif')} 1024w\`}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      {/* WebP format */}
                      <source
                        type="image/webp"
                        srcset={\`\${img.url.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.webp')} 1x, \${img.url.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.webp')} 640w, \${img.url.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.webp')} 1024w\`}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      {/* Fallback format */}
                      <img src={img.url} alt={img.alt || ""} loading="lazy" decoding="async" />
                    </picture>
                  </div>
                ))}`
    );
    
    return updatedContent;
  });
}

// Fonction pour mettre à jour les références dans blog/[...slug].astro
async function updateBlogSlug() {
  const filePath = 'src/pages/blog/[...slug].astro';
  
  return updateFileReferences(filePath, (content) => {
    // Vérifier si le fichier utilise déjà l'élément Image d'Astro
    if (content.includes('import { Image } from "astro:assets"')) {
      // Supprimer l'import de Image
      let updatedContent = content.replace(
        /import { Image } from "astro:assets";/,
        ''
      );
      
      // Remplacer l'élément Image par picture
      updatedContent = updatedContent.replace(
        /<Image\s+src={post\.data\.heroImage}\s+alt={post\.data\.title}\s+width={1200}\s+height={600}\s+class="w-full h-full object-cover"\s*\/>/s,
        `<picture>
          {/* AVIF format */}
          <source
            type="image/avif"
            srcset={\`\${post.data.heroImage.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.avif')} 1x, \${post.data.heroImage.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.avif')} 640w, \${post.data.heroImage.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.avif')} 1024w\`}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* WebP format */}
          <source
            type="image/webp"
            srcset={\`\${post.data.heroImage.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.webp')} 1x, \${post.data.heroImage.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.webp')} 640w, \${post.data.heroImage.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.webp')} 1024w\`}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Fallback format */}
          <img
            src={post.data.heroImage}
            alt={post.data.title}
            width="1200"
            height="600"
            class="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>`
      );
      
      return updatedContent;
    }
    
    return content;
  });
}

// Fonction pour mettre à jour les références dans PortfolioPreview.tsx
async function updatePortfolioPreview() {
  const filePath = 'src/components/reactJS/PortfolioPreview.tsx';
  
  return updateFileReferences(filePath, (content) => {
    // Vérifier si le fichier utilise déjà des images optimisées
    if (content.includes('_optimized.webp') && content.includes('_optimized.avif')) {
      return content;
    }
    
    // Remplacer l'élément img par picture
    const updatedContent = content.replace(
      /<img\s+src={project\.img}\s+alt={project\.img_alt}\s+className="portfolio-image"\s*\/>/s,
      `<picture>
          <source
            type="image/avif"
            srcSet={\`\${project.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.avif')} 1x, \${project.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.avif')} 640w, \${project.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.avif')} 1024w\`}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <source
            type="image/webp"
            srcSet={\`\${project.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_optimized.webp')} 1x, \${project.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_640w.webp')} 640w, \${project.img.replace(/\\.(jpg|jpeg|png|gif)$/i, '_1024w.webp')} 1024w\`}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <img
            src={project.img}
            alt={project.img_alt}
            className="portfolio-image"
            loading="lazy"
            decoding="async"
          />
        </picture>`
    );
    
    return updatedContent;
  });
}

// Fonction principale
async function main() {
  console.log('Mise à jour des références d\'images dans le code...');
  
  const results = await Promise.all([
    updateWorkSlug(),
    updateBlogSlug(),
    updatePortfolioPreview()
  ]);
  
  const updatedCount = results.filter(Boolean).length;
  
  console.log(`\nMise à jour terminée: ${updatedCount} fichier(s) modifié(s).`);
}

main().catch(error => {
  console.error('Erreur lors de la mise à jour des références d\'images:', error);
  process.exit(1);
});
