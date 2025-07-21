import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
import { initializeSettings } from '../../utils/initializeFirebaseData';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Hızlı rezervasyon form state
  const [quickBookingData, setQuickBookingData] = useState({
    tripType: '', // Başlangıçta boş - kullanıcı seçecek
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
  const autocompletePickup = useRef(null);
  const autocompleteDropoff = useRef(null);

  // Demo settings'i başlat
  useEffect(() => {
    const setupSettings = async () => {
      try {
        await initializeSettings();
      } catch (error) {
        console.error('Settings kurulumu hatası:', error);
      }
    };
    
    setupSettings();
  }, []);

  // Google Places Autocomplete başlat
  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        // Pickup autocomplete
        if (autocompletePickup.current) {
          const pickupAutocomplete = new window.google.maps.places.Autocomplete(
            autocompletePickup.current,
            {
              types: ['establishment', 'geocode'],
              componentRestrictions: { country: 'tr' },
              fields: ['place_id', 'formatted_address', 'name', 'geometry']
            }
          );

          pickupAutocomplete.addListener('place_changed', () => {
            const place = pickupAutocomplete.getPlace();
            if (place && place.formatted_address) {
              setPickupInput(place.formatted_address);
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
          });
        }

        // Dropoff autocomplete
        if (autocompleteDropoff.current) {
          const dropoffAutocomplete = new window.google.maps.places.Autocomplete(
            autocompleteDropoff.current,
            {
              types: ['establishment', 'geocode'],
              componentRestrictions: { country: 'tr' },
              fields: ['place_id', 'formatted_address', 'name', 'geometry']
            }
          );

          dropoffAutocomplete.addListener('place_changed', () => {
            const place = dropoffAutocomplete.getPlace();
            if (place && place.formatted_address) {
              setDropoffInput(place.formatted_address);
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
          });
        }
      }
    };

    // Google Maps API yüklenene kadar bekle
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
        clearInterval(checkGoogleMaps);
      }
    }, 500);

    // 10 saniye sonra kontrol etmeyi bırak
    setTimeout(() => {
      clearInterval(checkGoogleMaps);
    }, 10000);

    return () => clearInterval(checkGoogleMaps);
  }, []);

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
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Antalya Güvenli Transfer",
      description: "Antalya genelinde 7/24 güvenli ve konforlu VIP transfer hizmeti"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Zamanında Teslimat",
      description: "Antalya havalimanı ve şehir transferlerinde dakiklik garantisi"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sigortalı Transfer Hizmeti",
      description: "Antalya transfer hizmetlerinde tam kapsamlı sigorta güvencesi"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Antalya VIP Kalite",
      description: "Lüks araçlar ve Antalya'yı tanıyan profesyonel şoförler"
    }
  ];

  const services = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Antalya Havalimanı Transfer",
      description: "Antalya Havalimanı'ndan otel ve şehir merkezine güvenli VIP transfer hizmeti",
      price: "₺120'den başlayan fiyatlar"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Antalya Grup Transfer",
      description: "Büyük gruplar için Antalya genelinde özel araç transfer çözümleri",
      price: "₺250'den başlayan fiyatlar"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Antalya Şehir İçi Transfer",
      description: "Antalya şehir içi, otel arası ve turistik alan transferleri",
      price: "₺60'dan başlayan fiyatlar"
    }
  ];

  const stats = [
    { number: "50K+", label: "Mutlu Müşteri" },
    { number: "100K+", label: "Başarılı Transfer" },
    { number: "24/7", label: "Hizmet Saati" },
    { number: "99%", label: "Memnuniyet Oranı" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Hero Content - Mobile First, then Two Column */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
            
            {/* Mobile & Desktop Quick Booking Form - Shows first on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 w-full lg:w-auto"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden">
                {/* Neon glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
                <div className="absolute inset-0 rounded-2xl border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">
                      <Car className="w-5 h-5 inline mr-2" />
                      Hızlı Rezervasyon
                    </h3>
                    <p className="text-gray-300 text-xs lg:text-sm">
                      {!quickBookingData.tripType ? 'Seyahat türünü seçin' :
                       !quickBookingData.pickupLocation || !quickBookingData.dropoffLocation ? 'Lokasyonları girin' :
                       !quickBookingData.date || !quickBookingData.time ? 'Tarih ve saat seçin' :
                       (quickBookingData.tripType === 'round-trip' && (!quickBookingData.returnDate || !quickBookingData.returnTime)) ? 'Dönüş tarih-saat seçin' :
                       'Kişi sayısını belirtin ve devam edin'}
                    </p>
                  </div>

                  <div className="space-y-4">
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
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
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
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            quickBookingData.tripType === 'round-trip'
                              ? 'bg-blue-600 text-white border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                              : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                          }`}
                        >
                          Gidiş-Dönüş
                        </button>
                      </div>
                    </div>

                    {/* Adım 2: Nereden - Nereye (Her zaman görünür) */}
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-white text-xs font-medium mb-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          Nereden
                        </label>
                        <input
                          ref={autocompletePickup}
                          type="text"
                          value={pickupInput}
                          onChange={(e) => setPickupInput(e.target.value)}
                          placeholder="Antalya Havalimanı..."
                          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm focus:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-xs font-medium mb-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          Nereye
                        </label>
                        <input
                          ref={autocompleteDropoff}
                          type="text"
                          value={dropoffInput}
                          onChange={(e) => setDropoffInput(e.target.value)}
                          placeholder="Otel adı..."
                          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm focus:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        />
                      </div>
                    </div>

                    {/* Adım 3: Gidiş Tarih ve Saat (Lokasyonlar girilmişse göster) */}
                    {quickBookingData.tripType && quickBookingData.pickupLocation && quickBookingData.dropoffLocation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
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
                          <div className="grid grid-cols-2 gap-3">
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
                      </motion.div>
                    )}

                    {/* Adım 4: Kişi ve Bagaj Sayısı (Tarih-saat girilmişse göster) */}
                    {quickBookingData.tripType && 
                     quickBookingData.pickupLocation && 
                     quickBookingData.dropoffLocation && 
                     quickBookingData.date && 
                     quickBookingData.time &&
                     (quickBookingData.tripType === 'one-way' || (quickBookingData.returnDate && quickBookingData.returnTime)) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
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
                      </motion.div>
                    )}

                    {/* Adım 5: Rezervasyon Butonu (Tüm bilgiler girilmişse aktif) */}
                    {quickBookingData.tripType && 
                     quickBookingData.pickupLocation && 
                     quickBookingData.dropoffLocation && 
                     quickBookingData.date && 
                     quickBookingData.time &&
                     (quickBookingData.tripType === 'one-way' || (quickBookingData.returnDate && quickBookingData.returnTime)) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          onClick={handleQuickBooking}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        >
                          Araç Seçimi Yap
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    {/* Trust Badges - SSL ve Güvenlik */}
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex justify-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1 text-green-400">
                          <Shield className="w-3 h-3" />
                          <span>SSL Güvenli</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Lisanslı</span>
                        </div>
                        <div className="flex items-center space-x-1 text-purple-400">
                          <Star className="w-3 h-3" />
                          <span>Güvenilir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content - Shows second on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Antalya
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl">VIP Transfer</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8 leading-relaxed">
                Antalya'nın en güvenilir VIP transfer hizmeti. Profesyonel şoförler, 
                lüks araçlar ve 7/24 güvenli yolculuk garantisi.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 group-hover:text-blue-400 transition-colors">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-xs md:text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/rezervasyon"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                >
                  Rezervasyon Yap
                </Link>
                <Link 
                  to="/rezervasyonlarim"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                >
                  Rezervasyonlarım
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Antalya Transfer Hizmetimizi Neden Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Antalya'da yılların deneyimi ve modern teknoloji ile size en iyi transfer hizmetini sunuyoruz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center group hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-body">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Antalya Transfer Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Antalya'da ihtiyacınıza uygun VIP transfer çözümlerini keşfedin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="card group hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-body text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="text-lg font-semibold text-blue-600 mb-6">
                    {service.price}
                  </div>
                  <Link 
                    to="/book-transfer" 
                    className="btn btn-primary w-full group-hover:scale-105 transition-transform"
                  >
                    Rezervasyon Yap
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Antalya Transfer Rezervasyonu
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Antalya'da size özel VIP transfer çözümlerimizle konforlu yolculuğunuz başlasın. 
              7/24 Antalya transfer desteği ve garantili hizmet kalitesi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/rezervasyon" 
                className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Şimdi Rezervasyon Yap
                </motion.span>
              </Link>
              
              <a 
                href="tel:+902422281234" 
                className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-2xl"
              >
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-6 h-6" />
                  +90 242 228 12 34
                </motion.span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Phone className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Antalya Transfer Telefon</h3>
              <p className="text-gray-300">+90 242 228 12 34</p>
            </motion.div>
            
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Antalya Transfer E-posta</h3>
              <p className="text-gray-300">info@sbstransfer.com</p>
            </motion.div>
            
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Clock className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Antalya Transfer Saatleri</h3>
              <p className="text-gray-300">7/24 Hizmet</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
