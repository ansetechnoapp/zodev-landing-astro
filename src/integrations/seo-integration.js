// Intégration Astro pour ajouter automatiquement les balises meta et Schema.org à chaque page
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { canonicalSiteUrl } from '../config/site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../..');

// Configuration SEO par défaut
const defaultSeoConfig = {
  titleTemplate: '%s | zoddev Portfolio',
  defaultTitle: 'zoddev Portfolio',
  defaultDescription: 'Portfolio de développeur web et mobile freelance spécialisé en React, React Native, Astro.js et technologies web modernes.',
  defaultImage: '/assets/social-preview.jpg',
  siteUrl: canonicalSiteUrl,
  twitterHandle: '@zoddev',
  language: 'fr',
};

/**
 * Intégration Astro pour le SEO
 * @param {Object} options - Options de configuration
 * @returns {Object} - Intégration Astro
 */
export default function seoIntegration(options = {}) {
  // Fusionner les options avec la configuration par défaut
  const config = { ...defaultSeoConfig, ...options };
  
  return {
    name: 'astro-seo-integration',
    hooks: {
      // Hook 'astro:config:setup'
      'astro:config:setup': ({ injectRoute }) => {
        // Injecter une route virtuelle pour le sitemap.xml si elle n'existe pas déjà
        injectRoute({
          pattern: 'sitemap.xml',
          entrypoint: path.resolve(__dirname, './routes/sitemap.js')
        });
        
        // Injecter une route virtuelle pour robots.txt si elle n'existe pas déjà
        injectRoute({
          pattern: 'robots.txt',
          entrypoint: path.resolve(__dirname, './routes/robots.js')
        });
      },
      
      // Hook 'astro:build:start'
      'astro:build:start': async () => {
        console.log('🔍 SEO Integration: Préparation des optimisations SEO...');
        
        // Créer les fichiers de routes virtuelles si nécessaire
        await createVirtualRoutes();
      },
      
      // Hook 'astro:build:done'
      'astro:build:done': async ({ pages, dir }) => {
        console.log('🔍 SEO Integration: Finalisation des optimisations SEO...');
        
        // Générer le sitemap.xml basé sur les pages construites
        await generateSitemap(pages, dir.href, config);
        
        console.log('✅ SEO Integration: Optimisations SEO terminées.');
      }
    }
  };
}

/**
 * Créer les fichiers de routes virtuelles
 */
async function createVirtualRoutes() {
  const routesDir = path.join(__dirname, 'routes');
  
  // Créer le dossier routes s'il n'existe pas
  try {
    await fs.access(routesDir);
  } catch (error) {
    await fs.mkdir(routesDir, { recursive: true });
  }
  
  // Créer le fichier sitemap.js
  const sitemapContent = `
export async function get() {
  return {
    body: 'Sitemap will be generated during build',
    headers: {
      'Content-Type': 'application/xml'
    }
  };
}
`;
  
  // Créer le fichier robots.js
  const robotsContent = `
export async function get() {
  return {
    body: \`User-agent: *
Allow: /

# Sitemap
Sitemap: ${canonicalSiteUrl}sitemap.xml

# Interdire l'accès aux dossiers de templates et autres fichiers non destinés aux utilisateurs
Disallow: /template/
Disallow: /corbeille/
Disallow: /*.json$
Disallow: /*.js$
Disallow: /*.ts$
Disallow: /*.md$
Disallow: /*.astro$

# Autoriser les ressources statiques
Allow: /*.css$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$
Allow: /*.avif$
Allow: /*.ico$
Allow: /*.woff$
Allow: /*.woff2$\`,
    headers: {
      'Content-Type': 'text/plain'
    }
  };
}
`;
  
  // Écrire les fichiers
  await fs.writeFile(path.join(routesDir, 'sitemap.js'), sitemapContent, 'utf-8');
  await fs.writeFile(path.join(routesDir, 'robots.js'), robotsContent, 'utf-8');
}

/**
 * Générer le sitemap.xml
 * @param {Array} pages - Pages construites
 * @param {string} outDir - Dossier de sortie
 * @param {Object} config - Configuration SEO
 */
async function generateSitemap(pages, outDir, config) {
  // Exécuter le script de génération du sitemap
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    await execAsync('node scripts/generate-sitemap.js');
    console.log('✅ Sitemap généré avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
  }
}
