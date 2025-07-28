import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Plane, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PhoneInput from '../../UI/PhoneInput';

const PersonalStep = ({ bookingData, updateBookingData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: bookingData.personalInfo?.firstName || '',
    lastName: bookingData.personalInfo?.lastName || '',
    email: bookingData.personalInfo?.email || '',
    phone: bookingData.personalInfo?.phone || '',
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
    } else {
      // Global phone validation - extract numbers and check length
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Geçerli bir telefon numarası girin';
      }
    }

    // Uçuş numarası validasyonu (opsiyonel)
    if (formData.flightNumber && formData.flightNumber.trim().length < 3) {
      newErrors.flightNumber = 'Geçerli bir uçuş numarası girin';
    }

    // Şartlar kabul validasyonu
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Kullanım şartlarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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

  const handleNext = () => {
    if (validateForm()) {
      updateBookingData({
        personalInfo: formData
      });
      onNext();
    }
  };

  const isFormValid = () => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.email.trim() && 
           formData.phone.trim() && 
           formData.acceptTerms &&
           /\S+@\S+\.\S+/.test(formData.email) &&
           phoneDigits.length >= 10;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Kişisel Bilgiler</h2>
        <p className="text-gray-600 mt-2">İletişim ve uçuş bilgilerinizi girin</p>
      </div>

      {/* Personal Information Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">İletişim Bilgileri</h3>
        
        {/* Name Fields - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Adınızı girin"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.firstName && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.firstName}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Soyad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Soyadınızı girin"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.lastName && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.lastName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Fields - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              E-posta *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ornek@email.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Telefon *
            </label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              placeholder="555 123 4567"
              error={errors.phone}
            />
            {errors.phone && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flight Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Uçuş Bilgileri (Opsiyonel)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Uçuş Numarası
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => handleInputChange('flightNumber', e.target.value.toUpperCase())}
                placeholder="TK123"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Uçuş Saati
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={formData.flightTime}
                onChange={(e) => handleInputChange('flightTime', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Özel İstekler
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Bebek koltuğu, tekerlekli sandalye erişimi vb. özel isteklerinizi belirtin..."
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
            style={{ width: '1rem', height: '1rem' }}
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed">
            <a 
              href="/kullanim-sartlari" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800 underline"
            >
              Kullanım Şartları
            </a> ve{' '}
            <a 
              href="/gizlilik-politikasi" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800 underline"
            >
              Gizlilik Politikası
            </a>'nı 
            okudum ve kabul ediyorum. Kişisel verilerimin işlenmesine ve transfer hizmeti için kullanılmasına onay veriyorum. *
          </label>
        </div>
        {errors.acceptTerms && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.acceptTerms}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-sm flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Önceki Adım</span>
        </button>
        
        <button
          type="button"
          onClick={handleNext}
          disabled={!isFormValid()}
          className="flex-1 sm:flex-none sm:min-w-[160px] px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center space-x-2"
        >
          <span>Ödeme Adımına Geç</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PersonalStep;
