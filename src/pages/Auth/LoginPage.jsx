import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Chrome,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../config/constants';
import toast from 'react-hot-toast';
import Logo from '../../components/UI/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  // Role-based navigation function
  const navigateBasedOnRole = (userProfile) => {
    if (!userProfile) {
      navigate('/', { replace: true });
      return;
    }

    switch (userProfile.role) {
      case USER_ROLES.ADMIN:
        navigate('/admin', { replace: true });
        break;
      case USER_ROLES.DRIVER:
        navigate('/driver', { replace: true });
        break;
      case USER_ROLES.CUSTOMER:
        navigate('/', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

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

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { user, profile } = await login(formData.email, formData.password);
      toast.success('Başarıyla giriş yaptınız!');
      
      // Navigate based on user role immediately
      navigateBasedOnRole(profile);
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Hatalı şifre';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Geçersiz giriş bilgileri';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin';
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
      const { user, profile } = await signInWithGoogle();
      toast.success('Google ile başarıyla giriş yaptınız!', {
        icon: '🎉',
        duration: 3000,
      });
      
      // Navigate based on user role immediately
      navigateBasedOnRole(profile);
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Google ile giriş yapılırken bir hata oluştu';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Giriş penceresi kapatıldı. Lütfen tekrar deneyin.';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden py-4 px-4">
      {/* Background Effects - Hero ile tutarlı */}
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
        {/* Header - Mobil için optimize edildi */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Logo 
              isScrolled={false} 
              location={{ pathname: '/giriş' }} 
              size="normal" 
            />
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Hoş Geldiniz! 👋
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
              Hesabınıza giriş yaparak devam edin
            </p>
          </div>
        </div>

        {/* Auth Card - Mobil optimize */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
          {/* Google Sign In Button - Minimal */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full mb-4 sm:mb-6 flex items-center justify-center space-x-2 sm:space-x-3 py-3 sm:py-3.5 px-4 sm:px-6 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl sm:rounded-2xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm text-sm sm:text-base"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 group-hover:scale-110 transition-transform" />
            )}
            <span>
              {isGoogleLoading ? 'Bağlanılıyor...' : 'Google ile Devam Et'}
            </span>
          </button>

          {/* Divider - Minimal */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white/10 backdrop-blur-sm text-gray-300 font-medium rounded-lg">
                veya e-posta ile
              </span>
            </div>
          </div>

          {/* Email/Password Form - Compact */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-400/30 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full"></div>
                  </div>
                  <p className="text-red-200 text-xs sm:text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field - Compact */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-white">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ornek@email.com"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-white placeholder-gray-300 backdrop-blur-sm text-sm sm:text-base ${
                    errors.email 
                      ? 'border-red-400/50 bg-red-500/10' 
                      : 'hover:border-white/30 focus:bg-white/15'
                  }`}
                />
                <Mail className={`absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-gray-300'
                }`} />
              </div>
              {errors.email && (
                <p className="text-red-300 text-xs sm:text-sm flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field - Compact */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-white">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-white placeholder-gray-300 backdrop-blur-sm text-sm sm:text-base ${
                    errors.password 
                      ? 'border-red-400/50 bg-red-500/10' 
                      : 'hover:border-white/30 focus:bg-white/15'
                  }`}
                />
                <Lock className={`absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  errors.password ? 'text-red-400' : 'text-gray-300'
                }`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-3 sm:top-3.5 text-gray-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-xs sm:text-sm flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password - Compact */}
            <div className="flex items-center justify-between pt-1 sm:pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-2 border-white/30 rounded focus:ring-blue-500 focus:ring-2 bg-white/10"
                />
                <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                  Beni hatırla
                </span>
              </label>
              <Link
                to="/şifre-sıfırla"
                className="text-xs sm:text-sm text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors"
              >
                Şifremi unuttum
              </Link>
            </div>

            {/* Submit Button - Minimal */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-5 sm:mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link - Compact */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-300 text-xs sm:text-sm">
              Hesabınız yok mu?{' '}
              <Link
                to="/kayıt"
                className="text-blue-300 hover:text-blue-200 font-semibold hover:underline transition-colors"
              >
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home - Minimal */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors group text-xs sm:text-sm"
          >
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Ana sayfaya dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
