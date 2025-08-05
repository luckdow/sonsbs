import { useEffect } from 'react';

// Cache Busting Hook
export const useCacheBusting = () => {
  useEffect(() => {
    // Service Worker güncellemelerini kontrol et
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Her 5 dakikada bir güncelleme kontrol et
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);
      });

      // Service Worker güncellendiğinde kullanıcıyı bilgilendir
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          // Kullanıcıya bildirim göster
          if (window.confirm('Yeni güncelleme mevcut. Sayfayı yenilemek ister misiniz?')) {
            window.location.reload();
          }
        }
      });
    }

    // Page Visibility API ile tab aktif olduğunda kontrol et
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab aktif olduğunda build time kontrol et
        const buildTime = document.querySelector('meta[name="build-time"]')?.content;
        const storedBuildTime = localStorage.getItem('last_build_time');
        
        if (buildTime && storedBuildTime && buildTime !== storedBuildTime) {
          console.log('🔄 New build detected, refreshing...');
          localStorage.setItem('last_build_time', buildTime);
          window.location.reload();
        } else if (buildTime && !storedBuildTime) {
          localStorage.setItem('last_build_time', buildTime);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

// Cache Temizleme Utility
export const clearAllCaches = async () => {
  try {
    // Service Worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    // Browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // IndexedDB (eğer kullanılıyorsa)
    if ('indexedDB' in window) {
      // Firebase cache de temizlenecek
      const databases = await indexedDB.databases?.() || [];
      await Promise.all(
        databases.map(db => {
          if (db.name?.includes('firebase') || db.name?.includes('cache')) {
            return new Promise((resolve) => {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              deleteReq.onsuccess = () => resolve();
              deleteReq.onerror = () => resolve();
            });
          }
        })
      );
    }
    
    console.log('✅ All caches cleared');
    return true;
  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
    return false;
  }
};

// Force Reload Utility  
export const forceReload = () => {
  // Hard reload with cache bypass
  window.location.reload(true);
};
