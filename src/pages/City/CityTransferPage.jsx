import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { 
  SEOHead, 
  StructuredData, 
  generateCityMetaTags, 
  generateCityTransferSchema,
  generateFAQSchema 
} from '../../seo/index.js';

// Diğer bileşenler ve içerikler

const CityTransferPage = () => {
  const { cityName } = useParams(); // URL parametresinden şehir adını al
  const [cityData, setCityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Şehir verilerini getir (gerçek uygulamada API'den veya context'ten çekilebilir)
    const fetchCityData = async () => {
      try {
        // Örnek veri
        const data = {
          name: cityName.replace('-transfer', '').replace('-', ' '),
          title: `${cityName.replace('-transfer', '').replace('-', ' ')} Transfer | En İyi Fiyat Garantisi`,
          description: `Antalya Havalimanı'ndan ${cityName.replace('-transfer', '').replace('-', ' ')} bölgesine güvenli, konforlu ve ekonomik transfer hizmeti. TURSAB lisanslı firma, 7/24 destek ve ücretsiz iptal.`,
          image: `/images/${cityName}.jpg`,
          distance: '45 km',
          duration: '35 dakika',
          price: '€30',
        };
        
        setCityData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Şehir verisi yüklenemedi:', error);
        setIsLoading(false);
      }
    };
    
    fetchCityData();
  }, [cityName]);
  
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  
  // FAQ verisi örneği - Schema.org için kullanılacak
  const faqData = {
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `Antalya Havalimanı'ndan ${cityData.name}'a transfer ne kadar sürer?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Antalya Havalimanı'ndan ${cityData.name}'a transfer yaklaşık ${cityData.duration} sürer.`
        }
      },
      {
        '@type': 'Question',
        'name': `${cityData.name} transfer fiyatı nedir?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${cityData.name} transfer fiyatı ${cityData.price}'dan başlar. Araç tipi ve yolcu sayısına göre değişiklik gösterebilir.`
        }
      }
    ]
  };

  // SEO Meta Tags
  const cityMetaTags = generateCityMetaTags(cityName, {
    distance: cityData.distance,
    duration: cityData.duration,
    price: cityData.price,
    description: cityData.description,
    image: cityData.image
  });

  // City Transfer Schema
  const cityTransferSchema = generateCityTransferSchema(
    cityData.name,
    cityData.distance,
    cityData.duration,
    cityData.price
  );

  // FAQ Schema
  const faqItems = [
    {
      question: `Antalya Havalimanı'ndan ${cityData.name}'a transfer ne kadar sürer?`,
      answer: `Antalya Havalimanı'ndan ${cityData.name} bölgesine transfer süresi yaklaşık ${cityData.duration}dır. Trafik durumuna göre bu süre değişebilir.`
    },
    {
      question: `${cityData.name} transfer fiyatı ne kadar?`,
      answer: `${cityData.name} transfer fiyatımız ${cityData.price} başlangıç fiyatı ile hizmet vermekteyiz. Araç tipine ve rezervasyon tarihine göre fiyatlar değişebilir.`
    },
    {
      question: `${cityData.name} transfer rezervasyonu nasıl yapılır?`,
      answer: `${cityData.name} transfer rezervasyonu için web sitemizden online rezervasyon yapabilir veya +90 532 574 26 82 numaralı telefondan bizimle iletişime geçebilirsiniz.`
    }
  ];
  const faqSchema = generateFAQSchema(faqItems);
  
  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHead 
        pageData={{
          titleData: cityData.name,
          descriptionData: cityData.name,
          keywordsData: cityData.name.toLowerCase(),
          url: `/${cityName}`,
          image: cityData.image,
          pageType: 'city',
          description: cityData.description
        }}
        includeHrefLang={true}
      />
      
      {/* Schema.org Structured Data */}
      <StructuredData schema={cityTransferSchema} id="city-transfer-schema" />
      <StructuredData schema={faqSchema} id="faq-schema" />
      
      <Layout>
        {/* Sayfa içeriği buraya gelecek */}
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">{cityData.name} Transfer Hizmetleri</h1>
          
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-2">Hızlı Bilgiler</h2>
              <ul className="space-y-2">
                <li><strong>Mesafe:</strong> {cityData.distance}</li>
                <li><strong>Süre:</strong> {cityData.duration}</li>
                <li><strong>Başlangıç Fiyatı:</strong> {cityData.price}</li>
              </ul>
            </div>
            
            <div className="prose max-w-none">
              <p>
                Antalya Havalimanı'ndan {cityData.name}'a transfer hizmetimiz, sizi havaalanından doğrudan otel veya konutunuza 
                güvenli ve konforlu bir şekilde ulaştırır. Tüm transferlerimiz, TURSAB belgeli araçlar ve profesyonel şoförler ile gerçekleştirilir.
              </p>
              
              <h2>Neden Bizi Tercih Etmelisiniz?</h2>
              <ul>
                <li>Sabit fiyat garantisi - gizli ücret yok</li>
                <li>7/24 Türkçe ve İngilizce müşteri desteği</li>
                <li>Uçuş takibi - uçuşunuz gecikse bile ücretsiz bekleme</li>
                <li>Temiz ve bakımlı araçlar</li>
                <li>Profesyonel ve deneyimli şoförler</li>
                <li>Ücretsiz iptal (48 saat öncesine kadar)</li>
              </ul>
              
              {/* Diğer içerik kısımları... */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CityTransferPage;
