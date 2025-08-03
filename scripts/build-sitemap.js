#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildCompleteSitemap } from '../src/seo/generators/sitemapGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Data Source (gerçek uygulamada API'den gelecek)
const mockDataSource = {
  async getCities() {
    return [
      { slug: 'antalya-transfer', name: 'Antalya', lastmod: '2025-08-03', priority: '0.9' },
      { slug: 'kemer-transfer', name: 'Kemer', lastmod: '2025-08-03' },
      { slug: 'side-transfer', name: 'Side', lastmod: '2025-08-03' },
      { slug: 'belek-transfer', name: 'Belek', lastmod: '2025-08-03' },
      { slug: 'alanya-transfer', name: 'Alanya', lastmod: '2025-08-03' },
      { slug: 'antalya-merkez-transfer', name: 'Antalya Merkez', lastmod: '2025-08-03' },
      { slug: 'lara-transfer', name: 'Lara', lastmod: '2025-08-03' },
      { slug: 'konyaalti-transfer', name: 'Konyaaltı', lastmod: '2025-08-03' },
      { slug: 'kas-transfer', name: 'Kaş', lastmod: '2025-08-03' },
      { slug: 'kalkan-transfer', name: 'Kalkan', lastmod: '2025-08-03' },
      { slug: 'olimpos-transfer', name: 'Olimpos', lastmod: '2025-08-03' },
      { slug: 'cirali-transfer', name: 'Çıralı', lastmod: '2025-08-03' },
      { slug: 'finike-transfer', name: 'Finike', lastmod: '2025-08-03' },
      { slug: 'demre-transfer', name: 'Demre', lastmod: '2025-08-03' },
      { slug: 'patara-transfer', name: 'Patara', lastmod: '2025-08-03' },
      { slug: 'manavgat-transfer', name: 'Manavgat', lastmod: '2025-08-03' }
    ];
  },

  async getServices() {
    return [
      { slug: 'havaalani-transfer', name: 'Havalimanı Transfer', isMain: true, lastmod: '2025-08-03' },
      { slug: 'vip-transfer', name: 'VIP Transfer', isMain: true, lastmod: '2025-08-03' },
      { slug: 'grup-transfer', name: 'Grup Transfer', isMain: true, lastmod: '2025-08-03' },
      { slug: 'otel-transfer', name: 'Otel Transfer', isMain: false, lastmod: '2025-08-03' },
      { slug: 'dugun-transfer', name: 'Düğün Transfer', isMain: false, lastmod: '2025-08-03' },
      { slug: 'kurumsal-transfer', name: 'Kurumsal Transfer', isMain: false, lastmod: '2025-08-03' },
      { slug: 'sehir-ici-transfer', name: 'Şehir İçi Transfer', isMain: false, lastmod: '2025-08-03' },
      { slug: 'karsilama-hizmeti', name: 'Karşılama Hizmeti', isMain: false, lastmod: '2025-08-03' }
    ];
  },

  async getBlogPosts() {
    return [
      {
        slug: 'antalya-gezilecek-yerler',
        title: 'Antalya\'da Gezilecek Yerler',
        excerpt: 'Antalya\'nın en güzel yerlerini keşfedin',
        publishDate: '2025-08-01',
        modifiedDate: '2025-08-03'
      },
      {
        slug: 'transfer-ipuclari',
        title: 'Havalimanı Transfer İpuçları',
        excerpt: 'Havalimanı transferinde nelere dikkat etmeli',
        publishDate: '2025-07-25',
        modifiedDate: '2025-08-02'
      },
      {
        slug: 'antalya-transfer-rehberi',
        title: 'Antalya Transfer Rehberi 2025',
        excerpt: 'Antalya transfer hizmetleri hakkında detaylı rehber',
        publishDate: '2025-07-20',
        modifiedDate: '2025-08-03'
      },
      {
        slug: 'havaalani-transfer-ipuclari',
        title: 'Havalimanı Transfer İpuçları',
        excerpt: 'Güvenli ve ekonomik havalimanı transferi için öneriler',
        publishDate: '2025-07-15',
        modifiedDate: '2025-08-01'
      }
    ];
  },

  async getStaticPages() {
    return [
      { url: '/', name: 'Ana Sayfa', priority: 1.0, changefreq: 'weekly', lastmod: '2025-08-03' },
      { url: '/rezervasyon', name: 'Rezervasyon', priority: 0.9, changefreq: 'weekly', lastmod: '2025-08-03' },
      { url: '/iletisim', name: 'İletişim', priority: 0.8, changefreq: 'monthly', lastmod: '2025-08-03' },
      { url: '/hakkimizda', name: 'Hakkımızda', priority: 0.7, changefreq: 'monthly', lastmod: '2025-08-03' },
      { url: '/hizmetler', name: 'Hizmetler', priority: 0.8, changefreq: 'weekly', lastmod: '2025-08-03' },
      { url: '/blog', name: 'Blog', priority: 0.7, changefreq: 'weekly', lastmod: '2025-08-03' },
      { url: '/gizlilik-politikasi', name: 'Gizlilik Politikası', priority: 0.3, changefreq: 'yearly', lastmod: '2025-08-03' },
      { url: '/kullanim-kosullari', name: 'Kullanım Koşulları', priority: 0.3, changefreq: 'yearly', lastmod: '2025-08-03' },
      { url: '/cerez-politikasi', name: 'Çerez Politikası', priority: 0.3, changefreq: 'yearly', lastmod: '2025-08-03' },
      { url: '/iptal-iade', name: 'İptal ve İade', priority: 0.5, changefreq: 'monthly', lastmod: '2025-08-03' },
      { url: '/sikca-sorulan-sorular', name: 'SSS', priority: 0.6, changefreq: 'monthly', lastmod: '2025-08-03' },
      { url: '/kvkk', name: 'KVKK', priority: 0.3, changefreq: 'yearly', lastmod: '2025-08-03' }
    ];
  }
};

async function generateSitemapFile() {
  try {
    console.log('🚀 Sitemap oluşturuluyor...');
    
    const sitemap = await buildCompleteSitemap(mockDataSource);
    const publicDir = path.join(__dirname, '..', 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    await fs.writeFile(sitemapPath, sitemap, 'utf8');
    
    console.log('✅ Sitemap başarıyla oluşturuldu: public/sitemap.xml');
    console.log(`📊 Toplam URL sayısı: ${(sitemap.match(/<url>/g) || []).length}`);
    
  } catch (error) {
    console.error('❌ Sitemap oluşturulurken hata:', error);
    process.exit(1);
  }
}

// Script çalıştırıldığında
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemapFile();
}

export { generateSitemapFile };
