import React, { useState } from 'react';
import { Bell, TestTube, Plus, User, Calendar } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import SimplePushNotificationService from '../../services/simplePushNotificationService';

const NotificationTestPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Test bildirimi gönder
  const sendTestNotification = (type) => {
    const messages = {
      NEW_RESERVATION: 'Ahmet Yılmaz tarafından yeni rezervasyon oluşturuldu',
      RESERVATION_EDITED: 'test@example.com tarafından rezervasyon düzenlendi',
      RESERVATION_CANCELLED: 'Rezervasyon müşteri tarafından iptal edildi',
      DRIVER_ASSIGNED: 'Mehmet Şoför rezervasyona atandı'
    };

    SimplePushNotificationService.showToastNotification(
      type,
      messages[type],
      { reservationId: 'TEST-' + Date.now() }
    );
  };

  // Gerçek rezervasyon oluştur (test için)
  const createTestReservation = async () => {
    if (!user) {
      toast.error('Giriş yapmanız gerekiyor');
      return;
    }

    setLoading(true);
    try {
      const testReservation = {
        customerInfo: {
          firstName: 'Test',
          lastName: 'Kullanıcı',
          email: 'test@example.com',
          phone: '+90 555 123 4567'
        },
        personalInfo: {
          firstName: 'Test',
          lastName: 'Kullanıcı', 
          email: 'test@example.com',
          phone: '+90 555 123 4567'
        },
        tripDetails: {
          pickupLocation: 'Antalya Havalimanı',
          dropoffLocation: 'Kemer Marina',
          date: new Date().toISOString().split('T')[0],
          time: '14:30',
          passengerCount: 2
        },
        pickupLocation: 'Antalya Havalimanı',
        dropoffLocation: 'Kemer Marina',
        date: new Date().toISOString().split('T')[0],
        time: '14:30',
        passengerCount: 2,
        status: 'pending',
        totalPrice: 45,
        reservationCode: 'TEST-' + Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: user.email,
        selectedVehicle: {
          name: 'Standart Araç',
          type: 'sedan'
        }
      };

      await addDoc(collection(db, 'reservations'), testReservation);
      
      toast.success('✅ Test rezervasyonu oluşturuldu! Admin panelinde bildirim görünecek.');
      
    } catch (error) {
      console.error('Test rezervasyon oluşturma hatası:', error);
      toast.error('Test rezervasyon oluşturulamadı: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <TestTube className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Bildirim Test Merkezi</h1>
        </div>

        {/* Test Butonları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Rezervasyon
            </h3>
            <button
              onClick={() => sendTestNotification('NEW_RESERVATION')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mb-2"
            >
              Test Bildirimi Gönder
            </button>
            <button
              onClick={createTestReservation}
              disabled={loading}
              className="w-full bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Gerçek Test Rezervasyonu Oluştur
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-3">Rezervasyon Düzenlendi</h3>
            <button
              onClick={() => sendTestNotification('RESERVATION_EDITED')}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Test Bildirimi Gönder
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3">Rezervasyon İptal Edildi</h3>
            <button
              onClick={() => sendTestNotification('RESERVATION_CANCELLED')}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Test Bildirimi Gönder
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Şoför Atandı
            </h3>
            <button
              onClick={() => sendTestNotification('DRIVER_ASSIGNED')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Bildirimi Gönder
            </button>
          </div>
        </div>

        {/* Bildirim Durumu */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Bildirim Durumu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Browser Desteği:</p>
              <p className={`font-medium ${SimplePushNotificationService.isSupported ? 'text-green-600' : 'text-red-600'}`}>
                {SimplePushNotificationService.isSupported ? '✅ Destekleniyor' : '❌ Desteklenmiyor'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">İzin Durumu:</p>
              <p className={`font-medium ${SimplePushNotificationService.hasPermission ? 'text-green-600' : 'text-orange-600'}`}>
                {SimplePushNotificationService.hasPermission ? '✅ İzin Verildi' : '⚠️ İzin Gerekli'}
              </p>
            </div>
          </div>
          
          {!SimplePushNotificationService.hasPermission && (
            <button
              onClick={() => SimplePushNotificationService.requestPermission()}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bildirim İzni Ver
            </button>
          )}
        </div>

        {/* Kullanım Talimatları */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Test Nasıl Çalışır?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>Test Bildirimi:</strong> Sadece toast ve browser notification gösterir
            </li>
            <li>
              <strong>Gerçek Test Rezervasyonu:</strong> Firebase'e gerçek rezervasyon kaydeder
            </li>
            <li>
              Admin paneli açık olan tüm tarayıcılar gerçek bildirim alır
            </li>
            <li>
              Admin paneli kapalı olan tarayıcılar browser notification alır
            </li>
            <li>
              Bildirimler admin panelinin sol üst köşesindeki zil ikonunda görünür
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;
