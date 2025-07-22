import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Plus, 
  Edit3, 
  UserCheck, 
  User, 
  Car 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Add Reservation Modal Component
export const AddReservationModal = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    // Müşteri Bilgileri
    customerInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    // Yolculuk Detayları
    tripDetails: {
      date: '',
      time: '',
      pickupLocation: '',
      dropoffLocation: ''
    },
    // Yolcu Bilgileri
    passengerCount: 1,
    childCount: 0,
    luggageCount: 0,
    // Fiyat ve Durum
    totalPrice: 0,
    paymentStatus: 'pending',
    status: 'pending',
    specialRequests: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    // Validasyon
    if (!formData.customerInfo.firstName || !formData.customerInfo.lastName || 
        !formData.customerInfo.phone || !formData.tripDetails.date) {
      toast.error('Lütfen zorunlu alanları doldurunuz');
      return;
    }

    setIsAdding(true);
    try {
      const reservationData = {
        ...formData,
        reservationId: `SBS-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        paymentMethod: 'phone_order'
      };
      
      await onAdd(reservationData);
      toast.success('Rezervasyon başarıyla eklendi');
      onClose();
    } catch (error) {
      toast.error('Rezervasyon eklenirken hata oluştu');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Yeni Rezervasyon Ekle
              </h2>
              <p className="text-sm text-gray-500">
                Telefon ile gelen rezervasyonları manuel olarak ekleyin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol Kolon - Müşteri Bilgileri */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteri Bilgileri</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Ad *</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.customerInfo.firstName}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerInfo: { ...formData.customerInfo, firstName: e.target.value }
                        })}
                        placeholder="Müşteri adı"
                      />
                    </div>
                    <div>
                      <label className="label">Soyad *</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.customerInfo.lastName}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerInfo: { ...formData.customerInfo, lastName: e.target.value }
                        })}
                        placeholder="Müşteri soyadı"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Telefon *</label>
                    <input
                      type="tel"
                      className="input"
                      value={formData.customerInfo.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        customerInfo: { ...formData.customerInfo, phone: e.target.value }
                      })}
                      placeholder="+90 555 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="label">E-posta</label>
                    <input
                      type="email"
                      className="input"
                      value={formData.customerInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        customerInfo: { ...formData.customerInfo, email: e.target.value }
                      })}
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Yolcu Bilgileri */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yolcu Bilgileri</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Yetişkin</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        className="input"
                        value={formData.passengerCount}
                        onChange={(e) => setFormData({
                          ...formData,
                          passengerCount: parseInt(e.target.value) || 1
                        })}
                      />
                    </div>
                    <div>
                      <label className="label">Çocuk</label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        className="input"
                        value={formData.childCount}
                        onChange={(e) => setFormData({
                          ...formData,
                          childCount: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div>
                      <label className="label">Bagaj</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        className="input"
                        value={formData.luggageCount}
                        onChange={(e) => setFormData({
                          ...formData,
                          luggageCount: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Yolculuk Detayları */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yolculuk Detayları</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Tarih *</label>
                      <input
                        type="date"
                        className="input"
                        value={formData.tripDetails.date}
                        onChange={(e) => setFormData({
                          ...formData,
                          tripDetails: { ...formData.tripDetails, date: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="label">Saat</label>
                      <input
                        type="time"
                        className="input"
                        value={formData.tripDetails.time}
                        onChange={(e) => setFormData({
                          ...formData,
                          tripDetails: { ...formData.tripDetails, time: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Kalkış Noktası *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.tripDetails.pickupLocation}
                      onChange={(e) => setFormData({
                        ...formData,
                        tripDetails: { ...formData.tripDetails, pickupLocation: e.target.value }
                      })}
                      placeholder="Örn: İstanbul Havalimanı"
                    />
                  </div>

                  <div>
                    <label className="label">Varış Noktası *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.tripDetails.dropoffLocation}
                      onChange={(e) => setFormData({
                        ...formData,
                        tripDetails: { ...formData.tripDetails, dropoffLocation: e.target.value }
                      })}
                      placeholder="Örn: Taksim Hotel"
                    />
                  </div>
                </div>
              </div>

              {/* Fiyat ve Durum */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fiyat ve Durum</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Toplam Fiyat (€)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="input"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData({
                        ...formData,
                        totalPrice: parseFloat(e.target.value) || 0
                      })}
                      placeholder="0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Rezervasyon Durumu</label>
                      <select
                        className="input"
                        value={formData.status}
                        onChange={(e) => setFormData({
                          ...formData,
                          status: e.target.value
                        })}
                      >
                        <option value="pending">Bekleyen</option>
                        <option value="confirmed">Onaylandı</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Ödeme Durumu</label>
                      <select
                        className="input"
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentStatus: e.target.value
                        })}
                      >
                        <option value="pending">Bekleyen</option>
                        <option value="paid">Ödendi</option>
                        <option value="unpaid">Ödenmedi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Özel İstekler</label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({
                        ...formData,
                        specialRequests: e.target.value
                      })}
                      placeholder="Özel istekler, notlar..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isAdding}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Ekleniyor...' : 'Rezervasyon Ekle'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Edit Reservation Modal Component
export const EditReservationModal = ({ reservation, onUpdate, onClose }) => {
  const [editData, setEditData] = useState({
    tripDetails: {
      date: reservation.tripDetails?.date || '',
      time: reservation.tripDetails?.time || '',
      pickupLocation: reservation.tripDetails?.pickupLocation || '',
      dropoffLocation: reservation.tripDetails?.dropoffLocation || ''
    },
    customerInfo: {
      firstName: reservation.customerInfo?.firstName || '',
      lastName: reservation.customerInfo?.lastName || '',
      phone: reservation.customerInfo?.phone || '',
      email: reservation.customerInfo?.email || ''
    },
    totalPrice: reservation.totalPrice || 0,
    specialRequests: reservation.specialRequests || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(reservation.id, editData);
      toast.success('Rezervasyon başarıyla güncellendi');
      onClose();
    } catch (error) {
      toast.error('Rezervasyon güncellenemedi');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content max-w-3xl"
      >
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Edit3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Rezervasyon Düzenle
              </h2>
              <p className="text-sm text-gray-500">
                {reservation.reservationId || `SBS-${reservation.id?.slice(-6)}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trip Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Yolculuk Detayları</h4>
              
              <div>
                <label className="label">Tarih</label>
                <input
                  type="date"
                  className="input"
                  value={editData.tripDetails.date}
                  onChange={(e) => setEditData({
                    ...editData,
                    tripDetails: { ...editData.tripDetails, date: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Saat</label>
                <input
                  type="time"
                  className="input"
                  value={editData.tripDetails.time}
                  onChange={(e) => setEditData({
                    ...editData,
                    tripDetails: { ...editData.tripDetails, time: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Kalkış Noktası</label>
                <input
                  type="text"
                  className="input"
                  value={editData.tripDetails.pickupLocation}
                  onChange={(e) => setEditData({
                    ...editData,
                    tripDetails: { ...editData.tripDetails, pickupLocation: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Varış Noktası</label>
                <input
                  type="text"
                  className="input"
                  value={editData.tripDetails.dropoffLocation}
                  onChange={(e) => setEditData({
                    ...editData,
                    tripDetails: { ...editData.tripDetails, dropoffLocation: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Toplam Fiyat (€)</label>
                <input
                  type="number"
                  className="input"
                  value={editData.totalPrice}
                  onChange={(e) => setEditData({
                    ...editData,
                    totalPrice: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Müşteri Bilgileri</h4>
              
              <div>
                <label className="label">Ad</label>
                <input
                  type="text"
                  className="input"
                  value={editData.customerInfo.firstName}
                  onChange={(e) => setEditData({
                    ...editData,
                    customerInfo: { ...editData.customerInfo, firstName: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Soyad</label>
                <input
                  type="text"
                  className="input"
                  value={editData.customerInfo.lastName}
                  onChange={(e) => setEditData({
                    ...editData,
                    customerInfo: { ...editData.customerInfo, lastName: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Telefon</label>
                <input
                  type="tel"
                  className="input"
                  value={editData.customerInfo.phone}
                  onChange={(e) => setEditData({
                    ...editData,
                    customerInfo: { ...editData.customerInfo, phone: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">E-posta</label>
                <input
                  type="email"
                  className="input"
                  value={editData.customerInfo.email}
                  onChange={(e) => setEditData({
                    ...editData,
                    customerInfo: { ...editData.customerInfo, email: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="label">Özel İstekler</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  value={editData.specialRequests}
                  onChange={(e) => setEditData({
                    ...editData,
                    specialRequests: e.target.value
                  })}
                  placeholder="Özel istekler varsa yazınız..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            İptal
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Driver Assignment Component
export const DriverAssignmentModal = ({ reservation, drivers, vehicles, onAssign, onClose }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Available drivers (active status)
  const availableDrivers = drivers.filter(driver => driver.status === 'active');

  // Available vehicles for selected driver
  const availableVehicles = selectedDriver 
    ? vehicles.filter(vehicle => 
        vehicle.driverId === selectedDriver.id && 
        vehicle.status === 'active'
      )
    : [];

  const handleAssignment = async () => {
    if (!selectedDriver || !selectedVehicle) {
      toast.error('Lütfen şoför ve araç seçiniz');
      return;
    }

    setIsAssigning(true);
    try {
      await onAssign(reservation.id, selectedDriver.id, selectedVehicle.id);
      toast.success('Şoför başarıyla atandı');
      onClose();
    } catch (error) {
      toast.error('Şoför ataması başarısız oldu');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content max-w-2xl"
      >
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Şoför Atama
              </h2>
              <p className="text-sm text-gray-500">
                {reservation.reservationId || `SBS-${reservation.id?.slice(-6)}`} - 
                {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-6">
            {/* Trip Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Yolculuk Detayları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tarih:</span>
                  <span className="ml-2 font-medium">
                    {reservation.tripDetails?.date ? 
                      new Date(reservation.tripDetails.date).toLocaleDateString('tr-TR') : 
                      'Belirtilmemiş'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Saat:</span>
                  <span className="ml-2 font-medium">
                    {reservation.tripDetails?.time || 'Belirtilmemiş'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Kalkış:</span>
                  <span className="ml-2 font-medium">
                    {reservation.tripDetails?.pickupLocation || 'Belirtilmemiş'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Varış:</span>
                  <span className="ml-2 font-medium">
                    {reservation.tripDetails?.dropoffLocation || 'Belirtilmemiş'}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Şoför Seçimi</h4>
              {availableDrivers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Uygun şoför bulunamadı</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {availableDrivers.map(driver => (
                    <motion.div
                      key={driver.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDriver(driver)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDriver?.id === driver.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {driver.firstName} {driver.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{driver.phone}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Selection */}
            {selectedDriver && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Araç Seçimi</h4>
                {availableVehicles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Seçilen şoför için uygun araç bulunamadı</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableVehicles.map(vehicle => (
                      <motion.div
                        key={vehicle.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedVehicle?.id === vehicle.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Car className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {vehicle.brand} {vehicle.model}
                            </p>
                            <p className="text-sm text-gray-500">
                              {vehicle.plateNumber} • {vehicle.capacity} kişi
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="btn btn-outline"
              >
                İptal
              </button>
              <button
                onClick={handleAssignment}
                disabled={!selectedDriver || !selectedVehicle || isAssigning}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAssigning ? 'Atanıyor...' : 'Şoförü Ata'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
