import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Konforlu, güvenli ve kaliteli transfer hizmetleri. 
              Havalimanından otelinize, otelinizden havalimanına 
              profesyonel transfer çözümleri.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hakkımızda" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/hizmetler" className="text-gray-300 hover:text-white transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link to="/iletişim" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link to="/giriş" className="text-gray-300 hover:text-white transition-colors">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">{APP_CONFIG.supportPhone}</p>
                  <p className="text-sm text-gray-400">7/24 Destek Hattı</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">{APP_CONFIG.supportEmail}</p>
                  <p className="text-sm text-gray-400">E-posta Desteği</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">İstanbul, Türkiye</p>
                  <p className="text-sm text-gray-400">Merkez Ofis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 {APP_CONFIG.companyName}. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/gizlilik" className="text-gray-400 hover:text-white text-sm transition-colors">
              Gizlilik Politikası
            </Link>
            <Link to="/kullanim-kosullari" className="text-gray-400 hover:text-white text-sm transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
