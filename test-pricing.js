// Test dosyası - yeni fiyatlandırma sistemi

// Akıllı yuvarlama fonksiyonu
const smartRound = (value) => {
  const decimal = value - Math.floor(value);
  
  if (decimal >= 0.51) {
    return Math.ceil(value);
  } else if (decimal <= 0.49) {
    return Math.floor(value);
  } else {
    return Math.round(value);
  }
};

// Test pricing
const testPricing = {
  ranges: [
    { from: 1, to: 20, price: 25, isFixed: true }, // 1-20km sabit 25€
    { from: 20, to: 40, price: 1.5, isFixed: false }, // 20-40km arası 1.5€/km
    { from: 40, to: 80, price: 1, isFixed: false }, // 40-80km arası 1€/km  
    { from: 80, to: 150, price: 0.8, isFixed: false } // 80-150km arası 0.8€/km
  ]
};

// Basit hesaplama fonksiyonu
const calculateVehiclePrice = (distance, vehicle, isRoundTrip = false) => {
  const totalDistance = distance * (isRoundTrip ? 2 : 1);
  let totalPrice = 0;
  let breakdown = { ranges: [] };
  
  let remainingDistance = totalDistance;
  let currentKm = 0;

  for (let i = 0; i < vehicle.pricing.ranges.length; i++) {
    const range = vehicle.pricing.ranges[i];
    
    if (remainingDistance > 0 && totalDistance > range.from) {
      const rangeDistance = Math.min(
        remainingDistance,
        Math.min(range.to - Math.max(currentKm, range.from), totalDistance - Math.max(currentKm, range.from))
      );
      
      if (rangeDistance > 0) {
        let rangeTotal = 0;
        
        if (range.isFixed) {
          rangeTotal = range.price;
        } else {
          rangeTotal = rangeDistance * range.price;
        }
        
        breakdown.ranges.push({
          label: `${range.from}-${range.to}km${range.isFixed ? ' (Sabit)' : ''}`,
          distance: rangeDistance,
          rate: range.price,
          isFixed: range.isFixed,
          total: smartRound(rangeTotal)
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

// Test
console.log('=== YENİ DİNAMİK FİYATLANDIRMA SİSTEMİ TEST ===');
console.log('');

console.log('Test senaryosu: 35km mesafe');
console.log('Kurallar:');
console.log('- 1-20km: 25€ sabit');
console.log('- 20-40km: 1.5€/km');
console.log('');

const testVehicle = { pricing: testPricing };
const result = calculateVehiclePrice(35, testVehicle, false);

console.log('Hesaplama detayı:');
console.log('- 1-20km: 25€ (sabit)');
console.log('- 20-35km: 15km × 1.5€ = 22.5€');
console.log('- Toplam: 25€ + 22.5€ = 47.5€');
console.log('- Yuvarlama: 47.5€ → 48€');
console.log('');

console.log('Sonuç:', JSON.stringify(result, null, 2));

console.log('');
console.log('=== YUVARLAMA TESTLERİ ===');
console.log('47.49 →', smartRound(47.49)); // 47 (aşağı)
console.log('47.50 →', smartRound(47.50)); // 48 (standart)
console.log('47.51 →', smartRound(47.51)); // 48 (yukarı)
console.log('46.49 →', smartRound(46.49)); // 46 (aşağı)
console.log('46.51 →', smartRound(46.51)); // 47 (yukarı)
