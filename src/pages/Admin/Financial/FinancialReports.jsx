import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const FinancialReports = () => {
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalCommissions: 0,
    driverPayments: 0,
    pendingPayments: 0,
    cashTransactions: 0,
    cardTransactions: 0
  });
  const [drivers, setDrivers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Bu ayın başı
    endDate: new Date().toISOString().split('T')[0] // Bugün
  });
  const [selectedReport, setSelectedReport] = useState('summary');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Tarih aralığını ayarla
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Günün sonunu al

      // Şoförleri getir
      const driversSnapshot = await getDocs(collection(db, 'drivers'));
      const driversData = driversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDrivers(driversData);

      // Belirtilen tarih aralığındaki rezervasyonları getir
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc')
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
      
      let filteredReservations = reservationsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(reservation => {
          const completedDate = reservation.completedAt?.toDate() || new Date(reservation.completedAt);
          return completedDate >= startDate && completedDate <= endDate;
        });

      setReservations(filteredReservations);

      // Rapor verilerini hesapla
      let totalRevenue = 0;
      let totalCommissions = 0;
      let cashTransactions = 0;
      let cardTransactions = 0;
      let driverPayments = 0;
      let pendingPayments = 0;

      filteredReservations.forEach(reservation => {
        const price = reservation.totalPrice || 0;
        
        // Ödeme metoduna göre gelir hesaplama
        if (reservation.paymentMethod === 'cash') {
          // Nakit ödeme: Sadece tahsil edilmişse gelir sayılır
          if (reservation.commissionPaid === true) {
            if (reservation.assignedDriver !== 'manual') {
              const commission = price * 0.15;
              totalRevenue += commission;
              cashTransactions += commission;
            } else if (reservation.manualDriverInfo?.price) {
              const manualDriverCommission = price - reservation.manualDriverInfo.price;
              totalRevenue += manualDriverCommission;
              cashTransactions += manualDriverCommission;
            }
          }
          // Henüz tahsil edilmemiş nakit ödemeler gelir sayılmaz
        } else {
          // Kart/Havale ödeme: Otomatik gelir (zaten kasada)
          totalRevenue += price;
          cardTransactions += price;
        }

        // Komisyon hesapla
        if (reservation.driverId) {
          const driver = driversData.find(d => d.id === reservation.driverId);
          if (driver) {
            const commissionRate = driver.commissionRate || 15;
            const commission = (price * commissionRate) / 100;
            totalCommissions += commission;

            // Ödeme durumuna göre
            if (reservation.driverPaymentStatus === 'paid') {
              driverPayments += (price - commission);
            } else {
              pendingPayments += (price - commission);
            }
          }
        }
      });

      setReportData({
        totalRevenue,
        totalCommissions,
        driverPayments,
        pendingPayments,
        cashTransactions,
        cardTransactions
      });

    } catch (error) {
      console.error('Rapor verilerini getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDriverReport = () => {
    return drivers.map(driver => {
      const driverReservations = reservations.filter(r => r.driverId === driver.id);
      const totalTrips = driverReservations.length;
      const totalRevenue = driverReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
      const commissionRate = driver.commissionRate || 15;
      const totalCommission = (totalRevenue * commissionRate) / 100;
      const driverEarnings = totalRevenue - totalCommission;
      
      return {
        id: driver.id,
        name: `${driver.firstName} ${driver.lastName}`,
        phone: driver.phone,
        totalTrips,
        totalRevenue,
        totalCommission,
        driverEarnings,
        commissionRate,
        averageTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const generatePaymentMethodReport = () => {
    const cashCount = reservations.filter(r => r.paymentMethod === 'cash').length;
    const cardCount = reservations.filter(r => r.paymentMethod !== 'cash').length;
    
    return {
      cash: {
        count: cashCount,
        amount: reportData.cashTransactions,
        percentage: reservations.length > 0 ? (cashCount / reservations.length) * 100 : 0
      },
      card: {
        count: cardCount,
        amount: reportData.cardTransactions,
        percentage: reservations.length > 0 ? (cardCount / reservations.length) * 100 : 0
      }
    };
  };

  const exportToCSV = (data, filename) => {
    const csvContent = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {typeof value === 'number' && title.includes('€') ? `€${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% önceki döneme göre
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-8 h-8 ${color.replace('border-l-', 'text-')}`} />
        </div>
      </div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Finansal Raporlar</h2>
          <p className="text-gray-600">Detaylı finansal analiz ve raporlama</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => exportToCSV(generateDriverReport(), 'sofor_raporu.csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            CSV İndir
          </button>
        </div>
      </div>

      {/* Tarih Filtresi */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Tarih Aralığı:</span>
          
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          
          <span className="text-gray-500">-</span>
          
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Gelir"
          value={reportData.totalRevenue}
          icon={DollarSign}
          color="border-l-green-500"
        />
        
        <StatCard
          title="Toplam Komisyon"
          value={reportData.totalCommissions}
          icon={TrendingUp}
          color="border-l-blue-500"
        />
        
        <StatCard
          title="Şoför Ödemeleri"
          value={reportData.driverPayments}
          icon={Users}
          color="border-l-purple-500"
        />
        
        <StatCard
          title="Bekleyen Ödemeler"
          value={reportData.pendingPayments}
          icon={FileText}
          color="border-l-yellow-500"
        />
      </div>

      {/* Rapor Seçimi */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedReport('summary')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              selectedReport === 'summary'
                ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Özet Rapor
            </div>
          </button>
          
          <button
            onClick={() => setSelectedReport('drivers')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              selectedReport === 'drivers'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Şoför Performansı
            </div>
          </button>
          
          <button
            onClick={() => setSelectedReport('payments')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              selectedReport === 'payments'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PieChart className="w-5 h-5" />
              Ödeme Yöntemleri
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Özet Rapor */}
          {selectedReport === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Gelir Dağılımı</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Nakit Ödemeler</span>
                      <span className="font-bold">€{reportData.cashTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kredi Kartı/Havale</span>
                      <span className="font-bold">€{reportData.cardTransactions.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Toplam</span>
                      <span>€{reportData.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Komisyon Analizi</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Toplam Komisyon</span>
                      <span className="font-bold">€{reportData.totalCommissions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ortalama Komisyon Oranı</span>
                      <span className="font-bold">
                        %{reportData.totalRevenue > 0 ? ((reportData.totalCommissions / reportData.totalRevenue) * 100).toFixed(1) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toplam Yolculuk</span>
                      <span className="font-bold">{reservations.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Şoför Performansı */}
          {selectedReport === 'drivers' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-800">Şoför Performans Raporu</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Şoför</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Yolculuk</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Toplam Gelir</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Komisyon</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Şoför Kazancı</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Ort. Yolculuk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateDriverReport().map(driver => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-gray-600">{driver.phone}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                          {driver.totalTrips}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold text-green-600">
                          €{driver.totalRevenue.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold text-red-600">
                          €{driver.totalCommission.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">
                          €{driver.driverEarnings.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          €{driver.averageTrip.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ödeme Yöntemleri */}
          {selectedReport === 'payments' && (
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-800">Ödeme Yöntemi Analizi</h4>
              
              {(() => {
                const paymentReport = generatePaymentMethodReport();
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                      <h5 className="text-lg font-bold text-gray-800 mb-4">💰 Nakit Ödemeler</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>İşlem Sayısı</span>
                          <span className="font-bold">{paymentReport.cash.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toplam Tutar</span>
                          <span className="font-bold">€{paymentReport.cash.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yüzde</span>
                          <span className="font-bold">%{paymentReport.cash.percentage.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h5 className="text-lg font-bold text-gray-800 mb-4">💳 Kredi Kartı/Havale</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>İşlem Sayısı</span>
                          <span className="font-bold">{paymentReport.card.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toplam Tutar</span>
                          <span className="font-bold">€{paymentReport.card.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yüzde</span>
                          <span className="font-bold">%{paymentReport.card.percentage.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
