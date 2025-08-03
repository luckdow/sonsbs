import React, { lazy, Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import LoadingScreen from '../../components/UI/LoadingScreen';
import NewsletterSignup from '../../components/Newsletter/NewsletterSignup_NEW';
import { 
  SEOHead, 
  StructuredData, 
  generateOrganizationSchema, 
  generateBreadcrumbSchema,
  generateMetaTags 
} from '../../seo/index.js';

// Import critical above-the-fold component immediately
import HeroSection from '../../components/Homepage/sections/HeroSection';

// Lazy load below-the-fold components
const LocalSEOSection = lazy(() => 
  import('../../components/Homepage/sections/LocalSEOSection').then(module => ({
    default: module.default
  }))
);

const ServicesSection = lazy(() => 
  import('../../components/Homepage/sections/ServicesSection').then(module => ({
    default: module.default
  }))
);

const CitySection = lazy(() => 
  import('../../components/Homepage/sections/CitySection').then(module => ({
    default: module.default
  }))
);

const TestimonialsSection = lazy(() => 
  import('../../components/Homepage/sections/TestimonialsSection').then(module => ({
    default: module.default
  }))
);

const FAQSection = lazy(() => 
  import('../../components/Homepage/sections/FAQSection').then(module => ({
    default: module.default
  }))
);

// Optimized loading placeholder
const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center bg-gray-50">
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

const HomePage = () => {
  // Ana sayfa için SEO meta tags
  const homePageMetaTags = generateMetaTags({
    title: 'SBS Turkey Transfer | Antalya VIP Havalimanı Transfer Hizmeti',
    description: 'Antalya havalimanı transfer hizmeti. TURSAB onaylı güvenli ulaşım, konforlu araçlar, 7/24 profesyonel şoför hizmeti. Kemer, Side, Belek, Alanya transferi. Hemen rezervasyon yapın!',
    keywords: 'antalya transfer, havalimanı transfer, antalya airport transfer, gate transfer, vip transfer',
    url: '/',
    image: '/images/gate-transfer-homepage.jpg',
    type: 'website',
    pageType: 'home'
  });

  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://www.gatetransfer.com/' }
  ]);

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* Yeni SEO Sistemi */}
        <SEOHead 
          pageData={{
            title: homePageMetaTags.title,
            description: homePageMetaTags.description,
            keywords: homePageMetaTags.keywords,
            url: '/',
            image: '/images/gate-transfer-homepage.jpg',
            type: 'website'
          }}
          includeHrefLang={true}
        />
        
        {/* Schema.org Structured Data */}
        <StructuredData schema={organizationSchema} id="organization-schema" />
        <StructuredData schema={breadcrumbSchema} id="breadcrumb-schema" />
        
        {/* Hero Section - Above the fold */}
        <HeroSection />

        {/* Local SEO Section - Hero'nun hemen altında */}
        <Suspense fallback={<SectionLoader />}>
          <LocalSEOSection />
        </Suspense>

        {/* Main Content Sections - Mantıklı sıralama */}
        {/* 1. Hizmetlerimiz - İlk olarak ne sunduğumuzu göster */}
        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
        </Suspense>

        {/* 2. Popüler Şehirler - Hangi destinasyonlara gittigimizi göster */}
        <Suspense fallback={<SectionLoader />}>
          <CitySection />
        </Suspense>

        {/* 3. Müşteri Yorumları - Sosyal kanıt */}
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>

        {/* 4. Sık Sorulan Sorular - Son aşamadaki şüpheleri gider */}
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>

        {/* Newsletter Signup - Yeni tasarım */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <NewsletterSignup />
          </div>
        </div>

      </div>
    </HelmetProvider>
  );
};

export default HomePage;
