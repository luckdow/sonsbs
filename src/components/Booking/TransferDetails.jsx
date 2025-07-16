import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  Minus
} from 'lucide-react';

const TransferDetails = ({ bookingData, setBookingData, onNext }) => {
  const [direction, setDirection] = useState(bookingData.direction || 'airport-to-hotel');
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

  const validateForm = () => {
    const newErrors = {};

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
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Transfer Yönü Seçimi */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Transfer Yönü
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setDirection('airport-to-hotel')}
              className={`p-4 rounded-xl border-2 transition-all ${
                direction === 'airport-to-hotel'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Plane className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Havalimanı → Otel</div>
                  <div className="text-xs text-gray-500">Karşılama servisi</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setDirection('hotel-to-airport')}
              className={`p-4 rounded-xl border-2 transition-all ${
                direction === 'hotel-to-airport'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Otel → Havalimanı</div>
                  <div className="text-xs text-gray-500">Uğurlama servisi</div>
                </div>
              </div>
            </motion.button>
          </div>
          {errors.direction && (
            <p className="text-red-500 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.direction}
            </p>
          )}
        </div>

        {/* Lokasyon Bilgileri */}
        <div className="space-y-4">
          {/* Hotel Location Input */}
          {direction === 'airport-to-hotel' ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Otel/Konaklama Yeri
              </label>
              <div className="relative">
                <input
                  ref={dropoffRef}
                  type="text"
                  placeholder="Otel adını yazmaya başlayın..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={typeof dropoffLocation === 'string' ? dropoffLocation : dropoffLocation?.address || ''}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.dropoffLocation && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dropoffLocation}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Otel/Konaklama Yeri
              </label>
              <div className="relative">
                <input
                  ref={pickupRef}
                  type="text"
                  placeholder="Otel adını yazmaya başlayın..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={typeof pickupLocation === 'string' ? pickupLocation : pickupLocation?.address || ''}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.pickupLocation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Yolcu ve Bagaj Sayısı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Yolcu Sayısı */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Yolcu Sayısı
            </label>
            <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="flex items-center space-x-3 flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handlePassengerChange(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  disabled={passengerCount <= 1}
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </motion.button>
                <span className="text-lg font-medium text-gray-800 min-w-[2rem] text-center">
                  {passengerCount}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handlePassengerChange(true)}
                  className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                  disabled={passengerCount >= 50}
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bagaj Sayısı */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bagaj Sayısı
            </label>
            <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
              <Package className="w-4 h-4 text-gray-500" />
              <div className="flex items-center space-x-3 flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleBaggageChange(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  disabled={baggageCount <= 0}
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </motion.button>
                <span className="text-lg font-medium text-gray-800 min-w-[2rem] text-center">
                  {baggageCount}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleBaggageChange(true)}
                  className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                  disabled={baggageCount >= 20}
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarih ve Saat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tarih
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                min={getTodayDate()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Saat
            </label>
            <div className="relative">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <Clock className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.time && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Bilgilendirme */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Önemli Bilgiler:</p>
              <ul className="space-y-1 text-xs">
                <li>• Rezervasyon en az 4 saat önceden yapılmalıdır</li>
                <li>• Havalimanı transferleri 7/24 hizmet verir</li>
                <li>• Uçuş bilgilerinizi bir sonraki adımda girebilirsiniz</li>
                <li>• Otel adını yazmaya başladığınızda öneriler görünecek</li>
              </ul>
            </div>
          </div>
        </div>

        {/* İleri Butonu */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Devam Et</span>
          <ArrowRightLeft className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TransferDetails;
