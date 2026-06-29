// Script pour vérifier et corriger automatiquement les problèmes SEO courants
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import { parseHTML } from 'linkedom';
import { canonicalSiteUrl } from '../src/config/site.js';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'src/pages');
const componentsDir = path.join(rootDir, 'src/components');
const contentDir = path.join(rootDir, 'src/content');
const publicDir = path.join(rootDir, 'public');

// Configuration SEO
const seoConfig = {
  titleMinLength: 10,
  titleMaxLength: 60,
  descriptionMinLength: 50,
  descriptionMaxLength: 160,
  imgAltRequired: true,
  headingStructureRequired: true,
  canonicalRequired: true,
  schemaOrgRequired: true
};

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== CORRECTION AUTOMATIQUE DES PROBLÈMES SEO ==='));
  console.log(chalk.blue('Vérification et correction des problèmes SEO courants'));
  console.log('');

  try {
    // 1. Vérifier et corriger les balises meta
    await fixMetaTags();

    // 2. Vérifier et corriger les attributs alt des images
    await fixImageAltAttributes();

    // 3. Vérifier et corriger les liens canoniques
    await fixCanonicalLinks();

    // 4. Vérifier et corriger les données structurées Schema.org
    await fixSchemaOrg();

    console.log('');
    console.log(chalk.green.bold('✓ Corrections SEO terminées avec succès'));
  } catch (error) {
    console.error(chalk.red('Erreur lors des corrections SEO:'), error);
  }
}

// Vérifier et corriger les balises meta
async function fixMetaTags() {
  console.log(chalk.yellow.bold('1. Vérification et correction des balises meta'));

  // Vérifier le composant MainHead.astro
  const mainHeadPath = path.join(componentsDir, 'MainHead.astro');
  
  try {
    const content = await fs.readFile(mainHeadPath, 'utf-8');
    
    // Vérifier les balises meta essentielles
    let updatedContent = content;
    let changes = 0;

    // Vérifier la balise title
    if (!content.includes('<title>') && !content.includes('title={')) {
      console.log(chalk.yellow('Balise title manquante dans MainHead.astro'));
      // Ajouter une balise title de base
      updatedContent = updatedContent.replace(
        '<meta charset="UTF-8" />',
        '<meta charset="UTF-8" />\n<title>{title}</title>'
      );
      changes++;
    }

    // Vérifier la meta description
    if (!content.includes('name="description"') && !content.includes('description={')) {
      console.log(chalk.yellow('Meta description manquante dans MainHead.astro'));
      // Ajouter une meta description de base
      updatedContent = updatedContent.replace(
        '<meta charset="UTF-8" />',
        '<meta charset="UTF-8" />\n<meta name="description" content={description} />'
      );
      changes++;
    }

    // Vérifier les balises Open Graph
    if (!content.includes('property="og:')) {
      console.log(chalk.yellow('Balises Open Graph manquantes dans MainHead.astro'));
      // Ajouter des balises Open Graph de base
      const ogTags = `
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={socialImageURL} />`;
      
      updatedContent = updatedContent.replace(
        '</head>',
        `${ogTags}\n</head>`
      );
      changes++;
    }

    // Vérifier les balises Twitter Card
    if (!content.includes('property="twitter:') && !content.includes('name="twitter:')) {
      console.log(chalk.yellow('Balises Twitter Card manquantes dans MainHead.astro'));
      // Ajouter des balises Twitter Card de base
      const twitterTags = `
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={socialImageURL} />`;
      
      updatedContent = updatedContent.replace(
        '</head>',
        `${twitterTags}\n</head>`
      );
      changes++;
    }

    // Enregistrer les modifications si nécessaire
    if (changes > 0) {
      await fs.writeFile(mainHeadPath, updatedContent, 'utf-8');
      console.log(chalk.green(`${changes} corrections apportées à MainHead.astro`));
    } else {
      console.log(chalk.green('Aucune correction nécessaire pour les balises meta.'));
    }
    
  } catch (error) {
    console.log(chalk.red('Erreur lors de la vérification des balises meta:'), error.message);
  }
}

// Vérifier et corriger les attributs alt des images
async function fixImageAltAttributes() {
  console.log(chalk.yellow.bold('\n2. Vérification et correction des attributs alt des images'));

  // Trouver tous les fichiers .astro
  const astroFiles = await glob('**/*.astro', { cwd: rootDir });
  let totalFixes = 0;

  for (const relativeFile of astroFiles) {
    const file = path.join(rootDir, relativeFile);
    
    try {
      const content = await fs.readFile(file, 'utf-8');
      
      // Rechercher les balises img sans attribut alt
      const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*(?!alt=)[^>]*\/?>/g;
      const matches = [...content.matchAll(imgRegex)];
      
      if (matches.length > 0) {
        console.log(chalk.yellow(`${matches.length} images sans attribut alt trouvées dans ${relativeFile}`));
        
        let updatedContent = content;
        
        for (const match of matches) {
          const imgTag = match[0];
          const src = match[1];
          
          // Générer un alt basé sur le nom du fichier
          const fileName = path.basename(src, path.extname(src));
          const altText = fileName
            .replace(/[-_]/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, c => c.toUpperCase());
          
          // Ajouter l'attribut alt
          const fixedImgTag = imgTag.replace(
            /(<img[^>]*)(\/?>)/,
            `$1 alt="${altText}" $2`
          );
          
          updatedContent = updatedContent.replace(imgTag, fixedImgTag);
          totalFixes++;
        }
        
        // Enregistrer les modifications
        await fs.writeFile(file, updatedContent, 'utf-8');
      }
    } catch (error) {
      console.log(chalk.red(`Erreur lors de la vérification des images dans ${relativeFile}:`), error.message);
    }
  }

  if (totalFixes > 0) {
    console.log(chalk.green(`${totalFixes} attributs alt ajoutés aux images.`));
  } else {
    console.log(chalk.green('Toutes les images ont déjà des attributs alt.'));
  }
}

// Vérifier et corriger les liens canoniques
async function fixCanonicalLinks() {
  console.log(chalk.yellow.bold('\n3. Vérification et correction des liens canoniques'));

  // Vérifier le composant MainHead.astro
  const mainHeadPath = path.join(componentsDir, 'MainHead.astro');
  
  try {
    const content = await fs.readFile(mainHeadPath, 'utf-8');
    
    // Vérifier si le lien canonique existe
    if (!content.includes('rel="canonical"')) {
      console.log(chalk.yellow('Lien canonique manquant dans MainHead.astro'));
      
      // Ajouter un lien canonique
      let updatedContent = content;
      
      // Vérifier si canonicalURL est déjà défini dans les props
      if (!content.includes('canonicalURL')) {
        // Ajouter canonicalURL aux props
        updatedContent = updatedContent.replace(
          /const\s*{([^}]*)}\s*=\s*Astro\.props;/,
          'const {$1, canonicalURL = new URL(Astro.url.pathname, Astro.site)} = Astro.props;'
        );
      }
      
      // Ajouter la balise link canonical
      updatedContent = updatedContent.replace(
        '<!-- Primary Meta Tags -->',
        '<!-- Primary Meta Tags -->\n<link rel="canonical" href={canonicalURL} />'
      );
      
      // Enregistrer les modifications
      await fs.writeFile(mainHeadPath, updatedContent, 'utf-8');
      console.log(chalk.green('Lien canonique ajouté à MainHead.astro'));
    } else {
      console.log(chalk.green('Le lien canonique existe déjà.'));
    }
    
  } catch (error) {
    console.log(chalk.red('Erreur lors de la vérification des liens canoniques:'), error.message);
  }
}

// Vérifier et corriger les données structurées Schema.org
async function fixSchemaOrg() {
  console.log(chalk.yellow.bold('\n4. Vérification et correction des données structurées Schema.org'));

  // Vérifier si le composant SchemaOrg.astro existe
  const schemaOrgPath = path.join(componentsDir, 'SchemaOrg.astro');
  
  try {
    await fs.access(schemaOrgPath);
    console.log(chalk.green('Le composant SchemaOrg.astro existe déjà.'));
    
    // Vérifier si le composant est utilisé dans MainHead.astro
    const mainHeadPath = path.join(componentsDir, 'MainHead.astro');
    const mainHeadContent = await fs.readFile(mainHeadPath, 'utf-8');
    
    if (!mainHeadContent.includes('SchemaOrg') && !mainHeadContent.includes('application/ld+json')) {
      console.log(chalk.yellow('SchemaOrg n\'est pas utilisé dans MainHead.astro'));
      
      // Ajouter l'import de SchemaOrg
      let updatedContent = mainHeadContent;
      
      if (!updatedContent.includes('import SchemaOrg')) {
        updatedContent = updatedContent.replace(
          /---/,
          '---\nimport SchemaOrg from "./SchemaOrg.astro";'
        );
      }
      
      // Ajouter le composant SchemaOrg
      updatedContent = updatedContent.replace(
        '</head>',
        `<!-- Schema.org Structured Data -->
<SchemaOrg
  type={schemaType || "Person"}
  name={title}
  description={description}
  image={image}
  datePublished={new Date().toISOString()}
  dateModified={new Date().toISOString()}
  url={canonicalURL}
/>
</head>`
      );
      
      // Vérifier si schemaType est défini dans les props
      if (!updatedContent.includes('schemaType')) {
        updatedContent = updatedContent.replace(
          /const\s*{([^}]*)}\s*=\s*Astro\.props;/,
          'const {$1, schemaType = "Person"} = Astro.props;'
        );
      }
      
      // Enregistrer les modifications
      await fs.writeFile(mainHeadPath, updatedContent, 'utf-8');
      console.log(chalk.green('SchemaOrg ajouté à MainHead.astro'));
    } else {
      console.log(chalk.green('SchemaOrg est déjà utilisé dans MainHead.astro'));
    }
    
  } catch (error) {
    // Le composant SchemaOrg.astro n'existe pas, le créer
    console.log(chalk.yellow('Le composant SchemaOrg.astro n\'existe pas, création en cours...'));
    
    // Contenu de base pour SchemaOrg.astro
    const schemaOrgContent = `---
// Composant pour les données structurées Schema.org
interface Props {
  type?: string;
  name?: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string | URL;
}

const {
  type = "Person",
  name = "Portfolio",
  description = "Portfolio personnel",
  image = "/assets/social-preview.jpg",
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  url = Astro.site?.toString() || "${canonicalSiteUrl}",
} = Astro.props;

// Données de base pour une personne (portfolio personnel)
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: name,
  description: description,
  image: typeof image === "string" ? new URL(image, Astro.site).href : image,
  url: url,
  jobTitle: "Développeur Web & Mobile Freelance",
};

// Données pour un article de blog
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: name,
  description: description,
  image: typeof image === "string" ? new URL(image, Astro.site).href : image,
  datePublished: datePublished,
  dateModified: dateModified,
  author: {
    "@type": "Person",
    name: name,
    url: url,
  },
  publisher: {
    "@type": "Organization",
    name: "zoddev",
    logo: {
      "@type": "ImageObject",
      url: new URL("/assets/zoddev_logo/zoddev_logo_dark_mode.png", Astro.site)
        .href,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
};

// Données pour un projet (CreativeWork)
const projectSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: name,
  description: description,
  image: typeof image === "string" ? new URL(image, Astro.site).href : image,
  datePublished: datePublished,
  dateModified: dateModified,
  author: {
    "@type": "Person",
    name: name,
    url: url,
  },
  url: url,
};

// Sélectionner le schéma approprié en fonction du type
let schema;
switch (type) {
  case "Article":
    schema = articleSchema;
    break;
  case "CreativeWork":
  case "Project":
    schema = projectSchema;
    break;
  case "Person":
  default:
    schema = personSchema;
}
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
`;
    
    // Créer le fichier SchemaOrg.astro
    await fs.writeFile(schemaOrgPath, schemaOrgContent, 'utf-8');
    console.log(chalk.green('Composant SchemaOrg.astro créé avec succès.'));
    
    // Ajouter SchemaOrg à MainHead.astro
    await fixSchemaOrg(); // Appel récursif pour ajouter SchemaOrg à MainHead.astro
  }
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
  process.exit(1);
});
