// SEO Configuration - Ana Ayarlar
export const SEO_CONFIG = {
  // Site Temel Bilgileri
  siteName: 'GATE Transfer',
  siteUrl: 'https://www.gatetransfer.com',
  defaultTitle: 'GATE Transfer - Antalya Havalimanı Transfer ve Ulaşım Hizmetleri',
  defaultDescription: 'Antalya havalimanından tüm bölgelere güvenli, konforlu ve ekonomik transfer hizmeti. 7/24 destek, TURSAB lisanslı, ücretsiz iptal imkanı.',
  defaultKeywords: 'antalya transfer, havalimanı transfer, antalya airport transfer, gate transfer, taxi antalya',
  
  // Şirket Bilgileri
  company: {
    name: 'SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi',
    alternateName: ['SBS Turkey Transfer', 'SBS Transfer', 'Gate Transfer'],
    phone: '+905325742682',
    email: 'sbstravel@gmail.com',
    address: {
      streetAddress: 'Güzelyurt Mahallesi Serik Caddesi No: 138/2',
      addressLocality: 'Aksu',
      addressRegion: 'Antalya', 
      postalCode: '07112',
      addressCountry: 'TR'
    },
    geo: {
      latitude: 36.8841,
      longitude: 30.7056
    }
  },

  // Sosyal Medya
  social: {
    facebook: 'https://facebook.com/gatetransfer',
    instagram: 'https://instagram.com/gatetransfer',
    twitter: 'https://twitter.com/gatetransfer',
    youtube: 'https://youtube.com/@gatetransfer'
  },

  // Dil ve Lokalizasyon
  languages: {
    default: 'tr',
    supported: ['tr', 'en', 'de', 'ru', 'ar']
  },

  // Meta Tag Ayarları
  meta: {
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    googlebot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'GATE Transfer',
    publisher: 'SBS Turkey Transfer'
  },

  // Open Graph Varsayılanları
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'GATE Transfer',
    imageWidth: 1200,
    imageHeight: 630,
    defaultImage: '/images/og-default.jpg'
  },

  // Twitter Card Ayarları
  twitter: {
    card: 'summary_large_image',
    site: '@gatetransfer',
    creator: '@gatetransfer'
  },

  // JSON-LD Schema Ayarları
  schema: {
    organizationType: 'LocalBusiness',
    businessType: 'TaxiService',
    priceRange: '€€',
    currenciesAccepted: ['TRY', 'EUR', 'USD'],
    paymentAccepted: ['Cash', 'Credit Card', 'Online Payment']
  }
};

// Sayfa Tipleri için SEO Şablonları
export const PAGE_SEO_TEMPLATES = {
  home: {
    titleTemplate: '%s - Antalya Havalimanı Transfer ve Ulaşım',
    descriptionTemplate: 'Antalya havalimanından %s güvenli transfer hizmeti. 7/24 destek, TURSAB lisanslı şirket.',
    keywordsTemplate: 'antalya transfer, %s transfer, havalimanı ulaşım'
  },
  
  city: {
    titleTemplate: '%s Transfer | Antalya Havalimanı - GATE Transfer',
    descriptionTemplate: 'Antalya Havalimanından %s bölgesine güvenli, konforlu transfer. Online rezervasyon, 7/24 destek, ücretsiz iptal.',
    keywordsTemplate: '%s transfer, antalya %s ulaşım, %s taxi, havalimanı %s'
  },
  
  service: {
    titleTemplate: '%s | GATE Transfer - Profesyonel Ulaşım Hizmeti',
    descriptionTemplate: '%s hizmeti ile güvenli ve konforlu yolculuk. Profesyonel şoförler, modern araçlar, 7/24 destek.',
    keywordsTemplate: '%s, antalya %s, transfer hizmeti'
  },
  
  blog: {
    titleTemplate: '%s | GATE Transfer Blog',
    descriptionTemplate: '%s hakkında detaylı bilgiler ve ipuçları. Transfer ve seyahat rehberi.',
    keywordsTemplate: '%s, antalya seyahat, transfer rehberi'
  }
};

// Priorite ve Changefreq Ayarları
export const SITEMAP_CONFIG = {
  priorities: {
    home: 1.0,
    mainServices: 0.9,
    cities: 0.8,
    subServices: 0.7,
    blog: 0.6,
    static: 0.5
  },
  
  changefreq: {
    home: 'weekly',
    services: 'monthly', 
    cities: 'monthly',
    blog: 'weekly',
    static: 'yearly'
  }
};
