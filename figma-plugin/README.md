# DDA.az Figma Plugin

Bu plugin DDA.az tətbiqinin dizaynını avtomatik olaraq Figmaya köçürür.

## 🚀 Quraşdırma

1. **Figma Desktop** tətbiqini açın
2. **Plugins** → **Development** → **Import plugin from manifest**
3. `manifest.json` faylını seçin
4. Plugin hazırdır!

## 📋 İstifadə

### 1. Design System Yaratmaq
- Plugin açın
- "Design System Yarat" düyməsini basın
- Avtomatik olaraq yaradılacaq:
  - ✅ Rəng palitri (Primary, Gray, Emerald)
  - ✅ Typography stilleri
  - ✅ Spacing dəyərləri
  - ✅ Border radius dəyərləri

### 2. Ekranları Yaratmaq
- "Ekranları Yarat" düyməsini basın
- Yaradılacaq ekranlar:
  - 📱 Login Screen
  - 🏠 Home Dashboard  
  - 📚 Topics List
  - 🎓 Lesson View
  - 🧪 Exam Interface
  - 🛍️ Store Layout

### 3. Hər Şeyi Avtomatik Yaratmaq
- "🚀 Hər Şeyi Yarat" düyməsini basın
- Bütün design system və ekranlar avtomatik yaradılacaq

## 🎨 Nə Yaradılır?

### Color Styles
```
Colors/
├── primary/50 → #f0fdf4
├── primary/500 → #22c55e
├── primary/900 → #14532d
├── gray/50 → #f9fafb
├── gray/500 → #6b7280
└── gray/900 → #111827
```

### Text Styles
```
Typography/
├── Heading/H1 (24px, Bold)
├── Heading/H2 (20px, Semibold)
├── Body/Large (16px, Regular)
├── Body/Medium (14px, Regular)
└── Caption (11px, Regular)
```

### Components
```
Screens/
├── Login (375×812)
├── Home (375×812)
├── Topics (375×812)
├── Lesson (375×812)
├── Exam (375×812)
└── Store (375×812)
```

## ⚡ Üstünlükləri

- **Sürətli**: 30 saniyədə tam design system
- **Dəqiq**: Koddan birbaşa götürülən dəyərlər
- **Təmiz**: Strukturlaşdırılmış və təşkil edilmiş
- **Yeniləmə**: Kod dəyişdikdə asanlıqla yenilənir

## 🔧 Fərdiləşdirmə

Plugin kodunu redaktə edərək:
- Yeni rənglər əlavə edin
- Komponent strukturunu dəyişin  
- Ekran ölçülərini tənzimləyin
- Yeni komponentlər yaradın

## 📞 Dəstək

Plugin ilə bağlı suallar üçün:
- GitHub Issues açın
- Kodu yeniləyin və yenidən yükləyin