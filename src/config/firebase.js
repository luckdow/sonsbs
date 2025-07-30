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

// Bot detection - don't initialize Firebase for crawlers
const isBot = () => {
  if (typeof window === 'undefined') return true;
  return /bot|crawler|spider|crawling|googlebot|bingbot|yandexbot|facebookexternalhit|twitterbot|whatsapp|telegram/i.test(navigator.userAgent);
};

// Initialize Firebase only for real users, not bots
const app = !isBot() ? initializeApp(firebaseConfig) : null;

// Initialize Firebase services with safe fallbacks
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

// Messaging için güvenli initialization (sadece browser'da ve bot değilse)
let messaging = null;
if (!isBot() && typeof window !== 'undefined' && 'serviceWorker' in navigator && app) {
  try {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized');
  } catch (error) {
    console.error('❌ Firebase Messaging initialization error:', error);
  }
}

export { messaging };

export default app;
