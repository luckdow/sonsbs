import React, { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import LoadingScreen from '../../components/UI/LoadingScreen';
import SEOComponent from '../../components/Homepage/sections/SEOComponent';

// Lazy load components for better performance
const HeroSection = lazy(() => import('../../components/Homepage/sections/HeroSection'));
const ServicesSection = lazy(() => import('../../components/Homepage/sections/ServicesSection'));
const TestimonialsSection = lazy(() => import('../../components/Homepage/sections/TestimonialsSection'));
const FAQSection = lazy(() => import('../../components/Homepage/sections/FAQSection'));

// Loading placeholder component
const SectionLoader = () => (
  <div className="w-full h-64 flex items-center justify-center bg-gray-50">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-gray-300 h-10 w-10"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags - Critical, load immediately */}
        <SEOComponent language="tr" page="homepage" />
        
        {/* Hero Section - Critical, load immediately */}
        <Suspense fallback={<LoadingScreen />}>
          <HeroSection />
        </Suspense>
        
        {/* Services Section - Lazy load with custom placeholder */}
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
