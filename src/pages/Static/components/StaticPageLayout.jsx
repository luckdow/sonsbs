import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const StaticPageLayout = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  children,
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
          <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-8 md:py-12 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
            </div>
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Breadcrumb */}
              <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link 
                      to="/" 
                      className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Ana Sayfa
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm font-medium text-white">{heroTitle}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {heroTitle}
                  </span>
                </h1>
                
                {heroSubtitle && (
                  <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
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
