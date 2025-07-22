import React, { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import LoadingScreen from '../../components/UI/LoadingScreen';
import SEOComponent from '../../components/Homepage/sections/SEOComponent';

// Import critical above-the-fold component immediately
import HeroSection from '../../components/Homepage/sections/HeroSection';

// Lazy load below-the-fold components
const ServicesSection = lazy(() => 
  import('../../components/Homepage/sections/ServicesSection').then(module => ({
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
  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags - Critical */}
        <SEOComponent language="tr" page="homepage" />
        
        {/* Hero Section - Critical, no lazy loading */}
        <HeroSection />
        
        {/* Services Section - Lazy load with intersection observer */}
        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
        </Suspense>
        
        {/* Testimonials Section - Lazy load */}
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>
        
        {/* FAQ Section - Lazy load */}
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
