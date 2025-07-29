// Şehir sayfaları için merkezi veri yönetimi
export const cityData = {
  antalya: {
    name: "Antalya",
    slug: "antalya-transfer",
    metaTitle: "Antalya Transfer Hizmeti | Antalya Havalimanı Transfer - GATE Transfer",
    metaDescription: "Antalya havalimanı transfer hizmeti. Güvenli, konforlu ve profesyonel Antalya transfer. AYT otel transfer, şehir merkezi ulaşım. 7/24 hizmet.",
    keywords: "antalya transfer, antalya havalimanı transfer, AYT transfer, antalya otel transfer, antalya şehir merkezi transfer, güvenli transfer antalya, profesyonel transfer antalya, antalya havalimanı karşılama, lara transfer, konyaaltı transfer",
    heroImage: "/images/cities/antalya-hero.jpg",
    shortDescription: "TURSAB onaylı güvenilir transfer hizmeti. Havalimanından otele, şehir merkezine konforlu ve güvenli ulaşım.",
    distanceFromAirport: "15 km",
    averageTransferTime: "25-35 dakika",
    
    popularDestinations: [
      {
        name: "Antalya Kaleiçi",
        description: "Tarihi Antalya merkezi ve antik liman bölgesi",
        distance: "12 km",
        duration: "20 dakika"
      },
      {
        name: "Lara Plajı",
        description: "Antalya'nın en popüler plaj bölgesi",
        distance: "8 km", 
        duration: "15 dakika"
      },
      {
        name: "Konyaaltı Plajı",
        description: "Mavi bayraklı uzun kumsal plaj",
        distance: "18 km",
        duration: "25 dakika"
      },
      {
        name: "Antalya Marina",
        description: "Modern marina ve alışveriş merkezi",
        distance: "14 km",
        duration: "22 dakika"
      },
      {
        name: "MarkAntalya AVM",
        description: "Antalya'nın en büyük alışveriş merkezi",
        distance: "20 km",
        duration: "30 dakika"
      },
      {
        name: "Düden Şelalesi",
        description: "Doğal güzellik ve piknik alanı",
        distance: "22 km",
        duration: "35 dakika"
      }
    ],

    transferRoutes: [
      {
        from: "Antalya Havalimanı",
        to: "Antalya Şehir Merkezi",
        distance: "15 km",
        duration: "25 dakika",
        description: "Havalimanından şehir merkezine direkt transfer"
      },
      {
        from: "Antalya Havalimanı", 
        to: "Lara Bölgesi",
        distance: "8 km",
        duration: "15 dakika", 
        description: "Lara otelleri ve plaj bölgesine transfer"
      },
      {
        from: "Antalya Havalimanı",
        to: "Konyaaltı Bölgesi",
        distance: "18 km",
        duration: "25 dakika",
        description: "Konyaaltı otelleri ve plaj bölgesine transfer"
      },
      {
        from: "Antalya Şehir Merkezi",
        to: "Antalya Marina",
        distance: "6 km",
        duration: "12 dakika",
        description: "Şehir merkezi ile marina arasında transfer"
      }
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Gate Transfer - Antalya Transfer Hizmeti",
      "description": "Antalya havalimanı transfer hizmeti. Güvenli, konforlu ve uygun fiyatlı transfer çözümleri.",
      "url": "https://gatetransfer.com.tr/antalya-transfer",
      "telephone": "+905554443322",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Antalya",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "36.8969",
        "longitude": "30.7133"
      },
      "openingHours": "Mo-Su 00:00-24:00",
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "36.8969",
          "longitude": "30.7133"
        },
        "geoRadius": "50000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Antalya Transfer Hizmetleri",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Antalya Havalimanı Transfer"
            }
          }
        ]
      }
    }
  },

  kemer: {
    name: "Kemer",
    slug: "kemer-transfer", 
    metaTitle: "Kemer Transfer | Antalya Havalimanı Kemer Transfer Hizmeti - GATE Transfer",
    metaDescription: "Antalya havalimanından Kemer'e transfer hizmeti. Kemer otel transfer, marina ulaşım. Güvenli ve konforlu Kemer transfer çözümleri.",
    keywords: "kemer transfer, antalya havalimanı kemer transfer, kemer otel transfer, kemer marina transfer, antalya kemer ulaşım, profesyonel kemer transfer, güvenli kemer transfer, club med kemer transfer, maxx royal kemer transfer",
    heroImage: "/images/cities/kemer-hero.jpg",
    shortDescription: "Antalya Havalimanından Kemer'e güvenli ve konforlu transfer hizmeti. Marina, oteller ve plajlara direkt ulaşım.",
    distanceFromAirport: "42 km",
    averageTransferTime: "45-55 dakika",

    popularDestinations: [
      {
        name: "Kemer Marina",
        description: "Modern marina ve restoran bölgesi",
        distance: "2 km",
        duration: "5 dakika"
      },
      {
        name: "Moonlight Plajı",
        description: "Mavi bayraklı ünlü plaj",
        distance: "1 km", 
        duration: "3 dakika"
      },
      {
        name: "Phaselis Antik Kenti",
        description: "Tarihi antik kent kalıntıları",
        distance: "15 km",
        duration: "20 dakika"
      },
      {
        name: "Olympos Teleferik",
        description: "Tahtalı Dağı teleferik istasyonu",
        distance: "8 km",
        duration: "12 dakika"
      },
      {
        name: "Göynük Kanyonu",
        description: "Doğa yürüyüşü ve kanyon turu",
        distance: "12 km",
        duration: "18 dakika"
      },
      {
        name: "Beldibi Plajı",
        description: "Sakin ve huzurlu plaj bölgesi",
        distance: "25 km",
        duration: "30 dakika"
      }
    ],

    transferRoutes: [
      {
        from: "Antalya Havalimanı",
        to: "Kemer Merkez",
        distance: "42 km", 
        duration: "50 dakika",
        description: "Havalimanından Kemer merkeze direkt transfer"
      },
      {
        from: "Antalya Havalimanı",
        to: "Kemer Marina",
        distance: "44 km",
        duration: "52 dakika",
        description: "Havalimanından Kemer marina bölgesine transfer"
      },
      {
        from: "Kemer",
        to: "Phaselis",
        distance: "15 km",
        duration: "20 dakika",
        description: "Kemer'den Phaselis antik kentine günübirlik tur"
      },
      {
        from: "Kemer",
        to: "Olympos Teleferik",
        distance: "8 km",
        duration: "12 dakika", 
        description: "Kemer'den teleferik istasyonuna transfer"
      }
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness", 
      "name": "Gate Transfer - Kemer Transfer Hizmeti",
      "description": "Antalya havalimanından Kemer'e transfer hizmeti. Güvenli ve konforlu ulaşım.",
      "url": "https://gatetransfer.com.tr/kemer-transfer",
      "telephone": "+905554443322",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kemer, Antalya",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "36.6000",
        "longitude": "30.5597"
      },
      "openingHours": "Mo-Su 00:00-24:00"
    }
  },

  side: {
    name: "Side",
    slug: "side-transfer",
    metaTitle: "Side Transfer | Antalya Havalimanı Side Transfer Hizmeti - GATE Transfer", 
    metaDescription: "Antalya havalimanından Side'ye transfer hizmeti. Side antik kent transfer, otel ulaşım. Güvenli ve profesyonel Side transfer.",
    keywords: "side transfer, antalya havalimanı side transfer, side otel transfer, side antik kent transfer, side'den havalimanına transfer, manavgat side transfer, side all inclusive transfer, güvenli side transfer",
    heroImage: "/images/cities/side-hero.jpg",
    shortDescription: "Antalya Havalimanından Side'ye profesyonel transfer hizmeti. Antik kent, plajlar ve otellere konforlu ulaşım.",
    distanceFromAirport: "65 km",
    averageTransferTime: "65-75 dakika",

    popularDestinations: [
      {
        name: "Side Antik Kenti",
        description: "Tarihi antik kent kalıntıları ve tiyatro",
        distance: "2 km",
        duration: "5 dakika"
      },
      {
        name: "Side Plajı",
        description: "Altın kumlu uzun plaj şeridi",
        distance: "1 km",
        duration: "3 dakika"
      },
      {
        name: "Manavgat Şelalesi",
        description: "Ünlü doğal şelale ve piknik alanı",
        distance: "8 km", 
        duration: "12 dakika"
      },
      {
        name: "Manavgat Pazarı",
        description: "Geleneksel Türk pazarı",
        distance: "7 km",
        duration: "10 dakika"
      },
      {
        name: "Aspendos Antik Tiyatrosu",
        distance: "15 km",
        duration: "20 dakika",
        description: "Roma dönemi antik tiyatro"
      },
      {
        name: "Köprülü Kanyon",
        description: "Rafting ve doğa sporları merkezi",
        distance: "45 km",
        duration: "50 dakika"
      }
    ],

    transferRoutes: [
      {
        from: "Antalya Havalimanı",
        to: "Side Merkez",
        distance: "65 km",
        duration: "70 dakika",
        description: "Havalimanından Side merkeze direkt transfer"
      },
      {
        from: "Side",
        to: "Manavgat Şelalesi", 
        distance: "8 km",
        duration: "12 dakika",
        description: "Side'den şelale gezisine transfer"
      },
      {
        from: "Side",
        to: "Aspendos",
        distance: "15 km",
        duration: "20 dakika",
        description: "Side'den Aspendos antik tiyatrosuna transfer"
      }
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Gate Transfer - Side Transfer Hizmeti", 
      "description": "Antalya havalimanından Side'ye transfer hizmeti. Güvenli ve konforlu ulaşım.",
      "url": "https://gatetransfer.com.tr/side-transfer",
      "telephone": "+905554443322"
    }
  },

  belek: {
    name: "Belek",
    slug: "belek-transfer",
    metaTitle: "Belek Transfer | Antalya Havalimanı Belek Transfer Hizmeti - GATE Transfer",
    metaDescription: "Antalya havalimanından Belek'e transfer hizmeti. Belek golf otel transfer, lüks tatil köyleri ulaşım. VIP Belek transfer.",
    keywords: "belek transfer, antalya havalimanı belek transfer, belek golf transfer, belek otel transfer, rixos premium belek transfer, maxx royal belek transfer, belek golf otel transfer, lüks belek transfer",
    heroImage: "/images/cities/belek-hero.jpg", 
    shortDescription: "Antalya Havalimanından Belek'e VIP transfer hizmeti. Golf sahaları, lüks oteller ve tatil köylerine özel ulaşım.",
    distanceFromAirport: "35 km",
    averageTransferTime: "35-45 dakika",

    popularDestinations: [
      {
        name: "Belek Golf Sahaları",
        description: "Dünya standartlarında golf sahaları", 
        distance: "3 km",
        duration: "5 dakika"
      },
      {
        name: "Belek Plajı",
        description: "Mavi bayraklı altın kumlu plaj",
        distance: "2 km",
        duration: "4 dakika"
      },
      {
        name: "Land of Legends",
        description: "Tema parkı ve su parkı",
        distance: "5 km",
        duration: "8 dakika"
      }
    ],

    transferRoutes: [
      {
        from: "Antalya Havalimanı",
        to: "Belek Merkez",
        distance: "35 km",
        duration: "40 dakika", 
        description: "Havalimanından Belek merkeze transfer"
      }
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Gate Transfer - Belek Transfer Hizmeti"
    }
  },

  alanya: {
    name: "Alanya", 
    slug: "alanya-transfer",
    metaTitle: "Alanya Transfer | Antalya Havalimanı Alanya Transfer Hizmeti - GATE Transfer",
    metaDescription: "Antalya havalimanından Alanya'ya transfer hizmeti. Alanya kale transfer, kleopatra plajı ulaşım. Güvenli Alanya transfer.",
    keywords: "alanya transfer, antalya havalimanı alanya transfer, alanya otel transfer, alanya kale transfer, antalya alanya ulaşım, kleopatra plajı transfer, alanya ultra all inclusive transfer, güvenli alanya transfer",
    heroImage: "/images/cities/alanya-hero.jpg",
    shortDescription: "Antalya Havalimanından Alanya'ya konforlu transfer hizmeti. Kale, Kleopatra Plajı ve otellere güvenli ulaşım.",
    distanceFromAirport: "125 km", 
    averageTransferTime: "105-120 dakika",

    popularDestinations: [
      {
        name: "Alanya Kalesi",
        description: "Ortaçağ kalesi ve tarihi yarımada",
        distance: "3 km",
        duration: "8 dakika"
      },
      {
        name: "Kleopatra Plajı", 
        description: "Ünlü altın kumlu plaj",
        distance: "2 km",
        duration: "5 dakika"
      },
      {
        name: "Damlataş Mağarası",
        description: "Doğal sarkıt mağarası",
        distance: "2 km",
        duration: "5 dakika"
      }
    ],

    transferRoutes: [
      {
        from: "Antalya Havalimanı",
        to: "Alanya Merkez",
        distance: "125 km",
        duration: "110 dakika",
        description: "Havalimanından Alanya merkeze transfer"
      }
    ],

    schema: {
      "@context": "https://schema.org", 
      "@type": "LocalBusiness",
      "name": "Gate Transfer - Alanya Transfer Hizmeti"
    }
  }
};

// Şehir listesi helper fonksiyonu
export const getCityList = () => {
  return Object.keys(cityData).map(key => ({
    slug: key,
    name: cityData[key].name,
    metaTitle: cityData[key].metaTitle
  }));
};

// Şehir verisi alma helper fonksiyonu
export const getCityData = (slug) => {
  return cityData[slug] || null;
};

// SEO friendly URL slug oluşturma
export const createCitySlug = (cityName) => {
  return cityName
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u') 
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export default cityData;
