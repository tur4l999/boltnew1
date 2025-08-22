// DDA.az Design Exporter Plugin - Tam Dizayn Sistemi
// Bu plugin 34 mobil ekran + design system + flow map yaradır

console.log('🚀 DDA.az Design Exporter başladı');

// Plugin UI-ni göstər
figma.showUI(__html__, { 
  width: 400, 
  height: 600,
  themeColors: true 
});

// Global dəyişənlər
let currentFont = { family: 'Inter', style: 'Regular' };
let boldFont = { family: 'Inter', style: 'Bold' };

// UI mesajlarını dinlə
figma.ui.onmessage = async (msg) => {
  console.log('📨 Mesaj alındı:', msg.type);
  
  try {
    switch (msg.type) {
      case 'create-all':
        await createEverything();
        break;
      case 'create-styles':
        await createStylesOnly();
        break;
      case 'regenerate':
        await regenerateAll();
        break;
      case 'create-flow':
        await createFlowMap();
        break;
      case 'close':
        figma.closePlugin();
        break;
      default:
        console.log('⚠️ Naməlum mesaj:', msg.type);
    }
  } catch (error) {
    console.error('❌ Xəta:', error);
    figma.notify('❌ Xəta: ' + error.message, { error: true });
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
};

// Font yükləyici
async function loadFonts() {
  try {
    const availableFonts = await figma.listAvailableFontsAsync();
    
    // Inter fontunu tap
    const interRegular = availableFonts.find(f => 
      f.fontName.family === 'Inter' && f.fontName.style === 'Regular'
    );
    const interBold = availableFonts.find(f => 
      f.fontName.family === 'Inter' && f.fontName.style === 'Bold'
    );
    
    if (interRegular) {
      currentFont = interRegular.fontName;
      await figma.loadFontAsync(currentFont);
      console.log('✅ Inter Regular yükləndi');
    }
    
    if (interBold) {
      boldFont = interBold.fontName;
      await figma.loadFontAsync(boldFont);
      console.log('✅ Inter Bold yükləndi');
    }
    
    // Fallback fontlar
    if (!interRegular) {
      const fallbacks = ['Roboto', 'Arial', 'Helvetica'];
      for (const fontFamily of fallbacks) {
        const found = availableFonts.find(f => f.fontName.family === fontFamily);
        if (found) {
          currentFont = found.fontName;
          await figma.loadFontAsync(currentFont);
          console.log(`✅ Fallback font yükləndi: ${fontFamily}`);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Font yükləmə xətası:', error);
    figma.notify('⚠️ Font yükləmə problemi', { error: true });
  }
}

// Rəng sistemi yaradıcısı
async function createColorStyles() {
  console.log('🎨 Rəng stilləri yaradılır...');
  
  const colors = {
    // Light theme
    'Light/Background': '#f9fafb',
    'Light/Surface': '#ffffff',
    'Light/Text Primary': '#111827',
    'Light/Text Secondary': '#6b7280',
    'Light/Text Muted': '#9ca3af',
    'Light/Brand': '#22c55e',
    'Light/Brand Alt': '#16a34a',
    'Light/Border': '#e5e7eb',
    'Light/Accent': '#3b82f6',
    'Light/Danger': '#ef4444',
    
    // Dark theme
    'Dark/Background': '#111827',
    'Dark/Surface': '#1f2937',
    'Dark/Text Primary': '#f9fafb',
    'Dark/Text Secondary': '#d1d5db',
    'Dark/Text Muted': '#9ca3af',
    'Dark/Brand': '#34d399',
    'Dark/Brand Alt': '#10b981',
    'Dark/Border': '#374151',
    'Dark/Accent': '#60a5fa',
    'Dark/Danger': '#f87171',
    
    // Brand colors
    'Brand/Primary 50': '#f0fdf4',
    'Brand/Primary 100': '#dcfce7',
    'Brand/Primary 200': '#bbf7d0',
    'Brand/Primary 300': '#86efac',
    'Brand/Primary 400': '#4ade80',
    'Brand/Primary 500': '#22c55e',
    'Brand/Primary 600': '#16a34a',
    'Brand/Primary 700': '#15803d',
    'Brand/Primary 800': '#166534',
    'Brand/Primary 900': '#14532d'
  };

  for (const [name, hex] of Object.entries(colors)) {
    const style = figma.createPaintStyle();
    style.name = name;
    style.paints = [{
      type: 'SOLID',
      color: hexToRgb(hex)
    }];
  }
  
  console.log('✅ 30 rəng stili yaradıldı');
}

// Typography sistemi yaradıcısı
async function createTextStyles() {
  console.log('📝 Text stilləri yaradılır...');
  
  const textStyles = [
    { name: 'Typography/H1', size: 28, lineHeight: 36, weight: 'Bold' },
    { name: 'Typography/H2', size: 22, lineHeight: 30, weight: 'Bold' },
    { name: 'Typography/H3', size: 18, lineHeight: 24, weight: 'Bold' },
    { name: 'Typography/Body', size: 16, lineHeight: 24, weight: 'Regular' },
    { name: 'Typography/Body Small', size: 14, lineHeight: 20, weight: 'Regular' },
    { name: 'Typography/Caption', size: 12, lineHeight: 16, weight: 'Regular' }
  ];

  for (const textStyle of textStyles) {
    const style = figma.createTextStyle();
    style.name = textStyle.name;
    style.fontSize = textStyle.size;
    style.lineHeight = { value: textStyle.lineHeight, unit: 'PIXELS' };
    style.fontName = textStyle.weight === 'Bold' ? boldFont : currentFont;
  }
  
  console.log('✅ 6 text stili yaradıldı');
}

// Hər şeyi yarat
async function createEverything() {
  figma.ui.postMessage({ type: 'progress', message: '🚀 Başlanır...', progress: 5 });
  
  await loadFonts();
  figma.ui.postMessage({ type: 'progress', message: '🎨 Rəng stilləri...', progress: 15 });
  
  await createColorStyles();
  figma.ui.postMessage({ type: 'progress', message: '📝 Text stilləri...', progress: 25 });
  
  await createTextStyles();
  figma.ui.postMessage({ type: 'progress', message: '📱 Ekranlar yaradılır...', progress: 40 });
  
  await createAllScreens();
  figma.ui.postMessage({ type: 'progress', message: '🌙 Dark variantlar...', progress: 85 });
  
  await createDarkVariants();
  figma.ui.postMessage({ type: 'progress', message: '✅ Tamamlandı!', progress: 100 });
  
  figma.notify('🎉 34 ekran + design system yaradıldı!');
}

// Yalnız stillər yarat
async function createStylesOnly() {
  figma.ui.postMessage({ type: 'progress', message: '🎨 Stillər yaradılır...', progress: 20 });
  
  await loadFonts();
  await createColorStyles();
  await createTextStyles();
  
  figma.ui.postMessage({ type: 'progress', message: '✅ Stillər hazır!', progress: 100 });
  figma.notify('✅ Design system stilləri yaradıldı!');
}

// Yenidən yarat (təmizlə və yarat)
async function regenerateAll() {
  figma.ui.postMessage({ type: 'progress', message: '🗑️ Təmizlənir...', progress: 10 });
  
  // Mövcud səhifələri tap və sil
  const existingPages = figma.root.children.filter(page => 
    page.name.includes('DDA Mobile')
  );
  
  for (const page of existingPages) {
    page.remove();
  }
  
  figma.ui.postMessage({ type: 'progress', message: '🚀 Yenidən yaradılır...', progress: 20 });
  await createEverything();
}

// Bütün ekranları yarat
async function createAllScreens() {
  // Screens səhifəsi yarat
  const screensPage = figma.createPage();
  screensPage.name = '📱 DDA Mobile — All Screens';
  figma.currentPage = screensPage;

  const screens = [
    // Auth & Onboarding (4)
    { name: '01. Login', category: 'Auth', design: 'login' },
    { name: '02. Onboarding 1', category: 'Auth', design: 'onboarding1' },
    { name: '03. Onboarding 2', category: 'Auth', design: 'onboarding2' },
    { name: '04. Onboarding 3', category: 'Auth', design: 'onboarding3' },
    
    // Main (4)
    { name: '05. Home (No Package)', category: 'Main', design: 'home-no-package' },
    { name: '06. Topics (Locked)', category: 'Main', design: 'topics-locked' },
    { name: '07. Store', category: 'Main', design: 'store' },
    { name: '08. More Menu', category: 'Main', design: 'more' },
    
    // Purchase (4)
    { name: '09. Packages List', category: 'Purchase', design: 'packages' },
    { name: '10. Package Details', category: 'Purchase', design: 'package-details' },
    { name: '11. Payment Methods', category: 'Purchase', design: 'payment' },
    { name: '12. Purchase Success', category: 'Purchase', design: 'success' },
    
    // Premium (2)
    { name: '13. Home (Premium)', category: 'Premium', design: 'home-premium' },
    { name: '14. Topics (Unlocked)', category: 'Premium', design: 'topics-unlocked' },
    
    // Learning (4)
    { name: '15. Lesson View', category: 'Learning', design: 'lesson' },
    { name: '16. Video Player', category: 'Learning', design: 'video' },
    { name: '17. Practice Questions', category: 'Learning', design: 'practice' },
    { name: '18. Teacher Contact', category: 'Learning', design: 'teacher' },
    
    // Exam (5)
    { name: '19. Exam Config', category: 'Exam', design: 'exam-config' },
    { name: '20. Exam Running', category: 'Exam', design: 'exam-running' },
    { name: '21. Exam Results (Pass)', category: 'Exam', design: 'results-pass' },
    { name: '22. Exam Results (Fail)', category: 'Exam', design: 'results-fail' },
    { name: '23. Mistakes Review', category: 'Exam', design: 'mistakes' },
    
    // Support (3)
    { name: '24. AI Chat', category: 'Support', design: 'ai-chat' },
    { name: '25. Chat History', category: 'Support', design: 'chat-history' },
    { name: '26. Notifications', category: 'Support', design: 'notifications' },
    
    // Profile (4)
    { name: '27. Settings', category: 'Profile', design: 'settings' },
    { name: '28. Profile Edit', category: 'Profile', design: 'profile-edit' },
    { name: '29. Transactions', category: 'Profile', design: 'transactions' },
    { name: '30. Balance Top-up', category: 'Profile', design: 'balance' }
  ];

  let x = 0;
  let y = 0;
  const spacing = 455; // 375 + 80px gap

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    
    // Ekran frame-i yarat
    const frame = figma.createFrame();
    frame.name = screen.name;
    frame.resize(375, 812);
    frame.x = x;
    frame.y = y;
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#f9fafb') }];
    frame.cornerRadius = 20;
    frame.layoutMode = 'VERTICAL';
    frame.paddingTop = 0;
    frame.paddingBottom = 0;
    frame.paddingLeft = 0;
    frame.paddingRight = 0;
    frame.itemSpacing = 0;

    // Ekranın dizaynını yarat
    await createScreenDesign(frame, screen);

    // Grid düzümü (4 sütun)
    x += spacing;
    if ((i + 1) % 4 === 0) {
      x = 0;
      y += 900;
    }
    
    // Progress update
    const progress = 40 + Math.floor((i / screens.length) * 40);
    figma.ui.postMessage({ 
      type: 'progress', 
      message: `📱 ${screen.name} yaradıldı...`, 
      progress 
    });
  }

  console.log('✅ 30 əsas ekran yaradıldı');
}

// Dark variantları yarat
async function createDarkVariants() {
  const darkScreens = [
    { name: '31. Home — Dark', design: 'home-premium', isDark: true },
    { name: '32. Topics — Dark', design: 'topics-unlocked', isDark: true },
    { name: '33. Lesson — Dark', design: 'lesson', isDark: true },
    { name: '34. Settings — Dark', design: 'settings', isDark: true }
  ];

  let x = 0;
  let y = 8100; // Aşağıda yerləşdir

  for (let i = 0; i < darkScreens.length; i++) {
    const screen = darkScreens[i];
    
    const frame = figma.createFrame();
    frame.name = screen.name;
    frame.resize(375, 812);
    frame.x = x;
    frame.y = y;
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }]; // Dark background
    frame.cornerRadius = 20;
    frame.layoutMode = 'VERTICAL';

    await createScreenDesign(frame, screen);

    x += 455;
  }

  console.log('✅ 4 dark variant yaradıldı');
}

// Ekran dizaynı yaradıcısı
async function createScreenDesign(frame, screen) {
  try {
    switch (screen.design) {
      case 'login':
        await createLoginDesign(frame, screen.isDark);
        break;
      case 'onboarding1':
        await createOnboardingDesign(frame, 1, screen.isDark);
        break;
      case 'onboarding2':
        await createOnboardingDesign(frame, 2, screen.isDark);
        break;
      case 'onboarding3':
        await createOnboardingDesign(frame, 3, screen.isDark);
        break;
      case 'home-no-package':
        await createHomeNoPackageDesign(frame, screen.isDark);
        break;
      case 'home-premium':
        await createHomePremiumDesign(frame, screen.isDark);
        break;
      case 'topics-locked':
        await createTopicsLockedDesign(frame, screen.isDark);
        break;
      case 'topics-unlocked':
        await createTopicsUnlockedDesign(frame, screen.isDark);
        break;
      case 'store':
        await createStoreDesign(frame, screen.isDark);
        break;
      case 'packages':
        await createPackagesDesign(frame, screen.isDark);
        break;
      case 'lesson':
        await createLessonDesign(frame, screen.isDark);
        break;
      case 'exam-config':
        await createExamConfigDesign(frame, screen.isDark);
        break;
      case 'exam-running':
        await createExamRunningDesign(frame, screen.isDark);
        break;
      case 'ai-chat':
        await createAIChatDesign(frame, screen.isDark);
        break;
      case 'settings':
        await createSettingsDesign(frame, screen.isDark);
        break;
      default:
        await createDefaultDesign(frame, screen);
        break;
    }
  } catch (error) {
    console.warn(`⚠️ ${screen.name} dizayn xətası:`, error);
    await createDefaultDesign(frame, screen);
  }
}

// Login ekranı dizaynı
async function createLoginDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f0fdf4';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#f9fafb' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';
  
  frame.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: hexToRgb(bgColor) },
      { position: 1, color: hexToRgb(isDark ? '#1f2937' : '#dcfce7') }
    ]
  }];

  // Logo container
  const logoContainer = figma.createFrame();
  logoContainer.resize(375, 200);
  logoContainer.fills = [];
  logoContainer.layoutMode = 'VERTICAL';
  logoContainer.primaryAxisAlignItems = 'CENTER';
  logoContainer.counterAxisAlignItems = 'CENTER';
  logoContainer.itemSpacing = 16;
  logoContainer.paddingTop = 60;
  frame.appendChild(logoContainer);

  // Logo
  const logo = figma.createFrame();
  logo.resize(80, 80);
  logo.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  logo.cornerRadius = 20;
  logoContainer.appendChild(logo);

  const logoText = figma.createText();
  logoText.characters = 'DDA';
  logoText.fontSize = 24;
  logoText.fontName = boldFont;
  logoText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  logoText.x = 28;
  logoText.y = 28;
  logo.appendChild(logoText);

  // Title
  const title = figma.createText();
  title.characters = 'DDA.az';
  title.fontSize = 32;
  title.fontName = boldFont;
  title.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];
  logoContainer.appendChild(title);

  // Subtitle
  const subtitle = figma.createText();
  subtitle.characters = 'Sürücülük vəsiqəsi üçün hazırlıq';
  subtitle.fontSize = 16;
  subtitle.fontName = currentFont;
  subtitle.fills = [{ type: 'SOLID', color: hexToRgb(mutedColor) }];
  logoContainer.appendChild(subtitle);

  // Form container
  const formContainer = figma.createFrame();
  formContainer.resize(335, 300);
  formContainer.x = 20;
  formContainer.y = 250;
  formContainer.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  formContainer.cornerRadius = 16;
  formContainer.layoutMode = 'VERTICAL';
  formContainer.itemSpacing = 16;
  formContainer.paddingTop = 24;
  formContainer.paddingBottom = 24;
  formContainer.paddingLeft = 20;
  formContainer.paddingRight = 20;
  frame.appendChild(formContainer);

  // Email input
  const emailInput = createInput('E-mail ünvanınızı daxil edin', isDark);
  formContainer.appendChild(emailInput);

  // Password input
  const passwordInput = createInput('Şifrənizi daxil edin', isDark);
  formContainer.appendChild(passwordInput);

  // Login button
  const loginButton = createButton('Daxil ol', 'primary', isDark);
  formContainer.appendChild(loginButton);

  // Social button
  const socialButton = createButton('Google ilə daxil ol', 'secondary', isDark);
  formContainer.appendChild(socialButton);
}

// Home (No Package) dizaynı
async function createHomeNoPackageDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#f9fafb' : '#111827';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeader('Salam, Tural 👋', isDark);
  frame.appendChild(header);

  // Warning card
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
  warningText.fontName = currentFont;
  warningText.fills = [{ type: 'SOLID', color: hexToRgb('#1e40af') }];
  warningText.x = 16;
  warningText.y = 23;
  warningCard.appendChild(warningText);

  // Progress card
  const progressCard = figma.createFrame();
  progressCard.resize(335, 80);
  progressCard.x = 20;
  progressCard.y = 160;
  progressCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
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
  progressText.fontName = currentFont;
  progressText.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];
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
      const actionCard = createActionCard(action, 20 + j * 175, actionY, isDark);
      frame.appendChild(actionCard);
    }
    actionY += 100;
  }

  // Tab bar
  const tabBar = createTabBar(0, isDark);
  frame.appendChild(tabBar);
}

// Packages dizaynı
async function createPackagesDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header with back button
  const header = createHeaderWithBack('Təlim Paketləri', isDark);
  frame.appendChild(header);

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
  balanceText.fontName = boldFont;
  balanceText.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  balanceText.x = 16;
  balanceText.y = 22;
  balanceCard.appendChild(balanceText);

  // Package cards
  const packages = [
    { name: 'Sadə Paket', price: '15 AZN', popular: false },
    { name: 'Standart Paket', price: '25 AZN', popular: true },
    { name: 'Premium Paket', price: '40 AZN', popular: false }
  ];

  let packageY = 160;
  for (const pkg of packages) {
    const packageCard = figma.createFrame();
    packageCard.resize(335, 180);
    packageCard.x = 20;
    packageCard.y = packageY;
    packageCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
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

    // Popular badge
    if (pkg.popular) {
      const badge = figma.createFrame();
      badge.resize(120, 24);
      badge.x = 107.5;
      badge.y = -12;
      badge.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      badge.cornerRadius = 12;
      packageCard.appendChild(badge);

      const badgeText = figma.createText();
      badgeText.characters = '⭐ Ən Populyar';
      badgeText.fontSize = 12;
      badgeText.fontName = boldFont;
      badgeText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      badgeText.x = 20;
      badgeText.y = 6;
      badge.appendChild(badgeText);
    }

    // Package content
    const packageName = figma.createText();
    packageName.characters = pkg.name;
    packageName.fontSize = 20;
    packageName.fontName = boldFont;
    packageName.fills = [{ type: 'SOLID', color: hexToRgb(pkg.popular ? '#22c55e' : (isDark ? '#f9fafb' : '#111827')) }];
    packageName.x = 16;
    packageName.y = 20;
    packageCard.appendChild(packageName);

    const packagePrice = figma.createText();
    packagePrice.characters = pkg.price;
    packagePrice.fontSize = 28;
    packagePrice.fontName = boldFont;
    packagePrice.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
    packagePrice.x = 16;
    packagePrice.y = 50;
    packageCard.appendChild(packagePrice);

    // Features
    const features = ['✓ 3D video dərslər', '✓ Dərs materialları', '✓ İmtahan simulyatoru'];
    let featureY = 90;
    for (const feature of features) {
      const featureText = figma.createText();
      featureText.characters = feature;
      featureText.fontSize = 12;
      featureText.fontName = currentFont;
      featureText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#d1d5db' : '#374151') }];
      featureText.x = 16;
      featureText.y = featureY;
      packageCard.appendChild(featureText);
      featureY += 18;
    }

    // Buy button
    const buyButton = createButton(`Paketi Al - ${pkg.price}`, 'primary', isDark);
    buyButton.resize(303, 36);
    buyButton.x = 16;
    buyButton.y = 140;
    packageCard.appendChild(buyButton);

    packageY += 200;
  }
}

// AI Chat dizaynı
async function createAIChatDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#f9fafb' : '#111827';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createChatHeader(isDark);
  frame.appendChild(header);

  // Messages area
  const messagesArea = figma.createFrame();
  messagesArea.resize(375, 600);
  messagesArea.x = 0;
  messagesArea.y = 80;
  messagesArea.fills = [];
  frame.appendChild(messagesArea);

  // AI message
  const aiMessage = figma.createFrame();
  aiMessage.resize(280, 60);
  aiMessage.x = 20;
  aiMessage.y = 20;
  aiMessage.fills = [{ type: 'SOLID', color: hexToRgb('#f3f4f6') }];
  aiMessage.cornerRadius = 16;
  messagesArea.appendChild(aiMessage);

  const aiText = figma.createText();
  aiText.characters = 'Salam! Sürücülük qaydaları ilə bağlı suallarınızı verə bilərsiniz.';
  aiText.fontSize = 14;
  aiText.fontName = currentFont;
  aiText.fills = [{ type: 'SOLID', color: hexToRgb('#374151') }];
  aiText.x = 16;
  aiText.y = 16;
  aiText.resize(248, 28);
  aiMessage.appendChild(aiText);

  // User message
  const userMessage = figma.createFrame();
  userMessage.resize(250, 40);
  userMessage.x = 105;
  userMessage.y = 100;
  userMessage.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  userMessage.cornerRadius = 16;
  messagesArea.appendChild(userMessage);

  const userText = figma.createText();
  userText.characters = 'Yol nişanlarının növləri hansılardır?';
  userText.fontSize = 14;
  userText.fontName = currentFont;
  userText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  userText.x = 16;
  userText.y = 13;
  userMessage.appendChild(userText);

  // Input area
  const inputArea = figma.createFrame();
  inputArea.resize(375, 80);
  inputArea.x = 0;
  inputArea.y = 732;
  inputArea.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  inputArea.strokes = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  inputArea.strokeWeight = 1;
  frame.appendChild(inputArea);

  const input = createInput('Sualınızı yazın...', isDark);
  input.resize(250, 44);
  input.x = 16;
  input.y = 18;
  inputArea.appendChild(input);

  const sendButton = createButton('Göndər', 'primary', isDark);
  sendButton.resize(80, 44);
  sendButton.x = 279;
  sendButton.y = 18;
  inputArea.appendChild(sendButton);
}

// Flow Map yaradıcısı
async function createFlowMap() {
  figma.ui.postMessage({ type: 'progress', message: '🗺️ Flow Map yaradılır...', progress: 20 });
  
  const flowPage = figma.createPage();
  flowPage.name = '🗺️ DDA Mobile — Flow Map';
  figma.currentPage = flowPage;

  const flows = [
    // Auth Flow
    { name: 'Login', x: 100, y: 100, connects: ['Onboarding 1'] },
    { name: 'Onboarding 1', x: 300, y: 100, connects: ['Onboarding 2'] },
    { name: 'Onboarding 2', x: 500, y: 100, connects: ['Onboarding 3'] },
    { name: 'Onboarding 3', x: 700, y: 100, connects: ['Home (No Package)'] },
    
    // Main Flow
    { name: 'Home (No Package)', x: 100, y: 300, connects: ['Topics (Locked)', 'Store', 'More'] },
    { name: 'Topics (Locked)', x: 300, y: 300, connects: ['Packages List'] },
    { name: 'Store', x: 500, y: 300, connects: [] },
    { name: 'More', x: 700, y: 300, connects: ['Settings'] },
    
    // Purchase Flow
    { name: 'Packages List', x: 100, y: 500, connects: ['Package Details'] },
    { name: 'Package Details', x: 300, y: 500, connects: ['Payment'] },
    { name: 'Payment', x: 500, y: 500, connects: ['Purchase Success'] },
    { name: 'Purchase Success', x: 700, y: 500, connects: ['Home (Premium)'] },
    
    // Premium Flow
    { name: 'Home (Premium)', x: 100, y: 700, connects: ['Topics (Unlocked)', 'Lesson View'] },
    { name: 'Topics (Unlocked)', x: 300, y: 700, connects: ['Lesson View'] },
    { name: 'Lesson View', x: 500, y: 700, connects: ['Practice', 'Exam Config'] },
    
    // Support
    { name: 'AI Chat', x: 900, y: 300, connects: [] },
    { name: 'Settings', x: 900, y: 500, connects: [] }
  ];

  // Flow box-ları yarat
  for (const flow of flows) {
    const box = figma.createFrame();
    box.name = flow.name;
    box.resize(160, 80);
    box.x = flow.x;
    box.y = flow.y;
    box.fills = [{ type: 'SOLID', color: hexToRgb('#ffffff') }];
    box.cornerRadius = 12;
    box.strokes = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
    box.strokeWeight = 2;
    box.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 8,
      visible: true
    }];

    const boxText = figma.createText();
    boxText.characters = flow.name;
    boxText.fontSize = 12;
    boxText.fontName = boldFont;
    boxText.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
    boxText.textAlignHorizontal = 'CENTER';
    boxText.textAlignVertical = 'CENTER';
    boxText.x = 20;
    boxText.y = 35;
    boxText.resize(120, 20);
    box.appendChild(boxText);
  }

  // Connector-ları yarat
  for (const flow of flows) {
    for (const target of flow.connects) {
      const targetFlow = flows.find(f => f.name === target);
      if (targetFlow) {
        const line = figma.createLine();
        line.x = flow.x + 160;
        line.y = flow.y + 40;
        line.resize(targetFlow.x - flow.x - 160, 0);
        line.strokes = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
        line.strokeWeight = 2;
        
        // Arrow head
        const arrow = figma.createPolygon();
        arrow.pointCount = 3;
        arrow.x = targetFlow.x - 10;
        arrow.y = targetFlow.y + 35;
        arrow.resize(10, 10);
        arrow.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      }
    }
  }

  figma.ui.postMessage({ type: 'progress', message: '✅ Flow Map hazır!', progress: 100 });
  figma.notify('✅ Flow Map yaradıldı!');
}

// Yardımçı funksiyalar
function createHeader(title, isDark = false) {
  const header = figma.createFrame();
  header.resize(375, 60);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#1f2937' : '#ffffff') }];
  header.strokes = [{ type: 'SOLID', color: hexToRgb(isDark ? '#374151' : '#e5e7eb') }];
  header.strokeWeight = 1;

  const headerTitle = figma.createText();
  headerTitle.characters = title;
  headerTitle.fontSize = 16;
  headerTitle.fontName = boldFont;
  headerTitle.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  headerTitle.x = 20;
  headerTitle.y = 22;
  header.appendChild(headerTitle);

  return header;
}

function createHeaderWithBack(title, isDark = false) {
  const header = createHeader(title, isDark);
  
  const backButton = figma.createFrame();
  backButton.resize(36, 36);
  backButton.x = 20;
  backButton.y = 12;
  backButton.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#374151' : '#f3f4f6') }];
  backButton.cornerRadius = 8;
  header.appendChild(backButton);

  const backIcon = figma.createText();
  backIcon.characters = '←';
  backIcon.fontSize = 16;
  backIcon.fontName = currentFont;
  backIcon.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#374151') }];
  backIcon.x = 10;
  backIcon.y = 10;
  backButton.appendChild(backIcon);

  // Adjust title position
  const titleText = header.children.find(child => child.type === 'TEXT');
  if (titleText) {
    titleText.x = 70;
  }

  return header;
}

function createTabBar(activeIndex = 0, isDark = false) {
  const tabBar = figma.createFrame();
  tabBar.resize(375, 80);
  tabBar.x = 0;
  tabBar.y = 732;
  tabBar.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#1f2937' : '#ffffff') }];
  tabBar.strokes = [{ type: 'SOLID', color: hexToRgb(isDark ? '#374151' : '#e5e7eb') }];
  tabBar.strokeWeight = 1;

  const tabs = ['🏠 Ana', '📚 Təlimlər', '🧪 İmtahan', '🛍️ Mağaza', '➕ Daha'];
  for (let i = 0; i < tabs.length; i++) {
    const tab = figma.createText();
    tab.characters = tabs[i];
    tab.fontSize = 10;
    tab.fontName = currentFont;
    tab.fills = [{ type: 'SOLID', color: hexToRgb(i === activeIndex ? '#22c55e' : (isDark ? '#9ca3af' : '#6b7280')) }];
    tab.x = 15 + i * 75;
    tab.y = 25;
    tabBar.appendChild(tab);
  }

  return tabBar;
}

function createButton(text, variant = 'primary', isDark = false) {
  const button = figma.createFrame();
  button.resize(295, 44);
  
  let bgColor, textColor;
  if (variant === 'primary') {
    bgColor = '#22c55e';
    textColor = '#ffffff';
  } else {
    bgColor = isDark ? '#374151' : '#f3f4f6';
    textColor = isDark ? '#f9fafb' : '#374151';
  }
  
  button.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];
  button.cornerRadius = 12;

  const buttonText = figma.createText();
  buttonText.characters = text;
  buttonText.fontSize = 14;
  buttonText.fontName = boldFont;
  buttonText.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];
  buttonText.textAlignHorizontal = 'CENTER';
  buttonText.textAlignVertical = 'CENTER';
  buttonText.x = 20;
  buttonText.y = 15;
  buttonText.resize(255, 14);
  button.appendChild(buttonText);

  return button;
}

function createInput(placeholder, isDark = false) {
  const input = figma.createFrame();
  input.resize(295, 44);
  input.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#374151' : '#ffffff') }];
  input.cornerRadius = 12;
  input.strokes = [{ type: 'SOLID', color: hexToRgb(isDark ? '#4b5563' : '#e5e7eb') }];
  input.strokeWeight = 1;

  const inputText = figma.createText();
  inputText.characters = placeholder;
  inputText.fontSize = 14;
  inputText.fontName = currentFont;
  inputText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#9ca3af') }];
  inputText.x = 16;
  inputText.y = 15;
  input.appendChild(inputText);

  return input;
}

function createActionCard(action, x, y, isDark = false) {
  const card = figma.createFrame();
  card.resize(160, 80);
  card.x = x;
  card.y = y;
  card.fills = [{ type: 'SOLID', color: hexToRgb(action.locked ? (isDark ? '#374151' : '#f9fafb') : (isDark ? '#1f2937' : '#ffffff')) }];
  card.cornerRadius = 12;
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true
  }];

  if (action.locked) {
    const lockIcon = figma.createText();
    lockIcon.characters = '🔒';
    lockIcon.fontSize = 16;
    lockIcon.fontName = currentFont;
    lockIcon.x = 16;
    lockIcon.y = 16;
    card.appendChild(lockIcon);
  }

  const actionText = figma.createText();
  actionText.characters = action.title;
  actionText.fontSize = 12;
  actionText.fontName = boldFont;
  actionText.fills = [{ type: 'SOLID', color: hexToRgb(action.locked ? (isDark ? '#9ca3af' : '#9ca3af') : (isDark ? '#f9fafb' : '#374151')) }];
  actionText.x = action.locked ? 45 : 16;
  actionText.y = 34;
  actionText.resize(action.locked ? 99 : 128, 12);
  card.appendChild(actionText);

  return card;
}

function createChatHeader(isDark = false) {
  const header = figma.createFrame();
  header.resize(375, 80);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#1f2937' : '#ffffff') }];
  header.strokes = [{ type: 'SOLID', color: hexToRgb(isDark ? '#374151' : '#e5e7eb') }];
  header.strokeWeight = 1;

  // Back button
  const backButton = figma.createFrame();
  backButton.resize(36, 36);
  backButton.x = 20;
  backButton.y = 22;
  backButton.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#374151' : '#f3f4f6') }];
  backButton.cornerRadius = 8;
  header.appendChild(backButton);

  const backIcon = figma.createText();
  backIcon.characters = '←';
  backIcon.fontSize = 16;
  backIcon.fontName = currentFont;
  backIcon.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#374151') }];
  backIcon.x = 10;
  backIcon.y = 10;
  backButton.appendChild(backIcon);

  // AI avatar
  const avatar = figma.createFrame();
  avatar.resize(32, 32);
  avatar.x = 70;
  avatar.y = 24;
  avatar.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  avatar.cornerRadius = 16;
  header.appendChild(avatar);

  const avatarIcon = figma.createText();
  avatarIcon.characters = '🤖';
  avatarIcon.fontSize = 16;
  avatarIcon.fontName = currentFont;
  avatarIcon.x = 8;
  avatarIcon.y = 8;
  avatar.appendChild(avatarIcon);

  // Title
  const title = figma.createText();
  title.characters = 'DDA.az AI Köməkçi';
  title.fontSize = 16;
  title.fontName = boldFont;
  title.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  title.x = 110;
  title.y = 20;
  header.appendChild(title);

  const status = figma.createText();
  status.characters = '● Onlayn';
  status.fontSize = 12;
  status.fontName = currentFont;
  status.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  status.x = 110;
  status.y = 40;
  header.appendChild(status);

  return header;
}

function createDefaultDesign(frame, screen) {
  // Default dizayn
  frame.fills = [{ type: 'SOLID', color: hexToRgb('#f9fafb') }];

  const title = figma.createText();
  title.characters = screen.name;
  title.fontSize = 18;
  title.fontName = boldFont;
  title.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }];
  title.x = 20;
  title.y = 40;
  frame.appendChild(title);

  const category = figma.createText();
  category.characters = `📱 ${screen.category}`;
  category.fontSize = 14;
  category.fontName = currentFont;
  category.fills = [{ type: 'SOLID', color: hexToRgb('#6b7280') }];
  category.x = 20;
  category.y = 70;
  frame.appendChild(category);
}

// Hex rəngi RGB-yə çevir
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

console.log('✅ Plugin hazırdır!');