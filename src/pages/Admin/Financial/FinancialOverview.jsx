import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const FinancialOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    driverDebts: 0,
    completedTrips: 0,
    monthlyGrowth: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Tamamlanan rezervasyonları getir
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('status', '==', 'completed'),
        orderBy('createdAt', 'desc')
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
      const reservations = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Şoför ödeme verilerini getir (users koleksiyonundan)
      const driversQuery = query(
        collection(db, 'users'),
        where('role', '==', 'driver')
      );
      const driversSnapshot = await getDocs(driversQuery);
      const drivers = driversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // İstatistikleri hesapla
      const totalRevenue = reservations.reduce((sum, res) => sum + (res.totalPrice || 0), 0);
      
      // Nakit ödemeli rezervasyonlar için bekleyen ödemeler
      const pendingCashPayments = reservations
        .filter(res => res.paymentMethod === 'cash')
        .reduce((sum, res) => sum + (res.totalPrice || 0), 0);
      
      // Şoför borçlarını ve alacaklarını hesapla
      let driverDebts = 0;
      let driverCredits = 0;
      let totalCommissionRevenue = 0;
      
      drivers.forEach(driver => {
        const balance = driver.balance || 0;
        if (balance < 0) {
          driverDebts += Math.abs(balance); // Şoför firmaya borçlu (komisyon borçları)
        } else if (balance > 0) {
          driverCredits += balance; // Firma şofore borçlu (kart ödemeleri)
        }
        
        // Toplam komisyon geliri
        totalCommissionRevenue += driver.totalCommission || 0;
      });

      setStats({
        totalRevenue,
        pendingCashPayments,
        driverDebts,
        driverCredits,
        totalCommissionRevenue,
        completedTrips: reservations.length,
        activeDrivers: drivers.filter(d => d.isActive !== false).length,
        monthlyGrowth: 12.5 // Bu gerçek verilerle hesaplanacak
      });

      // Son işlemleri ayarla
      setRecentTransactions(reservations.slice(0, 10));

    } catch (error) {
      console.error('Finansal veri getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, prefix = '€' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                %{Math.abs(trend)}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-8 h-8 ${color.replace('border-l-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Gelir"
          value={stats.totalRevenue}
          icon={DollarSign}
          color="border-l-green-500"
          trend={stats.monthlyGrowth}
        />
        
        <StatCard
          title="Komisyon Gelirimiz"
          value={stats.totalCommissionRevenue}
          icon={TrendingUp}
          color="border-l-purple-500"
        />
        
        <StatCard
          title="Şoför Borçları (Nakit Komisyon)"
          value={stats.driverDebts}
          icon={AlertCircle}
          color="border-l-red-500"
        />
        
        <StatCard
          title="Şofore Borçlarımız (Kart Ödemeleri)"
          value={stats.driverCredits}
          icon={Users}
          color="border-l-blue-500"
        />
      </div>

      {/* Ek İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Bekleyen Nakit Tahsilat"
          value={stats.pendingCashPayments}
          icon={DollarSign}
          color="border-l-yellow-500"
        />
        
        <StatCard
          title="Tamamlanan Yolculuklar"
          value={stats.completedTrips}
          icon={CreditCard}
          color="border-l-indigo-500"
          prefix=""
        />
        
        <StatCard
          title="Aktif Şoförler"
          value={stats.activeDrivers}
          icon={Users}
          color="border-l-emerald-500"
          prefix=""
        />
      </div>

      {/* Son İşlemler */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-600" />
            Son İşlemler
          </h3>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Tümünü Gör
          </button>
        </div>

        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.paymentMethod === 'cash' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    transaction.paymentMethod === 'cash' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {transaction.customerName || 'Müşteri'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.pickupLocation?.address || 'Lokasyon'} → {transaction.dropoffLocation?.address || 'Varış'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-green-600">
                  €{(transaction.totalPrice || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <DollarSign className="w-8 h-8 mb-3" />
          <h4 className="font-bold text-lg mb-2">Ödeme Yap</h4>
          <p className="text-green-100 text-sm">Şoförlere ödeme yap</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Users className="w-8 h-8 mb-3" />
          <h4 className="font-bold text-lg mb-2">Cari Takip</h4>
          <p className="text-blue-100 text-sm">Şoför carilerini görüntüle</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Calendar className="w-8 h-8 mb-3" />
          <h4 className="font-bold text-lg mb-2">Rapor Al</h4>
          <p className="text-purple-100 text-sm">Finansal rapor oluştur</p>
        </motion.button>
      </div>
    </div>
  );
};

export default FinancialOverview;
