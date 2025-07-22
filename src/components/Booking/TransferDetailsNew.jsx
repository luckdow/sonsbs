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
  Shield,
  Route,
  Timer,
  Car,
  Sparkles
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const TransferDetailsNew = ({ bookingData, setBookingData, onNext }) => {
  // Trip type: one-way or round-trip
  const [tripType, setTripType] = useState(bookingData.tripType || 'one-way');
  
  // Locations
  const [pickupLocation, setPickupLocation] = useState(bookingData.pickupLocation || '');
  const [dropoffLocation, setDropoffLocation] = useState(bookingData.dropoffLocation || '');
  
  // Date and time
  const getDefaultDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };
  
  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 4);
    return now.toTimeString().slice(0, 5);
  };

  const [date, setDate] = useState(bookingData.date || getDefaultDate());
  const [time, setTime] = useState(bookingData.time || getDefaultTime());
  const [returnDate, setReturnDate] = useState(bookingData.returnDate || '');
  const [returnTime, setReturnTime] = useState(bookingData.returnTime || '');
  
  // Passenger and baggage
  const [passengerCount, setPassengerCount] = useState(bookingData.passengerCount || 1);
  const [baggageCount, setBaggageCount] = useState(bookingData.baggageCount || 1);
  
  // Route info and map
  const [routeInfo, setRouteInfo] = useState(null);
  const [showRouteDrawer, setShowRouteDrawer] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  
  // Vehicle selection
  const [selectedVehicle, setSelectedVehicle] = useState(bookingData.selectedVehicle || null);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  
  // Popular places and autocomplete
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [popularPlaces] = useState([
    { name: 'Antalya Havalimanı', rating: 5, type: 'airport', address: 'Antalya Havalimanı, Antalya, Türkiye', lat: 36.8987, lng: 30.8005 },
    { name: 'Kaleici', rating: 4.8, type: 'tourist', address: 'Kaleiçi, Muratpaşa, Antalya', lat: 36.8841, lng: 30.7056 },
    { name: 'Lara Beach', rating: 4.7, type: 'beach', address: 'Lara Plajı, Muratpaşa, Antalya', lat: 36.8563, lng: 30.7348 },
    { name: 'Belek', rating: 4.6, type: 'tourist', address: 'Belek, Serik, Antalya', lat: 36.8632, lng: 31.0553 },
    { name: 'Side', rating: 4.5, type: 'tourist', address: 'Side, Manavgat, Antalya', lat: 36.7669, lng: 31.3891 },
    { name: 'Kemer', rating: 4.4, type: 'tourist', address: 'Kemer, Antalya', lat: 36.6022, lng: 30.5595 }
  ]);
  
  const [errors, setErrors] = useState({});
  
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const autocompletePickup = useRef(null);
  const autocompleteDropoff = useRef(null);

  // Google Places Autocomplete initialization
  useEffect(() => {
    const initPlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setTimeout(() => {
          initializeAutocomplete();
        }, 100);
      } else {
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
  }, []);

  const initializeAutocomplete = () => {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        return;
      }

      // Clear previous autocompletes
      if (autocompletePickup.current) {
        window.google.maps.event.clearInstanceListeners(autocompletePickup.current);
        autocompletePickup.current = null;
      }
      if (autocompleteDropoff.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteDropoff.current);
        autocompleteDropoff.current = null;
      }

      // Pickup autocomplete
      if (pickupRef.current) {
        autocompletePickup.current = new window.google.maps.places.Autocomplete(
          pickupRef.current,
          {
            componentRestrictions: { country: 'tr' },
            fields: ['place_id', 'formatted_address', 'geometry', 'name', 'rating']
          }
        );

        autocompletePickup.current.addListener('place_changed', () => {
          const place = autocompletePickup.current.getPlace();
          if (place && place.geometry) {
            const locationData = {
              address: place.formatted_address || place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              rating: place.rating || 0
            };
            setPickupLocation(locationData);
            setShowPickupSuggestions(false);
            calculateRoute(locationData, dropoffLocation);
          }
        });
      }

      // Dropoff autocomplete
      if (dropoffRef.current) {
        autocompleteDropoff.current = new window.google.maps.places.Autocomplete(
          dropoffRef.current,
          {
            componentRestrictions: { country: 'tr' },
            fields: ['place_id', 'formatted_address', 'geometry', 'name', 'rating']
          }
        );

        autocompleteDropoff.current.addListener('place_changed', () => {
          const place = autocompleteDropoff.current.getPlace();
          if (place && place.geometry) {
            const locationData = {
              address: place.formatted_address || place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              rating: place.rating || 0
            };
            setDropoffLocation(locationData);
            setShowDropoffSuggestions(false);
            calculateRoute(pickupLocation, locationData);
          }
        });
      }
    } catch (error) {
      console.error('Google Places initialization error:', error);
    }
  };

  // Load vehicles from Firebase
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setVehiclesLoading(true);
    try {
      const vehiclesQuery = query(
        collection(db, 'vehicles'),
        where('status', '==', 'active')
      );
      const vehiclesSnapshot = await getDocs(vehiclesQuery);
      const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setVehiclesLoading(false);
    }
  };

  // Calculate route using Google Maps Distance Matrix
  const calculateRoute = async (pickup, dropoff) => {
    if (!pickup || !dropoff || !pickup.lat || !dropoff.lat) return;
    
    setRouteLoading(true);
    try {
      if (window.google && window.google.maps) {
        const service = new window.google.maps.DistanceMatrixService();
        
        service.getDistanceMatrix({
          origins: [new window.google.maps.LatLng(pickup.lat, pickup.lng)],
          destinations: [new window.google.maps.LatLng(dropoff.lat, dropoff.lng)],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === 'OK') {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK') {
              const routeData = {
                distance: element.distance.text,
                duration: element.duration.text,
                distanceValue: element.distance.value,
                durationValue: element.duration.value
              };
              setRouteInfo(routeData);
              setShowRouteDrawer(true);
            }
          }
          setRouteLoading(false);
        });
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteLoading(false);
    }
  };

  // Handle popular place selection
  const handlePopularPlaceSelect = (place, isPickup = true) => {
    const locationData = {
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      rating: place.rating
    };
    
    if (isPickup) {
      setPickupLocation(locationData);
      setShowPickupSuggestions(false);
      if (pickupRef.current) {
        pickupRef.current.value = place.address;
      }
    } else {
      setDropoffLocation(locationData);
      setShowDropoffSuggestions(false);
      if (dropoffRef.current) {
        dropoffRef.current.value = place.address;
      }
    }
    
    // Calculate route if both locations are set
    const pickup = isPickup ? locationData : pickupLocation;
    const dropoff = isPickup ? dropoffLocation : locationData;
    if (pickup && dropoff && pickup.lat && dropoff.lat) {
      calculateRoute(pickup, dropoff);
    }
  };

  // Passenger count handlers
  const handlePassengerChange = (increment) => {
    setPassengerCount(prev => {
      if (increment) {
        return prev < 50 ? prev + 1 : prev;
      } else {
        return prev > 1 ? prev - 1 : prev;
      }
    });
  };

  // Baggage count handlers  
  const handleBaggageChange = (increment) => {
    setBaggageCount(prev => {
      if (increment) {
        return prev < 20 ? prev + 1 : prev;
      } else {
        return prev > 0 ? prev - 1 : prev;
      }
    });
  };

  // Vehicle selection handler
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Calculate vehicle price based on distance
  const calculateVehiclePrice = (vehicle) => {
    if (!routeInfo || !vehicle.pricePerKm) return vehicle.basePrice || 0;
    const distanceKm = routeInfo.distanceValue / 1000;
    const basePrice = vehicle.basePrice || 0;
    const distancePrice = distanceKm * vehicle.pricePerKm;
    return Math.round(basePrice + distancePrice);
  };

  // Today's date for minimum date validation
  const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!pickupLocation || (typeof pickupLocation === 'string' && pickupLocation.trim() === '')) {
      newErrors.pickupLocation = 'Başlangıç noktasını seçiniz';
    }

    if (!dropoffLocation || (typeof dropoffLocation === 'string' && dropoffLocation.trim() === '')) {
      newErrors.dropoffLocation = 'Varış noktasını seçiniz';
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

    if (tripType === 'round-trip') {
      if (!returnDate) {
        newErrors.returnDate = 'Dönüş tarihi seçiniz';
      }
      if (!returnTime) {
        newErrors.returnTime = 'Dönüş saati seçiniz';
      }
    }

    if (!selectedVehicle) {
      newErrors.selectedVehicle = 'Lütfen bir araç seçiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      const updatedData = {
        ...bookingData,
        tripType,
        pickupLocation,
        dropoffLocation,
        date,
        time,
        returnDate: tripType === 'round-trip' ? returnDate : null,
        returnTime: tripType === 'round-trip' ? returnTime : null,
        passengerCount,
        baggageCount,
        selectedVehicle,
        routeInfo,
        totalPrice: calculateVehiclePrice(selectedVehicle)
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
              <Route className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Nereden Nereye?</h1>
            <p className="text-blue-100 text-sm">
              Rotanızı belirleyin, aracınızı seçin ve yolculuğunuzu planlayın
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
          
          {/* Trip Type Selection */}
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                Yolculuk Türü
              </h2>
              <p className="text-sm text-gray-600">
                Tek yön mü yoksa gidiş-dönüş mü?
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setTripType('one-way')}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${
                  tripType === 'one-way'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tripType === 'one-way' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">Tek Yön</div>
                    <div className="text-xs text-gray-600">Sadece gidiş</div>
                  </div>
                  {tripType === 'one-way' && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setTripType('round-trip')}
                className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${
                  tripType === 'round-trip'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tripType === 'round-trip' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">Gidiş-Dönüş</div>
                    <div className="text-xs text-gray-600">İki yön</div>
                  </div>
                  {tripType === 'round-trip' && (
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Lokasyon Seçimi
              </h3>
              <p className="text-sm text-gray-600">
                Başlangıç ve varış noktalarınızı belirtin
              </p>
            </div>

            {/* Pickup Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nereden
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <input
                  ref={pickupRef}
                  type="text"
                  placeholder="Başlangıç noktanızı girin..."
                  className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium transition-all"
                  value={typeof pickupLocation === 'string' ? pickupLocation : pickupLocation?.address || ''}
                  onChange={(e) => {
                    setPickupLocation(e.target.value);
                    setShowPickupSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowPickupSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {/* Popular Places Suggestions for Pickup */}
              {showPickupSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-600 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Popüler Yerler
                    </p>
                  </div>
                  {popularPlaces.map((place, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePopularPlaceSelect(place, true)}
                      className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 text-left transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{place.name}</div>
                        <div className="text-xs text-gray-500 truncate">{place.address}</div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{place.rating}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
              
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

            {/* Dropoff Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nereye
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <input
                  ref={dropoffRef}
                  type="text"
                  placeholder="Varış noktanızı girin..."
                  className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium transition-all"
                  value={typeof dropoffLocation === 'string' ? dropoffLocation : dropoffLocation?.address || ''}
                  onChange={(e) => {
                    setDropoffLocation(e.target.value);
                    setShowDropoffSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowDropoffSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {/* Popular Places Suggestions for Dropoff */}
              {showDropoffSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-600 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Popüler Yerler
                    </p>
                  </div>
                  {popularPlaces.map((place, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePopularPlaceSelect(place, false)}
                      className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 text-left transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{place.name}</div>
                        <div className="text-xs text-gray-500 truncate">{place.address}</div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{place.rating}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
              
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
          </div>

          {/* Route Information Drawer */}
          <AnimatePresence>
            {showRouteDrawer && routeInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Route className="w-5 h-5 mr-2 text-blue-600" />
                    Rota Bilgileri
                  </h4>
                  {routeLoading && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">{routeInfo.distance}</div>
                    <div className="text-xs text-gray-600">Mesafe</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-purple-600">{routeInfo.duration}</div>
                    <div className="text-xs text-gray-600">Tahmini Süre</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-600">
                    🗺️ Harita üzerinde mavi rota çizilecek
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Passenger and Baggage Count */}
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Yolcu Bilgileri
              </h3>
              <p className="text-sm text-gray-600">
                Yolcu sayısı ve bagaj miktarını belirtin
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Passenger Count */}
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

              {/* Baggage Count */}
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

          {/* Date and Time Selection */}
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Tarih ve Saat
              </h3>
              <p className="text-sm text-gray-600">
                {tripType === 'round-trip' ? 'Gidiş ve dönüş' : 'Transfer'} tarih ve saatinizi belirtin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tripType === 'round-trip' ? 'Gidiş Tarihi' : 'Tarih'}
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
                  {tripType === 'round-trip' ? 'Gidiş Saati' : 'Saat'}
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

            {/* Return Date and Time for Round Trip */}
            {tripType === 'round-trip' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dönüş Tarihi
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={returnDate}
                      min={date || getTodayDate()}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all"
                    />
                  </div>
                  {errors.returnDate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-500 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.returnDate}</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dönüş Saati
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all"
                    />
                  </div>
                  {errors.returnTime && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-500 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.returnTime}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Araç Seçimi
              </h3>
              <p className="text-sm text-gray-600">
                Size uygun aracı seçin
              </p>
            </div>

            {vehiclesLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Araçlar yükleniyor...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <motion.button
                    key={vehicle.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleVehicleSelect(vehicle)}
                    className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all text-left ${
                      selectedVehicle?.id === vehicle.id
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedVehicle?.id === vehicle.id
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Car className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{vehicle.description}</div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {vehicle.capacity} kişi
                          </span>
                          <span className="flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            {vehicle.luggage} bagaj
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-green-600">
                          €{calculateVehiclePrice(vehicle)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tripType === 'round-trip' ? 'Gidiş-Dönüş' : 'Tek Yön'}
                        </div>
                      </div>
                    </div>
                    {selectedVehicle?.id === vehicle.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {errors.selectedVehicle && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.selectedVehicle}</span>
              </motion.div>
            )}
          </div>

          {/* Information Note */}
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
                    <span>Adres girdikçe popüler yerler ve öneriler beliriecektir</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Rota belirlendikten sonra mesafe ve süre gösterilecektir</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
          >
            <span>Kişisel Bilgilere Geç</span>
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

export default TransferDetailsNew;
