#!/usr/bin/env node

/**
 * Simple Prerender Script for Vite React App
 * This script generates static HTML files for SEO
 */

import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to prerender
const routes = [
  // Ana sayfa
  '/',
  
  // Statik sayfalar
  '/hakkimizda',
  '/iletisim', 
  '/hizmetlerimiz',
  '/sss',
  '/gizlilik-politikasi',
  '/kullanim-sartlari',
  '/kvkk',
  '/cerez-politikasi',
  '/iade-iptal',
  
  // Şehir sayfaları
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
  
  // Hizmet sayfaları
  '/hizmetler/havaalani-transfer',
  '/hizmetler/vip-transfer',
  '/hizmetler/grup-transfer',
  '/hizmetler/otel-transfer',
  '/hizmetler/sehir-ici-transfer',
  '/hizmetler/dugun-transfer',
  '/hizmetler/kurumsal-transfer',
  '/hizmetler/karsilama-hizmeti',
  
  // Blog ana sayfası
  '/blog'
];

const distDir = path.resolve(__dirname, '../dist');

async function prerender() {
  console.log('🚀 Starting prerender process...');
  
  // Launch preview server
  console.log('📦 Starting preview server...');
  const server = await createServer({
    root: path.resolve(__dirname, '..'),
    server: {
      middlewareMode: true
    }
  });
  
  await server.listen(5000);
  console.log('✅ Preview server started on http://localhost:5000');
  
  // Launch Puppeteer
  console.log('🔍 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  const page = await browser.newPage();
  
  // Prerender each route
  for (const route of routes) {
    try {
      console.log(`📄 Prerendering: ${route}`);
      
      // Navigate to route
      await page.goto(`http://localhost:5000${route}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for React to render
      await page.waitForSelector('#root', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Get the rendered HTML
      const html = await page.content();
      
      // Create directory structure
      const routePath = route === '/' ? '/index' : route;
      const dirPath = path.join(distDir, routePath);
      
      if (routePath !== '/index') {
        await fs.mkdir(dirPath, { recursive: true });
      }
      
      const filePath = routePath === '/index' 
        ? path.join(distDir, 'index.html')
        : path.join(dirPath, 'index.html');
      
      // Write HTML file
      await fs.writeFile(filePath, html, 'utf8');
      console.log(`✅ Generated: ${filePath}`);
      
    } catch (error) {
      console.error(`❌ Error prerendering ${route}:`, error.message);
    }
  }
  
  await browser.close();
  await server.close();
  
  console.log('🎉 Prerender process completed!');
}

// Run prerender
prerender().catch(console.error);
