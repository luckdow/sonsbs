import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { seoData } from '../../data/seoData';
import { 
  generateLocalBusinessSchema, 
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateArticleSchema,
  generateFAQSchema
} from '../../utils/enhancedSchemaMarkup';

const AdvancedSEO = ({ 
  page = 'homepage',
  language = 'tr',
  title,
  description,
  keywords,
  image,
  article,
  service,
  faq,
  customSchema,
  noIndex = false,
  canonical
}) => {
  const location = useLocation();
  const data = seoData[language] || seoData.tr;
  const pageData = data.pages[page] || data.pages.homepage;
  
  // Use custom data or fallback to page data
  const finalTitle = title || pageData.title;
  const finalDescription = description || pageData.description;
  const finalKeywords = keywords || pageData.keywords;
  const finalImage = image || `${data.siteUrl}/images/gate-transfer-og.jpg`;
  const currentUrl = `${data.siteUrl}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  // Generate schema markups based on page type
  const schemas = [];
  
  // Always include basic schemas
  schemas.push(generateLocalBusinessSchema());
  schemas.push(generateWebsiteSchema());
  
  // Add breadcrumb schema if not homepage
  if (page !== 'homepage') {
    schemas.push(generateBreadcrumbSchema(location.pathname, language));
  }
  
  // Add specific schemas based on content type
  if (service) {
    schemas.push(generateServiceSchema(service));
  }
  
  if (article) {
    schemas.push(generateArticleSchema(article));
  }
  
  if (faq && faq.length > 0) {
    schemas.push(generateFAQSchema(faq));
  }
  
  if (customSchema) {
    schemas.push(customSchema);
  }

  // Generate hreflang tags for multi-language support
  const hreflangTags = Object.keys(seoData).map(lang => {
    const url = lang === 'tr' ? currentUrl : currentUrl.replace('/tr/', `/${lang}/`);
    return (
      <link key={lang} rel="alternate" hrefLang={lang} href={url} />
    );
  });

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      
      {/* Enhanced SEO Tags */}
      <meta name="author" content="GATE Transfer" />
      <meta name="language" content={language} />
      <meta name="geo.region" content="TR-07" />
      <meta name="geo.placename" content="Antalya" />
      <meta name="geo.position" content="36.8841;30.7056" />
      <meta name="ICBM" content="36.8841, 30.7056" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:site_name" content={data.siteName} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : language === 'en' ? 'en_US' : `${language}_${language.toUpperCase()}`} />
      
      {/* Article specific OG tags */}
      {article && (
        <>
          <meta property="article:author" content={article.author || "GATE Transfer"} />
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:section" content={article.section || "Transfer"} />
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalTitle} />
      <meta name="twitter:creator" content="@gatetransfer" />
      <meta name="twitter:site" content="@gatetransfer" />
      
      {/* Advanced Meta Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Hreflang Tags */}
      {hreflangTags}
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//maps.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//firebase.googleapis.com" />
      
      {/* Preconnect for Critical Resources */}
      <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Schema Markup */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default AdvancedSEO;
