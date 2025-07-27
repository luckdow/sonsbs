import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { googleAnalytics } from '../utils/googleSeoIntegration';

// Google Analytics tracking hook
export const useGoogleAnalytics = () => {
  const location = useLocation();

  // Sayfa değişimini track et
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // URL'den dil ve sayfa bilgilerini çıkar
      const pathParts = location.pathname.split('/').filter(Boolean);
      const isMultilingual = ['en', 'de', 'ru', 'ar'].includes(pathParts[0]);
      const language = isMultilingual ? pathParts[0] : 'tr';
      const actualPath = isMultilingual ? '/' + pathParts.slice(1).join('/') : location.pathname;
      
      // Sayfa tipini belirle
      let pageType = 'page';
      let cityLocation = '';
      let serviceType = '';
      
      if (actualPath === '/' || actualPath === '') {
        pageType = 'home';
        cityLocation = 'antalya';
        serviceType = 'transfer';
      } else if (actualPath.includes('/blog/')) {
        pageType = 'blog';
      } else if (actualPath.includes('/services/')) {
        pageType = 'service';
        serviceType = pathParts[pathParts.length - 1];
      } else if (['antalya', 'lara', 'kemer', 'belek', 'side', 'alanya'].some(city => actualPath.includes(city))) {
        pageType = 'city';
        cityLocation = pathParts.find(part => ['antalya', 'lara', 'kemer', 'belek', 'side', 'alanya'].includes(part)) || '';
        serviceType = 'transfer';
      } else if (actualPath.includes('/rezervasyon') || actualPath.includes('/booking')) {
        pageType = 'booking';
        serviceType = 'reservation';
      }

      // Analytics'e gönder
      googleAnalytics.trackPageView(
        location.pathname + location.search,
        document.title,
        language,
        pageType,
        cityLocation,
        serviceType
      );
    }
  }, [location]);

  // Transfer rezervasyon tracking
  const trackTransferBooking = useCallback((bookingData) => {
    googleAnalytics.trackTransferBooking(bookingData);
  }, []);

  // Arama tracking
  const trackSearch = useCallback((searchTerm, resultCount = 0, language = 'tr') => {
    googleAnalytics.trackSearch(searchTerm, resultCount, language);
  }, []);

  // Dil değişikliği tracking
  const trackLanguageChange = useCallback((fromLanguage, toLanguage) => {
    googleAnalytics.trackLanguageChange(fromLanguage, toLanguage, location.pathname);
  }, [location.pathname]);

  // Form hataları tracking
  const trackFormError = useCallback((formName, errorType, errorMessage, fieldName = '') => {
    googleAnalytics.trackFormError(formName, errorType, errorMessage, fieldName);
  }, []);

  // Click tracking
  const trackClick = useCallback((elementName, category = 'UI Interaction', additionalData = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: category,
        event_label: elementName,
        ...additionalData
      });
    }
  }, []);

  // Scroll tracking
  const trackScroll = useCallback((percentage) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'scroll', {
        event_category: 'Engagement',
        event_label: `${percentage}% scrolled`,
        scroll_percentage: percentage
      });
    }
  }, []);

  // Video tracking
  const trackVideo = useCallback((action, videoTitle, currentTime = 0) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_' + action, {
        event_category: 'Video',
        event_label: videoTitle,
        video_current_time: currentTime
      });
    }
  }, []);

  // File download tracking
  const trackDownload = useCallback((fileName, fileType) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'file_download', {
        event_category: 'Downloads',
        event_label: fileName,
        file_extension: fileType
      });
    }
  }, []);

  // Outbound link tracking
  const trackOutboundLink = useCallback((url, linkText = '') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Outbound Link',
        event_label: url,
        link_text: linkText,
        transport_type: 'beacon'
      });
    }
  }, []);

  return {
    trackTransferBooking,
    trackSearch,
    trackLanguageChange,
    trackFormError,
    trackClick,
    trackScroll,
    trackVideo,
    trackDownload,
    trackOutboundLink
  };
};

// SEO performance monitoring hook
export const useSEOPerformance = () => {
  const trackPageLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      googleAnalytics.trackPerformance('page_load_time', loadTime);
    }
  }, []);

  const trackFirstContentfulPaint = useCallback(() => {
    if (typeof window !== 'undefined' && window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              googleAnalytics.trackPerformance('first_contentful_paint', entry.startTime);
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Performance Observer not supported');
      }
    }
  }, []);

  const trackImageLoadTime = useCallback((imageName, loadTime) => {
    googleAnalytics.trackPerformance(`image_load_${imageName}`, loadTime);
  }, []);

  const trackAPIResponseTime = useCallback((apiName, responseTime) => {
    googleAnalytics.trackPerformance(`api_${apiName}`, responseTime);
  }, []);

  useEffect(() => {
    // Sayfa yüklendiğinde performance metrikleri
    setTimeout(() => {
      trackPageLoadTime();
      trackFirstContentfulPaint();
    }, 2000);
  }, [trackPageLoadTime, trackFirstContentfulPaint]);

  return {
    trackPageLoadTime,
    trackFirstContentfulPaint,
    trackImageLoadTime,
    trackAPIResponseTime
  };
};

// Scroll tracking hook
export const useScrollTracking = () => {
  useEffect(() => {
    let scrollTracked = {
      25: false,
      50: false,
      75: false,
      90: false
    };

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      Object.keys(scrollTracked).forEach((threshold) => {
        if (scrollPercent >= parseInt(threshold) && !scrollTracked[threshold]) {
          scrollTracked[threshold] = true;
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll', {
              event_category: 'Engagement',
              event_label: `${threshold}% scrolled`,
              scroll_percentage: threshold
            });
          }
        }
      });
    };

    const throttledHandleScroll = throttle(handleScroll, 500);
    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);
};

// Throttle utility function
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default useGoogleAnalytics;
