// Script pour télécharger Font Awesome localement
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
const fontAwesomeDir = path.join(publicDir, 'assets/fontawesome');

// URL de Font Awesome CSS
const fontAwesomeCssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

// Fonction pour télécharger un fichier
async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.open(outputPath, 'w').then(fileHandle => fileHandle.createWriteStream());
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', err => {
        fs.unlink(outputPath);
        reject(err);
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

// Fonction pour extraire les URLs des webfonts depuis le CSS
async function extractWebfontUrls(cssPath) {
  const css = await fs.readFile(cssPath, 'utf-8');
  const urlRegex = /url\(['"]?(https:\/\/[^'"]+\.(?:woff2?|eot|ttf|svg)[^'")]*)/g;
  const urls = [];
  let match;
  
  while ((match = urlRegex.exec(css)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// Fonction pour remplacer les URLs dans le CSS
async function replaceUrlsInCss(cssPath, urlMap) {
  let css = await fs.readFile(cssPath, 'utf-8');
  
  for (const [originalUrl, localPath] of Object.entries(urlMap)) {
    const relativePath = path.relative(path.dirname(cssPath), localPath);
    css = css.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), relativePath);
  }
  
  await fs.writeFile(cssPath, css);
}

// Fonction principale
async function main() {
  try {
    // Créer le répertoire pour Font Awesome
    await fs.mkdir(fontAwesomeDir, { recursive: true });
    await fs.mkdir(path.join(fontAwesomeDir, 'webfonts'), { recursive: true });
    
    // Télécharger le CSS
    const cssOutputPath = path.join(fontAwesomeDir, 'all.min.css');
    console.log(`Téléchargement de ${fontAwesomeCssUrl} vers ${cssOutputPath}`);
    await downloadFile(fontAwesomeCssUrl, cssOutputPath);
    
    // Extraire les URLs des webfonts
    const webfontUrls = await extractWebfontUrls(cssOutputPath);
    console.log(`${webfontUrls.length} webfonts trouvées dans le CSS`);
    
    // Télécharger les webfonts
    const urlMap = {};
    for (const url of webfontUrls) {
      const filename = path.basename(url.split('?')[0]);
      const outputPath = path.join(fontAwesomeDir, 'webfonts', filename);
      console.log(`Téléchargement de ${url} vers ${outputPath}`);
      await downloadFile(url, outputPath);
      urlMap[url] = outputPath;
    }
    
    // Remplacer les URLs dans le CSS
    await replaceUrlsInCss(cssOutputPath, urlMap);
    
    console.log('Font Awesome a été téléchargé avec succès!');
  } catch (error) {
    console.error('Erreur lors du téléchargement de Font Awesome:', error);
  }
}

main();
