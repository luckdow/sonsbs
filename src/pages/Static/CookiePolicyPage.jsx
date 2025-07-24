import React, { useState } from 'react';
import { 
  Cookie, 
  Settings, 
  BarChart3,
  Target,
  Shield,
  Eye,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const CookiePolicyPage = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // Always true, cannot be changed
    performance: true,
    functional: true,
    marketing: false
  });

  const handleCookieToggle = (type) => {
    if (type === 'necessary') return; // Necessary cookies cannot be disabled
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cookieTypes = [
    {
      id: 'necessary',
      title: 'Zorunlu Çerezler',
      icon: Shield,
      description: 'Web sitesinin temel fonksiyonları için gerekli çerezlerdir. Bu çerezler devre dışı bırakılamaz.',
      examples: [
        'Oturum yönetimi çerezleri',
        'Güvenlik çerezleri',
        'Form verilerini koruma',
        'Rezervasyon işlemlerinin tamamlanması'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      required: true
    },
    {
      id: 'performance',
      title: 'Performans Çerezleri',
      icon: BarChart3,
      description: 'Web sitesi performansını ölçmek ve analiz etmek için kullanılan çerezlerdir.',
      examples: [
        'Google Analytics çerezleri',
        'Sayfa yükleme süreleri',
        'Hata raporlama',
        'Kullanıcı davranış analizi'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      required: false
    },
    {
      id: 'functional',
      title: 'İşlevsel Çerezler',
      icon: Settings,
      description: 'Kullanıcı deneyimini geliştirmek için tercihlerinizi hatırlayan çerezlerdir.',
      examples: [
        'Dil tercihi',
        'Para birimi seçimi',
        'Tema ayarları',
        'Form otomatik doldurma'
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      required: false
    },
    {
      id: 'marketing',
      title: 'Pazarlama Çerezleri',
      icon: Target,
      description: 'Kişiselleştirilmiş reklamlar ve pazarlama kampanyaları için kullanılan çerezlerdir.',
      examples: [
        'Google Ads çerezleri',
        'Facebook Pixel',
        'Remarketing çerezleri',
        'Sosyal medya entegrasyonu'
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      required: false
    }
  ];

  const thirdPartyCookies = [
    {
      name: 'Google Analytics',
      purpose: 'Web sitesi trafiği ve kullanıcı davranışları analizi',
      duration: '2 yıl',
      privacy: 'https://policies.google.com/privacy'
    },
    {
      name: 'Google Maps',
      purpose: 'Harita ve konum hizmetleri',
      duration: 'Oturum süresi',
      privacy: 'https://policies.google.com/privacy'
    },
    {
      name: 'PayTR',
      purpose: 'Güvenli ödeme işlemleri',
      duration: 'Oturum süresi',
      privacy: 'https://www.paytr.com/gizlilik-politikasi'
    }
  ];

  return (
    <StaticPageLayout
      title="Çerez Politikası | GATE Transfer - Cookie Kullanım Politikası"
      description="GATE Transfer çerez politikası. Web sitemizde kullanılan çerez türleri, amaçları ve çerez ayarlarınızı nasıl yönetebileceğiniz hakkında bilgiler."
      keywords="çerez politikası, cookie policy, GATE Transfer çerez, web sitesi çerezleri, cookie ayarları, gizlilik çerez, KVKK çerez"
      canonicalUrl="/cerez-politikasi"
      heroTitle="Çerez Politikası"
      heroSubtitle="Web sitemizde kullanılan çerezler ve gizliliğiniz hakkında"
    >
      {/* Çerez Nedir */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Çerez Nedir?
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Çerezler (Cookies)</strong>, web sitelerini ziyaret ettiğinizde 
                  tarayıcınızda saklanan küçük metin dosyalarıdır. Bu dosyalar, web sitesinin 
                  daha iyi çalışmasını sağlar ve size daha iyi bir kullanıcı deneyimi sunar.
                </p>
                <p>
                  GATE Transfer olarak, web sitemizin işlevselliğini artırmak, güvenliği 
                  sağlamak ve size kişiselleştirilmiş deneyim sunmak için çerezleri kullanıyoruz.
                </p>
                <p>
                  Çerezler kişisel olarak sizi tanımlamaz, ancak size daha kişiselleştirilmiş 
                  bir web deneyimi sağlar.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center mb-6">
                <Cookie className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Çerez Avantajları</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Daha hızlı sayfa yükleme süreleri</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Kişiselleştirilmiş içerik deneyimi</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Güvenli rezervasyon işlemleri</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tercihlerinizi hatırlama</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Çerez Türleri */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Çerez Türleri ve Kullanım Amaçları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Web sitemizde kullandığımız çerez türleri ve bu çerezlerin amaçları
            </p>
          </div>

          <div className="space-y-6">
            {cookieTypes.map((type) => {
              const IconComponent = type.icon;
              const isEnabled = cookieSettings[type.id];
              
              return (
                <div 
                  key={type.id} 
                  className={`${type.bgColor} ${type.borderColor} border rounded-2xl p-6 md:p-8`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start">
                      <div className={`w-12 h-12 ${type.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                        <IconComponent className={`w-6 h-6 ${type.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {type.title}
                        </h3>
                        <p className="text-gray-700 mb-4 max-w-2xl">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-4">
                      {type.required ? (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Zorunlu</span>
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleCookieToggle(type.id)}
                          className="flex items-center"
                        >
                          {isEnabled ? (
                            <ToggleRight className={`w-8 h-8 ${type.color}`} />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Kullanım Örnekleri:</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`p-4 rounded-lg ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <div className="flex items-center">
                          {isEnabled ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-800">Aktif</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="text-sm font-medium text-gray-800">Pasif</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Üçüncü Taraf Çerezler */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Üçüncü Taraf Çerezler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Web sitemizde kullanılan üçüncü taraf hizmet sağlayıcıların çerezleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thirdPartyCookies.map((cookie, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {cookie.name}
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Amaç:</span>
                    <p className="text-gray-600 mt-1">{cookie.purpose}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Süre:</span>
                    <p className="text-gray-600">{cookie.duration}</p>
                  </div>
                  <div>
                    <a 
                      href={cookie.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      Gizlilik Politikası
                      <Info className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Çerez Yönetimi */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Çerez Ayarlarınızı Nasıl Yönetirsiniz?
            </h2>
            <p className="text-lg text-gray-600">
              Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <Settings className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Tarayıcı Ayarları
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Çoğu tarayıcı çerezleri varsayılan olarak kabul eder, ancak bu ayarı değiştirebilirsiniz:
                  </p>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• <strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                    <li>• <strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                    <li>• <strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                    <li>• <strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    Önemli Uyarı
                  </h3>
                  <p className="text-amber-800">
                    Zorunlu çerezleri devre dışı bırakırsanız, web sitemizin bazı özellikleri 
                    düzgün çalışmayabilir. Rezervasyon işlemleri ve güvenlik önlemleri 
                    etkilenebilir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ayarları Kaydet Butonu */}
          <div className="text-center mt-8">
            <button 
              onClick={() => {
                // Çerez ayarlarını kaydetme işlemi
                alert('Çerez ayarlarınız kaydedildi!');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Çerez Ayarlarını Kaydet
            </button>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Çerez Politikası Hakkında Sorularınız mı Var?
            </h3>
            <p className="text-blue-100 mb-6">
              Çerez kullanımımız ve gizlilik politikamız hakkında detaylı bilgi için
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@sbstravel.net"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                E-posta Gönderin
              </a>
              <a
                href="tel:+905325742682"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                +90 532 574 26 82
              </a>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default CookiePolicyPage;
