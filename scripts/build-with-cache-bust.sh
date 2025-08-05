#!/bin/bash

# Build script with cache busting
echo "🚀 Starting build with cache busting..."

# 1. Build timestamp oluştur
BUILD_TIME=$(date +%s)
echo "Build timestamp: $BUILD_TIME"

# 2. Cache-bust.js dosyasını güncelle
sed -i "s/const CACHE_VERSION = [0-9]*;/const CACHE_VERSION = $BUILD_TIME;/" public/cache-bust.js

# 3. Service Worker'ı güncelle
sed -i "s/const CACHE_VERSION = [0-9]*;/const CACHE_VERSION = $BUILD_TIME;/" public/sw.js

# 4. Package.json'dan version al
VERSION=$(node -p "require('./package.json').version")
echo "App version: $VERSION"

# 5. Index.html'e meta tag ekle (build info)
sed -i "s/<title>/<meta name=\"build-time\" content=\"$BUILD_TIME\"><meta name=\"app-version\" content=\"$VERSION\"><title>/" index.html

# 6. NPX ile Vite build
echo "🔨 Building with Vite..."
npx vite build

# 7. Build sonrası cleanup (sadece takip edilen dosyalar varsa)
echo "🧹 Cleaning up..."
if git ls-files --error-unmatch public/cache-bust.js >/dev/null 2>&1; then
    git checkout public/cache-bust.js
fi
if git ls-files --error-unmatch public/sw.js >/dev/null 2>&1; then
    git checkout public/sw.js  
fi
if git ls-files --error-unmatch index.html >/dev/null 2>&1; then
    git checkout index.html
fi

echo "✅ Build completed with cache busting!"
echo "Build time: $BUILD_TIME"
echo "Version: $VERSION"
