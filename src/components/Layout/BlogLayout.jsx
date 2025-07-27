import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const BlogLayout = ({ children, seo = {}, heroTitle, heroSubtitle }) => {
  const defaultSeo = {
    title: "GATE Transfer Blog | Antalya Transfer Rehberi ve Seyahat İpuçları",
    description: "Antalya transfer hizmetleri, destinasyon rehberleri, otel önerileri ve seyahat ipuçları. Kemer, Side, Belek, Alanya transfer bilgileri.",
    keywords: "antalya transfer blog, transfer rehberi, kemer side belek alanya, golf turizmi, seyahat ipuçları"
  };

  const finalSeo = { ...defaultSeo, ...seo };

  return (
    <>
      <Helmet>
        <title>{finalSeo.title}</title>
        <meta name="description" content={finalSeo.description} />
        <meta name="keywords" content={finalSeo.keywords} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={finalSeo.title} />
        <meta property="og:description" content={finalSeo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalSeo.title} />
        <meta name="twitter:description" content={finalSeo.description} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GATE Transfer" />
        <link rel="canonical" href={`https://gatetransfer.com${window.location.pathname}`} />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "GATE Transfer Blog",
            "description": "Antalya transfer hizmetleri ve seyahat rehberi blog",
            "url": "https://gatetransfer.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "GATE Transfer",
              "url": "https://gatetransfer.com"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
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

                {/* Blog specific badges */}
                {heroTitle.includes('Blog') && (
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/30">
                      🚗 Transfer Rehberi
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/30">
                      🏖️ Destinasyon Rehberleri
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/30">
                      ⛳ Golf Turizmi
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/30">
                      🏨 Otel Önerileri
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogLayout;
