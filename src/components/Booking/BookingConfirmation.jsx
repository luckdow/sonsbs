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
  Star,
  Clock,
  Route,
  Package,
  Home,
  ArrowRight,
  Info,
  Banknote,
  Building2,
  Copy,
  Check,
  Plane,
  User,
  Shield,
  FileText
} from 'lucide-react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';
import { generateReservationPDF } from '../../utils/pdfGenerator';

const BookingConfirmation = ({ bookingData, onComplete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [reservationCode, setReservationCode] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const navigate = useNavigate();

  // Lokasyon objesini stringe çeviren yardımcı fonksiyon
  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return location.address;
      if (location.name) return location.name;
      if (location.formatted_address) return location.formatted_address;
      if (location.description) return location.description;
      if (location.lat && location.lng) return `${location.lat}, ${location.lng}`;
      return 'Lokasyon bilgisi mevcut';
    }
    return String(location);
  };

  // Rezervasyon kodu oluştur
  const generateReservationCode = () => {
    const prefix = 'SBS';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  // Geçici şifre oluştur
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Şirket bilgilerini yükle
  const loadCompanyInfo = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data();
        setCompanyInfo(settings.companyInfo || {});
      }
    } catch (error) {
      console.error('Şirket bilgileri yüklenirken hata:', error);
    }
  };

  // PDF indirme fonksiyonu
  const downloadPDF = async () => {
    if (!reservationData || !reservationCode) {
      toast.error('Rezervasyon bilgileri henüz hazır değil');
      return;
    }

    try {
      await generateReservationPDF(reservationData, companyInfo, qrCodeUrl);
      toast.success('PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      toast.error('PDF indirirken bir hata oluştu');
    }
  };

  // Toplam tutarı hesapla
  const calculateTotal = () => {
    const vehiclePrice = bookingData.selectedVehicle?.totalPrice || 0;
    const servicesTotal = (bookingData.selectedServices || []).reduce((total, service) => total + (service.price || 0), 0);
    return vehiclePrice + servicesTotal;
  };

  // QR kod oluştur
  const generateQRCode = async (code) => {
    try {
      console.log('QR kod oluşturuluyor:', code);
      const qrText = `SBS Transfer - Rezervasyon: ${code}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
      console.log('QR kod oluşturuldu:', qrCodeDataUrl ? 'Başarılı' : 'Başarısız');
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
    }
  };

  // Rezervasyonu tamamla
  const handleConfirmReservation = async () => {
    const code = generateReservationCode();
    const password = generateTempPassword();
    setReservationCode(code);
    setTempPassword(password);

    // Rezervasyon verisini hazırla
    const newReservationData = {
      reservationCode: code,
      tempPassword: password,
      status: 'confirmed',
      direction: bookingData.direction,
      pickupLocation: formatLocation(bookingData.pickupLocation),
      dropoffLocation: formatLocation(bookingData.dropoffLocation),
      date: bookingData.date,
      time: bookingData.time,
      vehicle: {
        id: bookingData.selectedVehicle?.id,
        brand: bookingData.selectedVehicle?.brand,
        model: bookingData.selectedVehicle?.model,
        category: bookingData.selectedVehicle?.category,
        price: bookingData.selectedVehicle?.totalPrice
      },
      passenger: {
        count: bookingData.passengerCount || 1,
        firstName: bookingData.personalInfo?.firstName,
        lastName: bookingData.personalInfo?.lastName,
        email: bookingData.personalInfo?.email,
        phone: bookingData.personalInfo?.phone,
        flightNumber: bookingData.personalInfo?.flightNumber,
        flightTime: bookingData.personalInfo?.flightTime,
        specialRequests: bookingData.personalInfo?.specialRequests
      },
      payment: {
        method: bookingData.paymentMethod,
        amount: calculateTotal(),
        status: bookingData.paymentMethod === 'cash' ? 'pending' :
                bookingData.paymentMethod === 'bank_transfer' ? 'pending' : 'completed'
      },
      extraServices: bookingData.selectedServices || [],
      distance: bookingData.distance,
      duration: bookingData.duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReservationData(newReservationData);

    try {
      // Firebase'e kaydet
      const docRef = await addDoc(collection(db, 'reservations'), newReservationData);
      console.log('Rezervasyon kaydedildi:', docRef.id);

      toast.success('Rezervasyonunuz başarıyla oluşturuldu!');
      
      if (onComplete) {
        onComplete(newReservationData);
      }
    } catch (error) {
      console.error('Rezervasyon oluşturma hatası:', error);
      toast.error('Rezervasyon oluşturulurken bir hata oluştu.');
    }
  };

  // Rezervasyon kodunu kopyala
  const copyReservationCode = () => {
    navigator.clipboard.writeText(reservationCode);
    setCopied(true);
    toast.success('Rezervasyon kodu kopyalandı!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Geçici şifreyi kopyala
  const copyTempPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setPasswordCopied(true);
    toast.success('Geçici şifre kopyalandı!');
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  // QR kodu indir
  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `SBS-Transfer-${reservationCode}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  // Ana sayfaya dön
  const goToHome = () => {
    navigate('/');
  };

  // Rezervasyonlarım sayfasına git
  const goToMyReservations = () => {
    navigate('/my-reservations');
  };

  // Profil sayfasına git
  const goToProfile = () => {
    navigate('/profile');
  };

  // Component mount olduğunda rezervasyonu oluştur ve şirket bilgilerini yükle
  useEffect(() => {
    loadCompanyInfo();
    handleConfirmReservation();
  }, []);

  // Rezervasyon kodu değiştiğinde QR kod oluştur
  useEffect(() => {
    if (reservationCode) {
      generateQRCode(reservationCode);
    }
  }, [reservationCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-8">
        <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Rezervasyon Tamamlandı!</h1>
            <p className="text-green-100 text-sm">
              Transfer rezervasyonunuz başarıyla oluşturuldu
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-3xl shadow-xl p-6"
        >
          {/* Başarı Mesajı */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 text-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Rezervasyon Başarılı!
            </h2>
            <p className="text-gray-600 mb-4">
              Transfer rezervasyonunuz başarıyla oluşturuldu.
            </p>
          </div>

          {/* QR Kod, Rezervasyon ID ve Geçici Şifre */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sol: QR Kod */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Kod</h3>
              {qrCodeUrl ? (
                <div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 mx-auto" />
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    QR Kodunu İndir
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="w-40 h-40 mx-auto flex items-center justify-center bg-gray-200 rounded">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">QR kod oluşturuluyor...</p>
                </div>
              )}
            </div>

            {/* Sağ: Rezervasyon ID ve Geçici Şifre */}
            <div className="space-y-4">
              {/* Rezervasyon Kodu */}
              <div className="bg-white border-2 border-green-300 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Rezervasyon Kodunuz:</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">{reservationCode}</span>
                  <button
                    onClick={copyReservationCode}
                    className="ml-3 p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-green-600" />}
                  </button>
                </div>
              </div>

              {/* Geçici Şifre */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Geçici Şifreniz:</p>
                <p className="text-xs text-gray-500 mb-3">(Rezervasyonlarınızı görüntülemek için)</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-900">{tempPassword}</span>
                  <button
                    onClick={copyTempPassword}
                    className="ml-3 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    {passwordCopied ? <Check className="w-5 h-5 text-blue-600" /> : <Copy className="w-5 h-5 text-blue-600" />}
                  </button>
                </div>
              </div>

              {/* Toplam Tutar */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transfer Ücreti</span>
                    <span className="font-medium">₺{(bookingData.selectedVehicle?.totalPrice || 0).toLocaleString()}</span>
                  </div>
                  
                  {bookingData.selectedServices && bookingData.selectedServices.length > 0 && (
                    bookingData.selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{service.name}</span>
                        <span className="font-medium">₺{(service.price || 0).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                  
                  <div className="border-t border-green-300 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Toplam Tutar</span>
                      <span className="text-xl font-bold text-green-600">
                        ₺{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Bilgileri ve Yolcu Bilgileri */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sol: Transfer Bilgileri */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Route className="w-5 h-5 mr-2 text-blue-600" />
                Transfer Bilgileri
              </h3>
              
              <div className="space-y-4">
                {/* Transfer Yönü */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Route className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transfer Yönü</p>
                    <p className="font-medium text-gray-900">
                      {bookingData.direction === 'airport-to-hotel'
                         ? 'Havalimanı → Otel'
                         : 'Otel → Havalimanı'
                      }
                    </p>
                  </div>
                </div>

                {/* Lokasyonlar */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Kalkış - Varış</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatLocation(bookingData.pickupLocation)} → {formatLocation(bookingData.dropoffLocation)}
                    </p>
                  </div>
                </div>

                {/* Tarih & Saat */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tarih & Saat</p>
                    <p className="font-medium text-gray-900">
                      {new Date(bookingData.date).toLocaleDateString('tr-TR')} - {bookingData.time}
                    </p>
                  </div>
                </div>

                {/* Araç */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Araç</p>
                    <p className="font-medium text-gray-900">
                      {bookingData.selectedVehicle?.brand} {bookingData.selectedVehicle?.model}
                    </p>
                  </div>
                </div>

                {/* Ödeme */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    {bookingData.paymentMethod === 'cash' ? <Banknote className="w-5 h-5 text-emerald-600" /> :
                     bookingData.paymentMethod === 'bank_transfer' ? <Building2 className="w-5 h-5 text-emerald-600" /> :
                     <CreditCard className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ödeme Yöntemi</p>
                    <p className="font-medium text-gray-900">
                      {bookingData.paymentMethod === 'cash' ? 'Nakit Ödeme' :
                       bookingData.paymentMethod === 'bank_transfer' ? 'Banka Havalesi' :
                       'Kredi Kartı'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Yolcu Bilgileri */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Yolcu Bilgileri
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ad Soyad</p>
                    <p className="font-medium text-gray-900">
                      {bookingData.personalInfo?.firstName} {bookingData.personalInfo?.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium text-gray-900">{bookingData.personalInfo?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-posta</p>
                    <p className="font-medium text-gray-900">{bookingData.personalInfo?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Yolcu Sayısı</p>
                    <p className="font-medium text-gray-900">{bookingData.passengerCount || 1} kişi</p>
                  </div>
                </div>

                {bookingData.personalInfo?.flightNumber && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Uçuş No</p>
                      <p className="font-medium text-gray-900">{bookingData.personalInfo?.flightNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sonraki Adımlar */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Sonraki Adımlar:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Rezervasyon kodunuzu not alın veya ekran görüntüsü kaydedin</li>
                  <li>• Transfer zamanından 15 dakika önce hazır olun</li>
                  <li>• Şoförümüz sizinle iletişime geçecektir</li>
                  <li>• Sorularınız için +90 555 123 45 67 numarayı arayabilirsiniz</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Ana Sayfa ve Yönlendirme Butonları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              PDF İndir
            </button>
            <button
              onClick={goToHome}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ana Sayfa
            </button>
            <button
              onClick={goToMyReservations}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Rezervasyonlarım
            </button>
            <button
              onClick={goToProfile}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Profilim
            </button>
          </div>
        </motion.div>
        </div>
      </div>
    );
};

export default BookingConfirmation;
