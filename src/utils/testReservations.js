import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { updateDriverFinancials } from './financialIntegration_IMPROVED';

/**
 * Test rezervasyonu oluştur ve finansal sistemi test et
 */
export const createTestReservation = async () => {
  try {
    console.log('🧪 Test rezervasyonu oluşturuluyor...');
    
    // Test rezervasyon verisi
    const testReservation = {
      customerInfo: {
        firstName: 'Test',
        lastName: 'Müşteri',
        phone: '+905551234567',
        email: 'test@example.com'
      },
      tripDetails: {
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        pickupLocation: 'Antalya Havalimanı',
        dropoffLocation: 'Kaleici Otel',
        distance: 15
      },
      vehicleType: 'sedan',
      totalPrice: 100,
      paymentMethod: 'cash', // Test için nakit ödeme
      assignedDriver: 'test-driver-id',
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Rezervasyonu Firebase'e ekle
    const docRef = await addDoc(collection(db, 'reservations'), testReservation);
    console.log('✅ Test rezervasyonu oluşturuldu:', docRef.id);

    // Rezervasyonu tamamla ve finansal güncellemeleri yap
    const completedReservation = {
      ...testReservation,
      status: 'completed',
      completedAt: serverTimestamp()
    };

    // Finansal entegrasyonu test et
    const financialResult = await updateDriverFinancials(docRef.id, completedReservation);
    console.log('💰 Finansal güncelleme sonucu:', financialResult);

    return {
      success: true,
      reservationId: docRef.id,
      financialResult
    };

  } catch (error) {
    console.error('❌ Test rezervasyon hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Manuel şoför test rezervasyonu
 */
export const createManualDriverTestReservation = async () => {
  try {
    const testReservation = {
      customerInfo: {
        firstName: 'Test',
        lastName: 'Manuel Müşteri',
        phone: '+905551234568',
        email: 'manuel@example.com'
      },
      tripDetails: {
        date: new Date().toISOString().split('T')[0],
        time: '16:00',
        pickupLocation: 'Belek',
        dropoffLocation: 'Side',
        distance: 20
      },
      vehicleType: 'sedan',
      totalPrice: 150,
      paymentMethod: 'card', // Kart ödeme
      assignedDriver: 'manual',
      manualDriverInfo: {
        name: 'Test Manuel Şoför',
        phone: '+905551234569',
        plateNumber: '07 TEST 123',
        price: 120 // Şoföre ödenecek miktar
      },
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'reservations'), testReservation);
    console.log('✅ Manuel şoför test rezervasyonu oluşturuldu:', docRef.id);

    // Rezervasyonu tamamla
    const completedReservation = {
      ...testReservation,
      status: 'completed',
      completedAt: serverTimestamp()
    };

    const financialResult = await updateDriverFinancials(docRef.id, completedReservation);
    console.log('💰 Manuel şoför finansal güncelleme:', financialResult);

    return {
      success: true,
      reservationId: docRef.id,
      financialResult
    };

  } catch (error) {
    console.error('❌ Manuel şoför test hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Global fonksiyonlar
window.createTestReservation = createTestReservation;
window.createManualDriverTestReservation = createManualDriverTestReservation;

console.log('🧪 Test fonksiyonları yüklendi:');
console.log('- createTestReservation() - Sistem şoförü nakit ödeme testi');
console.log('- createManualDriverTestReservation() - Manuel şoför kart ödeme testi');
