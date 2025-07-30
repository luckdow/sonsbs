import { GOOGLE_MAPS_CONFIG } from '../config/constants';

class GoogleMapsService {
  constructor() {
    // Script tag ile yüklendiği için Loader kullanmıyoruz
    this.google = null;
    this.placesService = null;
    this.directionsService = null;
    this.autocompleteService = null;
    this.geocoder = null;
  }

  /**
   * Google Maps'in script tag ile yüklenmesini bekle
   */
  async waitForGoogleMaps(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(true);
        return;
      }

      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          clearTimeout(timeoutHandle);
          resolve(true);
        }
      }, 100);

      const timeoutHandle = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Google Maps script tag yükleme timeout'));
      }, timeout);
    });
  }

  /**
   * Initialize Google Maps API
   */
  async initialize() {
    try {
      // Eğer Google Maps zaten yüklenmişse, doğrudan kullan
      if (window.google && window.google.maps) {
        console.log('Google Maps zaten yüklü, mevcut API kullanılıyor');
        this.google = window.google;
        
        // Services'i güvenli bir şekilde initialize et
        try {
          this.placesService = new this.google.maps.places.PlacesService(document.createElement('div'));
        } catch (error) {
          console.warn('PlacesService initialization failed:', error);
          this.placesService = null;
        }
        
        try {
          this.directionsService = new this.google.maps.DirectionsService();
        } catch (error) {
          console.warn('DirectionsService initialization failed:', error);
          this.directionsService = null;
        }
        
        try {
          this.autocompleteService = new this.google.maps.places.AutocompleteService();
        } catch (error) {
          console.warn('AutocompleteService initialization failed:', error);
          this.autocompleteService = null;
        }
        
        try {
          this.geocoder = new this.google.maps.Geocoder();
        } catch (error) {
          console.warn('Geocoder initialization failed:', error);
          this.geocoder = null;
        }
        
        return true;
      }
      
      // Script tag ile yüklenene kadar bekle
      console.log('🔄 Google Maps script tag ile yükleniyor...');
      await this.waitForGoogleMaps();
      this.google = window.google;
      
      // Services'i güvenli bir şekilde initialize et
      try {
        this.placesService = new this.google.maps.places.PlacesService(document.createElement('div'));
      } catch (error) {
        console.warn('PlacesService initialization failed:', error);
        this.placesService = null;
      }
      
      try {
        this.directionsService = new this.google.maps.DirectionsService();
      } catch (error) {
        console.warn('DirectionsService initialization failed:', error);
        this.directionsService = null;
      }
      
      try {
        this.autocompleteService = new this.google.maps.places.AutocompleteService();
      } catch (error) {
        console.warn('AutocompleteService initialization failed:', error);
        this.autocompleteService = null;
      }
      
      try {
        this.geocoder = new this.google.maps.Geocoder();
      } catch (error) {
        console.warn('Geocoder initialization failed:', error);
        this.geocoder = null;
      }
      
      return true;
    } catch (error) {
      console.error('Google Maps API initialization failed:', error);
      return false;
    }
  }

  /**
   * Get place predictions for autocomplete
   */
  async getPlacePredictions(input, options = {}) {
    if (!this.autocompleteService) {
      await this.initialize();
    }

    const defaultOptions = {
      input,
      componentRestrictions: { country: 'TR' },
      language: 'tr',
      ...options
    };

    return new Promise((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(defaultOptions, (predictions, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions || []);
        } else {
          reject(new Error(`Places API error: ${status}`));
        }
      });
    });
  }

  /**
   * Get place details by place ID
   */
  async getPlaceDetails(placeId) {
    if (!this.placesService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId,
          fields: ['geometry', 'formatted_address', 'name', 'types']
        },
        (place, status) => {
          if (status === this.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(new Error(`Place Details API error: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Calculate route between two points
   */
  async calculateRoute(origin, destination, options = {}) {
    if (!this.directionsService) {
      await this.initialize();
    }

    const defaultOptions = {
      origin,
      destination,
      travelMode: this.google.maps.TravelMode.DRIVING,
      unitSystem: this.google.maps.UnitSystem.METRIC,
      language: 'tr',
      region: 'TR',
      ...options
    };

    return new Promise((resolve, reject) => {
      this.directionsService.route(defaultOptions, (result, status) => {
        if (status === this.google.maps.DirectionsStatus.OK) {
          const route = result.routes[0];
          const leg = route.legs[0];
          
          resolve({
            distance: {
              text: leg.distance.text,
              value: leg.distance.value // in meters
            },
            duration: {
              text: leg.duration.text,
              value: leg.duration.value // in seconds
            },
            distanceInKm: Math.round(leg.distance.value / 1000),
            durationInMinutes: Math.round(leg.duration.value / 60),
            polyline: route.overview_polyline,
            startAddress: leg.start_address,
            endAddress: leg.end_address,
            startLocation: {
              lat: leg.start_location.lat(),
              lng: leg.start_location.lng()
            },
            endLocation: {
              lat: leg.end_location.lat(),
              lng: leg.end_location.lng()
            },
            // Tam directions result'unu da ekle
            directionsResult: result
          });
        } else {
          reject(new Error(`Directions API error: ${status}`));
        }
      });
    });
  }

  /**
   * Geocode an address
   */
  async geocodeAddress(address) {
    if (!this.geocoder) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === this.google.maps.GeocoderStatus.OK) {
          const result = results[0];
          resolve({
            formatted_address: result.formatted_address,
            location: {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng()
            },
            place_id: result.place_id,
            types: result.types
          });
        } else {
          reject(new Error(`Geocoding API error: ${status}`));
        }
      });
    });
  }

  /**
   * Reverse geocode coordinates
   */
  async reverseGeocode(lat, lng) {
    if (!this.geocoder) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === this.google.maps.GeocoderStatus.OK) {
            resolve(results);
          } else {
            reject(new Error(`Reverse Geocoding API error: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Create a map instance
   */
  async createMap(container, options = {}) {
    if (!this.google) {
      await this.initialize();
    }

    const defaultOptions = {
      zoom: 10,
      center: { lat: 39.9334, lng: 32.8597 }, // Ankara center
      mapTypeId: this.google.maps.MapTypeId.ROADMAP,
      language: 'tr',
      region: 'TR',
      ...options
    };

    return new this.google.maps.Map(container, defaultOptions);
  }

  /**
   * Add markers to map
   */
  addMarker(map, position, options = {}) {
    if (!this.google) return null;

    const defaultOptions = {
      position,
      map,
      ...options
    };

    return new this.google.maps.Marker(defaultOptions);
  }

  /**
   * Draw route on map
   */
  drawRoute(map, route) {
    if (!this.google) return null;

    const directionsRenderer = new this.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285f4',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    return directionsRenderer;
  }

  /**
   * Get current user location
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistanceBetweenCoords(lat1, lng1, lat2, lng2) {
    if (!this.google) return null;

    const point1 = new this.google.maps.LatLng(lat1, lng1);
    const point2 = new this.google.maps.LatLng(lat2, lng2);
    
    return this.google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
  }

  /**
   * Format Turkish addresses for better recognition
   */
  formatTurkishAddress(address) {
    // Add Turkey to the address for better geocoding results
    if (!address.toLowerCase().includes('turkey') && 
        !address.toLowerCase().includes('türkiye')) {
      return `${address}, Turkey`;
    }
    return address;
  }

  /**
   * Get airport coordinates for major Turkish cities
   */
  getAirportLocation(cityName) {
    const airports = {
      'istanbul': { lat: 41.2619, lng: 28.7279, name: 'İstanbul Havalimanı' },
      'ankara': { lat: 39.9496, lng: 32.6884, name: 'Esenboğa Havalimanı' },
      'izmir': { lat: 38.2924, lng: 27.1570, name: 'Adnan Menderes Havalimanı' },
      'antalya': { lat: 36.8988, lng: 30.8005, name: 'Antalya Havalimanı' },
      'bodrum': { lat: 37.0135, lng: 27.4048, name: 'Milas-Bodrum Havalimanı' },
      'dalaman': { lat: 36.7131, lng: 28.7925, name: 'Dalaman Havalimanı' },
      'adana': { lat: 36.9823, lng: 35.2803, name: 'Şakirpaşa Havalimanı' },
      'trabzon': { lat: 40.9951, lng: 39.7897, name: 'Trabzon Havalimanı' },
      'gaziantep': { lat: 36.9472, lng: 37.4786, name: 'Oğuzeli Havalimanı' },
      'kayseri': { lat: 38.7704, lng: 35.4954, name: 'Erkilet Havalimanı' }
    };

    const city = cityName.toLowerCase().trim();
    return airports[city] || null;
  }

  /**
   * Validate coordinates
   */
  isValidCoordinates(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat, lng) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();

export default googleMapsService;
