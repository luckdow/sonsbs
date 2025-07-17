import React, { useState, useEffect } from 'react';
import { X, Edit, Save } from 'lucide-react';

const EditReservationModal = ({ reservation, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    customerInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    tripDetails: {
      date: '',
      time: '',
      pickupLocation: '',
      dropoffLocation: '',
      passengerCount: 1,
      luggageCount: 0,
      flightNumber: ''
    },
    paymentMethod: 'cash',
    totalPrice: 0
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Antalya popüler lokasyonları
  const popularLocations = [
    'Lara Kundu Otelleri',
    'Kaleici Otelleri',
    'Belek Otelleri',
    'Side Otelleri',
    'Alanya Otelleri',
    'Kemer Otelleri',
    'Antalya Merkez',
    'Kepez',
    'Muratpaşa',
    'Aksu'
  ];

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerInfo: reservation.customerInfo || {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        },
        tripDetails: reservation.tripDetails || {
          date: '',
          time: '',
          pickupLocation: '',
          dropoffLocation: '',
          passengerCount: 1,
          luggageCount: 0,
          flightNumber: ''
        },
        paymentMethod: reservation.paymentMethod || 'cash',
        totalPrice: reservation.totalPrice || 0
      });
    }
  }, [reservation]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Hata temizle
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Müşteri bilgileri
    if (!formData.customerInfo.firstName.trim()) {
      newErrors['customerInfo.firstName'] = 'Ad zorunludur';
    }
    if (!formData.customerInfo.lastName.trim()) {
      newErrors['customerInfo.lastName'] = 'Soyad zorunludur';
    }
    if (!formData.customerInfo.phone.trim()) {
      newErrors['customerInfo.phone'] = 'Telefon zorunludur';
    }
    if (!formData.customerInfo.email.trim()) {
      newErrors['customerInfo.email'] = 'E-posta zorunludur';
    }
    
    // Seyahat bilgileri
    if (!formData.tripDetails.date) {
      newErrors['tripDetails.date'] = 'Tarih zorunludur';
    }
    if (!formData.tripDetails.time) {
      newErrors['tripDetails.time'] = 'Saat zorunludur';
    }
    if (!formData.tripDetails.pickupLocation.trim()) {
      newErrors['tripDetails.pickupLocation'] = 'Kalkış noktası zorunludur';
    }
    if (!formData.tripDetails.dropoffLocation.trim()) {
      newErrors['tripDetails.dropoffLocation'] = 'Varış noktası zorunludur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const updatedReservation = {
        ...reservation,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      await onUpdate(updatedReservation);
    } catch (error) {
      console.error('Rezervasyon güncelleme hatası:', error);
      alert('Rezervasyon güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Rezervasyon Düzenle - {reservation.reservationId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Kolon - Müşteri Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteri Bilgileri</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                <input
                  type="text"
                  value={formData.customerInfo.firstName}
                  onChange={(e) => handleInputChange('customerInfo', 'firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.firstName'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['customerInfo.firstName'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.firstName']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
                <input
                  type="text"
                  value={formData.customerInfo.lastName}
                  onChange={(e) => handleInputChange('customerInfo', 'lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.lastName'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['customerInfo.lastName'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.lastName']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  value={formData.customerInfo.phone}
                  onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.phone'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['customerInfo.phone'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.phone']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                <input
                  type="email"
                  value={formData.customerInfo.email}
                  onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.email'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['customerInfo.email'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.email']}</p>
                )}
              </div>
            </div>

            {/* Sağ Kolon - Seyahat Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Seyahat Bilgileri</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
                  <input
                    type="date"
                    value={formData.tripDetails.date}
                    onChange={(e) => handleInputChange('tripDetails', 'date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors['tripDetails.date'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['tripDetails.date'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['tripDetails.date']}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saat *</label>
                  <input
                    type="time"
                    value={formData.tripDetails.time}
                    onChange={(e) => handleInputChange('tripDetails', 'time', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors['tripDetails.time'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['tripDetails.time'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['tripDetails.time']}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kalkış Noktası *</label>
                <select
                  value={formData.tripDetails.pickupLocation}
                  onChange={(e) => handleInputChange('tripDetails', 'pickupLocation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['tripDetails.pickupLocation'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Kalkış noktası seçin</option>
                  <option value="Antalya Havalimanı">Antalya Havalimanı</option>
                  {popularLocations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors['tripDetails.pickupLocation'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['tripDetails.pickupLocation']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Varış Noktası *</label>
                <select
                  value={formData.tripDetails.dropoffLocation}
                  onChange={(e) => handleInputChange('tripDetails', 'dropoffLocation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['tripDetails.dropoffLocation'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Varış noktası seçin</option>
                  <option value="Antalya Havalimanı">Antalya Havalimanı</option>
                  {popularLocations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors['tripDetails.dropoffLocation'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['tripDetails.dropoffLocation']}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yolcu</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.tripDetails.passengerCount}
                    onChange={(e) => handleInputChange('tripDetails', 'passengerCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bagaj</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.tripDetails.luggageCount}
                    onChange={(e) => handleInputChange('tripDetails', 'luggageCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalPrice: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uçuş Numarası</label>
                <input
                  type="text"
                  value={formData.tripDetails.flightNumber}
                  onChange={(e) => handleInputChange('tripDetails', 'flightNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TK123 (opsiyonel)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Nakit</option>
                  <option value="card">Kredi Kartı</option>
                  <option value="transfer">Havale</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
