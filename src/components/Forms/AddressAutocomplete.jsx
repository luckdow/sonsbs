import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader } from 'lucide-react';
import googleMapsService from '../../services/googleMapsService';
import { debounce } from '../../utils/helpers';

const AddressAutocomplete = ({ 
  value, 
  onSelect, 
  placeholder = 'Adres yazın...', 
  className = '' 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const predictions = await googleMapsService.getPlacePredictions(query, {
          componentRestrictions: { country: 'TR' },
          types: ['establishment', 'geocode']
        });
        
        setSuggestions(predictions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Address search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  const handleSuggestionClick = async (suggestion) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    
    try {
      // Get detailed place information
      const placeDetails = await googleMapsService.getPlaceDetails(suggestion.place_id);
      
      if (placeDetails) {
        const addressDetails = {
          placeId: suggestion.place_id,
          formattedAddress: suggestion.description,
          location: {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng()
          },
          types: placeDetails.types
        };
        
        onSelect(suggestion.description, addressDetails);
      } else {
        onSelect(suggestion.description, {
          placeId: suggestion.place_id,
          formattedAddress: suggestion.description
        });
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      // Still call onSelect with basic info
      onSelect(suggestion.description, {
        placeId: suggestion.place_id,
        formattedAddress: suggestion.description
      });
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="form-input pl-10 pr-10"
          autoComplete="off"
        />
        
        {/* Location Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        
        {/* Loading Icon */}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.place_id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.structured_formatting?.main_text || suggestion.description}
                    </p>
                    {suggestion.structured_formatting?.secondary_text && (
                      <p className="text-xs text-gray-500 truncate">
                        {suggestion.structured_formatting.secondary_text}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results Message */}
      {showSuggestions && !loading && inputValue.length >= 3 && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
        >
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">Bu arama için sonuç bulunamadı</p>
            <p className="text-xs text-gray-400 mt-1">
              Daha genel bir adres deneyin
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
