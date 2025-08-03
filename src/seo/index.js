// SEO System Main Export
export { SEO_CONFIG, PAGE_SEO_TEMPLATES, SITEMAP_CONFIG } from './config/seoConfig.js';

export {
  generateOrganizationSchema,
  generateServiceSchema,
  generateCityTransferSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateAggregateRatingSchema,
  generateWebsiteSchema
} from './generators/schemaGenerator.js';

export {
  generateMetaTags,
  generateCityMetaTags,
  generateServiceMetaTags,
  generateBlogMetaTags,
  generateHrefLangTags
} from './generators/metaGenerator.js';

export {
  generateSitemap,
  generateCitySitemapEntries,
  generateServiceSitemapEntries,
  generateBlogSitemapEntries,
  generateStaticSitemapEntries,
  buildCompleteSitemap,
  generateSitemapIndex
} from './generators/sitemapGenerator.js';

export { default as SEOHead } from './components/SEOHead.jsx';
export { default as StructuredData } from './components/StructuredData.jsx';
