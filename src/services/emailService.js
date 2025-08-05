import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import emailjs from '@emailjs/browser';

// E-posta gönderme servisi
class EmailService {
  constructor() {
    this.settings = null;
    this.initialized = false;
  }

  // EmailJS'i başlat
  initEmailJS() {
    if (!this.settings?.emailSettings?.emailjsPublicKey) {
      throw new Error('EmailJS ayarları bulunamadı');
    }

    emailjs.init(this.settings.emailSettings.emailjsPublicKey);
    this.initialized = true;
  }

  // Ayarları Firebase'den yükle
  async loadSettings() {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
      if (settingsDoc.exists()) {
        this.settings = settingsDoc.data();
        return this.settings;
      }
      throw new Error('Ayarlar bulunamadı');
    } catch (error) {
      console.error('E-posta ayarları yüklenirken hata:', error);
      throw error;
    }
  }

  // Template değişkenlerini değiştir
  replaceTemplateVariables(template, data) {
    let processedTemplate = template;
    
    // Temel değişkenler
    const variables = {
      // Müşteri bilgileri
      customerName: `${data.customerInfo?.firstName || ''} ${data.customerInfo?.lastName || ''}`.trim(),
      customerPhone: data.customerInfo?.phone || '',
      customerEmail: data.customerInfo?.email || '',
      
      // Rezervasyon bilgileri
      reservationNumber: data.reservationId || '',
      date: data.date || '',
      time: data.time || '',
      totalPrice: data.totalPrice || '0',
      paymentMethod: this.getPaymentMethodText(data.paymentMethod),
      
      // Lokasyon bilgileri
      pickupLocation: this.getLocationText(data.pickupLocation),
      dropoffLocation: this.getLocationText(data.dropoffLocation),
      
      // Araç bilgileri
      vehicleType: data.selectedVehicle?.name || '',
      vehiclePlate: data.vehiclePlate || 'Belirlenmedi',
      
      // Şoför bilgileri
      driverName: data.driverName || 'Belirlenmedi',
      driverPhone: data.driverPhone || 'Belirlenmedi',
      
      // Şirket bilgileri
      companyName: this.settings?.general?.companyName || 'SBS Transfer',
      companyPhone: this.settings?.general?.companyPhone || '',
      companyEmail: this.settings?.general?.companyEmail || '',
      companyAddress: this.settings?.general?.companyAddress || '',
      taxNumber: this.settings?.company?.taxNumber || '',
      
      // Ek bilgiler
      flightInfo: this.getFlightInfo(data.customerInfo),
      tempPassword: data.tempPassword || '',
      paymentDate: new Date().toLocaleDateString('tr-TR')
    };

    // Değişkenleri değiştir
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, variables[key]);
    });

    return processedTemplate;
  }

  // Ödeme yöntemi metnini al
  getPaymentMethodText(method) {
    switch (method) {
      case 'credit_card': return 'Kredi Kartı';
      case 'bank_transfer': return 'Havale/EFT';
      case 'cash': return 'Nakit';
      default: return 'Belirlenmedi';
    }
  }

  // Lokasyon metnini al
  getLocationText(location) {
    if (!location) return 'Belirlenmedi';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.address) return location.address;
    return 'Belirlenmedi';
  }

  // Uçuş bilgilerini formatla
  getFlightInfo(customerInfo) {
    if (!customerInfo?.flightNumber) return '';
    
    let flightInfo = `✈️ Uçuş No: ${customerInfo.flightNumber}`;
    if (customerInfo.flightTime) {
      flightInfo += `\n🕐 Uçuş Saati: ${customerInfo.flightTime}`;
    }
    return flightInfo;
  }

  // Rezervasyon onay e-postası gönder
  async sendReservationConfirmation(reservationData) {
    try {
      // Ayarları yükle
      if (!this.settings) {
        await this.loadSettings();
      }

      if (!this.settings?.emailTemplates?.reservationConfirmation) {
        throw new Error('Rezervasyon e-posta şablonu bulunamadı');
      }

      const template = this.settings.emailTemplates.reservationConfirmation;
      
      // Template'i işle
      const subject = this.replaceTemplateVariables(template.subject, reservationData);
      const body = this.replaceTemplateVariables(template.template, reservationData);

      // EmailJS ile gerçek e-posta gönder
      if (this.settings?.emailSettings?.emailjsServiceId && 
          this.settings?.emailSettings?.emailjsTemplateId && 
          reservationData.customerInfo?.email) {
        try {
          if (!this.initialized) {
            this.initEmailJS();
          }

          const templateParams = {
            to_email: reservationData.customerInfo.email,
            to_name: `${reservationData.customerInfo?.firstName || ''} ${reservationData.customerInfo?.lastName || ''}`.trim(),
            from_name: this.settings.general?.companyName || 'SBS Transfer',
            reply_to: this.settings.general?.companyEmail || '',
            subject: subject,
            message: body
          };

          const result = await emailjs.send(
            this.settings.emailSettings.emailjsServiceId,
            this.settings.emailSettings.emailjsTemplateId,
            templateParams
          );

          console.log('✅ E-posta başarıyla gönderildi:', result);

          return {
            success: true,
            message: 'Rezervasyon onay e-postası başarıyla gönderildi',
            email: reservationData.customerInfo?.email,
            subject: subject,
            messageId: result.text
          };

        } catch (emailError) {
          console.error('❌ E-posta gönderme hatası:', emailError);
          // E-posta gönderilemese bile işlem başarılı sayılsın
          return {
            success: true,
            message: 'Rezervasyon kaydedildi ancak e-posta gönderilemedi',
            email: reservationData.customerInfo?.email,
            subject: subject,
            error: emailError.message
          };
        }
      }

      // EmailJS ayarları yoksa sadece konsola yazdır
      return {
        success: true,
        message: 'E-posta ayarları yapılandırılmamış (konsola yazdırıldı)',
        email: reservationData.customerInfo?.email,
        subject: subject
      };

    } catch (error) {
      console.error('E-posta gönderme hatası:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Ödeme onay e-postası gönder
  async sendPaymentConfirmation(reservationData) {
    try {
      // Ayarları yükle
      if (!this.settings) {
        await this.loadSettings();
      }

      if (!this.settings?.emailTemplates?.paymentReceived) {
        throw new Error('Ödeme e-posta şablonu bulunamadı');
      }

      const template = this.settings.emailTemplates.paymentReceived;
      
      // Template'i işle
      const subject = this.replaceTemplateVariables(template.subject, reservationData);
      const body = this.replaceTemplateVariables(template.template, reservationData);

      // E-posta gönder
      console.log('💳 E-posta Gönderiliyor:');
      console.log('Alıcı:', reservationData.customerInfo?.email);
      console.log('Konu:', subject);
      console.log('İçerik:\n', body);

      // Gmail SMTP ile gerçek e-posta gönder
      if (this.settings?.emailSettings?.gmailUser && reservationData.customerInfo?.email) {
        try {
          if (!this.transporter) {
            this.createTransporter();
          }

          const mailOptions = {
            from: `"${this.settings.general?.companyName || 'SBS Transfer'}" <${this.settings.emailSettings.gmailUser}>`,
            to: reservationData.customerInfo.email,
            subject: subject,
            text: body,
            html: body.replace(/\n/g, '<br>').replace(/━/g, '─')
          };

          const result = await this.transporter.sendMail(mailOptions);
          console.log('✅ Ödeme e-postası başarıyla gönderildi:', result.messageId);

          return {
            success: true,
            message: 'Ödeme onay e-postası başarıyla gönderildi',
            email: reservationData.customerInfo?.email,
            subject: subject,
            messageId: result.messageId
          };

        } catch (emailError) {
          console.error('❌ Ödeme e-postası gönderme hatası:', emailError);
          return {
            success: true,
            message: 'Rezervasyon kaydedildi ancak ödeme e-postası gönderilemedi',
            email: reservationData.customerInfo?.email,
            subject: subject,
            error: emailError.message
          };
        }
      }

      // Gmail ayarları yoksa sadece konsola yazdır
      return {
        success: true,
        message: 'E-posta ayarları yapılandırılmamış (konsola yazdırıldı)',
        email: reservationData.customerInfo?.email,
        subject: subject
      };

    } catch (error) {
      console.error('Ödeme e-postası gönderme hatası:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// EmailJS ile rezervasyon onay maili gönderme fonksiyonu (export edilecek)
export const sendBookingConfirmationEmail = async (bookingData, qrCodeUrl) => {
  try {
    // Firebase'den EmailJS ayarlarını yükle
    const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
    if (!settingsDoc.exists()) {
      throw new Error('EmailJS ayarları bulunamadı');
    }
    
    const settings = settingsDoc.data();
    const emailSettings = settings.emailSettings;
    
    if (!emailSettings?.emailjsServiceId || !emailSettings?.emailjsTemplateId || !emailSettings?.emailjsPublicKey) {
      throw new Error('EmailJS ayarları eksik');
    }

    // EmailJS'i başlat
    emailjs.init(emailSettings.emailjsPublicKey);

    // Email template parametreleri - EmailJS formatında
    const templateParams = {
      // Alıcı bilgileri (EmailJS'in beklediği format)
      to_name: bookingData.customerName,
      to_email: bookingData.customerEmail,
      from_name: 'Gate Transfer',
      
      // Rezervasyon bilgileri
      reservationId: bookingData.reservationId,
      customer_name: bookingData.customerName,
      customerPhone: bookingData.customerPhone || '',
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      tripDate: bookingData.tripDate,
      tripTime: bookingData.tripTime,
      passengerCount: bookingData.passengerCount,
      totalPrice: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod === 'cash' ? 'Nakit' : 
                     bookingData.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
                     bookingData.paymentMethod === 'bank_transfer' ? 'Havale' : bookingData.paymentMethod,
      tripType: bookingData.tripType,
      qrCodeUrl: qrCodeUrl || '',
      tempPassword: bookingData.tempPassword || '',
      
      // Şirket bilgileri
      companyName: 'Gate Transfer',
      companyPhone: '+90 532 574 26 82',
      companyEmail: 'sbstravelinfo@gmail.com',
      companyWebsite: 'www.gatetransfer.com'
    };

    console.log('🔍 EmailJS Template Parameters:', templateParams);
    console.log('📧 Customer Email:', bookingData.customerEmail);
    console.log('⚙️ EmailJS Settings:', { 
      serviceId: emailSettings.emailjsServiceId, 
      templateId: emailSettings.emailjsTemplateId,
      hasPublicKey: !!emailSettings.emailjsPublicKey 
    });

    // EmailJS ile email gönder - Orijinal ayarlarla
    const response = await emailjs.send(
      emailSettings.emailjsServiceId,
      emailSettings.emailjsTemplateId,
      {
        to_email: bookingData.customerEmail,
        to_name: bookingData.customerName,
        from_name: 'Gate Transfer',
        reply_to: 'sbstravelinfo@gmail.com',
        subject: `Rezervasyon Onayi - ${bookingData.reservationId}`,
        message: `Rezervasyon Onayi

Sayin ${bookingData.customerName},

Rezervasyon Numaraniz: ${bookingData.reservationId}
Kalkis: ${bookingData.pickupLocation}
Varis: ${bookingData.dropoffLocation}
Tarih: ${bookingData.tripDate} ${bookingData.tripTime}
Yolcu: ${bookingData.passengerCount} kisi
Fiyat: €${bookingData.totalPrice}

${bookingData.tempPassword ? `🔐 Gecici Sifreniz: ${bookingData.tempPassword}` : ''}

Tesekkurler,
Gate Transfer Ekibi`,
        // Template değişkenleri
        reservationId: bookingData.reservationId,
        customerName: bookingData.customerName,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        tripDate: bookingData.tripDate,
        tripTime: bookingData.tripTime,
        passengerCount: bookingData.passengerCount,
        totalPrice: bookingData.totalPrice,
        customerPhone: bookingData.customerPhone || '',
        tempPassword: bookingData.tempPassword || '', // Geçici şifre
        paymentMethod: bookingData.paymentMethod,
        tripType: bookingData.tripType,
        qrCodeUrl: qrCodeUrl || ''
      },
      {
        publicKey: emailSettings.emailjsPublicKey
      }
    );

    console.log('✅ EmailJS ile rezervasyon e-postası gönderildi:', response);
    return {
      success: true,
      response: response
    };

  } catch (error) {
    console.error('❌ EmailJS rezervasyon e-postası hatası:', error);
    throw error;
  }
};

// Şoför atama e-postası gönderme fonksiyonu
export const sendDriverAssignmentEmail = async (emailData) => {
  try {
    console.log('📧 Şoför atama e-postası gönderiliyor...');
    console.log('🔍 EmailJS Template Parameters:', emailData);
    
    // Firebase'den EmailJS ayarlarını yükle
    const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
    if (!settingsDoc.exists()) {
      throw new Error('EmailJS ayarları bulunamadı');
    }
    
    const settings = settingsDoc.data();
    const emailSettings = settings.emailSettings;
    
    if (!emailSettings?.emailjsServiceId || !emailSettings?.emailjsTemplateId || !emailSettings?.emailjsPublicKey) {
      throw new Error('EmailJS ayarları eksik');
    }

    // EmailJS'i başlat
    emailjs.init(emailSettings.emailjsPublicKey);

    // Şöför atama template'ini kontrol et - önce ayrı template, yoksa genel template kullan
    const templateId = settings.emailSettings?.emailjsDriverAssignmentTemplateId || emailSettings.emailjsTemplateId;
    
    // EmailJS template parametreleri
    const templateParams = {
      to_name: emailData.customerName,
      to_email: emailData.customerEmail,
      from_name: settings.general?.companyName || 'Gate Transfer',
      reply_to: settings.general?.companyEmail || 'sbstravelinfo@gmail.com',
      subject: `Sofor Atama Bilgisi - ${emailData.reservationId}`,
      message: `Sofor Atama Bilgisi

Sayin ${emailData.customerName},

Rezervasyon Numaraniz: ${emailData.reservationId}

🚗 SOFOR BILGILERI:
Sofor Adi: ${emailData.driverName}
Sofor Telefonu: ${emailData.driverPhone}
${emailData.vehiclePlate ? `Arac Plakasi: ${emailData.vehiclePlate}` : ''}

📍 TRANSFER BILGILERI:
Kalkis: ${emailData.pickupLocation}
Varis: ${emailData.dropoffLocation}
Tarih: ${emailData.tripDate}
Saat: ${emailData.tripTime}

Soforunuz belirtilen tarih ve saatte sizinle irtibata gececektir.

Tesekkurler,
${settings.general?.companyName || 'Gate Transfer'} Ekibi`,
      
      // Template değişkenleri
      reservationId: emailData.reservationId,
      customerName: emailData.customerName,
      driverName: emailData.driverName,
      driverPhone: emailData.driverPhone,
      vehiclePlate: emailData.vehiclePlate || '',
      pickupLocation: emailData.pickupLocation,
      dropoffLocation: emailData.dropoffLocation,
      tripDate: emailData.tripDate,
      tripTime: emailData.tripTime,
      companyName: settings.general?.companyName || 'Gate Transfer',
      companyPhone: settings.general?.companyPhone || '',
      companyEmail: settings.general?.companyEmail || ''
    };

    console.log('📧 Customer Email:', emailData.customerEmail);
    console.log('⚙️ EmailJS Settings:', {
      serviceId: emailSettings.emailjsServiceId,
      templateId: templateId,
      hasPublicKey: !!emailSettings.emailjsPublicKey
    });

    // EmailJS ile gönder
    const result = await emailjs.send(
      emailSettings.emailjsServiceId,
      templateId,
      templateParams,
      {
        publicKey: emailSettings.emailjsPublicKey
      }
    );

    console.log('✅ Şoför atama e-postası gönderildi:', result);
    return {
      success: true,
      response: result
    };

  } catch (error) {
    console.error('❌ Şoför atama e-postası hatası:', error);
    throw error;
  }
};

// Singleton instance
const emailService = new EmailService();
export default emailService;
