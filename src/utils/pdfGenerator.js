import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PDF oluşturma fonksiyonu
export const generateReservationPDF = async (reservationData, companyInfo, qrCodeUrl) => {
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
    pdf.text(`Toplam Tutar: ₺${reservationData.payment.amount.toLocaleString()}`, 25, yPos);
    
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