#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yapılandırma
const config = {
  baseUrl: 'https://www.gatetransfer.com',
  lastmod: format(new Date(), 'yyyy-MM-dd'),
  languages: ['tr', 'en', 'de', 'ru'],
  defaultLang: 'tr',
};

// All routes that should be in sitemap
const routes = [
  // Ana sayfalar
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/rezervasyon', priority: 0.9, changefreq: 'weekly' },
  { url: '/hizmetlerimiz', priority: 0.8, changefreq: 'monthly' },
  { url: '/hakkimizda', priority: 0.7, changefreq: 'monthly' },
  { url: '/iletisim', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog', priority: 0.8, changefreq: 'weekly' },
  { url: '/sss', priority: 0.7, changefreq: 'monthly' },
  
  // Şehir sayfaları (en yüksek SEO önceliği)
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
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  routes.forEach(route => {
    sitemapXml += `  <url>
    <loc>${config.baseUrl}${route.url}</loc>
    <lastmod>${config.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>`;
    
    // Tüm sayfalar için hreflang etiketleri ekle
    if (route.priority >= 0.7) {
      // Ana dil TR (x-default olarak da kullanılır)
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="tr" href="${config.baseUrl}${route.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${config.baseUrl}${route.url}" />`;
      
      // Diğer diller
      if (route.url === '/') {
        sitemapXml += `
    <xhtml:link rel="alternate" hreflang="en" href="${config.baseUrl}/en" />
    <xhtml:link rel="alternate" hreflang="de" href="${config.baseUrl}/de" />
    <xhtml:link rel="alternate" hreflang="ru" href="${config.baseUrl}/ru" />`;
      } else {
        // Sayfa URL'sini diğer dillere çevir
        sitemapXml += `
    <xhtml:link rel="alternate" hreflang="en" href="${config.baseUrl}/en${route.url}" />`;
        
        // Almanca ve Rusça için sadece ana sayfalar
        if (route.url === '/hakkimizda' || route.url === '/iletisim' || route.url === '/rezervasyon') {
          const deUrl = route.url === '/hakkimizda' ? '/uber-uns' : 
                        route.url === '/iletisim' ? '/kontakt' :
                        '/buchung';
          const ruUrl = route.url === '/hakkimizda' ? '/o-nas' : 
                        route.url === '/iletisim' ? '/kontakty' :
                        '/bronirovaniye';
          
          sitemapXml += `
    <xhtml:link rel="alternate" hreflang="de" href="${config.baseUrl}/de${deUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${config.baseUrl}/ru${ruUrl}" />`;
        }
      }
    }
    
    // Şehir sayfaları için resim etiketleri ekle
    if (route.url.includes('-transfer')) {
      const cityName = route.url.replace('/', '').replace('-transfer', '');
      sitemapXml += `
    <image:image>
      <image:loc>${config.baseUrl}/images/${cityName}-transfer.jpg</image:loc>
      <image:title>${cityName.charAt(0).toUpperCase() + cityName.slice(1)} Transfer - GATE Transfer</image:title>
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

// Çoklu dil sitemap index oluştur
function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.baseUrl}/sitemap.xml</loc>
    <lastmod>${config.lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${config.baseUrl}/sitemap-multilingual.xml</loc>
    <lastmod>${config.lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Çoklu dil sitemap oluştur (hreflang etiketlerini izole et)
function generateMultilingualSitemap() {
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Sadece ana sayfa ve temel sayfalar için
  const mainRoutes = routes.filter(r => r.priority >= 0.7);
  
  mainRoutes.forEach(route => {
    sitemapXml += `  <url>
    <loc>${config.baseUrl}${route.url}</loc>
    <lastmod>${config.lastmod}</lastmod>`;
    
    // Ana dil TR (x-default olarak da kullanılır)
    sitemapXml += `
    <xhtml:link rel="alternate" hreflang="tr" href="${config.baseUrl}${route.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${config.baseUrl}${route.url}" />`;
    
    // İngilizce her sayfa için var
    if (route.url === '/') {
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="en" href="${config.baseUrl}/en" />`;
    } else {
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="en" href="${config.baseUrl}/en${route.url}" />`;
    }
    
    // Almanca ve Rusça için sadece ana sayfalar ve bazı temel sayfalar
    if (['/', '/hakkimizda', '/iletisim', '/rezervasyon'].includes(route.url)) {
      const deUrl = route.url === '/' ? '/de' :
                    route.url === '/hakkimizda' ? '/de/uber-uns' :
                    route.url === '/iletisim' ? '/de/kontakt' :
                    '/de/buchung';
                    
      const ruUrl = route.url === '/' ? '/ru' :
                    route.url === '/hakkimizda' ? '/ru/o-nas' :
                    route.url === '/iletisim' ? '/ru/kontakty' :
                    '/ru/bronirovaniye';
      
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="de" href="${config.baseUrl}${deUrl}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${config.baseUrl}${ruUrl}" />`;
    }
    
    sitemapXml += `
  </url>
`;
  });

  sitemapXml += `</urlset>`;
  
  return sitemapXml;
}

// Tüm sitemap dosyalarını oluştur ve kaydet
const mainSitemap = generateSitemap();
const multilingualSitemap = generateMultilingualSitemap();
const sitemapIndex = generateSitemapIndex();

// Ana sitemap
const mainSitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(mainSitemapPath, mainSitemap, 'utf8');

// Çoklu dil sitemap
const multilingualSitemapPath = path.join(__dirname, '../public/sitemap-multilingual.xml');
fs.writeFileSync(multilingualSitemapPath, multilingualSitemap, 'utf8');

// Sitemap index
const indexSitemapPath = path.join(__dirname, '../public/sitemap-index.xml');
fs.writeFileSync(indexSitemapPath, sitemapIndex, 'utf8');

console.log('✅ Tüm sitemap dosyaları başarıyla güncellendi!');
console.log(`📊 Ana sitemap URL sayısı: ${routes.length}`);
console.log(`📊 Çoklu dil sitemap URL sayısı: ${routes.filter(r => r.priority >= 0.7).length}`);
console.log(`📁 Kaydedilen dosyalar: 
  - ${mainSitemapPath}
  - ${multilingualSitemapPath}
  - ${indexSitemapPath}`);
