import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/hakkımızda"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              to="/iletişim"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              İletişim
            </Link>
          </nav>

          {/* Contact Info & Login */}
          <div className="flex items-center space-x-4">
            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{APP_CONFIG.supportPhone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{APP_CONFIG.supportEmail}</span>
              </div>
            </div>

            {/* Login Button */}
            <Link
              to="/giriş"
              className="btn btn-primary"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
