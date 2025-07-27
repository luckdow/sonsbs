// Enhanced Sitemap generator utility
import { cityData } from '../data/cityData';
import { blogData } from '../data/blogData';

// Static pages configuration
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/hakkimizda', priority: 0.8, changefreq: 'monthly' },
  { url: '/iletisim', priority: 0.8, changefreq: 'monthly' },
  { url: '/hizmetlerimiz', priority: 0.9, changefreq: 'weekly' },
  { url: '/sss', priority: 0.7, changefreq: 'monthly' },
  { url: '/gizlilik-politikasi', priority: 0.5, changefreq: 'yearly' },
  { url: '/kullanim-sartlari', priority: 0.5, changefreq: 'yearly' },
  { url: '/kvkk', priority: 0.5, changefreq: 'yearly' },
  { url: '/cerez-politikasi', priority: 0.5, changefreq: 'yearly' },
  { url: '/iade-iptal', priority: 0.5, changefreq: 'yearly' }
];

// Service pages configuration
const servicePages = [
  { url: '/havaalani-transfer', priority: 0.9, changefreq: 'weekly' },
  { url: '/vip-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/grup-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/otel-transfer', priority: 0.8, changefreq: 'weekly' },
  { url: '/sehir-ici-transfer', priority: 0.7, changefreq: 'weekly' },
  { url: '/dugun-transfer', priority: 0.7, changefreq: 'weekly' },
  { url: '/kurumsal-transfer', priority: 0.7, changefreq: 'weekly' },
  { url: '/karsilama-hizmeti', priority: 0.7, changefreq: 'weekly' }
];

export const generateSitemap = (pages) => {
  const baseUrl = 'https://gatetransfer.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = pages.map(page => {
    const priority = getPriority(page.path);
    const changefreq = getChangeFreq(page.type);
    
    return `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

const getPriority = (path) => {
  if (path === '/') return '1.0';
  if (path.includes('/rezervasyon') || path.includes('/iletisim')) return '0.9';
  if (path.includes('/hizmetlerimiz') || path.includes('transfer')) return '0.8';
  if (path.includes('/blog/')) return '0.6';
  if (path.includes('/sss') || path.includes('/hakkimizda')) return '0.5';
  return '0.4';
};

const getChangeFreq = (type) => {
  switch (type) {
    case 'homepage': return 'daily';
    case 'service': return 'weekly';
    case 'city': return 'weekly';
    case 'blog': return 'monthly';
    case 'static': return 'monthly';
    default: return 'monthly';
  }
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

# Block development files
Disallow: /*.json$
Disallow: /src/
Disallow: /node_modules/

# Block duplicate content
Disallow: /*?*
Disallow: /*#

# Allow specific important pages
Allow: /rezervasyon
Allow: /iletisim
Allow: /hizmetlerimiz
Allow: /*transfer*

# Sitemap location
Sitemap: https://gatetransfer.com/sitemap.xml

# Crawl delay (be nice to servers)
Crawl-delay: 1`;
};

// Generate pages list for sitemap
export const getSitemapPages = () => {
  return [
    // Homepage
    { path: '/', type: 'homepage', lastmod: new Date().toISOString().split('T')[0] },
    
    // Static pages
    { path: '/hakkimizda', type: 'static' },
    { path: '/iletisim', type: 'static' },
    { path: '/hizmetlerimiz', type: 'static' },
    { path: '/sss', type: 'static' },
    { path: '/gizlilik-politikasi', type: 'static' },
    { path: '/kullanim-sartlari', type: 'static' },
    { path: '/kvkk', type: 'static' },
    { path: '/cerez-politikasi', type: 'static' },
    { path: '/iade-iptal', type: 'static' },
    
    // Service pages
    { path: '/havaalani-transfer', type: 'service' },
    { path: '/vip-transfer', type: 'service' },
    { path: '/grup-transfer', type: 'service' },
    { path: '/otel-transfer', type: 'service' },
    { path: '/sehir-ici-transfer', type: 'service' },
    { path: '/dugun-transfer', type: 'service' },
    { path: '/kurumsal-transfer', type: 'service' },
    { path: '/karsilama-hizmeti', type: 'service' },
    
    // City pages
    { path: '/antalya-transfer', type: 'city' },
    { path: '/lara-transfer', type: 'city' },
    { path: '/kas-transfer', type: 'city' },
    { path: '/kalkan-transfer', type: 'city' },
    { path: '/manavgat-transfer', type: 'city' },
    { path: '/serik-transfer', type: 'city' },
    { path: '/kemer-transfer', type: 'city' },
    { path: '/belek-transfer', type: 'city' },
    { path: '/alanya-transfer', type: 'city' },
    { path: '/side-transfer', type: 'city' },
    
    // Main sections
    { path: '/rezervasyon', type: 'service' },
    { path: '/blog', type: 'blog' }
  ];
};
