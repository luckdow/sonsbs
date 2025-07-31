#!/bin/bash

# Google Search Console - Yönlendirmeli Sayfa Removal Script
# Bu script ile yönlendirmeli sayfa hatalarını düzeltme rehberi

echo "🔧 Google Search Console - Yönlendirmeli Sayfa Düzeltme Rehberi"
echo "================================================================"
echo ""

echo "❓ Yönlendirmeli Sayfa Hatası Nedir?"
echo "  • Google eski AJAX crawling (_escaped_fragment_) URL'lerini buluyor"
echo "  • Bu URL'ler modern web standartlarında artık gerekli değil"
echo "  • Redirect olduğu için Google bunları indexlemiyor"
echo ""

echo "📋 Tespit Edilen Problemli URL'ler:"
echo "  🔄 http://www.gatetransfer.com/?_escaped_fragment_=kurumsal/c21qe"
echo "     → Çözüm: /hizmetler/kurumsal-transfer sayfasına redirect"
echo ""
echo "  🔄 http://gatetransfer.com/"
echo "     → Çözüm: https://www.gatetransfer.com/ redirect (www + SSL)"
echo ""
echo "  🔄 http://www.gatetransfer.com/"
echo "     → Çözüm: https://www.gatetransfer.com/ redirect (SSL)"
echo ""

echo "✅ Yapılan Düzeltmeler:"
echo "  1. _escaped_fragment_ URL'leri için redirect rules"
echo "  2. HTTP → HTTPS redirect (SSL enforcement)"
echo "  3. Non-www → www redirect"
echo "  4. AJAX crawling devre dışı (<meta name=\"fragment\" content=\"!\">)"
echo "  5. Robots.txt'de _escaped_fragment_ disallow"
echo ""

echo "🎯 Google Search Console Aksiyonları:"
echo "  1. 'Removals' bölümünde her URL için removal request"
echo "  2. 'URL Inspection' ile yeni URL'leri test et"
echo "  3. 'Fetch as Google' ile yeni sayfaları indeksle"
echo ""

echo "⏱️  Timeline:"
echo "  • Redirects: Anında aktif"
echo "  • Google cache temizleme: 1-3 gün"
echo "  • Search Console hata düzeltme: 1-2 hafta"
echo ""

echo "🔍 Debug Komutları:"
echo "  curl -I 'http://gatetransfer.com/'"
echo "  curl -I 'http://www.gatetransfer.com/'"
echo "  curl -I 'http://www.gatetransfer.com/?_escaped_fragment_=kurumsal/c21qe'"
echo ""

echo "✨ Bu düzeltmeler sonunda Google'ın tüm redirect hataları çözülecek!"
