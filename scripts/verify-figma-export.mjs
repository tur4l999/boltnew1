#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { figmaRoutes } from './figma.routes.js';

const EXPORT_DIR = 'dist/figma-export';

console.log('🔍 Verifying Figma Export...');

let errors = 0;
let warnings = 0;

// Check if export directory exists
if (!existsSync(EXPORT_DIR)) {
  console.error('❌ Export directory not found:', EXPORT_DIR);
  process.exit(1);
}

// Check index.html
const indexPath = join(EXPORT_DIR, 'index.html');
if (!existsSync(indexPath)) {
  console.error('❌ Gallery index.html not found');
  errors++;
} else {
  const indexContent = readFileSync(indexPath, 'utf8');
  if (!indexContent.includes('DDA.az Design System')) {
    console.error('❌ Gallery index.html missing title');
    errors++;
  } else {
    console.log('✅ Gallery index.html verified');
  }
}

// Check manifest
const manifestPath = join(EXPORT_DIR, 'figma-manifest.json');
if (!existsSync(manifestPath)) {
  console.error('❌ Manifest file not found');
  errors++;
} else {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (manifest.screens !== figmaRoutes.length) {
      console.warn(`⚠️  Manifest shows ${manifest.screens} screens, expected ${figmaRoutes.length}`);
      warnings++;
    } else {
      console.log('✅ Manifest verified');
    }
  } catch (error) {
    console.error('❌ Invalid manifest JSON:', error.message);
    errors++;
  }
}

// Check individual screen files
let screenFiles = 0;
for (const route of figmaRoutes) {
  const screenPath = join(EXPORT_DIR, `${route.id}.html`);
  if (!existsSync(screenPath)) {
    console.error(`❌ Screen file missing: ${route.id}.html`);
    errors++;
  } else {
    const content = readFileSync(screenPath, 'utf8');
    
    // Basic content checks
    if (!content.includes('<!DOCTYPE html>')) {
      console.error(`❌ ${route.id}.html missing DOCTYPE`);
      errors++;
    }
    
    if (!content.includes('figma-export')) {
      console.error(`❌ ${route.id}.html missing figma-export class`);
      errors++;
    }
    
    if (!content.includes(route.name)) {
      console.warn(`⚠️  ${route.id}.html might be missing screen title`);
      warnings++;
    }
    
    screenFiles++;
  }
}

console.log(`✅ ${screenFiles}/${figmaRoutes.length} screen files verified`);

// Check assets
const assetsDir = join(EXPORT_DIR, 'assets');
if (existsSync(assetsDir)) {
  const assetFiles = readdirSync(assetsDir);
  console.log(`✅ ${assetFiles.length} asset files found`);
} else {
  console.warn('⚠️  No assets directory found');
  warnings++;
}

// Summary
console.log('');
console.log('📊 Verification Summary:');
console.log(`   📁 Export directory: ${EXPORT_DIR}`);
console.log(`   📱 Screen files: ${screenFiles}/${figmaRoutes.length}`);
console.log(`   ❌ Errors: ${errors}`);
console.log(`   ⚠️  Warnings: ${warnings}`);

if (errors === 0) {
  console.log('');
  console.log('🎉 Export verification passed!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('   1. Run "npm run preview:figma" to start preview server');
  console.log('   2. Open http://localhost:5173/figma-export/ in browser');
  console.log('   3. Use html.to.design plugin to import screens');
  console.log('');
  console.log('🔗 Import Methods:');
  console.log('   🌐 Web: Deploy and paste URL into html.to.design');
  console.log('   📁 File: Drag index.html into plugin');
  console.log('   🔌 Extension: Use html.to.design Chrome extension');
} else {
  console.log('');
  console.log('❌ Export verification failed!');
  console.log('   Please fix the errors above and run verification again.');
  process.exit(1);
}