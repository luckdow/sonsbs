import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { Users, Bus, Calculator, ArrowRight, Shield, Clock, MapPin, Star } from 'lucide-react';
import { 
  SEOHead, 
  StructuredData, 
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateServiceMetaTags 
} from '../../seo/index.js';

const GrupTransfer = () => {
  const serviceData = servicesData['grup-transfer'];

  // SEO Meta Tags
  const grupTransferMetaTags = generateServiceMetaTags('Grup Transfer', {
    description: 'Antalya grup transfer hizmeti. 6-50 kişilik gruplar için Mercedes Sprinter, Vito ve otobüsler. Havalimanı transferi, günlük turlar, etkinlik ulaşımı. Uygun fiyat, güvenli hizmet.',
    price: '€90-300',
    features: ['Mercedes Sprinter', 'Grup İndirimi', 'Büyük Bagaj Alanı', 'Klimali Araçlar', 'Profesyonel Şoför']
  });

  // Schema.org Structured Data
  const grupTransferSchema = generateServiceSchema({
    serviceName: 'Grup Transfer Hizmeti',
    serviceType: 'GrupTransfer',
    description: grupTransferMetaTags.description,
    provider: 'SBS Turkey Transfer',
    areaServed: 'Antalya',
    price: '€90-300',
    features: ['6-50 kişi kapasiteli araçlar', 'Mercedes marka araç filosu', 'Grup indirimleri', 'Bagaj dahil', '7/24 hizmet']
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://www.gatetransfer.com/' },
    { name: 'Hizmetlerimiz', url: 'https://www.gatetransfer.com/hizmetlerimiz' },
    { name: 'Grup Transfer', url: 'https://www.gatetransfer.com/grup-transfer' }
  ]);

  // Group Vehicle Fleet
  const groupFleet = [
    {
      name: 'Mercedes Sprinter',
      category: 'Premium Minibus',
      capacity: '8-15 kişi',
      features: ['Klima sistemi', 'Bagaj alanı', 'USB şarj', 'Panoramic cam'],
      price: '€120-180',
      image: '/images/sprinter.jpg',
      ideal: 'Aile grupları, arkadaş grupları'
    },
    {
      name: 'Mercedes Vito',
      category: 'Compact Group',
      capacity: '6-8 kişi',
      features: ['Konforlu koltuklar', 'Klima', 'Bagaj bölümü', 'Müzik sistemi'],
      price: '€90-130',
      image: '/images/vito.jpg',
      ideal: 'Küçük gruplar, business trip'
    },
    {
      name: 'Ford Transit',
      category: 'Large Group',
      capacity: '12-20 kişi',
      features: ['Geniş iç alan', 'Yüksek bagaj kapasitesi', 'Individual klima', 'Reading light'],
      price: '€150-220',
      image: '/images/transit.jpg',
      ideal: 'Büyük gruplar, etkinlik katılımcıları'
    },
    {
      name: 'Midibus',
      category: 'Event Transport',
      capacity: '20-30 kişi',
      features: ['Tour otobüsü konforu', 'Mikrophone', 'TV/DVD', 'Geniş bagaj'],
      price: '€200-300',
      image: '/images/midibus.jpg',
      ideal: 'Kurumsal etkinlikler, düğün grupları'
    }
  ];

  // Group Advantages
  const groupAdvantages = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: 'Maliyet Avantajı',
      description: 'Grup halinde seyahat kişi başı maliyeti %60\'a kadar azaltır.',
      benefit: '%40-60 tasarruf'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Birlikte Seyahat',
      description: 'Tüm grup aynı araçta, aynı saatte, güvenli şekilde seyahat eder.',
      benefit: 'Grup bütünlüğü'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenli Transfer',
      description: 'Professional şoförler, sigortalı araçlar ve 24/7 destek.',
      benefit: '7/24 güvenlik'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Esnek Rotalar',
      description: 'Grup ihtiyaçlarına göre özel duraklar ve rota planlaması.',
      benefit: 'Özel planlama'
    }
  ];

  // Pricing Calculator Simulator
  const pricingExamples = [
    {
      groupName: '8 Kişi Aile',
      vehicle: 'Mercedes Sprinter',
      route: 'Havalimanı - Antalya Merkez',
      individual: '€25 x 8 = €200',
      groupPrice: '€120',
      saving: '€80 (%40 tasarruf)'
    },
    {
      groupName: '15 Kişi Arkadaş Grubu',
      vehicle: 'Mercedes Sprinter',
      route: 'Havalimanı - Kemer',
      individual: '€30 x 15 = €450',
      groupPrice: '€180',
      saving: '€270 (%60 tasarruf)'
    },
    {
      groupName: '25 Kişi Kurumsal',
      vehicle: 'Midibus',
      route: 'Havalimanı - Belek',
      individual: '€35 x 25 = €875',
      groupPrice: '€250',
      saving: '€625 (%70+ tasarruf)'
    }
  ];

  // Updated pricing for group transfers
  const updatedPricing = [
    {
      title: 'Küçük Grup',
      price: '€90-130',
      description: '6-8 kişilik gruplar için Mercedes Vito',
      features: [
        'Mercedes Vito araç',
        'Professional şoför',
        'Havalimanı karşılama',
        'Bagaj yardımı',
        'Klima sistemi',
        'Müzik çalma imkanı'
      ]
    },
    {
      title: 'Orta Grup',
      price: '€120-180',
      description: '8-15 kişilik gruplar için Mercedes Sprinter',
      features: [
        'Mercedes Sprinter',
        'Geniş bagaj alanı',
        'USB şarj noktaları',
        'Panoramic camlar',
        'Individual klima',
        'Grup organizasyon desteği'
      ]
    },
    {
      title: 'Büyük Grup',
      price: '€200-300',
      description: '20-30 kişilik gruplar için Midibus',
      features: [
        'Midibus araç',
        'Tour konforu',
        'Mikrophone sistemi',
        'TV/Entertainment',
        'Yüksek bagaj kapasitesi',
        'Etkinlik transfer desteği'
      ]
    }
  ];

  // Updated FAQ for group transfers
  const updatedFaq = [
    {
      question: 'Grup transfer rezervasyonu nasıl yapılır?',
      answer: 'Grup transferi için minimum 24 saat öncesinden rezervasyon yapmanız gerekmektedir. Grup büyüklüğü, transfer tarihi, saati ve güzergahını belirterek +90 532 574 26 82 numarası üzerinden veya WhatsApp ile iletişime geçebilirsiniz.'
    },
    {
      question: 'Minimum kaç kişilik grup için hizmet veriyorsunuz?',
      answer: 'Grup transfer hizmeti minimum 6 kişi için başlamaktadır. 6-8 kişi için Mercedes Vito, 8-15 kişi için Mercedes Sprinter, 15+ kişi için büyük araçlar kullanılmaktadır. Maksimum 30 kişiye kadar hizmet verebiliyoruz.'
    },
    {
      question: 'Grup transferinde maliyet avantajı nedir?',
      answer: 'Grup transferi, individual transferlere göre %40-70 arası maliyet avantajı sağlar. 8 kişilik bir grup için individual transfer €200 iken grup transferi €120\'den başlamaktadır. Grup büyüdükçe kişi başı maliyet düşer.'
    },
    {
      question: 'Ara durak yapabilir miyiz?',
      answer: 'Evet, grup transfer güzergahında makul süre içinde ara duraklar yapılabilir. Market, restoran, manzara noktası gibi duraklar önceden belirtilmesi durumunda ek ücret almadan gerçekleştirilebilir.'
    },
    {
      question: 'Bagaj limiti var mı?',
      answer: 'Grup transferlerinde kişi başı 1 büyük valiz + 1 el çantası ücretsizdir. Fazla bagaj durumunda araç kapasitesine göre ek bagaj alanı planlanır. Özel bagaj durumları rezervasyon sırasında belirtilmelidir.'
    }
  ];

  return (
    <div>
      {/* SEO Head */}
      <SEOHead 
        pageData={{
          title: grupTransferMetaTags.title,
          description: grupTransferMetaTags.description,
          keywords: grupTransferMetaTags.keywords,
          url: '/grup-transfer',
          image: '/images/grup-transfer.jpg',
          type: 'service'
        }}
        includeHrefLang={true}
      />
      
      {/* Schema.org Structured Data */}
      <StructuredData schema={grupTransferSchema} id="grup-transfer-schema" />
      <StructuredData schema={breadcrumbSchema} id="breadcrumb-schema" />

      <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Grup Transfer Hizmeti Nedir?</h2>
          <p className="mb-4">
            <strong>Grup Transfer hizmeti</strong>, 8-50 kişilik gruplar için özel olarak tasarlanmış ekonomik ve konforlu 
            ulaşım çözümüdür. Mercedes Sprinter, Midibus ve Otobüs araçlarımızla büyük grupları tek seferde taşıyarak 
            hem maliyet avantajı hem de organizasyon kolaylığı sağlıyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Grup Transfer Avantajları</h3>
          <p className="mb-4">
            Grup transferinde bireysel transferlere göre %40-60 tasarruf sağlarsınız. Özellikle aile grupları, 
            arkadaş grupları, düğün konvoyları ve kurumsal etkinlikler için ideal çözümüz. Tüm grup üyeleri 
            aynı araçta seyahat ederek sosyal bağları güçlendirir ve keyifli vakit geçirirler.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Grup Transfer Araç Seçenekleri</h3>
          <p className="mb-4">
            8-12 kişi için Mercedes Sprinter, 13-19 kişi için Midibus, 20-50 kişi için modern otobüs filomuz 
            mevcuttur. Tüm araçlarımız klimalı, konforlu koltuklu ve bagaj alanı geniştir. Özel istekler 
            doğrultusunda TV, ses sistemi gibi ekstra hizmetler sunabilmekteyiz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Grup Transfer Fiyatları</h3>
          <p className="mb-4">
            Grup transfer fiyatlarımız kişi sayısına ve güzergaha göre değişir. Havalimanı transferlerinde 
            8 kişi €120, 15 kişi €180, 25 kişi €250 gibi sabit fiyatlarımız mevcuttur. Gidiş-dönüş 
            rezervasyonlarda %20 indirim, 3 gün önceden rezervasyonda %15 erken rezervasyon indirimi uygulanır.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Online Grup Rezervasyonu</h3>
          <p className="mb-4">
            Grup rezervasyonu için +90 532 574 26 82 numaralı WhatsApp hattımızdan bizimle iletişime geçin. 
            Detaylı bilgi alarak özel teklifimizi alabilirsiniz. Ödeme kolaylığı için nakit, kredi kartı 
            ve banka havalesi seçenekleri mevcuttur.
          </p>
        </div>
      }
    >
      {/* Group Fleet Showcase */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grup Transfer Araç Filomuz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her grup büyüklüğü için uygun araç seçenekleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupFleet.map((vehicle, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bus className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                        {vehicle.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" />
                      {vehicle.capacity}
                    </p>
                    <p className="text-sm text-gray-500">{vehicle.ideal}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{vehicle.price}</div>
                    <div className="text-sm text-gray-500">transfer başına</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  Grup Rezervasyonu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Advantages */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grup Transfer Avantajları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Neden grup halinde transfer tercih etmelisiniz?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {groupAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{advantage.description}</p>
                <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {advantage.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Maliyet Karşılaştırması
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Grup transferi ile ne kadar tasarruf edersiniz?
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{example.groupName}</h3>
                  <p className="text-gray-600">{example.vehicle}</p>
                  <p className="text-sm text-gray-500">{example.route}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Individual Transfer:</span>
                    <span className="font-semibold text-red-600">{example.individual}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Grup Transfer:</span>
                    <span className="font-semibold text-green-600">{example.groupPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900 font-semibold">Tasarruf:</span>
                    <span className="font-bold text-green-600 text-lg">{example.saving}</span>
                  </div>
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Bu Fiyata Rezervasyon
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Transfer Process */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grup Transfer Süreciniz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rezervasyondan teslim noktasına kadar adım adım süreç
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Grup Bilgileri',
                description: 'Grup büyüklüğü, transfer tarihi ve güzergah bilgilerini paylaşın.'
              },
              {
                step: '2',
                title: 'Araç Seçimi',
                description: 'Grup büyüklüğünüze uygun araç önerisini onaylayın.'
              },
              {
                step: '3',
                title: 'Rezervasyon Onayı',
                description: 'Rezervasyon detayları, şoför bilgileri ve iletişim numarası paylaşılır.'
              },
              {
                step: '4',
                title: 'Transfer Günü',
                description: 'Şoförünüz belirlenen noktada hazır bekler, grup karşılanır.'
              },
              {
                step: '5',
                title: 'Güvenli Transfer',
                description: 'Professional şoför eşliğinde konforlu ve güvenli yolculuk.'
              },
              {
                step: '6',
                title: 'Hedef Teslimi',
                description: 'Grup otelinize/hedef noktasına güvenle teslim edilir.'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
    </div>
  );
};

export default GrupTransfer;
