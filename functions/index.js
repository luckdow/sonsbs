const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Keep-alive fonksiyonu - Cold start problemini azaltmak için
exports.keepAlive = functions.https.onRequest((req, res) => {
  res.status(200).send('Functions are alive!');
});

// Her 5 dakikada bir fonksiyonları uyandırmak için scheduled fonksiyon
exports.scheduledKeepAlive = functions.pubsub.schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      console.log('Keep-alive job running');
      return null;
    } catch (error) {
      console.error('Keep-alive job error:', error);
      return null;
    }
  });

// Rezervasyon değişikliklerini dinle ve push notification gönder
exports.sendReservationNotification = functions.firestore
  .document('reservations/{reservationId}')
  .onWrite(async (change, context) => {
    const reservationId = context.params.reservationId;
    
    try {
      // Yeni rezervasyon
      if (!change.before.exists && change.after.exists) {
        const newReservation = change.after.data();
        await sendNotificationToAdmins({
          title: '🆕 Yeni Rezervasyon',
          body: `${newReservation.customerInfo?.firstName || 'Bilinmeyen'} tarafından yeni rezervasyon oluşturuldu`,
          data: {
            type: 'NEW_RESERVATION',
            reservationId: reservationId,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Rezervasyon düzenlendi
      else if (change.before.exists && change.after.exists) {
        const beforeData = change.before.data();
        const afterData = change.after.data();
        
        // Düzenleme kontrolü
        if (afterData.lastEditedAt && afterData.lastEditedAt !== beforeData.lastEditedAt) {
          await sendNotificationToAdmins({
            title: '✏️ Rezervasyon Düzenlendi',
            body: `${afterData.editedBy || 'Bilinmeyen'} tarafından rezervasyon güncellendi`,
            data: {
              type: 'RESERVATION_EDITED',
              reservationId: reservationId,
              timestamp: new Date().toISOString()
            }
          });
        }
        
        // İptal kontrolü
        if (afterData.status === 'cancelled' && beforeData.status !== 'cancelled') {
          await sendNotificationToAdmins({
            title: '❌ Rezervasyon İptal Edildi',
            body: `${afterData.cancelledBy || 'Bilinmeyen'} tarafından rezervasyon iptal edildi`,
            data: {
              type: 'RESERVATION_CANCELLED',
              reservationId: reservationId,
              timestamp: new Date().toISOString()
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Push notification gönderme hatası:', error);
    }
  });

// Admin kullanıcıların FCM token'larını al ve bildirim gönder
async function sendNotificationToAdmins(payload) {
  try {
    // Admin kullanıcıların FCM token'larını al
    const tokensSnapshot = await admin.firestore()
      .collection('fcmTokens')
      .where('userRole', '==', 'admin')
      .get();
    
    if (tokensSnapshot.empty) {
      console.log('Admin FCM token bulunamadı');
      return;
    }
    
    const tokens = [];
    tokensSnapshot.forEach(doc => {
      const tokenData = doc.data();
      if (tokenData.token) {
        tokens.push(tokenData.token);
      }
    });
    
    if (tokens.length === 0) {
      console.log('Geçerli FCM token bulunamadı');
      return;
    }
    
    // Toplu bildirim gönder
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
        icon: '/logo192.png'
      },
      data: payload.data,
      tokens: tokens
    };
    
    const response = await admin.messaging().sendMulticast(message);
    console.log('Push notification gönderildi:', response.successCount, 'başarılı,', response.failureCount, 'başarısız');
    
    // Başarısız token'ları temizle
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      
      // Başarısız token'ları sil
      for (const token of failedTokens) {
        await admin.firestore()
          .collection('fcmTokens')
          .where('token', '==', token)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => doc.ref.delete());
          });
      }
    }
    
  } catch (error) {
    console.error('Admin bildirim gönderme hatası:', error);
  }
}

module.exports = { 
  sendReservationNotification,
  keepAlive,
  scheduledKeepAlive
};
