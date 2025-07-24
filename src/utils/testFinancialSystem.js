import { updateDriverFinancials } from './financialIntegration_IMPROVED';

/**
 * Finansal sistemi test etmek için örnek test fonksiyonu
 * Geliştirici konsolundan çalıştırılabilir
 */
export const testFinancialSystem = async () => {
  console.log('🧪 Finansal sistem testi başlatılıyor...');
  
  // Test verisi 1: Sistem şoförü - Nakit ödeme
  const testReservation1 = {
    assignedDriver: 'test-driver-id-1',
    totalPrice: 100,
    paymentMethod: 'cash',
    customerInfo: {
      firstName: 'Test',
      lastName: 'Müşteri'
    },
    tripDetails: {
      pickupLocation: 'Test Başlangıç',
      dropoffLocation: 'Test Varış'
    }
  };

  // Test verisi 2: Manuel şoför - Kart ödeme
  const testReservation2 = {
    assignedDriver: 'manual',
    totalPrice: 150,
    paymentMethod: 'card',
    customerInfo: {
      firstName: 'Test',
      lastName: 'Müşteri2'
    },
    tripDetails: {
      pickupLocation: 'Test Başlangıç 2',
      dropoffLocation: 'Test Varış 2'
    },
    manualDriverInfo: {
      name: 'Test Manuel Şoför',
      phone: '+905551234567',
      plateNumber: '34 TEST 123',
      price: 80
    }
  };

  try {
    // Test 1: Sistem şoförü nakit ödeme
    console.log('🔄 Test 1: Sistem şoförü nakit ödeme...');
    const result1 = await updateDriverFinancials('test-reservation-1', testReservation1);
    console.log('✅ Test 1 Sonucu:', result1);

    // Test 2: Manuel şoför kart ödeme
    console.log('🔄 Test 2: Manuel şoför kart ödeme...');
    const result2 = await updateDriverFinancials('test-reservation-2', testReservation2);
    console.log('✅ Test 2 Sonucu:', result2);

    console.log('🎉 Tüm testler başarıyla tamamlandı!');
    
    return {
      success: true,
      results: [result1, result2]
    };
    
  } catch (error) {
    console.error('❌ Test hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

console.log('🧪 Finansal test fonksiyonu yüklendi! Geliştirici konsolunda "testFinancialSystem()" çalıştırın.');
