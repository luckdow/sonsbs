import React from 'react';
import MultilingualSEO from '../components/SEO/MultilingualSEO';

const MultilingualSEOExample = () => {
  // Örnek kullanım - Antalya şehir sayfası
  const currentLanguage = 'tr'; // tr, en, de, ru, ar
  const pageType = 'city'; // city, service, blog, home
  const location = 'antalya';
  const currentPath = '/antalya';

  return (
    <div>
      {/* SEO Head Tags */}
      <MultilingualSEO
        currentLanguage={currentLanguage}
        pageType={pageType}
        location={location}
        currentPath={currentPath}
        canonicalUrl={`https://gatetransfer.com${currentPath}`}
        openGraphImage="https://gatetransfer.com/images/antalya-transfer-og.jpg"
        availableLanguages={['tr', 'en', 'de', 'ru', 'ar']}
      />

      {/* Sayfa İçeriği */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🌍 Çoklu Dil SEO Kullanım Örneği
            </h1>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                  MultilingualSEO Bileşeni Kullanımı
                </h2>
                <p className="text-blue-800">
                  Bu sayfada MultilingualSEO bileşeni kullanılarak otomatik olarak:
                </p>
                <ul className="list-disc list-inside text-blue-800 mt-2">
                  <li>Seçilen dile göre meta title ve description oluşturuldu</li>
                  <li>Hreflang tag'leri eklendi (5 dil için)</li>
                  <li>Open Graph ve Twitter Card meta tag'leri eklendi</li>
                  <li>Schema.org structured data eklendi</li>
                  <li>Canonical URL tanımlandı</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Desteklenen Diller</h3>
                  <ul className="text-green-800 space-y-1">
                    <li>🇹🇷 Türkçe (tr)</li>
                    <li>🇺🇸 İngilizce (en)</li>
                    <li>🇩🇪 Almanca (de)</li>
                    <li>🇷🇺 Rusça (ru)</li>
                    <li>🇸🇦 Arapça (ar)</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">📄 Sayfa Tipleri</h3>
                  <ul className="text-purple-800 space-y-1">
                    <li>🏙️ Şehir Sayfaları (city)</li>
                    <li>🚗 Hizmet Sayfaları (service)</li>
                    <li>📝 Blog Sayfaları (blog)</li>
                    <li>🏠 Ana Sayfa (home)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">🔧 Geliştirici Notları</h3>
                <div className="text-yellow-800 space-y-2">
                  <p>
                    <strong>Import:</strong> <code className="bg-yellow-200 px-1 rounded">import MultilingualSEO from '../components/SEO/MultilingualSEO';</code>
                  </p>
                  <p>
                    <strong>Props:</strong> currentLanguage, pageType, location, currentPath, canonicalUrl, openGraphImage, availableLanguages
                  </p>
                  <p>
                    <strong>Keywords:</strong> Otomatik olarak multilingualSeoKeywords.js dosyasından çekilir
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">📊 SEO Metrikleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-gray-600">Desteklenen Dil</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-2xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">Anahtar Kelime</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-2xl font-bold text-purple-600">6</div>
                    <div className="text-sm text-gray-600">Şehir Sayfası</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">SEO Uyumlu</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-800 text-white rounded-lg">
              <h3 className="font-semibold mb-2">💻 Kod Örneği:</h3>
              <pre className="text-sm overflow-x-auto">
{`<MultilingualSEO
  currentLanguage="tr"
  pageType="city"
  location="antalya"
  currentPath="/antalya"
  canonicalUrl="https://gatetransfer.com/antalya"
  openGraphImage="https://gatetransfer.com/images/antalya-og.jpg"
  availableLanguages={['tr', 'en', 'de', 'ru', 'ar']}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualSEOExample;
