import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import BlogLayout from '../../components/Layout/BlogLayout';
import { blogData, blogCategories } from '../../data/blogData';

const BlogCategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kategoriyi bul
    const foundCategory = blogCategories.find(cat => cat.slug === categorySlug);
    setCategory(foundCategory);
    setLoading(false);
  }, [categorySlug]);

  // Kategoriye göre blog yazılarını filtrele
  const categoryBlogs = useMemo(() => {
    if (!category) return [];
    
    return blogData
      .filter(blog => blog.category === category.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [category]);

  if (loading) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto py-12">
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
      </BlogLayout>
    );
  }

  if (!category) {
    return <Navigate to="/blog" replace />;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const seoData = {
    title: `${category.name} | GATE Transfer Blog`,
    description: `${category.description}. ${category.name} kategorisindeki tüm blog yazıları.`,
    keywords: `${category.name.toLowerCase()}, antalya transfer blog, ${category.name.toLowerCase()} rehberi`
  };

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
        {/* Meta bilgiler */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span className="flex items-center mr-4">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {blog.readTime}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(blog.date)}
          </span>
        </div>

        {/* Başlık */}
        <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h2>

        {/* Özet */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Etiketler */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-blue-100 cursor-pointer transition-colors"
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
      heroTitle={category.name}
      heroSubtitle={`${category.description} - ${categoryBlogs.length} yazı bulundu`}
    >
      <div className="max-w-6xl mx-auto">
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

        {/* Kategori Header */}
        <header className="mb-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-6">
              {category.description}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {categoryBlogs.length} yazı
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Ortalama {Math.ceil(categoryBlogs.reduce((acc, blog) => acc + parseInt(blog.readTime), 0) / categoryBlogs.length)} dakika okuma
              </span>
            </div>
          </div>
        </header>

        {/* Diğer Kategoriler */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📂 Diğer Kategoriler</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/blog"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors"
            >
              Tüm Yazılar ({blogData.length})
            </Link>
            {blogCategories
              .filter(cat => cat.id !== category.id)
              .map(cat => (
                <Link
                  key={cat.id}
                  to={`/blog/kategori/${cat.slug}`}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {cat.name} ({cat.count})
                </Link>
              ))
            }
          </div>
        </div>

        {/* Öne Çıkan Yazı */}
        {categoryBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📌 Öne Çıkan {category.name} Yazısı</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={categoryBlogs[0].image} 
                    alt={categoryBlogs[0].title}
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-blog.jpg';
                    }}
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                      {categoryBlogs[0].categoryName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {categoryBlogs[0].readTime} • {formatDate(categoryBlogs[0].date)}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    <Link to={`/blog/${categoryBlogs[0].slug}`} className="hover:text-blue-600 transition-colors">
                      {categoryBlogs[0].title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {categoryBlogs[0].excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categoryBlogs[0].tags.slice(0, 4).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/blog/${categoryBlogs[0].slug}`}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Yazıyı Oku
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kategori Yazıları */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📚 Tüm {category.name} Yazıları
          </h2>
          
          {categoryBlogs.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryBlogs.slice(1).map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : categoryBlogs.length === 1 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Bu kategoride bir yazı mevcut
              </h3>
              <p className="text-gray-600">
                Yukarıdaki öne çıkan yazıyı okuyabilir veya diğer kategorilere göz atabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Bu kategoride henüz yazı bulunmuyor
              </h3>
              <p className="text-gray-600 mb-6">
                Yakında bu kategori için yeni yazılar yayınlanacak.
              </p>
              <Link 
                to="/blog"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tüm Yazılara Dön
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🚗 Transfer Hizmeti Almak İstiyor musunuz?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            {category.name} yazılarımızda bahsettiğimiz destinasyonlara güvenli ve konforlu transfer hizmeti için hemen rezervasyon yapabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/rezervasyon"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Rezervasyon Yap
            </Link>
            <a 
              href="tel:+902425020202"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              Hemen Ara
            </a>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogCategoryPage;
