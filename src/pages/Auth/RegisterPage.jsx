import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CheckCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../config/constants';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Ad soyad gereklidir';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ad soyad en az 2 karakter olmalıdır';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    // Password confirm validation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Şifreler eşleşmiyor';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Kullanım şartlarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: USER_ROLES.CUSTOMER
      });

      if (result.success) {
        setShowVerificationMessage(true);
        toast.success('Kayıt başarılı! E-posta doğrulama linki gönderildi.');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          passwordConfirm: '',
          agreeToTerms: false
        });
        
        // Redirect after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setErrors({ general: result.error || 'Kayıt sırasında bir hata oluştu' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        toast.success('Google ile giriş başarılı!');
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Google ile giriş yapılamadı' });
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrors({ general: 'Google ile giriş sırasında bir hata oluştu' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden py-4 px-4">
      {/* Background Effects - Login ile tutarlı */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
      </div>
      
      {/* Particles - sadece desktop */}
      <div className="absolute inset-0 hidden lg:block">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Header - Login ile tutarlı */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                SBS Transfer
              </span>
            </Link>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Hesap Oluşturun 🚀
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
              Hemen kayıt olun ve avantajları keşfedin
            </p>
          </div>
        </div>

        {/* Auth Card - Login ile tutarlı */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full mb-6 sm:mb-8 flex items-center justify-center space-x-3 py-3 sm:py-4 px-4 sm:px-6 border-2 border-white/30 rounded-xl sm:rounded-2xl text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
            <span className="text-sm sm:text-base">
              {isGoogleLoading ? 'Google ile bağlanılıyor...' : 'Google ile Kayıt Ol'}
            </span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          </button>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white/10 backdrop-blur-sm rounded-full text-gray-200 font-medium">
                veya e-posta ile
              </span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 text-sm text-red-200 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl animate-shake">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {showVerificationMessage && (
              <div className="p-4 text-sm text-green-200 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                  <span>
                    E-posta adresinize doğrulama linki gönderildi. Lütfen e-postanızı kontrol edin.
                  </span>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Ad Soyad *
              </label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-xl sm:rounded-2xl text-white placeholder-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base ${
                    errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="Adınızı ve soyadınızı girin"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                E-posta Adresi *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-xl sm:rounded-2xl text-white placeholder-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base ${
                    errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Telefon Numarası
              </label>
              <div className="relative">
                <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-white/30 text-sm sm:text-base"
                  placeholder="+90 555 123 45 67"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Şifre *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-xl sm:rounded-2xl text-white placeholder-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base ${
                    errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="En az 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? 
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Password Confirm Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Şifre Tekrarı *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className={`w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-xl sm:rounded-2xl text-white placeholder-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base ${
                    errors.passwordConfirm ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasswordConfirm ? 
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  }
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="text-xs sm:text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.passwordConfirm}</span>
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2 transition-all duration-300"
                required
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-300 leading-5">
                <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline">
                  Kullanım Şartları
                </Link>{' '}
                ve{' '}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Gizlilik Politikası
                </Link>{'nı '}
                kabul ediyorum.
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs sm:text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.agreeToTerms}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Hesap oluşturuluyor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Hesap Oluştur</span>
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-300 text-sm sm:text-base">
              Zaten hesabınız var mı?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors"
              >
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>

        {/* Features - Login ile tutarlı */}
        <div className="mt-6 sm:mt-8 text-center animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
              <span>7/24 Müşteri Desteği</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
              <span>Google ile hızlı kayıt</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
              <span>Güvenli profil yönetimi</span>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6 sm:mt-8 animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Ana sayfaya dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
