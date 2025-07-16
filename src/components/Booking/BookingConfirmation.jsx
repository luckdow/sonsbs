import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Car, 
  Users, 
  Phone, 
  Mail,
  CreditCard,
  QrCode,
  Download,
  Share2,
  MessageCircle,
  Star,
  Gift,
  Crown,
  Clock,
  Route,
  Package,
  Home,
  ArrowRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = ({ bookingData, onComplete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(true);
  const [membershipCreated, setMembershipCreated] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    generateReservationData();
  }, []);

  const generateReservationData = async () => {
    // Generate unique reservation ID
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newReservationId = `SBS${timestamp.toString().slice(-6)}${randomStr}`;
    setReservationId(newReservationId);

    // Create QR code data
    const qrData = {
      reservationId: newReservationId,
      customerName: `${bookingData.personalInfo?.firstName} ${bookingData.personalInfo?.lastName}`,
      date: bookingData.date,
      time: bookingData.time,
      direction: bookingData.direction,
      vehicle: bookingData.selectedVehicle?.name,
      passengers: bookingData.personalInfo?.passengerCount,
      amount: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod,
      phone: bookingData.personalInfo?.phone,
      verificationUrl: `https://sbstransfer.com/verify/${newReservationId}`
    };

    try {
      // Generate QR code
      const qrUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
      setIsGeneratingQR(false);
      
      // Simulate membership creation
      setTimeout(() => {
        setMembershipCreated(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `SBS-Transfer-${reservationId}.png`;
      link.click();
    }
  };

  const handleShare = () => {
    const shareText = `SBS Transfer Rezervasyonum
Rezervasyon No: ${reservationId}
Tarih: ${new Date(bookingData.date).toLocaleDateString('tr-TR')}
Saat: ${bookingData.time}
${bookingData.direction === 'airport-to-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı'}
Araç: ${bookingData.selectedVehicle?.name}
`;

    if (navigator.share) {
      navigator.share({
        title: 'SBS Transfer Rezervasyonu',
        text: shareText,
        url: `https://sbstransfer.com/verify/${reservationId}`
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Rezervasyon bilgileri kopyalandı!');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleNewBooking = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Başarı Mesajı */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Rezervasyonunuz Onaylandı!
          </h2>
          <p className="text-gray-600">
            Transfer rezervasyonunuz başarıyla oluşturuldu
          </p>
        </motion.div>

        {/* Rezervasyon Bilgileri */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Rezervasyon Detayları</h3>
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {reservationId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Tarih & Saat</p>
                  <p className="font-medium">
                    {new Date(bookingData.date).toLocaleDateString('tr-TR')} - {bookingData.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Route className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Transfer Yönü</p>
                  <p className="font-medium">
                    {bookingData.direction === 'airport-to-hotel' 
                      ? 'Havalimanı → Otel' 
                      : 'Otel → Havalimanı'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Araç</p>
                  <p className="font-medium">{bookingData.selectedVehicle?.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Yolcu Sayısı</p>
                  <p className="font-medium">{bookingData.personalInfo?.passengerCount} kişi</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">İletişim</p>
                  <p className="font-medium">{bookingData.personalInfo?.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Toplam Tutar</p>
                  <p className="font-bold text-blue-600">₺{bookingData.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
              <QrCode className="w-5 h-5 mr-2" />
              Rezervasyon QR Kodu
            </h3>
            
            {isGeneratingQR ? (
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-sm text-gray-600">QR kod oluşturuluyor...</p>
              </div>
            ) : qrCodeUrl ? (
              <div className="flex flex-col items-center">
                <img 
                  src={qrCodeUrl} 
                  alt="Reservation QR Code" 
                  className="w-48 h-48 border rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600 mb-4">
                  Bu QR kodu şoföre göstererek rezervasyonunuzu doğrulayabilirsiniz
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadQR}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Paylaş</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <p className="text-sm text-gray-500">QR kod oluşturulamadı</p>
              </div>
            )}
          </div>
        </div>

        {/* Otomatik Üyelik */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: membershipCreated ? 1 : 0, 
            height: membershipCreated ? 'auto' : 0 
          }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                🎉 Otomatik Üyelik Oluşturuldu!
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Rezervasyonunuz ile birlikte SBS Transfer üyeliğiniz otomatik olarak oluşturuldu. 
                Artık gelecek rezervasyonlarınızda daha hızlı işlem yapabilirsiniz.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-green-600">
                  <Gift className="w-4 h-4 mr-1" />
                  <span>%10 indirim kazandınız</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Puan sistemi aktif</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Önemli Bilgiler */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Önemli Bilgiler</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <p>Şoförümüz belirlenen saatte sizinle iletişime geçecektir</p>
            </div>
            <div className="flex items-start space-x-2">
              <MessageCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <p>Rezervasyon detayları e-posta ve SMS ile gönderilecektir</p>
            </div>
            <div className="flex items-start space-x-2">
              <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
              <p>Acil durumlar için: +90 (555) 000 00 00</p>
            </div>
            {bookingData.paymentMethod === 'bank_transfer' && (
              <div className="flex items-start space-x-2">
                <CreditCard className="w-4 h-4 text-blue-600 mt-0.5" />
                <p>IBAN bilgileri e-posta ile gönderildi. 24 saat içinde ödeme yapınız.</p>
              </div>
            )}
          </div>
        </div>

        {/* İletişim ve Destek */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">İletişim & Destek</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Telefon</p>
                <p className="font-medium">+90 (555) 000 00 00</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">E-posta</p>
                <p className="font-medium">destek@sbstransfer.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewBooking}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Yeni Rezervasyon</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
