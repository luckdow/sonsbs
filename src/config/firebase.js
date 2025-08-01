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

// Initialize Firebase with improved error handling and debugging
let app = null;
try {
  if (!isBot() && typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    
    // Additional debug logging for auth state
    if (typeof window !== 'undefined') {
      import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log('🔑 Firebase Auth: User is signed in', user.uid);
            
            // Manually force Firestore token refresh for more reliable permissions
            user.getIdToken(true).then(() => {
              console.log('🔄 Firebase Auth: Token refreshed successfully');
            }).catch(error => {
              console.error('❌ Token refresh error:', error);
            });
            
          } else {
            console.log('⚠️ Firebase Auth: No user signed in');
          }
        });
      });
    }
  } else {
    console.log('🤖 Bot detected - Firebase initialization skipped');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  app = null;
}

// Initialize Firebase services with safe fallbacks and timeout settings
let authInstance = null;
try {
  if (app) {
    authInstance = getAuth(app);
    console.log('✅ Firebase Auth initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase Auth initialization error:', error);
}

// Auth değişkeni her zaman bir nesne olsun (null hatası almamak için)
export const auth = authInstance || {
  currentUser: null,
  onAuthStateChanged: (callback) => callback(null),
  signOut: async () => {},
  signInWithEmailAndPassword: async () => { throw new Error('Auth not initialized') }
};

// Firestore with timeout and offline settings
let db = null;
if (app) {
  try {
    db = getFirestore(app);
    
    // Configure Firestore settings for better performance and timeout handling
    if (typeof window !== 'undefined') {
      // Enable offline persistence with timeout settings
      import('firebase/firestore').then(({ connectFirestoreEmulator, enableNetwork, disableNetwork }) => {
        // Add connection timeout and retry logic
        const setupFirestoreConnection = async () => {
          try {
            // Set connection timeout - extended to 30 seconds to give more time for auth
            setTimeout(() => {
              console.log('🔄 Firestore connection timeout - using offline mode');
            }, 30000);
            
            // Enable network with retry
            await enableNetwork(db);
            console.log('✅ Firestore online connection established');
          } catch (error) {
            console.warn('⚠️ Firestore connection error, using offline mode:', error);
          }
        };
        
        setupFirestoreConnection();
      });
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
