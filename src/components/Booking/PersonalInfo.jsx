import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Plane, 
  Clock, 
  Users,
  AlertCircle,
  Check
} from 'lucide-react';

const PersonalInfo = ({ bookingData, setBookingData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: bookingData.personalInfo?.firstName || '',
    lastName: bookingData.personalInfo?.lastName || '',
    email: bookingData.personalInfo?.email || '',
    phone: bookingData.personalInfo?.phone || '',
    passengerCount: bookingData.passengerCount || 1,
    flightNumber: bookingData.personalInfo?.flightNumber || '',
    flightTime: bookingData.personalInfo?.flightTime || '',
    specialRequests: bookingData.personalInfo?.specialRequests || '',
    acceptTerms: bookingData.personalInfo?.acceptTerms || false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Ad validasyonu
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Ad en az 2 karakter olmalıdır';
    }

    // Soyad validasyonu
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Soyad en az 2 karakter olmalıdır';
    }

    // Email validasyonu
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Telefon validasyonu
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon alanı zorunludur';
    } else if (!/^(\+90|0)?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    // Uçuş numarası validasyonu (opsiyonel ama girilmişse format kontrolü)
    if (formData.flightNumber && formData.flightNumber.trim().length < 3) {
      newErrors.flightNumber = 'Geçerli bir uçuş numarası girin';
    }

    // Şartlar kabul validasyonu
    if (formData.acceptTerms !== true) {
      newErrors.acceptTerms = 'Kullanım şartlarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      acceptTerms: checked
    }));

    // Hata varsa temizle
    if (errors.acceptTerms) {
      setErrors(prev => ({
        ...prev,
        acceptTerms: ''
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = () => {
    console.log('Personal Info - Form Data:', formData);
    
    if (validateForm()) {
      const updatedData = {
        ...bookingData,
        personalInfo: {
          ...formData,
          passengerCount: bookingData.passengerCount || formData.passengerCount
        }
      };
      console.log('Personal Info - Updated Data:', updatedData);
      setBookingData(updatedData);
      onNext();
    } else {
      console.log('Personal Info - Validation Errors:', errors);
    }
  };

  const formatPhoneNumber = (value) => {
    // Sadece rakamları al
    const digits = value.replace(/\D/g, '');
    
    // Türkiye formatında telefon numarası formatla
    if (digits.length >= 10) {
      const formatted = digits.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      return formatted;
    }
    return digits;
  };

  return (
    <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto p-2 sm:p-3 lg:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {/* Kişisel Bilgiler */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Kişisel Bilgiler
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Adınızı girin"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soyad *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Soyadınızı girin"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ornek@email.com"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-10 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                  placeholder="555 123 4567"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-10 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Yolcu Sayısı - Sadece Bilgi Amaçlı */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                <strong>Yolcu Sayısı:</strong> {bookingData.passengerCount || 1} kişi
              </span>
            </div>
          </div>
        </div>

        {/* Uçuş Bilgileri */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
            <Plane className="w-4 h-4 mr-2" />
            Uçuş Bilgileri (Opsiyonel)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uçuş Numarası
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.flightNumber}
                  onChange={(e) => handleInputChange('flightNumber', e.target.value.toUpperCase())}
                  placeholder="TK2658"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-10 ${
                    errors.flightNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Plane className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.flightNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.flightNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uçuş Saati
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.flightTime}
                  onChange={(e) => handleInputChange('flightTime', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-10"
                />
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özel İstekler
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Bebek koltuğu, tekerlekli sandalye erişimi vb. özel ihtiyaçlarınızı belirtiniz..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>
        </div>

        {/* Bilgilendirme */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Önemli Bilgiler:</p>
              <ul className="space-y-1 text-xs">
                <li>• Uçuş bilgileriniz transferinizin takibi için kullanılacaktır</li>
                <li>• Özel istekleriniz mümkün olduğunca karşılanmaya çalışılacaktır</li>
                <li>• İletişim bilgileriniz sadece transfer hizmeti için kullanılacaktır</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kullanım Şartları */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                formData.acceptTerms 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
              }`}>
                {formData.acceptTerms && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-700">
                <span className="font-medium">Kullanım şartları</span>nı ve <span className="font-medium">gizlilik politikası</span>nı okudum ve kabul ediyorum. *
              </span>
            </div>
          </label>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.acceptTerms}
            </p>
          )}
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
            Devam Et
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalInfo;
