# Google Cloud Console API Ayarları Rehberi

## 1. Google Maps JavaScript API Kısıtlamaları

Google Cloud Console'a gidin ve aşağıdaki adımları takip edin:

### Adım 1: API Anahtarı Sayfasına Gidin
- https://console.cloud.google.com/apis/credentials
- Projenizi seçin (eğer yoksa yeni proje oluşturun)

### Adım 2: API Anahtarınızı Bulun
- Mevcut API anahtarınız: `AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw`
- Bu anahtara tıklayın

### Adım 3: HTTP referer Kısıtlamaları
"HTTP referer (web siteleri)" seçeneğini işaretleyin ve aşağıdaki domain'leri ekleyin:

```
https://gatetransfer.com/*
https://www.gatetransfer.com/*
http://localhost:*
http://127.0.0.1:*
https://localhost:*
https://vercel.app/*
https://*.vercel.app/*
https://sonsbs-*.vercel.app/*
```

### Adım 4: API Kısıtlamaları
Aşağıdaki API'lerin aktif olduğundan emin olun:
- Maps JavaScript API
- Places API
- Geocoding API
- Directions API
- Distance Matrix API

### Adım 5: Faturalandırma
- Faturalandırma hesabınızın aktif olduğundan emin olun
- Günlük/aylık kotalarınızı kontrol edin

## 2. Places API Geçiş Planı

Google, Places Autocomplete API'sini 2025'te deprecated hale getirdi.
Yeni PlaceAutocompleteElement API'sine geçiş yapmanız önerilir.

### Geçici Çözüm (Şu An Uygulandı)
- Deprecation warning'leri gizlendi
- Mevcut Autocomplete API çalışmaya devam ediyor
- Hata yakalama sistemi eklendi

### Uzun Vadeli Çözüm
```javascript
// Yeni API kullanımı (gelecekte implement edilecek)
const autocompleteElement = new google.maps.places.PlaceAutocompleteElement();
autocompleteElement.setOptions({
  componentRestrictions: { country: 'TR' },
  fields: ['place_id', 'formatted_address', 'name', 'geometry']
});
```

## 3. Hata Durumlarında Kontrol Listesi

### RefererNotAllowedMapError
- [ ] Domain ayarları doğru mu?
- [ ] HTTPS kullanılıyor mu?
- [ ] API anahtarı doğru mu?

### Service Worker MIME Type Error
- [ ] sw.js dosyası var mı?
- [ ] Content-Type header'ı doğru mu?
- [ ] Sunucu yapılandırması doğru mu?

### Places API Errors
- [ ] Places API aktif mi?
- [ ] Quota aşıldı mı?
- [ ] Fields parametresi doğru mu?

## 4. Performance İyileştirmeleri

### Resource Hints
```html
<!-- DNS prefetch for Google services -->
<link rel="dns-prefetch" href="//maps.googleapis.com">
<link rel="dns-prefetch" href="//www.googletagmanager.com">

<!-- Preconnect for critical resources -->
<link rel="preconnect" href="https://maps.googleapis.com" crossorigin>
```

### Lazy Loading
```javascript
// Google Maps'i sadece gerektiğinde yükle
const loadGoogleMaps = async () => {
  if (!window.google) {
    await import('./googleMapsLoader.js');
  }
  return window.google;
};
```

## 5. Monitoring ve Debugging

### Console Hatalarını Takip Edin
```javascript
// Google Maps API hatalarını yakala
window.gm_authFailure = () => {
  console.error('Google Maps Authentication Failed');
  // Fallback mekanizması
};
```

### Network Tab'ı Kontrolü
- Google Maps API isteklerinin 200 dönüp dönmediğini kontrol edin
- CORS hatalarını kontrol edin
- Rate limiting (429) hatalarını kontrol edin

## 6. Backup Planları

### Alternatif Harita Servisleri
- OpenStreetMap (Leaflet.js)
- Mapbox
- Here Maps

### Offline Fallback
```javascript
// Network bağlantısı yoksa
if (!navigator.onLine) {
  // Offline mode aktif et
  showOfflineMessage();
}
```

---

Bu ayarları yaptıktan sonra sorunların çözülmüş olması gerekir.
Eğer sorunlar devam ederse, browser geliştirici araçlarından Network ve Console tab'larını kontrol edin.
