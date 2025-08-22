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
      case 'more':
        await createMoreDesign(frame, screen.isDark);
        break;
      case 'packages':
        await createPackagesDesign(frame, screen.isDark);
        break;
      case 'package-details':
        await createPackageDetailsDesign(frame, screen.isDark);
        break;
      case 'payment':
        await createPaymentDesign(frame, screen.isDark);
        break;
      case 'success':
        await createSuccessDesign(frame, screen.isDark);
        break;
      case 'lesson':
        await createLessonDesign(frame, screen.isDark);
        break;
      case 'video':
        await createVideoDesign(frame, screen.isDark);
        break;
      case 'practice':
        await createPracticeDesign(frame, screen.isDark);
        break;
      case 'teacher':
        await createTeacherDesign(frame, screen.isDark);
        break;
      case 'exam-config':
        await createExamConfigDesign(frame, screen.isDark);
        break;
      case 'exam-running':
        await createExamRunningDesign(frame, screen.isDark);
        break;
      case 'results-pass':
        await createResultsDesign(frame, true, screen.isDark);
        break;
      case 'results-fail':
        await createResultsDesign(frame, false, screen.isDark);
        break;
      case 'mistakes':
        await createMistakesDesign(frame, screen.isDark);
        break;
      case 'ai-chat':
        await createAIChatDesign(frame, screen.isDark);
        break;
      case 'chat-history':
        await createChatHistoryDesign(frame, screen.isDark);
        break;
      case 'notifications':
        await createNotificationsDesign(frame, screen.isDark);
        break;
      case 'settings':
        await createSettingsDesign(frame, screen.isDark);
        break;
      case 'profile-edit':
        await createProfileEditDesign(frame, screen.isDark);
        break;
      case 'transactions':
        await createTransactionsDesign(frame, screen.isDark);
        break;
      case 'balance':
        await createBalanceDesign(frame, screen.isDark);
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

// Onboarding ekranları
async function createOnboardingDesign(frame, step, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f0fdf4';
  const textColor = isDark ? '#f9fafb' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  const content = {
    1: { emoji: '🎓', title: 'DDA.az-a Xoş Gəldiniz', text: 'Sürücülük vəsiqəsi almaq üçün ən yaxşı hazırlıq platforması' },
    2: { emoji: '📱', title: 'Müasir Təlim Sistemi', text: '3D video dərslər, AI köməkçi və real imtahan simulyatoru' },
    3: { emoji: '🚀', title: 'Hazırsınız!', text: 'İndi təlimə başlayaq və sürücülük vəsiqənizi alaq' }
  };

  const stepContent = content[step];

  // Content container
  const container = figma.createFrame();
  container.resize(335, 400);
  container.x = 20;
  container.y = 200;
  container.fills = [];
  container.layoutMode = 'VERTICAL';
  container.primaryAxisAlignItems = 'CENTER';
  container.counterAxisAlignItems = 'CENTER';
  container.itemSpacing = 24;
  frame.appendChild(container);

  // Emoji
  const emoji = figma.createText();
  emoji.characters = stepContent.emoji;
  emoji.fontSize = 80;
  emoji.fontName = currentFont;
  container.appendChild(emoji);

  // Title
  const title = figma.createText();
  title.characters = stepContent.title;
  title.fontSize = 24;
  title.fontName = boldFont;
  title.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];
  title.textAlignHorizontal = 'CENTER';
  container.appendChild(title);

  // Description
  const description = figma.createText();
  description.characters = stepContent.text;
  description.fontSize = 16;
  description.fontName = currentFont;
  description.fills = [{ type: 'SOLID', color: hexToRgb(mutedColor) }];
  description.textAlignHorizontal = 'CENTER';
  description.resize(295, 48);
  container.appendChild(description);

  // Progress dots
  const dotsContainer = figma.createFrame();
  dotsContainer.resize(60, 8);
  dotsContainer.fills = [];
  dotsContainer.layoutMode = 'HORIZONTAL';
  dotsContainer.itemSpacing = 8;
  container.appendChild(dotsContainer);

  for (let i = 1; i <= 3; i++) {
    const dot = figma.createFrame();
    dot.resize(8, 8);
    dot.fills = [{ type: 'SOLID', color: hexToRgb(i === step ? '#22c55e' : '#e5e7eb') }];
    dot.cornerRadius = 4;
    dotsContainer.appendChild(dot);
  }

  // Next button
  const nextButton = createButton(step === 3 ? 'Başlayaq' : 'Sonrakı', 'primary', isDark);
  nextButton.y = 650;
  nextButton.x = 40;
  frame.appendChild(nextButton);
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

// Home Premium dizaynı
async function createHomePremiumDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeader('Salam, Tural 👋', isDark);
  frame.appendChild(header);

  // Premium status card
  const premiumCard = figma.createFrame();
  premiumCard.resize(335, 60);
  premiumCard.x = 20;
  premiumCard.y = 80;
  premiumCard.fills = [{ type: 'SOLID', color: hexToRgb('#f0fdf4') }];
  premiumCard.cornerRadius = 12;
  frame.appendChild(premiumCard);

  const premiumText = figma.createText();
  premiumText.characters = '👑 Premium üzv - Bütün funksiyalar aktiv';
  premiumText.fontSize = 14;
  premiumText.fontName = boldFont;
  premiumText.fills = [{ type: 'SOLID', color: hexToRgb('#065f46') }];
  premiumText.x = 16;
  premiumText.y = 23;
  premiumCard.appendChild(premiumText);

  // Progress card (same as no-package but higher progress)
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
  progressText.characters = 'İrəliləyiş: 78%';
  progressText.fontSize = 14;
  progressText.fontName = currentFont;
  progressText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  progressText.x = 16;
  progressText.y = 16;
  progressCard.appendChild(progressText);

  // Progress bar (higher progress)
  const progressBar = figma.createFrame();
  progressBar.resize(303, 8);
  progressBar.x = 16;
  progressBar.y = 40;
  progressBar.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  progressBar.cornerRadius = 4;
  progressCard.appendChild(progressBar);

  const progressFill = figma.createFrame();
  progressFill.resize(236, 8); // 78% of 303
  progressFill.x = 0;
  progressFill.y = 0;
  progressFill.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  progressFill.cornerRadius = 4;
  progressBar.appendChild(progressFill);

  // Action grid (all unlocked)
  const actions = [
    { title: '🎬 Video dərslər', locked: false },
    { title: '📝 Sürətli test', locked: false },
    { title: '📚 Təlim mövzuları', locked: false },
    { title: '🧪 İmtahan', locked: false }
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

// Topics Locked dizaynı
async function createTopicsLockedDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header with search
  const header = createHeader('Təlim Mövzuları', isDark);
  frame.appendChild(header);

  // Search input
  const searchInput = createInput('Mövzu axtarın...', isDark);
  searchInput.x = 20;
  searchInput.y = 80;
  frame.appendChild(searchInput);

  // Module list (mostly locked)
  const modules = [
    { title: 'M1: Yol hərəkəti qaydaları', progress: 100, locked: false },
    { title: 'M2: Yol nişanları', progress: 45, locked: false },
    { title: 'M3: Dairəvi hərəkət', progress: 0, locked: true },
    { title: 'M4: Sürət məhdudiyyətləri', progress: 0, locked: true },
    { title: 'M5: Piyada keçidləri', progress: 0, locked: true }
  ];

  let moduleY = 140;
  for (const module of modules) {
    const moduleCard = figma.createFrame();
    moduleCard.resize(335, 80);
    moduleCard.x = 20;
    moduleCard.y = moduleY;
    moduleCard.fills = [{ type: 'SOLID', color: hexToRgb(module.locked ? (isDark ? '#374151' : '#f9fafb') : surfaceColor) }];
    moduleCard.cornerRadius = 12;
    moduleCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 2 },
      radius: 4,
      visible: true
    }];
    frame.appendChild(moduleCard);

    // Lock icon
    if (module.locked) {
      const lockIcon = figma.createText();
      lockIcon.characters = '🔒';
      lockIcon.fontSize = 16;
      lockIcon.fontName = currentFont;
      lockIcon.x = 16;
      lockIcon.y = 16;
      moduleCard.appendChild(lockIcon);
    }

    // Module title
    const moduleTitle = figma.createText();
    moduleTitle.characters = module.title;
    moduleTitle.fontSize = 14;
    moduleTitle.fontName = boldFont;
    moduleTitle.fills = [{ type: 'SOLID', color: hexToRgb(module.locked ? (isDark ? '#9ca3af' : '#9ca3af') : (isDark ? '#f9fafb' : '#111827')) }];
    moduleTitle.x = module.locked ? 45 : 16;
    moduleTitle.y = 16;
    moduleCard.appendChild(moduleTitle);

    // Progress text
    const progressText = figma.createText();
    progressText.characters = `İrəliləyiş: ${module.progress}%`;
    progressText.fontSize = 12;
    progressText.fontName = currentFont;
    progressText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#6b7280') }];
    progressText.x = module.locked ? 45 : 16;
    progressText.y = 35;
    moduleCard.appendChild(progressText);

    // Progress bar
    const progressBar = figma.createFrame();
    progressBar.resize(module.locked ? 254 : 283, 6);
    progressBar.x = module.locked ? 45 : 16;
    progressBar.y = 55;
    progressBar.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
    progressBar.cornerRadius = 3;
    moduleCard.appendChild(progressBar);

    if (module.progress > 0) {
      const progressFill = figma.createFrame();
      progressFill.resize((module.locked ? 254 : 283) * module.progress / 100, 6);
      progressFill.x = 0;
      progressFill.y = 0;
      progressFill.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      progressFill.cornerRadius = 3;
      progressBar.appendChild(progressFill);
    }

    // Start button
    const startButton = createButton(module.locked ? 'Kilidli' : 'Başla', module.locked ? 'disabled' : 'primary', isDark);
    startButton.resize(80, 32);
    startButton.x = 271;
    startButton.y = 24;
    moduleCard.appendChild(startButton);

    moduleY += 100;
  }

  // Tab bar
  const tabBar = createTabBar(1, isDark);
  frame.appendChild(tabBar);
}

// Topics Unlocked dizaynı
async function createTopicsUnlockedDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeader('Təlim Mövzuları', isDark);
  frame.appendChild(header);

  // Premium status
  const premiumCard = figma.createFrame();
  premiumCard.resize(335, 50);
  premiumCard.x = 20;
  premiumCard.y = 80;
  premiumCard.fills = [{ type: 'SOLID', color: hexToRgb('#f0fdf4') }];
  premiumCard.cornerRadius = 12;
  frame.appendChild(premiumCard);

  const premiumText = figma.createText();
  premiumText.characters = '🔓 Bütün təlimlər açıq - Premium üzv';
  premiumText.fontSize = 14;
  premiumText.fontName = boldFont;
  premiumText.fills = [{ type: 'SOLID', color: hexToRgb('#065f46') }];
  premiumText.x = 16;
  premiumText.y = 18;
  premiumCard.appendChild(premiumText);

  // Search input
  const searchInput = createInput('Mövzu axtarın...', isDark);
  searchInput.x = 20;
  searchInput.y = 150;
  frame.appendChild(searchInput);

  // Module list (all unlocked)
  const modules = [
    { title: 'M1: Yol hərəkəti qaydaları', progress: 100 },
    { title: 'M2: Yol nişanları', progress: 85 },
    { title: 'M3: Dairəvi hərəkət', progress: 60 },
    { title: 'M4: Sürət məhdudiyyətləri', progress: 40 },
    { title: 'M5: Piyada keçidləri', progress: 20 }
  ];

  let moduleY = 210;
  for (const module of modules) {
    const moduleCard = figma.createFrame();
    moduleCard.resize(335, 80);
    moduleCard.x = 20;
    moduleCard.y = moduleY;
    moduleCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
    moduleCard.cornerRadius = 12;
    moduleCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 2 },
      radius: 4,
      visible: true
    }];
    frame.appendChild(moduleCard);

    // Module title
    const moduleTitle = figma.createText();
    moduleTitle.characters = module.title;
    moduleTitle.fontSize = 14;
    moduleTitle.fontName = boldFont;
    moduleTitle.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
    moduleTitle.x = 16;
    moduleTitle.y = 16;
    moduleCard.appendChild(moduleTitle);

    // Progress text
    const progressText = figma.createText();
    progressText.characters = `İrəliləyiş: ${module.progress}%`;
    progressText.fontSize = 12;
    progressText.fontName = currentFont;
    progressText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#6b7280') }];
    progressText.x = 16;
    progressText.y = 35;
    moduleCard.appendChild(progressText);

    // Progress bar
    const progressBar = figma.createFrame();
    progressBar.resize(283, 6);
    progressBar.x = 16;
    progressBar.y = 55;
    progressBar.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
    progressBar.cornerRadius = 3;
    moduleCard.appendChild(progressBar);

    const progressFill = figma.createFrame();
    progressFill.resize(283 * module.progress / 100, 6);
    progressFill.x = 0;
    progressFill.y = 0;
    progressFill.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
    progressFill.cornerRadius = 3;
    progressBar.appendChild(progressFill);

    // Start button
    const startButton = createButton('Başla', 'primary', isDark);
    startButton.resize(80, 32);
    startButton.x = 271;
    startButton.y = 24;
    moduleCard.appendChild(startButton);

    moduleY += 100;
  }

  // Tab bar
  const tabBar = createTabBar(1, isDark);
  frame.appendChild(tabBar);
}

// Store dizaynı
async function createStoreDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeader('Mağaza', isDark);
  frame.appendChild(header);

  // Books grid
  const books = [
    { title: 'Yol Hərəkəti Qaydaları', price: '12 AZN' },
    { title: 'Yol Nişanları Atlası', price: '8 AZN' },
    { title: 'Sürücülük Təcrübəsi', price: '15 AZN' },
    { title: 'İmtahan Hazırlığı', price: '10 AZN' }
  ];

  let bookY = 100;
  for (let i = 0; i < books.length; i += 2) {
    for (let j = 0; j < 2 && i + j < books.length; j++) {
      const book = books[i + j];
      const bookCard = figma.createFrame();
      bookCard.resize(160, 200);
      bookCard.x = 20 + j * 175;
      bookCard.y = bookY;
      bookCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
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
      bookImage.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
      bookImage.cornerRadius = 8;
      bookCard.appendChild(bookImage);

      const bookEmoji = figma.createText();
      bookEmoji.characters = '📚';
      bookEmoji.fontSize = 32;
      bookEmoji.fontName = currentFont;
      bookEmoji.x = 48;
      bookEmoji.y = 32;
      bookImage.appendChild(bookEmoji);

      // Book title
      const bookTitle = figma.createText();
      bookTitle.characters = book.title;
      bookTitle.fontSize = 12;
      bookTitle.fontName = boldFont;
      bookTitle.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
      bookTitle.x = 16;
      bookTitle.y = 125;
      bookTitle.resize(128, 24);
      bookCard.appendChild(bookTitle);

      // Price
      const price = figma.createText();
      price.characters = book.price;
      price.fontSize = 16;
      price.fontName = boldFont;
      price.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
      price.x = 16;
      price.y = 155;
      bookCard.appendChild(price);

      // Buy button
      const buyButton = createButton('Səbətə at', 'primary', isDark);
      buyButton.resize(128, 28);
      buyButton.x = 16;
      buyButton.y = 180;
      bookCard.appendChild(buyButton);
    }
    bookY += 220;
  }

  // Tab bar
  const tabBar = createTabBar(3, isDark);
  frame.appendChild(tabBar);
}

// More Menu dizaynı
async function createMoreDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeader('Daha çox', isDark);
  frame.appendChild(header);

  // Balance info
  const balanceCard = figma.createFrame();
  balanceCard.resize(335, 60);
  balanceCard.x = 20;
  balanceCard.y = 80;
  balanceCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  balanceCard.cornerRadius = 12;
  frame.appendChild(balanceCard);

  const balanceText = figma.createText();
  balanceText.characters = 'Balans: 100 AZN • Bilet: 3';
  balanceText.fontSize = 14;
  balanceText.fontName = boldFont;
  balanceText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  balanceText.x = 16;
  balanceText.y = 23;
  balanceCard.appendChild(balanceText);

  // Menu items
  const menuItems = [
    { title: 'Təlim paketləri', emoji: '📦' },
    { title: 'Daxili balans', emoji: '💰' },
    { title: 'Şəhadətnamə almaq', emoji: '🏆' },
    { title: 'Praktiki təcrübə', emoji: '🚗' },
    { title: 'Səhvlərim', emoji: '⚠️' },
    { title: 'Sual-cavab', emoji: '❓' },
    { title: 'Apellyasiyalarım', emoji: '📝' },
    { title: 'Bildirişlər', emoji: '🔔' },
    { title: 'Parametrlər', emoji: '⚙️' },
    { title: 'Dəstək', emoji: '🆘' }
  ];

  let itemY = 160;
  for (const item of menuItems) {
    const menuCard = figma.createFrame();
    menuCard.resize(335, 56);
    menuCard.x = 20;
    menuCard.y = itemY;
    menuCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
    menuCard.cornerRadius = 12;
    menuCard.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 1 },
      radius: 2,
      visible: true
    }];
    frame.appendChild(menuCard);

    // Icon
    const icon = figma.createText();
    icon.characters = item.emoji;
    icon.fontSize = 20;
    icon.fontName = currentFont;
    icon.x = 20;
    icon.y = 18;
    menuCard.appendChild(icon);

    // Title
    const title = figma.createText();
    title.characters = item.title;
    title.fontSize = 14;
    title.fontName = currentFont;
    title.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
    title.x = 60;
    title.y = 21;
    menuCard.appendChild(title);

    // Arrow
    const arrow = figma.createText();
    arrow.characters = '›';
    arrow.fontSize = 16;
    arrow.fontName = currentFont;
    arrow.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#9ca3af') }];
    arrow.x = 315;
    arrow.y = 20;
    menuCard.appendChild(arrow);

    itemY += 66;
  }

  // Tab bar
  const tabBar = createTabBar(4, isDark);
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

// Lesson dizaynı
async function createLessonDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header with back
  const header = createHeaderWithBack('M8: Yol nişanları', isDark);
  frame.appendChild(header);

  // Video player
  const videoPlayer = figma.createFrame();
  videoPlayer.resize(335, 200);
  videoPlayer.x = 20;
  videoPlayer.y = 80;
  videoPlayer.fills = [{ type: 'SOLID', color: hexToRgb('#000000') }];
  videoPlayer.cornerRadius = 12;
  frame.appendChild(videoPlayer);

  // Play button
  const playButton = figma.createFrame();
  playButton.resize(60, 60);
  playButton.x = 137.5;
  playButton.y = 70;
  playButton.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.9 } }];
  playButton.cornerRadius = 30;
  videoPlayer.appendChild(playButton);

  const playIcon = figma.createText();
  playIcon.characters = '▶';
  playIcon.fontSize = 20;
  playIcon.fontName = currentFont;
  playIcon.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  playIcon.x = 22;
  playIcon.y = 20;
  playButton.appendChild(playIcon);

  // Lesson tabs
  const tabsContainer = figma.createFrame();
  tabsContainer.resize(335, 40);
  tabsContainer.x = 20;
  tabsContainer.y = 300;
  tabsContainer.fills = [];
  tabsContainer.layoutMode = 'HORIZONTAL';
  tabsContainer.itemSpacing = 8;
  frame.appendChild(tabsContainer);

  const tabs = ['Video', 'Maddə', 'Suallar'];
  for (let i = 0; i < tabs.length; i++) {
    const tab = createButton(tabs[i], i === 0 ? 'primary' : 'secondary', isDark);
    tab.resize(105, 32);
    tabsContainer.appendChild(tab);
  }

  // Content area
  const contentCard = figma.createFrame();
  contentCard.resize(335, 200);
  contentCard.x = 20;
  contentCard.y = 360;
  contentCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  contentCard.cornerRadius = 12;
  frame.appendChild(contentCard);

  const contentText = figma.createText();
  contentText.characters = 'Video dərs məzmunu burada göstərilir. Offline saxlama və müəllimlə əlaqə funksiyaları mövcuddur.';
  contentText.fontSize = 14;
  contentText.fontName = currentFont;
  contentText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#d1d5db' : '#374151') }];
  contentText.x = 16;
  contentText.y = 16;
  contentText.resize(303, 60);
  contentCard.appendChild(contentText);

  // Action buttons
  const actionY = 600;
  const practiceButton = createButton('📝 Suallar', 'primary', isDark);
  practiceButton.resize(160, 44);
  practiceButton.x = 20;
  practiceButton.y = actionY;
  frame.appendChild(practiceButton);

  const examButton = createButton('🧪 İmtahan', 'primary', isDark);
  examButton.resize(160, 44);
  examButton.x = 195;
  examButton.y = actionY;
  frame.appendChild(examButton);
}

// Exam Config dizaynı
async function createExamConfigDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeaderWithBack('İmtahan Tənzimləmələri', isDark);
  frame.appendChild(header);

  // Config card
  const configCard = figma.createFrame();
  configCard.resize(335, 300);
  configCard.x = 20;
  configCard.y = 100;
  configCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  configCard.cornerRadius = 16;
  configCard.layoutMode = 'VERTICAL';
  configCard.itemSpacing = 20;
  configCard.paddingTop = 24;
  configCard.paddingBottom = 24;
  configCard.paddingLeft = 20;
  configCard.paddingRight = 20;
  frame.appendChild(configCard);

  // Exam type
  const typeLabel = figma.createText();
  typeLabel.characters = 'İmtahan növü:';
  typeLabel.fontSize = 14;
  typeLabel.fontName = boldFont;
  typeLabel.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  configCard.appendChild(typeLabel);

  const simulatorButton = createButton('🧪 İmtahan Simulyatoru', 'primary', isDark);
  configCard.appendChild(simulatorButton);

  const finalButton = createButton('📋 Yekun İmtahan', 'secondary', isDark);
  configCard.appendChild(finalButton);

  // Questions count
  const countLabel = figma.createText();
  countLabel.characters = 'Sual sayı: 10';
  countLabel.fontSize = 14;
  countLabel.fontName = boldFont;
  countLabel.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  configCard.appendChild(countLabel);

  // Start button
  const startButton = createButton('İmtahana Başla', 'primary', isDark);
  startButton.y = 450;
  startButton.x = 40;
  frame.appendChild(startButton);
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

// Settings dizaynı
async function createSettingsDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeaderWithBack('Parametrlər', isDark);
  frame.appendChild(header);

  // Profile card
  const profileCard = figma.createFrame();
  profileCard.resize(335, 80);
  profileCard.x = 20;
  profileCard.y = 80;
  profileCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  profileCard.cornerRadius = 12;
  frame.appendChild(profileCard);

  // Avatar
  const avatar = figma.createFrame();
  avatar.resize(48, 48);
  avatar.x = 16;
  avatar.y = 16;
  avatar.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
  avatar.cornerRadius = 24;
  profileCard.appendChild(avatar);

  const avatarText = figma.createText();
  avatarText.characters = 'T';
  avatarText.fontSize = 20;
  avatarText.fontName = boldFont;
  avatarText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  avatarText.x = 18;
  avatarText.y = 14;
  avatar.appendChild(avatarText);

  // Profile info
  const profileName = figma.createText();
  profileName.characters = 'Tural Qarayev';
  profileName.fontSize = 16;
  profileName.fontName = boldFont;
  profileName.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  profileName.x = 80;
  profileName.y = 20;
  profileCard.appendChild(profileName);

  const profileEmail = figma.createText();
  profileEmail.characters = 'tural@example.com';
  profileEmail.fontSize = 12;
  profileEmail.fontName = currentFont;
  profileEmail.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#6b7280') }];
  profileEmail.x = 80;
  profileEmail.y = 40;
  profileCard.appendChild(profileEmail);

  // Settings sections
  const settingsItems = [
    { section: 'Hesabım', items: ['👤 Profil məlumatları', '🔒 Təhlükəsizlik', '🛡️ Məxfilik'] },
    { section: 'Tətbiq', items: ['📱 Offline məzmun', '🗑️ Keş təmizlə', '🔄 Yeniləmələr'] },
    { section: 'Dəstək', items: ['❓ Kömək mərkəzi', '📞 Bizimlə əlaqə', '💬 Rəy bildirin'] }
  ];

  let sectionY = 180;
  for (const section of settingsItems) {
    // Section header
    const sectionHeader = figma.createText();
    sectionHeader.characters = section.section;
    sectionHeader.fontSize = 14;
    sectionHeader.fontName = boldFont;
    sectionHeader.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#d1d5db' : '#6b7280') }];
    sectionHeader.x = 20;
    sectionHeader.y = sectionY;
    frame.appendChild(sectionHeader);

    sectionY += 30;

    // Section items
    for (const item of section.items) {
      const itemCard = figma.createFrame();
      itemCard.resize(335, 50);
      itemCard.x = 20;
      itemCard.y = sectionY;
      itemCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
      itemCard.cornerRadius = 8;
      frame.appendChild(itemCard);

      const itemText = figma.createText();
      itemText.characters = item;
      itemText.fontSize = 14;
      itemText.fontName = currentFont;
      itemText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
      itemText.x = 16;
      itemText.y = 18;
      itemCard.appendChild(itemText);

      const arrow = figma.createText();
      arrow.characters = '›';
      arrow.fontSize = 16;
      arrow.fontName = currentFont;
      arrow.fills = [{ type: 'SOLID', color: hexToRgb('#9ca3af') }];
      arrow.x = 315;
      arrow.y = 17;
      itemCard.appendChild(arrow);

      sectionY += 60;
    }

    sectionY += 20;
  }
}

// Practice dizaynı
async function createPracticeDesign(frame, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeaderWithBack('Sürətli Test', isDark);
  frame.appendChild(header);

  // Question card
  const questionCard = figma.createFrame();
  questionCard.resize(335, 500);
  questionCard.x = 20;
  questionCard.y = 100;
  questionCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  questionCard.cornerRadius = 16;
  frame.appendChild(questionCard);

  // Question number
  const questionNumber = figma.createText();
  questionNumber.characters = '1/5';
  questionNumber.fontSize = 12;
  questionNumber.fontName = currentFont;
  questionNumber.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#6b7280') }];
  questionNumber.x = 16;
  questionNumber.y = 16;
  questionCard.appendChild(questionNumber);

  // Question text
  const questionText = figma.createText();
  questionText.characters = 'Sarı işıq yananda sürücü nə etməlidir?';
  questionText.fontSize = 16;
  questionText.fontName = boldFont;
  questionText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#f9fafb' : '#111827') }];
  questionText.x = 16;
  questionText.y = 40;
  questionText.resize(303, 40);
  questionCard.appendChild(questionText);

  // Question image
  const questionImage = figma.createFrame();
  questionImage.resize(303, 150);
  questionImage.x = 16;
  questionImage.y = 90;
  questionImage.fills = [{ type: 'SOLID', color: hexToRgb('#e5e7eb') }];
  questionImage.cornerRadius = 8;
  questionCard.appendChild(questionImage);

  const imageIcon = figma.createText();
  imageIcon.characters = '🚦';
  imageIcon.fontSize = 48;
  imageIcon.fontName = currentFont;
  imageIcon.x = 127.5;
  imageIcon.y = 51;
  questionImage.appendChild(imageIcon);

  // Answer options
  const options = [
    'Sürəti artırıb keçmək',
    'Yavaşlayıb dayanmağa hazırlaşmaq',
    'Dərhal dayanmaq',
    'Siqnal vermək'
  ];

  let optionY = 260;
  for (let i = 0; i < options.length; i++) {
    const optionCard = figma.createFrame();
    optionCard.resize(303, 40);
    optionCard.x = 16;
    optionCard.y = optionY;
    optionCard.fills = [{ type: 'SOLID', color: hexToRgb(i === 1 ? '#f0fdf4' : (isDark ? '#374151' : '#f9fafb')) }];
    optionCard.cornerRadius = 8;
    optionCard.strokes = [{ type: 'SOLID', color: hexToRgb(i === 1 ? '#22c55e' : '#e5e7eb') }];
    optionCard.strokeWeight = 1;
    questionCard.appendChild(optionCard);

    // Radio button
    const radio = figma.createFrame();
    radio.resize(16, 16);
    radio.x = 12;
    radio.y = 12;
    radio.fills = [{ type: 'SOLID', color: hexToRgb(i === 1 ? '#22c55e' : '#ffffff') }];
    radio.cornerRadius = 8;
    radio.strokes = [{ type: 'SOLID', color: hexToRgb(i === 1 ? '#22c55e' : '#d1d5db') }];
    radio.strokeWeight = 2;
    optionCard.appendChild(radio);

    if (i === 1) {
      const radioCheck = figma.createFrame();
      radioCheck.resize(6, 6);
      radioCheck.x = 5;
      radioCheck.y = 5;
      radioCheck.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      radioCheck.cornerRadius = 3;
      radio.appendChild(radioCheck);
    }

    // Option text
    const optionText = figma.createText();
    optionText.characters = options[i];
    optionText.fontSize = 14;
    optionText.fontName = currentFont;
    optionText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#d1d5db' : '#374151') }];
    optionText.x = 40;
    optionText.y = 13;
    optionCard.appendChild(optionText);

    optionY += 50;
  }

  // Action buttons
  const confirmButton = createButton('Cavabı Təsdiq Et', 'primary', isDark);
  confirmButton.resize(160, 40);
  confirmButton.x = 20;
  confirmButton.y = 620;
  frame.appendChild(confirmButton);

  const nextButton = createButton('Sonrakı', 'secondary', isDark);
  nextButton.resize(160, 40);
  nextButton.x = 195;
  nextButton.y = 620;
  frame.appendChild(nextButton);
}

// Exam Running dizaynı
async function createExamRunningDesign(frame, isDark = false) {
  frame.fills = [{ type: 'SOLID', color: hexToRgb('#111827') }]; // Dark exam mode

  // Header with timer
  const header = figma.createFrame();
  header.resize(375, 60);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.8 } }];
  frame.appendChild(header);

  const timer = figma.createText();
  timer.characters = '⏱️ 14:34';
  timer.fontSize = 18;
  timer.fontName = boldFont;
  timer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  timer.textAlignHorizontal = 'CENTER';
  timer.x = 137.5;
  timer.y = 21;
  timer.resize(100, 18);
  header.appendChild(timer);

  // Questions grid
  const questions = Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    answered: i < 3
  }));

  let questionY = 80;
  for (let i = 0; i < questions.length; i += 2) {
    for (let j = 0; j < 2 && i + j < questions.length; j++) {
      const q = questions[i + j];
      const questionThumb = figma.createFrame();
      questionThumb.resize(160, 120);
      questionThumb.x = 20 + j * 175;
      questionThumb.y = questionY;
      questionThumb.fills = [{ type: 'SOLID', color: hexToRgb('#374151') }];
      questionThumb.cornerRadius = 12;
      frame.appendChild(questionThumb);

      // Question number
      const qNumber = figma.createText();
      qNumber.characters = q.number.toString();
      qNumber.fontSize = 16;
      qNumber.fontName = boldFont;
      qNumber.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      qNumber.x = 16;
      qNumber.y = 16;
      questionThumb.appendChild(qNumber);

      // Answered indicator
      if (q.answered) {
        const checkmark = figma.createFrame();
        checkmark.resize(24, 24);
        checkmark.x = 120;
        checkmark.y = 12;
        checkmark.fills = [{ type: 'SOLID', color: hexToRgb('#22c55e') }];
        checkmark.cornerRadius = 12;
        questionThumb.appendChild(checkmark);

        const check = figma.createText();
        check.characters = '✓';
        check.fontSize = 14;
        check.fontName = boldFont;
        check.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        check.x = 7;
        check.y = 5;
        checkmark.appendChild(check);
      }

      // Question preview
      const preview = figma.createText();
      preview.characters = 'Sual məzmunu...';
      preview.fontSize = 12;
      preview.fontName = currentFont;
      preview.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.7 } }];
      preview.x = 16;
      preview.y = 90;
      questionThumb.appendChild(preview);
    }
    questionY += 140;
  }

  // Current question detail
  const currentCard = figma.createFrame();
  currentCard.resize(335, 200);
  currentCard.x = 20;
  currentCard.y = 580;
  currentCard.fills = [{ type: 'SOLID', color: hexToRgb('#1f2937') }];
  currentCard.cornerRadius = 16;
  frame.appendChild(currentCard);

  const currentQuestion = figma.createText();
  currentQuestion.characters = '4. Sarı işıq yananda sürücü nə etməlidir?';
  currentQuestion.fontSize = 14;
  currentQuestion.fontName = boldFont;
  currentQuestion.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  currentQuestion.x = 16;
  currentQuestion.y = 16;
  currentQuestion.resize(303, 28);
  currentCard.appendChild(currentQuestion);

  // Quick options
  const quickOptions = ['A) Sürəti artır', 'B) Yavaşla', 'C) Dərhal dayana', 'D) Siqnal ver'];
  let optY = 60;
  for (const opt of quickOptions) {
    const optText = figma.createText();
    optText.characters = opt;
    optText.fontSize = 12;
    optText.fontName = currentFont;
    optText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.8 } }];
    optText.x = 16;
    optText.y = optY;
    currentCard.appendChild(optText);
    optY += 25;
  }
}

// Results dizaynı
async function createResultsDesign(frame, passed, isDark = false) {
  const bgColor = isDark ? '#111827' : '#f9fafb';
  const surfaceColor = isDark ? '#1f2937' : '#ffffff';
  
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  // Header
  const header = createHeaderWithBack('İmtahan Nəticəsi', isDark);
  frame.appendChild(header);

  // Result card
  const resultCard = figma.createFrame();
  resultCard.resize(335, 200);
  resultCard.x = 20;
  resultCard.y = 150;
  resultCard.fills = [{ type: 'SOLID', color: hexToRgb(surfaceColor) }];
  resultCard.cornerRadius = 16;
  frame.appendChild(resultCard);

  // Score
  const score = figma.createText();
  score.characters = passed ? '8/10' : '5/10';
  score.fontSize = 48;
  score.fontName = boldFont;
  score.fills = [{ type: 'SOLID', color: hexToRgb(passed ? '#22c55e' : '#ef4444') }];
  score.textAlignHorizontal = 'CENTER';
  score.x = 117.5;
  score.y = 40;
  score.resize(100, 48);
  resultCard.appendChild(score);

  // Result text
  const resultText = figma.createText();
  resultText.characters = passed ? '🎉 Keçdiniz!' : '😔 Keçmədiniz';
  resultText.fontSize = 20;
  resultText.fontName = boldFont;
  resultText.fills = [{ type: 'SOLID', color: hexToRgb(passed ? '#22c55e' : '#ef4444') }];
  resultText.textAlignHorizontal = 'CENTER';
  resultText.x = 67.5;
  resultText.y = 100;
  resultText.resize(200, 20);
  resultCard.appendChild(resultText);

  // Time spent
  const timeText = figma.createText();
  timeText.characters = 'Vaxt: 12:45';
  timeText.fontSize = 14;
  timeText.fontName = currentFont;
  timeText.fills = [{ type: 'SOLID', color: hexToRgb(isDark ? '#9ca3af' : '#6b7280') }];
  timeText.textAlignHorizontal = 'CENTER';
  timeText.x = 117.5;
  timeText.y = 130;
  timeText.resize(100, 14);
  resultCard.appendChild(timeText);

  // Action buttons
  const retryButton = createButton('Yenidən Cəhd Et', 'primary', isDark);
  retryButton.x = 40;
  retryButton.y = 400;
  frame.appendChild(retryButton);

  const mistakesButton = createButton('Səhvləri Göstər', 'secondary', isDark);
  mistakesButton.x = 40;
  mistakesButton.y = 460;
  frame.appendChild(mistakesButton);
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
  } else if (variant === 'disabled') {
    bgColor = isDark ? '#374151' : '#e5e7eb';
    textColor = isDark ? '#6b7280' : '#9ca3af';
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

// Digər ekranlar üçün placeholder funksiyalar
async function createPackageDetailsDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Package Details', category: 'Purchase' });
}

async function createPaymentDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Payment Methods', category: 'Purchase' });
}

async function createSuccessDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Purchase Success', category: 'Purchase' });
}

async function createVideoDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Video Player', category: 'Learning' });
}

async function createTeacherDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Teacher Contact', category: 'Learning' });
}

async function createChatHistoryDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Chat History', category: 'Support' });
}

async function createNotificationsDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Notifications', category: 'Support' });
}

async function createProfileEditDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Profile Edit', category: 'Profile' });
}

async function createTransactionsDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Transactions', category: 'Profile' });
}

async function createBalanceDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Balance Top-up', category: 'Profile' });
}

async function createMistakesDesign(frame, isDark = false) {
  await createDefaultDesign(frame, { name: 'Mistakes Review', category: 'Exam' });
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