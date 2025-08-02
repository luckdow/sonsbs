import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * @name UnifiedSEO
 * @description Optimize edilmiş tek SEO bileşeni
 * Tüm SEO işlevselliklerini birleştirir:
 * - Meta etiketleri
 * - OG ve Twitter kartları
 * - Hreflang etiketleri
 * - Schema.org yapılandırması
 * - Canonical URL kontrolü
 * - Robots direktifleri
 */
const UnifiedSEO = ({
  // Sayfa temel bilgileri
  title,
  description,
  keywords,
  canonicalUrl,
  noIndex = false,
  
  // Sayfa kategorisi
  pageType = 'generic', // 'home', 'city', 'service', 'blog', 'static'
  location = '', // şehir veya hizmet adı
  
  // Çoklu dil desteği
  language = 'tr',
  alternateLanguages = ['tr', 'en', 'de', 'ru'],
  
  // Görsel ve medya
  ogImage,
  ogImageAlt,
  
  // Schema.org yapılandırması
  hasSchema = true,
  schemaType = null, // 'LocalBusiness', 'Article', 'Service', 'FAQ' vs.
  schemaData = null,
  
  // Diğer seçenekler
  preconnectDomains = [],
  additionalMetaTags = [],
}) => {
  const routerLocation = useLocation();
  const baseUrl = 'https://www.gatetransfer.com';
  const currentPath = routerLocation.pathname;
  
  // VARSAYILAN DEĞERLER
  const defaultTitle = 'GATE Transfer | Antalya Havalimanı Transfer Hizmetleri';
  const defaultDescription = 'Antalya havalimanı transfer hizmetleri. TURSAB lisanslı, güvenli ve konforlu transfer çözümleri. 7/24 transfer hizmeti.';
  const defaultKeywords = 'antalya transfer, havalimanı transfer, kemer transfer, side transfer, belek transfer, alanya transfer, vip transfer, airport transfer';
  const defaultOgImage = `${baseUrl}/images/og-default.jpg`;
  
  // DİL AYARLARI
  const hreflangMapping = {
    tr: 'tr_TR',
    en: 'en_GB',
    de: 'de_DE',
    ru: 'ru_RU',
    ar: 'ar_SA'
  };
  
  // SAYFA TÜRÜNE GÖRE META TAG ÜRETİMİ
  const generatePageMetaData = () => {
    // Temel değerlerin ayarlanması
    let pageTitle = title || defaultTitle;
    let pageDescription = description || defaultDescription;
    let pageKeywords = keywords || defaultKeywords;
    let pageOgImage = ogImage || defaultOgImage;
    
    // Sayfa türüne göre özelleştirme
    if (pageType === 'city' && location) {
      if (!title) {
        pageTitle = `${location} Transfer | Antalya Havalimanı - ${location} Transferi`;
      }
      if (!description) {
        pageDescription = `Antalya Havalimanı'ndan ${location} otellerine güvenli ve konforlu transfer hizmeti. TURSAB lisanslı şoförler, 7/24 hizmet ve uygun fiyatlar.`;
      }
      if (!keywords) {
        pageKeywords = `${location} transfer, antalya ${location} transfer, ${location} havalimanı transfer, ${location} ulaşım`;
      }
      if (!ogImage) {
        pageOgImage = `${baseUrl}/images/cities/${location.toLowerCase()}-transfer.jpg`;
      }
    }
    
    if (pageType === 'service' && location) {
      if (!title) {
        pageTitle = `${location} Hizmeti | GATE Transfer Antalya`;
      }
      if (!description) {
        pageDescription = `Antalya'da ${location} hizmeti. Profesyonel şoförler, konforlu araçlar ve uygun fiyatlarla ${location} hizmeti.`;
      }
    }
    
    if (pageType === 'blog' && title) {
      if (!description) {
        pageDescription = `${title} | GATE Transfer Blog - Antalya bölgesi ve transfer hizmetleri hakkında bilgiler`;
      }
    }
    
    return {
      pageTitle,
      pageDescription,
      pageKeywords,
      pageOgImage
    };
  };
  
  // SCHEMA.ORG YAPILANDIRMASI
  const generateSchema = () => {
    // Eğer schema verilmeyecekse boş dizi dön
    if (!hasSchema) return [];
    
    const schemas = [];
    
    // Temel LocalBusiness schema
    const baseLocalBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'GATE Transfer',
      'url': baseUrl,
      'logo': `${baseUrl}/images/logo.png`,
      'image': `${baseUrl}/images/gate-transfer-building.jpg`,
      'description': defaultDescription,
      'priceRange': '€€',
      'telephone': '+90-242-123-4567',
      'email': 'info@gatetransfer.com',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'TR',
        'addressLocality': 'Antalya',
        'streetAddress': 'Lara Caddesi No:101'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '36.8969',
        'longitude': '30.7133'
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ],
        'opens': '00:00',
        'closes': '23:59'
      },
      'sameAs': [
        'https://www.facebook.com/gatetransfer',
        'https://www.instagram.com/gatetransfer',
        'https://twitter.com/gatetransfer'
      ]
    };
    
    // Breadcrumb şeması
    const generateBreadcrumbSchema = () => {
      if (pageType === 'home') return null;
      
      const pathSegments = currentPath.split('/').filter(Boolean);
      const breadcrumbItems = [];
      
      // Ana sayfa her zaman ilk öğe
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 1,
        'name': 'Ana Sayfa',
        'item': baseUrl
      });
      
      // Diğer segmentler
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        breadcrumbItems.push({
          '@type': 'ListItem',
          'position': index + 2,
          'name': segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          'item': `${baseUrl}${currentPath}`
        });
      });
      
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbItems
      };
    };
    
    // Sayfa türüne göre schema belirleme
    switch (pageType) {
      case 'home':
        schemas.push(baseLocalBusinessSchema);
        
        // Web sitesi şeması
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'url': baseUrl,
          'name': 'GATE Transfer',
          'description': defaultDescription,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        });
        break;
        
      case 'city':
        // Şehir sayfaları için servis şeması
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          'serviceType': `${location} Transfer Hizmeti`,
          'name': `${location} Transfer`,
          'description': generatePageMetaData().pageDescription,
          'provider': {
            '@type': 'LocalBusiness',
            'name': 'GATE Transfer',
            'address': baseLocalBusinessSchema.address
          },
          'areaServed': {
            '@type': 'City',
            'name': location,
            'containedInPlace': {
              '@type': 'State',
              'name': 'Antalya'
            }
          }
        });
        
        // Breadcrumb şeması
        const breadcrumb = generateBreadcrumbSchema();
        if (breadcrumb) {
          schemas.push(breadcrumb);
        }
        break;
        
      case 'service':
        // Hizmet sayfaları için schema
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          'serviceType': location,
          'name': `${location} - GATE Transfer`,
          'description': generatePageMetaData().pageDescription,
          'provider': {
            '@type': 'LocalBusiness',
            'name': 'GATE Transfer',
            'address': baseLocalBusinessSchema.address
          }
        });
        
        // Breadcrumb şeması
        const serviceBreadcrumb = generateBreadcrumbSchema();
        if (serviceBreadcrumb) {
          schemas.push(serviceBreadcrumb);
        }
        break;
        
      case 'blog':
        // Blog sayfaları için article şeması
        if (title) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': `${baseUrl}${currentPath}`
            },
            'headline': title,
            'description': generatePageMetaData().pageDescription,
            'image': generatePageMetaData().pageOgImage,
            'author': {
              '@type': 'Organization',
              'name': 'GATE Transfer'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'GATE Transfer',
              'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/images/logo.png`
              }
            },
            'datePublished': new Date().toISOString(),
            'dateModified': new Date().toISOString()
          });
        }
        
        // Breadcrumb şeması
        const blogBreadcrumb = generateBreadcrumbSchema();
        if (blogBreadcrumb) {
          schemas.push(blogBreadcrumb);
        }
        break;
        
      default:
        // Diğer sayfalar için yalnızca breadcrumb
        const defaultBreadcrumb = generateBreadcrumbSchema();
        if (defaultBreadcrumb) {
          schemas.push(defaultBreadcrumb);
        }
    }
    
    // Özel schema verisi ekleme
    if (schemaData) {
      schemas.push(schemaData);
    }
    
    return schemas;
  };
  
  // HREFLANG ETİKETLERİ
  const generateHreflangTags = () => {
    const tags = [];
    
    // Varsayılan dil için
    tags.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${baseUrl}${currentPath}`
    });
    
    // Diğer diller için
    alternateLanguages.forEach(lang => {
      let path = currentPath;
      
      // Çoklu dil yapılandırmasına göre
      // Örnek: /tr/hizmetler, /en/services vs.
      // Bu kısmı gerçek path yapılandırmanıza göre düzenlemelisiniz
      if (lang !== 'tr') {
        // Basit bir çeviri mantığı - gerçek projede daha karmaşık olabilir
        path = `/${lang}${currentPath}`;
      }
      
      tags.push({
        rel: 'alternate',
        hreflang: hreflangMapping[lang] || lang,
        href: `${baseUrl}${path}`
      });
    });
    
    return tags;
  };
  
  // META VERİ ÜRETİMİ
  const {
    pageTitle,
    pageDescription,
    pageKeywords,
    pageOgImage
  } = generatePageMetaData();
  
  // CANONICAL URL
  const finalCanonicalUrl = canonicalUrl || `${baseUrl}${currentPath}`;
  
  // SCHEMA.ORG
  const schemas = generateSchema();
  
  // HREFLANG
  const hreflangTags = generateHreflangTags();

  return (
    <Helmet>
      {/* Temel Meta Etiketleri */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      
      {/* Canonical URL - Çok önemli! */}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Robots Direktifleri */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Dil Ayarları */}
      <html lang={language} />
      <meta httpEquiv="content-language" content={hreflangMapping[language] || language} />
      
      {/* Hreflang Etiketleri */}
      {hreflangTags.map((tag, index) => (
        <link key={`hreflang-${index}`} rel={tag.rel} hreflang={tag.hreflang} href={tag.href} />
      ))}
      
      {/* Open Graph Meta Etiketleri */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:site_name" content="GATE Transfer" />
      <meta property="og:locale" content={hreflangMapping[language] || language} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      
      {/* Twitter Card Meta Etiketleri */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageOgImage} />
      <meta name="twitter:site" content="@gatetransfer" />
      
      {/* Mobil Optimizasyonu */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#003366" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      
      {/* Ek Meta Etiketleri */}
      <meta name="author" content="GATE Transfer" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Ekstra Ek Meta Etiketleri */}
      {additionalMetaTags.map((tag, index) => (
        <meta key={`meta-${index}`} {...tag} />
      ))}
      
      {/* Preconnect ve DNS Prefetch */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {preconnectDomains.map((domain, index) => (
        <link key={`preconnect-${index}`} rel="preconnect" href={domain} crossOrigin="anonymous" />
      ))}
      
      {/* Schema.org JSON-LD */}
      {schemas.map((schema, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default UnifiedSEO;
