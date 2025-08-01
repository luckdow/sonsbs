import React, { lazy, Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import LoadingScreen from '../../components/UI/LoadingScreen';
import SEOComponent from '../../components/Homepage/sections/SEOComponent';
import NewsletterSignup from '../../components/Newsletter/NewsletterSignup_NEW';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../../utils/seoUtils';

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
  const localBusinessSchema = generateLocalBusinessSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://gatetransfer.com' }
  ]);

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags - Critical */}
        <SEOComponent language="tr" page="homepage" />
        
        {/* Enhanced Schema.org JSON-LD */}
        <Helmet>
          {/* Primary SEO Tags */}
          <title>SBS Turkey Transfer | Antalya VIP Havalimanı Transfer Hizmeti</title>
          <meta name="description" content="Antalya havalimanı transfer hizmeti. TURSAB onaylı güvenli ulaşım, konforlu araçlar, 7/24 profesyonel şoför hizmeti. Kemer, Side, Belek, Alanya transferi. Hemen rezervasyon yapın!" />
          <link rel="canonical" href="https://www.gatetransfer.com/" />
          
          <script type="application/ld+json">
            {JSON.stringify(localBusinessSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
          
          {/* Additional SEO enhancements */}
          <meta property="og:title" content="SBS Turkey Transfer | Antalya VIP Transfer" />
          <meta property="og:description" content="Antalya'nın en güvenilir transfer hizmeti. TURSAB onaylı, 7/24 hizmet." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.gatetransfer.com/" />
          <meta property="og:image" content="https://www.gatetransfer.com/images/sbs-transfer-og.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="geo.region" content="TR-07" />
          <meta name="geo.placename" content="Antalya" />
          <meta name="ICBM" content="36.8841, 30.7056" />
          
          {/* Hreflang for multilingual SEO */}
          <link rel="alternate" hrefLang="tr" href="https://gatetransfer.com" />
          <link rel="alternate" hrefLang="en" href="https://gatetransfer.com/en" />
          <link rel="alternate" hrefLang="x-default" href="https://gatetransfer.com" />
        </Helmet>

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
