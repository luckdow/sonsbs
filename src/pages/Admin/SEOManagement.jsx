import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEOToolsPanel from '../../components/SEO/SEOToolsPanel';

const SEOManagement = () => {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>SEO Yönetimi - Gate Transfer Admin</title>
        <meta name="description" content="XML Sitemap, Schema Markup ve SEO araçları yönetimi" />
      </Helmet>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔍 SEO Yönetimi
          </h1>
          <p className="text-gray-600">
            XML Sitemap, Schema Markup ve diğer SEO araçlarını yönetin
          </p>
        </div>

        <SEOToolsPanel />
      </div>
    </div>
  );
};

export default SEOManagement;
