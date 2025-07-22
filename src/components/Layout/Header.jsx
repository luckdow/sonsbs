import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Phone, Mail, Menu, X, User, Calendar, LogOut } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../UI/Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userProfile, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth skeleton component
  const AuthSkeleton = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );

  // Render auth section with skeleton on loading
  const renderAuthSection = () => {
    // If loading and no cached user data, show skeleton
    if (loading && !userProfile) {
      return <AuthSkeleton />;
    }

    // If we have user profile (either from cache or fresh), show user menu
    if (userProfile) {
      return (
        <div className="relative group">
          <button
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-white hover:bg-white/10`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">
                {userProfile.firstName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium">
              {userProfile.firstName || 'Kullanıcı'}
            </span>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              <Link
                to="/rezervasyonlarim"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Rezervasyonlarım
              </Link>
              <Link
                to="/profil"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-2" />
                Profil Ayarları
              </Link>
              <hr className="my-2" />
              <button
                onClick={signOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If no user and not loading, show modern user icon
    return (
      <div className="hover:scale-105 transition-transform duration-300">
        <Link
          to="/giriş"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300 group"
          title="Giriş Yap"
        >
          <User className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
        </Link>
      </div>
    );
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-blue-700/95 backdrop-blur-xl shadow-xl border-b border-white/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Updated with image */}
          <Logo 
            isScrolled={isScrolled} 
            location={location} 
            size="normal" 
          />

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { path: '/', label: 'Ana Sayfa' },
              { path: '/hakkımızda', label: 'Hakkımızda' },
              { path: '/hizmetler', label: 'Hizmetlerimiz' },
              { path: '/iletişim', label: 'İletişim' },
              ...(user ? [{ path: '/rezervasyonlarim', label: 'Rezervasyonlarım' }] : [])
            ].map((item) => (
              <div key={item.path} className="hover:scale-105 transition-transform duration-200">
                <Link
                  to={item.path}
                  className={`relative font-medium transition-colors duration-300 ${
                    location.pathname === item.path
                      ? 'text-yellow-300'
                      : 'text-white hover:text-yellow-200'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Contact Info & Actions */}
          <div className="flex items-center space-x-3">
            {/* Contact Info */}
            <div className="hidden 2xl:flex items-center space-x-4">
              <a 
                href={`tel:${APP_CONFIG.supportPhone}`}
                className={`flex items-center space-x-2 text-sm transition-all duration-300 hover:scale-105 text-white/90 hover:text-white`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{APP_CONFIG.supportPhone}</span>
              </a>
              
              <a 
                href={`mailto:${APP_CONFIG.supportEmail}`}
                className={`flex items-center space-x-2 text-sm transition-all duration-300 hover:scale-105 text-white/90 hover:text-white`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{APP_CONFIG.supportEmail}</span>
              </a>
            </div>

            {/* User Actions */}
            {renderAuthSection()}

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-105 text-white hover:bg-white/10`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} transition-all duration-300`}
        >
          <div className="py-4 space-y-4 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 rounded-b-2xl shadow-xl">
            {[
              { path: '/', label: 'Ana Sayfa' },
              { path: '/hakkımızda', label: 'Hakkımızda' },
              { path: '/hizmetler', label: 'Hizmetlerimiz' },
              { path: '/iletişim', label: 'İletişim' },
              ...(user ? [{ path: '/rezervasyonlarim', label: 'Rezervasyonlarım' }] : [])
            ].map((item) => (
              <div key={item.path} className="hover:translate-x-2 transition-transform duration-200">
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
              </div>
            ))}
            
            {/* Mobile User Actions */}
            {user ? (
              <div className="px-4 py-2 border-t border-gray-200/50 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <User className="w-4 h-4" />
                  <span>{userProfile?.firstName || user.email?.split('@')[0]}</span>
                </div>
                <Link
                  to="/rezervasyonlarim"
                  className="block w-full text-left px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📅 Rezervasyonlarım
                </Link>
                <Link
                  to="/profil"
                  className="block w-full text-left px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ⚙️ Profil Ayarları
                </Link>
                <button
                  onClick={signOut}
                  className="w-full text-left px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                >
                  🚪 Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="px-4 py-2 border-t border-gray-200/50">
                <Link
                  to="/giriş"
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
              </div>
            )}
            
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
        </div>
      </div>
    </header>
  );
};

export default Header;
