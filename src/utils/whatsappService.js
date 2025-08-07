// WhatsApp Web API kullanarak mesaj gönderme servisi

/**
 * WhatsApp Web'de mesaj gönderir
 * @param {string} phoneNumber - Telefon numarası (+90 formatında)
 *    const message = `SBS TRANSFER HİZMETLERİ LTD. ŞTİ.
Seyahat Talebionst message = `SBS TRANSFER HİZMETLERİ LTD. ŞTİ.
Yeni Seyahat Göreviaram {string} message - Gönderilecek mesaj
 */
export const sendWhatsAppMessage = (phoneNumber, message) => {
  try {
    // Telefon numarasını temizle (sadece rakamlar)
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    
    console.log('📱 WhatsApp gönderim başlatılıyor:', {
      originalPhone: phoneNumber,
      cleanPhone: cleanPhone,
      messageLength: message.length
    });
    
    // Mesajı URL encode et
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp Web URL'si
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    console.log('🔗 WhatsApp URL oluşturuldu:', whatsappUrl);
    
    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobil cihazlarda doğrudan yönlendir
      window.location.href = whatsappUrl;
      console.log('📱 Mobil cihaz - doğrudan yönlendirme yapıldı');
      return true;
    } else {
      // Masaüstünde önce popup dene, sonra direct link
      const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (opened && !opened.closed) {
        console.log('✅ WhatsApp penceresi açıldı');
        return true;
      } else {
        console.log('⚠️ Popup engellendi, direct link ile açılıyor...');
        
        // Popup engellenirse doğrudan yönlendir
        window.location.href = whatsappUrl;
        return true;
      }
    }
  } catch (error) {
    console.error('❌ WhatsApp gönderim hatası:', error);
    return false;
  }
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

  const message = `SBS TRANSFER HİZMETLERİ LTD. ŞTİ.
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

Seyahat Ucreti: ${price} EUR

Arac Plakasi: ${driverInfo.plateNumber}

---
*Lutfen belirlenen saatte hazir olunuz.*
*Iyi yolculuklar dileriz!*

_SBS Transfer Hizmetleri Ltd. Şti._`;

  return message;
};

/**
 * Manuel şoför ataması için özel WhatsApp mesajı (QR Link ile)
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

  // Manuel şoför için özel link oluştur
  const manualDriverLink = `${window.location.origin}/manual-driver/${reservation.id}`;

  // Ödeme tipine göre mesaj oluştur
  let paymentInfo = '';
  if (reservation.paymentMethod === 'cash') {
    paymentInfo = `ODEME TIPI: NAKIT
ONEMLI: Musteriden ${reservation.totalPrice} EUR nakit alacaksiniz.
Sizin hak edisiniz: ${manualDriver.price} EUR
Firmaya verecegınız: ${(reservation.totalPrice - manualDriver.price).toFixed(2)} EUR`;
  } else {
    paymentInfo = `ODEME TIPI: KREDI KARTI / BANKA HAVALESI
Musteri online odeme yapti.
Sizin hak edisiniz: ${manualDriver.price} EUR
(Hak edisinizi firmadan alacaksiniz)`;
  }

  const message = `SBS TRANSFER HİZMETLERİ LTD. ŞTİ.
Yeni Seyahat Gorevi

Merhaba ${manualDriver.name},

REZERVASYON NO: ${reservation.reservationId}
MUSTERI: ${reservation.customerInfo?.firstName} ${reservation.customerInfo?.lastName}
TELEFON: ${reservation.customerInfo?.phone}

TARIH: ${formatDate(reservation.tripDetails?.date)}
SAAT: ${reservation.tripDetails?.time}

NEREDEN: ${formatLocation(reservation.tripDetails?.pickupLocation)}
NEREYE: ${formatLocation(reservation.tripDetails?.dropoffLocation)}

YOLCU: ${reservation.tripDetails?.passengerCount || 1} kisi

${paymentInfo}

YOLCULUK YONETIMI:
${manualDriverLink}

Bu link ile yolculugu baslatip tamamlayabilirsiniz.

Iyi yolculuklar.

SBS Transfer Hizmetleri Ltd. Şti.`;

  return message;
};

/**
 * Manuel şoföre WhatsApp mesajı gönder
 * @param {Object} reservation - Rezervasyon bilgileri
 * @param {Object} manualDriver - Manuel şoför bilgileri
 */
export const sendManualDriverWhatsApp = (reservation, manualDriver) => {
  try {
    console.log('📤 Manuel şoför WhatsApp gönderim başlatılıyor:', {
      driverName: manualDriver.name,
      driverPhone: manualDriver.phone,
      reservationId: reservation.reservationId
    });

    const message = generateManualDriverWhatsAppMessage(reservation, manualDriver);
    console.log('📝 WhatsApp mesajı oluşturuldu:', message);
    
    const success = sendWhatsAppMessage(manualDriver.phone, message);
    
    if (success) {
      console.log('✅ Manuel şoför WhatsApp gönderimi başarılı');
    } else {
      console.error('❌ Manuel şoför WhatsApp gönderimi başarısız');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Manuel şoför WhatsApp gönderim hatası:', error);
    return false;
  }
};
