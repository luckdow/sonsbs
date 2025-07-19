// Firebase vehicles test script
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784",
  measurementId: "G-G4FRHCJEDP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testVehicles() {
  try {
    console.log('🔍 Firebase vehicles collection kontrol ediliyor...');
    
    const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
    
    console.log('📊 Toplam araç sayısı:', vehiclesSnapshot.docs.length);
    
    vehiclesSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`🚗 Araç ${index + 1}:`, {
        id: doc.id,
        name: data.name || 'İsimsiz',
        kmRate: data.kmRate || 'Belirtilmemiş',
        status: data.status || 'Durum yok',
        capacity: data.capacity || 'Kapasite yok',
        type: data.type || 'Tip yok'
      });
    });
    
  } catch (error) {
    console.error('❌ Firebase hatası:', error);
  }
}

// Test fonksiyonunu çalıştır
testVehicles();
