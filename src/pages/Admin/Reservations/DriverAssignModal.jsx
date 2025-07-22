import React, { useState } from 'react';
import { X, User, Car, Check, UserPlus, Share2 } from 'lucide-react';

const DriverAssignModal = ({ reservation, drivers, vehicles, onClose, onAssign }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [assignmentType, setAssignmentType] = useState('system'); // 'system' or 'manual'
  const [loading, setLoading] = useState(false);
  
  // Manuel şoför bilgileri
  const [manualDriver, setManualDriver] = useState({
    name: '',
    phone: '',
    plateNumber: '',
    price: ''
  });

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
    
    if (assignmentType === 'system' && !selectedDriver) {
      alert('Lütfen şoför seçin');
      return;
    }
    
    if (assignmentType === 'manual') {
      if (!manualDriver.name || !manualDriver.phone || !manualDriver.plateNumber || !manualDriver.price) {
        alert('Lütfen tüm manuel şoför bilgilerini doldurun');
        return;
      }
    }

    setLoading(true);
    
    try {
      if (assignmentType === 'system') {
        // Sistemdeki şoför ataması
        const driver = drivers.find(d => d.id === selectedDriver);
        const vehicleId = driver?.assignedVehicle || null;
        await onAssign(reservation.id, selectedDriver, vehicleId);
      } else {
        // Manuel şoför ataması - özel işlem
        await onAssign(reservation.id, null, null, manualDriver);
      }
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
          {/* Atama Türü Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Atama Türü *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAssignmentType('system');
                  setSelectedDriver('');
                }}
                className={`p-4 border rounded-lg transition-all ${
                  assignmentType === 'system'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Sistem Şoförü</div>
                <div className="text-xs text-gray-500">Kayıtlı şoförlerden seç</div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAssignmentType('manual');
                  setSelectedDriver('');
                }}
                className={`p-4 border rounded-lg transition-all ${
                  assignmentType === 'manual'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <UserPlus className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Manuel Şoför</div>
                <div className="text-xs text-gray-500">Dış şoför bilgisi gir</div>
              </button>
            </div>
          </div>

          {/* Sistem Şoförü Seçimi */}
          {assignmentType === 'system' && (
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
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
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
                        <div className="flex-1">
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
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Manuel Şoför Bilgileri */}
          {assignmentType === 'manual' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Dış Şoför Bilgileri
              </h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Şoför Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    value={manualDriver.name}
                    onChange={(e) => setManualDriver(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Telefon Numarası *
                  </label>
                  <input
                    type="tel"
                    value={manualDriver.phone}
                    onChange={(e) => setManualDriver(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Örn: +90 555 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Araç Plakası *
                  </label>
                  <input
                    type="text"
                    value={manualDriver.plateNumber}
                    onChange={(e) => setManualDriver(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Örn: 34 ABC 1234"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Seyahat Ücreti (₺) *
                  </label>
                  <input
                    type="number"
                    value={manualDriver.price}
                    onChange={(e) => setManualDriver(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Örn: 500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Share2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-purple-800">WhatsApp Gönderimi</p>
                    <p className="text-xs text-purple-600 mt-1">
                      Atama tamamlandığında şoföre WhatsApp ile rezervasyon detayları gönderilecek.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              disabled={
                loading || 
                (assignmentType === 'system' && (!selectedDriver || activeDrivers.length === 0)) ||
                (assignmentType === 'manual' && (!manualDriver.name || !manualDriver.phone || !manualDriver.plateNumber || !manualDriver.price))
              }
              className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                assignmentType === 'system' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Atanıyor...
                </>
              ) : (
                <>
                  {assignmentType === 'system' ? <User className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {assignmentType === 'system' ? 'Şoför Ata' : 'Manuel Ata & WhatsApp Gönder'}
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
