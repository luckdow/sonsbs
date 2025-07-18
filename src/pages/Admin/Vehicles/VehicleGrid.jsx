import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  Calendar, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  Settings,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

const VehicleGrid = ({ 
  vehicles, 
  onShowDetails, 
  onEditVehicle, 
  onDeleteVehicle, 
  onStatusChange,
  onManageFeatures 
}) => {
  const [showDropdown, setShowDropdown] = useState(null);

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

  const handleStatusChange = async (vehicleId, newStatus) => {
    const success = await onStatusChange(vehicleId, newStatus);
    if (success) {
      setShowDropdown(null);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      await onDeleteVehicle(vehicleId);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz araç yok</h3>
        <p className="text-gray-600">İlk aracınızı ekleyerek başlayın.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <motion.div
          key={vehicle.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          {/* Araç Resmi */}
          <div className="relative h-48 bg-gray-100">
            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl">
                  {getVehicleTypeIcon(vehicle.type)}
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              {getStatusBadge(vehicle.status)}
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-3 right-3">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === vehicle.id ? null : vehicle.id)}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-700" />
                </button>
                
                {showDropdown === vehicle.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => onShowDetails(vehicle)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                        Detayları Görüntüle
                      </button>
                      <button
                        onClick={() => onEditVehicle(vehicle)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit3 className="w-4 h-4" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => onManageFeatures(vehicle)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4" />
                        Özellikleri Yönet
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => handleStatusChange(vehicle.id, 
                          vehicle.status === 'active' ? 'inactive' : 'active'
                        )}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {vehicle.status === 'active' ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Pasif Et
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Aktif Et
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleStatusChange(vehicle.id, 'maintenance')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Bakıma Al
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Araç Bilgileri */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-gray-600 text-sm">
                  {vehicle.year} • {vehicle.plateNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  ₺{vehicle.kmRate?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">per km</p>
              </div>
            </div>

            {/* Hızlı Bilgiler */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{vehicle.capacity} Kişi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Car className="w-4 h-4" />
                <span className="capitalize">{vehicle.type}</span>
              </div>
            </div>

            {/* Renk ve Yakıt */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span>{vehicle.color}</span>
              <span>•</span>
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>

            {/* Özellikler */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Özellikler</h4>
              {vehicle.features && vehicle.features.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                    >
                      <Shield className="w-3 h-3" />
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                      +{vehicle.features.length - 3} daha
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Henüz özellik eklenmemiş</p>
              )}
            </div>

            {/* Hızlı Aksiyonlar */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShowDetails(vehicle)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  title="Detayları Görüntüle"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditVehicle(vehicle)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                  title="Düzenle"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onManageFeatures(vehicle)}
                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                  title="Özellikleri Yönet"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">
                  {vehicle.rating || '4.5'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VehicleGrid;
