import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import WebPerformanceOptimizer from './components/UI/WebPerformanceOptimizer.jsx'
import { googleAnalytics, seoPerformanceMonitor } from './utils/googleSeoIntegration.js'
import GoogleAPIErrorHandler from './utils/googleErrorHandler.js'
import './critical.css'
import './index.css'

// Enhanced Bot Detection for SEO
const isBot = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'slurp',
    'facebookexternalhit', 'twitterbot', 'linkedinbot',
    'google-structured-data-testing-tool', 'lighthouse',
    'pagespeed', 'gtmetrix', 'pingdom', 'prerender'
  ];
  
  return botPatterns.some(pattern => userAgent.includes(pattern));
};

// Google API Error Handler'ı başlat (sadece gerçek kullanıcılar için)
if (typeof window !== 'undefined' && !isBot()) {
  // Service Worker'ı kaydet
  GoogleAPIErrorHandler.registerServiceWorker();
  
  // Preload kullanımını kontrol et
  GoogleAPIErrorHandler.checkPreloadUsage();
}

// Google Analytics ve SEO Performance Monitoring başlat (sadece gerçek kullanıcılar için)
if (typeof window !== 'undefined' && !isBot()) {
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

// Create root and render app - Fix for multiple createRoot calls
const rootElement = document.getElementById('root');

// More robust check for existing root
let root;
if (!rootElement._reactRoot) {
  root = ReactDOM.createRoot(rootElement);
  rootElement._reactRoot = root; // Store on the element itself
} else {
  root = rootElement._reactRoot;
}

// Hide SEO content when React loads
const hideSEOContent = () => {
  const seoContent = document.getElementById('seo-content');
  if (seoContent) {
    seoContent.style.display = 'none';
  }
};

root.render(
  // Temporarily remove StrictMode to avoid double createRoot warning in development
  <>
    <WebPerformanceOptimizer />
    <App />
  </>
);

// Hide SEO content after render
setTimeout(hideSEOContent, 100);
