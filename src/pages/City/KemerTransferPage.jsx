import React from 'react';
import CityPageLayout from '../../components/Layout/CityPageLayout';
import { getCityData } from '../../data/cityData';
import { 
  ClockIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const KemerTransferPage = () => {
  const cityData = getCityData('kemer');

  if (!cityData) {
    return <div>Şehir verisi bulunamadı</div>;
  }

  // Özel Hizmetler Bölümü
  const servicesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Kemer Transfer Hizmetlerimiz
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <ClockIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Marina Transfer</h3>
          <p className="text-gray-600">
            Kemer Marina'ya özel transfer hizmeti. Restoran ve eğlence 
            mekanlarına konforlu ulaşım.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Otel Transfer</h3>
          <p className="text-gray-600">
            Club Med, Maxx Royal, Crystal gibi lüks otellere 
            özel transfer hizmeti.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Teleferik Transfer</h3>
          <p className="text-gray-600">
            Olympos Teleferik istasyonuna günübirlik tur transferi. 
            Tahtalı Dağı manzarası.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Phaselis Turu</h3>
          <p className="text-gray-600">
            Phaselis Antik Kenti'ne özel transfer. Tarihi kalıntılar 
            ve doğal plajlar.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <StarIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Moonlight Beach</h3>
          <p className="text-gray-600">
            Ünlü Moonlight Plajı'na transfer. Mavi bayraklı 
            temiz plaj deneyimi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Kanyon Turu</h3>
          <p className="text-gray-600">
            Göynük Kanyonu ve doğa yürüyüşü turlarına 
            özel transfer hizmeti.
          </p>
        </div>
      </div>
    </div>
  );

  // Transfer Bilgileri Bölümü
  const pricesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Kemer Transfer Güzergahları
      </h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Popüler Kemer Güzergahları</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Antalya Havalimanı → Kemer Merkez</h4>
                  <p className="text-sm text-gray-500">42 km • 50 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Direkt transfer</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Antalya Havalimanı → Kemer Marina</h4>
                  <p className="text-sm text-gray-500">44 km • 52 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Marina bölgesi</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-medium text-gray-900">Kemer → Olympos Teleferik</h4>
                  <p className="text-sm text-gray-500">8 km • 12 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Dağ manzarası</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Kemer Özel Hizmetler</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Club Med Kemer özel transfer
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Maxx Royal Kemer VIP ulaşım
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Crystal Sunrise Queen transfer
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Marina restoran transferi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Phaselis antik kent turu
                </li>
              </ul>

              <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🏖️ Moonlight Beach'e ücretsiz transfer!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Müşteri Yorumları Bölümü
  const testimonialsSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Kemer Transfer Yorumları
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            "Club Med Kemer'e transfer için kullandık. Çok profesyonel ve zamanında geldi. Şoför çok kibar ve yardımseverdi."
          </p>
          <div className="font-medium text-gray-900">Sarah M.</div>
          <div className="text-sm text-gray-500">Club Med Kemer</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            "Kemer Marina'ya geç saatte transfer. Gece bile hizmet vermeleri çok güzeldi. Kesinlikle tavsiye ederim."
          </p>
          <div className="font-medium text-gray-900">Ahmet Y.</div>
          <div className="text-sm text-gray-500">Kemer Marina</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            "Olympos Teleferik'e günübirlik tur için kullandık. Manzara harikaydı, transfer de çok konforluydu."
          </p>
          <div className="font-medium text-gray-900">Emma L.</div>
          <div className="text-sm text-gray-500">Teleferik Turu</div>
        </div>
      </div>
    </div>
  );

  // SSS Bölümü
  const faqSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Kemer Transfer SSS
      </h2>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Antalya havalimanından Kemer'e ne kadar sürede ulaşırım?
            </h3>
            <p className="text-gray-600">
              Antalya havalimanından Kemer merkeze ortalama 45-55 dakika sürmektedir. 
              Marina bölgesine ise 50-60 dakika arası değişmektedir.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Club Med Kemer'e özel transfer var mı?
            </h3>
            <p className="text-gray-600">
              Evet, Club Med Kemer, Maxx Royal Kemer ve diğer lüks otellere 
              özel transfer hizmetimiz bulunmaktadır.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Kemer Marina'ya gece saatlerinde transfer mümkün mü?
            </h3>
            <p className="text-gray-600">
              Evet, 7/24 hizmet veriyoruz. Gece geç saatlerde de Kemer Marina'ya 
              güvenli transfer hizmeti sağlıyoruz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Olympos Teleferik'e günübirlik tur transfer yapıyor musunuz?
            </h3>
            <p className="text-gray-600">
              Evet, Olympos Teleferik, Phaselis Antik Kenti ve Göynük Kanyonu 
              gibi turistik yerlere günübirlik tur transferi yapıyoruz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Kemer'de hangi otellere transfer yapıyorsunuz?
            </h3>
            <p className="text-gray-600">
              Kemer'deki tüm otellere transfer hizmeti veriyoruz. Club Med, Maxx Royal, 
              Crystal Sunrise Queen, Rixos Sungate gibi lüks otellere özel hizmet sunuyoruz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CityPageLayout 
      cityData={cityData}
      servicesSection={servicesSection}
      pricesSection={pricesSection} 
      testimonialsSection={testimonialsSection}
      faqSection={faqSection}
    >
      {/* Ekstra içerik */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Kemer Transfer Hizmeti Hakkında
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Kemer transfer</strong> hizmeti arayanlar için GATE Transfer, 
              Antalya'nın en güvenilir transfer firması olarak hizmet vermektedir. 
              <strong>Antalya havalimanı Kemer transfer</strong> ihtiyaçlarınız için 
              profesyonel çözümler sunuyoruz.
            </p>
            <p className="mb-4">
              Kemer, muhteşem doğası, temiz plajları ve lüks otelleriyle ünlü bir tatil beldesidir. 
              <strong>Kemer otel transfer</strong> hizmetimiz ile Club Med Kemer, Maxx Royal Kemer, 
              Crystal Sunrise Queen gibi prestijli otellere konforlu ulaşım sağlıyoruz.
            </p>
            <p className="mb-4">
              <strong>Kemer marina transfer</strong> hizmetimiz ile modern marina bölgesindeki 
              restoran ve eğlence mekanlarına rahatça ulaşabilirsiniz. Ayrıca 
              <strong>profesyonel Kemer transfer</strong> hizmetimiz ile Olympos Teleferik, 
              Phaselis Antik Kenti gibi turistik yerlere de günübirlik turlar düzenliyoruz.
            </p>
            <p>
              <strong>Güvenli Kemer transfer</strong> deneyimi için GATE Transfer'i tercih edin. 
              Deneyimli şoförlerimiz ve modern araç filomuz ile unutulmaz bir tatil başlangıcı yapın.
            </p>
          </div>
        </div>
      </section>
    </CityPageLayout>
  );
};

export default KemerTransferPage;
