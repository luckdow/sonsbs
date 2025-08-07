import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Banknote,
  PieChart,
  BarChart3,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Euro,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// İyileştirilmiş finansal utils'i import et
import {
  getCompanyFinancialStatus,
  getDailyFinancialSummary,
  getMonthlyFinancialTrend
} from '../../../utils/companyAccountUtils_IMPROVED';

const FinancialDashboard_IMPROVED = () => {
  const [loading, setLoading] = useState(true);
  const [companyStatus, setCompanyStatus] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    cashPayments: 0,
    cardPayments: 0,
    systemDriversDebt: 0,
    pendingDriverPayments: 0,
    netProfit: 0
  });

  // Gerçek zamanlı rezervasyon verilerini dinle
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const reservationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(reservationData);
        calculateRealTimeStats(reservationData);
      },
      (error) => {
        console.error('Rezervasyonlar dinlenirken hata:', error);
        toast.error('Veri yükleme hatası');
      }
    );

    return () => unsubscribe();
  }, []);

  // Gerçek zamanlı istatistikleri hesapla - YENİ MANTIK
  const calculateRealTimeStats = (reservationData) => {
    // 1. Gelir-Gider işlemlerinden gerçek geliri hesapla
    let realRevenue = 0;
    let realExpenses = 0;
    let cashCollections = 0; // Şoförden tahsilatlar
    let cardRevenue = 0; // Kart gelir
    
    // transactions varsa ve array ise işle
    if (transactions && Array.isArray(transactions)) {
      transactions.forEach(transaction => {
        if (transaction.type === 'credit') {
          // Gelir: Kart/Havale rezervasyonları + Şoför tahsilatları
          realRevenue += transaction.amount || 0;
          
          if (transaction.category === 'Şoförden Tahsilat') {
            cashCollections += transaction.amount || 0;
          } else if (transaction.category === 'Rezervasyon Geliri') {
            cardRevenue += transaction.amount || 0;
          }
        } else if (transaction.type === 'debit') {
          // Gider: Şoför ödemeleri, operasyonel giderler vs.
          realExpenses += transaction.amount || 0;
        }
      });
    }

    // 2. Bekleyen alacakları ve borçları hesapla (rezervasyonlardan)
    let pendingCashReceivables = 0; // Şoförlerden tahsil edilecek
    let pendingDriverPayments = 0; // Şoförlere ödenecek

    reservationData.forEach(reservation => {
      if (reservation.status === 'completed' && reservation.totalPrice) {
        
        if (reservation.paymentMethod === 'cash') {
          // Nakit ödeme: Bekleyen alacak (henüz tahsil edilmemiş)
          if (reservation.assignedDriver !== 'manual') {
            // Sistem şoförü: %15 komisyon alacağı
            const commission = reservation.totalPrice * 0.15;
            pendingCashReceivables += commission;
          } else if (reservation.manualDriverInfo?.price) {
            // Manuel şoför: (toplam - hak ediş) alacağı
            const manualDriverCommission = reservation.totalPrice - reservation.manualDriverInfo.price;
            pendingCashReceivables += manualDriverCommission;
          }
        } else {
          // Kart/Havale ödeme: Şoföre borç
          if (reservation.assignedDriver !== 'manual') {
            // Sistem şoförü: %85 (komisyon düştükten kalan) borcu
            const driverEarning = reservation.totalPrice * 0.85;
            pendingDriverPayments += driverEarning;
          } else if (reservation.manualDriverInfo?.price) {
            // Manuel şoför: Hak ediş borcu
            pendingDriverPayments += reservation.manualDriverInfo.price;
          }
        }
      }
    });

    setRealTimeStats({
      totalRevenue: realRevenue, // Sadece gerçek tahsil edilmiş gelir
      totalExpenses: realExpenses,
      cashPayments: cashCollections, // Şoförden tahsilatlar
      cardPayments: cardRevenue, // Kart gelirleri
      systemDriversDebt: pendingCashReceivables, // Bekleyen nakit tahsilatlar
      pendingDriverPayments, // Bekleyen şoför ödemeleri
      netProfit: realRevenue - realExpenses
    });
  };

  // Verileri yükle
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // API verilerini al (eski sistem ile uyumluluk için)
      const [companyData, dailyData, trendData] = await Promise.all([
        getCompanyFinancialStatus(),
        getDailyFinancialSummary(), 
        getMonthlyFinancialTrend(6)
      ]);

      setCompanyStatus(companyData);
      setDailySummary(dailyData);
      setMonthlyTrend(trendData || []); // Boş array varsayılanı
      setLastUpdate(new Date());

      console.log('📊 Finansal veriler yüklendi:', { companyData, dailyData, trendData });
      
    } catch (error) {
      console.error('❌ Finansal veri yükleme hatası:', error);
      toast.error('Finansal veriler yüklenirken hata oluştu');
      
      // Hata durumunda gerçek zamanlı verileri kullan
      setCompanyStatus({
        totalRevenue: realTimeStats.totalRevenue,
        totalExpense: realTimeStats.totalExpenses,
        netProfit: realTimeStats.netProfit,
        cashFlow: realTimeStats.netProfit,
        cashRevenue: realTimeStats.cashPayments,
        cardRevenue: realTimeStats.cardPayments,
        totalDriverCollections: realTimeStats.systemDriversDebt
      });
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Para formatı - NaN koruması ile
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    if (isNaN(num)) return '€0';
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Yüzde formatı
  const formatPercent = (value) => {
    return `${parseFloat(value || 0).toFixed(1)}%`;
  };

  // Loading durumu
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Finansal veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Finansal Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Şirket finansal durumu ve şoför cari hesap özeti
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
          </div>
          <button
            onClick={fetchFinancialData}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Ana Finansal Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Gelir */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Toplam Gelir</p>
              <p className="text-2xl font-bold">
                {formatCurrency(realTimeStats.totalRevenue || companyStatus?.totalRevenue || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs text-green-100">
                  Bu ay: {formatCurrency(realTimeStats.totalRevenue || 0)}
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        {/* Toplam Gider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Toplam Gider</p>
              <p className="text-2xl font-bold">
                {formatCurrency(realTimeStats.pendingDriverPayments || companyStatus?.totalExpense || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs text-red-100">
                  Şoförlere ödenecek: {formatCurrency(realTimeStats.pendingDriverPayments || 0)}
                </span>
              </div>
            </div>
            <CreditCard className="w-8 h-8 text-red-200" />
          </div>
        </motion.div>

        {/* Net Kar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-gradient-to-r p-6 rounded-xl text-white ${
            (companyStatus?.netProfit || 0) >= 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-orange-500 to-orange-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Kar/Zarar</p>
              <p className="text-2xl font-bold">
                {formatCurrency(realTimeStats.netProfit || companyStatus?.netProfit || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {(realTimeStats.netProfit || 0) >= 0 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-xs text-blue-100">
                  Gerçek zamanlı kar durumu
                </span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        {/* Bekleyen Alacaklar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Bekleyen Alacaklar</p>
              <p className="text-2xl font-bold">
                {formatCurrency(realTimeStats.systemDriversDebt || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs text-orange-100">
                  Şoförlerden tahsil edilecek
                </span>
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Günlük Özet ve Gelir Dağılımı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bugünkü Özet */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Bugünkü Özet</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Günlük Gelir</p>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(dailySummary?.quickStats?.todayRevenue || 0)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Rezervasyon</p>
                <p className="text-xl font-bold text-blue-800">
                  {dailySummary?.quickStats?.reservationCount || 0}
                </p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Günlük Gider</p>
                <p className="text-xl font-bold text-red-800">
                  {formatCurrency(dailySummary?.quickStats?.todayExpenses || 0)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Günlük Kar</p>
                <p className={`text-xl font-bold ${
                  (dailySummary?.quickStats?.todayProfit || 0) >= 0 
                    ? 'text-purple-800' 
                    : 'text-orange-600'
                }`}>
                  {formatCurrency(dailySummary?.quickStats?.todayProfit || 0)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gelir Dağılımı */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <PieChart className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Gelir Dağılımı</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {/* Nakit Gelir */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-800">Nakit Ödemeler</p>
                    <p className="text-sm text-gray-600">
                      {((companyStatus?.cashRevenue || 0) / (companyStatus?.totalRevenue || 1) * 100).toFixed(1)}% pay
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-700">
                    {formatCurrency(companyStatus?.cashRevenue || 0)}
                  </p>
                </div>
              </div>

              {/* Kart Gelir */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Kart/Havale Ödemeler</p>
                    <p className="text-sm text-gray-600">
                      {((companyStatus?.cardRevenue || 0) / (companyStatus?.totalRevenue || 1) * 100).toFixed(1)}% pay
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">
                    {formatCurrency(companyStatus?.cardRevenue || 0)}
                  </p>
                </div>
              </div>

              {/* Şoför Tahsilatları */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Şoför Tahsilatları</p>
                    <p className="text-sm text-gray-600">
                      Komisyon ve borç tahsilat
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">
                    {formatCurrency(companyStatus?.totalDriverCollections || 0)}
                  </p>
                </div>
              </div>

              {/* Bekleyen Alacaklar - YENİ */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-800">Bekleyen Alacaklar</p>
                    <p className="text-sm text-gray-600">
                      Nakit ödemelerden henüz tahsil edilmeyen komisyonlar
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-700">
                    {formatCurrency(realTimeStats?.systemDriversDebt || 0)}
                  </p>
                  <p className="text-xs text-orange-600">
                    Tahsil edilmeli
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Aylık Trend Grafiği */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-800">Son 6 Ay Finansal Trend</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-700">Ay</th>
                  <th className="text-right py-3 font-medium text-gray-700">Gelir</th>
                  <th className="text-right py-3 font-medium text-gray-700">Gider</th>
                  <th className="text-right py-3 font-medium text-gray-700">Kar</th>
                  <th className="text-right py-3 font-medium text-gray-700">Rezervasyon</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrend.map((month, index) => (
                  <motion.tr
                    key={month.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 font-medium text-gray-800">
                      {month.monthName}
                    </td>
                    <td className="py-3 text-right text-green-600 font-medium">
                      {formatCurrency(month.revenue)}
                    </td>
                    <td className="py-3 text-right text-red-600 font-medium">
                      {formatCurrency(month.expenses)}
                    </td>
                    <td className={`py-3 text-right font-bold ${
                      month.profit >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {formatCurrency(month.profit)}
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {month.reservationCount}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Finansal Durum Özeti */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-bold text-indigo-900">Finansal Durum Özeti</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-indigo-700 font-medium">Toplam İşlem</p>
            <p className="text-xl font-bold text-indigo-900">
              {companyStatus?.summary?.totalTransactions || 0}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-indigo-700 font-medium">Kar Marjı</p>
            <p className="text-xl font-bold text-indigo-900">
              {formatPercent(companyStatus?.summary?.profitMargin || 0)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-indigo-700 font-medium">Aktif Bakiye</p>
            <p className={`text-xl font-bold ${
              (companyStatus?.summary?.activeBalance || 0) >= 0 
                ? 'text-indigo-900' 
                : 'text-red-600'
            }`}>
              {formatCurrency(companyStatus?.summary?.activeBalance || 0)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialDashboard_IMPROVED;
