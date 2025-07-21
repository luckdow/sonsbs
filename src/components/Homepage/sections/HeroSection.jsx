import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star,
  Phone,
  Mail,
  Shield,
  Clock,
  Users,
  Truck,
  Globe,
  CheckCircle2,
  Car,
  Plane,
  MapPin
} from 'lucide-react';
import QuickBookingForm from './QuickBookingForm';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 min-h-screen flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Mobilde önce - Hızlı rezervasyon formu */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 w-full lg:pl-8"
          >
            <QuickBookingForm />
          </motion.div>

          {/* Mobilde sonra - Ana içerik */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Ana başlık */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Antalya
              </span>
              <br />
              <span className="text-white">Transfer Hizmeti</span>
            </h1>

            {/* Alt başlık */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 lg:mb-8">
              Güvenli, konforlu ve ekonomik havalimanı transfer çözümü
            </p>

            {/* Özellikler - mobilde daha kompakt */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4 text-center border border-white/20"
              >
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-green-400 mx-auto mb-2" />
                <span className="text-white text-xs lg:text-sm font-medium">Güvenli</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4 text-center border border-white/20"
              >
                <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400 mx-auto mb-2" />
                <span className="text-white text-xs lg:text-sm font-medium">7/24</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4 text-center border border-white/20"
              >
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400 mx-auto mb-2" />
                <span className="text-white text-xs lg:text-sm font-medium">Profesyonel</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4 text-center border border-white/20"
              >
                <Car className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-400 mx-auto mb-2" />
                <span className="text-white text-xs lg:text-sm font-medium">Konforlu</span>
              </motion.div>
            </div>

            {/* CTA Butonları - mobilde daha kompakt */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start mb-6 lg:mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/rezervasyon"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base"
                >
                  <Car className="w-4 h-4 lg:w-5 lg:h-5" />
                  Rezervasyon Yap
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="tel:+905551234567"
                  className="bg-white/20 hover:bg-white/30 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2 text-sm lg:text-base"
                >
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                  +90 555 123 4567
                </a>
              </motion.div>
            </div>

            {/* İstatistikler - mobilde daha kompakt */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">5000+</div>
                <div className="text-gray-400 text-xs lg:text-sm">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">99%</div>
                <div className="text-gray-400 text-xs lg:text-sm">Memnuniyet</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-xs lg:text-sm">Destek</div>
              </div>
            </div>

            {/* Sosyal kanıt - mobilde daha kompakt */}
            <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-4 text-xs lg:text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                <span className="ml-1 lg:ml-2">4.9/5 (2,500+)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Alt kısım - Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
