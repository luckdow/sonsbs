import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane,
  Car,
  Users,
  Crown,
  Baby,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Star,
  Luggage,
  Wifi,
  Snowflake,
  Phone
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const ServicesPage = () => {
  const mainServices = [
    {
      icon: Plane,
      title: "Antalya Havalimanı Transfer",
      description: "Antalya Havalimanı'ndan tüm otel ve bölgelere güvenli transfer hizmeti",
      features: [
        "7/24 kesintisiz hizmet",
        "Uçuş takip sistemi",
        "Ücretsiz bekleme süresi",
        "Profesyonel şoför kadrosu"
      ],
      destinations: [
        "Lara", "Kundu", "Belek", "Side", "Manavgat", "Alanya", "Kemer", "Kaleiçi"
      ],
      price: "Uygun fiyat garantisi",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Car,
      title: "Şehir İçi Transfer",
      description: "Antalya şehir merkezi ve çevresindeki lokasyonlara konforlu ulaşım",
      features: [
        "Temiz ve bakımlı araçlar",
        "Klimalı konforlu yolculuk",
        "GPS navigasyon sistemi",
        "Güvenli sürüş garantisi"
      ],
      destinations: [
        "Kaleiçi", "Konyaaltı", "Lara", "Kepez", "Muratpaşa", "Döşemealtı"
      ],
      price: "Şehir içi sabit fiyat",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Grup Transfer Hizmetleri",
      description: "Büyük gruplar için özel transfer çözümleri ve minibüs hizmetleri",
      features: [
        "8-16 kişilik araçlar",
        "Grup indirimleri",
        "Özel güzergah planlaması",
        "Rehber eşliğinde turlar"
      ],
      destinations: [
        "Tüm otel bölgeleri", "Turistik yerler", "Kongre merkezleri", "Etkinlik alanları"
      ],
      price: "Grup indirimleri mevcut",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Crown,
      title: "VIP Transfer Hizmetleri",
      description: "Lüks araçlarla özel VIP transfer deneyimi yaşayın",
      features: [
        "Mercedes Vito/Sprinter araçlar",
        "Özel şoför hizmeti",
        "İkram ve su servisi",
        "Özel karşılama tabelası"
      ],
      destinations: [
        "Tüm premium oteller", "Özel villalar", "Yacht marina", "Golf sahaları"
      ],
      price: "Premium hizmet fiyatı",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const additionalServices = [
    {
      icon: Baby,
      title: "Aile Transfer Hizmeti",
      description: "Çocuk koltuğu ve aile dostu transfer hizmetleri",
      features: ["Güvenli çocuk koltuğu", "Aile indirimleri", "Oyuncak ve aktivite seti"]
    },
    {
      icon: Luggage,
      title: "Bagaj Transfer",
      description: "Fazla bagajınız için özel alan ayrılması",
      features: ["Geniş bagaj alanı", "Güvenli taşıma", "Fazla bagaj ücretsiz"]
    },
    {
      icon: Clock,
      title: "Acil Transfer",
      description: "Son dakika transfer ihtiyaçlarınız için hızlı çözüm",
      features: ["30 dk içinde hazır", "7/24 hizmet", "Hızlı rezervasyon"]
    },
    {
      icon: MapPin,
      title: "Özel Güzergah",
      description: "İstediğiniz güzergahta özel transfer planlaması",
      features: ["Kişiye özel rota", "Ara duraklar", "Turistik yerler"]
    }
  ];

  const vehicleFeatures = [
    { icon: Snowflake, text: "Klimali Araçlar" },
    { icon: Wifi, text: "Ücretsiz WiFi" },
    { icon: Shield, text: "Sigortalı Araçlar" },
    { icon: CheckCircle, text: "Temiz & Bakımlı" }
  ];

  const destinations = [
    { name: "Lara", distance: "15 km", time: "20 dk" },
    { name: "Belek", distance: "35 km", time: "40 dk" },
    { name: "Side", distance: "65 km", time: "75 dk" },
    { name: "Alanya", distance: "125 km", time: "90 dk" },
    { name: "Kemer", distance: "45 km", time: "50 dk" },
    { name: "Kaleiçi", distance: "12 km", time: "18 dk" },
    { name: "Manavgat", distance: "70 km", time: "80 dk" },
    { name: "Kaş", distance: "180 km", time: "2.5 saat" }
  ];

  return (
    <StaticPageLayout
      title="Hizmetlerimiz | GATE Transfer - Antalya Havalimanı Transfer Hizmetleri"
      description="GATE Transfer olarak Antalya havalimanı transfer, şehir içi transfer, grup transfer ve VIP transfer hizmetleri sunuyoruz. 7/24 güvenli ve konforlu transfer çözümleri."
      keywords="Antalya havalimanı transfer, şehir içi transfer, grup transfer, VIP transfer, aile transferi, Antalya transfer hizmetleri, havalimanı shuttle, özel transfer, Lara transfer, Belek transfer, Side transfer, Alanya transfer, Kemer transfer"
      canonicalUrl="/hizmetlerimiz"
      heroTitle="Transfer Hizmetlerimiz"
      heroSubtitle="Antalya'da tüm transfer ihtiyaçlarınız için güvenilir çözümler"
    >
      {/* Ana Hizmetler */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ana Hizmetlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her ihtiyaca uygun profesyonel transfer çözümleri sunuyoruz
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Özellikler:</h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Popüler Destinasyonlar:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.destinations.map((dest, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{service.price}</span>
                      </div>
                      <Link
                        to="/rezervasyon"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Rezervasyon Yap
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ek Hizmetler */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ek Hizmetlerimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transfer deneyiminizi daha da özel kılacak ek hizmetler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {service.description}
                  </p>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-500">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Araç Özellikleri */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Araç Filomuz Özellikleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern ve konforlu araçlarımızla güvenli yolculuk deneyimi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {vehicleFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.text}
                  </h3>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
              Araç Filosu
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Car className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Standart Araçlar</h4>
                <p className="text-sm text-gray-600">1-4 kişilik konforlu sedanlar</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Minivan</h4>
                <p className="text-sm text-gray-600">5-8 kişilik geniş araçlar</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">VIP Araçlar</h4>
                <p className="text-sm text-gray-600">Mercedes Vito/Sprinter lüks araçlar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinasyonlar ve Süreler */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Transfer Destinasyonları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Antalya Havalimanı'ndan popüler destinasyonlara tahmini süreler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all text-center">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {dest.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {dest.distance}
                </p>
                <p className="text-xs text-gray-500">
                  Yaklaşık {dest.time}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              * Süreler trafik durumuna göre değişiklik gösterebilir
            </p>
            <Link
              to="/rezervasyon"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Rezervasyon Yapın
            </Link>
          </div>
        </div>
      </section>

      {/* Neden Biz */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Neden GATE Transfer?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli Transfer</h3>
              <p className="text-gray-600">
                Lisanslı araçlar ve profesyonel şoförlerle %100 güvenli yolculuk garantisi
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zamanında Hizmet</h3>
              <p className="text-gray-600">
                Uçuş takip sistemi ile zamanında karşılama ve güvenli ulaştırma garantisi
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kaliteli Hizmet</h3>
              <p className="text-gray-600">
                2011'den beri binlerce memnun müşteri ile kanıtlanmış hizmet kalitesi
              </p>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default ServicesPage;
