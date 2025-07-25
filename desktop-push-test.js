// Desktop'tan Push Notification Test Scripti
// Node.js ile çalıştırmak için

const admin = require('firebase-admin');

// Firebase Admin SDK kurulumu
const serviceAccount = {
  "type": "service_account",
  "project_id": "sbs-travel-96d0b",
  // Buraya Service Account key'leri gelecek
};

// FCM Token buraya yazılacak
const FCM_TOKEN = "eued9CC4d3Ri73uDsKL5vc:APA91bG_Lcohww3TsYNQeJ9VolC..."; // Token'ı buraya yaz

// Firebase Admin initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sbs-travel-96d0b'
});

// Push notification gönder
async function sendPushNotification() {
  const message = {
    notification: {
      title: '🔔 TEST: Admin Paneli Kapalı!',
      body: 'Bu bildirim admin paneli kapalıyken desktop\'tan gönderildi!',
      icon: '/logo.png'
    },
    data: {
      type: 'test',
      timestamp: new Date().toISOString()
    },
    token: FCM_TOKEN
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Push notification başarıyla gönderildi:', response);
  } catch (error) {
    console.error('❌ Push notification gönderme hatası:', error);
  }
}

// Test çalıştır
sendPushNotification();
