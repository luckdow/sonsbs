import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const FinancialSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState({
    totalDrivers: 0,
    totalReservations: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    cashPayments: 0,
    cardPayments: 0,
    systemDriversDebt: 0, // Sistem şoförlerinin komisyon borcu
    manualDriversCredit: 0, // Manuel şoförlere ödenecek miktar
    companyBalance: 0
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek zamanlı finansal durumu dinle
    const unsubscribeReservations = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const reservations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        calculateFinancialStatus(reservations);
      }
    );

    // Finansal işlemleri dinle
    const unsubscribeTransactions = onSnapshot(
      query(
        collection(db, 'financial_transactions'),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRecentTransactions(transactions.slice(0, 10));
        setLoading(false);
      }
    );

    return () => {
      unsubscribeReservations();
      unsubscribeTransactions();
    };
  }, []);

  const calculateFinancialStatus = (reservations) => {
    let totalRevenue = 0;
    let cashPayments = 0;
    let cardPayments = 0;
    let systemDriversDebt = 0;
    let manualDriversCredit = 0;
    let pendingPayments = 0;

    reservations.forEach(reservation => {
      if (reservation.status === 'completed' && reservation.totalPrice) {
        totalRevenue += reservation.totalPrice;
        
        if (reservation.paymentMethod === 'cash') {
          cashPayments += reservation.totalPrice;
          
          // Nakit ödeme: Şoför komisyon borçlu
          if (reservation.assignedDriver !== 'manual') {
            const commission = reservation.totalPrice * 0.15; // %15 komisyon
            systemDriversDebt += commission;
          } else if (reservation.manualDriverInfo?.price) {
            const driverEarning = reservation.manualDriverInfo.price;
            const companyShare = reservation.totalPrice - driverEarning;
            manualDriversCredit += driverEarning;
          }
        } else {
          cardPayments += reservation.totalPrice;
          
          // Kart ödeme: Firma şoföre ödemeli
          if (reservation.assignedDriver !== 'manual') {
            const commission = reservation.totalPrice * 0.15;
            const driverEarning = reservation.totalPrice - commission;
            pendingPayments += driverEarning;
          } else if (reservation.manualDriverInfo?.price) {
            pendingPayments += reservation.manualDriverInfo.price;
          }
        }
      }
    });

    const companyBalance = cardPayments - pendingPayments + systemDriversDebt;

    setSystemStatus({
      totalDrivers: 0, // Bu API'den gelecek
      totalReservations: reservations.length,
      pendingPayments,
      totalRevenue,
      cashPayments,
      cardPayments,
      systemDriversDebt,
      manualDriversCredit,
      companyBalance
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sistem Durumu Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🚀 Finansal Sistem Aktif</h2>
            <p className="opacity-90">
              Gelişmiş finansal takip sistemi çalışıyor. Şoför alacak/verecek durumları otomatik hesaplanıyor.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatCurrency(systemStatus.companyBalance)}</div>
            <div className="text-sm opacity-80">Şirket Net Bakiye</div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Gelir"
          value={formatCurrency(systemStatus.totalRevenue)}
          icon={DollarSign}
          color="border-green-200 bg-green-50 text-green-800"
          trend={12}
          description="Tüm tamamlanan rezervasyonlar"
        />

        <StatCard
          title="Şoförlerden Alacak"
          value={formatCurrency(systemStatus.systemDriversDebt)}
          icon={TrendingUp}
          color="border-blue-200 bg-blue-50 text-blue-800"
          description="Nakit ödemelerden komisyon borcu"
        />

        <StatCard
          title="Şoförlere Verecek"
          value={formatCurrency(systemStatus.pendingPayments)}
          icon={TrendingDown}
          color="border-orange-200 bg-orange-50 text-orange-800"
          description="Kart ödemelerden şoför alacağı"
        />

        <StatCard
          title="Bekleyen İşlemler"
          value={systemStatus.totalReservations}
          icon={Clock}
          color="border-purple-200 bg-purple-50 text-purple-800"
          description="Toplam rezervasyon sayısı"
        />
      </div>

      {/* Ödeme Türü Dağılımı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Nakit Ödemeler
          </h3>
          <div className="text-2xl font-bold text-green-600 mb-2">
            {formatCurrency(systemStatus.cashPayments)}
          </div>
          <div className="text-sm text-gray-600">
            Bu ödemelerden şoförler komisyon borçlu
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            Kart Ödemeleri
          </h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {formatCurrency(systemStatus.cardPayments)}
          </div>
          <div className="text-sm text-gray-600">
            Bu ödemelerden şoförlere ücret ödenecek
          </div>
        </div>
      </div>

      {/* Son İşlemler */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Son Finansal İşlemler
        </h3>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
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
                      {transaction.createdAt?.toDate?.()?.toLocaleDateString('tr-TR')}
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
            <p>Henüz finansal işlem kaydı bulunmuyor</p>
            <p className="text-sm">İlk rezervasyon tamamlandığında işlemler burada görünecek</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialSystemStatus;
