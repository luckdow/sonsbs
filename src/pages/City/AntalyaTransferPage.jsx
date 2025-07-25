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

const AntalyaTransferPage = () => {
  const cityData = getCityData('antalya');

  if (!cityData) {
    return <div>Şehir verisi bulunamadı</div>;
  }

  // Özel Hizmetler Bölümü
  const servicesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Antalya Transfer Hizmetlerimiz
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <ClockIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Hizmet</h3>
          <p className="text-gray-600">
            Gece gündüz her saatte Antalya havalimanı transfer hizmeti. 
            Geç gelen uçaklar için de hizmet garantisi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Güvenilir</h3>
          <p className="text-gray-600">
            Lisanslı, sigortalı ve profesyonel şoförler. 
            Antalya'da 10 yıllık transfer deneyimi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Uygun Fiyat</h3>
          <p className="text-gray-600">
            Antalya'nın en uygun transfer fiyatları. 
            Gizli ücret yok, şeffaf fiyatlandırma.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Grup Transfer</h3>
          <p className="text-gray-600">
            Büyük gruplar için özel araçlar. 
            Aile ve arkadaş grupları için ideal çözüm.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <StarIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">VIP Transfer</h3>
          <p className="text-gray-600">
            Lüks araçlarla premium transfer deneyimi. 
            Mercedes Vito ve benzeri konforlu araçlar.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Müşteri Desteği</h3>
          <p className="text-gray-600">
            Türkçe ve İngilizce müşteri desteği. 
            WhatsApp üzerinden anlık iletişim.
          </p>
        </div>
      </div>
    </div>
  );

  // Transfer Bilgileri Bölümü
  const pricesSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Antalya Transfer Güzergahları
      </h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Popüler Güzergahlar</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Antalya Havalimanı → Şehir Merkezi</h4>
                  <p className="text-sm text-gray-500">15 km • 25 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Ekonomik transfer</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Antalya Havalimanı → Lara</h4>
                  <p className="text-sm text-gray-500">8 km • 15 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Hızlı ulaşım</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-medium text-gray-900">Antalya Havalimanı → Konyaaltı</h4>
                  <p className="text-sm text-gray-500">18 km • 25 dakika</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Konforlu seyahat</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Hizmetlerimize Dahil</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Havalimanı karşılama hizmeti
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Bagaj taşıma yardımı
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Ücretsiz bekleme (60 dakika)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Su ikramı
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  7/24 müşteri desteği
                </li>
              </ul>

              <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  💡 İpucu: Online rezervasyonda %10 indirim!
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
        Müşteri Yorumları
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
            "Antalya havalimanından otelimize çok rahat ulaştık. Şoför çok kibardı, araç temizdi. Kesinlikle tavsiye ederim."
          </p>
          <div className="font-medium text-gray-900">Mehmet B.</div>
          <div className="text-sm text-gray-500">Lara, Antalya</div>
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
            "Zamanında geldi, çok professional bir hizmet. Fiyatları da gayet uygun. Bir dahaki sefere yine tercih edeceğim."
          </p>
          <div className="font-medium text-gray-900">Ayşe K.</div>
          <div className="text-sm text-gray-500">Konyaaltı, Antalya</div>
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
            "4 kişilik ailemiz için mükemmeldi. Çocuklarımız için güvenlik kemeri de vardı. Çok memnun kaldık."
          </p>
          <div className="font-medium text-gray-900">Fatma A.</div>
          <div className="text-sm text-gray-500">Kaleiçi, Antalya</div>
        </div>
      </div>
    </div>
  );

  // SSS Bölümü
  const faqSection = (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Sıkça Sorulan Sorular
      </h2>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Antalya havalimanından şehir merkezine ne kadar sürede ulaşırım?
            </h3>
            <p className="text-gray-600">
              Antalya havalimanından şehir merkezine ortalama 25-35 dakika sürmektedir. 
              Trafik durumuna göre bu süre değişiklik gösterebilir.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Rezervasyon yapmak zorunlu mu?
            </h3>
            <p className="text-gray-600">
              Rezervasyon yapmanızı öneririz. Böylece garantili transfer hizmeti alırsınız ve 
              %10 online rezervasyon indirimi kazanırsınız.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Transfer ücretine hangi hizmetler dahil?
            </h3>
            <p className="text-gray-600">
              Havalimanı karşılama, bagaj taşıma, 60 dakika ücretsiz bekleme, 
              su ikramı ve 7/24 müşteri desteği dahildir.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Uçağım geç gelirse ne olur?
            </h3>
            <p className="text-gray-600">
              Uçuş takip sistemi sayesinde gecikmeli uçakları takip ediyoruz. 
              60 dakikaya kadar ücretsiz bekleme hizmeti sunuyoruz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Çocuk koltuğu var mı?
            </h3>
            <p className="text-gray-600">
              Evet, rezervasyon sırasında belirtirseniz ücretsiz çocuk koltuğu 
              sağlıyoruz. Farklı yaş grupları için uygun koltuklar mevcuttur.
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
      {/* Ekstra içerik buraya eklenebilir */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Antalya Transfer Hizmeti Hakkında
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Antalya havalimanı transfer</strong> hizmeti arayanlar için GATE Transfer, 
              Türkiye'nin en güvenilir transfer firması olarak hizmet vermektedir. 
              <strong>AYT otel transfer</strong> ihtiyaçlarınız için 7/24 profesyonel hizmet sunuyoruz.
            </p>
            <p className="mb-4">
              Antalya, Türkiye'nin en popüler turizm destinasyonlarından biri olarak her yıl 
              milyonlarca turisti ağırlar. <strong>Güvenli transfer Antalya</strong> hizmeti ile 
              tatil keyfinizi ilk andan itibaren başlatıyoruz. Muhteşem plajları, tarihi kalıntıları ve 
              modern otelleriyle ünlü Antalya'da <strong>profesyonel transfer</strong> deneyimi yaşayın.
            </p>
            <p className="mb-4">
              <strong>Antalya şehir merkezi transfer</strong> hizmetimiz ile Kaleiçi, Lara, Konyaaltı 
              gibi popüler bölgelere rahatça ulaşabilirsiniz. Deneyimli şoförlerimiz ve modern araclarımızla 
              <strong>antalya havalimanı karşılama</strong> hizmetinden itibaren tam bir konfor yaşarsınız.
            </p>
            <p className="mb-4">
              İster aile tatili, ister iş seyahati olsun, <strong>Antalya transfer hizmeti</strong> 
              ihtiyaçlarınız için bize güvenebilirsiniz. <strong>Lara transfer</strong> ve 
              <strong>Konyaaltı transfer</strong> güzergahlarında özel çözümler sunuyoruz.
            </p>
            <p>
              GATE Transfer olarak müşteri memnuniyeti garantisi ile yanınızdayız. 
              Şeffaf fiyatlar, zamanında hizmet ve güvenli yolculuk için hemen rezervasyon yapın.
            </p>
          </div>
        </div>
      </section>
    </CityPageLayout>
  );
};

export default AntalyaTransferPage;
