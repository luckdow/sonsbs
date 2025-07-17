import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { USER_ROLES, FIREBASE_COLLECTIONS } from '../config/constants';

// Demo hesapları oluşturma fonksiyonu
export const createDemoAccounts = async () => {
  const demoAccounts = [
    {
      email: 'admin@sbstransfer.com',
      password: 'admin123',
      userData: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '555 123 4567',
        role: USER_ROLES.ADMIN
      }
    },
    {
      email: 'sofor@sbstransfer.com',
      password: 'sofor123',
      userData: {
        firstName: 'Şoför',
        lastName: 'Demo',
        phone: '555 234 5678',
        role: USER_ROLES.DRIVER
      }
    },
    {
      email: 'musteri@sbstransfer.com',
      password: 'musteri123',
      userData: {
        firstName: 'Müşteri',
        lastName: 'Demo',
        phone: '555 345 6789',
        role: USER_ROLES.CUSTOMER
      }
    }
  ];

  const results = [];

  for (const account of demoAccounts) {
    try {
      console.log(`Creating demo account: ${account.email}`);
      
      // Create auth account
      const result = await createUserWithEmailAndPassword(auth, account.email, account.password);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: `${account.userData.firstName} ${account.userData.lastName}`
      });

      // Save user profile to Firestore
      const userProfile = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: account.userData.firstName,
        lastName: account.userData.lastName,
        phone: account.userData.phone,
        role: account.userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isDemoAccount: true
      };

      await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid), userProfile);
      
      results.push({
        success: true,
        email: account.email,
        role: account.userData.role
      });
      
      console.log(`✅ Demo account created: ${account.email} (${account.userData.role})`);
      
    } catch (error) {
      console.error(`❌ Failed to create demo account ${account.email}:`, error);
      results.push({
        success: false,
        email: account.email,
        error: error.message
      });
    }
  }

  return results;
};

// Demo verileri oluşturma fonksiyonu
export const createDemoData = async () => {
  try {
    // Demo araçlar
    const demoVehicles = [
      {
        id: 'vehicle-1',
        brand: 'Mercedes',
        model: 'Vito',
        year: 2022,
        capacity: 8,
        pricePerKm: 15,
        plateNumber: '34 ABC 123',
        status: 'active',
        features: ['AC', 'Wi-Fi', 'USB'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'vehicle-2',
        brand: 'Volkswagen',
        model: 'Crafter',
        year: 2021,
        capacity: 16,
        pricePerKm: 18,
        plateNumber: '34 DEF 456',
        status: 'active',
        features: ['AC', 'Wi-Fi', 'Baggage'],
        createdAt: new Date().toISOString()
      }
    ];

    // Demo extra services
    const demoServices = [
      {
        id: 'service-1',
        name: 'Bebek Koltuğu',
        price: 50,
        description: 'Güvenli bebek koltuğu hizmeti',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'service-2',
        name: 'Özel İkram',
        price: 25,
        description: 'Su ve atıştırmalık ikramı',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Firestore'a kaydet
    for (const vehicle of demoVehicles) {
      await setDoc(doc(db, 'vehicles', vehicle.id), vehicle);
    }

    for (const service of demoServices) {
      await setDoc(doc(db, 'extraServices', service.id), service);
    }

    console.log('✅ Demo data created successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to create demo data:', error);
    return { success: false, error: error.message };
  }
};

// Tüm demo setup'ı çalıştırma
export const setupDemoEnvironment = async () => {
  console.log('🚀 Setting up demo environment...');
  
  const accountResults = await createDemoAccounts();
  const dataResult = await createDemoData();
  
  console.log('📊 Demo accounts:', accountResults);
  console.log('📊 Demo data:', dataResult);
  
  return {
    accounts: accountResults,
    data: dataResult
  };
};
