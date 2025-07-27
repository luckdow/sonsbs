import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import WebPerformanceOptimizer from './components/UI/WebPerformanceOptimizer.jsx'
import './critical.css'
import './index.css'

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
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebPerformanceOptimizer />
    <App />
  </React.StrictMode>,
)
