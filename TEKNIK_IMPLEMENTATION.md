# ⚙️ GATE Transfer - Teknik Implementation Detayları

## 🏗️ PROJE MİMARİSİ VE YAPILANDIRMA

### Mevcut Tech Stack:
```
- Frontend: React.js 18+ with Vite
- Routing: React Router v6
- Styling: Tailwind CSS
- Icons: Lucide React
- SEO: react-helmet-async
- Notifications: react-hot-toast
- Build Tool: Vite
- Package Manager: npm
```

### Dosya Yapısı:
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.jsx ✅
│   │   ├── Footer.jsx ✅
│   │   └── Layout.jsx ✅
│   └── UI/
│       └── Logo.jsx
├── pages/
│   ├── Static/ ✅ (9 sayfa tamamlandı)
│   ├── City/ 🔄 (Yapılacak)
│   ├── Services/ 🔄 (Yapılacak)
│   └── Blog/ 🔄 (Yapılacak)
├── config/
│   └── constants.js ✅
└── contexts/
    ├── AuthContext.jsx ✅
    └── AppContext.jsx ✅
```

---

## 🏙️ ŞEHİR SAYFALARI İMPLEMENTASYONU

### CityPageLayout Component:
```jsx
// src/components/Layout/CityPageLayout.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const CityPageLayout = ({ 
  cityName, 
  title, 
  description, 
  keywords,
  children 
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={`https://gatetransfer.com/${cityName.toLowerCase()}-transfer`} />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `GATE Transfer - ${cityName} Transfer Hizmeti`,
            "description": description,
            "url": `https://gatetransfer.com/${cityName.toLowerCase()}-transfer`,
            "telephone": "+90 532 574 26 82",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Güzelyurt Mahallesi Serik Caddesi No: 138/2",
              "addressLocality": "Aksu",
              "addressRegion": "Antalya",
              "postalCode": "07112",
              "addressCountry": "TR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "36.8969",
              "longitude": "30.7133"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "areaServed": cityName
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
};

export default CityPageLayout;
```

### Şehir Sayfası Template:
```jsx
// src/pages/City/AntalyaTransferPage.jsx
import React from 'react';
import CityPageLayout from '../../components/Layout/CityPageLayout';
import { MapPin, Clock, Star, Phone, Car } from 'lucide-react';

const AntalyaTransferPage = () => {
  const cityData = {
    name: 'Antalya',
    distance: '15 km',
    duration: '20-25 dakika',
    description: 'Antalya şehir merkezi, antik kalıntıları ve muhteşem plajlarıyla...',
    popularHotels: [
      'Akra Hotel Antalya',
      'Rixos Downtown Antalya',
      'Sheraton Voyager Antalya'
    ],
    attractions: [
      'Kaleiçi',
      'Düden Şelalesi', 
      'Antalya Müzesi',
      'Konyaaltı Plajı'
    ]
  };

  return (
    <CityPageLayout
      cityName={cityData.name}
      title={`${cityData.name} Transfer Hizmeti | GATE Transfer - 7/24 Güvenli Ulaşım`}
      description={`${cityData.name} transfer hizmeti. Antalya havalimanından ${cityData.name}'e güvenli, konforlu ve uygun fiyatlı transfer. Hemen rezervasyon yapın!`}
      keywords={`${cityData.name.toLowerCase()} transfer, antalya havalimanı ${cityData.name.toLowerCase()} transfer, ${cityData.name.toLowerCase()} otel transfer, güvenli transfer`}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {cityData.name} Transfer Hizmeti
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Antalya Havalimanından {cityData.name}'e güvenli, konforlu ve profesyonel transfer hizmeti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105">
                Hemen Rezervasyon Yap
              </button>
              <a
                href="tel:+905325742682"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Hemen Ara
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Mesafe', value: cityData.distance },
              { icon: Clock, title: 'Süre', value: cityData.duration },
              { icon: Star, title: 'Puan', value: '4.9/5' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-2xl font-bold text-blue-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Açıklama */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {cityData.name} Hakkında
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {cityData.description}
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Popüler Oteller:</h3>
              <ul className="space-y-2">
                {cityData.popularHotels.map((hotel, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <Car className="w-4 h-4 mr-2 text-blue-500" />
                    {hotel}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Rezervasyon Formu */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Hızlı Rezervasyon
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nereden
                  </label>
                  <input
                    type="text"
                    value="Antalya Havalimanı"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nereye
                  </label>
                  <input
                    type="text"
                    value={cityData.name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saat
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform duration-300"
                >
                  Rezervasyon Yap
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </CityPageLayout>
  );
};

export default AntalyaTransferPage;
```

---

## 🛠️ HİZMET SAYFALARI İMPLEMENTASYONU

### ServicePageLayout Component:
```jsx
// src/components/Layout/ServicePageLayout.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ServicePageLayout = ({ 
  serviceName, 
  title, 
  description, 
  keywords,
  children 
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* Service Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": serviceName,
            "description": description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "GATE Transfer",
              "telephone": "+90 532 574 26 82"
            },
            "areaServed": "Antalya",
            "serviceType": "Transportation"
          })}
        </script>
      </Helmet>
      
      {children}
    </>
  );
};
```

---

## 📝 BLOG SİSTEMİ İMPLEMENTASYONU

### Blog Yapısı:
```
src/pages/Blog/
├── BlogHomePage.jsx
├── BlogCategoryPage.jsx
├── BlogPostPage.jsx
└── components/
    ├── BlogCard.jsx
    ├── BlogSidebar.jsx
    └── BlogLayout.jsx
```

### Blog Data Structure:
```javascript
// src/data/blogPosts.js
export const blogPosts = [
  {
    id: 1,
    slug: 'antalya-havalimanindan-kemer-transfer-rehberi',
    title: 'Antalya Havalimanından Kemer\'e Transfer Rehberi',
    excerpt: 'Kemer\'e en kolay ve güvenli nasıl ulaşılır?',
    content: '...',
    category: 'transfer-rehberi',
    tags: ['kemer', 'transfer', 'havalimanı'],
    publishDate: '2025-07-24',
    author: 'GATE Transfer',
    image: '/images/blog/kemer-transfer.jpg',
    seo: {
      metaDescription: '...',
      keywords: '...'
    }
  }
];
```

---

## ⚡ PERFORMANS OPTİMİZASYONU

### Image Optimization:
```jsx
// src/components/UI/OptimizedImage.jsx
import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
```

### Code Splitting:
```jsx
// src/App.jsx - Lazy loading implementation
import { lazy, Suspense } from 'react';

const AntalyaTransferPage = lazy(() => import('./pages/City/AntalyaTransferPage'));
const KemerTransferPage = lazy(() => import('./pages/City/KemerTransferPage'));

// Route'larda kullanım:
<Route 
  path="/antalya-transfer" 
  element={
    <Suspense fallback={<LoadingScreen />}>
      <AntalyaTransferPage />
    </Suspense>
  } 
/>
```

---

## 🔍 SEO OPTİMİZASYONU

### Sitemap Generator:
```javascript
// scripts/generateSitemap.js
const fs = require('fs');

const pages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/hakkimizda', priority: '0.8', changefreq: 'monthly' },
  { url: '/hizmetlerimiz', priority: '0.8', changefreq: 'monthly' },
  // ... diğer sayfalar
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>https://gatetransfer.com${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
`).join('')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
};

generateSitemap();
```

### Robots.txt:
```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://gatetransfer.com/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /driver/
```

---

## 📱 PWA İMPLEMENTASYONU

### Service Worker:
```javascript
// public/sw.js
const CACHE_NAME = 'gate-transfer-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
```

### Manifest.json:
```json
{
  "name": "GATE Transfer",
  "short_name": "GATE Transfer",
  "description": "Antalya Transfer Hizmetleri",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🚀 DEPLOYMENT VE CI/CD

### Vite Build Optimization:
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3002
  }
});
```

---

## 🌐 ÇOK DİLLİ İMPLEMENTASYON

### Multi-Language Data Structure:
```javascript
// src/data/cityData.js
export const cityDataMultiLang = {
  antalya: {
    tr: {
      name: 'Antalya',
      description: 'Antalya şehir merkezi, antik kalıntıları ve muhteşem plajlarıyla Türkiye\'nin en popüler turizm merkezlerinden biridir.',
      keywords: 'antalya transfer, antalya havalimanı transfer, antalya otel transfer',
      seoTitle: 'Antalya Transfer Hizmeti | GATE Transfer - 7/24 Güvenli Ulaşım',
      seoDescription: 'Antalya transfer hizmeti. Antalya havalimanından şehir merkezine güvenli, konforlu ve uygun fiyatlı transfer. Hemen rezervasyon yapın!'
    },
    en: {
      name: 'Antalya',
      description: 'Antalya city center is one of Turkey\'s most popular tourist destinations with its ancient ruins and magnificent beaches.',
      keywords: 'antalya transfer, antalya airport transfer, antalya hotel transfer',
      seoTitle: 'Antalya Transfer Service | GATE Transfer - 24/7 Safe Transportation',
      seoDescription: 'Antalya transfer service. Safe, comfortable and affordable transfer from Antalya airport to city center. Book now!'
    },
    de: {
      name: 'Antalya',
      description: 'Das Stadtzentrum von Antalya ist mit seinen antiken Ruinen und herrlichen Stränden eines der beliebtesten Touristenziele der Türkei.',
      keywords: 'antalya transfer, flughafentransfer antalya, antalya hoteltransfer',
      seoTitle: 'Antalya Transfer Service | GATE Transfer - 24/7 Sicherer Transport',
      seoDescription: 'Antalya Transfer-Service. Sicherer, komfortabler und erschwinglicher Transfer vom Flughafen Antalya ins Stadtzentrum. Jetzt buchen!'
    },
    ru: {
      name: 'Анталия',
      description: 'Центр города Анталия является одним из самых популярных туристических направлений Турции с древними руинами и великолепными пляжами.',
      keywords: 'трансфер анталия, трансфер аэропорт анталия, трансфер отель анталия',
      seoTitle: 'Трансфер Анталия | GATE Transfer - Круглосуточный Безопасный Транспорт',
      seoDescription: 'Услуги трансфера в Анталии. Безопасный, комфортный и доступный трансфер из аэропорта Анталии в центр города. Забронируйте сейчас!'
    },
    ar: {
      name: 'أنطاليا',
      description: 'وسط مدينة أنطاليا هو واحد من أشهر الوجهات السياحية في تركيا مع آثاره القديمة وشواطئه الرائعة.',
      keywords: 'ترانسفر أنطاليا, نقل مطار أنطاليا, نقل فندق أنطاليا',
      seoTitle: 'خدمة نقل أنطاليا | GATE Transfer - نقل آمن على مدار الساعة',
      seoDescription: 'خدمة النقل في أنطاليا. نقل آمن ومريح وبأسعار معقولة من مطار أنطاليا إلى وسط المدينة. احجز الآن!'
    }
  },
  kemer: {
    tr: {
      name: 'Kemer',
      description: 'Kemer, Toros Dağları ve Akdeniz arasında yer alan, doğal güzellikleri ve lüks otelleriyle ünlü bir tatil beldesiidir.',
      keywords: 'kemer transfer, antalya havalimanı kemer transfer, kemer otel transfer',
      seoTitle: 'Kemer Transfer Hizmeti | GATE Transfer - Antalya Havalimanından Kemer',
      seoDescription: 'Kemer transfer hizmeti. Antalya havalimanından Kemer\'e güvenli, konforlu transfer. Lüks otellere direkt ulaşım!'
    },
    en: {
      name: 'Kemer',
      description: 'Kemer is a popular resort town located between the Taurus Mountains and the Mediterranean Sea, famous for its natural beauty and luxury hotels.',
      keywords: 'kemer transfer, antalya airport kemer transfer, kemer hotel transfer',
      seoTitle: 'Kemer Transfer Service | GATE Transfer - Antalya Airport to Kemer',
      seoDescription: 'Kemer transfer service. Safe, comfortable transfer from Antalya airport to Kemer. Direct transportation to luxury hotels!'
    },
    de: {
      name: 'Kemer',
      description: 'Kemer ist ein beliebter Ferienort zwischen dem Taurusgebirge und dem Mittelmeer, berühmt für seine natürliche Schönheit und Luxushotels.',
      keywords: 'kemer transfer, flughafen antalya kemer transfer, kemer hoteltransfer',
      seoTitle: 'Kemer Transfer Service | GATE Transfer - Flughafen Antalya nach Kemer',
      seoDescription: 'Kemer Transfer-Service. Sicherer, komfortabler Transfer vom Flughafen Antalya nach Kemer. Direkter Transport zu Luxushotels!'
    },
    ru: {
      name: 'Кемер',
      description: 'Кемер - популярный курортный город, расположенный между Таврскими горами и Средиземным морем, известный своей природной красотой и роскошными отелями.',
      keywords: 'трансфер кемер, трансфер аэропорт анталия кемер, трансфер отель кемер',
      seoTitle: 'Трансфер Кемер | GATE Transfer - Аэропорт Анталия в Кемер',
      seoDescription: 'Услуги трансфера в Кемер. Безопасный, комфортный трансфер из аэропорта Анталии в Кемер. Прямой транспорт к роскошным отелям!'
    }
  }
};
```

### Language-Aware CityPageLayout:
```jsx
// src/components/Layout/CityPageLayout.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../contexts/LanguageContext';

const CityPageLayout = ({ 
  cityKey,
  children 
}) => {
  const { currentLanguage, getCityData } = useLanguage();
  const cityData = getCityData(cityKey);
  
  return (
    <>
      <Helmet>
        <title>{cityData.seoTitle}</title>
        <meta name="description" content={cityData.seoDescription} />
        <meta name="keywords" content={cityData.keywords} />
        <link rel="canonical" href={`https://gatetransfer.com/${currentLanguage === 'tr' ? '' : currentLanguage + '/'}${cityKey}-transfer`} />
        
        {/* Hreflang tags for SEO */}
        <link rel="alternate" href={`https://gatetransfer.com/${cityKey}-transfer`} hrefLang="tr" />
        <link rel="alternate" href={`https://gatetransfer.com/en/${cityKey}-transfer`} hrefLang="en" />
        <link rel="alternate" href={`https://gatetransfer.com/de/${cityKey}-transfer`} hrefLang="de" />
        <link rel="alternate" href={`https://gatetransfer.com/ru/${cityKey}-transfer`} hrefLang="ru" />
        <link rel="alternate" href={`https://gatetransfer.com/ar/${cityKey}-transfer`} hrefLang="ar" />
        
        {/* Multi-language Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `GATE Transfer - ${cityData.name} Transfer Hizmeti`,
            "description": cityData.description,
            "url": `https://gatetransfer.com/${currentLanguage === 'tr' ? '' : currentLanguage + '/'}${cityKey}-transfer`,
            "telephone": "+90 532 574 26 82",
            "inLanguage": currentLanguage,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Güzelyurt Mahallesi Serik Caddesi No: 138/2",
              "addressLocality": "Aksu",
              "addressRegion": "Antalya",
              "postalCode": "07112",
              "addressCountry": "TR"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
};

export default CityPageLayout;
```

### Language Context:
```jsx
// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { cityDataMultiLang } from '../data/cityData';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  
  const getCityData = (cityKey) => {
    return cityDataMultiLang[cityKey]?.[currentLanguage] || cityDataMultiLang[cityKey]?.tr;
  };
  
  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    // Update URL and localStorage
    localStorage.setItem('preferred-language', lang);
  };
  
  const value = {
    currentLanguage,
    changeLanguage,
    getCityData,
    availableLanguages: ['tr', 'en', 'de', 'ru', 'ar', 'pl', 'ro']
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### Multi-Language Routes:
```jsx
// src/App.jsx - Updated routes for multi-language
const MultiLanguageRoutes = () => {
  return (
    <Routes>
      {/* Turkish (default) routes */}
      <Route path="/" element={<Layout />}>
        <Route path="antalya-transfer" element={<AntalyaTransferPage />} />
        <Route path="kemer-transfer" element={<KemerTransferPage />} />
        <Route path="side-transfer" element={<SideTransferPage />} />
        <Route path="belek-transfer" element={<BelekTransferPage />} />
        <Route path="alanya-transfer" element={<AlanyaTransferPage />} />
      </Route>
      
      {/* English routes */}
      <Route path="/en" element={<Layout />}>
        <Route path="antalya-transfer" element={<AntalyaTransferPage />} />
        <Route path="kemer-transfer" element={<KemerTransferPage />} />
        <Route path="side-transfer" element={<SideTransferPage />} />
        <Route path="belek-transfer" element={<BelekTransferPage />} />
        <Route path="alanya-transfer" element={<AlanyaTransferPage />} />
      </Route>
      
      {/* German routes */}
      <Route path="/de" element={<Layout />}>
        <Route path="antalya-transfer" element={<AntalyaTransferPage />} />
        <Route path="kemer-transfer" element={<KemerTransferPage />} />
        <Route path="side-transfer" element={<SideTransferPage />} />
        <Route path="belek-transfer" element={<BelekTransferPage />} />
        <Route path="alanya-transfer" element={<AlanyaTransferPage />} />
      </Route>
      
      {/* Russian routes */}
      <Route path="/ru" element={<Layout />}>
        <Route path="antalya-transfer" element={<AntalyaTransferPage />} />
        <Route path="kemer-transfer" element={<KemerTransferPage />} />
        <Route path="side-transfer" element={<SideTransferPage />} />
        <Route path="belek-transfer" element={<BelekTransferPage />} />
        <Route path="alanya-transfer" element={<AlanyaTransferPage />} />
      </Route>
      
      {/* Arabic routes */}
      <Route path="/ar" element={<Layout />}>
        <Route path="antalya-transfer" element={<AntalyaTransferPage />} />
        <Route path="kemer-transfer" element={<KemerTransferPage />} />
        <Route path="side-transfer" element={<SideTransferPage />} />
        <Route path="belek-transfer" element={<BelekTransferPage />} />
        <Route path="alanya-transfer" element={<AlanyaTransferPage />} />
      </Route>
    </Routes>
  );
};
```
