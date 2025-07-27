import React, { useEffect, useState } from 'react';

// SEO Performance Monitor Component
const SEOPerformanceMonitor = () => {
  const [seoMetrics, setSeoMetrics] = useState({
    pageLoadTime: null,
    firstContentfulPaint: null,
    largestContentfulPaint: null,
    cumulativeLayoutShift: null,
    firstInputDelay: null,
    seoScore: null
  });

  useEffect(() => {
    // Monitor Core Web Vitals
    const monitorWebVitals = () => {
      // Performance Observer for LCP
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            setSeoMetrics(prev => ({
              ...prev,
              largestContentfulPaint: Math.round(lastEntry.startTime)
            }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // Performance Observer for FCP
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                setSeoMetrics(prev => ({
                  ...prev,
                  firstContentfulPaint: Math.round(entry.startTime)
                }));
              }
            });
          });
          fcpObserver.observe({ entryTypes: ['paint'] });

          // Performance Observer for FID
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              setSeoMetrics(prev => ({
                ...prev,
                firstInputDelay: Math.round(entry.processingStart - entry.startTime)
              }));
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Performance Observer for CLS
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            list.getEntries().forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            setSeoMetrics(prev => ({
              ...prev,
              cumulativeLayoutShift: clsValue.toFixed(3)
            }));
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.log('Performance Observer not supported:', error);
        }
      }

      // Monitor page load time
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          setSeoMetrics(prev => ({
            ...prev,
            pageLoadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart)
          }));
        }
      });
    };

    // SEO Health Check
    const performSEOHealthCheck = () => {
      let score = 100;
      const issues = [];

      // Check meta title
      const title = document.querySelector('title');
      if (!title || title.textContent.length < 30 || title.textContent.length > 60) {
        score -= 10;
        issues.push('Title tag uzunluğu optimize edilmeli (30-60 karakter)');
      }

      // Check meta description
      const description = document.querySelector('meta[name="description"]');
      if (!description || description.content.length < 120 || description.content.length > 160) {
        score -= 10;
        issues.push('Meta description uzunluğu optimize edilmeli (120-160 karakter)');
      }

      // Check H1 tag
      const h1Tags = document.querySelectorAll('h1');
      if (h1Tags.length === 0) {
        score -= 15;
        issues.push('H1 tag bulunamadı');
      } else if (h1Tags.length > 1) {
        score -= 10;
        issues.push('Birden fazla H1 tag kullanılmış');
      }

      // Check heading hierarchy
      const h2Tags = document.querySelectorAll('h2');
      const h3Tags = document.querySelectorAll('h3');
      if (h2Tags.length === 0 && h3Tags.length > 0) {
        score -= 5;
        issues.push('Heading hiyerarşisi bozuk (H3 var ama H2 yok)');
      }

      // Check image alt attributes
      const images = document.querySelectorAll('img');
      let imagesWithoutAlt = 0;
      images.forEach(img => {
        if (!img.alt) imagesWithoutAlt++;
      });
      if (imagesWithoutAlt > 0) {
        score -= Math.min(10, imagesWithoutAlt * 2);
        issues.push(`${imagesWithoutAlt} resim alt attribute'u eksik`);
      }

      // Check internal links
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]');
      if (internalLinks.length < 3) {
        score -= 5;
        issues.push('Yeterli internal link bulunamadı');
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        score -= 5;
        issues.push('Canonical URL eksik');
      }

      // Check Schema markup
      const schemas = document.querySelectorAll('script[type="application/ld+json"]');
      if (schemas.length === 0) {
        score -= 10;
        issues.push('Schema markup bulunamadı');
      }

      setSeoMetrics(prev => ({
        ...prev,
        seoScore: score,
        issues: issues
      }));
    };

    // Initialize monitoring
    monitorWebVitals();
    setTimeout(performSEOHealthCheck, 2000); // Wait for page to fully load

  }, []);

  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">SEO Metrikleri</h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          seoMetrics.seoScore >= 90 ? 'bg-green-100 text-green-800' :
          seoMetrics.seoScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {seoMetrics.seoScore ? `${seoMetrics.seoScore}/100` : 'Yükleniyor...'}
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        {/* Core Web Vitals */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-600">LCP:</span>
            <span className={`ml-1 font-medium ${
              seoMetrics.largestContentfulPaint <= 2500 ? 'text-green-600' :
              seoMetrics.largestContentfulPaint <= 4000 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {seoMetrics.largestContentfulPaint ? `${seoMetrics.largestContentfulPaint}ms` : '-'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600">FID:</span>
            <span className={`ml-1 font-medium ${
              seoMetrics.firstInputDelay <= 100 ? 'text-green-600' :
              seoMetrics.firstInputDelay <= 300 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {seoMetrics.firstInputDelay ? `${seoMetrics.firstInputDelay}ms` : '-'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600">CLS:</span>
            <span className={`ml-1 font-medium ${
              seoMetrics.cumulativeLayoutShift <= 0.1 ? 'text-green-600' :
              seoMetrics.cumulativeLayoutShift <= 0.25 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {seoMetrics.cumulativeLayoutShift || '-'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600">FCP:</span>
            <span className={`ml-1 font-medium ${
              seoMetrics.firstContentfulPaint <= 1800 ? 'text-green-600' :
              seoMetrics.firstContentfulPaint <= 3000 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {seoMetrics.firstContentfulPaint ? `${seoMetrics.firstContentfulPaint}ms` : '-'}
            </span>
          </div>
        </div>

        {/* SEO Issues */}
        {seoMetrics.issues && seoMetrics.issues.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-gray-700 font-medium mb-1">SEO Uyarıları:</div>
            <div className="space-y-1">
              {seoMetrics.issues.slice(0, 3).map((issue, index) => (
                <div key={index} className="text-red-600 text-xs">
                  • {issue}
                </div>
              ))}
              {seoMetrics.issues.length > 3 && (
                <div className="text-gray-500 text-xs">
                  +{seoMetrics.issues.length - 3} diğer uyarı
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SEO Analytics tracker
export const trackSEOEvent = (eventName, parameters = {}) => {
  // Google Analytics 4 event tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'SEO',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      ...parameters
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('SEO Event:', eventName, parameters);
  }
};

export default SEOPerformanceMonitor;
