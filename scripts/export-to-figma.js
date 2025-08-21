#!/usr/bin/env node

/**
 * DDA.az → Figma Export (Sadə Həll)
 * Heç bir əlavə paket lazım deyil
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 DDA.az → Figma export başlayır...');

// Design tokens oxu
const tokensPath = path.join(__dirname, '../design/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Figma üçün data strukturu
const figmaExport = {
  timestamp: new Date().toISOString(),
  app: {
    name: "DDA.az Mobile Learning App",
    version: "1.0.0",
    description: "Sürücülük vəsiqəsi üçün hazırlıq tətbiqi"
  },
  
  // Design System
  designSystem: {
    colors: generateColors(tokens.colors),
    typography: generateTypography(tokens.typography),
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    shadows: tokens.shadows
  },
  
  // Komponentlər
  components: generateComponents(),
  
  // Ekranlar
  screens: generateScreens()
};

function generateColors(colors) {
  const result = {};
  
  Object.entries(colors).forEach(([colorName, shades]) => {
    if (typeof shades === 'object' && shades !== null) {
      result[colorName] = {};
      Object.entries(shades).forEach(([shade, hex]) => {
        result[colorName][shade] = {
          name: `${colorName}/${shade}`,
          value: hex,
          figmaStyle: `color-${colorName}-${shade}`
        };
      });
    }
  });
  
  return result;
}

function generateTypography(typography) {
  const result = {};
  
  Object.entries(typography.fontSize).forEach(([size, value]) => {
    result[size] = {
      name: `text-${size}`,
      fontSize: parseInt(value),
      fontFamily: typography.fontFamily.primary,
      figmaStyle: `typography-${size}`
    };
  });
  
  return result;
}

function generateComponents() {
  return {
    Button: {
      name: 'Button',
      variants: ['Primary', 'Secondary', 'Ghost'],
      sizes: ['sm', 'md', 'lg'],
      figmaComponent: 'Button/Primary'
    },
    Card: {
      name: 'Card',
      variants: ['Default', 'Elevated'],
      figmaComponent: 'Card/Default'
    },
    Header: {
      name: 'Header',
      variants: ['Default', 'WithBack'],
      figmaComponent: 'Header/Default'
    },
    TabBar: {
      name: 'TabBar',
      tabs: ['Home', 'Topics', 'Exam', 'Store', 'More'],
      figmaComponent: 'TabBar/Default'
    }
  };
}

function generateScreens() {
  return [
    {
      name: 'Login',
      size: { width: 375, height: 812 },
      components: ['Logo', 'LoginForm', 'SocialButtons']
    },
    {
      name: 'Home',
      size: { width: 375, height: 812 },
      components: ['Header', 'ProgressCard', 'ActionGrid', 'TabBar']
    },
    {
      name: 'Topics',
      size: { width: 375, height: 812 },
      components: ['Header', 'SearchBar', 'ModuleList', 'TabBar']
    },
    {
      name: 'Lesson',
      size: { width: 375, height: 812 },
      components: ['Header', 'VideoPlayer', 'TabNavigation', 'Content']
    },
    {
      name: 'Exam',
      size: { width: 375, height: 812 },
      components: ['Timer', 'QuestionCard', 'AnswerOptions', 'Navigation']
    },
    {
      name: 'Store',
      size: { width: 375, height: 812 },
      components: ['Header', 'ProductGrid', 'PaymentMethods', 'TabBar']
    }
  ];
}

// Export faylını yarat
const outputPath = path.join(__dirname, '../figma-export.json');
fs.writeFileSync(outputPath, JSON.stringify(figmaExport, null, 2));

console.log('✅ Figma export hazır!');
console.log('📁 Fayl: figma-export.json');
console.log('');
console.log('📊 Nə yaradıldı:');
console.log(`   🎨 Rənglər: ${Object.keys(figmaExport.designSystem.colors).length}`);
console.log(`   📝 Typography: ${Object.keys(figmaExport.designSystem.typography).length}`);
console.log(`   🧩 Komponentlər: ${Object.keys(figmaExport.components).length}`);
console.log(`   📱 Ekranlar: ${figmaExport.screens.length}`);
console.log('');
console.log('🔄 Növbəti addım: Bu faylı Figma plugin-ə göndərin');