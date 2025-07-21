import { db } from './src/config/firebase.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Test Firebase connection and vehicles collection
async function testFirebase() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test basic connection
    console.log('Database instance:', db.app.name);
    
    // Try to read vehicles collection
    console.log('Checking vehicles collection...');
    const vehiclesRef = collection(db, 'vehicles');
    const snapshot = await getDocs(vehiclesRef);
    
    console.log('Vehicles found:', snapshot.size);
    
    if (snapshot.empty) {
      console.log('No vehicles found. Adding demo vehicles...');
      
      // Add demo vehicles
      const demoVehicles = [
        {
          name: 'Mercedes E-Class',
          description: 'Luxury sedan for comfortable travel',
          capacity: 4,
          luggage: 3,
          basePrice: 200,
          pricePerKm: 3.5,
          status: 'active',
          image: '',
          features: ['AC', 'Leather seats', 'GPS'],
          category: 'sedan'
        },
        {
          name: 'Mercedes Vito',
          description: 'Spacious van for group travel',
          capacity: 8,
          luggage: 6,
          basePrice: 350,
          pricePerKm: 5,
          status: 'active',
          image: '',
          features: ['AC', 'Large space', 'GPS'],
          category: 'van'
        },
        {
          name: 'Mercedes Sprinter',
          description: 'Large van for big groups',
          capacity: 15,
          luggage: 10,
          basePrice: 500,
          pricePerKm: 7,
          status: 'active',
          image: '',
          features: ['AC', 'Very large space', 'GPS'],
          category: 'minibus'
        }
      ];
      
      for (const vehicle of demoVehicles) {
        await addDoc(vehiclesRef, vehicle);
        console.log('Added vehicle:', vehicle.name);
      }
      
    } else {
      snapshot.forEach(doc => {
        console.log('Vehicle:', doc.id, doc.data());
      });
    }
    
  } catch (error) {
    console.error('Firebase test error:', error);
  }
}

testFirebase();
