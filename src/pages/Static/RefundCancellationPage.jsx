import React from 'react';
import { 
  RefreshCw, 
  XCircle, 
  Clock, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  FileText
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const RefundCancellationPage = () => {
  const cancellationPolicies = [
    {
      timeframe: '24 saat öncesi',
      refundRate: '100%',
      description: 'Transfer saatinden 24 saat öncesine kadar yapılan iptallerde tam iade.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle
    },
    {
      timeframe: '12-24 saat arası',
      refundRate: '75%',
      description: 'Transfer saatinden 12-24 saat arası yapılan iptallerde %75 iade.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Clock
    },
    {
      timeframe: '6-12 saat arası',
      refundRate: '50%',
      description: 'Transfer saatinden 6-12 saat arası yapılan iptallerde %50 iade.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: AlertTriangle
    },
    {
      timeframe: '6 saat altı',
      refundRate: '0%',
      description: 'Transfer saatinden 6 saat öncesinden sonra yapılan iptallerde iade yapılmaz.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: XCircle
    }
  ];

  const specialCases = [
    {
      title: 'Uçuş İptali/Gecikme',
      description: 'Havayolu şirketinden kaynaklanan iptal veya önemli gecikmeler durumunda tam iade.',
      icon: Calendar,
      refund: '100%'
    },
    {
      title: 'Doğal Afet',
      description: 'Doğal afetler veya mücbir sebeplerden dolayı transfer yapılamadığında tam iade.',
      icon: Shield,
      refund: '100%'
    },
    {
      title: 'Sağlık Sorunu',
      description: 'Doktor raporu ile belgelenen sağlık sorunları durumunda esnek iptal.',
      icon: FileText,
      refund: '100%'
    },
    {
      title: 'Visa Reddi',
      description: 'Vize reddi durumunda belge ibrazı ile tam iade.',
      icon: FileText,
      refund: '100%'
    }
  ];

  const refundMethods = [
    {
      method: 'Kredi Kartı',
      duration: '3-7 iş günü',
      description: 'Ödeme yaptığınız kredi kartına iade işlemi',
      icon: CreditCard
    },
    {
      method: 'Banka Havalesi',
      duration: '1-3 iş günü',
      description: 'Belirttiğiniz banka hesabına havale',
      icon: DollarSign
    },
    {
      method: 'İndirim Kuponu',
      duration: 'Anında',
      description: 'Sonraki rezervasyonlarda kullanılmak üzere',
      icon: RefreshCw
    }
  ];

  return (
    <StaticPageLayout
      title="İade ve İptal Politikası | GATE Transfer - Transfer İptal Koşulları"
      description="GATE Transfer iade ve iptal politikası. Transfer iptal koşulları, iade süreleri ve özel durumlar hakkında detaylı bilgiler."
      keywords="transfer iptal, iade politikası, GATE Transfer iptal, transfer iade koşulları, rezervasyon iptal, havalimanı transfer iptal"
      canonicalUrl="/iade-iptal"
      heroTitle="İade ve İptal Politikası"
      heroSubtitle="Transfer rezervasyonlarınızın iptal ve iade koşulları"
    >
      {/* Genel Bilgi */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                İptal Politikamız
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>GATE Transfer</strong> olarak müşterilerimizin planlarının 
                  değişebileceğini anlıyoruz. Bu nedenle esnek iptal politikamızla 
                  size destek olmaya çalışıyoruz.
                </p>
                <p>
                  İptal işlemlerinizi transfer saatinden önce ne kadar erken yaparsanız, 
                  o kadar yüksek oranda iade alabilirsiniz. Acil durumlar için özel 
                  koşullarımız bulunmaktadır.
                </p>
                <p>
                  Tüm iptal talepleri +90 532 574 26 82 numaralı telefon veya 
                  sbstravelinfo@gmail.com e-posta adresi üzerinden yapılabilir.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Hızlı İptal</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Telefon</p>
                    <a href="tel:+905325742682" className="text-blue-600 hover:text-blue-800">
                      +90 532 574 26 82
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">E-posta</p>
                    <a href="mailto:sbstravelinfo@gmail.com" className="text-blue-600 hover:text-blue-800">
                      sbstravelinfo@gmail.com
                    </a>
                  </div>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>7/24 İptal Hattı:</strong> Acil durumlarda rezervasyon numaranızla 
                    arayabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İptal Oranları */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              İptal Oranları ve Süreler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transfer saatinize ne kadar erken iptal yaparsanız, o kadar fazla iade alırsınız
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cancellationPolicies.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <div 
                  key={index}
                  className={`${policy.bgColor} ${policy.borderColor} border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow`}
                >
                  <div className={`w-16 h-16 ${policy.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`w-8 h-8 ${policy.color}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {policy.timeframe}
                  </h3>
                  
                  <div className={`text-2xl font-bold ${policy.color} mb-3`}>
                    {policy.refundRate}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {policy.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Örnek Hesaplama */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Örnek İade Hesaplaması
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-4">
                <div className="text-lg font-bold text-gray-900 mb-2">Rezervasyon Tutarı</div>
                <div className="text-2xl font-bold text-blue-600">€50</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-lg font-bold text-gray-900 mb-2">İptal Zamanı</div>
                <div className="text-2xl font-bold text-green-600">18 saat önce</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-lg font-bold text-gray-900 mb-2">İade Tutarı</div>
                <div className="text-2xl font-bold text-green-600">€37.5 (%75)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özel Durumlar */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Özel Durumlar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kontrolünüz dışındaki durumlar için özel iptal koşullarımız
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialCases.map((specialCase, index) => {
              const IconComponent = specialCase.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {specialCase.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {specialCase.description}
                  </p>
                  
                  <div className="text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      İade: {specialCase.refund}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">
                  Özel Durum Başvurusu
                </h3>
                <p className="text-green-800">
                  Yukarıdaki özel durumlardan herhangi biri için iade talebinde bulunurken, 
                  durumunuzu belgeleyen dokümanları (doktor raporu, uçuş iptal belgesi, vb.) 
                  başvurunuzla birlikte gönderiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İade Yöntemleri */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              İade Yöntemleri ve Süreleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size en uygun iade yöntemini seçebilirsiniz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {refundMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.method}
                  </h3>
                  
                  <div className="text-lg font-semibold text-blue-600 mb-3">
                    {method.duration}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 inline-block">
              <h3 className="font-bold text-blue-900 mb-2">
                İade Süreci
              </h3>
              <p className="text-blue-800 text-sm">
                İade talebiniz onaylandıktan sonra, seçtiğiniz yönteme göre yukarıdaki 
                süreler içinde hesabınıza iade yapılır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* İptal Süreci */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              İptal Süreci Nasıl İşler?
            </h2>
            <p className="text-lg text-gray-600">
              Rezervasyonunuzu iptal etmek için izlemeniz gereken adımlar
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  İletişime Geçin
                </h3>
                <p className="text-gray-600">
                  +90 532 574 26 82 numaralı telefonu arayın veya sbstravelinfo@gmail.com 
                  adresine e-posta gönderin. Rezervasyon numaranızı hazır bulundurun.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  İptal Talebinizi Bildirin
                </h3>
                <p className="text-gray-600">
                  Müşteri hizmetleri temsilcimiz rezervasyonunuzu kontrol edip, 
                  iptal koşullarını size açıklayacaktır.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  İade Yöntemini Seçin
                </h3>
                <p className="text-gray-600">
                  İade almaya hak kazandığınız takdirde, tercih ettiğiniz iade yöntemini 
                  belirtin (kredi kartı, banka havalesi, indirim kuponu).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  İade Sürecini Takip Edin
                </h3>
                <p className="text-gray-600">
                  İade işleminizin durumu hakkında SMS ve e-posta ile bilgilendirileceksiniz. 
                  İşlem tamamlandığında size bildirim yapılır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Rezervasyonumu telefonla iptal edebilir miyim?
              </h3>
              <p className="text-gray-600">
                Evet, +90 532 574 26 82 numaralı telefonumuzu arayarak 7/24 iptal işlemi yapabilirsiniz.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                İade ne zaman hesabıma geçer?
              </h3>
              <p className="text-gray-600">
                Kredi kartına iade 3-7 iş günü, banka havalesi 1-3 iş günü sürmektedir. 
                İndirim kuponu anında oluşturulur.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Uçağım iptal oldu, tam iade alabilir miyim?
              </h3>
              <p className="text-gray-600">
                Evet, havayolu şirketinden kaynaklanan iptal durumunda iptal belgenizi 
                göndererek %100 iade alabilirsiniz.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Transfer saatim geçti, iptal edebilir miyim?
              </h3>
              <p className="text-gray-600">
                Maalesef transfer saati geçtikten sonra iptal işlemi yapılamaz. 
                Ancak özel durumlar için müşteri hizmetlerimizle görüşebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              İptal İşlemi İçin Bizimle İletişime Geçin
            </h3>
            <p className="text-blue-100 mb-6">
              7/24 müşteri hizmetlerimiz iptal işlemlerinizde size yardımcı olmaya hazır
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+905325742682"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                +90 532 574 26 82
              </a>
              <a
                href="mailto:sbstravelinfo@gmail.com"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                E-posta Gönderin
              </a>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default RefundCancellationPage;
