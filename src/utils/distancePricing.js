// Mesafe bazlı basamaklı fiyatlandırma sistemi

/**
 * Mesafe bazlı dinamik fiyatlandırma hesaplama
 * @param {number} distanceKm - Mesafe (km cinsinden)
 * @param {string} vehicleType - Araç tipi (sedan, suv, vip, minibus, etc.)
 * @param {boolean} isRoundTrip - Gidiş-dönüş mü?
 * @returns {object} { basePrice, extraPrice, totalPrice, breakdown }
 */
export const calculateDistanceBasedPrice = (distanceKm, vehicleType = 'sedan', isRoundTrip = false) => {
  // Araç tipine göre temel fiyat çarpanları
  const vehicleMultipliers = {
    sedan: 1.0,
    suv: 1.2,
    minibus: 1.4,
    midibus: 1.6,
    vip: 1.8,
    bus: 2.0
  };

  const multiplier = vehicleMultipliers[vehicleType] || 1.0;
  
  // Temel fiyat tanımları (EUR cinsinden)
  const BASE_PRICE = 1250; // 0-20km arası sabit fiyat
  const RATE_20_40 = 22;   // 20-40km arası km başı
  const RATE_40_150 = 18;  // 40-150km arası km başı  
  const RATE_150_PLUS = 33; // 150km+ km başı

  let totalPrice = 0;
  let breakdown = [];

  if (distanceKm <= 20) {
    // 0-20km: Sabit fiyat
    totalPrice = BASE_PRICE;
    breakdown.push({
      range: '0-20km',
      distance: distanceKm,
      rate: 'Sabit fiyat',
      price: BASE_PRICE
    });
  } else if (distanceKm <= 40) {
    // 20-40km: Sabit + ek km
    const extraKm = distanceKm - 20;
    const extraPrice = extraKm * RATE_20_40;
    totalPrice = BASE_PRICE + extraPrice;
    
    breakdown.push({
      range: '0-20km',
      distance: 20,
      rate: 'Sabit fiyat',
      price: BASE_PRICE
    });
    breakdown.push({
      range: '20-40km',
      distance: extraKm,
      rate: `${RATE_20_40}€/km`,
      price: extraPrice
    });
  } else if (distanceKm <= 150) {
    // 40-150km: Sabit + 20-40km + ek km
    const extraKm_20_40 = 20; // 20-40km arası tam 20km
    const extraKm_40_150 = distanceKm - 40;
    const price_20_40 = extraKm_20_40 * RATE_20_40;
    const price_40_150 = extraKm_40_150 * RATE_40_150;
    totalPrice = BASE_PRICE + price_20_40 + price_40_150;
    
    breakdown.push({
      range: '0-20km',
      distance: 20,
      rate: 'Sabit fiyat',
      price: BASE_PRICE
    });
    breakdown.push({
      range: '20-40km',
      distance: extraKm_20_40,
      rate: `${RATE_20_40}€/km`,
      price: price_20_40
    });
    breakdown.push({
      range: '40-150km',
      distance: extraKm_40_150,
      rate: `${RATE_40_150}€/km`,
      price: price_40_150
    });
  } else {
    // 150km+: Tüm basamaklar + ek km
    const extraKm_20_40 = 20;
    const extraKm_40_150 = 110; // 40-150km arası tam 110km
    const extraKm_150_plus = distanceKm - 150;
    const price_20_40 = extraKm_20_40 * RATE_20_40;
    const price_40_150 = extraKm_40_150 * RATE_40_150;
    const price_150_plus = extraKm_150_plus * RATE_150_PLUS;
    totalPrice = BASE_PRICE + price_20_40 + price_40_150 + price_150_plus;
    
    breakdown.push({
      range: '0-20km',
      distance: 20,
      rate: 'Sabit fiyat',
      price: BASE_PRICE
    });
    breakdown.push({
      range: '20-40km',
      distance: extraKm_20_40,
      rate: `${RATE_20_40}€/km`,
      price: price_20_40
    });
    breakdown.push({
      range: '40-150km',
      distance: extraKm_40_150,
      rate: `${RATE_40_150}€/km`,
      price: price_40_150
    });
    breakdown.push({
      range: '150km+',
      distance: extraKm_150_plus,
      rate: `${RATE_150_PLUS}€/km`,
      price: price_150_plus
    });
  }

  // Araç tipine göre çarpan uygula
  const basePrice = totalPrice;
  totalPrice = Math.round(totalPrice * multiplier);
  const vehicleExtraPrice = totalPrice - basePrice;

  // Gidiş-dönüş ise 2 katına çıkar
  if (isRoundTrip) {
    totalPrice = totalPrice * 2;
  }

  return {
    basePrice: Math.round(basePrice),
    vehicleExtraPrice: Math.round(vehicleExtraPrice),
    totalPrice: Math.round(totalPrice),
    breakdown,
    vehicleType,
    vehicleMultiplier: multiplier,
    isRoundTrip,
    distance: distanceKm
  };
};

/**
 * Fiyat detaylarını formatla
 * @param {object} priceData - calculateDistanceBasedPrice'dan dönen veri
 * @returns {string} Formatlanmış fiyat açıklaması
 */
export const formatPriceBreakdown = (priceData) => {
  let breakdown = `📍 Mesafe: ${priceData.distance}km\n`;
  breakdown += `🚗 Araç Tipi: ${priceData.vehicleType.toUpperCase()}\n`;
  breakdown += `🔄 Seyahat: ${priceData.isRoundTrip ? 'Gidiş-Dönüş' : 'Tek Yön'}\n\n`;
  
  breakdown += `💰 Fiyat Detayı:\n`;
  priceData.breakdown.forEach(item => {
    breakdown += `  ${item.range}: ${item.distance}km × ${item.rate} = ${item.price}€\n`;
  });
  
  if (priceData.vehicleExtraPrice > 0) {
    breakdown += `  Araç Tipi Farkı: +${priceData.vehicleExtraPrice}€\n`;
  }
  
  if (priceData.isRoundTrip) {
    const oneWayPrice = priceData.totalPrice / 2;
    breakdown += `  Tek Yön: ${oneWayPrice}€\n`;
    breakdown += `  Gidiş-Dönüş: ${oneWayPrice}€ × 2 = ${priceData.totalPrice}€\n`;
  }
  
  breakdown += `\n🎯 TOPLAM: ${priceData.totalPrice}€`;
  
  return breakdown;
};

/**
 * Demo fiyat hesaplamaları
 */
export const getDemoPrices = () => {
  const distances = [5, 15, 25, 45, 80, 120, 200];
  const vehicleTypes = ['sedan', 'suv', 'minibus', 'vip'];
  
  return distances.map(distance => {
    const prices = {};
    vehicleTypes.forEach(type => {
      const oneWay = calculateDistanceBasedPrice(distance, type, false);
      const roundTrip = calculateDistanceBasedPrice(distance, type, true);
      prices[type] = {
        oneWay: oneWay.totalPrice,
        roundTrip: roundTrip.totalPrice
      };
    });
    return {
      distance,
      prices
    };
  });
};
