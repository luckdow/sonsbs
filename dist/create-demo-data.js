import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/config/firebase';

/**
 * Demo verileri oluşturmak için yardımcı fonksiyon
 */
export const createDemoData = async () => {
  try {
    console.log('🎭 Demo verileri oluşturuluyor...');

    // Demo rezervasyonları
    const demoReservations = [
      {
        customerInfo: {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          phone: '+905551234567',
          email: 'ahmet@example.com'
        },
        tripDetails: {
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          pickupLocation: 'Antalya Havalimanı',
          dropoffLocation: 'Kaleici Otel',
          distance: 15
        },
        vehicleType: 'sedan',
        totalPrice: 45, // Euro
        paymentMethod: 'cash',
        assignedDriver: 'system-driver-1',
        status: 'completed',
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        customerInfo: {
          firstName: 'Melissa',
          lastName: 'Johnson',
          phone: '+905559876543',
          email: 'melissa@example.com'
        },
        tripDetails: {
          date: new Date().toISOString().split('T')[0],
          time: '14:00',
          pickupLocation: 'Belek Otel',
          dropoffLocation: 'Antalya Havalimanı',
          distance: 25
        },
        vehicleType: 'vip',
        totalPrice: 80, // Euro
        paymentMethod: 'card',
        assignedDriver: 'system-driver-2',
        status: 'completed',
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        customerInfo: {
          firstName: 'Hans',
          lastName: 'Mueller',
          phone: '+905557654321',
          email: 'hans@example.com'
        },
        tripDetails: {
          date: new Date().toISOString().split('T')[0],
          time: '16:30',
          pickupLocation: 'Side Otel',
          dropoffLocation: 'Manavgat',
          distance: 20
        },
        vehicleType: 'sedan',
        totalPrice: 120, // Euro
        paymentMethod: 'card',
        assignedDriver: 'manual',
        manualDriverInfo: {
          name: 'Mehmet Koç',
          phone: '+905551111111',
          plateNumber: '07 ABC 123',
          price: 100 // Şoföre ödenecek miktar
        },
        status: 'completed',
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        customerInfo: {
          firstName: 'Sarah',
          lastName: 'Smith',
          phone: '+905554444444',
          email: 'sarah@example.com'
        },
        tripDetails: {
          date: new Date().toISOString().split('T')[0],
          time: '18:00',
          pickupLocation: 'Alanya Otel',
          dropoffLocation: 'Antalya Merkez',
          distance: 40
        },
        vehicleType: 'vip',
        totalPrice: 150, // Euro
        paymentMethod: 'cash',
        assignedDriver: 'system-driver-3',
        status: 'completed',
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // Demo sistem şoförlerini oluştur
    const demoDrivers = [
      {
        userId: 'system-driver-1',
        personalInfo: {
          firstName: 'Ali',
          lastName: 'Demir',
          phone: '+905551111111',
          email: 'ali@company.com'
        },
        licenseInfo: {
          licenseNumber: 'D123456789',
          expiryDate: '2026-12-31'
        },
        vehicleInfo: {
          plateNumber: '07 AA 123',
          model: 'Mercedes E-Class',
          year: 2020
        },
        financialInfo: {
          commissionRate: 0.15, // %15 komisyon
          balance: 0
        },
        isActive: true,
        role: 'driver',
        createdAt: serverTimestamp()
      },
      {
        userId: 'system-driver-2',
        personalInfo: {
          firstName: 'Mustafa',
          lastName: 'Özkan',
          phone: '+905552222222',
          email: 'mustafa@company.com'
        },
        licenseInfo: {
          licenseNumber: 'D987654321',
          expiryDate: '2025-06-30'
        },
        vehicleInfo: {
          plateNumber: '07 BB 456',
          model: 'BMW 5 Series',
          year: 2019
        },
        financialInfo: {
          commissionRate: 0.15,
          balance: 0
        },
        isActive: true,
        role: 'driver',
        createdAt: serverTimestamp()
      },
      {
        userId: 'system-driver-3',
        personalInfo: {
          firstName: 'Hasan',
          lastName: 'Kaya',
          phone: '+905553333333',
          email: 'hasan@company.com'
        },
        licenseInfo: {
          licenseNumber: 'D555666777',
          expiryDate: '2027-03-15'
        },
        vehicleInfo: {
          plateNumber: '07 CC 789',
          model: 'Audi A6',
          year: 2021
        },
        financialInfo: {
          commissionRate: 0.15,
          balance: 0
        },
        isActive: true,
        role: 'driver',
        createdAt: serverTimestamp()
      }
    ];

    // Rezervasyonları ekle
    console.log('📝 Demo rezervasyonları ekleniyor...');
    for (const reservation of demoReservations) {
      await addDoc(collection(db, 'reservations'), reservation);
    }

    // Şoförleri ekle
    console.log('👨‍💼 Demo şöförler ekleniyor...');
    for (const driver of demoDrivers) {
      await addDoc(collection(db, 'users'), driver);
    }

    console.log('✅ Demo veriler başarıyla oluşturuldu!');
    console.log('📊 Finansal dashboard artık gerçek verileri gösterecek');
    
    return {
      success: true,
      message: 'Demo veriler oluşturuldu',
      stats: {
        reservations: demoReservations.length,
        drivers: demoDrivers.length,
        totalRevenue: demoReservations.reduce((sum, r) => sum + r.totalPrice, 0)
      }
    };

  } catch (error) {
    console.error('❌ Demo veri oluşturma hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Global fonksiyon olarak tanımla
window.createDemoData = createDemoData;

console.log('🎭 Demo veri fonksiyonu hazır!');
console.log('Konsola "createDemoData()" yazarak demo verileri oluşturabilirsiniz.');
