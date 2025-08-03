import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { Crown, Car, Star, ArrowRight, Wine, Shield, Users, Clock } from 'lucide-react';
import { 
  SEOHead, 
  StructuredData, 
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateServiceMetaTags 
} from '../../seo/index.js';

const VipTransfer = () => {
  const serviceData = servicesData['vip-transfer'];

  // SEO Meta Tags
  const vipTransferMetaTags = generateServiceMetaTags('VIP Transfer', {
    description: 'Antalya VIP transfer hizmeti. Mercedes S-Class, Maybach ve lüks araçlarla havalimanı transferi. Özel şoför, fast-track hizmet, premium konfor. 7/24 rezervasyon.',
    price: '€80-200',
    features: ['Mercedes S-Class', 'VIP Terminal', 'Özel Şoför', 'Fast Track', 'Premium Konfor']
  });

  // Schema.org Structured Data
  const vipTransferSchema = generateServiceSchema({
    serviceName: 'VIP Transfer Hizmeti',
    serviceType: 'VipTransfer',
    description: vipTransferMetaTags.description,
    provider: 'SBS Turkey Transfer',
    areaServed: 'Antalya',
    price: '€80-200',
    features: ['Mercedes lüks araçlar', 'VIP terminal hizmeti', 'Profesyonel şoför', 'Fast-track geçiş', '7/24 hizmet']
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://www.gatetransfer.com/' },
    { name: 'Hizmetlerimiz', url: 'https://www.gatetransfer.com/hizmetlerimiz' },
    { name: 'VIP Transfer', url: 'https://www.gatetransfer.com/vip-transfer' }
  ]);

  // VIP Vehicle Fleet
  const vipFleet = [
    {
      name: 'Mercedes S-Class',
      category: 'Executive Sedan',
      capacity: '1-3 kişi',
      features: ['Deri koltuklar', 'Masaj özelliği', 'Ambient lighting', 'Premium ses sistemi'],
      price: '€80-120',
      image: '/images/mercedes-s-class.jpg'
    },
    {
      name: 'Mercedes Maybach',
      category: 'Ultra Luxury',
      capacity: '1-3 kişi',
      features: ['Executive koltuklar', 'Şampanya servisi', 'Privacy cam', 'Concierge tablet'],
      price: '€150-200',
      image: '/images/maybach.jpg'
    },
    {
      name: 'Mercedes V-Class VIP',
      category: 'Luxury Minivan',
      capacity: '4-7 kişi',
      features: ['Captain chairs', 'Toplantı masası', 'Wi-Fi', 'Mini bar'],
      price: '€120-180',
      image: '/images/v-class-vip.jpg'
    },
    {
      name: 'Mercedes Sprinter VIP',
      category: 'Group Luxury',
      capacity: '8-15 kişi',
      features: ['Lüks koltuklar', 'Entertainment sistemi', 'Klima', 'Panoramic cam'],
      price: '€200-300',
      image: '/images/sprinter-vip.jpg'
    }
  ];

  // VIP Services
  const vipServices = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'VIP Terminal',
      description: 'Özel VIP terminal girişi, fast-track gümrük geçişi ve bekleme salonu hizmeti.',
      included: true
    },
    {
      icon: <Wine className="w-8 h-8" />,
      title: 'Welcome Drink',
      description: 'Şampanya, premium içecek veya tercihinize göre özel ikram servisi.',
      included: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Professional Şoför',
      description: 'Takım elbiseli, deneyimli ve çok dilli professional şoför ağırlaması.',
      included: true
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Lüks Araç',
      description: 'Mercedes S-Class, Maybach veya VIP minivan seçenekleri ile konforlu yolculuk.',
      included: true
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'VIP Güvenlik',
      description: 'Özel güvenlik protokolleri, gizlilik garantisi ve tam sigorta kapsamı.',
      included: true
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Concierge',
      description: 'Restoran rezervasyonu, etkinlik bilgisi ve özel istekler için concierge desteği.',
      included: false
    }
  ];

  // Completed VIP pricing with all features
  const updatedPricing = [
    {
      title: 'VIP Executive',
      price: '€80-120',
      description: 'Mercedes S-Class ile executive transfer',
      features: [
        'Mercedes S-Class araç',
        'Professional şoför',
        'Welcome drink servisi',
        'Bagaj yardımı',
        'VIP karşılama',
        'Fast-track gümrük'
      ]
    },
    {
      title: 'VIP Luxury',
      price: '€120-180',
      description: 'V-Class VIP ile premium grup transferi',
      features: [
        'Mercedes V-Class VIP',
        'Captain chair koltuklar',
        'Mini bar servisi',
        'Wi-Fi internet',
        'Entertainment sistem',
        'Privacy cam',
        'Concierge destek'
      ]
    },
    {
      title: 'VIP Ultimate',
      price: '€150-250',
      description: 'Maybach ile ultra lüks transfer',
      features: [
        'Mercedes Maybach',
        'Executive suite koltuklar',
        'Şampanya servisi',
        'Personal concierge',
        'VIP terminal erişimi',
        'Özel güvenlik protokolü',
        'Premium ikram çeşitleri'
      ]
    }
  ];

  // Updated FAQ with VIP-specific content
  const updatedFaq = [
    {
      question: 'VIP transfer hizmeti nelerini kapsar?',
      answer: 'VIP transfer hizmetimiz; lüks araç (Mercedes S-Class/Maybach), professional şoför, VIP karşılama, welcome drink servisi, fast-track gümrük geçişi, bagaj yardımı ve concierge desteğini içerir. Özel istekleriniz için 24/7 destek sağlanır.'
    },
    {
      question: 'VIP araç filosunda hangi seçenekler mevcut?',
      answer: 'Mercedes S-Class (1-3 kişi), Mercedes Maybach (ultra lüks), Mercedes V-Class VIP (4-7 kişi) ve Mercedes Sprinter VIP (8-15 kişi) seçeneklerimiz bulunmaktadır. Tüm araçlar son model, tam donanımlı ve professional şoför ile hizmet verir.'
    },
    {
      question: 'VIP karşılama servisi nasıl çalışır?',
      answer: 'Havalimanında özel VIP temsilcimiz sizi karşılar, bagajlarınızı alır ve fast-track gümrük geçişi sağlar. VIP bekleme salonunda dinlenebilir, ardından professional şoförünüz lüks aracınızla sizi otelinize götürür.'
    },
    {
      question: 'VIP transfer için özel istek yapabilir miyim?',
      answer: 'Elbette! Özel dekorasyon, belirli içecek tercihleri, çiçek aranjmanı, özel müzik, climate control ayarları ve rotada durma talepleri gibi özel isteklerinizi concierge ekibimiz karşılar.'
    },
    {
      question: 'VIP transfer rezervasyonu nasıl yapılır?',
      answer: 'VIP transfer rezervasyonu için +90 532 574 26 82 numaralı telefondan doğrudan iletişime geçebilir veya WhatsApp üzerinden özel isteklerinizi bildirerek rezervasyon yapabilirsiniz. 24 saat önceden rezervasyon önerilir.'
    }
  ];

  return (
    <div>
      {/* SEO Head */}
      <SEOHead 
        pageData={{
          title: vipTransferMetaTags.title,
          description: vipTransferMetaTags.description,
          keywords: vipTransferMetaTags.keywords,
          url: '/vip-transfer',
          image: '/images/vip-transfer.jpg',
          type: 'service'
        }}
        includeHrefLang={true}
      />
      
      {/* Schema.org Structured Data */}
      <StructuredData schema={vipTransferSchema} id="vip-transfer-schema" />
      <StructuredData schema={breadcrumbSchema} id="breadcrumb-schema" />

      <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">VIP Transfer Hizmeti Nedir?</h2>
          <p className="mb-4">
            <strong>VIP Transfer hizmeti</strong>, Antalya ve çevresinde en üst düzey konfor standartlarıyla sunulan premium ulaşım çözümüdür. 
            Lüks araç filomuz, profesyonel şoför kadromuz ve özel hizmet anlayışımızla size unutulmaz bir transfer deneyimi yaşatıyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">VIP Transfer Avantajları</h3>
          <p className="mb-4">
            VIP transfer hizmetimiz ile sadece A noktasından B noktasına değil, bir lifestyle deneyimi yaşarsınız. 
            Mercedes-Benz V-Class, BMW 7 Serisi gibi lüks araçlarımızla, havalimanından otel/villa transferinizi 
            en konforlu şekilde gerçekleştiriyoruz. Meet & Greet hizmeti, bagaj taşıma, welcome drink ikramı gibi 
            özel dokunuşlarla fark yaratıyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Antalya VIP Transfer Fiyatları</h3>
          <p className="mb-4">
            VIP transfer fiyatlarımız şeffaf ve rekabetçidir. Havalimanı-Lara arası €40-60, 
            havalimanı-Kemer arası €50-80, havalimanı-Side arası €55-85 aralığında değişmektedir. 
            Fiyatlar araç tipine, mesafeye ve sezon dönemlerine göre belirlenmektedir.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Online Rezervasyon</h3>
          <p className="mb-4">
            7/24 online rezervasyon sistemimizle VIP transfer hizmetinizi anında rezerve edebilirsiniz. 
            WhatsApp destek hattımız +90 532 574 26 82 numarasından size yardımcı olmaktan mutluluk duyar. 
            TURSAB üyesi güvencesiyle, güvenli ödeme seçenekleriyle rezervasyonunuzu tamamlayın.
          </p>
        </div>
      }
    >
      {/* VIP Fleet Showcase */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              VIP Araç Filomuz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lüks Mercedes araçlarımızla ayrıcalıklı transfer deneyimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vipFleet.map((vehicle, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600 uppercase tracking-wide">
                        {vehicle.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {vehicle.capacity}
                    </p>
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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  VIP Rezervasyon
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Services */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              VIP Hizmet Ayrıcalıkları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size özel tasarlanmış lüks transfer deneyimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vipServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {service.icon}
                  </div>
                  {service.included && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      DAHİL
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Experience Timeline */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              VIP Transfer Deneyiminiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Adım adım lüks transfer süreciniz
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                time: '24 Saat Önce',
                title: 'VIP Rezervasyon Onayı',
                description: 'Özel istekleriniz alınır, araç ve şoför ataması yapılır, concierge team briefing alır.'
              },
              {
                time: 'Uçuş Saati',
                title: 'Uçuş Takibi',
                description: 'Professional ekibimiz uçuşunuzu takip eder, havalimanında VIP temsilcimiz hazırlık yapar.'
              },
              {
                time: 'İniş Sonrası',
                title: 'VIP Karşılama',
                description: 'Özel VIP temsilcimiz terminal içinde karşılar, fast-track gümrük geçişi sağlar.'
              },
              {
                time: 'Terminal Çıkışı',
                title: 'Lüks Araç Teslimi',
                description: 'Professional şoförünüz lüks aracınızla hazır bekler, welcome drink servisi yapılır.'
              },
              {
                time: 'Transfer Sürecinde',
                title: 'Premium Deneyim',
                description: 'Konforlu yolculuk, özel müzik, climate control ve concierge desteği ile otelinize ulaşım.'
              },
              {
                time: 'Otel Varışı',
                title: 'VIP Teslim',
                description: 'Bagaj yardımı, check-in desteği ve sonraki transfer ihtiyaçlarınız için 24/7 destek.'
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
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

export default VipTransfer;
