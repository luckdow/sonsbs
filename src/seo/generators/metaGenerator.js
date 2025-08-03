import { SEO_CONFIG, PAGE_SEO_TEMPLATES } from '../config/seoConfig.js';

// Ana Meta Tag Generator
export const generateMetaTags = (pageData) => {
  const {
    title,
    description,
    keywords,
    url,
    image,
    type = 'website',
    pageType = 'default',
    publishDate,
    modifiedDate,
    author,
    noindex = false
  } = pageData;

  // Template'den title ve description oluştur
  const finalTitle = title || generateTitle(pageData.titleData, pageType);
  const finalDescription = description || generateDescription(pageData.descriptionData, pageType);
  const finalKeywords = keywords || generateKeywords(pageData.keywordsData, pageType);
  
  const fullUrl = url && url.startsWith('http') ? url : `${SEO_CONFIG.siteUrl}${url || '/'}`;
  const finalImage = image && image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image || SEO_CONFIG.openGraph.defaultImage}`;

  return {
    // Temel Meta Tags
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    canonical: fullUrl,
    robots: noindex ? 'noindex, nofollow' : SEO_CONFIG.meta.robots,
    
    // Open Graph Tags
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: fullUrl,
      type: type,
      siteName: SEO_CONFIG.openGraph.siteName,
      locale: SEO_CONFIG.openGraph.locale,
      images: [{
        url: finalImage,
        width: SEO_CONFIG.openGraph.imageWidth,
        height: SEO_CONFIG.openGraph.imageHeight,
        alt: finalTitle
      }]
    },
    
    // Twitter Card Tags
    twitter: {
      card: SEO_CONFIG.twitter.card,
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
      title: finalTitle,
      description: finalDescription,
      image: finalImage
    },
    
    // Ek Meta Tags
    additional: {
      ...(author && { author }),
      ...(publishDate && { 'article:published_time': publishDate }),
      ...(modifiedDate && { 'article:modified_time': modifiedDate }),
      'viewport': SEO_CONFIG.meta.viewport,
      'charset': SEO_CONFIG.meta.charset,
      'googlebot': SEO_CONFIG.meta.googlebot
    }
  };
};

// Title Generator
const generateTitle = (titleData, pageType) => {
  if (!titleData || !PAGE_SEO_TEMPLATES[pageType]) {
    return SEO_CONFIG.defaultTitle;
  }
  
  const template = PAGE_SEO_TEMPLATES[pageType].titleTemplate;
  return template.replace('%s', titleData);
};

// Description Generator  
const generateDescription = (descriptionData, pageType) => {
  if (!descriptionData || !PAGE_SEO_TEMPLATES[pageType]) {
    return SEO_CONFIG.defaultDescription;
  }
  
  const template = PAGE_SEO_TEMPLATES[pageType].descriptionTemplate;
  return template.replace('%s', descriptionData);
};

// Keywords Generator
const generateKeywords = (keywordsData, pageType) => {
  if (!keywordsData || !PAGE_SEO_TEMPLATES[pageType]) {
    return SEO_CONFIG.defaultKeywords;
  }
  
  const template = PAGE_SEO_TEMPLATES[pageType].keywordsTemplate;
  const generated = template.replace(/%s/g, keywordsData);
  return `${generated}, ${SEO_CONFIG.defaultKeywords}`;
};

// Şehir Sayfaları için Özel Meta Generator
export const generateCityMetaTags = (cityName, cityData = {}) => {
  const {
    distance = '45 km',
    duration = '35 dakika', 
    price = '€30',
    description,
    image
  } = cityData;

  const titleData = cityName.replace('-transfer', '').replace('-', ' ');
  const customDescription = description || 
    `Antalya Havalimanı'ndan ${titleData} bölgesine güvenli transfer. ${distance} mesafe, ${duration} süre, ${price} başlangıç fiyatı. 7/24 destek, ücretsiz iptal.`;

  return generateMetaTags({
    titleData,
    descriptionData: titleData,
    keywordsData: titleData.toLowerCase(),
    url: `/${cityName}`,
    image: image || `/images/cities/${cityName}.jpg`,
    pageType: 'city',
    description: customDescription
  });
};

// Hizmet Sayfaları için Özel Meta Generator
export const generateServiceMetaTags = (serviceName, serviceData = {}) => {
  const {
    description,
    image,
    price,
    features = []
  } = serviceData;

  const customDescription = description ||
    `${serviceName} hizmeti ile güvenli yolculuk. Profesyonel şoförler, modern araçlar, 7/24 destek. ${price ? `${price} başlangıç fiyatı.` : ''}`;

  return generateMetaTags({
    titleData: serviceName,
    descriptionData: serviceName,
    keywordsData: serviceName.toLowerCase(),
    url: `/hizmetler/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
    image: image || `/images/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    pageType: 'service',
    description: customDescription
  });
};

// Blog Sayfaları için Özel Meta Generator
export const generateBlogMetaTags = (blogPost) => {
  const {
    title,
    excerpt,
    slug,
    featuredImage,
    publishDate,
    modifiedDate,
    author,
    tags = []
  } = blogPost;

  const keywords = tags.length > 0 ? tags.join(', ') : title.toLowerCase();

  return generateMetaTags({
    title,
    description: excerpt,
    keywords,
    url: `/blog/${slug}`,
    image: featuredImage,
    type: 'article',
    publishDate,
    modifiedDate,
    author
  });
};

// Dil Alternatifleri Generator
export const generateHrefLangTags = (currentUrl, supportedLanguages = SEO_CONFIG.languages.supported) => {
  const hrefLangs = supportedLanguages.map(lang => ({
    rel: 'alternate',
    hrefLang: lang,
    href: lang === SEO_CONFIG.languages.default 
      ? `${SEO_CONFIG.siteUrl}${currentUrl}`
      : `${SEO_CONFIG.siteUrl}/${lang}${currentUrl}`
  }));

  // x-default ekle
  hrefLangs.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: `${SEO_CONFIG.siteUrl}${currentUrl}`
  });

  return hrefLangs;
};
