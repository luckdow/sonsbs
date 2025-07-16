import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Banknote, 
  Building2, 
  Check, 
  AlertCircle,
  Lock,
  Info
} from 'lucide-react';
import { PAYMENT_METHODS } from '../../config/constants';

const PaymentMethods = ({ bookingData, setBookingData, onNext, onBack }) => {
  const [selectedPayment, setSelectedPayment] = useState(
    bookingData.paymentMethod || PAYMENT_METHODS.CASH
  );
  const [error, setError] = useState('');

  const paymentOptions = [
    {
      id: PAYMENT_METHODS.CASH,
      name: 'Nakit Ödeme',
      description: 'Transfer sırasında şoföre nakit olarak ödeyin',
      icon: Banknote,
      color: 'green',
      details: [
        'Transfer anında ödeme yapın',
        'Ekstra komisyon yok',
        'Türk Lirası kabul edilir',
        'Para üstü verilir'
      ],
      recommended: true
    },
    {
      id: PAYMENT_METHODS.BANK_TRANSFER,
      name: 'Banka Havalesi',
      description: 'Banka hesabımıza havale/EFT yapın',
      icon: Building2,
      color: 'blue',
      details: [
        'Rezervasyon onayından sonra 24 saat içinde',
        'Havale dekontu gereklidir',
        'Bankacılık saatleri içinde işlem',
        'IBAN bilgileri e-posta ile gönderilir'
      ]
    },
    {
      id: PAYMENT_METHODS.CREDIT_CARD,
      name: 'Kredi Kartı',
      description: 'Online güvenli ödeme (yakında)',
      icon: CreditCard,
      color: 'purple',
      details: [
        'Anında ödeme onayı',
        '3D Secure güvenlik',
        'Tüm kredi kartları kabul edilir',
        'Yakında hizmete girecek'
      ],
      disabled: true
    }
  ];

  const handlePaymentSelect = (paymentId) => {
    if (paymentOptions.find(p => p.id === paymentId)?.disabled) return;
    setSelectedPayment(paymentId);
    setError('');
  };

  const handleNext = () => {
    if (!selectedPayment) {
      setError('Lütfen bir ödeme yöntemi seçiniz');
      return;
    }

    const selectedOption = paymentOptions.find(p => p.id === selectedPayment);
    if (selectedOption?.disabled) {
      setError('Seçilen ödeme yöntemi şu anda kullanılamıyor');
      return;
    }

    const updatedData = {
      ...bookingData,
      paymentMethod: selectedPayment
    };
    setBookingData(updatedData);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Rezervasyon Özeti */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Rezervasyon Özeti</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transfer Yönü:</span>
              <span className="font-medium">
                {bookingData.direction === 'airport-to-hotel' 
                  ? 'Havalimanı → Otel' 
                  : 'Otel → Havalimanı'
                }
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Araç:</span>
              <span className="font-medium">{bookingData.selectedVehicle?.name}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tarih & Saat:</span>
              <span className="font-medium">
                {new Date(bookingData.date).toLocaleDateString('tr-TR')} - {bookingData.time}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Yolcu Sayısı:</span>
              <span className="font-medium">{bookingData.personalInfo?.passengerCount} kişi</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mesafe:</span>
              <span className="font-medium">{bookingData.distance} km</span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Toplam Tutar:</span>
                <span className="text-blue-600">₺{bookingData.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ödeme Yöntemleri */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ödeme Yöntemi Seçiniz</h3>
          
          <div className="space-y-3">
            {paymentOptions.map((option) => {
              const isSelected = selectedPayment === option.id;
              const isDisabled = option.disabled;
              const Icon = option.icon;
              
              return (
                <motion.div
                  key={option.id}
                  whileHover={!isDisabled ? { scale: 1.01 } : {}}
                  whileTap={!isDisabled ? { scale: 0.99 } : {}}
                  onClick={() => handlePaymentSelect(option.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected && !isDisabled
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {/* Önerilen Badge */}
                  {option.recommended && !isDisabled && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Önerilen
                      </span>
                    </div>
                  )}

                  {/* Seçim İkonu */}
                  {isSelected && !isDisabled && (
                    <div className="absolute top-4 right-4">
                      <div className={`w-6 h-6 bg-${option.color}-500 rounded-full flex items-center justify-center`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected && !isDisabled ? `bg-${option.color}-100` : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isDisabled 
                          ? 'text-gray-400' 
                          : isSelected 
                          ? `text-${option.color}-600` 
                          : 'text-gray-500'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{option.name}</h4>
                        {isDisabled && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            Yakında
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                      
                      <ul className="space-y-1">
                        {option.details.map((detail, index) => (
                          <li key={index} className="text-xs text-gray-500 flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Güvenlik Bilgisi */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">Güvenli Ödeme:</p>
              <p className="text-xs">
                Tüm ödeme işlemleriniz güvenli bir şekilde işlenir. Kişisel ve finansal bilgileriniz korunur.
                Nakit ödeme seçeneği ile ekstra güvenlik sağlayabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Navigasyon Butonları */}
        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Geri Dön
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Rezervasyonu Onayla
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentMethods;
