// Intégration Astro pour ajouter automatiquement les balises meta et Schema.org à chaque page
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { canonicalSiteUrl } from '../config/site.js';

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
      // Hook 'astro:build:start'
      'astro:build:start': async () => {
        console.log('🔍 SEO Integration: Préparation des optimisations SEO...');
      },
      
      // Hook 'astro:build:done'
      'astro:build:done': async ({ pages, dir }) => {
        console.log('🔍 SEO Integration: Finalisation des optimisations SEO...');
        
        // Générer le sitemap.xml basé sur les pages construites
        await generateSitemap(config);
        
        console.log('✅ SEO Integration: Optimisations SEO terminées.');
      }
    }
  };
}

/**
 * Générer le sitemap.xml
 * @param {Object} config - Configuration SEO
 */
async function generateSitemap(config) {
  // Exécuter le script de génération du sitemap
  try {
    const execAsync = promisify(exec);

    await execAsync('node scripts/generate-sitemap.js');
    console.log('✅ Sitemap généré avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
  }
}
