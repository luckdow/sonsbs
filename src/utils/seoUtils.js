import { APP_CONFIG } from '../config/constants';

// Tüm sayfa URL'lerini topla
const getAllPages = () => {
  const baseURL = APP_CONFIG.baseURL;
  
  const staticPages = [
    '',
    'hakkimizda',
    'iletisim', 
    'hizmetlerimiz',
    'sss',
    'gizlilik-politikasi',
    'kullanim-sartlari',
    'kvkk',
    'cerez-politikasi',
    'iade-iptal'
  ];

  const cityPages = [
    'antalya-transfer',
    'lara-transfer', 
    'kas-transfer',
    'kalkan-transfer',
    'manavgat-transfer',
    'serik-transfer',
    'kemer-transfer',
    'belek-transfer',
    'alanya-transfer',
    'side-transfer'
  ];

  const servicePages = [
    'havaalani-transfer',
    'vip-transfer',
    'grup-transfer', 
    'otel-transfer',
    'sehir-ici-transfer',
    'dugun-transfer',
    'kurumsal-transfer',
    'karsilama-hizmeti'
  ];

  const blogPages = [
    'blog',
    'blog/antalya-transfer-rehberi',
    'blog/kemer-transfer-otel-rehberi', 
    'blog/side-antik-kenti-transfer',
    'blog/belek-golf-transfer',
    'blog/alanya-transfer-ekonomik'
  ];

  // URL'leri oluştur
  const urls = [];

  // Ana sayfa ve statik sayfalar
  staticPages.forEach(page => {
    urls.push({
      url: `${baseURL}/${page}`,
      lastmod: new Date().toISOString(),
      changefreq: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? '1.0' : '0.8'
    });
  });

  // Şehir sayfaları
  cityPages.forEach(page => {
    urls.push({
      url: `${baseURL}/${page}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.9' // Şehir sayfaları yüksek öncelik
    });
  });

  // Hizmet sayfaları
  servicePages.forEach(page => {
    urls.push({
      url: `${baseURL}/${page}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly', 
      priority: '0.9' // Hizmet sayfaları yüksek öncelik
    });
  });

  // Blog sayfaları
  blogPages.forEach(page => {
    urls.push({
      url: `${baseURL}/${page}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  return urls;
};

// XML Sitemap oluştur
export const generateSitemap = () => {
  const urls = getAllPages();
  
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const xmlFooter = `</urlset>`;

  const urlEntries = urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `${xmlHeader}\n${urlEntries}\n${xmlFooter}`;
};

// Robots.txt oluştur
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${APP_CONFIG.baseURL}/sitemap.xml

# Block admin and internal pages
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dist/

# Allow important pages
Allow: /
Allow: /hakkimizda
Allow: /iletisim
Allow: /hizmetlerimiz
Allow: /*-transfer
Allow: /blog/

# Crawl delay (optional)
Crawl-delay: 1`;
};

// Schema.org LocalBusiness markup
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${APP_CONFIG.baseURL}#organization`,
    "name": APP_CONFIG.name,
    "description": "Antalya havalimanı transfer hizmetleri, VIP transfer, grup transfer ve otel transfer hizmetleri. 7/24 güvenli ve konforlu ulaşım çözümleri.",
    "url": APP_CONFIG.baseURL,
    "telephone": APP_CONFIG.supportPhone,
    "email": APP_CONFIG.supportEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Aksu", 
      "addressLocality": "Antalya",
      "addressRegion": "Antalya",
      "postalCode": "07112",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.8969",
      "longitude": "30.7133"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", 
          "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "serviceArea": {
      "@type": "Place",
      "name": "Antalya, Turkey"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Transfer Hizmetleri",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Havalimanı Transfer",
            "description": "Antalya havalimanından otellere güvenli transfer hizmeti"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "VIP Transfer",
            "description": "Lüks araçlarla özel transfer hizmeti"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Grup Transfer",
            "description": "Büyük gruplar için minibüs transfer hizmeti"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mehmet Yılmaz"
        },
        "datePublished": "2024-12-15",
        "reviewBody": "Çok güvenli ve konforlu bir transfer hizmeti. Şoförümüz çok kibar ve yardımseverdi.",
        "reviewRating": {
          "@type": "Rating",  
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person", 
          "name": "Ayşe Kaya"
        },
        "datePublished": "2024-12-10",
        "reviewBody": "Zamanında geldi, temiz araç. Fiyatı da çok uygun. Tavsiye ederim.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5", 
          "bestRating": "5"
        }
      }
    ]
  };
};

// Service schema markup
export const generateServiceSchema = (serviceName, serviceDescription, serviceUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": serviceDescription,
    "url": serviceUrl,
    "provider": {
      "@type": "LocalBusiness",
      "name": APP_CONFIG.name,
      "url": APP_CONFIG.baseURL
    },
    "areaServed": {
      "@type": "Place", 
      "name": "Antalya, Turkey"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": serviceName,
      "itemListElement": [
        {
          "@type": "Offer",
          "price": "Talep Üzerine",
          "priceCurrency": "TRY",
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString().split('T')[0]
        }
      ]
    }
  };
};

// Generate BreadcrumbList Schema for SEO
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};
