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
  Check,
  ArrowLeft,
  ArrowRight
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
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Kişisel Bilgiler</h1>
            <p className="text-blue-100 text-sm">
              Transfer için gerekli bilgilerinizi girin
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-3xl shadow-xl space-y-6 p-6"
        >
        {/* Kişisel Bilgiler */}
        <div className="space-y-4">
          <div className="text-left">
            <h2 className="text-base font-medium text-gray-900 mb-1">
              Kişisel Bilgiler
            </h2>
            <p className="text-sm text-gray-600">
              Transfer için gerekli bilgilerinizi girin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ad *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Adınızı girin"
                  className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all ${
                    errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                />
              </div>
              {errors.firstName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-500 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.firstName}</span>
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Soyad *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Soyadınızı girin"
                  className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all ${
                    errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                />
              </div>
              {errors.lastName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-500 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.lastName}</span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                E-posta *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ornek@email.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-500 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Telefon *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                  placeholder="555 123 4567"
                  className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all ${
                    errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                />
              </div>
              {errors.phone && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-500 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.phone}</span>
                </motion.div>
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

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            onClick={onBack}
            className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>
          
          <button
            onClick={handleNext}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Devam Et
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default PersonalInfo;
