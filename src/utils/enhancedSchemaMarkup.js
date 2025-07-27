// Enhanced Schema markup generator for advanced SEO
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://gatetransfer.com/#organization",
  "name": "GATE Transfer",
  "alternateName": "Gate Transfer Antalya",
  "description": "Antalya havalimanı transfer hizmetleri ve özel ulaşım çözümleri sunan güvenilir transfer şirketi.",
  "url": "https://gatetransfer.com",
  "telephone": "+90-242-123-4567",
  "email": "info@gatetransfer.com",
  "priceRange": "₺₺",
  "currenciesAccepted": "TRY, EUR, USD",
  "paymentAccepted": ["Cash", "Credit Card", "Online Payment"],
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
    "latitude": 36.8841,
    "longitude": 30.7056
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
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 36.8841,
      "longitude": 30.7056
    },
    "geoRadius": "100000"
  },
  "areaServed": [
    "Antalya", "Lara", "Kemer", "Belek", "Side", "Alanya", 
    "Kaş", "Kalkan", "Manavgat", "Serik"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  }
});

// Generate Website Schema
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://gatetransfer.com/#website",
  "url": "https://gatetransfer.com",
  "name": "GATE Transfer - Antalya Havalimanı Transfer",
  "description": "Antalya havalimanı transfer hizmetleri ve özel ulaşım çözümleri",
  "publisher": {
    "@id": "https://gatetransfer.com/#organization"
  },
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://gatetransfer.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  ]
});

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (pathname, language = 'tr') => {
  const pathSegments = pathname.split('/').filter(segment => segment && segment !== language);
  
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Ana Sayfa",
      "item": "https://gatetransfer.com/"
    }
  ];

  pathSegments.forEach((segment, index) => {
    const position = index + 2;
    const url = `https://gatetransfer.com/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Convert URL segments to readable names
    const nameMap = {
      'antalya-transfer': 'Antalya Transfer',
      'belek-transfer': 'Belek Transfer',
      'kemer-transfer': 'Kemer Transfer',
      'side-transfer': 'Side Transfer',
      'alanya-transfer': 'Alanya Transfer',
      'lara-transfer': 'Lara Transfer',
      'kas-transfer': 'Kaş Transfer',
      'kalkan-transfer': 'Kalkan Transfer',
      'manavgat-transfer': 'Manavgat Transfer',
      'serik-transfer': 'Serik Transfer',
      'havaalani-transfer': 'Havalimanı Transfer',
      'vip-transfer': 'VIP Transfer',
      'grup-transfer': 'Grup Transfer',
      'otel-transfer': 'Otel Transfer',
      'sehir-ici-transfer': 'Şehir İçi Transfer',
      'dugun-transfer': 'Düğün Transfer',
      'kurumsal-transfer': 'Kurumsal Transfer',
      'karsilama-hizmeti': 'Karşılama Hizmeti',
      'blog': 'Blog',
      'hakkimizda': 'Hakkımızda',
      'iletisim': 'İletişim',
      'hizmetlerimiz': 'Hizmetlerimiz',
      'sss': 'Sıkça Sorulan Sorular'
    };

    breadcrumbItems.push({
      "@type": "ListItem",
      "position": position,
      "name": nameMap[segment] || segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      "item": url
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };
};

// Generate Service Schema
export const generateServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "LocalBusiness",
    "name": "GATE Transfer",
    "url": "https://gatetransfer.com"
  },
  "serviceType": service.type || "Transportation Service",
  "areaServed": {
    "@type": "City",
    "name": "Antalya"
  },
  "offers": {
    "@type": "Offer",
    "price": service.price || "0",
    "priceCurrency": "TRY",
    "availability": "https://schema.org/InStock",
    "validFrom": new Date().toISOString(),
    "url": `https://gatetransfer.com${service.url}`
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Transfer Hizmetleri",
    "itemListElement": service.features?.map((feature, index) => ({
      "@type": "Offer",
      "position": index + 1,
      "itemOffered": {
        "@type": "Service",
        "name": feature
      }
    })) || []
  }
});

// Generate Article Schema
export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "https://gatetransfer.com/images/blog-default.jpg",
  "author": {
    "@type": "Person",
    "name": article.author || "GATE Transfer"
  },
  "publisher": {
    "@type": "Organization",
    "name": "GATE Transfer",
    "logo": {
      "@type": "ImageObject",
      "url": "https://gatetransfer.com/images/gate-transfer-logo.png"
    }
  },
  "datePublished": article.publishedTime,
  "dateModified": article.modifiedTime || article.publishedTime,
  "wordCount": article.wordCount || 1000,
  "articleBody": article.content,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://gatetransfer.com/blog/${article.slug}`
  }
});

// Generate FAQ Schema
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Generate Organization Schema with enhanced data
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://gatetransfer.com/#organization",
  "name": "GATE Transfer",
  "alternateName": ["Gate Transfer", "Gate Transfer Antalya"],
  "url": "https://gatetransfer.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://gatetransfer.com/images/gate-transfer-logo.png",
    "width": 300,
    "height": 100
  },
  "image": "https://gatetransfer.com/images/gate-transfer-og.jpg",
  "description": "Antalya havalimanı transfer hizmetleri ve özel ulaşım çözümleri sunan güvenilir transfer şirketi.",
  "telephone": "+90-242-123-4567",
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
    "latitude": 36.8841,
    "longitude": 30.7056
  },
  "foundingDate": "2020-01-01",
  "numberOfEmployees": "10-50",
  "sameAs": [
    "https://www.facebook.com/gatetransfer",
    "https://www.instagram.com/gatetransfer",
    "https://www.twitter.com/gatetransfer",
    "https://www.linkedin.com/company/gatetransfer"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+90-242-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["Turkish", "English", "German", "Russian"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "245",
    "bestRating": "5",
    "worstRating": "1"
  }
});

// Generate Review Schema
export const generateReviewSchema = (reviews) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://gatetransfer.com/#organization",
  "review": reviews.map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "datePublished": review.date,
    "reviewBody": review.text,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    }
  }))
});
