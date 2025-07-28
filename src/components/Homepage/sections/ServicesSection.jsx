import React from 'react';
import { 
  Plane,
  Car,
  Shield,
  Clock,
  Star,
  Users,
  MapPin,
  Phone,
  Calendar,
  Luggage,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Plane,
      title: "Havalimanı Transfer",
      description: "Antalya Havalimanı'ndan tüm bölgelere güvenli transfer hizmeti",
      features: ["7/24 Hizmet", "Uçuş Takibi", "Ücretsiz Bekleme"]
    },
    {
      icon: Car,
      title: "Şehir İçi Transfer",
      description: "Antalya şehir merkezi ve çevresinde konforlu ulaşım",
      features: ["Temiz Araçlar", "Klimalı", "WiFi"]
    },
    {
      icon: Users,
      title: "Grup Transferi",
      description: "8 kişiye kadar grup transferi ve özel organizasyonlar",
      features: ["Büyük Araçlar", "Bagaj Alanı", "Özel Fiyat"]
    },
    {
      icon: Star,
      title: "VIP Transfer",
      description: "Lüks araçlarla özel transfer hizmeti",
      features: ["Lüks Araçlar", "Özel Şoför", "Premium Hizmet"]
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Güvenli",
      description: "Lisanslı şoförler ve sigortalı araçlar"
    },
    {
      icon: Clock,
      title: "Zamanında",
      description: "Dakik servis ve güvenilir ulaşım"
    },
    {
      icon: Star,
      title: "Konforlu",
      description: "Temiz, klimah ve rahat araçlar"
    },
    {
      icon: CheckCircle2,
      title: "Kaliteli",
      description: "Yüksek kalite standartları ve müşteri memnuniyeti"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hizmetlerimiz */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Antalya'da tüm transfer ihtiyaçlarınız için güvenilir çözümler sunuyoruz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Neden Bizi Seçmelisiniz */}
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Neden Bizi Seçmelisiniz?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Müşteri memnuniyeti odaklı hizmet anlayışımızla fark yaratıyoruz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Bölümü */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Hemen Rezervasyon Yapın
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Güvenli, konforlu ve ekonomik transfer hizmetimizden yararlanmak için hemen rezervasyon yapın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/rezervasyon"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Online Rezervasyon
              </a>
              <a
                href="tel:+905325742682"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                +90 532 574 26 82
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
