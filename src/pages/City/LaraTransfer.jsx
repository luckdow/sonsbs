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
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LaraTransfer = () => {
  const [openFaq, setOpenFaq] = React.useState(0);

  const popularDestinations = [
    { name: 'Antalya Havalimanı (AYT)', time: '35 dk', price: '€25-40', icon: <Plane className="w-5 h-5" /> },
    { name: 'Lara Beach Oteller', time: '5-10 dk', price: '€15-25', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Kaleiçi Merkez', time: '20 dk', price: '€20-30', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Antalya Merkez', time: '15 dk', price: '€15-25', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Konyaaltı Sahil', time: '25 dk', price: '€20-35', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Side Antik Kenti', time: '60 dk', price: '€50-75', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Belek Golf Bölgesi', time: '25 dk', price: '€30-45', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Kemer Marina', time: '75 dk', price: '€60-85', icon: <MapPin className="w-5 h-5" /> }
  ];

  const services = [
    {
      title: 'Lara Otel Transfer',
      description: 'Lara bölgesi 5 yıldızlı resort oteller, Barut Collection, Concorde, Delphin ve tüm lüks otel komplekslerine profesyonel transfer hizmeti.',
      icon: <Building2 className="w-8 h-8" />,
      features: ['Otel Koordinasyonu', 'Resepsiyon Bilgilendirme', 'Bagaj Taşıma', 'VIP Karşılama']
    },
    {
      title: 'Lara Havalimanı Transfer',
      description: 'Antalya Havalimanı\'ndan Lara bölgesine en hızlı güzergah ile transfer. Lara Beach, Kundu bölgesi tüm otellere direkt ulaşım.',
      icon: <Plane className="w-8 h-8" />,
      features: ['35 dk Süre', 'Uçuş Takibi', 'Karşılama Tabelası', '24/7 Hizmet']
    },
    {
      title: 'Lara Şehir İçi Transfer',
      description: 'Lara bölgesinden Antalya merkez, Kaleiçi, Marina, AVM\'ler ve hastane transferleri. Lara\'dan şehir içi tüm noktalara ulaşım.',
      icon: <Car className="w-8 h-8" />,
      features: ['Anında Rezervasyon', 'GPS Takip', 'Klimalı Araçlar', 'Uygun Fiyat']
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Lara Bölge Uzmanı', desc: 'Lara otelleri ve bölgeye hakim uzman şoförler' },
    { icon: <Clock className="w-6 h-6 text-blue-500" />, title: '7/24 Lara Transfer', desc: 'Gece gündüz her saatte Lara transfer hizmeti' },
    { icon: <Users className="w-6 h-6 text-purple-500" />, title: 'Otel Partneri', desc: 'Lara bölgesi otelleriyle anlaşmalı transfer servisi' },
    { icon: <Car className="w-6 h-6 text-orange-500" />, title: 'Lüks Araç Filosu', desc: 'Mercedes Vito ve Sprinter lüks transfer araçları' },
    { icon: <CreditCard className="w-6 h-6 text-indigo-500" />, title: 'Otel Ödeme', desc: 'Otelde nakit ödeme veya online ödeme seçenekleri' },
    { icon: <Globe className="w-6 h-6 text-teal-500" />, title: 'Çok Dilli Hizmet', desc: 'Türkçe, İngilizce, Rusça, Almanca destek' }
  ];

  const faqs = [
    {
      question: "Antalya havalimanından Lara bölgesine transfer süresi ne kadar?",
      answer: "Antalya Havalimanı'ndan Lara bölgesine transfer süresi 35-45 dakika arasındadır. Trafik durumuna göre değişebilir. Lara Beach otelleri en yakın mesafede olduğu için hızlı ulaşım sağlanır."
    },
    {
      question: "Lara transfer rezervasyonu nasıl yapılır?",
      answer: "Online rezervasyon formumuzdan 24/7 rezervasyon yapabilir, +90 532 574 26 82 numaralı telefondan arayabilir veya WhatsApp ile iletişime geçebilirsiniz. Otel adresinizi belirttiğinizde Lara transfer ayarlanır."
    },
    {
      question: "Lara bölgesi hangi otellere transfer yapıyorsunuz?",
      answer: "Barut Collection, Concorde Lara, Delphin Imperial, Royal Wings, Titanic Beach Lara ve Lara-Kundu bölgesindeki tüm 4-5 yıldızlı otellere transfer hizmeti veriyoruz."
    },
    {
      question: "Lara'dan şehir merkezi ve diğer bölgelere gidiş var mı?",
      answer: "Evet, Lara'dan Kaleiçi, Konyaaltı, Antalya merkez, Side, Kemer, Belek gibi tüm turistik bölgelere transfer hizmeti sunuyoruz. Lara konumunu bilen şoförlerimizle güvenli ulaşım."
    },
    {
      question: "Lara otelleri için grup transfer hizmeti var mı?",
      answer: "Evet, Lara bölgesi büyük otelleri için 8+1, 14+1 ve 30+1 kişilik araçlarımızla grup transferleri yapıyoruz. Düğün ve toplantı grupları için özel fiyatlarımız mevcuttur."
    },
    {
      question: "Lara transfer fiyatları nasıl belirleniyor?",
      answer: "Lara transfer fiyatları mesafe, araç tipi ve yolcu sayısına göre belirlenir. Havalimanı-Lara arası €25-40, şehir içi transferler €15-35 arasındadır. Kesin fiyat için arayabilirsiniz."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Lara Transfer | Lara Otel Transfer | Antalya Havalimanı Lara Ulaşım</title>
        <meta name="description" content="Lara transfer hizmeti. Antalya havalimanından Lara Beach otellerine güvenli transfer. Lara Barut Collection, Concorde, Delphin otel transferi. 7/24 hizmet." />
        <meta name="keywords" content="lara transfer, lara otel transfer, antalya lara transfer, lara beach transfer, antalya havalimanı lara, lara barut transfer, lara concorde transfer, lara kundu transfer" />
        <link rel="canonical" href="https://www.gatetransfer.com/lara-transfer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Lara Transfer Hizmeti | Lara Otel ve Havalimanı Transferi" />
        <meta property="og:description" content="Lara bölgesine profesyonel transfer hizmeti. Havalimanı, otel ve şehir içi güvenli ulaşım. Hemen rezervasyon yapın!" />
        <meta property="og:url" content="https://gatetransfer.com/lara-transfer" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lara Transfer Hizmeti | GATE Transfer" />
        <meta name="twitter:description" content="Lara bölgesi transfer hizmeti. Güvenli, konforlu, uygun fiyatlı." />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GATE Transfer - Lara Transfer Hizmeti",
            "description": "Lara bölgesi otel ve havalimanı transfer hizmeti. Güvenli, konforlu ve profesyonel ulaşım çözümleri.",
            "url": "https://gatetransfer.com/lara-transfer",
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
              "latitude": "36.8969",
              "longitude": "30.7133"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "€15-€85",
            "currenciesAccepted": "EUR,TRY",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "areaServed": {
              "@type": "City",
              "name": "Lara",
              "addressCountry": "TR"
            },
            "serviceType": "Transfer Service",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1245"
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
                  <span className="text-sm font-medium text-white">Lara Transfer</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Lara Luxury Resort Transfer
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Lara Transfer
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-3xl">Otel & Havalimanı Ulaşım</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Antalya Havalimanı'ndan Lara Beach otellerine, Barut Collection, Concorde ve lüks resort'lara 
              <span className="text-blue-400 font-semibold"> hızlı, güvenli ve konforlu</span> transfer hizmeti
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
                <div className="text-2xl font-bold text-blue-400">1245+</div>
                <div className="text-gray-400 text-xs">Lara Transferi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">35dk</div>
                <div className="text-gray-400 text-xs">Havalimanı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-gray-400 text-xs">Hizmet</div>
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
              Lara Transfer Hizmeti - Lüks Otel Ulaşımında Uzman
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Lara transfer hizmeti</strong> alanında uzman firmamız, 
                  <strong> Antalya Havalimanı'ndan Lara bölgesine</strong> en hızlı güzergah ile 35 dakikada 
                  güvenli ulaşım sağlar. Lara Beach otelleri için özel <strong>profesyonel transfer</strong> çözümleri sunuyoruz.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Lara otel transfer</strong> hizmetimiz kapsamında Barut Collection, Concorde Lara, 
                  Delphin Imperial, Royal Wings ve tüm 5 yıldızlı resort otellere <strong>direkt transfer</strong> 
                  gerçekleştiriyoruz. Otel resepsiyon koordinasyonu ile kusursuz hizmet.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Lara Kundu bölgesi</strong> lüks otelleri için özel transfer planlaması yapıyoruz. 
                  The Land of Legends, Titanic Beach Lara, Concorde Luxury Resort gibi 
                  <strong>ultra lüks otellere VIP transfer</strong> hizmeti veriyoruz.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Lara şehir içi transfer</strong> ile bölgeden Kaleiçi tarihi merkez, 
                  Konyaaltı sahil, Marina, alışveriş merkezleri ve hastanelere güvenli ulaşım sağlıyoruz. 
                  Lara bölgesini iyi bilen şoförlerimizle <strong>konforlu yolculuk</strong> garantisi.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Lara Transfer Güzergahları
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-600">Havalimanı - Lara:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• AYT → Lara Beach (35 dk)</li>
                    <li>• AYT → Barut Collection (40 dk)</li>
                    <li>• AYT → Concorde Lara (35 dk)</li>
                    <li>• AYT → Delphin Imperial (40 dk)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-purple-600">Lara Şehir İçi:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Lara → Kaleiçi (20 dk)</li>
                    <li>• Lara → Konyaaltı (25 dk)</li>
                    <li>• Lara → Antalya Merkez (15 dk)</li>
                    <li>• Lara → Marina (25 dk)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-green-600">Lara Bölge Transferi:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Lara → Side (60 dk)</li>
                    <li>• Lara → Belek (25 dk)</li>
                    <li>• Lara → Kemer (75 dk)</li>
                    <li>• Lara → Alanya (90 dk)</li>
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
                  ✅ TURSAB güvencesi ile %100 güvenli Lara transfer hizmeti
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
              Lara Transfer Destinasyonları ve Fiyatları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lara bölgesi ve çevresindeki popüler destinasyonlara sabit fiyat garantili transfer
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
                    <div className="text-lg font-bold text-green-600">{destination.price}</div>
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
              * Fiyatlar araç tipine ve yolcu sayısına göre değişebilir. Kesin fiyat için iletişime geçin.
            </p>
            <a
              href="tel:+905325742682"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              <Phone className="w-5 h-5" />
              Fiyat Bilgisi: +90 532 574 26 82
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lara Transfer Hizmet Türlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lara bölgesine özel transfer çözümleri ile lüks otel konforunda yolculuk
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
              Lara Transfer'de Neden GATE Transfer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lara bölgesi otelleriyle partnerlikleri ve uzman şoförlerle güvenilir transfer
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
              Lara Transfer Hakkında Sık Sorulan Sorular
            </h2>
            <p className="text-lg text-gray-600">
              Lara transfer hizmetimiz hakkında merak ettikleriniz
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
              Lara'nın En Güvenilir Transfer Firması
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              1245+ memnun müşteri ile Lara transfer hizmetinde uzman firma. 
              Lüks otel konforunda güvenli yolculuk için hemen rezervasyon yapın.
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
            <span className="ml-2">4.9/5 ⭐ (1,245+ Lara transfer değerlendirmesi)</span>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🏆 Lara Bölgesi Güvenilir Transfer Hizmeti Ödülü
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LaraTransfer;
