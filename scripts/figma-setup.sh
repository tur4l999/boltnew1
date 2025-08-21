#!/bin/bash

# DDA.az Figma Setup Script
# Bu skript Figma ilə inteqrasiya üçün lazım olan hər şeyi qurur

echo "🚀 DDA.az Figma Setup başlayır..."

# 1. Environment variables yoxla
if [ -z "$FIGMA_API_TOKEN" ]; then
    echo "❌ FIGMA_API_TOKEN environment variable təyin edilməyib"
    echo ""
    echo "🔧 Quraşdırma addımları:"
    echo "1. https://figma.com → Settings → Personal Access Tokens"
    echo "2. 'Generate new token' düyməsini basın"
    echo "3. Token adı: 'DDA.az Design Export'"
    echo "4. Token-i kopyalayın"
    echo "5. .env faylına əlavə edin: FIGMA_API_TOKEN=your_token_here"
    echo ""
    exit 1
fi

if [ -z "$FIGMA_FILE_KEY" ]; then
    echo "❌ FIGMA_FILE_KEY environment variable təyin edilməyib"
    echo ""
    echo "🔧 Quraşdırma addımları:"
    echo "1. Figma-da yeni fayl yaradın"
    echo "2. URL-dən key götürün:"
    echo "   https://figma.com/file/ABC123DEF456/Design → ABC123DEF456"
    echo "3. .env faylına əlavə edin: FIGMA_FILE_KEY=your_file_key"
    echo ""
    exit 1
fi

# 2. Node.js paketlərini yükle
echo "📦 NPM paketləri yüklənir..."
npm install --save-dev @figma/plugin-typings
npm install --save-dev @figma/rest-api-spec

# 3. Figma plugin qovluğunu yarat
echo "📁 Plugin qovluğu yaradılır..."
mkdir -p figma-plugin

# 4. Package.json-a skriptlər əlavə et
echo "📝 Package.json yenilənir..."
npm pkg set scripts.figma:sync="node scripts/sync-to-figma.js"
npm pkg set scripts.figma:setup="bash scripts/figma-setup.sh"

# 5. .env faylını yoxla və ya yarat
if [ ! -f .env ]; then
    echo "🔧 .env faylı yaradılır..."
    cat > .env << EOF
# Figma Integration
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here

# DDA.az App
VITE_APP_NAME=DDA.az
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ .env faylı yaradıldı - tokenləri daxil edin"
else
    echo "✅ .env faylı mövcuddur"
    
    # Check if Figma variables exist
    if ! grep -q "FIGMA_API_TOKEN" .env; then
        echo "" >> .env
        echo "# Figma Integration" >> .env
        echo "FIGMA_API_TOKEN=your_figma_token_here" >> .env
        echo "FIGMA_FILE_KEY=your_figma_file_key_here" >> .env
        echo "✅ Figma variables .env-ə əlavə edildi"
    fi
fi

# 6. Gitignore yenilə
echo "📝 .gitignore yenilənir..."
if ! grep -q "figma-export.json" .gitignore 2>/dev/null; then
    echo "figma-export.json" >> .gitignore
fi

if ! grep -q "figma-plugin/dist" .gitignore 2>/dev/null; then
    echo "figma-plugin/dist" >> .gitignore
fi

# 7. Test connection
echo "🔍 Figma bağlantısı test edilir..."
if [ "$FIGMA_API_TOKEN" != "your_figma_token_here" ] && [ "$FIGMA_FILE_KEY" != "your_figma_file_key_here" ]; then
    node scripts/sync-to-figma.js
else
    echo "⚠️  Figma credentials təyin edilməyib - manual quraşdırma lazımdır"
fi

echo ""
echo "🎉 Figma setup tamamlandı!"
echo ""
echo "📋 Növbəti addımlar:"
echo "1. .env faylında FIGMA_API_TOKEN və FIGMA_FILE_KEY təyin edin"
echo "2. npm run figma:sync əmrini işə salın"
echo "3. Figma plugin istifadə edin"
echo ""
echo "🔗 Faydalı linklər:"
echo "• Figma API: https://www.figma.com/developers/api"
echo "• Token yaratmaq: https://www.figma.com/developers/api#access-tokens"
echo "• Plugin development: https://www.figma.com/plugin-docs/"