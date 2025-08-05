import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PDF oluşturma fonksiyonu
export const generateReservationPDF = async (reservationData, companyInfo, qrCodeUrl, manualDriverInfo = null) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Şirket logosu ve başlık
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyInfo?.name || 'SBS Transfer', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyInfo?.address || 'Transfer Hizmeti', 20, 35);
    pdf.text(`Tel: ${companyInfo?.phone || '+90 555 123 45 67'}`, 20, 42);
    pdf.text(`E-mail: ${companyInfo?.email || 'sbstravelinfo@gmail.com'}`, 20, 49);
    
    // Başlık çizgisi
    pdf.setLineWidth(1);
    pdf.line(20, 55, pageWidth - 20, 55);
    
    // Rezervasyon başlığı
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRANSFER REZERVASYON ONAY BELGESİ', 20, 70);
    
    // QR Kod ve Rezervasyon Bilgileri yan yana
    let yPos = 85;
    
    // Sol taraf: QR Kod
    if (qrCodeUrl) {
      try {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('QR Kod:', 20, yPos);
        
        const qrSize = 40;
        pdf.addImage(qrCodeUrl, 'PNG', 20, yPos + 5, qrSize, qrSize);
      } catch (error) {
        console.error('QR kod eklenirken hata:', error);
      }
    }
    
    // Sağ taraf: Rezervasyon ve Geçici Şifre
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rezervasyon Bilgileri:', 100, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Rezervasyon Kodu: ${reservationData.reservationCode}`, 105, yPos);
    yPos += 7;
    pdf.text(`Geçici Şifre: ${reservationData.tempPassword || 'Belirtilmemiş'}`, 105, yPos);
    yPos += 7;
    pdf.text(`Tarih: ${new Date(reservationData.date).toLocaleDateString('tr-TR')}`, 105, yPos);
    yPos += 7;
    pdf.text(`Saat: ${reservationData.time}`, 105, yPos);
    yPos += 7;
    
    const direction = reservationData.direction === 'airport-to-hotel' 
      ? 'Havalimanı → Otel' 
      : 'Otel → Havalimanı';
    pdf.text(`Transfer Yönü: ${direction}`, 105, yPos);
    
    // Transfer ve Yolcu Bilgileri yan yana
    yPos = 155; // QR koddan sonraki pozisyon
    
    // Sol: Transfer Detayları
    pdf.setFont('helvetica', 'bold');
    pdf.text('Transfer Detayları:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Kalkış: ${reservationData.pickupLocation}`, 25, yPos);
    yPos += 7;
    pdf.text(`Varış: ${reservationData.dropoffLocation}`, 25, yPos);
    yPos += 7;
    pdf.text(`Araç: ${reservationData.vehicle.brand} ${reservationData.vehicle.model}`, 25, yPos);
    yPos += 7;
    pdf.text(`Kategori: ${reservationData.vehicle.category}`, 25, yPos);
    yPos += 7;
    
    const paymentMethod = reservationData.payment.method === 'cash' ? 'Nakit' :
                         reservationData.payment.method === 'bank_transfer' ? 'Banka Havalesi' :
                         'Kredi Kartı';
    pdf.text(`Ödeme Yöntemi: ${paymentMethod}`, 25, yPos);
    yPos += 7;
    pdf.text(`Toplam Tutar: €${reservationData.payment.amount.toLocaleString()}`, 25, yPos);
    
    // Sağ: Yolcu Bilgileri
    let yPosRight = 165; // Transfer başlığıyla aynı hizada
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Yolcu Bilgileri:', 105, yPosRight);
    yPosRight += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Ad Soyad: ${reservationData.passenger.firstName} ${reservationData.passenger.lastName}`, 110, yPosRight);
    yPosRight += 7;
    pdf.text(`Telefon: ${reservationData.passenger.phone}`, 110, yPosRight);
    yPosRight += 7;
    pdf.text(`E-mail: ${reservationData.passenger.email}`, 110, yPosRight);
    yPosRight += 7;
    
    if (reservationData.passenger.flightNumber) {
      pdf.text(`Uçuş No: ${reservationData.passenger.flightNumber}`, 110, yPosRight);
      yPosRight += 7;
    }
    
    pdf.text(`Yolcu Sayısı: ${reservationData.passenger.count} kişi`, 110, yPosRight);
    
    // Alt bilgi
    yPos = pageHeight - 30;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Bu belge elektronik ortamda oluşturulmuştur.', 20, yPos);
    pdf.text(`Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}`, 20, yPos + 7);
    
    // PDF'i indir
    const fileName = `SBS_Transfer_${reservationData.reservationCode}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  }
};

// HTML elementini PDF'e çevirme fonksiyonu - Tam ekran görüntüsü
export const generatePDFFromElement = async (elementId, fileName = 'document.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element bulunamadı');
    }
    
    // PDF özel layout için element'i görünür yap
    const originalStyle = element.style.cssText;
    element.style.cssText = 'position: static !important; top: auto !important; left: auto !important; transform: none !important;';
    
    // Kısa bir gecikme ver ki CSS uygulanabilsin
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Daha yüksek kalitede görüntü için ayarlar
    const canvas = await html2canvas(element, {
      scale: 2, // A4 için optimize edilmiş scale
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 genişliği pixel cinsinden (210mm)
      height: 1123, // A4 yüksekliği pixel cinsinden (297mm)
      scrollX: 0,
      scrollY: 0,
      logging: false
    });
    
    // Element'i tekrar gizle
    element.style.cssText = originalStyle;
    
    const imgData = canvas.toDataURL('image/png', 1.0); // Maksimum kalite
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    
    // A4 sayfasına tam olarak sığacak şekilde boyutlandır
    const imgWidth = pdfWidth;
    const imgHeight = pdfHeight;
    
    // PDF'e ekle
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  }
};

// Rezervasyon sayfasının tam ekran görüntüsünü PDF'e çevir
export const generateBookingConfirmationPDF = async (reservationCode) => {
  try {
    const fileName = `SBS_Transfer_${reservationCode}_Onay.pdf`;
    await generatePDFFromElement('booking-confirmation-content', fileName);
    return true;
  } catch (error) {
    console.error('Rezervasyon PDF oluşturma hatası:', error);
    throw error;
  }
};

// HTML elementini PDF'e çevirme fonksiyonu - Eski versiyon (yedek)
export const generatePDFFromElementOld = async (elementId, fileName = 'document.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element bulunamadı');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  }
};

/**
 * Test amaçlı basit PDF oluştur
 */
export const testPDF = () => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFontSize(20);
    pdf.text('Test PDF - Turkce Karakter Testi', 20, 30);
    pdf.setFontSize(14);
    pdf.text('Bu bir test PDF dosyasidir', 20, 50);
    pdf.text('Musteri: Test Musteri', 20, 70);
    pdf.text('Sofor: Test Sofor', 20, 90);
    
    pdf.save('test-pdf.pdf');
    console.log('Test PDF oluşturuldu!');
    return true;
  } catch (error) {
    console.error('Test PDF hatası:', error);
    return false;
  }
};

/**
 * Manuel şoför ataması için basitleştirilmiş PDF oluştur
 * @param {Object} reservation - Rezervasyon bilgileri
 * @param {Object} manualDriver - Manuel şoför bilgileri
 * @param {Object} companyInfo - Şirket bilgileri
 */
export const generateManualDriverPDF = async (reservation, manualDriver, companyInfo) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Renkler tanımla
    const colors = {
      primary: [41, 128, 185],     // Mavi
      secondary: [52, 152, 219],   // Açık mavi
      success: [39, 174, 96],      // Yeşil
      warning: [241, 196, 15],     // Sarı
      danger: [231, 76, 60],       // Kırmızı
      dark: [52, 73, 94],          // Koyu gri
      light: [236, 240, 241],      // Açık gri
      white: [255, 255, 255]       // Beyaz
    };

    // Helper fonksiyonlar - Türkçe karakter dönüştürme
    const turkishToEnglish = (text) => {
      if (!text) return 'Belirtilmemis';
      return text
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ı/g, 'i').replace(/İ/g, 'I')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C');
    };

    const formatLocation = (location) => {
      if (!location) return 'Belirtilmemis';
      if (typeof location === 'string') return turkishToEnglish(location);
      if (typeof location === 'object') {
        return turkishToEnglish(location.address || location.name || location.formatted_address || location.description || 'Lokasyon bilgisi mevcut');
      }
      return turkishToEnglish(String(location));
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return 'Belirtilmemis';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    // Başlık banner (mavi arka plan) - Daha da küçük
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    
    // Şirket adı (beyaz yazı) - Daha küçük font
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(turkishToEnglish(companyInfo?.name || 'SBS TRANSFER HIZMETLERI LTD. STI.'), 20, 13);
    
    // Alt başlık (beyaz yazı)
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('PROFESYONEL TRANSFER HIZMETI', 20, 18);

    // Şirket bilgileri kutusu (açık mavi arka plan) - Daha da küçük
    pdf.setFillColor(...colors.secondary);
    pdf.rect(0, 20, pageWidth, 12, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(8);
    pdf.text(`Tel: ${companyInfo?.phone || '+90 242 835 07 07'}`, 20, 25);
    pdf.text(`Email: ${companyInfo?.email || 'info@sonsbs.com'}`, 20, 29);
    pdf.text(`Aksu/Antalya`, 130, 25);
    pdf.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')} - ${new Date().toLocaleTimeString('tr-TR').slice(0,5)}`, 130, 29);

    // Ana başlık (koyu gri arka plan) - Daha da küçük
    pdf.setFillColor(...colors.dark);
    pdf.rect(0, 35, pageWidth, 10, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRANSFER GOREVI - DIS SOFOR', 20, 42);

    let yPos = 52;

    // REZERVASYON BİLGİLERİ KUTUSU - Daha da küçük
    pdf.setFillColor(...colors.warning);
    pdf.rect(10, yPos, pageWidth - 20, 6, 'F');
    
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REZERVASYON BILGILERI', 15, yPos + 4);
    
    yPos += 9;

    // Transfer tipi belirleme
    const transferType = reservation.tripDetails?.direction === 'roundtrip' ? 'Gidis-Donus' :
                        reservation.tripDetails?.direction === 'oneway' ? 'Tek Yon' :
                        reservation.tripDetails?.isRoundTrip ? 'Gidis-Donus' : 'Tek Yon';

    // Rezervasyon bilgileri tablosu - Daha büyük fontlar
    const reservationTable = [
      ['Rezervasyon No:', reservation.reservationNumber || reservation.reservationId || 'Belirtilmemis'],
      ['Musteri:', turkishToEnglish(`${reservation.customerInfo?.firstName || ''} ${reservation.customerInfo?.lastName || ''}`.trim() || 'Belirtilmemis')],
      ['Telefon:', reservation.customerInfo?.phone || 'Belirtilmemis'],
      ['Email:', reservation.customerInfo?.email || 'Belirtilmemis'],
      ['Transfer Tipi:', transferType],
      ['Tarih:', formatDate(reservation.tripDetails?.date) || 'Belirtilmemis'],
      ['Saat:', reservation.tripDetails?.time || 'Belirtilmemis'],
      ['Yolcu Sayisi:', `${reservation.customerInfo?.passengerCount || 1} kisi`]
    ];

    reservationTable.forEach((row, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(...colors.light);
        pdf.rect(15, yPos - 1, pageWidth - 30, 8, 'F');
      }
      
      pdf.setTextColor(...colors.dark);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(row[0], 20, yPos + 3);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(row[1], 85, yPos + 3);
      yPos += 8;
    });

    yPos += 6;

    // TRANSFER BİLGİLERİ KUTUSU - Daha da küçük
    pdf.setFillColor(...colors.danger);
    pdf.rect(10, yPos, pageWidth - 20, 6, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRANSFER BILGILERI', 15, yPos + 4);
    
    yPos += 9;

    // Rota bilgileri - Daha dengeli
    pdf.setFillColor(...colors.light);
    pdf.rect(15, yPos, pageWidth - 30, 22, 'F');
    
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KALKIS:', 20, yPos + 6);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const pickupText = formatLocation(reservation.tripDetails?.pickupLocation);
    const pickupLines = pdf.splitTextToSize(pickupText, pageWidth - 60);
    pdf.text(pickupLines, 20, yPos + 9);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VARIS:', 20, yPos + 15);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const dropoffText = formatLocation(reservation.tripDetails?.dropoffLocation);
    const dropoffLines = pdf.splitTextToSize(dropoffText, pageWidth - 60);
    pdf.text(dropoffLines, 20, yPos + 18);

    yPos += 27;

    // ÖDEME BİLGİLERİ KUTUSU - Daha da küçük
    pdf.setFillColor(...colors.primary);
    pdf.rect(10, yPos, pageWidth - 20, 6, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ODEME BILGILERI', 15, yPos + 4);
    
    yPos += 9;

    // Ödeme bilgileri - Daha büyük fontlar
    const paymentMethod = reservation.paymentMethod === 'cash' ? 'Nakit' :
                         reservation.paymentMethod === 'card' ? 'Kredi Karti' :
                         reservation.paymentMethod === 'bank_transfer' ? 'Havale' : 'Belirtilmemis';
    
    // Nakit ödeme durumunda şoförün müşteriden alacağı tutar
    const collectFromCustomer = reservation.paymentMethod === 'cash' 
      ? `€${reservation.totalPrice || '0'}` 
      : 'Odeme Yapilmis';
    
    const paymentTable = [
      ['Odeme Sekli:', paymentMethod],
      ['Toplam Tutar:', `€${reservation.totalPrice || '0'}`],
      ['Sofor Hak Edis:', `€${manualDriver.price || '0'}`],
      ['Musteriden Alinacak:', collectFromCustomer]
    ];

    paymentTable.forEach((row, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(...colors.light);
        pdf.rect(15, yPos - 1, pageWidth - 30, 8, 'F');
      }
      
      pdf.setTextColor(...colors.dark);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(row[0], 20, yPos + 3);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(row[1], 85, yPos + 3);
      yPos += 8;
    });

    yPos += 6;

    // ÖNEMLI NOTLAR KUTUSU - Dengeli boyut
    pdf.setFillColor(...colors.warning);
    pdf.rect(10, yPos, pageWidth - 20, 6, 'F');
    
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ONEMLI NOTLAR', 15, yPos + 4);
    
    yPos += 8;

    pdf.setFillColor(...colors.light);
    pdf.rect(15, yPos, pageWidth - 30, 20, 'F');
    
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('• Musteri ile iletisime gecerek tam lokasyonu teyit edin', 20, yPos + 5);
    pdf.text('• Zamaninda ve temiz aracla hizmet verin', 20, yPos + 10);
    pdf.text('• Herhangi bir problem durumunda sirketi arayin', 20, yPos + 15);
    pdf.text('• Bu belgeyi aracta bulundurun', 20, yPos + 20);

    // Alt bilgi (footer) - Biraz daha büyük
    pdf.setFillColor(...colors.dark);
    pdf.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Bu belge elektronik ortamda olusturulmustur. Imza gerektirmez.', 20, pageHeight - 7);
    pdf.text(`Yazdirma Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR').slice(0,5)}`, 20, pageHeight - 3);

    // PDF'i indir - Daha güvenilir yöntem
    try {
      const fileName = `Manuel_Sofor_${reservation.reservationNumber || 'Transfer'}_${new Date().getTime()}.pdf`;
      
      // Blob oluştur ve link ile indir
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Link oluştur ve otomatik indir
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // URL'yi temizle
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      
      console.log(`✅ PDF indirildi: ${fileName}`);
      return true;
      
    } catch (downloadError) {
      console.error('❌ PDF indirme hatası:', downloadError);
      // Fallback - direkt save
      const fileName = `Manuel_Sofor_${reservation.reservationNumber || 'Transfer'}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      return true;
    }
    
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  }
};
