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
    <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto p-2 sm:p-3 lg:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {/* Transfer Yönü Seçimi */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Transfer Yönü
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => handleDirectionChange('airport-to-hotel')}
              className={`p-2 rounded-lg border transition-all ${
                direction === 'airport-to-hotel'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Plane className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">Havalimanı → Otel</div>
                  <div className="text-xs text-gray-500">Karşılama</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => handleDirectionChange('hotel-to-airport')}
              className={`p-2 rounded-lg border transition-all ${
                direction === 'hotel-to-airport'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Building className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">Otel → Havalimanı</div>
                  <div className="text-xs text-gray-500">Uğurlama</div>
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
        <div className="space-y-3">
          {/* Hotel Location Input */}
          {direction === 'airport-to-hotel' && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Otel/Konaklama Yeri
              </label>
              <div className="relative">
                <input
                  ref={dropoffRef}
                  type="text"
                  placeholder="Otel adını yazmaya başlayın..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10"
                  value={typeof dropoffLocation === 'string' ? dropoffLocation : dropoffLocation?.address || ''}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <MapPin className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {errors.dropoffLocation && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.dropoffLocation}
                </p>
              )}
            </div>
          )}
          
          {direction === 'hotel-to-airport' && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Otel/Konaklama Yeri
              </label>
              <div className="relative">
                <input
                  ref={pickupRef}
                  type="text"
                  placeholder="Otel adını yazmaya başlayın..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10"
                  value={typeof pickupLocation === 'string' ? pickupLocation : pickupLocation?.address || ''}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <MapPin className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.pickupLocation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Yolcu ve Bagaj Sayısı */}
        <div className="grid grid-cols-2 gap-2">
          {/* Yolcu Sayısı */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
              Yolcu
            </label>
            <div className="flex items-center space-x-1.5 p-2 border border-gray-300 rounded-lg bg-gray-50">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="flex items-center space-x-1.5 flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handlePassengerChange(false)}
                  className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
                  disabled={passengerCount <= 1}
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </motion.button>
                <span className="text-sm font-medium text-gray-800 min-w-[1.5rem] text-center">
                  {passengerCount}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handlePassengerChange(true)}
                  className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-sm"
                  disabled={passengerCount >= 50}
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bagaj Sayısı */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
              Bagaj
            </label>
            <div className="flex items-center space-x-1.5 p-2 border border-gray-300 rounded-lg bg-gray-50">
              <Package className="w-4 h-4 text-gray-500" />
              <div className="flex items-center space-x-1.5 flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleBaggageChange(false)}
                  className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
                  disabled={baggageCount <= 0}
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </motion.button>
                <span className="text-sm font-medium text-gray-800 min-w-[1.5rem] text-center">
                  {baggageCount}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleBaggageChange(true)}
                  className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-sm"
                  disabled={baggageCount >= 20}
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarih ve Saat */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
              Tarih
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                min={getTodayDate()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-7"
              />
              <Calendar className="absolute left-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
              Saat
            </label>
            <div className="relative">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-7"
              />
              <Clock className="absolute left-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.time && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Bilgilendirme */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-start space-x-1.5">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Bilgi:</p>
              <ul className="space-y-0.5">
                <li>• Transfer için en az 4 saat önceden rezervasyon gerekir</li>
                <li>• Otel adını yazmaya başladığınızda öneriler görünecek</li>
              </ul>
            </div>
          </div>
        </div>

        {/* İleri Butonu */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1.5 text-sm"
        >
          <span>Araçları Bul</span>
          <ArrowRightLeft className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TransferDetails;
