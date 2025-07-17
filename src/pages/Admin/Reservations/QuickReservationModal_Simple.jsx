import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, User, CreditCard } from 'lucide-react';

const QuickReservationModal = ({ onClose, onSubmit }) => {
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
      dropoffLocation: 'Antalya Havalimanı',
      passengerCount: 1,
      luggageCount: 0,
      flightNumber: ''
    },
    paymentMethod: 'cash',
    totalPrice: 0
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
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
    
    if (!formData.tripDetails.date) {
      newErrors['tripDetails.date'] = 'Tarih zorunludur';
    }
    if (!formData.tripDetails.time) {
      newErrors['tripDetails.time'] = 'Saat zorunludur';
    }
    if (!formData.tripDetails.pickupLocation.trim()) {
      newErrors['tripDetails.pickupLocation'] = 'Kalkış noktası zorunludur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Rezervasyon ekleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Hızlı Rezervasyon Ekle</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Müşteri Bilgileri */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Müşteri Bilgileri</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad *
                </label>
                <input
                  type="text"
                  value={formData.customerInfo.firstName}
                  onChange={(e) => handleInputChange('customerInfo', 'firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.firstName'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Müşteri adı"
                />
                {errors['customerInfo.firstName'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.firstName']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad *
                </label>
                <input
                  type="text"
                  value={formData.customerInfo.lastName}
                  onChange={(e) => handleInputChange('customerInfo', 'lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.lastName'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Müşteri soyadı"
                />
                {errors['customerInfo.lastName'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.lastName']}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.customerInfo.phone}
                  onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.phone'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+90 555 123 45 67"
                />
                {errors['customerInfo.phone'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.phone']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={formData.customerInfo.email}
                  onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customerInfo.email'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ornek@email.com"
                />
                {errors['customerInfo.email'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['customerInfo.email']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seyahat Bilgileri */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Seyahat Bilgileri</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih *
                </label>
                <input
                  type="date"
                  value={formData.tripDetails.date}
                  onChange={(e) => handleInputChange('tripDetails', 'date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['tripDetails.date'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['tripDetails.date'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['tripDetails.date']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saat *
                </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kalkış Noktası *
              </label>
              <input
                type="text"
                value={formData.tripDetails.pickupLocation}
                onChange={(e) => handleInputChange('tripDetails', 'pickupLocation', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['tripDetails.pickupLocation'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Kalkış adresini yazın... (Örn: Lara Plajı, Konyaaltı)"
              />
              {errors['tripDetails.pickupLocation'] && (
                <p className="text-red-500 text-xs mt-1">{errors['tripDetails.pickupLocation']}</p>
              )}
              <p className="text-xs text-blue-600 mt-1">💡 Google Places entegrasyonu sonraki güncellemede eklenecek</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Varış Noktası
              </label>
              <input
                type="text"
                value={formData.tripDetails.dropoffLocation}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Varış noktası sabit: Antalya Havalimanı</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yolcu Sayısı
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bagaj Adedi
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uçuş No
                </label>
                <input
                  type="text"
                  value={formData.tripDetails.flightNumber}
                  onChange={(e) => handleInputChange('tripDetails', 'flightNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TK123 (opsiyonel)"
                />
              </div>
            </div>
          </div>

          {/* Ödeme Yöntemi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Ödeme Yöntemi</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'cash', label: 'Nakit', desc: 'Araçta ödeme' },
                { value: 'card', label: 'Kredi Kartı', desc: 'Online ödeme' },
                { value: 'transfer', label: 'Havale', desc: 'Banka havalesi' }
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{method.label}</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="text-blue-600"
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{method.desc}</span>
                </label>
              ))}
            </div>
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
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Rezervasyon Ekle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickReservationModal;
