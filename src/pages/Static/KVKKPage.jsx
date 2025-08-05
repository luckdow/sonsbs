import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  User,
  Mail,
  Phone,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
  Lock
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const KVKKPage = () => {
  const [formData, setFormData] = useState({
    requestType: '',
    firstName: '',
    lastName: '',
    tcNo: '',
    email: '',
    phone: '',
    address: '',
    requestDetails: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const requestTypes = [
    { value: 'info', label: 'Kişisel verilerimin işlenip işlenmediğini öğrenmek' },
    { value: 'purpose', label: 'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenmek' },
    { value: 'third-parties', label: 'Aktarıldığı üçüncü kişileri öğrenmek' },
    { value: 'correction', label: 'Eksik veya yanlış işlenmiş olması halinde düzeltilmesini istemek' },
    { value: 'deletion', label: 'Silinmesini istemek' },
    { value: 'notification', label: 'Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini istemek' },
    { value: 'objection', label: 'Otomatik sistemle analiz edilmesine itiraz etmek' },
    { value: 'portability', label: 'Başka bir veri sorumlusuna aktarılmasını istemek' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    setIsSubmitted(true);
  };

  const rights = [
    {
      icon: User,
      title: 'Bilgi Alma Hakkı',
      description: 'Kişisel verilerinizin işlenip işlenmediğini, işlenme amacını ve üçüncü kişilere aktarılıp aktarılmadığını öğrenme hakkınız.'
    },
    {
      icon: FileText,
      title: 'Düzeltme Hakkı',
      description: 'Eksik veya yanlış işlenen kişisel verilerinizin düzeltilmesini talep etme hakkınız.'
    },
    {
      icon: Shield,
      title: 'Silme Hakkı',
      description: 'Yasal saklama süreleri dolan veya işlenme amacı ortadan kalkan verilerinizin silinmesini isteme hakkınız.'
    },
    {
      icon: Send,
      title: 'Taşınabilirlik Hakkı',
      description: 'Verilerinizi yapılandırılmış ve yaygın kullanılan formatta alma veya başka bir veri sorumlusuna aktarılmasını isteme hakkınız.'
    }
  ];

  return (
    <StaticPageLayout
      title="KVKK | GATE Transfer - Kişisel Verilerin Korunması Kanunu"
      description="GATE Transfer KVKK uygulamaları, veri sahibi hakları, başvuru formu ve kişisel veri koruma politikaları. 6698 sayılı kanun kapsamında haklarınızı öğrenin."
      keywords="KVKK, kişisel verilerin korunması, veri sahibi hakları, KVKK başvuru, kişisel veri koruma, 6698 sayılı kanun, GATE Transfer KVKK"
      canonicalUrl="/kvkk"
      heroTitle="KVKK - Kişisel Verilerin Korunması"
      heroSubtitle="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında haklarınız"
    >
      {/* KVKK Genel Bilgi */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                KVKK Nedir?
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong>, 
                  kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere 
                  kişilerin temel hak ve özgürlüklerini korumak amacıyla çıkarılmış bir kanundur.
                </p>
                <p>
                  GATE Transfer olarak, müşterilerimizin kişisel verilerinin korunması 
                  konusunda yasal yükümlülüklerimizi tam olarak yerine getiriyoruz.
                </p>
                <p>
                  Bu kanun kapsamında sahip olduğunuz hakları kullanmak için aşağıdaki 
                  başvuru formunu doldurabilir veya doğrudan bizimle iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Veri Güvenliğimiz</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>SSL şifreleme ile güvenli veri iletimi</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Yetkisiz erişimlere karşı güvenlik önlemleri</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Düzenli güvenlik denetimleri</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>KVKK uyumlu veri saklama süreleri</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Veri Sahibi Hakları */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Veri Sahibi Olarak Haklarınız
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                KVKK kapsamında sahip olduğunuz hakları kolayca kullanabilirsiniz
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rights.map((right, index) => {
                const IconComponent = right.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {right.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {right.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* KVKK Başvuru Formu */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              KVKK Başvuru Formu
            </h2>
            <p className="text-lg text-gray-600">
              Veri sahibi haklarınızı kullanmak için aşağıdaki formu doldurun
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Başvurunuz Alındı
              </h3>
              <p className="text-green-800 mb-4">
                KVKK başvurunuz başarıyla gönderildi. En geç 30 gün içinde size dönüş yapacağız.
              </p>
              <p className="text-sm text-green-700">
                Başvuru takip numaranız e-posta ile gönderilecektir.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-8">
              {/* Başvuru Türü */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Başvuru Türü *
                </label>
                <div className="space-y-2">
                  {requestTypes.map((type) => (
                    <label key={type.value} className="flex items-start">
                      <input
                        type="radio"
                        name="requestType"
                        value={type.value}
                        checked={formData.requestType === type.value}
                        onChange={handleInputChange}
                        className="mt-1 mr-3"
                        required
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kişisel Bilgiler */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    T.C. Kimlik No *
                  </label>
                  <input
                    type="text"
                    name="tcNo"
                    value={formData.tcNo}
                    onChange={handleInputChange}
                    required
                    maxLength="11"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Adres *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Talep Detayları
                </label>
                <textarea
                  name="requestDetails"
                  value={formData.requestDetails}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Başvurunuzla ilgili detayları açıklayabilirsiniz..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Başvuru Gönder
              </button>
            </form>
          )}
        </div>
      </section>

      {/* İletişim ve Süreç */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Başvuru Süreci</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Başvuru Yapın</h4>
                    <p className="text-sm text-gray-600">Formu doldurup başvurunuzu gönderin</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">İnceleme (7 gün)</h4>
                    <p className="text-sm text-gray-600">Başvurunuz hukuk departmanımızca incelenir</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sonuç (30 gün)</h4>
                    <p className="text-sm text-gray-600">En geç 30 gün içinde size dönüş yapılır</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
              <h3 className="text-xl font-bold mb-6">KVKK İletişim</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">E-posta</p>
                    <a href="mailto:sbstravelinfo@gmail.com" className="text-blue-100 hover:text-white">
                      sbstravelinfo@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <a href="tel:+905325742682" className="text-blue-100 hover:text-white">
                      +90 532 574 26 82
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Lock className="w-5 h-5 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Veri Sorumlusu</p>
                    <p className="text-blue-100 text-sm">
                      SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi
                      <br />Güzelyurt Mah. Serik Cad. No: 138/2 Aksu/Antalya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default KVKKPage;
