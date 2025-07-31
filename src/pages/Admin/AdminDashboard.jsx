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
import toast from 'react-hot-toast';

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
    <div className="space-y-6 p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yönetici Paneli</h1>
        <p className="text-gray-600 mt-1">Rezervasyonlar, araçlar ve genel istatistikleri görüntüleyin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Son Rezervasyonlar
            </h2>
          </div>
          <div className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-700">Henüz rezervasyon yok</p>
                <p className="text-sm text-gray-600 mt-1">
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
                        €{reservation.totalPrice || 0}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        reservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        reservation.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
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
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
              Hızlı İşlemler
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Bekleyen
                </p>
                <p className="text-2xl font-semibold text-orange-600">
                  {stats.pendingReservations}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Tamamlanan
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  {stats.completedReservations}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                <Car className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Araçlar
                </p>
                <p className="text-2xl font-semibold text-purple-600">
                  {vehicles.length}
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Müşteriler
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminDashboard;
