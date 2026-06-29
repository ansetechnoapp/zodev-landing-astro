// Internal Linking Optimization Script
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const contentDir = path.join(srcDir, 'content');

// Internal linking strategy configuration
const LINKING_CONFIG = {
  // Keywords that should link to specific pages
  keywordLinks: {
    'React': '/work/?filter=react',
    'React Native': '/work/?filter=mobile',
    'Astro.js': '/work/?filter=web',
    'Next.js': '/work/?filter=web',
    'TypeScript': '/work/?filter=web',
    'développement web': '/work/?filter=web',
    'développement mobile': '/work/?filter=mobile',
    'portfolio': '/work/',
    'projets': '/work/',
    'contact': '/contact/',
    'services': '/services/',
  },
  
  // Related project suggestions based on technology
  relatedProjects: {
    'react': ['next.js', 'typescript', 'javascript'],
    'react-native': ['mobile', 'javascript', 'typescript'],
    'astro': ['web', 'javascript', 'typescript'],
    'laravel': ['php', 'mysql', 'web'],
    'wordpress': ['php', 'web', 'cms'],
  },
  
  // Anchor text variations for natural linking
  anchorVariations: {
    '/work/': [
      'mes projets',
      'portfolio',
      'réalisations',
      'travaux récents',
      'projets développés'
    ],
    '/services/': [
      'mes services',
      'prestations',
      'services proposés',
      'offres de développement'
    ],
    '/contact/': [
      'me contacter',
      'prendre contact',
      'discuter du projet',
      'demander un devis'
    ]
  }
};

// Main internal linking optimization function
async function optimizeInternalLinking() {
  console.log(chalk.blue.bold('🔗 INTERNAL LINKING OPTIMIZATION'));
  console.log(chalk.blue('Analyzing and optimizing internal links for better SEO'));
  console.log('');

  try {
    // 1. Analyze current internal links
    const linkAnalysis = await analyzeCurrentLinks();
    
    // 2. Generate linking opportunities
    const opportunities = await generateLinkingOpportunities();
    
    // 3. Create related content suggestions
    const relatedContent = await generateRelatedContentSuggestions();
    
    // 4. Display recommendations
    displayLinkingRecommendations(linkAnalysis, opportunities, relatedContent);
    
  } catch (error) {
    console.error(chalk.red('Error optimizing internal linking:'), error);
  }
}

// Analyze current internal links
async function analyzeCurrentLinks() {
  console.log(chalk.yellow.bold('🔍 Analyzing Current Internal Links'));
  
  const analysis = {
    totalLinks: 0,
    internalLinks: 0,
    externalLinks: 0,
    brokenLinks: [],
    linkDistribution: {},
    orphanPages: []
  };
  
  // Get all content files
  const astroFiles = await glob('**/*.astro', { cwd: srcDir });
  const mdFiles = await glob('**/*.md', { cwd: contentDir });
  
  const allFiles = [
    ...astroFiles.map(f => ({ file: f, dir: srcDir, type: 'astro' })),
    ...mdFiles.map(f => ({ file: f, dir: contentDir, type: 'md' }))
  ];
  
  for (const { file, dir, type } of allFiles) {
    const filePath = path.join(dir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Find all links
    const linkMatches = content.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>/g);
    
    for (const match of linkMatches) {
      const href = match[1];
      analysis.totalLinks++;
      
      if (href.startsWith('/') || href.startsWith('#')) {
        analysis.internalLinks++;
        
        // Track link distribution
        const targetPage = href.split('?')[0].split('#')[0];
        analysis.linkDistribution[targetPage] = (analysis.linkDistribution[targetPage] || 0) + 1;
      } else if (href.startsWith('http')) {
        analysis.externalLinks++;
      }
    }
  }
  
  console.log(chalk.green(`✓ Analyzed ${allFiles.length} files`));
  console.log(chalk.blue(`  📊 Total links: ${analysis.totalLinks}`));
  console.log(chalk.blue(`  🏠 Internal links: ${analysis.internalLinks}`));
  console.log(chalk.blue(`  🌐 External links: ${analysis.externalLinks}`));
  
  return analysis;
}

// Generate linking opportunities
async function generateLinkingOpportunities() {
  console.log(chalk.yellow.bold('💡 Generating Linking Opportunities'));
  
  const opportunities = [];
  
  // Analyze content for keyword opportunities
  const mdFiles = await glob('**/*.md', { cwd: contentDir });
  
  for (const file of mdFiles) {
    const filePath = path.join(contentDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Remove frontmatter
    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');
    
    // Check for keyword opportunities
    for (const [keyword, targetUrl] of Object.entries(LINKING_CONFIG.keywordLinks)) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = contentWithoutFrontmatter.match(regex);
      
      if (matches && matches.length > 0) {
        // Check if already linked
        const linkedRegex = new RegExp(`<a[^>]*>${keyword}</a>`, 'gi');
        const alreadyLinked = contentWithoutFrontmatter.match(linkedRegex);
        
        if (!alreadyLinked || alreadyLinked.length < matches.length) {
          opportunities.push({
            file: file,
            keyword: keyword,
            targetUrl: targetUrl,
            occurrences: matches.length,
            alreadyLinked: alreadyLinked ? alreadyLinked.length : 0,
            suggestion: `Link "${keyword}" to ${targetUrl}`
          });
        }
      }
    }
  }
  
  console.log(chalk.green(`✓ Found ${opportunities.length} linking opportunities`));
  return opportunities;
}

// Generate related content suggestions
async function generateRelatedContentSuggestions() {
  console.log(chalk.yellow.bold('🎯 Generating Related Content Suggestions'));
  
  const suggestions = [];
  
  // Analyze work projects for related content
  const workFiles = await glob('**/*.md', { cwd: path.join(contentDir, 'work') });
  
  for (const file of workFiles) {
    const filePath = path.join(contentDir, 'work', file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    
    const frontmatter = frontmatterMatch[1];
    
    // Extract technologies
    const techMatch = frontmatter.match(/tech:\s*\n((?:\s*-\s*.+\n?)*)/);
    const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n?)*)/);
    
    let technologies = [];
    if (techMatch) {
      technologies = techMatch[1].match(/- (.+)/g)?.map(t => t.replace('- ', '').toLowerCase()) || [];
    }
    
    let tags = [];
    if (tagsMatch) {
      tags = tagsMatch[1].match(/- (.+)/g)?.map(t => t.replace('- ', '').toLowerCase()) || [];
    }
    
    // Find related projects
    const relatedProjects = [];
    const allTechs = [...technologies, ...tags];
    
    for (const tech of allTechs) {
      if (LINKING_CONFIG.relatedProjects[tech]) {
        relatedProjects.push(...LINKING_CONFIG.relatedProjects[tech]);
      }
    }
    
    if (relatedProjects.length > 0) {
      suggestions.push({
        file: file,
        technologies: technologies,
        tags: tags,
        relatedTechnologies: [...new Set(relatedProjects)],
        suggestion: 'Add "Related Projects" section with internal links'
      });
    }
  }
  
  console.log(chalk.green(`✓ Generated ${suggestions.length} related content suggestions`));
  return suggestions;
}

// Display linking recommendations
function displayLinkingRecommendations(analysis, opportunities, relatedContent) {
  console.log('\n' + chalk.blue.bold('🔗 INTERNAL LINKING RECOMMENDATIONS'));
  console.log('='.repeat(60));
  
  // Current state summary
  console.log(chalk.green.bold('\n📊 Current Link Analysis:'));
  console.log(`Total links found: ${analysis.totalLinks}`);
  console.log(`Internal links: ${analysis.internalLinks}`);
  console.log(`External links: ${analysis.externalLinks}`);
  console.log(`Internal/External ratio: ${(analysis.internalLinks / analysis.externalLinks).toFixed(2)}`);
  
  // Most linked pages
  console.log(chalk.green.bold('\n🎯 Most Linked Pages:'));
  const sortedPages = Object.entries(analysis.linkDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  sortedPages.forEach(([page, count]) => {
    console.log(`  ${page}: ${count} links`);
  });
  
  // Linking opportunities
  if (opportunities.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Keyword Linking Opportunities:'));
    opportunities.slice(0, 10).forEach(opp => {
      console.log(chalk.blue(`\n📄 ${opp.file}:`));
      console.log(`  🔑 Keyword: "${opp.keyword}"`);
      console.log(`  🎯 Target: ${opp.targetUrl}`);
      console.log(`  📈 Occurrences: ${opp.occurrences}`);
      console.log(`  🔗 Already linked: ${opp.alreadyLinked}`);
      console.log(chalk.green(`  💡 ${opp.suggestion}`));
    });
    
    if (opportunities.length > 10) {
      console.log(chalk.gray(`\n... and ${opportunities.length - 10} more opportunities`));
    }
  }
  
  // Related content suggestions
  if (relatedContent.length > 0) {
    console.log(chalk.cyan.bold('\n🎯 Related Content Suggestions:'));
    relatedContent.slice(0, 5).forEach(suggestion => {
      console.log(chalk.blue(`\n📄 ${suggestion.file}:`));
      console.log(`  🛠️  Technologies: ${suggestion.technologies.join(', ')}`);
      console.log(`  🏷️  Tags: ${suggestion.tags.join(', ')}`);
      console.log(`  🔗 Related: ${suggestion.relatedTechnologies.join(', ')}`);
      console.log(chalk.green(`  💡 ${suggestion.suggestion}`));
    });
  }
  
  // General recommendations
  console.log(chalk.green.bold('\n🚀 General Recommendations:'));
  console.log('1. Add contextual links within project descriptions');
  console.log('2. Create "Related Projects" sections in project pages');
  console.log('3. Link to relevant services from project case studies');
  console.log('4. Add navigation breadcrumbs for better user experience');
  console.log('5. Implement "You might also like" suggestions');
  console.log('6. Create topic clusters around main technologies');
  console.log('7. Add call-to-action links in strategic locations');
  console.log('8. Link to contact page from project showcases');
  
  // Implementation tips
  console.log(chalk.blue.bold('\n🛠️  Implementation Tips:'));
  console.log('• Use descriptive anchor text that includes target keywords');
  console.log('• Vary anchor text to avoid over-optimization');
  console.log('• Link to relevant pages naturally within content');
  console.log('• Add internal links in the first paragraph when possible');
  console.log('• Create hub pages that link to related content');
  console.log('• Use "nofollow" for external links when appropriate');
  
  console.log('\n' + chalk.green.bold('✅ Internal linking analysis completed!'));
}

// Run the internal linking optimization
optimizeInternalLinking().catch(error => {
  console.error(chalk.red('Failed to optimize internal linking:'), error);
});
