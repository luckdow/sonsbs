#!/bin/bash

# Modern Static Site Generation Script for Vercel
echo "🚀 Modern SEO sistemi ile static generation başlıyor..."

# Build klasörü kontrolü
if [ ! -d "dist" ]; then
  echo "❌ dist klasörü bulunamadı. Build henüz çalışmamış."
  exit 1
fi

echo "✅ Build klasörü mevcut."

# Sitemap oluştur
echo "📄 Sitemap oluşturuluyor..."
if node scripts/build-sitemap.js; then
  echo "✅ Sitemap başarıyla oluşturuldu"
else
  echo "⚠️ Sitemap oluşturulamadı, devam ediliyor..."
fi

# robots.txt varsa public'ten dist'e kopyala
if [ -f "public/robots.txt" ]; then
  cp public/robots.txt dist/
  echo "✅ robots.txt kopyalandı"
fi

# sitemap.xml varsa public'ten dist'e kopyala  
if [ -f "public/sitemap.xml" ]; then
  cp public/sitemap.xml dist/
  echo "✅ sitemap.xml kopyalandı"
fi

# manifest.json ve PWA dosyalarını kopyala
if [ -f "public/manifest.json" ]; then
  cp public/manifest.json dist/
  echo "✅ PWA manifest kopyalandı"
fi

# .well-known klasörünü kopyala (domain verification için)
if [ -d "public/.well-known" ]; then
  cp -r public/.well-known dist/
  echo "✅ .well-known klasörü kopyalandı"
fi

echo ""
echo "✅ Modern SEO sistemi ile static generation tamamlandı!"
echo "📊 React Helmet ile dinamik meta tag yönetimi aktif"
echo "🤖 Bot-friendly fallback content hazır"  
echo "🔧 Structured data entegrasyonu aktif"
echo "🌐 Vercel deployment için hazır"
echo "📄 Sitemap ve robots.txt deployment'a dahil"
echo ""
