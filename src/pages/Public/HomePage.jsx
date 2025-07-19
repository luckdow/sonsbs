import React, { useEffect } from 'react';
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
import { initializeSettings } from '../../utils/initializeFirebaseData';

const HomePage = () => {
  // Demo settings'i başlat
  useEffect(() => {
    const setupSettings = async () => {
      try {
        await initializeSettings();
      } catch (error) {
        console.error('Settings kurulumu hatası:', error);
      }
    };
    
    setupSettings();
  }, []);
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Antalya Güvenli Transfer",
      description: "Antalya genelinde 7/24 güvenli ve konforlu VIP transfer hizmeti"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Zamanında Teslimat",
      description: "Antalya havalimanı ve şehir transferlerinde dakiklik garantisi"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sigortalı Transfer Hizmeti",
      description: "Antalya transfer hizmetlerinde tam kapsamlı sigorta güvencesi"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Antalya VIP Kalite",
      description: "Lüks araçlar ve Antalya'yı tanıyan profesyonel şoförler"
    }
  ];

  const services = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Antalya Havalimanı Transfer",
      description: "Antalya Havalimanı'ndan otel ve şehir merkezine güvenli VIP transfer hizmeti",
      price: "₺120'den başlayan fiyatlar"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Antalya Grup Transfer",
      description: "Büyük gruplar için Antalya genelinde özel araç transfer çözümleri",
      price: "₺250'den başlayan fiyatlar"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Antalya Şehir İçi Transfer",
      description: "Antalya şehir içi, otel arası ve turistik alan transferleri",
      price: "₺60'dan başlayan fiyatlar"
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
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Antalya
              </span>
              <br />
              <span className="text-4xl md:text-6xl">VIP Transfer Hizmeti</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Antalya'nın en güvenilir VIP transfer ve havalimanı transfer hizmeti. 
              Profesyonel şoförler, lüks araçlar ve 7/24 güvenli yolculuk garantisi ile Antalya şehir içi, havalimanı ve otel transferleri.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/rezervasyon"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Hemen Rezervasyon Yap
              </Link>
              <Link 
                to="/rezervasyonlarim"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Rezervasyonlarım
              </Link>
              <Link 
                to="/giriş"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                Giriş Yap
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
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
              Antalya Transfer Hizmetimizi Neden Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Antalya'da yılların deneyimi ve modern teknoloji ile size en iyi transfer hizmetini sunuyoruz
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
              Antalya Transfer Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Antalya'da ihtiyacınıza uygun VIP transfer çözümlerini keşfedin
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
              Antalya Transfer Rezervasyonu
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Antalya'da size özel VIP transfer çözümlerimizle konforlu yolculuğunuz başlasın. 
              7/24 Antalya transfer desteği ve garantili hizmet kalitesi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/rezervasyon" 
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
                href="tel:+902422281234" 
                className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-2xl"
              >
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-6 h-6" />
                  +90 242 228 12 34
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
              <h3 className="text-xl font-semibold mb-2">Antalya Transfer Telefon</h3>
              <p className="text-gray-300">+90 242 228 12 34</p>
            </motion.div>
            
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Antalya Transfer E-posta</h3>
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
              <h3 className="text-xl font-semibold mb-2">Antalya Transfer Saatleri</h3>
              <p className="text-gray-300">7/24 Hizmet</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
