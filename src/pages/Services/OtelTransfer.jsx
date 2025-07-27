import React from 'react';
import ServicePageLayout from './components/ServicePageLayout';
import { servicesData } from '../../data/servicesData.jsx';
import { Link } from 'react-router-dom';
import { Hotel, MapPin, Clock, ArrowRight, Star, Shield, Users, Car } from 'lucide-react';

const OtelTransfer = () => {
  const serviceData = servicesData['otel-transfer'];

  // Popular Hotel Destinations
  const hotelDestinations = [
    {
      area: 'Lara-Kundu',
      hotels: ['Delphin Imperial', 'Titanic Beach', 'Royal Wings', 'Miracle Resort'],
      distance: '12 km',
      price: '€15-25',
      image: '/images/lara-hotels.jpg'
    },
    {
      area: 'Kemer',
      hotels: ['Rixos Sungate', 'Maxx Royal', 'Crystal Sunrise', 'Orange County'],
      distance: '45 km',
      price: '€30-40',
      image: '/images/kemer-hotels.jpg'
    },
    {
      area: 'Belek',
      hotels: ['Cornelia Diamond', 'Regnum Carya', 'Sueno Hotels', 'Ela Quality'],
      distance: '35 km',
      price: '€25-35',
      image: '/images/belek-hotels.jpg'
    },
    {
      area: 'Side-Manavgat',
      hotels: ['Crystal Paraiso', 'Barut Hemera', 'Alba Royal', 'Silence Beach'],
      distance: '65 km',
      price: '€40-50',
      image: '/images/side-hotels.jpg'
    },
    {
      area: 'Alanya',
      hotels: ['Siam Elegance', 'Crystal Admiral', 'Sherwood Dreams', 'Delphin Deluxe'],
      distance: '125 km',
      price: '€60-80',
      image: '/images/alanya-hotels.jpg'
    },
    {
      area: 'Kaş-Kalkan',
      hotels: ['Kaputaş Hotel', 'Villa Mahal', 'Hideaway Hotel', 'Kalkan Dream'],
      distance: '200 km',
      price: '€80-120',
      image: '/images/kas-hotels.jpg'
    }
  ];

  // Hotel Transfer Features
  const transferFeatures = [
    {
      icon: <Hotel className="w-8 h-8" />,
      title: 'Otel Kapısına Teslim',
      description: 'Tüm otellerin giriş kapısına kadar güvenli transfer hizmeti.',
      benefit: 'Door-to-Door'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Hizmet',
      description: 'Gece geç saatlerde veya sabah erken saatlerde transfer hizmeti.',
      benefit: '7/24 Müsait'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Tüm Oteller',
      description: 'Antalya bölgesindeki tüm otellere transfer hizmeti sağlanır.',
      benefit: '500+ Otel'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenli Transfer',
      description: 'Sigortalı araçlar, professional şoförler ve güvenlik garantisi.',
      benefit: 'Full Sigorta'
    }
  ];

  // Hotel Services
  const hotelServices = [
    {
      title: 'Check-in Desteği',
      description: 'Otel resepsiyonunda check-in işlemleri için yardım',
      included: true
    },
    {
      title: 'Bagaj Taşıma',
      description: 'Otel girişine kadar bagaj taşıma yardımı',
      included: true
    },
    {
      title: 'Otel Bilgilendirme',
      description: 'Otel hizmetleri ve bölge hakkında bilgilendirme',
      included: true
    },
    {
      title: 'Return Transfer',
      description: 'Dönüş transferi için rezervasyon desteği',
      included: false
    }
  ];

  // Updated pricing for hotel transfers
  const updatedPricing = [
    {
      title: 'Yakın Oteller',
      price: '€15-25',
      description: 'Lara, Kundu, Antalya merkez otelleri',
      features: [
        '0-15 km mesafe',
        'Konforlu sedan araç',
        'Professional şoför',
        'Otel kapısına teslim',
        'Bagaj yardımı',
        'Check-in desteği'
      ]
    },
    {
      title: 'Orta Mesafe',
      price: '€25-40',
      description: 'Belek, Kemer bölgesi otelleri',
      features: [
        '15-50 km mesafe',
        'Premium araç seçeneği',
        'Manzaralı güzergah',
        'Ara durak imkanı',
        'Otel concierge bilgilendirme',
        'Return transfer indirimi'
      ]
    },
    {
      title: 'Uzak Destinasyonlar',
      price: '€50-120',
      description: 'Side, Alanya, Kaş-Kalkan otelleri',
      features: [
        '50+ km mesafe',
        'Lüks araç garantisi',
        'Mola dinlenme alanları',
        'Bölgesel rehberlik',
        'Özel güzergah planlama',
        'VIP otel irtibat'
      ]
    }
  ];

  // Updated FAQ for hotel transfers
  const updatedFaq = [
    {
      question: 'Otel transferinde bagaj limiti var mı?',
      answer: 'Standard otel transferinde kişi başı 1 büyük valiz + 1 el çantası ücretsizdir. Fazla bagaj durumunda araç kapasitesine göre ek düzenleme yapılır veya daha büyük araç tahsis edilir.'
    },
    {
      question: 'Hangi otellere transfer hizmeti veriyorsunuz?',
      answer: 'Antalya bölgesindeki tüm otellere transfer hizmeti sağlıyoruz. Lara-Kundu, Belek, Kemer, Side-Manavgat, Alanya ve Kaş-Kalkan bölgelerindeki 500+ otele güvenli transfer gerçekleştiriyoruz.'
    },
    {
      question: 'Otel transfer rezervasyonu nasıl yapılır?',
      answer: 'Otel adı, check-in tarihi ve uçuş bilgilerinizi +90 532 574 26 82 numarasına WhatsApp veya telefon ile iletebilirsiniz. Rezervasyon onayı ve şoför bilgileri 24 saat içinde paylaşılır.'
    },
    {
      question: 'Geç saatlerde otel transferi mümkün mü?',
      answer: 'Evet, 24/7 otel transfer hizmeti vermekteyiz. Gece geç saatlerde veya sabah erken saatlerde gelen uçuşlar için de professional şoförlerimiz hazır beklemektedir.'
    },
    {
      question: 'Otel değişikliği durumunda ne yapmalıyım?',
      answer: 'Otel değişikliği durumunda mümkün olan en kısa sürede bizimle iletişime geçin. Yeni otel bilgileri alındıktan sonra ek mesafe varsa fark ücreti tahsil edilir, yakın mesafeyse ek ücret alınmaz.'
    }
  ];

  return (
    <ServicePageLayout 
      {...serviceData}
      pricing={updatedPricing}
      faq={updatedFaq}
      seoContent={
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Otel Transfer Hizmeti</h2>
          <p className="mb-4">
            <strong>Otel Transfer</strong> hizmetimiz ile Antalya'daki tüm otellerden havalimanına veya şehir merkezine 
            güvenli ulaşım sağlıyoruz. 5 yıldızlı otellerde kaldığınız konfor standartlarını transfer hizmetinde de 
            yaşayın. Kapıdan kapıya hizmet anlayışıyla size özel çözümler sunuyoruz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Otel Transfer Kapsamı</h3>
          <p className="mb-4">
            Lara, Kundu, Kemer, Belek, Side, Alanya'daki tüm 4-5 yıldızlı otellere hizmet veriyoruz. 
            Adalya Elite, Barut Hotels, Rixos, Maxx Royal, Regnum Carya gibi premium otellerde 
            özel anlaşmalarımız mevcuttur. Otel resepsiyonundan rezervasyon ve bilgi alabilirsiniz.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Otel Transfer Avantajları</h3>
          <p className="mb-4">
            Otelden rezervasyon yapmanın yanında, doğrudan bizimle iletişime geçerek %25'e varan 
            indirimli fiyatlardan faydalanabilirsiniz. Gidiş-dönüş transferlerde ekstra indirim, 
            havalimanında meet & greet hizmeti ve bagaj yardımı dahildir.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Otel Transfer Fiyatları</h3>
          <p className="mb-4">
            Otel transfer fiyatlarımız otelin konumu ve mesafeye göre €20-60 arasındadır. 
            Lara otelleri €20-30, Kemer otelleri €35-45, Belek otelleri €40-50, Side otelleri €45-55 
            fiyat aralığındadır. Lüks otel müşterilerine özel VIP transfer seçenekleri de mevcuttur.
          </p>
        </div>
      }
    >
      {/* Hotel Destinations */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Otel Bölgeleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              500+ otele güvenli ve konforlu transfer hizmeti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotelDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {destination.distance} • {destination.price}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{destination.area}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Popüler Oteller
                    </h4>
                    <div className="space-y-1">
                      {destination.hotels.slice(0, 3).map((hotel, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {hotel}
                        </div>
                      ))}
                      {destination.hotels.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{destination.hotels.length - 3} daha fazla otel
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    to="/rezervasyon"
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    Otel Transfer Rezervasyonu
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer Features */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Otel Transfer Özelliklerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Otel transferinizde size sunduğumuz özel hizmetler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transferFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Services */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Otel Transfer Hizmetleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Otel transferinizde sunduğumuz ek hizmetler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotelServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  service.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                    {service.included && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        DAHİL
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distance & Pricing Guide */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mesafe ve Fiyat Rehberi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Otel bölgelerine göre transfer ücretleri ve süreleri
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Otel Bölgesi</th>
                  <th className="px-6 py-4 text-center font-semibold">Mesafe</th>
                  <th className="px-6 py-4 text-center font-semibold">Süre</th>
                  <th className="px-6 py-4 text-center font-semibold">Fiyat</th>
                  <th className="px-6 py-4 text-center font-semibold">Rezervasyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { area: 'Antalya Merkez', distance: '8 km', duration: '15 dk', price: '€12-18' },
                  { area: 'Lara-Kundu', distance: '12 km', duration: '20 dk', price: '€15-25' },
                  { area: 'Belek', distance: '35 km', duration: '45 dk', price: '€25-35' },
                  { area: 'Kemer', distance: '45 km', duration: '55 dk', price: '€30-40' },
                  { area: 'Side-Manavgat', distance: '65 km', duration: '75 dk', price: '€40-50' },
                  { area: 'Alanya', distance: '125 km', duration: '2 saat', price: '€60-80' },
                  { area: 'Kaş-Kalkan', distance: '200 km', duration: '3 saat', price: '€80-120' }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row.area}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.distance}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.duration}</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">{row.price}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to="/rezervasyon"
                        onClick={() => window.scrollTo(0, 0)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Rezervasyon
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transfer Process */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Otel Transfer Süreciniz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Havalimanından otelinize kadar adım adım süreç
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Rezervasyon ve Otel Bilgileri',
                description: 'Otel adı, check-in tarihi ve uçuş bilgileri ile rezervasyon yapılır.'
              },
              {
                step: '2',
                title: 'Şoför Ataması ve Bilgilendirme',
                description: 'Professional şoför atanır, iletişim bilgileri paylaşılır.'
              },
              {
                step: '3',
                title: 'Havalimanında Karşılama',
                description: 'Şoförünüz arrival alanında isimli tabelayla bekler.'
              },
              {
                step: '4',
                title: 'Bagaj Yardımı ve Araç Teslimi',
                description: 'Bagajlarınız araça yerleştirilir, konforlu yolculuk başlar.'
              },
              {
                step: '5',
                title: 'Otel Güzergahı ve Bilgilendirme',
                description: 'En kısa güzergahla otel yönüne hareket, bölge hakkında bilgi verilir.'
              },
              {
                step: '6',
                title: 'Otel Kapısına Teslim',
                description: 'Otel girişine kadar teslim, check-in için yardım sağlanır.'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
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

export default OtelTransfer;
