import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Car, 
  Users, 
  Calendar, 
  MapPin, 
  Fuel, 
  Settings as SettingsIcon,
  Star,
  Shield,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

const VehicleDetailsModal = ({ vehicle, onClose }) => {
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        color: 'bg-green-100 text-green-800', 
        text: 'Aktif' 
      },
      inactive: { 
        color: 'bg-red-100 text-red-800', 
        text: 'Pasif' 
      },
      maintenance: { 
        color: 'bg-yellow-100 text-yellow-800', 
        text: 'Bakımda' 
      }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Belirtilmemiş';
    
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            Araç Detayları
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Araç Resmi */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-6xl">
                    {getVehicleTypeIcon(vehicle.type)}
                  </div>
                )}
              </div>
              
              {/* Durum */}
              <div className="flex justify-center mb-4">
                {getStatusBadge(vehicle.status)}
              </div>

              {/* Hızlı Bilgiler */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kapasite</p>
                    <p className="text-sm text-gray-600">{vehicle.capacity} Kişi</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">KM Ücreti</p>
                    <p className="text-sm text-gray-600">₺{vehicle.kmRate?.toFixed(2)} / km</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Fuel className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yakıt Türü</p>
                    <p className="text-sm text-gray-600 capitalize">{vehicle.fuelType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detaylı Bilgiler */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Temel Bilgiler
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Marka</label>
                      <p className="text-sm text-gray-900">{vehicle.brand}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Model</label>
                      <p className="text-sm text-gray-900">{vehicle.model}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Yıl</label>
                      <p className="text-sm text-gray-900">{vehicle.year}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plaka</label>
                      <p className="text-sm text-gray-900 font-mono">{vehicle.plateNumber}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Renk</label>
                      <p className="text-sm text-gray-900">{vehicle.color}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tip</label>
                      <p className="text-sm text-gray-900 capitalize">{vehicle.type}</p>
                    </div>
                  </div>
                </div>

                {/* Teknik Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Teknik Bilgiler
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kapasite</label>
                      <p className="text-sm text-gray-900">{vehicle.capacity} Kişi</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">KM Başı Ücret</label>
                      <p className="text-sm text-gray-900">₺{vehicle.kmRate?.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Yakıt Türü</label>
                      <p className="text-sm text-gray-900 capitalize">{vehicle.fuelType}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Şanzıman</label>
                      <p className="text-sm text-gray-900 capitalize">{vehicle.transmission}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Oluşturma Tarihi</label>
                      <p className="text-sm text-gray-900">{formatDate(vehicle.createdAt)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Son Güncelleme</label>
                      <p className="text-sm text-gray-900">{formatDate(vehicle.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Özellikler */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                  Araç Özellikleri
                </h3>
                {vehicle.features && vehicle.features.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Henüz özellik eklenmemiş</p>
                )}
              </div>

              {/* Açıklama */}
              {vehicle.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                    Açıklama
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {vehicle.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleDetailsModal;
