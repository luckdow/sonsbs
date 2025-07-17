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
  ArrowRight,
  Info
} from 'lucide-react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_COLLECTIONS, RESERVATION_STATUS, USER_ROLES } from '../../config/constants';
import toast from 'react-hot-toast';

const BookingConfirmation = ({ bookingData, onComplete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(true);
  const [membershipCreated, setMembershipCreated] = useState(false);
  const [membershipPassword, setMembershipPassword] = useState('');
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

    // Create reservation data for Firebase
    const reservationData = {
      id: newReservationId,
      status: RESERVATION_STATUS.PENDING,
      createdAt: new Date(),
      
      // Transfer details
      direction: bookingData.direction,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      date: bookingData.date,
      time: bookingData.time,
      passengerCount: bookingData.passengerCount,
      baggageCount: bookingData.baggageCount,
      
      // Route info
      distance: bookingData.distance,
      duration: bookingData.duration,
      
      // Vehicle and services
      selectedVehicle: bookingData.selectedVehicle,
      selectedServices: bookingData.selectedServices || [],
      
      // Personal info
      personalInfo: bookingData.personalInfo,
      
      // Payment info
      paymentMethod: bookingData.paymentMethod,
      totalPrice: bookingData.totalPrice,
      
      // Additional fields
      driverAssigned: null,
      specialRequests: bookingData.personalInfo?.specialRequests || '',
      flightNumber: bookingData.personalInfo?.flightNumber || '',
      flightTime: bookingData.personalInfo?.flightTime || ''
    };

    try {
      // Save reservation to Firebase
      const docRef = await addDoc(collection(db, FIREBASE_COLLECTIONS.RESERVATIONS), reservationData);
      console.log('Reservation saved with ID:', docRef.id);
      toast.success('Rezervasyon başarıyla kaydedildi!');
      
      // Create automatic membership if not logged in
      await createAutomaticMembership();
      
    } catch (error) {
      console.error('Error saving reservation:', error);
      toast.error('Rezervasyon kaydedilemedi. Lütfen tekrar deneyin.');
    }

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

  const createAutomaticMembership = async () => {
    // Eğer kullanıcı zaten giriş yapmışsa üyelik oluşturma
    if (auth.currentUser) {
      setMembershipCreated(true);
      return;
    }

    try {
      const personalInfo = bookingData.personalInfo;
      
      // Geçici şifre oluştur
      const tempPassword = Math.random().toString(36).slice(-8) + '123';
      setMembershipPassword(tempPassword);
      
      // Firebase Auth ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        personalInfo.email, 
        tempPassword
      );
      
      // Kullanıcı profili oluştur
      const userProfileData = {
        uid: userCredential.user.uid,
        email: personalInfo.email,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        role: USER_ROLES.CUSTOMER,
        createdAt: new Date(),
        reservationCount: 1,
        isActive: true
      };
      
      // Firestore'a kullanıcı profili kaydet
      await addDoc(collection(db, FIREBASE_COLLECTIONS.USERS), userProfileData);
      
      setMembershipCreated(true);
      toast.success('Üyeliğiniz otomatik olarak oluşturuldu!');
      
    } catch (error) {
      console.error('Error creating membership:', error);
      // Üyelik oluşturulamazsa sistem devam eder
      setMembershipCreated(true);
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
    <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto p-2 sm:p-3 lg:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
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

        {/* Üyelik Bilgileri */}
        {membershipCreated && membershipPassword && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Üyeliğiniz Oluşturuldu!
              </h3>
              <p className="text-sm text-blue-600">
                SBS Transfer ailesine hoş geldiniz
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-800 mb-3">Giriş Bilgileriniz:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">E-posta:</span>
                  <span className="font-medium text-gray-800">{bookingData.personalInfo?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Şifre:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                    {membershipPassword}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Önemli:</p>
                    <p>Bu bilgilerle müşteri paneline giriş yapabilir, rezervasyonlarınızı takip edebilir ve yeni rezervasyonlar oluşturabilirsiniz.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
