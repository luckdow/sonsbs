import React from 'react';
import { motion } from 'framer-motion';
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
      description: "Dakik ve güvenilir hizmet garantisi"
    },
    {
      icon: CreditCard,
      title: "Uygun Fiyat",
      description: "Rekabetçi fiyatlar ve şeffaf ücretlendirme"
    },
    {
      icon: CheckCircle2,
      title: "Kaliteli",
      description: "Yüksek kalite standartları ve müşteri memnuniyeti"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hizmetlerimiz */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Antalya'da tüm transfer ihtiyaçlarınız için güvenilir çözümler sunuyoruz
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 text-center">
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
            </motion.div>
          ))}
        </div>

        {/* Neden Bizi Seçmelisiniz */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Neden Bizi Seçmelisiniz?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Yılların deneyimi ve binlerce mutlu müşteriyle güvenilir hizmet
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center mt-20"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Hemen Rezervasyon Yapın
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Güvenli ve konforlu yolculuğunuz için hemen rezervasyon yapın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/rezervasyon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Online Rezervasyon
            </motion.a>
            <motion.a
              href="tel:+905551234567"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +90 555 123 4567
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
