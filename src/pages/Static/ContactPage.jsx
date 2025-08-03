import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Globe
} from 'lucide-react';
import StaticPageLayout from './components/StaticPageLayout';
import { 
  SEOHead, 
  StructuredData, 
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateMetaTags 
} from '../../seo/index.js';

const ContactPage = () => {
  // SEO Meta Tags
  const contactMetaTags = generateMetaTags({
    title: 'İletişim | SBS Turkey Transfer - Antalya Havalimanı Transfer İletişim',
    description: 'SBS Turkey Transfer ile iletişime geçin. Antalya havalimanı transfer rezervasyonu için +90 532 574 26 82 arayın. 7/24 canlı destek, ücretsiz danışmanlık ve hızlı rezervasyon.',
    keywords: 'Antalya transfer iletişim, havalimanı transfer telefon, transfer rezervasyon, SBS Turkey Transfer iletişim, Antalya airport transfer contact',
    url: '/iletisim',
    image: '/images/contact-page.jpg',
    type: 'website'
  });

  // Schema.org Structured Data
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://www.gatetransfer.com/' },
    { name: 'İletişim', url: 'https://www.gatetransfer.com/iletisim' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Merkez Adresimiz",
      content: "Güzelyurt Mahallesi Serik Caddesi No: 138/2 Aksu/Antalya",
      link: "https://maps.google.com/?q=Güzelyurt+Mahallesi+Serik+Caddesi+138/2+Aksu+Antalya",
      linkText: "Haritada Görüntüle"
    },
    {
      icon: Phone,
      title: "7/24 İletişim Hattı",
      content: "+90 532 574 26 82",
      link: "tel:+905325742682",
      linkText: "Hemen Ara"
    },
    {
      icon: Mail,
      title: "E-posta Adreslerimiz",
      content: "sbstravelinfo@gmail.com",
      content2: "sbstravelinfo@gmail.com",
      link: "mailto:sbstravelinfo@gmail.com",
      linkText: "E-posta Gönder"
    },
    {
      icon: Globe,
      title: "Web Sitemiz",
      content: "www.gatetransfer.com",
      link: "https://www.gatetransfer.com",
      linkText: "Siteyi Ziyaret Et"
    }
  ];

  const workingHours = [
    { day: "Pazartesi - Cuma", hours: "00:00 - 23:59" },
    { day: "Cumartesi - Pazar", hours: "00:00 - 23:59" },
    { day: "Resmi Tatiller", hours: "00:00 - 23:59" }
  ];

  const services = [
    "Antalya Havalimanı Transfer",
    "Otel Transfer Hizmetleri", 
    "Şehir İçi Transfer",
    "Grup Transfer Hizmetleri",
    "VIP Transfer Hizmetleri",
    "Çocuk Koltuklu Aile Transferi"
  ];

  return (
    <div>
      {/* SEO Head */}
      <SEOHead 
        pageData={{
          title: contactMetaTags.title,
          description: contactMetaTags.description,
          keywords: contactMetaTags.keywords,
          url: '/iletisim',
          image: '/images/contact-page.jpg',
          type: 'website'
        }}
        includeHrefLang={true}
      />
      
      {/* Schema.org Structured Data */}
      <StructuredData schema={organizationSchema} id="organization-schema" />
      <StructuredData schema={breadcrumbSchema} id="breadcrumb-schema" />

      <StaticPageLayout
      title="İletişim | GATE Transfer - Antalya Havalimanı Transfer İletişim Bilgileri"
      description="GATE Transfer ile iletişime geçin. Antalya havalimanı transfer rezervasyonu ve bilgi almak için +90 532 574 26 82 numaramızı arayın veya sbstravelinfo@gmail.com adresine e-posta gönderin."
      keywords="GATE Transfer iletişim, Antalya transfer iletişim, havalimanı transfer telefon, transfer rezervasyon iletişim, Antalya transfer telefon numarası, transfer hizmeti iletişim, GATE Transfer adres, Antalya airport transfer contact"
      canonicalUrl="/iletisim"
      heroTitle="İletişim"
      heroSubtitle="Size nasıl yardımcı olabiliriz? 7/24 hizmetinizdeyiz"
    >
      {/* İletişim Bilgileri */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {info.content}
                  </p>
                  {info.content2 && (
                    <p className="text-gray-600 text-sm mb-2">
                      {info.content2}
                    </p>
                  )}
                  <a
                    href={info.link}
                    target={info.icon === MapPin || info.icon === Globe ? "_blank" : "_self"}
                    rel={info.icon === MapPin || info.icon === Globe ? "noopener noreferrer" : ""}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                  >
                    {info.linkText}
                  </a>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Bize Ulaşın
                </h2>
                <p className="text-gray-600 mb-8">
                  Transfer hizmetlerimiz hakkında soru sormak veya rezervasyon yapmak için 
                  formu doldurun, size en kısa sürede dönüş yapalım.
                </p>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Mesajınız Gönderildi!
                    </h3>
                    <p className="text-gray-600">
                      En kısa sürede size dönüş yapacağız.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Ad Soyad *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="+90 5XX XXX XX XX"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="ornek@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Konu *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Konu seçiniz</option>
                        <option value="reservation">Rezervasyon</option>
                        <option value="information">Bilgi Almak</option>
                        <option value="complaint">Şikayet</option>
                        <option value="suggestion">Öneri</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Mesaj Gönder
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Yan Bilgiler */}
            <div className="space-y-6">
              {/* Çalışma Saatleri */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Çalışma Saatleri
                  </h3>
                </div>
                <div className="space-y-3">
                  {workingHours.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 text-sm">{item.day}</span>
                      <span className="font-semibold text-gray-900 text-sm">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    7/24 kesintisiz hizmet veriyoruz!
                  </p>
                </div>
              </div>

              {/* Hizmetlerimiz */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Hizmetlerimiz
                  </h3>
                </div>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hızlı İletişim */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">
                  Acil Durum İletişim
                </h3>
                <p className="mb-4 text-blue-100 text-sm">
                  Transfer sırasında herhangi bir sorun yaşarsanız 7/24 ulaşabilirsiniz.
                </p>
                <a
                  href="tel:+905325742682"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +90 532 574 26 82
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Harita */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Merkez Ofisimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Güzelyurt Mahallesi'ndeki merkez ofisimize kolayca ulaşabilirsiniz
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Güzelyurt Mahallesi Serik Caddesi No: 138/2<br />
                Aksu / Antalya
              </p>
              <a
                href="https://maps.google.com/?q=Güzelyurt+Mahallesi+Serik+Caddesi+138/2+Aksu+Antalya"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Google Maps'te Aç
              </a>
            </div>
          </div>
        </div>
      </section>
    </StaticPageLayout>
    </div>
  );
};

export default ContactPage;
