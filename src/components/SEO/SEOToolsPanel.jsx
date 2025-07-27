import React, { useEffect, useState } from 'react';
import { generateSitemap, generateLocalBusinessSchema, generateServiceSchema } from '../utils/seoUtils';
import { Download, Check, Copy, Globe, Search } from 'lucide-react';

const SEOToolsPanel = () => {
  const [sitemap, setSitemap] = useState('');
  const [copied, setCopied] = useState({});
  const [activeTab, setActiveTab] = useState('sitemap');

  useEffect(() => {
    setSitemap(generateSitemap());
  }, []);

  const handleCopy = async (content, key) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied({ ...copied, [key]: true });
      setTimeout(() => {
        setCopied({ ...copied, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const localBusinessSchema = JSON.stringify(generateLocalBusinessSchema(), null, 2);
  const serviceSchema = JSON.stringify(
    generateServiceSchema(
      'Havalimanı Transfer',
      'Antalya havalimanından otellere güvenli ve konforlu transfer hizmeti',
      'https://gatetransfer.com/havaalani-transfer'
    ), 
    null, 
    2
  );

  const tabs = [
    { id: 'sitemap', label: 'XML Sitemap', icon: Globe },
    { id: 'schema', label: 'Schema Markup', icon: Search },
    { id: 'service', label: 'Service Schema', icon: Check }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🔍 SEO Tools Panel
        </h1>
        <p className="text-gray-600">
          XML Sitemap, Schema Markup ve diğer SEO araçları
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* XML Sitemap Tab */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📄 XML Sitemap
            </h3>
            <p className="text-blue-700 mb-4">
              Tüm sayfalar için otomatik oluşturulan XML sitemap. Arama motorlarının sitenizi daha iyi indekslemesini sağlar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(sitemap, 'sitemap')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied.sitemap ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied.sitemap ? 'Kopyalandı!' : 'Kopyala'}
              </button>
              <button
                onClick={() => handleDownload(sitemap, 'sitemap.xml')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                İndir
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Preview:</h4>
            <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
              {sitemap.substring(0, 500)}...
            </pre>
          </div>
        </div>
      )}

      {/* LocalBusiness Schema Tab */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🏢 LocalBusiness Schema
            </h3>
            <p className="text-green-700 mb-4">
              Google My Business ve yerel arama sonuçları için LocalBusiness schema markup.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(localBusinessSchema, 'business')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {copied.business ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied.business ? 'Kopyalandı!' : 'Kopyala'}
              </button>
              <button
                onClick={() => handleDownload(localBusinessSchema, 'local-business-schema.json')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                İndir
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">JSON-LD Preview:</h4>
            <pre className="text-sm bg-white p-4 rounded border overflow-x-auto max-h-96">
              {localBusinessSchema}
            </pre>
          </div>
        </div>
      )}

      {/* Service Schema Tab */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              🚗 Service Schema
            </h3>
            <p className="text-purple-700 mb-4">
              Hizmet sayfaları için Service schema markup. Google'da zengin sonuçlar (rich snippets) sağlar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(serviceSchema, 'service')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied.service ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied.service ? 'Kopyalandı!' : 'Kopyala'}
              </button>
              <button
                onClick={() => handleDownload(serviceSchema, 'service-schema.json')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                İndir
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">JSON-LD Preview:</h4>
            <pre className="text-sm bg-white p-4 rounded border overflow-x-auto max-h-96">
              {serviceSchema}
            </pre>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">
          📋 Kullanım Talimatları
        </h3>
        <ul className="text-yellow-800 space-y-2">
          <li>• <strong>XML Sitemap:</strong> sitemap.xml dosyasını public klasörüne kaydedin</li>
          <li>• <strong>Schema Markup:</strong> Her sayfa için uygun schema'yı HTML head'e ekleyin</li>
          <li>• <strong>Google Search Console:</strong> Sitemap'i Google'a gönderin</li>
          <li>• <strong>Test:</strong> Google Rich Results Test ile schema'ları test edin</li>
        </ul>
      </div>
    </div>
  );
};

export default SEOToolsPanel;
