import { useEffect } from 'react';

// Performance monitoring and web vitals
const WebPerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      fontLink.as = 'style';
      fontLink.onload = function() { this.rel = 'stylesheet'; };
      document.head.appendChild(fontLink);

      // DNS prefetch for external domains
      const dnsPrefetchDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://hizliresim.com',
        'https://maps.googleapis.com'
      ];

      dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Optimize images on scroll
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Smart CSS loading optimization
    const optimizeCSS = () => {
      // Only optimize non-critical external stylesheets
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach(sheet => {
        // Don't touch critical CSS or inline styles or same-origin styles
        if (sheet.href && 
            !sheet.href.includes('critical') && 
            !sheet.href.includes('/src/') && // Don't touch Vite dev server CSS
            sheet.href.includes('googleapis')) { // Only optimize external fonts
          const media = sheet.media || 'all';
          sheet.media = 'print';
          sheet.onload = function() { 
            this.media = media; 
            this.onload = null;
          };
        }
      });
    };

    // Web Vitals monitoring
    const measureWebVitals = () => {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
              }
              if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime);
              }
            }
          });
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
        } catch(e) {
          console.log('Performance Observer not supported');
        }
      }
    };

    // Execute optimizations
    preloadCriticalResources();
    optimizeImages();
    measureWebVitals();
    
    // Critical CSS optimization
    setTimeout(optimizeCSS, 100);

    // Cleanup function
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null;
};

export default WebPerformanceOptimizer;
