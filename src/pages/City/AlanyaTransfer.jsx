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

const AlanyaTransfer = () => {
  const [openFaq, setOpenFaq] = React.useState(0);

  const popularDestinations = [
    { name: 'Antalya Havalimanı (AYT)', time: '2 saat', icon: <Plane className="w-5 h-5" /> },
    { name: 'Alanya Kalesi', time: '10 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Kleopatra Plajı', time: '5 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Dim Çayı', time: '15 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Mahmutlar', time: '8 dk', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Oba', time: '12 dk', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Damlataş Mağarası', time: '5 dk', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Konakli', time: '15 dk', icon: <Building2 className="w-5 h-5" /> }
  ];

  const services = [
    {
      title: 'Alanya Havalimanı Transfer',
      description: 'Antalya Havalimanı\'ndan Alanya\'ya 2 saatlik manzaralı yolculuk. Denizin ve Toros Dağlarının eşsiz manzarası eşliğinde konforlu transfer.',
      icon: <Plane className="w-8 h-8" />,
      features: ['2 Saat Süre', 'Manzaralı Yolculuk', 'Toros Geçidi', '24/7 Hizmet']
    },
    {
      title: 'Alanya Tarihi Transfer',
      description: 'Alanya Kalesi, Kızılkule, Damlataş Mağarası ve antik limanı tarihi gezilere özel kültür turu transferi.',
      icon: <Car className="w-8 h-8" />,
      features: ['Alanya Kalesi', 'Kızılkule', 'Damlataş Mağarası', 'Antik Liman']
    },
    {
      title: 'Alanya Beach Resort Transfer',
      description: 'Kleopatra Plajı, Oba, Mahmutlar ve Konakli\'deki beach resort\'lara özel plaj turizmi transferi.',
      icon: <Building2 className="w-8 h-8" />,
      features: ['Kleopatra Plajı', 'Beach Resort\'lar', 'Plaj Tesisleri', 'Sahil Otelleri']
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Uzun Mesafe Uzmanı', desc: 'Antalya-Alanya arası 2 saatlik mesafede uzman şoförler' },
    { icon: <Clock className="w-6 h-6 text-blue-500" />, title: 'Manzaralı Transfer', desc: 'Toros Dağları ve Akdeniz manzarası eşliğinde konfor' },
    { icon: <Users className="w-6 h-6 text-purple-500" />, title: 'Plaj Turizm Uzmanı', desc: 'Alanya plaj tesisleri ve turistik yerleri iyi bilen ekip' },
    { icon: <Car className="w-6 h-6 text-orange-500" />, title: 'Uzun Yol Araçları', desc: 'Uzun mesafe için konforlu ve güvenli araç filosu' },
    { icon: <CreditCard className="w-6 h-6 text-indigo-500" />, title: 'Sabit Fiyat Garantisi', desc: 'Alanya transferinde şeffaf ve sabit fiyat garantisi' },
    { icon: <Globe className="w-6 h-6 text-teal-500" />, title: 'Çok Dilli Hizmet', desc: 'Alanya turist yoğunluğu için çok dilli profesyonel hizmet' }
  ];

  const faqs = [
    {
      question: "Antalya havalimanından Alanya'ya transfer süresi ne kadar?",
      answer: "Antalya Havalimanı'ndan Alanya'ya transfer süresi yaklaşık 2 saattir. Toros Dağları üzerinden geçilen manzaralı yolculuk boyunca Akdeniz ve dağ manzarası eşliğinde konforlu yolculuk yapılır."
    },
    {
      question: "Alanya transfer rezervasyonu nasıl yapılır?",
      answer: "Online rezervasyon formumuzdan 24/7 rezervasyon yapabilir, +90 532 574 26 82 numaralı telefondan arayabilir veya WhatsApp ile iletişime geçebilirsiniz. Alanya bölge ve konaklama yerinizi belirttiğinizde transfer ayarlanır."
    },
    {
      question: "Alanya'da hangi bölgelere transfer yapılır?",
      answer: "Alanya merkez, Kleopatra Plajı, Mahmutlar, Oba, Konakli, Kestel, Avsallar ve tüm Alanya bölgelerine transfer hizmeti veriyoruz. Otel ve konaklama tesislerine kapı kapı hizmet sunuyoruz."
    },
    {
      question: "Alanya Kalesi ve tarihi yerlere tur transferi var mı?",
      answer: "Evet, Alanya Kalesi, Kızılkule, Damlataş Mağarası, Antik Liman ve Alanya'nın tüm tarihi yerlerine özel tur transferi ve rehberli turlar organize ediyoruz."
    },
    {
      question: "Alanya'dan havalimanına dönüş transferi nasıl?",
      answer: "Alanya'dan Antalya Havalimanı'na dönüş transferi 2 saat sürer. Uçuş saatinize göre 3-4 saat önceden çıkış yaparak rahat bir yolculuk sağlıyoruz. Dönüş transferinde de manzaralı yolculuk."
    },
    {
      question: "Alanya transfer fiyatları nasıl?",
      answer: "Alanya uzun mesafe transfer için özel fiyatlarımız bulunmaktadır. Havalimanı-Alanya arası €60-90, Alanya bölge içi transferler için uygun fiyatlar sunuyoruz. Grup indirimleri mevcuttur."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Alanya Transfer | Antalya Alanya Transfer | Alanya Havalimanı Ulaşım Hizmeti</title>
        <meta name="description" content="Alanya transfer hizmeti. Antalya havalimanından Alanya'ya uzun mesafe transfer. Alanya Kalesi, Kleopatra Plajı, tarihi yerler transfer. Güvenli ulaşım." />
        <meta name="keywords" content="alanya transfer, antalya alanya transfer, alanya havalimanı transfer, alanya kale transfer, kleopatra plajı transfer, alanya turizm transfer" />
        <link rel="canonical" href="https://gatetransfer.com/alanya-transfer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Alanya Transfer Hizmeti | Alanya Tarihi Yerler Transferi" />
        <meta property="og:description" content="Alanya bölgesine uzun mesafe transfer hizmeti. Alanya Kalesi, plajlar ve tarihi yerler arası güvenli ulaşım. Hemen rezervasyon yapın!" />
        <meta property="og:url" content="https://gatetransfer.com/alanya-transfer" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alanya Transfer Hizmeti | GATE Transfer" />
        <meta name="twitter:description" content="Alanya uzun mesafe transfer hizmeti. Güvenli, manzaralı, profesyonel." />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GATE Transfer - Alanya Transfer Hizmeti",
            "description": "Alanya bölgesi havalimanı, tarihi yerler ve plaj tesisleri transfer hizmeti. Uzun mesafe güvenli ulaşım çözümleri.",
            "url": "https://gatetransfer.com/alanya-transfer",
            "telephone": "+905325742682",
            "email": "info@sbstravel.net",
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
              "latitude": "36.5448",
              "longitude": "31.9999"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "€60-€120",
            "currenciesAccepted": "EUR,TRY",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "areaServed": {
              "@type": "City",
              "name": "Alanya",
              "addressCountry": "TR"
            },
            "serviceType": "Long Distance Transfer Service",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "743"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-pink-600/30"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
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
                  <span className="text-sm font-medium text-white">Alanya Transfer</span>
                </div>
              </li>
            </ol>
          </nav>          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Alanya Historic Castle Transfer
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Alanya Transfer
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-3xl">Tarihi Kale & Plaj Ulaşım</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Antalya Havalimanı'ndan Alanya'ya, Alanya Kalesi ve Kleopatra Plajı'na 
              <span className="text-orange-400 font-semibold"> manzaralı, güvenli ve konforlu</span> uzun mesafe transfer hizmeti
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                to="/rezervasyon"
                onClick={() => window.scrollTo(0, 0)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
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
                <div className="text-2xl font-bold text-orange-400">743+</div>
                <div className="text-gray-400 text-xs">Alanya Transferi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">2h</div>
                <div className="text-gray-400 text-xs">Havalimanı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-gray-400 text-xs">Uzun Mesafe</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">4.8</div>
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
              Alanya Transfer Hizmeti - Uzun Mesafe Tarihi Kale Ulaşımı
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Alanya transfer hizmeti</strong> ile Antalya Havalimanı'ndan 
                  <strong> tarihi Alanya'ya</strong> 2 saatlik manzaralı yolculuk yapın. 
                  Toros Dağları üzerinden geçen güzergahta <strong>Akdeniz ve dağ manzarası</strong> eşliğinde konfor.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Alanya Kalesi transfer</strong> hizmetimiz ile dünyaca ünlü 
                  Alanya Kalesi, Kızılkule ve Damlataş Mağarası'na direkt ulaşım sağlıyoruz. 
                  <strong>Tarihi yerler için özel tur transferlerimizle</strong> kültür turizmini deneyimleyin.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Alanya plaj transfer</strong> ile Kleopatra Plajı, Mahmutlar, 
                  Oba ve Konakli'deki plaj tesislerine güvenli ulaşım. <strong>Beach resort transferlerimiz</strong> ile 
                  Alanya'nın turkuaz sularında tatil keyfini çıkarın.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Uzun mesafe Alanya transferi</strong> ile profesyonel şoförlerimiz 
                  2 saatlik yolculukta size rehberlik eder. <strong>Manzaralı yolculuk ve güvenli ulaşım</strong> ile 
                  Alanya'nın tüm güzelliklerinden yararlanın.
                </p>
              </div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Alanya Transfer Güzergahları
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-orange-600">Havalimanı - Alanya:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• AYT → Alanya Merkez (2 saat)</li>
                    <li>• AYT → Kleopatra Plajı (2 saat)</li>
                    <li>• AYT → Mahmutlar (2.1 saat)</li>
                    <li>• AYT → Oba (2.2 saat)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-red-600">Alanya Bölge İçi:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Alanya → Alanya Kalesi (10 dk)</li>
                    <li>• Alanya → Dim Çayı (15 dk)</li>
                    <li>• Alanya → Konakli (15 dk)</li>
                    <li>• Alanya → Avsallar (20 dk)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-pink-600">Tarihi & Turistik:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Alanya Kalesi</li>
                    <li>• Kızılkule</li>
                    <li>• Damlataş Mağarası</li>
                    <li>• Antik Liman</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* TURSAB Güvencesi */}
            <div className="bg-gradient-to-r from-green-50 to-orange-50 p-6 rounded-xl border border-green-200">
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
                  ✅ TURSAB güvencesi ile %100 güvenli Alanya uzun mesafe transfer hizmeti
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
              Alanya Transfer Destinasyonları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alanya ve çevresindeki tarihi yerler ile plaj tesislerine uzun mesafe transfer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
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
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 group transition-all duration-300"
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
              Alanya Transfer Hizmet Türlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alanya uzun mesafe ve tarihi yerler için özel profesyonel transfer çözümleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
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
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
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
              Alanya Transfer'de Neden GATE Transfer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uzun mesafe uzmanlığı ile güvenilir ve manzaralı transfer hizmeti
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
              Alanya Transfer Hakkında Sık Sorulan Sorular
            </h2>
            <p className="text-lg text-gray-600">
              Alanya transfer hizmetimiz hakkında merak ettikleriniz
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
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              <Phone className="w-5 h-5" />
              Hemen Arayın: +90 532 574 26 82
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-900 to-pink-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Award className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Alanya'nın En Uzun Mesafe Uzmanı Transfer Firması
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              743+ memnun müşteri ile Alanya uzun mesafe transfer hizmetinde uzman firma. 
              Tarihi yerler ve manzaralı yolculuk için profesyonel hizmet hemen rezervasyon yapın.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/rezervasyon"
              onClick={() => window.scrollTo(0, 0)}
              className="bg-white text-orange-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
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
            <span className="ml-2">4.8/5 ⭐ (743+ Alanya transfer değerlendirmesi)</span>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🏰 Tarihi Kale & Manzaralı Uzun Mesafe Deneyimi
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AlanyaTransfer;
