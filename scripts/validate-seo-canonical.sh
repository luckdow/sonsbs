#!/bin/bash

# SEO Canonical & Semantic Structure Validation Script
# SBS Turkey Transfer - SEO Issues Fix Testing

echo "🎯 SEO Canonical & Semantic Structure Validator"
echo "=============================================="

# 1. Canonical URL Check
echo "🔍 Canonical URL Testing..."
if grep -q '<link rel="canonical"' index.html; then
    canonical_url=$(grep -o 'href="[^"]*"' index.html | grep canonical -A1 | head -1 | sed 's/href="//g' | sed 's/"//g')
    echo "✅ Canonical URL found: $canonical_url"
    
    # Check for duplicate canonical
    canonical_count=$(grep -c 'rel="canonical"' index.html)
    if [ $canonical_count -gt 1 ]; then
        echo "❌ WARNING: Multiple canonical URLs found ($canonical_count)"
    else
        echo "✅ Single canonical URL - GOOD"
    fi
    
    # Check canonical position (should be in <head>)
    head_line=$(grep -n '</head>' index.html | cut -d: -f1)
    canonical_line=$(grep -n 'rel="canonical"' index.html | cut -d: -f1)
    if [ $canonical_line -lt $head_line ]; then
        echo "✅ Canonical URL in <head> section - GOOD"
    else
        echo "❌ WARNING: Canonical URL outside <head> section"
    fi
else
    echo "❌ ERROR: No canonical URL found!"
fi

# 2. WWW/Non-WWW Redirect Check
echo ""
echo "🔍 WWW Redirect Testing..."
if grep -q 'gatetransfer.com' vercel.json; then
    echo "✅ WWW redirect configuration found in vercel.json"
    if grep -q 'www.gatetransfer.com' vercel.json; then
        echo "✅ Redirecting to www subdomain - GOOD"
    else
        echo "⚠️  WARNING: Check redirect destination"
    fi
else
    echo "❌ ERROR: No www redirect configuration found"
fi

# 3. Semantic HTML Structure Check
echo ""
echo "🔍 Semantic HTML Structure Testing..."
semantic_tags=("header" "main" "section" "article" "footer" "nav" "address")
semantic_score=0

for tag in "${semantic_tags[@]}"; do
    if grep -q "<$tag" index.html; then
        echo "✅ <$tag> tag found"
        ((semantic_score++))
    else
        echo "❌ <$tag> tag missing"
    fi
done

echo ""
echo "📊 Semantic Score: $semantic_score/7"
if [ $semantic_score -ge 5 ]; then
    echo "✅ Good semantic structure"
elif [ $semantic_score -ge 3 ]; then
    echo "⚠️  Moderate semantic structure"
else
    echo "❌ Poor semantic structure"
fi

# 4. Dual Google Analytics Check
echo ""
echo "🔍 Dual Google Analytics Testing..."
ga1_count=$(grep -c "G-EQB0RS3034" index.html)
ga2_count=$(grep -c "G-EV2DQW5LD9" index.html)

echo "📈 Primary GA (G-EQB0RS3034): $ga1_count references"
echo "📈 Secondary GA (G-EV2DQW5LD9): $ga2_count references"

if [ $ga1_count -ge 2 ] && [ $ga2_count -ge 2 ]; then
    echo "✅ Dual Google Analytics properly configured"
else
    echo "⚠️  WARNING: Check dual GA configuration"
fi

# 5. Meta Tags Check
echo ""
echo "🔍 Essential Meta Tags Testing..."
meta_tags=("charset" "viewport" "description" "og:title" "twitter:card")
meta_score=0

for tag in "${meta_tags[@]}"; do
    if grep -q "$tag" index.html; then
        echo "✅ $tag meta found"
        ((meta_score++))
    else
        echo "❌ $tag meta missing"
    fi
done

echo ""
echo "📊 Meta Tags Score: $meta_score/5"

# 6. Overall SEO Score
echo ""
echo "🎯 OVERALL SEO HEALTH CHECK:"
total_score=$((canonical_count == 1 ? 1 : 0))
total_score=$((total_score + (semantic_score >= 5 ? 1 : 0)))
total_score=$((total_score + (ga1_count >= 2 && ga2_count >= 2 ? 1 : 0)))
total_score=$((total_score + (meta_score >= 4 ? 1 : 0)))

echo "📊 Total Score: $total_score/4"
if [ $total_score -eq 4 ]; then
    echo "🎉 EXCELLENT: All SEO issues fixed!"
elif [ $total_score -ge 3 ]; then
    echo "✅ GOOD: Most SEO issues resolved"
elif [ $total_score -ge 2 ]; then
    echo "⚠️  MODERATE: Some SEO issues remain"
else
    echo "❌ POOR: Major SEO issues need attention"
fi

echo ""
echo "🌐 Expected Google Search Console Results:"
echo "- ✅ 'Valid canonical URL' status"
echo "- ✅ No more 'conflicting URLs' warnings"
echo "- ✅ Better semantic understanding"
echo "- ✅ Improved crawling efficiency"
