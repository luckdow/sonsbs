import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = join(__dirname, '..', 'dist');

// Routes to prerender
const ROUTES = [
  '/',
  '/hakkimizda',
  '/iletisim',
  '/hizmetler',
  '/sss',
  '/gizlilik-politikasi',
  '/kullanim-kosullari',
  '/cerez-politikasi',
  '/kvkk',
  '/iptal-iade',
  '/antalya-transfer',
  '/kemer-transfer',
  '/side-transfer',
  '/belek-transfer',
  '/alanya-transfer',
  '/kas-transfer',
  '/kalkan-transfer',
  '/manavgat-transfer',
  '/serik-transfer',
  '/lara-transfer',
  '/hizmetler/havaalani-transfer',
  '/hizmetler/vip-transfer',
  '/hizmetler/grup-transfer',
  '/hizmetler/otel-transfer',
  '/hizmetler/sehirici-transfer',
  '/hizmetler/dugun-transfer',
  '/hizmetler/kurumsal-transfer',
  '/hizmetler/karsilama-hizmeti',
  '/blog'
];

// HTML template cleanup function
function cleanupHTML(html) {
  return html
    .replace(/<script[^>]*id="__vite_plugin_react_preamble_installed__"[^>]*><\/script>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Create directory recursively
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Copy static assets
function copyStaticAssets(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) return;
  
  ensureDir(targetDir);
  
  const items = readdirSync(sourceDir, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = join(sourceDir, item.name);
    const targetPath = join(targetDir, item.name);
    
    if (item.isDirectory()) {
      copyStaticAssets(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

// Main prerender function
async function prerender() {
  console.log('🚀 Basit prerender işlemi başlatılıyor...');
  
  // Check if development server is running
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Development server not accessible');
    }
  } catch (error) {
    console.error('❌ Geliştirme sunucusu çalışmıyor. Önce "npm run dev" komutunu çalıştırın!');
    process.exit(1);
  }
  
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 1024 });
  
  // Prerender each route
  for (const route of ROUTES) {
    try {
      console.log(`🔄 İşleniyor: ${route}`);
      
      // Navigate to route
      await page.goto(`${BASE_URL}${route}`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for React to render
      await page.waitForSelector('#root', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Get the rendered HTML
      const html = await page.content();
      const cleanedHTML = cleanupHTML(html);
      
      // Create output directory structure
      const routePath = route === '/' ? '/index' : route;
      const outputPath = join(OUTPUT_DIR, routePath);
      
      if (routePath.includes('/')) {
        ensureDir(dirname(join(OUTPUT_DIR, routePath + '.html')));
      }
      
      // Write HTML file
      const htmlPath = routePath.endsWith('/') || routePath === '/index' 
        ? join(outputPath, 'index.html')
        : `${outputPath}.html`;
        
      ensureDir(dirname(htmlPath));
      writeFileSync(htmlPath, cleanedHTML);
      
      console.log(`✅ Oluşturuldu: ${htmlPath}`);
      
    } catch (error) {
      console.error(`❌ Hata - ${route}:`, error.message);
    }
  }
  
  await browser.close();
  
  // Copy static assets from public directory
  const publicDir = join(__dirname, '..', 'public');
  if (existsSync(publicDir)) {
    console.log('📁 Statik dosyalar kopyalanıyor...');
    copyStaticAssets(publicDir, OUTPUT_DIR);
  }
  
  console.log('🎉 Prerender işlemi tamamlandı!');
  console.log(`📂 Dosyalar: ${OUTPUT_DIR}`);
}

// Run prerender
prerender().catch(error => {
  console.error('❌ Prerender hatası:', error);
  process.exit(1);
});
