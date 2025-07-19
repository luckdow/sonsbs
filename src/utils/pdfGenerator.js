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
    
    // Rezervasyon bilgileri
    let yPos = 85;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rezervasyon Bilgileri:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Rezervasyon Kodu: ${reservationData.reservationCode}`, 25, yPos);
    yPos += 7;
    pdf.text(`Tarih: ${new Date(reservationData.date).toLocaleDateString('tr-TR')}`, 25, yPos);
    yPos += 7;
    pdf.text(`Saat: ${reservationData.time}`, 25, yPos);
    yPos += 7;
    
    const direction = reservationData.direction === 'airport-to-hotel' 
      ? 'Havalimanı → Otel' 
      : 'Otel → Havalimanı';
    pdf.text(`Transfer Yönü: ${direction}`, 25, yPos);
    yPos += 7;
    
    pdf.text(`Kalkış: ${reservationData.pickupLocation}`, 25, yPos);
    yPos += 7;
    pdf.text(`Varış: ${reservationData.dropoffLocation}`, 25, yPos);
    yPos += 15;
    
    // Yolcu bilgileri
    pdf.setFont('helvetica', 'bold');
    pdf.text('Yolcu Bilgileri:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Ad Soyad: ${reservationData.passenger.firstName} ${reservationData.passenger.lastName}`, 25, yPos);
    yPos += 7;
    pdf.text(`Telefon: ${reservationData.passenger.phone}`, 25, yPos);
    yPos += 7;
    pdf.text(`E-mail: ${reservationData.passenger.email}`, 25, yPos);
    yPos += 7;
    
    if (reservationData.passenger.flightNumber) {
      pdf.text(`Uçuş No: ${reservationData.passenger.flightNumber}`, 25, yPos);
      yPos += 7;
    }
    
    pdf.text(`Yolcu Sayısı: ${reservationData.passenger.count} kişi`, 25, yPos);
    yPos += 15;
    
    // Araç bilgileri
    pdf.setFont('helvetica', 'bold');
    pdf.text('Araç Bilgileri:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Araç: ${reservationData.vehicle.brand} ${reservationData.vehicle.model}`, 25, yPos);
    yPos += 7;
    pdf.text(`Kategori: ${reservationData.vehicle.category}`, 25, yPos);
    yPos += 15;
    
    // Ödeme bilgileri
    pdf.setFont('helvetica', 'bold');
    pdf.text('Ödeme Bilgileri:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    const paymentMethod = reservationData.payment.method === 'cash' ? 'Nakit' :
                         reservationData.payment.method === 'bank_transfer' ? 'Banka Havalesi' :
                         'Kredi Kartı';
    pdf.text(`Ödeme Yöntemi: ${paymentMethod}`, 25, yPos);
    yPos += 7;
    pdf.text(`Toplam Tutar: ₺${reservationData.payment.amount.toLocaleString()}`, 25, yPos);
    yPos += 15;
    
    // QR Kod ekle (eğer varsa)
    if (qrCodeUrl) {
      try {
        pdf.setFont('helvetica', 'bold');
        pdf.text('QR Kod:', 20, yPos);
        
        // QR kodu PDF'e ekle
        const qrSize = 30;
        pdf.addImage(qrCodeUrl, 'PNG', 25, yPos + 5, qrSize, qrSize);
        yPos += qrSize + 15;
      } catch (error) {
        console.error('QR kod eklenirken hata:', error);
      }
    }
    
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

// HTML elementini PDF'e çevirme fonksiyonu
export const generatePDFFromElement = async (elementId, fileName = 'document.pdf') => {
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