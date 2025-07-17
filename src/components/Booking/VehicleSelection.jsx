import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  Star, 
  MapPin, 
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { VEHICLE_TYPES } from '../../config/constants';

const VehicleSelection = ({ bookingData, setBookingData, onNext, onBack }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(bookingData.selectedVehicle || null);
  const [selectedServices, setSelectedServices] = useState(bookingData.selectedServices || []);
  const [distance, setDistance] = useState(50); // Varsayılan 50km
  const [duration, setDuration] = useState(60); // Varsayılan 60dk
  const [routeLoaded, setRouteLoaded] = useState(true); // Başlangıçta true
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const map = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);

  // Antalya Havalimanı koordinatları
  const ANTALYA_AIRPORT = {
    lat: 36.8987,
    lng: 30.8005
  };

  // Ekstra hizmetler
  const extraServices = [
    {
      id: 'baby_seat',
      name: 'Bebek Koltuğu',
      price: 50,
      description: 'Güvenli bebek koltuğu (0-4 yaş)',
      icon: '👶'
    },
    {
      id: 'child_seat',
      name: 'Çocuk Koltuğu',
      price: 40,
      description: 'Güvenli çocuk koltuğu (4-12 yaş)',
      icon: '👧'
    },
    {
      id: 'wheelchair',
      name: 'Tekerlekli Sandalye Desteği',
      price: 75,
      description: 'Tekerlekli sandalye taşıma desteği',
      icon: '♿'
    },
    {
      id: 'extra_luggage',
      name: 'Ekstra Bagaj',
      price: 30,
      description: 'Standart üzeri bagaj taşıma',
      icon: '🧳'
    },
    {
      id: 'meet_greet',
      name: 'Karşılama Hizmeti',
      price: 100,
      description: 'Havalimanında karşılama ve yönlendirme',
      icon: '🎯'
    },
    {
      id: 'refreshments',
      name: 'İkram Paketi',
      price: 25,
      description: 'Su, kahve, çikolata ikram paketi',
      icon: '☕'
    }
  ];

  // Araç tipleri ve fiyatlandırma
  const vehicles = [
    {
      id: VEHICLE_TYPES.VIP_CAR,
      name: 'VIP Araç',
      capacity: '1-3 Kişi',
      basePrice: 150,
      pricePerKm: 3,
      image: '🚗',
      features: ['Klima', 'WiFi', 'Su İkramı', 'Premium İç Tasarım'],
      description: 'Konforlu ve lüks seyahat deneyimi'
    },
    {
      id: VEHICLE_TYPES.MINIBUS,
      name: 'Minibüs',
      capacity: '4-8 Kişi',
      basePrice: 200,
      pricePerKm: 4,
      image: '🚐',
      features: ['Klima', 'Geniş Bagaj', 'Rahat Koltuklar'],
      description: 'Aileler ve küçük gruplar için ideal'
    },
    {
      id: VEHICLE_TYPES.MIDIBUS,
      name: 'Midibüs',
      capacity: '9-16 Kişi',
      basePrice: 300,
      pricePerKm: 5,
      image: '🚌',
      features: ['Klima', 'Geniş Bagaj', 'TV/Müzik Sistemi'],
      description: 'Orta büyüklükteki gruplar için'
    },
    {
      id: VEHICLE_TYPES.BUS,
      name: 'Otobüs',
      capacity: '17+ Kişi',
      basePrice: 400,
      pricePerKm: 6,
      image: '🚍',
      features: ['Klima', 'TV/Müzik', 'Büyük Bagaj', 'Hostesli Hizmet'],
      description: 'Büyük gruplar ve organizasyonlar için'
    }
  ];

  useEffect(() => {
    // Google Maps yüklenene kadar bekle
    if (!window.google) {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeMap();
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    } else {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    // Harita ve lokasyon verileri hazır olduğunda rota hesapla
    if (map.current && bookingData.pickupLocation && bookingData.dropoffLocation) {
      setTimeout(() => {
        calculateRoute();
      }, 500); // Kısa bir gecikme ile
    } else if (map.current) {
      // Lokasyon verisi eksikse varsayılan değerler set et
      setDistance(50); // Varsayılan mesafe
      setDuration(60); // Varsayılan süre
      setRouteLoaded(true);
    }
  }, [bookingData.pickupLocation, bookingData.dropoffLocation, map.current]);

  const initializeMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      console.log('Google Maps not ready or map ref not available');
      return;
    }

    try {
      map.current = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: ANTALYA_AIRPORT,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeOpacity: 0.8,
          strokeWeight: 4
        }
      });
      directionsRenderer.current.setMap(map.current);
      
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Map initialization error:', error);
      // Hata durumunda varsayılan değerler set et
      setDistance(50);
      setDuration(60);
      setRouteLoaded(true);
    }
  };

  const calculateRoute = () => {
    if (!directionsService.current) {
      console.log('DirectionsService not ready');
      return;
    }

    // Lokasyon verilerini kontrol et
    let origin, destination;

    if (bookingData.direction === 'airport-to-hotel') {
      origin = ANTALYA_AIRPORT;
      destination = bookingData.dropoffLocation;
    } else {
      origin = bookingData.pickupLocation;
      destination = ANTALYA_AIRPORT;
    }

    // Lokasyon verilerinin format kontrolü
    if (!origin || !destination) {
      console.log('Missing location data:', { origin, destination });
      return;
    }

    // Koordinat formatını düzelt
    const formatLocation = (location) => {
      if (typeof location === 'object' && location.lat && location.lng) {
        return { lat: location.lat, lng: location.lng };
      }
      if (typeof location === 'object' && location.address) {
        return location.address;
      }
      return location;
    };

    const formattedOrigin = formatLocation(origin);
    const formattedDestination = formatLocation(destination);

    console.log('Calculating route:', { formattedOrigin, formattedDestination });

    // Sadece yeni rota hesaplanıyorsa loading göster
    if (distance === 50 && duration === 60) {
      setRouteLoaded(false);
    }
    setError('');

    // Timeout mekanizması - 10 saniye sonra varsayılan değerleri kullan
    const timeoutId = setTimeout(() => {
      console.log('Route calculation timeout, using default values');
      setDistance(50);
      setDuration(60);
      setRouteLoaded(true);
    }, 10000);

    directionsService.current.route(
      {
        origin: formattedOrigin,
        destination: formattedDestination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false
      },
      (result, status) => {
        clearTimeout(timeoutId); // Başarılı olursa timeout'u iptal et
        
        if (status === 'OK') {
          directionsRenderer.current.setDirections(result);
          
          const route = result.routes[0];
          const leg = route.legs[0];
          
          setDistance(Math.round(leg.distance.value / 1000)); // km
          setDuration(Math.round(leg.duration.value / 60)); // dakika
          setRouteLoaded(true);
          setError('');
          console.log('Route calculated successfully:', { distance: leg.distance.value / 1000, duration: leg.duration.value / 60 });
        } else {
          console.error('Directions request failed due to ' + status);
          // Hata durumunda varsayılan değerleri kullan
          setDistance(50);
          setDuration(60);
          setRouteLoaded(true);
          setError('');
        }
      }
    );
  };

  const calculatePrice = (vehicle) => {
    const basePrice = vehicle.basePrice;
    const distancePrice = distance * vehicle.pricePerKm;
    return basePrice + distancePrice;
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle({
      ...vehicle,
      totalPrice: calculatePrice(vehicle),
      distance,
      duration
    });
    // Error mesajını temizle
    setError('');
  };

  const handleNext = () => {
    console.log('Vehicle Selection - Selected Vehicle:', selectedVehicle);
    
    if (!selectedVehicle) {
      setError('Lütfen bir araç seçiniz');
      return;
    }

    // Ekstra hizmetler toplam fiyatını hesapla
    const servicesTotal = selectedServices.reduce((total, service) => total + service.price, 0);
    const totalPrice = selectedVehicle.totalPrice + servicesTotal;

    const updatedData = {
      ...bookingData,
      selectedVehicle,
      selectedServices,
      totalPrice,
      distance,
      duration
    };
    
    console.log('Vehicle Selection - Updated Data:', updatedData);
    setBookingData(updatedData);
    onNext();
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  return (
    <div className="max-w-md sm:max-w-lg lg:max-w-4xl mx-auto p-2 sm:p-3 lg:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {/* Rota Bilgileri */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Transfer Rotası</h3>
          
          {/* Harita */}
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-64 sm:h-80 rounded-lg border border-gray-200"
            />
            {!routeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Rota hesaplanıyor...</p>
                </div>
              </div>
            )}
          </div>

          {/* Rota Detayları */}
          {routeLoaded && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Mesafe</p>
                  <p className="text-lg font-bold text-blue-600">{distance} km</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Süre</p>
                  <p className="text-lg font-bold text-green-600">{duration} dk</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Araç Seçimi */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-800">Araç Seçimi</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {vehicles.map((vehicle) => {
              const totalPrice = routeLoaded ? calculatePrice(vehicle) : 0;
              const isSelected = selectedVehicle?.id === vehicle.id;
              
              return (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{vehicle.image}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{vehicle.name}</h4>
                        {routeLoaded && (
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">
                              ₺{totalPrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Toplam Fiyat</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 mb-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{vehicle.capacity}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{vehicle.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {routeLoaded && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Başlangıç fiyatı:</span>
                            <span>₺{vehicle.basePrice}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Mesafe ({distance} km):</span>
                            <span>₺{(distance * vehicle.pricePerKm).toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ekstra Hizmetler */}
        {selectedVehicle && (
          <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Ekstra Hizmetler</h3>
            <p className="text-sm text-gray-600 mb-3">
              Transferinizi daha konforlu hale getirmek için ekstra hizmetler seçebilirsiniz.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {extraServices.map((service) => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceToggle(service)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{service.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-800">{service.name}</h4>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                        <p className="text-sm font-semibold text-green-600">
                          +₺{service.price}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Seçilen Hizmetler:</h4>
                <div className="space-y-1">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-green-700">{service.name}</span>
                      <span className="font-medium text-green-800">+₺{service.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-green-300 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-green-800">
                      <span>Ekstra Hizmetler Toplamı:</span>
                      <span>+₺{selectedServices.reduce((total, service) => total + service.price, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fiyat Özeti */}
        {selectedVehicle && routeLoaded && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fiyat Detayı</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Araç ({selectedVehicle.name}):</span>
                <span>₺{selectedVehicle.basePrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mesafe ({distance} km × ₺{selectedVehicle.pricePerKm}):</span>
                <span>₺{(distance * selectedVehicle.pricePerKm).toLocaleString()}</span>
              </div>
              {selectedServices.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ekstra Hizmetler:</span>
                  <span>₺{selectedServices.reduce((total, service) => total + service.price, 0)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Toplam Tutar:</span>
                  <span className="text-green-600">
                    ₺{(selectedVehicle.totalPrice + selectedServices.reduce((total, service) => total + service.price, 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigasyon Butonları */}
        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Geri Dön
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!selectedVehicle || !routeLoaded}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Devam Et
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleSelection;
