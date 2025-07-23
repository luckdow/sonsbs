import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Calendar, Users, CreditCard, Building, Car, Fuel, Settings } from 'lucide-react';

const FinancialDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('this_month');
  
  // Finansal veriler
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDriverExpenses, setTotalDriverExpenses] = useState(0);
  const [totalManualExpenses, setTotalManualExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  
  // Detaylı veriler
  const [reservationCount, setReservationCount] = useState(0);
  const [cashPayments, setCashPayments] = useState(0);
  const [cardPayments, setCardPayments] = useState(0);
  const [manualExpensesByCategory, setManualExpensesByCategory] = useState({});
  
  useEffect(() => {
    fetchFinancialData();
  }, [timeFilter]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Paralel olarak tüm verileri getir
      const [reservationsData, manualExpensesData] = await Promise.all([
        fetchReservationData(),
        fetchManualExpensesData()
      ]);
      
      // Toplam gelirleri hesapla
      const revenue = reservationsData.reduce((sum, res) => sum + res.ourRevenue, 0);
      setTotalRevenue(revenue);
      
      // Şoför giderlerini hesapla (sadece kredi kartı/havale)
      const driverExpenses = reservationsData.reduce((sum, res) => sum + res.ourExpense, 0);
      setTotalDriverExpenses(driverExpenses);
      
      // Manuel giderler toplamı
      const manualExpenses = manualExpensesData.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalManualExpenses(manualExpenses);
      
      // Net kar
      setNetProfit(revenue - driverExpenses - manualExpenses);
      
      // Rezervasyon sayısı
      setReservationCount(reservationsData.length);
      
      // Ödeme yöntemlerine göre dağılım
      const cash = reservationsData
        .filter(res => res.paymentMethod === 'cash')
        .reduce((sum, res) => sum + res.totalPrice, 0);
      setCashPayments(cash);
      
      const card = reservationsData
        .filter(res => res.paymentMethod === 'card' || res.paymentMethod === 'bank_transfer')
        .reduce((sum, res) => sum + res.totalPrice, 0);
      setCardPayments(card);
      
      // Manuel giderleri kategoriye göre grupla
      const categoryExpenses = {};
      manualExpensesData.forEach(expense => {
        if (!categoryExpenses[expense.category]) {
          categoryExpenses[expense.category] = 0;
        }
        categoryExpenses[expense.category] += expense.amount;
      });
      setManualExpensesByCategory(categoryExpenses);
      
    } catch (error) {
      console.error('Finansal veriler alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationData = async () => {
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
        let driverShare = 0;
        let ourRevenue = data.totalPrice;
        let ourExpense = 0;
        let paymentMethod = data.paymentMethod || 'cash';

        // Manuel şoför kontrolü
        if (driverId === 'manual' && data.manualDriverInfo) {
          driverShare = parseFloat(data.manualDriverInfo.price || 0);
          ourRevenue = data.totalPrice - driverShare;
          
          if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
            ourExpense = driverShare;
          }
        } else if (driverId && driversMap[driverId]) {
          // Sistem şoförü
          const driverData = driversMap[driverId];
          const commissionRate = driverData.commission || 15;
          driverShare = (data.totalPrice * commissionRate) / 100;
          ourRevenue = data.totalPrice - driverShare;
          
          if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
            ourExpense = driverShare;
          }
        }

        reservationData.push({
          id: doc.id,
          ...data,
          driverShare,
          ourRevenue,
          ourExpense,
          paymentMethod,
          completedDate: data.completedAt?.toDate ? data.completedAt.toDate() : new Date(data.completedAt)
        });
      }
    });

    return filterByTime(reservationData, timeFilter);
  };

  const fetchManualExpensesData = async () => {
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

    return filterByTime(expenseData, timeFilter);
  };

  const filterByTime = (data, filter) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return data.filter(item => {
      const itemDate = item.completedAt?.toDate ? item.completedAt.toDate() : 
                     item.completedDate || item.date || new Date();
      
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getExpenseCategoryInfo = (category) => {
    const categories = {
      maintenance: { label: 'Araç Bakım', icon: Car, color: 'blue' },
      fuel: { label: 'Yakıt', icon: Fuel, color: 'green' },
      office: { label: 'Ofis Giderleri', icon: Building, color: 'purple' },
      other: { label: 'Diğer', icon: Settings, color: 'gray' }
    };
    return categories[category] || categories.other;
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'this_month': return 'Bu Ay';
      case 'last_month': return 'Geçen Ay';
      case 'this_year': return 'Bu Yıl';
      default: return 'Bu Ay';
    }
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
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Finansal Dashboard</h2>
          <p className="text-gray-600">Genel mali durum özeti - {getTimeFilterLabel()}</p>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="this_month">Bu Ay</option>
          <option value="last_month">Geçen Ay</option>
          <option value="this_year">Bu Yıl</option>
        </select>
      </div>

      {/* Ana Finansal Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Toplam Gider</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalDriverExpenses + totalManualExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Net Kar</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Rezervasyon Sayısı</p>
              <p className="text-2xl font-bold text-purple-900">{reservationCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detaylı Analiz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gider Dağılımı */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Gider Dağılımı</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Şoför Ödemeleri</span>
              </div>
              <span className="font-semibold text-gray-900">
                {formatCurrency(totalDriverExpenses)}
              </span>
            </div>
            
            {Object.entries(manualExpensesByCategory).map(([category, amount]) => {
              const categoryInfo = getExpenseCategoryInfo(category);
              const CategoryIcon = categoryInfo.icon;
              
              return (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className={`w-5 h-5 text-${categoryInfo.color}-600`} />
                    <span className="text-gray-700">{categoryInfo.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(amount)}
                  </span>
                </div>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-800">Toplam Gider</span>
                <span className="text-red-600">
                  {formatCurrency(totalDriverExpenses + totalManualExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ödeme Yöntemleri */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Ödeme Yöntemleri</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Nakit Ödemeler</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(cashPayments)}
                </div>
                <div className="text-sm text-gray-500">
                  {cashPayments + cardPayments > 0 ? 
                    `%${((cashPayments / (cashPayments + cardPayments)) * 100).toFixed(1)}` : 
                    '0%'
                  }
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Kart/Havale</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(cardPayments)}
                </div>
                <div className="text-sm text-gray-500">
                  {cashPayments + cardPayments > 0 ? 
                    `%${((cardPayments / (cashPayments + cardPayments)) * 100).toFixed(1)}` : 
                    '0%'
                  }
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-800">Toplam Ciro</span>
                <span className="text-green-600">
                  {formatCurrency(cashPayments + cardPayments)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kar Analizi */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Kar/Zarar Analizi</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-gray-600">Brüt Gelir</div>
              <div className="text-sm text-gray-500 mt-1">
                Rezervasyonlardan komisyon düştükten sonra
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                -{formatCurrency(totalDriverExpenses + totalManualExpenses)}
              </div>
              <div className="text-gray-600">Toplam Gider</div>
              <div className="text-sm text-gray-500 mt-1">
                Şoför ödemeleri + Manuel giderler
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </div>
              <div className="text-gray-600">Net Kar/Zarar</div>
              <div className="text-sm text-gray-500 mt-1">
                {netProfit >= 0 ? 'Karlı işletme' : 'Zarar durumu'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
