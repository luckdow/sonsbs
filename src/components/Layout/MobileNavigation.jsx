import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, Car, Phone, User, Calendar } from 'lucide-react';
import { cn } from '../../utils/helpers';

const MobileNavigation = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const mainNavItems = [
    { 
      name: 'Ana Sayfa', 
      path: '/', 
      icon: Home 
    },
    {
      name: 'Hizmetler',
      icon: Car,
      dropdown: [
        { name: 'Havalimanı Transfer', path: '/hizmetler/havaalani-transfer' },
        { name: 'VIP Transfer', path: '/hizmetler/vip-transfer' },
        { name: 'Grup Transfer', path: '/hizmetler/grup-transfer' },
        { name: 'Otel Transfer', path: '/hizmetler/otel-transfer' },
        { name: 'Şehir İçi Transfer', path: '/hizmetler/sehir-ici-transfer' },
      ]
    },
    {
      name: 'Şehirler',
      icon: Car,
      dropdown: [
        { name: 'Antalya Transfer', path: '/antalya-transfer' },
        { name: 'Alanya Transfer', path: '/alanya-transfer' },
        { name: 'Belek Transfer', path: '/belek-transfer' },
        { name: 'Kemer Transfer', path: '/kemer-transfer' },
        { name: 'Side Transfer', path: '/side-transfer' },
      ]
    },
    { 
      name: 'İletişim', 
      path: '/iletisim', 
      icon: Phone 
    },
  ];

  const userNavItems = user ? [
    { name: 'Profilim', path: '/profil', icon: User },
    { name: 'Rezervasyonlarım', path: '/rezervasyonlarim', icon: Calendar },
  ] : [
    { name: 'Giriş Yap', path: '/giris', icon: User },
    { name: 'Kayıt Ol', path: '/kayit', icon: User },
  ];

  const toggleDropdown = (itemName) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'md:hidden p-3 rounded-xl transition-all duration-200',
          'text-white hover:bg-white/10',
          'min-h-[48px] min-w-[48px]',
          'touch-manipulation active:scale-95'
        )}
        aria-label="Menüyü aç/kapat"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50',
          'transform transition-transform duration-300 ease-in-out md:hidden',
          'shadow-2xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-xl font-bold text-white">Gate Transfer</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Menüyü kapat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {/* User Section */}
          {user && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.displayName || 'Kullanıcı'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="py-4">
            {mainNavItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    {/* Dropdown Toggle */}
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        'w-full flex items-center justify-between px-6 py-4',
                        'text-gray-700 hover:bg-gray-50 transition-colors',
                        'text-lg font-medium',
                        'min-h-[56px] touch-manipulation'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown
                        size={20}
                        className={cn(
                          'transition-transform duration-200',
                          activeDropdown === item.name && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Dropdown Items */}
                    {activeDropdown === item.name && (
                      <div className="bg-gray-50 border-l-4 border-blue-500">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={cn(
                              'block px-10 py-3 text-gray-600 hover:bg-white hover:text-blue-600',
                              'transition-colors border-b border-gray-100 last:border-0',
                              'min-h-[48px] flex items-center',
                              'touch-manipulation active:bg-blue-50'
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Single Link */
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-3 px-6 py-4',
                      'text-gray-700 hover:bg-gray-50 transition-colors',
                      'text-lg font-medium',
                      'min-h-[56px] touch-manipulation active:bg-blue-50',
                      location.pathname === item.path && 'bg-blue-50 text-blue-600 border-r-4 border-blue-500'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-gray-200" />

            {/* User Navigation */}
            {userNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-6 py-4',
                  'text-gray-700 hover:bg-gray-50 transition-colors',
                  'text-lg font-medium',
                  'min-h-[56px] touch-manipulation active:bg-blue-50',
                  location.pathname === item.path && 'bg-blue-50 text-blue-600 border-r-4 border-blue-500'
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Logout Button */}
            {user && (
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-6 py-4',
                  'text-red-600 hover:bg-red-50 transition-colors',
                  'text-lg font-medium',
                  'min-h-[56px] touch-manipulation active:bg-red-100'
                )}
              >
                <User size={20} />
                <span>Çıkış Yap</span>
              </button>
            )}
          </nav>

          {/* Quick Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <Link
              to="/rezervasyon"
              className={cn(
                'block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600',
                'text-white font-semibold rounded-xl shadow-lg',
                'hover:from-blue-700 hover:to-purple-700 transition-all duration-200',
                'min-h-[56px] flex items-center justify-center',
                'touch-manipulation active:scale-98'
              )}
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Rezervasyon Yap
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
