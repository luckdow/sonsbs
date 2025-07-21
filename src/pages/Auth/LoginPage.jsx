import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Chrome,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../config/constants';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
              Hoş Geldiniz! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Hesabınıza giriş yaparak devam edin
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
          {/* Google Sign In Button */}
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
              {isGoogleLoading ? 'Google ile bağlanılıyor...' : 'Google ile Devam Et'}
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

          {/* Email/Password Form */}
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
                  className="text-red-600 text-sm flex items-center space-x-1"
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>{errors.email}</span>
                </motion.p>
              )}
            </div>

            {/* Password Field */}
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
                  className="text-red-600 text-sm flex items-center space-x-1"
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>{errors.password}</span>
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Beni hatırla
                </span>
              </label>
              <Link
                to="/şifre-sıfırla"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Şifremi unuttum
              </Link>
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
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Hesabınız yok mu?{' '}
              <Link
                to="/kayıt"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Kayıt olun
              </Link>
            </p>
          </div>
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

export default LoginPage;
