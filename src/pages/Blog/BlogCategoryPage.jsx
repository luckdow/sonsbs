import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogLayout from '../../components/Layout/BlogLayout';
import { blogData, blogCategories } from '../../data/blogData';

const BlogCategoryPage = () => {
  const { category: categorySlug } = useParams();
  const [loading, setLoading] = useState(true);

  // Kategori bilgilerini bul
  const category = useMemo(() => {
    return blogCategories.find(cat => cat.id === categorySlug);
  }, [categorySlug]);

  // Kategoriye ait blog yazılarını filtrele
  const categoryBlogs = useMemo(() => {
    if (!category) return [];
    
    return blogData
      .filter(blog => blog.category === category.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [category]);

  useEffect(() => {
    // Sayfa yüklendiğinde loading'i kapat
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const seoData = category ? {
    title: `${category.name} | SBS Transfer Blog`,
    description: `${category.description}. ${category.name} kategorisindeki tüm blog yazıları.`,
    keywords: `${category.name.toLowerCase()}, antalya transfer blog, ${category.name.toLowerCase()} rehberi`
  } : {};

  const BlogCard = ({ blog }) => (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/images/placeholder-blog.jpg';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {blog.categoryName}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Başlık */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
          <Link to={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>
        
        {/* Özet */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
        
        {/* Tarih */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {formatDate(blog.date)}
        </div>

        {/* Etiketler */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Yazar ve Devamını Oku */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            👤 {blog.author}
          </span>
          <Link 
            to={`/blog/${blog.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group"
          >
            Devamını Oku
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <BlogLayout 
      seo={seoData}
      heroTitle={category?.name || 'Yükleniyor...'}
      heroSubtitle={loading ? 'İçerik yükleniyor...' : category ? `${category.description} - ${categoryBlogs.length} yazı bulundu` : ''}
    >
      {loading ? (
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-300 h-64 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : !category ? (
        <Navigate to="/blog" replace />
      ) : (
        <div className="max-w-6xl mx-auto">
          <Helmet>
            <title>{seoData.title}</title>
            <meta name="description" content={seoData.description} />
            <meta name="keywords" content={seoData.keywords} />
          </Helmet>

          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-blue-600">Ana Sayfa</Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-600">Blog</Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-800 font-medium">
                {category.name}
              </li>
            </ol>
          </nav>

          {/* Kategori İstatistikleri */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{categoryBlogs.length}</div>
                <div className="text-gray-600 text-sm">Toplam Yazı</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {categoryBlogs.filter(blog => {
                    const blogDate = new Date(blog.date);
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return blogDate > oneMonthAgo;
                  }).length}
                </div>
                <div className="text-gray-600 text-sm">Bu Ay</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {categoryBlogs.reduce((acc, blog) => acc + blog.readTime, 0)}
                </div>
                <div className="text-gray-600 text-sm">Dakika Okuma</div>
              </div>
            </div>
          </div>

          {/* Blog Yazıları */}
          {categoryBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {categoryBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Henüz yazı bulunmuyor
                </h3>
                <p className="text-gray-500 mb-6">
                  {category.name} kategorisinde henüz blog yazısı yayınlanmamış.
                </p>
                <Link 
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Tüm Blog Yazılarını Gör
                </Link>
              </div>
            </div>
          )}

          {/* CTA Bölümü */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">
              Transfer İhtiyacınız mı Var?
            </h3>
            <p className="text-blue-100 mb-6">
              Antalya havalimanından şehir merkezine, otellerinize ve popüler destinasyonlara güvenli transfer hizmeti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/booking"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                </svg>
                Hemen Rezervasyon Yap
              </Link>
              <a 
                href={`https://wa.me/905321234567?text=Merhaba, ${category.name.toLowerCase()} konusunda bilgi almak istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Hemen Ara
              </a>
            </div>
          </div>
        </div>
      )}
    </BlogLayout>
  );
};

export default BlogCategoryPage;
