// Firebase Connection Manager
// Enhanced connection handling for timeout and network issues

let connectionRetryCount = 0;
const MAX_RETRIES = 3;

export const createFirestoreConnection = () => {
  return new Promise((resolve, reject) => {
    const attemptConnection = async () => {
      try {
        if (!db) {
          throw new Error('Firestore not initialized');
        }
        
        // Test connection with a lightweight operation
        const testRef = doc(db, 'test', 'connection');
        await getDoc(testRef);
        
        console.log('✅ Firestore connection established');
        connectionRetryCount = 0;
        resolve(db);
      } catch (error) {
        connectionRetryCount++;
        
        if (connectionRetryCount <= MAX_RETRIES) {
          console.warn(`⚠️ Firestore connection attempt ${connectionRetryCount}/${MAX_RETRIES} failed:`, error.message);
          
          // Exponential backoff
          const delay = Math.pow(2, connectionRetryCount) * 1000;
          setTimeout(attemptConnection, delay);
        } else {
          console.error('❌ Firestore connection failed after maximum retries');
          connectionRetryCount = 0;
          reject(error);
        }
      }
    };
    
    attemptConnection();
  });
};

// Connection wrapper with timeout
export const withFirestoreTimeout = async (operation, timeoutMs = 10000) => {
  return Promise.race([
    operation(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore operation timeout')), timeoutMs)
    )
  ]);
};

// Network status monitoring
export const monitorNetworkStatus = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored');
      connectionRetryCount = 0;
    });
    
    window.addEventListener('offline', () => {
      console.log('📴 Network connection lost - switching to offline mode');
    });
  }
};

export default {
  createFirestoreConnection,
  withFirestoreTimeout,
  monitorNetworkStatus
};
