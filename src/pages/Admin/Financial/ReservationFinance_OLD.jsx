import React, { useState, useEffect } from 'react';
import { 
  Calculator,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const ReservationFinance = () => {
  const { state } = useApp();
  const { reservations, drivers } = state;
  const [financeData, setFinanceData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    calculateReservationFinance();
  }, [reservations, drivers, selectedPeriod, selectedPaymentMethod, selectedStatus]);

  const calculateReservationFinance = () => {
    const now = new Date();
    let startDate;

    // Dönem filtresi
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

    // Rezervasyonları filtrele
    let filteredReservations = reservations.filter(res => 
      new Date(res.createdAt) >= startDate
    );

    // Ödeme yöntemi filtresi
    if (selectedPaymentMethod !== 'all') {
      filteredReservations = filteredReservations.filter(res => 
        res.paymentMethod === selectedPaymentMethod
      );
    }

    // Durum filtresi
    if (selectedStatus !== 'all') {
      filteredReservations = filteredReservations.filter(res => 
        res.status === selectedStatus
      );
    }

    // Finansal analiz
    const financeAnalysis = filteredReservations.map(reservation => {
      const driver = drivers.find(d => d.id === reservation.driverId);
      const totalPrice = reservation.totalPrice || 0;
      const isExternal = !!reservation.externalDriver;
      
      let driverEarning = 0;
      let companyEarning = 0;

      if (isExternal) {
        // Manuel şoför
        driverEarning = reservation.externalDriver.agreedAmount || 0;
        companyEarning = totalPrice - driverEarning;
      } else {
        // Kayıtlı şoför
        const commissionRate = driver?.commission || 30; // Şoför yönetimindeki % komisyon
        driverEarning = totalPrice * (commissionRate / 100);
        companyEarning = totalPrice * (1 - (commissionRate / 100));
      }

      // Ödeme durumu analizi
      const isPaid = reservation.isPaid || false;
      const paymentDate = reservation.paymentDate || null;
      const paymentMethod = reservation.paymentMethod || 'unknown';

      return {
        id: reservation.id,
        reservationId: reservation.reservationId,
        customerName: reservation.customerInfo?.name || 'Bilinmeyen',
        date: reservation.createdAt,
        route: `${reservation.fromLocation} → ${reservation.toLocation}`,
        totalPrice,
        driverEarning,
        companyEarning,
        paymentMethod,
        status: reservation.status,
        isPaid,
        paymentDate,
        driverName: isExternal ? reservation.externalDriver.name : driver?.name || 'Bilinmeyen',
        isExternal,
        estimatedCosts: {
          fuel: totalPrice * 0.15, // %15 yakıt
          maintenance: totalPrice * 0.05, // %5 bakım
          insurance: totalPrice * 0.03, // %3 sigorta
          other: totalPrice * 0.02 // %2 diğer
        }
      };
    });

    setFinanceData(financeAnalysis);
  };

  const getTotalStats = () => {
    return financeData.reduce((acc, item) => {
      const costs = item.estimatedCosts;
      const totalCosts = costs.fuel + costs.maintenance + costs.insurance + costs.other;
      const netProfit = item.companyEarning - totalCosts;

      return {
        totalRevenue: acc.totalRevenue + item.totalPrice,
        totalDriverEarnings: acc.totalDriverEarnings + item.driverEarning,
        totalCompanyEarnings: acc.totalCompanyEarnings + item.companyEarning,
        totalCosts: acc.totalCosts + totalCosts,
        netProfit: acc.netProfit + netProfit,
        paidAmount: acc.paidAmount + (item.isPaid ? item.totalPrice : 0),
        unpaidAmount: acc.unpaidAmount + (!item.isPaid ? item.totalPrice : 0),
        cashPayments: acc.cashPayments + (item.paymentMethod === 'cash' ? item.totalPrice : 0),
        cardPayments: acc.cardPayments + (item.paymentMethod === 'card' ? item.totalPrice : 0),
        reservationCount: acc.reservationCount + 1
      };
    }, {
      totalRevenue: 0,
      totalDriverEarnings: 0,
      totalCompanyEarnings: 0,
      totalCosts: 0,
      netProfit: 0,
      paidAmount: 0,
      unpaidAmount: 0,
      cashPayments: 0,
      cardPayments: 0,
      reservationCount: 0
    });
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Rezervasyon Finansı</h2>
          <p className="text-gray-600">Rezervasyon bazlı gelir-gider analizi</p>
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
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Ödemeler</option>
            <option value="cash">Nakit</option>
            <option value="card">Kredi Kartı</option>
            <option value="transfer">Havale</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="pending">Bekleyen</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-semibold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{stats.reservationCount} rezervasyon</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Şoför Ödemeleri</p>
              <p className="text-2xl font-semibold text-orange-600">€{stats.totalDriverEarnings.toFixed(2)}</p>
              <p className="text-xs text-gray-500">%{((stats.totalDriverEarnings/stats.totalRevenue)*100).toFixed(1)} oran</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Brüt Kar</p>
              <p className="text-2xl font-semibold text-blue-600">€{stats.totalCompanyEarnings.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Giderler hariç</p>
            </div>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Kar</p>
              <p className={`text-2xl font-semibold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{stats.netProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Giderler dahil</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Payment Method Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nakit Ödemeler</p>
              <p className="text-xl font-semibold text-green-600">€{stats.cashPayments.toFixed(2)}</p>
            </div>
            <Banknote className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kart Ödemeleri</p>
              <p className="text-xl font-semibold text-blue-600">€{stats.cardPayments.toFixed(2)}</p>
            </div>
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tahsil Edilen</p>
              <p className="text-xl font-semibold text-green-600">€{stats.paidAmount.toFixed(2)}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bekleyen</p>
              <p className="text-xl font-semibold text-yellow-600">€{stats.unpaidAmount.toFixed(2)}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Detailed Finance Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rezervasyon Finansal Detayları</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rezervasyon
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
                  Şoför Kazancı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firma Kazancı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financeData.map((item) => {
                const totalCosts = item.estimatedCosts.fuel + item.estimatedCosts.maintenance + 
                                 item.estimatedCosts.insurance + item.estimatedCosts.other;
                const netProfit = item.companyEarning - totalCosts;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.reservationId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.customerName}</div>
                      <div className="text-xs text-gray-500">{item.route}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.isExternal && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                            Manuel
                          </span>
                        )}
                        <div className="text-sm text-gray-900">{item.driverName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                      €{item.driverEarning.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600">€{item.companyEarning.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        Net: €{netProfit.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {item.paymentMethod === 'cash' ? (
                          <>
                            <Banknote className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Nakit</span>
                          </>
                        ) : item.paymentMethod === 'card' ? (
                          <>
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Kart</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Bilinmeyen</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Tamamlandı
                        </span>
                      ) : item.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Bekleyen
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          İptal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Breakdown Info */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <h4 className="font-medium mb-1">Tahmini Gider Hesaplaması</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Yakıt:</strong> Rezervasyon bedelinin %15'i</li>
              <li><strong>Bakım:</strong> Rezervasyon bedelinin %5'i</li>
              <li><strong>Sigorta:</strong> Rezervasyon bedelinin %3'ü</li>
              <li><strong>Diğer:</strong> Rezervasyon bedelinin %2'si (temizlik, telefon vs.)</li>
              <li>Net kar = Firma kazancı - Tahmini giderler</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationFinance;
