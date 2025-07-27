// Multilingual Sitemap Generator for GATE Transfer
import { multilingualKeywords, languageUrlStructures, hreflangMapping } from '../data/multilingualSeoKeywords';

// Available languages
const LANGUAGES = ['tr', 'en', 'de', 'ru', 'ar'];
const BASE_URL = 'https://gatetransfer.com';

// Get all cities from the keyword data
const getCities = () => {
  return Object.keys(multilingualKeywords.tr.cities);
};

// Get all services from the keyword data
const getServices = () => {
  return Object.keys(multilingualKeywords.tr.services);
};

// Generate multilingual URLs for a given path
const generateMultilingualUrls = (basePath) => {
  return LANGUAGES.map(lang => {
    const langPrefix = languageUrlStructures[lang];
    return {
      language: lang,
      hreflang: hreflangMapping[lang],
      url: `${BASE_URL}${langPrefix}${basePath}`
    };
  });
};

// Generate XML sitemap entry with multilingual support
const generateSitemapEntry = (basePath, changefreq = 'weekly', priority = '0.8', lastmod = null) => {
  const multilingualUrls = generateMultilingualUrls(basePath);
  const mainUrl = multilingualUrls.find(url => url.language === 'tr'); // Turkish as default
  
  const lastModDate = lastmod || new Date().toISOString().split('T')[0];
  
  let entry = `  <url>
    <loc>${mainUrl.url}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

  // Add hreflang alternates
  multilingualUrls.forEach(urlData => {
    entry += `
    <xhtml:link rel="alternate" hreflang="${urlData.hreflang}" href="${urlData.url}" />`;
  });

  entry += `
  </url>`;

  return entry;
};

// Generate complete multilingual sitemap
export const generateMultilingualSitemap = () => {
  const cities = getCities();
  const services = getServices();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Homepage
  sitemap += generateSitemapEntry('/', 'daily', '1.0');

  // City pages
  cities.forEach(city => {
    sitemap += generateSitemapEntry(`/${city}`, 'weekly', '0.9');
    sitemap += generateSitemapEntry(`/${city}/transfer`, 'weekly', '0.8');
    sitemap += generateSitemapEntry(`/${city}/hotels`, 'weekly', '0.7');
    sitemap += generateSitemapEntry(`/${city}/attractions`, 'weekly', '0.6');
  });

  // Service pages
  services.forEach(service => {
    sitemap += generateSitemapEntry(`/services/${service}`, 'weekly', '0.8');
  });

  // Static pages
  const staticPages = [
    { path: '/about', priority: '0.7' },
    { path: '/contact', priority: '0.7' },
    { path: '/booking', priority: '0.9' },
    { path: '/pricing', priority: '0.8' },
    { path: '/fleet', priority: '0.6' },
    { path: '/faq', priority: '0.6' },
    { path: '/terms', priority: '0.4' },
    { path: '/privacy', priority: '0.4' }
  ];

  staticPages.forEach(page => {
    sitemap += generateSitemapEntry(page.path, 'monthly', page.priority);
  });

  // Blog pages (if any)
  const blogPosts = [
    'antalya-transfer-rehberi',
    'belek-golf-transfer',
    'kemer-transfer-otel-rehberi',
    'side-antik-kenti-transfer',
    'alanya-transfer-ekonomik'
  ];

  blogPosts.forEach(post => {
    sitemap += generateSitemapEntry(`/blog/${post}`, 'monthly', '0.6');
  });

  // Combination pages (city + service)
  cities.forEach(city => {
    services.forEach(service => {
      sitemap += generateSitemapEntry(`/${city}/${service}`, 'weekly', '0.7');
    });
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate language-specific sitemap index
export const generateSitemapIndex = () => {
  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Main multilingual sitemap
  sitemapIndex += `
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;

  // Language-specific sitemaps
  LANGUAGES.forEach(lang => {
    const langPrefix = languageUrlStructures[lang];
    sitemapIndex += `
  <sitemap>
    <loc>${BASE_URL}${langPrefix}/sitemap-${lang}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  });

  // Image sitemap
  sitemapIndex += `
  <sitemap>
    <loc>${BASE_URL}/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;

  sitemapIndex += `
</sitemapindex>`;

  return sitemapIndex;
};

// Generate language-specific sitemap
export const generateLanguageSpecificSitemap = (language) => {
  const cities = getCities();
  const services = getServices();
  const langPrefix = languageUrlStructures[language];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Homepage for this language
  sitemap += `
  <url>
    <loc>${BASE_URL}${langPrefix}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // City pages for this language
  cities.forEach(city => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${langPrefix}/${city}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Service pages for this language
  services.forEach(service => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${langPrefix}/services/${service}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate image sitemap
export const generateImageSitemap = () => {
  const cities = getCities();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Homepage images
  sitemap += `
  <url>
    <loc>${BASE_URL}/</loc>
    <image:image>
      <image:loc>${BASE_URL}/images/hero-antalya-transfer.jpg</image:loc>
      <image:title>Antalya Transfer Services</image:title>
      <image:caption>Professional transfer services in Antalya</image:caption>
    </image:image>
  </url>`;

  // City page images
  cities.forEach(city => {
    sitemap += `
  <url>
    <loc>${BASE_URL}/${city}</loc>
    <image:image>
      <image:loc>${BASE_URL}/images/${city}-transfer.jpg</image:loc>
      <image:title>${city.charAt(0).toUpperCase() + city.slice(1)} Transfer</image:title>
      <image:caption>Transfer services to ${city}</image:caption>
    </image:image>
  </url>`;
  });

  // Blog images
  const blogImages = [
    {
      url: '/blog/antalya-transfer-rehberi',
      image: '/images/blog/antalya-transfer-rehberi.svg',
      title: 'Antalya Transfer Rehberi',
      caption: 'Complete guide to Antalya transfers'
    },
    {
      url: '/blog/belek-golf-transfer',
      image: '/images/blog/belek-golf-transfer.svg',
      title: 'Belek Golf Transfer',
      caption: 'Golf transfer services in Belek'
    }
  ];

  blogImages.forEach(blog => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${blog.url}</loc>
    <image:image>
      <image:loc>${BASE_URL}${blog.image}</image:loc>
      <image:title>${blog.title}</image:title>
      <image:caption>${blog.caption}</image:caption>
    </image:image>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Export all functions
export default {
  generateMultilingualSitemap,
  generateSitemapIndex,
  generateLanguageSpecificSitemap,
  generateImageSitemap
};
