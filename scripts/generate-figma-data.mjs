#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🎨 Figma üçün design data yaradılır...');

// Design tokens oxu
const tokensPath = path.join(process.cwd(), 'design/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Figma üçün data strukturu
const figmaData = {
  timestamp: new Date().toISOString(),
  app: {
    name: "DDA.az Mobile Learning App",
    version: "1.0.0",
    description: "Sürücülük vəsiqəsi üçün hazırlıq tətbiqi"
  },
  
  // Design System
  designSystem: {
    colors: generateColorSystem(tokens.colors),
    typography: generateTypographySystem(tokens.typography),
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    shadows: tokens.shadows
  },
  
  // Komponentlər
  components: generateComponents(),
  
  // Ekranlar
  screens: generateScreens(),
  
  // Assets
  assets: generateAssets()
};

function generateColorSystem(colors) {
  const colorSystem = {};
  
  Object.entries(colors).forEach(([colorName, shades]) => {
    if (typeof shades === 'object' && shades !== null) {
      colorSystem[colorName] = {};
      Object.entries(shades).forEach(([shade, hex]) => {
        colorSystem[colorName][shade] = {
          name: `Colors/${colorName}/${shade}`,
          value: hex,
          rgb: hexToRgb(hex),
          figmaStyle: `${colorName}-${shade}`
        };
      });
    }
  });
  
  return colorSystem;
}

function generateTypographySystem(typography) {
  const textStyles = {};
  
  Object.entries(typography.fontSize).forEach(([size, value]) => {
    textStyles[size] = {
      name: `Typography/${size}`,
      fontSize: parseInt(value),
      fontFamily: typography.fontFamily.primary,
      figmaStyle: `text-${size}`
    };
  });
  
  return textStyles;
}

function generateComponents() {
  return {
    Button: {
      name: 'Button',
      variants: ['Primary', 'Secondary', 'Ghost'],
      sizes: ['sm', 'md', 'lg'],
      states: ['default', 'hover', 'pressed', 'disabled'],
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
      components: ['Logo', 'LoginForm', 'SocialButtons'],
      figmaFrame: 'Screens/Login'
    },
    {
      name: 'Home',
      size: { width: 375, height: 812 },
      components: ['Header', 'ProgressCard', 'ActionGrid', 'TabBar'],
      figmaFrame: 'Screens/Home'
    },
    {
      name: 'Topics',
      size: { width: 375, height: 812 },
      components: ['Header', 'SearchBar', 'ModuleList', 'TabBar'],
      figmaFrame: 'Screens/Topics'
    },
    {
      name: 'Lesson',
      size: { width: 375, height: 812 },
      components: ['Header', 'VideoPlayer', 'TabNavigation', 'Content'],
      figmaFrame: 'Screens/Lesson'
    },
    {
      name: 'Exam',
      size: { width: 375, height: 812 },
      components: ['Timer', 'QuestionCard', 'AnswerOptions', 'Navigation'],
      figmaFrame: 'Screens/Exam'
    },
    {
      name: 'Store',
      size: { width: 375, height: 812 },
      components: ['Header', 'ProductGrid', 'PaymentMethods', 'TabBar'],
      figmaFrame: 'Screens/Store'
    }
  ];
}

function generateAssets() {
  return {
    icons: [
      { name: 'home', emoji: '🏠', usage: 'Navigation tab' },
      { name: 'topics', emoji: '📚', usage: 'Topics tab' },
      { name: 'exam', emoji: '🧪', usage: 'Exam tab' },
      { name: 'store', emoji: '🛍️', usage: 'Store tab' },
      { name: 'more', emoji: '➕', usage: 'More menu' }
    ],
    images: [
      { name: 'logo', usage: 'App logo' },
      { name: 'question-placeholder', usage: 'Question images' }
    ]
  };
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Math.round(parseInt(result[1], 16) / 255 * 100) / 100,
    g: Math.round(parseInt(result[2], 16) / 255 * 100) / 100,
    b: Math.round(parseInt(result[3], 16) / 255 * 100) / 100
  } : { r: 0, g: 0, b: 0 };
}

// Faylı yarat
const outputPath = path.join(process.cwd(), 'figma-design-data.json');
fs.writeFileSync(outputPath, JSON.stringify(figmaData, null, 2));

console.log('✅ Figma design data yaradıldı!');
console.log('📁 Fayl: figma-design-data.json');
console.log('');
console.log('📊 Statistika:');
console.log(`   🎨 Rənglər: ${Object.keys(figmaData.designSystem.colors).length}`);
console.log(`   📝 Typography: ${Object.keys(figmaData.designSystem.typography).length}`);
console.log(`   🧩 Komponentlər: ${Object.keys(figmaData.components).length}`);
console.log(`   📱 Ekranlar: ${figmaData.screens.length}`);
console.log('');
console.log('🔄 Növbəti addım: Bu faylı Figmaya import edin');