# DDA.az — Figma-style Inspect & Auto-Handoff

Bu layihə avtomatik design handoff sistemi və Figma-style inspector ilə təchiz edilmişdir.

## 🚀 Quick Start

```bash
npm install
npm run tokens    # Generate CSS vars & RN theme
npm run validate  # Check design files
npm run dev:inspect  # Start development server with /inspect access
```

## 🔍 Design Inspector

Figma-style inspector səhifəsinə daxil olmaq üçün:

```bash
npm run dev:inspect
# Brauzerdə /inspect səhifəsinə keçin
```

Inspector özəllikləri:
- **Assets**: İkonlar və şəkillər qruplara görə
- **Components**: Props, states, events, accessibility
- **Screens**: Route, params, istifadə olunan komponentlər
- **Copy buttons**: Path, HTML, React Native require
- **Grid overlay**: 4px grid vizual yoxlama üçün

## 📦 Handoff Process

```bash
npm run handoff   # Creates handoff/handoff.zip
```

Handoff paketi ehtiva edir:
- `design/tokens.json` - Design tokenləri
- `design/styles.css` - Web CSS variables (auto-generated)
- `src/theme.ts` - React Native theme (auto-generated)
- `design/components.csv` - Komponent dokumentasiyası
- `design/screens.csv` - Ekran spesifikasiyaları
- `design/assets.manifest.json` - Asset metadata

## 📁 Sources of Truth

### 1. Design Tokens (`design/tokens.json`)
Bütün rəng, spacing, typography, shadow və breakpoint dəyərləri.

**⚠️ Qayda**: `design/styles.css` və `src/theme.ts` fayllarını manual redaktə etməyin. Həmişə `npm run tokens` əmri ilə yenidən yaradın.

### 2. Assets (`design/assets.manifest.json`)
Figma-style asset metadata:
```json
{
  "name": "home",
  "title": "Home Tab Icon",
  "emoji": "🏠",
  "category": "icon",
  "group": "navigation",
  "format": "svg",
  "usage": "Main bottom navigation home tab",
  "sizes": [
    { "width": 16, "height": 16, "scale": "@1x", "path": "assets/icons/navigation/home-16.svg" }
  ],
  "pagesUsed": ["Home"],
  "tokenRef": null
}
```

### 3. Components (`design/components.csv`)
Komponent spesifikasiyaları:
- Props (TypeScript format)
- States və events
- Accessibility requirements (min 44×44, contrast ≥4.5:1)
- Usage context

### 4. Screens (`design/screens.csv`)
Ekran spesifikasiyaları:
- Route və parameters
- İstifadə olunan komponentlər
- States və status

## 🔧 Web Development

### CSS Variables istifadəsi:
```css
/* Auto-generated CSS variables */
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Utility classes:
```css
.text-primary     /* var(--color-semantic-text-primary) */
.bg-surface       /* var(--color-semantic-surface) */
.rounded-lg       /* var(--radius-lg) */
.shadow-md        /* var(--shadow-md) */
```

## 📱 React Native Development

```typescript
import { theme } from './src/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
});
```

## ✅ Validation Rules

1. **Asset paths**: Hər asset üçün valid path olmalıdır
2. **Component consistency**: `screens.csv`-də istifadə olunan hər komponent `components.csv`-də mövcud olmalıdır
3. **Token structure**: `colors`, `spacing`, `typography`, `borderRadius`, `shadows`, `breakpoints` bölmələri məcburidir

## 🎨 Design System Rules

- **Spacing**: 8px əsaslı sistem (xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px)
- **Touch targets**: Minimum 44×44pt
- **Color contrast**: Minimum 4.5:1 ratio
- **Naming**: kebab-case (home, video-thumb)
- **File organization**: Group by category (navigation, actions, system)

## 🔄 Workflow

1. **Design dəyişiklikləri**: `design/tokens.json` faylını redaktə edin
2. **Regenerate**: `npm run tokens` əmrini işə salın
3. **Validate**: `npm run validate` ilə yoxlayın
4. **Handoff**: `npm run handoff` ilə paketi yaradın
5. **Inspect**: `/inspect` səhifəsində nəticəni yoxlayın

## 📋 NPM Scripts

- `npm run tokens` - Generate CSS vars & RN theme from tokens.json
- `npm run validate` - Validate design files consistency
- `npm run handoff` - Create complete handoff package
- `npm run dev:inspect` - Start dev server with inspector access

---

**AZ/EN**: Bu sistem həm Azərbaycan, həm də İngilis dilində şərhlər dəstəkləyir.
**Stability**: Bütün asset adları və token strukturu sabit saxlanılır.
**Accessibility**: WCAG 2.1 AA standartlarına uyğundur.

## 🎨 Figma Export

Bu layihə html.to.design plugin ilə Figma-ya asanlıqla import edilə bilər.

### 🚀 Quick Start

```bash
npm run export:figma    # Build static HTML exports
npm run preview:figma   # Start preview server
npm run verify:figma    # Verify export quality
```

### 📱 Export Features

- **20+ Screens**: Login, Home, Topics, Lessons, Exam, Store, Settings
- **Device Sizes**: iPhone 13 (390×844), iPhone 12 Mini (375×812)
- **Themes**: Light & Dark mode variants
- **Languages**: Azərbaycan, Русский, English
- **Static HTML**: No JavaScript required for import
- **Design Tokens**: CSS variables for clean layer import

### 🔗 Import Methods

#### Option A: Web Method
1. Deploy `dist/figma-export/` to any web server
2. Copy the public URL
3. Open html.to.design plugin in Figma
4. Paste URL in Web tab → Import

#### Option B: File Method
1. Run `npm run export:figma`
2. Open html.to.design plugin in Figma
3. Drag `dist/figma-export/index.html` into File tab
4. Select screens to import

#### Option C: Extension Method
1. Run `npm run preview:figma`
2. Open http://localhost:5173/figma-export/
3. Install html.to.design Chrome extension
4. Click extension → Capture → Send to Figma

### 📋 Export Structure

```
dist/figma-export/
├── index.html              # Gallery with all screens
├── login.html              # Individual screen exports
├── home.html
├── topics.html
├── packages.html
├── ai-chat.html
├── settings.html
├── figma-manifest.json     # Export metadata
├── assets/                 # CSS and images
└── thumbs/                 # Preview thumbnails
```

### 🎯 Quality Features

- **No Animations**: Disabled for clean import (`animation: none`)
- **Embedded Fonts**: No FOUT issues during import
- **Device Frames**: Mobile viewport with status bar
- **Design Tokens**: CSS variables map to Figma styles
- **Static Assets**: All images embedded or absolute paths
- **Responsive**: Multiple device sizes supported

### 🔍 Verification

The export includes automatic verification:
- ✅ All screen files generated
- ✅ Valid HTML structure
- ✅ Design tokens present
- ✅ Assets accessible
- ✅ Mobile viewport configured

Run `npm run verify:figma` after export to ensure quality.
## 🔍 Design Inspector

Figma-style inspector səhifəsinə daxil olmaq üçün:

```bash
npm run dev:inspect
# Brauzerdə /inspect səhifəsinə keçin
```

Inspector özəllikləri:
- **Assets**: İkonlar və şəkillər qruplara görə
- **Components**: Props, states, events, accessibility
- **Screens**: Route, params, istifadə olunan komponentlər
- **Copy buttons**: Path, HTML, React Native require
- **Grid overlay**: 4px grid vizual yoxlama üçün

## 📦 Handoff Process

```bash
npm run handoff   # Creates handoff/handoff.zip
```

Handoff paketi ehtiva edir:
- `design/tokens.json` - Design tokenləri
- `design/styles.css` - Web CSS variables (auto-generated)
- `src/theme.ts` - React Native theme (auto-generated)
- `design/components.csv` - Komponent dokumentasiyası
- `design/screens.csv` - Ekran spesifikasiyaları
- `design/assets.manifest.json` - Asset metadata

## 📁 Sources of Truth

### 1. Design Tokens (`design/tokens.json`)
Bütün rəng, spacing, typography, shadow və breakpoint dəyərləri.

**⚠️ Qayda**: `design/styles.css` və `src/theme.ts` fayllarını manual redaktə etməyin. Həmişə `npm run tokens` əmri ilə yenidən yaradın.

### 2. Assets (`design/assets.manifest.json`)
Figma-style asset metadata:
```json
{
  "name": "home",
  "title": "Home Tab Icon",
  "emoji": "🏠",
  "category": "icon",
  "group": "navigation",
  "format": "svg",
  "usage": "Main bottom navigation home tab",
  "sizes": [
    { "width": 16, "height": 16, "scale": "@1x", "path": "assets/icons/navigation/home-16.svg" }
  ],
  "pagesUsed": ["Home"],
  "tokenRef": null
}
```

### 3. Components (`design/components.csv`)
Komponent spesifikasiyaları:
- Props (TypeScript format)
- States və events
- Accessibility requirements (min 44×44, contrast ≥4.5:1)
- Usage context

### 4. Screens (`design/screens.csv`)
Ekran spesifikasiyaları:
- Route və parameters
- İstifadə olunan komponentlər
- States və status

## 🔧 Web Development

### CSS Variables istifadəsi:
```css
/* Auto-generated CSS variables */
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Utility classes:
```css
.text-primary     /* var(--color-semantic-text-primary) */
.bg-surface       /* var(--color-semantic-surface) */
.rounded-lg       /* var(--radius-lg) */
.shadow-md        /* var(--shadow-md) */
```

## 📱 React Native Development

```typescript
import { theme } from './src/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
});
```

## ✅ Validation Rules

1. **Asset paths**: Hər asset üçün valid path olmalıdır
2. **Component consistency**: `screens.csv`-də istifadə olunan hər komponent `components.csv`-də mövcud olmalıdır
3. **Token structure**: `colors`, `spacing`, `typography`, `borderRadius`, `shadows`, `breakpoints` bölmələri məcburidir

## 🎨 Design System Rules

- **Spacing**: 8px əsaslı sistem (xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px)
- **Touch targets**: Minimum 44×44pt
- **Color contrast**: Minimum 4.5:1 ratio
- **Naming**: kebab-case (home, video-thumb)
- **File organization**: Group by category (navigation, actions, system)

## 🔄 Workflow

1. **Design dəyişiklikləri**: `design/tokens.json` faylını redaktə edin
2. **Regenerate**: `npm run tokens` əmrini işə salın
3. **Validate**: `npm run validate` ilə yoxlayın
4. **Handoff**: `npm run handoff` ilə paketi yaradın
5. **Inspect**: `/inspect` səhifəsində nəticəni yoxlayın

## 📋 NPM Scripts

- `npm run tokens` - Generate CSS vars & RN theme from tokens.json
- `npm run validate` - Validate design files consistency
- `npm run handoff` - Create complete handoff package
- `npm run dev:inspect` - Start dev server with inspector access

---

**AZ/EN**: Bu sistem həm Azərbaycan, həm də İngilis dilində şərhlər dəstəkləyir.
**Stability**: Bütün asset adları və token strukturu sabit saxlanılır.
**Accessibility**: WCAG 2.1 AA standartlarına uyğundur.