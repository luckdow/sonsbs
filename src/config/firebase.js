// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784",
  measurementId: "G-G4FRHCJEDP"
};

// Enhanced bot detection - Google Search Console crawlers dahil
const isBot = () => {
  if (typeof window === 'undefined') return true;
  if (typeof navigator === 'undefined') return true;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'crawling', 'scraper',
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider',
    'facebookexternalhit', 'twitterbot', 'whatsapp', 'telegram',
    'slurp', 'duckduckbot', 'ia_archiver', 'archive.org_bot',
    'google-structured-data-testing-tool', 'google-site-verification',
    'lighthouse', 'pagespeed', 'gtmetrix', 'pingdom',
    'prerender', 'phantomjs', 'headless', 'curl', 'wget'
  ];
  
  // Bot detection with additional safety checks
  const isLikelyBot = botPatterns.some(pattern => userAgent.includes(pattern));
  const hasNoWindow = typeof window === 'undefined';
  const hasNoDocument = typeof document === 'undefined';
  
  return isLikelyBot || hasNoWindow || hasNoDocument;
};

// Initialize Firebase with improved error handling
let app = null;
try {
  if (!isBot() && typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
  } else {
    console.log('🤖 Bot detected - Firebase initialization skipped');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  app = null;
}

// Initialize Firebase services with safe fallbacks and timeout settings
export const auth = app ? getAuth(app) : null;

// Firestore with timeout and offline settings
let db = null;
if (app) {
  try {
    db = getFirestore(app);
    
    // Configure Firestore settings for better performance and timeout handling
    if (typeof window !== 'undefined') {
      // Enable offline persistence with timeout settings
      db._settings = {
        ...db._settings,
        ignoreUndefinedProperties: true,
        merge: true,
        // Connection timeout settings
        experimentalForceLongPolling: false,
        experimentalAutoDetectLongPolling: true
      };
    }
    
    console.log('✅ Firestore initialized with timeout settings');
  } catch (error) {
    console.warn('⚠️ Firestore initialization warning:', error.message);
    db = null;
  }
}

export { db };
export const storage = app ? getStorage(app) : null;

// Messaging için güvenli initialization (browser compatibility check)
let messaging = null;
if (!isBot() && typeof window !== 'undefined' && app) {
  try {
    // Messaging support check
    const supportsMessaging = 'serviceWorker' in navigator && 
                             'PushManager' in window && 
                             'Notification' in window &&
                             !window.safari; // Safari has limited support
    
    if (supportsMessaging) {
      messaging = getMessaging(app);
      console.log('✅ Firebase Messaging initialized');
    } else {
      console.log('ℹ️ Firebase Messaging: Browser not supported or limited support');
    }
  } catch (error) {
    console.warn('⚠️ Firebase Messaging not available:', error.message);
    messaging = null;
  }
}

export { messaging };

export default app;
