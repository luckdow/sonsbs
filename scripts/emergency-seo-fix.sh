#!/bin/bash

# Emergency SEO Fix - Make SEO content visible immediately
echo "🚨 Emergency SEO Fix - Making content visible to Google bots..."

# Build the project
npm run build

# Fix the main index.html to show SEO content by default
cd dist

# Replace hidden SEO content with visible content
sed -i 's/visibility: hidden; position: absolute; top: -9999px;/visibility: visible; position: static; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; background: #ffffff; margin: 20px auto; max-width: 1200px;/g' index.html

# Add loading screen that shows content immediately
cat >> index.html << 'EOF'
<style>
#seo-content {
  visibility: visible !important;
  position: static !important;
  display: block !important;
}
#loading-fallback {
  display: none;
}
</style>
EOF

echo "✅ Emergency fix applied!"
echo "📄 SEO content is now visible by default"
echo "🤖 Google bots will see the content immediately"
echo ""
echo "📋 Next steps:"
echo "1. Deploy this fix immediately"
echo "2. Request reindexing in Google Search Console" 
echo "3. Plan for long-term SSR/SSG solution"
