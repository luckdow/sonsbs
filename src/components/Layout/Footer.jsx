import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/40"></div>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
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
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * 600,
            }}
            animate={{
              y: [null, -50],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Car className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Konforlu, güvenli ve kaliteli transfer hizmetleri. 
              Havalimanından otelinize, otelinizden havalimanına 
              profesyonel transfer çözümleri ile yanınızdayız.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href} 
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hızlı Bağlantılar
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Ana Sayfa' },
                { to: '/hakkımızda', label: 'Hakkımızda' },
                { to: '/hizmetler', label: 'Hizmetlerimiz' },
                { to: '/iletişim', label: 'İletişim' },
                { to: '/giriş', label: 'Giriş Yap' }
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              İletişim
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  title: APP_CONFIG.supportPhone,
                  subtitle: '7/24 Destek Hattı',
                  href: `tel:${APP_CONFIG.supportPhone}`
                },
                {
                  icon: Mail,
                  title: APP_CONFIG.supportEmail,
                  subtitle: 'E-posta Desteği',
                  href: `mailto:${APP_CONFIG.supportEmail}`
                },
                {
                  icon: MapPin,
                  title: 'İstanbul, Türkiye',
                  subtitle: 'Merkez Ofis',
                  href: '#'
                }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-3 group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <contact.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <a 
                      href={contact.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                    >
                      {contact.title}
                    </a>
                    <p className="text-sm text-gray-400">{contact.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/20 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 {APP_CONFIG.companyName}. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-6">
                {[
                  { to: '/gizlilik', label: 'Gizlilik Politikası' },
                  { to: '/kullanim-kosullari', label: 'Kullanım Koşulları' }
                ].map((link, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }}>
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Scroll to top button */}
              <motion.button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
