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
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div>
        <table className="w-full text-xs">
          <thead className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border-b border-slate-200">
            <tr>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">Şoför</th>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">İletişim</th>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">Ehliyet</th>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">Durum</th>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">Araç</th>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">Kom.</th>
              <th className="px-2 py-2 text-left font-bold text-slate-700 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-slate-100">
            {drivers && drivers.length > 0 ? drivers.map((driver) => (
              <React.Fragment key={driver.id}>
                <tr className="hover:bg-blue-50/60 transition-colors">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-blue-200">
                        <span className="text-base font-bold text-blue-700">
                          {(driver.firstName || '')[0] || ''}{(driver.lastName || '')[0] || ''}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-800">
                          {driver.firstName || ''} {driver.lastName || ''}
                        </div>
                        <div className="text-xs text-slate-500">
                          {driver.totalTrips || 0} sefer
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-slate-800">
                      <div className="flex items-center mb-1">
                        <Phone className="w-4 h-4 text-blue-400 mr-2" />
                        {driver.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-blue-400 mr-2" />
                        {driver.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-slate-800">
                      <div className="font-semibold">{driver.licenseNumber}</div>
                      <div className={`text-xs ${getLicenseStatus(driver.licenseExpiry).color} flex items-center`}>
                        {getLicenseStatus(driver.licenseExpiry).label}
                        {getLicenseStatus(driver.licenseExpiry).urgent && (
                          <AlertTriangle className="w-3 h-3 inline ml-1 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(driver.status)}
                      <select
                        value={driver.status}
                        onChange={(e) => onStatusChange(driver.id, e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                        <option value="suspended">Askıya Al</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center text-sm text-slate-800">
                      <Car className="w-4 h-4 text-blue-400 mr-2" />
                      <div className="max-w-xs">
                        <div className={`truncate ${driver.assignedVehicle ? 'text-slate-800' : 'text-slate-400'}`}>
                          {getVehicleName(driver.assignedVehicle)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center text-sm text-green-700 font-bold">
                      %{driver.commission || 0}
                      <span className="text-xs text-slate-400 ml-1 font-normal">komisyon</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(driver)}
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors shadow"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(driver)}
                        className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-colors shadow"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(driver.id)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors shadow"
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
                <td colSpan="7" className="px-2 py-2 text-center text-slate-400">
                  Henüz şoför bulunmuyor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(!drivers || drivers.length === 0) && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400">Henüz şoför bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default DriverTable;
