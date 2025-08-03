import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const OUTPUT_DIR = join(__dirname, '..', 'dist');

// Routes to prerender
const ROUTES = [
  { path: '/', title: 'Antalya Transfer - VIP Transfer Hizmetleri | SBS Transfer' },
  { path: '/hakkimizda', title: 'Hakkımızda - SBS Transfer' },
  { path: '/iletisim', title: 'İletişim - SBS Transfer' },
  { path: '/hizmetler', title: 'Transfer Hizmetleri - SBS Transfer' },
  { path: '/sss', title: 'Sıkça Sorulan Sorular - SBS Transfer' },
  { path: '/gizlilik-politikasi', title: 'Gizlilik Politikası - SBS Transfer' },
  { path: '/kullanim-kosullari', title: 'Kullanım Koşulları - SBS Transfer' },
  { path: '/cerez-politikasi', title: 'Çerez Politikası - SBS Transfer' },
  { path: '/kvkk', title: 'KVKK - Kişisel Verilerin Korunması - SBS Transfer' },
  { path: '/iptal-iade', title: 'İptal ve İade Koşulları - SBS Transfer' },
  { path: '/antalya-transfer', title: 'Antalya Transfer - Antalya Havalimanı Transfer | SBS' },
  { path: '/kemer-transfer', title: 'Kemer Transfer - Antalya Kemer Özel Transfer | SBS' },
  { path: '/side-transfer', title: 'Side Transfer - Antalya Side VIP Transfer | SBS' },
  { path: '/belek-transfer', title: 'Belek Transfer - Antalya Belek Golf Transfer | SBS' },
  { path: '/alanya-transfer', title: 'Alanya Transfer - Antalya Alanya Ekonomik Transfer | SBS' },
  { path: '/kas-transfer', title: 'Kaş Transfer - Antalya Kaş Özel Transfer | SBS' },
  { path: '/kalkan-transfer', title: 'Kalkan Transfer - Antalya Kalkan VIP Transfer | SBS' },
  { path: '/manavgat-transfer', title: 'Manavgat Transfer - Antalya Manavgat Transfer | SBS' },
  { path: '/serik-transfer', title: 'Serik Transfer - Antalya Serik Transfer | SBS' },
  { path: '/lara-transfer', title: 'Lara Transfer - Antalya Lara Beach Transfer | SBS' },
  { path: '/hizmetler/havaalani-transfer', title: 'Havalimanı Transfer - Antalya Havalimanı VIP Transfer | SBS' },
  { path: '/hizmetler/vip-transfer', title: 'VIP Transfer - Antalya VIP Transfer Hizmetleri | SBS' },
  { path: '/hizmetler/grup-transfer', title: 'Grup Transfer - Antalya Grup Transfer Hizmetleri | SBS' },
  { path: '/hizmetler/otel-transfer', title: 'Otel Transfer - Antalya Otel Transfer Hizmetleri | SBS' },
  { path: '/hizmetler/sehirici-transfer', title: 'Şehiriçi Transfer - Antalya Şehiriçi Ulaşım | SBS' },
  { path: '/hizmetler/dugun-transfer', title: 'Düğün Transfer - Antalya Düğün Transfer Hizmetleri | SBS' },
  { path: '/hizmetler/kurumsal-transfer', title: 'Kurumsal Transfer - Antalya Kurumsal Ulaşım | SBS' },
  { path: '/hizmetler/karsilama-hizmeti', title: 'Karşılama Hizmeti - Antalya VIP Karşılama | SBS' },
  { path: '/blog', title: 'Blog - Transfer Rehberi ve İpuçları | SBS Transfer' }
];

// HTML template
function generateHTML(route, baseHTML) {
  const description = route.path === '/' 
    ? 'Antalya transfer hizmetleri. VIP, ekonomik ve grup transfer seçenekleri. 7/24 profesyonel chauffeur hizmeti. Antalya havalimanı transfer rezervasyonu.'
    : `${route.title} - Profesyonel transfer hizmetleri, güvenli ve konforlu ulaşım çözümleri.`;

  return baseHTML
    .replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${route.title}">`)
    .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="https://sbstransfer.com${route.path}">`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="https://sbstransfer.com${route.path}">`)
    .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${route.title}">`)
    .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${description}">`);
}

// Create directory recursively
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Copy static assets
function copyStaticAssets(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) return;
  
  ensureDir(targetDir);
  
  const items = readdirSync(sourceDir, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = join(sourceDir, item.name);
    const targetPath = join(targetDir, item.name);
    
    if (item.isDirectory()) {
      copyStaticAssets(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

// Main static generation function
async function generateStaticFiles() {
  console.log('🚀 Statik HTML dosyaları oluşturuluyor...');
  
  // Read the base HTML file
  const baseHTMLPath = join(OUTPUT_DIR, 'index.html');
  if (!existsSync(baseHTMLPath)) {
    console.error('❌ dist/index.html bulunamadı. Önce "npm run build" çalıştırın!');
    process.exit(1);
  }
  
  const baseHTML = readFileSync(baseHTMLPath, 'utf-8');
  
  // Generate static HTML for each route
  for (const route of ROUTES) {
    try {
      console.log(`🔄 İşleniyor: ${route.path}`);
      
      // Generate SEO-optimized HTML
      const optimizedHTML = generateHTML(route, baseHTML);
      
      // Create output directory structure
      const routePath = route.path === '/' ? '/index' : route.path;
      
      let outputPath;
      if (routePath.includes('/') && routePath !== '/index') {
        // For nested routes like /hizmetler/vip-transfer
        outputPath = join(OUTPUT_DIR, routePath);
        ensureDir(outputPath);
        outputPath = join(outputPath, 'index.html');
      } else {
        // For simple routes
        if (routePath === '/index') {
          outputPath = join(OUTPUT_DIR, 'index.html');
        } else {
          outputPath = join(OUTPUT_DIR, `${routePath.slice(1)}.html`);
        }
      }
      
      // Write optimized HTML file
      writeFileSync(outputPath, optimizedHTML);
      
      console.log(`✅ Oluşturuldu: ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Hata - ${route.path}:`, error.message);
    }
  }
  
  // Copy static assets from public directory
  const publicDir = join(__dirname, '..', 'public');
  if (existsSync(publicDir)) {
    console.log('📁 Statik dosyalar kopyalanıyor...');
    copyStaticAssets(publicDir, OUTPUT_DIR);
  }
  
  console.log('🎉 Statik HTML oluşturma işlemi tamamlandı!');
  console.log(`📂 Dosyalar: ${OUTPUT_DIR}`);
  console.log(`📊 Toplam route: ${ROUTES.length}`);
}

// Run static generation
generateStaticFiles().catch(error => {
  console.error('❌ Statik oluşturma hatası:', error);
  process.exit(1);
});
