# DDA.az Figma Desktop Plugin

Bu plugin DDA.az mobil tətbiqinin tam design sistemini və 34 ekranını avtomatik olaraq Figmaya yaradır.

## 🚀 Quraşdırma

### 1. Plugin Yükləmə
1. **Figma Desktop** tətbiqini açın (brauzer versiyası deyil!)
2. **Plugins** → **Development** → **Import plugin from manifest**
3. `figma-plugin/manifest.json` faylını seçin
4. Plugin "DDA.az Design Exporter" adı ilə əlavə olunacaq

### 2. Plugin İşə Salma
1. Figma-da yeni fayl yaradın və ya mövcud faylı açın
2. **Plugins** → **Development** → **DDA.az Design Exporter**
3. Plugin pəncərəsi açılacaq

## 📱 İstifadə

### 🎨 Design System Yaratmaq
```
"🎨 Yalnız Stillər" düyməsini basın
```
**Yaradılacaq:**
- ✅ 30 rəng stili (Light/Dark theme + Brand colors)
- ✅ 6 typography stili (H1, H2, H3, Body, Body Small, Caption)

### 📱 Bütün Ekranları Yaratmaq
```
"🚀 Hər Şeyi Yarat (34 Ekran)" düyməsini basın
```
**Yaradılacaq:**
- ✅ Design system (rənglər + typography)
- ✅ 30 əsas ekran (375×812)
- ✅ 4 dark variant ekran
- ✅ Səhifə: "📱 DDA Mobile — All Screens"

### 🗺️ Flow Map Yaratmaq
```
"🗺️ Flow Map" düyməsini basın
```
**Yaradılacaq:**
- ✅ Naviqasiya diaqramı
- ✅ Ekranlar arası əlaqələr
- ✅ Səhifə: "🗺️ DDA Mobile — Flow Map"

### ♻️ Yenidən Yaratmaq
```
"♻️ Yenidən Yarat" düyməsini basın
```
**Edəcək:**
- 🗑️ Mövcud DDA səhifələrini siləcək
- 🚀 Hər şeyi təmiz şəkildə yenidən yaradacaq

## 📋 Yaradılan Ekranlar (34 ədəd)

### 🔐 Auth & Onboarding (4)
1. **Login** - Logo, email/password, sosial giriş
2. **Onboarding 1** - Xoş gəldin mesajı
3. **Onboarding 2** - Xüsusiyyətlər təqdimatı  
4. **Onboarding 3** - Başlamaq üçün çağırış

### 🏠 Main (4)
5. **Home (No Package)** - Kilidli funksiyalar, paket xəbərdarlığı
6. **Topics (Locked)** - Kilidli modullar, axtarış
7. **Store** - Kitab mağazası, ödəniş üsulları
8. **More Menu** - Əlavə seçimlər menyusu

### 💳 Purchase (4)
9. **Packages List** - Paket seçimləri, qiymətlər
10. **Package Details** - Paket təfərrüatları
11. **Payment Methods** - Ödəniş üsulları
12. **Purchase Success** - Uğurlu alış təsdiqi

### ⭐ Premium (2)
13. **Home (Premium)** - Açıq funksiyalar, premium status
14. **Topics (Unlocked)** - Bütün modullar açıq

### 📚 Learning (4)
15. **Lesson View** - Video dərs, tab naviqasiya
16. **Video Player** - Tam ekran video player
17. **Practice Questions** - İnteraktiv məşq sualları
18. **Teacher Contact** - Müəllim əlaqə formu

### 🧪 Exam (5)
19. **Exam Config** - İmtahan tənzimləmələri
20. **Exam Running** - Aktiv imtahan, timer
21. **Exam Results (Pass)** - Uğurlu imtahan nəticəsi
22. **Exam Results (Fail)** - Uğursuz imtahan nəticəsi
23. **Mistakes Review** - Səhv cavabların təhlili

### 🤖 Support (3)
24. **AI Chat** - AI köməkçi söhbəti
25. **Chat History** - Əvvəlki söhbətlər
26. **Notifications** - Push bildirişlər

### 👤 Profile (4)
27. **Settings** - İstifadəçi ayarları
28. **Profile Edit** - Profil redaktəsi
29. **Transactions** - Ödəniş tarixçəsi
30. **Balance Top-up** - Balans artırma

### 🌙 Dark Variants (4)
31. **Home — Dark** - Dark theme home
32. **Topics — Dark** - Dark theme topics
33. **Lesson — Dark** - Dark theme lesson
34. **Settings — Dark** - Dark theme settings

## 🎨 Design System

### Rəng Stilləri (30 ədəd)
```
Light Theme:
- Light/Background (#f9fafb)
- Light/Surface (#ffffff)  
- Light/Text Primary (#111827)
- Light/Text Secondary (#6b7280)
- Light/Text Muted (#9ca3af)
- Light/Brand (#22c55e)
- Light/Brand Alt (#16a34a)
- Light/Border (#e5e7eb)
- Light/Accent (#3b82f6)
- Light/Danger (#ef4444)

Dark Theme:
- Dark/Background (#111827)
- Dark/Surface (#1f2937)
- Dark/Text Primary (#f9fafb)
- Dark/Text Secondary (#d1d5db)
- Dark/Text Muted (#9ca3af)
- Dark/Brand (#34d399)
- Dark/Brand Alt (#10b981)
- Dark/Border (#374151)
- Dark/Accent (#60a5fa)
- Dark/Danger (#f87171)

Brand Scale:
- Brand/Primary 50-900 (10 rəng)
```

### Typography Stilləri (6 ədəd)
```
- Typography/H1 (28px/36px, Bold)
- Typography/H2 (22px/30px, Bold)  
- Typography/H3 (18px/24px, Bold)
- Typography/Body (16px/24px, Regular)
- Typography/Body Small (14px/20px, Regular)
- Typography/Caption (12px/16px, Regular)
```

## 🗺️ Flow Map

Flow Map ayrı səhifədə yaradılır və göstərir:
- 📱 Hər ekranın yerini
- ➡️ Ekranlar arası keçidləri
- 🎯 İstifadəçi axınını (user flow)
- 📋 Naviqasiya strukturunu

## 🔧 Texniki Məlumatlar

### Font Tələbləri
- **Əsas**: Inter (Regular, Bold)
- **Fallback**: Roboto, Arial, Helvetica
- Plugin avtomatik olaraq mövcud fontları yoxlayır

### Ekran Ölçüləri
- **Genişlik**: 375px (iPhone 12 Mini standartı)
- **Hündürlük**: 812px (tam ekran)
- **Corner Radius**: 20px (cihaz frame-i)

### Grid Düzümü
- **Sütunlar**: 4 ekran yan-yana
- **Boşluq**: 80px ekranlar arası
- **Ümumi**: 1820px genişlik

## ⚠️ Problemlərin Həlli

### Plugin Açılmır
- Figma Desktop istifadə edin (brauzer versiyası deyil)
- Plugin-i Development bölməsindən yükləyin

### Fontlar Yüklənmir
- Inter fontunu Figma-ya əlavə edin
- Və ya plugin avtomatik fallback istifadə edəcək

### Ekranlar Görünmür
- Zoom out edin (Cmd/Ctrl + -)
- Səhifəni "📱 DDA Mobile — All Screens" seçin

### Yavaş İşləyir
- Böyük faylda işləyirsinizsə, yeni fayl yaradın
- "♻️ Yenidən Yarat" istifadə edin

## 📊 Nəticə

Plugin işləyəndən sonra əldə edəcəksiniz:
- 🎨 **Design System**: 30 rəng + 6 typography stili
- 📱 **34 Mobil Ekran**: Tam dizayn edilmiş
- 🗺️ **Flow Map**: Naviqasiya diaqramı
- 📋 **Təşkil**: Aydın səhifə strukturu

## 🔄 Yeniləmə

Kod dəyişdikdə:
1. Plugin-i yenidən işə salın
2. "♻️ Yenidən Yarat" düyməsini basın
3. Yeni dizayn avtomatik yaradılacaq

---

**🇦🇿 AZ**: Bu plugin Azərbaycan dilində hazırlanmışdır
**📱 Mobile-First**: iPhone ölçülərinə uyğun
**🎨 Production-Ready**: Real layihə üçün hazır