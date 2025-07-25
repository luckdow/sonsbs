import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Smartphone, Globe } from 'lucide-react';
import PushNotificationService from '../../services/pushNotificationService';
import toast from 'react-hot-toast';

const PushNotificationTest = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState(null);
  const [testMessage, setTestMessage] = useState({
    title: 'SBS Transfer Bildirim',
    body: 'Bu bir test bildirimidir 🔔'
  });

  useEffect(() => {
    // Destek kontrolü
    setIsSupported(PushNotificationService.isSupported);
    
    // Mevcut izin durumu
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const handleRequestPermission = async () => {
    const permission = await PushNotificationService.requestPermission();
    const granted = permission === 'granted';
    setHasPermission(granted);
    
    if (granted) {
      const fcmToken = await PushNotificationService.getToken();
      setToken(fcmToken);
      
      // Foreground listener kurulumu
      PushNotificationService.setupForegroundListener();
    }
  };

  const handleTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification(testMessage.title, {
        body: testMessage.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'test-notification',
        requireInteraction: true
      });
      
      toast.success('Test bildirimi gönderildi!');
    } else {
      toast.error('Bildirim izni gerekli!');
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success('Token panoya kopyalandı!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Bell className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Push Notification Test</h1>
        </div>

        {/* Destek Durumu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Globe className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Tarayıcı Desteği</h3>
            </div>
            <div className="flex items-center">
              {isSupported ? (
                <>
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700">Destekleniyor</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-red-700">Desteklenmiyor</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Smartphone className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">İzin Durumu</h3>
            </div>
            <div className="flex items-center">
              {hasPermission ? (
                <>
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700">İzin Verildi</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-red-700">İzin Gerekli</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* İzin Alma */}
        {isSupported && !hasPermission && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Bildirim İzni Gerekli</h3>
            <p className="text-yellow-700 mb-4">
              Push bildirimleri alabilmek için tarayıcı izni vermeniz gerekiyor.
            </p>
            <button
              onClick={handleRequestPermission}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              İzin Ver
            </button>
          </div>
        )}

        {/* FCM Token */}
        {token && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">FCM Token</h3>
            <div className="bg-white rounded border p-3 mb-3">
              <code className="text-xs text-gray-700 break-all">{token}</code>
            </div>
            <button
              onClick={copyToken}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Tokeni Kopyala
            </button>
          </div>
        )}

        {/* Test Bildirimi */}
        {hasPermission && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-4">Test Bildirimi Gönder</h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={testMessage.title}
                  onChange={(e) => setTestMessage(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                <textarea
                  value={testMessage.body}
                  onChange={(e) => setTestMessage(prev => ({ ...prev, body: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={handleTestNotification}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Bell className="w-4 h-4 mr-2" />
              Test Bildirimi Gönder
            </button>
          </div>
        )}

        {/* Kullanım Talimatları */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Nasıl Çalışır?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Tarayıcınızın Push Notification desteği kontrol edilir</li>
            <li>Kullanıcıdan bildirim izni istenir</li>
            <li>Firebase Cloud Messaging (FCM) token'ı alınır</li>
            <li>Token Firebase'e kaydedilir (admin kullanıcı için)</li>
            <li>Yeni rezervasyon/değişiklik olduğunda bildirim gönderilir</li>
            <li>Admin paneli kapalı olsa bile bildirim alırsınız</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationTest;
