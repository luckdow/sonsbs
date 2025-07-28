// PWA Icon Generator Script
// Bu dosya PWA ikonlarını oluşturmak için kullanılır

const fs = require('fs');
const path = require('path');

// SVG icon template - GATE Transfer branding
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="url(#gradient)" stroke="#ffffff" stroke-width="16"/>
  
  <!-- Car/Transfer Icon -->
  <g fill="#ffffff">
    <!-- Car Body -->
    <rect x="128" y="240" width="256" height="80" rx="12" ry="12"/>
    
    <!-- Car Roof -->
    <path d="M 160 240 L 160 200 Q 160 180 180 180 L 332 180 Q 352 180 352 200 L 352 240 Z"/>
    
    <!-- Wheels -->
    <circle cx="176" cy="340" r="24" fill="#1e40af"/>
    <circle cx="336" cy="340" r="24" fill="#1e40af"/>
    
    <!-- Windows -->
    <rect x="144" y="200" width="60" height="40" rx="4" ry="4" fill="#93c5fd"/>
    <rect x="220" y="200" width="72" height="40" rx="4" ry="4" fill="#93c5fd"/>
    <rect x="308" y="200" width="60" height="40" rx="4" ry="4" fill="#93c5fd"/>
    
    <!-- Door Lines -->
    <line x1="204" y1="240" x2="204" y2="320" stroke="#1e40af" stroke-width="2"/>
    <line x1="308" y1="240" x2="308" y2="320" stroke="#1e40af" stroke-width="2"/>
    
    <!-- Front Lights -->
    <ellipse cx="390" cy="280" rx="8" ry="16" fill="#fbbf24"/>
    
    <!-- GATE Text -->
    <text x="256" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff">GATE</text>
  </g>
</svg>
`;

// Create images directory if not exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Save SVG icon
fs.writeFileSync(path.join(imagesDir, 'gate-icon.svg'), iconSvg);

console.log('✅ PWA icon created: public/images/gate-icon.svg');
console.log('📝 Convert this SVG to PNG icons using an online converter:');
console.log('   - icon-192.png (192x192)');
console.log('   - icon-512.png (512x512)');
console.log('   - apple-touch-icon.png (180x180)');
console.log('   - favicon.ico (multiple sizes)');
