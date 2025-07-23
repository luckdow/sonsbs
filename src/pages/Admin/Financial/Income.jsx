import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';

const Income = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [totalNetIncome, setTotalNetIncome] = useState(0);

  // Rezervasyonları ve şoför bilgilerini getir
  useEffect(() => {
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
        
        // Şoför bilgilerini de al
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
          const driverData = driversMap[driverId];
          
          if (driverData && data.totalPrice) {
            const commissionRate = driverData.commission || 15;
            const commission = (data.totalPrice * commissionRate) / 100;
            const netIncome = data.totalPrice - commission;

            reservationData.push({
              id: doc.id,
              ...data,
              driverName: `${driverData.firstName} ${driverData.lastName}`,
              commissionRate,
              commission,
              netIncome
            });
          }
        });

        // Zaman filtresi uygula
        const filteredData = filterByTime(reservationData, timeFilter);
        setReservations(filteredData);
        
        // Toplam net geliri hesapla
        const total = filteredData.reduce((sum, res) => sum + res.netIncome, 0);
        setTotalNetIncome(total);
        
      } catch (error) {
        console.error('Gelir verileri alınırken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [timeFilter]);

  const filterByTime = (data, filter) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return data.filter(item => {
      const completedDate = item.completedAt?.toDate ? item.completedAt.toDate() : new Date(item.completedAt);
      
      switch (filter) {
        case 'this_month':
          return completedDate >= startOfMonth;
        case 'last_month':
          return completedDate >= startOfLastMonth && completedDate <= endOfLastMonth;
        case 'this_year':
          return completedDate >= startOfYear;
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
        <h2 className="text-2xl font-bold text-gray-800">
          Net Gelirler (Komisyon Sonrası)
        </h2>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="this_month">Bu Ay</option>
          <option value="last_month">Geçen Ay</option>
          <option value="this_year">Bu Yıl</option>
          <option value="all">Tümü</option>
        </select>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Toplam Net Gelir</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalNetIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Toplam Rezervasyon</p>
              <p className="text-2xl font-bold text-blue-900">{reservations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Ortalama Net Gelir</p>
              <p className="text-2xl font-bold text-purple-900">
                {reservations.length > 0 ? formatCurrency(totalNetIncome / reservations.length) : '€0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rezervasyon Detayları */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Rezervasyon Detayları</h3>
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
                  Komisyon (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komisyon Tutarı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Gelir
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
                    {reservation.driverName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(reservation.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    %{reservation.commissionRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -{formatCurrency(reservation.commission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(reservation.netIncome)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reservations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Seçilen dönemde tamamlanmış rezervasyon bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default Income;
