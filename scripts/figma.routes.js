// Figma Export Routes Configuration
export const figmaRoutes = [
  // Auth Flow
  {
    id: 'login',
    name: 'Login Screen',
    path: '/login',
    category: 'auth',
    description: 'User authentication with social login options'
  },

  // Main Flow
  {
    id: 'home',
    name: 'Home Dashboard',
    path: '/',
    category: 'main',
    description: 'Main dashboard with progress and quick actions'
  },
  {
    id: 'home-no-package',
    name: 'Home (No Package)',
    path: '/?package=none',
    category: 'main',
    description: 'Home screen when user has no active package'
  },
  {
    id: 'topics',
    name: 'Topics List',
    path: '/topics',
    category: 'main',
    description: 'Learning topics and modules overview'
  },
  {
    id: 'topics-locked',
    name: 'Topics (Locked)',
    path: '/topics?package=none',
    category: 'main',
    description: 'Topics screen with locked modules'
  },
  {
    id: 'more',
    name: 'More Menu',
    path: '/more',
    category: 'main',
    description: 'Additional options and settings menu'
  },

  // Learning Flow
  {
    id: 'lesson',
    name: 'Lesson View',
    path: '/lesson/M8',
    category: 'learning',
    description: 'Video lesson with materials and tabs'
  },
  {
    id: 'practice',
    name: 'Practice Questions',
    path: '/practice',
    category: 'learning',
    description: 'Interactive practice questions'
  },

  // Exam Flow
  {
    id: 'exam-config',
    name: 'Exam Configuration',
    path: '/exam/config',
    category: 'exam',
    description: 'Exam setup and configuration'
  },
  {
    id: 'exam-run',
    name: 'Exam Running',
    path: '/exam/run',
    category: 'exam',
    description: 'Active exam with timer and questions'
  },
  {
    id: 'exam-results',
    name: 'Exam Results',
    path: '/results',
    category: 'exam',
    description: 'Exam completion results and analysis'
  },
  {
    id: 'mistakes',
    name: 'Mistakes Review',
    path: '/mistakes',
    category: 'exam',
    description: 'Review of incorrect answers'
  },

  // Store Flow
  {
    id: 'store',
    name: 'Store',
    path: '/store',
    category: 'store',
    description: 'Digital store for books and materials'
  },
  {
    id: 'packages',
    name: 'Packages List',
    path: '/packages',
    category: 'store',
    description: 'Learning package options and pricing'
  },

  // Profile Flow
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    category: 'profile',
    description: 'User settings and preferences'
  },
  {
    id: 'transactions',
    name: 'Transactions',
    path: '/transactions',
    category: 'profile',
    description: 'Payment history and balance'
  },

  // Support Flow
  {
    id: 'ai-chat',
    name: 'AI Chat',
    path: '/ai-chat',
    category: 'support',
    description: 'AI assistant chat interface'
  },
  {
    id: 'teacher-contact',
    name: 'Teacher Contact',
    path: '/teacher-contact',
    category: 'support',
    description: 'Contact form for teacher support'
  }
];

export const deviceSizes = {
  'iphone-13': { width: 390, height: 844, name: 'iPhone 13/14/15' },
  'iphone-12': { width: 375, height: 812, name: 'iPhone 12 Mini' }
} as const;

export const themes = ['light', 'dark'] as const;
export const locales = ['az', 'ru', 'en'] as const;