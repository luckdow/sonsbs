#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO optimized routes
const routes = [
  // Ana sayfa
  { path: '/', name: 'Ana Sayfa' },
  
  // Şehir transfer sayfaları
  { path: '/antalya-transfer', name: 'Antalya Transfer' },
  { path: '/alanya-transfer', name: 'Alanya Transfer' },
  { path: '/belek-transfer', name: 'Belek Transfer' },
  { path: '/kemer-transfer', name: 'Kemer Transfer' },
  { path: '/side-transfer', name: 'Side Transfer' },
  { path: '/lara-transfer', name: 'Lara Transfer' },
  { path: '/kas-transfer', name: 'Kaş Transfer' },
  { path: '/kalkan-transfer', name: 'Kalkan Transfer' },
  { path: '/serik-transfer', name: 'Serik Transfer' },
  { path: '/manavgat-transfer', name: 'Manavgat Transfer' },
  
  // Hizmet sayfaları
  { path: '/hizmetler/havaalani-transfer', name: 'Havalimanı Transfer' },
  { path: '/hizmetler/vip-transfer', name: 'VIP Transfer' },
  { path: '/hizmetler/otel-transfer', name: 'Otel Transfer' },
  { path: '/hizmetler/grup-transfer', name: 'Grup Transfer' },
  { path: '/hizmetler/kurumsal-transfer', name: 'Kurumsal Transfer' },
  { path: '/hizmetler/dugun-transfer', name: 'Düğün Transfer' },
  { path: '/hizmetler/sehirici-transfer', name: 'Şehiriçi Transfer' },
  { path: '/hizmetler/karsilama-hizmeti', name: 'Karşılama Hizmeti' },
  
  // Statik sayfalar
  { path: '/hakkimizda', name: 'Hakkımızda' },
  { path: '/iletisim', name: 'İletişim' },
  { path: '/hizmetler', name: 'Hizmetler' },
  { path: '/sss', name: 'Sıkça Sorulan Sorular' },
  { path: '/gizlilik-politikasi', name: 'Gizlilik Politikası' },
  { path: '/kullanim-kosullari', name: 'Kullanım Koşulları' },
  { path: '/cerez-politikasi', name: 'Çerez Politikası' },
  { path: '/kvkk', name: 'KVKK' },
  { path: '/iptal-iade', name: 'İptal ve İade' },
  
  // Blog sayfası
  { path: '/blog', name: 'Blog' }
];

const distDir = path.resolve(__dirname, '../dist');

// Meta data for different routes
const metaData = {
  '/': {
    title: 'Gate Transfer - Antalya Havalimanı Transfer Hizmeti | 7/24 Güvenli Ulaşım',
    description: 'Antalya havalimanı transfer hizmeti. Güvenli, konforlu ve profesyonel transfer. TURSAB güvencesi ile 7/24 hizmet. ✓ Ücretsiz iptal ✓ En iyi fiyat garantisi',
    keywords: 'antalya havalimanı transfer, antalya transfer, gate transfer, havalimanı transfer hizmeti'
  },
  '/antalya-transfer': {
    title: 'Antalya Transfer Hizmeti | Antalya Havalimanı Transfer - Gate Transfer',
    description: 'Antalya transfer hizmeti ile havalimanından şehir merkezine güvenli ulaşım. ✓ 7/24 hizmet ✓ Profesyonel şoförler ✓ Ekonomik fiyatlar',
    keywords: 'antalya transfer, antalya havalimanı transfer, antalya şehir merkezi transfer'
  },
  '/kemer-transfer': {
    title: 'Kemer Transfer | Antalya Havalimanı Kemer Transfer Hizmeti',
    description: 'Antalya Havalimanı\'ndan Kemer\'e transfer hizmeti. Güvenli ve konforlu yolculuk. ✓ 7/24 hizmet ✓ Sabit fiyat ✓ Online rezervasyon',
    keywords: 'kemer transfer, antalya havalimanı kemer, kemer transferi'
  },
  '/side-transfer': {
    title: 'Side Transfer | Antalya Havalimanı Side Transfer Hizmeti', 
    description: 'Antalya Havalimanı\'ndan Side\'ye transfer hizmeti. Antik kent Side\'ye güvenli ulaşım. ✓ Deneyimli şoförler ✓ Konforlu araçlar',
    keywords: 'side transfer, antalya havalimanı side, side transferi, antik kent side'
  },
  '/hizmetler/havaalani-transfer': {
    title: 'Havalimanı Transfer Hizmeti | Gate Transfer - 7/24 Güvenli Ulaşım',
    description: 'Profesyonel havalimanı transfer hizmeti. Antalya havalimanından her noktaya güvenli ulaşım. ✓ VIP araçlar ✓ Deneyimli şoförler',
    keywords: 'havalimanı transfer, antalya havalimanı transfer, transfer hizmeti'
  },
  '/blog': {
    title: 'Blog - Gate Transfer | Transfer ve Seyahat Rehberi',
    description: 'Antalya transfer hizmetleri, seyahat ipuçları ve bölge rehberi. Gate Transfer blog sayfasında transfer ve turizm hakkında güncel bilgiler.',
    keywords: 'antalya blog, transfer rehberi, seyahat ipuçları, antalya turizm'
  }
};

// Generate HTML for a route
function generateHTML(route) {
  const { path: routePath, name } = route;
  
  const meta = metaData[routePath] || {
    title: `${name} - Gate Transfer | Antalya Transfer Hizmeti`,
    description: `${name} sayfası. Gate Transfer ile güvenli ve konforlu transfer hizmeti alın. TURSAB güvencesi ile profesyonel hizmet.`,
    keywords: `${name}, gate transfer, antalya transfer`
  };
  
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <meta name="keywords" content="${meta.keywords}">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.gatetransfer.com${routePath}">
  <meta property="og:image" content="https://www.gatetransfer.com/images/gate-transfer-og.jpg">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Gate Transfer">
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="https://www.gatetransfer.com/images/gate-transfer-twitter.jpg">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://www.gatetransfer.com${routePath}">
  
  <!-- Hreflang for Turkish -->
  <link rel="alternate" hreflang="tr" href="https://www.gatetransfer.com${routePath}">
  <link rel="alternate" hreflang="x-default" href="https://www.gatetransfer.com${routePath}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- CSS -->
  <link rel="stylesheet" href="/css/index-CryFS7TR.css">
  
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gate Transfer",
    "url": "https://www.gatetransfer.com",
    "logo": "https://www.gatetransfer.com/images/logo.png",
    "description": "Antalya havalimanı transfer hizmeti. TURSAB lisanslı, güvenli ve profesyonel transfer.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Antalya",
      "addressCountry": "TR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-532-574-26-82",
      "contactType": "customer service"
    }
  }
  </script>
</head>
<body>
  <div id="root">
    <!-- SEO Content for ${routePath} -->
    <main>
      <h1>${meta.title}</h1>
      <p>${meta.description}</p>
      <p>Sayfa yükleniyor... JavaScript etkinleştirilmiş olmalıdır.</p>
      <noscript>
        <p>Bu site düzgün çalışması için JavaScript gerektirir. Lütfen tarayıcınızda JavaScript'i etkinleştirin.</p>
      </noscript>
    </main>
  </div>
  
  <!-- JavaScript -->
  <script type="module" crossorigin src="/js/index-BFgLw3w0.js"></script>
  
  <!-- Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
</body>
</html>`;
}

async function generateStaticHTMLFiles() {
  console.log('🚀 HTML statik dosyaları oluşturuluyor...');
  
  try {
    // Dist klasörünün varlığını kontrol et
    await fs.access(distDir);
    
    let generated = 0;
    
    for (const route of routes) {
      const { path: routePath, name } = route;
      
      // Dosya yolu oluştur
      let filePath;
      if (routePath === '/') {
        // Ana sayfa için mevcut index.html'i güncelleme
        continue; // Ana sayfa zaten mevcut
      } else {
        // Temiz dosya adları oluştur
        const fileName = routePath.replace(/^\//, '').replace(/\//g, '-') + '.html';
        filePath = path.join(distDir, fileName);
      }
      
      // HTML oluştur ve dosyayı yaz
      const html = generateHTML(route);
      await fs.writeFile(filePath, html, 'utf8');
      
      console.log(`✅ Oluşturuldu: ${routePath} → ${path.basename(filePath)}`);
      generated++;
    }
    
    console.log(`🎉 Toplam ${generated} statik HTML dosyası oluşturuldu!`);
    console.log(`📁 Dosyalar şuraya kaydedildi: ${distDir}`);
    
  } catch (error) {
    console.error('❌ Statik dosya oluşturma hatası:', error.message);
    process.exit(1);
  }
}

generateStaticHTMLFiles();
