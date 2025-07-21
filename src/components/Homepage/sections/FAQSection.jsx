import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
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
              
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Alt bilgi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-blue-50 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Sorunuz yoksa bizimle iletişime geçin
          </h3>
          <p className="text-gray-600 mb-6">
            Transfer hizmetimiz hakkında daha fazla bilgi almak için müşteri hizmetlerimiz ile konuşabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+905551234567"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              📞 +90 555 123 4567
            </a>
            <a
              href="mailto:info@antalyatransfer.com"
              className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-3 rounded-lg font-semibold border border-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              ✉️ info@antalyatransfer.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
