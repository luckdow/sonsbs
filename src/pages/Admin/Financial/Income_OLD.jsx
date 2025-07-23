import React, { useState, useEffect } from 'react';
import { 
  Plus,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Filter,
  Search,
  FileText,
  CreditCard,
  Banknote,
  Building
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const Income = () => {
  const { state } = useApp();
  const { reservations, drivers } = state;
  const [incomeData, setIncomeData] = useState([]);
  const [manualIncomes, setManualIncomes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedType, setSelectedType] = useState('all');
  const [newIncome, setNewIncome] = useState({
    type: 'reservation',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'main',
    relatedReservation: '',
    notes: ''
  });

  useEffect(() => {
    calculateIncomeData();
  }, [reservations, drivers, selectedPeriod, selectedType]);

  const calculateIncomeData = () => {
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

    // Rezervasyon gelirlerini hesapla
    const filteredReservations = reservations.filter(res => 
      new Date(res.createdAt) >= startDate && res.status === 'completed'
    );

    const reservationIncomes = filteredReservations.map(reservation => {
      const driver = drivers.find(d => d.id === reservation.driverId);
      const totalPrice = reservation.totalPrice || 0;
      let companyIncome = 0;

      if (reservation.externalDriver) {
        // Manuel şoför
        companyIncome = totalPrice - (reservation.externalDriver.agreedAmount || 0);
      } else if (driver) {
        // Komisyonlu şoför
        const commissionRate = driver.commission || 30;
        companyIncome = totalPrice * (commissionRate / 100);
      } else {
        companyIncome = totalPrice;
      }

      return {
        id: reservation.id,
        type: 'reservation',
        description: `Rezervasyon: ${reservation.fromLocation} → ${reservation.toLocation}`,
        amount: companyIncome,
        date: reservation.createdAt,
        category: 'main',
        reservationId: reservation.reservationId,
        paymentMethod: reservation.paymentMethod,
        driverName: reservation.externalDriver ? 
          reservation.externalDriver.name : 
          driver?.name || 'Bilinmeyen',
        isExternal: !!reservation.externalDriver
      };
    });

    // Tip filtresi uygula
    let filteredIncomes = reservationIncomes;
    if (selectedType !== 'all') {
      filteredIncomes = reservationIncomes.filter(income => income.type === selectedType);
    }

    setIncomeData(filteredIncomes);
  };

  const handleAddIncome = () => {
    const income = {
      id: Date.now().toString(),
      ...newIncome,
      amount: parseFloat(newIncome.amount),
      createdAt: new Date().toISOString()
    };

    setManualIncomes(prev => [income, ...prev]);
    setShowAddModal(false);
    setNewIncome({
      type: 'other',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'main',
      relatedReservation: '',
      notes: ''
    });
  };

  const getTotalStats = () => {
    const reservationTotal = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const manualTotal = manualIncomes.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = reservationTotal + manualTotal;

    return {
      totalIncome,
      reservationIncome: reservationTotal,
      manualIncome: manualTotal,
      averageReservationIncome: incomeData.length > 0 ? reservationTotal / incomeData.length : 0,
      incomeCount: incomeData.length + manualIncomes.length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Gelirler</h2>
          <p className="text-gray-600">Rezervasyon ve diğer gelir kaynaklarının takibi</p>
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Gelirler</option>
            <option value="reservation">Rezervasyon</option>
            <option value="other">Diğer</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Gelir Ekle
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-semibold text-green-600">€{stats.totalIncome.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rezervasyon Geliri</p>
              <p className="text-2xl font-semibold text-blue-600">€{stats.reservationIncome.toFixed(2)}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Diğer Gelirler</p>
              <p className="text-2xl font-semibold text-purple-600">€{stats.manualIncome.toFixed(2)}</p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ortalama Rezervasyon</p>
              <p className="text-2xl font-semibold text-orange-600">€{stats.averageReservationIncome.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gelir Listesi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
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
              {/* Rezervasyon Gelirleri */}
              {incomeData.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(income.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {income.description}
                      </div>
                      {income.reservationId && (
                        <div className="text-xs text-gray-500">
                          {income.reservationId} - {income.driverName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Calendar className="w-3 h-3 mr-1" />
                      Rezervasyon
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    €{income.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {income.paymentMethod === 'cash' ? (
                        <>
                          <Banknote className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Nakit</span>
                        </>
                      ) : income.paymentMethod === 'card' ? (
                        <>
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Kart</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Bilinmeyen</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Manuel Gelirler */}
              {manualIncomes.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(income.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {income.description}
                    </div>
                    {income.notes && (
                      <div className="text-xs text-gray-500">{income.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Building className="w-3 h-3 mr-1" />
                      Diğer
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    €{income.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Manuel
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Gelir Ekle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={newIncome.description}
                  onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Gelir açıklaması"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (€)</label>
                <input
                  type="number"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input
                  type="date"
                  value={newIncome.date}
                  onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={newIncome.category}
                  onChange={(e) => setNewIncome({...newIncome, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="main">Ana Gelir</option>
                  <option value="advertising">Reklam</option>
                  <option value="rent">Kira</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                <textarea
                  value={newIncome.notes}
                  onChange={(e) => setNewIncome({...newIncome, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Ek notlar..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddIncome}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <h4 className="font-medium mb-1">Gelir Takip Sistemi</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Rezervasyon Gelirleri:</strong> Otomatik olarak hesaplanır ve eklenir</li>
              <li><strong>Manuel Gelirler:</strong> Rezervasyon dışı gelirler için kullanılır</li>
              <li><strong>Komisyon Hesaplama:</strong> Şoför tipine göre otomatik hesaplanır</li>
              <li>Gelirler cari hesaplara otomatik yansır</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
