import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UnifiedSEO from '../../components/SEO/UnifiedSEO';
import Layout from '../../components/Layout/Layout';

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
  
  return (
    <>
      <UnifiedSEO 
        title={cityData.title}
        description={cityData.description}
        keywords={`${cityData.name} transfer, antalya ${cityData.name} transfer, ${cityData.name} havaalanı transfer, ${cityData.name} havalimanı ulaşım`}
        pageType="city"
        location={cityData.name}
        ogImage={cityData.image}
        ogImageAlt={`${cityData.name} Transfer Hizmeti`}
        schemaData={faqData}
        hasSchema={true}
        language="tr"
        alternateLanguages={['tr', 'en']} // Bu şehir sayfasının hangi dillerde mevcut olduğunu belirtir
      />
      
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
