import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  Eye,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  X
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import toast from 'react-hot-toast';

const DriverAccounts = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('payment'); // payment veya debt
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionNote, setTransactionNote] = useState('');

  useEffect(() => {
    fetchDrivers();
    
    // Real-time listener for reservations (finansal entegrasyon için)
    const unsubscribe = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      // Rezervasyon durumu değişikliklerini dinle
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const reservation = change.doc.data();
          // Eğer rezervasyon tamamlandı ve daha önce işlenmemişse
          if (reservation.status === 'completed' && !reservation.financialProcessed) {
            // Şoförün cari hesabını yeniden hesapla
            setTimeout(() => fetchDrivers(), 1000); // 1 saniye sonra güncelle
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      
      // Şoförleri users koleksiyonundan getir (role = driver)
      const driversQuery = query(
        collection(db, 'users'),
        where('role', '==', 'driver')
      );
      const driversSnapshot = await getDocs(driversQuery);
      
      const driversData = await Promise.all(
        driversSnapshot.docs.map(async (driverDoc) => {
          const driverData = { id: driverDoc.id, ...driverDoc.data() };
          
          // Bu şofore ait tüm tamamlanan rezervasyonları getir
          const reservationsQuery = query(
            collection(db, 'reservations'),
            where('assignedDriver', '==', driverData.id),
            where('status', '==', 'completed')
          );
          const reservationsSnapshot = await getDocs(reservationsQuery);
          const reservations = reservationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Şoförün komisyon hesapları
          let totalEarnings = 0;
          let totalCommission = 0;
          let cashToCollect = 0; // Nakit ödemeli işlerden topladığı para
          let cashCommissionOwed = 0; // Nakit komisyon borcu
          let cardEarnings = 0; // Kart ödemeli işlerden kazanç

          reservations.forEach(reservation => {
            const tripPrice = reservation.totalPrice || 0;
            const commissionRate = driverData.commissionRate || driverData.commission || 15; // Komisyon oranı
            const commission = (tripPrice * commissionRate) / 100;
            const driverEarning = tripPrice - commission;
            
            totalEarnings += driverEarning;
            totalCommission += commission;

            if (reservation.paymentMethod === 'cash') {
              // Nakit ödeme: Şoför müşteriden parayı aldı, komisyon borcu var
              cashToCollect += tripPrice;
              cashCommissionOwed += commission;
            } else if (reservation.paymentMethod === 'card' || reservation.paymentMethod === 'credit_card') {
              // Kart ödeme: Firma müşteriden parayı aldı, şofore ödeme yapacak
              cardEarnings += driverEarning;
            }
          });

          // Cari hesap durumu (Firebase'den gelen güncel bakiye)
          const currentBalance = driverData.balance || 0;
          const transactions = driverData.transactions || [];

          return {
            ...driverData,
            totalEarnings,
            totalCommission,
            cashToCollect,
            cashCommissionOwed,
            cardEarnings,
            currentBalance,
            tripCount: reservations.length,
            transactions: transactions,
            // İstatistik alanları
            completedTrips: driverData.completedTrips || reservations.length,
            commissionRate: driverData.commissionRate || driverData.commission || 15
          };
        })
      );

      setDrivers(driversData);
    } catch (error) {
      console.error('Şoför cari verilerini getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = (driver.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (driver.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (driver.phone || '').includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'positive') return matchesSearch && driver.currentBalance >= 0;
    if (filterStatus === 'negative') return matchesSearch && driver.currentBalance < 0;
    return matchesSearch;
  });

  const handleTransaction = async () => {
    if (!selectedDriver || !transactionAmount || !transactionNote) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const amount = parseFloat(transactionAmount);
      const newBalance = transactionType === 'payment' 
        ? selectedDriver.currentBalance + amount
        : selectedDriver.currentBalance - amount;

      const transaction = {
        id: Date.now().toString(),
        type: transactionType,
        amount: amount,
        note: transactionNote,
        date: new Date(),
        balanceBefore: selectedDriver.currentBalance,
        balanceAfter: newBalance
      };

      const updatedTransactions = [...(selectedDriver.transactions || []), transaction];

      // Firebase'i güncelle - users koleksiyonunu kullan
      await updateDoc(doc(db, 'users', selectedDriver.id), {
        balance: newBalance,
        transactions: updatedTransactions,
        lastTransactionDate: new Date()
      });

      // State'i güncelle
      setDrivers(prev => prev.map(driver => 
        driver.id === selectedDriver.id 
          ? { ...driver, currentBalance: newBalance, transactions: updatedTransactions }
          : driver
      ));

      setSelectedDriver(prev => ({
        ...prev,
        currentBalance: newBalance,
        transactions: updatedTransactions
      }));

      // Modal'ı kapat
      setShowTransactionModal(false);
      setTransactionAmount('');
      setTransactionNote('');
      
      toast.success('İşlem başarıyla kaydedildi');
    } catch (error) {
      console.error('İşlem kaydetme hatası:', error);
      toast.error('İşlem kaydedilirken hata oluştu');
    }
  };

  const DriverCard = ({ driver }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg p-6 shadow-sm border cursor-pointer transition-shadow hover:shadow-md ${
        driver.currentBalance >= 0 ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
      }`}
      onClick={() => setSelectedDriver(driver)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">
              {driver.firstName} {driver.lastName}
            </h4>
            <p className="text-sm text-gray-500">{driver.phone}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-medium ${
          driver.currentBalance >= 0 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {driver.currentBalance >= 0 ? 'Alacaklı' : 'Borçlu'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Cari Bakiye</p>
          <p className={`text-lg font-bold ${
            driver.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            €{Math.abs(driver.currentBalance).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Toplam Yolculuk</p>
          <p className="text-lg font-bold text-gray-800">{driver.tripCount}</p>
        </div>
      </div>

      {driver.cashCommissionOwed > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-800">
              Nakit Komisyon Borcu: €{driver.cashCommissionOwed.toLocaleString()}
            </span>
          </div>
        </div>
      )}
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
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Şoför Cari Hesapları</h1>
          <p className="text-gray-600 mt-1">Şoförlerin finansal durumlarını yönetin</p>
        </div>
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
          <div className="text-sm text-gray-600">Toplam Şoför</div>
          <div className="text-xl font-bold text-gray-800">{drivers.length}</div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Şoför ara (isim, telefon)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Şoförler</option>
              <option value="positive">Alacaklılar</option>
              <option value="negative">Borçlular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Şoför Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>

      {/* Şoför Detay Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedDriver.firstName} {selectedDriver.lastName} - Cari Hesap
              </h3>
              <button
                onClick={() => setSelectedDriver(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Özet Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Cari Bakiye</p>
                  <p className={`text-2xl font-bold ${
                    selectedDriver.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    €{Math.abs(selectedDriver.currentBalance).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Toplam Kazanç</p>
                  <p className="text-2xl font-bold text-green-600">
                    €{selectedDriver.totalEarnings.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Toplam Komisyon</p>
                  <p className="text-2xl font-bold text-purple-600">
                    €{selectedDriver.totalCommission.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Nakit Borç</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    €{selectedDriver.cashCommissionOwed.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* İşlem Butonları */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setTransactionType('payment');
                    setShowTransactionModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ödeme Yap
                </button>
                
                <button
                  onClick={() => {
                    setTransactionType('debt');
                    setShowTransactionModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  Borç Ekle
                </button>
              </div>

              {/* İşlem Geçmişi */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">İşlem Geçmişi</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedDriver.transactions?.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'payment' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'payment' ? (
                            <Plus className="w-4 h-4 text-green-600" />
                          ) : (
                            <Minus className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.note}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'payment' ? '+' : '-'}€{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Bakiye: €{transaction.balanceAfter.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* İşlem Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {transactionType === 'payment' ? 'Ödeme Yap' : 'Borç Ekle'}
              </h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tutar (€)
                </label>
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={transactionNote}
                  onChange={(e) => setTransactionNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="İşlem açıklaması..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleTransaction}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    transactionType === 'payment' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DriverAccounts;
