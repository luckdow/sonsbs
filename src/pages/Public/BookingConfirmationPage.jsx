import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  Luggage,
  Car,
  Clock,
  CreditCard,
  Download,
  Home,
  Route,
  Star,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  User,
  Shield,
  QrCode
} from 'lucide-react';
import { collection, addDoc, doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import emailService from '../../services/emailService';
import smsService from '../../services/smsService';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [tempPassword, setTempPassword] = useState('');
  const [userCreated, setUserCreated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [isProcessed, setIsProcessed] = useState(false); // Çifte işlem kontrolü
  
  // Component seviyesinde global işlem kontrolü
  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);

  // Geçici şifre oluştur
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Sıralı rezervasyon kodu oluştur - SBS1001, SBS1002...
  const generateReservationCode = async () => {
    try {
      return await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'counters', 'reservations');
        const counterDoc = await transaction.get(counterRef);
        
        let newCount;
        if (!counterDoc.exists()) {
          newCount = 1001; // SBS1001'den başla
          transaction.set(counterRef, { count: newCount });
        } else {
          newCount = counterDoc.data().count + 1;
          transaction.update(counterRef, { count: newCount });
        }
        
        return `SBS${newCount}`;
      });
    } catch (error) {
      console.error('Rezervasyon kodu oluşturma hatası:', error);
      // Fallback - eski sistem
      const prefix = 'SBS';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `${prefix}${timestamp}${random}`;
    }
  };

  // QR kod oluştur
  const generateQRCode = async (code, customerData = null) => {
    try {
      console.log('🔲 QR kod oluşturma başlatıldı:', code);
      
      // customerData varsa onu kullan, yoksa bookingData'yı kullan
      const customer = customerData || bookingData?.customerInfo;
      
      if (!customer?.phone) {
        console.log('❌ QR kod için telefon numarası bulunamadı:', customer);
        return;
      }
      
      console.log('📱 Telefon numarası bulundu:', customer.phone);
      
      const qrText = `SBS Transfer - Rezervasyon: ${code} - Tel: ${customer.phone}`;
      console.log('📝 QR kod metni:', qrText);
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      
      console.log('✅ QR kod data URL oluşturuldu, uzunluk:', qrCodeDataUrl.length);
      setQrCodeUrl(qrCodeDataUrl);
      console.log('✅ QR kod state\'e kaydedildi');
      
    } catch (error) {
      console.error('❌ QR kod oluşturma hatası:', error);
    }
  };

  // QR kodu indir
  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `SBS-Transfer-${reservationId}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  // Otomatik kullanıcı kaydı oluştur
  const createUserAccount = async (email, password, customerInfo) => {
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
        firstName: customerInfo?.firstName || '',
        lastName: customerInfo?.lastName || '',
        phone: customerInfo?.phone || '',
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
        toast.error('Hesap oluşturulurken bir hata oluştu.');
      }
      return null;
    }
  };

  useEffect(() => {
    console.log('📍 BookingConfirmation useEffect çalıştı - State kontrol:', { 
      isProcessed, 
      isGlobalProcessing,
      hasLocationState: !!location.state?.bookingData 
    });
    
    // ÇOKLU ÇALIŞMAYI ÖNLE - 3 seviyeli kontrol
    if (isProcessed || isGlobalProcessing) {
      console.log('⚠️ BookingConfirmation: Zaten işlendi, tekrar çalışmıyor', { isProcessed, isGlobalProcessing });
      return;
    }

    // Async function for processing
    const processReservation = async () => {
      try {
        // Get booking data from location state - SADECE BİR KEZ ÇALIŞ
        if (location.state?.bookingData) {
          console.log('🔄 BookingConfirmation: İşlem başlatılıyor...');
          console.log('📋 Gelen booking data:', location.state.bookingData);
          
          // İşlemi hemen işaretle - EN BAŞTA
          setIsProcessed(true);
          setIsGlobalProcessing(true);
          
          let data = location.state.bookingData;
          
          // BookingWizard personalInfo kullanıyor, admin paneli customerInfo bekliyor - dönüştür
          if (data.personalInfo && !data.customerInfo) {
            console.log('🔄 personalInfo -> customerInfo dönüşümü yapılıyor');
            data.customerInfo = {
              firstName: data.personalInfo.firstName,
              lastName: data.personalInfo.lastName,
              phone: data.personalInfo.phone,
              email: data.personalInfo.email,
              flightNumber: data.personalInfo.flightNumber,
              flightTime: data.personalInfo.flightTime,
              specialRequests: data.personalInfo.specialRequests
            };
            // personalInfo'yu kaldır
            delete data.personalInfo;
          }
          
          setBookingData(data);
          
          // Rezervasyon ID'si oluştur
          console.log('🎯 Rezervasyon ID oluşturuluyor...');
          const reservationCode = await generateReservationCode();
          console.log('✅ Oluşturulan rezervasyon ID:', reservationCode);
          setReservationId(reservationCode);
          
          // Otomatik kullanıcı hesabı oluştur
          if (data.customerInfo?.email) {
            console.log('👤 Otomatik kullanıcı hesabı oluşturuluyor...');
            const password = generateTempPassword();
            setTempPassword(password);
            await createUserAccount(
              data.customerInfo.email,
              password,
              data.customerInfo
            );
          }
          
          // Rezervasyonu doğru formatta Firebase'e kaydet
          console.log('💾 Firebase\'e rezervasyon kaydediliyor...');
          await saveReservationToFirebase(data, reservationCode);
          
          // QR kod oluştur - hemen oluştur, setTimeout yok
          console.log('🔲 QR kod oluşturuluyor...');
          console.log('📋 Mevcut bookingData:', data.customerInfo);
          if (data.customerInfo?.phone) {
            // bookingData state'i set edilmeden önce QR oluşturamaayız, biraz bekleyelim
            setTimeout(async () => {
              console.log('🔲 QR kod oluşturma için bookingData kontrol:', bookingData);
              await generateQRCode(reservationCode, data.customerInfo); // Direct data kullan
            }, 500); // bookingData set olduktan sonra
          } else {
            console.warn('⚠️ QR kod için telefon numarası yok:', data.customerInfo);
          }

          // E-posta gönder
          if (data.customerInfo?.email) {
            console.log('📧 Rezervasyon onay e-postası gönderiliyor...');
            const emailData = {
              ...data,
              reservationId: reservationCode,
              tempPassword: password || generateTempPassword()
            };
            
            // E-posta gönderme işlemini async olarak yap (sayfayı bloklamasın)
            setTimeout(async () => {
              try {
                const emailResult = await emailService.sendReservationConfirmation(emailData);
                if (emailResult.success) {
                  console.log('✅ E-posta başarıyla gönderildi:', emailResult.email);
                  toast.success('Rezervasyon onay e-postası gönderildi!');
                } else {
                  console.error('❌ E-posta gönderme hatası:', emailResult.error);
                  toast.error('E-posta gönderilirken hata oluştu');
                }
              } catch (error) {
                console.error('❌ E-posta servisi hatası:', error);
                toast.error('E-posta servisi hatası');
              }
            }, 1000); // 1 saniye sonra gönder
          } else {
            console.warn('⚠️ E-posta adresi bulunamadı, e-posta gönderilmedi');
          }
          
          console.log('✅ BookingConfirmation: İşlem tamamlandı');
        } else {
          console.log('❌ Booking data yok, ana sayfaya yönlendiriliyor');
          // Redirect to home if no booking data
          navigate('/');
        }
      } catch (error) {
        console.error('❌ Rezervasyon işleme hatası:', error);
        // Hata durumunda flags'leri reset et
        setIsProcessed(false);
        setIsGlobalProcessing(false);
      }
    };

    processReservation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // BOŞALT - Sadece component mount'ta çalışsın

  // Rezervasyonu Firebase'e admin panelin beklediği formatta kaydet
  const saveReservationToFirebase = async (data, reservationCode) => {
    try {
      console.log('💾 Firebase kayıt işlemi başlatılıyor:', reservationCode);
      
      const reservationData = {
        // Admin panelin tam olarak beklediği yapı
        reservationCode: reservationCode,  // reservationId değil reservationCode kullan
        reservationId: reservationCode,    // Hem reservationCode hem reservationId ekle - uyumluluk için
        status: 'pending',  // Bekleyen olarak kaydet, admin onaylayacak
        direction: data.direction === 'airport-to-hotel' ? 'from_airport' : 'to_airport',
        customerInfo: {
          firstName: data.customerInfo?.firstName || '',
          lastName: data.customerInfo?.lastName || '',
          phone: data.customerInfo?.phone || '',
          email: data.customerInfo?.email || ''
        },
        tripDetails: {
          date: data.date || '',
          time: data.time || '',
          pickupLocation: typeof data.pickupLocation === 'object' 
            ? data.pickupLocation?.address || data.pickupLocation?.formatted_address || data.pickupLocation?.name || ''
            : data.pickupLocation || '',
          dropoffLocation: typeof data.dropoffLocation === 'object'
            ? data.dropoffLocation?.address || data.dropoffLocation?.formatted_address || data.dropoffLocation?.name || ''
            : data.dropoffLocation || '',
          passengerCount: data.passengerCount || 1,
          luggageCount: data.baggageCount || 0,
          flightNumber: data.customerInfo?.flightNumber || ''
        },
        selectedVehicle: data.selectedVehicle?.id || '',
        paymentMethod: data.paymentMethod || 'cash',
        totalPrice: data.selectedVehicle?.totalPrice || data.totalPrice || data.selectedVehicle?.price || 0,
        calculatedDistance: data.distance || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📋 Kaydedilecek rezervasyon yapısı:', reservationData);

      // Firebase'e kaydet
      const docRef = await addDoc(collection(db, 'reservations'), reservationData);
      console.log('✅ Rezervasyon admin paneline kaydedildi:', docRef.id);
      console.log('🎯 Rezervasyon kodu:', reservationCode);
      toast.success(`Rezervasyon başarıyla kaydedildi! (${reservationCode})`);
      
      // E-posta gönder
      try {
        console.log('📧 E-posta gönderimi başlatılıyor...');
        const emailData = {
          ...reservationData,
          reservationId: reservationCode,
          tempPassword: tempPassword
        };
        
        const emailResult = await emailService.sendReservationConfirmation(emailData);
        
        if (emailResult.success) {
          console.log('✅ E-posta başarıyla gönderildi:', emailResult);
          toast.success('Rezervasyon onay e-postası gönderildi!');
        } else {
          console.log('⚠️ E-posta gönderilemedi:', emailResult.error);
          toast.warning('Rezervasyon kaydedildi ancak e-posta gönderilemedi');
        }
      } catch (emailError) {
        console.error('❌ E-posta gönderme hatası:', emailError);
        toast.warning('Rezervasyon kaydedildi ancak e-posta gönderilemedi');
      }

      // SMS gönder
      try {
        const smsData = {
          ...reservationData,
          reservationNumber: reservationCode,
          customerPhone: reservationData.phone
        };
        
        const smsResult = await smsService.sendReservationConfirmation(smsData);
        
        if (smsResult.success) {
          console.log('✅ SMS başarıyla gönderildi:', smsResult);
          toast.success('Rezervasyon onay SMS\'i gönderildi!');
        } else {
          console.log('⚠️ SMS gönderilemedi:', smsResult.message);
          // SMS başarısız olursa toast gösterme, çünkü rezervasyon başarılı
        }
      } catch (smsError) {
        console.error('❌ SMS gönderme hatası:', smsError);
        // SMS hatası durumunda da toast gösterme
      }
      
    } catch (error) {
      console.error('❌ Rezervasyon kaydedilirken hata:', error);
      toast.error('Rezervasyon kaydedilirken bir hata oluştu.');
      throw error; // Hatayı yukarı fırlat
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    console.log('PDF download functionality will be implemented');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 px-2"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-3 sm:mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rezervasyonunuz Onaylandı!
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg px-2">
            Rezervasyon numaranız: <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">#{reservationId}</span>
          </p>
        </motion.div>

        {/* Otomatik Hesap Bilgisi */}
        {userCreated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 mx-2 sm:mx-0 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Müşteri Hesabınız Otomatik Oluşturuldu!
              </h3>
            </div>
            <div className="text-center text-gray-700 text-xs sm:text-sm">
              <p className="mb-2 break-words">E-posta: <span className="font-medium">{bookingData.customerInfo?.email}</span></p>
              <p className="mb-2">Geçici Şifre: <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm">{tempPassword}</span></p>
              <p className="text-xs text-gray-600">Bu bilgilerle müşteri sayfanıza giriş yapabilirsiniz.</p>
            </div>
          </motion.div>
        )}

        {/* E-posta Gönderildi Bilgisi */}
        {bookingData.customerInfo?.email && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 mx-2 sm:mx-0 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Onay E-postası Gönderildi!
              </h3>
            </div>
            <div className="text-center text-gray-700 text-xs sm:text-sm">
              <p className="mb-2 break-words">
                📧 <span className="font-medium">{bookingData.customerInfo.email}</span> adresine rezervasyon detayları gönderildi
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Rezervasyon detayları</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>QR kod</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Giriş bilgileri</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                E-posta gelmezse spam klasörünü kontrol edin
              </p>
            </div>
          </motion.div>
        )}

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 mx-2 sm:mx-0 border border-gray-100"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rezervasyon Detayları
            </span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Route Information */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Route className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">Güzergah</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {typeof bookingData.pickupLocation === 'object' 
                          ? bookingData.pickupLocation?.address 
                          : bookingData.pickupLocation || 'Belirlenmedi'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-3 h-3 text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>
                        {typeof bookingData.dropoffLocation === 'object' 
                          ? bookingData.dropoffLocation?.address 
                          : bookingData.dropoffLocation || 'Belirlenmedi'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {bookingData.routeInfo && (
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mesafe:</span>
                    <span className="font-medium">{bookingData.routeInfo.distance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tahmini Süre:</span>
                    <span className="font-medium">{bookingData.routeInfo.duration}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Tarih ve Saat</h3>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Gidiş:</span> {bookingData.date} - {bookingData.time}</p>
                    {bookingData.tripType === 'round-trip' && (
                      <p><span className="font-medium">Dönüş:</span> {bookingData.returnDate} - {bookingData.returnTime}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Car className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Araç</h3>
                  <p className="text-sm text-gray-600">{bookingData.selectedVehicle?.name || 'Belirlenmedi'}</p>
                  <p className="text-sm text-gray-500">{bookingData.selectedVehicle?.description}</p>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Yolcu Bilgileri</h3>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Yolcu Sayısı:</span> {bookingData.passengerCount} kişi</p>
                    <p><span className="font-medium">Bagaj:</span> {bookingData.baggageCount} adet</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Ödeme</h3>
                  <p className="text-sm text-gray-600">
                    {bookingData.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Nakit'}
                  </p>
                  <p className="text-lg font-bold text-green-600">€{bookingData.totalPrice}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">İletişim Bilgileri</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Ad Soyad:</span> {bookingData.customerInfo?.firstName} {bookingData.customerInfo?.lastName}</p>
                  <p><span className="font-medium">Telefon:</span> {bookingData.customerInfo?.phone}</p>
                  <p><span className="font-medium">E-posta:</span> {bookingData.customerInfo?.email}</p>
                </div>
              </div>

              {bookingData.customerInfo?.flightNumber && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Uçuş Bilgileri</h3>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Uçuş No:</span> {bookingData.customerInfo.flightNumber}</p>
                    {bookingData.customerInfo.flightTime && (
                      <p><span className="font-medium">Uçuş Saati:</span> {bookingData.customerInfo.flightTime}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="space-y-4 lg:col-span-2 xl:col-span-1 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">QR Kod</h3>
                </div>
                {qrCodeUrl ? (
                  <div>
                    <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-purple-200 inline-block mb-4 shadow-lg">
                      <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto" />
                    </div>
                    <button
                      onClick={downloadQRCode}
                      className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      QR Kodunu İndir
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-purple-200">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-4">QR kod oluşturuluyor...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Sırada Ne Var?</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span>E-posta adresinize onay mesajı gönderilecek</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Şoförümüz seyahat öncesi sizinle iletişime geçecek</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>Belirlenen zamanda kalkış noktasında hazır olun</span>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Telefon</p>
                <p className="text-sm text-gray-600">+90 555 123 45 67</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">E-posta</p>
                <p className="text-sm text-gray-600">info@sonstransfer.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">7/24 Destek</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 sm:space-y-6 mx-2 sm:mx-0"
        >
          {/* Müşteri Hesabı Büyük Kart */}
          {userCreated && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 sm:p-8 text-center shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Müşteri Hesabınız Hazır!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">Rezervasyonlarınızı takip edin ve profil ayarlarınızı düzenleyin</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/profil')}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  Müşteri Sayfama Git
                </button>
                
                <button
                  onClick={() => navigate('/rezervasyonlarim')}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  Rezervasyonlarım
                </button>
              </div>
            </div>
          )}

          {/* Diğer Butonlar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>PDF İndir</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Ana Sayfa</span>
            </button>
          </div>
        </motion.div>

        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-8 p-6 bg-gray-100 rounded-lg"
        >
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Deneyiminizi Değerlendirin</h3>
          <p className="text-gray-600 text-sm mb-4">
            Hizmetimizden memnun kaldınız mı? Geri bildiriminiz bizim için çok değerli.
          </p>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
            Değerlendir
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
