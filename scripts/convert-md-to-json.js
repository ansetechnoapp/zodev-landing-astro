/**
 * Script to convert Markdown files to JSON
 * 
 * This script reads all .md and .mdx files from src/content/blog,
 * converts them to JSON format, and saves them to src/data/blog.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const contentDir = path.join(__dirname, '..', 'src', 'content', 'blog');
const outputDir = path.join(__dirname, '..', 'src', 'data', 'blog');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to convert a single markdown file to JSON
function convertMarkdownToJson(filePath) {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);
    
    // Convert dates to ISO strings for JSON serialization
    const serializedFrontmatter = { ...frontmatter };
    if (serializedFrontmatter.pubDate instanceof Date) {
      serializedFrontmatter.pubDate = serializedFrontmatter.pubDate.toISOString();
    }
    if (serializedFrontmatter.updatedDate instanceof Date) {
      serializedFrontmatter.updatedDate = serializedFrontmatter.updatedDate.toISOString();
    }
    
    // Convert markdown content to HTML
    const htmlContent = marked(content);
    
    // Create the JSON object
    const jsonData = {
      ...serializedFrontmatter,
      content: htmlContent,
      // Add the original markdown content for reference if needed
      markdown: content,
      // Add the slug (filename without extension)
      slug: path.basename(filePath, path.extname(filePath))
    };
    
    return jsonData;
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
    return null;
  }
}

// Function to process all markdown files
function processMarkdownFiles() {
  try {
    // Get all .md and .mdx files
    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    console.log(`Found ${files.length} markdown files to convert.`);
    
    // Convert each file and save as JSON
    const allPosts = [];
    
    files.forEach(file => {
      const filePath = path.join(contentDir, file);
      const jsonData = convertMarkdownToJson(filePath);
      
      if (jsonData) {
        // Save individual post JSON
        const outputPath = path.join(outputDir, `${jsonData.slug}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
        console.log(`Converted ${file} to ${outputPath}`);
        
        // Add to collection of all posts
        allPosts.push(jsonData);
      }
    });
    
    // Save all posts as a single JSON file
    const allPostsPath = path.join(outputDir, 'all-posts.json');
    fs.writeFileSync(allPostsPath, JSON.stringify(allPosts, null, 2));
    console.log(`Created combined file at ${allPostsPath}`);
    
    console.log('Conversion complete!');
  } catch (error) {
    console.error('Error processing markdown files:', error);
  }
}

// Run the conversion
processMarkdownFiles();
