// Static Site Generation for SEO
// Bu script ana sayfaları statik HTML olarak oluşturur

import fs from 'fs';
import path from 'path';

// Ana sayfa template'i
const generatePageHTML = (title, description, content, url) => `
<!doctype html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.gatetransfer.com${url}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="https://www.gatetransfer.com${url}">
    <meta property="og:type" content="website">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "${title}",
      "description": "${description}",
      "url": "https://www.gatetransfer.com${url}"
    }
    </script>
</head>
<body>
    <main>
        ${content}
    </main>
    
    <!-- React App yüklendiğinde statik içeriği değiştir -->
    <script>
        // React app yüklendikten sonra bu sayfayı gizle
        setTimeout(() => {
            if (window.React) {
                document.body.style.display = 'none';
                window.location.reload();
            }
        }, 100);
    </script>
    
    <!-- Ana React app'i yükle -->
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;

// Sayfa içerikleri
const pages = {
    '/': {
        title: 'SBS Turkey Transfer | Antalya Havalimanı Transfer Hizmeti',
        description: 'Türkiye\'nin lider transfer platformu. TURSAB onaylı güvenilir havalimanı transfer hizmetleri. 7/24 profesyonel şoför hizmeti.',
        content: `
            <h1>SBS Turkey Transfer</h1>
            <h2>Antalya Havalimanı Transfer Hizmeti</h2>
            <p>Türkiye'nin lider transfer platformu Gate Transfer. TURSAB onaylı güvenilir havalimanı transfer hizmetleri.</p>
            
            <section>
                <h3>Transfer Hizmetlerimiz</h3>
                <ul>
                    <li>Antalya Havalimanı Transfer</li>
                    <li>Kemer Transfer</li>
                    <li>Side Transfer</li>
                    <li>Belek Transfer</li>
                    <li>Alanya Transfer</li>
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
                </ul>
            </section>
            
            <section>
                <h3>İletişim</h3>
                <p>Telefon: +90 532 574 26 82</p>
                <p>E-posta: sbstravel@gmail.com</p>
            </section>
        `
    },
    '/kemer-transfer': {
        title: 'Kemer Transfer | Antalya Havalimanı Kemer Transfer Hizmeti',
        description: 'Kemer\'e güvenilir ve konforlu transfer hizmeti. Antalya Havalimanı\'ndan Kemer\'e VIP transfer.',
        content: `
            <h1>Kemer Transfer Hizmeti</h1>
            <h2>Antalya Havalimanı - Kemer Transfer</h2>
            <p>Kemer'e güvenilir ve konforlu transfer hizmeti sunuyoruz.</p>
            
            <section>
                <h3>Kemer Transfer Özellikleri</h3>
                <ul>
                    <li>Antalya Havalimanı'ndan direk transfer</li>
                    <li>Profesyonel şoför hizmeti</li>
                    <li>Klimalı lüks araçlar</li>
                    <li>7/24 hizmet</li>
                    <li>Otel kapısına servis</li>
                </ul>
            </section>
        `
    },
    '/rezervasyon': {
        title: 'Online Rezervasyon | SBS Turkey Transfer',
        description: 'Online rezervasyon yapın, anında onay alın. Güvenli ödeme, esnek iptal koşulları.',
        content: `
            <h1>Online Rezervasyon</h1>
            <h2>Transfer Rezervasyonunuzu Yapın</h2>
            <p>Online rezervasyon yapın, anında onay alın.</p>
            
            <section>
                <h3>Rezervasyon Avantajları</h3>
                <ul>
                    <li>Anında onay</li>
                    <li>Güvenli ödeme</li>
                    <li>Esnek iptal koşulları</li>
                    <li>24/7 müşteri desteği</li>
                </ul>
            </section>
        `
    }
};

// Static HTML dosyalarını oluştur
const generateStaticPages = () => {
    const distDir = path.resolve('dist-seo');
    
    // Dist klasörünü oluştur
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    Object.entries(pages).forEach(([url, pageData]) => {
        const html = generatePageHTML(
            pageData.title,
            pageData.description, 
            pageData.content,
            url
        );
        
        const fileName = url === '/' ? 'index.html' : `${url.substring(1)}.html`;
        const filePath = path.join(distDir, fileName);
        
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ Generated: ${fileName}`);
    });
    
    console.log(`🎉 Static SEO pages generated in ${distDir}`);
};

// Script'i çalıştır
if (import.meta.url === `file://${process.argv[1]}`) {
    generateStaticPages();
}

export { generateStaticPages };
