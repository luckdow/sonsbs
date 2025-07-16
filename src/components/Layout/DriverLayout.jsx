import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, 
  Calendar, 
  User, 
  LogOut,
  Menu,
  X,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

const DriverLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      actions.logout();
      actions.showNotification('success', 'Başarıyla çıkış yaptınız', 'Çıkış');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      actions.showNotification('error', 'Çıkış yapılırken hata oluştu', 'Hata');
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/şoför',
      icon: Calendar,
      exact: true
    },
    {
      name: 'Seferlerim',
      href: '/şoför/seferlerim',
      icon: QrCode
    },
    {
      name: 'Profilim',
      href: '/şoför/profil',
      icon: User
    }
  ];

  const isActiveRoute = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : '-100%',
          transition: { type: 'tween', duration: 0.3 }
        }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">SBS Şoför</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href, item.exact);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {state.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Şoför
              </p>
              <p className="text-xs text-gray-500 truncate">
                {state.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Şoför Panel
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
