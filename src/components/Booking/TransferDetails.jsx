import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRightLeft,
  Plane,
  Building,
  AlertCircle,
  Users,
  Package,
  Plus,
  Minus,
  ChevronDown,
  Star,
  CheckCircle,
  Navigation,
  Zap,
  Shield
} from 'lucide-react';

const TransferDetails = ({ bookingData, setBookingData, onNext }) => {
  const [direction, setDirection] = useState(bookingData.direction || null);
  const [pickupLocation, setPickupLocation] = useState(bookingData.pickupLocation || '');
  const [dropoffLocation, setDropoffLocation] = useState(bookingData.dropoffLocation || '');
  
  // Tarih ve saat için default değerler
  const getDefaultDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };
  
  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 4); // 4 saat sonra
    return now.toTimeString().slice(0, 5);
  };

  const [date, setDate] = useState(bookingData.date || getDefaultDate());
  const [time, setTime] = useState(bookingData.time || getDefaultTime());
  const [passengerCount, setPassengerCount] = useState(bookingData.passengerCount || 1);
  const [baggageCount, setBaggageCount] = useState(bookingData.baggageCount || 1);
  const [errors, setErrors] = useState({});

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const autocompletePickup = useRef(null);
  const autocompleteDropoff = useRef(null);

  // Antalya Havalimanı koordinatları
  const ANTALYA_AIRPORT = {
    address: 'Antalya Havalimanı, Antalya, Türkiye',
    lat: 36.8987,
    lng: 30.8005
  };

  useEffect(() => {
    // Google Places Autocomplete'i başlat
    const initPlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setTimeout(() => {
          initializeAutocomplete();
        }, 100);
      } else {
        // Google Maps API yüklenene kadar bekle
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            initializeAutocomplete();
            clearInterval(checkGoogleMaps);
          }
        }, 500);
        
        setTimeout(() => {
          clearInterval(checkGoogleMaps);
        }, 10000);
        
        return () => clearInterval(checkGoogleMaps);
      }
    };

    initPlaces();
  }, [direction]);

  const initializeAutocomplete = () => {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        return;
      }

      // Önceki autocomplete'leri temizle
      if (autocompletePickup.current) {
        window.google.maps.event.clearInstanceListeners(autocompletePickup.current);
        autocompletePickup.current = null;
      }
      if (autocompleteDropoff.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteDropoff.current);
        autocompleteDropoff.current = null;
      }

      // Pickup için autocomplete (sadece hotel-to-airport için)
      if (direction === 'hotel-to-airport' && pickupRef.current) {
        autocompletePickup.current = new window.google.maps.places.Autocomplete(
          pickupRef.current,
          {
            types: ['lodging'],
            componentRestrictions: { country: 'tr' },
            fields: ['place_id', 'formatted_address', 'geometry', 'name']
          }
        );

        autocompletePickup.current.addListener('place_changed', () => {
          const place = autocompletePickup.current.getPlace();
          if (place && place.geometry) {
            const locationData = {
              address: place.formatted_address || place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            setPickupLocation(locationData);
          }
        });
      }

      // Dropoff için autocomplete (sadece airport-to-hotel için)
      if (direction === 'airport-to-hotel' && dropoffRef.current) {
        autocompleteDropoff.current = new window.google.maps.places.Autocomplete(
          dropoffRef.current,
          {
            types: ['lodging'],
            componentRestrictions: { country: 'tr' },
            fields: ['place_id', 'formatted_address', 'geometry', 'name']
          }
        );

        autocompleteDropoff.current.addListener('place_changed', () => {
          const place = autocompleteDropoff.current.getPlace();
          if (place && place.geometry) {
            const locationData = {
              address: place.formatted_address || place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            setDropoffLocation(locationData);
          }
        });
      }
    } catch (error) {
      console.error('Google Places initialization error:', error);
    }
  };

  // Transfer yönü değişince lokasyonları güncelle
  useEffect(() => {
    if (direction === 'airport-to-hotel') {
      setPickupLocation(ANTALYA_AIRPORT);
      setDropoffLocation('');
    } else {
      setPickupLocation('');
      setDropoffLocation(ANTALYA_AIRPORT);
    }
  }, [direction]);

  // Bugünün tarihi
  const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };

  // Yolcu sayısı kontrol fonksiyonları
  const handlePassengerChange = (increment) => {
    setPassengerCount(prev => {
      if (increment) {
        return prev < 50 ? prev + 1 : prev; // Maksimum 50 kişi
      } else {
        return prev > 1 ? prev - 1 : prev; // Minimum 1 kişi
      }
    });
  };

  // Bagaj sayısı kontrol fonksiyonları
  const handleBaggageChange = (increment) => {
    setBaggageCount(prev => {
      if (increment) {
        return prev < 20 ? prev + 1 : prev; // Maksimum 20 bagaj
      } else {
        return prev > 0 ? prev - 1 : prev; // Minimum 0 bagaj
      }
    });
  };

  // Transfer yönü değişimini handle et
  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    // Önceki seçimleri temizle
    setPickupLocation('');
    setDropoffLocation('');
    // Hataları temizle
    setErrors(prev => ({
      ...prev,
      direction: '',
      pickupLocation: '',
      dropoffLocation: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Transfer yönü kontrolü
    if (!direction) {
      newErrors.direction = 'Transfer yönünü seçiniz';
    }

    // Lokasyon kontrolü
    if (direction === 'airport-to-hotel') {
      if (!dropoffLocation || (typeof dropoffLocation === 'string' && dropoffLocation.trim() === '')) {
        newErrors.dropoffLocation = 'Otel/Konaklama yeri seçiniz';
      }
    }

    if (direction === 'hotel-to-airport') {
      if (!pickupLocation || (typeof pickupLocation === 'string' && pickupLocation.trim() === '')) {
        newErrors.pickupLocation = 'Otel/Konaklama yeri seçiniz';
      }
    }

    if (!date) {
      newErrors.date = 'Tarih seçiniz';
    } else {
      const selectedDateTime = new Date(`${date}T${time || '00:00'}`);
      const minDateTime = new Date();
      minDateTime.setHours(minDateTime.getHours() + 4);

      if (selectedDateTime < minDateTime) {
        newErrors.date = 'Rezervasyon en az 4 saat önceden yapılmalıdır';
      }
    }

    if (!time) {
      newErrors.time = 'Saat seçiniz';
    }

    setErrors(newErrors);
    console.log('Transfer Details Validation:', { direction, dropoffLocation, pickupLocation, errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const updatedData = {
        ...bookingData,
        direction,
        pickupLocation,
        dropoffLocation,
        date,
        time,
        passengerCount,
        baggageCount
      };
      setBookingData(updatedData);
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-8">
        <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <ArrowRightLeft className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Transfer Rezervasyonu</h1>
            <p className="text-blue-100 text-sm">
              Antalya Havalimanı ↔ Otel transferinizi planlayın
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-3xl shadow-xl space-y-6 p-6"
        >
          {/* Transfer Yönü Seçimi */}
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                Transfer Yönü
              </h2>
              <p className="text-sm text-gray-600">
                Lütfen transfer yönünüzü belirleyin
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleDirectionChange('airport-to-hotel')}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${
                  direction === 'airport-to-hotel'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    direction === 'airport-to-hotel' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Plane className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">Havalimanı → Konaklama</div>
                    <div className="text-sm text-gray-600">Karşılama transferi</div>
                  </div>
                  {direction === 'airport-to-hotel' && (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                {direction === 'airport-to-hotel' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-500/10 rounded-2xl"
                  />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleDirectionChange('hotel-to-airport')}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${
                  direction === 'hotel-to-airport'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    direction === 'hotel-to-airport' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">Konaklama → Havalimanı</div>
                    <div className="text-sm text-gray-600">Uğurlama transferi</div>
                  </div>
                  {direction === 'hotel-to-airport' && (
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  )}
                </div>
                {direction === 'hotel-to-airport' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-purple-500/10 rounded-2xl"
                  />
                )}
              </motion.button>
            </div>
            
            {errors.direction && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.direction}</span>
              </motion.div>
            )}
          </div>

          {/* Lokasyon Bilgileri */}
          <AnimatePresence mode="wait">
            {direction && (
              <motion.div
                key={direction}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="text-left">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Konaklama Adresi
                  </h3>
                  <p className="text-sm text-gray-600">
                    {direction === 'airport-to-hotel' 
                      ? 'Varış noktanızı belirtin' 
                      : 'Kalkış noktanızı belirtin'
                    }
                  </p>
                </div>

                {/* Hotel Location Input */}
                {direction === 'airport-to-hotel' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <input
                        ref={dropoffRef}
                        type="text"
                        placeholder="Otel veya konaklama adresini girin"
                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                        value={typeof dropoffLocation === 'string' ? dropoffLocation : dropoffLocation?.address || ''}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.dropoffLocation && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.dropoffLocation}</span>
                      </motion.div>
                    )}
                  </div>
                )}
                
                {direction === 'hotel-to-airport' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <input
                        ref={pickupRef}
                        type="text"
                        placeholder="Otel veya konaklama adresini girin"
                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all"
                        value={typeof pickupLocation === 'string' ? pickupLocation : pickupLocation?.address || ''}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.pickupLocation && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.pickupLocation}</span>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Yolcu ve Bagaj Sayısı */}
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Yolcu Bilgileri
              </h3>
              <p className="text-sm text-gray-600">
                Yolcu sayısı ve bagaj miktarını belirtin
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {/* Yolcu Sayısı */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Yolcu</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handlePassengerChange(false)}
                    className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={passengerCount <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-md min-w-[3rem]">
                    <span className="text-xl font-bold text-gray-800 text-center block">
                      {passengerCount}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handlePassengerChange(true)}
                    className="w-10 h-10 rounded-full bg-blue-500 shadow-md hover:shadow-lg hover:bg-blue-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={passengerCount >= 50}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Bagaj Sayısı */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Bagaj</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleBaggageChange(false)}
                    className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={baggageCount <= 0}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-md min-w-[3rem]">
                    <span className="text-xl font-bold text-gray-800 text-center block">
                      {baggageCount}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => handleBaggageChange(true)}
                    className="w-10 h-10 rounded-full bg-purple-500 shadow-md hover:shadow-lg hover:bg-purple-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={baggageCount >= 20}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Tarih ve Saat */}
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Transfer Zamanı
              </h3>
              <p className="text-sm text-gray-600">
                Transfer tarih ve saatinizi belirtin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tarih
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    min={getTodayDate()}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                  />
                </div>
                {errors.date && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-500 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.date}</span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Saat
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                  />
                </div>
                {errors.time && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-500 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.time}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Bilgilendirme */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-2 text-gray-900">ℹ️ Önemli Bilgiler</p>
                <ul className="space-y-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>En az 4 saat önceden rezervasyon yapınız</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Konaklama adresini girdikçe öneriler beliriecektir</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* İleri Butonu */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
          >
            <span>Araç Seçimine Geç</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRightLeft className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default TransferDetails;
