import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ArrowUp, Globe, Shield, Headphones } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';
import Logo from '../UI/Logo';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      {/* Particles - Simplified */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="mb-6">
              <Logo size="normal" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Konforlu, güvenli ve kaliteli transfer hizmetleri. 
              Havalimanından otelinize, otelinizden havalimanına 
              profesyonel transfer çözümleri ile yanınızdayız.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Hizmetler */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hizmetler
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/havalimanı-transfer', label: 'Havalimanı Transfer' },
                { to: '/otel-transfer', label: 'Otel Transfer' },
                { to: '/şehir-içi-transfer', label: 'Şehir İçi Transfer' },
                { to: '/vip-transfer', label: 'VIP Transfer' },
                { to: '/grup-transfer', label: 'Grup Transfer' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Kurumsal
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/hakkimizda', label: 'Hakkımızda', icon: Globe },
                { to: '/hizmetlerimiz', label: 'Hizmetlerimiz' },
                { to: '/sss', label: 'Sık Sorulan Sorular', icon: Headphones },
                { to: '/iletisim', label: 'İletişim' },
                { to: '/kvkk', label: 'KVKK', icon: Shield }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group hover:translate-x-1"
                  >
                    {link.icon && <link.icon className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 transition-opacity" />}
                    {!link.icon && <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></span>}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              İletişim
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  title: APP_CONFIG.supportPhone,
                  subtitle: '7/24 Destek Hattı',
                  href: `tel:${APP_CONFIG.supportPhone.replace(/\s/g, '')}`
                },
                {
                  icon: Mail,
                  title: APP_CONFIG.supportEmail,
                  subtitle: 'E-posta Desteği',
                  href: `mailto:${APP_CONFIG.supportEmail}`
                },
                {
                  icon: MapPin,
                  title: 'Aksu, Antalya',
                  subtitle: 'Merkez Ofis',
                  href: '#'
                }
              ].map((contact, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 group cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <contact.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <a 
                      href={contact.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm"
                    >
                      {contact.title}
                    </a>
                    <p className="text-xs text-gray-400">{contact.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 {APP_CONFIG.name}. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-6">
                {[
                  { to: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
                  { to: '/kullanim-sartlari', label: 'Kullanım Şartları' },
                  { to: '/cerez-politikasi', label: 'Çerez Politikası' },
                  { to: '/iade-iptal', label: 'İade & İptal' }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    to={link.to} 
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:scale-105"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Scroll to top button */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:-translate-y-1"
                aria-label="Yukarı çık"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;