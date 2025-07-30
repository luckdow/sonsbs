#!/bin/bash

# Advanced Static Site Generation Script
echo "🚀 Starting FULL static page generation with content injection..."

# Ana sayfalar
PAGES=(
  "/"
  "/rezervasyon" 
  "/hakkimizda"
  "/iletisim"
  "/hizmetlerimiz"
  "/kemer-transfer"
  "/side-transfer"
  "/belek-transfer"
  "/alanya-transfer"
  "/antalya-transfer"
  "/kas-transfer"
  "/kalkan-transfer"
  "/lara-transfer"
  "/manavgat-transfer"
  "/serik-transfer"
)

# Her sayfa için özel SEO içerik oluştur
inject_seo_content() {
  local page=$1
  local file_path=$2
  
  case $page in
    "/kemer-transfer")
      sed -i 's/<title>.*<\/title>/<title>Kemer Transfer - Antalya Havalimanı Kemer Transfer Hizmeti | SBS Turkey<\/title>/' "$file_path"
      sed -i 's/<meta name="description" content="[^"]*"/<meta name="description" content="Kemer transfer hizmeti. Antalya havalimanından Kemer'e güvenli ve konforlu transfer. 7\/24 profesyonel şoför hizmeti. Hemen rezervasyon yapın!"/' "$file_path"
      sed -i 's/<h1>[^<]*<\/h1>/<h1>Kemer Transfer - Antalya Havalimanı Transfer Hizmeti<\/h1>/' "$file_path"
      ;;
    "/side-transfer")
      sed -i 's/<title>.*<\/title>/<title>Side Transfer - Antalya Havalimanı Side Transfer Hizmeti | SBS Turkey<\/title>/' "$file_path"
      sed -i 's/<meta name="description" content="[^"]*"/<meta name="description" content="Side transfer hizmeti. Antalya havalimanından Side'\''ye güvenli transfer. Antik Side turu ve otel transferi. 7\/24 hizmet!"/' "$file_path"
      sed -i 's/<h1>[^<]*<\/h1>/<h1>Side Transfer - Antalya Havalimanı Transfer Hizmeti<\/h1>/' "$file_path"
      ;;
    "/belek-transfer")
      sed -i 's/<title>.*<\/title>/<title>Belek Transfer - Antalya Havalimanı Belek Golf Transfer | SBS Turkey<\/title>/' "$file_path"
      sed -i 's/<meta name="description" content="[^"]*"/<meta name="description" content="Belek transfer hizmeti. Golf otelleri ve lüks tatil köyleri transferi. Antalya havalimanından Belek'\''e VIP transfer hizmeti."/' "$file_path"
      sed -i 's/<h1>[^<]*<\/h1>/<h1>Belek Transfer - Golf Otelleri Transfer Hizmeti<\/h1>/' "$file_path"
      ;;
    "/alanya-transfer")
      sed -i 's/<title>.*<\/title>/<title>Alanya Transfer - Antalya Havalimanı Alanya Transfer | SBS Turkey<\/title>/' "$file_path"
      sed -i 's/<meta name="description" content="[^"]*"/<meta name="description" content="Alanya transfer hizmeti. Antalya havalimanından Alanya'\''ya konforlu transfer. Kleopatra plajı ve Alanya kalesi turu dahil!"/' "$file_path"
      sed -i 's/<h1>[^<]*<\/h1>/<h1>Alanya Transfer - Antalya Havalimanı Transfer<\/h1>/' "$file_path"
      ;;
    "/antalya-transfer")
      sed -i 's/<title>.*<\/title>/<title>Antalya Transfer - Antalya Havalimanı Şehir Merkezi Transfer | SBS Turkey<\/title>/' "$file_path"
      sed -i 's/<meta name="description" content="[^"]*"/<meta name="description" content="Antalya şehir merkezi transfer hizmeti. Havalimanından Kaleiçi, Lara, Konyaaltı transfer. 7\/24 güvenli ulaşım!"/' "$file_path"
      sed -i 's/<h1>[^<]*<\/h1>/<h1>Antalya Transfer - Şehir Merkezi Transfer Hizmeti<\/h1>/' "$file_path"
      ;;
    *)
      echo "📝 Using default SEO content for $page"
      ;;
  esac
}

# Her sayfa için static HTML oluştur
for page in "${PAGES[@]}"; do
  echo "📄 Generating optimized page: $page"
  
  # Create directory if needed
  if [ "$page" != "/" ]; then
    mkdir -p "dist$(dirname "$page")"
    if [ "$(basename "$page")" != "index.html" ]; then
      mkdir -p "dist$page"
    fi
  fi
  
  # Copy and optimize index.html for each route
  if [ "$page" = "/" ]; then
    echo "✅ Homepage already optimized"
  else
    # Copy to directory structure
    cp dist/index.html "dist$page/index.html" 2>/dev/null || true
    inject_seo_content "$page" "dist$page/index.html"
    
    # Copy as direct file too
    if [ "$(basename "$page")" != "index.html" ]; then
      cp dist/index.html "dist$page.html" 2>/dev/null || true
      inject_seo_content "$page" "dist$page.html"
    fi
  fi
done

echo "✅ Static generation completed!"
echo "📊 Generated $(find dist -name "*.html" | wc -l) HTML files"
