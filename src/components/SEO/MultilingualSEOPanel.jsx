import React, { useState, useEffect } from 'react';
import { 
  multilingualKeywords, 
  multilingualSeoTemplates,
  generateMultilingualKeywords,
  hreflangMapping 
} from '../../data/multilingualSeoKeywords';
import { 
  generateMultilingualSitemap, 
  generateLanguageSpecificSitemap,
  generateImageSitemap 
} from '../../utils/multilingualSitemapGenerator';

const MultilingualSEOPanel = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [selectedPageType, setSelectedPageType] = useState('city');
  const [selectedLocation, setSelectedLocation] = useState('antalya');
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [sitemapPreview, setSitemapPreview] = useState('');
  const [keywordAnalysis, setKeywordAnalysis] = useState({});

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const pageTypes = [
    { value: 'city', label: 'Şehir Sayfaları' },
    { value: 'service', label: 'Hizmet Sayfaları' },
    { value: 'blog', label: 'Blog Sayfaları' },
    { value: 'home', label: 'Ana Sayfa' }
  ];

  // Get available locations based on page type
  const getAvailableLocations = () => {
    if (selectedPageType === 'city') {
      return Object.keys(multilingualKeywords[selectedLanguage]?.cities || {});
    }
    if (selectedPageType === 'service') {
      return Object.keys(multilingualKeywords[selectedLanguage]?.services || {});
    }
    return ['home'];
  };

  // Analyze keywords for current selection
  const analyzeKeywords = () => {
    const keywords = generateMultilingualKeywords(selectedLanguage, selectedPageType, selectedLocation);
    if (!keywords) return null;

    const keywordArray = keywords.split(', ');
    const analysis = {
      totalKeywords: keywordArray.length,
      avgLength: Math.round(keywordArray.reduce((sum, kw) => sum + kw.length, 0) / keywordArray.length),
      longTailCount: keywordArray.filter(kw => kw.split(' ').length > 3).length,
      shortTailCount: keywordArray.filter(kw => kw.split(' ').length <= 2).length,
      mediumTailCount: keywordArray.filter(kw => kw.split(' ').length === 3).length
    };

    return analysis;
  };

  // Generate SEO preview
  const generateSeoPreview = () => {
    const templates = multilingualSeoTemplates[selectedLanguage];
    if (!templates) return null;

    let title, description;
    
    if (selectedPageType === 'city') {
      title = templates.cityPageTitle(selectedLocation);
      description = templates.cityPageDescription(selectedLocation);
    } else if (selectedPageType === 'service') {
      title = templates.servicePageTitle(selectedLocation);
      description = templates.servicePageDescription(selectedLocation);
    } else {
      title = 'GATE Transfer';
      description = 'Professional transfer services';
    }

    return { title, description };
  };

  // Generate sitemap preview
  const handleSitemapPreview = (type) => {
    let preview = '';
    
    switch(type) {
      case 'multilingual':
        preview = generateMultilingualSitemap();
        break;
      case 'language':
        preview = generateLanguageSpecificSitemap(selectedLanguage);
        break;
      case 'images':
        preview = generateImageSitemap();
        break;
      default:
        preview = generateMultilingualSitemap();
    }
    
    setSitemapPreview(preview);
  };

  // Check SEO completeness
  const checkSeoCompleteness = () => {
    const langData = multilingualKeywords[selectedLanguage];
    if (!langData) return { score: 0, issues: ['Language data not found'] };

    let score = 0;
    const issues = [];

    // Check if cities are defined
    if (langData.cities && Object.keys(langData.cities).length > 0) {
      score += 30;
    } else {
      issues.push(`${selectedLanguage.toUpperCase()} dilinde şehir verileri eksik`);
    }

    // Check if services are defined
    if (langData.services && Object.keys(langData.services).length > 0) {
      score += 30;
    } else {
      issues.push(`${selectedLanguage.toUpperCase()} dilinde hizmet verileri eksik`);
    }

    // Check if templates exist
    if (multilingualSeoTemplates[selectedLanguage]) {
      score += 40;
    } else {
      issues.push(`${selectedLanguage.toUpperCase()} dilinde SEO şablonları eksik`);
    }

    return { score, issues };
  };

  useEffect(() => {
    const analysis = analyzeKeywords();
    const seoPreview = generateSeoPreview();
    const completeness = checkSeoCompleteness();
    
    setSeoAnalysis({
      keywords: analysis,
      preview: seoPreview,
      completeness
    });
  }, [selectedLanguage, selectedPageType, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌍 Çoklu Dil SEO Yönetim Paneli
          </h1>
          <p className="text-gray-600">
            Almanca, Rusça, İngilizce ve Arapça dahil olmak üzere çoklu dil SEO optimizasyonu
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🗣️ Dil Seçimi</h2>
          <div className="grid grid-cols-5 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="font-medium">{lang.name}</div>
                <div className="text-sm text-gray-500">{lang.code.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Page Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">⚙️ Sayfa Konfigürasyonu</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayfa Tipi
              </label>
              <select
                value={selectedPageType}
                onChange={(e) => setSelectedPageType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pageTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasyon/Hizmet
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getAvailableLocations().map((location) => (
                  <option key={location} value={location}>
                    {location.charAt(0).toUpperCase() + location.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SEO Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📊 SEO Analizi</h2>
            
            {seoAnalysis && (
              <>
                {/* Completeness Score */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">SEO Tamamlanma Oranı</span>
                    <span className="text-sm font-medium">{seoAnalysis.completeness.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        seoAnalysis.completeness.score >= 80 ? 'bg-green-500' :
                        seoAnalysis.completeness.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${seoAnalysis.completeness.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Issues */}
                {seoAnalysis.completeness.issues.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-red-600 mb-2">Tespit Edilen Sorunlar:</h3>
                    <ul className="text-sm text-red-600">
                      {seoAnalysis.completeness.issues.map((issue, index) => (
                        <li key={index} className="mb-1">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyword Analysis */}
                {seoAnalysis.keywords && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Anahtar Kelime Analizi</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-medium text-blue-700">Toplam Kelime</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {seoAnalysis.keywords.totalKeywords}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <div className="font-medium text-green-700">Long-tail</div>
                        <div className="text-2xl font-bold text-green-600">
                          {seoAnalysis.keywords.longTailCount}
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded">
                        <div className="font-medium text-yellow-700">Orta Uzunluk</div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {seoAnalysis.keywords.mediumTailCount}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="font-medium text-purple-700">Kısa Kelime</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {seoAnalysis.keywords.shortTailCount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Preview */}
                {seoAnalysis.preview && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Google SERP Önizlemesi</h3>
                    <div className="text-blue-600 text-lg font-medium mb-1 hover:underline cursor-pointer">
                      {seoAnalysis.preview.title}
                    </div>
                    <div className="text-green-600 text-sm mb-2">
                      https://gatetransfer.com/{selectedLocation}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {seoAnalysis.preview.description}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sitemap Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">🗺️ Sitemap Yönetimi</h2>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleSitemapPreview('multilingual')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Çoklu Dil Sitemap Oluştur
              </button>
              
              <button
                onClick={() => handleSitemapPreview('language')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                {selectedLanguage.toUpperCase()} Dil Sitemap Oluştur
              </button>
              
              <button
                onClick={() => handleSitemapPreview('images')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Görsel Sitemap Oluştur
              </button>
            </div>

            {/* Sitemap Preview */}
            {sitemapPreview && (
              <div>
                <h3 className="font-medium mb-2">Sitemap Önizlemesi:</h3>
                <textarea
                  value={sitemapPreview}
                  readOnly
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg text-xs font-mono resize-none"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Toplam karakter: {sitemapPreview.length}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">📈 Dil İstatistikleri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {languages.map((lang) => {
              const langData = multilingualKeywords[lang.code];
              const cityCount = langData?.cities ? Object.keys(langData.cities).length : 0;
              const serviceCount = langData?.services ? Object.keys(langData.services).length : 0;
              const hasTemplates = !!multilingualSeoTemplates[lang.code];
              
              return (
                <div key={lang.code} className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="font-medium mb-2">{lang.name}</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Şehir: {cityCount}</div>
                    <div>Hizmet: {serviceCount}</div>
                    <div>Şablon: {hasTemplates ? '✅' : '❌'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MultilingualSEOPanel;
