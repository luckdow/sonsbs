import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEOManager = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage,
  schemaMarkup,
  noindex = false,
  hreflang = []
}) => {
  const location = useLocation();
  const currentUrl = `https://gatetransfer.com${location.pathname}`;
  
  // Default values
  const defaultTitle = "GATE Transfer - Antalya Havalimanı Transfer Hizmetleri";
  const defaultDescription = "Antalya havalimanı transfer hizmetleri. Güvenli, konforlu ve ekonomik transfer seçenekleri ile havalimanından otel ve şehir merkezlerine ulaşım.";
  const defaultKeywords = "antalya transfer, havalimanı transfer, AYT transfer, antalya ulaşım, özel transfer";
  const defaultOgImage = "https://gatetransfer.com/images/gate-transfer-og.jpg";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalCanonicalUrl = canonicalUrl || currentUrl;
  const finalOgImage = ogImage || defaultOgImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="GATE Transfer" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalOgImage} />
      <meta property="twitter:creator" content="@gatetransfer" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="GATE Transfer" />
      <meta name="language" content="Turkish" />
      <meta name="geo.region" content="TR-07" />
      <meta name="geo.placename" content="Antalya" />
      <meta name="geo.position" content="36.8841;30.7056" />
      <meta name="ICBM" content="36.8841, 30.7056" />
      
      {/* hreflang tags for multi-language */}
      {hreflang.length > 0 && hreflang.map((lang) => (
        <link 
          key={lang.lang}
          rel="alternate" 
          hreflang={lang.lang} 
          href={lang.url} 
        />
      ))}
      
      {/* Schema markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
      
      {/* Additional resource hints */}
      <link rel="dns-prefetch" href="//maps.googleapis.com" />
      <link rel="dns-prefetch" href="//firebase.googleapis.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="" />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Helmet>
  );
};

export default SEOManager;
