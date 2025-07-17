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

  const statCards = [
    {
      title: 'Toplam Rezervasyon',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Bugünkü Rezervasyonlar',
      value: stats.todayReservations,
      icon: Clock,
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Toplam Gelir',
      value: `₺${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple',
      change: '+25%',
      trend: 'up'
    },
    {
      title: 'Aktif Şoförler',
      value: stats.activeDrivers,
      icon: Users,
      color: 'orange',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Bekleyen Rezervasyonlar',
      value: stats.pendingReservations,
      icon: AlertTriangle,
      color: 'yellow',
      change: '-3%',
      trend: 'down'
    },
    {
      title: 'Tamamlanan İşler',
      value: stats.completedReservations,
      icon: CheckCircle,
      color: 'emerald',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Aylık Büyüme',
      value: `%${stats.monthlyGrowth}`,
      icon: TrendingUp,
      color: 'indigo',
      change: '+7%',
      trend: 'up'
    },
    {
      title: 'Müşteri Memnuniyeti',
      value: `%${stats.customerSatisfaction}`,
      icon: Star,
      color: 'pink',
      change: '+2%',
      trend: 'up'
    }
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
      case 'pink':
        return 'bg-pink-500 text-pink-100';
      default:
        return 'bg-gray-500 text-gray-100';
    }
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`text-sm font-medium ${getTrendColor(stat.trend)} flex items-center space-x-1`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3 rotate-180" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">
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
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Son Rezervasyonlar
            </h3>
          </div>
          <div className="card-body">
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz rezervasyon yok</p>
                <p className="text-sm text-gray-400">
                  Yeni rezervasyonlar burada görünecektir
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reservation.reservationId || `RES-${reservation.id?.slice(-6)}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₺{reservation.totalPrice || 0}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        reservation.status === 'completed' ? 'status-completed' :
                        reservation.status === 'pending' ? 'status-pending' :
                        reservation.status === 'assigned' ? 'status-assigned' :
                        'status-pending'
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
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Hızlı İşlemler
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Bekleyen
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pendingReservations}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Tamamlanan
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedReservations}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Car className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Araçlar
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {vehicles.length}
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <Users className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Müşteriler
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Sistem Durumu
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Firebase</p>
              <p className="text-xs text-green-600">Çevrimiçi</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">Google Maps API</p>
              <p className="text-xs text-green-600">Çevrimiçi</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">PayTR API</p>
              <p className="text-xs text-yellow-600">Test Modu</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
