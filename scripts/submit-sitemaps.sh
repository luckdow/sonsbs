#!/bin/bash

# Google Search Console Sitemap Submission Script
# Bu script, sitemap'leri Google'a manuel olarak gönderir

echo "🚀 Google'a Sitemap Gönderimi Başlıyor..."

# Ana sitemap URL'leri
SITEMAPS=(
    "https://www.gatetransfer.com/sitemap.xml"
    "https://www.gatetransfer.com/sitemap-index.xml" 
    "https://www.gatetransfer.com/sitemap-multilingual.xml"
)

# Her sitemap için ping gönder
for sitemap in "${SITEMAPS[@]}"
do
    echo "📤 Gönderiliyor: $sitemap"
    
    # Google'a ping at
    curl -s "https://www.google.com/ping?sitemap=$sitemap" > /dev/null
    
    # Bing'e de gönder
    curl -s "https://www.bing.com/ping?sitemap=$sitemap" > /dev/null
    
    echo "✅ Gönderildi: $sitemap"
    sleep 2
done

echo ""
echo "🎯 Manuel URL Submission için Google Search Console'a gidin:"
echo "https://search.google.com/search-console"
echo ""
echo "📋 Request Indexing yapılacak URL'ler:"
echo "- https://www.gatetransfer.com/"
echo "- https://www.gatetransfer.com/hakkimizda"
echo "- https://www.gatetransfer.com/iletisim"
echo "- https://www.gatetransfer.com/hizmetlerimiz"
echo "- https://www.gatetransfer.com/blog"
echo ""
echo "✨ Tamamlandı! Sitemap'ler gönderildi."
