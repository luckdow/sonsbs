import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import HeroSection from '../../components/Homepage/sections/HeroSection';
import ServicesSection from '../../components/Homepage/sections/ServicesSection';
import FAQSection from '../../components/Homepage/sections/FAQSection';
import SEOComponent from '../../components/Homepage/sections/SEOComponent';

const HomePage = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags */}
        <SEOComponent language="tr" page="homepage" />
        
        {/* Hero Section with Quick Booking */}
        <HeroSection />
        
        {/* Services Section */}
        <ServicesSection />
        
        {/* FAQ Section */}
        <FAQSection />
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
