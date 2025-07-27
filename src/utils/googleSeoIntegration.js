// Google Analytics ve Search Console Integration
// Advanced SEO tracking with multilingual support
import { ActiveConfig, validateConfig } from '../config/googleSeoConfig.js';

class GoogleAnalyticsManager {
  constructor() {
    this.GA_MEASUREMENT_ID = ActiveConfig.GA_MEASUREMENT_ID;
    this.isInitialized = false;
    this.debugMode = ActiveConfig.debug_mode || false;
    
    // Konfigürasyon validation
    validateConfig();
  }

  // Google Analytics 4 (GA4) yükle
  initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // gtag script'i ekle
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // gtag fonksiyonunu başlat
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      // GA4 yapılandırması
      gtag('js', new Date());
      gtag('config', this.GA_MEASUREMENT_ID, ActiveConfig.GA_CONFIG);

      this.isInitialized = true;

      if (this.debugMode) {
        console.log('Google Analytics initialized with ID:', this.GA_MEASUREMENT_ID);
      }
    } catch (error) {
      console.error('Google Analytics initialization failed:', error);
    }
  }

  // Sayfa görüntüleme tracking
  trackPageView(path, title, language = 'tr', pageType = 'page', location = '', service = '') {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: path,
        custom_dimension_1: language,
        custom_dimension_2: pageType,
        custom_dimension_3: location,
        custom_dimension_4: service
      });

      if (this.debugMode) {
        console.log('GA Page View:', { path, title, language, pageType, location, service });
      }
    } catch (error) {
      console.error('GA Page View tracking failed:', error);
    }
  }

  // Transfer rezervasyon tracking
  trackTransferBooking(bookingData) {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    try {
      const { 
        pickupLocation, 
        dropoffLocation, 
        vehicleType, 
        passengerCount, 
        totalPrice, 
        currency = 'TRY',
        bookingId 
      } = bookingData;

      // Enhanced ecommerce tracking
      window.gtag('event', 'purchase', {
        transaction_id: bookingId,
        value: totalPrice,
        currency: currency,
        items: [{
          item_id: `transfer_${pickupLocation}_${dropoffLocation}`,
          item_name: `Transfer: ${pickupLocation} -> ${dropoffLocation}`,
          item_category: 'Transfer Service',
          item_variant: vehicleType,
          quantity: 1,
          price: totalPrice
        }]
      });

      // Custom transfer event
      window.gtag('event', 'transfer_booking', {
        event_category: 'Booking',
        event_label: `${pickupLocation} -> ${dropoffLocation}`,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        vehicle_type: vehicleType,
        passenger_count: passengerCount,
        booking_value: totalPrice,
        currency: currency
      });

      if (this.debugMode) {
        console.log('GA Transfer Booking:', bookingData);
      }
    } catch (error) {
      console.error('GA Transfer Booking tracking failed:', error);
    }
  }

  // Arama tracking (Search Console için)
  trackSearch(searchTerm, resultCount = 0, language = 'tr') {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        result_count: resultCount,
        language: language,
        event_category: 'Search',
        event_label: searchTerm
      });

      if (this.debugMode) {
        console.log('GA Search:', { searchTerm, resultCount, language });
      }
    } catch (error) {
      console.error('GA Search tracking failed:', error);
    }
  }

  // Dil değişikliği tracking
  trackLanguageChange(fromLanguage, toLanguage, currentPage) {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('event', 'language_change', {
        event_category: 'Localization',
        event_label: `${fromLanguage} -> ${toLanguage}`,
        from_language: fromLanguage,
        to_language: toLanguage,
        current_page: currentPage
      });

      if (this.debugMode) {
        console.log('GA Language Change:', { fromLanguage, toLanguage, currentPage });
      }
    } catch (error) {
      console.error('GA Language Change tracking failed:', error);
    }
  }

  // Form hataları tracking
  trackFormError(formName, errorType, errorMessage, fieldName = '') {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('event', 'form_error', {
        event_category: 'Form Errors',
        event_label: `${formName}: ${errorType}`,
        form_name: formName,
        error_type: errorType,
        error_message: errorMessage,
        field_name: fieldName
      });

      if (this.debugMode) {
        console.log('GA Form Error:', { formName, errorType, errorMessage, fieldName });
      }
    } catch (error) {
      console.error('GA Form Error tracking failed:', error);
    }
  }

  // Site performansı tracking
  trackPerformance(metricName, value, unit = 'ms') {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('event', 'timing_complete', {
        name: metricName,
        value: Math.round(value),
        event_category: 'Performance',
        event_label: `${metricName}: ${value}${unit}`
      });

      if (this.debugMode) {
        console.log('GA Performance:', { metricName, value, unit });
      }
    } catch (error) {
      console.error('GA Performance tracking failed:', error);
    }
  }
}

// Google Search Console Manager
class GoogleSearchConsoleManager {
  constructor() {
    this.isInitialized = false;
    this.debugMode = ActiveConfig.debug_mode || false;
    this.verificationCode = ActiveConfig.SEARCH_CONSOLE_VERIFICATION;
  }

  // Search Console verification tag'i ekle
  addVerificationTag(verificationCode = this.verificationCode) {
    if (typeof document === 'undefined') return;

    try {
      // Existing verification tag'i kaldır
      const existingTag = document.querySelector('meta[name="google-site-verification"]');
      if (existingTag) {
        existingTag.remove();
      }

      // Yeni verification tag'i ekle
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-site-verification';
      metaTag.content = verificationCode;
      document.head.appendChild(metaTag);

      this.isInitialized = true;

      if (this.debugMode) {
        console.log('Google Search Console verification tag added:', verificationCode);
      }
    } catch (error) {
      console.error('Search Console verification tag failed:', error);
    }
  }

  // Structured data hataları için validation
  validateStructuredData(schemaData) {
    if (!schemaData || typeof schemaData !== 'object') {
      console.warn('Invalid structured data:', schemaData);
      return false;
    }

    // Temel schema.org validation
    const requiredFields = ['@context', '@type'];
    const missingFields = requiredFields.filter(field => !schemaData[field]);
    
    if (missingFields.length > 0) {
      console.warn('Structured data missing required fields:', missingFields);
      return false;
    }

    if (this.debugMode) {
      console.log('Structured data validation passed:', schemaData);
    }

    return true;
  }

  // Rich snippets için enhanced structured data
  generateEnhancedStructuredData(pageType, pageData) {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'GATE Transfer',
      'url': 'https://gatetransfer.com',
      'logo': 'https://gatetransfer.com/images/logo.png',
      'sameAs': [
        'https://www.facebook.com/gatetransfer',
        'https://www.instagram.com/gatetransfer',
        'https://twitter.com/gatetransfer'
      ]
    };

    switch (pageType) {
      case 'city':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          'name': `${pageData.cityName} Transfer Hizmeti`,
          'description': `${pageData.cityName} bölgesine profesyonel transfer hizmetleri`,
          'provider': baseSchema,
          'serviceArea': {
            '@type': 'City',
            'name': pageData.cityName
          },
          'offers': {
            '@type': 'Offer',
            'availability': 'https://schema.org/InStock',
            'priceCurrency': 'TRY'
          }
        };

      case 'service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          'name': pageData.serviceName,
          'description': pageData.serviceDescription,
          'provider': baseSchema,
          'serviceType': pageData.serviceName,
          'offers': {
            '@type': 'Offer',
            'availability': 'https://schema.org/InStock',
            'priceCurrency': 'TRY'
          }
        };

      case 'blog':
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': pageData.title,
          'description': pageData.description,
          'author': {
            '@type': 'Organization',
            'name': 'GATE Transfer'
          },
          'publisher': baseSchema,
          'datePublished': pageData.publishDate,
          'dateModified': pageData.modifiedDate || pageData.publishDate,
          'image': pageData.featuredImage,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': pageData.url
          }
        };

      default:
        return baseSchema;
    }
  }
}

// SEO Performance Monitor
class SEOPerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.debugMode = ActiveConfig.debug_mode || false;
    this.thresholds = ActiveConfig.PERFORMANCE_CONFIG.thresholds;
  }

  // Core Web Vitals monitoring
  monitorCoreWebVitals() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        
        if (this.debugMode) {
          console.log('LCP:', lastEntry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        this.metrics.fid = firstInput.processingStart - firstInput.startTime;
        
        if (this.debugMode) {
          console.log('FID:', this.metrics.fid);
        }
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
        
        if (this.debugMode) {
          console.log('CLS:', clsValue);
        }
      }).observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.error('Core Web Vitals monitoring failed:', error);
    }
  }

  // SEO metrics raporu
  getSEOReport() {
    return {
      coreWebVitals: {
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls
      },
      scores: {
        lcp: this.metrics.lcp <= this.thresholds.lcp.good ? 'Good' : 
             this.metrics.lcp <= this.thresholds.lcp.needsImprovement ? 'Needs Improvement' : 'Poor',
        fid: this.metrics.fid <= this.thresholds.fid.good ? 'Good' : 
             this.metrics.fid <= this.thresholds.fid.needsImprovement ? 'Needs Improvement' : 'Poor',
        cls: this.metrics.cls <= this.thresholds.cls.good ? 'Good' : 
             this.metrics.cls <= this.thresholds.cls.needsImprovement ? 'Needs Improvement' : 'Poor'
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton instances
export const googleAnalytics = new GoogleAnalyticsManager();
export const googleSearchConsole = new GoogleSearchConsoleManager();
export const seoPerformanceMonitor = new SEOPerformanceMonitor();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Google Analytics'i başlat
  googleAnalytics.initialize();
  
  // Search Console verification 
  googleSearchConsole.addVerificationTag();
  
  // Core Web Vitals monitoring'i başlat (sadece performance tracking etkinse)
  if (ActiveConfig.PERFORMANCE_CONFIG.enabled) {
    seoPerformanceMonitor.monitorCoreWebVitals();
  }
}

export default {
  googleAnalytics,
  googleSearchConsole,
  seoPerformanceMonitor
};
