import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download,
  Filter,
  Search,
  Eye,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
  FileText,
  Users,
  Car,
  Route
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FinancialManagement = () => {
  const { state } = useApp();
  const { reservations, vehicles, drivers } = state;
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [financialStats, setFinancialStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    completedTrips: 0,
    averageTrip: 0,
    driverCommissions: 0,
    vehicleCosts: 0,
    operationalCosts: 0
  });

  useEffect(() => {
    calculateFinancialStats();
  }, [reservations, drivers, dateRange]);

  const calculateFinancialStats = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999); // End of day

    // Filter reservations by date range
    const filteredReservations = reservations.filter(reservation => {
      const reservationDate = new Date(reservation.tripDetails?.date || reservation.createdAt);
      return reservationDate >= startDate && reservationDate <= endDate;
    });

    const completedReservations = filteredReservations.filter(r => r.status === 'completed');
    
    // Calculate revenue
    const totalRevenue = completedReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    
    // Calculate driver commissions
    const driverCommissions = completedReservations.reduce((sum, r) => {
      const driver = drivers.find(d => d.id === r.driverId);
      const commission = (r.totalPrice || 0) * ((driver?.commission || 10) / 100);
      return sum + commission;
    }, 0);

    // Estimate other costs (these would come from actual expense tracking)
    const vehicleCosts = vehicles.length * 500; // Monthly maintenance per vehicle
    const operationalCosts = totalRevenue * 0.15; // 15% operational overhead
    
    const totalExpenses = driverCommissions + vehicleCosts + operationalCosts;
    const netProfit = totalRevenue - totalExpenses;
    const averageTrip = completedReservations.length > 0 ? totalRevenue / completedReservations.length : 0;

    setFinancialStats({
      totalRevenue,
      totalExpenses,
      netProfit,
      completedTrips: completedReservations.length,
      averageTrip,
      driverCommissions,
      vehicleCosts,
      operationalCosts
    });
  };

  const getRevenueByDriver = () => {
    const driverRevenue = {};
    
    reservations
      .filter(r => r.status === 'completed' && r.driverId)
      .forEach(reservation => {
        const driverId = reservation.driverId;
        const driver = drivers.find(d => d.id === driverId);
        
        if (driver) {
          const driverName = `${driver.firstName} ${driver.lastName}`;
          if (!driverRevenue[driverName]) {
            driverRevenue[driverName] = {
              totalRevenue: 0,
              totalTrips: 0,
              commission: 0
            };
          }
          
          driverRevenue[driverName].totalRevenue += reservation.totalPrice || 0;
          driverRevenue[driverName].totalTrips += 1;
          driverRevenue[driverName].commission += (reservation.totalPrice || 0) * ((driver.commission || 10) / 100);
        }
      });

    return Object.entries(driverRevenue)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const getMonthlyRevenue = () => {
    const monthlyData = {};
    
    reservations
      .filter(r => r.status === 'completed')
      .forEach(reservation => {
        const date = new Date(reservation.tripDetails?.date || reservation.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        
        monthlyData[monthKey] += reservation.totalPrice || 0;
      });

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  const driverRevenue = getRevenueByDriver();
  const monthlyRevenue = getMonthlyRevenue();

  const exportFinancialReport = () => {
    const report = {
      period: `${dateRange.startDate} - ${dateRange.endDate}`,
      summary: financialStats,
      driverBreakdown: driverRevenue,
      monthlyTrend: monthlyRevenue,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mali-rapor-${dateRange.startDate}-${dateRange.endDate}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={exportFinancialReport}
          className="btn btn-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Rapor İndir
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Başlangıç Tarihi</label>
              <input
                type="date"
                className="input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="label">Bitiş Tarihi</label>
              <input
                type="date"
                className="input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">Durum</label>
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm İşlemler</option>
                <option value="completed">Tamamlanan</option>
                <option value="pending">Bekleyen</option>
                <option value="cancelled">İptal Edilen</option>
              </select>
            </div>

            <div>
              <label className="label">Ara</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rezervasyon ara..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(financialStats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+12.5%</span>
                  <span className="text-sm text-gray-500 ml-1">bu ay</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(financialStats.totalExpenses)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500 font-medium">+3.2%</span>
                  <span className="text-sm text-gray-500 ml-1">bu ay</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Kar</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(financialStats.netProfit)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-500 font-medium">+18.7%</span>
                  <span className="text-sm text-gray-500 ml-1">bu ay</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Sefer</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(financialStats.averageTrip)}
                </p>
                <div className="flex items-center mt-2">
                  <Route className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-500 font-medium">{financialStats.completedTrips}</span>
                  <span className="text-sm text-gray-500 ml-1">sefer</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card lg:col-span-2"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Gider Dağılımı</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Şoför Komisyonları</p>
                    <p className="text-sm text-gray-600">Tamamlanan seferlerden komisyon</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(financialStats.driverCommissions)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((financialStats.driverCommissions / financialStats.totalExpenses) * 100 || 0).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Araç Giderleri</p>
                    <p className="text-sm text-gray-600">Bakım, yakıt ve sigorta</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(financialStats.vehicleCosts)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((financialStats.vehicleCosts / financialStats.totalExpenses) * 100 || 0).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Operasyon Giderleri</p>
                    <p className="text-sm text-gray-600">Genel işletme giderleri</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(financialStats.operationalCosts)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((financialStats.operationalCosts / financialStats.totalExpenses) * 100 || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profit Margin */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Karlılık Analizi</h3>
          </div>
          <div className="card-body text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
              <div 
                className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-green-500 border-t-transparent transform -rotate-90"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + (financialStats.netProfit / financialStats.totalRevenue * 50)}% 0%, ${50 + (financialStats.netProfit / financialStats.totalRevenue * 50)}% 100%, 50% 100%)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">
                  {((financialStats.netProfit / financialStats.totalRevenue) * 100 || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Kar Marjı</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Gelir:</span>
                <span className="font-medium">{formatCurrency(financialStats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gider:</span>
                <span className="font-medium">{formatCurrency(financialStats.totalExpenses)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Net Kar:</span>
                <span className="font-bold text-green-600">{formatCurrency(financialStats.netProfit)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue by Driver & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Şoför Bazında Gelir</h3>
          </div>
          <div className="card-body">
            {driverRevenue.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz gelir verisi yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {driverRevenue.slice(0, 5).map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-500">{driver.totalTrips} sefer</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(driver.totalRevenue)}</p>
                      <p className="text-sm text-green-600">Komisyon: {formatCurrency(driver.commission)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Aylık Gelir Trendi</h3>
          </div>
          <div className="card-body">
            {monthlyRevenue.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz aylık veri yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <div>
                      <p className="font-medium text-gray-900">{formatMonth(month.month)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{formatCurrency(month.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Son İşlemler</h3>
        </div>
        <div className="card-body">
          {reservations.filter(r => r.status === 'completed').length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Henüz tamamlanmış işlem yok</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rezervasyon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şoför
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Komisyon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations
                    .filter(r => r.status === 'completed')
                    .slice(0, 10)
                    .map((reservation) => {
                      const driver = drivers.find(d => d.id === reservation.driverId);
                      const commission = (reservation.totalPrice || 0) * ((driver?.commission || 10) / 100);
                      const net = (reservation.totalPrice || 0) - commission;
                      
                      return (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {reservation.reservationId || `RES-${reservation.id?.slice(-6)}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.tripDetails?.date 
                              ? new Date(reservation.tripDetails.date).toLocaleDateString('tr-TR')
                              : 'Bilinmiyor'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {driver ? `${driver.firstName} ${driver.lastName}` : 'Bilinmeyen'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(reservation.totalPrice || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            -{formatCurrency(commission)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {formatCurrency(net)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialManagement;
