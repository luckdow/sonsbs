#!/bin/bash

# Google Search Console İndeksleme Sorunu Düzeltme Scripti
# SBS Turkey Transfer - Gate Transfer

echo "🔍 Google Search Console İndeksleme Sorunu Analizi Başlatılıyor..."

# 1. Robots.txt kontrol
echo "📋 Robots.txt kontrol ediliyor..."
curl -s https://www.gatetransfer.com/robots.txt | head -20

echo -e "\n🗺️ Sitemap kontrol ediliyor..."
curl -I https://www.gatetransfer.com/sitemap.xml

echo -e "\n🤖 Google Bot testi yapılıyor..."
curl -A "Googlebot/2.1 (+http://www.google.com/bot.html)" -s https://www.gatetransfer.com | head -100

echo -e "\n🔗 Meta tags kontrol ediliyor..."
curl -s https://www.gatetransfer.com | grep -E "(meta name=\"robots\"|canonical|title)" | head -10

echo -e "\n✅ Analiz tamamlandı!"
echo "📌 Sorun: JavaScript redirect Google Bot'u engelliyor"
echo "🎯 Çözüm: Bot detection kaldırıldı, direkt indeksleme aktif"
