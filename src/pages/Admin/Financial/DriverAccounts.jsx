import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverAccounts = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentType, setPaymentType] = useState('payment'); // 'payment' or 'collection'

  useEffect(() => {
    fetchDriverAccounts();
  }, []);

  const fetchDriverAccounts = async () => {
    try {
      setLoading(true);

      // Şoförleri getir
      const driversQuery = query(collection(db, 'users'), where('role', '==', 'driver'));
      const driversSnapshot = await getDocs(driversQuery);
      
      console.log('👥 Bulunan şoför sayısı:', driversSnapshot.docs.length);
      
      const driversData = [];
      let totalPositive = 0; // Şoförlere ödeyeceğimiz toplam
      let totalNegative = 0; // Şoförlerden alacağımız toplam

      driversSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const balance = data.balance || 0;
        
        console.log('💰 Şoför finansal durumu:', {
          name: `${data.firstName} ${data.lastName}`,
          balance: balance,
          totalEarnings: data.totalEarnings,
          completedTrips: data.completedTrips
        });
        
        if (balance > 0) {
          totalPositive += balance; // Şofore ödeyeceğimiz
        } else if (balance < 0) {
          totalNegative += Math.abs(balance); // Şoförden alacağımız
        }

        driversData.push({
          id: doc.id,
          ...data,
          balance: balance,
          totalEarnings: data.totalEarnings || 0,
          totalCommission: data.totalCommission || 0,
          completedTrips: data.completedTrips || 0,
          lastTransactionDate: data.lastTransactionDate?.toDate ? data.lastTransactionDate.toDate() : null,
          transactions: data.transactions || []
        });
      });

      // İsme göre sırala
      driversData.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
      
      setDrivers(driversData);
      setTotalDebt(totalPositive);
      setTotalCredit(totalNegative);
      
      console.log('📊 Şoför finansal özet:', {
        totalDrivers: driversData.length,
        totalDebt: totalPositive,
        totalCredit: totalNegative
      });
      
    } catch (error) {
      console.error('Şoför cari hesapları alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getBalanceStatus = (balance) => {
    if (balance > 0) {
      return {
        text: 'Ödeyeceğiniz',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle
      };
    } else if (balance < 0) {
      return {
        text: 'Alacağınız',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle
      };
    } else {
      return {
        text: 'Hesap Kapalı',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: CheckCircle
      };
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Arama */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Şoför Cari Hesapları</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Şoför ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Toplam Borcunuz</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalDebt)}
              </p>
              <p className="text-xs text-red-500">Şoförlere ödeyeceğiniz</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Toplam Alacağınız</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalCredit)}
              </p>
              <p className="text-xs text-green-500">Şoförlerden alacağınız</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Net Durum</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(totalCredit - totalDebt)}
              </p>
              <p className="text-xs text-blue-500">
                {totalCredit > totalDebt ? 'Lehinizdeki fark' : 'Aleyinizdeki fark'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Şoför Listesi */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Şoför Cari Hesap Detayları
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Pozitif bakiye = Şofore ödeyeceğiniz, Negatif bakiye = Şoförden alacağınız
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şoför
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komisyon Oranı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamamlanan Sefer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Kazanç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Komisyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cari Bakiye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son İşlem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => {
                const status = getBalanceStatus(driver.balance);
                const StatusIcon = status.icon;
                
                return (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {driver.firstName?.charAt(0)}{driver.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      %{driver.commission || 15}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.completedTrips}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(driver.totalEarnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(driver.totalCommission)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={driver.balance >= 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(Math.abs(driver.balance))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.borderColor} ${status.color} border`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.lastTransactionDate ? 
                        driver.lastTransactionDate.toLocaleDateString('tr-TR') : 
                        '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        {driver.balance > 0 && (
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setPaymentType('payment');
                              setPaymentAmount(driver.balance.toString());
                              setShowPaymentModal(true);
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-green-300 text-xs font-medium rounded bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            <Minus className="h-3 w-3 mr-1" />
                            Ödeme Yap
                          </button>
                        )}
                        {driver.balance < 0 && (
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setPaymentType('collection');
                              setPaymentAmount(Math.abs(driver.balance).toString());
                              setShowPaymentModal(true);
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-blue-300 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Tahsil Et
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDrivers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'Arama kriterlerine uygun şoför bulunamadı.' : 'Henüz şoför kaydı bulunamadı.'}
          </div>
        )}
      </div>

      {/* Açıklama */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Cari Hesap Açıklaması</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Pozitif Bakiye (Kırmızı):</strong> Şofore ödemeniz gereken tutar (kart ödemeli rezervasyonlardan kazandığı para)</li>
                <li><strong>Negatif Bakiye (Yeşil):</strong> Şoförden almanız gereken tutar (nakit ödemeli rezervasyonlarda komisyon borcu)</li>
                <li><strong>Sıfır Bakiye:</strong> Hesap kapalı, borç/alacak yok</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Ödeme/Tahsilat Modal */}
      {showPaymentModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {paymentType === 'payment' ? 'Şoföre Ödeme Yap' : 'Şoförden Tahsilat Yap'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Şoför:</span> {selectedDriver.firstName} {selectedDriver.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mevcut Bakiye:</span> 
                <span className={selectedDriver.balance >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {' '}{formatCurrency(selectedDriver.balance)}
                </span>
                <span className="text-gray-500 ml-1">
                  ({selectedDriver.balance >= 0 ? 'Ödenecek' : 'Tahsil Edilecek'})
                </span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İşlem Tutarı (EUR)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <input
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="İşlem açıklaması"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedDriver(null);
                  setPaymentAmount('');
                  setPaymentNote('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handlePaymentOperation}
                className={`px-4 py-2 rounded-md text-white ${
                  paymentType === 'payment' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {paymentType === 'payment' ? 'Ödeme Yap' : 'Tahsilat Yap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Ödeme/Tahsilat işlemi
  async function handlePaymentOperation() {
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

      // Şoför belgesini güncelle
      await updateDoc(doc(db, 'users', selectedDriver.id), {
        balance: newBalance,
        transactions: updatedTransactions,
        lastTransactionDate: new Date()
      });

      // Gelir-Gider yönetimi için doğru finansal işlem kaydı oluştur
      if (paymentType === 'collection') {
        // Şoförden tahsilat yapıldıysa gelir kaydı
        await addDoc(collection(db, 'financial_transactions'), {
          type: 'credit', // Gelir
          amount: amount,
          description: `Şoförden Tahsilat - ${selectedDriver.firstName} ${selectedDriver.lastName}`,
          category: 'Şoförden Tahsilat',
          driverId: selectedDriver.id,
          driverType: 'regular',
          driverName: `${selectedDriver.firstName} ${selectedDriver.lastName}`,
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
            'regular',
            `${selectedDriver.firstName} ${selectedDriver.lastName}`,
            amount,
            transactionNote
          );
        } else {
          // Şoförden tahsilat yapıldıysa şirket geliri olarak kaydet
          await companyAccountUtils.recordDriverCollection(
            selectedDriver.id,
            'regular',
            `${selectedDriver.firstName} ${selectedDriver.lastName}`,
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
      setDrivers(prev => 
        prev.map(driver => 
          driver.id === selectedDriver.id 
            ? { ...driver, balance: newBalance, transactions: updatedTransactions, lastTransactionDate: new Date() }
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
  }
};

export default DriverAccounts;
