# 🚗 SBS Transfer Rezervasyon Platformu

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange)

**Premium Transfer Rezervasyon Platformu** - Modern, kullanıcı dostu ve tam responsive transfer rezervasyon sistemi.

## ✨ Özellikler

- 🎨 **Modern UI/UX**: Glassmorphism tasarım, gradient efektler ve smooth animasyonlar
- 📱 **Tam Responsive**: Mobil, tablet ve desktop için optimize edilmiş
- 🔐 **Güvenli**: Firebase Authentication ile güvenli oturum yönetimi
- 🗺️ **Harita Entegrasyonu**: Google Maps API ile rota planlama
- 💫 **Animasyonlar**: Framer Motion ile zengin animasyon deneyimi
- ⚡ **Hızlı**: Vite build tool ile optimize edilmiş performans

## 🛠️ Teknoloji Stack

### Frontend
- **React 18.3.1** - Modern React hooks ve context API
- **Vite 5.4.19** - Hızlı development server ve build tool
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 11.17.0** - Production-ready motion library
- **React Router DOM 6.28.0** - Client-side routing
- **Lucide React 0.462.0** - Beautiful & consistent icons

### Backend & Services
- **Firebase 10.14.1** - Authentication, Firestore, Storage
- **Google Maps API** - Harita ve konum servisleri

## 🎯 Kullanıcı Rolleri

### 👤 Müşteri Paneli
- Transfer rezervasyonu yapma
- Rezervasyon geçmişi görüntüleme
- Profil yönetimi
- Ödeme işlemleri

### 🚕 Şoför Paneli
- Günlük seferler listesi
- Navigasyon entegrasyonu
- Gelir raporu
- Müşteri iletişimi

### 👨‍💼 Admin Paneli
- Sistem yönetimi
- Kullanıcı yönetimi
- Araç filot yönetimi
- Finansal raporlar

## 🚀 Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/luckdow/sonsbs.git
cd sonsbs
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**
`.env` dosyası oluşturup Firebase config'inizi ekleyin:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

4. **Development server'ı başlatın**
```bash
npm run dev
```

## 📁 Proje Yapısı

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Header, Footer, Layout
│   ├── Auth/           # Authentication components
│   └── UI/             # Common UI components
├── pages/              # Page components
│   ├── Public/         # Public pages
│   ├── Customer/       # Customer dashboard
│   ├── Driver/         # Driver dashboard
│   └── Admin/          # Admin dashboard
├── contexts/           # React contexts
├── services/           # API services
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🎨 Design System

### Renkler
- **Primary**: Blue 500 (#3B82F6) → Purple 600 (#9333EA)
- **Secondary**: Gray tones
- **Accent**: Gradient combinations

### Efektler
- **Glassmorphism**: backdrop-blur-xl with transparency
- **Gradients**: Multi-color gradients
- **Shadows**: Soft, layered shadows
- **Animations**: Smooth micro-interactions

## 📊 Dashboard Özellikleri

### Müşteri Dashboard
- ✅ Hızlı rezervasyon
- ✅ Rezervasyon geçmişi
- ✅ Favori lokasyonlar
- ✅ Ödeme yöntemleri

### Şoför Dashboard
- ✅ Günlük program
- ✅ Gelir takibi
- ✅ Müşteri bilgileri
- ✅ Araç durumu

### Admin Dashboard
- ✅ Kullanıcı yönetimi
- ✅ Rezervasyon yönetimi
- ✅ Araç filot yönetimi
- ✅ Finansal raporlar

## 🌟 Öne Çıkan Özellikler

- **Google Maps Integration**: Rota optimizasyonu ve gerçek zamanlı tracking
- **Dynamic Pricing**: Mesafe ve araç tipine göre dinamik fiyatlama
- **Real-time Updates**: Canlı rezervasyon durumu güncellemeleri
- **Mobile-first Design**: Önce mobil deneyim için tasarlandı
- **PWA Ready**: Progressive Web App özellikleri
- **SEO Optimized**: Arama motoru dostu yapı

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px - 1279px
- **Large Desktop**: ≥ 1280px

## 🔧 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

**Proje Sahibi**: luckdow  
**GitHub**: [https://github.com/luckdow](https://github.com/luckdow)  
**Repository**: [https://github.com/luckdow/sonsbs](https://github.com/luckdow/sonsbs)

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**
