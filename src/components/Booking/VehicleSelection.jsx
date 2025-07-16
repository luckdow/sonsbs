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
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [routeLoaded, setRouteLoaded] = useState(false);
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
    initializeMap();
  }, []);

  useEffect(() => {
    if (bookingData.pickupLocation && bookingData.dropoffLocation && map.current) {
      calculateRoute();
    }
  }, [bookingData.pickupLocation, bookingData.dropoffLocation]);

  const initializeMap = () => {
    if (window.google && mapRef.current) {
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
    }
  };

  const calculateRoute = () => {
    if (!directionsService.current || !bookingData.pickupLocation || !bookingData.dropoffLocation) {
      return;
    }

    const origin = bookingData.direction === 'airport-to-hotel' 
      ? ANTALYA_AIRPORT 
      : bookingData.pickupLocation;
    
    const destination = bookingData.direction === 'hotel-to-airport' 
      ? ANTALYA_AIRPORT 
      : bookingData.dropoffLocation;

    directionsService.current.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.current.setDirections(result);
          
          const route = result.routes[0];
          const leg = route.legs[0];
          
          setDistance(Math.round(leg.distance.value / 1000)); // km
          setDuration(Math.round(leg.duration.value / 60)); // dakika
          setRouteLoaded(true);
          setError('');
        } else {
          setError('Rota hesaplanamadı. Lütfen lokasyon bilgilerini kontrol edin.');
          console.error('Directions request failed due to ' + status);
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
  };

  const handleNext = () => {
    if (!selectedVehicle) {
      setError('Lütfen bir araç seçiniz');
      return;
    }

    const updatedData = {
      ...bookingData,
      selectedVehicle,
      totalPrice: selectedVehicle.totalPrice,
      distance,
      duration
    };
    setBookingData(updatedData);
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Rota Bilgileri */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Transfer Rotası</h3>
          
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Araç Seçimi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => {
              const totalPrice = routeLoaded ? calculatePrice(vehicle) : 0;
              const isSelected = selectedVehicle?.id === vehicle.id;
              
              return (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
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

                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{vehicle.image}</div>
                    
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
