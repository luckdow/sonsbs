import React, { useState } from 'react';
import { 
  Eye,
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Car, 
  UserCheck,
  UserX,
  Calendar,
  AlertTriangle,
  Users
} from 'lucide-react';

const DriverTable = ({ 
  drivers = [], 
  vehicles = [], 
  onEdit, 
  onDelete, 
  onStatusChange,
  onViewDetails 
}) => {

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})` : 'Araç atanmamış';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: UserCheck, 
        label: 'Aktif' 
      },
      inactive: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: UserX, 
        label: 'Pasif' 
      },
      suspended: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: AlertTriangle, 
        label: 'Askıya Alındı' 
      }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getLicenseStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'text-red-600', label: 'Süresi Dolmuş', urgent: true };
    } else if (diffDays <= 30) {
      return { color: 'text-orange-600', label: `${diffDays} gün kaldı`, urgent: true };
    } else if (diffDays <= 90) {
      return { color: 'text-yellow-600', label: `${diffDays} gün kaldı`, urgent: false };
    } else {
      return { color: 'text-green-600', label: 'Geçerli', urgent: false };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Şoför
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İletişim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ehliyet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Araç
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Komisyon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers && drivers.length > 0 ? drivers.map((driver) => (
              <React.Fragment key={driver.id}>
                {/* Ana satır */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {(driver.firstName || '')[0] || ''}{(driver.lastName || '')[0] || ''}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.firstName || ''} {driver.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {driver.totalTrips || 0} sefer
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        {driver.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {driver.email}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{driver.licenseNumber}</div>
                      <div className={`text-xs ${getLicenseStatus(driver.licenseExpiry).color}`}>
                        {getLicenseStatus(driver.licenseExpiry).label}
                        {getLicenseStatus(driver.licenseExpiry).urgent && (
                          <AlertTriangle className="w-3 h-3 inline ml-1" />
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(driver.status)}
                      <select
                        value={driver.status}
                        onChange={(e) => onStatusChange(driver.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                        <option value="suspended">Askıya Al</option>
                      </select>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="max-w-xs">
                        <div className={`truncate ${driver.assignedVehicle ? 'text-gray-900' : 'text-gray-500'}`}>
                          {getVehicleName(driver.assignedVehicle)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="text-lg font-semibold text-green-600">
                        %{driver.commission || 0}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">komisyon</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(driver)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(driver)}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(driver.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                
              </React.Fragment>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Henüz şoför bulunmuyor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {(!drivers || drivers.length === 0) && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Henüz şoför bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default DriverTable;
