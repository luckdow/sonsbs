import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './critical.css'
import './index.css'

// Reduce motion for better performance on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add('no-animations');
}

// Performance optimizations
if ('requestIdleCallback' in window) {
  // Defer non-critical JS
  requestIdleCallback(() => {
    import('./index.css');
  });
}

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
