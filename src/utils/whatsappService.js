// WhatsApp Web API kullanarak mesaj gönderme servisi

/**
 * WhatsApp Web'de mesaj gönderir
 * @param {string} phoneNumber - Telefon numarası (+90 formatında)
 * @param {string} message - Gönderilecek mesaj
 */
export const sendWhatsAppMessage = (phoneNumber, message) => {
  // Telefon numarasını temizle (sadece rakamlar)
  const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
  
  // Mesajı URL encode et
  const encodedMessage = encodeURIComponent(message);
  
  // WhatsApp Web URL'si
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  
  // Yeni sekmede aç
  window.open(whatsappUrl, '_blank');
};

/**
 * Rezervasyon için WhatsApp mesaj formatı oluştur
 * @param {Object} reservation - Rezervasyon bilgileri
 * @param {Object} driverInfo - Şoför bilgileri
 * @param {number} price - Seyahat ücreti
 */
export const generateReservationWhatsAppMessage = (reservation, driverInfo, price) => {
  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      return location.address || location.name || location.formatted_address || location.description || 'Lokasyon bilgisi mevcut';
    }
    return String(location);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Belirtilmemiş';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const message = `SONSBS TRANSFER SERVISI
*Rezervasyon Detaylari*

Rezervasyon No: ${reservation.reservationId}
Musteri: ${reservation.customerInfo?.firstName} ${reservation.customerInfo?.lastName}
Telefon: ${reservation.customerInfo?.phone}

Tarih: ${formatDate(reservation.tripDetails?.date)}
Saat: ${reservation.tripDetails?.time}

Kalkis: ${formatLocation(reservation.tripDetails?.pickupLocation)}
Varis: ${formatLocation(reservation.tripDetails?.dropoffLocation)}

Yolcu Sayisi: ${reservation.tripDetails?.passengerCount || 1} kisi
Bagaj: ${reservation.tripDetails?.luggageCount || 0} adet

Seyahat Ucreti: ${price} TL

Arac Plakasi: ${driverInfo.plateNumber}

---
*Lutfen belirlenen saatte hazir olunuz.*
*Iyi yolculuklar dileriz!*

_SONSBS Transfer Servisi_`;

  return message;
};

/**
 * Manuel şoför ataması için özel WhatsApp mesajı
 * @param {Object} reservation - Rezervasyon bilgileri  
 * @param {Object} manualDriver - Manuel şoför bilgileri
 */
export const generateManualDriverWhatsAppMessage = (reservation, manualDriver) => {
  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      return location.address || location.name || location.formatted_address || location.description || 'Lokasyon bilgisi mevcut';
    }
    return String(location);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Belirtilmemiş';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Seyahat türünü belirle
  const tripTypeText = reservation.tripDetails?.tripType === 'round-trip' ? 'GIDIS DONUS' : 'TEK YON';
  
  // Uçuş bilgisi varsa ekle
  const flightInfo = reservation.tripDetails?.flightNumber ? 
    `Ucus Bilgisi: ${reservation.tripDetails.flightNumber}` : '';

  const message = `GATE TRAVEL REZARVASYON
*Seyahat Gorevi*

Merhaba ${manualDriver.name},

Rezervasyon No: ${reservation.reservationId}
Musteri: ${reservation.customerInfo?.firstName} ${reservation.customerInfo?.lastName}

Tarih: ${formatDate(reservation.tripDetails?.date)}
Saat: ${reservation.tripDetails?.time}
${flightInfo ? flightInfo + '\n' : ''}Seyahat Turu: ${tripTypeText}

Kalkis Noktasi: ${formatLocation(reservation.tripDetails?.pickupLocation)}
Varis Noktasi: ${formatLocation(reservation.tripDetails?.dropoffLocation)}

Yolcu Sayisi: ${reservation.tripDetails?.passengerCount || 1} kisi
Bagaj: ${reservation.tripDetails?.luggageCount || 0} adet

Seyahat Ucreti: ${manualDriver.price} TL
Arac Plakasi: ${manualDriver.plateNumber}

---
*Lutfen belirlenen saatte hazir olunuz.*
*Guvenli yolculuklar!*

GATE TRAVEL REZARVASYON SERVISI`;

  return message;
};
