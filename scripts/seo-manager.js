// Script de gestion SEO pour le site portfolio
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import { parseHTML } from 'linkedom';
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
  titleMinLength: 10,
  titleMaxLength: 60,
  descriptionMinLength: 50,
  descriptionMaxLength: 160,
  keywordsMinCount: 3,
  keywordsMaxCount: 10,
  imgAltRequired: true,
  headingStructureRequired: true,
  canonicalRequired: true,
  schemaOrgRequired: true,
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
  console.log(chalk.blue.bold('=== GESTIONNAIRE SEO ==='));
  console.log(chalk.blue('Analyse et optimisation SEO pour votre site portfolio'));
  console.log('');

  try {
    // 1. Analyser les pages
    await analyzeSEO();

    // 2. Générer/mettre à jour le sitemap
    await generateSitemap();

    // 3. Vérifier les données structurées
    await checkSchemaOrg();

    // 4. Suggérer des améliorations
    await suggestImprovements();

    console.log('');
    console.log(chalk.green.bold('✓ Analyse SEO terminée avec succès'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'analyse SEO:'), error);
  }
}

// Analyser les pages pour les problèmes SEO
async function analyzeSEO() {
  console.log(chalk.yellow.bold('1. Analyse des pages'));

  // Trouver toutes les pages Astro
  const astroFiles = await glob('**/*.astro', { cwd: pagesDir });
  console.log(`Nombre de pages trouvées: ${astroFiles.length}`);

  let issues = [];

  for (const file of astroFiles) {
    // Ignorer les fichiers de layout et les composants
    if (file.includes('[...slug]') || file.includes('_')) {
      continue;
    }

    const filePath = path.join(pagesDir, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Vérifier les balises meta
    const metaIssues = checkMetaTags(content, file);
    if (metaIssues.length > 0) {
      issues.push(...metaIssues);
    }

    // Vérifier la structure des headings
    const headingIssues = checkHeadingStructure(content, file);
    if (headingIssues.length > 0) {
      issues.push(...headingIssues);
    }

    // Vérifier les images
    const imageIssues = checkImages(content, file);
    if (imageIssues.length > 0) {
      issues.push(...imageIssues);
    }
  }

  // Afficher les problèmes
  if (issues.length > 0) {
    console.log(chalk.red(`${issues.length} problèmes SEO trouvés:`));
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${chalk.yellow(issue.file)}: ${issue.message}`);
    });
  } else {
    console.log(chalk.green('Aucun problème SEO majeur trouvé.'));
  }
}

// Vérifier les balises meta
function checkMetaTags(content, file) {
  const issues = [];

  // Vérifier le titre
  if (!content.includes('<title>') && !content.includes('title={')) {
    issues.push({
      file,
      message: 'Pas de balise title trouvée',
    });
  }

  // Vérifier la description
  if (!content.includes('name="description"') && !content.includes('description={')) {
    issues.push({
      file,
      message: 'Pas de meta description trouvée',
    });
  }

  // Vérifier les balises Open Graph
  if (!content.includes('property="og:')) {
    issues.push({
      file,
      message: 'Pas de balises Open Graph trouvées',
    });
  }

  // Vérifier les balises Twitter
  if (!content.includes('property="twitter:')) {
    issues.push({
      file,
      message: 'Pas de balises Twitter Card trouvées',
    });
  }

  return issues;
}

// Vérifier la structure des headings
function checkHeadingStructure(content, file) {
  const issues = [];

  // Vérifier la présence d'un h1
  if (!content.includes('<h1') && !content.includes('h1>')) {
    issues.push({
      file,
      message: 'Pas de balise H1 trouvée',
    });
  }

  // Vérifier l'ordre des headings (simplifié)
  const h2BeforeH1 = content.indexOf('<h2') < content.indexOf('<h1') && content.indexOf('<h2') !== -1 && content.indexOf('<h1') !== -1;
  if (h2BeforeH1) {
    issues.push({
      file,
      message: 'H2 apparaît avant H1, ce qui peut nuire à la structure sémantique',
    });
  }

  return issues;
}

// Vérifier les images
function checkImages(content, file) {
  const issues = [];
  const imgRegex = /<img[^>]*>/g;
  const imgTags = content.match(imgRegex) || [];

  for (const imgTag of imgTags) {
    if (!imgTag.includes('alt=')) {
      issues.push({
        file,
        message: 'Image sans attribut alt trouvée',
      });
    }

    if (!imgTag.includes('loading=')) {
      issues.push({
        file,
        message: 'Image sans attribut loading (lazy) trouvée',
      });
    }
  }

  return issues;
}

// Générer le sitemap
async function generateSitemap() {
  console.log(chalk.yellow.bold('\n2. Génération du sitemap'));

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

// Vérifier les données structurées Schema.org
async function checkSchemaOrg() {
  console.log(chalk.yellow.bold('\n3. Vérification des données structurées Schema.org'));

  // Vérifier le composant SchemaOrg.astro
  const schemaOrgPath = path.join(rootDir, 'src/components/SchemaOrg.astro');
  
  try {
    const content = await fs.readFile(schemaOrgPath, 'utf-8');
    
    // Vérifier les types de schéma supportés
    const supportedTypes = [];
    if (content.includes('personSchema')) supportedTypes.push('Person');
    if (content.includes('articleSchema')) supportedTypes.push('Article');
    if (content.includes('projectSchema')) supportedTypes.push('CreativeWork/Project');
    
    console.log(chalk.green(`Schémas supportés: ${supportedTypes.join(', ')}`));
    
    // Vérifier l'utilisation du composant dans les layouts
    const layoutFiles = await glob('**/*.astro', { cwd: path.join(rootDir, 'src/layouts') });
    let schemaUsed = false;
    
    for (const file of layoutFiles) {
      const layoutPath = path.join(rootDir, 'src/layouts', file);
      const layoutContent = await fs.readFile(layoutPath, 'utf-8');
      
      if (layoutContent.includes('<SchemaOrg') || layoutContent.includes('SchemaOrg.astro')) {
        schemaUsed = true;
        console.log(chalk.green(`Schema.org utilisé dans le layout: ${file}`));
      }
    }
    
    if (!schemaUsed) {
      console.log(chalk.yellow('Avertissement: Le composant SchemaOrg n\'est pas utilisé dans tous les layouts'));
    }
    
  } catch (error) {
    console.log(chalk.red('Erreur lors de la vérification des données structurées:'), error.message);
  }
}

// Suggérer des améliorations SEO
async function suggestImprovements() {
  console.log(chalk.yellow.bold('\n4. Suggestions d\'améliorations SEO'));

  const suggestions = [
    "1. Assurez-vous que chaque page a un titre unique et descriptif (10-60 caractères)",
    "2. Utilisez des meta descriptions uniques et attrayantes (50-160 caractères)",
    "3. Optimisez les images avec des attributs alt descriptifs",
    "4. Utilisez une structure de headings logique (H1 > H2 > H3)",
    "5. Ajoutez des données structurées Schema.org pour tous les types de contenu",
    "6. Améliorez les temps de chargement en optimisant les images et le code",
    "7. Assurez-vous que votre site est responsive et fonctionne bien sur mobile",
    "8. Utilisez des URLs descriptives et conviviales pour le SEO",
    "9. Créez du contenu de qualité qui répond aux questions des utilisateurs",
    "10. Ajoutez des liens internes entre les pages connexes"
  ];

  suggestions.forEach(suggestion => {
    console.log(chalk.blue(`• ${suggestion}`));
  });

  // Vérifier les performances (Core Web Vitals)
  console.log(chalk.yellow.bold('\nCore Web Vitals'));
  console.log(chalk.blue("Pour analyser les Core Web Vitals, utilisez:"));
  console.log("• Google PageSpeed Insights: https://pagespeed.web.dev/");
  console.log("• Chrome DevTools > Lighthouse");
  console.log("• Google Search Console");
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
  process.exit(1);
});
