import { SEO_CONFIG } from '../config/seoConfig.js';

// Ana Organizasyon Şeması
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SEO_CONFIG.siteUrl}/#organization`,
  "name": SEO_CONFIG.company.name,
  "alternateName": SEO_CONFIG.company.alternateName,
  "description": SEO_CONFIG.defaultDescription,
  "url": SEO_CONFIG.siteUrl,
  "telephone": SEO_CONFIG.company.phone,
  "email": SEO_CONFIG.company.email,
  "priceRange": SEO_CONFIG.schema.priceRange,
  "currenciesAccepted": SEO_CONFIG.schema.currenciesAccepted,
  "paymentAccepted": SEO_CONFIG.schema.paymentAccepted,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": SEO_CONFIG.company.address.streetAddress,
    "addressLocality": SEO_CONFIG.company.address.addressLocality,
    "addressRegion": SEO_CONFIG.company.address.addressRegion,
    "postalCode": SEO_CONFIG.company.address.postalCode,
    "addressCountry": SEO_CONFIG.company.address.addressCountry
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": SEO_CONFIG.company.geo.latitude,
    "longitude": SEO_CONFIG.company.geo.longitude
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": SEO_CONFIG.company.geo.latitude,
      "longitude": SEO_CONFIG.company.geo.longitude
    },
    "geoRadius": "100000"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Antalya"
    },
    {
      "@type": "State", 
      "name": "Antalya"
    }
  ],
  "sameAs": [
    SEO_CONFIG.social.facebook,
    SEO_CONFIG.social.instagram,
    SEO_CONFIG.social.twitter
  ]
});

// Hizmet Şeması 
export const generateServiceSchema = (serviceName, description, url, price = null) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${url}/#service`,
  "name": serviceName,
  "description": description,
  "url": url,
  "provider": {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`
  },
  "serviceType": "Transportation Service",
  "category": "Airport Transfer",
  "areaServed": {
    "@type": "City",
    "name": "Antalya"
  },
  ...(price && {
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "seller": {
        "@id": `${SEO_CONFIG.siteUrl}/#organization`
      }
    }
  })
});

// Şehir Transfer Şeması
export const generateCityTransferSchema = (cityName, distance, duration, price) => ({
  "@context": "https://schema.org",
  "@type": "TripSegment",
  "@id": `${SEO_CONFIG.siteUrl}/${cityName.toLowerCase()}-transfer/#trip`,
  "name": `Antalya Havalimanı ${cityName} Transfer`,
  "description": `Antalya Havalimanından ${cityName} bölgesine güvenli ve konforlu transfer hizmeti`,
  "departureLocation": {
    "@type": "Airport",
    "name": "Antalya Havalimanı",
    "iataCode": "AYT",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Antalya",
      "addressCountry": "TR"
    }
  },
  "arrivalLocation": {
    "@type": "Place",
    "name": cityName,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "Antalya",
      "addressCountry": "TR"
    }
  },
  "distance": distance,
  "estimatedDuration": duration,
  "provider": {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`
  },
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
});

// FAQ Şeması
export const generateFAQSchema = (faqItems) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

// Breadcrumb Şeması
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

// Blog Yazısı Şeması
export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${article.url}/#article`,
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Organization",
    "name": SEO_CONFIG.company.name,
    "url": SEO_CONFIG.siteUrl
  },
  "publisher": {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`
  },
  "datePublished": article.publishDate,
  "dateModified": article.modifiedDate || article.publishDate,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

// Review/Rating Şeması
export const generateAggregateRatingSchema = (rating, reviewCount) => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "ratingValue": rating,
  "bestRating": "5",
  "worstRating": "1", 
  "ratingCount": reviewCount,
  "itemReviewed": {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`
  }
});

// WebSite Şeması (Arama Özelliği ile)
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SEO_CONFIG.siteUrl}/#website`,
  "name": SEO_CONFIG.siteName,
  "description": SEO_CONFIG.defaultDescription,
  "url": SEO_CONFIG.siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SEO_CONFIG.siteUrl}/arama?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`
  }
});
