// Script de vérification SEO pré-déploiement
// Ce script s'exécute automatiquement avant chaque build via npm run prebuild
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import { XMLBuilder } from 'fast-xml-parser';
import { canonicalSiteOrigin } from '../src/config/site.js';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const siteUrl = canonicalSiteOrigin;
const pagesDir = path.join(rootDir, 'src/pages');
const publicDir = path.join(rootDir, 'public');
const contentDir = path.join(rootDir, 'src/content');

// Configuration SEO
const seoConfig = {
  priorityPages: [
    { path: '/', priority: 1.0, changefreq: 'monthly' },
    { path: '/work/', priority: 0.8, changefreq: 'monthly' },
    { path: '/blog/', priority: 0.7, changefreq: 'weekly' },
    { path: '/widgetCss/', priority: 0.6, changefreq: 'monthly' },
  ],
  languages: ['fr', 'en'],
};

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== VÉRIFICATION SEO PRÉ-DÉPLOIEMENT ==='));
  console.log(chalk.blue('Préparation du site pour le déploiement...'));
  console.log('');

  try {
    // 1. Générer/mettre à jour le sitemap
    await generateSitemap();

    // 2. Vérifier les images non optimisées
    await checkUnoptimizedImages();

    // 3. Vérifier les balises meta essentielles
    await checkEssentialMetaTags();

    console.log('');
    console.log(chalk.green.bold('✓ Vérification SEO pré-déploiement terminée avec succès'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la vérification SEO:'), error);
    // Ne pas faire échouer le build en cas d'erreur
    // process.exit(1);
  }
}

// Générer le sitemap
async function generateSitemap() {
  console.log(chalk.yellow.bold('1. Génération du sitemap'));

  // Collecter toutes les URLs
  const urls = [];

  // Ajouter les pages prioritaires
  for (const page of seoConfig.priorityPages) {
    // Page principale (français par défaut)
    urls.push({
      loc: `${siteUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
      alternates: seoConfig.languages.map(lang => ({
        hreflang: lang,
        href: lang === 'fr' ? `${siteUrl}${page.path}` : `${siteUrl}/${lang}${page.path}`
      }))
    });
  }

  // Ajouter les pages de contenu dynamiques (blog, projets, etc.)
  try {
    // Projets
    const workFiles = await glob('**/*.{md,mdx}', { cwd: path.join(contentDir, 'work') });
    for (const file of workFiles) {
      const slug = path.basename(file, path.extname(file));
      urls.push({
        loc: `${siteUrl}/work/${slug}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7,
        alternates: seoConfig.languages.map(lang => ({
          hreflang: lang,
          href: lang === 'fr' ? `${siteUrl}/work/${slug}/` : `${siteUrl}/${lang}/work/${slug}/`
        }))
      });
    }

    // Blog
    const blogFiles = await glob('**/*.{md,mdx}', { cwd: path.join(contentDir, 'blog') });
    for (const file of blogFiles) {
      const slug = path.basename(file, path.extname(file));
      urls.push({
        loc: `${siteUrl}/blog/${slug}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6,
        alternates: seoConfig.languages.map(lang => ({
          hreflang: lang,
          href: lang === 'fr' ? `${siteUrl}/blog/${slug}/` : `${siteUrl}/${lang}/blog/${slug}/`
        }))
      });
    }
  } catch (error) {
    console.warn(chalk.yellow('Avertissement: Impossible de lire certains fichiers de contenu'), error.message);
  }

  // Générer le XML
  const xmlContent = generateSitemapXML(urls);

  // Écrire le fichier
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  await fs.writeFile(sitemapPath, xmlContent, 'utf-8');

  console.log(chalk.green(`Sitemap généré avec ${urls.length} URLs: ${sitemapPath}`));
}

// Générer le XML du sitemap
function generateSitemapXML(urls) {
  // Créer le contenu XML manuellement pour plus de contrôle
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;

    // Ajouter les alternates pour les différentes langues
    if (url.alternates && url.alternates.length > 0) {
      for (const alt of url.alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>\n`;
      }
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

// Vérifier les images non optimisées
async function checkUnoptimizedImages() {
  console.log(chalk.yellow.bold('\n2. Vérification des images non optimisées'));

  // Trouver toutes les images
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const imagePatterns = imageExtensions.map(ext => `**/*.${ext}`);
  
  const imageFiles = await glob(imagePatterns, { 
    cwd: publicDir,
    ignore: ['**/node_modules/**', '**/unused_images/**']
  });

  // Vérifier si les images sont optimisées
  const nonOptimizedImages = imageFiles.filter(file => {
    return !file.includes('_optimized') && 
           !file.includes('_640w') && 
           !file.includes('_1024w');
  });

  if (nonOptimizedImages.length > 0) {
    console.log(chalk.yellow(`${nonOptimizedImages.length} images non optimisées trouvées.`));
    console.log(chalk.blue('Les images seront optimisées pendant le processus de build.'));
  } else {
    console.log(chalk.green('Toutes les images sont optimisées.'));
  }
}

// Vérifier les balises meta essentielles
async function checkEssentialMetaTags() {
  console.log(chalk.yellow.bold('\n3. Vérification des balises meta essentielles'));

  // Vérifier le composant MainHead.astro
  const mainHeadPath = path.join(rootDir, 'src/components/MainHead.astro');
  
  try {
    const content = await fs.readFile(mainHeadPath, 'utf-8');
    
    // Vérifier les balises meta essentielles
    const essentialTags = [
      { name: 'title', present: content.includes('<title>') || content.includes('title=') },
      { name: 'description', present: content.includes('name="description"') || content.includes('description=') },
      { name: 'Open Graph', present: content.includes('property="og:') },
      { name: 'Twitter Card', present: content.includes('property="twitter:') },
      { name: 'canonical', present: content.includes('rel="canonical"') || content.includes('canonicalURL') },
      { name: 'Schema.org', present: content.includes('<SchemaOrg') || content.includes('SchemaOrg.astro') }
    ];
    
    const missingTags = essentialTags.filter(tag => !tag.present);
    
    if (missingTags.length > 0) {
      console.log(chalk.yellow(`Balises meta manquantes: ${missingTags.map(tag => tag.name).join(', ')}`));
      console.log(chalk.blue('Suggestion: Ajoutez ces balises meta pour améliorer le SEO.'));
    } else {
      console.log(chalk.green('Toutes les balises meta essentielles sont présentes.'));
    }
    
  } catch (error) {
    console.log(chalk.red('Erreur lors de la vérification des balises meta:'), error.message);
  }
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
});
