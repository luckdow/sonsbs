import React from 'react';
import { 
  Shield, 
  Clock, 
  Users, 
  Car, 
  MapPin, 
  Phone, 
  Mail,
  Award,
  Globe,
  CheckCircle,
  Calendar,
  Star
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';
import { 
  SEOHead, 
  StructuredData, 
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateMetaTags 
} from '../../seo/index.js';

const AboutPage = () => {
  // SEO Meta Tags
  const aboutMetaTags = generateMetaTags({
    title: 'Hakkımızda | SBS Turkey Transfer - Antalya Transfer Hizmeti',
    description: '2011\'den beri Antalya\'da güvenli transfer hizmeti. TURSAB lisanslı, %99 memnuniyet oranı, 50.000+ mutlu müşteri. Mercedes araçlar, profesyonel şoförler, 7/24 hizmet.',
    keywords: 'SBS Turkey Transfer hakkında, Antalya transfer şirketi, güvenli transfer, TURSAB lisanslı transfer, Antalya havalimanı transfer hizmeti',
    url: '/hakkimizda',
    image: '/images/about-us.jpg',
    type: 'website'
  });

  // Schema.org Structured Data
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://www.gatetransfer.com/' },
    { name: 'Hakkımızda', url: 'https://www.gatetransfer.com/hakkimizda' }
  ]);

  const stats = [
    { number: "2011", label: "Kuruluş Yılı" },
    { number: "50000+", label: "Mutlu Müşteri" },
    { number: "99%", label: "Memnuniyet Oranı" },
    { number: "24/7", label: "Hizmet Saatleri" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Güvenli Transfer",
      description: "Lisanslı araçlar ve profesyonel şoförlerle güvenli yolculuk garantisi"
    },
    {
      icon: Clock,
      title: "7/24 Hizmet",
      description: "Gece gündüz kesintisiz hizmet veren transfer ağımız"
    },
    {
      icon: Users,
      title: "Deneyimli Ekip",
      description: "Alanında uzman ve çok dilli personel kadromuz"
    },
    {
      icon: Car,
      title: "Modern Araç Filosu",
      description: "Konforlu, temiz ve bakımlı araçlarla kaliteli hizmet"
    }
  ];

  const certificates = [
    {
      icon: Award,
      title: "Turizm İşletme Belgesi",
      issuer: "T.C. Kültür ve Turizm Bakanlığı",
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      title: "Taşıyıcı Belgesi",
      issuer: "T.C. Ulaştırma ve Altyapı Bakanlığı",
      color: "text-blue-500"
    },
    {
      icon: CheckCircle,
      title: "Vergi Levhası",
      issuer: "Antalya Kurumlar Vergi Dairesi",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Ticaret Sicil Belgesi",
      issuer: "Antalya Ticaret Sicil Müdürlüğü",
      color: "text-purple-500"
    }
  ];

  return (
    <div>
      {/* SEO Head */}
      <SEOHead 
        pageData={{
          title: aboutMetaTags.title,
          description: aboutMetaTags.description,
          keywords: aboutMetaTags.keywords,
          url: '/hakkimizda',
          image: '/images/about-us.jpg',
          type: 'website'
        }}
        includeHrefLang={true}
      />
      
      {/* Schema.org Structured Data */}
      <StructuredData schema={organizationSchema} id="organization-schema" />
      <StructuredData schema={breadcrumbSchema} id="breadcrumb-schema" />

      <StaticPageLayout
      title="Hakkımızda | GATE Transfer - Antalya Havalimanı Transfer Hizmeti"
      description="GATE Transfer, SBS Turkey Turizm bünyesinde 2011'den beri Antalya havalimanı transfer hizmetinde güvenilir, konforlu ve uygun fiyatlı çözümler sunmaktadır."
      keywords="GATE Transfer hakkında, Antalya transfer firması, SBS Turkey Turizm, havalimanı transfer şirketi, güvenilir transfer, Antalya transfer deneyim, transfer hizmeti kalite, Antalya airport transfer company"
      canonicalUrl="/hakkimizda"
      heroTitle="GATE Transfer Hakkında"
      heroSubtitle="2011'den beri Antalya'da güvenilir transfer hizmetinin adresi"
    >
      {/* Şirket Tanıtımı */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                SBS Turkey Turizm Güvencesiyle
              </h2>
              <div className="space-y-4 text-base md:text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong>GATE Transfer</strong>, SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi 
                  bünyesinde faaliyet gösteren ve 2011 yılından bu yana Antalya havalimanı transfer 
                  hizmetlerinde öncü konumda olan güvenilir bir markadır.
                </p>
                <p>
                  Kültür ve Turizm Bakanlığı'ndan aldığımız 791101 - Seyahat Acentesi Faaliyetleri 
                  belgesi ile yasal çerçevede hizmet vermekte, müşterilerimize güven ve kalite 
                  garantisi sunmaktayız.
                </p>
                <p>
                  Antalya ve çevresindeki tüm turistik bölgelere kesintisiz transfer hizmeti 
                  sunan şirketimiz, müşteri memnuniyetini ön planda tutarak sektörde fark yaratmaktadır.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                İletişim Bilgileri
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Merkez Adresimiz</p>
                    <p className="text-gray-600 text-sm md:text-base">
                      Güzelyurt Mahallesi<br />
                      Serik Caddesi No: 138/2<br />
                      Aksu / Antalya
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">7/24 İletişim Hattı</p>
                    <a 
                      href="tel:+905325742682" 
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base"
                    >
                      +90 532 574 26 82
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">E-posta Adreslerimiz</p>
                    <div className="space-y-1">
                      <a 
                        href="mailto:sbstravelinfo@gmail.com" 
                        className="block text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base"
                      >
                        sbstravelinfo@gmail.com
                      </a>
                      <a 
                        href="mailto:sbstravelinfo@gmail.com" 
                        className="block text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base"
                      >
                        sbstravelinfo@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Web Sitemiz</p>
                    <a 
                      href="https://www.gatetransfer.com" 
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.gatetransfer.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Rakamlarla GATE Transfer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Yılların verdiği deneyim ve binlerce mutlu müşterinin güveniyle
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özelliklerimiz */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Neden GATE Transfer?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Müşteri memnuniyeti odaklı hizmet anlayışımızla fark yaratıyoruz
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 md:p-8">
              <div className="flex items-center mb-6">
                <Award className="w-6 md:w-8 h-6 md:h-8 text-blue-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Misyonumuz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Antalya havalimanı ve çevresindeki tüm turistik bölgelere güvenli, konforlu ve 
                uygun fiyatlı transfer hizmetleri sunarak, misafirlerimizin seyahat deneyimini 
                mükemmel kılmak. Her müşterimize özel çözümler üreterek turizm sektörüne değer katmak.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 md:p-8">
              <div className="flex items-center mb-6">
                <Star className="w-6 md:w-8 h-6 md:h-8 text-purple-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Vizyonumuz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Türkiye'nin en güvenilir ve tercih edilen havalimanı transfer hizmeti markası olmak. 
                Teknoloji ve hizmet kalitesini mükemmel şekilde harmanlayarak, uluslararası 
                standartlarda hizmet veren öncü şirket konumuna ulaşmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sertifikalar */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Yasal Belgelerimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tüm yasal izinlere sahip olarak güvenle hizmet veriyoruz
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <IconComponent className={`w-10 md:w-12 h-10 md:h-12 ${cert.color} mx-auto mb-4`} />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                    {cert.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {cert.issuer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Temel Değerlerimiz
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 md:w-8 h-6 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Güvenilirlik</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Verdiğimiz sözü tutmak ve müşterilerimizin güvenini kazanmak en temel prensiplerimizdendir.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Müşteri Odaklılık</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Her müşterimizin ihtiyaçlarını anlayarak özel çözümler üretir, memnuniyetlerini sağlarız.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Hizmet Kalitesi</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Sürekli gelişim ilkesiyle hizmet kalitemizi artırarak en yüksek standartları hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </div>
  );
};

export default AboutPage;
