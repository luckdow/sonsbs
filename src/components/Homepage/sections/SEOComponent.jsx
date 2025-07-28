import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../../../data/seoData';
import { generateLocalBusinessSchema, generateWebsiteSchema } from '../../../utils/schemaMarkup';

const SEOComponent = ({ language = 'tr', page = 'homepage' }) => {
  const data = seoData[language] || seoData.tr;
  const pageData = data.pages[page] || data.pages.homepage;
  
  // Generate enhanced schema markup
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageData.title}</title>
      <meta name="title" content={pageData.title} />
      <meta name="description" content={pageData.description} />
      <meta name="keywords" content={pageData.keywords} />
      
      {/* Enhanced SEO Tags */}
      <meta name="author" content="SBS Turkey Transfer" />
      <meta name="language" content={language} />
      <meta name="geo.region" content="TR-07" />
      <meta name="geo.placename" content="Antalya" />
      <meta name="geo.position" content="36.8841;30.7056" />
      <meta name="ICBM" content="36.8841, 30.7056" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${data.siteUrl}${page === 'homepage' ? '' : `/${page}`}`} />
      <meta property="og:title" content={pageData.title} />
      <meta property="og:description" content={pageData.description} />
      <meta property="og:image" content={`${data.siteUrl}/images/sbs-turkey-transfer-og.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={data.siteName} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${data.siteUrl}${page === 'homepage' ? '' : `/${page}`}`} />
      <meta property="twitter:title" content={pageData.title} />
      <meta property="twitter:description" content={pageData.description} />
      <meta property="twitter:image" content={`${data.siteUrl}/images/sbs-turkey-transfer-og.jpg`} />
      <meta property="twitter:creator" content="@sbsturkeytransfer" />
      
      {/* Additional Performance Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${data.siteUrl}${page === 'homepage' ? '' : `/${page}`}`} />
      
      {/* Enhanced Resource Hints */}
      <link rel="dns-prefetch" href="//maps.googleapis.com" />
      <link rel="dns-prefetch" href="//firebase.googleapis.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="" />
      
      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default SEOComponent;
