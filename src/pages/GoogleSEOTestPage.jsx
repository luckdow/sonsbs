import React, { useEffect, useState } from 'react';
import { useGoogleAnalytics, useSEOPerformance, useScrollTracking } from '../hooks/useGoogleAnalytics';
import MultilingualSEO from '../components/SEO/MultilingualSEO';
import StructuredDataManager from '../components/SEO/StructuredDataManager';
import { seoPerformanceMonitor } from '../utils/googleSeoIntegration';

const GoogleSEOTestPage = () => {
  const [seoReport, setSeoReport] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  
  // Hooks
  const {
    trackTransferBooking,
    trackSearch,
    trackLanguageChange,
    trackFormError,
    trackClick,
    trackDownload,
    trackOutboundLink
  } = useGoogleAnalytics();
  
  const { trackImageLoadTime, trackAPIResponseTime } = useSEOPerformance();
  useScrollTracking();

  // SEO Performance raporu al
  useEffect(() => {
    setTimeout(() => {
      const report = seoPerformanceMonitor.getSEOReport();
      setSeoReport(report);
    }, 3000);
  }, []);

  // Test fonksiyonları
  const handleTransferBookingTest = () => {
    const bookingData = {
      pickupLocation: 'Antalya Havalimanı',
      dropoffLocation: 'Lara Otelleri',
      vehicleType: 'VIP Mercedes',
      passengerCount: 4,
      totalPrice: 250,
      currency: 'TRY',
      bookingId: 'TEST_' + Date.now()
    };
    
    trackTransferBooking(bookingData);
    trackClick('Transfer Booking Test', 'Test Actions');
    alert('Transfer booking event sent to GA!');
  };

  const handleSearchTest = () => {
    const searchTerm = 'antalya havalimanı transfer';
    trackSearch(searchTerm, 25, currentLanguage);
    trackClick('Search Test', 'Test Actions');
    alert(`Search event sent: "${searchTerm}"`);
  };

  const handleLanguageChangeTest = () => {
    const newLanguage = currentLanguage === 'tr' ? 'en' : 'tr';
    trackLanguageChange(currentLanguage, newLanguage);
    setCurrentLanguage(newLanguage);
    trackClick('Language Change Test', 'Test Actions');
    alert(`Language changed: ${currentLanguage} -> ${newLanguage}`);
  };

  const handleFormErrorTest = () => {
    trackFormError('Booking Form', 'Validation Error', 'Phone number is required', 'phone');
    trackClick('Form Error Test', 'Test Actions');
    alert('Form error event sent to GA!');
  };

  const handleDownloadTest = () => {
    trackDownload('price-list-2025.pdf', 'pdf');
    trackClick('Download Test', 'Test Actions');
    alert('Download event sent to GA!');
  };

  const handleOutboundLinkTest = () => {
    trackOutboundLink('https://www.google.com', 'Google Link');
    trackClick('Outbound Link Test', 'Test Actions');
    alert('Outbound link event sent to GA!');
  };

  const testImageLoadTime = () => {
    const startTime = performance.now();
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      trackImageLoadTime('test-image', loadTime);
      alert(`Image load time tracked: ${Math.round(loadTime)}ms`);
    };
    img.src = '/images/antalya-transfer.jpg';
  };

  const testAPIResponseTime = () => {
    const startTime = performance.now();
    // Simulate API call
    setTimeout(() => {
      const responseTime = performance.now() - startTime;
      trackAPIResponseTime('booking-api', responseTime);
      alert(`API response time tracked: ${Math.round(responseTime)}ms`);
    }, Math.random() * 1000 + 500);
  };

  // Sayfa verileri
  const pageData = {
    cityName: 'Antalya',
    cityDescription: 'Antalya bölgesinde profesyonel VIP transfer hizmetleri',
    latitude: 36.8969,
    longitude: 30.7133,
    faqs: [
      {
        question: 'Antalya transfer fiyatları nasıl belirleniyor?',
        answer: 'Transfer fiyatları mesafe, araç tipi ve hizmet seviyesine göre belirlenir.'
      },
      {
        question: 'Rezervasyon nasıl yapılır?',
        answer: 'Online rezervasyon formu veya telefon ile rezervasyon yapabilirsiniz.'
      }
    ],
    breadcrumbs: [
      { name: 'Ana Sayfa', url: 'https://gatetransfer.com/' },
      { name: 'Test Sayfası', url: 'https://gatetransfer.com/google-seo-test' }
    ]
  };

  return (
    <div>
      {/* SEO Meta Tags */}
      <MultilingualSEO
        currentLanguage={currentLanguage}
        pageType="city"
        location="antalya"
        currentPath="/google-seo-test"
        canonicalUrl="https://gatetransfer.com/google-seo-test"
        openGraphImage="https://gatetransfer.com/images/antalya-transfer-og.jpg"
        availableLanguages={['tr', 'en', 'de', 'ru', 'ar']}
      />

      {/* Structured Data */}
      <StructuredDataManager
        pageType="city"
        pageData={pageData}
        language={currentLanguage}
        validateData={true}
      />

      {/* Sayfa İçeriği */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔍 Google SEO & Analytics Test Sayfası
            </h1>
            <p className="text-gray-600">
              Google Analytics ve Search Console entegrasyonlarını test etmek için bu sayfayı kullanın.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Aktif Dil: {currentLanguage.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Google Analytics Test Butonları */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                📊 Google Analytics Tests
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleTransferBookingTest}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🚗 Test Transfer Booking Event
                </button>
                
                <button
                  onClick={handleSearchTest}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔍 Test Search Event
                </button>
                
                <button
                  onClick={handleLanguageChangeTest}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🌍 Test Language Change
                </button>
                
                <button
                  onClick={handleFormErrorTest}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Test Form Error
                </button>
                
                <button
                  onClick={handleDownloadTest}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  📄 Test Download Event
                </button>
                
                <button
                  onClick={handleOutboundLinkTest}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🔗 Test Outbound Link
                </button>
              </div>
            </div>

            {/* Performance Test Butonları */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-900">
                ⚡ Performance Tests
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={testImageLoadTime}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🖼️ Test Image Load Time
                </button>
                
                <button
                  onClick={testAPIResponseTime}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  🌐 Test API Response Time
                </button>
              </div>

              {/* SEO Performance Report */}
              {seoReport && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">📈 Core Web Vitals Report</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>LCP:</span>
                      <span className={`font-medium ${
                        seoReport.scores.lcp === 'Good' ? 'text-green-600' :
                        seoReport.scores.lcp === 'Needs Improvement' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(seoReport.coreWebVitals.lcp || 0)}ms ({seoReport.scores.lcp})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>FID:</span>
                      <span className={`font-medium ${
                        seoReport.scores.fid === 'Good' ? 'text-green-600' :
                        seoReport.scores.fid === 'Needs Improvement' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(seoReport.coreWebVitals.fid || 0)}ms ({seoReport.scores.fid})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CLS:</span>
                      <span className={`font-medium ${
                        seoReport.scores.cls === 'Good' ? 'text-green-600' :
                        seoReport.scores.cls === 'Needs Improvement' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {(seoReport.coreWebVitals.cls || 0).toFixed(3)} ({seoReport.scores.cls})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bilgi Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">🔧 Entegrasyon Durumu</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>✅ Google Analytics 4 (GA4)</li>
                <li>✅ Google Search Console</li>
                <li>✅ Structured Data</li>
                <li>✅ Core Web Vitals</li>
                <li>✅ Multilingual SEO</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-2">📊 Tracking Events</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Page Views</li>
                <li>• Transfer Bookings</li>
                <li>• Search Queries</li>
                <li>• Language Changes</li>
                <li>• Form Errors</li>
                <li>• Downloads & Links</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-2">⚡ Performance</h3>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• Page Load Times</li>
                <li>• Image Load Times</li>
                <li>• API Response Times</li>
                <li>• Core Web Vitals</li>
                <li>• Scroll Tracking</li>
              </ul>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-800 text-white rounded-lg p-6 mt-8">
            <h3 className="font-semibold mb-4">🔍 Debug Bilgileri</h3>
            <div className="text-sm font-mono space-y-2">
              <div>Current URL: {window.location.href}</div>
              <div>Language: {currentLanguage}</div>
              <div>User Agent: {navigator.userAgent.slice(0, 80)}...</div>
              <div>Timestamp: {new Date().toISOString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSEOTestPage;
