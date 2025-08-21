#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🎨 Generating tokens...');

// Read design tokens
function readTokens() {
  try {
    const tokensPath = path.join(process.cwd(), 'design/tokens.json');
    return JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading tokens.json:', error.message);
    process.exit(1);
  }
}

// Convert nested object to CSS variables
function toVars(obj, prefix = []) {
  return Object.entries(obj).flatMap(([k, v]) => {
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      return toVars(v, [...prefix, k]);
    }
    return [`  --${[...prefix, k].join('-')}: ${v};`];
  });
}

// Generate CSS from tokens
function generateCSS(tokens) {
  const vars = [
    '/* Auto-generated from design/tokens.json */',
    '/* Do not edit directly - run npm run tokens to regenerate */',
    ':root {',
    ...toVars(tokens.colors, ['color']),
    ...toVars(tokens.spacing, ['spacing']),
    ...toVars(tokens.typography, ['typography']),
    ...toVars(tokens.borderRadius, ['radius']),
    ...toVars(tokens.shadows, ['shadow']),
    ...toVars(tokens.breakpoints, ['breakpoint']),
    '}',
    '',
    '/* Utility Classes */',
    '.text-primary { color: var(--color-semantic-text-primary); }',
    '.text-secondary { color: var(--color-semantic-text-secondary); }',
    '.text-muted { color: var(--color-semantic-text-muted); }',
    '.bg-surface { background-color: var(--color-semantic-surface); }',
    '.bg-background { background-color: var(--color-semantic-background); }',
    '.border-default { border-color: var(--color-semantic-border); }',
    '.rounded-md { border-radius: var(--radius-md); }',
    '.rounded-lg { border-radius: var(--radius-lg); }',
    '.rounded-xl { border-radius: var(--radius-xl); }',
    '.shadow-sm { box-shadow: var(--shadow-sm); }',
    '.shadow-md { box-shadow: var(--shadow-md); }',
    '.shadow-lg { box-shadow: var(--shadow-lg); }'
  ];
  
  return vars.join('\n');
}

// Generate React Native theme
function generateRNTheme(tokens) {
  // Convert px values to numbers for RN
  const processTokens = (obj) => {
    if (typeof obj === 'string' && obj.endsWith('px')) {
      const num = parseInt(obj.replace('px', ''));
      return obj === '9999px' ? 9999 : num;
    }
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, processTokens(v)])
      );
    }
    return obj;
  };

  const processedTokens = processTokens(tokens);
  
  // Add RN-specific shadow objects
  processedTokens.shadows = {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 10,
    },
  };

  return [
    '// Auto-generated from design/tokens.json',
    '// Do not edit directly - run npm run tokens to regenerate',
    '',
    `export const theme = ${JSON.stringify(processedTokens, null, 2)} as const;`,
    '',
    'export type Theme = typeof theme;',
    'export type ColorScale = keyof typeof theme.colors.primary;',
    'export type SpacingScale = keyof typeof theme.spacing;',
    'export type FontSize = keyof typeof theme.typography.fontSize;'
  ].join('\n');
}

// Main execution
try {
  const tokens = readTokens();
  
  // Generate CSS
  const css = generateCSS(tokens);
  fs.writeFileSync('design/styles.css', css);
  
  // Copy to public for dev server
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync('public/styles.css', css);
  
  // Generate RN theme
  const rnTheme = generateRNTheme(tokens);
  fs.mkdirSync('src', { recursive: true });
  fs.writeFileSync('src/theme.ts', rnTheme);
  
  console.log('✅ Generated:');
  console.log('  - design/styles.css');
  console.log('  - public/styles.css');
  console.log('  - src/theme.ts');
  
} catch (error) {
  console.error('❌ Generation failed:', error.message);
  process.exit(1);
}