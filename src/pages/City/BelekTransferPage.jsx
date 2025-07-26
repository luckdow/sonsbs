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
  TrophyIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const BelekTransferPage = () => {
  const cityData = getCityData('belek');

  if (!cityData) {
    return <div>Şehir verisi bulunamadı</div>;
  }

  // Özel Hizmetler Bölümü
  const servicesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Belek Transfer Hizmetlerimiz
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrophyIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Golf Transfer</h3>
          <p className="text-gray-600">
            Belek'in dünya standartlarındaki golf sahalarına özel transfer hizmeti. 
            PGA golf turnuvalarına ev sahipliği yapan sahalara ulaşım.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Lüks Otel Transfer</h3>
          <p className="text-gray-600">
            Rixos Premium, Maxx Royal, Regnum Carya gibi 5 yıldızlı 
            otellere VIP transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <SunIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Plaj Transfer</h3>
          <p className="text-gray-600">
            Mavi bayraklı Belek plajlarına ve beach clublara 
            konforlu transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Grup Transfer</h3>
          <p className="text-gray-600">
            Golf grupları, kurumsal etkinlikler ve büyük aileler için 
            özel araçlarla grup transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <ClockIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Transfer</h3>
          <p className="text-gray-600">
            Gecenin her saatinde güvenli ve konforlu transfer. 
            Geç uçuşlar için özel hizmet.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <StarIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">VIP Transfer</h3>
          <p className="text-gray-600">
            Mercedes-Benz VIP araçlarla özel transfer hizmeti. 
            Konforlu koltuklar ve iklimlendirme.
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
          Neden GATE Transfer ile Belek'e Seyahat Etmelisiniz?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Golf Uzmanı</h3>
                  <p className="text-gray-600">
                    Belek'in golf sahalarını çok iyi biliyoruz. Hangi sahaya giderseniz gidin, 
                    size en kısa rotayı gösteririz.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lüks Otel Deneyimi</h3>
                  <p className="text-gray-600">
                    Belek'in 5 yıldızlı otelleriyle çalışan deneyimli şoförlerimiz, 
                    size lüks bir transfer deneyimi sunar.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CurrencyDollarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sabit Fiyat Garantisi</h3>
                  <p className="text-gray-600">
                    Rezervasyon sırasında verdiğimiz fiyat kesindir. 
                    Takimetre, ek ücret ya da sürpriz maliyet yoktur.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <StarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Araç Filosu</h3>
                  <p className="text-gray-600">
                    Mercedes-Benz, BMW ve Volkswagen marka araçlarımızla 
                    konforlu ve güvenli bir yolculuk deneyimi.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Belek Transfer Avantajları
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Golf kulüplerini güvenle taşıma</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Lüks tatil köyü girişlerinde deneyim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Land of Legends tema parkına özel servis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Mavi bayraklı plajlara kolay erişim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-gray-700">Belek çevresindeki tarihi yerlere rehberlik</span>
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
        Belek Transfer Fiyatları
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ekonomik</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₺450</div>
            <p className="text-gray-600 mb-6">Sedan araç ile transfer</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 4 kişiye kadar</li>
              <li>✓ 2 büyük bavul</li>
              <li>✓ Klimalı araç</li>
              <li>✓ Profesyonel şoför</li>
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
            <div className="text-3xl font-bold text-blue-600 mb-4">₺650</div>
            <p className="text-gray-600 mb-6">VIP minivan ile transfer</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 8 kişiye kadar</li>
              <li>✓ 6 büyük bavul</li>
              <li>✓ Mercedes Vito</li>
              <li>✓ Golf kulübü taşıma</li>
              <li>✓ Su ikramı</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Rezervasyon Yap
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">VIP</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₺850</div>
            <p className="text-gray-600 mb-6">Mercedes E-Class transfer</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 3 kişiye kadar</li>
              <li>✓ 3 büyük bavul</li>
              <li>✓ Lüks Mercedes</li>
              <li>✓ Deri koltuklar</li>
              <li>✓ Karşılama tabelası</li>
              <li>✓ Ücretsiz bekleme</li>
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
              Antalya Havalimanından Belek'e transfer süresi ne kadar?
            </h3>
            <p className="text-gray-600">
              Antalya Havalimanından Belek'e transfer süresi yaklaşık 35-45 dakika sürmektedir. 
              Trafik durumuna göre bu süre değişebilir.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Golf kulüplerimi transfer aracında taşıyabilir miyim?
            </h3>
            <p className="text-gray-600">
              Evet, tüm araçlarımızda golf kulüplerini güvenle taşıyabilirsiniz. 
              Özellikle VIP araçlarımızda golf ekipmanları için özel alan bulunmaktadır.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Belek'teki hangi otellere transfer yapıyorsunuz?
            </h3>
            <p className="text-gray-600">
              Rixos Premium Belek, Maxx Royal Belek, Regnum Carya, Gloria Golf Resort, 
              Kaya Belek ve tüm Belek bölgesi otellerine transfer hizmeti veriyoruz.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Rezervasyonumu nasıl yapabilirim?
            </h3>
            <p className="text-gray-600">
              Online rezervasyon formumuz, WhatsApp hattımız (+90 242 999 99 99) veya 
              telefonumuz aracılığıyla 7/24 rezervasyon yapabilirsiniz.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Land of Legends tema parkına da transfer var mı?
            </h3>
            <p className="text-gray-600">
              Evet, Land of Legends tema parkı dahil Belek bölgesindeki tüm noktalara 
              transfer hizmeti sunuyoruz. Tema parkı girişine kadar ulaştırıyoruz.
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
        Belek Transfer İçin Hemen İletişime Geçin
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
              💡 Belek Transfer İpucu
            </h4>
            <p className="text-gray-600 text-sm">
              Golf turnuvası veya özel etkinlik için seyahat ediyorsanız, 
              rezervasyonunuzu en az 24 saat önceden yapın. Bu sayede size 
              en uygun aracı ayırabiliriz.
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
                <option>Havalimanından Belek'e</option>
                <option>Belek'ten Havalimanına</option>
                <option>Belek şehir içi</option>
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

export default BelekTransferPage;
