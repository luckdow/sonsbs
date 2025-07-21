import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      location: "İstanbul",
      rating: 5,
      text: "Antalya havalimanından otelimize transferde kullandık. Hem zamanında hem de çok temiz bir araçtı. Şoför çok kibar ve yardımseverdi. Kesinlikle tavsiye ediyorum.",
      service: "Havalimanı Transfer",
      avatar: "AY"
    },
    {
      id: 2,
      name: "Elena Petrova",
      location: "Rusya",
      rating: 5,
      text: "Очень хорошее обслуживание! Водитель был пунктуален, машина чистая и комфортная. Цена разумная. Обязательно воспользуемся снова при следующем визите в Анталью.",
      service: "VIP Transfer",
      avatar: "EP"
    },
    {
      id: 3,
      name: "Maria Schmidt",
      location: "Almanya",
      rating: 5,
      text: "Excellent service from airport to hotel. The driver was very professional and the vehicle was clean and comfortable. Price was fair and booking process was easy. Highly recommended!",
      service: "Grup Transferi",
      avatar: "MS"
    },
    {
      id: 4,
      name: "Fatma Öztürk",
      location: "Ankara",
      rating: 5,
      text: "Aile tatilimizde 8 kişilik transfer hizmeti aldık. Büyük ve ferah araç, çocuk koltuğu hizmeti mükemmeldi. Fiyat da çok uygundu. Teşekkürler!",
      service: "Aile Transferi",
      avatar: "FÖ"
    },
    {
      id: 5,
      name: "John Williams",
      location: "İngiltere",
      rating: 5,
      text: "Perfect transfer service! Driver was waiting for us at the airport with a name sign. Vehicle was luxury and very clean. Will definitely use again next time we visit Antalya.",
      service: "Lüks Transfer",
      avatar: "JW"
    },
    {
      id: 6,
      name: "Sarah Johnson",
      location: "ABD",
      rating: 5,
      text: "Great experience! Booked online easily, received confirmation quickly. Driver was punctual and helpful with luggage. The car was comfortable and air-conditioned. Excellent value for money.",
      service: "Online Rezervasyon",
      avatar: "SJ"
    }
  ];

  const stats = [
    { number: "5000+", label: "Mutlu Müşteri" },
    { number: "99%", label: "Memnuniyet Oranı" },
    { number: "4.9/5", label: "Ortalama Puan" },
    { number: "24/7", label: "Müşteri Desteği" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Müşteri Yorumları
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Binlerce mutlu müşterimizin deneyimlerini paylaşıyoruz
          </p>
        </motion.div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 text-center shadow-lg"
            >
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Yorumlar Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4">
                <Quote className="w-6 h-6 text-blue-300" />
              </div>

              {/* Avatar ve İsim */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Yorum Metni */}
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                "{testimonial.text}"
              </p>

              {/* Hizmet Türü */}
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {testimonial.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Siz de memnun müşterilerimize katılın!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Antalya'da güvenli, konforlu ve uygun fiyatlı transfer hizmeti için hemen rezervasyon yapın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/rezervasyon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hemen Rezervasyon Yap
              </motion.a>
              <motion.a
                href="tel:+905551234567"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-lg font-semibold border border-blue-600 transition-all duration-300"
              >
                📞 Hemen Ara
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
