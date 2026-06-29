/**
 * Script to remove Markdown files after verifying JSON conversion
 *
 * This script checks if all Markdown files in src/content/blog have been
 * successfully converted to JSON in src/data/blog, and then removes the
 * original Markdown files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const contentDir = path.join(__dirname, '..', 'src', 'content', 'blog');
const dataDir = path.join(__dirname, '..', 'src', 'data', 'blog');

// Function to verify JSON files exist for all Markdown files
function verifyConversion() {
  try {
    // Get all Markdown files
    const markdownFiles = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

    // Get all JSON files
    const jsonFiles = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json') && file !== 'all-posts.json');

    // Check if each Markdown file has a corresponding JSON file
    const missingFiles = [];

    for (const mdFile of markdownFiles) {
      const baseName = path.basename(mdFile, path.extname(mdFile));
      const jsonFile = `${baseName}.json`;

      if (!jsonFiles.includes(jsonFile)) {
        missingFiles.push(mdFile);
      }
    }

    if (missingFiles.length > 0) {
      console.error('The following Markdown files have not been converted to JSON:');
      missingFiles.forEach(file => console.error(`- ${file}`));
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying conversion:', error);
    return false;
  }
}

// Function to remove Markdown files
function removeMarkdownFiles() {
  try {
    // Get all Markdown files
    const markdownFiles = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

    console.log(`Found ${markdownFiles.length} Markdown files to remove.`);

    // Remove each file
    for (const file of markdownFiles) {
      const filePath = path.join(contentDir, file);
      fs.unlinkSync(filePath);
      console.log(`Removed ${file}`);
    }

    console.log('All Markdown files have been removed.');
    return true;
  } catch (error) {
    console.error('Error removing Markdown files:', error);
    return false;
  }
}

// Main function
function main() {
  console.log('Verifying JSON conversion...');

  if (verifyConversion()) {
    console.log('All Markdown files have been successfully converted to JSON.');

    // In ES modules, we'll just remove the files without asking for confirmation
    // since this is a script specifically for cleanup
    console.log('Removing original Markdown files...');
    removeMarkdownFiles();
  } else {
    console.error('Conversion verification failed. Please fix the issues before removing Markdown files.');
  }
}

// Run the script
main();
