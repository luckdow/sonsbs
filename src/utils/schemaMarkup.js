// Schema markup generator for different page types
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://gatetransfer.com/#organization",
  "name": "SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi",
  "alternateName": ["SBS Turkey Transfer", "SBS Transfer", "Gate Transfer"],
  "description": "Antalya havalimanı transfer hizmetleri ve özel ulaşım çözümleri sunan güvenilir transfer şirketi.",
  "url": "https://gatetransfer.com",
  "telephone": "+905325742682",
  "email": "sbstravel@gmail.com",
  "priceRange": "₺₺",
  "currenciesAccepted": "TRY, EUR, USD",
  "paymentAccepted": ["Cash", "Credit Card", "Online Payment"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Güzelyurt Mahallesi Serik Caddesi No: 138/2",
    "addressLocality": "Aksu",
    "addressRegion": "Antalya",
    "postalCode": "07112",
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
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Transfer Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Havalimanı Transfer",
          "description": "Antalya havalimanından otel ve şehir merkezlerine transfer hizmeti"
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
          "description": "Büyük gruplar için özel transfer çözümleri"
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
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Çok profesyonel hizmet. Zamanında geldi, temiz araç, güler yüzlü şoför. Kesinlikle tavsiye ederim."
    }
  ],
  "sameAs": [
    "https://www.facebook.com/sbsturkeytransfer",
    "https://www.instagram.com/sbsturkeytransfer",
    "https://twitter.com/sbsturkeytransfer"
  ]
});

export const generateServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `https://gatetransfer.com/${service.slug}/#service`,
  "name": service.name,
  "description": service.description,
  "provider": {
    "@id": "https://gatetransfer.com/#organization"
  },
  "areaServed": service.areaServed || [
    "Antalya", "Lara", "Kemer", "Belek", "Side", "Alanya"
  ],
  "serviceType": service.type || "Transportation Service",
  "offers": {
    "@type": "Offer",
    "price": service.startingPrice || "50",
    "priceCurrency": "TRY",
    "availability": "https://schema.org/InStock",
    "validFrom": new Date().toISOString(),
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": service.startingPrice || "50",
      "priceCurrency": "TRY",
      "valueAddedTaxIncluded": true
    }
  },
  "category": "Transportation",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": `${service.name} Packages`,
    "itemListElement": service.packages?.map((pkg, index) => ({
      "@type": "Offer",
      "name": pkg.name,
      "description": pkg.description,
      "price": pkg.price,
      "priceCurrency": "TRY"
    })) || []
  }
});

export const generateCityPageSchema = (city) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `https://gatetransfer.com/${city.slug}/#webpage`,
  "name": `${city.name} Transfer Hizmetleri`,
  "description": city.description,
  "url": `https://gatetransfer.com/${city.slug}`,
  "isPartOf": {
    "@id": "https://gatetransfer.com/#website"
  },
  "about": {
    "@type": "Place",
    "name": city.name,
    "description": city.description,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.coordinates?.lat || 36.8841,
      "longitude": city.coordinates?.lng || 30.7056
    },
    "containedInPlace": {
      "@type": "City",
      "name": "Antalya",
      "addressCountry": "TR"
    }
  },
  "mainEntity": {
    "@type": "Service",
    "name": `${city.name} Transfer Hizmeti`,
    "description": `${city.name} bölgesine profesyonel transfer hizmetleri`,
    "provider": {
      "@id": "https://gatetransfer.com/#organization"
    },
    "areaServed": {
      "@type": "Place",
      "name": city.name
    }
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://gatetransfer.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Şehirler",
        "item": "https://gatetransfer.com/sehirler"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${city.name} Transfer`,
        "item": `https://gatetransfer.com/${city.slug}`
      }
    ]
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://gatetransfer.com/#website",
  "name": "SBS Turkey Transfer",
  "description": "Antalya havalimanı transfer hizmetleri ve özel ulaşım çözümleri",
  "url": "https://gatetransfer.com",
  "publisher": {
    "@id": "https://gatetransfer.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://gatetransfer.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://www.facebook.com/sbsturkeytransfer",
    "https://www.instagram.com/sbsturkeytransfer",
    "https://twitter.com/sbsturkeytransfer"
  ]
});


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

export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `https://gatetransfer.com/blog/${article.slug}/#article`,
  "headline": article.title,
  "description": article.excerpt,
  "image": article.featuredImage,
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt,
  "author": {
    "@type": "Person",
    "name": article.author.name,
    "url": `https://gatetransfer.com/author/${article.author.slug}`
  },
  "publisher": {
    "@id": "https://gatetransfer.com/#organization"
  },
  "articleSection": article.category,
  "wordCount": article.wordCount || 1000,
  "articleBody": article.content,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://gatetransfer.com/blog/${article.slug}`
  }
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

// Generate Organization Schema with enhanced data
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://gatetransfer.com/#organization",
  "name": "SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi",
  "alternateName": ["SBS Turkey Transfer", "SBS Transfer", "Gate Transfer"],
  "url": "https://gatetransfer.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://gatetransfer.com/images/sbs-turkey-transfer-logo.png",
    "width": 300,
    "height": 100
  },
  "image": "https://gatetransfer.com/images/sbs-turkey-transfer-og.jpg",
  "description": "Antalya havalimanı transfer hizmetleri ve özel ulaşım çözümleri sunan güvenilir transfer şirketi.",
  "telephone": "+905325742682",
  "email": "sbstravel@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Güzelyurt Mahallesi Serik Caddesi No: 138/2",
    "addressLocality": "Aksu",
    "addressRegion": "Antalya",
    "postalCode": "07112",
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
    "https://www.facebook.com/sbsturkeytransfer",
    "https://www.instagram.com/sbsturkeytransfer",
    "https://www.twitter.com/sbsturkeytransfer",
    "https://www.linkedin.com/company/sbsturkeytransfer"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+905325742682",
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
  "@type": "Organization",
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
