#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { figmaRoutes, deviceSizes, themes, locales } from './figma.routes.js';

console.log('🎨 Building Figma Export Harness...');

const EXPORT_DIR = 'dist/figma-export';
const THUMBS_DIR = `${EXPORT_DIR}/thumbs`;

// Clean and create directories
if (fs.existsSync(EXPORT_DIR)) {
  fs.rmSync(EXPORT_DIR, { recursive: true });
}
fs.mkdirSync(EXPORT_DIR, { recursive: true });
fs.mkdirSync(THUMBS_DIR, { recursive: true });

// Build the main app first
console.log('📦 Building main application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Generate critical CSS
const criticalCSS = generateCriticalCSS();

// Create gallery index
console.log('🖼️ Creating gallery index...');
createGalleryIndex();

// Generate individual screen exports
console.log('📱 Generating screen exports...');
for (const route of figmaRoutes) {
  for (const [sizeKey, size] of Object.entries(deviceSizes)) {
    for (const theme of themes) {
      for (const locale of locales) {
        createScreenExport(route, sizeKey, size, theme, locale);
      }
    }
  }
}

// Create manifest
console.log('📋 Creating manifest...');
createManifest();

// Copy assets
console.log('📁 Copying assets...');
copyAssets();

console.log('✅ Figma Export Harness created successfully!');
console.log(`📂 Output: ${EXPORT_DIR}`);
console.log('🚀 Run "npm run preview:figma" to preview');

function generateCriticalCSS() {
  // Read the built CSS and add export-specific styles
  const mainCSS = fs.readFileSync('dist/assets/index-CTOHCq_6.css', 'utf8');
  
  return `
${mainCSS}

/* Figma Export Specific Styles */
.figma-export * {
  animation: none !important;
  transition: none !important;
}

.figma-export *:before,
.figma-export *:after {
  animation: none !important;
  transition: none !important;
}

/* Disable reduced motion for export */
@media (prefers-reduced-motion: reduce) {
  .figma-export * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Device frame styles */
.device-frame {
  width: var(--device-width);
  height: var(--device-height);
  margin: 0 auto;
  background: #000;
  border-radius: 20px;
  padding: 4px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.3);
}

.device-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.status-bar {
  height: 44px;
  background: rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
}

.app-content {
  height: calc(100% - 44px);
  overflow: hidden;
}

/* Gallery styles */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}

.screen-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.screen-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.screen-preview {
  width: 100%;
  height: 200px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.screen-info {
  padding: 16px;
}

.screen-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.screen-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.screen-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.screen-link {
  padding: 6px 12px;
  background: #22c55e;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.screen-link:hover {
  background: #16a34a;
}

.screen-link.secondary {
  background: #6b7280;
}

.screen-link.secondary:hover {
  background: #4b5563;
}
`;
}

function createGalleryIndex() {
  const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DDA.az - Figma Export Gallery</title>
  <style>${generateCriticalCSS()}</style>
</head>
<body>
  <div class="figma-export">
    <header style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 24px; text-align: center;">
      <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">DDA.az Design System</h1>
      <p style="font-size: 16px; opacity: 0.9;">Figma Export Gallery - ${figmaRoutes.length} Screens</p>
    </header>

    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <div style="margin-bottom: 32px; text-align: center;">
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Export Options</h2>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; border: 1px solid #bbf7d0;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">📱 Device Sizes</h3>
            <p style="font-size: 14px; color: #166534;">iPhone 13 (390×844) • iPhone 12 Mini (375×812)</p>
          </div>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; border: 1px solid #bbf7d0;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">🎨 Themes</h3>
            <p style="font-size: 14px; color: #166534;">Light • Dark</p>
          </div>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; border: 1px solid #bbf7d0;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">🌐 Languages</h3>
            <p style="font-size: 14px; color: #166534;">Azərbaycan • Русский • English</p>
          </div>
        </div>
      </div>

      <div class="gallery-grid">
        ${figmaRoutes.map(route => `
          <div class="screen-card">
            <div class="screen-preview">
              ${getCategoryEmoji(route.category)}
            </div>
            <div class="screen-info">
              <h3 class="screen-title">${route.name}</h3>
              <p class="screen-description">${route.description}</p>
              <div class="screen-actions">
                <a href="${route.id}.html?size=390x844&theme=light&locale=az" class="screen-link">
                  📱 iPhone 13
                </a>
                <a href="${route.id}.html?size=375x812&theme=light&locale=az" class="screen-link secondary">
                  📱 iPhone 12
                </a>
                <a href="${route.id}.html?size=390x844&theme=dark&locale=az" class="screen-link secondary">
                  🌙 Dark
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <footer style="text-align: center; padding: 32px; border-top: 1px solid #e5e7eb; margin-top: 48px;">
        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Import to Figma</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; max-width: 800px; margin: 0 auto;">
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h4 style="font-weight: 600; margin-bottom: 8px;">🌐 Web Method</h4>
            <p style="font-size: 14px; color: #6b7280;">Deploy this folder and paste URL into html.to.design plugin</p>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h4 style="font-weight: 600; margin-bottom: 8px;">📁 File Method</h4>
            <p style="font-size: 14px; color: #6b7280;">Drag index.html into html.to.design plugin's File tab</p>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h4 style="font-weight: 600; margin-bottom: 8px;">🔌 Extension Method</h4>
            <p style="font-size: 14px; color: #6b7280;">Use html.to.design Chrome extension on preview</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(`${EXPORT_DIR}/index.html`, html);
}

function createScreenExport(route, sizeKey, size, theme, locale) {
  const filename = `${route.id}.html`;
  const mockData = generateMockData(route, theme, locale);
  
  const html = `<!DOCTYPE html>
<html lang="${locale}" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${size.width}, initial-scale=1, user-scalable=no">
  <title>${route.name} - DDA.az</title>
  <style>
    :root {
      --device-width: ${size.width}px;
      --device-height: ${size.height}px;
    }
    ${generateCriticalCSS()}
  </style>
</head>
<body class="figma-export ${theme === 'dark' ? 'dark' : ''}">
  <div class="device-frame">
    <div class="device-screen">
      <div class="status-bar">
        <span>9:41</span>
        <span>📶 📶 📶 🔋</span>
      </div>
      <div class="app-content">
        ${generateScreenContent(route, mockData, theme, locale)}
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(`${EXPORT_DIR}/${filename}`, html);
}

function generateScreenContent(route, mockData, theme, locale) {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-900';
  
  switch (route.id) {
    case 'login':
      return `
        <div class="min-h-full flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-green-100">
          <div class="w-full max-w-md">
            <div class="text-center mb-8">
              <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                DDA
              </div>
              <h1 class="text-3xl font-black mb-2 text-gray-900">DDA.az</h1>
              <p class="text-gray-600">Sürücülük vəsiqəsi üçün hazırlıq</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="space-y-4">
                <div>
                  <input type="email" placeholder="E-mail ünvanınızı daxil edin" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500">
                </div>
                <div>
                  <input type="password" placeholder="Şifrənizi daxil edin"
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500">
                </div>
                <button class="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                  Daxil ol
                </button>
                <button class="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium">
                  🔍 Google ilə daxil ol
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'home':
      return `
        <div class="${bgClass} min-h-full">
          <div class="p-3 pb-24">
            ${mockData.hasPackage ? `
              <div class="mb-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-emerald-600 text-xs">👑</span>
                </div>
                <div class="flex-1">
                  <div class="text-emerald-900 text-xs font-medium">Premium üzv - Bütün funksiyalar aktiv</div>
                </div>
              </div>
            ` : `
              <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 text-xs">📦</span>
                </div>
                <div class="flex-1">
                  <div class="text-blue-900 text-xs font-medium">Aktiv paketiniz yoxdur</div>
                </div>
                <button class="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">Paket al</button>
              </div>
            `}
            
            <div class="bg-white rounded-xl p-4 border shadow-sm mb-3">
              <div class="text-xs text-gray-500 mb-2">İrəliləyiş</div>
              <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-600 rounded-full" style="width: 42%"></div>
              </div>
              <div class="text-xs mt-2 text-gray-700">
                Haradan davam edim? → <span class="font-bold">M8: Yol nişanları</span>
              </div>
            </div>

            <div class="space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <button class="bg-white rounded-xl border shadow-sm p-3 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-50 text-emerald-600 flex items-center justify-center text-lg">🎬</div>
                  <div class="text-left font-bold text-sm leading-tight text-gray-700">Video dərslər</div>
                </button>
                <button class="bg-white rounded-xl border shadow-sm p-3 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-50 text-emerald-600 flex items-center justify-center text-lg">📝</div>
                  <div class="text-left font-bold text-sm leading-tight text-gray-700">Sürətli test</div>
                </button>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button class="bg-white rounded-xl border shadow-sm p-3 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-50 text-emerald-600 flex items-center justify-center text-lg">📚</div>
                  <div class="text-left font-bold text-sm leading-tight text-gray-700">Təlim mövzuları</div>
                </button>
                <button class="bg-white rounded-xl border shadow-sm p-3 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-50 text-emerald-600 flex items-center justify-center text-lg">🧪</div>
                  <div class="text-left font-bold text-sm leading-tight text-gray-700">İmtahan</div>
                </button>
              </div>
            </div>
          </div>
          
          <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div class="grid grid-cols-5">
              <div class="p-2 flex flex-col items-center gap-1 text-emerald-600">
                <span class="text-base">🏠</span>
                <span class="text-xs font-semibold">Ana</span>
              </div>
              <div class="p-2 flex flex-col items-center gap-1 text-gray-500">
                <span class="text-base">📚</span>
                <span class="text-xs font-semibold">Təlimlər</span>
              </div>
              <div class="p-2 flex flex-col items-center gap-1 text-gray-500">
                <span class="text-base">🧪</span>
                <span class="text-xs font-semibold">İmtahan</span>
              </div>
              <div class="p-2 flex flex-col items-center gap-1 text-gray-500">
                <span class="text-base">🛍️</span>
                <span class="text-xs font-semibold">Mağaza</span>
              </div>
              <div class="p-2 flex flex-col items-center gap-1 text-gray-500">
                <span class="text-base">➕</span>
                <span class="text-xs font-semibold">Daha</span>
              </div>
            </div>
          </div>
        </div>
      `;

    case 'topics':
      return `
        <div class="${bgClass} min-h-full">
          <div class="p-3 pb-24">
            <input placeholder="Mövzu axtarın..." 
                   class="w-full px-4 py-3 rounded-xl border border-gray-300 mb-3">
            
            <div class="space-y-2">
              ${Array.from({ length: 5 }, (_, i) => `
                <div class="bg-white rounded-xl p-4 border shadow-sm ${i > 1 && !mockData.hasPackage ? 'opacity-60' : ''}">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      ${i > 1 && !mockData.hasPackage ? '<span class="text-gray-400 text-lg">🔒</span>' : ''}
                      <div>
                        <div class="font-bold text-sm text-gray-900">M${i + 1}: Module ${i + 1} — Traffic Rules</div>
                        <div class="text-xs text-gray-500">İrəliləyiş: ${i <= 1 || mockData.hasPackage ? Math.floor(Math.random() * 100) : 0}%</div>
                      </div>
                    </div>
                    <button class="px-3 py-1 ${i > 1 && !mockData.hasPackage ? 'bg-gray-300 text-gray-500' : 'bg-emerald-600 text-white'} rounded text-xs font-medium">
                      ${i > 1 && !mockData.hasPackage ? 'Kilidli' : 'Başla'}
                    </button>
                  </div>
                  <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-600 rounded-full" style="width: ${i <= 1 || mockData.hasPackage ? Math.floor(Math.random() * 100) : 0}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

    case 'packages':
      return `
        <div class="${bgClass} min-h-full">
          <div class="p-3 pb-24">
            <div class="flex items-center gap-3 mb-4">
              <button class="w-9 h-9 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center">←</button>
              <h1 class="text-lg font-bold text-gray-900">Təlim Paketləri</h1>
            </div>

            <div class="mb-6 text-center">
              <div class="text-lg font-bold text-emerald-600">Balans: 100 AZN</div>
            </div>

            <div class="space-y-4">
              ${[
                { name: 'Sadə Paket', price: '15 AZN', popular: false },
                { name: 'Standart Paket', price: '25 AZN', popular: true },
                { name: 'Premium Paket', price: '40 AZN', popular: false }
              ].map(pkg => `
                <div class="bg-white rounded-xl p-6 border shadow-lg ${pkg.popular ? 'ring-2 ring-emerald-500 relative' : ''}">
                  ${pkg.popular ? `
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                      ⭐ Ən Populyar
                    </div>
                  ` : ''}
                  
                  <div class="text-center mb-4">
                    <h3 class="text-xl font-bold ${pkg.popular ? 'text-emerald-700' : 'text-gray-900'}">${pkg.name}</h3>
                    <div class="text-3xl font-black mt-2 ${pkg.popular ? 'text-emerald-600' : 'text-gray-900'}">${pkg.price}</div>
                    <p class="text-sm mt-1 text-gray-600">30 gün müddətinə</p>
                  </div>

                  <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <span class="text-emerald-500">✓</span> 3D video dərslər
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <span class="text-emerald-500">✓</span> Dərs materialları
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <span class="text-emerald-500">✓</span> İmtahan simulyatoru
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <span class="text-emerald-500">✓</span> Müəllimlə əlaqə
                    </div>
                  </div>

                  <button class="w-full ${pkg.popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-800'} text-white py-3 rounded-xl font-bold">
                    Paketi Al - ${pkg.price}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

    case 'ai-chat':
      return `
        <div class="min-h-full bg-gray-50 flex flex-col">
          <div class="p-4 border-b border-gray-200 bg-white">
            <div class="flex items-center gap-3">
              <button class="w-9 h-9 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center">←</button>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm">🤖</div>
                <div>
                  <div class="font-bold text-gray-900">DDA.az AI Köməkçi</div>
                  <div class="text-xs text-emerald-600">● Onlayn</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 p-4 space-y-4 overflow-y-auto">
            <div class="flex justify-start">
              <div class="flex items-end gap-2">
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">🤖</div>
                <div class="bg-gray-100 p-3 rounded-2xl rounded-bl-md max-w-xs">
                  <div class="text-sm">Salam! Mən DDA.az AI köməkçisiyəm. Sürücülük qaydaları ilə bağlı suallarınızı verə bilərsiniz.</div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <div class="flex items-end gap-2">
                <div class="bg-emerald-600 text-white p-3 rounded-2xl rounded-br-md max-w-xs">
                  <div class="text-sm">Yol nişanlarının növləri hansılardır?</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">👤</div>
              </div>
            </div>

            <div class="flex justify-start">
              <div class="flex items-end gap-2">
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">🤖</div>
                <div class="bg-gray-100 p-3 rounded-2xl rounded-bl-md max-w-xs">
                  <div class="text-sm">Yol nişanları 4 əsas qrupa bölünür: xəbərdarlıq, qadağan, məcburi və məlumat nişanları.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-gray-200 bg-white">
            <div class="flex gap-2">
              <input type="text" placeholder="Sualınızı yazın..." 
                     class="flex-1 px-4 py-3 border border-gray-300 rounded-xl">
              <button class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium">Göndər</button>
            </div>
          </div>
        </div>
      `;

    default:
      return `
        <div class="${bgClass} min-h-full flex items-center justify-center p-4">
          <div class="text-center">
            <div class="text-6xl mb-4">${getCategoryEmoji(route.category)}</div>
            <h1 class="text-2xl font-bold ${textClass} mb-2">${route.name}</h1>
            <p class="text-gray-500">${route.description}</p>
          </div>
        </div>
      `;
  }
}

function generateMockData(route, theme, locale) {
  return {
    hasPackage: route.id.includes('premium') || Math.random() > 0.5,
    user: {
      name: 'Tural Qarayev',
      email: 'tural@example.com',
      balance: 100
    },
    theme,
    locale
  };
}

function getCategoryEmoji(category) {
  const emojis = {
    auth: '🔐',
    main: '🏠',
    learning: '📚',
    exam: '🧪',
    store: '🛍️',
    profile: '👤',
    support: '🤖'
  };
  return emojis[category] || '📱';
}

function createManifest() {
  const manifest = {
    name: 'DDA.az Design System',
    version: '1.0.0',
    description: 'Mobile learning app for driving license preparation',
    screens: figmaRoutes.length,
    deviceSizes: Object.keys(deviceSizes),
    themes: [...themes],
    locales: [...locales],
    routes: figmaRoutes.map(route => ({
      id: route.id,
      name: route.name,
      category: route.category,
      files: Object.keys(deviceSizes).flatMap(size =>
        themes.flatMap(theme =>
          locales.map(locale => `${route.id}.html?size=${size}&theme=${theme}&locale=${locale}`)
        )
      )
    })),
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(`${EXPORT_DIR}/figma-manifest.json`, JSON.stringify(manifest, null, 2));
}

function copyAssets() {
  // Copy critical assets
  const assetDirs = ['assets'];
  
  for (const dir of assetDirs) {
    const srcDir = `dist/${dir}`;
    const destDir = `${EXPORT_DIR}/${dir}`;
    
    if (fs.existsSync(srcDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      
      const files = fs.readdirSync(srcDir);
      for (const file of files) {
        fs.copyFileSync(`${srcDir}/${file}`, `${destDir}/${file}`);
      }
    }
  }

  // Copy logo
  if (fs.existsSync('public/DDA_logo.png')) {
    fs.copyFileSync('public/DDA_logo.png', `${EXPORT_DIR}/DDA_logo.png`);
  }
}