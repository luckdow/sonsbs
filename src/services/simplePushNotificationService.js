import toast from 'react-hot-toast';
import React from 'react';

class SimplePushNotificationService {
  constructor() {
    this.isSupported = this.checkSupport();
    this.hasPermission = false;
  }

  // Push Notification desteği kontrolü
  checkSupport() {
    return 'Notification' in window;
  }

  // İzin alma
  async requestPermission() {
    if (!this.isSupported) {
      console.log('Browser notifications desteklenmiyor');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Browser notification izni verildi');
        this.hasPermission = true;
        return true;
      } else {
        console.log('❌ Browser notification izni reddedildi');
        this.hasPermission = false;
        return false;
      }
    } catch (error) {
      console.error('Browser notification izin hatası:', error);
      return false;
    }
  }

  // Basit browser notification gönderme
  async sendNotification(title, body, options = {}) {
    if (!this.hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        body: body,
        icon: options.icon || '/logo192.png',
        badge: options.badge || '/logo192.png',
        tag: options.tag || 'sbs-notification',
        requireInteraction: options.requireInteraction || true,
        ...options
      });

      // Click handler
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      return true;
    } catch (error) {
      console.error('Browser notification gönderme hatası:', error);
      return false;
    }
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

  // Toast bildirimi göster (FCM yerine)
  showToastNotification(type, message, data = {}) {
    const types = this.getNotificationTypes();
    const notifType = types[type] || types.NEW_RESERVATION;

    // Toast bildirim
    toast(
      (t) => (
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'flex-1' },
            React.createElement('p', { className: 'font-semibold text-gray-900' }, notifType.title),
            React.createElement('p', { className: 'text-sm text-gray-600' }, message)
          ),
          React.createElement('button', {
            onClick: () => toast.dismiss(t.id),
            className: 'ml-2 text-gray-400 hover:text-gray-600'
          }, '✕')
        )
      ),
      {
        duration: 6000,
        style: {
          background: '#f0f9ff',
          border: `1px solid ${notifType.color}`,
          borderRadius: '8px',
          padding: '12px'
        }
      }
    );

    // Browser notification da göster
    this.sendNotification(notifType.title, message, {
      tag: `sbs-${type.toLowerCase()}`,
      onClick: () => {
        // Admin paneline odaklan
        if (data.reservationId) {
          window.location.hash = `#reservation-${data.reservationId}`;
        }
      }
    });
  }

  // Kurulum (FCM olmadan)
  async setup() {
    if (!this.isSupported) {
      console.log('❌ Browser notifications desteklenmiyor');
      return false;
    }

    const granted = await this.requestPermission();
    if (granted) {
      console.log('✅ Simple Push Notification kuruldu');
      return true;
    }
    
    return false;
  }
}

export default new SimplePushNotificationService();
