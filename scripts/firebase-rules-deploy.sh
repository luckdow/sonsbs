#!/bin/bash

# Firebase Rules Deploy Script
# SBS Turkey Transfer - Firebase Rules Deployment

echo "🔥 Firebase Rules Deploy Script"
echo "================================"

# Firebase projesi kontrol
echo "📋 Firebase projesini kontrol ediliyor..."
firebase use sbs-travel-96d0b

# Firestore rules deploy
echo "🔐 Firestore rules deploy ediliyor..."
firebase deploy --only firestore:rules

# Storage rules deploy (varsa)
if [ -f "storage.rules" ]; then
    echo "📁 Storage rules deploy ediliyor..."
    firebase deploy --only storage
fi

# Sonuç
echo "✅ Firebase rules başarıyla deploy edildi!"
echo "🌐 Proje: sbs-travel-96d0b"
echo "📱 URL: https://console.firebase.google.com/project/sbs-travel-96d0b"

echo ""
echo "🔍 Kontrol edilecek alanlar:"
echo "1. Firebase Console → Firestore → Rules"
echo "2. Firebase Console → Authentication → Settings"
echo "3. Google Search Console → Coverage → Valid pages"
echo ""
echo "⚠️  Değişikliklerin etkili olması 5-10 dakika sürebilir."
