import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Navigation } from 'lucide-react';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Adres arayın...",
  className = "",
  showCurrentLocation = true,
  disabled = false
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock locations for Turkey
  const mockLocations = [
    { id: 1, description: 'İstanbul Havalimanı, İstanbul', lat: 41.2619, lng: 28.7414 },
    { id: 2, description: 'Sabiha Gökçen Havalimanı, İstanbul', lat: 40.8989, lng: 29.3092 },
    { id: 3, description: 'Taksim Meydanı, İstanbul', lat: 41.0370, lng: 28.9856 },
    { id: 4, description: 'Sultanahmet Camii, İstanbul', lat: 41.0055, lng: 28.9769 },
    { id: 5, description: 'Galata Kulesi, İstanbul', lat: 41.0256, lng: 28.9741 },
    { id: 6, description: 'Bosphorus Bridge, İstanbul', lat: 41.0392, lng: 29.0352 },
    { id: 7, description: 'Kadıköy İskelesi, İstanbul', lat: 40.9667, lng: 29.0269 },
    { id: 8, description: 'Beşiktaş İskelesi, İstanbul', lat: 41.0422, lng: 29.0067 },
    { id: 9, description: 'Eminönü, İstanbul', lat: 41.0176, lng: 28.9706 },
    { id: 10, description: 'Levent Metro, İstanbul', lat: 41.0814, lng: 29.0092 },
    { id: 11, description: 'Maslak, İstanbul', lat: 41.1086, lng: 29.0267 },
    { id: 12, description: 'Bakırköy İDO, İstanbul', lat: 40.9833, lng: 28.8667 },
    { id: 13, description: 'Pendik Marina, İstanbul', lat: 40.8667, lng: 29.2333 },
    { id: 14, description: 'Beylikdüzü Metro, İstanbul', lat: 41.0019, lng: 28.6544 },
    { id: 15, description: 'Ankara Esenboğa Havalimanı, Ankara', lat: 40.1281, lng: 32.9951 },
    { id: 16, description: 'Kızılay, Ankara', lat: 39.9208, lng: 32.8541 },
    { id: 17, description: 'Anıtkabir, Ankara', lat: 39.9250, lng: 32.8369 },
    { id: 18, description: 'İzmir Adnan Menderes Havalimanı, İzmir', lat: 38.2924, lng: 27.1570 },
    { id: 19, description: 'Konak Meydanı, İzmir', lat: 38.4189, lng: 27.1287 },
    { id: 20, description: 'Antalya Havalimanı, Antalya', lat: 36.8987, lng: 30.7854 },
    { id: 21, description: 'Kaleiçi, Antalya', lat: 36.8841, lng: 30.7056 },
    { id: 22, description: 'Bursa Merkez, Bursa', lat: 40.1826, lng: 29.0669 }
  ];

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchAddresses = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Filter mock locations based on query
      const filtered = mockLocations.filter(location =>
        location.description.toLowerCase().includes(query.toLowerCase())
      );

      // Add some dynamic suggestions based on query
      const dynamicSuggestions = [
        {
          id: `dynamic-1`,
          description: `${query} - İstanbul`,
          lat: 41.0082 + (Math.random() - 0.5) * 0.1,
          lng: 28.9784 + (Math.random() - 0.5) * 0.1
        },
        {
          id: `dynamic-2`,
          description: `${query} - Ankara`,
          lat: 39.9334 + (Math.random() - 0.5) * 0.1,
          lng: 32.8597 + (Math.random() - 0.5) * 0.1
        },
        {
          id: `dynamic-3`,
          description: `${query} - İzmir`,
          lat: 38.4237 + (Math.random() - 0.5) * 0.1,
          lng: 27.1428 + (Math.random() - 0.5) * 0.1
        }
      ];

      setSuggestions([...filtered, ...dynamicSuggestions].slice(0, 8));
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    
    // Debounce search
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    window.searchTimeout = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    onChange && onChange({
      address: suggestion.description,
      lat: suggestion.lat,
      lng: suggestion.lng
    });
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    onChange && onChange({ address: '', lat: null, lng: null });
    inputRef.current?.focus();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Konum servisi desteklenmiyor');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simulate reverse geocoding
        const currentLocationAddress = `Mevcut Konumunuz (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        
        setInputValue(currentLocationAddress);
        setShowSuggestions(false);
        setIsLoading(false);
        
        onChange && onChange({
          address: currentLocationAddress,
          lat: latitude,
          lng: longitude
        });
      },
      (error) => {
        console.error('Konum hatası:', error);
        setIsLoading(false);
        alert('Konum alınamadı. Lütfen manuel olarak adres girin.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleFocus = () => {
    if (inputValue && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className={`input pl-10 pr-20 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {showCurrentLocation && (
            <button
              type="button"
              onClick={getCurrentLocation}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Mevcut konumu kullan"
              disabled={disabled || isLoading}
            >
              <Navigation className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {suggestion.lat?.toFixed(4)}, {suggestion.lng?.toFixed(4)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-center text-gray-500">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Sonuç bulunamadı</p>
            <p className="text-xs">Farklı bir arama terimi deneyin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
