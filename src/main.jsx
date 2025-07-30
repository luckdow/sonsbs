import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import WebPerformanceOptimizer from './components/UI/WebPerformanceOptimizer.jsx'
import { googleAnalytics, seoPerformanceMonitor } from './utils/googleSeoIntegration.js'
import GoogleAPIErrorHandler from './utils/googleErrorHandler.js'
import './critical.css'
import './index.css'

// Google API Error Handler'ı başlat
if (typeof window !== 'undefined') {
  // Service Worker'ı kaydet
  GoogleAPIErrorHandler.registerServiceWorker();
  
  // Preload kullanımını kontrol et
  GoogleAPIErrorHandler.checkPreloadUsage();
}

// Google Analytics ve SEO Performance Monitoring başlat
if (typeof window !== 'undefined') {
  // Google Analytics'i başlat
  googleAnalytics.initialize();
  
  // SEO Performance monitoring'i başlat
  seoPerformanceMonitor.monitorCoreWebVitals();
  
  // İlk sayfa görüntülemesini track et
  setTimeout(() => {
    googleAnalytics.trackPageView(
      window.location.pathname,
      document.title,
      'tr',
      'home',
      'antalya',
      'transfer'
    );
  }, 1000);
}

// Reduce motion for better performance on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add('no-animations');
}

// Performance optimizations
if ('requestIdleCallback' in window) {
  // Defer non-critical operations
  requestIdleCallback(() => {
    // Preload important routes
    import('./pages/Public/HomePage_OPTIMIZED');
    import('./components/Booking/BookingWizard');
  });
}

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Hide SEO content when React loads
const hideSEOContent = () => {
  const seoContent = document.getElementById('seo-content');
  if (seoContent) {
    seoContent.style.display = 'none';
  }
};

root.render(
  <React.StrictMode>
    <WebPerformanceOptimizer />
    <App />
  </React.StrictMode>
);

// Hide SEO content after render
setTimeout(hideSEOContent, 100);
