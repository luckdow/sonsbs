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

  const message = `🚗 *SONSBS TRANSFER SERVİSİ*
*Rezervasyon Detayları*

📋 *Rezervasyon No:* ${reservation.reservationId}
👤 *Müşteri:* ${reservation.customerInfo?.firstName} ${reservation.customerInfo?.lastName}
📞 *Telefon:* ${reservation.customerInfo?.phone}

📅 *Tarih:* ${formatDate(reservation.tripDetails?.date)}
🕐 *Saat:* ${reservation.tripDetails?.time}

📍 *Kalkış:* ${formatLocation(reservation.tripDetails?.pickupLocation)}
📍 *Varış:* ${formatLocation(reservation.tripDetails?.dropoffLocation)}

👥 *Yolcu Sayısı:* ${reservation.tripDetails?.passengerCount || 1} kişi
🧳 *Bagaj:* ${reservation.tripDetails?.luggageCount || 0} adet

💰 *Seyahat Ücreti:* ${price} ₺

🚙 *Araç Plakası:* ${driverInfo.plateNumber}

---
*Lütfen belirlenen saatte hazır olunuz.*
*İyi yolculuklar dileriz! 🛣️*

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

  const message = `🚗 *SONSBS TRANSFER SERVİSİ*
*Seyahat Görevi*

Merhaba ${manualDriver.name},

📋 *Rezervasyon No:* ${reservation.reservationId}
👤 *Müşteri:* ${reservation.customerInfo?.firstName} ${reservation.customerInfo?.lastName}
📞 *Müşteri Tel:* ${reservation.customerInfo?.phone}

📅 *Tarih:* ${formatDate(reservation.tripDetails?.date)}
🕐 *Saat:* ${reservation.tripDetails?.time}

📍 *Kalkış Noktası:* ${formatLocation(reservation.tripDetails?.pickupLocation)}
📍 *Varış Noktası:* ${formatLocation(reservation.tripDetails?.dropoffLocation)}

👥 *Yolcu Sayısı:* ${reservation.tripDetails?.passengerCount || 1} kişi
🧳 *Bagaj:* ${reservation.tripDetails?.luggageCount || 0} adet

💰 *Seyahat Ücreti:* ${manualDriver.price} ₺
🚙 *Araç Plakası:* ${manualDriver.plateNumber}

---
*Lütfen belirlenen saatte hazır olunuz.*
*Güvenli yolculuklar! 🛣️*

_SONSBS Transfer Servisi_
_Rezervasyon Yönetimi_`;

  return message;
};
