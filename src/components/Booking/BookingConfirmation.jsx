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
  Home,
  User,
  Shield,
  FileText,
  ChevronDown,
  Image,
  Banknote,
  Building2,
  Copy,
  Check,
  Plane,
  Info,
  Clock,
  Route
} from 'lucide-react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BookingConfirmation = ({ bookingData, onComplete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [reservationCode, setReservationCode] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
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

  // Otomatik kullanıcı kaydı oluştur
  const createUserAccount = async (email, password, personalInfo) => {
    try {
      console.log('Otomatik kullanıcı kaydı başlatılıyor:', email);
      
      // Firebase Auth ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Firebase Auth kullanıcısı oluşturuldu:', user.uid);
      
      // Kullanıcı profilini Firestore'a kaydet
      const userProfileData = {
        uid: user.uid,
        email: email,
        firstName: personalInfo?.firstName || '',
        lastName: personalInfo?.lastName || '',
        phone: personalInfo?.phone || '',
        createdAt: new Date().toISOString(),
        registrationMethod: 'automatic_booking',
        isActive: true,
        tempPassword: password // Geçici şifre bilgisini tutmak için
      };

      await addDoc(collection(db, 'users'), userProfileData);
      console.log('Kullanıcı profili Firestore\'a kaydedildi');
      
      setUserCreated(true);
      toast.success('Müşteri hesabınız otomatik olarak oluşturuldu!');
      
      return user;
    } catch (error) {
      console.error('Otomatik kullanıcı kaydı hatası:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        console.log('Email zaten kayıtlı, mevcut kullanıcı kullanılacak');
        toast.info('Bu e-posta adresi zaten kayıtlı. Mevcut hesabınızı kullanabilirsiniz.');
      } else {
        toast.error('Otomatik hesap oluşturulurken bir hata oluştu.');
      }
      
      return null;
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
      const qrText = `SBS Transfer - Rezervasyon: ${code} - ${bookingData.personalInfo?.phone}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
      console.log('QR kod başarıyla oluşturuldu');
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

    // Otomatik kullanıcı kaydı oluştur
    if (bookingData.personalInfo?.email) {
      await createUserAccount(
        bookingData.personalInfo.email,
        password,
        bookingData.personalInfo
      );
    }

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
      userRegistered: userCreated,
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
    toast.success('Şifre kopyalandı!');
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  // PDF indirme fonksiyonu - Görüntü tabanlı
  const downloadPDFAsImage = async () => {
    if (!reservationCode) {
      toast.error('Rezervasyon bilgileri henüz hazır değil');
      return;
    }

    try {
      toast.loading('PDF oluşturuluyor...', { id: 'pdf-loading' });
      
      const element = document.getElementById('booking-confirmation-content');
      if (!element) {
        throw new Error('PDF içeriği bulunamadı');
      }

      // Element'i görüntü olarak yakala
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // PDF oluştur
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // İlk sayfa
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Gerekirse ek sayfalar ekle
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF'i indir
      const fileName = `SBS_Transfer_${reservationCode}_Goruntu.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF başarıyla indirildi!', { id: 'pdf-loading' });
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      toast.error('PDF indirirken bir hata oluştu', { id: 'pdf-loading' });
    }
  };

  // Metin tabanlı PDF indirme
  const downloadPDFAsText = async () => {
    if (!reservationData || !reservationCode) {
      toast.error('Rezervasyon bilgileri henüz hazır değil');
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      let yPosition = 20;

      // Başlık
      pdf.setFontSize(20);
      pdf.text('SBS Transfer Rezervasyon Onayı', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Rezervasyon Kodu
      pdf.setFontSize(14);
      pdf.text(`Rezervasyon Kodu: ${reservationCode}`, 20, yPosition);
      yPosition += 10;

      // Rezervasyon bilgileri
      pdf.setFontSize(12);
      const details = [
        `Müşteri: ${bookingData.personalInfo?.firstName} ${bookingData.personalInfo?.lastName}`,
        `Telefon: ${bookingData.personalInfo?.phone}`,
        `Email: ${bookingData.personalInfo?.email}`,
        `Kalkış: ${formatLocation(bookingData.pickupLocation)}`,
        `Varış: ${formatLocation(bookingData.dropoffLocation)}`,
        `Tarih: ${bookingData.date}`,
        `Saat: ${bookingData.time}`,
        `Araç: ${bookingData.selectedVehicle?.brand} ${bookingData.selectedVehicle?.model}`,
        `Yolcu Sayısı: ${bookingData.passengerCount || 1}`,
        `Ödeme: ${bookingData.paymentMethod === 'cash' ? 'Nakit' : 
                  bookingData.paymentMethod === 'bank_transfer' ? 'Havale' : 'Kredi Kartı'}`,
        `Toplam Tutar: €${calculateTotal()}`
      ];

      details.forEach(detail => {
        pdf.text(detail, 20, yPosition);
        yPosition += 8;
      });

      // PDF'i indir
      const fileName = `SBS_Transfer_${reservationCode}_Metin.pdf`;
      pdf.save(fileName);
      
      toast.success('Metin PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      toast.error('PDF indirirken bir hata oluştu');
    }
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

  // Müşteri sayfasına git
  const goToCustomerPage = () => {
    navigate('/profil');
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

  // Dropdown menü dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPdfOptions && !event.target.closest('.relative')) {
        setShowPdfOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPdfOptions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">Rezervasyon Tamamlandı!</h1>
            <p className="text-green-100 text-sm">
              Transfer rezervasyonunuz başarıyla oluşturuldu
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <motion.div
          id="booking-confirmation-content"
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
            
            {/* Otomatik Hesap Bilgisi */}
            {userCreated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Müşteri hesabınız otomatik oluşturuldu!</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  E-posta adresiniz ve geçici şifrenizle giriş yapabilirsiniz.
                </p>
              </div>
            )}
          </div>

          {/* QR Kod, Rezervasyon ID ve Geçici Şifre */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sol: QR Kod */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Kod</h3>
              
              {qrCodeUrl ? (
                <div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
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
                  <div className="w-32 h-32 mx-auto flex items-center justify-center bg-gray-200 rounded">
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
                <p className="text-sm text-gray-600 mb-2">Müşteri Girişi:</p>
                <p className="text-xs text-gray-500 mb-3">E-posta: {bookingData.personalInfo?.email}</p>
                <p className="text-xs text-gray-500 mb-2">Geçici Şifre:</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-900">{tempPassword}</span>
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
                <h4 className="font-semibold text-green-900 mb-3 text-sm">Ödeme Özeti</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transfer Ücreti</span>
                    <span className="font-medium">€{(bookingData.selectedVehicle?.totalPrice || 0).toLocaleString()}</span>
                  </div>
                  
                  {bookingData.selectedServices && bookingData.selectedServices.length > 0 && (
                    bookingData.selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{service.name}</span>
                        <span className="font-medium">€{(service.price || 0).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                  
                  <div className="border-t border-green-300 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Toplam Tutar</span>
                      <span className="text-lg font-bold text-green-600">
                        €{calculateTotal().toLocaleString()}
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
                  <li>• Rezervasyon kodunuzu not alın</li>
                  <li>• Transfer zamanından 15 dakika önce hazır olun</li>
                  <li>• Şoförümüz sizinle iletişime geçecektir</li>
                  <li>• Müşteri hesabınızla rezervasyonlarınızı takip edebilirsiniz</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ana Sayfa ve Yönlendirme Butonları */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* PDF İndirme Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPdfOptions(!showPdfOptions)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                PDF İndir
                <ChevronDown className={`w-4 h-4 transition-transform ${showPdfOptions ? 'rotate-180' : ''}`} />
              </button>
              
              {showPdfOptions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  <button
                    onClick={() => {
                      downloadPDFAsImage();
                      setShowPdfOptions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-xl flex items-center gap-2"
                  >
                    <Image className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Görüntü PDF</p>
                      <p className="text-xs text-gray-500">Tam sayfa görüntüsü</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadPDFAsText();
                      setShowPdfOptions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-xl flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Metin PDF</p>
                      <p className="text-xs text-gray-500">Yazıcı dostu</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

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
              onClick={goToCustomerPage}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Müşteri Sayfam
            </button>
          </div>

          {/* Büyük Müşteri Giriş Butonu */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">Müşteri Hesabınız Hazır!</h3>
                <p className="text-sm text-gray-600">Rezervasyonlarınızı takip edin</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={goToCustomerPage}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <User className="w-5 h-5" />
                Müşteri Sayfama Git
              </button>
              
              <button
                onClick={goToMyReservations}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                Rezervasyonlarım
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
