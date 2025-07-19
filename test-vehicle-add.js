// Test araç ekleme scripti
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw",
  authDomain: "sbs-transfer-platform.firebaseapp.com",
  projectId: "sbs-transfer-platform",
  storageBucket: "sbs-transfer-platform.firebasestorage.app",
  messagingSenderId: "970517568935",
  appId: "1:970517568935:web:65b0eeb87b2a3d36b86c77"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestVehicle() {
  try {
    const testVehicle = {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      plateNumber: '07 ABC 123',
      capacity: 4,
      kmRate: 500, // 500 TL/km test
      color: 'Beyaz',
      status: 'active',
      fuelType: 'benzin',
      transmission: 'otomatik',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'vehicles'), testVehicle);
    console.log('Test araç eklendi, ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Test araç eklenirken hata:', error);
  }
}

// Fonksiyonu çalıştır
addTestVehicle();
