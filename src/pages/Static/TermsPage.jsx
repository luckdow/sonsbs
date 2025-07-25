import React from 'react';
import { FileText, Shield, AlertCircle, CheckCircle, Ban, Clock } from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const TermsPage = () => {
  const sections = [
    {
      id: 'genel-kosullar',
      title: 'Genel Koşullar',
      icon: FileText,
      content: [
        'Bu kullanım şartları SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi (GATE Transfer) ile müşterilerimiz arasındaki hizmet sözleşmesini düzenler.',
        'Web sitemizi kullanarak veya hizmetlerimizi satın alarak bu şartları kabul etmiş sayılırsınız.',
        'Şirketimiz bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar.',
        'Güncel şartlar her zaman web sitemizde yayınlanır ve yayın tarihinden itibaren geçerlidir.'
      ]
    },
    {
      id: 'rezervasyon-kosullari',
      title: 'Rezervasyon Koşulları',
      icon: CheckCircle,
      content: [
        'Rezervasyonlar sadece doğru ve eksiksiz bilgiler verilerek yapılabilir.',
        'Rezervasyon onayı e-posta veya SMS ile gönderilir ve bu onay sözleşmenin başlangıcıdır.',
        'Rezervasyon sırasında belirtilen kalkış saati ve yeri kesin olup değişiklik talepleri ek ücrete tabidir.',
        'Özel istekler (çocuk koltuğu, VIP araç vb.) rezervasyon sırasında belirtilmeli ve onaylanmalıdır.',
        'Grup rezervasyonları (8+ kişi) için özel koşullar ve fiyatlandırma uygulanır.'
      ]
    },
    {
      id: 'odeme-kosullari',
      title: 'Ödeme Koşulları',
      icon: Shield,
      content: [
        'Ödemeler online kredi kartı, nakit veya banka havalesi ile yapılabilir.',
        'Online ödemeler güvenli SSL şifreleme ile korunmaktadır.',
        'Nakit ödemeler transfer başlangıcında şoföre yapılabilir.',
        'Fiyatlar Euro veya USD cinsinden belirtilir ve güncel kurlarla hesaplanır.',
        'Ödeme yapılmayan rezervasyonlar otomatik olarak iptal edilir.'
      ]
    },
    {
      id: 'iptal-iade',
      title: 'İptal ve İade Koşulları',
      icon: Ban,
      content: [
        'Transfer saatinden 24 saat öncesine kadar ücretsiz iptal yapılabilir.',
        'Son 24 saat içindeki iptallerde %50 iptal ücreti uygulanır.',
        'Transfer saatinden sonraki iptallerde iade yapılmaz.',
        'Hava koşulları nedeniyle iptal edilen transferlerde tam iade yapılır.',
        'İade işlemleri 3-5 iş günü içinde tamamlanır.'
      ]
    }
  ];

  const responsibilities = [
    {
      title: 'Müşteri Sorumlulukları',
      items: [
        'Rezervasyon bilgilerinin doğruluğundan sorumludur',
        'Belirlenen zamanda kalkış noktasında hazır bulunmalıdır',
        'Gerekli belgelerini (pasaport, kimlik vb.) yanında bulundurmalıdır',
        'Araç içi kurallarına uymalı ve şoföre saygılı davranmalıdır',
        'Fazla bagaj durumunda önceden bilgi vermelidir'
      ]
    },
    {
      title: 'Şirket Sorumlulukları',
      items: [
        'Güvenli ve konforlu transfer hizmeti sunmakla sorumludur',
        'Belirtilen saatte kalkış noktasında hazır bulunur',
        'Lisanslı araç ve profesyonel şoför sağlar',
        'Uçuş gecikmeleri halinde ücretsiz bekleme hizmeti verir',
        'Hizmet kalitesi ve müşteri memnuniyetini garanti eder'
      ]
    }
  ];

  const restrictions = [
    'Alkollü veya uyuşturucu etkisi altındaki yolcular kabul edilmez',
    'Tehlikeli madde taşıması kesinlikle yasaktır',
    'Evcil hayvan taşıma önceden bildirilmeli ve onaylanmalıdır',
    'Sigara içmek ve yemek yemek araç içinde yasaktır',
    'Aşırı bagaj için ek ücret talep edilebilir'
  ];

  return (
    <StaticPageLayout
      title="Kullanım Şartları | GATE Transfer - Hizmet Koşulları ve Kurallar"
      description="GATE Transfer kullanım şartları ve hizmet koşulları. Rezervasyon, ödeme, iptal koşulları ve müşteri-şirket sorumlulukları hakkında bilgiler."
      keywords="GATE Transfer kullanım şartları, hizmet koşulları, rezervasyon kuralları, iptal koşulları, transfer hizmet sözleşmesi, antalya transfer terms"
      canonicalUrl="/kullanim-sartlari"
      heroTitle="Kullanım Şartları"
      heroSubtitle="Hizmet koşullarımız ve karşılıklı sorumluluklarımız"
    >
      {/* Giriş */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Hizmet Sözleşmesi
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Bu kullanım şartları, SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi bünyesinde 
              faaliyet gösteren GATE Transfer markası ile müşterilerimiz arasındaki hizmet ilişkisini 
              düzenler. Web sitemizi kullanarak veya hizmetlerimizi satın alarak bu şartları kabul 
              etmiş sayılırsınız.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">Son Güncelleme: 24 Temmuz 2025</span>
            </div>
            <p className="text-gray-600 text-sm">
              Bu kullanım şartları düzenli olarak güncellenebilir. Güncel şartlar her zaman 
              web sitemizde yayınlanır.
            </p>
          </div>
        </div>
      </section>

      {/* Ana Bölümler */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={section.id} className="bg-gray-50 rounded-xl p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sorumluluklar */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Sorumluluklar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kaliteli hizmet için karşılıklı sorumluluk ve yükümlülüklerimiz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {responsibilities.map((resp, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {resp.title}
                </h3>
                <ul className="space-y-2">
                  {resp.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kısıtlamalar */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 rounded-2xl p-6 md:p-8">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Kısıtlamalar ve Yasaklar
              </h2>
            </div>
            <ul className="space-y-3">
              {restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start">
                  <Ban className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {restriction}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Uyuşmazlık Çözümü */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Uyuşmazlık Çözümü
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Bu sözleşmeden doğacak uyuşmazlıkların çözümünde öncelikle dostane çözüm yolları denenecektir.
              </p>
              <p>
                Dostane çözüm sağlanamadığı takdirde, Antalya Mahkemeleri ve İcra Müdürlükleri yetkilidir.
              </p>
              <p>
                Türkiye Cumhuriyeti yasaları geçerlidir ve tüm uyuşmazlıklar Türk hukuku çerçevesinde çözümlenir.
              </p>
              <p className="text-sm text-gray-600 mt-6">
                <strong>İletişim:</strong> Anlaşmazlık durumunda 
                <a href="mailto:info@sbstravel.net" className="text-blue-600 hover:text-blue-800 ml-1">
                  info@sbstravel.net
                </a> 
                adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Son Hükümler */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Son Hükümler
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Bu kullanım şartlarının herhangi bir maddesi geçersiz sayılsa dahi, diğer maddeler 
              geçerliliğini korur. Şirketimiz bu şartları tek taraflı olarak değiştirme hakkını 
              saklı tutar ve değişiklikler web sitesinde yayınlandığı tarihten itibaren yürürlüğe girer.
            </p>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi</strong><br />
                Güzelyurt Mahallesi, Serik Caddesi No: 138/2, Aksu/Antalya<br />
                Telefon: +90 532 574 26 82 | E-posta: info@sbstravel.net
              </p>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default TermsPage;
