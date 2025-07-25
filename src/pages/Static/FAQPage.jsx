import React, { useState } from 'react';
import { 
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  CreditCard,
  Users,
  MapPin,
  Plane
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqCategories = [
    {
      id: 'general',
      title: 'Genel Sorular',
      icon: HelpCircle,
      questions: [
        {
          id: 'what-is-gate',
          question: 'GATE Transfer nedir?',
          answer: 'GATE Transfer, SBS Turkey Turizm bünyesinde faaliyet gösteren ve 2011 yılından bu yana Antalya havalimanı transfer hizmetlerinde öncü konumda olan güvenilir bir transfer markasıdır. Antalya ve çevresindeki tüm turistik bölgelere güvenli, konforlu ve uygun fiyatlı transfer hizmetleri sunmaktayız.'
        },
        {
          id: 'service-areas',
          question: 'Hangi bölgelere hizmet veriyorsunuz?',
          answer: 'Antalya Havalimanı\'ndan başlayarak Lara, Kundu, Belek, Side, Manavgat, Alanya, Kemer, Kaleiçi, Konyaaltı ve diğer tüm Antalya bölgelerine transfer hizmeti vermekteyiz. Ayrıca Kaş, Demre, Fethiye gibi uzak destinasyonlara da hizmet sunuyoruz.'
        },
        {
          id: 'working-hours',
          question: 'Çalışma saatleriniz nedir?',
          answer: '7 gün 24 saat kesintisiz hizmet vermekteyiz. Gece yarısı ve sabahın erken saatlerindeki uçuşlar dahil olmak üzere her saatte transfer hizmeti sağlıyoruz.'
        },
        {
          id: 'safety-measures',
          question: 'Güvenlik önlemleriniz nelerdir?',
          answer: 'Tüm araçlarımız sigortalı ve düzenli bakımdan geçmektedir. Şoförlerimiz profesyonel sürücü belgesine sahip ve deneyimlidir. Araçlarımızda GPS takip sistemi bulunmaktadır ve tüm transferler güvenlik protokolleri çerçevesinde gerçekleştirilmektedir.'
        }
      ]
    },
    {
      id: 'booking',
      title: 'Rezervasyon İşlemleri',
      icon: Plane,
      questions: [
        {
          id: 'how-to-book',
          question: 'Nasıl rezervasyon yapabilirim?',
          answer: 'Rezervasyon yapmak için web sitemizden online rezervasyon formunu doldurabilir, +90 532 574 26 82 numaralı telefonumuzu arayabilir veya info@sbstravel.net adresine e-posta gönderebilirsiniz. Rezervasyonunuz anında onaylanacaktır.'
        },
        {
          id: 'advance-booking',
          question: 'Ne kadar önceden rezervasyon yapmalıyım?',
          answer: 'En az 24 saat önceden rezervasyon yapmanızı öneriyoruz. Ancak acil durumlar için 2-3 saat öncesine kadar rezervasyon alabiliyoruz. Yoğun sezonda erken rezervasyon yapmanız daha avantajlıdır.'
        },
        {
          id: 'booking-confirmation',
          question: 'Rezervasyonum onaylandığını nasıl anlarım?',
          answer: 'Rezervasyonunuz tamamlandıktan sonra size e-posta ve SMS ile onay mesajı göndeririz. Bu mesajda transfer detayları, şoför bilgileri ve iletişim numaraları bulunur.'
        },
        {
          id: 'flight-delays',
          question: 'Uçağım gecikirse ne olur?',
          answer: 'Uçuş takip sistemimiz sayesinde uçağınızın durumunu takip ediyoruz. Uçağınız gecikse şoförümüz bekleyecektir. 1 saate kadar gecikme için ek ücret alınmaz. Daha uzun gecikmeler için iletişime geçmeniz yeterlidir.'
        },
        {
          id: 'cancellation',
          question: 'Rezervasyonumu iptal edebilir miyim?',
          answer: 'Transfer saatinden 24 saat öncesine kadar ücretsiz iptal edebilirsiniz. 24 saatten sonraki iptallerde %50 iptal ücreti uygulanır. Transfer saatinden 6 saat öncesine kadar iptal işlemi yapılabilir.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Ödeme ve Fiyatlandırma',
      icon: CreditCard,
      questions: [
        {
          id: 'payment-methods',
          question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          answer: 'Nakit (EUR, USD), kredi kartı ve online ödeme seçeneklerini kabul ediyoruz. Ödeme işlemini transfer öncesinde veya sonrasında yapabilirsiniz. Büyük gruplar için havale/EFT ile ön ödeme imkanı da bulunmaktadır.'
        },
        {
          id: 'pricing',
          question: 'Fiyatlarınız nasıl belirleniyor?',
          answer: 'Fiyatlarımız mesafe, araç tipi ve hizmet seviyesine göre belirlenir. Sabit fiyat politikamız gereği surprise cost yoktur. Web sitemizden anlık fiyat teklifi alabilir veya telefon ile bilgi alabilirsiniz.'
        },
        {
          id: 'group-discounts',
          question: 'Grup indirimi var mı?',
          answer: 'Evet, 8 kişi ve üzeri grup reservasyonlarında özel indirimler uygulanır. Ayrıca düzenli müşterilerimiz için loyalty programımız bulunmaktadır. Detaylar için bizimle iletişime geçin.'
        },
        {
          id: 'extra-costs',
          question: 'Ekstra ücretler var mı?',
          answer: 'Temel hizmetimiz için ek ücret yoktur. Çocuk koltuğu ücretsizdir. Sadece 1 saatten fazla bekleme, ekstra durak veya özel istekler için ek ücret alınır. Tüm ücretler önceden bildirilir.'
        }
      ]
    },
    {
      id: 'vehicles',
      title: 'Araç ve Sürücüler',
      icon: Users,
      questions: [
        {
          id: 'vehicle-types',
          question: 'Hangi tip araçlarınız var?',
          answer: 'Araç filomuzda 1-4 kişilik sedan araçlar, 5-8 kişilik minivan/minibüsler ve VIP hizmet için Mercedes Vito/Sprinter araçları bulunmaktadır. Tüm araçlarımız klimalı, temiz ve düzenli bakımdan geçmektedir.'
        },
        {
          id: 'car-seats',
          question: 'Çocuk koltuğu hizmeti var mı?',
          answer: 'Evet, 0-12 yaş arası çocuklar için ücretsiz çocuk koltuğu hizmeti vermekteyiz. Rezervasyon sırasında çocuğunuzun yaşını belirtmeniz yeterlidir. Güvenlik standartlarına uygun sertifikalı koltuklar kullanıyoruz.'
        },
        {
          id: 'driver-language',
          question: 'Şoförleriniz hangi dilleri konuşuyor?',
          answer: 'Şoförlerimiz Türkçe, İngilizce ve temel düzeyde Almanca, Rusça konuşabilmektedir. Özel dil ihtiyacınız varsa rezervasyon sırasında belirtirseniz uygun şoför ayarlayabiliriz.'
        },
        {
          id: 'driver-info',
          question: 'Şoför bilgilerini önceden alabilir miyim?',
          answer: 'Evet, transfer gününden bir gün önce şoförünüzün adı, telefonu ve araç plakası bilgilerini size e-posta ve SMS ile göndeririz. Acil durumlar için 24 saat müşteri hizmetlerimiz ile iletişim kurabilirsiniz.'
        }
      ]
    },
    {
      id: 'service',
      title: 'Hizmet Detayları',
      icon: MapPin,
      questions: [
        {
          id: 'meeting-point',
          question: 'Havalimanında nerede buluşacağız?',
          answer: 'Şoförümüz havalimanı çıkış kapısında isminizin yazılı olduğu tabela ile sizi bekleyecektir. Terminal 1 veya Terminal 2 çıkışında, bagaj teslim alanının hemen ardında buluşma noktamız bulunmaktadır.'
        },
        {
          id: 'waiting-time',
          question: 'Bekleme süresi ne kadar?',
          answer: 'Havalimanı transferlerinde uçak saatinden itibaren 1 saat ücretsiz bekleme süresi vardır. Şehir içi transferlerde 15 dakika bekleme süresi tanınır. Bu süreler aşıldığında dakika başı ek ücret uygulanır.'
        },
        {
          id: 'luggage-limit',
          question: 'Bagaj sınırı var mı?',
          answer: 'Standart araçlarda kişi başı 2 büyük bavul + 1 el çantası ücretsiz taşınır. Fazla bagaj durumunda daha büyük araç önerebiliriz. Golf ekipmanı, surf tahtası gibi özel eşyalar için önceden bilgilendirme yapılmalıdır.'
        },
        {
          id: 'stops',
          question: 'Transfer sırasında durak yapabilir miyiz?',
          answer: 'Evet, market, eczane, ATM gibi kısa durağlar için 10 dakikaya kadar bekleme ücretsizdir. Daha uzun duraklar veya turistik ziyaretler için ek ücret alınır ve önceden belirtilmelidir.'
        }
      ]
    }
  ];

  return (
    <StaticPageLayout
      title="Sık Sorulan Sorular (SSS) | GATE Transfer - Antalya Havalimanı Transfer"
      description="GATE Transfer hakkında sık sorulan sorular ve cevapları. Rezervasyon, ödeme, araç bilgileri, havalimanı transfer süreçleri hakkında detaylı bilgiler."
      keywords="GATE Transfer SSS, Antalya transfer soruları, havalimanı transfer SSS, transfer rezervasyon soruları, Antalya transfer fiyat, transfer iptal şartları, çocuk koltuğu, havalimanı bekleme"
      canonicalUrl="/sss"
      heroTitle="Sık Sorulan Sorular"
      heroSubtitle="Transfer hizmetlerimiz hakkında merak ettikleriniz"
    >
      {/* Ana İçerik */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.id} className={`mb-8 ${categoryIndex !== 0 ? 'mt-12' : ''}`}>
                {/* Kategori Başlığı */}
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <CategoryIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                </div>

                {/* Sorular */}
                <div className="space-y-4">
                  {category.questions.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        {openItems[item.id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openItems[item.id] && (
                        <div className="px-6 pb-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed pt-4">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hızlı İpuçları */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Transfer İpuçları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sorunsuz bir transfer deneyimi için önemli ipuçları
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Erken Rezervasyon</h3>
              <p className="text-sm text-gray-600">
                24 saat önceden rezervasyon yaparak güvence altına alın
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">İletişim Bilgileri</h3>
              <p className="text-sm text-gray-600">
                Uçuş bilgilerinizi ve telefon numaranızı doğru verin
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Güvenlik</h3>
              <p className="text-sm text-gray-600">
                Şoför tabelasını kontrol edin ve kimlik doğrulaması yapın
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Yolcu Sayısı</h3>
              <p className="text-sm text-gray-600">
                Çocuk koltuğu ihtiyacı dahil yolcu sayısını belirtin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daha Fazla Yardım */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Sorunuza Cevap Bulamadınız mı?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            7/24 müşteri hizmetlerimiz size yardımcı olmaya hazır
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600 text-sm mb-3">7/24 Canlı Destek</p>
              <a 
                href="tel:+905325742682"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                +90 532 574 26 82
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
              <p className="text-gray-600 text-sm mb-3">24 saat içinde yanıt</p>
              <a 
                href="mailto:info@sbstravel.net"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                E-posta Gönder
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <HelpCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Canlı Destek</h3>
              <p className="text-gray-600 text-sm mb-3">Anında Yardım</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Sohbet Başlat
              </button>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
};

export default FAQPage;
