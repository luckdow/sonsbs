import React, { lazy, Suspense, memo } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import LoadingScreen from '../../components/UI/LoadingScreen';
import SEOComponent from '../../components/Homepage/sections/SEOComponent';

// Preload critical components immediately
import HeroSection from '../../components/Homepage/sections/HeroSection';

// Lazy load non-critical components
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
const SectionLoader = memo(() => (
  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
));

const HomePage = memo(() => {
  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags - Critical, load immediately */}
        <SEOComponent language="tr" page="homepage" />
        
        {/* Hero Section - Critical, no lazy loading for immediate display */}
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
});

export default HomePage;
