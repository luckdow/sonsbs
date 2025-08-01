import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// App.jsx'deki GERÇEK route'ları kullan
const routes = [
  '/',
  '/rezervasyon',
  '/hakkimizda', 
  '/iletisim',
  '/hizmetlerimiz',
  '/sss',
  '/gizlilik-politikasi',
  '/kullanim-sartlari',
  '/kvkk',
  '/cerez-politikasi',
  '/iade-iptal',
  
  // Şehir transfer sayfaları
  '/antalya-transfer',
  '/lara-transfer', 
  '/kas-transfer',
  '/kalkan-transfer',
  '/manavgat-transfer',
  '/serik-transfer',
  '/kemer-transfer',
  '/belek-transfer',
  '/alanya-transfer',
  '/side-transfer',
  
  // Hizmet sayfaları
  '/hizmetler/havaalani-transfer',
  '/hizmetler/vip-transfer',
  '/hizmetler/grup-transfer',
  '/hizmetler/otel-transfer',
  '/hizmetler/sehir-ici-transfer',
  '/hizmetler/dugun-transfer',
  '/hizmetler/kurumsal-transfer',
  '/hizmetler/karsilama-hizmeti',
  
  // Blog sayfaları
  '/blog'
];

async function prerender() {
  console.log('🚀 Starting pre-rendering with Puppeteer...');
  
  // Use live domain by default
  const baseUrl = process.env.PRERENDER_URL || 'https://www.gatetransfer.com';
  console.log(`🌐 Using base URL: ${baseUrl}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  });

  const page = await browser.newPage();
  
  // Increase timeout to 60 seconds
  page.setDefaultTimeout(60000);
  
  // Set user agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
  
  for (const route of routes) {
    try {
      console.log(`📄 Pre-rendering: ${route}`);
      
      const url = `${baseUrl}${route}`;
      console.log(`🌐 Navigating to: ${url}`);
      
      // Navigate to the route
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      
      // Wait for React app to mount and render
      console.log('⏳ Waiting for React app to load...');
      await page.waitForSelector('#root', { timeout: 30000 });
      
      // Wait for content to fully load
      await page.waitForTimeout(5000);
      
      // Check if React content is actually rendered
      const hasContent = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root && root.children.length > 0;
      });
      
      if (!hasContent) {
        console.log('⚠️ React content not found, trying fallback method...');
        // Try to wait for hidden SEO content
        await page.waitForSelector('#seo-content', { timeout: 10000 });
      }
      
      // Get the full HTML
      const html = await page.content();
      
      // Create directory structure
      const filePath = route === '/' 
        ? path.join('dist', 'index.html')
        : path.join('dist', route.slice(1), 'index.html');
        
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Save the pre-rendered HTML
      fs.writeFileSync(filePath, html);
      console.log(`✅ Saved: ${filePath}`);
      
    } catch (error) {
      console.error(`❌ Error pre-rendering ${route}:`, error.message);
      // Continue with next route instead of failing completely
      continue;
    }
  }
  
  await browser.close();
  console.log('🎉 Pre-rendering completed!');
}

// Check if we need to start a local server first
async function main() {
  try {
    console.log('🚀 Starting prerender directly with live site...');
    await prerender();
  } catch (error) {
    console.error('❌ Prerender failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
