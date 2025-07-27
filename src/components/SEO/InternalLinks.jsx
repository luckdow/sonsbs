import React from 'react';
import { Link } from 'react-router-dom';

// Internal linking component for SEO
const InternalLinks = ({ currentPage, type = 'related' }) => {
  
  // Define link relationships for different page types
  const linkRelationships = {
    // City pages
    'antalya-transfer': {
      related: [
        { url: '/lara-transfer', text: 'Lara Transfer', desc: 'Antalya Lara plajlarına özel transfer' },
        { url: '/kemer-transfer', text: 'Kemer Transfer', desc: 'Antalya-Kemer arası transfer hizmeti' },
        { url: '/havaalani-transfer', text: 'Havalimanı Transfer', desc: 'AYT havalimanı transfer hizmetleri' }
      ],
      services: [
        { url: '/vip-transfer', text: 'VIP Transfer', desc: 'Lüks araçlarla premium transfer' },
        { url: '/grup-transfer', text: 'Grup Transfer', desc: 'Büyük gruplar için özel çözümler' }
      ]
    },
    
    'belek-transfer': {
      related: [
        { url: '/serik-transfer', text: 'Serik Transfer', desc: 'Belek-Serik arası ulaşım' },
        { url: '/side-transfer', text: 'Side Transfer', desc: 'Belek-Side arası transfer' },
        { url: '/havaalani-transfer', text: 'Havalimanı Transfer', desc: 'Golf otelleri özel transfer' }
      ],
      services: [
        { url: '/otel-transfer', text: 'Otel Transfer', desc: 'Golf resort otelleri transfer' },
        { url: '/kurumsal-transfer', text: 'Kurumsal Transfer', desc: 'Golf turnuvaları özel transfer' }
      ]
    },
    
    'kemer-transfer': {
      related: [
        { url: '/antalya-transfer', text: 'Antalya Transfer', desc: 'Kemer-Antalya merkez transfer' },
        { url: '/kas-transfer', text: 'Kaş Transfer', desc: 'Kemer-Kaş arası ulaşım' },
        { url: '/kalkan-transfer', text: 'Kalkan Transfer', desc: 'Kemer-Kalkan transfer hizmeti' }
      ],
      services: [
        { url: '/dugun-transfer', text: 'Düğün Transfer', desc: 'Marina düğün organizasyonları' },
        { url: '/vip-transfer', text: 'VIP Transfer', desc: 'Toros Dağları manzara turu' }
      ]
    },
    
    'side-transfer': {
      related: [
        { url: '/manavgat-transfer', text: 'Manavgat Transfer', desc: 'Side-Manavgat arası transfer' },
        { url: '/belek-transfer', text: 'Belek Transfer', desc: 'Side-Belek golf bölgesi' },
        { url: '/serik-transfer', text: 'Serik Transfer', desc: 'Side-Serik merkez ulaşım' }
      ],
      services: [
        { url: '/otel-transfer', text: 'Otel Transfer', desc: 'Antik kent otelleri transfer' },
        { url: '/karsilama-hizmeti', text: 'Karşılama Hizmeti', desc: 'Tarihi tur rehberli transfer' }
      ]
    },
    
    'alanya-transfer': {
      related: [
        { url: '/side-transfer', text: 'Side Transfer', desc: 'Alanya-Side antik kentler turu' },
        { url: '/manavgat-transfer', text: 'Manavgat Transfer', desc: 'Alanya-Manavgat şelalesi' },
        { url: '/antalya-transfer', text: 'Antalya Transfer', desc: 'Alanya-Antalya merkez' }
      ],
      services: [
        { url: '/sehir-ici-transfer', text: 'Şehir İçi Transfer', desc: 'Alanya kale ve sahil turu' },
        { url: '/grup-transfer', text: 'Grup Transfer', desc: 'Aile ve arkadaş grupları' }
      ]
    },
    
    // Service pages
    'havaalani-transfer': {
      related: [
        { url: '/antalya-transfer', text: 'Antalya Transfer', desc: 'AYT-Antalya merkez' },
        { url: '/lara-transfer', text: 'Lara Transfer', desc: 'AYT-Lara otelleri' },
        { url: '/belek-transfer', text: 'Belek Transfer', desc: 'AYT-Belek golf otelleri' }
      ],
      services: [
        { url: '/vip-transfer', text: 'VIP Transfer', desc: 'Havalimanı VIP transfer' },
        { url: '/karsilama-hizmeti', text: 'Karşılama Hizmeti', desc: 'Meet & Greet hizmeti' }
      ]
    },
    
    'vip-transfer': {
      related: [
        { url: '/havaalani-transfer', text: 'Havalimanı Transfer', desc: 'Premium havalimanı transferi' },
        { url: '/dugun-transfer', text: 'Düğün Transfer', desc: 'Özel gün lüks ulaşım' },
        { url: '/kurumsal-transfer', text: 'Kurumsal Transfer', desc: 'Executive transfer hizmeti' }
      ],
      services: [
        { url: '/karsilama-hizmeti', text: 'Karşılama Hizmeti', desc: 'VIP karşılama protokolü' },
        { url: '/otel-transfer', text: 'Otel Transfer', desc: 'Lüks otel transferleri' }
      ]
    }
  };

  // Get links for current page
  const currentLinks = linkRelationships[currentPage];
  if (!currentLinks) return null;

  const linksToShow = type === 'services' ? currentLinks.services : currentLinks.related;
  if (!linksToShow || linksToShow.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {type === 'services' ? 'İlgili Hizmetlerimiz' : 'İlgili Transfer Güzergahları'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {linksToShow.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
          >
            <h4 className="font-medium text-blue-600 hover:text-blue-800 mb-2">
              {link.text}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {link.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Breadcrumb component for better navigation
export const Breadcrumb = ({ items }) => {
  if (!items || items.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {item.url ? (
            <Link 
              to={item.url} 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {item.text}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.text}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Related blog posts component
export const RelatedPosts = ({ currentSlug, category }) => {
  // This would typically fetch related posts from blogData
  // For now, return a placeholder
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        İlgili Blog Yazıları
      </h3>
      <div className="space-y-4">
        {/* Placeholder for related blog posts */}
        <div className="text-gray-600 text-sm">
          İlgili blog yazıları yüklenecek...
        </div>
      </div>
    </div>
  );
};

export default InternalLinks;
