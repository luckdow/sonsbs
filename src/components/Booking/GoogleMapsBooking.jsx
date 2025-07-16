import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, DollarSign } from 'lucide-react';
import { 
  LoadScript, 
  GoogleMap, 
  Autocomplete, 
  DirectionsRenderer 
} from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const defaultCenter = {
  lat: 39.925533,
  lng: 32.866287 // Ankara
};

const GoogleMapsBooking = ({ onLocationSelect, onDistanceCalculate }) => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  const originRef = useRef();
  const destinationRef = useRef();

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const calculateRoute = async () => {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      
      const route = results.routes[0];
      const leg = route.legs[0];
      
      setDistance(leg.distance.text);
      setDuration(leg.duration.text);

      // Calculate estimated price (example: 2 TL per km + base fee)
      const distanceInKm = leg.distance.value / 1000;
      const basePrice = 50;
      const pricePerKm = 2;
      const calculatedPrice = basePrice + (distanceInKm * pricePerKm);
      
      setEstimatedPrice(calculatedPrice);

      // Notify parent components
      if (onLocationSelect) {
        onLocationSelect({
          origin: {
            address: originRef.current.value,
            location: leg.start_location
          },
          destination: {
            address: destinationRef.current.value,
            location: leg.end_location
          }
        });
      }

      if (onDistanceCalculate) {
        onDistanceCalculate({
          distance: leg.distance.text,
          duration: leg.duration.text,
          distanceValue: leg.distance.value,
          durationValue: leg.duration.value,
          estimatedPrice: calculatedPrice
        });
      }

    } catch (error) {
      console.error('Route calculation error:', error);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setEstimatedPrice(0);
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
  };

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
    >
      <div className="w-full space-y-6">
        {/* Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 inline mr-2" />
              Nereden
            </label>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);
              }}
            >
              <input
                ref={originRef}
                type="text"
                placeholder="Başlangıç noktası..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Autocomplete>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Navigation className="w-4 h-4 inline mr-2" />
              Nereye
            </label>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);
              }}
            >
              <input
                ref={destinationRef}
                type="text"
                placeholder="Varış noktası..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Autocomplete>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={calculateRoute}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Rota Hesapla
          </button>
          <button
            onClick={clearRoute}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Temizle
          </button>
        </div>

        {/* Route Information */}
        {distance && duration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="text-center">
              <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Mesafe</p>
              <p className="text-lg font-semibold text-gray-900">{distance}</p>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Süre</p>
              <p className="text-lg font-semibold text-gray-900">{duration}</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Tahmini Fiyat</p>
              <p className="text-lg font-semibold text-green-600">₺{estimatedPrice.toFixed(2)}</p>
            </div>
          </motion.div>
        )}

        {/* Google Map */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer 
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: '#2563eb',
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GoogleMapsBooking;
