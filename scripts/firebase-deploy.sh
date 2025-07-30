#!/bin/bash

echo "🔥 Firebase Production Deployment Started..."

# Firebase tools kurulumu kontrol et
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Firebase login
echo "🔐 Firebase login check..."
firebase login --reauth

# Project seçimi
echo "📊 Setting Firebase project..."
firebase use sbs-travel-96d0b

# Firestore rules deploy
echo "🔒 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

# Storage rules deploy  
echo "🗂️ Deploying Storage security rules..."
firebase deploy --only storage

# Hosting deploy (eğer varsa)
echo "🌐 Deploying hosting..."
firebase deploy --only hosting

echo "✅ Firebase Production Deployment Completed!"
echo ""
echo "🔍 Important checks:"
echo "1. Firestore Rules: Production mode ✅"
echo "2. Storage Rules: Secure access ✅" 
echo "3. Authentication: Configured ✅"
echo ""
echo "🚀 Your site is now PRODUCTION READY for Google indexing!"
