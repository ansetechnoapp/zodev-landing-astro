// Script pour générer automatiquement le sitemap basé sur le contenu actuel
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import { canonicalSiteOrigin } from '../src/config/site.js';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'src/pages');
const contentDir = path.join(rootDir, 'src/content');
const publicDir = path.join(rootDir, 'public');
const siteUrl = canonicalSiteOrigin;

// Configuration des priorités et fréquences de changement
const priorityConfig = {
  index: 1.0,
  work: 0.8,
  blog: 0.7,
  widgetCss: 0.6,
  default: 0.5
};

const changefreqConfig = {
  index: 'monthly',
  work: 'monthly',
  blog: 'weekly',
  widgetCss: 'monthly',
  default: 'monthly'
};

// Langues supportées
const languages = ['fr', 'en'];

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== GÉNÉRATION AUTOMATIQUE DU SITEMAP ==='));
  console.log(chalk.blue('Génération du sitemap basé sur le contenu actuel'));
  console.log('');

  try {
    // Collecter toutes les URLs
    const urls = [];

    // 1. Trouver toutes les pages statiques
    console.log(chalk.yellow('1. Analyse des pages statiques...'));
    const staticPages = await findStaticPages();
    urls.push(...staticPages);
    console.log(chalk.green(`${staticPages.length} pages statiques trouvées.`));

    // 2. Trouver toutes les pages de contenu dynamiques
    console.log(chalk.yellow('\n2. Analyse des pages de contenu dynamiques...'));
    const contentPages = await findContentPages();
    urls.push(...contentPages);
    console.log(chalk.green(`${contentPages.length} pages de contenu dynamiques trouvées.`));

    // 3. Générer le XML du sitemap
    console.log(chalk.yellow('\n3. Génération du XML...'));
    const xmlContent = generateSitemapXML(urls);

    // 4. Écrire le fichier sitemap.xml
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, xmlContent, 'utf-8');
    console.log(chalk.green(`Sitemap généré avec succès: ${sitemapPath}`));

    // 5. Générer le fichier sitemap.json pour référence
    const sitemapJsonPath = path.join(publicDir, 'sitemap.json');
    await fs.writeFile(sitemapJsonPath, JSON.stringify(urls, null, 2), 'utf-8');
    console.log(chalk.green(`Fichier JSON de référence généré: ${sitemapJsonPath}`));

    console.log('');
    console.log(chalk.green.bold(`✓ Sitemap généré avec ${urls.length} URLs`));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la génération du sitemap:'), error);
  }
}

// Trouver toutes les pages statiques
async function findStaticPages() {
  const urls = [];

  // Trouver tous les fichiers .astro dans le dossier pages
  const astroFiles = await glob('**/*.astro', { cwd: pagesDir });

  for (const file of astroFiles) {
    // Ignorer les fichiers de layout, les composants et les pages dynamiques
    if (file.includes('[...') || file.includes('_') || file.includes('/components/')) {
      continue;
    }

    // Convertir le chemin du fichier en URL
    let urlPath = file.replace(/\.astro$/, '');
    
    // Traiter index.astro comme la racine
    if (urlPath === 'index') {
      urlPath = '';
    }

    // Déterminer la priorité et la fréquence de changement
    let priority = priorityConfig.default;
    let changefreq = changefreqConfig.default;

    // Vérifier si c'est une page spéciale
    for (const key of Object.keys(priorityConfig)) {
      if (urlPath === key || urlPath.startsWith(key + '/')) {
        priority = priorityConfig[key];
        changefreq = changefreqConfig[key];
        break;
      }
    }

    // Ajouter l'URL au sitemap
    urls.push({
      loc: `${siteUrl}/${urlPath}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq,
      priority,
      alternates: languages.map(lang => ({
        hreflang: lang,
        href: lang === 'fr' ? `${siteUrl}/${urlPath}` : `${siteUrl}/${lang}/${urlPath}`
      }))
    });
  }

  return urls;
}

// Trouver toutes les pages de contenu dynamiques
async function findContentPages() {
  const urls = [];

  // Vérifier si le dossier de contenu existe
  try {
    await fs.access(contentDir);
  } catch (error) {
    console.log(chalk.yellow('Dossier de contenu non trouvé. Aucune page de contenu dynamique à ajouter.'));
    return urls;
  }

  // Lire les collections de contenu
  const collections = await fs.readdir(contentDir);

  for (const collection of collections) {
    const collectionDir = path.join(contentDir, collection);
    
    // Vérifier si c'est un dossier
    const stats = await fs.stat(collectionDir);
    if (!stats.isDirectory()) continue;

    // Trouver tous les fichiers de contenu
    const contentFiles = await glob('**/*.{md,mdx}', { cwd: collectionDir });

    for (const file of contentFiles) {
      // Extraire le slug du fichier
      const slug = path.basename(file, path.extname(file));
      
      // Déterminer la priorité et la fréquence de changement
      let priority = priorityConfig.default;
      let changefreq = changefreqConfig.default;

      // Vérifier si c'est une collection spéciale
      if (priorityConfig[collection]) {
        priority = priorityConfig[collection];
        changefreq = changefreqConfig[collection];
      }

      // Ajouter l'URL au sitemap
      urls.push({
        loc: `${siteUrl}/${collection}/${slug}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq,
        priority,
        alternates: languages.map(lang => ({
          hreflang: lang,
          href: lang === 'fr' ? `${siteUrl}/${collection}/${slug}/` : `${siteUrl}/${lang}/${collection}/${slug}/`
        }))
      });
    }
  }

  return urls;
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

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
  process.exit(1);
});
