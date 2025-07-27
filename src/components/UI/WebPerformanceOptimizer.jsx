import { useEffect } from 'react';

// Performance monitoring and web vitals
const WebPerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // DNS prefetch for external domains
      const dnsPrefetchDomains = [
        'https://hizliresim.com',
        'https://maps.googleapis.com',
        'https://firebase.googleapis.com'
      ];

      dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });

      // Preconnect to critical domains for faster resource loading
      const preconnectDomains = [
        'https://fonts.gstatic.com',
        'https://maps.googleapis.com'
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
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
      }, {
        // Load images slightly before they become visible
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));

      // Immediately load above-the-fold images (LCP optimization)
      const aboveFoldImages = document.querySelectorAll('img[data-src]');
      aboveFoldImages.forEach((img, index) => {
        // Load first 3 images immediately for better LCP
        if (index < 3) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
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

    // Web Vitals monitoring (only in development)
    const measureWebVitals = () => {
      // Only monitor in development environment
      if (process.env.NODE_ENV !== 'production' && 'PerformanceObserver' in window) {
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

    // LCP optimization - prioritize above-the-fold content
    const optimizeLCP = () => {
      // Force immediate render of hero content
      const heroElements = document.querySelectorAll('.hero, .banner, h1, .main-title');
      heroElements.forEach(element => {
        element.style.contentVisibility = 'visible';
        element.style.containIntrinsicSize = 'none';
      });

      // Preload hero images if they exist
      const heroImages = document.querySelectorAll('.hero img, .banner img');
      heroImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
        }
      });
    };

    // Run LCP optimization immediately
    optimizeLCP();
    // Also run after a short delay to catch dynamically loaded content
    setTimeout(optimizeLCP, 200);

    // Cleanup function
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null;
};

export default WebPerformanceOptimizer;
