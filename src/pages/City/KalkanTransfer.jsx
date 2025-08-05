import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  MapPin,
  Clock,
  Shield,
  Users,
  Car,
  Star,
  Phone,
  CheckCircle2,
  Plane,
  Building2,
  Calendar,
  CreditCard,
  Globe,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const KalkanTransfer = () => {
  const [openFaq, setOpenFaq] = React.useState(0);

  const popularDestinations = [
    { name: 'Antalya Havalimanı (AYT)', time: '3 saat', icon: <Plane className="w-5 h-5" /> },
    { name: 'Kalkan Merkez', time: '5 dk', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Kaş', time: '30 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Patara Plajı', time: '15 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Antalya Merkez', time: '2.5 saat', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Bezirgan Plajı', time: '10 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Kapıtaş Plajı', time: '5 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Islamlar Köyü', time: '20 dk', icon: <MapPin className="w-5 h-5" /> }
  ];

  const services = [
    {
      title: 'Kalkan Havalimanı Transfer',
      description: 'Antalya Havalimanı\'ndan Kalkan\'a direkt transfer. Akdeniz kıyı yolu manzaralı 3 saatlik lüks yolculuk.',
      icon: <Plane className="w-8 h-8" />,
      features: ['3 Saat Süre', 'VIP Araç Seçenekleri', 'Kıyı Manzarası', 'Lüks Konfor']
    },
    {
      title: 'Kalkan Lüks Otel Transfer',
      description: 'Kalkan\'daki butik oteller, lüks villalar ve premium konaklama yerlerine özel transfer.',
      icon: <Building2 className="w-8 h-8" />,
      features: ['Butik Oteller', 'Villa Transferi', 'VIP Hizmet', 'Concierge Desteği']
    },
    {
      title: 'Kalkan Plaj & Aktivite Transfer',
      description: 'Kapıtaş, Patara, Bezirgan plajları ve tekne turları için özel transfer hizmeti.',
      icon: <Car className="w-8 h-8" />,
      features: ['Plaj Transferi', 'Tekne Turu', 'Günlük Tur', 'Esnek Program']
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Kalkan Uzmanı Rehberler', desc: 'Kalkan ve Akdeniz kıyısını iyi bilen lüks transfer uzmanları' },
    { icon: <Clock className="w-6 h-6 text-blue-500" />, title: '7/24 Lüks Transfer', desc: 'Her saatte premium kalite Kalkan transfer hizmeti' },
    { icon: <Users className="w-6 h-6 text-purple-500" />, title: 'VIP Müşteri Hizmeti', desc: 'Kalkan konaklaması için özel müşteri hizmetleri' },
    { icon: <Car className="w-6 h-6 text-orange-500" />, title: 'Premium Araç Filosu', desc: 'Lüks ve konforlu araçlarla Kalkan yolculuğu' },
    { icon: <CreditCard className="w-6 h-6 text-indigo-500" />, title: 'Esnek Ödeme', desc: 'Euro, TL ve uluslararası ödeme seçenekleri' },
    { icon: <Globe className="w-6 h-6 text-teal-500" />, title: 'Çok Dilli Hizmet', desc: 'Türkçe, İngilizce, Almanca, Rusça destekli hizmet' }
  ];

  const faqs = [
    {
      question: "Antalya havalimanından Kalkan'a transfer süresi ne kadar?",
      answer: "Antalya Havalimanı'ndan Kalkan'a transfer süresi yaklaşık 3 saattir. Akdeniz kıyı yolu üzerinden manzaralı güzergah takip edilir. Lüks araçlarımızla konforlu yolculuk yaparsınız."
    },
    {
      question: "Kalkan transfer rezervasyonu nasıl yapılır?",
      answer: "Online rezervasyon formumuzdan anında rezervasyon yapabilir, +90 532 574 26 82 numaralı telefondan arayabilir veya WhatsApp ile iletişime geçebilirsiniz. Kalkan oteli bilgilerinizi paylaştığınızda transfer düzenlenir."
    },
    {
      question: "Kalkan'da hangi otellere transfer yapılır?",
      answer: "Kalkan merkez, Bezirgan, Kapıtaş ve çevresindeki tüm butik oteller, lüks villalar, pansiyonlar ve tatil evlerine transfer yapıyoruz. Villa kapısına kadar hizmet veriyoruz."
    },
    {
      question: "Kalkan'dan Kaş ve çevre bölgelere transfer var mı?",
      answer: "Evet, Kalkan'dan Kaş (30 dk), Patara Plajı (15 dk), Bezirgan Plajı (10 dk), Kapıtaş Plajı (5 dk) ve tüm Likya bölgesi destinasyonlarına transfer hizmeti veriyoruz."
    },
    {
      question: "Kalkan transfer araçları lüks mü?",
      answer: "Evet, Kalkan'ın premium turizm yapısına uygun lüks ve konforlu araçlarımız bulunmaktadır. VIP araç seçenekleri de mevcuttur."
    },
    {
      question: "Kalkan plaj transferi yapılıyor mu?",
      answer: "Evet, Kapıtaş Plajı, Patara Plajı, Bezirgan Plajı ve çevredeki tüm plajlara günlük transfer hizmeti veriyoruz. Tekne turları için iskele transferi de yapıyoruz."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Kalkan Transfer | Antalya Kalkan Transfer | Kalkan Otel Havalimanı Ulaşım</title>
        <meta name="description" content="Kalkan transfer hizmeti. Antalya havalimanından Kalkan'a lüks transfer. Kalkan otel, villa, plaj transfer. Kapıtaş, Patara plajları ulaşım." />
        <meta name="keywords" content="kalkan transfer, antalya kalkan transfer, kalkan havalimanı transfer, kalkan otel transfer, kapıtaş plajı transfer, patara plajı transfer, kalkan villa transfer, lüks kalkan transfer" />
        <link rel="canonical" href="https://www.gatetransfer.com/kalkan-transfer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Kalkan Transfer Hizmeti | Kalkan Lüks Otel ve Havalimanı Transferi" />
        <meta property="og:description" content="Kalkan bölgesine premium transfer hizmeti. Havalimanı, lüks otel ve plaj transferi. Hemen rezervasyon yapın!" />
        <meta property="og:url" content="https://www.gatetransfer.com/kalkan-transfer" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kalkan Transfer Hizmeti | GATE Transfer" />
        <meta name="twitter:description" content="Kalkan bölgesi lüks transfer hizmeti. Güvenli, konforlu, premium yolculuk." />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GATE Transfer - Kalkan Transfer Hizmeti",
            "description": "Kalkan bölgesi lüks otel, havalimanı ve plaj transfer hizmeti. Premium araçlarla güvenli ve konforlu ulaşım çözümleri.",
            "url": "https://www.gatetransfer.com/kalkan-transfer",
            "telephone": "+90 532 574 26 82",
            "email": "sbstravelinfo@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Güzelyurt Mahallesi Serik Caddesi No: 138/2",
              "addressLocality": "Aksu",
              "addressRegion": "Antalya",
              "postalCode": "07112",
              "addressCountry": "TR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "36.2623",
              "longitude": "29.9414"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "€80-€200",
            "currenciesAccepted": "EUR,TRY",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "areaServed": {
              "@type": "City",
              "name": "Kalkan",
              "addressCountry": "TR"
            },
            "serviceType": "Luxury Transfer Service",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "523"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  to="/" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">Kalkan Transfer</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Kalkan Luxury Mediterranean Transfer
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Kalkan Transfer
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-3xl">Lüks Otel & Plaj Ulaşım</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Antalya Havalimanı'ndan Kalkan'a, lüks oteller, villalar ve turkuaz plajlara 
              <span className="text-blue-400 font-semibold"> premium, güvenli ve konforlu</span> transfer hizmeti
            </p>
            
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
                href="tel:+905325742682"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                +90 532 574 26 82
              </a>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">523+</div>
                <div className="text-gray-400 text-xs">Kalkan Transferi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">3h</div>
                <div className="text-gray-400 text-xs">Havalimanı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-gray-400 text-xs">Lüks Hizmet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">4.9</div>
                <div className="text-gray-400 text-xs flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  Puan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Kalkan Transfer Hizmeti - Akdeniz Lüks Villa Ulaşımı
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Kalkan transfer hizmeti</strong> ile Antalya Havalimanı'ndan 
                  <strong> Akdeniz'in lüks kasabası Kalkan'a</strong> 3 saatlik premium yolculuk yapın. 
                  Turkuaz deniz manzaralı <strong>kıyı yolu güzergahı</strong> ile VIP konfor.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Kalkan otel transfer</strong> hizmetimiz ile butik oteller, lüks villalar 
                  ve premium konaklama yerlerine direkt ulaşım sağlıyoruz. Kalkan marina, eski kasaba ve 
                  <strong>Bezirgan bölgesindeki lüks tesislere</strong> kapıdan kapıya hizmet.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Kalkan plaj transfer</strong> ile Kapıtaş Plajı, Patara Plajı, 
                  Bezirgan Plajı ve <strong>turkuaz koyları keşfetmek</strong> için özel transfer 
                  hizmeti veriyoruz. Tekne turları için iskele transferi de yapıyoruz.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Kalkan villa transfer</strong> ile özel villalar, apart oteller ve 
                  tatil evlerine güvenli ulaşım. <strong>Premium araç filosumuz</strong> ile 
                  Kalkan'ın lüks turizm standardına uygun hizmet kalitesi sunuyoruz.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Kalkan Transfer Güzergahları
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-600">Havalimanı - Kalkan:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• AYT → Kalkan Merkez (3 saat)</li>
                    <li>• AYT → Bezirgan (3 saat)</li>
                    <li>• AYT → Kapıtaş (3 saat)</li>
                    <li>• AYT → Patara (3.2 saat)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-purple-600">Kalkan Bölge İçi:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Kalkan → Kapıtaş Plajı (5 dk)</li>
                    <li>• Kalkan → Bezirgan (10 dk)</li>
                    <li>• Kalkan → Patara Plajı (15 dk)</li>
                    <li>• Kalkan → Kaş (30 dk)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-green-600">Lüks Tesisler:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Butik Oteller</li>
                    <li>• Lüks Villalar</li>
                    <li>• Premium Apart Oteller</li>
                    <li>• Özel Tatil Evleri</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* TURSAB Güvencesi */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  TS
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">TURSAB Üyesi Güvencesi</h4>
                  <p className="text-sm text-gray-600">Türkiye Seyahat Acentaları Birliği Onaylı</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-700"><strong>Belge No:</strong> 11924</p>
                  <p className="text-gray-700"><strong>Şirket:</strong> SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi</p>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Adres:</strong> Güzelyurt Mah. Serik Cad. No: 138/2 Aksu/Antalya</p>
                  <p className="text-gray-700"><strong>Telefon:</strong> +90 532 574 26 82</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  ✅ TURSAB güvencesi ile %100 güvenli Kalkan lüks transfer hizmeti
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kalkan Transfer Destinasyonları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kalkan ve Akdeniz kıyısındaki lüks destinasyonlara premium transfer hizmeti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
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
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{destination.name}</h3>
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
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">
              * Mesafe ve trafik durumuna göre süreler değişebilir. Kesin bilgi için iletişime geçin.
            </p>
            <a
              href="tel:+905325742682"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              <Phone className="w-5 h-5" />
              Bilgi Al: +90 532 574 26 82
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kalkan Transfer Hizmet Türlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kalkan ve Akdeniz kıyısına özel lüks transfer çözümleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    to="/rezervasyon"
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Rezervasyon Yap
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kalkan Transfer'de Neden GATE Transfer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kalkan lüks turizm standardında güvenilir ve premium transfer hizmeti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kalkan Transfer Hakkında Sık Sorulan Sorular
            </h2>
            <p className="text-lg text-gray-600">
              Kalkan transfer hizmetimiz hakkında merak ettikleriniz
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Başka sorularınız mı var?</p>
            <a
              href="tel:+905325742682"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              <Phone className="w-5 h-5" />
              Hemen Arayın: +90 532 574 26 82
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Award className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kalkan'ın En Lüks Transfer Firması
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              523+ memnun müşteri ile Kalkan lüks transfer hizmetinde uzman firma. 
              Akdeniz'in incisi Kalkan yolculuğunda premium konfor için hemen rezervasyon yapın.
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
              href="tel:+905325742682"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              +90 532 574 26 82
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2">4.9/5 ⭐ (523+ Kalkan transfer değerlendirmesi)</span>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🏖️ Turkuaz Akdeniz Premium Transfer Deneyimi
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default KalkanTransfer;
