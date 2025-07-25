# Firebase Push Notification Kurulum Talimatları

## 1. VAPID Key Alma (Zorunlu)

### Firebase Console'dan VAPID Key alma adımları:

1. **Firebase Console'a git**: https://console.firebase.google.com/
2. **Projenizi seçin**: sbs-travel-96d0b
3. **Sol menüden Project Settings'e tıklayın** (⚙️ ikonu)
4. **Cloud Messaging sekmesine geçin**
5. **Web Push certificates bölümüne inin**
6. **"Generate key pair" butonuna tıklayın**
7. **Key pair oluşturulduktan sonra kopyalayın**

### VAPID Key'i sisteme ekleme:

Aldığınız VAPID key'i şu dosyaya ekleyin:
`src/services/pushNotificationService.js`

```javascript
const VAPID_KEY = 'BURAYA_VAPID_KEY_YAPIŞTIRIN';
```

## 2. Firebase Cloud Functions Deploy Etme

```bash
# Firebase CLI kurulumu (eğer yoksa)
npm install -g firebase-tools

# Firebase'e giriş yapın
firebase login

# Functions klasöründe dependencies'leri yükleyin
cd functions
npm install

# Functions'ları Firebase'e deploy edin
firebase deploy --only functions
```

## 3. Test Etme

1. VAPID key eklendikten sonra admin panelini yenileyin
2. "🔔 Push bildirimler etkinleştirildi!" mesajını görmelisiniz
3. `/admin/notification-test` sayfasından test rezervasyonu oluşturun
4. Admin panelini kapatın
5. Browser notification gelmeli (background'da)

## 4. Sorun Giderme

### Push bildirim çalışmıyorsa:

1. **VAPID key doğru mu?** - Firebase Console > Cloud Messaging > Web Push certificates
2. **Browser notification izni verildi mi?** - Tarayıcı ayarları > Bildirimler
3. **Firebase Functions deploy edildi mi?** - `firebase functions:log` ile kontrol edin
4. **FCM Token kaydedildi mi?** - Firebase Console > Firestore > fcmTokens collection'ını kontrol edin

### Console log'larında kontrol edilecekler:

```
✅ FCM Token alındı: [token]
✅ FCM Token Firebase'e kaydedildi  
✅ FCM Push Notification kuruldu
```

## 5. Önemli Notlar

- **VAPID key olmadan push notification çalışmaz**
- **Firebase Functions backend trigger olarak çalışır**
- **Admin paneli kapalı olsa bile bildirim gelir**
- **Sadece admin role'li kullanıcılar bildirim alır**
- **FCM token'lar güvenli şekilde Firebase'de saklanır**

## 6. Canlı Kullanım

Sistem canlıya alındığında:
1. Tüm admin kullanıcıları ilk giriş yaptığında FCM token kaydedilir
2. Her rezervasyon değişikliğinde Firebase Function tetiklenir  
3. Background push notification otomatik gönderilir
4. Admin paneli kapalı olsa bile bildirimler gelir
