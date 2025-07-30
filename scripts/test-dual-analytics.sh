#!/bin/bash

# Dual Google Analytics Test Script
# SBS Turkey Transfer - Multiple GA Account Verification

echo "📊 Dual Google Analytics Test"
echo "============================="

# Check for dual GA IDs in codebase
echo "🔍 Checking GA configuration..."

# Primary GA ID
primary_count=$(grep -r "G-EQB0RS3034" --include="*.html" --include="*.js" --include="*.jsx" . | wc -l)
echo "📈 Primary GA (G-EQB0RS3034): $primary_count references found"

# Secondary GA ID  
secondary_count=$(grep -r "G-EV2DQW5LD9" --include="*.html" --include="*.js" --include="*.jsx" . | wc -l)
echo "📈 Secondary GA (G-EV2DQW5LD9): $secondary_count references found"

# Check index.html for dual scripts
echo ""
echo "🔍 Checking index.html for dual tracking..."
if grep -q "G-EQB0RS3034" index.html && grep -q "G-EV2DQW5LD9" index.html; then
    echo "✅ Both GA scripts found in index.html"
else
    echo "❌ Missing GA scripts in index.html"
fi

# Check config file
echo ""
echo "🔍 Checking googleSeoConfig.js..."
if grep -q "GA_MEASUREMENT_ID_SECONDARY" src/config/googleSeoConfig.js; then
    echo "✅ Secondary GA config found"
else
    echo "❌ Secondary GA config missing"
fi

echo ""
echo "🌐 Testing URLs:"
echo "1. Primary GA Property: https://analytics.google.com/analytics/web/#/p[YOUR_PROPERTY_ID_1]"
echo "2. Secondary GA Property: https://analytics.google.com/analytics/web/#/p[YOUR_PROPERTY_ID_2]"
echo ""
echo "📊 Expected results after deployment:"
echo "- Both GA properties will receive data"
echo "- Real-time reports will show traffic in both accounts"
echo "- Event tracking will work for both properties"
echo ""
echo "🔍 Verification steps:"
echo "1. Visit your website"
echo "2. Check both GA real-time reports"
echo "3. Both should show 1 active user"
echo "4. Network tab should show both gtag.js loads"
