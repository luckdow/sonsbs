import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const NewsletterSignup = ({ 
  variant = 'default', // 'default', 'hero', 'footer', 'sidebar'
  showTitle = true,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Geçerli bir email adresi giriniz');
      }

      // Firebase Cloud Function'a newsletter subscription ekle  
      // Development için local storage'a kaydet
      const subscriptionData = {
        email,
        subscribeDate: new Date().toISOString(),
        source: variant,
        status: 'active'
      };

      // Local storage'a kaydet (development amaçlı)
      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
      
      // Email zaten kayıtlı mı kontrol et
      const alreadySubscribed = existingSubscriptions.some(sub => sub.email === email);
      
      if (alreadySubscribed) {
        throw new Error('Bu email adresi zaten kayıtlı!');
      }

      existingSubscriptions.push(subscriptionData);
      localStorage.setItem('newsletterSubscriptions', JSON.stringify(existingSubscriptions));

      // Simulated API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true });
        }, 1000);
      });

      if (!response.ok) {
        throw new Error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }

      setStatus('success');
      setMessage('🎉 Başarıyla kaydoldunuz! Özel fırsatlardan haberdar olacaksınız.');
      setEmail('');

      // 3 saniye sonra success mesajını temizle
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      setMessage(error.message);
      
      // 3 saniye sonra error mesajını temizle
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const variants = {
    default: {
      container: 'bg-white rounded-lg shadow-lg p-6',
      title: 'text-2xl font-bold text-gray-900 mb-4',
      subtitle: 'text-gray-600 mb-6',
      form: 'space-y-4',
      input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      button: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
    },
    hero: {
      container: 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white',
      title: 'text-3xl font-bold mb-4',
      subtitle: 'text-blue-100 mb-6 text-lg',
      form: 'flex flex-col sm:flex-row gap-3',
      input: 'flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50',
      button: 'bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 sm:w-auto'
    },
    footer: {
      container: 'bg-gray-50 rounded-lg p-6',
      title: 'text-xl font-bold text-gray-900 mb-3',
      subtitle: 'text-gray-600 mb-4 text-sm',
      form: 'flex gap-2',
      input: 'flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm',
      button: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1 text-sm'
    },
    sidebar: {
      container: 'bg-orange-50 border border-orange-200 rounded-lg p-4',
      title: 'text-lg font-bold text-orange-900 mb-2',
      subtitle: 'text-orange-700 mb-4 text-sm',
      form: 'space-y-3',
      input: 'w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm',
      button: 'w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1 text-sm'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`${currentVariant.container} ${className}`}>
      {showTitle && (
        <>
          <h3 className={currentVariant.title}>
            📧 Özel Fırsatlardan Haberdar Olun
          </h3>
          <p className={currentVariant.subtitle}>
            Transfer hizmetlerimizde indirimler, yeni destinasyonlar ve özel kampanyalardan ilk siz haberdar olun.
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className={currentVariant.form}>
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className={currentVariant.input}
            disabled={status === 'loading'}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className={`${currentVariant.button} ${
            status === 'loading' || !email 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              {variant === 'hero' ? 'Abone Ol' : 'Ücretsiz Abone Ol'}
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          status === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Privacy Notice */}
      {variant !== 'footer' && (
        <p className={`text-xs mt-3 ${
          variant === 'hero' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="inline-block mr-1">🔒</span>
          E-posta adresiniz güvende. Spam göndermiyoruz ve istediğiniz zaman abonelikten çıkabilirsiniz.
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;
