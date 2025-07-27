import React from 'react';
import { Helmet } from 'react-helmet-async';
import { advancedSeoKeywords, pageKeywordMapping } from '../../data/advancedSeoKeywords';

const EnhancedMetaTags = ({ 
  pageType = 'homepage',
  cityName = '',
  serviceName = '',
  language = 'tr',
  customTitle = '',
  customDescription = '',
  customKeywords = [],
  blogData = null,
  noIndex = false
}) => {
  
  // Get page-specific keywords
  const getPageKeywords = () => {
    let keywords = [];
    
    if (pageKeywordMapping[pageType]) {
      const mapping = pageKeywordMapping[pageType];
      keywords = [
        ...(mapping.primary || []),
        ...(mapping.secondary || []),
        ...(mapping.longTail || [])
      ];
    }
    
    // Add custom keywords
    if (customKeywords.length > 0) {
      keywords = [...keywords, ...customKeywords];
    }
    
    // Add city/service specific keywords
    if (cityName) {
      keywords.push(`${cityName} transfer`, `${cityName} ulaşım`, `${cityName} taksi`);
    }
    
    if (serviceName) {
      keywords.push(`${serviceName} antalya`, `${serviceName} hizmeti`);
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  };

  // Generate optimized title
  const generateTitle = () => {
    if (customTitle) return customTitle;
    
    const baseTitle = "GATE Transfer";
    const separator = " | ";
    
    switch (pageType) {
      case 'city':
        return `${cityName} Transfer Hizmeti ${separator} Havalimanı Transfer ${separator} ${baseTitle}`;
      case 'service':
        return `${serviceName} ${separator} Antalya Transfer ${separator} ${baseTitle}`;
      case 'blog':
        return blogData ? 
          `${blogData.title} ${separator} GATE Transfer Blog` :
          `Transfer Rehberi ve İpuçları ${separator} ${baseTitle} Blog`;
      case 'homepage':
        return `Antalya VIP Transfer ${separator} Havalimanı Transfer Hizmeti ${separator} 7/24 Güvenli Transfer`;
      default:
        return `${baseTitle} ${separator} Antalya Transfer Hizmeti`;
    }
  };

  // Generate optimized description
  const generateDescription = () => {
    if (customDescription) return customDescription;
    
    switch (pageType) {
      case 'city':
        return `${cityName} transfer hizmeti. Antalya havalimanından ${cityName}'e güvenli, konforlu ve ekonomik transfer. VIP araçlar, profesyonel şoförler, 7/24 hizmet. Hemen rezervasyon yapın!`;
      case 'service':
        return `${serviceName} hizmeti Antalya'da. Profesyonel şoförler, lüks araçlar, güvenli yolculuk. ${serviceName} için en uygun fiyatlarla rezervasyon yapın.`;
      case 'blog':
        return blogData ? 
          blogData.excerpt :
          `Antalya transfer hizmetleri hakkında detaylı rehber. Transfer ipuçları, fiyat karşılaştırmaları ve seyahat önerileri.`;
      case 'homepage':
        return `Antalya havalimanı transfer hizmeti. VIP araçlar, profesyonel şoförler, 7/24 hizmet. Antalya şehir içi transfer, otel transfer, güvenli yolculuk garantisi.`;
      default:
        return `GATE Transfer ile Antalya'da güvenli ve konforlu transfer hizmeti. Havalimanı transferi, şehir içi ulaşım ve VIP transfer seçenekleri.`;
    }
  };

  // Generate structured data
  const generateStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "GATE Transfer",
      "image": "https://gatetransfer.com/images/gate-transfer-logo.jpg",
      "telephone": "+90 242 123 45 67",
      "email": "info@gatetransfer.com",
      "url": `https://gatetransfer.com${getCanonicalUrl()}`,
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
      "priceRange": "₺₺",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "247"
      }
    };

    // Add page-specific structured data
    if (pageType === 'service') {
      return {
        ...baseStructuredData,
        "@type": "TravelAgency",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${serviceName} Services`,
          "itemListElement": [{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": serviceName,
              "description": generateDescription()
            },
            "priceRange": "₺50-₺500",
            "availability": "https://schema.org/InStock"
          }]
        }
      };
    }

    if (pageType === 'city') {
      return {
        ...baseStructuredData,
        "areaServed": {
          "@type": "City",
          "name": cityName,
          "addressCountry": "TR"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog", 
          "name": `${cityName} Transfer Services`,
          "itemListElement": [{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `${cityName} Transfer`,
              "description": generateDescription()
            },
            "priceRange": "₺50-₺300",
            "availability": "https://schema.org/InStock"
          }]
        }
      };
    }

    if (pageType === 'blog' && blogData) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blogData.title,
        "description": blogData.excerpt,
        "image": blogData.image,
        "author": {
          "@type": "Organization",
          "name": "GATE Transfer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "GATE Transfer",
          "logo": {
            "@type": "ImageObject",
            "url": "https://gatetransfer.com/images/gate-transfer-logo.jpg"
          }
        },
        "datePublished": blogData.publishDate,
        "dateModified": blogData.modifiedDate || blogData.publishDate
      };
    }

    return baseStructuredData;
  };

  // Get canonical URL
  const getCanonicalUrl = () => {
    switch (pageType) {
      case 'city':
        return `/${cityName.toLowerCase()}-transfer`;
      case 'service':
        return `/${serviceName.toLowerCase().replace(/\s+/g, '-')}`;
      case 'blog':
        return blogData ? `/blog/${blogData.slug}` : '/blog';
      default:
        return '/';
    }
  };

  // Get Open Graph image
  const getOGImage = () => {
    if (blogData && blogData.image) return blogData.image;
    if (pageType === 'city') return `/images/${cityName.toLowerCase()}_transfer_og.jpg`;
    if (pageType === 'service') return `/images/${serviceName.toLowerCase().replace(/\s+/g, '_')}_og.jpg`;
    return '/images/gate-transfer-og.jpg';
  };

  const title = generateTitle();
  const description = generateDescription();
  const keywords = getPageKeywords();
  const canonicalUrl = `https://gatetransfer.com${getCanonicalUrl()}`;
  const ogImage = getOGImage();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="GATE Transfer" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={pageType === 'blog' ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="GATE Transfer" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@gatetransfer" />
      <meta name="twitter:creator" content="@gatetransfer" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="apple-mobile-web-app-title" content="GATE Transfer" />
      <meta name="application-name" content="GATE Transfer" />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="TR-07" />
      <meta name="geo.placename" content="Antalya" />
      <meta name="geo.position" content="36.8969;30.7133" />
      <meta name="ICBM" content="36.8969, 30.7133" />

      {/* Language and Regional Tags */}
      <meta httpEquiv="content-language" content="tr" />
      <meta name="language" content="Turkish" />
      <meta name="country" content="Turkey" />

      {/* Mobile and App Tags */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Hreflang Tags for Multi-language */}
      <link rel="alternate" hrefLang="tr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={`https://gatetransfer.com/en${getCanonicalUrl()}`} />
      <link rel="alternate" hrefLang="de" href={`https://gatetransfer.com/de${getCanonicalUrl()}`} />
      <link rel="alternate" hrefLang="ru" href={`https://gatetransfer.com/ru${getCanonicalUrl()}`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Additional Structured Data for FAQ Pages */}
      {pageType === 'city' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `${cityName} transfer ücreti ne kadar?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${cityName} transfer ücretleri mesafeye ve araç tipine göre değişmektedir. Ekonomik seçenekler ₺50'den başlarken, VIP transfer hizmeti ₺150-₺300 arasındadır.`
                }
              },
              {
                "@type": "Question", 
                "name": `${cityName} transferi ne kadar sürer?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Antalya havalimanından ${cityName}'e transfer süresi trafik durumuna göre 30-90 dakika arasında değişmektedir.`
                }
              },
              {
                "@type": "Question",
                "name": `${cityName} transfer rezervasyonu nasıl yapılır?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${cityName} transfer rezervasyonu web sitemizden online olarak yapılabilir. 7/24 telefon hattımızdan da rezervasyon alabilirsiniz.`
                }
              }
            ]
          })}
        </script>
      )}

      {/* Blog Article Structured Data */}
      {pageType === 'blog' && blogData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
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
                "name": "Blog",
                "item": "https://gatetransfer.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": blogData.title,
                "item": `https://gatetransfer.com/blog/${blogData.slug}`
              }
            ]
          })}
        </script>
      )}

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default EnhancedMetaTags;
