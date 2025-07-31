import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BlogLayout from '../../components/Layout/BlogLayout';
import { blogData, blogCategories } from '../../data/blogData';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Blog yazılarını filtrele
  const filteredBlogs = useMemo(() => {
    let filtered = [...blogData];
    
    // Kategori filtreleme
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    
    // Arama filtreleme 
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Tarihe göre sırala (en yeni önce)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedCategory, searchTerm]);

  const BlogCard = ({ blog }) => (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-blog.jpg';
            e.target.onerror = null;
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
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
            {new Date(blog.date).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
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
      heroTitle="GATE Transfer Blog"
      heroSubtitle="Antalya transfer hizmetleri, destinasyon rehberleri ve seyahat ipuçları ile unutulmaz tatil deneyimi için her şey burada!"
    >
      <div className="max-w-7xl mx-auto">
        {/* Arama ve Filtreler */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Arama */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tüm Yazılar ({blogData.length})
              </button>
              
              {blogCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Öne Çıkan Yazı */}
        {filteredBlogs.length > 0 && !searchTerm && selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📌 Öne Çıkan Yazı</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 overflow-hidden">
                  <img 
                    src={filteredBlogs[0].image} 
                    alt={filteredBlogs[0].title}
                    className="w-full h-64 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-blog.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                      {filteredBlogs[0].categoryName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {filteredBlogs[0].readTime} • {new Date(filteredBlogs[0].date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    <Link to={`/blog/${filteredBlogs[0].slug}`} className="hover:text-blue-600 transition-colors">
                      {filteredBlogs[0].title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {filteredBlogs[0].excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {filteredBlogs[0].tags.slice(0, 4).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/blog/${filteredBlogs[0].slug}`}
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

        {/* Sonuç Bilgisi */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredBlogs.length > 0 ? (
              <>
                <strong>{filteredBlogs.length}</strong> yazı bulundu
                {searchTerm && <span> "<strong>{searchTerm}</strong>" araması için</span>}
                {selectedCategory !== 'all' && (
                  <span> <strong>{blogCategories.find(cat => cat.id === selectedCategory)?.name}</strong> kategorisinde</span>
                )}
              </>
            ) : (
              <>
                Aradığınız kriterlere uygun yazı bulunamadı.
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Filtreleri temizle
                  </button>
                )}
              </>
            )}
          </p>
        </div>

        {/* Blog Yazıları Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Öne çıkan yazı gösteriliyorsa, onu atlayarak diğerlerini göster */}
            {filteredBlogs
              .slice(!searchTerm && selectedCategory === 'all' ? 1 : 0)
              .map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            }
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Henüz yazı bulunamadı
            </h3>
            <p className="text-gray-600 mb-6">
              Farklı arama terimleri deneyebilir veya kategori filtresini değiştirebilirsiniz.
            </p>
          </div>
        )}

        {/* Popüler Etiketler */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">🏷️ Popüler Etiketler</h3>
          <div className="flex flex-wrap gap-3">
            {[
              'antalya transfer', 'kemer transfer', 'side transfer', 'belek transfer', 
              'alanya transfer', 'vip transfer', 'golf transfer', 'düğün transfer'
            ].map((tag, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(tag)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">📧 Blog Güncellemelerini Kaçırma!</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Yeni blog yazılarımızdan, transfer ipuçlarından ve özel kampanyalardan haberdar olmak için e-posta listemize katıl.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogPage;
