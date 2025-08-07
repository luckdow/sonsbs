import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Phone, 
  Car, 
  Euro, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import toast from 'react-hot-toast';

const ManualDriverAccounts = () => {
  const [manualDrivers, setManualDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentType, setPaymentType] = useState('payment'); // 'payment' or 'collection'

  // Manuel şoförleri getir
  const fetchManualDrivers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'manual_drivers'), orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const drivers = [];
      querySnapshot.forEach((doc) => {
        drivers.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setManualDrivers(drivers);
    } catch (error) {
      console.error('Manuel şoförler getirilemedi:', error);
      toast.error('Manuel şoförler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManualDrivers();
  }, []);

  // Arama filtresi
  const filteredDrivers = manualDrivers.filter(driver =>
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.includes(searchTerm) ||
    driver.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ödeme/Tahsilat işlemi
  const handlePaymentOperation = async () => {
    if (!selectedDriver || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Lütfen geçerli bir tutar girin');
      return;
    }

    try {
      const amount = parseFloat(paymentAmount);
      const currentBalance = selectedDriver.balance || 0;
      
      let newBalance, transactionNote, transactionType;
      
      if (paymentType === 'payment') {
        // Şofore ödeme yapıyoruz (pozitif bakiyeyi sıfırlıyoruz)
        newBalance = currentBalance - amount;
        transactionNote = `Manuel ödeme - ${paymentNote || 'Ödeme yapıldı'}`;
        transactionType = 'payment';
      } else {
        // Şoförden tahsilat yapıyoruz (negatif bakiyeyi sıfırlıyoruz)
        newBalance = currentBalance + amount;
        transactionNote = `Manuel tahsilat - ${paymentNote || 'Tahsilat yapıldı'}`;
        transactionType = 'collection';
      }

      // İşlem kaydı
      const transaction = {
        id: Date.now().toString(),
        type: transactionType,
        amount: amount,
        note: transactionNote,
        date: new Date(),
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        processedBy: 'admin_manual'
      };

      const currentTransactions = selectedDriver.transactions || [];
      const updatedTransactions = [...currentTransactions, transaction];

      // Manuel şoför belgesini güncelle
      await updateDoc(doc(db, 'manual_drivers', selectedDriver.id), {
        balance: newBalance,
        transactions: updatedTransactions,
        lastTransactionDate: new Date(),
        updatedAt: new Date()
      });

      // Gelir-Gider yönetimi için doğru finansal işlem kaydı oluştur
      if (paymentType === 'collection') {
        // Şoförden tahsilat yapıldıysa gelir kaydı
        await addDoc(collection(db, 'financial_transactions'), {
          type: 'credit', // Gelir
          amount: amount,
          description: `Şoförden Tahsilat - ${selectedDriver.name}`,
          category: 'Şoförden Tahsilat',
          driverId: selectedDriver.id,
          driverType: 'manual',
          driverName: selectedDriver.name,
          driverPhone: selectedDriver.phone,
          createdAt: new Date(),
          processedBy: 'admin_manual',
          date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        });
      }
      // NOT: Şoföre ödeme yapıldığında gider kaydı ayrı bir yerde yapılıyor
      
      // Şirket finansal kaydını güncelle
      try {
        // companyAccountUtils'i import et
        const companyAccountUtils = await import('../../../utils/companyAccountUtils');
        
        if (paymentType === 'payment') {
          // Şoföre ödeme yapıldıysa şirket gideri olarak kaydet
          await companyAccountUtils.recordDriverPayment(
            selectedDriver.id,
            'manual',
            selectedDriver.name,
            amount,
            transactionNote
          );
        } else {
          // Şoförden tahsilat yapıldıysa şirket geliri olarak kaydet
          await companyAccountUtils.recordDriverCollection(
            selectedDriver.id,
            'manual',
            selectedDriver.name,
            amount,
            transactionNote
          );
        }
      } catch (error) {
        console.error('Şirket finansal kaydı oluşturma hatası:', error);
        // Şirket kaydı oluşturulamasa bile şoför kaydı güncellendi, işleme devam et
      }

      toast.success(`${paymentType === 'payment' ? 'Ödeme' : 'Tahsilat'} başarıyla kaydedildi`);
      
      // State'i güncelle
      setManualDrivers(prev => 
        prev.map(driver => 
          driver.id === selectedDriver.id 
            ? { ...driver, balance: newBalance, transactions: updatedTransactions }
            : driver
        )
      );

      // Modal'ı kapat
      setShowPaymentModal(false);
      setPaymentAmount('');
      setPaymentNote('');
      setSelectedDriver(null);

    } catch (error) {
      console.error('Ödeme işlemi hatası:', error);
      toast.error('Ödeme işlemi sırasında hata oluştu');
    }
  };

  // Bakiye durumu renk belirleme
  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600'; // Şofore borçluyuz
    if (balance < 0) return 'text-red-600';   // Şoför bize borçlu
    return 'text-gray-600';                   // Sıfır
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0) return TrendingUp;
    if (balance < 0) return TrendingDown;
    return CheckCircle;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manuel Şoför Cari Hesapları</h2>
          <p className="text-gray-600 mt-1">Dış şoförlerin finansal durumu ve cari hesap yönetimi</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Şoför ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Manuel Şoför</p>
              <p className="text-2xl font-bold text-gray-900">{manualDrivers.length}</p>
            </div>
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Alacağımız</p>
              <p className="text-2xl font-bold text-red-600">
                {manualDrivers
                  .filter(d => d.balance < 0)
                  .reduce((sum, d) => sum + Math.abs(d.balance), 0)
                  .toFixed(2)}€
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Borcumuz</p>
              <p className="text-2xl font-bold text-green-600">
                {manualDrivers
                  .filter(d => d.balance > 0)
                  .reduce((sum, d) => sum + d.balance, 0)
                  .toFixed(2)}€
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Şoför Listesi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Manuel Şoför Listesi</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şoför Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Araç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cari Bakiye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Sefer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son İşlem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Arama kriterine uygun şoför bulunamadı' : 'Henüz manuel şoför kaydı bulunmuyor'}
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const BalanceIcon = getBalanceIcon(driver.balance);
                  return (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                            <p className="text-xs text-gray-500">Manuel Şoför</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {driver.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Car className="w-4 h-4 mr-2 text-gray-400" />
                          {driver.plateNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm font-medium ${getBalanceColor(driver.balance)}`}>
                          <BalanceIcon className="w-4 h-4 mr-2" />
                          {Math.abs(driver.balance || 0).toFixed(2)}€
                          <span className="ml-1 text-xs">
                            {driver.balance > 0 ? '(Alacaklı)' : driver.balance < 0 ? '(Borçlu)' : '(Sıfır)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.completedTrips || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.lastTransactionDate 
                          ? new Date(driver.lastTransactionDate.seconds * 1000).toLocaleDateString('tr-TR')
                          : 'İşlem yok'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {driver.balance > 0 && (
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setPaymentType('payment');
                                setShowPaymentModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-green-200 text-xs font-medium rounded-full text-green-700 bg-green-50 hover:bg-green-100"
                            >
                              <Minus className="w-3 h-3 mr-1" />
                              Ödeme Yap
                            </button>
                          )}
                          {driver.balance < 0 && (
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setPaymentType('collection');
                                setShowPaymentModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-red-200 text-xs font-medium rounded-full text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Tahsilat Yap
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ödeme/Tahsilat Modal */}
      {showPaymentModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {paymentType === 'payment' ? 'Ödeme Yap' : 'Tahsilat Yap'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şoför: {selectedDriver.name}
                  </label>
                  <p className="text-sm text-gray-600">
                    Mevcut Bakiye: <span className={getBalanceColor(selectedDriver.balance)}>
                      {Math.abs(selectedDriver.balance || 0).toFixed(2)}€ 
                      {selectedDriver.balance > 0 ? ' (Alacaklı)' : selectedDriver.balance < 0 ? ' (Borçlu)' : ' (Sıfır)'}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {paymentType === 'payment' ? 'Ödeme' : 'Tahsilat'} Tutarı (€) *
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
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
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="İsteğe bağlı açıklama"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                    setPaymentNote('');
                    setSelectedDriver(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handlePaymentOperation}
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    paymentType === 'payment' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {paymentType === 'payment' ? 'Ödeme Yap' : 'Tahsilat Yap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualDriverAccounts;
