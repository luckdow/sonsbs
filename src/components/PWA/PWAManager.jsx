import { useEffect, useState } from 'react';

// Advanced PWA Manager - offline functionality, install prompt, update notifications
const PWAManager = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newServiceWorker, setNewServiceWorker] = useState(null);

  useEffect(() => {
    // Service Worker Registration ve Update Detection
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          // Update found
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              setNewServiceWorker(newWorker);
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                  showUpdateNotification();
                }
              });
            }
          });
          
          // Check for updates immediately
          registration.update();
          
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerSW();
    // PWA Install Prompt Handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show custom install button after 30 seconds
      setTimeout(() => {
        showInstallBanner();
      }, 30000);
    };

    // Online/Offline Status
    const handleOnline = () => {
      setIsOffline(false);
      console.log('🌐 Bağlantı geri geldi');
      
      // Show success notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CONNECTIVITY_RESTORED'
        });
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('📴 Çevrimdışı moda geçildi');
      showOfflineNotification();
    };

    // Service Worker Update Handler
    const handleSWUpdate = () => {
      setIsUpdateAvailable(true);
      showUpdateNotification();
    };

    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOffline(!navigator.onLine);

    // PWA utilities
    window.pwaUtils = {
      install: installPWA,
      isInstallable: () => isInstallable,
      isOffline: () => isOffline,
      updateApp: updateServiceWorker
    };

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstallable, isOffline]);

  // Install PWA function
  const installPWA = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA kuruldu');
        setIsInstallable(false);
        setDeferredPrompt(null);
        
        // Track installation
        if (window.gtag) {
          window.gtag('event', 'pwa_install', {
            event_category: 'PWA',
            event_label: 'User installed PWA'
          });
        }
        
        return true;
      } else {
        console.log('❌ PWA kurulumu reddedildi');
        return false;
      }
    } catch (error) {
      console.error('PWA kurulum hatası:', error);
      return false;
    }
  };

  // Update Service Worker
  const updateServiceWorker = async () => {
    if (newServiceWorker) {
      // Hide update notification immediately
      const notification = document.getElementById('pwa-update-notification');
      if (notification) {
        notification.remove();
      }
      
      // Clear state immediately to prevent multiple notifications
      setIsUpdateAvailable(false);
      setNewServiceWorker(null);
      
      // Send skip waiting message
      newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Show updating message
      const updatingMsg = document.createElement('div');
      updatingMsg.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #3b82f6;
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(59,130,246,0.3);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          <div class="animate-spin" style="
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
          "></div>
          <div style="font-weight: 600;">Güncelleniyor...</div>
        </div>
      `;
      document.body.appendChild(updatingMsg);
      
      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  // Show install banner
  const showInstallBanner = () => {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideUp 0.3s ease-out;
      ">
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">📱 Gate Transfer'i telefonunuza kurun!</div>
          <div style="font-size: 14px; opacity: 0.9;">Hızlı erişim ve offline özellikler</div>
        </div>
        <div style="display: flex; gap: 8px; margin-left: 16px;">
          <button id="pwa-install-btn" style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">Kur</button>
          <button id="pwa-dismiss-btn" style="
            background: transparent;
            border: none;
            color: white;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            opacity: 0.7;
            font-size: 18px;
          ">×</button>
        </div>
      </div>
      <style>
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
    `;

    document.body.appendChild(banner);

    // Event listeners
    document.getElementById('pwa-install-btn').onclick = async () => {
      const installed = await installPWA();
      if (installed) {
        banner.remove();
      }
    };

    document.getElementById('pwa-dismiss-btn').onclick = () => {
      banner.remove();
      localStorage.setItem('pwa-install-dismissed', Date.now());
    };

    // Auto dismiss after 15 seconds
    setTimeout(() => {
      if (document.getElementById('pwa-install-banner')) {
        banner.remove();
      }
    }, 15000);
  };

  // Show offline notification
  const showOfflineNotification = () => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f59e0b;
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(245,158,11,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideDown 0.3s ease-out;
      ">
        <div>📴</div>
        <div style="font-weight: 600;">Çevrimdışı moda geçildi - Bazı özellikler kısıtlı olabilir</div>
      </div>
      <style>
        @keyframes slideDown {
          from { transform: translate(-50%, -100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      </style>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  // Show update notification
  const showUpdateNotification = () => {
    // Prevent duplicate notifications
    if (document.getElementById('pwa-update-notification')) {
      return;
    }
    
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(16,185,129,0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="font-weight: 600; margin-bottom: 8px;">🔄 Güncelleme Mevcut!</div>
        <div style="font-size: 14px; margin-bottom: 12px; opacity: 0.9;">
          Yeni özellikler ve iyileştirmeler mevcut.
        </div>
        <button id="pwa-update-btn" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        ">Şimdi Güncelle</button>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;

    document.body.appendChild(notification);

    document.getElementById('pwa-update-btn').onclick = () => {
      updateServiceWorker();
    };
  };

  // Offline/Online status indicator
  useEffect(() => {
    if (isOffline) {
      document.body.classList.add('pwa-offline');
    } else {
      document.body.classList.remove('pwa-offline');
    }
  }, [isOffline]);

  return null;
};

export default PWAManager;
