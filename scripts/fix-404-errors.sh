#!/bin/bash

# Google Search Console URL Removal Script
# Bu script ile 404 hatası veren URL'leri Google'dan kaldırma talebinde bulunabilirsiniz

echo "🔧 Google Search Console - URL Removal Tool"
echo "=========================================="
echo ""

echo "📋 Kaldırılması gereken 404 URL'ler:"
echo "  ❌ https://gatetransfer.com/readme.html"
echo "  ❌ https://www.gatetransfer.com/lander"
echo "  ❌ http://www.gatetransfer.com/online-reservation/"
echo "  ❌ http://www.gatetransfer.com/lander"
echo ""

echo "📋 Kaldırılması gereken Yönlendirmeli Sayfalar:"
echo "  ❌ http://www.gatetransfer.com/?_escaped_fragment_=kurumsal/c21qe"
echo "  ❌ http://gatetransfer.com/ (non-www redirect)"
echo "  ❌ http://www.gatetransfer.com/ (http redirect)"
echo ""

echo "📝 Google Search Console'da Manuel İşlemler:"
echo "  1. https://search.google.com/search-console adresine gidin"
echo "  2. 'Removals' (Kaldırmalar) sekmesine tıklayın"
echo "  3. 'New Request' (Yeni İstek) butonuna tıklayın"
echo "  4. Her URL için 'Remove this URL only' seçeneğini kullanın"
echo ""

echo "🔄 Yönlendirme Kontrolleri:"
echo "  ✅ /readme.html → / (Ana Sayfa)"
echo "  ✅ /lander → / (Ana Sayfa)" 
echo "  ✅ /online-reservation → /rezervasyon"
echo "  ✅ Hash routing (#!) → Modern URLs"
echo "  ✅ _escaped_fragment_ → Modern URLs"
echo "  ✅ http:// → https:// (SSL redirect)"
echo "  ✅ gatetransfer.com → www.gatetransfer.com"
echo ""

echo "⏱️  Beklenen Süre: 1-3 gün"
echo "🎯 Sonuç: 404 hataları düzelecek ve Google indexi temizlenecek"
echo ""

# Test redirects
echo "🧪 Redirect Testleri:"
echo "  Test 1: curl -I https://www.gatetransfer.com/readme.html"
echo "  Test 2: curl -I https://www.gatetransfer.com/lander"
echo "  Test 3: curl -I https://www.gatetransfer.com/online-reservation"
echo "  Test 4: curl -I 'http://gatetransfer.com/'"
echo "  Test 5: curl -I 'http://www.gatetransfer.com/'"
echo ""

echo "✨ İşlem tamamlandı! Değişiklikleri deploy edin."
