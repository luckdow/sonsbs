import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Shield, 
  Star,
  Phone,
  Mail,
  Users,
  Truck,
  Globe,
  CheckCircle2,
  Calendar,
  ArrowRight,
  User2,
  Luggage,
  Car,
  Package,
  Plane
} from 'lucide-react';

const QuickBookingForm = () => {
  const navigate = useNavigate();
  
  // Hızlı rezervasyon form state
  const [quickBookingData, setQuickBookingData] = useState({
    tripType: 'one-way', // Varsayılan olarak tek yön seçili
    pickupLocation: null,
    dropoffLocation: null,
    passengerCount: 1,
    baggageCount: 1,
    date: '',
    time: '',
    returnDate: '',
    returnTime: ''
  });

  // Google Places state
  const [pickupInput, setPickupInput] = useState('');
  const [dropoffInput, setDropoffInput] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const autocompletePickup = useRef(null);
  const autocompleteDropoff = useRef(null);
  const pickupService = useRef(null);
  const dropoffService = useRef(null);
  const pickupDropdownRef = useRef(null);
  const dropoffDropdownRef = useRef(null);

  // Google Places Autocomplete başlat (Custom Dropdown kullanımı)
  useEffect(() => {
    const initPlacesService = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          // AutocompleteService kullanarak özel dropdown oluştur
          pickupService.current = new window.google.maps.places.AutocompleteService();
          dropoffService.current = new window.google.maps.places.AutocompleteService();
        } catch (error) {
          console.error('Google Places Service initialization error:', error);
        }
      }
    };

    // Google Maps API yüklenene kadar bekle
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initPlacesService();
        clearInterval(checkGoogleMaps);
      }
    }, 500);

    // 10 saniye sonra kontrol etmeyi bırak
    setTimeout(() => {
      clearInterval(checkGoogleMaps);
    }, 10000);

    return () => clearInterval(checkGoogleMaps);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupDropdownRef.current && !pickupDropdownRef.current.contains(event.target)) {
        setShowPickupDropdown(false);
      }
      if (dropoffDropdownRef.current && !dropoffDropdownRef.current.contains(event.target)) {
        setShowDropoffDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pickup input değişikliği
  const handlePickupInputChange = (value) => {
    setPickupInput(value);
    
    if (value.length > 2 && pickupService.current) {
      pickupService.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'tr' },
          types: ['establishment', 'geocode']
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPickupSuggestions(predictions.slice(0, 5)); // İlk 5 öneriyi al
            setShowPickupDropdown(true);
          } else {
            setPickupSuggestions([]);
            setShowPickupDropdown(false);
          }
        }
      );
    } else {
      setPickupSuggestions([]);
      setShowPickupDropdown(false);
    }
  };

  // Dropoff input değişikliği
  const handleDropoffInputChange = (value) => {
    setDropoffInput(value);
    
    if (value.length > 2 && dropoffService.current) {
      dropoffService.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'tr' },
          types: ['establishment', 'geocode']
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setDropoffSuggestions(predictions.slice(0, 5)); // İlk 5 öneriyi al
            setShowDropoffDropdown(true);
          } else {
            setDropoffSuggestions([]);
            setShowDropoffDropdown(false);
          }
        }
      );
    } else {
      setDropoffSuggestions([]);
      setShowDropoffDropdown(false);
    }
  };

  // Pickup seçimi
  const handlePickupSelect = (prediction) => {
    setPickupInput(prediction.description);
    setShowPickupDropdown(false);
    setPickupSuggestions([]);
    
    // Place details al
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails(
      { placeId: prediction.place_id, fields: ['place_id', 'formatted_address', 'name', 'geometry'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          setQuickBookingData(prev => ({
            ...prev,
            pickupLocation: {
              address: place.formatted_address,
              name: place.name,
              placeId: place.place_id,
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng()
            }
          }));
        }
      }
    );
  };

  // Dropoff seçimi
  const handleDropoffSelect = (prediction) => {
    setDropoffInput(prediction.description);
    setShowDropoffDropdown(false);
    setDropoffSuggestions([]);
    
    // Place details al
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails(
      { placeId: prediction.place_id, fields: ['place_id', 'formatted_address', 'name', 'geometry'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          setQuickBookingData(prev => ({
            ...prev,
            dropoffLocation: {
              address: place.formatted_address,
              name: place.name,
              placeId: place.place_id,
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng()
            }
          }));
        }
      }
    );
  };

  // Hızlı rezervasyon işleme
  const handleQuickBooking = () => {
    // Bu noktada tüm validasyonlar zaten yapılmış çünkü buton sadece her şey doluysa görünüyor
    // Ama yine de son kontrol yapalım
    if (!quickBookingData.pickupLocation || !quickBookingData.dropoffLocation || !quickBookingData.date || !quickBookingData.time) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    // Gidiş-dönüş için dönüş tarih-saat kontrolü
    if (quickBookingData.tripType === 'round-trip' && (!quickBookingData.returnDate || !quickBookingData.returnTime)) {
      alert('Lütfen dönüş tarih ve saatini de doldurun!');
      return;
    }

    // LocalStorage'a rezervasyon verilerini kaydet
    const bookingData = {
      tripType: quickBookingData.tripType,
      pickupLocation: quickBookingData.pickupLocation,
      dropoffLocation: quickBookingData.dropoffLocation,
      date: quickBookingData.date,
      time: quickBookingData.time,
      returnDate: quickBookingData.returnDate,
      returnTime: quickBookingData.returnTime,
      passengerCount: quickBookingData.passengerCount,
      baggageCount: quickBookingData.baggageCount,
      prefilledFromHome: true,
      showVehicles: true // Araç seçimini direkt göster
    };

    localStorage.setItem('quickBookingData', JSON.stringify(bookingData));
    
    // BookingWizard'a yönlendir
    navigate('/rezervasyon');
  };

  // Bugünün tarihi (minimum tarih için)
  const today = new Date().toISOString().split('T')[0];

  // Saat seçenekleri
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl relative">
      {/* Neon glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
      <div className="absolute inset-0 rounded-2xl border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
            <Car className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Hızlı Rezervasyon
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm lg:text-sm">
            {!quickBookingData.pickupLocation || !quickBookingData.dropoffLocation ? 'Lokasyonları girin' :
             !quickBookingData.date || !quickBookingData.time ? 'Tarih ve saat seçin' :
             (quickBookingData.tripType === 'round-trip' && (!quickBookingData.returnDate || !quickBookingData.returnTime)) ? 'Dönüş tarih-saat seçin' :
             'Kişi sayısını belirtin ve devam edin'}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Adım 1: Seyahat Türü */}
          <div>
            <label className="block text-white text-xs font-medium mb-2">
              <Plane className="w-3 h-3 inline mr-1" />
              Seyahat Türü
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuickBookingData(prev => ({...prev, tripType: 'one-way'}))}
                className={`px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  quickBookingData.tripType === 'one-way'
                    ? 'bg-blue-600 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                Tek Yön
              </button>
              <button
                type="button"
                onClick={() => setQuickBookingData(prev => ({...prev, tripType: 'round-trip'}))}
                className={`px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  quickBookingData.tripType === 'round-trip'
                    ? 'bg-blue-600 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                Gidiş-Dönüş
              </button>
            </div>
          </div>

          {/* Adım 2: Nereden - Nereye (Custom Dropdown) */}
          <div className="grid grid-cols-1 gap-3">
            <div className="relative" ref={pickupDropdownRef}>
              <label className="block text-white text-xs font-medium mb-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                Nereden
              </label>
              <input
                type="text"
                value={pickupInput}
                onChange={(e) => handlePickupInputChange(e.target.value)}
                onFocus={() => pickupSuggestions.length > 0 && setShowPickupDropdown(true)}
                placeholder="Antalya Havalimanı..."
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm focus:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              />
              
              {/* Custom Dropdown */}
              {showPickupDropdown && pickupSuggestions.length > 0 && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                  {pickupSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.place_id}
                      onClick={() => handlePickupSelect(suggestion)}
                      className="px-3 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start gap-3 transition-colors duration-150"
                    >
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 text-sm font-semibold leading-tight mb-1">
                          {suggestion.structured_formatting?.main_text || suggestion.description.split(',')[0]}
                        </div>
                        <div className="text-gray-600 text-xs leading-tight overflow-hidden">
                          {suggestion.structured_formatting?.secondary_text || suggestion.description.split(',').slice(1).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative" ref={dropoffDropdownRef}>
              <label className="block text-white text-xs font-medium mb-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                Nereye
              </label>
              <input
                type="text"
                value={dropoffInput}
                onChange={(e) => handleDropoffInputChange(e.target.value)}
                onFocus={() => dropoffSuggestions.length > 0 && setShowDropoffDropdown(true)}
                placeholder="Otel adı..."
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm focus:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              />
              
              {/* Custom Dropdown */}
              {showDropoffDropdown && dropoffSuggestions.length > 0 && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                  {dropoffSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.place_id}
                      onClick={() => handleDropoffSelect(suggestion)}
                      className="px-3 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start gap-3 transition-colors duration-150"
                    >
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 text-sm font-semibold leading-tight mb-1">
                          {suggestion.structured_formatting?.main_text || suggestion.description.split(',')[0]}
                        </div>
                        <div className="text-gray-600 text-xs leading-tight overflow-hidden">
                          {suggestion.structured_formatting?.secondary_text || suggestion.description.split(',').slice(1).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Adım 3: Gidiş Tarih ve Saat (Lokasyonlar girilmişse göster) */}
          {quickBookingData.pickupLocation && quickBookingData.dropoffLocation && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white text-xs font-medium mb-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Gidiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={quickBookingData.date}
                    min={today}
                    onChange={(e) => setQuickBookingData(prev => ({...prev, date: e.target.value}))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white text-xs font-medium mb-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Gidiş Saati
                  </label>
                  <select
                    value={quickBookingData.time}
                    onChange={(e) => setQuickBookingData(prev => ({...prev, time: e.target.value}))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                  >
                    <option value="" className="text-gray-800">Seçin</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time} className="text-gray-800">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dönüş Tarih ve Saat - sadece gidiş-dönüş seçiliyse */}
              {quickBookingData.tripType === 'round-trip' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white text-xs font-medium mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Dönüş Tarihi
                    </label>
                    <input
                      type="date"
                      value={quickBookingData.returnDate}
                      min={quickBookingData.date || today}
                      onChange={(e) => setQuickBookingData(prev => ({...prev, returnDate: e.target.value}))}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs font-medium mb-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Dönüş Saati
                    </label>
                    <select
                      value={quickBookingData.returnTime}
                      onChange={(e) => setQuickBookingData(prev => ({...prev, returnTime: e.target.value}))}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                    >
                      <option value="" className="text-gray-800">Seçin</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time} className="text-gray-800">
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Adım 4: Kişi ve Bagaj Sayısı (Tarih-saat girilmişse göster) */}
          {quickBookingData.pickupLocation && 
           quickBookingData.dropoffLocation && 
           quickBookingData.date && 
           quickBookingData.time &&
           (quickBookingData.tripType === 'one-way' || (quickBookingData.returnDate && quickBookingData.returnTime)) && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white text-xs font-medium mb-1">
                    <Users className="w-3 h-3 inline mr-1" />
                    Kişi
                  </label>
                  <select
                    value={quickBookingData.passengerCount}
                    onChange={(e) => setQuickBookingData(prev => ({...prev, passengerCount: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num} className="text-gray-800">
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-xs font-medium mb-1">
                    <Package className="w-3 h-3 inline mr-1" />
                    Bagaj
                  </label>
                  <select
                    value={quickBookingData.baggageCount}
                    onChange={(e) => setQuickBookingData(prev => ({...prev, baggageCount: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num} className="text-gray-800">
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Adım 5: Rezervasyon Butonu (Tüm bilgiler girilmişse aktif) */}
          {quickBookingData.pickupLocation && 
           quickBookingData.dropoffLocation && 
           quickBookingData.date && 
           quickBookingData.time &&
           (quickBookingData.tripType === 'one-way' || (quickBookingData.returnDate && quickBookingData.returnTime)) && (
            <div className="animate-fade-in">
              <button
                onClick={handleQuickBooking}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                Araç Seçimi Yap
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Trust Badges - SSL ve Güvenlik */}
          <div className="pt-3 sm:pt-4 border-t border-white/25">
            <div className="flex justify-center space-x-3 sm:space-x-4 text-xs">
              <div className="flex items-center space-x-1 text-green-300 bg-green-500/10 px-2 py-1 rounded backdrop-blur-sm">
                <Shield className="w-3 h-3" />
                <span>SSL Güvenli</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-300 bg-blue-500/10 px-2 py-1 rounded backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span>Lisanslı</span>
              </div>
              <div className="flex items-center space-x-1 text-purple-300 bg-purple-500/10 px-2 py-1 rounded backdrop-blur-sm">
                <Star className="w-3 h-3" />
                <span>Güvenilir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBookingForm;
