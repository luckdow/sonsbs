import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { Building, Users, Clock, ArrowRight, Shield, Star, Calendar, Briefcase } from 'lucide-react';

const KurumsalTransfer = () => {
  const serviceData = servicesData['kurumsal-transfer'];

  // Corporate Services
  const corporateServices = [
    {
      title: 'Executive Transfer',
      description: 'Üst düzey yöneticiler için lüks araç transferi',
      price: '€60-120/gün',
      features: ['Mercedes S-Class', 'Professional şoför', 'VIP karşılama', 'Esnek program'],
      icon: <Briefcase className="w-8 h-8" />,
      popular: true
    },
    {
      title: 'Employee Shuttle',
      description: 'Çalışan grupları için düzenli shuttle hizmeti',
      price: '€150-300/gün',
      features: ['Mercedes Sprinter', 'Düzenli sefer', '15-20 kişi', 'Aylık kontrat'],
      icon: <Users className="w-8 h-8" />,
      popular: false
    },
    {
      title: 'Meeting Transfer',
      description: 'Toplantı ve etkinlik transferleri',
      price: '€40-80/transfer',
      features: ['Zamanında teslimat', 'Bekletmeden transfer', 'Toplantı desteği', 'Koordinasyon'],
      icon: <Calendar className="w-8 h-8" />,
      popular: false
    },
    {
      title: 'Airport VIP',
      description: 'Kurumsal misafirler için havalimanı VIP hizmeti',
      price: '€80-150/transfer',
      features: ['VIP karşılama', 'Fast-track gümrük', 'Lüks araç', 'Concierge destek'],
      icon: <Star className="w-8 h-8" />,
      popular: false
    }
  ];

  // Corporate Clients
  const corporateClients = [
    {
      sector: 'Otelcilik',
      companies: ['Rixos Hotels', 'Maxx Royal', 'Kempinski', 'IC Hotels'],
      services: 'Misafir transferi, Executive hizmet, Grup transferi'
    },
    {
      sector: 'İnşaat & Emlak',
      companies: ['DAP Yapı', 'Rönesans', 'Tekfen', 'Alarko'],
      services: 'Site gezisi, Executive transfer, Proje transferi'
    },
    {
      sector: 'Teknoloji',
      companies: ['Microsoft Türkiye', 'SAP', 'Oracle', 'Turkcell'],
      services: 'Etkinlik transferi, VIP hizmet, Grup koordinasyonu'
    },
    {
      sector: 'Turizm',
      companies: ['TUI', 'Anex Tour', 'Corendon', 'Pegasus'],
      services: 'Tur rehberi transferi, Grup hizmeti, Özel rotalar'
    }
  ];

  // Corporate Advantages
  const corporateAdvantages = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenilirlik',
      description: 'Zamanlama garantisi, professional hizmet ve tam sigorta kapsamı',
      benefit: '%99.8 zamanında teslimat'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Esneklik',
      description: '24/7 hizmet, ani değişikliklere adaptasyon, esnek faturalama',
      benefit: '7/24 destek hattı'
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Corporate Çözümler',
      description: 'Özel fiyatlandırma, düzenli raporlama, dedicated hesap yöneticisi',
      benefit: 'Özel kurumsal fiyatlar'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Kapasite',
      description: 'Büyük grup koordinasyonu, çoklu araç yönetimi, event desteği',
      benefit: '100+ kişilik etkinlikler'
    }
  ];

  // Meeting Venues
  const meetingVenues = [
    {
      name: 'Antalya Convention Center',
      location: 'Konyaaltı',
      capacity: '2000+ kişi',
      distance: '15 km',
      price: '€12-20',
      features: ['Büyük etkinlikler', 'Kongre merkezi', 'Otopark imkanı']
    },
    {
      name: 'Dedeman Hotel Convention',
      location: 'Lara',
      capacity: '500-1000 kişi',
      distance: '18 km',
      price: '€15-25',
      features: ['Business center', 'Meeting rooms', 'Catering service']
    },
    {
      name: 'Hilton Convention Center',
      location: 'Konyaaltı',
      capacity: '300-800 kişi',
      distance: '20 km',
      price: '€18-28',
      features: ['Modern tesisler', 'Tech support', 'VIP salon']
    },
    {
      name: 'Akra Hotel Meeting Rooms',
      location: 'Antalya Merkez',
      capacity: '50-300 kişi',
      distance: '12 km',
      price: '€10-18',
      features: ['Teknolojik donanım', 'Deniz manzarası', 'Executive lounge']
    }
  ];

  // Updated pricing for corporate transfers
  const updatedPricing = [
    {
      title: 'Executive Transfer',
      price: '€60-120',
      description: 'Üst düzey yöneticiler için günlük hizmet',
      features: [
        'Mercedes S-Class araç',
        'Professional şoför',
        'Tam gün hizmet (8 saat)',
        'VIP karşılama',
        'Esnek program',
        'Business amenities',
        'Priority destek'
      ]
    },
    {
      title: 'Grup Transfer',
      price: '€150-300',
      description: 'Çalışan grupları için shuttle hizmeti',
      features: [
        'Mercedes Sprinter (15-20 kişi)',
        'Düzenli sefer saatleri',
        'Aylık/yıllık kontrat',
        'Route optimization',
        'Grup koordinasyonu',
        'Raporlama sistemi',
        'Dedicated hesap yöneticisi'
      ]
    },
    {
      title: 'Event Transfer',
      price: '€200-500',
      description: 'Kurumsal etkinlik ve toplantı transferi',
      features: [
        'Çoklu araç koordinasyonu',
        'Event schedule uyumu',
        'VIP protocol',
        'Signage desteği',
        'Multi-point pickup',
        'Real-time tracking',
        'Emergency backup'
      ]
    }
  ];

  // Updated FAQ for corporate transfers
  const updatedFaq = [
    {
      question: 'Kurumsal transfer sözleşmesi nasıl yapılır?',
      answer: 'Kurumsal ihtiyaçlarınızı +90 532 574 26 82 numarasından iletiniz. Özel fiyat teklifi hazırlanır, hizmet detayları belirlenir ve yıllık/aylık sözleşme imzalanır. Dedicated hesap yöneticisi atanır.'
    },
    {
      question: 'Kurumsal faturalama nasıl çalışır?',
      answer: 'Aylık dönemsel faturalama, kredi kartı ile otomatik ödeme, banka transferi veya çek ile ödeme seçenekleri mevcuttur. Kurumsal müşterilerimize özel ödeme koşulları sunulmaktadır.'
    },
    {
      question: 'Ani değişiklik ve iptallerde ne oluyor?',
      answer: 'Kurumsal müşterilerimize 2 saat öncesine kadar ücretsiz değişiklik hakkı tanınır. Acil durumlar için 24/7 destek hattımız mevcuttur. Esnek iptal politikası uygulanır.'
    },
    {
      question: 'Büyük etkinlikler için kapasiteniz nedir?',
      answer: '100+ kişilik etkinlikler için çoklu araç koordinasyonu yapabiliyoruz. Mercedes Sprinter, VIP sedan ve grup araçları ile 500 kişiye kadar etkinlik desteği sağlanabilir.'
    },
    {
      question: 'Kurumsal transfer raporlaması var mı?',
      answer: 'Evet, aylık kullanım raporları, maliyet analizi, transfer istatistikleri ve performance metrikleri düzenli olarak paylaşılır. Online portal üzerinden real-time takip imkanı sunulur.'
    }
  ];

  return (
    <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kurumsal Transfer Hizmeti</h2>
          <p className="mb-4">
            <strong>Kurumsal Transfer</strong> hizmetimiz ile şirket etkinlikleri, toplantılar, 
            konferanslar ve iş gezileri için profesyonel ulaşım çözümleri sunuyoruz. 
            B2B anlaşmalarımız, fatura kesimi ve kurumsal indirimlerimizle işletmenizin 
            transfer ihtiyaçlarını karşılıyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Kurumsal Transfer Kapsamı</h3>
          <p className="mb-4">
            Havalimanı karşılama, otel-kongre merkezi transfer, şehir turu organizasyonu, 
            iş toplantıları arası ulaşım, şirket etkinlik transferi hizmetleri veriyoruz. 
            VIP misafir ağırlama, tercüman eşliğinde transfer ve özel güzergah planlaması yapılır.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Kurumsal Transfer Avantajları</h3>
          <p className="mb-4">
            Aylık anlaşmalar ile %25 indirim, faturalandırma kolaylığı, 7/24 destek hattı, 
            özel müşteri temsilcisi, çoklu rezervasyon yönetimi ve raporlama hizmetleri. 
            Kurumsal kimlik uygulamaları ve özel plaket hizmetleri de sunulmaktadır.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Kurumsal Transfer Fiyatları</h3>
          <p className="mb-4">
            Kurumsal anlaşmalarda özel fiyatlandırma uygulanır. Aylık €500+ kullanımlarda %20, 
            €1000+ kullanımlarda %25 indirim sağlanır. Yıllık anlaşmalarda ek avantajlar ve 
            sabit fiyat garantisi verilir. KDV dahil fatura düzenlenir.
          </p>
        </div>
      }
    >
      {/* Corporate Services */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kurumsal Transfer Hizmetleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Şirketinizin ihtiyaçlarına özel tasarlanmış professional transfer çözümleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {corporateServices.map((service, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 relative ${
                service.popular ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-gray-100'
              }`}>
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ En Popüler
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{service.price}</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 ${
                    service.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  }`}
                >
                  Kurumsal Teklif Al
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Advantages */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kurumsal Avantajlarımız
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Neden 100+ şirket bizi tercih ediyor?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {corporateAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{advantage.description}</p>
                <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {advantage.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Clients */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kurumsal Müşterilerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Farklı sektörlerden 100+ şirketin güvendiği transfer hizmeti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {corporateClients.map((client, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{client.sector}</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Referans Firmalar
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {client.companies.map((company, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {company}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Sağlanan Hizmetler:</h4>
                  <p className="text-gray-600 text-sm">{client.services}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Venues */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Toplantı ve Kongre Mekanları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya\'nın önde gelen business center\'larına transfer hizmetimiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {meetingVenues.map((venue, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{venue.location}</span>
                      <span>•</span>
                      <span>{venue.distance}</span>
                      <span>•</span>
                      <span>{venue.capacity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{venue.price}</div>
                    <div className="text-xs text-gray-500">transfer başına</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {venue.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Event Transfer Rezervasyonu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Process */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kurumsal Süreç Yönetimi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional kurumsal transfer sürecimiz
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'İhtiyaç Analizi',
                description: 'Kurumsal ihtiyaçlarınız analiz edilir, özel çözümler tasarlanır.',
                icon: <Briefcase className="w-6 h-6" />
              },
              {
                step: '2',
                title: 'Teklif Hazırlama',
                description: 'Detaylı fiyat teklifi ve hizmet paketi sunumu yapılır.',
                icon: <Calendar className="w-6 h-6" />
              },
              {
                step: '3',
                title: 'Sözleşme İmzalama',
                description: 'Kurumsal sözleşme imzalanır, ödeme koşulları belirlenir.',
                icon: <Shield className="w-6 h-6" />
              },
              {
                step: '4',
                title: 'Hesap Yöneticisi Ataması',
                description: 'Dedicated hesap yöneticisi atanır, iletişim kanalları kurulur.',
                icon: <Users className="w-6 h-6" />
              },
              {
                step: '5',
                title: 'Hizmet Başlangıcı',
                description: 'Transfer hizmetleri başlar, real-time takip sistemi devreye girer.',
                icon: <Clock className="w-6 h-6" />
              },
              {
                step: '6',
                title: 'Sürekli İyileştirme',
                description: 'Düzenli raporlama, feedback alınması ve hizmet optimizasyonu.',
                icon: <Star className="w-6 h-6" />
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      Adım {item.step}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default KurumsalTransfer;
