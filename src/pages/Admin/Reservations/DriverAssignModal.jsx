import React, { useState } from 'react';
import { X, User, Car, Check } from 'lucide-react';

const DriverAssignModal = ({ reservation, drivers, vehicles, onClose, onAssign }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(false);

  // Location objelerini string'e dönüştürme helper
  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return String(location.address);
      if (location.name) return String(location.name);
      if (location.formatted_address) return String(location.formatted_address);
      if (location.description) return String(location.description);
      return 'Lokasyon bilgisi mevcut';
    }
    return String(location);
  };

  // Aktif şoförleri filtrele
  const activeDrivers = drivers.filter(driver => driver.status === 'active');
  
  // Şoför seçimi
  const handleDriverSelect = (driverId) => {
    setSelectedDriver(driverId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDriver) {
      alert('Lütfen şoför seçin');
      return;
    }

    setLoading(true);
    
    try {
      // Seçilen şoförün atanmış aracını kullan, yoksa null gönder
      const driver = drivers.find(d => d.id === selectedDriver);
      const vehicleId = driver?.assignedVehicle || null;
      
      await onAssign(reservation.id, selectedDriver, vehicleId);
    } catch (error) {
      console.error('Şoför atama hatası:', error);
      alert('Şoför atama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Şoför Atama</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rezervasyon Özeti */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">{reservation.reservationId}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Müşteri:</strong> {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}</p>
            <p><strong>Tarih:</strong> {reservation.tripDetails?.date} - {reservation.tripDetails?.time}</p>
            <p><strong>Rota:</strong> {formatLocation(reservation.tripDetails?.pickupLocation)} → {formatLocation(reservation.tripDetails?.dropoffLocation)}</p>
            <p><strong>Yolcu:</strong> {reservation.tripDetails?.passengerCount} kişi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Şoför Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Şoför Seçin *
            </label>
            
            {activeDrivers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Aktif şoför bulunamadı</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activeDrivers.map((driver) => {
                  const assignedVehicle = vehicles.find(v => v.id === driver.assignedVehicle);
                  return (
                    <label
                      key={driver.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDriver === driver.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="driver"
                        value={driver.id}
                        checked={selectedDriver === driver.id}
                        onChange={() => handleDriverSelect(driver.id)}
                        className="sr-only"
                      />
                      <div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {driver.firstName && driver.lastName 
                              ? `${driver.firstName} ${driver.lastName}`
                              : driver.name || driver.email || 'İsimsiz Şoför'
                            }
                          </p>
                          <p className="text-sm text-gray-600">{driver.phone || 'Telefon belirtilmemiş'}</p>
                          <p className="text-xs text-gray-500">
                            Ehliyet: {driver.licenseNumber || 'Belirtilmemiş'}
                          </p>
                          {driver.assignedVehicle && (
                            <p className="text-xs text-green-600">
                              ✓ Atanmış araç: {
                                vehicles.find(v => v.id === driver.assignedVehicle)?.plateNumber || 
                                'Araç bilgisi bulunamadı'
                              }
                            </p>
                          )}
                          {!driver.assignedVehicle && (
                            <p className="text-xs text-orange-600">
                              ⚠ Atanmış araç yok
                            </p>
                          )}
                        </div>
                        {selectedDriver === driver.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              İptal
            </button>
            
            <button
              type="submit"
              disabled={loading || !selectedDriver || activeDrivers.length === 0}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Atanıyor...
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Şoför Ata
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverAssignModal;
