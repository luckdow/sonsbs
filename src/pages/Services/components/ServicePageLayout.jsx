import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Phone, Mail, Calendar, ArrowRight, CheckCircle, Star, Shield, Clock, Users, Car, Award } from 'lucide-react';

const ServicePageLayout = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  children,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroIcon,
  serviceFeatures = [],
  whyChooseUs = [],
  pricing = [],
  faq = [],
  seoContent = null
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
        <link rel="canonical" href={`${siteUrl}${canonicalUrl}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${siteUrl}${canonicalUrl}`} />
        <meta property="og:type" content="service" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": heroTitle,
            "description": description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "GATE Transfer - SBS Turkey Turizm",
              "url": siteUrl,
              "telephone": companyPhone,
              "email": companyEmail,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Güzelyurt Mah. Serik Cad. No: 138/2",
                "addressLocality": "Aksu",
                "addressRegion": "Antalya",
                "addressCountry": "TR"
              }
            },
            "areaServed": "Antalya, Turkey",
            "serviceType": "Transportation Service"
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
                <ol className="flex items-center space-x-1 md:space-x-3">
                  <li className="flex items-center">
                    <Link 
                      to="/" 
                      className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Ana Sayfa
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <Link 
                      to="/hizmetlerimiz" 
                      className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Hizmetlerimiz
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm font-medium text-white">{heroTitle}</span>
                  </li>
                </ol>
              </nav>
              
              <div className="text-center">
                {heroIcon && (
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                    {heroIcon}
                    GATE Transfer Professional
                  </div>
                )}
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {heroTitle}
                  </span>
                </h1>
                
                {heroSubtitle && (
                  <h2 className="text-xl md:text-2xl text-white font-medium mb-4">
                    {heroSubtitle}
                  </h2>
                )}
                
                {heroDescription && (
                  <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                    {heroDescription}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                  <Link
                    to="/rezervasyon"
                    onClick={() => window.scrollTo(0, 0)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    <Calendar className="w-5 h-5" />
                    Hemen Rezervasyon
                  </Link>
                  
                  <a
                    href={`tel:${companyPhone}`}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                    {companyPhone}
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Service Features */}
        {serviceFeatures.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Hizmet Özellikleri
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Profesyonel {heroTitle.toLowerCase()} hizmetimizin avantajları
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        {children}

        {/* Why Choose Us */}
        {whyChooseUs.length > 0 && (
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Neden GATE Transfer?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {heroTitle} hizmetimizde fark yaratan özellikler
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {pricing.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Fiyat Bilgileri
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {heroTitle} hizmetimiz için şeffaf fiyatlandırma
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pricing.map((plan, index) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to="/rezervasyon"
                      onClick={() => window.scrollTo(0, 0)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      Rezervasyon Yap
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Sık Sorulan Sorular
                </h2>
                <p className="text-lg text-gray-600">
                  {heroTitle} hakkında merak edilenler
                </p>
              </div>
              
              <div className="space-y-6">
                {faq.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO Content Section */}
        {seoContent && (
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg prose-blue max-w-none">
                {seoContent}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <Award className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Türkiye'nin En Güvenilir Transfer Firması
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                2847+ memnun müşteri, %99 memnuniyet oranı ile {heroTitle.toLowerCase()} hizmetinde lider firma. 
                TURSAB üyesi güvencesi ile hemen rezervasyon yapın.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/rezervasyon"
                onClick={() => window.scrollTo(0, 0)}
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Online Rezervasyon
              </Link>
              
              <a
                href={`tel:${companyPhone}`}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                {companyPhone}
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-1 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2">4.9/5 ⭐ (2,847+ Google değerlendirmesi)</span>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                🏆 2024 Türkiye En İyi Transfer Firması Ödülü Sahibi
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePageLayout;
