import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Car,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Euro,
  CreditCard,
  Banknote
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const BusinessInsights = () => {
  const [loading, setLoading] = useState(true);
  const [businessStats, setBusinessStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalReservations: 0,
    completedReservations: 0,
    activeDrivers: 0,
    averageTrip: 0,
    cashRevenue: 0,
    cardRevenue: 0,
    systemDriverRevenue: 0,
    manualDriverRevenue: 0,
    topRoutes: [],
    monthlyTrend: []
  });

  const [timeRange, setTimeRange] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    fetchBusinessData();
  }, [timeRange]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      // Rezervasyonları getir
      const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
      const reservations = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Şoförleri getir
      const driversSnapshot = await getDocs(collection(db, 'users'));
      const drivers = driversSnapshot.docs.filter(doc => doc.data().role === 'driver');

      // Manuel şoförleri getir
      const manualDriversSnapshot = await getDocs(collection(db, 'manual_drivers'));
      const manualDrivers = manualDriversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      calculateBusinessStats(reservations, drivers, manualDrivers);

    } catch (error) {
      console.error('❌ İş analizi verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBusinessStats = (reservations, drivers, manualDrivers) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let filteredReservations = reservations;

    // Zaman aralığına göre filtrele
    if (timeRange === 'month') {
      filteredReservations = reservations.filter(r => {
        const date = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return date >= thisMonth;
      });
    } else if (timeRange === 'week') {
      filteredReservations = reservations.filter(r => {
        const date = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return date >= thisWeek;
      });
    }

    const completedReservations = filteredReservations.filter(r => r.status === 'completed');

    // Temel istatistikler
    const totalRevenue = completedReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const cashRevenue = completedReservations
      .filter(r => r.paymentMethod === 'cash')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const cardRevenue = completedReservations
      .filter(r => r.paymentMethod === 'credit_card' || r.paymentMethod === 'card')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    // Şoför bazlı gelir
    const systemDriverRevenue = completedReservations
      .filter(r => r.assignedDriver && r.assignedDriver !== 'manual')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const manualDriverRevenue = completedReservations
      .filter(r => r.assignedDriver === 'manual')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    // Ortalama sefer fiyatı
    const averageTrip = completedReservations.length > 0 
      ? totalRevenue / completedReservations.length 
      : 0;

    // En popüler rotalar
    const routeStats = {};
    completedReservations.forEach(r => {
      const route = `${r.tripDetails?.pickupLocation || 'Bilinmiyor'} → ${r.tripDetails?.dropoffLocation || 'Bilinmiyor'}`;
      routeStats[route] = (routeStats[route] || 0) + 1;
    });

    const topRoutes = Object.entries(routeStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }));

    // Aylık trend (son 6 ay)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthReservations = reservations.filter(r => {
        const rDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return rDate >= date && rDate < nextMonth && r.status === 'completed';
      });

      const monthRevenue = monthReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
      
      monthlyTrend.push({
        month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        count: monthReservations.length
      });
    }

    setBusinessStats({
      totalRevenue,
      monthlyRevenue: timeRange === 'month' ? totalRevenue : 0,
      totalReservations: filteredReservations.length,
      completedReservations: completedReservations.length,
      activeDrivers: drivers.length + manualDrivers.length,
      averageTrip,
      cashRevenue,
      cardRevenue,
      systemDriverRevenue,
      manualDriverRevenue,
      topRoutes,
      monthlyTrend
    });
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border-2 ${color} relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8 opacity-80" />
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
      {subtitle && (
        <div className="text-xs opacity-60 mt-2">{subtitle}</div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İş Analizi & Ciro Takibi</h2>
          <p className="text-gray-600 mt-1">
            Detaylı performans metrikleri ve gelir analizi
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Zaman Aralığı Seçici */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="month">Bu Ay</option>
            <option value="week">Bu Hafta</option>
          </select>
          
          <button
            onClick={fetchBusinessData}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Ciro"
          value={formatCurrency(businessStats.totalRevenue)}
          icon={Euro}
          color="border-green-200 bg-green-50 text-green-800"
          subtitle={`${businessStats.completedReservations} tamamlanan rezervasyon`}
        />

        <StatCard
          title="Ortalama Sefer"
          value={formatCurrency(businessStats.averageTrip)}
          icon={Car}
          color="border-blue-200 bg-blue-50 text-blue-800"
          subtitle="Sefer başına ortalama kazanç"
        />

        <StatCard
          title="Aktif Şoförler"
          value={businessStats.activeDrivers}
          icon={Users}
          color="border-purple-200 bg-purple-50 text-purple-800"
          subtitle="Sistem + Manuel şoförler"
        />

        <StatCard
          title="Tamamlanan Seferler"
          value={businessStats.completedReservations}
          icon={BarChart3}
          color="border-orange-200 bg-orange-50 text-orange-800"
          subtitle={`${businessStats.totalReservations} toplam rezervasyon`}
        />
      </div>

      {/* Ödeme Yöntemi Dağılımı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-500" />
            Nakit Ödemeler
          </h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatCurrency(businessStats.cashRevenue)}
          </div>
          <div className="text-sm text-gray-600">
            {businessStats.totalRevenue > 0 
              ? `${((businessStats.cashRevenue / businessStats.totalRevenue) * 100).toFixed(1)}% toplam cirodan`
              : 'Veri yok'
            }
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Kart Ödemeleri
          </h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatCurrency(businessStats.cardRevenue)}
          </div>
          <div className="text-sm text-gray-600">
            {businessStats.totalRevenue > 0 
              ? `${((businessStats.cardRevenue / businessStats.totalRevenue) * 100).toFixed(1)}% toplam cirodan`
              : 'Veri yok'
            }
          </div>
        </div>
      </div>

      {/* En Popüler Rotalar */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          En Popüler Rotalar
        </h3>
        
        {businessStats.topRoutes.length > 0 ? (
          <div className="space-y-3">
            {businessStats.topRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{route.route}</div>
                  <div className="text-sm text-gray-500">{route.count} sefer</div>
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Henüz tamamlanmış sefer bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Aylık Trend */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          Aylık Ciro Trendi (Son 6 Ay)
        </h3>
        
        <div className="space-y-3">
          {businessStats.monthlyTrend.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
              <div>
                <div className="font-medium">{month.month}</div>
                <div className="text-sm text-gray-600">{month.count} sefer</div>
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(month.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
