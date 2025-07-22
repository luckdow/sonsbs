import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Car, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Activity,
  MapPin,
  Star,
  Shield,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminDashboard = () => {
  const { state } = useApp();
  const { reservations, vehicles, drivers, customers } = state;
  
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    pendingReservations: 0,
    completedReservations: 0,
    monthlyGrowth: 0,
    customerSatisfaction: 0
  });

  useEffect(() => {
    // Calculate stats
    const today = new Date().toDateString();
    
    const todayReservations = reservations.filter(
      reservation => new Date(reservation.tripDetails?.date).toDateString() === today
    ).length;

    const pendingReservations = reservations.filter(
      reservation => reservation.status === 'pending'
    ).length;

    const completedReservations = reservations.filter(
      reservation => reservation.status === 'completed'
    ).length;

    const totalRevenue = reservations
      .filter(reservation => reservation.status === 'completed')
      .reduce((sum, reservation) => sum + (reservation.totalPrice || 0), 0);

    const activeDrivers = drivers.filter(
      driver => driver.status === 'active'
    ).length;

    // Calculate monthly growth (mock calculation)
    const monthlyGrowth = reservations.length > 0 ? 
      Math.round((completedReservations / reservations.length) * 100) : 0;

    // Calculate customer satisfaction (mock calculation based on completed reservations)
    const customerSatisfaction = completedReservations > 0 ? 
      Math.min(95, 85 + Math.round(completedReservations / 10)) : 0;

    setStats({
      totalReservations: reservations.length,
      todayReservations,
      totalRevenue,
      activeDrivers,
      pendingReservations,
      completedReservations,
      monthlyGrowth,
      customerSatisfaction
    });
  }, [reservations, drivers]);

  // Sadece gerçek zamanlı özetler için kartlar
  const statCards = [
    {
      title: 'Toplam Rezervasyon',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Bugünkü Rezervasyonlar',
      value: stats.todayReservations,
      icon: Clock,
      color: 'green',
    },
    {
      title: 'Bekleyen Rezervasyonlar',
      value: stats.pendingReservations,
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      title: 'Tamamlanan Rezervasyon',
      value: stats.completedReservations,
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      title: 'Araçlar',
      value: vehicles.length,
      icon: Car,
      color: 'purple',
    },
    {
      title: 'Müşteriler',
      value: customers.length,
      icon: Users,
      color: 'indigo',
    },
    {
      title: 'Şoförler',
      value: drivers.length,
      icon: Users,
      color: 'orange',
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 text-blue-100';
      case 'orange':
        return 'bg-orange-500 text-orange-100';
      case 'green':
        return 'bg-green-500 text-green-100';
      case 'purple':
        return 'bg-purple-500 text-purple-100';
      case 'yellow':
        return 'bg-yellow-500 text-yellow-100';
      case 'emerald':
        return 'bg-emerald-500 text-emerald-100';
      case 'indigo':
        return 'bg-indigo-500 text-indigo-100';
      default:
        return 'bg-gray-500 text-gray-100';
    }
  };



  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Hoş Geldiniz! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            SBS Transfer Platform Yönetim Paneli
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getColorClasses(stat.color)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900">
              Son Rezervasyonlar
            </h3>
          </div>
          <div className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Henüz rezervasyon yok</p>
                <p className="text-sm text-gray-400 mt-2">
                  Yeni rezervasyonlar burada görünecektir
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {reservation.reservationId || `RES-${reservation.id?.slice(-6)}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        €{reservation.totalPrice || 0}
                      </p>
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full mt-1 ${
                        reservation.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        reservation.status === 'assigned' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {reservation.status === 'completed' ? 'Tamamlandı' :
                         reservation.status === 'pending' ? 'Bekleyen' :
                         reservation.status === 'assigned' ? 'Atandı' :
                         'Bilinmeyen'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900">
              Hızlı İşlemler
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl text-center border border-orange-200"
              >
                <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Bekleyen
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingReservations}
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl text-center border border-emerald-200"
              >
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Tamamlanan
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.completedReservations}
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center border border-purple-200"
              >
                <Car className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Araçlar
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {vehicles.length}
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl text-center border border-indigo-200"
              >
                <Users className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Müşteriler
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  {customers.length}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  );
};

export default AdminDashboard;
