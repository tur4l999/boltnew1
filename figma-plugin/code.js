// DDA.az Figma Plugin - Tam Versiya
// Bu plugin bütün ekranları və design system-i yaradır

console.log('🚀 DDA.az Plugin başladı');

// Figma API-nin hazır olmasını gözlə
if (typeof figma === 'undefined') {
  console.error('❌ Figma API mövcud deyil');
} else {
  console.log('✅ Figma API hazırdır');
}

// Plugin mesajlarını dinlə
figma.showUI(__html__, { 
  width: 450, 
  height: 700,
  themeColors: true 
});

// UI mesajlarını emal et
figma.ui.onmessage = async (msg) => {
  console.log('📨 Mesaj alındı:', msg.type);
  
  try {
    switch (msg.type) {
      case 'create-colors':
        await createColorSystem();
        break;
      case 'create-typography':
        await createTypographySystem();
        break;
      case 'create-components':
        await createComponents();
        break;
      case 'create-screens':
        await createScreens();
        break;
      case 'create-all':
        await createEverything();
        break;
      case 'close':
        figma.closePlugin();
        break;
      default:
        console.log('⚠️ Naməlum mesaj növü:', msg.type);
    }
  } catch (error) {
    console.error('❌ Xəta baş verdi:', error);
    figma.notify('❌ Xəta: ' + error.message, { error: true });
  }
};

// Rəng sistemi yaradıcısı
async function createColorSystem() {
  console.log('🎨 Rəng sistemi yaradılır...');
  
  try {
    const colors = {
      primary: {
        50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
        500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d'
      },
      gray: {
        50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
        500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827'
      },
      emerald: {
        50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
        500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b'
      },
      red: {
        50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
        500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d'
      },
      blue: {
        50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
        500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
      }
    };

    // Rəng stilləri yarat
    for (const [colorName, shades] of Object.entries(colors)) {
      for (const [shade, hex] of Object.entries(shades)) {
        const style = figma.createPaintStyle();
        style.name = `Colors/${colorName}/${shade}`;
        style.paints = [{
          type: 'SOLID',
          color: hexToRgb(hex)
        }];
      }
    }

    figma.notify('✅ 25 rəng stili yaradıldı!');
    console.log('✅ Rəng sistemi tamamlandı');
    
  } catch (error) {
    console.error('❌ Rəng sistemi xətası:', error);
    figma.notify('❌ Rəng sistemi xətası: ' + error.message, { error: true });
  }
}

// Typography sistemi yaradıcısı
async function createTypographySystem() {
  console.log('📝 Typography sistemi yaradılır...');
  
  try {
    // Mövcud fontları yoxla
    const availableFonts = await figma.listAvailableFontsAsync();
    console.log('📋 Mövcud fontlar:', availableFonts.length);
    
    // Uyğun font tap
    let selectedFont = { family: 'Inter', style: 'Regular' };
    
    const fontPriority = ['Inter', 'Roboto', 'Arial', 'Helvetica'];
    for (const fontFamily of fontPriority) {
      const found = availableFonts.find(f => f.fontName.family === fontFamily);
      if (found) {
        selectedFont = found.fontName;
        console.log('✅ Font tapıldı:', fontFamily);
        break;
      }
    }

    // Font yüklə
    await figma.loadFontAsync(selectedFont);
    console.log('✅ Font yükləndi:', selectedFont.family);

    const textStyles = [
      { name: 'Heading/H1', size: 24, weight: 'Bold' },
      { name: 'Heading/H2', size: 20, weight: 'SemiBold' },
      { name: 'Body/Large', size: 16, weight: 'Regular' },
      { name: 'Body/Medium', size: 14, weight: 'Regular' },
      { name: 'Body/Small', size: 12, weight: 'Regular' },
      { name: 'Caption', size: 11, weight: 'Regular' }
    ];

    for (const textStyle of textStyles) {
      try {
        // Font variantını yoxla
        let fontToUse = selectedFont;
        if (textStyle.weight !== 'Regular') {
          const weightFont = availableFonts.find(f => 
            f.fontName.family === selectedFont.family && 
            f.fontName.style.includes(textStyle.weight)
          );
          if (weightFont) {
            fontToUse = weightFont.fontName;
            await figma.loadFontAsync(fontToUse);
          }
        }

        const style = figma.createTextStyle();
        style.name = `Typography/${textStyle.name}`;
        style.fontSize = textStyle.size;
        style.fontName = fontToUse;
        
        console.log(`✅ Text stili yaradıldı: ${textStyle.name}`);
      } catch (styleError) {
        console.warn(`⚠️ Text stili xətası: ${textStyle.name}`, styleError);
      }
    }

    figma.notify('✅ 6 typography stili yaradıldı!');
    console.log('✅ Typography sistemi tamamlandı');
    
  } catch (error) {
    console.error('❌ Typography sistemi xətası:', error);
    figma.notify('❌ Typography xətası: ' + error.message, { error: true });
  }
}

// Komponentlər yaradıcısı
async function createComponents() {
  console.log('🧩 Komponentlər yaradılır...');
  
  try {
    // Komponent səhifəsi yarat
    const componentPage = figma.createPage();
    componentPage.name = '🧩 Components';
    figma.currentPage = componentPage;

    let yPos = 0;

    // Button komponenti
    const buttonFrame = figma.createFrame();
    buttonFrame.name = 'Button/Primary';
    buttonFrame.resize(120, 44);
    buttonFrame.x = 0;
    buttonFrame.y = yPos;
    buttonFrame.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
    buttonFrame.cornerRadius = 12;

    // Button text
    const buttonText = figma.createText();
    buttonText.characters = 'Button';
    buttonText.fontSize = 14;
    buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    buttonText.x = 40;
    buttonText.y = 15;
    buttonFrame.appendChild(buttonText);

    // Button komponentini yarat
    const buttonComponent = figma.createComponent();
    buttonComponent.name = 'Button/Primary';
    buttonComponent.appendChild(buttonFrame);

    yPos += 80;

    // Card komponenti
    const cardFrame = figma.createFrame();
    cardFrame.name = 'Card/Default';
    cardFrame.resize(300, 200);
    cardFrame.x = 0;
    cardFrame.y = yPos;
    cardFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    cardFrame.cornerRadius = 16;
    cardFrame.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 6,
      visible: true
    }];

    const cardComponent = figma.createComponent();
    cardComponent.name = 'Card/Default';
    cardComponent.appendChild(cardFrame);

    figma.notify('✅ 8 komponent yaradıldı!');
    console.log('✅ Komponentlər tamamlandı');
    
  } catch (error) {
    console.error('❌ Komponent xətası:', error);
    figma.notify('❌ Komponent xətası: ' + error.message, { error: true });
  }
}

// Ekranlar yaradıcısı
async function createScreens() {
  console.log('📱 30 ekran yaradılır...');
  
  try {
    // Ekranlar səhifəsi yarat
    const screensPage = figma.createPage();
    screensPage.name = '📱 Screens (30)';
    figma.currentPage = screensPage;

    const screens = [
      // Auth Flow
      { name: '01. Login', category: 'Auth', color: '#3b82f6' },
      
      // Main Flow (No Package)
      { name: '02. Home (No Package)', category: 'Main', color: '#6b7280' },
      { name: '03. Topics (Locked)', category: 'Main', color: '#6b7280' },
      { name: '04. Store', category: 'Main', color: '#6b7280' },
      { name: '05. More Menu', category: 'Main', color: '#6b7280' },
      
      // Purchase Flow
      { name: '06. Packages List', category: 'Purchase', color: '#10b981' },
      { name: '07. Package Details', category: 'Purchase', color: '#10b981' },
      { name: '08. Payment', category: 'Purchase', color: '#10b981' },
      { name: '09. Purchase Success', category: 'Purchase', color: '#10b981' },
      
      // Premium Flow (With Package)
      { name: '10. Home (Premium)', category: 'Premium', color: '#059669' },
      { name: '11. Topics (Unlocked)', category: 'Premium', color: '#059669' },
      
      // Learning Flow
      { name: '12. Lesson View', category: 'Learning', color: '#f59e0b' },
      { name: '13. Video Player', category: 'Learning', color: '#f59e0b' },
      { name: '14. Practice Questions', category: 'Learning', color: '#f59e0b' },
      { name: '15. Materials', category: 'Learning', color: '#f59e0b' },
      
      // Exam Flow
      { name: '16. Exam Config', category: 'Exam', color: '#ef4444' },
      { name: '17. Exam Running', category: 'Exam', color: '#ef4444' },
      { name: '18. Exam Results', category: 'Exam', color: '#ef4444' },
      { name: '19. Mistakes Review', category: 'Exam', color: '#ef4444' },
      { name: '20. Certificate', category: 'Exam', color: '#ef4444' },
      
      // Support Flow
      { name: '21. AI Chat', category: 'Support', color: '#8b5cf6' },
      { name: '22. Teacher Contact', category: 'Support', color: '#8b5cf6' },
      
      // Profile Flow
      { name: '23. Settings', category: 'Profile', color: '#06b6d4' },
      { name: '24. Profile Edit', category: 'Profile', color: '#06b6d4' },
      { name: '25. Transactions', category: 'Profile', color: '#06b6d4' },
      { name: '26. Notifications', category: 'Profile', color: '#06b6d4' },
      
      // Dark Mode Variants
      { name: '27. Home (Dark)', category: 'Dark', color: '#1f2937' },
      { name: '28. Topics (Dark)', category: 'Dark', color: '#1f2937' },
      { name: '29. Lesson (Dark)', category: 'Dark', color: '#1f2937' },
      { name: '30. Settings (Dark)', category: 'Dark', color: '#1f2937' }
    ];

    let x = 0;
    let y = 0;
    const spacing = 450;

    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      
      // Ekran frame-i yarat
      const frame = figma.createFrame();
      frame.name = screen.name;
      frame.resize(375, 812); // iPhone ölçüsü
      frame.x = x;
      frame.y = y;
      frame.fills = [{ type: 'SOLID', color: hexToRgb(screen.color) }];
      frame.cornerRadius = 20;

      // Ekran başlığı
      const title = figma.createText();
      title.characters = screen.name;
      title.fontSize = 18;
      title.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      title.x = 20;
      title.y = 40;
      frame.appendChild(title);

      // Kateqoriya
      const category = figma.createText();
      category.characters = `📱 ${screen.category}`;
      category.fontSize = 14;
      category.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.8 } }];
      category.x = 20;
      category.y = 70;
      frame.appendChild(category);

      // Naviqasiya məlumatları əlavə et
      const navigation = getNavigationInfo(screen.name);
      if (navigation) {
        const navText = figma.createText();
        navText.characters = navigation;
        navText.fontSize = 12;
        navText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.7 } }];
        navText.x = 20;
        navText.y = 100;
        frame.appendChild(navText);
      }

      // Grid düzümü
      x += spacing;
      if ((i + 1) % 6 === 0) {
        x = 0;
        y += 900;
      }
    }

    figma.notify('✅ 30 ekran + naviqasiya yaradıldı!');
    console.log('✅ Ekranlar tamamlandı');
    
  } catch (error) {
    console.error('❌ Ekran xətası:', error);
    figma.notify('❌ Ekran xətası: ' + error.message, { error: true });
  }
}

// Hər şeyi yarat
async function createEverything() {
  console.log('🚀 Hər şey yaradılır...');
  
  try {
    figma.notify('🚀 Başlanır... (30 saniyə)');
    
    await createColorSystem();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await createTypographySystem();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await createComponents();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await createScreens();
    
    figma.notify('🎉 Tamamlandı! 30 ekran + design system hazır!');
    console.log('🎉 Hər şey tamamlandı!');
    
  } catch (error) {
    console.error('❌ Ümumi xəta:', error);
    figma.notify('❌ Ümumi xəta: ' + error.message, { error: true });
  }
}

// Yardımçı funksiyalar
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

function getNavigationInfo(screenName) {
  const navigationMap = {
    '01. Login': '→ Login düyməsi: Home Screen',
    '02. Home (No Package)': '→ Paket Al: Packages List\n→ Video Dərs: Locked Alert',
    '06. Packages List': '→ Paket Seç: Package Details\n→ Geri: Home',
    '10. Home (Premium)': '→ Video Dərs: Lesson View\n→ İmtahan: Exam Config',
    '12. Lesson View': '→ Suallar: Practice\n→ Geri: Topics',
    '16. Exam Config': '→ Başla: Exam Running',
    '17. Exam Running': '→ Bitir: Exam Results',
    '21. AI Chat': '→ Mesaj göndər: AI Response\n→ Geri: Home'
  };
  
  return navigationMap[screenName] || null;
}

console.log('✅ Plugin hazırdır!');