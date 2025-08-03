#!/usr/bin/env node

/**
 * Static Site Generator for SEO
 * Creates static HTML files for better search engine indexing
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to generate static HTML files
const routes = [
  { path: '/', name: 'index' },
  { path: '/hakkimizda', name: 'hakkimizda' },
  { path: '/iletisim', name: 'iletisim' },
  { path: '/hizmetlerimiz', name: 'hizmetlerimiz' },
  { path: '/sss', name: 'sss' },
  { path: '/gizlilik-politikasi', name: 'gizlilik-politikasi' },
  { path: '/kullanim-sartlari', name: 'kullanim-sartlari' },
  { path: '/kvkk', name: 'kvkk' },
  { path: '/cerez-politikasi', name: 'cerez-politikasi' },
  { path: '/iade-iptal', name: 'iade-iptal' },
  
  // Şehir sayfaları
  { path: '/antalya-transfer', name: 'antalya-transfer' },
  { path: '/kemer-transfer', name: 'kemer-transfer' },
  { path: '/side-transfer', name: 'side-transfer' },
  { path: '/belek-transfer', name: 'belek-transfer' },
  { path: '/alanya-transfer', name: 'alanya-transfer' },
  { path: '/kas-transfer', name: 'kas-transfer' },
  { path: '/kalkan-transfer', name: 'kalkan-transfer' },
  { path: '/manavgat-transfer', name: 'manavgat-transfer' },
  { path: '/serik-transfer', name: 'serik-transfer' },
  { path: '/lara-transfer', name: 'lara-transfer' },
  
  // Hizmet sayfaları
  { path: '/hizmetler/havaalani-transfer', name: 'havaalani-transfer' },
  { path: '/hizmetler/vip-transfer', name: 'vip-transfer' },
  { path: '/hizmetler/grup-transfer', name: 'grup-transfer' },
  { path: '/hizmetler/otel-transfer', name: 'otel-transfer' },
  { path: '/hizmetler/sehir-ici-transfer', name: 'sehir-ici-transfer' },
  { path: '/hizmetler/dugun-transfer', name: 'dugun-transfer' },
  { path: '/hizmetler/kurumsal-transfer', name: 'kurumsal-transfer' },
  { path: '/hizmetler/karsilama-hizmeti', name: 'karsilama-hizmeti' },
  
  // Blog sayfası
  { path: '/blog', name: 'blog' }
];

const distDir = path.resolve(__dirname, '../dist');

// Basic HTML template with SEO optimized meta tags
function generateHTML(route) {
  const { path: routePath, name } = route;
  
  // Dynamic meta data based on route with improved SEO
  const metaData = {
    '/': {
      title: 'Gate Transfer - Antalya Havalimanı Transfer Hizmeti | 7/24 Güvenli Ulaşım',
      description: 'Antalya havalimanı transfer hizmeti. Güvenli, konforlu ve profesyonel transfer. TURSAB güvencesi ile 7/24 hizmet. ✓ Ücretsiz iptal ✓ En iyi fiyat garantisi',
      keywords: 'antalya havalimanı transfer, antalya transfer, gate transfer, havalimanı transfer hizmeti'
    },
    '/hakkimizda': {
      title: 'Hakkımızda - Gate Transfer | TURSAB Lisanslı Transfer Firması',
      description: 'Gate Transfer hakkında bilgi alın. TURSAB lisanslı, güvenilir ve profesyonel transfer hizmeti. Antalya bölgesinde 10+ yıllık deneyim.',
      keywords: 'gate transfer hakkımızda, tursab lisanslı transfer, antalya transfer firması'
    },
    '/iletisim': {
      title: 'İletişim - Gate Transfer | 7/24 Rezervasyon ve Destek',
      description: 'Gate Transfer ile iletişime geçin. 7/24 rezervasyon hattı: +90 532 574 26 82. Antalya havalimanı transfer rezervasyonu için hemen arayın.',
      keywords: 'gate transfer iletişim, antalya transfer rezervasyon, havalimanı transfer iletişim'
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
    '/hizmetler/vip-transfer': {
      title: 'VIP Transfer Hizmeti | Lüks Araçlarla Konforlu Yolculuk - Gate Transfer',
      description: 'VIP transfer hizmeti ile lüks araçlarda konforlu yolculuk. Mercedes, BMW ve premium araçlarla özel transfer hizmeti.',
      keywords: 'vip transfer, lüks transfer, premium transfer, mercedes transfer'
    },
    '/blog': {
      title: 'Blog - Gate Transfer | Transfer ve Seyahat Rehberi',
      description: 'Antalya transfer hizmetleri, seyahat ipuçları ve bölge rehberi. Gate Transfer blog sayfasında transfer ve turizm hakkında güncel bilgiler.',
      keywords: 'antalya blog, transfer rehberi, seyahat ipuçları, antalya turizm'
    }
  };
  
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
  <script type="module" crossorigin src="/js/index-CDtEunIT.js"></script>
  
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

async function generateStaticFiles() {
  console.log('🚀 Starting static file generation for SEO...');
  
  try {
    // Check if dist directory exists
    await fs.access(distDir);
    
    let generated = 0;
    
    for (const route of routes) {
      const { path: routePath, name } = route;
      
      // Create file path - for direct HTML files in dist
      let filePath;
      if (routePath === '/') {
        // Root index file (keep existing)
        filePath = path.join(distDir, 'index.html');
      } else {
        // Create HTML files directly in dist folder with clean names
        const fileName = routePath.replace(/^\//, '').replace(/\//g, '-') + '.html';
        filePath = path.join(distDir, fileName);
      }
      
      // Generate and write HTML
      const html = generateHTML(route);
      await fs.writeFile(filePath, html, 'utf8');
      
      console.log(`✅ Generated: ${routePath} → ${filePath}`);
      generated++;
    }
    
    console.log(`🎉 Successfully generated ${generated} static HTML files for SEO!`);
    console.log(`📁 Files created in: ${distDir}`);
    
  } catch (error) {
    console.error('❌ Error generating static files:', error.message);
    process.exit(1);
  }
}

generateStaticFiles();
