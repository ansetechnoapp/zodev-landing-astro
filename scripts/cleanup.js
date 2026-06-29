// Script pour identifier et nettoyer les fichiers non utilisés
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Dossiers à analyser
const dirsToAnalyze = [
  'src',
  'public',
];

// Dossiers à ignorer
const ignoreDirs = [
  'node_modules',
  '.git',
  'dist',
  'template', // Dossier contenant les templates alternatifs
  'corbeille', // Dossier contenant les fichiers obsolètes
];

// Extensions de fichiers à analyser
const fileExtensions = [
  '.astro',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.json',
  '.md',
  '.mdx',
];

// Fonction pour lister tous les fichiers récursivement
async function listFiles(dir, fileList = []) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      // Ignorer les dossiers spécifiés
      if (file.isDirectory()) {
        if (!ignoreDirs.includes(file.name)) {
          await listFiles(fullPath, fileList);
        }
      } else {
        const ext = path.extname(file.name).toLowerCase();
        if (fileExtensions.includes(ext)) {
          fileList.push(fullPath);
        }
      }
    }
    
    return fileList;
  } catch (error) {
    console.error(`Erreur lors de la lecture du dossier ${dir}:`, error);
    return fileList;
  }
}

// Fonction pour trouver les imports dans un fichier
async function findImports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const imports = [];
    
    // Regex pour trouver les imports
    const importRegex = /import\s+(?:{[^}]*}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    
    // Trouver les imports statiques
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Trouver les imports dynamiques
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return [];
  }
}

// Fonction principale
async function main() {
  console.log('Analyse des fichiers en cours...');
  
  // Récupérer tous les fichiers
  let allFiles = [];
  for (const dir of dirsToAnalyze) {
    const dirPath = path.join(rootDir, dir);
    const files = await listFiles(dirPath);
    allFiles = [...allFiles, ...files];
  }
  
  console.log(`Nombre total de fichiers analysés: ${allFiles.length}`);
  
  // Créer un graphe de dépendances
  const dependencyGraph = {};
  const importMap = {};
  
  for (const file of allFiles) {
    const relativePath = path.relative(rootDir, file);
    dependencyGraph[relativePath] = [];
    
    const imports = await findImports(file);
    importMap[relativePath] = imports;
  }
  
  // Construire le graphe de dépendances
  for (const [file, imports] of Object.entries(importMap)) {
    for (const importPath of imports) {
      // Résoudre le chemin d'import
      let resolvedPath;
      
      if (importPath.startsWith('.')) {
        // Import relatif
        const dir = path.dirname(path.join(rootDir, file));
        resolvedPath = path.resolve(dir, importPath);
        
        // Ajouter l'extension si nécessaire
        if (!path.extname(resolvedPath)) {
          for (const ext of fileExtensions) {
            const withExt = `${resolvedPath}${ext}`;
            if (allFiles.includes(withExt)) {
              resolvedPath = withExt;
              break;
            }
            
            // Vérifier pour index.* dans le dossier
            const indexFile = path.join(resolvedPath, `index${ext}`);
            if (allFiles.includes(indexFile)) {
              resolvedPath = indexFile;
              break;
            }
          }
        }
        
        resolvedPath = path.relative(rootDir, resolvedPath);
      } else {
        // Import de package ou absolu
        resolvedPath = importPath;
      }
      
      dependencyGraph[file].push(resolvedPath);
    }
  }
  
  // Identifier les fichiers non utilisés
  const usedFiles = new Set();
  const entryPoints = [
    'src/pages/index.astro',
    'src/pages/work.astro',
    'src/pages/blog.astro',
    'src/pages/widgetCss.astro',
    // Ajouter d'autres points d'entrée si nécessaire
  ];
  
  function markAsUsed(file) {
    if (usedFiles.has(file)) return;
    
    usedFiles.add(file);
    
    // Marquer les dépendances comme utilisées
    if (dependencyGraph[file]) {
      for (const dep of dependencyGraph[file]) {
        if (dep in dependencyGraph) {
          markAsUsed(dep);
        }
      }
    }
  }
  
  // Marquer les points d'entrée et leurs dépendances comme utilisés
  for (const entry of entryPoints) {
    markAsUsed(entry);
  }
  
  // Trouver les fichiers non utilisés
  const unusedFiles = allFiles
    .map(file => path.relative(rootDir, file))
    .filter(file => !usedFiles.has(file) && !file.includes('node_modules'));
  
  console.log('\nFichiers potentiellement non utilisés:');
  unusedFiles.forEach(file => console.log(`- ${file}`));
  
  console.log(`\nNombre de fichiers potentiellement non utilisés: ${unusedFiles.length}`);
  console.log('\nNote: Cette analyse est basée sur les imports statiques et peut ne pas détecter tous les usages dynamiques.');
  console.log('Vérifiez manuellement avant de supprimer des fichiers.');
}

main().catch(console.error);
