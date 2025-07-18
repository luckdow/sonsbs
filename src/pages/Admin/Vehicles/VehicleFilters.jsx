import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const VehicleFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  capacityFilter,
  setCapacityFilter,
  typeFilter,
  setTypeFilter
}) => {
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCapacityFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || capacityFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Arama */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Marka, model veya plaka ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Durum Filtresi */}
        <div className="min-w-32">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="maintenance">Bakımda</option>
          </select>
        </div>

        {/* Kapasite Filtresi */}
        <div className="min-w-32">
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Kapasiteler</option>
            <option value="4">4+ Kişi</option>
            <option value="8">8+ Kişi</option>
            <option value="12">12+ Kişi</option>
            <option value="16">16+ Kişi</option>
          </select>
        </div>

        {/* Tip Filtresi */}
        <div className="min-w-32">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Tipler</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="minibus">Minibüs</option>
            <option value="midibus">Midibüs</option>
            <option value="bus">Otobüs</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        {/* Filtreleri Temizle */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Temizle
          </button>
        )}
      </div>

      {/* Aktif Filtreler */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              Arama: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              Durum: {statusFilter === 'active' ? 'Aktif' : statusFilter === 'inactive' ? 'Pasif' : 'Bakımda'}
              <button
                onClick={() => setStatusFilter('all')}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {capacityFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
              Kapasite: {capacityFilter}+ Kişi
              <button
                onClick={() => setCapacityFilter('all')}
                className="text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {typeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
              Tip: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
              <button
                onClick={() => setTypeFilter('all')}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleFilters;
