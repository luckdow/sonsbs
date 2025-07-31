import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { advancedSeoKeywords, pageKeywordMapping } from '../../data/advancedSeoKeywords';
import { generateAdvancedSitemap, analyzePage } from '../../utils/advancedSitemapGenerator';

const SEOAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [seoData, setSeoData] = useState({
    totalPages: 0,
    indexedPages: 0,
    keywordRankings: [],
    technicalIssues: [],
    recommendations: [],
    lastUpdated: new Date().toISOString()
  });

  const [sitemapStatus, setSitemapStatus] = useState({
    generated: false,
    lastGenerated: null,
    pageCount: 0
  });

  const [keywordAnalysis, setKeywordAnalysis] = useState({
    primaryKeywords: [],
    opportunities: [],
    competitors: []
  });

  useEffect(() => {
    loadSEOData();
    checkSitemapStatus();
    analyzeKeywords();
  }, []);

  const loadSEOData = async () => {
    // Simulate loading SEO data
    setSeoData({
      totalPages: 35,
      indexedPages: 32,
      keywordRankings: [
        { keyword: 'antalya transfer', position: 3, volume: 12000, change: '+2' },
        { keyword: 'antalya havalimanı transfer', position: 5, volume: 8500, change: '+1' },
        { keyword: 'kemer transfer', position: 7, volume: 4200, change: '0' },
        { keyword: 'side transfer', position: 4, volume: 3800, change: '+3' },
        { keyword: 'belek transfer', position: 6, volume: 2900, change: '-1' }
      ],
      technicalIssues: [
        { type: 'missing-meta', count: 2, severity: 'medium' },
        { type: 'duplicate-content', count: 1, severity: 'high' },
        { type: 'slow-loading', count: 3, severity: 'medium' }
      ],
      recommendations: [
        {
          title: 'Meta Description Optimizasyonu',
          description: '2 sayfada meta description eksik',
          priority: 'high',
          action: 'Meta description ekleyin'
        },
        {
          title: 'İç Bağlantı Stratejisi',
          description: 'Şehir sayfaları arasında daha fazla bağlantı ekleyin',
          priority: 'medium',
          action: 'İlgili sayfalara link verin'
        }
      ],
      lastUpdated: new Date().toISOString()
    });
  };

  const checkSitemapStatus = () => {
    setSitemapStatus({
      generated: true,
      lastGenerated: new Date().toISOString(),
      pageCount: 35
    });
  };

  const analyzeKeywords = () => {
    setKeywordAnalysis({
      primaryKeywords: advancedSeoKeywords.primary.tr.slice(0, 10),
      opportunities: advancedSeoKeywords.longTail.tr.slice(0, 8),
      competitors: [
        { keyword: 'antalya transfer', competitor: 'competitor1.com', position: 1 },
        { keyword: 'havalimanı transfer', competitor: 'competitor2.com', position: 2 }
      ]
    });
  };

  const generateNewSitemap = async () => {
    try {
      const sitemap = generateAdvancedSitemap();
      
      // Here you would typically send this to your server to save
      console.log('Generated sitemap:', sitemap);
      
      setSitemapStatus({
        generated: true,
        lastGenerated: new Date().toISOString(),
        pageCount: 35
      });

      alert('Sitemap başarıyla güncellendi!');
    } catch (error) {
      console.error('Sitemap generation error:', error);
      alert('Sitemap oluşturulurken hata oluştu.');
    }
  };

  const exportSEOReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      overview: seoData,
      keywords: keywordAnalysis,
      sitemap: sitemapStatus
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) return '📈';
    if (change.startsWith('-')) return '📉';
    return '➡️';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Yönetim Paneli</h1>
          <p className="text-gray-600">GATE Transfer SEO performansı ve optimizasyon araçları</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{seoData.totalPages}</div>
              <div className="text-sm text-gray-600">Toplam Sayfa</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{seoData.indexedPages}</div>
              <div className="text-sm text-gray-600">İndeksli Sayfa</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">{seoData.keywordRankings.length}</div>
              <div className="text-sm text-gray-600">İzlenen Anahtar Kelime</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{seoData.technicalIssues.length}</div>
              <div className="text-sm text-gray-600">Teknik Sorun</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1">
          {['overview', 'keywords', 'technical', 'sitemap', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab === 'overview' && 'Genel Bakış'}
              {tab === 'keywords' && 'Anahtar Kelimeler'}
              {tab === 'technical' && 'Teknik SEO'}
              {tab === 'sitemap' && 'Sitemap Yönetimi'}
              {tab === 'reports' && 'Raporlar'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keyword Rankings */}
            <Card>
              <CardHeader>
                <CardTitle>Anahtar Kelime Sıralamaları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoData.keywordRankings.map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="text-sm text-gray-600">{keyword.volume.toLocaleString()} aylık arama</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">#{keyword.position}</div>
                        <div className="text-sm">
                          {getChangeIcon(keyword.change)} {keyword.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Öneriler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoData.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
                      <p className="text-xs text-blue-600">→ {rec.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-6">
            {/* Primary Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Ana Anahtar Kelimeler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {keywordAnalysis.primaryKeywords.map((keyword, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="font-medium mb-2">{keyword.keyword}</div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{keyword.volume?.toLocaleString()}</span> aylık arama
                      </div>
                      <div className="text-sm text-gray-600">
                        Zorluk: <span className="font-medium">{keyword.difficulty}/100</span>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          keyword.intent === 'commercial' ? 'bg-green-100 text-green-800' :
                          keyword.intent === 'transactional' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {keyword.intent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Fırsat Anahtar Kelimeleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Anahtar Kelime</th>
                        <th className="text-left py-2">Aylık Arama</th>
                        <th className="text-left py-2">Zorluk</th>
                        <th className="text-left py-2">Amaç</th>
                        <th className="text-left py-2">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordAnalysis.opportunities.map((keyword, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{keyword.keyword}</td>
                          <td className="py-2">{keyword.volume?.toLocaleString()}</td>
                          <td className="py-2">{keyword.difficulty}/100</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              keyword.intent === 'transactional' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {keyword.intent}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                              Hedeflenebilir
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'technical' && (
          <Card>
            <CardHeader>
              <CardTitle>Teknik SEO Sorunları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoData.technicalIssues.map((issue, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {issue.type === 'missing-meta' && 'Eksik Meta Bilgileri'}
                        {issue.type === 'duplicate-content' && 'Duplicate İçerik'}
                        {issue.type === 'slow-loading' && 'Yavaş Yüklenen Sayfalar'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {issue.count} sayfa etkileniyor
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.severity === 'high' ? 'Yüksek' :
                         issue.severity === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'sitemap' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {sitemapStatus.generated ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-gray-600">Sitemap Durumu</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{sitemapStatus.pageCount}</div>
                    <div className="text-sm text-gray-600">Sayfa Sayısı</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {sitemapStatus.lastGenerated && 
                        new Date(sitemapStatus.lastGenerated).toLocaleString('tr-TR')
                      }
                    </div>
                    <div className="text-sm text-gray-600">Son Güncelleme</div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={generateNewSitemap} 
                    className="bg-blue-600 hover:bg-blue-700"
                    aria-label="Sitemap dosyasını güncelle"
                  >
                    🔄 Sitemap Güncelle
                  </Button>
                  <Button 
                    onClick={() => window.open('/sitemap.xml', '_blank')}
                    variant="outline"
                    aria-label="Sitemap dosyasını yeni sekmede görüntüle"
                  >
                    👁️ Sitemap Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Raporları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Kapsamlı SEO Raporu</div>
                    <div className="text-sm text-gray-600">
                      Tüm SEO metrikleri ve önerileri içeren detaylı rapor
                    </div>
                  </div>
                  <Button 
                    onClick={exportSEOReport} 
                    className="bg-green-600 hover:bg-green-700"
                    aria-label="SEO performans raporunu JSON formatında indir"
                  >
                    📊 Rapor İndir
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Son güncelleme: {new Date(seoData.lastUpdated).toLocaleString('tr-TR')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SEOAdminPanel;
