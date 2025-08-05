// Cache Busting Helper
(function() {
  'use strict';
  
  // Version identifier - her build'de güncellenecek
  const CACHE_VERSION = 1754412826;
  const STORAGE_KEY = 'app_cache_version';
  
  // Mevcut cache version'ını kontrol et
  const currentVersion = localStorage.getItem(STORAGE_KEY);
  
  if (currentVersion !== CACHE_VERSION.toString()) {
    console.log('🔄 Cache version mismatch detected. Clearing cache...');
    
    // Browser cache'ini temizle
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Local storage'ı temizle (sadece cache ile ilgili)
    const itemsToKeep = ['auth_token', 'user_preferences']; // Tutulacak önemli veriler
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!itemsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Session storage'ı temizle
    sessionStorage.clear();
    
    // Yeni version'ı kaydet
    localStorage.setItem(STORAGE_KEY, CACHE_VERSION.toString());
    
    // Sayfa yenilemeyi sadece gerekli durumlarda yap
    const shouldReload = !sessionStorage.getItem('cache_cleared_this_session');
    if (shouldReload) {
      sessionStorage.setItem('cache_cleared_this_session', 'true');
      setTimeout(() => {
        window.location.reload(true);
      }, 100);
    }
  }
})();
