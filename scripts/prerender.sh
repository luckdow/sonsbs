#!/bin/bash
# Prerender script for SBS Turkey Transfer

echo "🚀 SBS Turkey Transfer Prerender Script"
echo "========================================"

# Ana sayfalar için static HTML oluştur
pages=(
  "/"
  "/rezervasyon"
  "/kemer-transfer"
  "/side-transfer"
  "/belek-transfer"
  "/alanya-transfer"
  "/hakkimizda"
  "/iletisim"
)

echo "📝 Generating static HTML for SEO..."

for page in "${pages[@]}"; do
  echo "Generating: $page"
  
  # Her sayfa için minimal HTML oluştur
  filename="public/prerender${page}.html"
  
  if [ "$page" = "/" ]; then
    filename="public/prerender-home.html"
  else
    mkdir -p "public/prerender$(dirname "$page")"
    filename="public/prerender${page}.html"
  fi
  
  cat > "$filename" << EOF
<!doctype html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SBS Turkey Transfer - Prerendered Page</title>
    <meta name="description" content="SBS Turkey Transfer prerendered page for better SEO">
    <link rel="canonical" href="https://www.gatetransfer.com$page">
</head>
<body>
    <h1>SBS Turkey Transfer</h1>
    <h2>$page sayfası yükleniyor...</h2>
    <p>Bu sayfa SEO optimizasyonu için önceden render edilmiştir.</p>
    <p>Ana siteye yönlendiriliyorsunuz...</p>
    
    <script>
        // Ana siteye yönlendir
        setTimeout(() => {
            window.location.href = "https://www.gatetransfer.com$page";
        }, 1000);
    </script>
</body>
</html>
EOF

done

echo "✅ Prerender pages generated successfully!"
echo "📊 Generated files:"
ls -la public/prerender*

echo ""
echo "🔍 Next steps:"
echo "1. Deploy these files to production"
echo "2. Test Google Search Console crawling"
echo "3. Submit for indexing"
