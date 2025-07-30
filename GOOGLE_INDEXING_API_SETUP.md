# Google Indexing API Setup (Hızlı Endeksleme)

## 🚀 Google Indexing API Nedir?
Google Indexing API, URL'leri anında Google'a göndermenizi sağlar. Özellikle job postings ve livestream content için tasarlanmış ama diğer content'ler için de kullanılabilir.

## 🔧 Setup Adımları

### 1. Google Cloud Console Setup
```bash
1. https://console.cloud.google.com adresine gidin
2. Yeni proje oluşturun: "gatetransfer-indexing"
3. "Google Indexing API"yi enable edin
4. Service Account oluşturun:
   - Name: "indexing-service"
   - Role: "Indexing API Service Agent"
5. JSON key download edin
```

### 2. Search Console'da Service Account Ekleyin
```bash
1. Google Search Console → Settings → Users & Permissions
2. Add User → Service account email'i ekleyin  
3. Permission: "Full" verin
```

### 3. Node.js Implementation
```javascript
// scripts/google-indexing.js
const { google } = require('googleapis');
const key = require('./service-account-key.json');

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

const indexing = google.indexing({
  version: 'v3',
  auth: jwtClient
});

async function submitURL(url, type = 'URL_UPDATED') {
  try {
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type
      }
    });
    console.log('✅ URL submitted:', url);
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ana URL'leri gönder
const urls = [
  'https://www.gatetransfer.com/',
  'https://www.gatetransfer.com/hakkimizda',
  'https://www.gatetransfer.com/iletisim',
  'https://www.gatetransfer.com/hizmetlerimiz',
  'https://www.gatetransfer.com/blog'
];

async function submitAllURLs() {
  for (const url of urls) {
    await submitURL(url);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
  }
}

submitAllURLs();
```

### 4. Package.json'a Dependency Ekleyin
```json
{
  "devDependencies": {
    "googleapis": "^130.0.0"
  },
  "scripts": {
    "submit-urls": "node scripts/google-indexing.js"
  }
}
```

## 🎯 Alternative: URL Submission Tool

### Manuel Tool (Ücretsiz)
```bash
# IndexNow Protocol (Microsoft Bing destekli)
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "www.gatetransfer.com",
    "key": "YOUR-API-KEY",
    "urlList": [
      "https://www.gatetransfer.com/",
      "https://www.gatetransfer.com/hakkimizda"
    ]
  }'
```

## 📊 Monitoring

### Status Check
```javascript
async function checkIndexStatus(url) {
  try {
    const response = await indexing.urlNotifications.getMetadata({
      url: url
    });
    console.log('Status:', response.data);
  } catch (error) {
    console.error('Error checking status:', error.message);
  }
}
```

## ⚠️ Önemli Notlar

1. **Rate Limits**: Günde 200 request limit
2. **Content Quality**: Google düşük kaliteli content'i reddedebilir
3. **Manual Review**: Google tüm submission'ları manuel inceleyebilir
4. **Job Postings**: En hızlı endekslenen content türü

## 🚀 Hızlı Başlangıç

1. Service account oluşturun
2. JSON key'i güvenli yere koyun
3. Search Console'da permission verin
4. Script'i çalıştırın
5. 24-48 saat bekleyin

## 📈 Results Tracking

- Google Search Console → Coverage Report
- Site: komutlarıyla manuel kontrol
- Analytics'te organic traffic artışı
- SERP position tracking
