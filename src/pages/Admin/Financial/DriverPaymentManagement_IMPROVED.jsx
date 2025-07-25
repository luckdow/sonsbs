import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Users,
  Banknote,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Euro
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { collection, getDocs, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// İyileştirilmiş finansal utils
import {
  recordDriverPayment,
  recordDriverCollection,
  getDriverFinancialSummary
} from '../../../utils/companyAccountUtils_IMPROVED';

const DriverPaymentManagement_IMPROVED = () => {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [manualDrivers, setManualDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'positive', 'negative', 'zero'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    type: 'payment', // 'payment' or 'collection'
    amount: '',
    note: ''
  });

  // Şoför verilerini yükle
  const fetchDriverData = async () => {
    try {
      setLoading(true);

      // Sisteme kayıtlı şoförleri getir
      const driversSnapshot = await getDocs(collection(db, 'users'));
      const driversData = [];

      driversSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.role === 'driver') {
          driversData.push({
            id: doc.id,
            ...data,
            type: 'regular',
            displayName: `${data.firstName} ${data.lastName}`,
            commission: data.commission || 15
          });
        }
      });

      // Manuel şoförleri getir
      const manualSnapshot = await getDocs(collection(db, 'manual_drivers'));
      const manualData = [];

      manualSnapshot.docs.forEach(doc => {
        const data = doc.data();
        manualData.push({
          id: doc.id,
          ...data,
          type: 'manual',
          displayName: data.name,
          commission: 0 // Manuel şoförlerin komisyonu yok
        });
      });

      // Client tarafında sırala
      driversData.sort((a, b) => a.firstName?.localeCompare(b.firstName) || 0);
      manualData.sort((a, b) => a.name?.localeCompare(b.name) || 0);

      setDrivers(driversData);
      setManualDrivers(manualData);

      console.log('👥 Şoför verileri yüklendi:', {
        regular: driversData.length,
        manual: manualData.length
      });

      // Debug: Sistem şoförlerinin bakiye durumunu kontrol et
      driversData.forEach(driver => {
        console.log(`🔍 Sistem Şoför: ${driver.displayName}`, {
          balance: driver.balance || 0,
          totalEarnings: driver.totalEarnings || 0,
          totalCommission: driver.totalCommission || 0,
          completedTrips: driver.completedTrips || 0,
          transactions: driver.transactions?.length || 0
        });
      });

    } catch (error) {
      console.error('❌ Şoför verileri yüklenemedi:', error);
      toast.error('Şoför verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  // Tüm şoförleri birleştir ve filtrele
  const getAllDrivers = () => {
    const allDrivers = [...drivers, ...manualDrivers];
    
    return allDrivers.filter(driver => {
      // Arama filtresi
      const matchesSearch = 
        driver.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone?.includes(searchTerm) ||
        driver.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Bakiye filtresi
      const balance = driver.balance || 0;
      switch (filterType) {
        case 'positive':
          return balance > 0;
        case 'negative':
          return balance < 0;
        case 'zero':
          return balance === 0;
        default:
          return true;
      }
    });
  };

  // Para formatı
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Bakiye durumu
  const getBalanceStatus = (balance) => {
    if (balance > 0) {
      return {
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: TrendingUp,
        text: 'Borçlu (Size)',
        description: 'Şofore ödemeniz gereken tutar'
      };
    } else if (balance < 0) {
      return {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: TrendingDown,
        text: 'Alacaklı (Sizden)',
        description: 'Şoförden alacağınız tutar'
      };
    } else {
      return {
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: CheckCircle,
        text: 'Dengeli',
        description: 'Hesap kapalı'
      };
    }
  };

  // Ödeme/Tahsilat işlemi
  const handlePaymentOperation = async () => {
    if (!selectedDriver || !paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error('Lütfen geçerli bir tutar girin');
      return;
    }

    try {
      const amount = parseFloat(paymentData.amount);
      const currentBalance = selectedDriver.balance || 0;

      let newBalance;
      let operationFunction;

      if (paymentData.type === 'payment') {
        // Ödeme yapıyoruz (pozitif bakiyeyi düşürüyoruz)
        newBalance = currentBalance - amount;
        operationFunction = recordDriverPayment;
      } else {
        // Tahsilat yapıyoruz (negatif bakiyeyi arttırıyoruz)
        newBalance = currentBalance + amount;
        operationFunction = recordDriverCollection;
      }

      // Şirket finansal kaydını oluştur
      await operationFunction(
        selectedDriver.id,
        selectedDriver.type,
        selectedDriver.displayName,
        amount,
        paymentData.note
      );

      // Şoför cari hesabını güncelle
      const collectionName = selectedDriver.type === 'regular' ? 'users' : 'manual_drivers';
      const updateData = {
        balance: newBalance,
        lastTransactionDate: new Date()
      };

      // İşlem geçmişi güncelle
      const currentTransactions = selectedDriver.transactions || [];
      const transaction = {
        id: Date.now().toString(),
        type: paymentData.type,
        amount: amount,
        note: paymentData.note || `${paymentData.type === 'payment' ? 'Ödeme' : 'Tahsilat'} yapıldı`,
        date: new Date(),
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        processedBy: 'admin_manual'
      };

      updateData.transactions = [...currentTransactions, transaction];

      await updateDoc(doc(db, collectionName, selectedDriver.id), updateData);

      // State güncelle
      const updateFunction = selectedDriver.type === 'regular' ? setDrivers : setManualDrivers;
      updateFunction(prev => 
        prev.map(driver => 
          driver.id === selectedDriver.id 
            ? { ...driver, balance: newBalance, transactions: updateData.transactions }
            : driver
        )
      );

      toast.success(
        `${paymentData.type === 'payment' ? 'Ödeme' : 'Tahsilat'} başarıyla kaydedildi`
      );

      // Modal'ı kapat
      setShowPaymentModal(false);
      setSelectedDriver(null);
      setPaymentData({ type: 'payment', amount: '', note: '' });

    } catch (error) {
      console.error('❌ Ödeme işlemi hatası:', error);
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  // Şoför detaylarını göster - GELİŞTİRİLMİŞ VE GÜVENLİ
  const showDriverDetails = async (driver) => {
    try {
      console.log('🔍 Şoför detayları yükleniyor:', driver);
      setSelectedDriver(driver);
      
      // Detaylı finansal özet getir - Hata yakalama ile
      let financialSummary = null;
      try {
        financialSummary = await getDriverFinancialSummary(driver.id, driver.type);
        console.log('💰 Finansal özet alındı:', financialSummary);
      } catch (error) {
        console.warn('⚠️ Finansal özet alınamadı:', error);
        // Varsayılan değerler
        financialSummary = {
          totalEarnings: 0,
          reservationCount: 0,
          totalPayments: 0,
          netBalance: driver.balance || 0
        };
      }
      
      // Son rezervasyon detaylarını getir - Hata yakalama ile
      let recentReservations = [];
      try {
        recentReservations = await getDriverRecentReservations(driver.id, driver.type);
        console.log('📋 Son rezervasyonlar alındı:', recentReservations.length, 'adet');
      } catch (error) {
        console.warn('⚠️ Son rezervasyonlar alınamadı:', error);
        recentReservations = [];
      }
      
      // Performans istatistiklerini hesapla - Güvenli hesaplama
      let performanceStats = null;
      try {
        performanceStats = calculateDriverPerformance(driver, financialSummary);
        console.log('📊 Performans istatistikleri hesaplandı:', performanceStats);
      } catch (error) {
        console.warn('⚠️ Performans istatistikleri hesaplanamadı:', error);
        performanceStats = {
          totalTrips: 0,
          avgEarningPerTrip: 0,
          recentActivityCount: 0,
          lastActivityDate: null,
          cashTrips: 0,
          cardTrips: 0,
          totalCashCommission: 0,
          totalCardEarnings: 0
        };
      }
      
      setSelectedDriver(prev => ({ 
        ...prev, 
        financialSummary,
        recentReservations,
        performanceStats
      }));
      
      setShowDetailModal(true);
      console.log('✅ Şoför detayları başarıyla yüklendi');
      
    } catch (error) {
      console.error('❌ Şoför detayları alınamadı:', error);
      toast.error(`Şoför detayları yüklenirken hata oluştu: ${error.message}`);
      
      // Hata durumunda bile modal aç, temel bilgileri göster
      setSelectedDriver(prev => ({ 
        ...prev, 
        financialSummary: { totalEarnings: 0, reservationCount: 0, totalPayments: 0, netBalance: driver.balance || 0 },
        recentReservations: [],
        performanceStats: { totalTrips: 0, avgEarningPerTrip: 0, recentActivityCount: 0, lastActivityDate: null }
      }));
      setShowDetailModal(true);
    }
  };

  // Son rezervasyonları getir - GÜVENLİ
  const getDriverRecentReservations = async (driverId, driverType) => {
    try {
      console.log('📋 Son rezervasyonlar sorgulanıyor:', { driverId, driverType });
      
      // Daha basit sorgu - önce tüm tamamlanan rezervasyonları al
      const reservationsSnapshot = await getDocs(
        query(
          collection(db, 'reservations'),
          where('status', '==', 'completed'),
          orderBy('completedAt', 'desc')
        )
      );
      
      // Client tarafında filtreleme yap
      const allReservations = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Şofore ait olanları filtrele
      const driverReservations = allReservations.filter(reservation => {
        if (driverType === 'regular') {
          return reservation.assignedDriver === driverId || 
                 reservation.assignedDriverId === driverId ||
                 reservation.driverId === driverId;
        } else {
          // Manuel şoför için
          return reservation.assignedDriver === 'manual' && 
                 reservation.manualDriverInfo &&
                 reservation.manualDriverInfo.phone &&
                 driverId.includes(reservation.manualDriverInfo.phone.replace(/[^0-9]/g, ''));
        }
      });
      
      // Son 10 tanesi al
      const recentReservations = driverReservations.slice(0, 10);
      
      console.log('✅ Son rezervasyonlar bulundu:', recentReservations.length, 'adet');
      return recentReservations;
      
    } catch (error) {
      console.error('❌ Son rezervasyonlar alınamadı:', error);
      
      // Hata durumunda boş array dön
      return [];
    }
  };

  // Performans istatistiklerini hesapla - GÜVENLİ
  const calculateDriverPerformance = (driver, financialSummary) => {
    try {
      console.log('📊 Performans hesaplanıyor:', { driver: driver?.displayName, financialSummary });
      
      // Güvenli değer alma
      const totalTrips = driver?.completedTrips || financialSummary?.reservationCount || 0;
      const totalEarnings = financialSummary?.totalEarnings || 0;
      const avgEarningPerTrip = totalTrips > 0 ? (totalEarnings / totalTrips) : 0;
      
      // Son 30 günün işlem sayısı (güvenli hesaplama)
      let recentTransactions = [];
      try {
        if (driver?.transactions && Array.isArray(driver.transactions)) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          recentTransactions = driver.transactions.filter(t => {
            try {
              const transactionDate = t?.date?.seconds ? 
                new Date(t.date.seconds * 1000) : 
                new Date(t?.date || Date.now());
              return transactionDate >= thirtyDaysAgo;
            } catch (error) {
              console.warn('⚠️ İşlem tarihi okunamadı:', t);
              return false;
            }
          });
        }
      } catch (error) {
        console.warn('⚠️ Son işlemler hesaplanamadı:', error);
        recentTransactions = [];
      }

      const result = {
        totalTrips,
        avgEarningPerTrip: Math.round(avgEarningPerTrip * 100) / 100, // 2 ondalık basamak
        recentActivityCount: recentTransactions.length,
        lastActivityDate: driver?.lastTransactionDate || null,
        // Ödeme metodları analizi - güvenli erişim
        cashTrips: driver?.totalCashTrips || 0,
        cardTrips: driver?.totalCardTrips || 0,
        // Finansal analiz - güvenli erişim
        totalCashCommission: driver?.totalCashCommission || 0,
        totalCardEarnings: driver?.totalCardEarnings || 0
      };
      
      console.log('✅ Performans hesaplandı:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Performans hesaplanamadı:', error);
      
      // Hata durumunda varsayılan değerler
      return {
        totalTrips: 0,
        avgEarningPerTrip: 0,
        recentActivityCount: 0,
        lastActivityDate: null,
        cashTrips: 0,
        cardTrips: 0,
        totalCashCommission: 0,
        totalCardEarnings: 0
      };
    }
  };

  const filteredDrivers = getAllDrivers();

  // Özet istatistikler
  const summaryStats = {
    totalDrivers: filteredDrivers.length,
    totalDebt: filteredDrivers.filter(d => (d.balance || 0) > 0).reduce((sum, d) => sum + d.balance, 0),
    totalCredit: Math.abs(filteredDrivers.filter(d => (d.balance || 0) < 0).reduce((sum, d) => sum + d.balance, 0)),
    balancedDrivers: filteredDrivers.filter(d => (d.balance || 0) === 0).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="w-8 h-8 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Şoför verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Şoför Ödeme Yönetimi</h2>
          <p className="text-gray-600 mt-1">
            Şoförlerin cari hesap durumu ve ödeme/tahsilat işlemleri
          </p>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Toplam Şoför</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalDrivers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Toplam Borcunuz</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(summaryStats.totalDebt)}
              </p>
              <p className="text-xs text-red-500 mt-1">Şoförlere ödeyeceğiniz</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Toplam Alacağınız</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(summaryStats.totalCredit)}
              </p>
              <p className="text-xs text-green-500 mt-1">Şoförlerden alacağınız</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Net Durum</p>
              <p className={`text-2xl font-bold ${
                (summaryStats.totalCredit - summaryStats.totalDebt) >= 0 
                  ? 'text-blue-900' 
                  : 'text-red-900'
              }`}>
                {formatCurrency(summaryStats.totalCredit - summaryStats.totalDebt)}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {summaryStats.totalCredit > summaryStats.totalDebt ? 'Lehinizdeki fark' : 'Aleyinizdeki fark'}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Şoför ara (isim, telefon, plaka)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Şoförler</option>
              <option value="positive">Borçlu Şoförler (Size)</option>
              <option value="negative">Alacaklı Şoförler (Sizden)</option>
              <option value="zero">Dengeli Hesaplar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Şoför Listesi */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">
            Şoför Cari Hesapları ({filteredDrivers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şoför
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bakiye
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterType !== 'all' 
                      ? 'Filtrelere uygun şoför bulunamadı' 
                      : 'Henüz şoför kaydı bulunmuyor'}
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const balance = driver.balance || 0;
                  const status = getBalanceStatus(balance);
                  const StatusIcon = status.icon;

                  return (
                    <motion.tr
                      key={`${driver.type}_${driver.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            driver.type === 'regular' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            <span className={`text-sm font-medium ${
                              driver.type === 'regular' ? 'text-blue-700' : 'text-purple-700'
                            }`}>
                              {driver.type === 'regular' 
                                ? `${driver.firstName?.charAt(0) || ''}${driver.lastName?.charAt(0) || ''}` 
                                : driver.name?.charAt(0) || 'M'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {driver.displayName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                driver.type === 'regular' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {driver.type === 'regular' ? 'Sistem Şoförü' : 'Manuel Şoför'}
                              </span>
                              {driver.type === 'regular' && (
                                <span className="text-xs text-gray-500">
                                  %{driver.commission} komisyon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          📱 {driver.phone || 'Belirtilmemiş'}
                        </div>
                        {driver.plateNumber && (
                          <div className="text-sm text-gray-500 mt-1">
                            🚗 {driver.plateNumber}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className={`text-lg font-bold ${status.color}`}>
                          {formatCurrency(Math.abs(balance))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {balance > 0 ? 'Size borçlu' : balance < 0 ? 'Sizden alacaklı' : 'Hesap kapalı'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.border} ${status.color} border`}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {status.text}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showDriverDetails(driver)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detay
                          </button>

                          {balance > 0 && (
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setPaymentData({ type: 'payment', amount: '', note: '' });
                                setShowPaymentModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                            >
                              <Minus className="w-4 h-4 mr-1" />
                              Ödeme
                            </button>
                          )}

                          {balance < 0 && (
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setPaymentData({ type: 'collection', amount: '', note: '' });
                                setShowPaymentModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Tahsilat
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ödeme/Tahsilat Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {paymentData.type === 'payment' ? '💳 Ödeme Yap' : '💰 Tahsilat Yap'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şoför: {selectedDriver.displayName}
                    </label>
                    <p className="text-sm text-gray-600">
                      Mevcut Bakiye: <span className={getBalanceStatus(selectedDriver.balance || 0).color}>
                        {formatCurrency(Math.abs(selectedDriver.balance || 0))} 
                        {(selectedDriver.balance || 0) > 0 ? ' (Size borçlu)' : 
                         (selectedDriver.balance || 0) < 0 ? ' (Sizden alacaklı)' : ' (Dengeli)'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {paymentData.type === 'payment' ? 'Ödeme' : 'Tahsilat'} Tutarı (€) *
                    </label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <input
                      type="text"
                      value={paymentData.note}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="İsteğe bağlı açıklama"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedDriver(null);
                      setPaymentData({ type: 'payment', amount: '', note: '' });
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handlePaymentOperation}
                    disabled={!paymentData.amount || parseFloat(paymentData.amount) <= 0}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      paymentData.type === 'payment' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {paymentData.type === 'payment' ? '💳 Ödeme Yap' : '💰 Tahsilat Yap'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Şoför Detay Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    👤 {selectedDriver.displayName} - Detaylı Rapor
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Özet Kartları */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Toplam Kazanç</p>
                      <p className="text-xl font-bold text-green-800">
                        {formatCurrency(selectedDriver.financialSummary?.totalEarnings || 0)}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Tamamlanan Sefer</p>
                      <p className="text-xl font-bold text-blue-800">
                        {selectedDriver.performanceStats?.totalTrips || 0}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Ortalama Sefer Kazancı</p>
                      <p className="text-xl font-bold text-purple-800">
                        {formatCurrency(selectedDriver.performanceStats?.avgEarningPerTrip || 0)}
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Mevcut Bakiye</p>
                      <p className={`text-xl font-bold ${
                        (selectedDriver.balance || 0) >= 0 
                          ? 'text-orange-800' 
                          : 'text-red-600'
                      }`}>
                        {formatCurrency(Math.abs(selectedDriver.balance || 0))}
                        <span className="text-sm font-normal ml-1">
                          {(selectedDriver.balance || 0) > 0 ? '(Borçlu)' : 
                           (selectedDriver.balance || 0) < 0 ? '(Alacaklı)' : '(Dengeli)'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Performans İstatistikleri */}
                  {selectedDriver.performanceStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">📊 Performans Analizi</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">
                            {selectedDriver.performanceStats.cashTrips}
                          </p>
                          <p className="text-sm text-gray-600">Nakit Sefer</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">
                            {selectedDriver.performanceStats.cardTrips}
                          </p>
                          <p className="text-sm text-gray-600">Kart/Havale Sefer</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">
                            {formatCurrency(selectedDriver.performanceStats.totalCashCommission)}
                          </p>
                          <p className="text-sm text-gray-600">Nakit Komisyon</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">
                            {formatCurrency(selectedDriver.performanceStats.totalCardEarnings)}
                          </p>
                          <p className="text-sm text-gray-600">Kart Kazanç</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Son Rezervasyonlar */}
                  {selectedDriver.recentReservations && selectedDriver.recentReservations.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-4">🚗 Son Seferler</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedDriver.recentReservations.map((reservation, index) => (
                          <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {reservation.reservationNumber || reservation.reservationId}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {reservation.tripDetails?.pickupLocation || 'Başlangıç'} → {reservation.tripDetails?.dropoffLocation || 'Varış'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reservation.completedAt ? 
                                    new Date(reservation.completedAt.seconds * 1000).toLocaleString('tr-TR') :
                                    'Tarih bilinmiyor'
                                  }
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  {formatCurrency(reservation.totalPrice || 0)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reservation.paymentMethod === 'cash' ? '💰 Nakit' : '💳 Kart'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Son İşlemler */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">💼 Son Finansal İşlemler</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedDriver.transactions?.slice(0, 10).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">
                              {transaction.type === 'earning' ? '💰 Rezervasyon Kazancı' : 
                               transaction.type === 'commission_debt' ? '💸 Komisyon Borcu' :
                               transaction.type === 'payment' ? '💳 Ödeme Aldınız' : 
                               transaction.type === 'collection' ? '📥 Tahsilat Yaptınız' : 
                               '� Diğer İşlem'}
                            </p>
                            <p className="text-sm text-gray-600">{transaction.note}</p>
                            {transaction.reservationId && (
                              <p className="text-xs text-blue-600">#{transaction.reservationId}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date.seconds ? transaction.date.seconds * 1000 : transaction.date).toLocaleString('tr-TR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              transaction.type === 'earning' || transaction.type === 'collection' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {transaction.type === 'earning' || transaction.type === 'collection' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Bakiye: {formatCurrency(Math.abs(transaction.balanceAfter || 0))}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">Henüz işlem kaydı bulunmuyor</p>
                      )}
                    </div>
                  </div>

                  {selectedDriver.financialSummary && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-blue-800 mb-2">💡 Özet Bilgiler</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Toplam {selectedDriver.performanceStats?.totalTrips || 0} sefer tamamlandı</p>
                        <p>• Son işlem: {selectedDriver.performanceStats?.lastActivityDate ? 
                            new Date(selectedDriver.performanceStats.lastActivityDate.seconds * 1000).toLocaleDateString('tr-TR') :
                            'Henüz işlem yok'
                          }</p>
                        <p>• Şoför tipi: {selectedDriver.type === 'regular' ? 'Sisteme Kayıtlı' : 'Manuel'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverPaymentManagement_IMPROVED;
