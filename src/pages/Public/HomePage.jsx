import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Shield, 
  Star,
  Phone,
  Mail,
  Users,
  Truck,
  Globe,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Güvenli Ulaşım",
      description: "7/24 güvenli ve konforlu transfer hizmeti"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Zamanında Teslimat",
      description: "Dakik ve güvenilir transfer çözümleri"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sigortalı Hizmet",
      description: "Tam kapsamlı sigorta ile güvende"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Kalite",
      description: "Lüks araçlar ve profesyonel şoförler"
    }
  ];

  const services = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Havalimanı Transferi",
      description: "İstanbul'un tüm havalimanlarına güvenli ulaşım",
      price: "₺150'den başlayan fiyatlar"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Grup Transferi",
      description: "Büyük gruplar için özel araç çözümleri",
      price: "₺300'den başlayan fiyatlar"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Şehir İçi Transfer",
      description: "İstanbul genelinde konforlu ulaşım",
      price: "₺80'den başlayan fiyatlar"
    }
  ];

  const stats = [
    { number: "50K+", label: "Mutlu Müşteri" },
    { number: "100K+", label: "Başarılı Transfer" },
    { number: "24/7", label: "Hizmet Saati" },
    { number: "99%", label: "Memnuniyet Oranı" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Premium
              </span>
              <br />
              Transfer Hizmeti
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              İstanbul'da güvenli, konforlu ve zamanında ulaşım çözümleri. 
              Profesyonel şoförlerimiz ve lüks araçlarımızla size özel hizmet.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/book-transfer" 
                className="btn btn-primary btn-lg group relative overflow-hidden"
              >
                <motion.span
                  className="relative z-10 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Truck className="w-6 h-6" />
                  Hemen Rezervasyon Yap
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <Link 
                to="/services" 
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900"
              >
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hizmetlerimizi Keşfet
                </motion.span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Yılların deneyimi ve modern teknoloji ile size en iyi hizmeti sunuyoruz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center group hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-body">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İhtiyacınıza uygun transfer çözümlerini keşfedin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="card group hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-body text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="text-lg font-semibold text-blue-600 mb-6">
                    {service.price}
                  </div>
                  <Link 
                    to="/book-transfer" 
                    className="btn btn-primary w-full group-hover:scale-105 transition-transform"
                  >
                    Rezervasyon Yap
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hemen Rezervasyon Yapın
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Size özel transfer çözümlerimizle konforlu yolculuğunuz başlasın. 
              7/24 destek ve garantili hizmet kalitesi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/book-transfer" 
                className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Şimdi Rezervasyon Yap
                </motion.span>
              </Link>
              
              <a 
                href="tel:+905551234567" 
                className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-2xl"
              >
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-6 h-6" />
                  +90 555 123 45 67
                </motion.span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Phone className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Telefon</h3>
              <p className="text-gray-300">+90 555 123 45 67</p>
            </motion.div>
            
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">E-posta</h3>
              <p className="text-gray-300">info@sbstransfer.com</p>
            </motion.div>
            
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Clock className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Çalışma Saatleri</h3>
              <p className="text-gray-300">7/24 Hizmet</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
