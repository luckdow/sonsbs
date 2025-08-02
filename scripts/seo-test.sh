#!/bin/bash

# SEO ve Google Bot Erişim Testi
# Bu script SEO problemleri ve Google Bot erişim sorunlarını kontrol eder

echo "🧪 GATE Transfer SEO Durum Testi"
echo "=================================="
echo "Tarih: $(date)"
echo ""

# Çıktı renklerini tanımla
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Kontrol fonksiyonu
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: $1"
  else
    echo -e "${RED}✗ HATA${NC}: $1"
  fi
}

warning() {
  echo -e "${YELLOW}⚠️ UYARI${NC}: $1"
}

info() {
  echo -e "${BLUE}ℹ️ BİLGİ${NC}: $1"
}

# 1. robots.txt kontrolü
echo "📋 robots.txt Kontrolü:"
echo "----------------------"

if [ -f public/robots.txt ]; then
  info "robots.txt mevcut."
  
  # Host direktifi kontrolü
  if grep -q "Host:" public/robots.txt; then
    if grep -q "Host: https://www.gatetransfer.com" public/robots.txt; then
      echo -e "${GREEN}✓ BAŞARILI${NC}: Host direktifi doğru: www.gatetransfer.com"
    else
      echo -e "${RED}✗ HATA${NC}: Host direktifi yanlış domain içeriyor!"
      grep "Host:" public/robots.txt
    fi
  else
    warning "robots.txt içinde Host direktifi bulunamadı!"
  fi
  
  # Sitemap direktifi kontrolü
  if grep -q "Sitemap:" public/robots.txt; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: Sitemap direktifi mevcut."
  else
    warning "robots.txt içinde Sitemap direktifi bulunamadı!"
  fi
else
  echo -e "${RED}✗ HATA${NC}: robots.txt bulunamadı!"
fi

echo ""

# 2. Sitemap kontrolü
echo "📋 Sitemap Kontrolü:"
echo "-------------------"

if [ -f public/sitemap.xml ]; then
  info "sitemap.xml mevcut."
  
  # Sitemap URL kontrolü
  if grep -q "https://gatetransfer.com" public/sitemap.xml; then
    echo -e "${RED}✗ HATA${NC}: sitemap.xml içinde 'www' olmayan URL'ler var!"
    grep -n "https://gatetransfer.com" public/sitemap.xml | head -3
    echo "... ve daha fazlası"
  elif grep -q "https://www.gatetransfer.com" public/sitemap.xml; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: sitemap.xml içinde URL'ler 'www' ile başlıyor."
  else
    warning "sitemap.xml içinde site URL'si bulunamadı!"
  fi
  
  # Geçerli XML kontrolü
  if xmllint --noout public/sitemap.xml 2>/dev/null; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: sitemap.xml geçerli bir XML dosyası."
  else
    echo -e "${RED}✗ HATA${NC}: sitemap.xml geçerli bir XML formatında değil!"
  fi
else
  echo -e "${RED}✗ HATA${NC}: sitemap.xml bulunamadı!"
fi

if [ -f public/sitemap-multilingual.xml ]; then
  info "sitemap-multilingual.xml mevcut."
  
  # hreflang kontrolü
  if grep -q "hreflang" public/sitemap-multilingual.xml; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: sitemap-multilingual.xml içinde hreflang etiketleri var."
  else
    echo -e "${RED}✗ HATA${NC}: sitemap-multilingual.xml içinde hreflang etiketleri yok!"
  fi
else
  warning "sitemap-multilingual.xml bulunamadı!"
fi

echo ""

# 3. index.html kontrolü
echo "📋 index.html Kontrolü:"
echo "----------------------"

if [ -f index.html ]; then
  # Canonical tag kontrolü
  CANONICAL_COUNT=$(grep -c "<link rel=\"canonical\"" index.html)
  if [ "$CANONICAL_COUNT" -eq 1 ]; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: index.html içinde tam 1 canonical tag var."
  elif [ "$CANONICAL_COUNT" -gt 1 ]; then
    echo -e "${RED}✗ HATA${NC}: index.html içinde birden fazla canonical tag var! ($CANONICAL_COUNT adet)"
  else
    warning "index.html içinde canonical tag bulunamadı!"
  fi
  
  # Fragment meta kontrolü
  if grep -q "fragment" index.html; then
    echo -e "${RED}✗ HATA${NC}: index.html içinde eski fragment meta tag var!"
    grep -n "fragment" index.html
  else
    echo -e "${GREEN}✓ BAŞARILI${NC}: index.html içinde fragment meta tag yok."
  fi
  
  # Bot detection kontrolü
  if grep -q "bot.*crawler.*spider" index.html; then
    warning "index.html içinde bot detection kodu var. Google Bot'un erişimini engelleyebilir!"
    grep -n -A 2 "bot.*crawler.*spider" index.html
  else
    echo -e "${GREEN}✓ BAŞARILI${NC}: index.html içinde bot detection kodu yok."
  fi
else
  echo -e "${RED}✗ HATA${NC}: index.html bulunamadı!"
fi

echo ""

# 4. SEO bileşenleri kontrolü
echo "📋 SEO Bileşenleri Kontrolü:"
echo "---------------------------"

# Unified SEO bileşeni kontrolü
if [ -f src/components/SEO/UnifiedSEO.jsx ]; then
  echo -e "${GREEN}✓ BAŞARILI${NC}: UnifiedSEO.jsx mevcut."
else
  echo -e "${RED}✗ HATA${NC}: UnifiedSEO.jsx bulunamadı!"
fi

# Çakışan SEO bileşenleri kontrolü
SEO_COMPONENT_COUNT=$(find src/components/SEO/ -name "*.jsx" | wc -l)

if [ "$SEO_COMPONENT_COUNT" -gt 5 ]; then
  warning "Çok fazla SEO bileşeni var ($SEO_COMPONENT_COUNT adet). Tek bir birleştirilmiş bileşen kullanmanız önerilir."
  find src/components/SEO/ -name "*.jsx" | sort
else
  echo -e "${GREEN}✓ BAŞARILI${NC}: SEO bileşeni sayısı normal ($SEO_COMPONENT_COUNT adet)."
fi

echo ""

# 5. vercel.json yönlendirme kontrolü
echo "📋 Vercel Yönlendirme Kontrolü:"
echo "------------------------------"

if [ -f vercel.json ]; then
  # www yönlendirmesi kontrolü
  if grep -q "\"source\": \"https://gatetransfer.com\"" vercel.json && grep -q "\"destination\": \"https://www.gatetransfer.com\"" vercel.json; then
    echo -e "${GREEN}✓ BAŞARILI${NC}: vercel.json içinde www olmayan → www olan yönlendirme mevcut."
  else
    echo -e "${RED}✗ HATA${NC}: vercel.json içinde www olmayan → www olan yönlendirme yok!"
  fi
  
  # SPA rewrites kontrolü
  if grep -q "\"rewrites\":" vercel.json; then
    REWRITE_COUNT=$(grep -c "\"destination\".*index.html" vercel.json)
    if [ "$REWRITE_COUNT" -gt 10 ]; then
      echo -e "${GREEN}✓ BAŞARILI${NC}: vercel.json içinde birçok sayfa için rewrite kuralı var ($REWRITE_COUNT adet)."
    else
      warning "vercel.json içinde az sayıda rewrite kuralı var ($REWRITE_COUNT adet). Tüm sayfaları kapsadığından emin olun."
    fi
  else
    echo -e "${RED}✗ HATA${NC}: vercel.json içinde rewrites bölümü yok!"
  fi
else
  echo -e "${RED}✗ HATA${NC}: vercel.json bulunamadı!"
fi

echo ""

# 6. Google Bot simülasyonu
echo "📋 Google Bot Simülasyonu:"
echo "-------------------------"

echo "Bu test gerçek bir web sunucusunda çalıştırılmalıdır."
echo "Aşağıdaki komutları canlı ortamda çalıştırın:"
echo ""
echo "curl -A \"Googlebot\" https://www.gatetransfer.com/"
echo "curl -A \"Googlebot\" https://www.gatetransfer.com/kemer-transfer"

echo ""
echo "📊 TEST SONUÇLARI ÖZET"
echo "======================"
echo "Test tarihi: $(date)"
echo ""
echo "Kritik sorunları düzeltin ve Google Search Console'u kontrol edin."
echo "Değişiklikler yapıldıktan sonra bu testi tekrar çalıştırın."
echo ""
