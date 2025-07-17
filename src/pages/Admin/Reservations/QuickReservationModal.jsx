import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, User, CreditCard, Plane } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

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
    transferDirection: 'to_airport', // 'to_airport' veya 'from_airport'
    paymentMethod: 'cash',
    totalPrice: 0
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [autocompletePickup, setAutocompletePickup] = useState(null);
  const [autocompleteDropoff, setAutocompleteDropoff] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw',
    libraries
  });

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

  const handleDirectionChange = (direction) => {
    setFormData(prev => ({
      ...prev,
      transferDirection: direction,
      tripDetails: {
        ...prev.tripDetails,
        pickupLocation: direction === 'to_airport' ? '' : 'Antalya Havalimanı',
        dropoffLocation: direction === 'to_airport' ? 'Antalya Havalimanı' : ''
      }
    }));
  };

  const onLoadPickup = (autocomplete) => {
    setAutocompletePickup(autocomplete);
  };

  const onLoadDropoff = (autocomplete) => {
    setAutocompleteDropoff(autocomplete);
  };

  const onPickupChanged = () => {
    if (autocompletePickup !== null) {
      const place = autocompletePickup.getPlace();
      setFormData(prev => ({
        ...prev,
        tripDetails: {
          ...prev.tripDetails,
          pickupLocation: place.formatted_address
        }
      }));
    }
  };

  const onDropoffChanged = () => {
    if (autocompleteDropoff !== null) {
      const place = autocompleteDropoff.getPlace();
      setFormData(prev => ({
        ...prev,
        tripDetails: {
          ...prev.tripDetails,
          dropoffLocation: place.formatted_address
        }
      }));
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
      // Fiyat hesaplama (basit)
      const basePrice = 100;
      const distance = Math.random() * 50 + 10; // Mock mesafe
      const calculatedPrice = Math.round(basePrice + (distance * 2));
      
      const reservationData = {
        ...formData,
        totalPrice: calculatedPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSubmit(reservationData);
    } catch (error) {
      console.error('Rezervasyon ekleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol Kolon - Müşteri Bilgileri */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Müşteri Bilgileri</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
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

            {/* Sağ Kolon - Seyahat Bilgileri */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
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
              
              {/* Transfer Yönü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Yönü *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.transferDirection === 'to_airport' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="transferDirection"
                      value="to_airport"
                      checked={formData.transferDirection === 'to_airport'}
                      onChange={(e) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          transferDirection: e.target.value,
                          tripDetails: {
                            ...prev.tripDetails,
                            pickupLocation: '',
                            dropoffLocation: 'Antalya Havalimanı'
                          }
                        }));
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Otelden Havalimanına</span>
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.transferDirection === 'from_airport' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="transferDirection"
                      value="from_airport"
                      checked={formData.transferDirection === 'from_airport'}
                      onChange={(e) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          transferDirection: e.target.value,
                          tripDetails: {
                            ...prev.tripDetails,
                            pickupLocation: 'Antalya Havalimanı',
                            dropoffLocation: ''
                          }
                        }));
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Havalimanından Otele</span>
                  </label>
                </div>
              </div>
              
              {/* Lokasyon seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.transferDirection === 'to_airport' ? 'Kalkış Noktası (Otel)' : 'Varış Noktası (Otel)'} *
                </label>
                {!isLoaded ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Google Maps yükleniyor...
                  </div>
                ) : (
                  <div className="relative">
                    {formData.transferDirection === 'to_airport' ? (
                      <Autocomplete
                        onLoad={onLoadPickup}
                        onPlaceChanged={onPickupChanged}
                        bounds={{
                          north: 36.9081,
                          south: 36.8847,
                          east: 30.7133,
                          west: 30.6694
                        }}
                        options={{
                          componentRestrictions: { country: 'tr' },
                          fields: ['formatted_address', 'name', 'geometry'],
                          types: ['establishment', 'geocode']
                        }}
                      >
                        <input
                          type="text"
                          value={formData.tripDetails.pickupLocation}
                          onChange={(e) => handleInputChange('tripDetails', 'pickupLocation', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors['tripDetails.pickupLocation'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Otel adı veya adresi yazın..."
                        />
                      </Autocomplete>
                    ) : (
                      <Autocomplete
                        onLoad={onLoadDropoff}
                        onPlaceChanged={onDropoffChanged}
                        bounds={{
                          north: 36.9081,
                          south: 36.8847,
                          east: 30.7133,
                          west: 30.6694
                        }}
                        options={{
                          componentRestrictions: { country: 'tr' },
                          fields: ['formatted_address', 'name', 'geometry'],
                          types: ['establishment', 'geocode']
                        }}
                      >
                        <input
                          type="text"
                          value={formData.tripDetails.dropoffLocation}
                          onChange={(e) => handleInputChange('tripDetails', 'dropoffLocation', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors['tripDetails.dropoffLocation'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Otel adı veya adresi yazın..."
                        />
                      </Autocomplete>
                    )}
                    <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                )}
                {(errors['tripDetails.pickupLocation'] || errors['tripDetails.dropoffLocation']) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors['tripDetails.pickupLocation'] || errors['tripDetails.dropoffLocation']}
                  </p>
                )}
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

              {/* Ödeme Yöntemi */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-medium text-gray-900">Ödeme Yöntemi</h4>
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
