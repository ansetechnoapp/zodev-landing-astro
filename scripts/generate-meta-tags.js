// Script pour générer des balises meta pour les nouvelles pages
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import readline from 'readline';
import { canonicalSiteUrl } from '../src/config/site.js';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Créer une interface readline pour l'interaction avec l'utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour poser une question et obtenir une réponse
function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== GÉNÉRATEUR DE BALISES META ==='));
  console.log(chalk.blue('Cet outil vous aide à générer des balises meta pour vos pages'));
  console.log('');

  try {
    // Demander les informations nécessaires
    const pagePath = await question('Chemin de la page (ex: src/pages/about.astro): ');
    const title = await question('Titre de la page: ');
    const description = await question('Description de la page: ');
    const image = await question('Image (chemin relatif, laisser vide pour utiliser l\'image par défaut): ');
    const type = await question('Type de page (article, project, person): ');
    
    // Générer les balises meta
    const metaTags = generateMetaTags(title, description, image || '/assets/social-preview.jpg', type);
    
    // Afficher les balises générées
    console.log(chalk.green.bold('\nBalises meta générées:'));
    console.log(metaTags);
    
    // Demander si l'utilisateur veut ajouter ces balises à un fichier
    const addToFile = await question('\nVoulez-vous ajouter ces balises à un fichier? (o/n): ');
    
    if (addToFile.toLowerCase() === 'o') {
      // Vérifier si le fichier existe
      try {
        await fs.access(pagePath);
        
        // Lire le contenu du fichier
        const content = await fs.readFile(pagePath, 'utf-8');
        
        // Vérifier si le fichier contient déjà des balises meta
        if (content.includes('<title>') || content.includes('title={') || 
            content.includes('name="description"') || content.includes('description={')) {
          console.log(chalk.yellow('Attention: Le fichier contient déjà des balises meta.'));
          const overwrite = await question('Voulez-vous remplacer les balises existantes? (o/n): ');
          
          if (overwrite.toLowerCase() !== 'o') {
            console.log(chalk.yellow('Opération annulée.'));
            rl.close();
            return;
          }
        }
        
        // Ajouter les balises meta au fichier
        // Cette partie est simplifiée et pourrait nécessiter une logique plus complexe
        // selon la structure exacte de vos fichiers Astro
        let updatedContent;
        
        if (content.includes('<head>')) {
          // Si le fichier a une balise head, ajouter les balises meta à l'intérieur
          updatedContent = content.replace('</head>', `${metaTags}\n</head>`);
        } else if (content.includes('---')) {
          // Si c'est un fichier Astro avec frontmatter, ajouter les propriétés
          const [frontmatter, ...rest] = content.split('---');
          updatedContent = `${frontmatter}
title: "${title}",
description: "${description}",
image: "${image || '/assets/social-preview.jpg'}",
schemaType: "${type}",
---${rest.join('---')}`;
        } else {
          console.log(chalk.red('Impossible de déterminer où ajouter les balises meta dans ce fichier.'));
          rl.close();
          return;
        }
        
        // Écrire le contenu mis à jour
        await fs.writeFile(pagePath, updatedContent, 'utf-8');
        console.log(chalk.green(`Balises meta ajoutées à ${pagePath}`));
      } catch (error) {
        console.log(chalk.red(`Erreur: Le fichier ${pagePath} n'existe pas ou n'est pas accessible.`));
      }
    }
    
  } catch (error) {
    console.error(chalk.red('Erreur:'), error);
  } finally {
    rl.close();
  }
}

// Générer les balises meta
function generateMetaTags(title, description, image, type) {
  return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonicalSiteUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${canonicalSiteUrl}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${image}" />

<!-- Schema.org -->
<SchemaOrg
  type="${type}"
  name="${title}"
  description="${description}"
  image="${image}"
  datePublished={new Date().toISOString()}
  dateModified={new Date().toISOString()}
/>`;
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
  rl.close();
  process.exit(1);
});
