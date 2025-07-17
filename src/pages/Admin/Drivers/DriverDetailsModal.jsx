import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Car,
  CreditCard,
  AlertTriangle,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';

const DriverDetailsModal = ({ 
  isOpen, 
  onClose, 
  driver,
  vehicles = [] 
}) => {
  if (!isOpen || !driver) return null;

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

  const licenseStatus = getLicenseStatus(driver.licenseExpiry);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600">
                {(driver.firstName || '')[0] || ''}{(driver.lastName || '')[0] || ''}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {driver.firstName || ''} {driver.lastName || ''}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(driver.status)}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Ehliyet Uyarısı */}
          {licenseStatus.urgent && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className={`font-medium ${licenseStatus.color}`}>
                  Ehliyet Uyarısı: {licenseStatus.label}
                </span>
              </div>
            </div>
          )}

          {/* Ana Bilgiler - Yatay Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sol Kolon */}
            <div className="space-y-4">
              {/* Kişisel Bilgiler */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Kişisel Bilgiler
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <p className="font-medium">{driver.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">E-posta:</span>
                    <p className="font-medium">{driver.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kan Grubu:</span>
                    <p className="font-medium">{driver.bloodType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">İşe Başlama:</span>
                    <p className="font-medium">{new Date(driver.joinDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              {/* İletişim */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  İletişim
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-500">Adres:</span>
                    <p className="font-medium">{driver.address}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Acil Durum:</span>
                    <p className="font-medium">{driver.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-4">
              {/* Lisans ve Araç */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Lisans & Araç
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-500">Ehliyet No:</span>
                    <p className="font-medium">{driver.licenseNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Geçerlilik:</span>
                    <p className={`font-medium ${licenseStatus.color}`}>
                      {new Date(driver.licenseExpiry).toLocaleDateString('tr-TR')} ({licenseStatus.label})
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Atanan Araç:</span>
                    <p className="font-medium">{getVehicleName(driver.assignedVehicle)}</p>
                  </div>
                </div>
              </div>

              {/* Finansal ve Performans */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Finansal & Performans
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Komisyon:</span>
                    <p className="font-medium text-green-600">%{driver.commission || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Toplam Sefer:</span>
                    <p className="font-medium">{driver.totalTrips}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Aylık Ort.:</span>
                    <p className="font-medium">{Math.round(driver.totalTrips / 12)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Durum:</span>
                    <p className="font-medium">{driver.status === 'active' ? 'Aktif' : 'Pasif'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;
