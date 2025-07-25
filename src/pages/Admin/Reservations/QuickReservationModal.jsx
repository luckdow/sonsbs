import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, User, CreditCard, Plane, Car } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import PhoneDisplay from '../../../components/UI/PhoneDisplay';

const libraries = ['places'];

const QuickReservationModal = ({ onClose, onSubmit, vehicles = [] }) => {
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
      returnDate: '',
      returnTime: '',
      tripType: 'one-way', // 'one-way' veya 'round-trip'
      pickupLocation: '',
      dropoffLocation: '',
      passengerCount: 1,
      luggageCount: 0,
      flightNumber: ''
    },
    paymentMethod: 'cash',
    selectedVehicle: '', // Seçilen araç ID'si
    totalPrice: 0,
    calculatedDistance: 0 // Hesaplanan mesafe
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [autocompletePickup, setAutocompletePickup] = useState(null);
  const [autocompleteDropoff, setAutocompleteDropoff] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw',
    libraries
  });

  // Fiyat hesaplama fonksiyonu
  const calculatePrice = async (pickup, dropoff, vehicleId, isRoundTrip = false) => {
    if (!pickup || !dropoff || !vehicleId || !window.google) {
      return { price: 0, distance: 0 };
    }

    try {
      setCalculating(true);
      
      const service = new window.google.maps.DistanceMatrixService();
      
      return new Promise((resolve) => {
        service.getDistanceMatrix({
          origins: [pickup],
          destinations: [dropoff],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        }, (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            const distance = response.rows[0].elements[0].distance.value / 1000; // km cinsinden
            
            // Seçilen aracın km başına fiyatını bul
            const selectedVehicle = vehicles.find(v => v.id === vehicleId);
            
            const pricePerKm = selectedVehicle ? (selectedVehicle.kmRate || 3) : 3; // Sadece kmRate field'ını kullan
            
            let calculatedPrice = Math.round(distance * pricePerKm);
            
            // Gidiş-dönüş ise fiyatı iki katına çıkar
            if (isRoundTrip) {
              calculatedPrice = calculatedPrice * 2;
            }
            
            
            resolve({ 
              price: calculatedPrice, 
              distance: Math.round(distance * 100) / 100 // 2 ondalık basamak
            });
          } else {
            // Hata durumunda varsayılan hesaplama
            const selectedVehicle = vehicles.find(v => v.id === vehicleId);
            let basePrice = selectedVehicle ? (selectedVehicle.kmRate * 10 || 100) : 100;
            
            // Gidiş-dönüş ise fiyatı iki katına çıkar
            if (isRoundTrip) {
              basePrice = basePrice * 2;
            }
            
            resolve({ price: basePrice, distance: 0 });
          }
          setCalculating(false);
        });
      });
    } catch (error) {
      // Debug log removed
      setCalculating(false);
      const basePrice = isRoundTrip ? 200 : 100; // Varsayılan fiyat
      return { price: basePrice, distance: 0 };
    }
  };

  // Lokasyon veya araç değiştiğinde fiyat hesapla
  const updatePrice = async () => {
    const { pickupLocation, dropoffLocation, tripType } = formData.tripDetails;
    const { selectedVehicle } = formData;
    
    
    if (pickupLocation && dropoffLocation && selectedVehicle) {
      const isRoundTrip = tripType === 'round-trip';
      const { price, distance } = await calculatePrice(pickupLocation, dropoffLocation, selectedVehicle, isRoundTrip);
      
      
      setFormData(prev => ({
        ...prev,
        totalPrice: price,
        calculatedDistance: distance
      }));
    } else {
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Seyahat türü değiştiğinde fiyatı yeniden hesapla
    if (section === 'tripDetails' && field === 'tripType') {
      setTimeout(() => updatePrice(), 100);
    }
    
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
      tripDetails: {
        ...prev.tripDetails,
        tripType: direction
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
      // Fiyat hesaplama için delay ekle
      setTimeout(() => updatePrice(), 500);
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
      // Fiyat hesaplama için delay ekle
      setTimeout(() => updatePrice(), 500);
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
    if (!formData.selectedVehicle) {
      newErrors['selectedVehicle'] = 'Araç seçimi zorunludur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Eğer fiyat hesaplanmamışsa, son bir kez hesapla
      if (formData.totalPrice === 0 && formData.selectedVehicle) {
        const isRoundTrip = formData.tripDetails.tripType === 'round-trip';
        const { price } = await calculatePrice(
          formData.tripDetails.pickupLocation,
          formData.tripDetails.dropoffLocation,
          formData.selectedVehicle,
          isRoundTrip
        );
        formData.totalPrice = price;
      }
      
      const reservationData = {
        ...formData,
        totalPrice: formData.totalPrice || (formData.tripDetails.tripType === 'round-trip' ? 200 : 100), // Minimum fiyat
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSubmit(reservationData);
    } catch (error) {
      // Debug log removed
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
                  {formData.customerInfo.phone && (
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-600 mb-1">Önizleme:</p>
                      <PhoneDisplay 
                        phone={formData.customerInfo.phone} 
                        size="sm"
                        showCountryName={true}
                      />
                    </div>
                  )}
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
                    {formData.tripDetails.tripType === 'round-trip' ? 'Gidiş Tarihi *' : 'Tarih *'}
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
                    {formData.tripDetails.tripType === 'round-trip' ? 'Gidiş Saati *' : 'Saat *'}
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

                {/* Dönüş Bilgileri - Sadece Gidiş-Dönüş için */}
                {formData.tripDetails.tripType === 'round-trip' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dönüş Tarihi</label>
                      <input
                        type="date"
                        value={formData.tripDetails.returnDate}
                        onChange={(e) => handleInputChange('tripDetails', 'returnDate', e.target.value)}
                        min={formData.tripDetails.date || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dönüş Saati</label>
                      <input
                        type="time"
                        value={formData.tripDetails.returnTime}
                        onChange={(e) => handleInputChange('tripDetails', 'returnTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Seyahat Türü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seyahat Türü *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.tripDetails.tripType === 'one-way' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="tripType"
                      value="one-way"
                      checked={formData.tripDetails.tripType === 'one-way'}
                      onChange={(e) => handleInputChange('tripDetails', 'tripType', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Tek Yön</span>
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.tripDetails.tripType === 'round-trip' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="tripType"
                      value="round-trip"
                      checked={formData.tripDetails.tripType === 'round-trip'}
                      onChange={(e) => handleInputChange('tripDetails', 'tripType', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Gidiş-Dönüş</span>
                  </label>
                </div>
              </div>
              
              {/* Lokasyon seçimi */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kalkış Noktası *
                  </label>
                  {!isLoaded ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      Google Maps yükleniyor...
                    </div>
                  ) : (
                    <div className="relative">
                      <Autocomplete
                        onLoad={onLoadPickup}
                        onPlaceChanged={onPickupChanged}
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
                          placeholder="Kalkış noktasını yazın (otel, adres vb.)"
                        />
                      </Autocomplete>
                      <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  {errors['tripDetails.pickupLocation'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['tripDetails.pickupLocation']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Varış Noktası *
                  </label>
                  {!isLoaded ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      Google Maps yükleniyor...
                    </div>
                  ) : (
                    <div className="relative">
                      <Autocomplete
                        onLoad={onLoadDropoff}
                        onPlaceChanged={onDropoffChanged}
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
                          placeholder="Varış noktasını yazın (otel, adres vb.)"
                        />
                      </Autocomplete>
                      <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  {errors['tripDetails.dropoffLocation'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['tripDetails.dropoffLocation']}</p>
                  )}
                </div>
              </div>
              
              {/* Araç Seçimi */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  <label className="block text-sm font-medium text-gray-700">
                    Araç Seçimi *
                  </label>
                </div>
                <select
                  value={formData.selectedVehicle}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, selectedVehicle: e.target.value }));
                    // Araç değiştiğinde fiyat hesapla
                    setTimeout(() => {
                      updatePrice();
                    }, 100);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['selectedVehicle'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Araç seçiniz...</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plateNumber} 
                      {vehicle.kmRate && ` (€${vehicle.kmRate}/km)`}
                    </option>
                  ))}
                </select>
                {errors['selectedVehicle'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['selectedVehicle']}</p>
                )}
              </div>

              {/* Fiyat Gösterimi */}
              {formData.totalPrice > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">
                        Hesaplanan Fiyat {formData.tripDetails.tripType === 'round-trip' ? '(Gidiş-Dönüş)' : '(Tek Yön)'}
                      </p>
                      <p className="text-2xl font-bold text-green-800">€{formData.totalPrice}</p>
                      {formData.calculatedDistance > 0 && (
                        <p className="text-xs text-green-600">
                          Mesafe: {formData.calculatedDistance} km 
                          {formData.tripDetails.tripType === 'round-trip' && ' (tek yön)'}
                        </p>
                      )}
                      {formData.tripDetails.tripType === 'round-trip' && (
                        <p className="text-xs text-green-600 font-medium">
                          Gidiş-dönüş fiyatı hesaplanmıştır
                        </p>
                      )}
                    </div>
                    {calculating && (
                      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
              )}

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
                    { value: 'credit_card', label: 'Kredi Kartı', desc: 'Online ödeme' },
                    { value: 'bank_transfer', label: 'Havale', desc: 'Banka havalesi' }
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
