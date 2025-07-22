import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Banknote, 
  Building,
  ChevronDown,
  Shield,
  Lock,
  CheckCircle,
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Loader2,
  Copy
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const PaymentStep = ({ bookingData, updateBookingData, onComplete, onBack, isLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch bank transfer settings
      const bankSettingsRef = collection(db, 'settings', 'payments', 'bankTransfer');
      const bankSnapshot = await getDocs(bankSettingsRef);
      
      if (!bankSnapshot.empty) {
        const bankData = bankSnapshot.docs[0].data();
        setBankInfo(bankData);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (paymentMethod !== 'credit_card') return true;

    const newErrors = {};

    // Card number validation
    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Kart numarası zorunludur';
    } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Kart numarası 16 haneli olmalıdır';
    }

    // Expiry date validation
    if (!cardData.expiryDate.trim()) {
      newErrors.expiryDate = 'Son kullanma tarihi zorunludur';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (!month || !year || month < 1 || month > 12) {
        newErrors.expiryDate = 'Geçerli bir tarih giriniz (MM/YY)';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Kartın süresi geçmiş';
      }
    }

    // CVV validation
    if (!cardData.cvv.trim()) {
      newErrors.cvv = 'CVV zorunludur';
    } else if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      newErrors.cvv = 'CVV 3-4 haneli olmalıdır';
    }

    // Card name validation
    if (!cardData.cardName.trim()) {
      newErrors.cardName = 'Kart üzerindeki isim zorunludur';
    } else if (cardData.cardName.trim().length < 2) {
      newErrors.cardName = 'İsim en az 2 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleComplete = () => {
    if (validateForm()) {
      updateBookingData({
        paymentMethod,
        creditCardInfo: paymentMethod === 'credit_card' ? cardData : null
      });
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Ödeme bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ödeme Bilgileri</h2>
        <p className="text-gray-600 mt-2">Güvenli ödeme ile rezervasyonunuzu tamamlayın</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Rezervasyon Detayları
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Rota:</span>
            <span className="font-medium text-gray-900">
              {typeof bookingData.pickupLocation === 'object' 
                ? bookingData.pickupLocation?.address?.split(',')[0] 
                : bookingData.pickupLocation?.split(',')[0] || 'Belirlenmedi'
              } → {typeof bookingData.dropoffLocation === 'object' 
                ? bookingData.dropoffLocation?.address?.split(',')[0] 
                : bookingData.dropoffLocation?.split(',')[0] || 'Belirlenmedi'
              }
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tarih:</span>
            <span className="font-medium text-gray-900">{bookingData.date} - {bookingData.time}</span>
          </div>
          
          {bookingData.tripType === 'round-trip' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Dönüş:</span>
              <span className="font-medium text-gray-900">{bookingData.returnDate} - {bookingData.returnTime}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Yolcu Sayısı:</span>
            <span className="font-medium text-gray-900">{bookingData.passengerCount} kişi</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Bagaj:</span>
            <span className="font-medium text-gray-900">{bookingData.baggageCount} adet</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Araç:</span>
            <span className="font-medium text-gray-900">{bookingData.selectedVehicle?.name || 'Belirlenmedi'}</span>
          </div>
          
          {bookingData.routeInfo && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Mesafe:</span>
                <span className="font-medium text-gray-900">{bookingData.routeInfo.distance}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tahmini Süre:</span>
                <span className="font-medium text-gray-900">{bookingData.routeInfo.duration}</span>
              </div>
            </>
          )}
          
          <hr className="border-gray-200" />
          
          <div className="flex justify-between text-lg font-bold text-green-600">
            <span>Toplam Tutar:</span>
            <span>€{bookingData.totalPrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Ödeme Yöntemi Seçin</h3>
        
        {/* Credit Card Payment */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedMethod(expandedMethod === 'credit_card' ? null : 'credit_card')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'credit_card' && (
                  <div className="w-3 h-3 rounded-full bg-white m-0.5"></div>
                )}
              </div>
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-900">Kredi/Banka Kartı</span>
                <p className="text-sm text-gray-500">Güvenli online ödeme</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedMethod === 'credit_card' ? 'rotate-180' : ''
            }`} />
          </button>

          {expandedMethod === 'credit_card' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-4 space-y-4"
            >
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">256-bit SSL şifreleme ile güvence altında</span>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kart Numarası *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => {
                      handleInputChange('cardNumber', formatCardNumber(e.target.value));
                      setPaymentMethod('credit_card');
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.cardNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.cardNumber && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.cardNumber}</span>
                  </div>
                )}
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Son Kullanma Tarihi *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={cardData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.expiryDate ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.expiryDate && (
                    <div className="flex items-center space-x-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.expiryDate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    CVV *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.cvv ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.cvv && (
                    <div className="flex items-center space-x-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.cvv}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kart Üzerindeki İsim *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.cardName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.cardName && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.cardName}</span>
                  </div>
                )}
              </div>

              {/* PayTR Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">PayTR güvenli ödeme altyapısı ile korunuyorsunuz</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bank Transfer Payment */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedMethod(expandedMethod === 'bank_transfer' ? null : 'bank_transfer')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'bank_transfer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'bank_transfer' && (
                  <div className="w-3 h-3 rounded-full bg-white m-0.5"></div>
                )}
              </div>
              <Building className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-900">Banka Havalesi/EFT</span>
                <p className="text-sm text-gray-500">Banka hesabımıza havale/EFT yapın</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedMethod === 'bank_transfer' ? 'rotate-180' : ''
            }`} />
          </button>

          {expandedMethod === 'bank_transfer' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-4 space-y-4"
            >
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div className="text-sm text-orange-700">
                    <p className="font-medium">Önemli Bilgi:</p>
                    <p>Havale/EFT işleminiz sonrası rezervasyonunuz onaylanacaktır. Açıklama kısmına rezervasyon numaranızı yazmayı unutmayın.</p>
                  </div>
                </div>
              </div>

              {bankInfo && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Banka Bilgileri:</h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Banka Adı:</span>
                      <span className="font-medium text-gray-900">{bankInfo.bankName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hesap Sahibi:</span>
                      <span className="font-medium text-gray-900">{bankInfo.accountName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center group">
                      <span className="text-sm text-gray-600">IBAN:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium text-gray-900">{bankInfo.iban}</span>
                        <button
                          onClick={() => copyToClipboard(bankInfo.iban)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                          title="IBAN'ı kopyala"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Şube Kodu:</span>
                      <span className="font-medium text-gray-900">{bankInfo.branchCode}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hesap No:</span>
                      <span className="font-mono font-medium text-gray-900">{bankInfo.accountNumber}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-700">
                        <p className="font-medium">İşlem Süresi:</p>
                        <p>Havale/EFT işleminiz genellikle 1-2 saat içerisinde hesabımıza ulaşır ve rezervasyonunuz onaylanır.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Banka Havalesi ile Rezervasyon Yap
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Cash Payment */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedMethod(expandedMethod === 'cash' ? null : 'cash')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'cash' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cash' && (
                  <div className="w-3 h-3 rounded-full bg-white m-0.5"></div>
                )}
              </div>
              <DollarSign className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-900">Nakit Ödeme</span>
                <p className="text-sm text-gray-500">Seyahat günü nakit olarak ödeyin</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedMethod === 'cash' ? 'rotate-180' : ''
            }`} />
          </button>

          {expandedMethod === 'cash' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-4 space-y-4"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Banknote className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-2">Nakit Ödeme Koşulları:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Ödemeyi seyahat başlangıcında şoförümüze yapacaksınız</li>
                      <li>Tam para getirmeniz önerilir</li>
                      <li>Fatura talebiniz varsa lütfen belirtiniz</li>
                      <li>Rezervasyonunuz nakit ödeme koşulu ile onaylanacaktır</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Ödeme Detayları</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Toplam Tutar:</span>
                    <span className="font-bold">€{bookingData.totalPrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödeme Zamanı:</span>
                    <span>Seyahat başlangıcında</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödeme Yöntemi:</span>
                    <span>Nakit (Türk Lirası)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPaymentMethod('cash')}
                className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Nakit Ödeme ile Rezervasyon Yap
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Security and Trust Indicators */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">SSL Güvenlik</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-medium">256-bit Şifreleme</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Güvenli Ödeme</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Tüm ödeme bilgileriniz uluslararası güvenlik standartları ile korunmaktadır.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>
        
        <button
          onClick={handleComplete}
          disabled={isLoading || !paymentMethod}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Rezervasyonu Tamamla</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
