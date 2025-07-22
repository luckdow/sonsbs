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
    pdf.text(`E-mail: ${companyInfo?.email || 'info@sbstransfer.com'}`, 20, 49);
    
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
 * Manuel şoför ataması için özel PDF oluştur
 * @param {Object} reservation - Rezervasyon bilgileri
 * @param {Object} manualDriver - Manuel şoför bilgileri
 * @param {Object} companyInfo - Şirket bilgileri
 */
export const generateManualDriverPDF = async (reservation, manualDriver, companyInfo) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Helper fonksiyonlar
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
    
    // Şirket logosu ve başlık
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyInfo?.name || 'SBS Transfer', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyInfo?.address || 'Transfer Hizmeti', 20, 35);
    pdf.text(`Tel: ${companyInfo?.phone || '+90 555 123 45 67'}`, 20, 42);
    pdf.text(`E-mail: ${companyInfo?.email || 'info@sbstransfer.com'}`, 20, 49);
    
    // Başlık çizgisi
    pdf.setLineWidth(1);
    pdf.line(20, 55, pageWidth - 20, 55);
    
    // Başlık
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRANSFER GÖREVİ - DIŞ ŞOFÖR', 20, 70);
    
    let yPos = 85;
    
    // Rezervasyon Bilgileri
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rezervasyon Bilgileri', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Daha kompakt layout
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rezervasyon No:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(reservation.reservationId || 'Belirtilmemis', 65, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Musteri:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${reservation.customerInfo?.firstName || ''} ${reservation.customerInfo?.lastName || ''}`, 45, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Telefon:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(reservation.customerInfo?.phone || 'Belirtilmemis', 50, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tarih:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatDate(reservation.tripDetails?.date), 45, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Saat:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(reservation.tripDetails?.time || 'Belirtilmemis', 40, yPos);
    yPos += 8;
    
    // Güzergah Bilgileri
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Guzergah Bilgileri', 20, yPos);
    yPos += 12;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Kalkis:', 20, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    const pickupText = formatLocation(reservation.tripDetails?.pickupLocation);
    const pickupLines = pdf.splitTextToSize(pickupText, pageWidth - 40);
    pdf.text(pickupLines, 25, yPos);
    yPos += (pickupLines.length * 5) + 4;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Varis:', 20, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    const dropoffText = formatLocation(reservation.tripDetails?.dropoffLocation);
    const dropoffLines = pdf.splitTextToSize(dropoffText, pageWidth - 40);
    pdf.text(dropoffLines, 25, yPos);
    yPos += (dropoffLines.length * 5) + 8;
    
    // Yolcu ve Araç Bilgileri
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Yolcu ve Arac Bilgileri', 20, yPos);
    yPos += 12;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Yolcu Sayisi:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${reservation.tripDetails?.passengerCount || 1} kisi`, 60, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bagaj:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${reservation.tripDetails?.luggageCount || 0} adet`, 45, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Arac Plakasi:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(manualDriver.plateNumber || 'Belirtilmemis', 65, yPos);
    yPos += 8;
    
    // Şoför Bilgileri
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sofor Bilgileri', 20, yPos);
    yPos += 12;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sofor Adi:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(manualDriver.name || 'Belirtilmemis', 55, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Telefon:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(manualDriver.phone || 'Belirtilmemis', 50, yPos);
    yPos += 8;
    
    // Ücret Bilgileri
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Ucret Bilgileri', 20, yPos);
    yPos += 12;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Seyahat Ucreti:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${manualDriver.price} EUR`, 75, yPos);
    yPos += 12;
    
    // Uyarılar
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Onemli Notlar:', 20, yPos);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('• Belirlenen saatte hazir olunuz', 25, yPos);
    yPos += 6;
    pdf.text('• Musteri ile nezaketle iletisim kurunuz', 25, yPos);
    yPos += 6;
    pdf.text('• Seyahat tamamlandiginda rapor veriniz', 25, yPos);
    
    // Alt bilgi
    yPos = pageHeight - 30;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Bu belge manuel sofor atamasi icin olusturulmustur.', 20, yPos);
    pdf.text(`Olusturma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, yPos + 7);
    
    return pdf.output('datauristring');
  } catch (error) {
    console.error('Manuel şoför PDF oluşturma hatası:', error);
    throw error;
  }
};