import { SEO_CONFIG, SITEMAP_CONFIG } from '../config/seoConfig.js';

// Ana Sitemap Generator
export const generateSitemap = (pages) => {
  const urls = pages.map(page => generateUrlEntry(page));
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('')}</urlset>`;
};

// URL Entry Generator
const generateUrlEntry = (page) => {
  const {
    url,
    lastmod = new Date().toISOString().split('T')[0],
    changefreq = 'monthly',
    priority = 0.5,
    images = []
  } = page;

  const fullUrl = `${SEO_CONFIG.siteUrl}${url}`;
  const imageXml = images.length > 0 ? generateImageXml(images) : '';

  return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>
`;
};

// Image XML Generator
const generateImageXml = (images) => {
  return images.map(image => `
    <image:image>
      <image:loc>${image.url.startsWith('http') ? image.url : SEO_CONFIG.siteUrl + image.url}</image:loc>
      <image:title>${image.title || 'GATE Transfer'}</image:title>
      <image:caption>${image.caption || image.title || 'Transfer hizmeti görseli'}</image:caption>
    </image:image>`).join('');
};

// Şehir Sayfaları için Sitemap Entries
export const generateCitySitemapEntries = (cities) => {
  return cities.map(city => ({
    url: `/${city.slug}`,
    lastmod: city.lastmod || new Date().toISOString().split('T')[0],
    changefreq: SITEMAP_CONFIG.changefreq.cities,
    priority: SITEMAP_CONFIG.priorities.cities,
    images: city.images || [{
      url: `/images/cities/${city.slug}.jpg`,
      title: `${city.name} Transfer - GATE Transfer`,
      caption: `Antalya Havalimanından ${city.name} transfer hizmeti`
    }]
  }));
};

// Hizmet Sayfaları için Sitemap Entries
export const generateServiceSitemapEntries = (services) => {
  return services.map(service => ({
    url: `/hizmetler/${service.slug}`,
    lastmod: service.lastmod || new Date().toISOString().split('T')[0],
    changefreq: SITEMAP_CONFIG.changefreq.services,
    priority: service.isMain ? SITEMAP_CONFIG.priorities.mainServices : SITEMAP_CONFIG.priorities.subServices,
    images: service.images || [{
      url: `/images/services/${service.slug}.jpg`,
      title: `${service.name} - GATE Transfer`,
      caption: `${service.name} hizmeti görseli`
    }]
  }));
};

// Blog Sayfaları için Sitemap Entries  
export const generateBlogSitemapEntries = (blogPosts) => {
  return blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    lastmod: post.modifiedDate || post.publishDate,
    changefreq: SITEMAP_CONFIG.changefreq.blog,
    priority: SITEMAP_CONFIG.priorities.blog,
    images: post.featuredImage ? [{
      url: post.featuredImage,
      title: post.title,
      caption: post.excerpt
    }] : []
  }));
};

// Statik Sayfalar için Sitemap Entries
export const generateStaticSitemapEntries = () => {
  const staticPages = [
    { url: '/', priority: SITEMAP_CONFIG.priorities.home, changefreq: SITEMAP_CONFIG.changefreq.home },
    { url: '/rezervasyon', priority: 0.9, changefreq: 'weekly' },
    { url: '/iletisim', priority: 0.8, changefreq: 'monthly' },
    { url: '/hakkimizda', priority: 0.7, changefreq: 'monthly' },
    { url: '/gizlilik-politikasi', priority: 0.3, changefreq: 'yearly' },
    { url: '/kullanim-kosullari', priority: 0.3, changefreq: 'yearly' },
    { url: '/sikca-sorulan-sorular', priority: 0.6, changefreq: 'monthly' }
  ];

  return staticPages.map(page => ({
    ...page,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: page.changefreq || SITEMAP_CONFIG.changefreq.static,
    priority: page.priority || SITEMAP_CONFIG.priorities.static
  }));
};

// Otomatik Sitemap Builder
export const buildCompleteSitemap = async (dataSource) => {
  try {
    // Tüm sayfa tiplerini getir
    const cities = await dataSource.getCities();
    const services = await dataSource.getServices();
    const blogPosts = await dataSource.getBlogPosts();
    const staticPages = dataSource.getStaticPages ? await dataSource.getStaticPages() : [];
    
    // Sitemap entries oluştur
    const allPages = [
      ...(staticPages.length > 0 ? staticPages : generateStaticSitemapEntries()),
      ...generateCitySitemapEntries(cities),
      ...generateServiceSitemapEntries(services),
      ...generateBlogSitemapEntries(blogPosts)
    ];
    
    return generateSitemap(allPages);
  } catch (error) {
    console.error('Sitemap oluşturulurken hata:', error);
    return generateSitemap(generateStaticSitemapEntries());
  }
};

// Sitemap Index Generator (Büyük siteler için)
export const generateSitemapIndex = (sitemaps) => {
  const sitemapEntries = sitemaps.map(sitemap => `  <sitemap>
    <loc>${SEO_CONFIG.siteUrl}/${sitemap.filename}</loc>
    <lastmod>${sitemap.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
};
