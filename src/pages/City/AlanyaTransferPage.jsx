import React from 'react';
import CityPageLayout from '../../components/Layout/CityPageLayout';
import { getCityData } from '../../data/cityData';
import { 
  ClockIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  BuildingOffice2Icon,
  SunIcon
} from '@heroicons/react/24/outline';

const AlanyaTransferPage = () => {
  const cityData = getCityData('alanya');

  if (!cityData) {
    return <div>Şehir verisi bulunamadı</div>;
  }

  // Özel Hizmetler Bölümü
  const servicesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Alanya Transfer Hizmetlerimiz
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Kale Transfer</h3>
          <p className="text-gray-600">
            Tarihi Alanya Kalesi ve çevresindeki görülmeye değer yerlere 
            özel transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Otel Transfer</h3>
          <p className="text-gray-600">
            Ultra All-Inclusive otellere ve Alanya merkez otellerine 
            konforlu transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <SunIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Plaj Transfer</h3>
          <p className="text-gray-600">
            Kleopatra Plajı, Damlataş Plajı ve diğer ünlü plajlara 
            transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Grup Transfer</h3>
          <p className="text-gray-600">
            Büyük aileler ve gruplar için özel araçlarla 
            ekonomik grup transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <ClockIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Transfer</h3>
          <p className="text-gray-600">
            Uzak mesafe nedeniyle önemli olan güvenli gece transferi 
            ve erken saatlerde hizmet.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <StarIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Panoramik Transfer</h3>
          <p className="text-gray-600">
            Alanya'ya giderken Akdeniz manzarasının keyfini çıkaracağınız 
            panoramik güzergah.
          </p>
        </div>
      </div>
    </div>
  );

  // Neden Bizi Seçmelisiniz Bölümü
  const whyChooseUsSection = (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Neden GATE Transfer ile Alanya'ya Seyahat Etmelisiniz?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <BuildingOffice2Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Uzun Mesafe Deneyimi</h3>
                  <p className="text-gray-600">
                    125 km'lik Antalya-Alanya güzergahında yıllarca deneyim kazanmış 
                    şoförlerimizle güvenli yolculuk.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Konforlu Araçlar</h3>
                  <p className="text-gray-600">
                    Uzun yolculuk için özel olarak seçilmiş konforlu araçlar. 
                    Klima, müzik sistemi ve geniş koltuklar.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CurrencyDollarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sabit Fiyat</h3>
                  <p className="text-gray-600">
                    Uzun mesafeye rağmen sabit fiyat garantisi. 
                    Takimetre ya da kilometre ücreti yok.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <StarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mola İmkanı</h3>
                  <p className="text-gray-600">
                    İsteğe bağlı dinlenme molaları. Yolculuk boyunca 
                    panoramik manzara noktalarında fotoğraf çekme fırsatı.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Alanya Transfer Avantajları
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Güvenli uzun mesafe seyahati</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Kleopatra Plajı'na doğrudan erişim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Alanya Kalesi turları için rehberlik</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Ultra All-Inclusive otel deneyimi</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Akdeniz manzaralı güzergah</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fiyat Bilgisi Bölümü
  const pricingSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Alanya Transfer Fiyatları
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ekonomik</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₺750</div>
            <p className="text-gray-600 mb-6">Sedan araç ile transfer</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 4 kişiye kadar</li>
              <li>✓ 2 büyük bavul</li>
              <li>✓ Klimalı araç</li>
              <li>✓ Deneyimli şoför</li>
              <li>✓ Mola imkanı</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Rezervasyon Yap
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              En Popüler
            </span>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Konfor</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₺950</div>
            <p className="text-gray-600 mb-6">VIP minivan ile transfer</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 8 kişiye kadar</li>
              <li>✓ 6 büyük bavul</li>
              <li>✓ Mercedes Vito</li>
              <li>✓ İkram servisi</li>
              <li>✓ Müzik sistemi</li>
              <li>✓ Panoramik camlar</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Rezervasyon Yap
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">VIP</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₺1150</div>
            <p className="text-gray-600 mb-6">Mercedes E-Class transfer</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 3 kişiye kadar</li>
              <li>✓ 3 büyük bavul</li>
              <li>✓ Lüks Mercedes</li>
              <li>✓ Deri koltuklar</li>
              <li>✓ Karşılama tabelası</li>
              <li>✓ Premium ikram</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Rezervasyon Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // SSS Bölümü
  const faqSection = (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Sıkça Sorulan Sorular
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Antalya Havalimanından Alanya'ya transfer süresi ne kadar?
            </h3>
            <p className="text-gray-600">
              Antalya Havalimanından Alanya'ya transfer süresi yaklaşık 105-120 dakika sürmektedir. 
              Bu uzun yolculuk için konforlu araçlarımızı öneriyoruz.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Yolculuk sırasında mola yapabilir miyiz?
            </h3>
            <p className="text-gray-600">
              Elbette! Uzun yolculuk nedeniyle istediğiniz zaman dinlenme molası verebilirsiniz. 
              Panoramik manzara noktalarında fotoğraf çekme imkanı da sunuyoruz.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Alanya'daki hangi otellere transfer yapıyorsunuz?
            </h3>
            <p className="text-gray-600">
              Alanya merkez, Kleopatra Plajı çevresi, Mahmutlar, Avsallar ve tüm Alanya 
              bölgesindeki otellere transfer hizmeti veriyoruz.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Gece saatlerinde de transfer hizmeti var mı?
            </h3>
            <p className="text-gray-600">
              Evet, 7/24 transfer hizmeti sunuyoruz. Gece saatlerinde güvenlik için 
              özellikle deneyimli şoförlerimizi görevlendiriyoruz.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Alanya Kalesi'ne de gidebilir miyiz?
            </h3>
            <p className="text-gray-600">
              Tabii ki! Alanya Kalesi, Kleopatra Plajı, Damlataş Mağarası gibi 
              turistik yerlere de transfer hizmeti sunuyoruz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // İletişim Bölümü
  const contactSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Alanya Transfer İçin Hemen İletişime Geçin
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Rezervasyon ve Bilgi
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                📞
              </div>
              <div>
                <p className="font-medium text-gray-900">Telefon</p>
                <p className="text-gray-600">+90 242 999 99 99</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                📱
              </div>
              <div>
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-gray-600">+90 242 999 99 99</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                ✉️
              </div>
              <div>
                <p className="font-medium text-gray-900">E-posta</p>
                <p className="text-gray-600">info@gatetransfer.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              💡 Alanya Transfer İpucu
            </h4>
            <p className="text-gray-600 text-sm">
              Uzun yolculuk nedeniyle özellikle konforlu araç kategorilerini tercih edin. 
              Yolculuk sırasında manzara fotoğrafları çekmek istiyorsanız, şoförünüze bildirebilirsiniz.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Hızlı Rezervasyon
          </h3>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adınız Soyadınız
              </label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adınız ve soyadınız"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon Numaranız
              </label>
              <input 
                type="tel" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+90 5xx xxx xx xx"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Noktası
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Havalimanından Alanya'ya</option>
                <option>Alanya'dan Havalimanına</option>
                <option>Alanya şehir içi</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kişi Sayısı
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>1-4 kişi</option>
                <option>5-8 kişi</option>
                <option>8+ kişi</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Rezervasyon Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <CityPageLayout 
      cityData={cityData}
      servicesSection={servicesSection}
      whyChooseUsSection={whyChooseUsSection}
      pricingSection={pricingSection}
      faqSection={faqSection}
      contactSection={contactSection}
    />
  );
};

export default AlanyaTransferPage;
