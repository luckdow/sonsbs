# Vercel Deployment Guide

## 1. Vercel CLI Kurulumu (eğer yoksa)
```bash
npm install -g vercel
```

## 2. Login
```bash
vercel login
```

## 3. İlk defa deploy (proje bağlama)
```bash
vercel
```

## 4. Production deploy
```bash
vercel --prod
```

## 5. Environment Variables
Vercel dashboard'da şu değişkenleri eklemeyi unutmayın:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## 6. Domain Settings
1. Vercel dashboard → Project → Settings → Domains
2. Add custom domain: `www.gatetransfer.com`
3. Add redirect: `gatetransfer.com` → `www.gatetransfer.com`

## 7. Analytics & SEO
- Vercel Analytics otomatik aktif edilir
- Speed Insights dashboard'da görülebilir
