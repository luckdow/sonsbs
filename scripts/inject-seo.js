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
    canonical: 'https://www.gatetransfer.com/'
  },
  '/kemer-transfer': {
    title: 'Kemer Transfer - Antalya Havalimanı Kemer Transfer | SBS Turkey',
    description: 'Antalya havalimanından Kemer transfer hizmeti. 7/24 güvenli ulaşım, konforlu araçlar, uygun fiyat.',
    canonical: 'https://www.gatetransfer.com/kemer-transfer'
  },
  '/alanya-transfer': {
    title: 'Alanya Transfer - Antalya Havalimanı Alanya Transfer | SBS Turkey',  
    description: 'Alanya transfer hizmeti. Antalya havalimanından Alanya güvenli ve konforlu ulaşım.',
    canonical: 'https://www.gatetransfer.com/alanya-transfer'
  },
  '/antalya-transfer': {
    title: 'Antalya Transfer - Şehir Merkezi Transfer | SBS Turkey',
    description: 'Antalya şehir merkezi transfer. Havalimanından Kaleiçi, Lara, Konyaaltı transfer.',
    canonical: 'https://www.gatetransfer.com/antalya-transfer'
  },
  '/side-transfer': {
    title: 'Side Transfer - Antalya Havalimanı Side Transfer | SBS Turkey',
    description: 'Side transfer hizmeti. Antalya havalimanından Side antik kentine güvenli ulaşım.',
    canonical: 'https://www.gatetransfer.com/side-transfer'
  },
  '/belek-transfer': {
    title: 'Belek Transfer - Golf Otelleri Transfer | SBS Turkey',
    description: 'Belek golf otelleri transfer. Antalya havalimanından Belek lüks araçlarla ulaşım.',
    canonical: 'https://www.gatetransfer.com/belek-transfer'
  },
  '/lara-transfer': {
    title: 'Lara Transfer - Antalya Lara Plajı Transfer | SBS Turkey',
    description: 'Lara plajı transfer hizmeti. Antalya havalimanından Lara bölgesine güvenli ulaşım.',
    canonical: 'https://www.gatetransfer.com/lara-transfer'
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
  
  // Inject dynamic canonical script that works for all pages
  const dynamicCanonicalScript = `
    <script>
      // Dynamic canonical URL injection for all pages
      (function() {
        const currentPath = window.location.pathname;
        const seoMappings = {
          '/': 'https://www.gatetransfer.com/',
          '/kemer-transfer': 'https://www.gatetransfer.com/kemer-transfer',
          '/alanya-transfer': 'https://www.gatetransfer.com/alanya-transfer',
          '/antalya-transfer': 'https://www.gatetransfer.com/antalya-transfer',
          '/side-transfer': 'https://www.gatetransfer.com/side-transfer',
          '/belek-transfer': 'https://www.gatetransfer.com/belek-transfer',
          '/lara-transfer': 'https://www.gatetransfer.com/lara-transfer',
          '/kas-transfer': 'https://www.gatetransfer.com/kas-transfer',
          '/kalkan-transfer': 'https://www.gatetransfer.com/kalkan-transfer',
          '/manavgat-transfer': 'https://www.gatetransfer.com/manavgat-transfer',
          '/serik-transfer': 'https://www.gatetransfer.com/serik-transfer',
          '/hakkimizda': 'https://www.gatetransfer.com/hakkimizda',
          '/iletisim': 'https://www.gatetransfer.com/iletisim',
          '/hizmetlerimiz': 'https://www.gatetransfer.com/hizmetlerimiz',
          '/blog': 'https://www.gatetransfer.com/blog',
          '/sss': 'https://www.gatetransfer.com/sss'
        };
        
        const canonicalUrl = seoMappings[currentPath] || \`https://www.gatetransfer.com\${currentPath}\`;
        
        // Remove existing canonical if any
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
          existingCanonical.remove();
        }
        
        // Add new canonical
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = canonicalUrl;
        document.head.appendChild(canonical);
        
        console.log('Dynamic canonical set:', canonicalUrl);
      })();
    </script>
  `;
  
  // Inject the dynamic canonical script in head
  htmlContent = htmlContent.replace('</head>', `${dynamicCanonicalScript}\n</head>`);
  
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
