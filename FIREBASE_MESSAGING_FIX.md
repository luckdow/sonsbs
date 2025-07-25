# Firebase Messaging 401 Hatası Çözümü

## Sorun:
```
FCM Token alma hatası: FirebaseError: Messaging: A problem occurred while subscribing the user to FCM: Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential.
```

## Sebep:
Firebase Console'da web platform için Cloud Messaging ayarları eksik.

## Çözüm Adımları:

### 1. Firebase Console'a Git
- https://console.firebase.google.com/
- Projenizi seçin: `sbs-travel-96d0b`

### 2. Cloud Messaging Ayarları
- Sol menüden **Messaging** sekmesine git
- **Web Configuration** bölümünü bul
- Web push certificates bölümünde **"Generate key pair"** butona tıkla
- Oluşturulan VAPID key'i kopyala

### 3. Web App Registration
- **Project Settings** > **General** sekmesi
- **Your apps** bölümünde web app olduğundan emin ol
- Eğer yoksa **"Add app"** > **Web** seçin
- App nickname: `SBS Travel Web`
- **Also set up Firebase Hosting** işaretleyin
- **Register app** tıklayın

### 4. Firebase Configuration
- Generated config'i kontrol edin:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784",
  measurementId: "G-G4FRHCJEDP"
};
```

### 5. Domain Authorization
- **Project Settings** > **General** > **Authorized domains**
- Şu domainleri ekleyin:
  - `localhost`
  - `127.0.0.1`
  - `*.onrender.com` (production için)
  - `*.netlify.app` (production için)

## Geçici Çözüm:
Şu an fallback browser notifications çalışıyor. Firebase ayarları tamamlandıktan sonra FCM çalışacak.

## Test:
1. Yukarıdaki ayarları yap
2. Sayfayı yenile
3. Console'da "✅ FCM Token alındı" mesajını gör
4. Push notification test et
