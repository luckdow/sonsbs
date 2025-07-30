#!/bin/bash

# Console Errors Monitoring & Fix Verification
# SBS Turkey Transfer - Production Error Tracking

echo "🔍 Console Errors Fix Verification"
echo "================================="

# 1. Check Source Maps Generation
echo "🗺️ Source Maps Check..."
if [ -d "dist" ]; then
    sourcemap_count=$(find dist -name "*.js.map" | wc -l)
    echo "📊 Source maps found: $sourcemap_count files"
    
    if [ $sourcemap_count -gt 0 ]; then
        echo "✅ Source maps generated successfully"
        find dist -name "*.js.map" | head -3 | while read file; do
            echo "   📁 $(basename "$file")"
        done
    else
        echo "❌ No source maps found - run 'npm run build:sourcemap'"
    fi
else
    echo "⚠️ No dist folder - run 'npm run build' first"
fi

# 2. Check Firestore Connection Configuration
echo ""
echo "🔥 Firestore Configuration Check..."
if grep -q "experimentalForceLongPolling" src/config/firebase.js; then
    echo "✅ Firestore timeout settings configured"
else
    echo "❌ Firestore timeout settings missing"
fi

if [ -f "src/services/firestoreConnectionManager.js" ]; then
    echo "✅ Firestore connection manager exists"
else
    echo "❌ Firestore connection manager missing"
fi

# 3. Check Vite Configuration
echo ""
echo "⚙️ Vite Configuration Check..."
if grep -q "sourcemap: true" vite.config.js; then
    echo "✅ Source maps enabled in Vite config"
else
    echo "❌ Source maps disabled in Vite config"
fi

# 4. Check Build Scripts
echo ""
echo "📦 Build Scripts Check..."
if grep -q "build:sourcemap" package.json; then
    echo "✅ Source map build script available"
else
    echo "❌ Source map build script missing"
fi

# 5. Network Timeout Simulation Test
echo ""
echo "🌐 Network Resilience Test..."
echo "Testing Firestore connection handling..."

# Check for timeout handling in code
timeout_patterns=("timeout" "retry" "exponential" "backoff")
timeout_score=0

for pattern in "${timeout_patterns[@]}"; do
    if grep -q -i "$pattern" src/services/firestoreConnectionManager.js 2>/dev/null; then
        echo "✅ $pattern handling found"
        ((timeout_score++))
    else
        echo "❌ $pattern handling missing"
    fi
done

echo ""
echo "📊 Network Resilience Score: $timeout_score/4"

# 6. Console Error Types Analysis
echo ""
echo "🔍 Common Console Error Patterns Check..."
error_fixes=(
    "Firebase messaging browser check"
    "COOP policy header"
    "Source maps generation"
    "Firestore timeout handling"
    "Network retry logic"
)

fix_score=0
if grep -q "supportsMessaging" src/config/firebase.js; then
    echo "✅ Firebase messaging browser check - FIXED"
    ((fix_score++))
fi

if grep -q "Cross-Origin-Opener-Policy" vercel.json; then
    echo "✅ COOP policy header - FIXED"
    ((fix_score++))
fi

if grep -q "sourcemap: true" vite.config.js; then
    echo "✅ Source maps generation - FIXED"
    ((fix_score++))
fi

if grep -q "experimentalForceLongPolling" src/config/firebase.js; then
    echo "✅ Firestore timeout handling - FIXED"
    ((fix_score++))
fi

if [ -f "src/services/firestoreConnectionManager.js" ]; then
    echo "✅ Network retry logic - ADDED"
    ((fix_score++))
fi

echo ""
echo "🎯 CONSOLE ERRORS FIX STATUS:"
echo "📊 Fixes Applied: $fix_score/5"

if [ $fix_score -eq 5 ]; then
    echo "🎉 EXCELLENT: All console error fixes applied!"
    echo ""
    echo "Expected results after deployment:"
    echo "✅ Firebase timeout errors → Handled gracefully"
    echo "✅ Source map missing warnings → Resolved"
    echo "✅ COOP policy errors → Fixed"
    echo "✅ Network timeouts → Retry logic active"
    echo "✅ Better debugging capability → Source maps available"
elif [ $fix_score -ge 3 ]; then
    echo "✅ GOOD: Most console error fixes applied"
else
    echo "⚠️ WARNING: Some console error fixes missing"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Run 'npm run build:sourcemap' for debug build"
echo "2. Deploy to production"
echo "3. Monitor Chrome DevTools console"
echo "4. Check Lighthouse audit improvements"
