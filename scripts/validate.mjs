#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating design files...');

let hasErrors = false;

// Validate assets.manifest.json
function validateAssets() {
  try {
    const assetsPath = path.join(process.cwd(), 'design/assets.manifest.json');
    const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
    
    console.log('📦 Validating assets.manifest.json...');
    
    // Validate icons
    if (assets.icons) {
      assets.icons.forEach((icon, index) => {
        const required = ['name', 'category', 'group', 'format', 'sizes'];
        required.forEach(field => {
          if (!icon[field]) {
            console.error(`❌ icons[${index}]: Missing required field "${field}"`);
            hasErrors = true;
          }
        });
        
        if (icon.sizes && Array.isArray(icon.sizes)) {
          icon.sizes.forEach((size, sizeIndex) => {
            if (!size.path) {
              console.error(`❌ icons[${index}].sizes[${sizeIndex}]: Missing "path" field`);
              hasErrors = true;
            }
          });
        }
      });
    }
    
    // Validate images
    if (assets.images) {
      assets.images.forEach((image, index) => {
        const required = ['name', 'category', 'group', 'format', 'sizes'];
        required.forEach(field => {
          if (!image[field]) {
            console.error(`❌ images[${index}]: Missing required field "${field}"`);
            hasErrors = true;
          }
        });
      });
    }
    
    if (!hasErrors) {
      console.log('✅ assets.manifest.json is valid');
    }
    
  } catch (error) {
    console.error('❌ Error validating assets.manifest.json:', error.message);
    hasErrors = true;
  }
}

// Validate components vs screens consistency
function validateConsistency() {
  try {
    console.log('🔗 Validating component consistency...');
    
    const componentsPath = path.join(process.cwd(), 'design/components.csv');
    const screensPath = path.join(process.cwd(), 'design/screens.csv');
    
    const componentsCSV = fs.readFileSync(componentsPath, 'utf8');
    const screensCSV = fs.readFileSync(screensPath, 'utf8');
    
    // Parse CSV (simple parsing)
    const parseCSV = (csv) => {
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',');
      return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});
      });
    };
    
    const components = parseCSV(componentsCSV);
    const screens = parseCSV(screensCSV);
    
    const componentNames = new Set(components.map(c => c.name));
    
    // Check if all components used in screens exist
    screens.forEach((screen, index) => {
      if (screen.components) {
        const usedComponents = screen.components.split('|').map(c => c.trim());
        usedComponents.forEach(componentName => {
          if (!componentNames.has(componentName)) {
            console.error(`❌ screens.csv line ${index + 2}: Component "${componentName}" used in "${screen.name}" screen but not found in components.csv`);
            hasErrors = true;
          }
        });
      }
    });
    
    if (!hasErrors) {
      console.log('✅ Component consistency validated');
    }
    
  } catch (error) {
    console.error('❌ Error validating consistency:', error.message);
    hasErrors = true;
  }
}

// Validate tokens.json structure
function validateTokens() {
  try {
    console.log('🎨 Validating tokens.json...');
    
    const tokensPath = path.join(process.cwd(), 'design/tokens.json');
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    
    const required = ['colors', 'spacing', 'typography', 'borderRadius', 'shadows', 'breakpoints'];
    required.forEach(section => {
      if (!tokens[section]) {
        console.error(`❌ tokens.json: Missing required section "${section}"`);
        hasErrors = true;
      }
    });
    
    if (!hasErrors) {
      console.log('✅ tokens.json is valid');
    }
    
  } catch (error) {
    console.error('❌ Error validating tokens.json:', error.message);
    hasErrors = true;
  }
}

// Run all validations
validateTokens();
validateAssets();
validateConsistency();

if (hasErrors) {
  console.log('\n❌ Validation failed with errors');
  process.exit(1);
} else {
  console.log('\n✅ All validations passed');
}