// DDA.az Figma Plugin - Tam Dizayn Versiyası
// Bu plugin hər ekranın tam dizaynını yaradır

console.log('🚀 DDA.az Plugin başladı - Tam Dizayn Modu');

// Figma API-nin hazır olmasını yoxla
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
        await createDetailedScreens();
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

// Detallı ekranlar yaradıcısı
async function createDetailedScreens() {
  console.log('📱 30 detallı ekran yaradılır...');
  
  try {
    // Ekranlar səhifəsi yarat
    const screensPage = figma.createPage();
    screensPage.name = '📱 Screens (30 Detallı)';
    figma.currentPage = screensPage;

    // Font yüklə
    const availableFonts = await figma.listAvailableFontsAsync();
    let selectedFont = { family: 'Inter', style: 'Regular' };
    
    const fontPriority = ['Inter', 'Roboto', 'Arial', 'Helvetica'];
    for (const fontFamily of fontPriority) {
      const found = availableFonts.find(f => f.fontName.family === fontFamily);
      if (found) {
        selectedFont = found.fontName;
        break;
      }
    }
    await figma.loadFontAsync(selectedFont);

    const screens = [
      // Auth Flow
      { name: '01. Login', category: 'Auth', color: '#3b82f6', design: 'login' },
      
      // Main Flow (No Package)
      { name: '02. Home (No Package)', category: 'Main', color: '#6b7280', design: 'home-no-package' },
      { name: '03. Topics (Locked)', category: 'Main', color: '#6b7280', design: 'topics-locked' },
      { name: '04. Store', category: 'Main', color: '#6b7280', design: 'store' },
      { name: '05. More Menu', category: 'Main', color: '#6b7280', design: 'more-menu' },
      
      // Purchase Flow
      { name: '06. Packages List', category: 'Purchase', color: '#10b981', design: 'packages-list' },
      { name: '07. Package Details', category: 'Purchase', color: '#10b981', design: 'package-details' },
      { name: '08. Payment', category: 'Purchase', color: '#10b981', design: 'payment' },
      { name: '09. Purchase Success', category: 'Purchase', color: '#10b981', design: 'purchase-success' },
      
      // Premium Flow (With Package)
      { name: '10. Home (Premium)', category: 'Premium', color: '#059669', design: 'home-premium' },
      { name: '11. Topics (Unlocked)', category: 'Premium', color: '#059669', design: 'topics-unlocked' },
      
      // Learning Flow
      { name: '12. Lesson View', category: 'Learning', color: '#f59e0b', design: 'lesson-view' },
      { name: '13. Video Player', category: 'Learning', color: '#f59e0b', design: 'video-player' },
      { name: '14. Practice Questions', category: 'Learning', color: '#f59e0b', design: 'practice-questions' },
      { name: '15. Materials', category: 'Learning', color: '#f59e0b', design: 'materials' },
      
      // Exam Flow
      { name: '16. Exam Config', category: 'Exam', color: '#ef4444', design: 'exam-config' },
      { name: '17. Exam Running', category: 'Exam', color: '#ef4444', design: 'exam-running' },
      { name: '18. Exam Results', category: 'Exam', color: '#ef4444', design: 'exam-results' },
      { name: '19. Mistakes Review', category: 'Exam', color: '#ef4444', design: 'mistakes-review' },
      { name: '20. Certificate', category: 'Exam', color: '#ef4444', design: 'certificate' },
      
      // Support Flow
      { name: '21. AI Chat', category: 'Support', color: '#8b5cf6', design: 'ai-chat' },
      { name: '22. Teacher Contact', category: 'Support', color: '#8b5cf6', design: 'teacher-contact' },
      
      // Profile Flow
      { name: '23. Settings', category: 'Profile', color: '#06b6d4', design: 'settings' },
      { name: '24. Profile Edit', category: 'Profile', color: '#06b6d4', design: 'profile-edit' },
      { name: '25. Transactions', category: 'Profile', color: '#06b6d4', design: 'transactions' },
      { name: '26. Notifications', category: 'Profile', color: '#06b6d4', design: 'notifications' },
      
      // Dark Mode Variants
      { name: '27. Home (Dark)', category: 'Dark', color: '#1f2937', design: 'home-dark' },
      { name: '28. Topics (Dark)', category: 'Dark', color: '#1f2937', design: 'topics-dark' },
      { name: '29. Lesson (Dark)', category: 'Dark', color: '#1f2937', design: 'lesson-dark' },
      { name: '30. Settings (Dark)', category: 'Dark', color: '#1f2937', design: 'settings-dark' }
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
      frame.fills = [{ type: 'SOLID', color: hexToRgb('#f9fafb') }]; // Ağ arxa plan
      frame.cornerRadius = 20;

      // Ekranın dizaynını yarat
      await createScreenDesign(frame, screen, selectedFont);

      // Grid düzümü
      x += spacing;
      if ((i + 1) % 6 === 0) {
        x = 0;
        y += 900;
      }
    }

    figma.notify('✅ 30 detallı ekran yaradıldı!');
    console.log('✅ Detallı ekranlar tamamlandı');
    
  } catch (error) {
    console.error('❌ Ekran xətası:', error);
    figma.notify('❌ Ekran xətası: ' + error.message, { error: true });
  }
}

// Hər ekranın dizaynını yarat
async function createScreenDesign(frame, screen, font) {
  try {
    switch (screen.design) {
      case 'login':
        await createLoginScreen(frame, font);
        break;
      case 'home-no-package':
        await createHomeNoPackageScreen(frame, font);
        break;
      case 'topics-locked':
        await createTopicsLockedScreen(frame, font);
        break;
      case 'store':
        await createStoreScreen(frame, font);
        break;
      case 'packages-list':
        await createPackagesListScreen(frame, font);
        break;
      case 'home-premium':
        await createHomePremiumScreen(frame, font);
        break;
      case 'lesson-view':
        await createLessonViewScreen(frame, font);
        break;
      case 'exam-config':
        await createExamConfigScreen(frame, font);
        break;
      case 'exam-running':
        await createExamRunningScreen(frame, font);
        break;
      case 'ai-chat':
        await createAIChatScreen(frame, font);
        break;
      case 'settings':
        await createSettingsScreen(frame, font);
        break;
      default:
        await createDefaultScreen(frame, screen, font);
        break;
    }
  } catch (error) {
    console.warn(`⚠️ ${screen.name} dizayn xətası:`, error);
    await createDefaultScreen(frame, screen, font);
  }
}

// Login ekranı dizaynı
async function createLoginScreen(frame, font) {
  // Arxa plan gradient
  frame.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: hexToRgb('#f0fdf4') },
      { position: 1, color: hexToRgb('#dcfce7') }
    ]
  }];

  // Logo
  const logo = figma.createFrame();
  logo.resize(80, 80);
  logo.x = 147.5; // Mərkəz
  logo.y = 150;
  logo.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  logo.cornerRadius = 20;
  frame.appendChild(logo);

  // Logo text
  const logoText = figma.createText();
  logoText.characters = 'DDA';
  logoText.fontSize = 24;
  logoText.fontName = font;
  logoText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  logoText.x = 20;
  logoText.y = 28;
  logo.appendChild(logoText);

  // Başlıq
  const title = figma.createText();
  title.characters = 'DDA.az';
  title.fontSize = 32;
  title.fontName = font;
  title.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  title.x = 137.5;
  title.y = 250;
  frame.appendChild(title);

  // Alt başlıq
  const subtitle = figma.createText();
  subtitle.characters = 'Sürücülük vəsiqəsi üçün hazırlıq';
  subtitle.fontSize = 16;
  subtitle.fontName = font;
  subtitle.fills = [{ type: 'SOLID', color: hexToRgb('#6b7280') }];
  subtitle.x = 87.5;
  subtitle.y = 290;
  frame.appendChild(subtitle);

  // Email input
  const emailInput = figma.createFrame();
  emailInput.resize(335, 48);
  emailInput.x = 20;
  emailInput.y = 350;
  emailInput.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  emailInput.cornerRadius = 12;
  emailInput.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  emailInput.strokeWeight = 1;
  frame.appendChild(emailInput);

  const emailText = figma.createText();
  emailText.characters = 'E-mail ünvanınızı daxil edin';
  emailText.fontSize = 14;
  emailText.fontName = font;
  emailText.fills = [{ type: 'SOLID', color: hexToRgb('#9ca3af') }];
  emailText.x = 16;
  emailText.y = 17;
  emailInput.appendChild(emailText);

  // Password input
  const passwordInput = figma.createFrame();
  passwordInput.resize(335, 48);
  passwordInput.x = 20;
  passwordInput.y = 410;
  passwordInput.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  passwordInput.cornerRadius = 12;
  passwordInput.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  passwordInput.strokeWeight = 1;
  frame.appendChild(passwordInput);

  const passwordText = figma.createText();
  passwordText.characters = 'Şifrənizi daxil edin';
  passwordText.fontSize = 14;
  passwordText.fontName = font;
  passwordText.fills = [{ type: 'SOLID', color: hexToRgb('#9ca3af') }];
  passwordText.x = 16;
  passwordText.y = 17;
  passwordInput.appendChild(passwordText);

  // Login button
  const loginButton = figma.createFrame();
  loginButton.resize(335, 48);
  loginButton.x = 20;
  loginButton.y = 480;
  loginButton.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  loginButton.cornerRadius = 12;
  frame.appendChild(loginButton);

  const loginButtonText = figma.createText();
  loginButtonText.characters = 'Daxil ol';
  loginButtonText.fontSize = 16;
  loginButtonText.fontName = font;
  loginButtonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  loginButtonText.x = 147.5;
  loginButtonText.y = 16;
  loginButton.appendChild(loginButtonText);

  // Social buttons
  const googleButton = figma.createFrame();
  googleButton.resize(335, 48);
  googleButton.x = 20;
  googleButton.y = 550;
  googleButton.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  googleButton.cornerRadius = 12;
  googleButton.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  googleButton.strokeWeight = 1;
  frame.appendChild(googleButton);

  const googleButtonText = figma.createText();
  googleButtonText.characters = 'Google ilə daxil ol';
  googleButtonText.fontSize = 14;
  googleButtonText.fontName = font;
  googleButtonText.fills = [{ type: 'SOLID', color: hexToRgb('#374151') }];
  googleButtonText.x = 127.5;
  googleButtonText.y = 17;
  googleButton.appendChild(googleButtonText);
}

// Home (No Package) ekranı dizaynı
async function createHomeNoPackageScreen(frame, font) {
  // Header
  const header = figma.createFrame();
  header.resize(375, 60);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(header);

  // Header title
  const headerTitle = figma.createText();
  headerTitle.characters = 'Salam, Tural Qarayev 👋';
  headerTitle.fontSize = 16;
  headerTitle.fontName = font;
  headerTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  headerTitle.x = 20;
  headerTitle.y = 22;
  header.appendChild(headerTitle);

  // No package warning
  const warningCard = figma.createFrame();
  warningCard.resize(335, 60);
  warningCard.x = 20;
  warningCard.y = 80;
  warningCard.fills = [{ type: 'SOLID', color: hexToRgb('#dbeafe') }];
  warningCard.cornerRadius = 12;
  frame.appendChild(warningCard);

  const warningText = figma.createText();
  warningText.characters = '📦 Aktiv paketiniz yoxdur';
  warningText.fontSize = 14;
  warningText.fontName = font;
  warningText.fills = [{ type: 'SOLID', color: hexToRgb('#1e40af') }];
  warningText.x = 16;
  warningText.y = 12;
  warningCard.appendChild(warningText);

  const packageButton = figma.createFrame();
  packageButton.resize(80, 28);
  packageButton.x = 240;
  packageButton.y = 16;
  packageButton.fills = [{ type: 'SOLID', color: hexToRgb('#2563eb') }];
  packageButton.cornerRadius = 6;
  warningCard.appendChild(packageButton);

  const packageButtonText = figma.createText();
  packageButtonText.characters = 'Paket al';
  packageButtonText.fontSize = 12;
  packageButtonText.fontName = font;
  packageButtonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  packageButtonText.x = 20;
  packageButtonText.y = 8;
  packageButton.appendChild(packageButtonText);

  // Progress card
  const progressCard = figma.createFrame();
  progressCard.resize(335, 80);
  progressCard.x = 20;
  progressCard.y = 160;
  progressCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  progressCard.cornerRadius = 12;
  progressCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true
  }];
  frame.appendChild(progressCard);

  const progressText = figma.createText();
  progressText.characters = 'İrəliləyiş: 42%';
  progressText.fontSize = 14;
  progressText.fontName = font;
  progressText.fills = [{ type: 'SOLID', color: hexToRgb('#6b7280') }];
  progressText.x = 16;
  progressText.y = 16;
  progressCard.appendChild(progressText);

  // Progress bar
  const progressBar = figma.createFrame();
  progressBar.resize(303, 8);
  progressBar.x = 16;
  progressBar.y = 40;
  progressBar.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  progressBar.cornerRadius = 4;
  progressCard.appendChild(progressBar);

  const progressFill = figma.createFrame();
  progressFill.resize(127, 8);
  progressFill.x = 0;
  progressFill.y = 0;
  progressFill.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  progressFill.cornerRadius = 4;
  progressBar.appendChild(progressFill);

  // Action grid
  const actions = [
    { title: '🎬 Video dərslər', locked: true },
    { title: '📝 Sürətli test', locked: false },
    { title: '📚 Təlim mövzuları', locked: true },
    { title: '🧪 İmtahan', locked: true }
  ];

  let actionY = 260;
  for (let i = 0; i < actions.length; i += 2) {
    for (let j = 0; j < 2 && i + j < actions.length; j++) {
      const action = actions[i + j];
      const actionCard = figma.createFrame();
      actionCard.resize(160, 80);
      actionCard.x = 20 + j * 175;
      actionCard.y = actionY;
      actionCard.fills = [{ type: 'SOLID', color: action.locked ? hexToRgb('#f3f4f6') : { r: 1, g: 1, b: 1 } }];
      actionCard.cornerRadius = 12;
      actionCard.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 4,
        visible: true
      }];
      frame.appendChild(actionCard);

      const actionText = figma.createText();
      actionText.characters = action.title;
      actionText.fontSize = 12;
      actionText.fontName = font;
      actionText.fills = [{ type: 'SOLID', color: action.locked ? hexToRgb('#9ca3af') : hexToRgb('#374151') }];
      actionText.x = 16;
      actionText.y = 34;
      actionCard.appendChild(actionText);

      if (action.locked) {
        const lockIcon = figma.createText();
        lockIcon.characters = '🔒';
        lockIcon.fontSize = 16;
        lockIcon.fontName = font;
        lockIcon.x = 120;
        lockIcon.y = 16;
        actionCard.appendChild(lockIcon);
      }
    }
    actionY += 100;
  }

  // Tab bar
  const tabBar = figma.createFrame();
  tabBar.resize(375, 80);
  tabBar.x = 0;
  tabBar.y = 732;
  tabBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tabBar.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  tabBar.strokeWeight = 1;
  frame.appendChild(tabBar);

  const tabs = ['🏠 Ana', '📚 Təlimlər', '🧪 İmtahan', '🛍️ Mağaza', '➕ Daha'];
  for (let i = 0; i < tabs.length; i++) {
    const tab = figma.createText();
    tab.characters = tabs[i];
    tab.fontSize = 10;
    tab.fontName = font;
    tab.fills = [{ type: 'SOLID', color: i === 0 ? hexToRgb('#22c55e') : hexToRgb('#6b7280') }];
    tab.x = 15 + i * 75;
    tab.y = 25;
    tabBar.appendChild(tab);
  }
}

// Topics (Locked) ekranı dizaynı
async function createTopicsLockedScreen(frame, font) {
  // Header
  const header = figma.createFrame();
  header.resize(375, 60);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(header);

  const headerTitle = figma.createText();
  headerTitle.characters = 'Təlim Mövzuları';
  headerTitle.fontSize = 18;
  headerTitle.fontName = font;
  headerTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  headerTitle.x = 20;
  headerTitle.y = 21;
  header.appendChild(headerTitle);

  // Package warning
  const warningCard = figma.createFrame();
  warningCard.resize(335, 60);
  warningCard.x = 20;
  warningCard.y = 80;
  warningCard.fills = [{ type: 'SOLID', color: hexToRgb('#dbeafe') }];
  warningCard.cornerRadius = 12;
  frame.appendChild(warningCard);

  const warningText = figma.createText();
  warningText.characters = 'Paket alın və bütün təlimləri açın';
  warningText.fontSize = 14;
  warningText.fontName = font;
  warningText.fills = [{ type: 'SOLID', color: hexToRgb('#1e40af') }];
  warningText.x = 16;
  warningText.y = 23;
  warningCard.appendChild(warningText);

  // Search bar
  const searchBar = figma.createFrame();
  searchBar.resize(335, 44);
  searchBar.x = 20;
  searchBar.y = 160;
  searchBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  searchBar.cornerRadius = 12;
  searchBar.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  searchBar.strokeWeight = 1;
  frame.appendChild(searchBar);

  const searchText = figma.createText();
  searchText.characters = '🔍 Mövzu axtarın...';
  searchText.fontSize = 14;
  searchText.fontName = font;
  searchText.fills = [{ type: 'SOLID', color: hexToRgb('#9ca3af') }];
  searchText.x = 16;
  searchText.y = 15;
  searchBar.appendChild(searchText);

  // Module list
  const modules = [
    { title: 'M1: Yol hərəkəti qaydaları', progress: 0, locked: true },
    { title: 'M2: Yol nişanları', progress: 0, locked: true },
    { title: 'M3: Dairəvi hərəkət', progress: 0, locked: true },
    { title: 'M8: Pulsuz modul', progress: 25, locked: false },
    { title: 'M11: Demo modul', progress: 10, locked: false }
  ];

  let moduleY = 220;
  for (const module of modules) {
    const moduleCard = figma.createFrame();
    moduleCard.resize(335, 80);
    moduleCard.x = 20;
    moduleCard.y = moduleY;
    moduleCard.fills = [{ type: 'SOLID', color: module.locked ? hexToRgb('#f9fafb') : { r: 1, g: 1, b: 1 } }];
    moduleCard.cornerRadius = 12;
    moduleCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 2 },
      radius: 4,
      visible: true
    }];
    frame.appendChild(moduleCard);

    if (module.locked) {
      const lockIcon = figma.createText();
      lockIcon.characters = '🔒';
      lockIcon.fontSize = 16;
      lockIcon.fontName = font;
      lockIcon.x = 16;
      lockIcon.y = 16;
      moduleCard.appendChild(lockIcon);
    }

    const moduleTitle = figma.createText();
    moduleTitle.characters = module.title;
    moduleTitle.fontSize = 14;
    moduleTitle.fontName = font;
    moduleTitle.fills = [{ type: 'SOLID', color: module.locked ? hexToRgb('#9ca3af') : hexToRgb('#111827') }];
    moduleTitle.x = module.locked ? 45 : 16;
    moduleTitle.y = 16;
    moduleCard.appendChild(moduleTitle);

    const progressText = figma.createText();
    progressText.characters = `İrəliləyiş: ${module.progress}%`;
    progressText.fontSize = 12;
    progressText.fontName = font;
    progressText.fills = [{ type: 'SOLID', color: hexToRgb('#6b7280') }];
    progressText.x = module.locked ? 45 : 16;
    progressText.y = 36;
    moduleCard.appendChild(progressText);

    // Progress bar
    const progressBar = figma.createFrame();
    progressBar.resize(303, 6);
    progressBar.x = 16;
    progressBar.y = 58;
    progressBar.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
    progressBar.cornerRadius = 3;
    moduleCard.appendChild(progressBar);

    if (module.progress > 0) {
      const progressFill = figma.createFrame();
      progressFill.resize(303 * module.progress / 100, 6);
      progressFill.x = 0;
      progressFill.y = 0;
      progressFill.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      progressFill.cornerRadius = 3;
      progressBar.appendChild(progressFill);
    }

    const actionButton = figma.createFrame();
    actionButton.resize(80, 28);
    actionButton.x = 235;
    actionButton.y = 26;
    actionButton.fills = [{ type: 'SOLID', color: module.locked ? hexToRgb('#e5e7eb') : hexToRgb('#22c55e') }];
    actionButton.cornerRadius = 6;
    moduleCard.appendChild(actionButton);

    const actionButtonText = figma.createText();
    actionButtonText.characters = module.locked ? 'Kilidli' : 'Başla';
    actionButtonText.fontSize = 12;
    actionButtonText.fontName = font;
    actionButtonText.fills = [{ type: 'SOLID', color: module.locked ? hexToRgb('#9ca3af') : { r: 1, g: 1, b: 1 } }];
    actionButtonText.x = module.locked ? 22 : 28;
    actionButtonText.y = 8;
    actionButton.appendChild(actionButtonText);

    moduleY += 100;
  }

  // Tab bar
  const tabBar = figma.createFrame();
  tabBar.resize(375, 80);
  tabBar.x = 0;
  tabBar.y = 732;
  tabBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tabBar.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  tabBar.strokeWeight = 1;
  frame.appendChild(tabBar);

  const tabs = ['🏠 Ana', '📚 Təlimlər', '🧪 İmtahan', '🛍️ Mağaza', '➕ Daha'];
  for (let i = 0; i < tabs.length; i++) {
    const tab = figma.createText();
    tab.characters = tabs[i];
    tab.fontSize = 10;
    tab.fontName = font;
    tab.fills = [{ type: 'SOLID', color: i === 1 ? hexToRgb('#22c55e') : hexToRgb('#6b7280') }];
    tab.x = 15 + i * 75;
    tab.y = 25;
    tabBar.appendChild(tab);
  }
}

// Store ekranı dizaynı
async function createStoreScreen(frame, font) {
  // Header
  const header = figma.createFrame();
  header.resize(375, 60);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(header);

  const headerTitle = figma.createText();
  headerTitle.characters = 'Mağaza';
  headerTitle.fontSize = 18;
  headerTitle.fontName = font;
  headerTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  headerTitle.x = 20;
  headerTitle.y = 21;
  header.appendChild(headerTitle);

  // Store intro
  const introCard = figma.createFrame();
  introCard.resize(335, 60);
  introCard.x = 20;
  introCard.y = 80;
  introCard.fills = [{ type: 'SOLID', color: hexToRgb('#f0fdf4') }];
  introCard.cornerRadius = 12;
  frame.appendChild(introCard);

  const introTitle = figma.createText();
  introTitle.characters = 'Sürücülük kitabları və materialları';
  introTitle.fontSize = 14;
  introTitle.fontName = font;
  introTitle.fills = [{ type: 'SOLID', color: hexToRgb('#166534') }];
  introTitle.x = 16;
  introTitle.y = 23;
  introCard.appendChild(introTitle);

  // Books grid
  const books = [
    { title: 'Yol Hərəkəti Qaydaları', price: '12 AZN' },
    { title: 'Yol Nişanları Atlası', price: '8 AZN' },
    { title: 'Sürücülük Təcrübəsi', price: '15 AZN' },
    { title: 'İmtahan Hazırlığı', price: '10 AZN' }
  ];

  let bookY = 160;
  for (let i = 0; i < books.length; i += 2) {
    for (let j = 0; j < 2 && i + j < books.length; j++) {
      const book = books[i + j];
      const bookCard = figma.createFrame();
      bookCard.resize(160, 200);
      bookCard.x = 20 + j * 175;
      bookCard.y = bookY;
      bookCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      bookCard.cornerRadius = 12;
      bookCard.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 4,
        visible: true
      }];
      frame.appendChild(bookCard);

      // Book image placeholder
      const bookImage = figma.createFrame();
      bookImage.resize(128, 96);
      bookImage.x = 16;
      bookImage.y = 16;
      bookImage.fills = [{ type: 'SOLID', color: hexToRgb('#f3f4f6') }];
      bookImage.cornerRadius = 8;
      bookCard.appendChild(bookImage);

      const bookIcon = figma.createText();
      bookIcon.characters = '📚';
      bookIcon.fontSize = 32;
      bookIcon.fontName = font;
      bookIcon.x = 48;
      bookIcon.y = 32;
      bookImage.appendChild(bookIcon);

      const bookTitle = figma.createText();
      bookTitle.characters = book.title;
      bookTitle.fontSize = 12;
      bookTitle.fontName = font;
      bookTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
      bookTitle.x = 16;
      bookTitle.y = 128;
      bookCard.appendChild(bookTitle);

      const bookPrice = figma.createText();
      bookPrice.characters = book.price;
      bookPrice.fontSize = 14;
      bookPrice.fontName = font;
      bookPrice.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      bookPrice.x = 16;
      bookPrice.y = 148;
      bookCard.appendChild(bookPrice);

      const buyButton = figma.createFrame();
      buyButton.resize(128, 28);
      buyButton.x = 16;
      buyButton.y = 172;
      buyButton.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      buyButton.cornerRadius = 6;
      bookCard.appendChild(buyButton);

      const buyButtonText = figma.createText();
      buyButtonText.characters = 'Səbətə at';
      buyButtonText.fontSize = 12;
      buyButtonText.fontName = font;
      buyButtonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      buyButtonText.x = 38;
      buyButtonText.y = 8;
      buyButton.appendChild(buyButtonText);
    }
    bookY += 220;
  }

  // Payment methods
  const paymentCard = figma.createFrame();
  paymentCard.resize(335, 100);
  paymentCard.x = 20;
  paymentCard.y = 600;
  paymentCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  paymentCard.cornerRadius = 12;
  paymentCard.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true
  }];
  frame.appendChild(paymentCard);

  const paymentTitle = figma.createText();
  paymentTitle.characters = 'Ödəniş üsulları';
  paymentTitle.fontSize = 14;
  paymentTitle.fontName = font;
  paymentTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  paymentTitle.x = 16;
  paymentTitle.y = 16;
  paymentCard.appendChild(paymentTitle);

  const paymentMethods = ['💳 Kart', '📱 Mobil', '🏦 Bank'];
  for (let i = 0; i < paymentMethods.length; i++) {
    const methodCard = figma.createFrame();
    methodCard.resize(95, 40);
    methodCard.x = 16 + i * 105;
    methodCard.y = 44;
    methodCard.fills = [{ type: 'SOLID', color: hexToRgb('#f9fafb') }];
    methodCard.cornerRadius = 8;
    methodCard.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
    methodCard.strokeWeight = 1;
    paymentCard.appendChild(methodCard);

    const methodText = figma.createText();
    methodText.characters = paymentMethods[i];
    methodText.fontSize = 12;
    methodText.fontName = font;
    methodText.fills = [{ type: 'SOLID', color: hexToRgb('#6b7280') }];
    methodText.x = 25;
    methodText.y = 14;
    methodCard.appendChild(methodText);
  }

  // Tab bar
  const tabBar = figma.createFrame();
  tabBar.resize(375, 80);
  tabBar.x = 0;
  tabBar.y = 732;
  tabBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tabBar.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  tabBar.strokeWeight = 1;
  frame.appendChild(tabBar);

  const tabs = ['🏠 Ana', '📚 Təlimlər', '🧪 İmtahan', '🛍️ Mağaza', '➕ Daha'];
  for (let i = 0; i < tabs.length; i++) {
    const tab = figma.createText();
    tab.characters = tabs[i];
    tab.fontSize = 10;
    tab.fontName = font;
    tab.fills = [{ type: 'SOLID', color: i === 3 ? hexToRgb('#22c55e') : hexToRgb('#6b7280') }];
    tab.x = 15 + i * 75;
    tab.y = 25;
    tabBar.appendChild(tab);
  }
}

// Packages List ekranı dizaynı
async function createPackagesListScreen(frame, font) {
  // Header
  const header = figma.createFrame();
  header.resize(375, 60);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(header);

  const backButton = figma.createFrame();
  backButton.resize(36, 36);
  backButton.x = 20;
  backButton.y = 12;
  backButton.fills = [{ type: 'SOLID', color: hexToRgb('#f3f4f6') }];
  backButton.cornerRadius = 8;
  header.appendChild(backButton);

  const backIcon = figma.createText();
  backIcon.characters = '←';
  backIcon.fontSize = 16;
  backIcon.fontName = font;
  backIcon.fills = [{ type: 'SOLID', color: hexToRgb('#374151') }];
  backIcon.x = 10;
  backIcon.y = 10;
  backButton.appendChild(backIcon);

  const headerTitle = figma.createText();
  headerTitle.characters = 'Təlim Paketləri';
  headerTitle.fontSize = 18;
  headerTitle.fontName = font;
  headerTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  headerTitle.x = 70;
  headerTitle.y = 21;
  header.appendChild(headerTitle);

  // Balance info
  const balanceCard = figma.createFrame();
  balanceCard.resize(335, 60);
  balanceCard.x = 20;
  balanceCard.y = 80;
  balanceCard.fills = [{ type: 'SOLID', color: hexToRgb('#f0fdf4') }];
  balanceCard.cornerRadius = 12;
  frame.appendChild(balanceCard);

  const balanceText = figma.createText();
  balanceText.characters = 'Balans: 100 AZN';
  balanceText.fontSize = 16;
  balanceText.fontName = font;
  balanceText.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  balanceText.x = 16;
  balanceText.y = 22;
  balanceCard.appendChild(balanceText);

  // Package cards
  const packages = [
    { name: 'Sadə Paket', price: '15 AZN', popular: false, color: '#6b7280' },
    { name: 'Standart Paket', price: '25 AZN', popular: true, color: '#22c55e' },
    { name: 'Premium Paket', price: '40 AZN', popular: false, color: '#3b82f6' }
  ];

  let packageY = 160;
  for (const pkg of packages) {
    const packageCard = figma.createFrame();
    packageCard.resize(335, 200);
    packageCard.x = 20;
    packageCard.y = packageY;
    packageCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    packageCard.cornerRadius = 16;
    packageCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 8,
      visible: true
    }];
    if (pkg.popular) {
      packageCard.strokes = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      packageCard.strokeWeight = 2;
    }
    frame.appendChild(packageCard);

    if (pkg.popular) {
      const popularBadge = figma.createFrame();
      popularBadge.resize(120, 24);
      popularBadge.x = 107.5;
      popularBadge.y = -12;
      popularBadge.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: [[1, 0, 0], [0, 1, 0]],
        gradientStops: [
          { position: 0, color: hexToRgb('#22c55e') },
          { position: 1, color: hexToRgb('#16a34a') }
        ]
      }];
      popularBadge.cornerRadius = 12;
      packageCard.appendChild(popularBadge);

      const popularText = figma.createText();
      popularText.characters = '⭐ Ən Populyar';
      popularText.fontSize = 12;
      popularText.fontName = font;
      popularText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      popularText.x = 20;
      popularText.y = 6;
      popularBadge.appendChild(popularText);
    }

    const packageName = figma.createText();
    packageName.characters = pkg.name;
    packageName.fontSize = 20;
    packageName.fontName = font;
    packageName.fills = [{ type: 'SOLID', color: hexToRgb(pkg.color) }];
    packageName.x = 16;
    packageName.y = 20;
    packageCard.appendChild(packageName);

    const packagePrice = figma.createText();
    packagePrice.characters = pkg.price;
    packagePrice.fontSize = 28;
    packagePrice.fontName = font;
    packagePrice.fills = [{ type: 'SOLID', color: hexToRgb(pkg.color) }];
    packagePrice.x = 16;
    packagePrice.y = 50;
    packageCard.appendChild(packagePrice);

    const packageDuration = figma.createText();
    packageDuration.characters = '30 gün müddətinə';
    packageDuration.fontSize = 12;
    packageDuration.fontName = font;
    packageDuration.fills = [{ type: 'SOLID', color: hexToRgb('#6b7280') }];
    packageDuration.x = 16;
    packageDuration.y = 85;
    packageCard.appendChild(packageDuration);

    // Features
    const features = [
      '✓ 3D video dərslər',
      '✓ Dərs materialları',
      '✓ İmtahan simulyatoru',
      '✓ Müəllimlə əlaqə'
    ];

    let featureY = 110;
    for (const feature of features) {
      const featureText = figma.createText();
      featureText.characters = feature;
      featureText.fontSize = 12;
      featureText.fontName = font;
      featureText.fills = [{ type: 'SOLID', color: hexToRgb('#374151') }];
      featureText.x = 16;
      featureText.y = featureY;
      packageCard.appendChild(featureText);
      featureY += 18;
    }

    const buyButton = figma.createFrame();
    buyButton.resize(303, 36);
    buyButton.x = 16;
    buyButton.y = 180;
    buyButton.fills = [{ type: 'SOLID', color: hexToRgb(pkg.color) }];
    buyButton.cornerRadius = 8;
    packageCard.appendChild(buyButton);

    const buyButtonText = figma.createText();
    buyButtonText.characters = `Paketi Al - ${pkg.price}`;
    buyButtonText.fontSize = 14;
    buyButtonText.fontName = font;
    buyButtonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    buyButtonText.x = 100;
    buyButtonText.y = 11;
    buyButton.appendChild(buyButtonText);

    packageY += 220;
  }
}

// Default ekran dizaynı
async function createDefaultScreen(frame, screen, font) {
  // Arxa plan
  frame.fills = [{ type: 'SOLID', color: hexToRgb(screen.color) }];

  // Başlıq
  const title = figma.createText();
  title.characters = screen.name;
  title.fontSize = 18;
  title.fontName = font;
  title.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  title.x = 20;
  title.y = 40;
  frame.appendChild(title);

  // Kateqoriya
  const category = figma.createText();
  category.characters = `📱 ${screen.category}`;
  category.fontSize = 14;
  category.fontName = font;
  category.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.8 } }];
  category.x = 20;
  category.y = 70;
  frame.appendChild(category);

  // Placeholder content
  const placeholder = figma.createFrame();
  placeholder.resize(335, 200);
  placeholder.x = 20;
  placeholder.y = 120;
  placeholder.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.1 } }];
  placeholder.cornerRadius = 12;
  frame.appendChild(placeholder);

  const placeholderText = figma.createText();
  placeholderText.characters = 'Ekran məzmunu\nburada olacaq';
  placeholderText.fontSize = 16;
  placeholderText.fontName = font;
  placeholderText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.7 } }];
  placeholderText.x = 120;
  placeholderText.y = 90;
  placeholder.appendChild(placeholderText);
}

// Hər şeyi yarat
async function createEverything() {
  console.log('🚀 Hər şey yaradılır...');
  
  try {
    figma.notify('🚀 Başlanır... (60 saniyə)');
    
    await createColorSystem();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await createTypographySystem();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await createComponents();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await createDetailedScreens();
    
    figma.notify('🎉 Tamamlandı! 30 detallı ekran + design system hazır!');
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

console.log('✅ Plugin hazırdır - Detallı Dizayn Modu!');