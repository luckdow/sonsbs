import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { Heart, Users, Crown, ArrowRight, Star, Calendar, MapPin, Camera } from 'lucide-react';

const DugunTransfer = () => {
  const serviceData = servicesData['dugun-transfer'];

  // Wedding Transfer Packages
  const weddingPackages = [
    {
      title: 'Gelin Transfer Paketi',
      price: '€120-200',
      duration: '4 saat',
      includes: [
        'Süslü Mercedes S-Class',
        'Professional şoför',
        'Gelin buketi hediyesi',
        'Şampanya servisi',
        'Fotoğraf desteği',
        'VIP karşılama'
      ],
      ideal: 'Gelin ve yakın aile için',
      popular: true
    },
    {
      title: 'Damat Transfer Paketi',
      price: '€80-120',
      duration: '3 saat',
      includes: [
        'Lüks sedan araç',
        'Erkek şoför',
        'Boutonniere hediyesi',
        'Muzik sistemi',
        'Durak desteği',
        'Sağdıçlar için alan'
      ],
      ideal: 'Damat ve sağdıçlar için',
      popular: false
    },
    {
      title: 'Misafir Transfer Paketi',
      price: '€150-300',
      duration: 'Tüm gün',
      includes: [
        'Mercedes Sprinter',
        'Dekoratif süsleme',
        '15-20 kişi kapasitesi',
        'Konforlu koltuklar',
        'Klima sistemi',
        'Müzik çalma imkanı'
      ],
      ideal: 'Düğün misafirleri için',
      popular: false
    },
    {
      title: 'Çift Transfer Premium',
      price: '€250-400',
      duration: '6 saat',
      includes: [
        'Mercedes Maybach',
        'Özel süsleme',
        'Çiçek aranjmanı',
        'Premium ikramlar',
        'Fotoğrafçı koordinasyonu',
        'Tam gün destek'
      ],
      ideal: 'Lüks düğün çiftleri için',
      popular: false
    }
  ];

  // Wedding Services
  const weddingServices = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Özel Süsleme',
      description: 'Düğün temasına uygun araç süslemesi, çiçek aranjmanları ve dekorasyon',
      included: true
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Fotoğraf Desteği',
      description: 'Araç önünde ve transfer sırasında özel fotoğraf çekim desteği',
      included: true
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'VIP Hizmet',
      description: 'Özel karşılama, şampanya servisi ve kırmızı halı uygulaması',
      included: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Grup Koordinasyonu',
      description: 'Misafir grupları için araç koordinasyonu ve zamanlama yönetimi',
      included: false
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Etkinlik Takvimu',
      description: 'Düğün programına uyumlu transfer zamanlaması ve rota planlaması',
      included: true
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Çoklu Lokasyon',
      description: 'Kuaför, nikah, tören ve resepsiyon arası transferler',
      included: false
    }
  ];

  // Wedding Venues
  const weddingVenues = [
    {
      name: 'Kempinski Hotel',
      location: 'Belek',
      distance: '35 km',
      price: '€25-35',
      features: ['Sahil düğünü', 'Lüks tesis', 'Geniş park alanı']
    },
    {
      name: 'Rixos Downtown',
      location: 'Antalya Merkez',
      distance: '8 km',
      price: '€15-20',
      features: ['Şehir manzarası', 'Modern tesis', 'Merkezi konum']
    },
    {
      name: 'Maxx Royal',
      location: 'Kemer',
      distance: '45 km',
      price: '€30-40',
      features: ['Dağ manzarası', 'Premium hizmet', 'Doğal güzellik']
    },
    {
      name: 'IC Hotels Santai',
      location: 'Belek',
      distance: '40 km',
      price: '€28-38',
      features: ['Golf sahası', 'Spa hizmetleri', 'Aile dostu']
    },
    {
      name: 'Akra Hotel',
      location: 'Antalya Merkez',
      distance: '10 km',
      price: '€15-25',
      features: ['Teknolojik tesis', 'Deniz manzarası', 'Modern mimari']
    },
    {
      name: 'Delphin Imperial',
      location: 'Lara',
      distance: '15 km',
      price: '€18-28',
      features: ['Sahil konumu', 'Geniş bahçe', 'Multiple salonlar']
    }
  ];

  // Updated pricing for wedding transfers
  const updatedPricing = [
    {
      title: 'Gelin Paketi',
      price: '€120-200',
      description: 'Gelin ve yakın aile için özel transfer',
      features: [
        'Süslü Mercedes S-Class',
        '4 saat hizmet',
        'Gelin buketi hediyesi',
        'Şampanya servisi',
        'Professional şoför',
        'Fotoğraf desteği',
        'VIP karşılama hizmeti'
      ]
    },
    {
      title: 'Misafir Grubu',
      price: '€150-300',
      description: 'Düğün misafirleri için grup transferi',
      features: [
        'Mercedes Sprinter (15-20 kişi)',
        'Tüm gün hizmet',
        'Dekoratif süsleme',
        'Konforlu koltuklar',
        'Klima sistemi',
        'Müzik çalma',
        'Çoklu durak desteği'
      ]
    },
    {
      title: 'Premium Çift',
      price: '€250-400',
      description: 'Lüks düğün çiftleri için özel paket',
      features: [
        'Mercedes Maybach',
        '6 saat tam destek',
        'Özel çiçek süslemesi',
        'Premium ikramlar',
        'Fotoğrafçı koordinasyonu',
        'VIP protokol',
        'Kırmızı halı uygulaması'
      ]
    }
  ];

  // Updated FAQ for wedding transfers
  const updatedFaq = [
    {
      question: 'Düğün transfer rezervasyonu ne kadar önceden yapılmalı?',
      answer: 'Düğün transferi için minimum 1 hafta öncesinden rezervasyon yapılması önerilir. Yoğun sezonlarda (Mayıs-Ekim) 2-3 hafta öncesinden rezervasyon yapılması daha uygun olacaktır.'
    },
    {
      question: 'Araç süslemesi ne kadar sürede hazırlanır?',
      answer: 'Düğün temanıza uygun araç süslemesi, çiçek aranjmanları ve dekorasyon düğün gününden 1 gün önce hazırlanır. Özel tema süslemeleri için 2-3 gün öncesinden bilgilendirme gerekebilir.'
    },
    {
      question: 'Düğün transfer paketine neler dahil?',
      answer: 'Gelin paketi: süslü araç, şampanya, buket, fotoğraf desteği. Misafir paketi: grup taşıma, süsleme, konforlu transfer. Premium paket: lüks araç, tam gün destek, VIP hizmetler dahildir.'
    },
    {
      question: 'Düğün sırasında çoklu transfer yapılabilir mi?',
      answer: 'Evet, kuaför-ev-nikah-tören-resepsiyon arası tüm transferleri koordine ediyoruz. Düğün programınıza uygun zamanlama ve rota planlaması yaparak kesintisiz hizmet sunuyoruz.'
    },
    {
      question: 'Düğün transfer fiyatları nasıl belirleniyor?',
      answer: 'Fiyatlar araç tipi, hizmet süresi, süsleme detayları ve mesafeye göre belirlenir. Gelin paketi €120-200, grup transferi €150-300, premium paket €250-400 arasında değişmektedir.'
    }
  ];

  return (
    <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Düğün Transfer Hizmeti</h2>
          <p className="mb-4">
            <strong>Düğün Transfer</strong> hizmetimiz ile özel gününüzü daha da özel kılıyoruz. 
            Gelin-damat, misafir ve yakın akraba transferlerini lüks araçlarımızla organize ediyoruz. 
            Düğün konvoyları, nikah töreni ulaşımı ve düğün sonrası transferler için özel paketlerimiz var.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Düğün Transfer Paketleri</h3>
          <p className="mb-4">
            Gelin arabası için lüks BMW 7 Serisi ve Mercedes S-Class, misafir transferi için 
            Mercedes Sprinter ve Midibus seçenekleri sunuyoruz. Çiçek süsleme, kurdele 
            dekorasyonu ve özel müzik sistemi ile araçlarınızı düğününüze özel hazırlıyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Düğün Transfer Kapsamı</h3>
          <p className="mb-4">
            Havalimanı karşılama, otel-düğün salonu transfer, nikah dairesi ulaşımı, 
            fotoğraf çekimi lokasyonları arası transfer ve düğün sonrası balayı transferi 
            hizmetlerini tek paket halinde sunuyoruz. Tüm organizasyon sizin için hazır.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Düğün Transfer Fiyatları</h3>
          <p className="mb-4">
            Düğün transfer paketlerimiz €200-800 arasında değişmektedir. Gelin arabası €150-300, 
            misafir transferi €300-500, tam gün düğün organizasyonu €500-800 fiyat aralığındadır. 
            2 ay önceden rezervasyonda %20 erken rezervasyon indirimi uygulanır.
          </p>
        </div>
      }
    >
      {/* Wedding Packages */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Düğün Transfer Paketleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hayatınızın en özel gününde size yakışan lüks transfer hizmeti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {weddingPackages.map((pkg, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 relative ${
                pkg.popular ? 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50' : 'border-gray-100'
              }`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ En Popüler
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      <span className="text-sm font-medium text-rose-600 uppercase tracking-wide">
                        {pkg.duration}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <p className="text-gray-600">{pkg.ideal}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-rose-600">{pkg.price}</div>
                    <div className="text-sm text-gray-500">düğün başına</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {pkg.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  }`}
                >
                  Düğün Rezervasyonu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Services */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Düğün Transfer Hizmetleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Düğününüzü unutulmaz kılacak özel hizmetler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
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

      {/* Wedding Venues */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Düğün Mekanları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya\'nın en prestijli düğün mekanlarına transfer hizmetimiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingVenues.map((venue, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="relative h-40 bg-gradient-to-br from-rose-400 to-pink-500">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {venue.distance} • {venue.price}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{venue.name}</h3>
                    <p className="text-rose-100 text-sm">{venue.location}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    {venue.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to="/rezervasyon"
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    Transfer Rezervasyonu
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Transfer Timeline */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Düğün Günü Transfer Programı
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mükemmel düğün gününüz için detaylanmış transfer planlaması
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                time: '08:00-10:00',
                title: 'Hazırlık Transferleri',
                description: 'Gelin ve damat için kuaför, güzellik salonu transferleri. Araç süsleme son kontrolü.',
                icon: <Calendar className="w-6 h-6" />
              },
              {
                time: '10:00-12:00',
                title: 'Ev ve Nikah Transferi',
                description: 'Evden nikah salonuna transfer. Aile fertleri ve yakın akraba koordinasyonu.',
                icon: <Heart className="w-6 h-6" />
              },
              {
                time: '12:00-14:00',
                title: 'Tören Transferi',
                description: 'Nikahtan düğün törenine transfer. Fotoğraf molalarında araç ve çift çekimleri.',
                icon: <Camera className="w-6 h-6" />
              },
              {
                time: '14:00-16:00',
                title: 'Resepsiyon Transferi',
                description: 'Tören alanından resepsiyon mekanına VIP transfer. Misafir araçları koordinasyonu.',
                icon: <Crown className="w-6 h-6" />
              },
              {
                time: '16:00-22:00',
                title: 'Düğün Süreci',
                description: 'Resepsiyon boyunca gerekli transferler. Yaşlı misafirler için ara transferler.',
                icon: <Users className="w-6 h-6" />
              },
              {
                time: '22:00+',
                title: 'Son Transferler',
                description: 'Çift ve misafirler için güvenli dönüş transferleri. Gece yarısı sonrası hizmet.',
                icon: <MapPin className="w-6 h-6" />
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-medium">
                      {item.time}
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

export default DugunTransfer;
