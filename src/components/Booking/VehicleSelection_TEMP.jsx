import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, Car, Route, Clock, MapPin, CheckCircle, Star } from 'lucide-react';

const VehicleSelection = ({ bookingData, updateBookingData, onNext, onPrevious }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState('');
  const [routeLoading, setRouteLoading] = useState(false);
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);

  // Mesafe hesaplama fonksiyonu
  const calculateDistance = useCallback(async () => {
    if (!bookingData.pickupLocation || !bookingData.dropoffLocation) return;

    setRouteLoading(true);
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const pickup = bookingData.direction === 'airport-to-hotel' 
        ? bookingData.pickupLocation
        : bookingData.dropoffLocation;
      const dropoff = bookingData.direction === 'airport-to-hotel' 
        ? bookingData.dropoffLocation 
        : bookingData.pickupLocation;

      directionsService.route({
        origin: pickup,
        destination: dropoff,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK') {
          const route = result.routes[0];
          const distanceInKm = Math.round(route.legs[0].distance.value / 1000);
          const durationText = route.legs[0].duration.text;
          
          setDistance(distanceInKm);
          setDuration(durationText);
          
          if (mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
              zoom: 13,
              center: route.legs[0].start_location,
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry.fill',
                  stylers: [{ color: '#f8fafc' }]
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{ color: '#dbeafe' }]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [{ color: '#ffffff' }]
                }
              ]
            });

            if (directionsRenderer.current) {
              directionsRenderer.current.setMap(null);
            }

            directionsRenderer.current = new window.google.maps.DirectionsRenderer({
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeWeight: 5,
                strokeOpacity: 0.8
              }
            });

            directionsRenderer.current.setDirections(result);
            directionsRenderer.current.setMap(map);
          }
        }
        setRouteLoading(false);
      });
    } catch (error) {
      console.error('Mesafe hesaplama hatası:', error);
      setRouteLoading(false);
    }
  }, [bookingData.pickupLocation, bookingData.dropoffLocation, bookingData.direction]);

  // Lokasyon formatı
  const formatLocation = (location) => {
    if (!location) return 'Belirlenmedi';
    if (typeof location === 'object' && location.formatted_address) {
      return location.formatted_address;
    }
    return location;
  };

  // Görüntülenecek lokasyonları al
  const getDisplayLocations = () => {
    const direction = bookingData.direction;
    if (direction === 'airport-to-hotel') {
      return {
        pickup: bookingData.pickupLocation,
        dropoff: bookingData.dropoffLocation
      };
    } else {
      return {
        pickup: bookingData.dropoffLocation,
        dropoff: bookingData.pickupLocation
      };
    }
  };

  // Araç verilerini yükle
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        // Simüle edilmiş araç verisi
        const mockVehicles = [
          {
            id: 1,
            name: 'Ekonomi',
            model: 'Volkswagen Caddy',
            capacity: 4,
            luggage: 2,
            price: 150,
            image: '/api/placeholder/300/200',
            features: ['Klima', 'Bluetooth', 'USB Şarj'],
            rating: 4.5,
            description: 'Ekonomik ve konforlu transfer için ideal seçim'
          },
          {
            id: 2,
            name: 'Konfor',
            model: 'Mercedes Vito',
            capacity: 6,
            luggage: 4,
            price: 200,
            image: '/api/placeholder/300/200',
            features: ['Deri Koltuk', 'Klima', 'WiFi', 'İkram'],
            rating: 4.8,
            description: 'Konforlu yolculuk için premium araç seçeneği'
          },
          {
            id: 3,
            name: 'Lüks',
            model: 'Mercedes S-Class',
            capacity: 3,
            luggage: 2,
            price: 350,
            image: '/api/placeholder/300/200',
            features: ['VIP Hizmet', 'Deri Koltuk', 'Premium İkram', 'WiFi'],
            rating: 5.0,
            description: 'En üst düzey konfor ve hizmet kalitesi'
          }
        ];

        // Mesafeye göre fiyat hesapla
        const vehiclesWithPrice = mockVehicles.map(vehicle => ({
          ...vehicle,
          calculatedPrice: distance > 0 ? Math.round(vehicle.price + (distance * 2.5)) : vehicle.price
        }));

        setVehicles(vehiclesWithPrice);
      } catch (error) {
        console.error('Araç verisi yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [distance]);

  // Mesafe hesapla
  useEffect(() => {
    if (window.google && window.google.maps) {
      calculateDistance();
    }
  }, [calculateDistance]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    updateBookingData({ 
      selectedVehicle: vehicle,
      totalPrice: vehicle.calculatedPrice
    });
  };

  const handleNext = () => {
    if (selectedVehicle && distance > 0) {
      onNext();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Araçlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <Car className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Araç Seçimi</h1>
            <p className="text-blue-100 text-sm">
              Size uygun transfer aracını seçin ve rotanızı görüntüleyin
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
          {/* Rota Bilgileri */}
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                Transfer Rotası
              </h2>
              <p className="text-sm text-gray-600">
                Mesafe ve süre bilgilerini görüntüleyin
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
              {routeLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Rota hesaplanıyor...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Lokasyonlar */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {(() => {
                      const locations = getDisplayLocations();
                      const direction = bookingData.direction;
                      
                      return (
                        <>
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">
                                {direction === 'airport-to-hotel' ? 'Başlangıç Noktası' : 'Başlangıç Noktası'}
                              </p>
                              <p className="text-sm text-gray-800">{formatLocation(locations.pickup)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-600">
                                {direction === 'airport-to-hotel' ? 'Varış Noktası' : 'Varış Noktası'}
                              </p>
                              <p className="text-sm text-gray-800">{formatLocation(locations.dropoff)}</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Google Maps Haritası */}
                  {distance > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🗺️ Rota Haritası
                      </h4>
                      <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div 
                          ref={mapRef}
                          className="w-full"
                          style={{ height: '450px' }}
                        />
                      </div>
                      
                      {/* Mesafe ve Süre */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                              <Route className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Mesafe</p>
                              <p className="text-xl font-bold text-blue-600">
                                {distance} km
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Tahmini Süre</p>
                              <p className="text-xl font-bold text-purple-600">
                                {duration || 'Hesaplanıyor...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Araç Seçimi */}
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                Araç Kategorisi Seçimi
              </h2>
              <p className="text-sm text-gray-600">
                İhtiyaçlarınıza uygun araç kategorisini seçin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="space-y-3">
                    {/* Araç Görseli */}
                    <div className="relative">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Araç Bilgileri */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{vehicle.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{vehicle.model}</p>
                      <p className="text-xs text-gray-500">{vehicle.description}</p>

                      {/* Kapasite Bilgileri */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{vehicle.capacity} kişi</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{vehicle.luggage} valiz</span>
                        </div>
                      </div>

                      {/* Özellikler */}
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{vehicle.features.length - 2} daha
                          </span>
                        )}
                      </div>

                      {/* Fiyat */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Toplam Ücret</span>
                          <span className="text-lg font-bold text-blue-600">
                            ₺{vehicle.calculatedPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Yolcu Sayısı Seçimi */}
          {selectedVehicle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="text-left">
                <h2 className="text-base font-medium text-gray-900 mb-1">
                  Yolcu Sayısı
                </h2>
                <p className="text-sm text-gray-600">
                  Kaç kişi seyahat edeceksiniz?
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => {
                      const newCount = Math.max(1, (bookingData.passengerCount || 1) - 1);
                      updateBookingData({ passengerCount: newCount });
                    }}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
                  >
                    -
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-xl font-semibold min-w-[2rem] text-center">
                      {bookingData.passengerCount || 1}
                    </span>
                    <span className="text-gray-600">kişi</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      const newCount = Math.min(selectedVehicle.capacity, (bookingData.passengerCount || 1) + 1);
                      updateBookingData({ passengerCount: newCount });
                    }}
                    disabled={(bookingData.passengerCount || 1) >= selectedVehicle.capacity}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-500">
                    Maksimum {selectedVehicle.capacity} kişi
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              onClick={onPrevious}
              className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            
            <button
              onClick={handleNext}
              disabled={!selectedVehicle || distance === 0}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {distance === 0 ? (
                'Rota Hesaplanıyor...'
              ) : (
                <>
                  Devam Et
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleSelection;
