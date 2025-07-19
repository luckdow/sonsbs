import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Demo şoför verileri
const demoDrivers = [
  {
    firstName: 'Mehmet',
    lastName: 'Yılmaz',
    phone: '+90 555 123 45 67',
    email: 'mehmet.yilmaz@sbs.com',
    licenseNumber: '12345678901',
    licenseExpiry: '2025-12-31',
    status: 'active',
    assignedVehicle: 'vehicle1',
    totalTrips: 156,
    commission: 28,
    joinDate: '2023-01-15',
    address: 'Muratpaşa, Antalya',
    emergencyContact: '+90 555 987 65 43',
    bloodType: 'A+',
    profileImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    firstName: 'Ali',
    lastName: 'Karaca',
    phone: '+90 555 987 65 43',
    email: 'ali.karaca@sbs.com',
    licenseNumber: '09876543210',
    licenseExpiry: '2024-08-15',
    status: 'active',
    assignedVehicle: 'vehicle2',
    totalTrips: 203,
    commission: 32,
    joinDate: '2022-11-20',
    address: 'Kepez, Antalya',
    emergencyContact: '+90 555 123 45 67',
    bloodType: 'B+',
    profileImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    firstName: 'Fatma',
    lastName: 'Öztürk',
    phone: '+90 555 456 78 90',
    email: 'fatma.ozturk@sbs.com',
    licenseNumber: '55555555555',
    licenseExpiry: '2026-03-10',
    status: 'inactive',
    assignedVehicle: null,
    totalTrips: 89,
    commission: 25,
    joinDate: '2023-06-10',
    address: 'Konyaaltı, Antalya',
    emergencyContact: '+90 555 111 22 33',
    bloodType: 'O+',
    profileImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Demo araç verileri
const demoVehicles = [
  {
    brand: 'Mercedes',
    model: 'Vito',
    plateNumber: '07ABC123',
    capacity: 8,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    brand: 'Ford',
    model: 'Transit',
    plateNumber: '07DEF456',
    capacity: 12,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    brand: 'Volkswagen',
    model: 'Crafter',
    plateNumber: '07GHI789',
    capacity: 16,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initializeFirebaseData = async () => {
  try {
    console.log('Firebase başlangıç verileri kontrol ediliyor...');
    
    // Şoför koleksiyonunu kontrol et
    const driversSnapshot = await getDocs(collection(db, 'drivers'));
    if (driversSnapshot.empty) {
      console.log('Şoför verisi yok, demo veriler ekleniyor...');
      for (const driver of demoDrivers) {
        await addDoc(collection(db, 'drivers'), driver);
      }
      console.log('Demo şoför verileri eklendi');
    } else {
      console.log('Şoför verisi mevcut:', driversSnapshot.docs.length, 'kayıt');
    }

    // Araç koleksiyonunu kontrol et
    const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
    if (vehiclesSnapshot.empty) {
      console.log('Araç verisi yok, demo veriler ekleniyor...');
      for (const vehicle of demoVehicles) {
        await addDoc(collection(db, 'vehicles'), vehicle);
      }
      console.log('Demo araç verileri eklendi');
    } else {
      console.log('Araç verisi mevcut:', vehiclesSnapshot.docs.length, 'kayıt');
    }

    console.log('Firebase başlangıç verileri hazır!');
  } catch (error) {
    console.error('Firebase başlangıç verilerini eklerken hata:', error);
    throw error;
  }
};

// Demo Settings verilerini ekle
export const initializeSettings = async () => {
  try {
    // Settings koleksiyonunu kontrol et
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    
    if (settingsSnapshot.empty) {
      console.log('Settings verisi ekleniyor...');
      
      // Demo settings verisi
      const demoSettings = {
        general: {
          companyName: 'SBS Transfer',
          companyEmail: 'info@sbstransfer.com',
          companyPhone: '+90 555 123 45 67',
          companyAddress: 'İstanbul, Türkiye',
          companyDescription: 'Premium transfer hizmetleri',
          website: 'https://sbstransfer.com',
          logo: '',
          favicon: ''
        },
        payment: {
          paytrMerchantId: 'demo_merchant_id',
          paytrMerchantKey: 'demo_merchant_key',
          paytrMerchantSalt: 'demo_merchant_salt',
          testMode: true,
          enabledMethods: {
            cash: true,
            creditCard: true,
            bankTransfer: true,
            paytr: false // Başlangıçta kapalı
          },
          currency: 'TRY',
          taxRate: 18
        },
        bankAccounts: [
          {
            id: 1,
            bankName: 'Türkiye İş Bankası',
            accountHolder: 'SBS Transfer Hizmetleri Ltd. Şti.',
            iban: 'TR33 0006 4000 0011 2345 6789 01',
            branch: 'Ataşehir Şubesi',
            currency: 'TL',
            isActive: true
          },
          {
            id: 2,
            bankName: 'Garanti BBVA',
            accountHolder: 'SBS Transfer Hizmetleri Ltd. Şti.',
            iban: 'TR64 0062 0001 2345 6789 1011 12',
            branch: 'Kadıköy Şubesi',
            currency: 'TL',
            isActive: true
          }
        ],
        commission: {
          defaultDriverCommission: 70,
          companyCommission: 30,
          minimumCommission: 50,
          maximumCommission: 90,
          paymentFrequency: 'weekly'
        },
        notifications: {
          email: {
            newReservation: true,
            reservationUpdate: true,
            driverAssignment: true,
            paymentReceived: true,
            cancellation: true,
            weeklyReport: true
          },
          sms: {
            reservationConfirmation: true,
            driverAssignment: true,
            paymentReminder: false,
            promotions: false
          },
          push: {
            newReservation: true,
            statusUpdate: true,
            promotions: false
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Settings dokümanını ekle
      await setDoc(doc(db, 'settings', 'main'), demoSettings);
      console.log('Settings verisi eklendi!');
    } else {
      console.log('Settings verisi mevcut:', settingsSnapshot.docs.length, 'kayıt');
    }
  } catch (error) {
    console.error('Settings verilerini eklerken hata:', error);
    throw error;
  }
};
