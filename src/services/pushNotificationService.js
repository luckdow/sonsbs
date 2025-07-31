import { messaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import toast from 'react-hot-toast';

// VAPID Key - Firebase Console'dan alınacak, şimdilik null
const VAPID_KEY = 'BPthmRQQW8__kfqW20yALazWWH19OVHkuJkpji9UFsS-Fazqw077sWFUK8pzG3uvKxlCm9osRM0nQ8RZ41G8vbw'; // Firebase Console > Project Settings > Cloud Messaging > Web Push certificates

class PushNotificationService {
  constructor() {
    this.token = null;
  }

  // Push Notification desteği kontrolü
  get isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

    // İzin alma
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('❌ Browser notification desteklemiyor');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission result:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Push notification izni verildi');
        return 'granted';
      } else {
        console.log('❌ Push notification izni reddedildi:', permission);
        return permission;
      }
    } catch (error) {
      console.error('Push notification izin hatası:', error);
      return 'denied';
    }
  }

      // FCM Token alma
  async getToken() {
    if (!this.isSupported || !messaging) {
      console.log('⚠️ FCM desteklenmiyor');
      return null;
    }

    try {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.log('⚠️ Notification izni verilmedi');
        return null;
      }

      // Service Worker kaydı
      await this.registerServiceWorker();

      // VAPID Key kontrolü
      if (!VAPID_KEY) {
        console.log('❌ VAPID key tanımlanmamış');
        return null;
      }

      console.log('🔄 FCM Token alınıyor, VAPID Key:', VAPID_KEY.substring(0, 20) + '...');

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
      });

      if (token) {
        console.log('✅ FCM Token alındı:', token.substring(0, 50) + '...');
        this.token = token;
        return token;
      } else {
        console.log('❌ FCM Token alınamadı - Token boş');
        return null;
      }
    } catch (error) {
      console.error('FCM Token alma hatası:', error);
      console.error('Hata detayı:', error.code, error.message);
      
      // Alternatif VAPID key test
      if (error.code === 'messaging/token-subscribe-failed') {
        console.log('🔄 VAPID key doğrulaması yapılıyor...');
        console.log('Current VAPID Key:', VAPID_KEY);
      }
      
      return null;
    }
  }

  // Service Worker kayıt
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Service Worker kaydedildi:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker kayıt hatası:', error);
        throw error;
      }
    }
  }

  // Foreground mesajları dinle
  setupForegroundListener() {
    if (!this.isSupported || !messaging) return;

    onMessage(messaging, (payload) => {
      console.log('📱 Foreground mesaj alındı:', payload);
      
      const { title, body } = payload.notification || {};
      
      // Sadece browser notification göster, toast'ı kaldır
      if (Notification.permission === 'granted') {
        new Notification(title || 'SBS Transfer', {
          body: body || 'Yeni bildirim',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'sbs-notification',
          requireInteraction: true
        });
      }
    });
  }

  // Token'ı sunucuya kaydet (Firebase'e admin user bilgisi ile)
  async saveTokenToDatabase(userId, userRole, token) {
    try {
      console.log('💾 FCM Token kaydediliyor:', { userId, userRole, token: token.substring(0, 20) + '...' });
      
      // Firebase'e token'ı kaydet
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      await setDoc(doc(db, 'fcmTokens', userId), {
        token: token,
        userRole: userRole,
        userId: userId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('✅ FCM Token Firebase\'e kaydedildi');
      return true;
      
    } catch (error) {
      console.error('❌ FCM Token kaydetme hatası:', error);
      return false;
    }
  }

  // Bildirimi gönderme (Backend/Cloud Function tarafından yapılacak)
  async sendNotification(userTokens, title, body, data = {}) {
    // Bu fonksiyon Cloud Function tarafından çağrılacak
    // Burada sadece client-side implementasyon var
    console.log('📤 Bildirim gönderme isteği:', { userTokens, title, body, data });
  }

  // Admin paneli için özel bildirimler
  getNotificationTypes() {
    return {
      NEW_RESERVATION: {
        title: '🆕 Yeni Rezervasyon',
        icon: '📅',
        color: '#22c55e'
      },
      RESERVATION_EDITED: {
        title: '✏️ Rezervasyon Düzenlendi',
        icon: '📝',
        color: '#f59e0b'
      },
      RESERVATION_CANCELLED: {
        title: '❌ Rezervasyon İptal Edildi',
        icon: '🚫',
        color: '#ef4444'
      },
      DRIVER_ASSIGNED: {
        title: '👨‍✈️ Şoför Atandı',
        icon: '🚗',
        color: '#3b82f6'
      }
    };
  }

  /**
   * Server-side için background notification gönder
   * Bu fonksiyon Firebase Cloud Functions'dan çağrılacak
   */
  static async sendBackgroundNotification(tokens, title, body, data = {}) {
    // Bu fonksiyon Cloud Functions'da kullanılacak
    // Client-side'da sadece referans için burada
    
    const message = {
      notification: {
        title: title,
        body: body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      },
      data: {
        url: data.url || '/admin',
        type: data.type || 'general',
        reservationId: data.reservationId || '',
        timestamp: Date.now().toString()
      },
      tokens: Array.isArray(tokens) ? tokens : [tokens]
    };
    
    console.log('📤 Background notification prepared:', message);
    return message;
  }

  /**
   * Gerçek rezervasyon bildirimi gönder
   */
  async sendReservationNotification(reservationData) {
    if (!this.isSupported) return false;
    
    try {
      const customerName = `${reservationData.customerInfo?.firstName || ''} ${reservationData.customerInfo?.lastName || ''}`.trim();
      const direction = reservationData.direction === 'from_airport' ? 'Havalimanından' : 'Havalimanına';
      const vehicleType = reservationData.selectedVehicle?.name || 'Araç';
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('🆕 Yeni Rezervasyon', {
          body: `${customerName} - ${direction} transfer (${vehicleType})`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `reservation-${reservationData.reservationCode}`,
          requireInteraction: true,
          data: {
            url: '/admin/reservations',
            type: 'new_reservation',
            reservationId: reservationData.reservationCode
          }
        });
      }

      // Service Worker notification (butonlu)
      const swRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      if (swRegistration) {
        await swRegistration.showNotification('🆕 Yeni Rezervasyon Alındı', {
          body: `${customerName}\n${direction} Transfer\n${reservationData.tripDetails?.date} ${reservationData.tripDetails?.time}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `sw-reservation-${reservationData.reservationCode}`,
          requireInteraction: true,
          actions: [
            { action: 'view', title: 'Görüntüle' },
            { action: 'close', title: 'Kapat' }
          ],
          data: {
            url: '/admin/reservations',
            type: 'new_reservation',
            reservationId: reservationData.reservationCode
          }
        });
      }

      console.log('✅ Rezervasyon bildirimi gönderildi:', reservationData.reservationCode);
      return true;
    } catch (error) {
      console.error('❌ Rezervasyon bildirim hatası:', error);
      return false;
    }
  }

}

export default new PushNotificationService();
