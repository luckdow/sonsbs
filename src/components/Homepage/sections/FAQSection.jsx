import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "Havalimanından transfer rezervasyonu nasıl yapabilirim?",
      answer: "Online formumuz üzerinden kolayca rezervasyon yapabilirsiniz. Uçuş bilgilerinizi, varış yerinizi ve kişi sayınızı belirterek anında fiyat alabilir ve rezervasyonunuzu tamamlayabilirsiniz."
    },
    {
      question: "Transfer ücretleri neleri kapsar?",
      answer: "Transfer ücretlerimiz araç kirası, şoför ücreti, yakıt ve tüm vergileri kapsar. Gizli ücret yoktur. Sadece ek hizmetler (çocuk koltuğu, VIP araç vb.) için ayrı ücret alınır."
    },
    {
      question: "Uçağım geç kalırsa ne olur?",
      answer: "Uçuş takip sistemimiz sayesinde uçağınızın durumunu anlık olarak takip ediyoruz. Uçağınız geç kalsa bile şoförünüz sizi bekler, ek ücret alınmaz."
    },
    {
      question: "Kaç kişilik araçlarınız var?",
      answer: "1-3 kişi için sedan araçlar, 4-8 kişi için minivan ve VIP araçlarımız bulunmaktadır. Bagaj durumunuza göre en uygun aracı öneriyoruz."
    },
    {
      question: "Rezervasyonu iptal edebilir miyim?",
      answer: "Transfer saatinden 24 saat öncesine kadar ücretsiz iptal edebilirsiniz. 24 saatten sonraki iptallerde %50 ücret alınır."
    },
    {
      question: "Ödeme nasıl yapabilirim?",
      answer: "Online kredi kartı ile ön ödeme yapabilir veya araçta nakit/kredi kartı ile ödeyebilirsiniz. Online ödemede %10 indirim avantajı vardır."
    },
    {
      question: "Çocuk koltuğu var mı?",
      answer: "Evet, farklı yaş grupları için bebek koltuğu, çocuk koltuğu ve yükseltici koltuk hizmetimiz bulunmaktadır. Rezervasyon sırasında belirtmeniz yeterlidir."
    },
    {
      question: "24 saat hizmet veriyor musunuz?",
      answer: "Evet, haftanın 7 günü 24 saat transfer hizmeti veriyoruz. Gece uçuşları için de rezervasyon yapabilirsiniz."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16 animate-fade-in"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Sıkça Sorulan Sorular
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transfer hizmetimiz hakkında merak ettiğiniz her şey
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-6 text-left transition-all duration-300 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>
              
              {openFAQ === index && (
                <div className="overflow-hidden">
                  <div className="p-6 pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
