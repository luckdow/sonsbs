#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All routes that should be in sitemap
const routes = [
  // Main pages
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/rezervasyon', priority: 0.9, changefreq: 'weekly' },
  
  // City pages (highest SEO priority)
  { url: '/antalya-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/lara-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/kas-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/kalkan-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/manavgat-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/serik-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/kemer-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/belek-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/alanya-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/side-transfer', priority: 0.9, changefreq: 'weekly' },
  
  // Service pages
  { url: '/hizmetlerimiz', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/havaalani-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/vip-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/grup-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/otel-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/sehir-ici-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/dugun-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/kurumsal-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/hizmetler/karsilama-hizmeti', priority: 0.8, changefreq: 'weekly' },
  
  // Static/Info pages
  { url: '/hakkimizda', priority: 0.7, changefreq: 'monthly' },
  { url: '/iletisim', priority: 0.7, changefreq: 'monthly' },
  { url: '/sss', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog', priority: 0.6, changefreq: 'weekly' },
  
  // Legal pages
  { url: '/gizlilik-politikasi', priority: 0.5, changefreq: 'yearly' },
  { url: '/kullanim-sartlari', priority: 0.5, changefreq: 'yearly' },
  { url: '/kvkk', priority: 0.5, changefreq: 'yearly' },
  { url: '/cerez-politikasi', priority: 0.5, changefreq: 'yearly' },
  { url: '/iade-iptal', priority: 0.5, changefreq: 'yearly' },
];

const currentDate = new Date().toISOString().split('T')[0];

function generateSitemap() {
  const baseUrl = 'https://www.gatetransfer.com';
  
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  routes.forEach(route => {
    sitemapXml += `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>`;
    
    // Add hreflang tags for main pages
    if (route.priority >= 0.8) {
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="tr-TR" href="${baseUrl}${route.url}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/en${route.url === '/' ? '' : route.url}" />`;
    }
    
    // Add image tags for city pages
    if (route.url.includes('-transfer')) {
      const cityName = route.url.replace('/', '').replace('-transfer', '');
      sitemapXml += `
    <image:image>
      <image:loc>${baseUrl}/images/${cityName}_transfer.jpg</image:loc>
      <image:title>${cityName.charAt(0).toUpperCase() + cityName.slice(1)} Transfer - SBS Turkey Transfer</image:title>
      <image:caption>Profesyonel ${cityName} transfer hizmeti</image:caption>
    </image:image>`;
    }
    
    sitemapXml += `
  </url>
`;
  });

  sitemapXml += `</urlset>`;
  
  return sitemapXml;
}

// Generate and save sitemap
const sitemap = generateSitemap();
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ Sitemap updated successfully with all routes!');
console.log(`📊 Total URLs: ${routes.length}`);
console.log(`📁 Saved to: ${sitemapPath}`);
