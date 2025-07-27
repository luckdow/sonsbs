// Hizmet sayfaları için merkezi veri yönetimi
import React from 'react';
import { 
  Plane, 
  Car, 
  Users, 
  Crown, 
  Building2, 
  MapPin, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  Phone,
  Calendar,
  Globe,
  Heart,
  Briefcase,
  UserCheck,
  Zap
} from 'lucide-react';

export const servicesData = {
  'havaalani-transfer': {
    title: 'Antalya Havalimanı Transfer | GATE Transfer - 7/24 Güvenli Ulaşım',
    description: 'Antalya Havalimanı\'ndan (AYT) tüm otel ve bölgelere 7/24 güvenli, konforlu ve ekonomik transfer hizmeti. Online rezervasyon, uçuş takibi, meet & greet hizmeti.',
    keywords: 'antalya havalimanı transfer, AYT transfer, antalya airport transfer, havalimanı otel ulaşım, antalya havalimanı taxi, private transfer antalya',
    canonicalUrl: '/havaalani-transfer',
    heroTitle: 'Antalya Havalimanı Transfer',
    heroSubtitle: '7/24 Güvenli ve Konforlu Ulaşım',
    heroDescription: 'Antalya Havalimanı\'ndan (AYT) tüm destinasyonlara profesyonel transfer hizmeti. Uçuş takibi, karşılama tabelası ve bagaj yardımı dahil.',
    heroIcon: <Plane className="w-5 h-5" />,
    
    serviceFeatures: [
      {
        icon: <Plane className="w-6 h-6" />,
        title: 'Uçuş Takibi',
        description: 'Uçuşunuzu anlık takip ederek gecikmeli seferlerde de karşılama garantisi sağlıyoruz.'
      },
      {
        icon: <UserCheck className="w-6 h-6" />,
        title: 'Meet & Greet',
        description: 'Terminal çıkışında isminizin yazılı olduğu tabela ile profesyonel karşılama hizmeti.'
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: 'Güvenli Transfer',
        description: 'Lisanslı araçlar, profesyonel şoförler ve tam sigorta kapsamında güvenli yolculuk.'
      },
      {
        icon: <Clock className="w-6 h-6" />,
        title: '7/24 Hizmet',
        description: 'Gece gündüz her saatte havalimanı transfer hizmeti, 365 gün kesintisiz.'
      },
      {
        icon: <Car className="w-6 h-6" />,
        title: 'Konforlu Araçlar',
        description: 'Mercedes Vito, Sprinter ve VIP araçlarla maksimum konfor ve güvenlik.'
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: 'Çok Dilli Destek',
        description: 'Türkçe, İngilizce, Rusça, Almanca müşteri desteği ve şoför hizmeti.'
      }
    ],
    
    whyChooseUs: [
      {
        icon: <Star className="w-8 h-8 text-blue-600" />,
        title: 'TURSAB Üyesi',
        description: 'Türkiye Seyahat Acentaları Birliği güvencesi ile hizmet'
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        title: 'Sabit Fiyat',
        description: 'Şeffaf fiyatlandırma, ek ücret yok'
      },
      {
        icon: <Phone className="w-8 h-8 text-purple-600" />,
        title: '7/24 Destek',
        description: 'Her an ulaşabileceğiniz müşteri hizmetleri'
      },
      {
        icon: <Zap className="w-8 h-8 text-orange-600" />,
        title: 'Hızlı Rezervasyon',
        description: '5 dakikada online rezervasyon'
      }
    ],
    
    pricing: [
      {
        title: 'Ekonomik',
        price: '€20-30',
        description: 'Sedan araçlarla standart transfer',
        features: [
          '1-3 kişilik kapasite',
          'Sedan araç (Mercedes E-Class)',
          'Bagaj dahil',
          'Karşılama tabelası',
          'Uçuş takibi'
        ]
      },
      {
        title: 'Konfor',
        price: '€35-50',
        description: 'Minivan araçlarla geniş transfer',
        features: [
          '4-6 kişilik kapasite',
          'Mercedes Vito araç',
          'Ekstra bagaj alanı',
          'Klimalı araç',
          'Professional şoför',
          'Su ikramı'
        ]
      },
      {
        title: 'VIP',
        price: '€60-90',
        description: 'Lüks araçlarla premium transfer',
        features: [
          '1-8 kişilik kapasite',
          'Mercedes Sprinter VIP',
          'Lüks iç mekan',
          'Wi-Fi internet',
          'İkram servisi',
          'Özel karşılama'
        ]
      }
    ],
    
    faq: [
      {
        question: 'Antalya Havalimanından transfer rezervasyonu nasıl yapılır?',
        answer: 'Online rezervasyon formumuzdan 7/24 rezervasyon yapabilir, +90 532 574 26 82 numaralı telefondan arayabilir veya WhatsApp ile iletişime geçebilirsiniz. Uçuş bilgilerinizi paylaştığınızda transfer otomatik olarak ayarlanır.'
      },
      {
        question: 'Havalimanında nasıl karşılanırım?',
        answer: 'Şoförümüz terminal çıkışında isminizin yazılı olduğu tabela ile sizi bekler. Uçuş takibi yaptığımız için gecikmeli uçuşlarda da karşılama garantimiz vardır. Bagaj teslim noktası çıkışında kolayca bulabilirsiniz.'
      },
      {
        question: 'Transfer ücretleri sabit mi?',
        answer: 'Evet, transfer ücretlerimiz önceden belirlenen sabit fiyatlardır. Trafik, bekleme süresi veya benzin fiyatı gibi faktörlere bağlı ek ücret talep edilmez. Rezervasyon sırasında verilen fiyat kesindir.'
      },
      {
        question: 'Gecikmeli uçuşlarda nasıl bir prosedür uygulanır?',
        answer: 'Uçuş takip sistemimiz sayesinde gecikmeli seferleri otomatik olarak takip ederiz. Şoförümüz gecikme süresi kadar bekler, ek ücret talep edilmez. Maksimum 2 saat ücretsiz bekleme hakkınız vardır.'
      },
      {
        question: 'Çocuk koltuğu hizmeti var mı?',
        answer: 'Evet, bebek ve çocuk koltuklarımız mevcuttur. Rezervasyon sırasında çocuğunuzun yaşını ve kilosunu belirtmeniz yeterlidir. Çocuk koltuğu hizmeti ücretsizdir.'
      }
    ]
  },

  'vip-transfer': {
    title: 'VIP Transfer Antalya | Lüks Araç Kiralama ve Premium Ulaşım Hizmeti',
    description: 'Antalya VIP transfer hizmeti ile lüks Mercedes araçlarla premium ulaşım. VIP karşılama, özel şoför, ikram servisi ve maksimum konfor garantisi.',
    keywords: 'antalya vip transfer, lüks araç kiralama antalya, premium transfer, vip ulaşım, mercedes vip transfer, lüks transfer hizmeti',
    canonicalUrl: '/vip-transfer',
    heroTitle: 'VIP Transfer Hizmeti',
    heroSubtitle: 'Lüks ve Ayrıcalık Bir Arada',
    heroDescription: 'Mercedes S-Class, Maybach ve luxury minivan araçlarla VIP transfer hizmeti. Özel karşılama, şampanya servisi ve maksimum konfor.',
    heroIcon: <Crown className="w-5 h-5" />,
    
    serviceFeatures: [
      {
        icon: <Crown className="w-6 h-6" />,
        title: 'VIP Karşılama',
        description: 'Özel VIP salonda karşılama, fast-track gümrük geçişi ve bagaj yardımı hizmeti.'
      },
      {
        icon: <Car className="w-6 h-6" />,
        title: 'Lüks Araç Filosu',
        description: 'Mercedes S-Class, Maybach, BMW 7 Serisi ve luxury minivan seçenekleri.'
      },
      {
        icon: <UserCheck className="w-6 h-6" />,
        title: 'Professional Şoför',
        description: 'Takım elbiseli, deneyimli ve çok dilli professional şoför hizmeti.'
      },
      {
        icon: <Heart className="w-6 h-6" />,
        title: 'İkram Servisi',
        description: 'Şampanya, meyve tabağı, soğuk içecek ve aperatif servisi.'
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: 'Concierge Hizmeti',
        description: 'Restoran rezervasyonu, etkinlik bilgisi ve özel istekleriniz için concierge desteği.'
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: 'Tam Güvenlik',
        description: 'VIP güvenlik protokolleri, gizlilik garantisi ve tam sigorta kapsamı.'
      }
    ]
  },

  'grup-transfer': {
    title: 'Grup Transfer Antalya | Otobüs Kiralama ve Toplu Ulaşım Hizmeti',
    description: 'Antalya grup transfer hizmeti ile 8-50 kişilik grup ulaşımı. Minibus, midibus ve otobüs seçenekleri ile ekonomik toplu transfer.',
    keywords: 'antalya grup transfer, otobüs kiralama antalya, toplu ulaşım, grup ulaşım, minibus kiralama, midibus transfer',
    canonicalUrl: '/grup-transfer',
    heroTitle: 'Grup Transfer Hizmeti',
    heroSubtitle: 'Toplu Ulaşımda Ekonomik Çözüm',
    heroDescription: '8-50 kişilik gruplar için özel minibus, midibus ve otobüs transfer hizmeti. Aile, arkadaş grupları ve kurumsal etkinlikler için ideal.',
    heroIcon: <Users className="w-5 h-5" />
  },

  'otel-transfer': {
    title: 'Otel Transfer Antalya | Havalimanı Otel Ulaşım Hizmeti - GATE Transfer',
    description: 'Antalya otel transfer hizmeti ile havalimanından otellere güvenli ulaşım. 5 yıldızlı oteller, resort ve butik otellere kapıdan kapıya hizmet.',
    keywords: 'antalya otel transfer, havalimanı otel ulaşım, hotel transfer antalya, resort transfer, otel pickup hizmeti',
    canonicalUrl: '/otel-transfer',
    heroTitle: 'Otel Transfer Hizmeti',
    heroSubtitle: 'Kapıdan Kapıya Güvenli Ulaşım',
    heroDescription: 'Antalya bölgesindeki tüm otellere profesyonel transfer hizmeti. Lüks resort\'lardan butik otellere kadar kapsamlı hizmet ağı.',
    heroIcon: <Building2 className="w-5 h-5" />
  },

  'sehir-ici-transfer': {
    title: 'Şehir İçi Transfer Antalya | City Transfer ve Taksi Hizmeti',
    description: 'Antalya şehir içi transfer hizmeti ile güvenli nokta ulaşımı. Kaleiçi, Marina, AVM ve hastane transferleri için güvenilir çözüm.',
    keywords: 'antalya şehir içi transfer, city transfer, antalya taksi, nokta ulaşım, şehir içi ulaşım, antalya city taxi',
    canonicalUrl: '/sehir-ici-transfer',
    heroTitle: 'Şehir İçi Transfer',
    heroSubtitle: 'Antalya\'da Nokta Ulaşım',
    heroDescription: 'Antalya şehir içinde tüm noktalar arası güvenli ve hızlı transfer hizmeti. Kaleiçi, Marina, AVM, hastane ve işyeri ulaşımları.',
    heroIcon: <MapPin className="w-5 h-5" />
  },

  'dugun-transfer': {
    title: 'Düğün Transfer Antalya | Gelin Arabası ve Düğün Ulaşım Hizmeti',
    description: 'Antalya düğün transfer hizmeti ile özel gününüzde lüks ulaşım. Gelin arabası, misafir transferi ve düğün konvoyu organizasyonu.',
    keywords: 'antalya düğün transfer, gelin arabası, düğün ulaşım, wedding transfer, düğün konvoyu, gelin arabası kiralama',
    canonicalUrl: '/dugun-transfer',
    heroTitle: 'Düğün Transfer Hizmeti',
    heroSubtitle: 'Özel Gününüzde Lüks Ulaşım',
    heroDescription: 'Düğün gününüzde unutulmaz anlar için özel süslenmiş araçlar, gelin arabası ve misafir transfer organizasyonu.',
    heroIcon: <Heart className="w-5 h-5" />
  },

  'kurumsal-transfer': {
    title: 'Kurumsal Transfer Antalya | Corporate Transfer ve İş Ulaşım Hizmeti',
    description: 'Antalya kurumsal transfer hizmeti ile profesyonel iş ulaşımı. Executive transfer, kongre ulaşımı ve şirket etkinlikleri için çözüm.',
    keywords: 'antalya kurumsal transfer, corporate transfer, iş ulaşımı, executive transfer, kongre transfer, şirket ulaşım',
    canonicalUrl: '/kurumsal-transfer',
    heroTitle: 'Kurumsal Transfer',
    heroSubtitle: 'Profesyonel İş Ulaşımı',
    heroDescription: 'Şirketiniz için executive transfer, kongre ulaşımı, misafir ağırlama ve kurumsal etkinlik transferleri.',
    heroIcon: <Briefcase className="w-5 h-5" />
  },

  'karsilama-hizmeti': {
    title: 'Karşılama Hizmeti Antalya | Meet & Greet ve VIP Karşılama',
    description: 'Antalya Havalimanı karşılama hizmeti ile VIP ağırlama. Meet & greet, bagaj yardımı ve özel karşılama protokolü.',
    keywords: 'antalya karşılama hizmeti, meet and greet, vip karşılama, havalimanı karşılama, professional karşılama',
    canonicalUrl: '/karsilama-hizmeti',
    heroTitle: 'Karşılama Hizmeti',
    heroSubtitle: 'Professional Meet & Greet',
    heroDescription: 'Havalimanında professional karşılama, VIP ağırlama, bagaj yardımı ve özel protokol hizmetleri.',
    heroIcon: <UserCheck className="w-5 h-5" />
  }
};

// Hizmet kategorileri için navigasyon menüsü
export const serviceCategories = [
  {
    title: 'Transfer Hizmetleri',
    services: [
      { name: 'Havalimanı Transfer', slug: 'havaalani-transfer' },
      { name: 'VIP Transfer', slug: 'vip-transfer' },
      { name: 'Grup Transfer', slug: 'grup-transfer' },
      { name: 'Otel Transfer', slug: 'otel-transfer' }
    ]
  },
  {
    title: 'Özel Hizmetler',
    services: [
      { name: 'Şehir İçi Transfer', slug: 'sehir-ici-transfer' },
      { name: 'Düğün Transfer', slug: 'dugun-transfer' },
      { name: 'Kurumsal Transfer', slug: 'kurumsal-transfer' },
      { name: 'Karşılama Hizmeti', slug: 'karsilama-hizmeti' }
    ]
  }
];

export default servicesData;
