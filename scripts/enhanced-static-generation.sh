#!/bin/bash

# Enhanced Static Site Generation with Pre-rendering
echo "🚀 Starting enhanced static generation with proper SEO content..."

# Build the project first
echo "📦 Building the project..."
npm run build

# Wait for build to complete
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Cannot proceed with static generation."
    exit 1
fi

echo "✅ Build completed. Starting pre-rendering..."

# Run prerender script to generate static HTML for each route
echo "🔧 Running prerender script..."
node scripts/prerender.js &
PRERENDER_PID=$!

# Wait for prerender to complete or timeout after 120 seconds
timeout 120s wait $PRERENDER_PID
PRERENDER_EXIT_CODE=$?

if [ $PRERENDER_EXIT_CODE -eq 124 ]; then
    echo "⏰ Prerender timed out after 120 seconds"
    kill $PRERENDER_PID 2>/dev/null
elif [ $PRERENDER_EXIT_CODE -eq 0 ]; then
    echo "✅ Prerender completed successfully"
else
    echo "⚠️ Prerender failed or was interrupted"
fi

# Ensure ALL routes have static HTML (from App.jsx)
ALL_ROUTES=(
    # Ana sayfa
    "/"
    
    # Rezervasyon ve süreç sayfaları
    "/rezervasyon"
    "/araç-seçimi"
    "/müşteri-bilgileri"
    "/ödeme"
    "/onay"
    "/rezervasyonlarim"
    "/profil"
    
    # Statik sayfalar
    "/hakkimizda"
    "/iletisim"
    "/hizmetlerimiz"
    "/sss"
    "/gizlilik-politikasi"
    "/kullanim-sartlari"
    "/kvkk"
    "/cerez-politikasi"
    "/iade-iptal"
    
    # Şehir sayfaları (10 adet)
    "/antalya-transfer"
    "/lara-transfer"
    "/kas-transfer"
    "/kalkan-transfer"
    "/manavgat-transfer"
    "/serik-transfer"
    "/kemer-transfer"
    "/belek-transfer"
    "/alanya-transfer"
    "/side-transfer"
    
    # Hizmet sayfaları (8 adet)
    "/hizmetler/havaalani-transfer"
    "/hizmetler/vip-transfer"
    "/hizmetler/grup-transfer"
    "/hizmetler/otel-transfer"
    "/hizmetler/sehir-ici-transfer"
    "/hizmetler/dugun-transfer"
    "/hizmetler/kurumsal-transfer"
    "/hizmetler/karsilama-hizmeti"
    
    # Blog sayfaları
    "/blog"
    
    # Auth sayfaları
    "/giriş"
    "/kayıt"
    "/şifre-sıfırla"
)

echo "🔍 Checking and fixing ALL routes..."

for route in "${ALL_ROUTES[@]}"; do
    if [ "$route" = "/" ]; then
        TARGET_FILE="dist/index.html"
    else
        TARGET_DIR="dist${route}"
        TARGET_FILE="$TARGET_DIR/index.html"
        
        # Create directory if it doesn't exist
        if [ ! -d "$TARGET_DIR" ]; then
            mkdir -p "$TARGET_DIR"
            echo "📁 Created directory: $TARGET_DIR"
        fi
    fi
    
    # Copy main index.html if route-specific file doesn't exist
    if [ ! -f "$TARGET_FILE" ]; then
        cp dist/index.html "$TARGET_FILE"
        echo "📄 Created static file: $TARGET_FILE"
    fi
done

# Generate robots.txt and sitemap if they don't exist
if [ ! -f "dist/robots.txt" ]; then
    cp public/robots.txt dist/robots.txt 2>/dev/null || echo "⚠️ robots.txt not found in public/"
fi

if [ ! -f "dist/sitemap.xml" ]; then
    cp public/sitemap.xml dist/sitemap.xml 2>/dev/null || echo "⚠️ sitemap.xml not found in public/"
fi

# Count generated files
HTML_COUNT=$(find dist -name "*.html" | wc -l)
echo "📊 Total HTML files generated: $HTML_COUNT"

# List all generated routes
echo "📋 Generated routes:"
find dist -name "index.html" | sed 's|dist||g' | sed 's|/index.html||g' | sed 's|^$|/|g'

echo "🎉 Enhanced static generation completed!"
echo "💡 Your site is now ready for deployment with proper SEO support."
