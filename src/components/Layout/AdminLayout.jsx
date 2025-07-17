import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  UserCheck,
  ChevronRight,
  Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yaptınız');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      exact: true,
      description: 'Genel bakış ve istatistikler'
    },
    {
      name: 'Araç Yönetimi',
      href: '/admin/araçlar',
      icon: Car,
      description: 'Araç ekleme, düzenleme ve yönetimi'
    },
    {
      name: 'Şoför Yönetimi',
      href: '/admin/şoförler',
      icon: Users,
      description: 'Şoför kayıtları ve atamalar'
    },
    {
      name: 'Ek Hizmetler',
      href: '/admin/ek-hizmetler',
      icon: Package,
      description: 'Ek hizmet yönetimi ve fiyatlandırma'
    },
    {
      name: 'Rezervasyonlar',
      href: '/admin/rezervasyonlar',
      icon: Calendar,
      description: 'Rezervasyon takibi ve yönetimi'
    },
    {
      name: 'Finansal Yönetim',
      href: '/admin/finans',
      icon: DollarSign,
      description: 'Gelir, gider ve raporlar'
    },
    {
      name: 'Ayarlar',
      href: '/admin/ayarlar',
      icon: Settings,
      description: 'Sistem ayarları ve konfigürasyon'
    }
  ];

  const isActiveRoute = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const navItemVariants = {
    inactive: {
      backgroundColor: "transparent",
      scale: 1,
      transition: { duration: 0.2 }
    },
    active: {
      backgroundColor: "linear-gradient(135deg, #3b82f6, #6366f1)",
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    hover: {
      backgroundColor: "#f3f4f6",
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-white shadow-2xl">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div 
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Car className="w-6 h-6 text-white" />
          </motion.div>
          {!sidebarCollapsed && (
            <div>
              <span className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                SBS Admin
              </span>
            </div>
          )}
        </Link>
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </motion.button>
        )}
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Quick Stats - Hidden when collapsed */}
      {!sidebarCollapsed && (
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Araçlar</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{state.vehicles?.length || 0}</p>
            </motion.div>
            <motion.div 
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Rezervasyon</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{state.reservations?.length || 0}</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = isActiveRoute(item.href, item.exact);
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                onClick={isMobile ? () => setSidebarOpen(false) : undefined}
                className="group relative block"
                title={sidebarCollapsed ? item.name : undefined}
              >
                <motion.div
                  className={`flex items-center ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  variants={navItemVariants}
                  initial="inactive"
                  animate={isActive ? "active" : "inactive"}
                  whileHover={!isActive ? "hover" : undefined}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon 
                    className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'
                    }`} 
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      {!isActive && (
                        <div className="text-xs text-gray-400 group-hover:text-gray-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                  {!isActive && !sidebarCollapsed && (
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <motion.div 
          className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-4 bg-white rounded-xl shadow-sm border border-gray-100`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} transition-all duration-300`}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-50 w-80 lg:hidden"
          >
            <SidebarContent isMobile={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Panel
            </h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {navigation.find(nav => isActiveRoute(nav.href, nav.exact))?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
              <Link 
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Ana Sayfa</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
