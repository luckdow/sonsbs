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
      }
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
