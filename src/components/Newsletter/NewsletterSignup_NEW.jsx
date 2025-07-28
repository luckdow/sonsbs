import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Send, Star } from 'lucide-react';

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

      if (response.ok) {
        setStatus('success');
        setMessage('Harika! E-posta listemize başarıyla kaydoldunuz. Hoş geldiniz! 🎉');
        setEmail('');
        
        // Google Analytics event tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'newsletter_signup', {
            'event_category': 'engagement',
            'event_label': variant
          });
        }
      } else {
        throw new Error('Kayıt sırasında bir hata oluştu');
      }
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

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Modern Background */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          {/* Subtle geometric patterns */}
          <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {showTitle && (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Send className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl lg:text-3xl font-bold">
                  🚀 Transfer Fırsatlarını Kaçırmayın!
                </h3>
              </div>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Özel indirimler, yeni destinasyonlar ve transfer ipuçları için e-posta listemize katılın. 
                <span className="font-medium"> Ayda sadece kaliteli içerik </span> gönderiyoruz.
              </p>
            </>
          )}

          {/* Newsletter Benefits */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>Özel İndirimler</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>Yeni Destinasyonlar</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>Transfer İpuçları</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin..."
                className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none"
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Ücretsiz Abone Ol
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Status Messages */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 text-sm max-w-md mx-auto ${
              status === 'success' 
                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                : 'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-blue-200 flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>
                E-posta adresiniz güvende. Spam göndermiyoruz ve istediğiniz zaman abonelikten çıkabilirsiniz.
              </span>
            </p>
          </div>

          {/* Social Proof */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-blue-200">
            <div className="flex items-center gap-1">
              <span className="font-medium">2,500+</span>
              <span>mutlu abone</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>4.9/5 memnuniyet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
