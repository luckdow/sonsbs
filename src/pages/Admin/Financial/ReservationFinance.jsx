import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Calendar, DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';

const ReservationFinance = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('monthly'); // 'monthly' veya 'yearly'
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      processFinancialData();
    }
  }, [reservations, viewType]);

  const fetchReservations = async () => {
    try {
      setLoading(true);

      // Önce tamamlanmış rezervasyonları deneyelim
      const reservationsRef = collection(db, 'reservations');
      let q = query(
        reservationsRef,
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc')
      );

      let snapshot = await getDocs(q);
      
      // Eğer tamamlanmış rezervasyon yoksa, tüm rezervasyonları getir
      if (snapshot.empty) {
        console.log('📊 Rezervasyon Finansı: Tamamlanmış rezervasyon bulunamadı, tüm rezervasyonları kontrol ediliyor...');
        snapshot = await getDocs(reservationsRef);
      }

      console.log('📊 Rezervasyon Finansı: Toplam rezervasyon sayısı:', snapshot.docs.length);
      
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

      // Manuel şoför bilgilerini al
      const manualDriversRef = collection(db, 'manual_drivers');
      const manualDriversSnapshot = await getDocs(manualDriversRef);
      const manualDriversMap = {};
      
      manualDriversSnapshot.docs.forEach(doc => {
        const driverData = doc.data();
        manualDriversMap[doc.id] = driverData;
      });

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const driverId = data.assignedDriver || data.assignedDriverId || data.driverId;
        
        if (data.totalPrice) {
          let driverName = 'Bilinmeyen Şoför';
          let driverShare = 0; // Şoföre giden para
          let ourRevenue = data.totalPrice; // Bizim gelirimiz
          let ourExpense = 0; // Bizim giderimiz (sadece kredi kartı/havale durumunda)
          let commissionRate = 0;
          let paymentMethod = data.paymentMethod || 'cash';

          // Manuel şoför kontrolü
          if (driverId === 'manual' && data.manualDriverInfo) {
            driverName = data.manualDriverInfo.name;
            driverShare = parseFloat(data.manualDriverInfo.price || 0);
            ourRevenue = data.totalPrice - driverShare; // Bizim gelirimiz = Toplam - Şoföre giden
            commissionRate = driverShare > 0 ? (driverShare / data.totalPrice * 100) : 0;
            
            // Ödeme yöntemine göre gider hesapla
            if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
              ourExpense = driverShare; // Kredi kartı/havale durumunda şoföre ödeme yapıyoruz
            }
            // Nakit durumunda gider = 0 (şoför müşteriden direkt alıyor)
            
          } else if (driverId && driversMap[driverId]) {
            // Sistem şoförü
            const driverData = driversMap[driverId];
            driverName = `${driverData.firstName} ${driverData.lastName}`;
            commissionRate = driverData.commission || 15;
            driverShare = (data.totalPrice * commissionRate) / 100;
            ourRevenue = data.totalPrice - driverShare; // Bizim gelirimiz = Toplam - Komisyon
            
            // Ödeme yöntemine göre gider hesapla
            if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
              ourExpense = driverShare; // Kredi kartı/havale durumunda komisyon ödüyoruz
            }
            // Nakit durumunda gider = 0 (şoför bizden komisyonu düşerek veriyor)
          }

          reservationData.push({
            id: doc.id,
            ...data,
            driverName,
            commissionRate,
            driverShare, // Şoföre giden toplam para
            ourRevenue, // Bizim gelirimiz
            ourExpense, // Bizim giderimiz
            netIncome: ourRevenue - ourExpense, // Net kazancımız
            isManualDriver: driverId === 'manual',
            paymentMethod,
            completedDate: data.completedAt?.toDate ? data.completedAt.toDate() : new Date(data.completedAt)
          });
        }
      });

      setReservations(reservationData);
      
    } catch (error) {
      console.error('Rezervasyon verileri alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const processFinancialData = () => {
    const grouped = {};

    reservations.forEach(reservation => {
      const date = reservation.completedDate;
      let key;

      if (viewType === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.getFullYear().toString();
      }

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          reservations: [],
          totalRevenue: 0, // Bizim toplam gelirimiz
          totalExpense: 0, // Bizim toplam giderimiz
          totalNetIncome: 0, // Net kazancımız
          totalDriverPayments: 0, // Şoförlere toplam ödenen
          count: 0
        };
      }

      grouped[key].reservations.push(reservation);
      grouped[key].totalRevenue += reservation.ourRevenue;
      grouped[key].totalExpense += reservation.ourExpense;
      grouped[key].totalNetIncome += reservation.netIncome;
      grouped[key].totalDriverPayments += reservation.driverShare;
      grouped[key].count += 1;
    });

    const sortedData = Object.values(grouped).sort((a, b) => b.period.localeCompare(a.period));

    if (viewType === 'monthly') {
      setMonthlyData(sortedData);
      if (!selectedPeriod && sortedData.length > 0) {
        setSelectedPeriod(sortedData[0].period);
      }
    } else {
      setYearlyData(sortedData);
      if (!selectedPeriod && sortedData.length > 0) {
        setSelectedPeriod(sortedData[0].period);
      }
    }
  };

  const formatPeriod = (period) => {
    if (viewType === 'monthly') {
      const [year, month] = period.split('-');
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return period + ' Yılı';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCurrentData = () => {
    return viewType === 'monthly' ? monthlyData : yearlyData;
  };

  const getSelectedPeriodData = () => {
    const data = getCurrentData();
    return data.find(item => item.period === selectedPeriod) || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentData = getCurrentData();
  const selectedData = getSelectedPeriodData();

  return (
    <div className="space-y-6">
      {/* Başlık ve Kontroller */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rezervasyon Finansı</h2>
        <div className="flex space-x-4">
          <select
            value={viewType}
            onChange={(e) => {
              setViewType(e.target.value);
              setSelectedPeriod('');
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Aylık Görünüm</option>
            <option value="yearly">Yıllık Görünüm</option>
          </select>
          {currentData.length > 0 && (
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentData.map(item => (
                <option key={item.period} value={item.period}>
                  {formatPeriod(item.period)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Seçilen Dönem Özet Kartları */}
      {selectedData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Rezervasyon Sayısı</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedData.count}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Bizim Gelirimiz</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(selectedData.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-600">Bizim Giderimiz</p>
                  <p className="text-2xl font-bold text-red-900">
                    {formatCurrency(selectedData.totalExpense)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Net Kazanç</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(selectedData.totalNetIncome)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seçilen Dönem Rezervasyon Detayları */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {formatPeriod(selectedData.period)} - Rezervasyon Detayları
              </h3>
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
                      Toplam Ücret
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şoföre Giden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bizim Gelirimiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bizim Giderimiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Kazanç
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedData.reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.completedDate.toLocaleDateString('tr-TR')}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(reservation.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                        <div className="flex flex-col">
                          <span>{formatCurrency(reservation.driverShare)}</span>
                          <span className="text-xs text-gray-500">
                            {reservation.isManualDriver ? 'Hak Ediş' : `%${reservation.commissionRate.toFixed(1)} Komisyon`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(reservation.ourRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        <div className="flex flex-col">
                          <span>{formatCurrency(reservation.ourExpense)}</span>
                          <span className="text-xs text-gray-500">
                            {reservation.paymentMethod === 'cash' ? 'Nakit (Gider Yok)' : 'Kredi/Havale'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                        {formatCurrency(reservation.netIncome)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tüm Dönemler Özet Tablosu */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {viewType === 'monthly' ? 'Aylık' : 'Yıllık'} Finansal Özet
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dönem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rezervasyon Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bizim Gelirimiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bizim Giderimiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Kazanç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ortalama/Rezervasyon
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((period) => (
                <tr 
                  key={period.period} 
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedPeriod === period.period ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPeriod(period.period)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPeriod(period.period)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {period.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(period.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(period.totalExpense)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(period.totalNetIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(period.totalNetIncome / period.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Henüz tamamlanmış rezervasyon bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationFinance;
