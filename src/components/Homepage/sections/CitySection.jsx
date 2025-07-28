import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const CitySection = () => {
  const popularCities = [
    {
      name: "Antalya Merkez",
      slug: "antalya-transfer",
      image: "/images/cities/antalya-merkez.jpg",
      description: "Antalya şehir merkezi ve çevresine güvenli transfer hizmeti",
      features: ["7/24 Hizmet", "Profesyonel Şoförler", "Klimalı Araçlar"]
    },
    {
      name: "Lara",
      slug: "lara-transfer", 
      image: "/images/cities/lara.jpg",
      description: "Lara plajları ve otellerine özel transfer çözümleri",
      features: ["Otel Transfer", "VIP Araçlar", "Bagaj Yardımı"]
    },
    {
      name: "Kemer",
      slug: "kemer-transfer",
      image: "/images/cities/kemer.jpg", 
      description: "Kemer ve çevresine konforlu ulaşım hizmeti",
      features: ["Dağ Manzaralı Yol", "Güvenli Sürüş", "Hızlı Transfer"]
    },
    {
      name: "Belek",
      slug: "belek-transfer",
      image: "/images/cities/belek.jpg",
      description: "Belek golf resort otelleri için premium transfer",
      features: ["Lüks Araçlar", "Golf Ekipmanı Taşıma", "VIP Hizmet"]
    },
    {
      name: "Side",
      slug: "side-transfer", 
      image: "/images/cities/side.jpg",
      description: "Side antik kenti ve Manavgat bölgesine transfer",
      features: ["Tarihi Tur", "Rehberli Transfer", "Kültürel Deneyim"]
    },
    {
      name: "Alanya",
      slug: "alanya-transfer",
      image: "/images/cities/alanya.jpg",
      description: "Alanya kale ve plajlarına uzun mesafe transfer",
      features: ["Uzun Mesafe", "Konforlu Yolculuk", "Mola İmkanı"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popüler Transfer Destinasyonları
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Antalya'nın en gözde lokasyonlarına güvenli ve konforlu transfer hizmeti sunuyoruz
          </p>
        </div>

        {/* Şehir Kartları */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularCities.map((city, index) => (
            <Link
              key={index}
              to={`/${city.slug}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
            >
              {/* Şehir Görseli */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Transfer Mevcut</span>
                  </div>
                </div>
              </div>

              {/* Şehir Bilgileri */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {city.description}
                </p>

                {/* Özellikler */}
                <div className="space-y-2 mb-4">
                  {city.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium">
                    <span className="text-sm">Rezervasyon Yap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Alt CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Başka Bir Destinasyon mu Arıyorsunuz?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Antalya ve çevresindeki tüm lokasyonlara transfer hizmeti sunuyoruz. 
              Özel destinasyonunuz için bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rezervasyon"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Tüm Destinasyonları Gör
              </Link>
              <a
                href="tel:+905325742682"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
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

export default CitySection;
