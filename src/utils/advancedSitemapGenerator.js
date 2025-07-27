// Advanced Sitemap Generator for GATE Transfer
import { advancedSeoKeywords, pageKeywordMapping } from '../data/advancedSeoKeywords.js';

// Main sitemap configuration
export const sitemapConfig = {
  domain: 'https://gatetransfer.com',
  languages: ['tr', 'en', 'de', 'ru'],
  defaultLanguage: 'tr',
  lastmod: new Date().toISOString().split('T')[0],
  
  // Page priorities and change frequencies
  pageConfig: {
    homepage: { priority: 1.0, changefreq: 'weekly' },
    city: { priority: 0.9, changefreq: 'weekly' },
    service: { priority: 0.8, changefreq: 'weekly' },
    blog: { priority: 0.7, changefreq: 'weekly' },
    blogPost: { priority: 0.6, changefreq: 'monthly' },
    static: { priority: 0.5, changefreq: 'monthly' }
  }
};

// All site pages for sitemap
export const sitePages = {
  // Static pages
  static: [
    { url: '/', type: 'homepage' },
    { url: '/hakkimizda', type: 'static' },
    { url: '/iletisim', type: 'static' },
    { url: '/hizmetler', type: 'static' },
    { url: '/sss', type: 'static' },
    { url: '/gizlilik-politikasi', type: 'static' },
    { url: '/kullanim-sartlari', type: 'static' },
    { url: '/kvkk', type: 'static' },
    { url: '/cerez-politikasi', type: 'static' },
    { url: '/iade-iptal', type: 'static' },
    { url: '/rezervasyon', type: 'static', priority: 0.9 },
    { url: '/fiyat', type: 'static', priority: 0.8 }
  ],

  // City pages
  cities: [
    { url: '/antalya-transfer', name: 'Antalya', type: 'city', keywords: pageKeywordMapping.antalya },
    { url: '/kemer-transfer', name: 'Kemer', type: 'city', keywords: pageKeywordMapping.kemer },
    { url: '/side-transfer', name: 'Side', type: 'city', keywords: pageKeywordMapping.side },
    { url: '/belek-transfer', name: 'Belek', type: 'city', keywords: pageKeywordMapping.belek },
    { url: '/alanya-transfer', name: 'Alanya', type: 'city', keywords: pageKeywordMapping.alanya },
    { url: '/lara-transfer', name: 'Lara', type: 'city' },
    { url: '/kas-transfer', name: 'Kaş', type: 'city' },
    { url: '/kalkan-transfer', name: 'Kalkan', type: 'city' },
    { url: '/manavgat-transfer', name: 'Manavgat', type: 'city' },
    { url: '/serik-transfer', name: 'Serik', type: 'city' }
  ],

  // Service pages
  services: [
    { url: '/havaalani-transfer', name: 'Havalimanı Transfer', type: 'service', keywords: pageKeywordMapping.airportTransfer },
    { url: '/vip-transfer', name: 'VIP Transfer', type: 'service', keywords: pageKeywordMapping.vipTransfer },
    { url: '/grup-transfer', name: 'Grup Transfer', type: 'service', keywords: pageKeywordMapping.groupTransfer },
    { url: '/otel-transfer', name: 'Otel Transfer', type: 'service' },
    { url: '/sehir-ici-transfer', name: 'Şehir İçi Transfer', type: 'service' },
    { url: '/dugun-transfer', name: 'Düğün Transfer', type: 'service' },
    { url: '/kurumsal-transfer', name: 'Kurumsal Transfer', type: 'service' },
    { url: '/karsilama-hizmeti', name: 'Karşılama Hizmeti', type: 'service' }
  ],

  // Blog pages
  blog: [
    { url: '/blog', name: 'Blog Ana Sayfa', type: 'blog' },
    { url: '/blog/kategori/transfer-rehberi', name: 'Transfer Rehberi', type: 'blog' },
    { url: '/blog/kategori/destinasyon-rehberi', name: 'Destinasyon Rehberi', type: 'blog' },
    { url: '/blog/kategori/golf-turizmi', name: 'Golf Turizmi', type: 'blog' },
    
    // Blog posts
    { url: '/blog/antalya-transfer-rehberi', name: 'Antalya Transfer Rehberi', type: 'blogPost', publishDate: '2025-07-27' },
    { url: '/blog/kemer-transfer-otel-rehberi', name: 'Kemer Transfer ve Otel Rehberi', type: 'blogPost', publishDate: '2025-07-27' },
    { url: '/blog/side-antik-kenti-transfer-rehberi', name: 'Side Antik Kenti Transfer Rehberi', type: 'blogPost', publishDate: '2025-07-27' },
    { url: '/blog/belek-golf-transfer-rehberi', name: 'Belek Golf Transfer Rehberi', type: 'blogPost', publishDate: '2025-07-27' },
    { url: '/blog/alanya-transfer-ekonomik-rehber', name: 'Alanya Transfer Ekonomik Rehber', type: 'blogPost', publishDate: '2025-07-27' }
  ]
};

// Generate XML sitemap
export const generateAdvancedSitemap = () => {
  const { domain, lastmod, pageConfig } = sitemapConfig;
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Combine all pages
  const allPages = [
    ...sitePages.static,
    ...sitePages.cities,
    ...sitePages.services,
    ...sitePages.blog
  ];

  // Generate URLs for each page
  allPages.forEach(page => {
    const config = pageConfig[page.type] || pageConfig.static;
    const priority = page.priority || config.priority;
    const changefreq = page.changefreq || config.changefreq;
    
    sitemap += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

    // Add hreflang for multi-language pages
    if (page.type !== 'blogPost') {
      sitemapConfig.languages.forEach(lang => {
        const langUrl = lang === 'tr' ? page.url : `/${lang}${page.url}`;
        sitemap += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${domain}${langUrl}" />`;
      });
    }

    // Add images for city and service pages
    if (page.type === 'city' || page.type === 'service') {
      sitemap += `
    <image:image>
      <image:loc>${domain}/images/${page.url.replace('/', '').replace('-', '_')}.jpg</image:loc>
      <image:title>${page.name} - GATE Transfer</image:title>
      <image:caption>Profesyonel ${page.name} transfer hizmeti</image:caption>
    </image:image>`;
    }

    sitemap += `
  </url>
`;
  });

  sitemap += `</urlset>`;
  return sitemap;
};

// Generate robots.txt
export const generateAdvancedRobotsTxt = () => {
  const { domain } = sitemapConfig;
  
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /node_modules/
Disallow: /src/
Disallow: /dist/
Disallow: /temp/
Disallow: /tmp/
Disallow: /*.json$
Disallow: /*.config.*$

# Allow specific important files
Allow: /images/
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /manifest.json
Allow: /firebase-messaging-sw.js
Allow: /sw-enhanced.js

# Google specific directives
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bing specific directives  
User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Yandex specific directives
User-agent: YandexBot
Allow: /
Crawl-delay: 3

# Sitemap location
Sitemap: ${domain}/sitemap.xml

# Preferred domain
Host: ${domain.replace('https://', '')}`;
};

// SEO analysis for pages
export const analyzePage = (pageUrl, content) => {
  const page = [...sitePages.static, ...sitePages.cities, ...sitePages.services]
    .find(p => p.url === pageUrl);
  
  if (!page) return null;

  const keywords = page.keywords ? 
    [...page.keywords.primary, ...page.keywords.secondary, ...page.keywords.longTail] : 
    [];

  return {
    url: pageUrl,
    type: page.type,
    name: page.name,
    keywords,
    analysis: analyzeContent(content, keywords),
    recommendations: generateRecommendations(content, keywords, page.type)
  };
};

// Content analysis helper
const analyzeContent = (content, keywords) => {
  const wordCount = content.split(/\s+/).length;
  const headings = (content.match(/<h[1-6]/g) || []).length;
  const images = (content.match(/<img/g) || []).length;
  const links = (content.match(/<a href/g) || []).length;
  
  const keywordAnalysis = keywords.map(keyword => {
    const occurrences = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const density = ((occurrences / wordCount) * 100).toFixed(2);
    
    return {
      keyword,
      occurrences,
      density: parseFloat(density),
      status: density >= 0.5 && density <= 2.5 ? 'optimal' : 
              density < 0.5 ? 'low' : 'high'
    };
  });

  return {
    wordCount,
    headings,
    images,
    links,
    keywordAnalysis,
    readabilityScore: calculateReadability(content)
  };
};

// Simple readability calculator
const calculateReadability = (text) => {
  const sentences = text.split(/[.!?]+/).length - 1;
  const words = text.split(/\s+/).length;
  const syllables = words * 1.5; // Approximation
  
  if (sentences === 0 || words === 0) return 0;
  
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  return Math.max(0, Math.min(100, score));
};

// Generate SEO recommendations
const generateRecommendations = (content, keywords, pageType) => {
  const recommendations = [];
  const analysis = analyzeContent(content, keywords);
  
  // Word count recommendations
  if (analysis.wordCount < 300) {
    recommendations.push({
      type: 'content',
      priority: 'high',
      message: 'İçerik çok kısa. En az 300 kelime olmalı.',
      action: 'Daha detaylı bilgi ekleyin'
    });
  }
  
  // Heading recommendations
  if (analysis.headings < 2) {
    recommendations.push({
      type: 'structure',
      priority: 'medium',
      message: 'Başlık sayısı az. H1, H2, H3 başlıkları ekleyin.',
      action: 'Başlık yapısını iyileştirin'
    });
  }
  
  // Keyword recommendations
  const lowKeywords = analysis.keywordAnalysis.filter(k => k.status === 'low');
  if (lowKeywords.length > 0) {
    recommendations.push({
      type: 'keywords',
      priority: 'high',
      message: `Bu anahtar kelimeleri daha fazla kullanın: ${lowKeywords.map(k => k.keyword).join(', ')}`,
      action: 'Anahtar kelime yoğunluğunu artırın'
    });
  }
  
  // Readability recommendations
  if (analysis.readabilityScore < 60) {
    recommendations.push({
      type: 'readability',
      priority: 'medium',
      message: 'Metin okunabilirliği düşük.',
      action: 'Cümleleri kısaltın ve basit kelimeler kullanın'
    });
  }
  
  // Page-specific recommendations
  if (pageType === 'city') {
    recommendations.push({
      type: 'local-seo',
      priority: 'high',
      message: 'Yerel SEO için şehir adını ve yakın lokasyonları vurgulayın.',
      action: 'Yerel işletme bilgilerini ekleyin'
    });
  }
  
  return recommendations;
};

export default {
  generateAdvancedSitemap,
  generateAdvancedRobotsTxt,
  analyzePage,
  sitePages,
  sitemapConfig
};
