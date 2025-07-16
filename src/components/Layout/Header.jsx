import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Phone, Mail, Menu, X } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                isScrolled ? 'shadow-blue-500/25' : 'shadow-white/25'
              }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Car className="w-6 h-6 text-white" />
            </motion.div>
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              !isScrolled && location.pathname === '/' 
                ? 'text-white' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { path: '/', label: 'Ana Sayfa' },
              { path: '/hakkımızda', label: 'Hakkımızda' },
              { path: '/hizmetler', label: 'Hizmetlerimiz' },
              { path: '/iletişim', label: 'İletişim' }
            ].map((item) => (
              <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.path}
                  className={`relative font-medium transition-colors duration-300 ${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : isScrolled || location.pathname !== '/'
                        ? 'text-gray-700 hover:text-blue-600'
                        : 'text-white hover:text-blue-200'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                      layoutId="activeLink"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Contact Info & Actions */}
          <div className="flex items-center space-x-3">
            {/* Contact Info */}
            <div className="hidden 2xl:flex items-center space-x-4">
              <motion.a 
                href={`tel:${APP_CONFIG.supportPhone}`}
                className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-blue-600' : 'text-white/90 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{APP_CONFIG.supportPhone}</span>
              </motion.a>
              
              <motion.a 
                href={`mailto:${APP_CONFIG.supportEmail}`}
                className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
                  isScrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-blue-600' : 'text-white/90 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{APP_CONFIG.supportEmail}</span>
              </motion.a>
            </div>

            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/giriş"
                className="btn btn-primary relative overflow-hidden group"
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  Giriş Yap
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-2 rounded-xl ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-4 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 rounded-b-2xl shadow-xl">
            {[
              { path: '/', label: 'Ana Sayfa' },
              { path: '/hakkımızda', label: 'Hakkımızda' },
              { path: '/hizmetler', label: 'Hizmetlerimiz' },
              { path: '/iletişim', label: 'İletişim' }
            ].map((item) => (
              <motion.div key={item.path} whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            
            {/* Mobile Contact Info */}
            <div className="px-4 py-2 border-t border-gray-200/50">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{APP_CONFIG.supportPhone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{APP_CONFIG.supportEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
