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

const SideTransfer = () => {
  const [openFaq, setOpenFaq] = React.useState(0);

  const popularDestinations = [
    { 
      name: 'Antalya Havalimanı (AYT)', 
      time: '1.5 saat', 
      icon: <Plane className="w-5 h-5" />,
      description: 'Havalimanından Side antik kentine güvenli ve konforlu transfer'
    },
    { 
      name: 'Side Antik Kenti', 
      time: '5 dk', 
      icon: <MapPin className="w-5 h-5" />,
      description: 'Tarihi Side antik kentinin kalbi olan merkezi bölgeye ulaşım'
    },
    { 
      name: 'Apollon Tapınağı', 
      time: '3 dk', 
      icon: <MapPin className="w-5 h-5" />,
      description: 'Antik Apollon tapınağına deniz kenarında muhteşem manzara'
    },
    { 
      name: 'Side Müzesi', 
      time: '2 dk', 
      icon: <Building2 className="w-5 h-5" />,
      description: 'Side müzesine kültürel miras keşfi için özel transfer'
    },
    { 
      name: 'Manavgat Şelalesi', 
      time: '10 dk', 
      icon: <MapPin className="w-5 h-5" />,
      description: 'Manavgat şelalesine doğa harikası içinde ferahlatıcı gezi'
    },
    { 
      name: 'Manavgat Çarşısı', 
      time: '8 dk', 
      icon: <Building2 className="w-5 h-5" />,
      description: 'Manavgat çarşı merkezine alışveriş ve keşif turu'
    },
    { 
      name: 'Kumköy', 
      time: '3 dk', 
      icon: <MapPin className="w-5 h-5" />,
      description: 'Kumköy sahil şeridindeki otellere hızlı plaj transferi'
    },
    { 
      name: 'Çolaklı', 
      time: '5 dk', 
      icon: <Building2 className="w-5 h-5" />,
      description: 'Çolaklı turistik bölgesine sakin sahil kenarında yolculuk'
    }
  ];

  const services = [
    {
      title: 'Side Antik Kent Transfer',
      description: 'Side Antik Kenti, Apollon Tapınağı ve Side Müzesi\'ne kültür turizmi transferi. Antik tiyatro ve tarihi kalıntılara rehberli turlar.',
      icon: <Building2 className="w-8 h-8" />,
      features: ['Side Antik Kenti', 'Apollon Tapınağı', 'Antik Tiyatro', 'Tarihi Kalıntılar']
    },
    {
      title: 'Side Havalimanı Transfer',
      description: 'Antalya Havalimanı\'ndan Side\'ye 1.5 saatlik hızlı transfer. Antik kent turizmi için özel araçlar ve kültür rehberi seçenekleri.',
      icon: <Plane className="w-8 h-8" />,
      features: ['1.5 Saat Süre', 'Kültür Turları', 'Antik Kent Rehberi', '24/7 Hizmet']
    },
    {
      title: 'Side Beach Resort Transfer',
      description: 'Side plaj otelleri, Kumköy ve Çolaklı\'daki beach resort\'lara özel deniz turizmi transferi.',
      icon: <Car className="w-8 h-8" />,
      features: ['Side Plajları', 'Beach Resort\'lar', 'Kumköy Tesisleri', 'Çolaklı Otelleri']
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Antik Kent Uzmanı', desc: 'Side antik kenti ve tarihi yerleri iyi bilen uzman şoförler' },
    { icon: <Clock className="w-6 h-6 text-blue-500" />, title: '7/24 Kültür Transfer', desc: 'Antik kent ziyaretleri için esnek saatlerde transfer hizmeti' },
    { icon: <Users className="w-6 h-6 text-purple-500" />, title: 'Kültür Turizm Uzmanı', desc: 'Side tarihi ve arkeolojik alanları için özel tur hizmetleri' },
    { icon: <Car className="w-6 h-6 text-orange-500" />, title: 'Konforlu Antik Araçlar', desc: 'Tarihi geziler için klimali ve konforlu araç filosu' },
    { icon: <CreditCard className="w-6 h-6 text-indigo-500" />, title: 'Kültür Paketi Fiyatları', desc: 'Antik kent turları için özel paket fiyat avantajları' },
    { icon: <Globe className="w-6 h-6 text-teal-500" />, title: 'Çok Dilli Rehberlik', desc: 'Side tarihi için çok dilli kültür rehberi hizmeti' }
  ];

  const faqs = [
    {
      question: "Antalya havalimanından Side'ye transfer süresi ne kadar?",
      answer: "Antalya Havalimanı'ndan Side'ye transfer süresi yaklaşık 1.5 saattir. Side Antik Kenti ve beach resort'lara direkt ulaşım sağlanır. Trafik durumuna göre süre değişebilir."
    },
    {
      question: "Side antik kent transfer rezervasyonu nasıl yapılır?",
      answer: "Online rezervasyon formumuzdan 24/7 rezervasyon yapabilir, +90 532 574 26 82 numaralı telefondan arayabilir veya WhatsApp ile iletişime geçebilirsiniz. Side bölge ve konaklama yerinizi belirttiğinizde transfer ayarlanır."
    },
    {
      question: "Side'de hangi tarihi yerlere transfer yapılır?",
      answer: "Side Antik Kenti, Apollon Tapınağı, Side Müzesi, Antik Tiyatro ve tüm arkeolojik alanlara transfer hizmeti veriyoruz. Ayrıca Manavgat Şelalesi ve çevredeki turistik yerlere de ulaşım sağlıyoruz."
    },
    {
      question: "Side antik kent turları nasıl?",
      answer: "Side Antik Kenti için rehberli turlar organize ediyoruz. Apollon Tapınağı, Antik Tiyatro, Side Müzesi ve tarihi kalıntılar için özel kültür turu transferi sunuyoruz."
    },
    {
      question: "Side'den Manavgat Şelalesi'ne nasıl gidilir?",
      answer: "Side'den Manavgat Şelalesi'ne 10 dakikalık kısa mesafede transfer hizmeti veriyoruz. Şelale turu ile Side antik kent turunu birleştiren özel paketlerimiz bulunmaktadır."
    },
    {
      question: "Side transfer fiyatları nasıl?",
      answer: "Side antik kent turizmi için özel fiyatlarımız bulunmaktadır. Havalimanı-Side arası €45-65, Side bölge içi transferler ve kültür turları için avantajlı fiyatlar sunuyoruz."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Side Transfer | Antalya Side Transfer | Side Antik Kent Havalimanı Ulaşım</title>
        <meta name="description" content="Side transfer hizmeti. Antalya havalimanından Side'ye antik kent transfer. Side Apollon Tapınağı, antik tiyatro, müze transfer. Kültür turizmi." />
        <meta name="keywords" content="side transfer, antalya side transfer, side havalimanı transfer, side antik kent transfer, apollon tapınağı transfer, side müzesi transfer" />
        <link rel="canonical" href="https://www.gatetransfer.com/side-transfer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Side Transfer Hizmeti | Side Antik Kent Transferi" />
        <meta property="og:description" content="Side bölgesine antik kent turizm transfer hizmeti. Side tarihi yerler ve beach resort'lar arası güvenli ulaşım. Hemen rezervasyon yapın!" />
        <meta property="og:url" content="https://gatetransfer.com/side-transfer" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Side Transfer Hizmeti | GATE Transfer" />
        <meta name="twitter:description" content="Side antik kent turizm transfer hizmeti. Kültür, tarih, güvenli." />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GATE Transfer - Side Transfer Hizmeti",
            "description": "Side bölgesi antik kent, havalimanı ve beach resort transfer hizmeti. Kültür turizmi için özel profesyonel ulaşım çözümleri.",
            "url": "https://gatetransfer.com/side-transfer",
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
              "latitude": "36.7674",
              "longitude": "31.3901"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "€45-€85",
            "currenciesAccepted": "EUR,TRY",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "areaServed": {
              "@type": "City",
              "name": "Side",
              "addressCountry": "TR"
            },
            "serviceType": "Ancient City Transfer Service",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "658"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30"></div>
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
                  <span className="text-sm font-medium text-white">Side Transfer</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Side Ancient City Transfer
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Side Transfer
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-3xl">Antik Kent & Apollon Ulaşım</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Antalya Havalimanı'ndan Side'ye, Side Antik Kenti ve Apollon Tapınağı'na 
              <span className="text-purple-400 font-semibold"> tarihi, kültürel ve güvenli</span> antik kent transfer hizmeti
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                to="/rezervasyon"
                onClick={() => window.scrollTo(0, 0)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
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
                <div className="text-2xl font-bold text-purple-400">658+</div>
                <div className="text-gray-400 text-xs">Side Transferi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">1.5h</div>
                <div className="text-gray-400 text-xs">Havalimanı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-gray-400 text-xs">Antik Kent</div>
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
              Side Transfer Hizmeti - Antik Kent Kültür Turizmi Ulaşımı
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Side transfer hizmeti</strong> ile Antalya Havalimanı'ndan 
                  <strong> antik kent Side'ye</strong> 1.5 saatlik tarihi yolculuk yapın. 
                  Antik kent turizmi merkezi Side'de <strong>kültür ve tarih deneyimi</strong> için profesyonel konfor.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Side Antik Kent transfer</strong> hizmetimiz ile Side Antik Kenti, 
                  Apollon Tapınağı, Side Müzesi ve Antik Tiyatro'ya direkt ulaşım sağlıyoruz. 
                  <strong>Tarihi kalıntılar için özel tur transferlerimizle</strong> antik dönemi keşfedin.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Side beach resort transfer</strong> ile Kumköy, Çolaklı ve 
                  Side plaj otelleri için güvenli ulaşım. <strong>Antik kent ve plaj turizmini</strong> 
                  bir arada deneyimleyebileceğiniz özel transferlerimiz.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Side Manavgat transfer</strong> ile Manavgat Şelalesi'ne 10 dakika mesafede 
                  doğa turu transferi. <strong>Antik kent kültür turizmi paket hizmetlerimiz</strong> ile 
                  Side'nin tüm güzelliklerinden yararlanın.
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Side Transfer Güzergahları
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-purple-600">Havalimanı - Side:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• AYT → Side Antik Kent (1.5 saat)</li>
                    <li>• AYT → Apollon Tapınağı (1.5 saat)</li>
                    <li>• AYT → Kumköy (1.5 saat)</li>
                    <li>• AYT → Çolaklı (1.6 saat)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-600">Side Bölge İçi:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Side → Manavgat Şelalesi (10 dk)</li>
                    <li>• Side → Manavgat Çarşı (8 dk)</li>
                    <li>• Side → Belek (20 dk)</li>
                    <li>• Side → Serik (25 dk)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-600">Antik & Tarihi:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Side Antik Kenti</li>
                    <li>• Apollon Tapınağı</li>
                    <li>• Side Müzesi</li>
                    <li>• Antik Tiyatro</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* TURSAB Güvencesi */}
            <div className="bg-gradient-to-r from-green-50 to-purple-50 p-6 rounded-xl border border-green-200">
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
                  ✅ TURSAB güvencesi ile %100 güvenli Side antik kent transfer hizmeti
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
              Side Transfer Destinasyonları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Side ve çevresindeki antik kentler ile beach resort'lara kültür transfer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 group transition-all duration-300"
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
              Side Transfer Hizmet Türlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Side antik kent turizmi için özel profesyonel transfer çözümleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
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
              Side Transfer'de Neden GATE Transfer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antik kent uzmanlığı ile güvenilir ve kültürel transfer hizmeti
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
              Side Transfer Hakkında Sık Sorulan Sorular
            </h2>
            <p className="text-lg text-gray-600">
              Side transfer hizmetimiz hakkında merak ettikleriniz
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
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              <Phone className="w-5 h-5" />
              Hemen Arayın: +90 532 574 26 82
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Award className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Side'nin En Antik Kent Uzmanı Transfer Firması
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              658+ memnun müşteri ile Side antik kent transfer hizmetinde uzman firma. 
              Kültür turizmi ve tarihi deneyim için profesyonel hizmet hemen rezervasyon yapın.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/rezervasyon"
              onClick={() => window.scrollTo(0, 0)}
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
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
            <span className="ml-2">4.9/5 ⭐ (658+ Side transfer değerlendirmesi)</span>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🏛️ Antik Kent & Kültür Turizmi Premium Deneyimi
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SideTransfer;
