import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, StarIcon, PhoneIcon } from '@heroicons/react/24/outline';

const CityPageLayout = ({ 
  cityData, 
  children,
  heroSection,
  servicesSection,
  pricesSection,
  testimonialsSection,
  faqSection
}) => {
  const {
    name,
    slug,
    metaTitle,
    metaDescription,
    keywords,
    heroImage,
    shortDescription,
    popularDestinations,
    transferRoutes,
    distanceFromAirport,
    averageTransferTime,
    schema
  } = cityData;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://gatetransfer.com.tr/${slug}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`https://gatetransfer.com.tr/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={heroImage} />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={heroImage} />
        
        {/* JSON-LD Schema Markup */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {name} Transfer Hizmeti
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {shortDescription}
            </p>
            
            {/* Key Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <MapPinIcon className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Havalimanından Mesafe</h3>
                <p className="text-lg">{distanceFromAirport}</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <ClockIcon className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Ortalama Süre</h3>
                <p className="text-lg">{averageTransferTime}</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <StarIcon className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Müşteri Memnuniyeti</h3>
                <p className="text-lg">%98</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10">
              <Link
                to="/rezervasyon"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-900 bg-yellow-400 hover:bg-yellow-300 transition-colors duration-200"
              >
                Hemen Rezervasyon Yap
              </Link>
              <a
                href="tel:+905554443322"
                className="ml-4 inline-flex items-center px-6 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-900 transition-colors duration-200"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Hemen Ara
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Ana Sayfa
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link to="/hizmetlerimiz" className="text-gray-500 hover:text-gray-700">
                Hizmetlerimiz
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium">
              {name} Transfer
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Custom Hero Section if provided */}
        {heroSection && heroSection}

        {/* Popular Destinations Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {name} Popüler Destinasyonları ve Transfer Noktaları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations?.map((destination, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {destination.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {destination.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Mesafe: {destination.distance}</span>
                  <span>Süre: {destination.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transfer Routes Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {name} Transfer Güzergahları ve Ulaşım Seçenekleri
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {transferRoutes?.map((route, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {route.from} → {route.to}
                  </h3>
                  <p className="text-gray-600 mb-3">{route.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      {route.duration}
                    </span>
                    <span className="text-gray-500">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      {route.distance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Services Section */}
        {servicesSection && (
          <section className="mb-16">
            {servicesSection}
          </section>
        )}

        {/* Custom Prices Section */}
        {pricesSection && (
          <section className="mb-16">
            {pricesSection}
          </section>
        )}

        {/* Custom Testimonials Section */}
        {testimonialsSection && (
          <section className="mb-16">
            {testimonialsSection}
          </section>
        )}

        {/* Custom FAQ Section */}
        {faqSection && (
          <section className="mb-16">
            {faqSection}
          </section>
        )}

        {/* Additional Custom Content */}
        {children}

        {/* Contact CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            {name} Transfer Rezervasyonu
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Güvenli, konforlu ve uygun fiyatlı transfer hizmeti için hemen iletişime geçin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rezervasyon"
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Online Rezervasyon
            </Link>
            <a
              href="tel:+905554443322"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              +90 555 444 33 22
            </a>
            <a
              href="https://wa.me/905554443322"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default CityPageLayout;
