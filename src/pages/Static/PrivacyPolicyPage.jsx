import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye,
  Database,
  UserCheck,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Giriş',
      icon: Shield,
      content: `Bu Gizlilik Politikası, SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi ("GATE Transfer", "Şirket", "biz" veya "bizim") tarafından www.gatetransfer.com web sitesi ve transfer hizmetleri kapsamında toplanan kişisel verilerin işlenmesi, korunması ve kullanılmasına ilişkin politikaları açıklamaktadır.

Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat hükümlerine uygun olarak hazırlanmıştır. Hizmetlerimizi kullanarak bu gizlilik politikasını kabul etmiş sayılırsınız.`
    },
    {
      id: 'data-collection',
      title: 'Toplanan Kişisel Veriler',
      icon: Database,
      content: `GATE Transfer olarak aşağıdaki kişisel verileri toplayabiliriz:

**Kimlik Bilgileri:**
• Ad, soyad
• TC kimlik numarası (gerekli durumlarda)
• Pasaport bilgileri (yabancı misafirler için)

**İletişim Bilgileri:**
• Telefon numarası
• E-posta adresi
• Adres bilgileri

**Seyahat Bilgileri:**
• Uçuş bilgileri (tarih, saat, uçuş numarası)
• Otel ve konaklama bilgileri
• Transfer güzergahı
• Yolcu sayısı ve çocuk koltuğu ihtiyacı

**Ödeme Bilgileri:**
• Kredi kartı bilgileri (güvenli ödeme sistemleri üzerinden)
• Fatura bilgileri

**Teknik Veriler:**
• IP adresi
• Tarayıcı bilgileri
• Web sitesi kullanım bilgileri`
    },
    {
      id: 'data-usage',
      title: 'Verilerin Kullanım Amaçları',
      icon: UserCheck,
      content: `Toplanan kişisel verileri aşağıdaki amaçlarla kullanmaktayız:

**Hizmet Sunumu:**
• Transfer hizmetinin planlanması ve yürütülmesi
• Rezervasyon işlemlerinin gerçekleştirilmesi
• Müşteri ile iletişim kurulması

**Güvenlik ve Kalite:**
• Hizmet kalitesinin artırılması
• Güvenlik önlemlerinin alınması
• Şoför ve araç takibi

**Yasal Yükümlülükler:**
• Vergi mevzuatı gereği belge saklama
• Turizm mevzuatı kapsamında raporlama
• Kolluk kuvvetleri tarafından talep edilmesi

**Pazarlama ve İletişim:**
• Hizmetler hakkında bilgilendirme
• Özel kampanya ve fırsatların duyurulması
• Müşteri memnuniyeti anketleri`
    },
    {
      id: 'data-sharing',
      title: 'Veri Paylaşımı',
      icon: Eye,
      content: `Kişisel verilerinizi aşağıdaki durumlar haricinde üçüncü kişilerle paylaşmayız:

**Yasal Zorunluluklar:**
• Mahkeme kararları
• Kolluk kuvvetleri talepleri
• Vergi dairesi ve diğer kamu kurumları

**Hizmet Sağlayıcıları:**
• Ödeme işlemcileri (güvenli ödeme için)
• SMS/E-posta hizmet sağlayıcıları
• Web hosting hizmetleri

**İş Ortakları:**
• Otel ve acenteler (sadece gerekli bilgiler)
• Sigorta şirketleri (kaza durumunda)

Tüm üçüncü kişiler veri koruma yükümlülükleri altındadır ve verilerinizi sadece belirtilen amaçlar için kullanabilirler.`
    },
    {
      id: 'data-security',
      title: 'Veri Güvenliği',
      icon: Lock,
      content: `Kişisel verilerinizin güvenliği için aşağıdaki önlemleri almaktayız:

**Teknik Güvenlik:**
• SSL sertifikası ile şifreli veri iletimi
• Güvenli sunucu altyapısı
• Düzenli güvenlik güncellemeleri
• Firewall ve anti-virüs koruması

**İdari Güvenlik:**
• Yetkili personel erişimi
• Gizlilik sözleşmeleri
• Düzenli personel eğitimleri
• Veri erişim logları

**Fiziksel Güvenlik:**
• Güvenli ofis ortamı
• Kilitli doküman dolabları
• Kontrollü erişim sistemi

Ancak internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olmadığını hatırlatırız.`
    },
    {
      id: 'data-retention',
      title: 'Veri Saklama Süreleri',
      icon: Calendar,
      content: `Kişisel verilerinizi aşağıdaki süreler boyunca saklamaktayız:

**Rezervasyon Bilgileri:** 5 yıl (vergi mevzuatı gereği)
**İletişim Bilgileri:** 3 yıl (pazarlama rızası süresince)
**Ödeme Bilgileri:** 2 yıl (güvenlik ve itiraz süreçleri için)
**Web Sitesi Logları:** 1 yıl (güvenlik amaçlı)
**Şikayet/Talep Kayıtları:** 3 yıl (müşteri hizmetleri için)

Saklama süreleri sona erince verileriniz güvenli şekilde silinir veya anonim hale getirilir.`
    },
    {
      id: 'user-rights',
      title: 'Veri Sahibi Hakları',
      icon: UserCheck,
      content: `KVKK kapsamında aşağıdaki haklara sahipsiniz:

**Bilgi Alma Hakkı:**
• Hangi kişisel verilerinizin işlendiğini öğrenme
• İşlenme amaçlarını öğrenme
• Verilerin aktarıldığı üçüncü kişileri öğrenme

**Düzeltme ve Silme Hakkı:**
• Yanlış verilerin düzeltilmesini isteme
• Yasal saklama süresi dolan verilerin silinmesini isteme
• İşleme amacı ortadan kalkan verilerin silinmesini isteme

**İtiraz Hakkı:**
• Otomatik sistemlerle alınan kararlara itiraz etme
• Pazarlama amaçlı işlemlere itiraz etme

**Veri Taşınabilirlik:**
• Verilerinizi yapılandırılmış formatta alma
• Başka bir veri sorumlusuna aktarılmasını isteme

Bu haklarınızı kullanmak için info@sbstravel.net adresine yazılı başvuru yapabilirsiniz.`
    },
    {
      id: 'cookies',
      title: 'Çerez (Cookie) Politikası',
      icon: Database,
      content: `Web sitemizde kullanıcı deneyimini geliştirmek amacıyla çerezler kullanılmaktadır:

**Zorunlu Çerezler:**
• Web sitesinin temel fonksiyonları için gerekli
• Güvenlik ve oturum yönetimi
• Rezervasyon işlemlerinin tamamlanması

**Performans Çerezleri:**
• Web sitesi performansının ölçülmesi
• Hata raporlama ve analiz
• Yavaş olan sayfaların tespit edilmesi

**Pazarlama Çerezleri:**
• Kişiselleştirilmiş içerik sunumu
• Sosyal medya entegrasyonu
• Remarketing kampanyaları

Çerez ayarlarınızı tarayıcınızdan kontrol edebilir, istemediğiniz çerezleri devre dışı bırakabilirsiniz.`
    },
    {
      id: 'contact',
      title: 'İletişim Bilgileri',
      icon: Mail,
      content: `Bu gizlilik politikası ile ilgili sorularınız için:

**Veri Sorumlusu:**
SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi
Güzelyurt Mahallesi Serik Caddesi No: 138/2
Aksu / Antalya

**İletişim:**
• E-posta: info@sbstravel.net
• Telefon: +90 532 574 26 82
• Web sitesi: www.gatetransfer.com

**KVKK Başvuruları:**
KVKK kapsamındaki haklarınızı kullanmak için yukarıdaki iletişim bilgilerinden bize ulaşabilirsiniz. Başvurularınız en geç 30 gün içinde cevaplanacaktır.`
    }
  ];

  return (
    <StaticPageLayout
      title="Gizlilik Politikası | GATE Transfer - Kişisel Veri Koruma ve Gizlilik"
      description="GATE Transfer gizlilik politikası. Kişisel verilerinizin korunması, KVKK uyumluluğu, veri güvenliği ve kullanıcı hakları hakkında detaylı bilgiler."
      keywords="GATE Transfer gizlilik politikası, KVKK, kişisel veri koruma, veri güvenliği, gizlilik, çerez politikası, kullanıcı hakları, data protection"
      canonicalUrl="/gizlilik-politikasi"
      heroTitle="Gizlilik Politikası"
      heroSubtitle="Kişisel verilerinizin korunması bizim önceliğimizdir"
    >
      {/* Politika İçeriği */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Son Güncelleme */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-900">Son Güncelleme</span>
            </div>
            <p className="text-blue-800">
              Bu gizlilik politikası 24 Temmuz 2025 tarihinde güncellenmiştir.
            </p>
          </div>

          {/* Politika Bölümleri */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={section.id} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="text-gray-700 leading-relaxed">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <div key={pIndex} className="mb-4 last:mb-0">
                        {paragraph.split('\n').map((line, lIndex) => {
                          if (line.startsWith('**') && line.endsWith(':**')) {
                            return (
                              <h3 key={lIndex} className="font-semibold text-gray-900 mt-4 mb-2">
                                {line.replace(/\*\*/g, '')}
                              </h3>
                            );
                          } else if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <h4 key={lIndex} className="font-medium text-gray-900 mt-3 mb-1">
                                {line.replace(/\*\*/g, '')}
                              </h4>
                            );
                          } else if (line.startsWith('• ')) {
                            return (
                              <p key={lIndex} className="ml-4 mb-1">
                                {line}
                              </p>
                            );
                          } else {
                            return (
                              <p key={lIndex} className={line ? 'mb-2' : 'mb-1'}>
                                {line}
                              </p>
                            );
                          }
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Önemli Hatırlatma */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Önemli Bilgilendirme
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler 
                  olduğunda size e-posta ile bilgilendirme yapacağız. Web sitemizi kullanmaya 
                  devam ederek güncellenmiş politikayı kabul etmiş sayılırsınız.
                </p>
              </div>
            </div>
          </div>

          {/* Hızlı İletişim */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-4">
              Gizlilik Konusunda Sorularınız mı Var?
            </h3>
            <p className="mb-6 text-blue-100">
              KVKK haklarınız ve veri güvenliği konusunda detaylı bilgi için
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@sbstravel.net"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                E-posta Gönderin
              </a>
              <a
                href="tel:+905325742682"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                +90 532 574 26 82
              </a>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default PrivacyPolicyPage;
