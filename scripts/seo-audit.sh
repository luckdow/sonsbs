#!/bin/bash
# SBS SEO & Indexing Complete Audit Script
# TÜM SAYFALAR İÇİN KATI SEO DENETİMİ

SITE="https://www.gatetransfer.com"
SITEMAP="$SITE/sitemap.xml"
TMPDIR="/tmp/seo-audit"
mkdir -p "$TMPDIR"

# Hata sayacı
ERROR_COUNT=0
WARNING_COUNT=0

# Taranacak sayfalar listesi - REZERVASYON HARİÇ TÜM SAYFALAR
PAGES=(
  "$SITE/"
  "$SITE/hakkimizda"
  "$SITE/iletisim"
  "$SITE/hizmetlerimiz"
  # Şehir transfer sayfaları
  "$SITE/kemer-transfer"
  "$SITE/side-transfer"
  "$SITE/belek-transfer"
  "$SITE/alanya-transfer"
  "$SITE/antalya-transfer"
  "$SITE/lara-transfer"
  "$SITE/kas-transfer"
  "$SITE/kalkan-transfer"
  "$SITE/manavgat-transfer"
  "$SITE/serik-transfer"
  # Hizmet sayfaları
  "$SITE/hizmetler/vip-transfer"
  "$SITE/hizmetler/grup-transfer"
  "$SITE/hizmetler/kurumsal-transfer"
  "$SITE/hizmetler/havalimanı-transfer"
  "$SITE/hizmetler/hotel-transfer"
  "$SITE/hizmetler/sehir-turu"
  "$SITE/hizmetler/gunluk-transfer"
  "$SITE/hizmetler/ozel-transfer"
  "$SITE/hizmetler/wedding-transfer"
  "$SITE/hizmetler/business-transfer"
  # Blog ve static sayfalar
  "$SITE/blog"
  "$SITE/sss"
  "$SITE/kullanim-sartlari"
  "$SITE/gizlilik-politikasi"
  "$SITE/cerez-politikasi"
  "$SITE/iade-iptal"
  "$SITE/kvkk"
)

function check_url {
  local url="$1"
  local name="$2"
  local html="$TMPDIR/$(echo "$url" | sed 's/[^a-zA-Z0-9]/_/g').html"
  
  echo "========================================"
  echo "🔍 TARANILIYOR: $name"
  echo "URL: $url"
  echo "========================================"
  
  # Sayfa içeriğini indir
  curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "$url" -o "$html" --max-time 10
  
  # HTTP status
  local code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
  
  # SEO elementleri çıkar
  local title=$(grep -i '<title>' "$html" | head -1 | sed 's/<[^>]*>//g' | xargs)
  local desc=$(grep -i 'meta name="description"' "$html" | head -1 | sed 's/.*content="\([^"]*\)".*/\1/' | xargs)
  local canonical=$(grep -i 'rel="canonical"' "$html" | head -1 | sed 's/.*href="\([^"]*\)".*/\1/' | xargs)
  local robots=$(grep -i 'meta name="robots"' "$html" | head -1 | sed 's/.*content="\([^"]*\)".*/\1/' | xargs)
  local h1=$(grep -i '<h1>' "$html" | head -1 | sed 's/<[^>]*>//g' | xargs)
  local h2_count=$(grep -c '<h2>' "$html")
  local meta_robots_count=$(grep -c 'meta name="robots"' "$html")
  local canonical_count=$(grep -c 'rel="canonical"' "$html")

  
  # Sonuçları göster
  echo "📊 BULUNAN DEĞERLERİ:"
  echo "HTTP Status: $code"
  echo "Title: $title"
  echo "Description: $desc"
  echo "Canonical: $canonical"
  echo "Robots: $robots"
  echo "H1: $h1"
  echo "H2 sayısı: $h2_count"
  
  echo ""
  echo "🚨 HATA ANALİZİ:"
  
  # KRİTİK HATALAR
  if [[ "$code" != "200" ]]; then 
    echo "[❌ CRITICAL] HTTP Status $code - Sayfa erişilemiyor!"
    ((ERROR_COUNT++))
  fi
  
  if [[ -z "$title" ]]; then 
    echo "[❌ CRITICAL] Title tag eksik!"
    ((ERROR_COUNT++))
  elif [[ ${#title} -lt 30 ]]; then
    echo "[⚠️  WARNING] Title çok kısa (${#title} karakter)"
    ((WARNING_COUNT++))
  elif [[ ${#title} -gt 60 ]]; then
    echo "[⚠️  WARNING] Title çok uzun (${#title} karakter)"
    ((WARNING_COUNT++))
  fi
  
  if [[ -z "$desc" ]]; then 
    echo "[❌ CRITICAL] Meta description eksik!"
    ((ERROR_COUNT++))
  elif [[ ${#desc} -lt 120 ]]; then
    echo "[⚠️  WARNING] Description çok kısa (${#desc} karakter)"
    ((WARNING_COUNT++))
  elif [[ ${#desc} -gt 160 ]]; then
    echo "[⚠️  WARNING] Description çok uzun (${#desc} karakter)"
    ((WARNING_COUNT++))
  fi
  
  if [[ -z "$canonical" ]]; then 
    echo "[❌ CRITICAL] Canonical URL eksik!"
    ((ERROR_COUNT++))
  elif [[ "$canonical" == "$SITE/" && "$url" != "$SITE/" ]]; then 
    echo "[❌ CRITICAL] Canonical ana sayfaya işaret ediyor! (Duplicate content sorunu)"
    ((ERROR_COUNT++))
  fi
  
  if [[ -z "$h1" ]]; then 
    echo "[❌ CRITICAL] H1 tag eksik!"
    ((ERROR_COUNT++))
  fi
  
  if [[ "$robots" != *"index"* ]]; then 
    echo "[❌ CRITICAL] Robots meta 'index' içermiyor!"
    ((ERROR_COUNT++))
  fi
  
  # DUPLICATE CONTENT KONTROL
  if [[ "$desc" == "Antalya havalimanı transfer hizmeti. Güvenli, konforlu ve ekonomik. 7/24 profesyonel hizmet. Hemen rezervasyon!" && "$url" != "$SITE/" ]]; then 
    echo "[❌ CRITICAL] Meta description duplicate (ana sayfa ile aynı)!"
    ((ERROR_COUNT++))
  fi
  
  # MULTIPLE ROBOTS META
  if [[ "$meta_robots_count" -gt 1 ]]; then
    echo "[⚠️  WARNING] Birden fazla robots meta tag ($meta_robots_count adet)"
    ((WARNING_COUNT++))
  fi
  
  # MULTIPLE CANONICAL
  if [[ "$canonical_count" -gt 1 ]]; then
    echo "[❌ CRITICAL] Birden fazla canonical tag ($canonical_count adet)"
    ((ERROR_COUNT++))
  fi
  
  # H2 KONTROL
  if [[ "$h2_count" -eq 0 && "$url" != "$SITE/sss" && "$url" != "$SITE/iletisim" ]]; then
    echo "[⚠️  WARNING] H2 tag bulunamadı (içerik yapısı zayıf)"
    ((WARNING_COUNT++))
  fi
  
  # TITLE-H1 UYUM
  if [[ "$title" == "$h1" ]]; then 
    echo "[⚠️  WARNING] Title ve H1 tamamen aynı (çeşitlilik eklenebilir)"
    ((WARNING_COUNT++))
  fi
  
  echo "----------------------------------------"
  echo ""
}

# Ana denetim başlat
echo "🚀 SBS TURKEY TRANSFER - KAPSAMLI SEO DENETİMİ"
echo "Tarih: $(date)"
echo "Taranacak sayfa sayısı: ${#PAGES[@]}"
echo ""

for page in "${PAGES[@]}"; do
  name=$(echo "$page" | sed 's|https://www.gatetransfer.com/||' | sed 's|^$|Ana Sayfa|')
  check_url "$page" "$name"
done

# Sitemap kontrolü
echo "========================================"
echo "🗺️  SİTEMAP KONTROLÜ"
echo "========================================"

sitemap_urls=$(curl -s "$SITEMAP" | grep -o '<loc>[^<]*</loc>' | sed 's/<\/?loc>//g' | wc -l)
echo "Sitemap'te toplam URL: $sitemap_urls"

# 404 kontrol
echo ""
echo "🔍 404 KONTROL - Sitemap URL'leri test ediliyor..."
curl -s "$SITEMAP" | grep -o '<loc>[^<]*</loc>' | sed 's/<\/?loc>//g' | while read sitemap_url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$sitemap_url" --max-time 5)
  if [[ "$status" != "200" ]]; then
    echo "[❌ CRITICAL] $sitemap_url - HTTP $status"
  fi
done

# Özet rapor
echo ""
echo "========================================"
echo "📈 DENETİM ÖZETİ"
echo "========================================"
echo "Toplam hata: $ERROR_COUNT"
echo "Toplam uyarı: $WARNING_COUNT"
echo ""

if [[ $ERROR_COUNT -eq 0 ]]; then
  echo "🎉 Kritik hata bulunamadı!"
else
  echo "⚠️  $ERROR_COUNT kritik hata bulundu ve acilen düzeltilmeli!"
fi

if [[ $WARNING_COUNT -eq 0 ]]; then
  echo "✨ Uyarı bulunamadı!"
else
  echo "💡 $WARNING_COUNT uyarı bulundu, iyileştirilebilir."
fi

echo ""
echo "SEO denetimi tamamlandı!"
echo "========================================"
