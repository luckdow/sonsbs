import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { UserCheck, Heart, Gift, ArrowRight, Star, Shield, Users, Smile } from 'lucide-react';

const KarsilamaHizmeti = () => {
  const serviceData = servicesData['karsilama-hizmeti'];

  // Welcome Service Packages
  const welcomePackages = [
    {
      title: 'Standard Karşılama',
      price: '€25-40',
      duration: 'Transfer süresi',
      includes: [
        'İsimli karşılama tabelası',
        'Professional temsilci',
        'Bagaj yardımı',
        'Temel bilgilendirme',
        'Araç escort',
        'Güleryüzlü hizmet'
      ],
      ideal: 'Bireysel ve aile transferleri',
      popular: true
    },
    {
      title: 'VIP Karşılama',
      price: '€60-100',
      duration: 'Transfer + 30 dk',
      includes: [
        'VIP karşılama alanı',
        'Welcome drink servisi',
        'Çiçek buketi',
        'Professional escort',
        'Fast-track gümrük',
        'Detaylı bilgilendirme'
      ],
      ideal: 'Özel misafir karşılamaları',
      popular: false
    },
    {
      title: 'Grup Karşılama',
      price: '€80-150',
      duration: 'Grup büyüklüğüne göre',
      includes: [
        'Grup koordinatörü',
        'Çoklu isim tabelası',
        'Grup sayımı',
        'Bagaj organize',
        'Araç dağılımı',
        'Grup rehberliği'
      ],
      ideal: '10+ kişilik gruplar',
      popular: false
    },
    {
      title: 'Corporate Karşılama',
      price: '€100-200',
      duration: 'Executive protokol',
      includes: [
        'Corporate protokol',
        'Executive lounge',
        'Business amenities',
        'Protocol officer',
        'VIP araç escort',
        'Meeting koordinasyonu'
      ],
      ideal: 'Kurumsal executive misafirler',
      popular: false
    }
  ];

  // Welcome Services
  const welcomeServices = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: 'Professional Karşılama',
      description: 'Deneyimli ve çok dilli temsilciler ile warm welcome',
      included: true
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Welcome Gifts',
      description: 'Özel hediye paketi, çiçek buketi ve yerel lezzetler',
      included: false
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Kişisel İlgi',
      description: 'Misafir ihtiyaçlarına özel dikkat ve kişiselleştirilmiş hizmet',
      included: true
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenlik Protokolü',
      description: 'Güvenli escort, kimlik kontrolü ve protective service',
      included: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Grup Koordinasyonu',
      description: 'Büyük gruplar için professional organize ve koordinasyon',
      included: false
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: 'İlk İzlenim',
      description: 'Unutulmaz ilk karşılaşma ve pozitif deneyim yaratma',
      included: true
    }
  ];

  // Special Occasions
  const specialOccasions = [
    {
      occasion: 'Honeymoon Karşılama',
      description: 'Balayı çiftleri için romantic welcome',
      price: '€80-120',
      features: ['Çiçek buketi', 'Şampanya', 'Romantic setup', 'Özel fotoğraf']
    },
    {
      occasion: 'Anniversary Celebration',
      description: 'Özel yıldönümü karşılaması',
      price: '€60-100',
      features: ['Anniversary cake', 'Dekorasyon', 'Müzik', 'Celebration setup']
    },
    {
      occasion: 'Birthday Surprise',
      description: 'Doğum günü sürpriz karşılaması',
      price: '€50-80',
      features: ['Birthday banner', 'Balon süsleme', 'Pasta sürprizi', 'Müzik']
    },
    {
      occasion: 'Corporate Executive',
      description: 'Üst düzey yönetici karşılaması',
      price: '€100-200',
      features: ['Protocol service', 'Executive lounge', 'Business setup', 'VIP treatment']
    },
    {
      occasion: 'Family Reunion',
      description: 'Aile birleşimi karşılaması',
      price: '€70-120',
      features: ['Welcome banner', 'Family photos', 'Group coordination', 'Special attention']
    },
    {
      occasion: 'Medical Tourism',
      description: 'Sağlık turizmi karşılaması',
      price: '€60-100',
      features: ['Medical assistance', 'Hospital coordination', 'Special care', 'Health protocol']
    }
  ];

  // Updated pricing for welcome services
  const updatedPricing = [
    {
      title: 'Standard Welcome',
      price: '€25-40',
      description: 'Temel karşılama hizmeti',
      features: [
        'İsimli karşılama tabelası',
        'Professional temsilci',
        'Bagaj yardımı',
        'Temel bilgilendirme',
        'Araç escort hizmeti',
        'Güleryüzlü karşılama'
      ]
    },
    {
      title: 'VIP Welcome',
      price: '€60-100',
      description: 'Premium karşılama deneyimi',
      features: [
        'VIP karşılama alanı',
        'Welcome drink servisi',
        'Çiçek buketi hediyesi',
        'Fast-track gümrük',
        'Detaylı rehberlik',
        'Professional escort',
        'Özel ilgi ve dikkat'
      ]
    },
    {
      title: 'Special Occasion',
      price: '€80-200',
      description: 'Özel günler için tasarlanmış karşılama',
      features: [
        'Occasion-specific setup',
        'Özel dekorasyon',
        'Tema uygun hediyeler',
        'Surprise elementler',
        'Photography support',
        'Celebration coordination',
        'Memorable experience'
      ]
    }
  ];

  // Updated FAQ for welcome services
  const updatedFaq = [
    {
      question: 'Karşılama hizmeti nasıl çalışır?',
      answer: 'Professional temsilcimiz havalimanında isminizi taşıyan tabelayla sizi bekler. Bagaj yardımı sağlar, temel bilgilendirme yapar ve aracınıza kadar eşlik eder. VIP paketlerde welcome drink ve çiçek buketi de sunulur.'
    },
    {
      question: 'Özel günler için karşılama düzenlenebilir mi?',
      answer: 'Evet! Balayı, yıldönümü, doğum günü, kurumsal karşılamalar için özel düzenlemeler yapıyoruz. Çiçek, pasta, dekorasyon, müzik gibi surprise elementler eklenebilir.'
    },
    {
      question: 'Karşılama temsilcisi hangi dilleri konuşuyor?',
      answer: 'Temsilcilerimiz Türkçe, İngilizce, Almanca, Rusça, Arapça dillerinde hizmet verebilmektedir. Özel dil ihtiyaçları için rezervasyon sırasında belirtiniz.'
    },
    {
      question: 'Grup karşılamasında nasıl koordinasyon sağlanır?',
      answer: '10+ kişilik gruplar için özel grup koordinatörü görevlendirilir. Çoklu isim tabelası, bagaj organize, araç dağılımı ve grup sayımı professional olarak yönetilir.'
    },
    {
      question: 'Karşılama hizmeti fiyatları nelerden etkilenir?',
      answer: 'Hizmet türü (Standard/VIP), grup büyüklüğü, özel düzenlemeler, hediye paketleri ve hizmet süresi fiyatları etkiler. Standard karşılama €25-40, VIP €60-100, Özel organizasyonlar €80-200 aralığındadır.'
    }
  ];

  return (
    <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet & Greet Karşılama Hizmeti</h2>
          <p className="mb-4">
            <strong>Karşılama Hizmeti</strong> ile havalimanından itibaren size özel ağırlama yaşayın. 
            Profesyonel karşılama görevlimiz, isim tabelası ile havalimanı çıkışında sizi bekler, 
            bagajlarınızı taşır ve VIP transfer aracınıza kadar eşlik eder.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Karşılama Hizmeti Kapsamı</h3>
          <p className="mb-4">
            Havalimanı çıkışında isim tabelası ile karşılama, bagaj taşıma yardımı, 
            VIP bekleme salonuna eşlik, welcome drink ikramı, transfer aracına kadar 
            rehberlik hizmetleri verilir. Dil sorunu yaşamamanız için İngilizce, Almanca, 
            Rusça konuşan görevlilerimiz mevcuttur.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">VIP Karşılama Avantajları</h3>
          <p className="mb-4">
            Havalimanında kaybolma riski yok, bagaj taşıma zorluğu yok, dil engeli yok. 
            Fast-track geçiş, VIP lounge erişimi, özel ikram servisi ile transfer deneyiminiz 
            5 yıldızlı otel konforunda başlar. Özellikle yaşlı misafirler ve aileler için idealdir.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Karşılama Hizmeti Fiyatları</h3>
          <p className="mb-4">
            Standart karşılama hizmeti €15, VIP karşılama €25, Premium karşılama €35 olarak 
            fiyatlandırılmıştır. Transfer hizmeti ile birlikte alındığında %50 indirim uygulanır. 
            Grup karşılamalarında kişi başı indirimli fiyatlar geçerlidir.
          </p>
        </div>
      }
    >
      {/* Welcome Packages */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Karşılama Hizmet Paketleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya'ya gelişinizde size yakışan warm welcome deneyimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {welcomePackages.map((pkg, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 relative ${
                pkg.popular ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50' : 'border-gray-100'
              }`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ En Popüler
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                        {pkg.duration}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <p className="text-gray-600">{pkg.ideal}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{pkg.price}</div>
                    <div className="text-sm text-gray-500">karşılama başına</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {pkg.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  }`}
                >
                  Karşılama Rezervasyonu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Services */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Karşılama Hizmet Özellikleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size özel tasarlanmış warm welcome deneyimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {welcomeServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Special Occasions */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Özel Gün Karşılamaları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hayatınızın özel anlarında size yakışan karşılama hizmeti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialOccasions.map((occasion, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{occasion.occasion}</h3>
                    <p className="text-gray-600 text-sm">{occasion.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">{occasion.price}</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {occasion.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  Özel Rezervasyon
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Process */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Karşılama Hizmet Süreciniz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya'ya gelişinizden aracınıza kadar adım adım süreç
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Uçuş Takibi',
                description: 'Uçuşunuz takip edilir, gecikme durumunda karşılama saati güncellenir.',
                icon: <Shield className="w-6 h-6" />
              },
              {
                step: '2',
                title: 'Terminal Hazırlığı',
                description: 'Temsilcimiz terminal içinde isminizi taşıyan tabelayla hazır bekler.',
                icon: <UserCheck className="w-6 h-6" />
              },
              {
                step: '3',
                title: 'Warm Welcome',
                description: 'Sıcak karşılama, welcome drink (VIP paketlerde) ve çiçek buketi sunumu.',
                icon: <Heart className="w-6 h-6" />
              },
              {
                step: '4',
                title: 'Bagaj Yardımı',
                description: 'Bagajlarınızın alınması ve araç yönüne professional escort.',
                icon: <Users className="w-6 h-6" />
              },
              {
                step: '5',
                title: 'Bilgilendirme',
                description: 'Antalya hakkında temel bilgiler, weather update ve recommendation\'lar.',
                icon: <Smile className="w-6 h-6" />
              },
              {
                step: '6',
                title: 'Transfer Başlangıcı',
                description: 'Araç teslimi ve otelinize doğru konforlu yolculuk başlangıcı.',
                icon: <Gift className="w-6 h-6" />
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
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

export default KarsilamaHizmeti;
