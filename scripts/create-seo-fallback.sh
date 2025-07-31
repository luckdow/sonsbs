#!/bin/bash

# Simple SSR Alternative for SPA
# Bu script, arama motorları için statik HTML fallback oluşturur

echo "🚀 Creating SSR fallback for SEO..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Create a simple static version with SEO content
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="tr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Critical SEO Meta Tags -->
    <title>SBS Turkey Transfer | Antalya Havalimanı Transfer Hizmeti | 7/24 VIP Transfer</title>
    <meta name="description" content="Türkiye'nin lider transfer platformu Gate Transfer. TURSAB onaylı güvenilir havalimanı transfer hizmetleri. 7/24 profesyonel şoför hizmeti, lüks araçlar ve uygun fiyatlar.">
    <meta name="keywords" content="antalya transfer, antalya havalimanı transfer, antalya vip transfer, sbs turkey transfer, gate transfer">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.gatetransfer.com/">
    
    <!-- Robots Meta -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    
    <!-- Open Graph -->
    <meta property="og:title" content="SBS Turkey Transfer | Antalya VIP Transfer | Havalimanı Transfer Hizmeti">
    <meta property="og:description" content="Antalya'nın en güvenilir VIP transfer hizmeti. 7/24 profesyonel şoför hizmeti, lüks araçlar ve uygun fiyatlar.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.gatetransfer.com">
    <meta property="og:image" content="https://www.gatetransfer.com/images/sbs-turkey-transfer-og.jpg">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi",
      "alternateName": ["SBS Turkey Transfer", "Gate Transfer"],
      "description": "Antalya VIP Transfer ve Havalimanı Transfer Hizmeti",
      "url": "https://www.gatetransfer.com",
      "telephone": "+905325742682",
      "email": "sbstravel@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Güzelyurt Mahallesi Serik Caddesi No: 138/2",
        "addressLocality": "Aksu",
        "addressRegion": "Antalya",
        "postalCode": "07112",
        "addressCountry": "TR"
      }
    }
    </script>
    
    <!-- Redirect to React App for Users -->
    <script>
      // Detect if visitor is a bot
      const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
      
      if (!isBot) {
        // Redirect real users to React app
        window.location.href = '/app/';
      }
    </script>
</head>
<body>
    <!-- SEO Content for Bots -->
    <header>
        <h1>SBS Turkey Transfer | Antalya Havalimanı Transfer Hizmeti</h1>
        <nav>
            <ul>
                <li><a href="/rezervasyon">Rezervasyon</a></li>
                <li><a href="/hakkimizda">Hakkımızda</a></li>
                <li><a href="/iletisim">İletişim</a></li>
                <li><a href="/hizmetlerimiz">Hizmetlerimiz</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Transfer Hizmetlerimiz</h2>
            <ul>
                <li><a href="/kemer-transfer">Kemer Transfer</a> - Otel ve şehir merkezi transfer hizmeti</li>
                <li><a href="/side-transfer">Side Transfer</a> - Antik kent ve otel transfer</li>
                <li><a href="/belek-transfer">Belek Transfer</a> - Golf otelleri ve tatil köyleri</li>
                <li><a href="/alanya-transfer">Alanya Transfer</a> - Şehir merkezi ve oteller</li>
                <li><a href="/lara-transfer">Lara Transfer</a> - Lüks otel bölgesi transfer</li>
                <li><a href="/kas-transfer">Kaş Transfer</a> - Doğa ve kültür turları</li>
                <li><a href="/kalkan-transfer">Kalkan Transfer</a> - Butik otel ve marina</li>
                <li><a href="/manavgat-transfer">Manavgat Transfer</a> - Şelale ve antik şehir</li>
                <li><a href="/serik-transfer">Serik Transfer</a> - Golf ve tatil merkezleri</li>
            </ul>
        </section>
        
        <section>
            <h3>Neden SBS Turkey Transfer?</h3>
            <ul>
                <li>TURSAB onaylı güvenilir hizmet</li>
                <li>7/24 müşteri destek hattı</li>
                <li>Profesyonel şoförler</li>
                <li>Lüks ve konforlu araçlar</li>
                <li>Uygun fiyat garantisi</li>
                <li>Online rezervasyon sistemi</li>
                <li>Havalimanı karşılama hizmeti</li>
                <li>Güvenli ödeme seçenekleri</li>
            </ul>
        </section>
        
        <section>
            <h3>Transfer Bölgelerimiz</h3>
            <p>Antalya, Kemer, Side, Belek, Alanya, Lara, Kaş, Kalkan, Manavgat, Serik ve çevresinde güvenilir transfer hizmeti sunuyoruz.</p>
        </section>
        
        <address>
            <h3>İletişim</h3>
            <p>Rezervasyon ve bilgi için: <a href="tel:+905325742682">+90 532 574 26 82</a></p>
            <p>E-posta: <a href="mailto:sbstravel@gmail.com">sbstravel@gmail.com</a></p>
            <p>Website: <a href="https://www.gatetransfer.com">https://www.gatetransfer.com</a></p>
        </address>
    </main>
    
    <footer>
        <p>&copy; 2025 SBS Turkey Transfer. Tüm hakları saklıdır.</p>
    </footer>
</body>
</html>
EOF

echo "✅ Static SEO fallback created at dist/index.html"

# Create React app directory structure
mkdir -p dist/app
cp index.html dist/app/

echo "✅ React app moved to /app/ path"
echo "🎯 Now bots will see SEO content, users will see React app!"
