import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, MapPin, Clock, Check, AlertCircle, Navigation } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import googleMapsService from '../../services/googleMapsService';

const VehicleSelection = ({ bookingData, setBookingData, onNext, onBack }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(bookingData.selectedVehicle || null);
  const [selectedServices, setSelectedServices] = useState(bookingData.selectedServices || []);
  const [vehicles, setVehicles] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState(bookingData.distance || 0);
  const [duration, setDuration] = useState(bookingData.duration || 0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Firebase'den verileri al
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Araçları getir (sadece aktif araçlar)
        const vehiclesQuery = query(
          collection(db, 'vehicles'),
          where('status', '==', 'active')
        );
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ekstra hizmetleri getir
        const servicesQuery = query(
          collection(db, 'extraServices'),
          where('status', '==', 'active')
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Firebase araçları yüklendi:', vehiclesData);
        console.log('Firebase ekstra hizmetleri yüklendi:', servicesData);
        
        setVehicles(vehiclesData);
        setExtraServices(servicesData);
      } catch (error) {
        console.error('Veri alınırken hata:', error);
        setVehicles([]);
        setExtraServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Google Maps ile gerçek rota hesaplama
  useEffect(() => {
    const calculateRealRoute = async () => {
      const locations = getDisplayLocations();
      if (!locations.pickup || !locations.dropoff) {
        console.log('Lokasyonlar eksik, rota hesaplanamıyor');
        return;
      }

      setRouteLoading(true);
      setRouteError('');
      // Eski araç seçimini temizle - fiyatlar yeniden hesaplanacak
      setSelectedVehicle(null);
      setSelectedServices([]);

      try {
        console.log('Google Maps API ile gerçek rota hesaplanıyor...');
        
        // Google Maps'i başlat
        const initialized = await googleMapsService.initialize();
        if (!initialized) {
          throw new Error('Google Maps API başlatılamadı');
        }

        // Lokasyon stringlerini hazırla
        const origin = getLocationString(locations.pickup);
        const destination = getLocationString(locations.dropoff);

        console.log('Başlangıç:', origin);
        console.log('Varış:', destination);

        if (!origin || !destination) {
          throw new Error('Geçersiz lokasyon formatı');
        }

        // Gerçek rota hesaplaması
        const result = await googleMapsService.calculateRoute(origin, destination);
        
        if (result && result.distance && result.duration) {
          const distanceKm = Math.round(result.distance.value / 1000);
          const durationMin = Math.round(result.duration.value / 60);
          
          console.log('Gerçek rota hesaplandı:', {
            distance: distanceKm + ' km',
            duration: durationMin + ' dk'
          });
          
          setDistance(distanceKm);
          setDuration(durationMin);
          
          // BookingData'yı güncelle
          setBookingData(prev => ({
            ...prev,
            distance: distanceKm,
            duration: durationMin,
            selectedVehicle: null, // Araç seçimini sıfırla
            selectedServices: [] // Hizmet seçimini sıfırla
          }));

          // Rota bilgisini sakla
          window.routeData = result;
        } else {
          throw new Error('Rota hesaplanamadı');
        }

      } catch (error) {
        console.error('Rota hesaplama hatası:', error);
        setRouteError('Rota hesaplanamadı. Lütfen lokasyonları kontrol edin.');
      } finally {
        setRouteLoading(false);
      }
    };

    // Sadece gerekli lokasyonlar varsa hesapla
    if (bookingData.pickupLocation || bookingData.dropoffLocation) {
      calculateRealRoute();
    }
  }, [bookingData.pickupLocation, bookingData.dropoffLocation, bookingData.direction]);

  // Harita çizimi - basit ve çalışan versiyon
  useEffect(() => {
    if (distance > 0 && window.routeData && mapRef.current && window.google) {
      console.log('🗺️ Harita çizimi başlıyor...');
      
      const drawMap = async () => {
        // Container'ı temizle
        mapRef.current.innerHTML = '';
        
        // Basit harita oluştur
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 10,
          center: { lat: 36.8987, lng: 30.8005 },
          mapTypeId: window.google.maps.MapTypeId.ROADMAP
        });

        // DirectionsService ve DirectionsRenderer oluştur
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#4285f4',
            strokeWeight: 6,
            strokeOpacity: 1.0
          }
        });

        // Lokasyonları al
        const locations = getDisplayLocations();
        const origin = getLocationString(locations.pickup);
        const destination = getLocationString(locations.dropoff);
        
        console.log('🎯 Rota çiziliyor:', origin, '→', destination);

        // Rota hesapla ve çiz
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          language: 'tr',
          region: 'TR'
        }, (result, status) => {
          if (status === 'OK') {
            console.log('✅ MAVİ ÇİZGİ ÇİZİLDİ!');
            directionsRenderer.setDirections(result);
          } else {
            console.error('❌ Rota çizilemedi:', status);
          }
        });
      };

      // Biraz bekle ve çiz
      setTimeout(drawMap, 500);
    }
  }, [distance]);

  // Antalya Havalimanı sabit lokasyonu
  const ANTALYA_AIRPORT = {
    address: 'Antalya Havalimanı, Antalya, Türkiye',
    lat: 36.8987,
    lng: 30.8005
  };

  // Lokasyon formatını düzenle
  const formatLocation = (location) => {
    if (!location) return 'Seçilmedi';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return location.address;
      if (location.formatted_address) return location.formatted_address;
      if (location.name) return location.name;
      // Eğer sadece koordinatlar varsa
      if (location.lat && location.lng) {
        return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
      }
    }
    return 'Bilinmeyen lokasyon';
  };

  // Transfer yönüne göre lokasyonları belirle
  const getDisplayLocations = () => {
    const direction = bookingData.direction;
    
    if (direction === 'airport-to-hotel') {
      return {
        pickup: ANTALYA_AIRPORT,
        dropoff: bookingData.dropoffLocation || null
      };
    } else if (direction === 'hotel-to-airport') {
      return {
        pickup: bookingData.pickupLocation || null,
        dropoff: ANTALYA_AIRPORT
      };
    }
    
    // Fallback - eski sistemi kullan
    return {
      pickup: bookingData.pickupLocation || null,
      dropoff: bookingData.dropoffLocation || null
    };
  };

  // Lokasyon string formatına çevir (Google Maps API için)
  const getLocationString = (location) => {
    if (!location) return null;
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return location.address;
      if (location.formatted_address) return location.formatted_address;
      if (location.name) return location.name;
      // Koordinatlar varsa string olarak döndür
      if (location.lat && location.lng) {
        return `${location.lat},${location.lng}`;
      }
    }
    return null;
  };

  // Fiyat hesaplama - admin panelindeki kmRate ile gerçek km çarpılır
  const calculatePrice = (vehicle) => {
    if (!distance || distance === 0) return 0;
    const kmRate = vehicle.kmRate || 0;
    return Math.round(distance * kmRate);
  };

  // Araç seçimi
  const handleVehicleSelect = (vehicle) => {
    const calculatedPrice = calculatePrice(vehicle);
    setSelectedVehicle({
      ...vehicle,
      totalPrice: calculatedPrice,
      distance,
      duration
    });
    setError('');
    
    // BookingData'yı da güncelle
    setBookingData(prev => ({
      ...prev,
      selectedVehicle: {
        ...vehicle,
        totalPrice: calculatedPrice,
        distance,
        duration
      }
    }));
  };

  // Devam et
  const handleNext = () => {
    if (!selectedVehicle) {
      setError('Lütfen bir araç seçiniz');
      return;
    }

    // Güncel fiyatı hesapla
    const currentVehiclePrice = calculatePrice(selectedVehicle);
    const servicesTotal = selectedServices.reduce((total, service) => total + (service.price || 0), 0);
    const totalPrice = currentVehiclePrice + servicesTotal;

    const updatedData = {
      ...bookingData,
      selectedVehicle: {
        ...selectedVehicle,
        totalPrice: currentVehiclePrice,
        distance,
        duration
      },
      selectedServices,
      totalPrice,
      distance,
      duration
    };
    
    setBookingData(updatedData);
    onNext();
  };

  // Hizmet seçimi
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

  // Araç ikonu
  const getVehicleIcon = (type) => {
    const icons = {
      sedan: '🚗',
      suv: '🚙',
      minibus: '🚐',
      midibus: '🚌',
      bus: '🚍',
      vip: '🏎️'
    };
    return icons[type] || '🚗';
  };

  // Yolcu sayısına göre filtreleme
  const filteredVehicles = vehicles.filter(vehicle => {
    const passengerCount = bookingData.passengers || 1;
    return vehicle.capacity >= passengerCount;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Araçlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Rota Bilgileri */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Transfer Rotası
            {bookingData.direction && (
              <span className="text-sm font-normal text-gray-500">
                ({bookingData.direction === 'airport-to-hotel' ? 'Karşılama' : 'Uğurlama'})
              </span>
            )}
          </h3>
          
          {routeLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Gerçek rota hesaplanıyor...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Lokasyonlar */}
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const locations = getDisplayLocations();
                  const direction = bookingData.direction;
                  
                  return (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">
                            {direction === 'airport-to-hotel' ? 'Havalimanı (Başlangıç)' : 'Otel (Başlangıç)'}
                          </p>
                          <p className="text-sm text-gray-800">{formatLocation(locations.pickup)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">
                            {direction === 'airport-to-hotel' ? 'Otel (Varış)' : 'Havalimanı (Varış)'}
                          </p>
                          <p className="text-sm text-gray-800">{formatLocation(locations.dropoff)}</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Google Maps Haritası - Yeni tasarım */}
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
                  
                  {/* Mesafe ve Süre - Harita altında */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Mesafe</p>
                          <p className="text-xl font-bold text-blue-600">
                            {distance} km
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Süre</p>
                          <p className="text-xl font-bold text-purple-600">
                            {duration} dk
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    {formatLocation(getDisplayLocations().pickup)} → {formatLocation(getDisplayLocations().dropoff)}
                  </p>
                </div>
              )}

              {/* Hata Mesajı */}
              {routeError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-800">{routeError}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Araç Seçimi */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Uygun Araçlar</h3>
          
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {loading ? 'Araçlar yükleniyor...' : 'Uygun araç bulunamadı.'}
              </p>
            </div>
          ) : distance === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600">
                Lütfen önce rota hesaplamasının tamamlanmasını bekleyin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => {
                const totalPrice = calculatePrice(vehicle);
                const isSelected = selectedVehicle?.id === vehicle.id;
                
                return (
                  <motion.div
                    key={vehicle.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVehicleSelect(vehicle)}
                    className={`relative bg-white rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl ${
                      isSelected
                        ? 'border-blue-500 shadow-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
                    }`}
                  >
                    {/* Seçili işareti */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Araç Resmi */}
                    <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {vehicle.imageUrl ? (
                        <img
                          src={vehicle.imageUrl}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                          <div className="text-6xl opacity-40 text-blue-500">
                            {getVehicleIcon(vehicle.type)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Araç Bilgileri */}
                    <div className="p-4">
                      {/* Araç Adı */}
                      <h4 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                        {vehicle.brand} {vehicle.model}
                      </h4>

                      {/* Kapasite */}
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{vehicle.capacity} Kişi</span>
                      </div>

                      {/* Km Oranı - KALDIRILDI */}

                      {/* Özellikler - Yeni tasarım */}
                      {vehicle.features && vehicle.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {vehicle.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1"
                              >
                                <span>✨</span> {feature}
                              </span>
                            ))}
                            {vehicle.features.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border">
                                +{vehicle.features.length - 3} özellik
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fiyat - Sadece toplam fiyat */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 border border-orange-200">
                          <p className="text-2xl font-bold text-orange-600">
                            ₺{totalPrice.toLocaleString()}
                          </p>
                          <p className="text-sm font-semibold text-gray-600 mt-1">
                            Transfer Ücreti
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ekstra Hizmetler - Sadece araç seçildiğinde göster */}
        {selectedVehicle && distance > 0 && extraServices.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              ⭐ Ekstra Hizmetler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extraServices.map((service) => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceToggle(service)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-200'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{service.icon || '⭐'}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{service.name}</h4>
                          <span className="text-lg font-bold text-purple-600">
                            ₺{service.price || 0}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fiyat Özeti - Sadece araç seçildiğinde göster */}
        {selectedVehicle && distance > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              💰 Fiyat Özeti
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium text-gray-700">Transfer Ücreti</span>
                <span className="font-bold text-green-600">₺{calculatePrice(selectedVehicle).toLocaleString()}</span>
              </div>
              
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">{service.name}</span>
                  <span className="font-bold text-purple-600">₺{service.price || 0}</span>
                </div>
              ))}
              
              <div className="border-t border-green-300 pt-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border border-orange-200">
                  <span className="text-lg font-bold text-gray-800">Toplam Tutar</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₺{(calculatePrice(selectedVehicle) + selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Navigasyon */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            ← Geri
          </button>
          
          <button
            onClick={handleNext}
            disabled={!selectedVehicle || distance === 0}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            {distance === 0 ? 'Rota Hesaplanıyor...' : 'Devam Et →'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleSelection;