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

const SideTransferPage = () => {
  const cityData = getCityData('side');

  if (!cityData) {
    return <div>Şehir verisi bulunamadı</div>;
  }

  // Özel Hizmetler Bölümü
  const servicesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Side Transfer Hizmetlerimiz
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <ClockIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Antik Kent Transfer</h3>
          <p className="text-gray-600">
            Side Antik Kenti ve Apollo Tapınağı'na özel transfer hizmeti. 
            Tarihi kalıntıları keşfedin.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">All Inclusive Otel</h3>
          <p className="text-gray-600">
            Side'deki ultra all inclusive otellere özel transfer. 
            Lüks tatil deneyiminiz başlasın.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Manavgat Şelalesi</h3>
          <p className="text-gray-600">
            Ünlü Manavgat Şelalesi'ne günübirlik tur transferi. 
            Doğa ve fotoğraf çekimi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Aspendos Turu</h3>
          <p className="text-gray-600">
            Aspendos Antik Tiyatrosu'na transfer. Roma dönemi 
            tiyatro yapısını gezin.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <StarIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Side Plajı</h3>
          <p className="text-gray-600">
            Altın kumlu Side plajına transfer. Temiz deniz 
            ve güneşlenme keyfi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Köprülü Kanyon</h3>
          <p className="text-gray-600">
            Rafting ve doğa sporları için Köprülü Kanyon'a 
            macera dolu transfer.
          </p>
        </div>
      </div>
    </div>
  );

  // Transfer Bilgileri Bölümü
  const pricesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Side Transfer Güzergahları
      </h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Popüler Side Güzergahları</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Antalya Havalimanı → Side Merkez</h4>
                  <p className="text-sm text-gray-500">65 km • 70 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Antik kent</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Side → Manavgat Şelalesi</h4>
                  <p className="text-sm text-gray-500">8 km • 12 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Şelale turu</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-medium text-gray-900">Side → Aspendos Tiyatrosu</h4>
                  <p className="text-sm text-gray-500">15 km • 20 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Antik tiyatro</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Side Özel Hizmetler</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  All inclusive otel transferi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Side antik kent rehberli tur
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Manavgat pazarı alışveriş turu
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Köprülü Kanyon rafting transferi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Side plajı günübirlik transfer
                </li>
              </ul>

              <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🏛️ Antik kent rehberli tur hediye!
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
        Side Transfer Yorumları
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
            "Side antik kentine transfer için kullandık. Şoför hem güvenli sürdü hem de bölge hakkında bilgi verdi. Çok memnun kaldık."
          </p>
          <div className="font-medium text-gray-900">Maria K.</div>
          <div className="text-sm text-gray-500">Side Antik Kent</div>
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
            "Manavgat Şelalesi turu için transfer aldık. Şelale çok güzeldi ve orada yeterince zaman geçirdik. Profesyonel hizmet."
          </p>
          <div className="font-medium text-gray-900">Can D.</div>
          <div className="text-sm text-gray-500">Manavgat Şelalesi</div>
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
            "All inclusive otelimize Side'den havalimanına transfer. Çok zamanında geldi ve bagajlarımızla ilgilendi."
          </p>
          <div className="font-medium text-gray-900">James R.</div>
          <div className="text-sm text-gray-500">Side Oteli</div>
        </div>
      </div>
    </div>
  );

  // SSS Bölümü
  const faqSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Side Transfer SSS
      </h2>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Antalya havalimanından Side'ye ne kadar sürede ulaşırım?
            </h3>
            <p className="text-gray-600">
              Antalya havalimanından Side merkeze ortalama 65-75 dakika sürmektedir. 
              Traffic durumuna göre süre değişebilir.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Side antik kent turu dahil mi?
            </h3>
            <p className="text-gray-600">
              Evet, Side antik kent transferinde kısa bir rehberli tur hizmeti ücretsiz 
              olarak sunulmaktadır.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Manavgat Şelalesi'ne günübirlik tur var mı?
            </h3>
            <p className="text-gray-600">
              Evet, Manavgat Şelalesi, Manavgat Pazarı ve Köprülü Kanyon'a 
              günübirlik tur transferi yapıyoruz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Side'deki hangi otellere transfer yapıyorsunuz?
            </h3>
            <p className="text-gray-600">
              Side bölgesindeki tüm all inclusive ve butik otellere transfer hizmeti 
              veriyoruz. Özel otel transferi de mevcut.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Aspendos Antik Tiyatrosu'na transfer mümkün mü?
            </h3>
            <p className="text-gray-600">
              Evet, Aspendos Antik Tiyatrosu'na özel transfer hizmeti sunuyoruz. 
              Opera ve bale performansları için de ulaşım sağlıyoruz.
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
        <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Side Transfer Hizmeti Hakkında
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Side transfer</strong> hizmeti arayanlar için GATE Transfer, 
              Side'nin eşsiz tarihini keşfetmeniz için güvenilir ulaşım çözümleri sunuyor. 
              <strong>Antalya havalimanı Side transfer</strong> hizmetimiz ile konforlu seyahat edin.
            </p>
            <p className="mb-4">
              Side, antik kalıntıları, altın kumlu plajları ve all inclusive otelleri ile 
              turistlerin gözde destinasyonudur. <strong>Side otel transfer</strong> hizmetimiz 
              ile bölgedeki tüm lüks tatil köylerine rahatça ulaşın.
            </p>
            <p className="mb-4">
              <strong>Side antik kent transfer</strong> özel hizmetimiz ile Apollo Tapınağı, 
              antik tiyatro ve tarihi limanı keşfedebilirsiniz. Ayrıca 
              <strong>Side'den havalimanına transfer</strong> hizmetimiz ile dönüş yolculuğunuz 
              da güvencede.
            </p>
            <p>
              <strong>Güvenli Side transfer</strong> deneyimi için tercih edin. Manavgat Şelalesi, 
              Aspendos Antik Tiyatrosu gibi yakın tarihi yerlere de günübirlik tur transferi yapıyoruz.
            </p>
          </div>
        </div>
      </section>
    </CityPageLayout>
  );
};

export default SideTransferPage;
