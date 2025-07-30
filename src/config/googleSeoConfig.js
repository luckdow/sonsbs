// Google SEO Konfigürasyon Dosyası
// Bu dosyada gerçek Google Analytics ID ve Search Console verification kodlarını güncellemelisiniz

export const GoogleSEOConfig = {
  // Google Analytics 4 (GA4) Measurement ID
  // Gerçek Google Analytics hesabınızdan alınan measurement ID'yi buraya ekleyin
  GA_MEASUREMENT_ID: 'G-EQB0RS3034', // Production Google Analytics ID
  
  // Google Search Console Verification Code  
  // Google Search Console'dan alınan verification meta tag içeriğini buraya ekleyin
  SEARCH_CONSOLE_VERIFICATION: 'YOUR_VERIFICATION_CODE_HERE', // Örnek: 'abcd1234efgh5678ijkl9012mnop3456'
  
  // Google Analytics ayarları
  GA_CONFIG: {
    // GDPR uyumlu privacy-friendly ayarlar
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    
    // Sayfa görüntüleme otomatik tracking
    send_page_view: true,
    
    // Enhanced ecommerce tracking
    enhanced_ecommerce: true,
    
    // Custom dimensions mapping
    custom_map: {
      custom_dimension_1: 'user_language',      // Kullanıcı dili (tr, en, de, ru, ar)
      custom_dimension_2: 'page_type',          // Sayfa tipi (home, city, service, blog)
      custom_dimension_3: 'city_location',      // Şehir lokasyonu (antalya, lara, kemer, etc.)
      custom_dimension_4: 'service_type',       // Hizmet tipi (airport, hotel, vip, etc.)
      custom_dimension_5: 'user_device_type'   // Cihaz tipi (desktop, mobile, tablet)
    },
    
    // Conversion tracking
    conversion_tracking: {
      booking_completed: 'booking_conversion',
      contact_form_sent: 'contact_conversion',
      phone_call_clicked: 'phone_conversion',
      whatsapp_clicked: 'whatsapp_conversion'
    }
  },
  
  // Google Tag Manager (opsiyonel)
  // Eğer Google Tag Manager kullanmak isterseniz
  GTM_ID: '', // Örnek: 'GTM-XXXXXXX'
  
  // Search Console ayarları
  SEARCH_CONSOLE_CONFIG: {
    // Sitemap URLs
    sitemaps: [
      'https://gatetransfer.com/sitemap.xml',
      'https://gatetransfer.com/sitemap-multilingual.xml',
      'https://gatetransfer.com/sitemap-images.xml'
    ],
    
    // Hreflang dilleri
    languages: ['tr', 'en', 'de', 'ru', 'ar'],
    
    // Ana domain
    primary_domain: 'gatetransfer.com'
  },
  
  // Performance monitoring ayarları
  PERFORMANCE_CONFIG: {
    // Core Web Vitals thresholds
    thresholds: {
      lcp: { good: 2500, needsImprovement: 4000 },    // Largest Contentful Paint (ms)
      fid: { good: 100, needsImprovement: 300 },      // First Input Delay (ms)
      cls: { good: 0.1, needsImprovement: 0.25 }      // Cumulative Layout Shift
    },
    
    // Performance tracking etkin mi?
    enabled: true,
    
    // Development modda debug?
    debug_mode: process.env.NODE_ENV === 'development'
  },
  
  // Event tracking ayarları
  EVENT_CONFIG: {
    // Scroll tracking yüzdeleri
    scroll_thresholds: [25, 50, 75, 90],
    
    // Form error tracking etkin mi?
    track_form_errors: true,
    
    // Outbound link tracking etkin mi?
    track_outbound_links: true,
    
    // File download tracking etkin mi?
    track_downloads: true,
    
    // Video interaction tracking etkin mi?
    track_video_interactions: true
  }
};

// Ortam-bazlı konfigürasyon
const EnvironmentConfig = {
  development: {
    GA_MEASUREMENT_ID: 'G-EQB0RS3034', // Development için test ID
    debug_mode: true,
    console_logging: true
  },
  
  production: {
    GA_MEASUREMENT_ID: 'G-EQB0RS3034', // Production için gerçek ID
    debug_mode: false,
    console_logging: false
  }
};

// Aktif ortam konfigürasyonu
export const ActiveConfig = {
  ...GoogleSEOConfig,
  ...EnvironmentConfig[process.env.NODE_ENV] || EnvironmentConfig.development
};

// Konfigürasyon validation
export const validateConfig = () => {
  const errors = [];
  
  if (!ActiveConfig.GA_MEASUREMENT_ID || ActiveConfig.GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    errors.push('Google Analytics Measurement ID not configured');
  }
  
  if (!ActiveConfig.SEARCH_CONSOLE_VERIFICATION || ActiveConfig.SEARCH_CONSOLE_VERIFICATION === 'YOUR_VERIFICATION_CODE_HERE') {
    errors.push('Google Search Console verification code not configured');
  }
  
  if (errors.length > 0) {
    console.warn('🔴 Google SEO Configuration Issues:');
    errors.forEach(error => console.warn(`  - ${error}`));
    console.warn('📝 Please update /src/config/googleSeoConfig.js with your actual Google Analytics and Search Console credentials');
  } else {
    console.log('✅ Google SEO Configuration is valid');
  }
  
  return errors.length === 0;
};

export default GoogleSEOConfig;
