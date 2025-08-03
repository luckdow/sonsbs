import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateMetaTags, generateHrefLangTags } from '../generators/metaGenerator.js';

const SEOHead = ({ 
  pageData,
  includeHrefLang = false,
  additionalMeta = {},
  children 
}) => {
  const metaTags = generateMetaTags(pageData);
  const hrefLangTags = includeHrefLang ? generateHrefLangTags(pageData.url) : [];

  return (
    <Helmet>
      {/* Temel Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="robots" content={metaTags.robots} />
      <link rel="canonical" href={metaTags.canonical} />
      
      {/* Viewport ve Charset */}
      <meta name="viewport" content={metaTags.additional.viewport} />
      <meta charSet={metaTags.additional.charset} />
      <meta name="googlebot" content={metaTags.additional.googlebot} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metaTags.openGraph.title} />
      <meta property="og:description" content={metaTags.openGraph.description} />
      <meta property="og:url" content={metaTags.openGraph.url} />
      <meta property="og:type" content={metaTags.openGraph.type} />
      <meta property="og:site_name" content={metaTags.openGraph.siteName} />
      <meta property="og:locale" content={metaTags.openGraph.locale} />
      
      {/* Open Graph Images */}
      {metaTags.openGraph.images.map((image, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={image.url} />
          <meta property="og:image:width" content={image.width} />
          <meta property="og:image:height" content={image.height} />
          <meta property="og:image:alt" content={image.alt} />
        </React.Fragment>
      ))}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:site" content={metaTags.twitter.site} />
      <meta name="twitter:creator" content={metaTags.twitter.creator} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      <meta name="twitter:image" content={metaTags.twitter.image} />
      
      {/* Ek Meta Tags */}
      {Object.entries(metaTags.additional).map(([name, content]) => 
        content && <meta key={name} name={name} content={content} />
      )}
      
      {/* Kullanıcı Tanımlı Ek Meta Tags */}
      {Object.entries(additionalMeta).map(([name, content]) => 
        content && <meta key={name} name={name} content={content} />
      )}
      
      {/* Hreflang Tags */}
      {hrefLangTags.map((tag, index) => (
        <link key={index} rel={tag.rel} hrefLang={tag.hrefLang} href={tag.href} />
      ))}
      
      {/* Özel İçerik */}
      {children}
    </Helmet>
  );
};

export { SEOHead };
export default SEOHead;
