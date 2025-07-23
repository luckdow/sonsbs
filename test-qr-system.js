// QR Kod Sistemi Test
// Bu test QR kod sisteminin çalışıp çalışmadığını kontrol eder

import QRCode from 'qrcode';

async function testQRGeneration() {
  console.log('🔍 QR Kod Sistemi Test Başlatılıyor...\n');
  
  // Test verisi
  const testReservation = {
    id: 'test123',
    reservationId: 'SBS-TEST123',
    customerInfo: {
      firstName: 'Test',
      lastName: 'Müşteri',
      phone: '+90555123456'
    },
    tripDetails: {
      pickupLocation: 'Antalya Havalimanı',
      dropoffLocation: 'Kemer Merkez',
      date: '2025-01-15',
      time: '14:30'
    }
  };

  const qrData = {
    reservationId: testReservation.id, // Gerçek Firebase ID
    reservationCode: testReservation.reservationId, // Görüntüleme kodu
    customerName: `${testReservation.customerInfo.firstName} ${testReservation.customerInfo.lastName}`,
    pickup: testReservation.tripDetails.pickupLocation,
    dropoff: testReservation.tripDetails.dropoffLocation,
    date: testReservation.tripDetails.date,
    time: testReservation.tripDetails.time,
    phone: testReservation.customerInfo.phone,
    verifyUrl: `http://localhost:3001/driver-qr`
  };

  const qrString = JSON.stringify(qrData);

  try {
    // QR kod stringi oluştur
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    console.log('✅ QR Kod başarıyla oluşturuldu!');
    console.log('📋 QR İçeriği:', JSON.stringify(qrData, null, 2));
    console.log('🔗 QR Data URL uzunluğu:', qrCodeDataURL.length, 'karakter');
    console.log('🎯 Doğrulama URL\'si:', qrData.verifyUrl);
    
    // JSON parse test
    try {
      const parsedData = JSON.parse(qrString);
      console.log('✅ QR içeriği başarıyla parse edildi');
      console.log('👤 Müşteri:', parsedData.customerName);
      console.log('🚗 Güzergah:', `${parsedData.pickup} → ${parsedData.dropoff}`);
    } catch (parseError) {
      console.log('❌ QR içeriği parse edilemedi:', parseError.message);
    }
    
  } catch (error) {
    console.log('❌ QR Kod oluşturulamadı:', error.message);
  }
  
  console.log('\n🎉 QR Kod Sistemi Test Tamamlandı!');
}

testQRGeneration();
