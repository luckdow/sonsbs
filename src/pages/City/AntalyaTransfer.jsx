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

const AntalyaTransfer = () => {
  const [openFaq, setOpenFaq] = React.useState(0);

  const popularDestinations = [
    { name: 'Antalya Havalimanı (AYT)', time: '45 dk', price: '€20-30', icon: <Plane className="w-5 h-5" /> },
    { name: 'Kaleiçi Tarihi Bölge', time: '25 dk', price: '€25-35', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Lara Beach Oteller', time: '35 dk', price: '€25-40', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Konyaaltı Sahil', time: '30 dk', price: '€25-35', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Antalya Merkez', time: '20 dk', price: '€20-30', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Side Antik Kenti', time: '75 dk', price: '€60-90', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Belek Golf Bölgesi', time: '40 dk', price: '€35-50', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Kemer Marina', time: '60 dk', price: '€45-65', icon: <MapPin className="w-5 h-5" /> }
  ];

  const services = [
    {
      title: 'Antalya Havalimanı Transfer',
      description: 'AYT havalimanından Antalya şehir merkezi, Lara, Konyaaltı ve tüm otel bölgelere profesyonel transfer hizmeti. Uçuş takibi ve karşılama hizmeti dahil.',
      icon: <Plane className="w-8 h-8" />,
      features: ['24/7 Hizmet', 'Uçuş Takibi', 'Karşılama Tabelası', 'Bagaj Yardımı']
    },
    {
      title: 'Antalya Otel Transfer',
      description: 'Antalya bölgesindeki tüm 5 yıldızlı oteller, resort\'lar ve butik otellere güvenli ve konforlu transfer. Kapıdan kapıya hizmet garantisi.',
      icon: <Building2 className="w-8 h-8" />,
      features: ['Kapıya Servis', 'Esnek Saatler', 'Otel Koordinasyonu', 'VIP Araçlar']
    },
    {
      title: 'Antalya Şehir İçi Transfer',
      description: 'Kaleiçi, Marina, AVM\'ler, hastaneler arası güvenli ulaşım. Antalya şehir içinde tüm noktalar arası hızlı ve ekonomik transfer çözümü.',
      icon: <Car className="w-8 h-8" />,
      features: ['Anında Rezervasyon', 'GPS Takip', 'Temiz Araçlar', 'Uygun Fiyat']
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6 text-green-500" />, title: 'Lisanslı ve Güvenli', desc: 'TURSAB üyesi, tam sigortalı araçlar ve profesyonel şoförler' },
    { icon: <Clock className="w-6 h-6 text-blue-500" />, title: '7/24 Antalya Transfer', desc: 'Gece gündüz her saatte rezervasyon ve transfer hizmeti' },
    { icon: <Users className="w-6 h-6 text-purple-500" />, title: 'Antalya Uzmanı Ekip', desc: 'Antalya\'yı iyi bilen, deneyimli ve güler yüzlü şoförler' },
    { icon: <Car className="w-6 h-6 text-orange-500" />, title: 'Konforlu Filo', desc: 'Yeni model, temiz, klimali Mercedes Vito ve Sprinter araçlar' },
    { icon: <CreditCard className="w-6 h-6 text-indigo-500" />, title: 'Güvenli Ödeme', desc: 'Nakit, banka kartı ve güvenli online ödeme seçenekleri' },
    { icon: <Globe className="w-6 h-6 text-teal-500" />, title: 'Çok Dilli Destek', desc: 'Türkçe, İngilizce, Rusça, Almanca müşteri desteği' }
  ];

  const faqs = [
    {
      question: "Antalya havalimanından şehir merkezine transfer ücreti ne kadar?",
      answer: "Antalya Havalimanı'ndan şehir merkezi, Kaleiçi ve Konyaaltı bölgesine transfer ücretlerimiz €20-35 arasında değişmektedir. Araç tipi, yolcu sayısı ve varış noktasına göre fiyatlandırma yapılır."
    },
    {
      question: "Antalya transfer rezervasyonu nasıl yapılır?",
      answer: "Online rezervasyon formumuzdan 24/7 rezervasyon yapabilir, +90 532 574 26 82 numaralı telefondan arayabilir veya WhatsApp ile iletişime geçebilirsiniz. Uçuş bilgilerinizi paylaştığınızda transfer ayarlanır."
    },
    {
      question: "Antalya havalimanında nasıl karşılanırım?",
      answer: "Şoförümüz terminal çıkışında isminizin yazılı olduğu tabela ile sizi bekler. Uçuş takibi yaptığımız için gecikmeli uçuşlarda da karşılama garantimiz vardır."
    },
    {
      question: "Antalya transfer hizmetiniz hangi bölgeleri kapsıyor?",
      answer: "Antalya merkez, Konyaaltı, Lara, Kepez, Kaleiçi, Aksu, Döşemealtı ve tüm otel bölgelerinin yanı sıra Kemer, Side, Belek, Alanya, Kaş gibi turistik bölgelere de transfer hizmeti veriyoruz."
    },
    {
      question: "Grup transfer için büyük araç var mı?",
      answer: "Evet, 8+1, 14+1 ve 30+1 kişilik Mercedes Sprinter ve otobüslerimiz ile grup transferleri gerçekleştiriyoruz. Düğün, toplantı ve grup seyahatleri için özel fiyatlarımız mevcuttur."
    },
    {
      question: "Antalya transfer iptal durumunda ücret alınır mı?",
      answer: "Transfer saatinden 24 saat öncesine kadar ücretsiz iptal hakkınız vardır. 24 saatten sonraki iptallerde %50 iptal ücreti uygulanır."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Antalya Transfer | Havalimanı Transfer Hizmeti | AYT Otel Ulaşım</title>
        <meta name="description" content="Antalya havalimanı transfer hizmeti. AYT'den Lara, Konyaaltı, Kaleiçi, Kemer, Side, Belek'e güvenli ulaşım. 7/24 rezervasyon, uygun fiyat. Antalya transfer firması." />
        <meta name="keywords" content="antalya transfer, antalya havalimanı transfer, AYT transfer, antalya taksi, lara transfer, konyaaltı transfer, kaleiçi transfer, antalya otel transfer, antalya ulaşım, antalya şoför hizmeti" />
        <link rel="canonical" href="https://gatetransfer.com/antalya-transfer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Antalya Transfer Hizmeti | Havalimanı ve Otel Transferi" />
        <meta property="og:description" content="Antalya'da profesyonel transfer hizmeti. Havalimanı, otel ve şehir içi güvenli ulaşım. Hemen rezervasyon yapın!" />
        <meta property="og:url" content="https://gatetransfer.com/antalya-transfer" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="GATE Transfer" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Antalya Transfer Hizmeti | GATE Transfer" />
        <meta name="twitter:description" content="Antalya havalimanı ve otel transfer hizmeti. Güvenli, konforlu, uygun fiyatlı." />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GATE Transfer - Antalya Transfer Hizmeti",
            "description": "Antalya havalimanı, otel ve şehir içi transfer hizmeti. Güvenli, konforlu ve profesyonel ulaşım çözümleri.",
            "url": "https://gatetransfer.com/antalya-transfer",
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
            "priceRange": "€20-€200",
            "currenciesAccepted": "EUR,TRY",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "36.8969",  
                "longitude": "30.7133"
              },
              "geoRadius": "100000"
            },
            "serviceType": "Transfer Service",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2847"
            },
            "sameAs": [
              "https://www.facebook.com/gatetransfer",
              "https://www.instagram.com/gatetransfer_antalya"
            ]
          })}
        </script>
        
        {/* Service Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Antalya Transfer Hizmeti",
            "serviceType": "Transportation Service",
            "provider": {
              "@type": "LocalBusiness",
              "name": "GATE Transfer"
            },
            "areaServed": {
              "@type": "City",
              "name": "Antalya",
              "addressCountry": "TR"
            },
            "description": "Antalya havalimanı, otel ve şehir içi profesyonel transfer hizmeti",
            "offers": {
              "@type": "Offer",
              "price": "20",
              "priceCurrency": "EUR",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "minPrice": "20",
                "maxPrice": "200",
                "priceCurrency": "EUR"
              }
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
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <Link 
                    to="/hizmetlerimiz" 
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Hizmetlerimiz
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">Antalya Transfer</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Antalya Professional Transfer
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Antalya Transfer
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl lg:text-3xl">Havalimanı & Otel Ulaşım</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Antalya Havalimanı'ndan (AYT) Lara, Konyaaltı, Kaleiçi, Kemer, Side ve Belek'e 
              <span className="text-blue-400 font-semibold"> 7/24 güvenli, konforlu ve ekonomik</span> transfer hizmeti
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
                <div className="text-2xl font-bold text-blue-400">2847+</div>
                <div className="text-gray-400 text-xs">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">99%</div>
                <div className="text-gray-400 text-xs">Memnuniyet</div>
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
              Antalya Transfer Hizmeti - Havalimanı ve Otel Ulaşımında Uzman
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Antalya transfer hizmeti</strong> alanında 10 yılı aşkın deneyimimizle, 
                  <strong> Antalya Havalimanı (AYT)</strong>'den şehir merkezi, Lara, Konyaaltı, Kaleiçi 
                  ve tüm turistik bölgelere <strong>güvenli ve konforlu ulaşım</strong> sağlıyoruz.
                </p>
                
                <p className="text-gray-700 mb-4">
                  TURSAB üyesi firmamız ile <strong>Antalya havalimanı transfer</strong> hizmetinde 
                  Mercedes Vito ve Sprinter araçlarımızla <strong>7/24 kesintisiz hizmet</strong> veriyoruz. 
                  Profesyonel şoförlerimiz ile güvenli yolculuk garantisi sağlıyoruz.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-4">
                  <strong>Antalya otel transfer</strong> hizmetimiz kapsamında Lara bölgesi 5 yıldızlı oteller, 
                  Konyaaltı sahil otelleri, Side antik bölge otelleri, Belek golf resort otelleri ve 
                  Kemer marina bölgesi otellerine <strong>kapıdan kapıya hizmet</strong> sunuyoruz.
                </p>
                
                <p className="text-gray-700 mb-4">
                  <strong>Antalya şehir içi transfer</strong> ile Kaleiçi tarihi merkez, Marina, 
                  MarkAntalya AVM, TerraCity AVM, hastaneler arası ulaşım ve özel etkinlik transferlerinde 
                  <strong>ekonomik ve hızlı çözümler</strong> üretiyoruz.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Antalya Transfer Güzergahlarımız
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-600">Havalimanı Transferleri:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• AYT → Lara Oteller (35-45 dk)</li>
                    <li>• AYT → Konyaaltı (40-50 dk)</li>
                    <li>• AYT → Kaleiçi Merkez (45-55 dk)</li>
                    <li>• AYT → Antalya Merkez (35-45 dk)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-purple-600">Turistik Bölge Transferleri:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• AYT → Kemer (60-75 dk)</li>
                    <li>• AYT → Side (75-90 dk)</li>
                    <li>• AYT → Belek (40-50 dk)</li>
                    <li>• AYT → Alanya (2-2.5 saat)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-green-600">Özel Destinasyonlar:</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Düden Şelalesi Transfer (30 dk)</li>
                    <li>• Aspendos Antik Tiyatro (45 dk)</li>
                    <li>• Perge Antik Kenti (40 dk)</li>
                    <li>• Olympos Teleferik (90 dk)</li>
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
                  ✅ TURSAB güvencesi ile %100 güvenli transfer hizmeti
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
              Antalya Transfer Destinasyonları ve Fiyatları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya'nın en popüler bölgelerine sabit fiyat garantili transfer hizmeti
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
              Antalya Transfer Hizmet Türlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her ihtiyaca uygun transfer çözümleri ile Antalya'da güvenli ve konforlu yolculuk
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
              Antalya Transfer'de Neden GATE Transfer?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              10 yıllık deneyim ve binlerce memnun müşteriyle Antalya'nın güvenilir transfer firması
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
              Antalya Transfer Hakkında Sık Sorulan Sorular
            </h2>
            <p className="text-lg text-gray-600">
              Antalya transfer hizmetimiz hakkında merak ettikleriniz
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
              Antalya'nın En Güvenilir Transfer Firması
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              2847+ memnun müşteri, %99 memnuniyet oranı ile Antalya transfer hizmetinde lider firma. 
              TURSAB üyesi güvencesi ile hemen rezervasyon yapın.
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
            <span className="ml-2">4.9/5 ⭐ (2,847+ Google değerlendirmesi)</span>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🏆 2024 Antalya En İyi Transfer Firması Ödülü Sahibi
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AntalyaTransfer;
