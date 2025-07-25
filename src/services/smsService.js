import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// SMS servisi - Twilio kullanıyor
class SMSService {
  constructor() {
    this.twilio = null;
    this.settings = null;
  }

  // Ayarları Firebase'den yükle
  async loadSettings() {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        this.settings = {
          enableSMS: data.enableSMS || false,
          twilioAccountSid: data.twilioAccountSid || '',
          twilioAuthToken: data.twilioAuthToken || '',
          twilioPhoneNumber: data.twilioPhoneNumber || '',
          senderName: data.senderName || 'SBS Transfer'
        };
        
        // Twilio'yu başlat (sadece ayarlar varsa)
        if (this.settings.twilioAccountSid && this.settings.twilioAuthToken) {
          const Twilio = (await import('twilio')).default;
          this.twilio = new Twilio(this.settings.twilioAccountSid, this.settings.twilioAuthToken);
        }
      }
    } catch (error) {
      console.error('SMS ayarları yüklenirken hata:', error);
    }
  }

  // Rezervasyon onay SMS'i gönder
  async sendReservationConfirmation(reservationData) {
    if (!this.settings) {
      await this.loadSettings();
    }

    if (!this.settings?.enableSMS) {
      console.log('SMS gönderimi kapalı, SMS gönderilmedi');
      return { success: false, message: 'SMS gönderimi kapalı' };
    }

    const message = this.createReservationMessage(reservationData);
    return await this.sendSMS(reservationData.customerPhone, message);
  }

  // Ödeme onay SMS'i gönder
  async sendPaymentConfirmation(reservationData) {
    if (!this.settings) {
      await this.loadSettings();
    }

    if (!this.settings?.enableSMS) {
      console.log('SMS gönderimi kapalı, SMS gönderilmedi');
      return { success: false, message: 'SMS gönderimi kapalı' };
    }

    const message = this.createPaymentMessage(reservationData);
    return await this.sendSMS(reservationData.customerPhone, message);
  }

  // Şoför bilgileri SMS'i gönder
  async sendDriverInfo(reservationData, driverData) {
    if (!this.settings) {
      await this.loadSettings();
    }

    if (!this.settings?.enableSMS) {
      console.log('SMS gönderimi kapalı, SMS gönderilmedi');
      return { success: false, message: 'SMS gönderimi kapalı' };
    }

    const message = this.createDriverInfoMessage(reservationData, driverData);
    return await this.sendSMS(reservationData.customerPhone, message);
  }

  // SMS gönder (ana fonksiyon)
  async sendSMS(phoneNumber, message) {
    try {
      if (!this.twilio) {
        throw new Error('Twilio ayarları eksik');
      }

      if (!this.settings?.twilioPhoneNumber) {
        throw new Error('Twilio telefon numarası ayarlanmamış');
      }

      // Türkiye telefon numarası formatını düzenle
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const result = await this.twilio.messages.create({
        body: message,
        from: this.settings.twilioPhoneNumber,
        to: formattedPhone
      });

      console.log('SMS başarıyla gönderildi:', result.sid);
      return { 
        success: true, 
        messageId: result.sid,
        message: 'SMS başarıyla gönderildi' 
      };

    } catch (error) {
      console.error('SMS gönderim hatası:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'SMS gönderilemedi' 
      };
    }
  }

  // Telefon numarasını uluslararası formata çevir
  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Türkiye kodu ekleme
    let formatted = phone.replace(/\D/g, ''); // Sadece rakamlar
    
    if (formatted.startsWith('0')) {
      formatted = '90' + formatted.substring(1); // 0 ile başlıyorsa 90 ekle
    } else if (!formatted.startsWith('90')) {
      formatted = '90' + formatted; // 90 ile başlamıyorsa ekle
    }
    
    return '+' + formatted;
  }

  // Rezervasyon onay mesajı oluştur
  createReservationMessage(data) {
    return `🎉 ${this.settings?.senderName || 'SBS Transfer'}

✅ Rezervasyonunuz onaylandı!

📋 No: ${data.reservationNumber}
📅 Tarih: ${data.transferDate} ${data.transferTime}
🚗 Araç: ${data.vehicleType}
👥 Yolcu: ${data.passengerCount} kişi
💰 Ücret: €${data.totalAmount}

🛣️ GÜZERGAH:
🟢 ${data.pickupLocation}
🔴 ${data.dropoffLocation}

${data.flightNumber ? `✈️ Uçuş: ${data.flightNumber}` : ''}

Şoför bilgileri transfer günü paylaşılacaktır.

📞 Destek: 0850 XXX XX XX`;
  }

  // Ödeme onay mesajı oluştur
  createPaymentMessage(data) {
    return `💳 ${this.settings?.senderName || 'SBS Transfer'}

✅ Ödemeniz alındı!

📋 Rezervasyon: ${data.reservationNumber}
💰 Tutar: €${data.totalAmount}
💳 Yöntem: ${data.paymentMethod}
📅 Tarih: ${new Date().toLocaleDateString('tr-TR')}

Transfer detaylarınız e-posta adresinize gönderildi.

📞 Destek: 0850 XXX XX XX`;
  }

  // Şoför bilgileri mesajı oluştur
  createDriverInfoMessage(reservationData, driverData) {
    return `🚗 ${this.settings?.senderName || 'SBS Transfer'}

👨‍✈️ ŞOFÖR BİLGİLERİ

📋 Rezervasyon: ${reservationData.reservationNumber}
📅 Tarih: ${reservationData.transferDate} ${reservationData.transferTime}

🧑‍🤝‍🧑 Şoför: ${driverData.name}
📱 Telefon: ${driverData.phone}
🚗 Araç: ${driverData.vehicleModel}
🔢 Plaka: ${driverData.plateNumber}

🛣️ GÜZERGAH:
🟢 ${reservationData.pickupLocation}
🔴 ${reservationData.dropoffLocation}

İyi yolculuklar!

📞 Destek: 0850 XXX XX XX`;
  }

  // Test SMS gönder
  async sendTestSMS(phoneNumber) {
    if (!this.settings) {
      await this.loadSettings();
    }

    const message = `📱 Test SMS - ${this.settings?.senderName || 'SBS Transfer'}

Bu bir test mesajıdır. SMS ayarlarınız başarıyla yapılandırılmıştır.

Tarih: ${new Date().toLocaleString('tr-TR')}`;

    return await this.sendSMS(phoneNumber, message);
  }
}

// SMS servisini export et
export const smsService = new SMSService();
export default smsService;
