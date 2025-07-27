import React from 'react';
import { Helmet } from 'react-helmet-async';
import { googleSearchConsole } from '../../utils/googleSeoIntegration';

const StructuredDataManager = ({ 
  pageType = 'website',
  pageData = {},
  language = 'tr',
  validateData = true 
}) => {

  // Organization schema (her sayfada temel)
  const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'GATE Transfer',
    'alternateName': 'Gate Transfer Antalya',
    'url': 'https://gatetransfer.com',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://gatetransfer.com/images/logo.png',
      'width': 300,
      'height': 120
    },
    'image': 'https://gatetransfer.com/images/logo.png',
    'description': language === 'tr' 
      ? 'Antalya\'da profesyonel VIP transfer ve havalimanı transfer hizmetleri'
      : 'Professional VIP transfer and airport transfer services in Antalya',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Muratpaşa',
      'addressLocality': 'Antalya',
      'addressRegion': 'Antalya',
      'postalCode': '07100',
      'addressCountry': 'TR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 36.8969,
      'longitude': 30.7133
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+90-242-123-4567',
      'contactType': 'customer service',
      'availableLanguage': ['tr', 'en', 'de', 'ru', 'ar'],
      'areaServed': 'TR'
    },
    'sameAs': [
      'https://www.facebook.com/gatetransfer',
      'https://www.instagram.com/gatetransfer',
      'https://twitter.com/gatetransfer'
    ],
    'founder': {
      '@type': 'Person',
      'name': 'GATE Transfer Kurucuları'
    },
    'foundingDate': '2020-01-01',
    'numberOfEmployees': '50-100',
    'serviceArea': {
      '@type': 'GeoCircle',
      'geoMidpoint': {
        '@type': 'GeoCoordinates',
        'latitude': 36.8969,
        'longitude': 30.7133
      },
      'geoRadius': 100000
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': language === 'tr' ? 'Transfer Hizmetleri' : 'Transfer Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': language === 'tr' ? 'Havalimanı Transfer' : 'Airport Transfer'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': language === 'tr' ? 'VIP Transfer' : 'VIP Transfer'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': language === 'tr' ? 'Otel Transfer' : 'Hotel Transfer'
          }
        }
      ]
    }
  });

  // WebSite schema (ana sayfa için)
  const generateWebSiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'GATE Transfer',
    'url': 'https://gatetransfer.com',
    'description': language === 'tr' 
      ? 'Antalya VIP transfer ve havalimanı transfer hizmetleri'
      : 'Antalya VIP transfer and airport transfer services',
    'publisher': {
      '@type': 'Organization',
      'name': 'GATE Transfer'
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://gatetransfer.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    'inLanguage': language,
    'copyrightYear': new Date().getFullYear(),
    'dateCreated': '2020-01-01',
    'dateModified': new Date().toISOString().split('T')[0]
  });

  // Service schema (hizmet sayfaları için)
  const generateServiceSchema = () => {
    const { serviceName, serviceDescription, price, duration } = pageData;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': serviceName || (language === 'tr' ? 'Transfer Hizmeti' : 'Transfer Service'),
      'description': serviceDescription || (language === 'tr' 
        ? 'Profesyonel transfer hizmetleri' 
        : 'Professional transfer services'),
      'provider': {
        '@type': 'Organization',
        'name': 'GATE Transfer',
        'url': 'https://gatetransfer.com'
      },
      'serviceType': serviceName,
      'areaServed': {
        '@type': 'City',
        'name': 'Antalya'
      },
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': serviceName,
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': serviceName
            },
            'price': price || '0',
            'priceCurrency': 'TRY',
            'availability': 'https://schema.org/InStock',
            'validFrom': new Date().toISOString(),
            'priceValidUntil': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/InStock',
        'priceCurrency': 'TRY',
        'price': price || '0'
      }
    };
  };

  // LocalBusiness schema (şehir sayfaları için)
  const generateLocalBusinessSchema = () => {
    const { cityName, cityDescription } = pageData;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://gatetransfer.com/${cityName?.toLowerCase()}`,
      'name': `GATE Transfer ${cityName}`,
      'description': cityDescription || (language === 'tr' 
        ? `${cityName} bölgesinde profesyonel transfer hizmetleri`
        : `Professional transfer services in ${cityName}`),
      'url': `https://gatetransfer.com/${cityName?.toLowerCase()}`,
      'telephone': '+90-242-123-4567',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': cityName || 'Antalya',
        'addressRegion': 'Antalya',
        'addressCountry': 'TR'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': pageData.latitude || 36.8969,
        'longitude': pageData.longitude || 30.7133
      },
      'openingHours': 'Mo-Su 00:00-23:59',
      'priceRange': '₺₺',
      'image': `https://gatetransfer.com/images/${cityName?.toLowerCase()}-transfer.jpg`,
      'hasMap': `https://maps.google.com/?q=${cityName || 'Antalya'}+Turkey`,
      'serviceArea': {
        '@type': 'City',
        'name': cityName || 'Antalya'
      },
      'knowsAbout': [
        language === 'tr' ? 'Transfer Hizmetleri' : 'Transfer Services',
        language === 'tr' ? 'Havalimanı Transferi' : 'Airport Transfer',
        language === 'tr' ? 'VIP Transfer' : 'VIP Transfer'
      ]
    };
  };

  // BlogPosting schema (blog sayfaları için)
  const generateBlogPostingSchema = () => {
    const { 
      title, 
      description, 
      publishDate, 
      modifiedDate, 
      author, 
      featuredImage,
      wordCount,
      readingTime 
    } = pageData;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': description,
      'image': featuredImage || 'https://gatetransfer.com/images/blog-default.jpg',
      'author': {
        '@type': 'Organization',
        'name': author || 'GATE Transfer',
        'url': 'https://gatetransfer.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'GATE Transfer',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://gatetransfer.com/images/logo.png'
        }
      },
      'datePublished': publishDate || new Date().toISOString(),
      'dateModified': modifiedDate || publishDate || new Date().toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': pageData.url || window.location.href
      },
      'wordCount': wordCount || 500,
      'timeRequired': `PT${readingTime || 3}M`,
      'inLanguage': language,
      'isAccessibleForFree': true,
      'keywords': pageData.keywords || 'transfer, antalya, havalimanı'
    };
  };

  // FAQ schema (sık sorulan sorular için)
  const generateFAQSchema = () => {
    if (!pageData.faqs || !Array.isArray(pageData.faqs)) return null;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': pageData.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  };

  // BreadcrumbList schema
  const generateBreadcrumbSchema = () => {
    if (!pageData.breadcrumbs || !Array.isArray(pageData.breadcrumbs)) return null;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': pageData.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };
  };

  // Ana schema üretici fonksiyon
  const generateMainSchema = () => {
    let schemas = [];
    
    // Her sayfada organization schema
    schemas.push(generateOrganizationSchema());
    
    // Sayfa tipine göre schema ekle
    switch (pageType) {
      case 'home':
        schemas.push(generateWebSiteSchema());
        break;
      case 'service':
        schemas.push(generateServiceSchema());
        break;
      case 'city':
        schemas.push(generateLocalBusinessSchema());
        break;
      case 'blog':
        schemas.push(generateBlogPostingSchema());
        break;
    }
    
    // FAQ varsa ekle
    const faqSchema = generateFAQSchema();
    if (faqSchema) schemas.push(faqSchema);
    
    // Breadcrumb varsa ekle
    const breadcrumbSchema = generateBreadcrumbSchema();
    if (breadcrumbSchema) schemas.push(breadcrumbSchema);
    
    return schemas;
  };

  // Schema validation
  const validateSchema = (schema) => {
    if (!validateData) return true;
    return googleSearchConsole.validateStructuredData(schema);
  };

  const schemas = generateMainSchema();
  const validSchemas = schemas.filter(schema => validateSchema(schema));

  return (
    <Helmet>
      {validSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema, null, 0)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredDataManager;
