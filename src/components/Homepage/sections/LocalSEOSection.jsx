import React from 'react';
import { MapPin, Clock, Star, Shield } from 'lucide-react';

const LocalSEOSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Antalya'nın En Güvenilir Transfer Hizmeti
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            <strong>SBS Turkey Transfer</strong> | <em>gatetransfer.com</em>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sol Taraf - Açıklama Metni */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>SBS Turkey Transfer</strong> (gatetransfer.com) olarak, 2020 yılından beri Antalya havalimanı transfer hizmetlerinde 
              öncü konumdayız. Antalya'nın her köşesini bilen deneyimli şoför kadromuz ve modern araç filomuz ile 
              güvenli, konforlu ve zamanında ulaşım garantisi sunuyoruz.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Antalya Havalimanı'ndan Lara, Kemer, Belek, Side, Kaş, Kalkan ve Alanya gibi popüler 
              destinasyonlara <strong>7/24 kesintisiz transfer hizmeti</strong> veriyoruz. SBS Turkey Transfer markamız altında 
              VIP araçlarımız ile bireysel yolculardan grup transferlerine kadar her ihtiyaca uygun çözümler sunmaktayız.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Neden SBS Turkey Transfer?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>5000+</strong> mutlu müşteri deneyimi</li>
                <li>✓ <strong>%99</strong> zamanında varış garantisi</li>
                <li>✓ <strong>Lisanslı</strong> ve sigortali araç filosu</li>
                <li>✓ <strong>Profesyonel</strong> ve tecrübeli şoförler</li>
                <li>✓ <strong>Şeffaf</strong> fiyatlandırma, gizli ücret yok</li>
              </ul>
            </div>

            {/* Şirket Bilgileri Kutusu */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Resmi Şirket Bilgileri
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Ticari Unvan:</span>
                  <span className="font-medium">SBS Turkey Turizm San. ve Tic. Ltd. Şti.</span>
                </div>
                <div className="flex justify-between">
                  <span>Marka Adı:</span>
                  <span className="font-medium">SBS Turkey Transfer</span>
                </div>
                <div className="flex justify-between">
                  <span>Web Sitesi:</span>
                  <span className="font-medium text-blue-600">gatetransfer.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Vergi No:</span>
                  <span className="font-medium">123 456 7890</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Özellikler ve İstatistikler */}
          <div className="space-y-6">
            {/* Hizmet Bölgeleri */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Hizmet Bölgelerimiz</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <span>• Antalya Merkez</span>
                <span>• Lara Plajı</span>
                <span>• Kemer</span>
                <span>• Belek</span>
                <span>• Side</span>
                <span>• Manavgat</span>
                <span>• Kaş</span>
                <span>• Kalkan</span>
                <span>• Alanya</span>
                <span>• Serik</span>
              </div>
            </div>

            {/* Hizmet Saatleri */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Hizmet Saatlerimiz</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Pazartesi - Pazar:</span>
                  <span className="font-medium">24 Saat</span>
                </div>
                <div className="flex justify-between">
                  <span>Gece Transferleri:</span>
                  <span className="font-medium text-green-600">Mevcut</span>
                </div>
                <div className="flex justify-between">
                  <span>Acil Durum:</span>
                  <span className="font-medium text-green-600">7/24 Destek</span>
                </div>
              </div>
            </div>

            {/* Güvenlik ve Kalite */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Güvenlik & Kalite</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-700">Lisanslı Transfer Şirketi</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-700">Kasko & Trafik Sigortası</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-700">COVID-19 Hijyen Protokolü</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-700">GPS Takip Sistemi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Kısım - CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Antalya Transfer Rezervasyonunuz İçin Hemen İletişime Geçin
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Profesyonel ekibimiz ve modern araç filomuz ile güvenli yolculuğunuz için hemen rezervasyon yapın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/rezervasyon"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Online Rezervasyon
              </a>
              <a
                href="tel:+905325742682"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                +90 532 574 26 82
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalSEOSection;
