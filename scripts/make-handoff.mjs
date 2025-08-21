#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('📦 Creating handoff package...');

// Ensure tokens are up to date
try {
  console.log('🎨 Regenerating tokens...');
  execSync('npm run tokens', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to regenerate tokens');
  process.exit(1);
}

// Create handoff directory
const handoffDir = path.join(process.cwd(), 'handoff');
fs.mkdirSync(handoffDir, { recursive: true });

// Files to include in handoff
const filesToCopy = [
  { src: 'design/tokens.json', dest: 'design/tokens.json' },
  { src: 'design/styles.css', dest: 'design/styles.css' },
  { src: 'design/screens.csv', dest: 'design/screens.csv' },
  { src: 'design/components.csv', dest: 'design/components.csv' },
  { src: 'design/assets.manifest.json', dest: 'design/assets.manifest.json' },
  { src: 'public/styles.css', dest: 'public/styles.css' },
  { src: 'src/theme.ts', dest: 'src/theme.ts' },
  { src: 'README.md', dest: 'README.md' }
];

// Copy files
filesToCopy.forEach(({ src, dest }) => {
  try {
    const srcPath = path.join(process.cwd(), src);
    const destPath = path.join(handoffDir, dest);
    
    // Create destination directory if needed
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${src}`);
    } else {
      console.warn(`⚠️  File not found: ${src}`);
    }
  } catch (error) {
    console.error(`❌ Failed to copy ${src}:`, error.message);
  }
});

// Create ZIP if archiver is available
try {
  const archiver = await import('archiver');
  
  const output = fs.createWriteStream(path.join(handoffDir, 'handoff.zip'));
  const archive = archiver.default('zip', { zlib: { level: 9 } });
  
  output.on('close', () => {
    console.log(`✅ Handoff package created: ${archive.pointer()} bytes`);
    console.log('📦 handoff/handoff.zip is ready!');
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  
  // Add files to archive
  filesToCopy.forEach(({ dest }) => {
    const filePath = path.join(handoffDir, dest);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: dest });
    }
  });
  
  archive.finalize();
  
} catch (error) {
  console.log('📁 ZIP creation skipped (archiver not available)');
  console.log('✅ Files copied to handoff/ directory');
}