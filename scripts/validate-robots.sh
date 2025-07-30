#!/bin/bash

# Robots.txt Validation Script
# SBS Turkey Transfer - Robots.txt Testing & Validation

echo "🤖 Robots.txt Validation Script"
echo "==============================="

# Local robots.txt test
echo "📋 Local robots.txt testing..."
if [ -f "public/robots.txt" ]; then
    echo "✅ robots.txt file exists"
    
    # Check for duplicate User-agent declarations
    echo "🔍 Checking for duplicate User-agent declarations..."
    duplicate_count=$(grep -c "^User-agent: \*" public/robots.txt)
    if [ $duplicate_count -gt 1 ]; then
        echo "❌ ERROR: Multiple 'User-agent: *' declarations found ($duplicate_count)"
        echo "   This will cause Google to ignore rules!"
    else
        echo "✅ Single 'User-agent: *' declaration - GOOD"
    fi
    
    # Check for conflicting Allow/Disallow rules
    echo "🔍 Checking for conflicting rules..."
    if grep -q "Allow: /" public/robots.txt && grep -q "Disallow: /" public/robots.txt; then
        echo "⚠️  WARNING: Both Allow: / and Disallow: / found - review rules"
    else
        echo "✅ No conflicting Allow/Disallow rules"
    fi
    
    # Check for required sitemaps
    echo "🔍 Checking sitemap declarations..."
    if grep -q "Sitemap:" public/robots.txt; then
        echo "✅ Sitemap declarations found"
        grep "Sitemap:" public/robots.txt
    else
        echo "❌ ERROR: No sitemap declarations found"
    fi
    
    # Check for Host directive
    echo "🔍 Checking Host directive..."
    if grep -q "Host:" public/robots.txt; then
        echo "✅ Host directive found"
        grep "Host:" public/robots.txt
    else
        echo "⚠️  WARNING: No Host directive found"
    fi
    
else
    echo "❌ ERROR: robots.txt file not found!"
fi

echo ""
echo "🌐 Online validation recommendations:"
echo "1. Test with Google Search Console: https://search.google.com/search-console/robots-txt-tester"
echo "2. Test with robots.txt tester: https://www.google.com/webmasters/tools/robots-testing-tool"
echo "3. Validate sitemap access: https://www.gatetransfer.com/robots.txt"
echo ""
echo "📊 Expected results after fix:"
echo "- ✅ No more 'rule ignored by Googlebot' warnings"
echo "- ✅ Better crawl efficiency"
echo "- ✅ Improved Search Console coverage"
