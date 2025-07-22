// Araç tipi bazlı basamaklı fiyatlandırma sistemi

/**
 * Dinamik mesafe aralıkları ile fiyat hesaplama
 * @param {number} distance - Mesafe (km)
 * @param {Object} vehicle - Araç bilgileri (pricing alanı zorunlu)
 * @param {boolean} isRoundTrip - Gidiş-dönüş kontrolü
 * @returns {Object} Fiyat detayları
 */
export const calculateVehiclePrice = (distance, vehicle, isRoundTrip = false) => {
  if (!vehicle || !vehicle.pricing || !vehicle.pricing.ranges) {
    // Fallback: Eski sistem uyumluluğu
    return {
      totalPrice: smartRound((vehicle?.kmRate || 25) * distance * (isRoundTrip ? 2 : 1)),
      breakdown: {
        basePrice: 0,
        additionalKmPrice: smartRound((vehicle?.kmRate || 25) * distance),
        distance: distance,
        pricePerKm: vehicle?.kmRate || 25
      },
      isRoundTrip,
      currency: '€'
    };
  }

  const pricing = vehicle.pricing;
  const totalDistance = distance * (isRoundTrip ? 2 : 1);
  
  let totalPrice = 0;
  let breakdown = {
    ranges: [],
    distance: totalDistance,
    isRoundTrip,
    currency: '€'
  };

  let remainingDistance = totalDistance;
  let currentKm = 0;

  // Pricing ranges'i sırala (küçükten büyüğe)
  const sortedRanges = [...pricing.ranges].sort((a, b) => a.from - b.from);

  for (let i = 0; i < sortedRanges.length; i++) {
    const range = sortedRanges[i];
    const rangeStart = range.from;
    const rangeEnd = range.to;
    
    // Bu aralığa giren mesafe miktarını hesapla
    if (remainingDistance > 0 && totalDistance > rangeStart) {
      const rangeDistance = Math.min(
        remainingDistance,
        Math.min(rangeEnd - Math.max(currentKm, rangeStart), totalDistance - Math.max(currentKm, rangeStart))
      );
      
      if (rangeDistance > 0) {
        let rangeTotal = 0;
        
        // Sabit fiyat mı yoksa km başına fiyat mı?
        if (range.isFixed) {
          rangeTotal = range.price; // Sabit fiyat
        } else {
          rangeTotal = rangeDistance * range.price; // Km başına fiyat
        }
        
        breakdown.ranges.push({
          label: `${rangeStart}-${rangeEnd}km${range.isFixed ? ' (Sabit)' : ''}`,
          from: rangeStart,
          to: rangeEnd,
          distance: rangeDistance,
          rate: range.price,
          isFixed: range.isFixed,
          total: smartRound(rangeTotal),
          type: `range_${i}`
        });
        
        totalPrice += rangeTotal;
        remainingDistance -= rangeDistance;
        currentKm += rangeDistance;
      }
    }
  }

  return {
    totalPrice: smartRound(totalPrice),
    breakdown,
    isRoundTrip,
    currency: '€'
  };
};

/**
 * Akıllı yuvarlama fonksiyonu
 * 0.51+ yukarı, 0.49- aşağı yuvarlama
 * @param {number} value - Yuvarlanacak değer
 * @returns {number} Yuvarlanmış değer
 */
export const smartRound = (value) => {
  const decimal = value - Math.floor(value);
  
  if (decimal >= 0.51) {
    return Math.ceil(value);
  } else if (decimal <= 0.49) {
    return Math.floor(value);
  } else {
    // 0.50 durumu için standart yuvarlamayı kullan
    return Math.round(value);
  }
};

/**
 * Fiyat kırılımını görsel olarak göstermek için formatla
 * @param {Object} priceData - calculateVehiclePrice'dan dönen data
 * @returns {Array} Görsel kırılım dizisi
 */
export const formatPriceBreakdown = (priceData) => {
  const { breakdown } = priceData;
  const items = [];

  if (breakdown.ranges) {
    // Yeni dinamik sistem
    breakdown.ranges.forEach(range => {
      items.push({
        label: range.label,
        distance: `${range.distance}km`,
        rate: range.isFixed ? `€${range.rate} (Sabit)` : `€${range.rate}/km`,
        total: `€${range.total}`,
        type: range.type
      });
    });
  } else {
    // Eski sistem uyumluluğu (fallback)
    if (breakdown.basePrice) {
      items.push({
        label: `Temel Fiyat`,
        distance: `${breakdown.distance}km`,
        rate: `€${breakdown.pricePerKm}/km`,
        total: `€${breakdown.additionalKmPrice}`,
        type: 'fallback'
      });
    }
  }

  return items;
};

/**
 * Varsayılan araç tipi fiyatlandırması (Örnek)
 * Sizin anlattığınız sistem: 1-20km sabit 25€, 20-40km +1.5€/km, 40-80km +1€/km, 80-150km +0.8€/km
 */
export const DEFAULT_VEHICLE_PRICING = {
  sedan: {
    ranges: [
      { from: 1, to: 20, price: 25, isFixed: true }, // 1-20km sabit 25€
      { from: 20, to: 40, price: 1.5, isFixed: false }, // 20-40km arası 1.5€/km
      { from: 40, to: 80, price: 1, isFixed: false }, // 40-80km arası 1€/km  
      { from: 80, to: 150, price: 0.8, isFixed: false } // 80-150km arası 0.8€/km
    ]
  },
  suv: {
    ranges: [
      { from: 1, to: 20, price: 30, isFixed: true },
      { from: 20, to: 40, price: 2, isFixed: false },
      { from: 40, to: 80, price: 1.3, isFixed: false },
      { from: 80, to: 150, price: 1, isFixed: false }
    ]
  },
  minivan: {
    ranges: [
      { from: 1, to: 20, price: 28, isFixed: true },
      { from: 20, to: 40, price: 1.7, isFixed: false },
      { from: 40, to: 80, price: 1.1, isFixed: false },
      { from: 80, to: 150, price: 0.9, isFixed: false }
    ]
  },
  luxury: {
    ranges: [
      { from: 1, to: 20, price: 40, isFixed: true },
      { from: 20, to: 40, price: 2.5, isFixed: false },
      { from: 40, to: 80, price: 2, isFixed: false },
      { from: 80, to: 150, price: 1.5, isFixed: false }
    ]
  },
  bus: {
    ranges: [
      { from: 1, to: 20, price: 35, isFixed: true },
      { from: 20, to: 40, price: 2, isFixed: false },
      { from: 40, to: 80, price: 1.5, isFixed: false },
      { from: 80, to: 150, price: 1.2, isFixed: false }
    ]
  }
};

/**
 * Araç tipine göre varsayılan fiyatlandırma al
 * @param {string} vehicleType - Araç tipi
 * @returns {Object} Fiyatlandırma nesnesi
 */
export const getDefaultPricingForType = (vehicleType) => {
  return DEFAULT_VEHICLE_PRICING[vehicleType] || DEFAULT_VEHICLE_PRICING.sedan;
};

/**
 * Fiyat hesaplama örneği göster
 * @param {string} vehicleType - Araç tipi
 * @param {number} sampleDistance - Örnek mesafe
 * @returns {Object} Örnek hesaplama
 */
export const generatePricingExample = (vehicleType, sampleDistance = 35) => {
  const pricing = getDefaultPricingForType(vehicleType);
  const mockVehicle = { pricing };
  
  return calculateVehiclePrice(sampleDistance, mockVehicle, false);
};

/**
 * Özel mesafe aralıkları oluştur (araç eklerken kullanılacak)
 * @param {Array} ranges - Mesafe aralıkları
 * @returns {Object} Fiyatlandırma nesnesi
 * 
 * Örnek kullanım:
 * createCustomPricing([
 *   { from: 1, to: 20, price: 25, isFixed: true },
 *   { from: 20, to: 40, price: 1.5, isFixed: false }
 * ])
 */
export const createCustomPricing = (ranges) => {
  return {
    ranges: ranges.map(range => ({
      from: parseInt(range.from),
      to: parseInt(range.to),
      price: parseFloat(range.price),
      isFixed: Boolean(range.isFixed)
    }))
  };
};

/**
 * Fiyatlandırma doğrulama
 * @param {Object} pricing - Fiyatlandırma nesnesi
 * @returns {Object} Doğrulama sonucu
 */
export const validatePricing = (pricing) => {
  const errors = [];
  
  if (!pricing.ranges || !Array.isArray(pricing.ranges) || pricing.ranges.length === 0) {
    errors.push('En az bir mesafe aralığı gerekli');
    return { isValid: false, errors };
  }
  
  // Aralıkları sırala
  const sortedRanges = [...pricing.ranges].sort((a, b) => a.from - b.from);
  
  for (let i = 0; i < sortedRanges.length; i++) {
    const range = sortedRanges[i];
    
    if (range.from >= range.to) {
      errors.push(`Aralık ${i + 1}: 'From' değeri 'To' değerinden küçük olmalı`);
    }
    
    if (range.price <= 0) {
      errors.push(`Aralık ${i + 1}: Fiyat 0'dan büyük olmalı`);
    }
    
    // Aralıklar arası boşluk kontrolü
    if (i > 0 && range.from > sortedRanges[i - 1].to) {
      errors.push(`Aralık ${i + 1}: ${sortedRanges[i - 1].to}km ile ${range.from}km arası tanımsız`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
};
