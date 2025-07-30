# Firebase ve Google Analytics Hata Doğrulama Rehberi

## 1. Google Analytics Doğrulama
- Chrome DevTools → Network → gtag.js (200 OK olmalı)
- Real-time reports: https://analytics.google.com/analytics/web/
- Tek GA ID kontrolü: `G-EQB0RS3034`

## 2. Firebase Firestore Doğrulama
- Firebase Console: https://console.firebase.google.com/project/sbs-travel-96d0b
- Firestore → Rules → Yayınlanma tarihi kontrol
- Network tab'da 403/401 hatalarının azalması

## 3. Google Search Console Kontrol
- Coverage → Valid pages artışı
- Core Web Vitals → Loading hatalarında azalma
- Mobile Usability → Crawler erişim iyileştirmesi

## 4. Beklenen Sonuçlar
✅ Firestore Listen errors: %80+ azalma
✅ Google Analytics: Tek ID, error handling
✅ Bot detection: Google crawler'lar korunuyor
✅ Page load: 15-20% hız artışı bekleniyor

## 5. Eğer Hala Hata Varsa
1. Firebase rules deploy yapılmamış olabilir
2. Cache temizleme gerekebilir (Ctrl+F5)
3. Google Analytics verification bekle (24 saat)
4. DNS propagation bekle (48 saat max)

## 6. İzleme Araçları
- Firebase Console → Usage → Quota monitoring
- Google Analytics → Reports → Tech → Browser/OS
- Vercel Analytics → Functions → Error rate
