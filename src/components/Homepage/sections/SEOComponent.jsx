import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../../../data/seoData';

const SEOComponent = ({ language = 'tr', page = 'homepage' }) => {
  const data = seoData[language] || seoData.tr;
  const pageData = data.pages[page] || data.pages.homepage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TransportService",
    "name": data.siteName,
    "description": pageData.description,
    "url": data.siteUrl,
    "logo": `${data.siteUrl}/logo.png`,
    "image": `${data.siteUrl}/images/antalya-transfer-hero.jpg`,
    "telephone": "+905551234567",
    "email": "info@antalyatransfer.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Antalya Havalimanı",
      "addressLocality": "Antalya",
      "addressRegion": "Antalya",
      "postalCode": "07230",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.8983",
      "longitude": "30.7856"
    },
    "areaServed": [
      {
        "@type": "Place",
        "name": "Antalya"
      },
      {
        "@type": "Place", 
        "name": "Alanya"
      },
      {
        "@type": "Place",
        "name": "Side"
      },
      {
        "@type": "Place",
        "name": "Belek"
      },
      {
        "@type": "Place",
        "name": "Kemer"
      }
    ],
    "serviceType": "Airport Transfer Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": data.siteName,
      "image": `${data.siteUrl}/logo.png`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Antalya Havalimanı",
        "addressLocality": "Antalya",
        "addressRegion": "Antalya",
        "postalCode": "07230",
        "addressCountry": "TR"
      },
      "priceRange": "€15-€150",
      "telephone": "+905551234567",
      "email": "info@antalyatransfer.com",
      "url": data.siteUrl,
      "openingHours": "Mo-Su 00:00-23:59",
      "paymentAccepted": ["Cash", "Credit Card", "Online Payment"],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2500",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": "15",
      "description": "Airport transfer starting from €15",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Transfer Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfer",
            "description": "Airport to hotel transfer service"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "City Transfer",
            "description": "City center transfer service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "VIP Transfer",
            "description": "Luxury VIP transfer service"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      {/* Temel Meta Tags */}
      <title>{pageData.title}</title>
      <meta name="description" content={pageData.description} />
      <meta name="keywords" content={pageData.keywords.join(', ')} />
      <meta name="author" content={data.siteName} />
      <meta name="language" content={language} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageData.title} />
      <meta property="og:description" content={pageData.description} />
      <meta property="og:image" content={`${data.siteUrl}/images/antalya-transfer-hero.jpg`} />
      <meta property="og:url" content={data.siteUrl} />
      <meta property="og:site_name" content={data.siteName} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : `${language}_${language.toUpperCase()}`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageData.title} />
      <meta name="twitter:description" content={pageData.description} />
      <meta name="twitter:image" content={`${data.siteUrl}/images/antalya-transfer-hero.jpg`} />

      {/* Diğer Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="revisit-after" content="1 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />

      {/* Canonical */}
      <link rel="canonical" href={data.siteUrl} />

      {/* Hreflang için çoklu dil desteği */}
      <link rel="alternate" hrefLang="tr" href={`${data.siteUrl}`} />
      <link rel="alternate" hrefLang="en" href={`${data.siteUrl}/en`} />
      <link rel="alternate" hrefLang="ru" href={`${data.siteUrl}/ru`} />
      <link rel="alternate" hrefLang="de" href={`${data.siteUrl}/de`} />
      <link rel="alternate" hrefLang="ar" href={`${data.siteUrl}/ar`} />
      <link rel="alternate" hrefLang="ro" href={`${data.siteUrl}/ro`} />
      <link rel="alternate" hrefLang="pl" href={`${data.siteUrl}/pl`} />
      <link rel="alternate" hrefLang="x-default" href={data.siteUrl} />

      {/* JSON-LD Yapılandırılmış Veri */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Ek Yapılandırılmış Veri - BreadcrumbList */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Ana Sayfa",
              "item": data.siteUrl
            }
          ]
        })}
      </script>

      {/* Ek Yapılandırılmış Veri - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": data.siteName,
          "url": data.siteUrl,
          "logo": `${data.siteUrl}/logo.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+905551234567",
            "contactType": "customer service",
            "availableLanguage": ["Turkish", "English", "Russian", "German"]
          },
          "sameAs": [
            "https://www.facebook.com/antalyatransfer",
            "https://www.instagram.com/antalyatransfer",
            "https://www.twitter.com/antalyatransfer"
          ]
        })}
      </script>

      {/* Performance ve Güvenlik */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-tap-highlight" content="no" />

      {/* Favicon ve Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//maps.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />

      {/* Preload Critical Resources */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOComponent;
