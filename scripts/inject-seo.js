#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL-specific SEO data
const seoData = {
  '/': {
    title: 'SBS Turkey Transfer | Antalya VIP Havalimanı Transfer Hizmeti',
    description: 'Antalya havalimanı transfer hizmeti. TURSAB onaylı güvenli ulaşım, konforlu araçlar, 7/24 profesyonel şoför hizmeti. Kemer, Side, Belek, Alanya transferi. Hemen rezervasyon yapın!',
    keywords: 'antalya transfer, havalimanı transfer, kemer transfer, side transfer, belek transfer, alanya transfer, vip transfer, airport transfer, turkey transfer, antalya airport transfer',
    canonical: 'https://www.gatetransfer.com/',
    ogTitle: 'SBS Turkey Transfer | Antalya VIP Havalimanı Transfer Hizmeti',
    ogDescription: 'Antalya havalimanı transfer hizmeti. TURSAB onaylı güvenli ulaşım, konforlu araçlar, 7/24 profesyonel şoför hizmeti.',
    ogImage: 'https://www.gatetransfer.com/images/sbs-turkey-transfer-og.jpg'
  },
  '/kemer-transfer': {
    title: 'Kemer Transfer - Antalya Havalimanı Kemer Transfer | SBS Turkey',
    description: 'Antalya havalimanından Kemer transfer hizmeti. 7/24 güvenli ulaşım, konforlu araçlar, uygun fiyat.',
    keywords: 'kemer transfer, antalya kemer transfer, havalimanı kemer, kemer otel transfer, kemer şehir merkezi',
    canonical: 'https://www.gatetransfer.com/kemer-transfer',
    ogTitle: 'Kemer Transfer - Antalya Havalimanı Kemer Transfer',
    ogDescription: 'Antalya havalimanından Kemer transfer hizmeti. 7/24 güvenli ulaşım, konforlu araçlar.',
    ogImage: 'https://www.gatetransfer.com/images/kemer-transfer-og.jpg'
  },
  '/alanya-transfer': {
    title: 'Alanya Transfer - Antalya Havalimanı Alanya Transfer | SBS Turkey',  
    description: 'Alanya transfer hizmeti. Antalya havalimanından Alanya güvenli ve konforlu ulaşım.',
    keywords: 'alanya transfer, antalya alanya transfer, havalimanı alanya, alanya otel transfer, alanya şehir merkezi',
    canonical: 'https://www.gatetransfer.com/alanya-transfer',
    ogTitle: 'Alanya Transfer - Antalya Havalimanı Alanya Transfer',
    ogDescription: 'Alanya transfer hizmeti. Antalya havalimanından Alanya güvenli ve konforlu ulaşım.',
    ogImage: 'https://www.gatetransfer.com/images/alanya-transfer-og.jpg'
  },
  '/antalya-transfer': {
    title: 'Antalya Transfer - Şehir Merkezi Transfer | SBS Turkey',
    description: 'Antalya şehir merkezi transfer. Havalimanından Kaleiçi, Lara, Konyaaltı transfer.',
    keywords: 'antalya şehir merkezi transfer, kaleiçi transfer, lara transfer, konyaaltı transfer, antalya havalimanı',
    canonical: 'https://www.gatetransfer.com/antalya-transfer',
    ogTitle: 'Antalya Transfer - Şehir Merkezi Transfer',
    ogDescription: 'Antalya şehir merkezi transfer. Havalimanından Kaleiçi, Lara, Konyaaltı transfer.',
    ogImage: 'https://www.gatetransfer.com/images/antalya-transfer-og.jpg'
  },
  '/side-transfer': {
    title: 'Side Transfer - Antalya Havalimanı Side Transfer | SBS Turkey',
    description: 'Side transfer hizmeti. Antalya havalimanından Side antik kentine güvenli ulaşım.',
    keywords: 'side transfer, antalya side transfer, havalimanı side, side antik kent, side otel transfer',
    canonical: 'https://www.gatetransfer.com/side-transfer',
    ogTitle: 'Side Transfer - Antalya Havalimanı Side Transfer',
    ogDescription: 'Side transfer hizmeti. Antalya havalimanından Side antik kentine güvenli ulaşım.',
    ogImage: 'https://www.gatetransfer.com/images/side-transfer-og.jpg'
  },
  '/belek-transfer': {
    title: 'Belek Transfer - Golf Otelleri Transfer | SBS Turkey',
    description: 'Belek golf otelleri transfer. Antalya havalimanından Belek lüks araçlarla ulaşım.',
    keywords: 'belek transfer, antalya belek transfer, havalimanı belek, belek golf otelleri, belek resort',
    canonical: 'https://www.gatetransfer.com/belek-transfer',
    ogTitle: 'Belek Transfer - Golf Otelleri Transfer',
    ogDescription: 'Belek golf otelleri transfer. Antalya havalimanından Belek lüks araçlarla ulaşım.',
    ogImage: 'https://www.gatetransfer.com/images/belek-transfer-og.jpg'
  },
  '/lara-transfer': {
    title: 'Lara Transfer - Antalya Lara Plajı Transfer | SBS Turkey',
    description: 'Lara plajı transfer hizmeti. Antalya havalimanından Lara bölgesine güvenli ulaşım.',
    keywords: 'lara transfer, antalya lara transfer, havalimanı lara, lara plajı transfer, lara otelleri',
    canonical: 'https://www.gatetransfer.com/lara-transfer',
    ogTitle: 'Lara Transfer - Antalya Lara Plajı Transfer',
    ogDescription: 'Lara plajı transfer hizmeti. Antalya havalimanından Lara bölgesine güvenli ulaşım.',
    ogImage: 'https://www.gatetransfer.com/images/lara-transfer-og.jpg'
  }
};

// SEO content to inject into build
const seoContent = `
      <!-- Enhanced SEO Content for Search Engines & Crawlers -->
      <article style="visibility: hidden; position: absolute; top: -9999px;" id="seo-content">
        <header>
          <h1>SBS Turkey Transfer | Antalya Havalimanı Transfer Hizmeti</h1>
          <p>Türkiye'nin lider transfer platformu Gate Transfer. TURSAB onaylı güvenilir havalimanı transfer hizmetleri. 7/24 profesyonel şoför hizmeti, lüks araçlar ve uygun fiyatlar.</p>
        </header>
        
        <main>
          <section>
            <h2>Transfer Hizmetlerimiz</h2>
            <ul>
              <li>Antalya Havalimanı Transfer</li>
              <li>Kemer Transfer - Otel ve şehir merkezi transfer hizmeti</li>
              <li>Side Transfer - Antik kent ve otel transfer</li>
              <li>Belek Transfer - Golf otelleri ve tatil köyleri</li>
              <li>Alanya Transfer - Şehir merkezi ve oteller</li>
              <li>Lara Transfer - Lüks otel bölgesi transfer</li>
              <li>Kaş Transfer - Doğa ve kültür turları</li>
              <li>Kalkan Transfer - Butik otel ve marina</li>
              <li>Manavgat Transfer - Şelale ve antik şehir</li>
              <li>Serik Transfer - Golf ve tatil merkezleri</li>
            </ul>
          </section>
        
          <section>
            <h3>Neden SBS Turkey Transfer?</h3>
            <ul>
              <li>TURSAB onaylı güvenilir hizmet</li>
              <li>7/24 müşteri destek hattı</li>
              <li>Profesyonel şoförler</li>
              <li>Lüks ve konforlu araçlar</li>
              <li>Uygun fiyat garantisi</li>
              <li>Online rezervasyon sistemi</li>
              <li>Havalimanı karşılama hizmeti</li>
              <li>Güvenli ödeme seçenekleri</li>
            </ul>
          </section>
        
          <section>
            <h3>Hizmet Verdiğimiz Bölgeler</h3>
            <p>Antalya ve çevresindeki tüm turistik bölgelere transfer hizmeti sunuyoruz. Kemer, Side, Belek, Alanya, Lara, Kaş, Kalkan ve diğer popüler destinasyonlara güvenli ulaşım.</p>
          </section>
        </main>
        
        <footer>
          <p>SBS Turkey Transfer - Antalya Havalimanı Transfer Hizmetleri</p>
          <p>Telefon: +90 242 XXX XX XX | Email: info@gatetransfer.com</p>
        </footer>
      </article>
      
      <!-- Loading fallback for fast initial paint -->
      <div id="loading-fallback" style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
      ">
        <div>
          <h1 style="margin-bottom: 20px; font-size: 2.5em;">🚐 SBS Turkey Transfer</h1>
          <p style="font-size: 1.2em; margin-bottom: 30px;">Antalya Havalimanı Transfer Hizmeti</p>
          <div style="
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          "></div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      </div>
`;

// Bot detection script to be injected before closing body tag
const botDetectionScript = `
    <script>
      (function() {
        // Advanced bot detection
        const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
        const isHeadless = navigator.webdriver || window.navigator.webdriver;
        const isAutomated = window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect;
        const hasNormalBrowserAPIs = Boolean(
          window.requestAnimationFrame && 
          window.localStorage && 
          window.sessionStorage && 
          window.indexedDB && 
          document.documentElement.style.webkitTransform !== undefined
        );
        
        const isBotLikely = isBot || isHeadless || isAutomated || !hasNormalBrowserAPIs;
        
        if (isBotLikely) {
          // Bot detected - show SEO content immediately
          const seoContent = document.getElementById('seo-content');
          const loadingFallback = document.getElementById('loading-fallback');
          
          if (seoContent) {
            seoContent.style.visibility = 'visible';
            seoContent.style.position = 'relative';
            seoContent.style.top = 'auto';
            seoContent.style.padding = '20px';
            seoContent.style.fontFamily = 'Arial, sans-serif';
            seoContent.style.lineHeight = '1.6';
            seoContent.style.background = '#ffffff';
            seoContent.style.margin = '20px auto';
            seoContent.style.maxWidth = '1200px';
          }
          
          if (loadingFallback) {
            loadingFallback.style.display = 'none';
          }
          
          // Don't load React for bots to save resources
          console.log('Bot detected - serving static SEO content');
          return;
        }
        
        // Human user detected - load React app
        console.log('Human user detected - loading React application');
        
        // Hide SEO content for humans (it will be replaced by React)
        setTimeout(() => {
          const seoContent = document.getElementById('seo-content');
          if (seoContent) {
            seoContent.remove();
          }
        }, 100);
      })();
    </script>
`;

function injectDynamicCanonicals(htmlContent) {
  // Remove any existing static canonical
  htmlContent = htmlContent.replace(/<link rel="canonical"[^>]*>/g, '');
  
  // Inject comprehensive dynamic SEO script that works for all pages
  const dynamicSEOScript = `
    <script>
      // Dynamic SEO tags injection for all pages
      (function() {
        const currentPath = window.location.pathname;
        const seoMappings = {
          '/': {
            title: 'SBS Turkey Transfer | Antalya VIP Havalimanı Transfer Hizmeti',
            description: 'Antalya havalimanı transfer hizmeti. TURSAB onaylı güvenli ulaşım, konforlu araçlar, 7/24 profesyonel şoför hizmeti.',
            keywords: 'antalya transfer, havalimanı transfer, kemer transfer, side transfer, belek transfer, alanya transfer, vip transfer, airport transfer, turkey transfer, antalya airport transfer',
            canonical: 'https://www.gatetransfer.com/',
            ogTitle: 'SBS Turkey Transfer | Antalya VIP Havalimanı Transfer Hizmeti',
            ogDescription: 'Antalya havalimanı transfer hizmeti. TURSAB onaylı güvenli ulaşım, konforlu araçlar, 7/24 profesyonel şoför hizmeti.',
            ogImage: 'https://www.gatetransfer.com/images/sbs-turkey-transfer-og.jpg'
          },
          '/kemer-transfer': {
            title: 'Kemer Transfer - Antalya Havalimanı Kemer Transfer | SBS Turkey',
            description: 'Antalya havalimanından Kemer transfer hizmeti. 7/24 güvenli ulaşım, konforlu araçlar, uygun fiyat.',
            keywords: 'kemer transfer, antalya kemer transfer, havalimanı kemer, kemer otel transfer, kemer şehir merkezi',
            canonical: 'https://www.gatetransfer.com/kemer-transfer',
            ogTitle: 'Kemer Transfer - Antalya Havalimanı Kemer Transfer',
            ogDescription: 'Antalya havalimanından Kemer transfer hizmeti. 7/24 güvenli ulaşım, konforlu araçlar.',
            ogImage: 'https://www.gatetransfer.com/images/kemer-transfer-og.jpg'
          },
          '/alanya-transfer': {
            title: 'Alanya Transfer - Antalya Havalimanı Alanya Transfer | SBS Turkey',
            description: 'Alanya transfer hizmeti. Antalya havalimanından Alanya güvenli ve konforlu ulaşım.',
            keywords: 'alanya transfer, antalya alanya transfer, havalimanı alanya, alanya otel transfer, alanya şehir merkezi',
            canonical: 'https://www.gatetransfer.com/alanya-transfer',
            ogTitle: 'Alanya Transfer - Antalya Havalimanı Alanya Transfer',
            ogDescription: 'Alanya transfer hizmeti. Antalya havalimanından Alanya güvenli ve konforlu ulaşım.',
            ogImage: 'https://www.gatetransfer.com/images/alanya-transfer-og.jpg'
          },
          '/antalya-transfer': {
            title: 'Antalya Transfer - Şehir Merkezi Transfer | SBS Turkey',
            description: 'Antalya şehir merkezi transfer. Havalimanından Kaleiçi, Lara, Konyaaltı transfer.',
            keywords: 'antalya şehir merkezi transfer, kaleiçi transfer, lara transfer, konyaaltı transfer, antalya havalimanı',
            canonical: 'https://www.gatetransfer.com/antalya-transfer',
            ogTitle: 'Antalya Transfer - Şehir Merkezi Transfer',
            ogDescription: 'Antalya şehir merkezi transfer. Havalimanından Kaleiçi, Lara, Konyaaltı transfer.',
            ogImage: 'https://www.gatetransfer.com/images/antalya-transfer-og.jpg'
          },
          '/side-transfer': {
            title: 'Side Transfer - Antalya Havalimanı Side Transfer | SBS Turkey',
            description: 'Side transfer hizmeti. Antalya havalimanından Side antik kentine güvenli ulaşım.',
            keywords: 'side transfer, antalya side transfer, havalimanı side, side antik kent, side otel transfer',
            canonical: 'https://www.gatetransfer.com/side-transfer',
            ogTitle: 'Side Transfer - Antalya Havalimanı Side Transfer',
            ogDescription: 'Side transfer hizmeti. Antalya havalimanından Side antik kentine güvenli ulaşım.',
            ogImage: 'https://www.gatetransfer.com/images/side-transfer-og.jpg'
          },
          '/belek-transfer': {
            title: 'Belek Transfer - Golf Otelleri Transfer | SBS Turkey',
            description: 'Belek golf otelleri transfer. Antalya havalimanından Belek lüks araçlarla ulaşım.',
            keywords: 'belek transfer, antalya belek transfer, havalimanı belek, belek golf otelleri, belek resort',
            canonical: 'https://www.gatetransfer.com/belek-transfer',
            ogTitle: 'Belek Transfer - Golf Otelleri Transfer',
            ogDescription: 'Belek golf otelleri transfer. Antalya havalimanından Belek lüks araçlarla ulaşım.',
            ogImage: 'https://www.gatetransfer.com/images/belek-transfer-og.jpg'
          },
          '/lara-transfer': {
            title: 'Lara Transfer - Antalya Lara Plajı Transfer | SBS Turkey',
            description: 'Lara plajı transfer hizmeti. Antalya havalimanından Lara bölgesine güvenli ulaşım.',
            keywords: 'lara transfer, antalya lara transfer, havalimanı lara, lara plajı transfer, lara otelleri',
            canonical: 'https://www.gatetransfer.com/lara-transfer',
            ogTitle: 'Lara Transfer - Antalya Lara Plajı Transfer',
            ogDescription: 'Lara plajı transfer hizmeti. Antalya havalimanından Lara bölgesine güvenli ulaşım.',
            ogImage: 'https://www.gatetransfer.com/images/lara-transfer-og.jpg'
          }
        };
        
        // Default fallback for unmapped pages
        const seoData = seoMappings[currentPath] || {
          title: 'SBS Turkey Transfer | Antalya Transfer Hizmeti',
          description: 'Antalya ve çevresine güvenli transfer hizmeti. 7/24 profesyonel şoför hizmeti.',
          keywords: 'antalya transfer, havalimanı transfer, turkey transfer',
          canonical: \`https://www.gatetransfer.com\${currentPath}\`,
          ogTitle: 'SBS Turkey Transfer | Antalya Transfer Hizmeti',
          ogDescription: 'Antalya ve çevresine güvenli transfer hizmeti. 7/24 profesyonel şoför hizmeti.',
          ogImage: 'https://www.gatetransfer.com/images/sbs-turkey-transfer-og.jpg'
        };
        
        // Update document title
        document.title = seoData.title;
        
        // Remove existing meta tags to prevent duplicates
        const existingTags = ['description', 'keywords', 'og:title', 'og:description', 'og:url', 'og:image'];
        existingTags.forEach(tag => {
          const existing = document.querySelector(\`meta[name="\${tag}"], meta[property="\${tag}"]\`);
          if (existing) existing.remove();
        });
        
        // Remove existing canonical
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) existingCanonical.remove();
        
        // Add new meta tags
        const createMeta = (name, content, isProperty = false) => {
          const meta = document.createElement('meta');
          if (isProperty) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        };
        
        // Add canonical link
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = seoData.canonical;
        document.head.appendChild(canonical);
        
        // Add meta tags
        createMeta('description', seoData.description);
        createMeta('keywords', seoData.keywords);
        createMeta('og:title', seoData.ogTitle, true);
        createMeta('og:description', seoData.ogDescription, true);
        createMeta('og:url', seoData.canonical, true);
        createMeta('og:image', seoData.ogImage, true);
        createMeta('og:type', 'website', true);
        createMeta('og:site_name', 'SBS Turkey Transfer', true);
        
        console.log('Dynamic SEO tags injected for:', currentPath);
      })();
    </script>
  `;
  
  // Inject the dynamic SEO script in head
  htmlContent = htmlContent.replace('</head>', `${dynamicSEOScript}\n</head>`);
  
  return htmlContent;
}

console.log('🔧 Post-build SEO Injection Script başlatılıyor...');

// Read the built index.html
const buildPath = path.join(__dirname, '../dist/index.html');

if (!fs.existsSync(buildPath)) {
  console.error('❌ Build edilmiş index.html bulunamadı:', buildPath);
  process.exit(1);
}

let htmlContent = fs.readFileSync(buildPath, 'utf8');

// Inject dynamic canonical URLs for all pages
htmlContent = injectDynamicCanonicals(htmlContent);

// Find the root div and inject SEO content
const rootDivPattern = /(<div id="root">)/;
const match = htmlContent.match(rootDivPattern);

if (!match) {
  console.error('❌ Root div bulunamadı');
  process.exit(1);
}

// Replace the root div with root div + SEO content
const newRootDiv = match[1] + seoContent;
htmlContent = htmlContent.replace(rootDivPattern, newRootDiv);

// Inject bot detection script before closing body tag
htmlContent = htmlContent.replace('</body>', botDetectionScript + '\n</body>');

// Write the modified HTML back
fs.writeFileSync(buildPath, htmlContent, 'utf8');

console.log('✅ SEO içerik başarıyla enjekte edildi');
console.log('📄 Build edilmiş index.html güncellendi');
console.log('🤖 Bot detection script eklendi');
console.log('🔗 Canonical URL eklendi');
console.log('🎯 Google indexleme için hazır!');
