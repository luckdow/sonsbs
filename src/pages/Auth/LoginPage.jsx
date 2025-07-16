import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useApp();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

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
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Get user role from Firestore
      let userRole = 'customer'; // default role
      
      try {
        // Check in different collections for user role
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        const driverDoc = await getDoc(doc(db, 'drivers', user.uid));
        
        if (adminDoc.exists()) {
          userRole = 'admin';
        } else if (driverDoc.exists()) {
          userRole = 'driver';
        }
      } catch (error) {
        console.log('Role check error:', error);
        // Continue with default customer role
      }

      // Set user in context
      actions.setUser(user);
      actions.setUserRole(userRole);

      actions.showNotification('success', 'Başarıyla giriş yaptınız', 'Hoş Geldiniz');

      // Redirect based on role
      const redirectPath = userRole === 'admin' ? '/admin' :
                          userRole === 'driver' ? '/şoför' :
                          userRole === 'customer' ? '/müşteri' : from;
      
      navigate(redirectPath, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Giriş sırasında bir hata oluştu';
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'E-posta veya şifre hatalı';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Bu hesap devre dışı bırakılmış';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin';
          break;
        default:
          errorMessage = error.message;
      }
      
      actions.showNotification('error', errorMessage, 'Giriş Hatası');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SBS Transfer</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="text-gray-600">
            Rezervasyonlarınızı yönetmek için giriş yapın
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="ornek@email.com"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Şifrenizi girin"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Beni hatırla
                </label>
              </div>
              <Link
                to="/şifre-sıfırla"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Şifremi unuttum
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary btn-lg flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Demo Accounts */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Hesapları:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <strong>Admin:</strong> admin@sbstransfer.com / admin123
                </div>
                <div>
                  <strong>Şoför:</strong> sofor@sbstransfer.com / sofor123
                </div>
                <div>
                  <strong>Müşteri:</strong> musteri@sbstransfer.com / musteri123
                </div>
              </div>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link
                to="/kayıt"
                className="text-primary-600 hover:text-primary-500 font-medium"
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Ana sayfaya dön
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
