import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, ArrowRight, Star, Car, Route, Users } from 'lucide-react';

const SehirIciTransfer = () => {
  const serviceData = servicesData['sehir-ici-transfer'];

  // Popular City Routes
  const cityRoutes = [
    {
      route: 'Otel ↔ Kaleiçi',
      description: 'Tarihi Kaleiçi bölgesi gezisi',
      duration: '15-30 dk',
      price: '€10-15',
      highlights: ['Hadrian Kapısı', 'Yivli Minare', 'Marina', 'Tarihi sokaklar']
    },
    {
      route: 'Otel ↔ Konyaaltı Plajı',
      description: 'Antalya\'nın en popüler plajı',
      duration: '20-35 dk',
      price: '€12-18',
      highlights: ['Beach Park', 'Migros AVM', 'Aquarium', 'Sahil yürüyüşü']
    },
    {
      route: 'Otel ↔ Lara Plajı',
      description: 'Altın kumlu Lara sahili',
      duration: '10-25 dk',
      price: '€8-15',
      highlights: ['Düden Şelalesi', 'TerraCity AVM', 'MarkAntalya', 'Lara sahili']
    },
    {
      route: 'Otel ↔ Düden Şelalesi',
      description: 'Doğal güzellik ve fotoğraf molası',
      duration: '25-40 dk',
      price: '€15-20',
      highlights: ['Alt Düden', 'Üst Düden', 'Piknik alanları', 'Manzara terası']
    },
    {
      route: 'Otel ↔ Antalya AVM',
      description: 'Alışveriş ve eğlence merkezi',
      duration: '20-35 dk',
      price: '€12-18',
      highlights: ['MarkAntalya', 'TerraCity', 'Migros AVM', '5M Migros']
    },
    {
      route: 'Otel ↔ Antalya Müzesi',
      description: 'Kültür ve tarih gezisi',
      duration: '15-25 dk',
      price: '€10-15',
      highlights: ['Arkeoloji Müzesi', 'Kültür Merkezi', 'Atatürk Parkı', 'Köprülü Kanyon']
    }
  ];

  // Transfer Types
  const transferTypes = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Saatlik Transfer',
      description: 'Belirlediğiniz süre boyunca şoförlü araç hizmeti',
      pricing: '€25-35/saat',
      ideal: 'Çoklu durak, bekleme süreli geziler'
    },
    {
      icon: <Route className="w-8 h-8" />,
      title: 'Nokta Transfer',
      description: 'Tek seferlik A noktasından B noktasına transfer',
      pricing: '€8-25/transfer',
      ideal: 'Belirli destinasyon transferleri'
    },
    {
      icon: <Navigation className="w-8 h-8" />,
      title: 'Tur Transfer',
      description: 'Çoklu durak içeren özel tur programı',
      pricing: '€40-60/gün',
      ideal: 'Günlük şehir turu ve geziler'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Grup Transfer',
      description: 'Büyük gruplar için minibüs ile şehir içi transfer',
      pricing: '€35-50/transfer',
      ideal: '8+ kişilik grup transferleri'
    }
  ];

  // Popular Destinations
  const destinations = [
    { name: 'Kaleiçi Tarihi Merkez', category: 'Tarih', time: '15-30 dk', price: '€10-15' },
    { name: 'Konyaaltı Plajı', category: 'Plaj', time: '20-35 dk', price: '€12-18' },
    { name: 'Lara Plajı', category: 'Plaj', time: '10-25 dk', price: '€8-15' },
    { name: 'Düden Şelalesi', category: 'Doğa', time: '25-40 dk', price: '€15-20' },
    { name: 'Antalya Müzesi', category: 'Kültür', time: '15-25 dk', price: '€10-15' },
    { name: 'MarkAntalya AVM', category: 'Alışveriş', time: '20-30 dk', price: '€12-18' },
    { name: 'Antalya Aquarium', category: 'Eğlence', time: '25-35 dk', price: '€15-20' },
    { name: 'Atatürk Parkı', category: 'Park', time: '15-20 dk', price: '€10-12' }
  ];

  // Updated pricing for city transfers
  const updatedPricing = [
    {
      title: 'Nokta Transfer',
      price: '€8-25',
      description: 'Tek seferlik şehir içi transfer',
      features: [
        'A-B noktası transfer',
        'Konforlu araç',
        'Professional şoför',
        'Bekleme süresi (10 dk)',
        'Bagaj taşıma',
        'Klima sistemi'
      ]
    },
    {
      title: 'Saatlik Hizmet',
      price: '€25-35/saat',
      description: 'Esnek saatlik şoförlü araç hizmeti',
      features: [
        'Minimum 2 saat',
        'Çoklu durak imkanı',
        'Bekleme dahil',
        'Esnek rota',
        'Alışveriş yardımı',
        'Rehberlik hizmeti'
      ]
    },
    {
      title: 'Günlük Tur',
      price: '€40-60',
      description: 'Tam gün şehir turu ve transfer',
      features: [
        '6-8 saat hizmet',
        'Çoklu destinasyon',
        'Öğle yemeği molası',
        'Fotoğraf durakları',
        'Kültürel rehberlik',
        'Esnek program'
      ]
    }
  ];

  // Updated FAQ for city transfers
  const updatedFaq = [
    {
      question: 'Şehir içi transfer nasıl rezerve edilir?',
      answer: 'Gitmek istediğiniz yer, tarih ve saati belirterek +90 532 574 26 82 numarasından WhatsApp veya telefon ile rezervasyon yapabilirsiniz. Minimum 1 saat öncesinden haber vermeniz yeterlidir.'
    },
    {
      question: 'Şehir içi transferde bekleme ücreti var mı?',
      answer: 'Nokta transferlerde 10 dakika bekleme ücretsizdir. Saatlik hizmette bekleme dahildir. 10 dakika üzeri beklemeler için dakika başı €1 ek ücret alınır.'
    },
    {
      question: 'Hangi şehir içi noktalara gidiyorsunuz?',
      answer: 'Antalya şehir merkezi, Lara, Konyaaltı, Kaleiçi, AVM\'ler, müzeler, plajlar, şelaleler ve tüm turistik noktalara transfer hizmeti vermekteyiz. Antalya il sınırları içinde her yere gidebiliyoruz.'
    },
    {
      question: 'Saatlik hizmet nasıl çalışır?',
      answer: 'Minimum 2 saat olmak üzere istediğiniz süre boyunca şoförlü araç hizmeti alabilirsiniz. Bu süre içinde birçok yeri gezebilir, alışveriş yapabilir, bekleme sürelerinde araç sizin için bekler.'
    },
    {
      question: 'Grup transferi için kaç kişilik araçlarınız var?',
      answer: '4 kişilik sedan, 6-8 kişilik minivan, 12-15 kişilik Mercedes Sprinter araçlarımız bulunmaktadır. Grup büyüklüğünüze göre en uygun araç seçeneği sunulur.'
    }
  ];

  return (
    <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Antalya Şehir İçi Transfer</h2>
          <p className="mb-4">
            <strong>Şehir İçi Transfer</strong> hizmetimiz ile Antalya şehir merkezinde istediğiniz her noktaya 
            konforlu ulaşım sağlıyoruz. Kaleiçi, Lara Sahili, Konyaaltı, AVM'ler, hastaneler ve 
            iş merkezlerine 7/24 transfer hizmeti veriyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Şehir İçi Transfer Rotaları</h3>
          <p className="mb-4">
            Kaleiçi Tarihi Bölge, Antalya Marina, Konyaaltı Sahili, Lara Sahili, PerCity AVM, 
            Deepo Outlet Center, Antalya Devlet Hastanesi, Akdeniz Üniversitesi gibi popüler 
            noktalara düzenli sefer düzenliyoruz. Taksimetre yerine sabit fiyat garantisi veriyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Şehir İçi Transfer Avantajları</h3>
          <p className="mb-4">
            Taksilere göre %30 daha ekonomik, önceden bildiğiniz sabit fiyat, temiz ve konforlu 
            araçlar, güvenilir şoförler, 5 dakika içinde kapınızda oluruz. Online rezervasyon 
            sistemi ile anında rezervasyon yapabilirsiniz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Şehir İçi Transfer Fiyatları</h3>
          <p className="mb-4">
            Şehir içi kısa mesafe €10-15, orta mesafe €15-25, uzun mesafe €25-35 aralığındadır. 
            Gece 00:00-06:00 saatleri arası %25 gece tarifesi uygulanır. Havalimanı ve oteller 
            arası şehir içi transferlerde özel indirimler mevcuttur.
          </p>
        </div>
      }
    >
      {/* Popular City Routes */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Şehir İçi Rotalar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya\'nın en çok ziyaret edilen yerlerine konforlu transfer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cityRoutes.map((route, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                      Transfer
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{route.price}</div>
                    <div className="text-xs text-gray-500">{route.duration}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{route.route}</h3>
                <p className="text-gray-600 mb-4">{route.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Öne Çıkan Noktalar:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {route.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link
                  to="/rezervasyon"
                  onClick={() => window.scrollTo(0, 0)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  Transfer Rezervasyonu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer Types */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transfer Hizmet Türleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun şehir içi transfer seçenekleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transferTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{type.description}</p>
                <div className="text-lg font-bold text-blue-600 mb-2">{type.pricing}</div>
                <div className="text-sm text-gray-500">{type.ideal}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Destinasyonlar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Antalya\'da en çok ziyaret edilen yerler ve transfer ücretleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    destination.category === 'Tarih' ? 'bg-purple-100 text-purple-800' :
                    destination.category === 'Plaj' ? 'bg-blue-100 text-blue-800' :
                    destination.category === 'Doğa' ? 'bg-green-100 text-green-800' :
                    destination.category === 'Kültür' ? 'bg-red-100 text-red-800' :
                    destination.category === 'Alışveriş' ? 'bg-yellow-100 text-yellow-800' :
                    destination.category === 'Eğlence' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {destination.category}
                  </span>
                  <div className="text-sm font-bold text-blue-600">{destination.price}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{destination.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {destination.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Şehir İçi Transfer Avantajları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Neden bizden şehir içi transfer hizmeti almalısınız?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Car className="w-8 h-8" />,
                title: 'Konforlu Araçlar',
                description: 'Klimalı, temiz ve bakımlı araç filosu ile rahatlık',
                color: 'bg-blue-500'
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Yerel Bilgi',
                description: 'Şehri iyi bilen deneyimli şoförler ile rehberlik',
                color: 'bg-green-500'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Esnek Saatler',
                description: '7/24 hizmet, istediğiniz saatte transfer imkanı',
                color: 'bg-purple-500'
              },
              {
                icon: <Route className="w-8 h-8" />,
                title: 'En Kısa Rota',
                description: 'Trafik durumuna göre en optimal güzergah seçimi',
                color: 'bg-red-500'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Grup Dostu',
                description: 'Farklı araç seçenekleri ile grup transferleri',
                color: 'bg-yellow-500'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Uygun Fiyat',
                description: 'Rekabetçi fiyatlar ile ekonomik şehir içi ulaşım',
                color: 'bg-indigo-500'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default SehirIciTransfer;
