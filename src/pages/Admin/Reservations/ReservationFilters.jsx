import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  User, 
  MapPin, 
  RefreshCw,
  ChevronDown 
} from 'lucide-react';

const ReservationFilters = ({ onFilterChange, reservations }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    assignedDriver: 'all',
    paymentMethod: 'all'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      status: 'all',
      dateRange: 'all',
      assignedDriver: 'all',
      paymentMethod: 'all'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getStatusCounts = () => {
    const counts = {
      all: reservations.length,
      pending: reservations.filter(r => r.status === 'pending').length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      assigned: reservations.filter(r => r.status === 'assigned').length,
      in_progress: reservations.filter(r => r.status === 'in_progress').length,
      completed: reservations.filter(r => r.status === 'completed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Arama */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rezervasyon ID, müşteri adı, telefon..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Durum Filtresi */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Durumlar ({statusCounts.all})</option>
            <option value="pending">Beklemede ({statusCounts.pending})</option>
            <option value="confirmed">Onaylandı ({statusCounts.confirmed})</option>
            <option value="assigned">Atandı ({statusCounts.assigned})</option>
            <option value="in_progress">Devam Ediyor ({statusCounts.in_progress})</option>
            <option value="completed">Tamamlandı ({statusCounts.completed})</option>
            <option value="cancelled">İptal ({statusCounts.cancelled})</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Tarih Filtresi */}
        <div className="relative">
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="tomorrow">Yarın</option>
            <option value="this_week">Bu Hafta</option>
            <option value="this_month">Bu Ay</option>
            <option value="next_month">Gelecek Ay</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Gelişmiş Filtreler Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Gelişmiş Filtreler
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filtreleri Temizle */}
        {(filters.search || filters.status !== 'all' || filters.dateRange !== 'all' || filters.assignedDriver !== 'all' || filters.paymentMethod !== 'all') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <X className="w-4 h-4" />
            Temizle
          </button>
        )}
      </div>

      {/* Gelişmiş Filtreler */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Şoför Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şoför Durumu
              </label>
              <select
                value={filters.assignedDriver}
                onChange={(e) => handleFilterChange('assignedDriver', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Rezervasyonlar</option>
                <option value="assigned">Şoför Atanmış</option>
                <option value="unassigned">Şoför Atanmamış</option>
              </select>
            </div>

            {/* Ödeme Yöntemi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ödeme Yöntemi
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Yöntemler</option>
                <option value="cash">Nakit</option>
                <option value="card">Kredi Kartı</option>
                <option value="transfer">Banka Transferi</option>
                <option value="online">Online Ödeme</option>
              </select>
            </div>

            {/* Yolcu Sayısı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yolcu Sayısı
              </label>
              <select
                value={filters.passengerCount || 'all'}
                onChange={(e) => handleFilterChange('passengerCount', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Yolcu Sayıları</option>
                <option value="1">1 Kişi</option>
                <option value="2">2 Kişi</option>
                <option value="3">3 Kişi</option>
                <option value="4">4 Kişi</option>
                <option value="5+">5+ Kişi</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Aktif Filtreler Özeti */}
      {Object.entries(filters).some(([key, value]) => 
        key !== 'search' && value !== 'all' && value !== ''
      ) && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Aktif filtreler:</span>
            <div className="flex flex-wrap gap-2">
              {filters.status !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Durum: {filters.status}
                </span>
              )}
              {filters.dateRange !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Tarih: {filters.dateRange}
                </span>
              )}
              {filters.assignedDriver !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Şoför: {filters.assignedDriver}
                </span>
              )}
              {filters.paymentMethod !== 'all' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                  Ödeme: {filters.paymentMethod}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationFilters;
