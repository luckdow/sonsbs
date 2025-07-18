import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Car, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

const VehicleTable = ({
  vehicles,
  onShowDetails,
  onEditVehicle,
  onDeleteVehicle,
  onStatusChange,
  onManageFeatures
}) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        text: 'Aktif' 
      },
      inactive: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        text: 'Pasif' 
      },
      maintenance: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: AlertCircle, 
        text: 'Bakımda' 
      }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const getVehicleTypeIcon = (type) => {
    const typeIcons = {
      sedan: '🚗',
      suv: '🚙',
      minibus: '🚐',
      midibus: '🚌',
      bus: '🚍',
      vip: '🏎️'
    };
    return typeIcons[type] || '🚗';
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      setDeletingVehicle(vehicleId);
      const success = await onDeleteVehicle(vehicleId);
      if (success) {
        setDeletingVehicle(null);
      }
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    const success = await onStatusChange(vehicleId, newStatus);
    if (success) {
      setShowDropdown(null);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz araç yok</h3>
        <p className="text-gray-600">İlk aracınızı ekleyerek başlayın.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Araç Bilgileri
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kapasite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KM Ücreti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Özellikler
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <motion.tr
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                        {vehicle.imageUrl ? (
                          <img
                            src={vehicle.imageUrl}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          getVehicleTypeIcon(vehicle.type)
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.year} • {vehicle.plateNumber}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {vehicle.color} • {vehicle.fuelType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 text-gray-400 mr-1" />
                    {vehicle.capacity} Kişi
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₺{vehicle.kmRate?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-xs text-gray-500">
                    per km
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(vehicle.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features && vehicle.features.length > 0 ? (
                      vehicle.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {feature}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">Özellik yok</span>
                    )}
                    {vehicle.features && vehicle.features.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{vehicle.features.length - 3} daha
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onShowDetails(vehicle)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditVehicle(vehicle)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onManageFeatures(vehicle)}
                      className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                      title="Özellikleri Yönet"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === vehicle.id ? null : vehicle.id)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                        title="Daha Fazla"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {showDropdown === vehicle.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleStatusChange(vehicle.id, 
                                vehicle.status === 'active' ? 'inactive' : 'active'
                              )}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {vehicle.status === 'active' ? 'Pasif Et' : 'Aktif Et'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(vehicle.id, 'maintenance')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Bakıma Al
                            </button>
                            <button
                              onClick={() => handleDelete(vehicle.id)}
                              disabled={deletingVehicle === vehicle.id}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingVehicle === vehicle.id ? 'Siliniyor...' : 'Sil'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;
