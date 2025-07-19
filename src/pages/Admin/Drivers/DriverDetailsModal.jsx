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
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-blue-200">
              <span className="text-2xl font-bold text-blue-700">
                {(driver.firstName || '')[0] || ''}{(driver.lastName || '')[0] || ''}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {driver.firstName || ''} {driver.lastName || ''}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(driver.status)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors border border-blue-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ehliyet Uyarısı */}
          {licenseStatus.urgent && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className={`font-semibold ${licenseStatus.color}`}>
                  Ehliyet Uyarısı: {licenseStatus.label}
                </span>
              </div>
            </div>
          )}

          {/* Ana Bilgiler - Yatay Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Kolon */}
            <div className="space-y-4">
              {/* Kişisel Bilgiler */}
              <div className="bg-gradient-to-br from-blue-100/30 to-white/60 rounded-xl p-5 border border-blue-100 shadow">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
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
              <div className="bg-gradient-to-br from-blue-100/30 to-white/60 rounded-xl p-5 border border-blue-100 shadow">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
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
            <div className="bg-gradient-to-br from-blue-100/30 to-white/60 rounded-xl p-5 border border-blue-100 shadow">
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
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
            <div className="bg-gradient-to-br from-blue-100/30 to-white/60 rounded-xl p-5 border border-blue-100 shadow">
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
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
        <div className="flex justify-end p-6 border-t border-slate-200 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;
