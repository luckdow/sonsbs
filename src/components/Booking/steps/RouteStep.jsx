import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Calendar,
  Users,
  Luggage,
  ArrowRight,
  ArrowRightLeft,
  ChevronDown,
  Navigation,
  Route,
  Car,
  CheckCircle,
  User,
  Plus,
  Minus,
  Info,
  Star,
  RotateCcw
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { calculateVehiclePrice as calculateVehiclePricing, getDefaultPricingForType } from '../../../utils/vehiclePricing';

const RouteStep = ({ bookingData, updateBookingData, onNext }) => {
  // Trip type
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
  const [baggageCount, setBaggageCount] = useState(bookingData.baggageCount || 0);
  
  // Route info and map
  const [routeInfo, setRouteInfo] = useState(bookingData.routeInfo || null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  
  // Vehicle selection
  const [selectedVehicle, setSelectedVehicle] = useState(bookingData.selectedVehicle || null);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  
  // Autocomplete states
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [googlePickupSuggestions, setGooglePickupSuggestions] = useState([]);
  const [googleDropoffSuggestions, setGoogleDropoffSuggestions] = useState([]);
  
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const autocompletePickup = useRef(null);
  const autocompleteDropoff = useRef(null);
  const placesService = useRef(null);
  const mapRef = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);

  // Ana sayfadan gelen hızlı rezervasyon verilerini kontrol et
  useEffect(() => {
    if (bookingData.prefilledFromHome) {
      console.log('Ana sayfadan gelen veriler:', bookingData);
      
      // Lokasyonları güncelle
      if (bookingData.pickupLocation) {
        setPickupLocation(bookingData.pickupLocation);
      }
      if (bookingData.dropoffLocation) {
        setDropoffLocation(bookingData.dropoffLocation);
      }
      
      // Tarih ve saati güncelle
      if (bookingData.date) setDate(bookingData.date);
      if (bookingData.time) setTime(bookingData.time);
      
      // Kişi ve bagaj sayısını güncelle
      if (bookingData.passengerCount) setPassengerCount(bookingData.passengerCount);
      if (bookingData.baggageCount) setBaggageCount(bookingData.baggageCount);
      
      // Eğer showVehicles flag'i varsa araçları direkt yükle ve göster
      if (bookingData.showVehicles && bookingData.pickupLocation && bookingData.dropoffLocation) {
        setShowVehicles(true);
        // Araçları yükle
        loadVehicles();
        // Route hesaplama işlemlerini tetikle
        setTimeout(() => {
          calculateRoute(bookingData.pickupLocation, bookingData.dropoffLocation);
        }, 1000);
      }
    }
  }, [bookingData.prefilledFromHome]);

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
        console.log('Google Maps not loaded yet');
        return;
      }

      // Initialize Places Service
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      // Initialize Directions Service
      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        draggable: false
      });

      console.log('Google Places and Directions initialized successfully');
      
    } catch (error) {
      console.error('Google Places initialization error:', error);
    }
  };

  // Search Google Places
  const searchGooglePlaces = (query, isPickup = true) => {
    if (!placesService.current || !query || query.length < 2) {
      if (isPickup) {
        setGooglePickupSuggestions([]);
      } else {
        setGoogleDropoffSuggestions([]);
      }
      return;
    }

    const request = {
      query: query,
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(36.0, 29.0), // SW corner of Antalya region
        new window.google.maps.LatLng(37.5, 32.5)  // NE corner of Antalya region
      ),
      fields: ['place_id', 'formatted_address', 'geometry', 'name', 'rating', 'types']
    };

    placesService.current.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const suggestions = results.slice(0, 5).map(place => ({
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          rating: place.rating || 0,
          type: 'google',
          place_id: place.place_id,
          types: place.types || []
        }));

        if (isPickup) {
          setGooglePickupSuggestions(suggestions);
        } else {
          setGoogleDropoffSuggestions(suggestions);
        }
      } else {
        if (isPickup) {
          setGooglePickupSuggestions([]);
        } else {
          setGoogleDropoffSuggestions([]);
        }
      }
    });
  };

  // Filter vehicles based on passenger capacity
  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle => {
      // Filter by passenger capacity
      return vehicle.capacity >= passengerCount;
    }).sort((a, b) => {
      // Sort by capacity (smaller capacity first for efficiency)
      return a.capacity - b.capacity;
    });
  };

  // Load vehicles from Firebase
  useEffect(() => {
    loadVehicles();
  }, []);

  // Ana sayfadan gelen verileri kontrol et ve araç seçimini göster
  useEffect(() => {
    if (bookingData.prefilledFromHome && bookingData.showVehicles) {
      // Picker/Dropoff lokasyon string formatını güncelle
      if (bookingData.pickupLocation && typeof bookingData.pickupLocation === 'object') {
        setPickupLocation(bookingData.pickupLocation.address || bookingData.pickupLocation.name || '');
      }
      if (bookingData.dropoffLocation && typeof bookingData.dropoffLocation === 'object') {
        setDropoffLocation(bookingData.dropoffLocation.address || bookingData.dropoffLocation.name || '');
      }
      
      // Ana sayfadan gelen veriler varsa direkt araç seçimini göster
      setShowVehicles(true);
      
      console.log('Ana sayfadan gelen veriler yüklendi ve araç seçimi gösteriliyor');
    }
  }, [bookingData.prefilledFromHome, bookingData.showVehicles, bookingData.pickupLocation, bookingData.dropoffLocation]);

  const loadVehicles = async () => {
    setVehiclesLoading(true);
    try {
      console.log('Loading vehicles from Firebase...');
      
      const allVehiclesQuery = collection(db, 'vehicles');
      const allVehiclesSnapshot = await getDocs(allVehiclesQuery);
      
      if (allVehiclesSnapshot.empty) {
        console.log('No vehicles found in collection');
        setVehicles([]);
        return;
      }

      const vehiclesData = allVehiclesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          // Admin panelindeki tam veri yapısı
          name: data.name || `${data.brand} ${data.model}` || 'Bilinmeyen Araç',
          description: data.description || `${data.year} model ${data.brand} ${data.model}`,
          capacity: data.capacity || 4,
          luggage: data.baggage || 2, // baggage alanı luggage olarak kullanılıyor
          basePrice: data.kmRate || 25, // EUR cinsinden
          pricePerKm: data.pricePerKm || (data.kmRate ? data.kmRate / 10 : 2),
          status: data.isActive ? 'active' : 'inactive', // isActive boolean değeri
          image: data.imageUrl || data.image || '',
          features: data.features || [],
          type: data.type || 'sedan',
          // Yeni dinamik fiyatlandırma sistemi
          pricing: data.pricing || getDefaultPricingForType(data.type || 'sedan'),
          kmRate: data.kmRate || 25, // Fallback için
          rating: data.rating || 4.0,
          brand: data.brand || '',
          model: data.model || '',
          color: data.color || '',
          year: data.year || new Date().getFullYear(),
          ...data
        };
      });

      console.log('Loaded vehicles:', vehiclesData);

      // Sadece aktif araçları filtrele
      const activeVehicles = vehiclesData.filter(vehicle => 
        vehicle.status === 'active'
      );
      
      setVehicles(activeVehicles);
      console.log('Active vehicles set:', activeVehicles);
      
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  };

  // Calculate route using Google Maps Distance Matrix and show map
  const calculateRoute = async (pickup, dropoff) => {
    if (!pickup || !dropoff || !pickup.lat || !dropoff.lat) return;
    
    setRouteLoading(true);
    try {
      if (window.google && window.google.maps && directionsService.current) {
        // Calculate directions for the map
        const request = {
          origin: new window.google.maps.LatLng(pickup.lat, pickup.lng),
          destination: new window.google.maps.LatLng(dropoff.lat, dropoff.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        };

        directionsService.current.route(request, (result, status) => {
          if (status === 'OK') {
            const route = result.routes[0];
            const leg = route.legs[0];
            
            const routeData = {
              distance: leg.distance.text,
              duration: leg.duration.text,
              distanceValue: leg.distance.value,
              durationValue: leg.duration.value
            };
            
            setRouteInfo(routeData);
            setMapVisible(true);
            
            // Initialize map if not already done
            setTimeout(() => {
              initializeMap(result);
            }, 100);
          }
          setRouteLoading(false);
        });
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteLoading(false);
    }
  };

  // Initialize Google Map
  const initializeMap = (directionsResult) => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 11,
      center: { lat: 36.8969, lng: 30.7133 }, // Antalya center
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM
      },
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "weight": "2.00"
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#9c9c9c"
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
            {
              "color": "#f2f2f2"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
            {
              "saturation": -100
            },
            {
              "lightness": 45
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
            {
              "color": "#46bcec"
            },
            {
              "visibility": "on"
            }
          ]
        }
      ]
    });

    if (directionsRenderer.current && directionsResult) {
      directionsRenderer.current.setDirections(directionsResult);
      directionsRenderer.current.setMap(map);
      directionsRenderer.current.setOptions({
        polylineOptions: {
          strokeColor: "#3B82F6",
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });
    }
  };

  // Handle place selection
  const handlePlaceSelect = (place, isPickup = true) => {
    const locationData = {
      address: place.address || place.name,
      lat: place.lat,
      lng: place.lng,
      rating: place.rating
    };
    
    if (isPickup) {
      setPickupLocation(locationData);
      setShowPickupSuggestions(false);
      if (pickupRef.current) {
        pickupRef.current.value = place.address || place.name;
      }
    } else {
      setDropoffLocation(locationData);
      setShowDropoffSuggestions(false);
      if (dropoffRef.current) {
        dropoffRef.current.value = place.address || place.name;
      }
    }
    
    // Calculate route if both locations are set
    const pickup = isPickup ? locationData : pickupLocation;
    const dropoff = isPickup ? dropoffLocation : locationData;
    if (pickup && dropoff && pickup.lat && dropoff.lat) {
      calculateRoute(pickup, dropoff);
    }
  };

  // Calculate vehicle price based on distance using new pricing system
  const calculateVehiclePrice = (vehicle) => {
    if (!routeInfo || !routeInfo.distanceValue) {
      // Eğer rota yoksa minimum fiyat göster
      return 25; // Base price for sedan 1-20km
    }
    
    const distanceKm = routeInfo.distanceValue / 1000; // metre cinsinden km'ye çevir
    const isRoundTrip = tripType === 'round-trip';
    
    console.log('Fiyat hesaplama:', {
      distanceMeters: routeInfo.distanceValue,
      distanceKm,
      isRoundTrip,
      vehicleType: vehicle.type,
      hasPricing: !!vehicle.pricing
    });
    
    // Yeni dinamik fiyatlandırma sistemini kullan
    const priceData = calculateVehiclePricing(distanceKm, vehicle, isRoundTrip);
    
    console.log('Hesaplanan fiyat:', priceData.totalPrice, '€');
    
    return priceData.totalPrice;
  };

  // Passenger count handlers
  const handlePassengerChange = (increment) => {
    setPassengerCount(prev => {
      const newCount = increment ? 
        (prev < 50 ? prev + 1 : prev) : 
        (prev > 1 ? prev - 1 : prev);
      
      // Reset selected vehicle if it doesn't fit new passenger count
      if (selectedVehicle && selectedVehicle.capacity < newCount) {
        setSelectedVehicle(null);
      }
      
      // Show vehicles when passenger count is entered
      if (newCount > 0) {
        setShowVehicles(true);
      }
      
      return newCount;
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

  // Today's date for minimum date validation
  const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };

  // Handle next step
  const handleNext = () => {
    const updatedData = {
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
      totalPrice: selectedVehicle ? calculateVehiclePrice(selectedVehicle) : 0
    };
    updateBookingData(updatedData);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Rota ve Araç Seçimi</h2>
        <p className="text-gray-600 mt-2">Transfer rotanızı belirleyin ve aracınızı seçin</p>
      </div>

      {/* Trip Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Yolculuk Türü</label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`
              relative p-2 sm:p-4 rounded-lg border-2 transition-all duration-200
              ${tripType === 'one-way'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-xs sm:text-sm">Tek Yön</span>
            </div>
            {tripType === 'one-way' && (
              <CheckCircle className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`
              relative p-2 sm:p-4 rounded-lg border-2 transition-all duration-200
              ${tripType === 'round-trip'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-xs sm:text-sm">Gidiş-Dönüş</span>
            </div>
            {tripType === 'round-trip' && (
              <CheckCircle className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            )}
          </button>
        </div>
      </div>

      {/* Location Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup Location */}
        <div className="space-y-2 relative">
          <label className="block text-sm font-medium text-gray-700">Nereden</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-green-600" />
              </div>
            </div>
            <input
              ref={pickupRef}
              type="text"
              placeholder="Başlangıç noktanızı girin..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              value={typeof pickupLocation === 'string' ? pickupLocation : pickupLocation?.address || ''}
              onChange={(e) => {
                const value = e.target.value;
                setPickupLocation(value);
                setShowPickupSuggestions(value.length > 0);
                // Google Places search
                searchGooglePlaces(value, true);
              }}
              onFocus={() => setShowPickupSuggestions(true)}
              onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Google Places Dropdown for Pickup */}
          {showPickupSuggestions && googlePickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 bg-blue-50">
                <p className="text-xs font-medium text-blue-700 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded text-white text-[8px] flex items-center justify-center mr-2">G</span>
                  Google Önerileri
                </p>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {googlePickupSuggestions.slice(0, 4).map((place, index) => (
                  <button
                    key={`google-${index}`}
                    type="button"
                    onClick={() => handlePlaceSelect(place, true)}
                    className="w-full px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 flex items-center text-left border-b border-gray-50 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-2 w-full min-w-0">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">{place.name}</div>
                        <div className="text-xs text-gray-500 truncate">{place.address}</div>
                      </div>
                      {place.rating > 0 && (
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{place.rating}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dropoff Location */}
        <div className="space-y-2 relative">
          <label className="block text-sm font-medium text-gray-700">Nereye</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-red-600" />
              </div>
            </div>
            <input
              ref={dropoffRef}
              type="text"
              placeholder="Varış noktanızı girin..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              value={typeof dropoffLocation === 'string' ? dropoffLocation : dropoffLocation?.address || ''}
              onChange={(e) => {
                const value = e.target.value;
                setDropoffLocation(value);
                setShowDropoffSuggestions(value.length > 0);
                // Google Places search
                searchGooglePlaces(value, false);
              }}
              onFocus={() => setShowDropoffSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Google Places Dropdown for Dropoff */}
          {showDropoffSuggestions && googleDropoffSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 bg-blue-50">
                <p className="text-xs font-medium text-blue-700 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded text-white text-[8px] flex items-center justify-center mr-2">G</span>
                  Google Önerileri
                </p>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {googleDropoffSuggestions.slice(0, 4).map((place, index) => (
                  <button
                    key={`google-${index}`}
                    type="button"
                    onClick={() => handlePlaceSelect(place, false)}
                    className="w-full px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 flex items-center text-left border-b border-gray-50 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-2 w-full min-w-0">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">{place.name}</div>
                        <div className="text-xs text-gray-500 truncate">{place.address}</div>
                      </div>
                      {place.rating > 0 && (
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{place.rating}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Route Information */}
      {routeInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Route className="w-4 h-4 mr-2 text-blue-600" />
              Rota Bilgileri
            </h4>
            {routeLoading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          
          {/* Map Container - Daha büyük */}
          <div className="w-full">
            <div 
              ref={mapRef}
              className="w-full h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg border border-gray-200 bg-gray-100 shadow-md"
              style={{ minHeight: '256px' }}
            />
          </div>
          
          {/* Route Details - Kompakt alt alta */}
          <div className="bg-gray-50 rounded-lg p-3 text-left space-y-1">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Mesafe:</span>
              <span className="text-sm font-semibold text-blue-600">{routeInfo.distance}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Süre:</span>
              <span className="text-sm font-semibold text-purple-600">{routeInfo.duration}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Passenger and Baggage Count */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Passenger Count */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Yolcu Sayısı</label>
          <div className="flex items-center justify-center space-x-2 bg-blue-50 rounded-lg p-2 sm:p-3">
            <button
              type="button"
              onClick={() => handlePassengerChange(false)}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50"
              disabled={passengerCount <= 1}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
            <div className="bg-white rounded-lg px-2 py-1 sm:px-4 sm:py-2 min-w-[2rem] sm:min-w-[3rem] text-center">
              <span className="text-sm sm:text-lg font-bold text-gray-800">{passengerCount}</span>
            </div>
            <button
              type="button"
              onClick={() => handlePassengerChange(true)}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 shadow-md hover:shadow-lg hover:bg-blue-600 flex items-center justify-center disabled:opacity-50"
              disabled={passengerCount >= 50}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Baggage Count */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bagaj Sayısı</label>
          <div className="flex items-center justify-center space-x-2 bg-purple-50 rounded-lg p-2 sm:p-3">
            <button
              type="button"
              onClick={() => handleBaggageChange(false)}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50"
              disabled={baggageCount <= 0}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
            <div className="bg-white rounded-lg px-2 py-1 sm:px-4 sm:py-2 min-w-[2rem] sm:min-w-[3rem] text-center">
              <span className="text-sm sm:text-lg font-bold text-gray-800">{baggageCount}</span>
            </div>
            <button
              type="button"
              onClick={() => handleBaggageChange(true)}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-500 shadow-md hover:shadow-lg hover:bg-purple-600 flex items-center justify-center disabled:opacity-50"
              disabled={baggageCount >= 20}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Date and Time Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Tarih ve Saat</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {tripType === 'round-trip' ? 'Gidiş Tarihi' : 'Tarih'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={date}
                min={getTodayDate()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {tripType === 'round-trip' ? 'Gidiş Saati' : 'Saat'}
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Return Date and Time for Round Trip */}
        {tripType === 'round-trip' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dönüş Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={returnDate}
                  min={date || getTodayDate()}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dönüş Saati</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Selection */}
      {(showVehicles && routeInfo && passengerCount > 0) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Araç Seçimi</h3>
            {passengerCount > 1 && (
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                {passengerCount} kişi için uygun araçlar
              </span>
            )}
          </div>
        
        {vehiclesLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Araçlar yükleniyor...</p>
          </div>
        ) : getFilteredVehicles().length === 0 ? (
          <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
            <Car className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800 font-medium">
              {passengerCount} kişi için uygun araç bulunamadı
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Lütfen yolcu sayısını azaltın veya bizimle iletişime geçin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredVehicles().map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleVehicleSelect(vehicle)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${selectedVehicle?.id === vehicle.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                {/* Araç Resmi */}
                <div className="mb-3">
                  {vehicle.image || vehicle.imageUrl ? (
                    <img
                      src={vehicle.image || vehicle.imageUrl}
                      alt={vehicle.name}
                      className="w-full h-32 sm:h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-32 sm:h-40 bg-gray-100 rounded-lg flex items-center justify-center ${vehicle.image || vehicle.imageUrl ? 'hidden' : 'flex'}`}>
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Araç Bilgileri */}
                <div className="space-y-3">
                  {/* Araç İsmi */}
                  <h3 className="font-bold text-gray-900 text-lg">{vehicle.name}</h3>
                  
                  {/* Kapasite */}
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{vehicle.capacity} Kişi</span>
                  </div>

                  {/* Özellikler */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 4).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{vehicle.features.length - 4} daha
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toplam Fiyat */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Toplam Fiyat</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          €{calculateVehiclePrice(vehicle)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tripType === 'round-trip' ? 'Gidiş-Dönüş' : 'Tek Yön'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seçim İkonu */}
                {selectedVehicle?.id === vehicle.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Kişisel Bilgilere Geç</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RouteStep;
