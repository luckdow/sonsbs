import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail } from 'lucide-react';

const StaticPageLayout = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  children,
  showBackButton = true,
  heroTitle,
  heroSubtitle
}) => {
  const siteUrl = "https://www.gatetransfer.com";
  const companyPhone = "+90 532 574 26 82";
  const companyEmail = "info@sbstravel.net";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="GATE Transfer" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`${siteUrl}${canonicalUrl}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}${canonicalUrl}`} />
        <meta property="og:site_name" content="GATE Transfer" />
        <meta property="og:image" content={`${siteUrl}/images/gate-transfer-og.jpg`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/images/gate-transfer-og.jpg`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GATE Transfer",
            "legalName": "SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi",
            "url": siteUrl,
            "telephone": companyPhone,
            "email": companyEmail,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Güzelyurt Mah. Serik Cad. No: 138/2",
              "addressLocality": "Aksu",
              "addressRegion": "Antalya",
              "addressCountry": "TR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "36.8969",
              "longitude": "30.7133"
            },
            "serviceArea": "Antalya",
            "priceRange": "₺₺"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        {heroTitle && (
          <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 md:py-20">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {showBackButton && (
                <div className="mb-6">
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-2 text-blue-200 hover:text-white transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Ana Sayfaya Dön</span>
                  </Link>
                </div>
              )}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p className="text-lg md:text-xl lg:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                    {heroSubtitle}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <main className="relative">
          {children}
        </main>

        {/* Contact CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Size Nasıl Yardımcı Olabiliriz?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
              Antalya havalimanı transfer hizmetleri hakkında detaylı bilgi almak için bizimle iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rezervasyon"
                className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Hemen Rezervasyon Yap
              </Link>
              <a
                href={`tel:${companyPhone}`}
                className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {companyPhone}
              </a>
              <a
                href={`mailto:${companyEmail}`}
                className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                E-posta Gönder
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StaticPageLayout;
