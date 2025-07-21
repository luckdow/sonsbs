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
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const PaymentStep = ({ bookingData, updateBookingData, onComplete, onBack, isLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState([]);
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
      
      // Admin panelindeki settings'ten banka bilgilerini çek
      const settingsDocRef = doc(db, 'settings', 'main');
      
      const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          
          // Aktif banka hesaplarını filtrele
          const activeBankAccounts = data.bankAccounts?.filter(account => account.isActive !== false) || [];
          setBankInfo(activeBankAccounts);
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching payment settings:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up payment settings listener:', error);
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
        <h2 className="text-lg font-semibold text-gray-900">Ödeme Yöntemi</h2>
        <p className="text-gray-600 mt-1 text-xs">Güvenli ödeme ile rezervasyonu tamamlayın</p>
      </div>

      {/* Booking Summary - Compact */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <h3 className="font-medium text-gray-900 mb-2 text-sm">
          Rezervasyon Özeti
        </h3>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Rota:</span>
            <span className="font-medium text-gray-900 text-xs">
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
            <span className="font-medium text-gray-900">{bookingData.date} {bookingData.time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Araç:</span>
            <span className="font-medium text-gray-900">{bookingData.selectedVehicle?.name || 'Seçili Araç'}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 text-sm">Toplam:</span>
              <span className="text-base font-bold text-blue-600">₺{bookingData.totalPrice || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Ödeme Seçenekleri</h3>
        
        {/* Credit Card Payment */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedMethod(expandedMethod === 'credit_card' ? null : 'credit_card')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'credit_card' && (
                  <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>
                )}
              </div>
              <CreditCard className="w-4 h-4 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900">Kredi Kartı</span>
                <p className="text-xs text-gray-500">Güvenli online ödeme</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
              expandedMethod === 'credit_card' ? 'rotate-180' : ''
            }`} />
          </button>

          {expandedMethod === 'credit_card' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-3 space-y-3"
            >
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded text-xs">
                <Shield className="w-3 h-3" />
                <span className="font-medium">256-bit SSL korumalı</span>
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Kart Numarası *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => {
                      handleInputChange('cardNumber', formatCardNumber(e.target.value));
                      setPaymentMethod('credit_card');
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.cardNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.cardNumber && (
                  <div className="flex items-center space-x-1 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.cardNumber}</span>
                  </div>
                )}
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Tarih *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      value={cardData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.expiryDate ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.expiryDate && (
                    <div className="flex items-center space-x-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.expiryDate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    CVV *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.cvv ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.cvv && (
                    <div className="flex items-center space-x-1 text-red-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.cvv}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Kart Sahibi *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                    placeholder="ADI SOYADI"
                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.cardName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.cardName && (
                  <div className="flex items-center space-x-1 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.cardName}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bank Transfer Payment */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedMethod(expandedMethod === 'bank_transfer' ? null : 'bank_transfer')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'bank_transfer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'bank_transfer' && (
                  <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>
                )}
              </div>
              <Building className="w-4 h-4 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900">Havale/EFT</span>
                <p className="text-xs text-gray-500">Banka hesabına havale</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
              expandedMethod === 'bank_transfer' ? 'rotate-180' : ''
            }`} />
          </button>

          {expandedMethod === 'bank_transfer' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-3 space-y-3"
            >
              <div className="bg-orange-50 border border-orange-200 rounded p-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-3 h-3 text-orange-600 mt-0.5" />
                  <div className="text-xs text-orange-700">
                    <p className="font-medium">Bilgi:</p>
                    <p>Havale sonrası rezervasyon onaylanır. Açıklama kısmına kodu yazın.</p>
                  </div>
                </div>
              </div>

              {bankInfo && bankInfo.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Hesap Bilgileri:</h4>
                  
                  {bankInfo.map((account, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900 text-sm">{account.bankName}</h5>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Aktif
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-600">Hesap Sahibi:</span>
                          <p className="text-gray-900">{account.accountHolder}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">IBAN:</span>
                          <div className="flex items-center justify-between bg-white rounded p-2 mt-1">
                            <p className="text-gray-900 font-mono text-xs">{account.iban}</p>
                            <button
                              onClick={() => copyToClipboard(account.iban)}
                              className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                              title="IBAN'ı kopyala"
                            >
                              <Copy className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-xs font-medium"
                  >
                    Havale Seç
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
            className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'cash' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cash' && (
                  <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>
                )}
              </div>
              <DollarSign className="w-4 h-4 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-900">Nakit</span>
                <p className="text-xs text-gray-500">Transfer günü ödeme</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
              expandedMethod === 'cash' ? 'rotate-180' : ''
            }`} />
          </button>

          {expandedMethod === 'cash' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-3 space-y-3"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <Banknote className="w-3 h-3 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-700">
                    <p className="font-medium mb-1">Koşullar:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Transfer başında şoföre ödenecektir</li>
                      <li>• Tam para getiriniz</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <h4 className="font-medium text-blue-900 mb-2 text-xs">Ödeme Detayları</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Tutar:</span>
                    <span className="font-bold">₺{bookingData.totalPrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zaman:</span>
                    <span>Transfer başında</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPaymentMethod('cash')}
                className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors text-xs font-medium"
              >
                Nakit Seç
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Security and Trust Indicators */}
      <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <div className="text-center space-y-1">
          <div className="flex justify-center items-center space-x-3">
            <div className="flex items-center space-x-1 text-green-600">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-medium">SSL</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <Lock className="w-3 h-3" />
              <span className="text-xs font-medium">Güvenli</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Ödeme bilgileriniz güvende.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto order-2 sm:order-1 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>
        
        <button
          onClick={handleComplete}
          disabled={isLoading || !paymentMethod}
          className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:bg-gray-400 font-medium text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Rezervasyon Tamamla</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
