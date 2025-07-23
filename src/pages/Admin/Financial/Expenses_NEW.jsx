import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { CreditCard, TrendingDown, Calendar, FileText, Plus, Trash2, Car, Building, Fuel, Settings, X } from 'lucide-react';

const Expenses = () => {
  const [reservations, setReservations] = useState([]);
  const [manualExpenses, setManualExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [totalCommissionExpense, setTotalCommissionExpense] = useState(0);
  const [totalManualExpense, setTotalManualExpense] = useState(0);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('commission'); // 'commission' veya 'manual'
  
  // Yeni gider formu
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'maintenance',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Gider kategorileri
  const expenseCategories = [
    { value: 'maintenance', label: 'Araç Bakım', icon: Car, color: 'blue' },
    { value: 'fuel', label: 'Yakıt', icon: Fuel, color: 'green' },
    { value: 'office', label: 'Ofis Giderleri', icon: Building, color: 'purple' },
    { value: 'other', label: 'Diğer', icon: Settings, color: 'gray' }
  ];

  // Rezervasyonları ve şoför bilgilerini getir
  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    await Promise.all([
      fetchReservations(),
      fetchManualExpenses()
    ]);
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);

      // Tamamlanmış rezervasyonları getir
      const reservationsRef = collection(db, 'reservations');
      const q = query(
        reservationsRef,
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const reservationData = [];
      
      // Sistem şoför bilgilerini al
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const driversMap = {};
      
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        if (userData.role === 'driver') {
          driversMap[doc.id] = userData;
        }
      });

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const driverId = data.assignedDriver || data.assignedDriverId || data.driverId;
        
        if (data.totalPrice) {
          let driverName = 'Bilinmeyen Şoför';
          let driverExpense = 0; // Şoföre ödediğimiz para
          let paymentMethod = data.paymentMethod || 'cash';

          // Manuel şoför kontrolü
          if (driverId === 'manual' && data.manualDriverInfo) {
            driverName = data.manualDriverInfo.name;
            const driverShare = parseFloat(data.manualDriverInfo.price || 0);
            
            // Sadece kredi kartı/havale durumunda gider olarak say
            if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
              driverExpense = driverShare;
            }
          } else if (driverId && driversMap[driverId]) {
            // Sistem şoförü
            const driverData = driversMap[driverId];
            driverName = `${driverData.firstName} ${driverData.lastName}`;
            const commissionRate = driverData.commission || 15;
            const commission = (data.totalPrice * commissionRate) / 100;
            
            // Sadece kredi kartı/havale durumunda gider olarak say
            if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
              driverExpense = commission;
            }
          }

          if (driverExpense > 0) {
            reservationData.push({
              id: doc.id,
              ...data,
              driverName,
              driverExpense,
              isManualDriver: driverId === 'manual',
              paymentMethod
            });
          }
        }
      });

      // Zaman filtresi uygula
      const filteredData = filterByTime(reservationData, timeFilter);
      setReservations(filteredData);
      
      // Toplam komisyon giderini hesapla
      const total = filteredData.reduce((sum, res) => sum + res.driverExpense, 0);
      setTotalCommissionExpense(total);
      
    } catch (error) {
      console.error('Rezervasyon giderleri alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManualExpenses = async () => {
    try {
      const expensesRef = collection(db, 'manual_expenses');
      const q = query(expensesRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const expenseData = [];
      snapshot.docs.forEach(doc => {
        expenseData.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
        });
      });

      // Zaman filtresi uygula
      const filteredExpenses = filterByTime(expenseData, timeFilter);
      setManualExpenses(filteredExpenses);
      
      // Toplam manuel gideri hesapla
      const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalManualExpense(total);
      
    } catch (error) {
      console.error('Manuel giderler alınırken hata:', error);
    }
  };

  const filterByTime = (data, filter) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return data.filter(item => {
      const itemDate = item.completedAt?.toDate ? item.completedAt.toDate() : 
                     item.date instanceof Date ? item.date : 
                     new Date(item.completedAt || item.date);
      
      switch (filter) {
        case 'this_month':
          return itemDate >= startOfMonth;
        case 'last_month':
          return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
        case 'this_year':
          return itemDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const handleAddExpense = async () => {
    try {
      if (!newExpense.title || !newExpense.amount || !newExpense.date) {
        alert('Lütfen tüm gerekli alanları doldurun');
        return;
      }

      await addDoc(collection(db, 'manual_expenses'), {
        title: newExpense.title,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: new Date(newExpense.date),
        createdAt: new Date()
      });

      // Formu sıfırla
      setNewExpense({
        title: '',
        category: 'maintenance',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      setShowAddExpenseModal(false);
      fetchManualExpenses(); // Listeyi yenile
      
    } catch (error) {
      console.error('Gider eklenirken hata:', error);
      alert('Gider eklenirken hata oluştu');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'manual_expenses', expenseId));
        fetchManualExpenses(); // Listeyi yenile
      } catch (error) {
        console.error('Gider silinirken hata:', error);
        alert('Gider silinirken hata oluştu');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryInfo = (category) => {
    return expenseCategories.find(cat => cat.value === category) || expenseCategories[3];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Filtre */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gider Yönetimi</h2>
        <div className="flex items-center gap-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="this_month">Bu Ay</option>
            <option value="last_month">Geçen Ay</option>
            <option value="this_year">Bu Yıl</option>
          </select>
          
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Manuel Gider Ekle
          </button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Şoför Ödemeleri</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalCommissionExpense)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Manuel Giderler</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatCurrency(totalManualExpense)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Toplam Gider</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(totalCommissionExpense + totalManualExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Menüsü */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('commission')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'commission'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Şoför Ödemeleri ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manuel Giderler ({manualExpenses.length})
          </button>
        </nav>
      </div>

      {/* Şoför Ödemeleri Tablosu */}
      {activeTab === 'commission' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Şoför Ödemeleri - {formatCurrency(totalCommissionExpense)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Kredi kartı ve havale ödemelerinde şoförlere yapılan komisyon ödemeleri
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şoför
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Yöntemi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Ücret
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şoföre Ödenen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.completedAt?.toDate ? 
                        reservation.completedAt.toDate().toLocaleDateString('tr-TR') :
                        new Date(reservation.completedAt).toLocaleDateString('tr-TR')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{reservation.driverName}</span>
                        {reservation.isManualDriver && (
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block w-fit mt-1">
                            Manuel Şoför
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reservation.paymentMethod === 'card' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {reservation.paymentMethod === 'card' ? 'Kredi Kartı' : 'Banka Havalesi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(reservation.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      -{formatCurrency(reservation.driverExpense)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reservations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Seçilen dönemde şoför ödemesi bulunamadı.
            </div>
          )}
        </div>
      )}

      {/* Manuel Giderler Tablosu */}
      {activeTab === 'manual' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Manuel Giderler - {formatCurrency(totalManualExpense)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Araç bakım, yakıt, ofis giderleri ve diğer işletme giderleri
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {manualExpenses.map((expense) => {
                  const categoryInfo = getCategoryInfo(expense.category);
                  const CategoryIcon = categoryInfo.icon;
                  
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.date.toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className={`w-4 h-4 text-${categoryInfo.color}-600`} />
                          <span>{categoryInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {expense.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {manualExpenses.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Seçilen dönemde manuel gider bulunamadı.
            </div>
          )}
        </div>
      )}

      {/* Manuel Gider Ekleme Modalı */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Yeni Gider Ekle</h3>
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {expenseCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Örn: Araç lastik değişimi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tutar (€) *
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih *
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Gider hakkında detaylı bilgi..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Gider Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
