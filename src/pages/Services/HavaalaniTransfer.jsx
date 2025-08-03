import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Euro, Star, ArrowRight, Car, Users, Shield } from 'lucide-react';
import { SEOHead, StructuredData, generateServiceSchema, generateServiceMetaTags } from '../../seo/index.js';

const HavaalaniTransfer = () => {
  const serviceData = servicesData['havaalani-transfer'];
  
  // Yeni SEO Meta Tags
  const seoMetaTags = generateServiceMetaTags('Antalya Havalimanı Transfer', {
    description: 'Antalya havalimanından tüm bölgelere güvenli, konforlu ve ekonomik transfer hizmeti. 7/24 destek, profesyonel şoförler, ücretsiz iptal.',
    price: '€20',
    features: ['7/24 Hizmet', 'Profesyonel Şoförler', 'Modern Araçlar', 'Ücretsiz İptal']
  });
  
  // Service schema oluştur
  const serviceSchema = generateServiceSchema(
    'Antalya Havalimanı Transfer',
    'Antalya havalimanından otellere güvenli, konforlu ve ekonomik transfer hizmeti. 7/24 hizmet, profesyonel şoförler.',
    'https://www.gatetransfer.com/hizmetler/havaalani-transfer',
    '€20'
  );

  // Popular destinations with pricing
  const destinations = [
    {
      name: 'Antalya Merkez',
      distance: '12 km',
      time: '20 dk',
      price: '€20-25',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Şehir merkezi, Kaleiçi ve marina bölgesine hızlı ulaşım'
    },
    {
      name: 'Lara Beach',
      distance: '15 km',
      time: '25 dk',
      price: '€25-30',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Lara sahil şeridi ve lüks resort otellere transfer'
    },
    {
      name: 'Konyaaltı',
      distance: '18 km',
      time: '30 dk',
      price: '€25-35',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Konyaaltı sahili ve otel bölgesine konforlu yolculuk'
    },
    {
      name: 'Kemer',
      distance: '60 km',
      time: '1.5 saat',
      price: '€45-65',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Toros Dağları eteğinde doğa ile iç içe tatil bölgesi'
    },
    {
      name: 'Belek',
      distance: '35 km',
      time: '45 dk',
      price: '€35-50',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Golf sahaları ve lüks resort\'ların merkezi'
    },
    {
      name: 'Side',
      distance: '65 km',
      time: '1.2 saat',
      price: '€60-85',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Antik Side kenti ve tarihi kalıntıların adresi'
    },
    {
      name: 'Alanya',
      distance: '120 km',
      time: '2 saat',
      price: '€90-120',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Tarihi Alanya kalesi ve güzel plajların bulunduğu şehir'
    },
    {
      name: 'Kaş',
      distance: '190 km',
      time: '3 saat',
      price: '€150-200',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Dalış turizmi ve butik otellerin merkezi sakin kasaba'
    }
  ];

  // Statistics
  const stats = [
    { number: '50,000+', label: 'Başarılı Transfer', icon: <Car className="w-6 h-6" /> },
    { number: '99%', label: 'Memnuniyet Oranı', icon: <Star className="w-6 h-6" /> },
    { number: '7/24', label: 'Kesintisiz Hizmet', icon: <Clock className="w-6 h-6" /> },
    { number: '12 Yıl', label: 'Deneyim', icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHead 
        pageData={{
          titleData: 'Antalya Havalimanı Transfer',
          descriptionData: 'Antalya Havalimanı Transfer',
          keywordsData: 'antalya havalimanı transfer',
          url: '/hizmetler/havaalani-transfer',
          image: '/images/services/havaalani-transfer.jpg',
          pageType: 'service'
        }}
        includeHrefLang={true}
      />
      
      {/* Schema.org Structured Data */}
      <StructuredData schema={serviceSchema} id="service-schema" />
      
      <ServicePageLayout 
        {...serviceData}
        seoContent={
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Antalya Havalimanı Transfer Hizmeti</h2>
            <p className="mb-4">
              <strong>Antalya Havalimanı Transfer</strong> hizmetimiz ile Antalya Havalimanı'ndan tüm otel bölgelerine 
              7/24 güvenli ve konforlu ulaşım sağlıyoruz. 12 yıllık deneyimimiz ve %99 müşteri memnuniyet oranımızla 
              Antalya'nın en güvenilir transfer firmasıyız.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Antalya Havalimanı Transfer Güzergahları</h3>
            <p className="mb-4">
              Antalya Havalimanı'ndan Lara, Kundu, Kemer, Belek, Side, Alanya, Kaş, Kalkan ve tüm turistik 
              bölgelere transfer hizmeti veriyoruz. VIP araçlarımızla Meet & Greet hizmeti ile havalimanında 
              karşılıyor, bagajlarınızı taşıyarak size özel transfer deneyimi sunuyoruz.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Havalimanı Transfer Fiyatları 2024</h3>
            <p className="mb-4">
              Antalya Havalimanı transfer fiyatlarımız €15-80 arasında değişmektedir. Havalimanı-Lara €15-25, 
              Havalimanı-Kemer €25-40, Havalimanı-Side €30-50, Havalimanı-Alanya €50-80 fiyat aralığındadır. 
              Grup transferlerinde ve gidiş-dönüş rezervasyonlarda özel indirimler uygulanır.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Online Rezervasyon Avantajları</h3>
            <p className="mb-4">
              Online rezervasyon sistemimizle %15 erken rezervasyon indirimi kazanın. Ücretsiz iptal, 
              güvenli ödeme, 7/24 müşteri destek hattımız +90 532 574 26 82 ile sizlere hizmet veriyoruz. 
              TURSAB üyesi güvencesiyle kaliteli hizmet garantisi sunuyoruz.
            </p>
          </div>
        }
      >
      {/* Destinations & Pricing */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Havalimanı Transfer Destinasyonları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya Havalimanı'ndan popüler turistik bölgelere sabit fiyat garantili transfer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {destination.icon}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {destination.time}
                    </div>
                    <div className="text-lg font-bold text-green-600">{destination.price}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{destination.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                <Link 
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 group transition-all duration-300"
                >
                  Rezervasyon Yap
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-gray-600 mb-4">
              * Fiyatlar araç tipine ve yolcu sayısına göre değişebilir. Kesin fiyat için iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+905325742682"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                <Clock className="w-5 h-5" />
                Anında Fiyat: +90 532 574 26 82
              </a>
              <Link
                to="/rezervasyon"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                <Euro className="w-5 h-5" />
                Online Rezervasyon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Güvenilir Transfer Deneyimi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              12 yıllık deneyimimizle binlerce mutlu müşteriye hizmet verdik
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transfer Süreciniz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Havalimanından otelinize kadar adım adım transfer deneyiminiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Online Rezervasyon',
                description: 'Uçuş bilgilerinizi girerek 5 dakikada rezervasyon tamamlayın'
              },
              {
                step: '2',
                title: 'Uçuş Takibi',
                description: 'Uçuşunuzu takip eder, gecikmeli seferlerde otomatik ayarlama yaparız'
              },
              {
                step: '3',
                title: 'Karşılama',
                description: 'Terminal çıkışında isminizin yazılı tabela ile professional karşılama'
              },
              {
                step: '4',
                title: 'Güvenli Transfer',
                description: 'Temiz, konforlu araçlarla otelinize güvenli ve hızlı ulaşım'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{process.title}</h3>
                <p className="text-gray-600 leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ServicePageLayout>
    </>
  );
};

export default HavaalaniTransfer;
