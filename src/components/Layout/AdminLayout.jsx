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
      href: '/admin/vehicles',
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm"></div>
        <Link to="/" className="flex items-center space-x-3 group relative z-10">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20 shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Car className="w-7 h-7 text-white drop-shadow-lg" />
          </motion.div>
          {!sidebarCollapsed && (
            <div>
              <span className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors drop-shadow-lg">
                SBS Admin
              </span>
              <div className="text-xs text-blue-200/80 font-medium">Transfer Platform</div>
            </div>
          )}
        </Link>
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative z-10 backdrop-blur-sm"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </motion.button>
        )}
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative z-10 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Quick Stats - Hidden when collapsed */}
      {!sidebarCollapsed && (
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm p-4 rounded-2xl border border-blue-500/20 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Car className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Araçlar</span>
              </div>
              <p className="text-2xl font-bold text-white">{state.vehicles?.length || 0}</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm p-4 rounded-2xl border border-emerald-500/20 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">Rezervasyon</span>
              </div>
              <p className="text-2xl font-bold text-white">{state.reservations?.length || 0}</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
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
                  className={`flex items-center ${sidebarCollapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'} text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  variants={navItemVariants}
                  initial="inactive"
                  animate={isActive ? "active" : "inactive"}
                  whileHover={!isActive ? "hover" : undefined}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-2xl"></div>
                  )}
                  <item.icon 
                    className={`w-6 h-6 ${sidebarCollapsed ? '' : 'mr-4'} transition-transform group-hover:scale-110 relative z-10 ${
                      isActive ? 'text-white drop-shadow-lg' : 'text-slate-400 group-hover:text-blue-400'
                    }`} 
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 relative z-10">
                      <div className="font-semibold">{item.name}</div>
                      {!isActive && (
                        <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 bg-white rounded-full shadow-lg relative z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                  {!isActive && !sidebarCollapsed && (
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        <motion.div 
          className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-xl`}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
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
        <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <h1 className="text-lg font-bold text-gray-900">
              Admin Panel
            </h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
          <div className="flex items-center justify-between h-20 px-8">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {navigation.find(nav => isActiveRoute(nav.href, nav.exact))?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {navigation.find(nav => isActiveRoute(nav.href, nav.exact))?.description || 'Yönetim paneline hoş geldiniz'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"></span>
              </motion.button>
              <Link 
                to="/"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Ana Sayfa</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-100/50">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
