#!/usr/bin/env node
/**
 * Vercel deployment preparation script
 * Ensures all assets are properly optimized and references are correct before deployment
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

/**
 * Check if all referenced background images exist
 */
async function checkBackgroundImages() {
  console.log('🔍 Checking background image references...');
  
  const layoutPath = path.join(rootDir, 'src/layouts/Layout.astro');
  const publicDir = path.join(rootDir, 'public');
  
  try {
    const layoutContent = await fs.readFile(layoutPath, 'utf-8');
    
    // Extract all background image URLs
    const urlPattern = /url\(["']?([^"')\s]+)["']?\)/g;
    const urls = [];
    let match;
    
    while ((match = urlPattern.exec(layoutContent)) !== null) {
      if (match[1].includes('/assets/backgrounds/') && !match[1].includes('.svg')) {
        urls.push(match[1]);
      }
    }
    
    console.log(`Found ${urls.length} background image references`);
    
    // Check if files exist
    const missingFiles = [];
    for (const url of urls) {
      const filePath = path.join(publicDir, url);
      try {
        await fs.access(filePath);
        console.log(`✅ ${url}`);
      } catch {
        missingFiles.push(url);
        console.log(`❌ ${url} - MISSING`);
      }
    }
    
    if (missingFiles.length > 0) {
      console.log(`\n⚠️  ${missingFiles.length} background images are missing!`);
      return false;
    }
    
    console.log('✅ All background images found');
    return true;
    
  } catch (error) {
    console.error('Error checking background images:', error);
    return false;
  }
}

/**
 * Verify environment variables
 */
async function checkEnvironmentVariables() {
  console.log('\n🔍 Checking environment variables...');

  const requiredVars = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY'
  ];

  // Check if .env file exists
  try {
    const envPath = path.join(rootDir, '.env');
    const envContent = await fs.readFile(envPath, 'utf-8');

    const hasSupabaseUrl = envContent.includes('PUBLIC_SUPABASE_URL');
    const hasSupabaseKey = envContent.includes('PUBLIC_SUPABASE_ANON_KEY');

    if (hasSupabaseUrl && hasSupabaseKey) {
      console.log('✅ Environment variables found in .env file');
      console.log('⚠️  Make sure these are also set in your Vercel dashboard under Settings > Environment Variables');
      return true;
    }
  } catch (error) {
    // .env file doesn't exist or can't be read
  }

  const missing = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.log(`⚠️  Environment variables not detected locally: ${missing.join(', ')}`);
    console.log('This is normal for local development. Make sure to set these in your Vercel dashboard under Settings > Environment Variables');
    console.log('Required variables:');
    console.log('- PUBLIC_SUPABASE_URL');
    console.log('- PUBLIC_SUPABASE_ANON_KEY');
    console.log('- NODE_ENV (set to "production")');
    return true; // Don't fail the check for missing local env vars
  }

  console.log('✅ All required environment variables are set');
  return true;
}

/**
 * Check build configuration
 */
async function checkBuildConfig() {
  console.log('\n🔍 Checking build configuration...');
  
  try {
    // Check package.json
    const packagePath = path.join(rootDir, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    if (packageJson.scripts.build !== 'astro build') {
      console.log('❌ Build script should be "astro build" for Vercel deployment');
      return false;
    }
    
    // Check vercel.json
    const vercelPath = path.join(rootDir, 'vercel.json');
    const vercelContent = await fs.readFile(vercelPath, 'utf-8');
    const vercelConfig = JSON.parse(vercelContent);
    
    if (vercelConfig.buildCommand !== 'pnpm run build') {
      console.log('❌ Vercel build command should be "pnpm run build"');
      return false;
    }
    
    console.log('✅ Build configuration is correct');
    return true;
    
  } catch (error) {
    console.error('Error checking build configuration:', error);
    return false;
  }
}

/**
 * Main deployment check function
 */
async function main() {
  console.log('🚀 Vercel Deployment Pre-check\n');
  
  const checks = [
    await checkBackgroundImages(),
    await checkEnvironmentVariables(),
    await checkBuildConfig()
  ];
  
  const allPassed = checks.every(check => check);
  
  if (allPassed) {
    console.log('\n✅ All deployment checks passed! Ready for Vercel deployment.');
    console.log('\nNext steps:');
    console.log('1. Commit your changes: git add . && git commit -m "Fix deployment issues"');
    console.log('2. Push to your repository: git push');
    console.log('3. Vercel will automatically deploy the changes');
  } else {
    console.log('\n❌ Some deployment checks failed. Please fix the issues above before deploying.');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main().catch(error => {
      console.error('❌ Deployment check failed:', error);
      process.exit(1);
    });
  }
}

export { main as vercelDeployCheck };
