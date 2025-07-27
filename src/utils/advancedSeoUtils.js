// Advanced SEO Utilities for GATE Transfer
import { seoData } from '../data/seoData.js';

// Keyword density analyzer
export const analyzeKeywordDensity = (content, keywords) => {
  const text = content.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  return keywords.map(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = (text.match(regex) || []).length;
    const density = (matches / wordCount) * 100;
    
    return {
      keyword,
      count: matches,
      density: density.toFixed(2),
      isOptimal: density >= 0.5 && density <= 2.5, // Optimal keyword density range
      recommendation: density < 0.5 ? 'Increase usage' : 
                     density > 2.5 ? 'Decrease usage' : 'Optimal'
    };
  });
};

// Generate SEO-optimized meta tags
export const generateAdvancedMetaTags = (pageData, language = 'tr') => {
  const langData = seoData[language];
  if (!langData) return {};

  return {
    // Basic meta tags
    title: pageData.title || langData.pages.homepage.title,
    description: pageData.description || langData.pages.homepage.description,
    keywords: pageData.keywords?.join(', ') || langData.pages.homepage.keywords.join(', '),
    
    // Open Graph tags
    'og:title': pageData.title || langData.pages.homepage.title,
    'og:description': pageData.description || langData.pages.homepage.description,
    'og:type': pageData.type || 'website',
    'og:url': `${langData.siteUrl}${pageData.url || '/'}`,
    'og:image': pageData.image || '/images/gate-transfer-og.jpg',
    'og:site_name': langData.siteName,
    'og:locale': language === 'tr' ? 'tr_TR' : 
                 language === 'en' ? 'en_US' :
                 language === 'de' ? 'de_DE' :
                 language === 'ru' ? 'ru_RU' : 'tr_TR',
    
    // Twitter Card tags
    'twitter:card': 'summary_large_image',
    'twitter:site': '@gatetransfer',
    'twitter:title': pageData.title || langData.pages.homepage.title,
    'twitter:description': pageData.description || langData.pages.homepage.description,
    'twitter:image': pageData.image || '/images/gate-transfer-twitter.jpg',
    
    // Additional SEO tags
    'robots': pageData.noindex ? 'noindex,nofollow' : 'index,follow',
    'canonical': `${langData.siteUrl}${pageData.url || '/'}`,
    'hreflang': generateHreflangTags(pageData.url),
    
    // Schema.org structured data
    'schema': generateSchemaMarkup(pageData, language)
  };
};

// Generate hreflang tags for multi-language support
export const generateHreflangTags = (currentUrl = '/') => {
  const languages = ['tr', 'en', 'de', 'ru'];
  const baseUrl = 'https://gatetransfer.com';
  
  return languages.map(lang => ({
    rel: 'alternate',
    hreflang: lang === 'tr' ? 'tr-TR' : 
              lang === 'en' ? 'en-US' :
              lang === 'de' ? 'de-DE' :
              lang === 'ru' ? 'ru-RU' : lang,
    href: `${baseUrl}${lang === 'tr' ? '' : `/${lang}`}${currentUrl}`
  }));
};

// Generate Schema.org markup
export const generateSchemaMarkup = (pageData, language = 'tr') => {
  const langData = seoData[language];
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "GATE Transfer",
    "description": langData.pages.homepage.description,
    "url": langData.siteUrl,
    "telephone": "+90 242 123 45 67",
    "email": "info@gatetransfer.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lara Caddesi No: 123",
      "addressLocality": "Muratpaşa",
      "addressRegion": "Antalya",
      "postalCode": "07230",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.8969",
      "longitude": "30.7133"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "36.8969",
        "longitude": "30.7133"
      },
      "geoRadius": "100000"
    }
  };

  // Add service-specific schema based on page type
  if (pageData.serviceType) {
    return {
      ...baseSchema,
      "@type": "TravelAgency",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Transfer Services",
        "itemListElement": generateServiceOffers(pageData.serviceType, language)
      }
    };
  }

  // Add city-specific schema for location pages
  if (pageData.cityName) {
    return {
      ...baseSchema,
      "areaServed": {
        "@type": "City",
        "name": pageData.cityName,
        "addressCountry": "TR"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${pageData.cityName} Transfer Services`,
        "itemListElement": generateCityOffers(pageData.cityName, language)
      }
    };
  }

  return baseSchema;
};

// Generate service offers for schema markup
export const generateServiceOffers = (serviceType, language = 'tr') => {
  const serviceTranslations = {
    tr: {
      'airport-transfer': 'Havalimanı Transfer',
      'vip-transfer': 'VIP Transfer',
      'group-transfer': 'Grup Transfer',
      'hotel-transfer': 'Otel Transfer'
    },
    en: {
      'airport-transfer': 'Airport Transfer',
      'vip-transfer': 'VIP Transfer',
      'group-transfer': 'Group Transfer',
      'hotel-transfer': 'Hotel Transfer'
    }
  };

  return [{
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": serviceTranslations[language]?.[serviceType] || serviceType,
      "description": `Professional ${serviceType} service in Antalya`
    },
    "priceRange": "₺50-₺500",
    "availability": "https://schema.org/InStock"
  }];
};

// Generate city offers for schema markup
export const generateCityOffers = (cityName, language = 'tr') => {
  return [{
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": `${cityName} Transfer Service`,
      "description": `Professional transfer service to/from ${cityName}`
    },
    "priceRange": "₺50-₺300",
    "availability": "https://schema.org/InStock"
  }];
};

// Internal linking suggestions
export const generateInternalLinks = (currentPage, allPages) => {
  const suggestions = [];
  
  // Suggest related city pages
  if (currentPage.type === 'city') {
    const relatedCities = allPages.filter(page => 
      page.type === 'city' && page.slug !== currentPage.slug
    ).slice(0, 3);
    suggestions.push(...relatedCities);
  }
  
  // Suggest related service pages
  if (currentPage.type === 'service') {
    const relatedServices = allPages.filter(page => 
      page.type === 'service' && page.slug !== currentPage.slug
    ).slice(0, 3);
    suggestions.push(...relatedServices);
  }
  
  // Always suggest homepage and booking page
  suggestions.push(
    { title: 'Ana Sayfa', url: '/', type: 'homepage' },
    { title: 'Rezervasyon', url: '/rezervasyon', type: 'booking' }
  );
  
  return suggestions;
};

// SEO content analysis
export const analyzeSEOContent = (content, targetKeywords) => {
  const analysis = {
    wordCount: content.split(/\s+/).length,
    readabilityScore: calculateReadabilityScore(content),
    keywordDensity: analyzeKeywordDensity(content, targetKeywords),
    headingStructure: analyzeHeadingStructure(content),
    internalLinks: countInternalLinks(content),
    externalLinks: countExternalLinks(content),
    imageOptimization: analyzeImages(content)
  };
  
  // Generate recommendations
  analysis.recommendations = generateSEORecommendations(analysis);
  
  return analysis;
};

// Calculate readability score (simplified Flesch formula)
export const calculateReadabilityScore = (text) => {
  const sentences = text.split(/[.!?]+/).length - 1;
  const words = text.split(/\s+/).length;
  const syllables = countSyllables(text);
  
  if (sentences === 0 || words === 0) return 0;
  
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  return Math.max(0, Math.min(100, score));
};

// Count syllables in text (approximation)
const countSyllables = (text) => {
  return text.toLowerCase().split(/\s+/).reduce((count, word) => {
    const vowels = word.match(/[aeiouüöıâîûôäëï]/g);
    return count + (vowels ? vowels.length : 1);
  }, 0);
};

// Analyze heading structure
const analyzeHeadingStructure = (content) => {
  const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
  return headings.map(heading => {
    const level = heading.match(/<h([1-6])/)[1];
    const text = heading.replace(/<[^>]*>/g, '');
    return { level: parseInt(level), text };
  });
};

// Count internal links
const countInternalLinks = (content) => {
  const internalLinks = content.match(/href="\/[^"]*"/g) || [];
  return internalLinks.length;
};

// Count external links
const countExternalLinks = (content) => {
  const externalLinks = content.match(/href="https?:\/\/[^"]*"/g) || [];
  return externalLinks.length;
};

// Analyze images
const analyzeImages = (content) => {
  const images = content.match(/<img[^>]*>/g) || [];
  return {
    total: images.length,
    withAlt: images.filter(img => img.includes('alt=')).length,
    withTitle: images.filter(img => img.includes('title=')).length,
    lazy: images.filter(img => img.includes('loading="lazy"')).length
  };
};

// Generate SEO recommendations
const generateSEORecommendations = (analysis) => {
  const recommendations = [];
  
  if (analysis.wordCount < 300) {
    recommendations.push('İçerik çok kısa. En az 300 kelime olmalı.');
  }
  
  if (analysis.readabilityScore < 60) {
    recommendations.push('Metin okunabilirliği düşük. Cümleleri kısaltın.');
  }
  
  if (analysis.internalLinks < 3) {
    recommendations.push('Daha fazla iç bağlantı ekleyin.');
  }
  
  if (analysis.imageOptimization.withAlt < analysis.imageOptimization.total) {
    recommendations.push('Tüm resimlere alt text ekleyin.');
  }
  
  return recommendations;
};

export default {
  analyzeKeywordDensity,
  generateAdvancedMetaTags,
  generateHreflangTags,
  generateSchemaMarkup,
  generateInternalLinks,
  analyzeSEOContent,
  calculateReadabilityScore
};
