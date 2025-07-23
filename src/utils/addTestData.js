import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Test rezervasyonu ekle
export const addTestReservation = async () => {
  try {
    console.log('🧪 Test rezervasyonu ekleniyor...');
    
    const testReservation = {
      reservationId: 'SBS' + Date.now(),
      reservationCode: 'SBS' + Date.now(),
      status: 'completed', // Tamamlanmış olarak ekle
      customerInfo: {
        firstName: 'Test',
        lastName: 'Müşteri',
        phone: '+905551234567',
        email: 'test@example.com'
      },
      tripDetails: {
        date: '2025-07-23',
        time: '14:30',
        tripType: 'one-way',
        pickupLocation: 'Antalya Havalimanı',
        dropoffLocation: 'Lara Otelleri',
        passengerCount: 2,
        luggageCount: 2,
        flightNumber: 'TK123'
      },
      paymentMethod: 'cash', // Nakit ödeme
      totalPrice: 120,
      assignedDriver: 'manual', // Manuel şoför
      manualDriverInfo: {
        name: 'Ali Veli',
        phone: '+905551111111',
        price: 80, // Şoföre 80€, bize 40€ kalır
        plateNumber: '07 ABC 123'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date(), // Tamamlanma tarihi
      completedBy: 'admin-test',
      completionMethod: 'manual',
      financialProcessed: true
    };

    const docRef = await addDoc(collection(db, 'reservations'), testReservation);
    console.log('✅ Test rezervasyonu eklendi:', docRef.id);
    
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Test rezervasyonu eklenirken hata:', error);
    throw error;
  }
};

// Test sistem şoförü ekle
export const addTestSystemDriver = async () => {
  try {
    console.log('🧪 Test sistem şoförü ekleniyor...');
    
    const testDriver = {
      firstName: 'Mehmet',
      lastName: 'Şoför',
      email: 'mehmet@sofor.com',
      phone: '+905552222222',
      role: 'driver',
      commission: 20, // %20 komisyon
      balance: 0, // Başlangıç bakiyesi
      totalEarnings: 0,
      totalCommission: 0,
      completedTrips: 0,
      transactions: [],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const docRef = await addDoc(collection(db, 'users'), testDriver);
    console.log('✅ Test sistem şoförü eklendi:', docRef.id);
    
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Test sistem şoförü eklenirken hata:', error);
    throw error;
  }
};

// Test sistem şoförü rezervasyonu ekle
export const addTestSystemDriverReservation = async (driverId) => {
  try {
    console.log('🧪 Test sistem şoförü rezervasyonu ekleniyor...');
    
    const testReservation = {
      reservationId: 'SBS' + (Date.now() + 1),
      reservationCode: 'SBS' + (Date.now() + 1),
      status: 'completed',
      customerInfo: {
        firstName: 'Test2',
        lastName: 'Müşteri2',
        phone: '+905553334444',
        email: 'test2@example.com'
      },
      tripDetails: {
        date: '2025-07-23',
        time: '16:00',
        tripType: 'one-way',
        pickupLocation: 'Kemer Otelleri',
        dropoffLocation: 'Antalya Havalimanı',
        passengerCount: 3,
        luggageCount: 3,
        flightNumber: 'TK456'
      },
      paymentMethod: 'card', // Kart ödeme
      totalPrice: 150,
      assignedDriver: driverId, // Sistem şoförü
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date(),
      completedBy: 'admin-test',
      completionMethod: 'manual',
      financialProcessed: true
    };

    const docRef = await addDoc(collection(db, 'reservations'), testReservation);
    console.log('✅ Test sistem şoförü rezervasyonu eklendi:', docRef.id);
    
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Test sistem şoförü rezervasyonu eklenirken hata:', error);
    throw error;
  }
};

// Test manuel gider ekle
export const addTestManualExpense = async () => {
  try {
    console.log('🧪 Test manuel gider ekleniyor...');
    
    const testExpense = {
      category: 'fuel',
      amount: 50,
      description: 'Test yakıt gideri',
      date: new Date(),
      createdAt: new Date().toISOString(),
      createdBy: 'admin-test'
    };

    const docRef = await addDoc(collection(db, 'manual_expenses'), testExpense);
    console.log('✅ Test manuel gider eklendi:', docRef.id);
    
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Test manuel gider eklenirken hata:', error);
    throw error;
  }
};

// Tüm test verilerini ekle
export const addAllTestData = async () => {
  try {
    console.log('🧪 Tüm test verileri ekleniyor...');
    
    // 1. Manuel şoför rezervasyonu ekle
    const manualReservationId = await addTestReservation();
    
    // 2. Sistem şoförü ekle
    const driverId = await addTestSystemDriver();
    
    // 3. Sistem şoförü rezervasyonu ekle
    const systemReservationId = await addTestSystemDriverReservation(driverId);
    
    // 4. Manuel gider ekle
    const expenseId = await addTestManualExpense();
    
    console.log('✅ Tüm test verileri başarıyla eklendi:', {
      manualReservationId,
      driverId,
      systemReservationId,
      expenseId
    });
    
    return {
      manualReservationId,
      driverId,
      systemReservationId,
      expenseId
    };
    
  } catch (error) {
    console.error('❌ Test verileri eklenirken hata:', error);
    throw error;
  }
};
