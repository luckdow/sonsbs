// Firebase optimized lazy loading utility
export const loadFirebaseAuth = async () => {
  try {
    // Load Firebase core first
    const { initializeApp } = await import('firebase/app');
    const { getAuth, connectAuthEmulator } = await import('firebase/auth');
    
    // Initialize Firebase
    const firebaseConfig = {
      // Your config here
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    return { app, auth };
  } catch (error) {
    console.error('Firebase yükleme hatası:', error);
    throw error;
  }
};

// Preload Firebase Auth iframe
export const preloadFirebaseAuth = () => {
  const iframe = document.createElement('link');
  iframe.rel = 'prefetch';
  iframe.href = 'https://sbs-travel-96d0b.firebaseapp.com/__/auth/iframe.js';
  iframe.as = 'script';
  document.head.appendChild(iframe);
};

// Critical path optimization
export const initializeCriticalFirebase = () => {
  // Preload Firebase Auth as soon as possible
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadFirebaseAuth());
    } else {
      setTimeout(() => preloadFirebaseAuth(), 100);
    }
  }
};
