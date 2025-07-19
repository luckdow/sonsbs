import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Banknote, 
  Building2, 
  Check, 
  AlertCircle,
  Lock,
  Info,
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  Calendar,
  MapPin,
  User,
  Car
} from 'lucide-react';
import { collection, getDocs, query, where, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

const PaymentMethods = ({ bookingData, setBookingData, onNext, onBack }) => {
  const [selectedPayment, setSelectedPayment] = useState(bookingData.paymentMethod || '');
  const [error, setError] = useState('');
  const [paymentSettings, setPaymentSettings] = useState({
    paytrMerchantId: '',
    paytrMerchantKey: '',
    paytrMerchantSalt: '',
    paytrEnabled: false,
    bankTransferEnabled: true,
    cashEnabled: true,
    testMode: true,
    bankAccounts: []
  });
  const [loading, setLoading] = useState(true);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [creditCardForm, setCreditCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Admin panelinden ödeme ayarlarını al - Real-time listener
  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'main');
    
    const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log('Settings updated in real-time:', data);
        
        let paymentConfig = {
          paytrMerchantId: '',
          paytrMerchantKey: '',
          paytrMerchantSalt: '',
          paytrEnabled: false,
          bankTransferEnabled: true,
          cashEnabled: true,
          testMode: true,
          bankAccounts: []
        };

        // Payment ayarları
        if (data.payment) {
          paymentConfig.paytrMerchantId = data.payment.paytrMerchantId || '';
          paymentConfig.paytrMerchantKey = data.payment.paytrMerchantKey || '';
          paymentConfig.paytrMerchantSalt = data.payment.paytrMerchantSalt || '';
          paymentConfig.testMode = data.payment.testMode !== false;
          
          // PayTR enabled kontrolü - API keys varsa ve enabled ise
          paymentConfig.paytrEnabled = !!(
            data.payment.paytrMerchantId && 
            data.payment.paytrMerchantKey && 
            data.payment.paytrMerchantSalt &&
            data.payment.enabledMethods?.creditCard
          );

          // Diğer ödeme yöntemleri
          if (data.payment.enabledMethods) {
            paymentConfig.cashEnabled = data.payment.enabledMethods.cash !== false;
            paymentConfig.bankTransferEnabled = data.payment.enabledMethods.bankTransfer !== false;
          }
        }

        // Banka hesapları
        if (data.bankAccounts && Array.isArray(data.bankAccounts)) {
          paymentConfig.bankAccounts = data.bankAccounts.filter(account => account.isActive !== false);
        }

        console.log('Final Payment Config:', paymentConfig);
        setPaymentSettings(paymentConfig);
      }
      setLoading(false);
    }, (error) => {
      console.error('Settings listener error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Ödeme seçenekleri
  const getPaymentOptions = () => {
    const options = [];

    // Nakit ödeme - Admin panelinden kontrol
    if (paymentSettings.cashEnabled) {
      options.push({
        id: 'cash',
        name: 'Nakit Ödeme',
        description: 'Transfer sırasında şoföre nakit olarak ödeyin',
        icon: Banknote,
        color: 'green',
        recommended: true
      });
    }

    // Banka havalesi - Admin panelinden kontrol ve aktif banka hesapları var mı
    if (paymentSettings.bankTransferEnabled && paymentSettings.bankAccounts.length > 0) {
      options.push({
        id: 'bank_transfer',
        name: 'Banka Havalesi',
        description: 'Banka hesabımıza havale/EFT yapın',
        icon: Building2,
        color: 'blue'
      });
    }

    // Kredi kartı (PayTR) - API keys var mı ve admin panelinden aktif mi
    if (paymentSettings.paytrEnabled) {
      options.push({
        id: 'credit_card',
        name: 'Kredi Kartı',
        description: paymentSettings.testMode ? 'Test modu - Güvenli ödeme' : 'Online güvenli ödeme',
        icon: CreditCard,
        color: 'purple'
      });
    }

    return options;
  };

  const paymentOptions = getPaymentOptions();

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
    setError('');
    
    // Kredi kartı seçilince formu göster
    if (paymentId === 'credit_card') {
      setShowCreditCardForm(true);
      setShowBankDetails(false);
    }
    // Banka havalesi seçilince detayları göster
    else if (paymentId === 'bank_transfer') {
      setShowBankDetails(true);
      setShowCreditCardForm(false);
    }
    // Diğer seçeneklerde formları gizle
    else {
      setShowCreditCardForm(false);
      setShowBankDetails(false);
    }
  };

  const handleCreditCardInputChange = (field, value) => {
    setCreditCardForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const validateCreditCard = () => {
    const errors = {};
    
    if (!creditCardForm.cardNumber || creditCardForm.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Geçerli bir kart numarası girin';
    }
    
    if (!creditCardForm.expiryDate || creditCardForm.expiryDate.length < 5) {
      errors.expiryDate = 'Son kullanma tarihini girin';
    }
    
    if (!creditCardForm.cvv || creditCardForm.cvv.length < 3) {
      errors.cvv = 'CVV kodunu girin';
    }
    
    if (!creditCardForm.cardName.trim()) {
      errors.cardName = 'Kart üzerindeki ismi girin';
    }
    
    return errors;
  };

  const calculateTotal = () => {
    const vehiclePrice = bookingData.selectedVehicle?.totalPrice || 0;
    const servicesTotal = (bookingData.selectedServices || []).reduce((total, service) => total + (service.price || 0), 0);
    return vehiclePrice + servicesTotal;
  };

  const handleNext = () => {
    if (!selectedPayment) {
      setError('Lütfen bir ödeme yöntemi seçiniz');
      return;
    }

    // Kredi kartı seçildiyse form validasyonu
    if (selectedPayment === 'credit_card') {
      const cardErrors = validateCreditCard();
      if (Object.keys(cardErrors).length > 0) {
        setError('Lütfen kredi kartı bilgilerini eksiksiz doldurun');
        return;
      }
    }

    const updatedData = {
      ...bookingData,
      paymentMethod: selectedPayment,
      creditCardInfo: selectedPayment === 'credit_card' ? creditCardForm : null,
      totalAmount: calculateTotal()
    };
    
    setBookingData(updatedData);
    onNext();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Ödeme seçenekleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-8">
        <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Ödeme Yöntemi</h1>
            <p className="text-blue-100 text-sm">
              Size uygun ödeme yöntemini seçin
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: Ödeme Seçenekleri */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ödeme Yöntemleri */}
              <div className="space-y-4">
                <div className="text-left">
                  <h2 className="text-base font-medium text-gray-900 mb-1">
                    Ödeme Yöntemi Seçin
                  </h2>
                  <p className="text-sm text-gray-600">
                    Size uygun ödeme yöntemini seçin
                  </p>
                </div>

                <div className="space-y-3">
                  {paymentOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = selectedPayment === option.id;
                    
                    return (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handlePaymentSelect(option.id)}
                        className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected 
                              ? option.color === 'green' ? 'bg-green-500 text-white' :
                                option.color === 'blue' ? 'bg-blue-500 text-white' :
                                'bg-purple-500 text-white'
                              : option.color === 'green' ? 'bg-green-100 text-green-600' :
                                option.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                'bg-purple-100 text-purple-600'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">{option.name}</h3>
                              {option.recommended && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Önerilen
                                </span>
                              )}
                              {isSelected && (
                                <Check className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Kredi Kartı Formu */}
              {showCreditCardForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="text-left">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      Kredi Kartı Bilgileri
                    </h3>
                    <p className="text-sm text-gray-600">
                      Kart bilgilerinizi güvenli bir şekilde girin
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Kart Numarası
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={creditCardForm.cardNumber}
                        onChange={(e) => handleCreditCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Son Kullanma
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={creditCardForm.expiryDate}
                          onChange={(e) => handleCreditCardInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength="4"
                          value={creditCardForm.cvv}
                          onChange={(e) => handleCreditCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Kart Üzerindeki İsim
                      </label>
                      <input
                        type="text"
                        placeholder="AHMET YILMAZ"
                        value={creditCardForm.cardName}
                        onChange={(e) => handleCreditCardInputChange('cardName', e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Banka Bilgileri */}
              {showBankDetails && paymentSettings.bankAccounts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="text-left">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      Banka Hesap Bilgileri
                    </h3>
                    <p className="text-sm text-gray-600">
                      Aşağıdaki hesaplara havale/EFT yapabilirsiniz
                    </p>
                  </div>

                  <div className="space-y-3">
                    {paymentSettings.bankAccounts.map((account, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{account.bankName}</h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {account.currency || 'TL'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Hesap Sahibi:</span>
                              <p className="text-gray-900">{account.accountName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">IBAN:</span>
                              <p className="text-gray-900 font-mono">{account.iban}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Önemli Hatırlatma:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Havale açıklamasına rezervasyon numaranızı yazın</li>
                          <li>• Ödeme dekontu e-posta adresinize gönderilmelidir</li>
                          <li>• İşlem 24 saat içinde onaylanacaktır</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Hata Mesajı */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Güvenlik ve Politikalar */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>SSL Güvenli</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>256-bit Şifreleme</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>Gizlilik Koruması</span>
                  </div>
                </div>

                <div className="text-center space-x-4 text-xs text-gray-500">
                  <a href="/gizlilik" className="hover:text-blue-600">Gizlilik Politikası</a>
                  <span>•</span>
                  <a href="/kullanim-sartlari" className="hover:text-blue-600">Kullanım Şartları</a>
                  <span>•</span>
                  <a href="/kvkk" className="hover:text-blue-600">KVKK</a>
                </div>
              </div>
            </div>

            {/* Sağ: Rezervasyon Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sticky top-4">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Rezervasyon Özeti</h3>
                
                <div className="space-y-3">
                  {/* Transfer Yönü */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Transfer Yönü</p>
                      <p className="text-sm font-medium text-gray-900">
                        {bookingData.direction === 'airport-to-hotel' 
                          ? 'Havalimanı → Otel' 
                          : 'Otel → Havalimanı'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Araç */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Car className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Araç</p>
                      <p className="text-sm font-medium text-gray-900">
                        {bookingData.selectedVehicle?.brand} {bookingData.selectedVehicle?.model}
                      </p>
                    </div>
                  </div>

                  {/* Tarih & Saat */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Tarih & Saat</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(bookingData.date).toLocaleDateString('tr-TR')} - {bookingData.time}
                      </p>
                    </div>
                  </div>

                  {/* Yolcu */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Yolcu</p>
                      <p className="text-sm font-medium text-gray-900">
                        {bookingData.passengerCount || 1} kişi
                      </p>
                    </div>
                  </div>

                  {/* Mesafe */}
                  {bookingData.distance && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Mesafe</p>
                        <p className="text-sm font-medium text-gray-900">
                          {bookingData.distance} km - {bookingData.duration} dk
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fiyat Özeti */}
                <div className="mt-6 pt-4 border-t border-gray-200">
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
                    
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Toplam Tutar</span>
                        <span className="text-lg font-bold text-blue-600">
                          ₺{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            
            <button
              onClick={handleNext}
              disabled={!selectedPayment}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Rezervasyonu Tamamla
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentMethods;
