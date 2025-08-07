import React, { useState, useEffect } from 'react';
import { X, User, Car, Check, UserPlus, Share2, ChevronDown, QrCode } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { QRCodeModal } from '../../../components/QR/QRCodeUtils';
import { sendManualDriverWhatsApp } from '../../../utils/whatsappService';
import toast from 'react-hot-toast';

const DriverAssignModal = ({ reservation, drivers, vehicles, onClose, onAssign }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [assignmentType, setAssignmentType] = useState('system'); // 'system' or 'manual'
  const [loading, setLoading] = useState(false);
  const [manualDrivers, setManualDrivers] = useState([]); // Kayıtlı manuel şoförler
  const [selectedManualDriver, setSelectedManualDriver] = useState(''); // Seçilen manuel şoför
  const [isNewManualDriver, setIsNewManualDriver] = useState(false); // Yeni şoför mi?
  const [showQRModal, setShowQRModal] = useState(false); // QR Modal kontrolü
  
  // Manuel şoför bilgileri
  const [manualDriver, setManualDriver] = useState({
    name: '',
    phone: '',
    plateNumber: '',
    price: ''
  });

  // Kayıtlı manuel şoförleri getir
  useEffect(() => {
    const fetchManualDrivers = async () => {
      try {
        const manualDriversRef = collection(db, 'manual_drivers');
        const snapshot = await getDocs(manualDriversRef);
        const drivers = [];
        
        snapshot.docs.forEach(doc => {
          const driverData = doc.data();
          drivers.push({
            id: doc.id,
            ...driverData
          });
        });
        
        setManualDrivers(drivers);
      } catch (error) {
        // Hata durumunda sessizce yoksay, kullanıcıya bildirim gerekmez
      }
    };

    if (assignmentType === 'manual') {
      fetchManualDrivers();
    }
  }, [assignmentType]);

  // Manuel şoför seçimi
  const handleManualDriverSelect = (driverId) => {
    if (driverId === 'new') {
      setIsNewManualDriver(true);
      setSelectedManualDriver('');
      setManualDriver({
        name: '',
        phone: '',
        plateNumber: '',
        price: ''
      });
    } else {
      setIsNewManualDriver(false);
      setSelectedManualDriver(driverId);
      
      // Seçilen şoför bilgilerini form'a doldur
      const selectedDriver = manualDrivers.find(d => d.id === driverId);
      if (selectedDriver) {
        setManualDriver({
          name: selectedDriver.name || '',
          phone: selectedDriver.phone || '',
          plateNumber: selectedDriver.plateNumber || '',
          price: '' // Fiyatı her seferinde girmek gerekiyor
        });
      }
    }
  };

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
      // Manuel şoför seçimi veya yeni şoför ekleme kontrolü
      if (!selectedManualDriver && !isNewManualDriver) {
        alert('Lütfen bir şoför seçin veya yeni şoför ekleyin');
        return;
      }
      
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
        
        // Manuel şoföre WhatsApp gönder
        try {
          const whatsappSuccess = sendManualDriverWhatsApp(reservation, manualDriver);
          
          if (whatsappSuccess) {
            toast.success(`Şoför atandı! WhatsApp mesajı ${manualDriver.name} adlı şoföre gönderildi.`);
          } else {
            toast.warning(`Şoför atandı. WhatsApp mesajı gönderilemedi. Manuel olarak ${manualDriver.phone} numarasına mesaj gönderin.`);
          }
        } catch (whatsappError) {
          toast.error(`Şoför atandı. WhatsApp gönderiminde hata oluştu. Manuel olarak ${manualDriver.phone} numarasına mesaj gönderin.`);
        }
      }
    } catch (error) {
      toast.error('Şoför atama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Şoför Atama</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area with Scroll */}
                {/* Content Area with Scroll */}
        <div className="flex-1 overflow-y-auto">
          {/* Rezervasyon Özeti - Yenilenmiş Tasarım */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            {/* Rezervasyon ID */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-blue-200">
                <h3 className="text-md font-bold text-blue-800">{reservation.reservationId}</h3>
              </div>
            </div>

            {/* Ana Bilgiler - Kart Tasarımı */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sol Kart - Rota Bilgisi */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wide">Transfer Rotası</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Kalkış</p>
                      <p className="font-medium text-gray-900 leading-tight text-sm">
                        {formatLocation(reservation.tripDetails?.pickupLocation)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 border-l border-dashed border-gray-300 h-3"></div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Varış</p>
                      <p className="font-medium text-gray-900 leading-tight text-sm">
                        {formatLocation(reservation.tripDetails?.dropoffLocation)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ Kart - Diğer Bilgiler */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wide">Rezervasyon Detayları</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Müşteri</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Yolcu Sayısı</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {reservation.tripDetails?.passengerCount} kişi
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tarih & Saat</p>
                    <p className="font-medium text-gray-900 text-md">
                      {reservation.tripDetails?.date} - {reservation.tripDetails?.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Atama Türü Seçimi - Küçük Tasarım */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-3">
                Şoför Atama Türü
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentType('system');
                    setSelectedDriver('');
                  }}
                  className={`p-3 border rounded-lg transition-all flex items-center gap-3 ${
                    assignmentType === 'system'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Sistem Şoförü</div>
                    <div className="text-xs opacity-75">Kayıtlı şoförlerden seç</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentType('manual');
                    setSelectedDriver('');
                  }}
                  className={`p-3 border rounded-lg transition-all flex items-center gap-3 ${
                    assignmentType === 'manual'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Manuel Şoför</div>
                    <div className="text-xs opacity-75">Dış şoför bilgisi gir</div>
                  </div>
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
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Aktif şoför bulunamadı</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                    {activeDrivers.map((driver) => {
                      const assignedVehicle = vehicles.find(v => v.id === driver.assignedVehicle);
                      return (
                        <label
                          key={driver.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
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
                <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Manuel Şoför Seçimi
                </h4>
                
                {/* Manuel Şoför Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şoför Seçin
                  </label>
                  <div className="relative">
                    <select
                      value={selectedManualDriver || (isNewManualDriver ? 'new' : '')}
                      onChange={(e) => handleManualDriverSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                    >
                      <option value="">Şoför seçin...</option>
                      <option value="new">+ Yeni Şoför Ekle</option>
                      {manualDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - {driver.phone} ({driver.plateNumber})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Şoför Bilgileri Formu - Yeni şoför veya seçilen şoför için */}
                {(isNewManualDriver || selectedManualDriver) && (
                  <div className="space-y-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h5 className="text-md font-medium text-purple-700">
                      {isNewManualDriver ? 'Yeni Şoför Bilgileri' : 'Seçilen Şoför Bilgileri'}
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Şoför Adı Soyadı *
                        </label>
                        <input
                          type="text"
                          value={manualDriver.name}
                          onChange={(e) => setManualDriver(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isNewManualDriver && selectedManualDriver}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                            !isNewManualDriver && selectedManualDriver ? 'bg-gray-100 text-gray-600' : ''
                          }`}
                          placeholder="Örn: Ahmet Yılmaz"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon Numarası *
                        </label>
                        <input
                          type="tel"
                          value={manualDriver.phone}
                          onChange={(e) => setManualDriver(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isNewManualDriver && selectedManualDriver}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                            !isNewManualDriver && selectedManualDriver ? 'bg-gray-100 text-gray-600' : ''
                          }`}
                          placeholder="Örn: +90 555 123 45 67"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Araç Plakası *
                        </label>
                        <input
                          type="text"
                          value={manualDriver.plateNumber}
                          onChange={(e) => setManualDriver(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                          disabled={!isNewManualDriver && selectedManualDriver}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                            !isNewManualDriver && selectedManualDriver ? 'bg-gray-100 text-gray-600' : ''
                          }`}
                          placeholder="Örn: 34 ABC 1234"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seyahat Ücreti (€) *
                        </label>
                        <input
                          type="number"
                          value={manualDriver.price}
                          onChange={(e) => setManualDriver(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                          placeholder="Örn: 500"
                          min="0"
                          step="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Her rezervasyon için şoföre ödenecek hak ediş tutarı
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Share2 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">WhatsApp Gönderimi</p>
                      <p className="text-sm text-purple-600 mt-1">
                        Atama tamamlandığında şoföre WhatsApp ile rezervasyon detayları gönderilecek.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Action Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            İptal
          </button>
          
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="px-4 py-3 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 font-medium"
          >
            <QrCode className="w-4 h-4" />
            QR Kod
          </button>
          
          <button
            type="submit"
            form="driver-assign-form"
            onClick={handleSubmit}
            disabled={
              loading || 
              (assignmentType === 'system' && (!selectedDriver || activeDrivers.length === 0)) ||
              (assignmentType === 'manual' && (
                (!selectedManualDriver && !isNewManualDriver) ||
                !manualDriver.name || 
                !manualDriver.phone || 
                !manualDriver.plateNumber || 
                !manualDriver.price
              ))
            }
            className={`px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium ${
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
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal
          reservation={reservation}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default DriverAssignModal;
