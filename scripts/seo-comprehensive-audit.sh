#!/bin/bash

echo "🔍 KAPSAMLI SEO AUDIT BAŞLATIYOR..."
echo "======================================"

# 1. ROBOTS.TXT KONTROLÜ
echo ""
echo "🤖 1. ROBOTS.TXT KONTROLÜ:"
echo "-------------------------"
if [ -f "public/robots.txt" ]; then
    echo "✅ robots.txt mevcut"
    echo "📄 İçerik:"
    cat public/robots.txt
    echo ""
else
    echo "❌ robots.txt BULUNAMADI!"
fi

# 2. SITEMAP KONTROLÜ
echo ""
echo "🗺️ 2. SITEMAP KONTROLÜ:"
echo "----------------------"
if [ -f "public/sitemap.xml" ]; then
    echo "✅ sitemap.xml mevcut"
    echo "📊 Sitemap boyutu: $(wc -l < public/sitemap.xml) satır"
    echo "📄 İlk 10 URL:"
    grep -o '<loc>[^<]*</loc>' public/sitemap.xml | head -10
    echo ""
else
    echo "❌ sitemap.xml BULUNAMADI!"
fi

# 3. INDEX.HTML SEO KONTROLÜ
echo ""
echo "📄 3. INDEX.HTML SEO KONTROLÜ:"
echo "-----------------------------"
if [ -f "index.html" ]; then
    echo "✅ index.html mevcut"
    
    # Meta tag kontrolü
    echo "🏷️ Meta Tags:"
    grep -i "<title>" index.html || echo "❌ TITLE eksik!"
    grep -i 'name="description"' index.html || echo "❌ DESCRIPTION eksik!"
    grep -i 'name="keywords"' index.html || echo "❌ KEYWORDS eksik!"
    grep -i 'property="og:' index.html || echo "❌ OPEN GRAPH eksik!"
    grep -i 'name="twitter:' index.html || echo "❌ TWITTER CARDS eksik!"
    
    # Canonical kontrolü
    echo ""
    echo "🔗 Canonical URL:"
    grep -i 'rel="canonical"' index.html || echo "❌ CANONICAL eksik!"
    
    # Schema.org kontrolü
    echo ""
    echo "📋 Schema.org:"
    grep -i 'application/ld+json' index.html || echo "❌ SCHEMA.ORG eksik!"
    
else
    echo "❌ index.html BULUNAMADI!"
fi

# 4. DIST KLASÖRÜ KONTROLÜ
echo ""
echo "📦 4. DIST KLASÖRÜ KONTROLÜ:"
echo "---------------------------"
if [ -d "dist" ]; then
    echo "✅ dist klasörü mevcut"
    echo "📊 Toplam dosya sayısı: $(find dist -name "*.html" | wc -l)"
    echo "📂 Oluşturulan route'lar:"
    find dist -name "index.html" | sed 's|dist||g' | sed 's|/index.html||g' | sort
    echo ""
    
    # Dist/index.html SEO kontrolü
    if [ -f "dist/index.html" ]; then
        echo "🔍 DIST/INDEX.HTML SEO KONTROLÜ:"
        echo "Meta title: $(grep -o '<title>[^<]*</title>' dist/index.html | head -1)"
        echo "Meta description: $(grep -o 'name="description" content="[^"]*"' dist/index.html | head -1)"
        echo "Canonical URL: $(grep -o 'rel="canonical" href="[^"]*"' dist/index.html | head -1)"
    fi
else
    echo "❌ dist klasörü BULUNAMADI!"
fi

# 5. SEO KOMPONENTI KONTROLÜ
echo ""
echo "🔧 5. SEO KOMPONENTI KONTROLÜ:"
echo "-----------------------------"
find src -name "*SEO*" -type f | while read file; do
    echo "✅ $file"
done

# 6. REACT HELMET KONTROLÜ
echo ""
echo "⛑️ 6. REACT HELMET KONTROLÜ:"
echo "----------------------------"
grep -r "react-helmet" src/ || echo "❌ React Helmet kullanımı bulunamadı!"

# 7. ROUTE KONTROLÜ
echo ""
echo "🛣️ 7. ROUTE KONTROLÜ (APP.JSX):"
echo "-------------------------------"
if [ -f "src/App.jsx" ]; then
    echo "✅ App.jsx mevcut"
    echo "📊 Route sayısı: $(grep -c "path=" src/App.jsx)"
    echo "📄 Route'lar:"
    grep -o 'path="[^"]*"' src/App.jsx | sort
else
    echo "❌ App.jsx BULUNAMADI!"
fi

# 8. PACKAGE.JSON KONTROLÜ
echo ""
echo "📦 8. PACKAGE.JSON SEO DEPENDENCIES:"
echo "-----------------------------------"
if [ -f "package.json" ]; then
    echo "SEO ilgili paketler:"
    grep -i "helmet\|seo\|meta\|sitemap" package.json || echo "❌ SEO paketleri bulunamadı!"
else
    echo "❌ package.json BULUNAMADI!"
fi

# 9. PRERENDER SCRIPT KONTROLÜ
echo ""
echo "🎭 9. PRERENDER SCRIPT KONTROLÜ:"
echo "-------------------------------"
if [ -f "scripts/prerender.js" ]; then
    echo "✅ prerender.js mevcut"
    echo "📊 Route sayısı: $(grep -c "'/" scripts/prerender.js)"
    echo "🌐 Base URL: $(grep "baseUrl.*=" scripts/prerender.js)"
else
    echo "❌ prerender.js BULUNAMADI!"
fi

# 10. INJECT-SEO SCRIPT KONTROLÜ
echo ""
echo "💉 10. INJECT-SEO SCRIPT KONTROLÜ:"
echo "---------------------------------"
if [ -f "scripts/inject-seo.js" ]; then
    echo "✅ inject-seo.js mevcut"
    grep "title\|description\|canonical" scripts/inject-seo.js | head -5
else
    echo "❌ inject-seo.js BULUNAMADI!"
fi

# 11. NETWORK TEST
echo ""
echo "🌐 11. NETWORK TEST:"
echo "------------------"
echo "🔍 Canlı site kontrolü: https://www.gatetransfer.com"
curl -s -I https://www.gatetransfer.com | head -5

# 12. GOOGLE INDEXING TEST
echo ""
echo "🔍 12. GOOGLE INDEXING TEST:"
echo "---------------------------"
echo "📊 Google'da indexed sayfa sayısı:"
echo "site:gatetransfer.com komutu ile kontrol et"

echo ""
echo "✅ SEO AUDIT TAMAMLANDI!"
echo "========================"
echo ""
echo "🚨 BULDUĞUM SORUNLAR VE ÇÖZÜMLERİ:"
echo "1. Eksik meta tag'ler varsa düzeltilecek"
echo "2. Static HTML'ler eksikse yeniden oluşturulacak"
echo "3. Canonical URL'ler kontrol edilecek"
echo "4. Sitemap güncellenecek"
echo "5. Robot.txt optimize edilecek"
