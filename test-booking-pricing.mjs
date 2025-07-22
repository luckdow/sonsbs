import { calculateVehiclePrice, getDefaultPricingForType } from './src/utils/vehiclePricing.js';

// Test araç (sedan)
const testVehicle = { 
  pricing: getDefaultPricingForType('sedan'),
  kmRate: 25 
};

console.log('Sedan araç için fiyatlandırma testi:');
console.log('========================================');

// Test mesafeleri
const testDistances = [5, 15, 25, 35, 50, 85, 120];

testDistances.forEach(distance => {
  const result = calculateVehiclePrice(distance, testVehicle, false);
  console.log(`${distance} KM: ${result.totalPrice}€`);
});

console.log('\n35 KM detaylı analiz:');
const detailed = calculateVehiclePrice(35, testVehicle, false);
console.log('Toplam:', detailed.totalPrice, '€');
console.log('Kırılım:', detailed.breakdown.ranges);
