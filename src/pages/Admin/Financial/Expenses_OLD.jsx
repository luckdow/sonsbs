import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Minus,
  CreditCard,
  Car,
  Building,
  Users,
  Zap,
  Smartphone,
  Edit,
  Trash2,
  Calendar,
  Filter,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const Expenses = () => {
  const { state } = useApp();
  const { reservations, drivers } = state;
  const [expenseData, setExpenseData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newExpense, setNewExpense] = useState({
    category: 'operational',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    vendor: '',
    notes: ''
  });

  const expenseCategories = [
    { id: 'driver_payments', label: 'Şoför Ödemeleri', icon: Users, color: 'orange' },
    { id: 'fuel', label: 'Yakıt', icon: Car, color: 'red' },
    { id: 'maintenance', label: 'Araç Bakım', icon: Car, color: 'yellow' },
    { id: 'rent', label: 'Ofis Kirası', icon: Building, color: 'purple' },
    { id: 'salary', label: 'Maaşlar', icon: Users, color: 'blue' },
    { id: 'marketing', label: 'Pazarlama', icon: Smartphone, color: 'green' },
    { id: 'software', label: 'Yazılım', icon: Zap, color: 'indigo' },
    { id: 'operational', label: 'Operasyonel', icon: Building, color: 'gray' },
    { id: 'other', label: 'Diğer', icon: AlertTriangle, color: 'pink' }
  ];

  useEffect(() => {
    calculateExpenseData();
  }, [reservations, drivers, selectedPeriod, selectedCategory]);

  const calculateExpenseData = () => {
    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'thisWeek':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Şoför ödemelerini hesapla (rezervasyonlardan)
    const completedReservations = reservations.filter(res => 
      new Date(res.createdAt) >= startDate && res.status === 'completed'
    );

    const driverPayments = completedReservations.map(reservation => {
      const driver = drivers.find(d => d.id === reservation.driverId);
      const totalPrice = reservation.totalPrice || 0;
      let driverPayment = 0;

      if (reservation.externalDriver) {
        // Manuel şoför
        driverPayment = reservation.externalDriver.agreedAmount || 0;
      } else if (driver) {
        // Komisyonlu şoför
        const commissionRate = driver.commission || 30;
        driverPayment = totalPrice * (1 - (commissionRate / 100));
      }

      return {
        id: `driver_${reservation.id}`,
        category: 'driver_payments',
        description: `Şoför ödemesi: ${reservation.fromLocation} → ${reservation.toLocation}`,
        amount: driverPayment,
        date: reservation.createdAt,
        paymentMethod: reservation.paymentMethod,
        driverName: reservation.externalDriver ? 
          reservation.externalDriver.name : 
          driver?.name || 'Bilinmeyen',
        reservationId: reservation.reservationId,
        isAutomatic: true
      };
    });

    // Manuel giderler (normalde localStorage veya API'den gelecek)
    const manualExpenses = JSON.parse(localStorage.getItem('manualExpenses') || '[]')
      .filter(expense => new Date(expense.date) >= startDate);

    // Tüm giderleri birleştir
    let allExpenses = [...driverPayments, ...manualExpenses];

    // Kategori filtresi uygula
    if (selectedCategory !== 'all') {
      allExpenses = allExpenses.filter(expense => expense.category === selectedCategory);
    }

    setExpenseData(allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleAddExpense = () => {
    const expense = {
      id: Date.now().toString(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      createdAt: new Date().toISOString(),
      isAutomatic: false
    };

    // Manuel giderleri localStorage'a kaydet (normalde API'ye gönderilecek)
    const existingExpenses = JSON.parse(localStorage.getItem('manualExpenses') || '[]');
    const updatedExpenses = [expense, ...existingExpenses];
    localStorage.setItem('manualExpenses', JSON.stringify(updatedExpenses));

    calculateExpenseData();
    setShowAddModal(false);
    setNewExpense({
      category: 'operational',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      vendor: '',
      notes: ''
    });
  };

  const deleteExpense = (expenseId) => {
    const existingExpenses = JSON.parse(localStorage.getItem('manualExpenses') || '[]');
    const updatedExpenses = existingExpenses.filter(expense => expense.id !== expenseId);
    localStorage.setItem('manualExpenses', JSON.stringify(updatedExpenses));
    calculateExpenseData();
  };

  const getTotalStats = () => {
    const categoryTotals = {};
    let totalExpenses = 0;

    expenseData.forEach(expense => {
      totalExpenses += expense.amount;
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return {
      totalExpenses,
      categoryTotals,
      driverPayments: categoryTotals.driver_payments || 0,
      operationalExpenses: totalExpenses - (categoryTotals.driver_payments || 0),
      expenseCount: expenseData.length
    };
  };

  const getCategoryIcon = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : AlertTriangle;
  };

  const getCategoryLabel = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.label : 'Bilinmeyen';
  };

  const getCategoryColor = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.color : 'gray';
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Giderler</h2>
          <p className="text-gray-600">Şoför ödemeleri ve operasyonel gider takibi</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Bugün</option>
            <option value="thisWeek">Bu Hafta</option>
            <option value="thisMonth">Bu Ay</option>
            <option value="lastMonth">Geçen Ay</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Kategoriler</option>
            {expenseCategories.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Gider Ekle
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gider</p>
              <p className="text-2xl font-semibold text-red-600">€{stats.totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Şoför Ödemeleri</p>
              <p className="text-2xl font-semibold text-orange-600">€{stats.driverPayments.toFixed(2)}</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operasyonel</p>
              <p className="text-2xl font-semibold text-purple-600">€{stats.operationalExpenses.toFixed(2)}</p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gider Kalemi</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.expenseCount}</p>
            </div>
            <Filter className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Bazında Giderler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {expenseCategories.map(category => {
            const amount = stats.categoryTotals[category.id] || 0;
            const Icon = category.icon;
            
            return (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${category.color}-100`}>
                    <Icon className={`w-4 h-4 text-${category.color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.label}</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  €{amount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gider Listesi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme Yöntemi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenseData.map((expense) => {
                const Icon = getCategoryIcon(expense.category);
                const categoryColor = getCategoryColor(expense.category);
                
                return (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center bg-${categoryColor}-100`}>
                          <Icon className={`w-3 h-3 text-${categoryColor}-600`} />
                        </div>
                        <span className="text-sm text-gray-900">
                          {getCategoryLabel(expense.category)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </div>
                        {expense.reservationId && (
                          <div className="text-xs text-gray-500">
                            {expense.reservationId} - {expense.driverName}
                          </div>
                        )}
                        {expense.vendor && (
                          <div className="text-xs text-gray-500">
                            Tedarikçi: {expense.vendor}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      €{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {expense.paymentMethod === 'cash' ? (
                          <>
                            <Minus className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Nakit</span>
                          </>
                        ) : expense.paymentMethod === 'card' ? (
                          <>
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Kart</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {expense.isAutomatic ? 'Otomatik' : 'Manuel'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {expense.isAutomatic ? (
                        <span className="text-gray-400 text-xs">Otomatik</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Gider Ekle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {expenseCategories.filter(cat => cat.id !== 'driver_payments').map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Gider açıklaması"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (€)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Nakit</option>
                  <option value="card">Kredi Kartı</option>
                  <option value="transfer">Havale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi/Firma</label>
                <input
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tedarikçi adı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                <textarea
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Ek notlar..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ekle
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="text-sm text-red-800">
            <h4 className="font-medium mb-1">Gider Takip Sistemi</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Şoför Ödemeleri:</strong> Rezervasyon tamamlandığında otomatik hesaplanır</li>
              <li><strong>Manuel Giderler:</strong> Operasyonel giderler için kullanılır</li>
              <li><strong>Kategori Bazında:</strong> Giderler kategorilere ayrılarak takip edilir</li>
              <li>Giderler kar/zarar hesaplamalarına otomatik yansır</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
