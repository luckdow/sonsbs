import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

const TransferDetails = ({ bookingData, setBookingData, onNext }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [autocompleteInstance, setAutocompleteInstance] = useState(null);
  const inputRef = useRef(null);

  // Bugünün tarihini al ve 4 saat sonrasını hesapla
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // 4 saat sonrasını hesapla
  const minHour = currentHour + 4;
  const minTime = minHour < 24 ? 
    String(minHour).padStart(2, '0') + ':' + String(currentMinute).padStart(2, '0') :
    '00:00';

  // Default değerleri ayarla
  useEffect(() => {
    if (!bookingData.date) {
      setBookingData(prev => ({
        ...prev,
        date: today,
        time: minTime
      }));
    }
  }, [bookingData.date, setBookingData, today, minTime]);

  // Google Places Autocomplete
  useEffect(() => {
    const initGoogleMaps = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error('Google Maps Places API bulunamadı');
        return;
      }

      const inputElement = inputRef.current;
      if (!inputElement) {
        console.error('Input element bulunamadı');
        return;
      }

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
          types: ['lodging'],
          componentRestrictions: { country: 'tr' },
          language: 'tr'
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setSelectedAddress(place.formatted_address);
            setBookingData(prev => ({
              ...prev,
              [bookingData.direction === 'airport-to-hotel' ? 'dropoffLocation' : 'pickupLocation']: place.formatted_address
            }));
          }
        });
        
        setAutocompleteInstance(autocomplete);
      } catch (error) {
        console.error('Autocomplete oluşturulurken hata:', error);
      }
    };

    if (window.googleMapsLoaded) {
      initGoogleMaps();
    } else {
      const handleGoogleMapsLoaded = () => {
        initGoogleMaps();
      };
      
      window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      
      return () => {
        window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      };
    }
  }, [bookingData.direction, setBookingData]);

  // Transfer yönü değiştiğinde selectedAddress'i temizle
  useEffect(() => {
    setSelectedAddress('');
  }, [bookingData.direction]);

  const handleDateTimeChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAndNext = () => {
    const hotelLocation = bookingData.direction === 'airport-to-hotel' 
      ? bookingData.dropoffLocation 
      : bookingData.pickupLocation;
    
    if (!hotelLocation || !bookingData.date || !bookingData.time) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // 4 saat kuralı kontrolü
    const selectedDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
    const minDateTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    
    if (selectedDateTime < minDateTime) {
      alert('Transfer tarihi en az 4 saat sonrası olmalıdır');
      return;
    }

    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Transfer Yönü */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          Transfer Yönü
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBookingData(prev => ({ ...prev, direction: 'airport-to-hotel' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              bookingData.direction === 'airport-to-hotel'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">Havalimanından Otele</div>
              <div className="text-sm mt-1 opacity-80">Antalya Havalimanı → Otel</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBookingData(prev => ({ ...prev, direction: 'hotel-to-airport' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              bookingData.direction === 'hotel-to-airport'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">Otelden Havalimanına</div>
              <div className="text-sm mt-1 opacity-80">Otel → Antalya Havalimanı</div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Otel Seçimi */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          Otel Bilgileri
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookingData.direction === 'airport-to-hotel' ? 'Gideceğiniz Otel' : 'Kaldığınız Otel'}
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Otel adı yazın..."
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Otel adını yazmaya başladığınızda öneriler görünecektir
            </p>
          </div>
        </div>
      </div>

      {/* Tarih ve Saat */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Tarih ve Saat
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Tarihi
            </label>
            <input
              type="date"
              min={today}
              value={bookingData.date}
              onChange={(e) => handleDateTimeChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Saati
            </label>
            <input
              type="time"
              value={bookingData.time}
              onChange={(e) => handleDateTimeChange('time', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            En az 4 saat öncesinden rezervasyon yapabilirsiniz
          </p>
        </div>
      </div>

      {/* İleri Butonu */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={validateAndNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          Devam Et
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TransferDetails;
