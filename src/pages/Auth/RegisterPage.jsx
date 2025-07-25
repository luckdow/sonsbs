import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Shield,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../config/constants';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.CUSTOMER
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Ad en az 2 karakter olmalıdır';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Soyad en az 2 karakter olmalıdır';
    }

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası gerekli';
    } else if (!/^(\+90|0)?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gerekli';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        role: formData.role
      });
      
      toast.success('Hesabınız başarıyla oluşturuldu! 🎉', {
        duration: 4000,
      });
      
      navigate('/giriş');
    } catch (error) {
      
      let errorMessage = 'Kayıt olurken bir hata oluştu';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifre çok zayıf. Daha güçlü bir şifre seçin';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi';
      }
      
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Google ile başarıyla kayıt oldunuz! 🎉', {
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      
      let errorMessage = 'Google ile kayıt olurken bir hata oluştu';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Kayıt penceresi kapatıldı. Lütfen tekrar deneyin.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up engellendi. Lütfen pop-up engelleyiciyi devre dışı bırakın.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Bu e-posta adresi zaten farklı bir yöntemle kayıtlı.';
      }
      
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Car className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              SBS Transfer
            </span>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Hesap Oluşturun 🚀
            </h1>
            <p className="text-gray-600 text-lg">
              Hemen kayıt olun ve avantajları keşfedin
            </p>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
        >
          {/* Google Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full mb-6 flex items-center justify-center space-x-3 py-4 px-6 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            )}
            <span>
              {isGoogleLoading ? 'Google ile bağlanılıyor...' : 'Google ile Kayıt Ol'}
            </span>
            <Sparkles className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                veya e-posta ile
              </span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                </div>
              </motion.div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Ad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Adınız"
                    disabled={isLoading || isGoogleLoading}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                      errors.firstName 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-300'
                    }`}
                  />
                  <User className={`absolute left-3 top-3 w-4 h-4 transition-colors ${
                    errors.firstName ? 'text-red-400' : 'text-gray-400'
                  }`} />
                </div>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Soyad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Soyadınız"
                    disabled={isLoading || isGoogleLoading}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                      errors.lastName 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-300'
                    }`}
                  />
                  <User className={`absolute left-3 top-3 w-4 h-4 transition-colors ${
                    errors.lastName ? 'text-red-400' : 'text-gray-400'
                  }`} />
                </div>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ornek@email.com"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-blue-300'
                  }`}
                />
                <Mail className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-gray-400'
                }`} />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-600 text-sm"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Telefon Numarası
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="555 123 4567"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                    errors.phone 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-blue-300'
                  }`}
                />
                <Phone className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                  errors.phone ? 'text-red-400' : 'text-gray-400'
                }`} />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-600 text-sm"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading || isGoogleLoading}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-300'
                    }`}
                  />
                  <Lock className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                    errors.password ? 'text-red-400' : 'text-gray-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading || isGoogleLoading}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                      errors.confirmPassword 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-300'
                    }`}
                  />
                  <Lock className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                    errors.confirmPassword ? 'text-red-400' : 'text-gray-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Hesap oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Hesap Oluştur</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link
                to="/giriş"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Giriş yapın
              </Link>
            </p>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="text-sm font-semibold text-green-800">Otomatik Üyelik</h4>
            </div>
            <div className="space-y-2 text-xs text-green-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Rezervasyon sonrası otomatik hesap oluşturulur</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Google ile hızlı kayıt imkanı</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Güvenli ve kolay profil yönetimi</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Ana sayfaya dön</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
