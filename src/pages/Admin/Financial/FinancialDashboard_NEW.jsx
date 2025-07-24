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
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const FinancialDashboard_NEW = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [manualDrivers, setManualDrivers] = useState([]);
  const [financialTransactions, setFinancialTransactions] = useState([]);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,           // Toplam Gelir (Ciro)
    totalExpenses: 0,          // Toplam Gider
    totalDriversDebt: 0,       // Şoförlerden Alacaklarım
    totalDriversCredit: 0,     // Şoförlere Ödeyeceğim
    cashPayments: 0,           // Nakit Ödemeler
    cardPayments: 0,           // Kredi Kartı
    bankTransferPayments: 0,   // Banka Havalesi
    todayRevenue: 0,           // Günlük Gelir
    todayExpenses: 0,          // Günlük Gider
    monthlyTrend: []           // 6 Aylık Trend
  });

  // Gerçek zamanlı veri dinleme
  useEffect(() => {
    const unsubscribes = [];

    // Rezervasyonları dinle
    unsubscribes.push(
      onSnapshot(collection(db, 'reservations'), (snapshot) => {
        const reservationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(reservationData);
      })
    );

    // Sisteme kayıtlı şoförleri dinle
    unsubscribes.push(
      onSnapshot(collection(db, 'users'), (snapshot) => {
        const driverData = snapshot.docs
          .filter(doc => doc.data().role === 'driver')
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        setDrivers(driverData);
      })
    );

    // Manuel şoförleri dinle
    unsubscribes.push(
      onSnapshot(collection(db, 'manual_drivers'), (snapshot) => {
        const manualDriverData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setManualDrivers(manualDriverData);
      })
    );

    // Finansal işlemleri dinle
    unsubscribes.push(
      onSnapshot(
        query(
          collection(db, 'financial_transactions'),
          orderBy('createdAt', 'desc'),
          limit(50)
        ),
        (snapshot) => {
          const transactionData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFinancialTransactions(transactionData);
          setLoading(false);
        }
      )
    );

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // İstatistikleri hesapla
  useEffect(() => {
    calculateDashboardStats();
  }, [reservations, drivers, manualDrivers, financialTransactions]);

  const calculateDashboardStats = () => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalDriversDebt = 0;
    let totalDriversCredit = 0;
    let cashPayments = 0;
    let cardPayments = 0;
    let bankTransferPayments = 0;
    let todayRevenue = 0;
    let todayExpenses = 0;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Tamamlanan rezervasyonlardan gelir hesapla
    reservations.forEach(reservation => {
      if (reservation.status === 'completed' && reservation.totalPrice) {
        const amount = parseFloat(reservation.totalPrice) || 0;
        totalRevenue += amount;

        // Ödeme metoduna göre dağılım
        if (reservation.paymentMethod === 'cash') {
          cashPayments += amount;
        } else if (reservation.paymentMethod === 'credit_card' || reservation.paymentMethod === 'card') {
          cardPayments += amount;
        } else if (reservation.paymentMethod === 'bank_transfer') {
          bankTransferPayments += amount;
        }

        // Günlük gelir
        if (reservation.completedAt && reservation.completedAt.toDate() >= todayStart) {
          todayRevenue += amount;
        }
      }
    });

    // Finansal işlemlerden gider hesapla
    financialTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      
      if (transaction.type === 'debit') {
        totalExpenses += amount;
        
        // Günlük gider
        if (transaction.createdAt && transaction.createdAt.toDate() >= todayStart) {
          todayExpenses += amount;
        }
      }
    });

    // Şoför alacak/verecek hesapla
    drivers.forEach(driver => {
      const balance = parseFloat(driver.balance) || 0;
      if (balance < 0) {
        totalDriversDebt += Math.abs(balance); // Şoförden alacak
      } else if (balance > 0) {
        totalDriversCredit += balance; // Şoföre verecek
      }
    });

    manualDrivers.forEach(driver => {
      const balance = parseFloat(driver.balance) || 0;
      if (balance < 0) {
        totalDriversDebt += Math.abs(balance); // Şoförden alacak
      } else if (balance > 0) {
        totalDriversCredit += balance; // Şoföre verecek
      }
    });

    // 6 aylık trend hesapla
    const monthlyTrend = calculateMonthlyTrend();

    setDashboardStats({
      totalRevenue,
      totalExpenses,
      totalDriversDebt,
      totalDriversCredit,
      cashPayments,
      cardPayments,
      bankTransferPayments,
      todayRevenue,
      todayExpenses,
      monthlyTrend
    });

    setLastUpdate(new Date());
  };

  const calculateMonthlyTrend = () => {
    const trend = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      let monthRevenue = 0;
      let monthExpenses = 0;

      // O aydaki tamamlanan rezervasyonlar
      reservations.forEach(reservation => {
        if (reservation.status === 'completed' && 
            reservation.completedAt && 
            reservation.completedAt.toDate() >= monthStart && 
            reservation.completedAt.toDate() <= monthEnd) {
          monthRevenue += parseFloat(reservation.totalPrice) || 0;
        }
      });

      // O aydaki giderler
      financialTransactions.forEach(transaction => {
        if (transaction.type === 'debit' && 
            transaction.createdAt && 
            transaction.createdAt.toDate() >= monthStart && 
            transaction.createdAt.toDate() <= monthEnd) {
          monthExpenses += parseFloat(transaction.amount) || 0;
        }
      });

      trend.push({
        month: monthStart.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses
      });
    }

    return trend;
  };

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

  const StatCard = ({ title, value, icon: Icon, color, trend, description }) => (
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
            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
      {description && (
        <div className="text-xs opacity-60 mt-2">{description}</div>
      )}
    </motion.div>
  );

  const getRecentTransactions = () => {
    const recent = [...financialTransactions]
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      })
      .slice(0, 10);

    return recent;
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📊 Finansal Dashboard</h2>
          <p className="text-gray-600">Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}</p>
        </div>
        <button
          onClick={calculateDashboardStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {/* Ana İstatistik Kartları (4 Kart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Gelir (Ciro)"
          value={formatCurrency(dashboardStats.totalRevenue)}
          icon={DollarSign}
          color="border-green-200 bg-green-50 text-green-800"
          description="Tüm tamamlanan rezervasyonlar"
        />

        <StatCard
          title="Toplam Gider"
          value={formatCurrency(dashboardStats.totalExpenses)}
          icon={TrendingDown}
          color="border-red-200 bg-red-50 text-red-800"
          description="Şoför ödemeleri ve manuel giderler"
        />

        <StatCard
          title="Şoförlerden Alacaklarım"
          value={formatCurrency(dashboardStats.totalDriversDebt)}
          icon={Users}
          color="border-blue-200 bg-blue-50 text-blue-800"
          description="Nakit ödemelerden komisyon borcu"
        />

        <StatCard
          title="Şoförlere Ödeyeceğim"
          value={formatCurrency(dashboardStats.totalDriversCredit)}
          icon={Wallet}
          color="border-orange-200 bg-orange-50 text-orange-800"
          description="Kart ödemelerden şoför alacağı"
        />
      </div>

      {/* Gelir Dağılımı (3 Kart) */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Gelir Dağılımı
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Nakit Ödemeler"
            value={formatCurrency(dashboardStats.cashPayments)}
            icon={Banknote}
            color="border-emerald-200 bg-emerald-50 text-emerald-800"
            description={`${((dashboardStats.cashPayments / dashboardStats.totalRevenue) * 100 || 0).toFixed(1)}% toplam gelir`}
          />

          <StatCard
            title="Kredi Kartı"
            value={formatCurrency(dashboardStats.cardPayments)}
            icon={CreditCard}
            color="border-blue-200 bg-blue-50 text-blue-800"
            description={`${((dashboardStats.cardPayments / dashboardStats.totalRevenue) * 100 || 0).toFixed(1)}% toplam gelir`}
          />

          <StatCard
            title="Banka Havalesi"
            value={formatCurrency(dashboardStats.bankTransferPayments)}
            icon={Building2}
            color="border-purple-200 bg-purple-50 text-purple-800"
            description={`${((dashboardStats.bankTransferPayments / dashboardStats.totalRevenue) * 100 || 0).toFixed(1)}% toplam gelir`}
          />
        </div>
      </div>

      {/* Günlük Özet */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Günlük Özet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(dashboardStats.todayRevenue)}</div>
            <div className="text-sm text-gray-600">Bugünkü Gelir</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(dashboardStats.todayExpenses)}</div>
            <div className="text-sm text-gray-600">Bugünkü Gider</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              (dashboardStats.todayRevenue - dashboardStats.todayExpenses) >= 0 
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(dashboardStats.todayRevenue - dashboardStats.todayExpenses)}
            </div>
            <div className="text-sm text-gray-600">Bugünkü Kar/Zarar</div>
          </div>
        </div>
      </div>

      {/* 6 Ay Trend */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          6 Aylık Trend
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ay</th>
                <th className="text-right py-2">Gelir</th>
                <th className="text-right py-2">Gider</th>
                <th className="text-right py-2">Kar/Zarar</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.monthlyTrend.map((month, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium">{month.month}</td>
                  <td className="py-3 text-right text-green-600">{formatCurrency(month.revenue)}</td>
                  <td className="py-3 text-right text-red-600">{formatCurrency(month.expenses)}</td>
                  <td className={`py-3 text-right font-medium ${
                    month.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(month.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* İşlem Özetleri */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Son İşlem Özetleri
        </h3>
        
        {getRecentTransactions().length > 0 ? (
          <div className="space-y-3">
            {getRecentTransactions().map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {transaction.createdAt?.toDate?.()?.toLocaleDateString('tr-TR')} - {transaction.category || 'Kategori yok'}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Henüz işlem kaydı bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard_NEW;
