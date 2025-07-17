import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Calendar,
  User,
  Car,
  Star,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';

const DriverFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  vehicleFilter,
  setVehicleFilter,
  licenseExpiryFilter,
  setLicenseExpiryFilter,
  onClearFilters,
  vehicles 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter && statusFilter !== 'all') count++;
    if (vehicleFilter && vehicleFilter !== 'all') count++;
    if (licenseExpiryFilter && licenseExpiryFilter !== 'all') count++;
    return count;
  };

  const getActiveFilters = () => {
    const filters = [];
    
    if (searchTerm) {
      filters.push({ 
        key: 'search', 
        label: `Arama: "${searchTerm}"`, 
        onRemove: () => setSearchTerm('') 
      });
    }
    
    if (statusFilter && statusFilter !== 'all') {
      const statusLabels = {
        active: 'Aktif',
        inactive: 'Pasif',
        suspended: 'Askıya Alındı'
      };
      filters.push({ 
        key: 'status', 
        label: `Durum: ${statusLabels[statusFilter]}`, 
        onRemove: () => setStatusFilter('all') 
      });
    }
    
    if (vehicleFilter && vehicleFilter !== 'all') {
      const vehicleLabels = {
        assigned: 'Araç Atanmış',
        unassigned: 'Araç Atanmamış'
      };
      filters.push({ 
        key: 'vehicle', 
        label: `Araç: ${vehicleLabels[vehicleFilter]}`, 
        onRemove: () => setVehicleFilter('all') 
      });
    }
    
    if (licenseExpiryFilter && licenseExpiryFilter !== 'all') {
      const expiryLabels = {
        expired: 'Süresi Dolmuş',
        expiring: 'Süresi Dolmak Üzere',
        valid: 'Geçerli'
      };
      filters.push({ 
        key: 'license', 
        label: `Ehliyet: ${expiryLabels[licenseExpiryFilter]}`, 
        onRemove: () => setLicenseExpiryFilter('all') 
      });
    }
    
    return filters;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Temel Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Arama */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Şoför adı, telefon veya e-posta ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Durum Filtresi */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="suspended">Askıya Alındı</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Araç Durumu */}
        <div className="relative">
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">Tüm Araçlar</option>
            <option value="assigned">Araç Atanmış</option>
            <option value="unassigned">Araç Atanmamış</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Gelişmiş Filtreler Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Gelişmiş</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
          
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              Temizle ({getActiveFiltersCount()})
            </button>
          )}
        </div>
      </div>

      {/* Gelişmiş Filtreler */}
      {showAdvanced && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Ehliyet Süresi */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ehliyet Durumu
              </label>
              <select
                value={licenseExpiryFilter}
                onChange={(e) => setLicenseExpiryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tüm Ehliyetler</option>
                <option value="expired">Süresi Dolmuş</option>
                <option value="expiring">Süresi Dolmak Üzere (30 gün)</option>
                <option value="valid">Geçerli</option>
              </select>
              <ChevronDown className="absolute right-3 top-9 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Boş alan - İleride başka filtreler için */}
            <div></div>
          </div>
        </div>
      )}

      {/* Aktif Filtreler */}
      {getActiveFilters().length > 0 && (
        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Aktif filtreler:</span>
            {getActiveFilters().map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {filter.label}
                <button
                  onClick={filter.onRemove}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filtre İstatistikleri */}
      {(statusFilter !== 'all' || vehicleFilter !== 'all' || licenseExpiryFilter !== 'all') && (
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span>Aktif Şoförler</span>
            </div>
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-600" />
              <span>Pasif Şoförler</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span>Askıya Alınanlar</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>Araç Atanmış</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>Ehliyet Süresi Dolacak</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverFilters;
