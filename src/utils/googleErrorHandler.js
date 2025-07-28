// Error Handling and Google APIs Management
// Version: 1.0

class GoogleAPIErrorHandler {
  constructor() {
    this.setupErrorHandling();
    this.suppressKnownWarnings();
  }

  setupErrorHandling() {
    // Google Maps API hatalarını yakala
    window.gm_authFailure = () => {
      console.error('Google Maps API Authentication Failed');
      this.handleAuthFailure();
    };

    // Global error handler
    window.addEventListener('error', (event) => {
      if (event.error && event.error.message) {
        const message = event.error.message;
        
        // Google Maps spesifik hatalarını filtrele
        if (message.includes('RefererNotAllowedMapError')) {
          this.handleRefererError();
        } else if (message.includes('places.Autocomplete')) {
          // Places Autocomplete deprecation warning'ini gizle
          return;
        }
      }
    });

    // Console error yakalama
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Gereksiz hataları filtrele
      if (message.includes('places.Autocomplete') || 
          message.includes('march 1st, 2025')) {
        return;
      }
      
      originalError.apply(console, args);
    };
  }

  suppressKnownWarnings() {
    // Places Autocomplete deprecation warning'ini gizle
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      
      if (message.includes('google.maps.places.Autocomplete') ||
          message.includes('PlaceAutocompleteElement') ||
          message.includes('March 1st, 2025')) {
        return; // Bu warning'leri gizle
      }
      
      originalWarn.apply(console, args);
    };
  }

  handleAuthFailure() {
    // Auth hatası durumunda kullanıcıya bilgi ver
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 16px; border-radius: 8px; z-index: 10000; max-width: 300px; font-family: Arial, sans-serif;">
        <strong>Harita Servisi Hatası</strong><br>
        Google Maps servisi geçici olarak kullanılamıyor. Lütfen sayfayı yenileyin.
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">&times;</button>
      </div>
    `;
    document.body.appendChild(notification);

    // 10 saniye sonra otomatik kaldır
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  handleRefererError() {
    console.warn('Google Maps RefererNotAllowedMapError - Domain ayarlarını kontrol edin');
    // Fallback map servisi veya alternatif çözüm
  }

  // Service Worker registration'ı güvenli hale getir
  static registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered successfully');
            // Service worker güncelleme kontrolü
            registration.addEventListener('updatefound', () => {
              console.log('SW update found');
            });
          })
          .catch((error) => {
            console.log('SW registration failed (this is normal in development):', error.message);
          });
      });
    }
  }

  // Preload warnings'ini kontrol et
  static checkPreloadUsage() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Preload edilen kaynakların kullanımını kontrol et
        const preloadedImages = document.querySelectorAll('link[rel="preload"][as="image"]');
        preloadedImages.forEach(link => {
          const href = link.href;
          const images = document.querySelectorAll(`img[src="${href}"]`);
          if (images.length === 0) {
            console.warn(`Preloaded image not used: ${href}`);
          }
        });
      }, 5000); // 5 saniye sonra kontrol et
    });
  }
}

// Initialize error handler
const errorHandler = new GoogleAPIErrorHandler();

// Export functions
window.GoogleAPIErrorHandler = GoogleAPIErrorHandler;

export default GoogleAPIErrorHandler;
