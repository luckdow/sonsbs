import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const routes = [
  '/',
  '/rezervasyon',
  '/hakkimizda', 
  '/iletisim',
  '/hizmetlerimiz',
  '/kemer-transfer',
  '/side-transfer',
  '/belek-transfer',
  '/alanya-transfer',
  '/antalya-transfer',
  '/kas-transfer',
  '/kalkan-transfer',
  '/lara-transfer',
  '/manavgat-transfer',
  '/serik-transfer'
];

async function prerender() {
  console.log('🚀 Starting pre-rendering with Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Increase timeout
  page.setDefaultTimeout(30000);
  
  for (const route of routes) {
    try {
      console.log(`📄 Pre-rendering: ${route}`);
      
      // Navigate to the route
      await page.goto(`http://localhost:4173${route}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for React to render
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
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
    }
  }
  
  await browser.close();
  console.log('🎉 Pre-rendering completed!');
}

// Check if we need to start a local server first
async function main() {
  try {
    // Test if local server is running
    const response = await fetch('http://localhost:4173');
    if (response.ok) {
      await prerender();
    } else {
      throw new Error('Server not running');
    }
  } catch (error) {
    console.log('📡 Starting local preview server...');
    const { spawn } = await import('child_process');
    
    const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
      stdio: 'pipe'
    });
    
    // Wait for server to start
    setTimeout(async () => {
      await prerender();
      server.kill();
    }, 5000);
  }
}

main().catch(console.error);
