import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  Package,
  Zap,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';
import PushNotificationService from '../../services/pushNotificationService';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Bildirim state'leri
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToken, setPushToken] = useState(null);
  
  // Gerçek veri state'leri
  const [realStats, setRealStats] = useState({
    totalReservations: 0,
    totalVehicles: 0,
    totalDrivers: 0,
    totalRevenue: 0,
    extraServices: 0,
    todayReservations: 0,
    monthlyRevenue: 0,
    activeDrivers: 0
  });

  // Click outside handler for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Firebase listeners and FCM Push Notification kurulumu
  useEffect(() => {
    if (!user) return;

    let isMounted = true; // Component mounted kontrolü
    
    // Gerçek verileri çek
    const fetchRealData = () => {
      // Rezervasyonları dinle
      const reservationsQuery = query(
        collection(db, 'reservations'),
        orderBy('createdAt', 'desc')
      );
      
      const unsubReservations = onSnapshot(reservationsQuery, (snapshot) => {
        if (!isMounted) return;
        
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Bugünün rezervasyonları
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayReservations = reservations.filter(res => {
          const resDate = new Date(res.createdAt);
          return resDate >= today && resDate < tomorrow;
        });
        
        // Bu ayın geliri
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        const monthlyRevenue = reservations
          .filter(res => {
            const resDate = new Date(res.createdAt);
            return resDate >= thisMonth && res.status !== 'cancelled';
          })
          .reduce((sum, res) => sum + (res.totalPrice || 0), 0);
        
        // Toplam gelir
        const totalRevenue = reservations
          .filter(res => res.status !== 'cancelled')
          .reduce((sum, res) => sum + (res.totalPrice || 0), 0);
        
        setRealStats(prev => ({
          ...prev,
          totalReservations: reservations.length,
          todayReservations: todayReservations.length,
          monthlyRevenue,
          totalRevenue
        }));
      });
      
      // Araçları dinle
      const vehiclesQuery = query(collection(db, 'vehicles'));
      const unsubVehicles = onSnapshot(vehiclesQuery, (snapshot) => {
        if (!isMounted) return;
        setRealStats(prev => ({
          ...prev,
          totalVehicles: snapshot.size
        }));
      });
      
      // Şoförleri dinle
      const driversQuery = query(collection(db, 'drivers'));
      const unsubDrivers = onSnapshot(driversQuery, (snapshot) => {
        if (!isMounted) return;
        const drivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const activeDrivers = drivers.filter(driver => driver.isActive !== false);
        
        setRealStats(prev => ({
          ...prev,
          totalDrivers: drivers.length,
          activeDrivers: activeDrivers.length
        }));
      });
      
      // Ek hizmetleri dinle
      const extraServicesQuery = query(collection(db, 'extraServices'));
      const unsubExtraServices = onSnapshot(extraServicesQuery, (snapshot) => {
        if (!isMounted) return;
        setRealStats(prev => ({
          ...prev,
          extraServices: snapshot.size
        }));
      });
      
      return () => {
        unsubReservations();
        unsubVehicles();
        unsubDrivers();
        unsubExtraServices();
      };
    };
    
    const setupNotificationSystem = async () => {
      console.log('🔔 Admin bildirim sistemi başlatılıyor...');

      // FCM Push Notification kurulumu
      try {
        if (PushNotificationService.isSupported) {
          console.log('🔄 FCM Push Notification kurulumu...');
          
          const token = await PushNotificationService.getToken();
          
          if (token && isMounted) {
            setPushToken(token);
            setPushEnabled(true);
            
            // Token'ı Firebase'e kaydet
            const saved = await PushNotificationService.saveTokenToDatabase(user.uid, 'admin', token);
            
            if (saved && isMounted) {
              console.log('✅ FCM Push Notification kuruldu');
              toast.success('🔔 Push bildirimler etkinleştirildi!', {
                position: 'top-right',
                duration: 3000
              });
              
              // Foreground listener kurulumu
              PushNotificationService.setupForegroundListener();
            }
          } else if (isMounted) {
            setPushEnabled(false);
          }
        }
      } catch (error) {
        console.error('❌ FCM Push Notification hatası:', error);
        if (isMounted) {
          setPushEnabled(false);
        }
      }
    };

    // Gerçek verileri çek ve unsubscribe fonksiyonlarını al
    const unsubscribeDataListeners = fetchRealData();

    // FCM kurulumunu başlat
    setupNotificationSystem();

    // Cleanup function
    return () => {
      isMounted = false;
      if (unsubscribeDataListeners) {
        unsubscribeDataListeners();
      }
    };

    // Firebase listeners
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 24); // 24 saat için genişletiyoruz

    const reservationsQuery = query(
      collection(db, 'reservations'),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      reservationsQuery,
      (snapshot) => {
        const newNotifications = [];
        const processedIds = new Set(); // Duplicate kontrolü
        
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const reservationId = change.doc.id;
          
          // Yeni rezervasyon
          if (change.type === 'added' && data.createdAt) {
            const createdTime = new Date(data.createdAt);
            const notificationId = `new-${reservationId}`;
            
            if (createdTime > oneHourAgo && !processedIds.has(notificationId)) {
              processedIds.add(notificationId);
              newNotifications.push({
                id: notificationId,
                type: 'new_reservation',
                title: 'Yeni Rezervasyon',
                message: `${data.customerInfo?.firstName || data.personalInfo?.firstName || 'Bilinmeyen'} tarafından yeni rezervasyon`,
                time: data.createdAt,
                reservationId: reservationId,
                read: false
              });
            }
          }

          // Düzenlenen rezervasyon
          if (change.type === 'modified' && data.lastEditedAt) {
            const editTime = new Date(data.lastEditedAt);
            const notificationId = `edit-${reservationId}-${data.lastEditedAt}`;
            
            if (editTime > oneHourAgo && !processedIds.has(notificationId)) {
              processedIds.add(notificationId);
              newNotifications.push({
                id: notificationId,
                type: 'reservation_edited',
                title: 'Rezervasyon Düzenlendi',
                message: `${data.editedBy} tarafından rezervasyon düzenlendi`,
                time: data.lastEditedAt,
                reservationId: reservationId,
                read: false
              });
            }
          }

          // İptal edilen rezervasyon
          if (change.type === 'modified' && data.status === 'cancelled' && data.cancelledAt) {
            const cancelTime = new Date(data.cancelledAt);
            const notificationId = `cancel-${reservationId}-${data.cancelledAt}`;
            
            if (cancelTime > oneHourAgo && !processedIds.has(notificationId)) {
              processedIds.add(notificationId);
              newNotifications.push({
                id: notificationId,
                type: 'reservation_cancelled',
                title: 'Rezervasyon İptal Edildi',
                message: `${data.cancelledBy || 'Bilinmeyen'} tarafından iptal edildi`,
                time: data.cancelledAt,
                reservationId: reservationId,
                read: false
              });
            }
          }
        });

        if (newNotifications.length > 0) {
          setNotifications(prev => {
            // Mevcut notification ID'lerini al
            const existingIds = new Set(prev.map(n => n.id));
            
            // Sadece yeni olanları ekle
            const trulyNew = newNotifications.filter(n => !existingIds.has(n.id));
            
            if (trulyNew.length === 0) return prev; // Hiç yeni yoksa state'i değiştirme
            
            const combined = [...trulyNew, ...prev];
            // En son 10'unu al
            return combined.slice(0, 10);
          });
          
          // Sadece gerçek yeni notification sayısı kadar unread count artır
          const existingIds = new Set(notifications.map(n => n.id));
          const trulyNewCount = newNotifications.filter(n => !existingIds.has(n.id)).length;
          
          if (trulyNewCount > 0) {
            setUnreadCount(prev => prev + trulyNewCount);
          }

          // Push notification'ları tetikle (eğer aktifse) - Sadece UI için
          if (pushEnabled) {
            newNotifications.forEach(notification => {
              // Browser notification göster (admin paneli açıkken)
              if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: '/logo192.png',
                  tag: `sbs-${notification.type}-${notification.reservationId}`,
                  requireInteraction: true
                });
              }
            });
          }
        }
      },
      (error) => {
        console.error('🔔 Bildirim dinleme hatası:', error);
      }
    );

    return () => {
      isMounted = false; // Component unmount olduğunda flag'i false yap
      unsubscribe();
    };
  }, [user]);

  // Bildirim formatı
  const formatNotificationTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return time.toLocaleDateString('tr-TR');
  };

  // Bildirimi okundu olarak işaretle
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Tüm bildirimleri okundu yap
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };  const handleLogout = async () => {
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
      description: 'Genel bakış ve istatistikler',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stats: null
    },
    {
      name: 'Rezervasyonlar',
      href: '/admin/rezervasyonlar',
      icon: Calendar,
      description: 'Rezervasyon takibi ve yönetimi',
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stats: realStats.totalReservations || '0'
    },
    {
      name: 'Araç Yönetimi',
      href: '/admin/vehicles',
      icon: Car,
      description: 'Araç ekleme, düzenleme ve yönetimi',
      gradient: 'from-green-500 to-emerald-500',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stats: realStats.totalVehicles || '0'
    },
    {
      name: 'Şoför Yönetimi',
      href: '/admin/şoförler',
      icon: Users,
      description: 'Şoför kayıtları ve atamalar',
      gradient: 'from-orange-500 to-red-500',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stats: realStats.totalDrivers || '0'
    },
    {
      name: 'Finansal Yönetim',
      href: '/admin/finans',
      icon: DollarSign,
      description: 'Gelir, gider ve raporlar',
      gradient: 'from-yellow-500 to-orange-500',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      stats: realStats.totalRevenue ? `€${(realStats.totalRevenue / 1000).toFixed(1)}k` : '€0'
    },
    {
      name: 'Ek Hizmetler',
      href: '/admin/ek-hizmetler',
      icon: Package,
      description: 'Ek hizmet yönetimi ve fiyatlandırma',
      gradient: 'from-indigo-500 to-purple-500',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      stats: realStats.extraServices || '0'
    },
    {
      name: 'Ayarlar',
      href: '/admin/ayarlar',
      icon: Settings,
      description: 'Sistem ayarları ve konfigürasyon',
      gradient: 'from-gray-500 to-slate-500',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      stats: null
    }
  ];

  const isActiveRoute = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    
    // Normal karşılaştırma
    if (location.pathname.startsWith(href)) {
      return true;
    }
    
    // URL decode edilmiş karşılaştırma (Türkçe karakterler için)
    try {
      const decodedPathname = decodeURIComponent(location.pathname);
      const decodedHref = decodeURIComponent(href);
      return decodedPathname.startsWith(decodedHref);
    } catch (error) {
      return false;
    }
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
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
              <p className="text-2xl font-bold text-white">{realStats.totalVehicles}</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm p-4 rounded-2xl border border-emerald-500/20 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">Rezervasyon</span>
              </div>
              <p className="text-2xl font-bold text-white">{realStats.totalReservations}</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm p-4 rounded-2xl border border-orange-500/20 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-slate-300">Şoförler</span>
              </div>
              <p className="text-2xl font-bold text-white">{realStats.activeDrivers}</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm p-4 rounded-2xl border border-yellow-500/20 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-slate-300">Aylık Gelir</span>
              </div>
              <p className="text-2xl font-bold text-white">€{realStats.monthlyRevenue}</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {navigation.map((item, index) => {
          const isActive = isActiveRoute(item.href, item.exact);
          
          // Debug için
          if (item.name === 'Şoför Yönetimi') {
            console.log('Şoför Yönetimi Debug:', {
              currentPath: location.pathname,
              decodedPath: decodeURIComponent(location.pathname),
              itemHref: item.href,
              isActive: isActive
            });
          }
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                onClick={(e) => {
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                  // Sayfa üstüne scroll et
                  setTimeout(() => {
                    window.scrollTo({ 
                      top: 0, 
                      behavior: 'smooth' 
                    });
                  }, 100);
                }}
                className="group relative block"
                title={sidebarCollapsed ? item.name : undefined}
              >
                <motion.div
                  className={`flex items-center ${sidebarCollapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'} text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl shadow-blue-500/25 border border-white/20`
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50'
                  }`}
                  whileHover={{ scale: sidebarCollapsed ? 1.1 : 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Glow effect for active item */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <motion.div
                    className={`w-10 h-10 ${sidebarCollapsed ? '' : 'mr-4'} flex items-center justify-center rounded-xl transition-all duration-300 relative z-10 ${
                      isActive 
                        ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                        : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                    }`}
                    whileHover={{ rotate: isActive ? 0 : 5 }}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'text-white drop-shadow-sm' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                  </motion.div>

                  {/* Text and Stats */}
                  {!sidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between relative z-10">
                      <div>
                        <div className={`font-semibold transition-colors ${
                          isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {item.name}
                        </div>
                        <div className={`text-xs mt-0.5 transition-colors ${
                          isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-400'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      
                      {/* Stats Badge */}
                      {item.stats && (
                        <motion.div
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-300'
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.stats}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Hover indicator */}
                  {!isActive && (
                    <motion.div
                      className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-slate-700/50 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin Panel</p>
              <p className="text-xs text-slate-400">Yönetici Modu Aktif</p>
            </div>
          </div>
        )}
        
        <motion.button
          onClick={handleLogout}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 text-sm font-medium text-red-400 hover:text-white hover:bg-red-600/20 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 group`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} group-hover:rotate-12 transition-transform`} />
          {!sidebarCollapsed && <span>Çıkış Yap</span>}
        </motion.button>
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
              {/* Notification Bell */}
              <div className="relative notification-dropdown">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) {
                      markAllAsRead();
                    }
                  }}
                  className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </span>
                  )}
                </motion.button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">Bildirimler</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-xs text-gray-600">
                                Push: {pushEnabled ? 'Aktif' : 'Pasif'}
                              </span>
                              {pushEnabled && (
                                <button
                                  onClick={async () => {
                                    const success = await PushNotificationService.sendTestNotification();
                                    if (success) {
                                      toast.success('🧪 Test notification gönderildi!');
                                    } else {
                                      toast.error('❌ Test notification gönderilemedi');
                                    }
                                  }}
                                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                                >
                                  Test
                                </button>
                              )}
                            </div>
                          </div>
                          {notifications.length > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Tümünü Okundu Yap
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Henüz bildirim yok</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-blue-50/30' : ''
                              }`}
                              onClick={() => {
                                markAsRead(notification.id);
                                navigate(`/admin/rezervasyonlar`);
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                  notification.type === 'new_reservation' ? 'bg-green-500' :
                                  notification.type === 'reservation_edited' ? 'bg-blue-500' :
                                  notification.type === 'reservation_cancelled' ? 'bg-red-500' :
                                  'bg-gray-400'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 ml-2">
                                      {formatNotificationTime(notification.time)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={() => {
                              navigate('/admin/rezervasyonlar');
                              setShowNotifications(false);
                            }}
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Tüm Rezervasyonları Görüntüle
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
