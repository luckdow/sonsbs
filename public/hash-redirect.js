// Hash routing redirect fix
// Bu script eski hash routing URL'lerini modern URL'lere yönlendirir

(function() {
  const hashRedirects = {
    '#!kurumsal': '/hizmetler/kurumsal-transfer',
    '#!kurumsal/': '/hizmetler/kurumsal-transfer',
    '#!kurumsal/c21qe': '/hizmetler/kurumsal-transfer',
    '#!havaalani': '/hizmetler/havaalani-transfer',
    '#!vip': '/hizmetler/vip-transfer',
    '#!grup': '/hizmetler/grup-transfer',
    '#!otel': '/hizmetler/otel-transfer',
    '#!dugun': '/hizmetler/dugun-transfer',
    '#!karsilama': '/hizmetler/karsilama-hizmeti',
    '#!hakkimizda': '/hakkimizda',
    '#!iletisim': '/iletisim',
    '#!blog': '/blog'
  };

  // Legacy URL redirects
  const legacyRedirects = {
    '/readme.html': '/',
    '/lander': '/',
    '/online-reservation': '/rezervasyon',
    '/online-reservation/': '/rezervasyon'
  };

  // Sayfa yüklendiğinde hash kontrolü
  function handleHashRedirect() {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    const search = window.location.search;
    
    // _escaped_fragment_ URL kontrolü (Eski AJAX crawling)
    if (search.includes('_escaped_fragment_=')) {
      const fragment = new URLSearchParams(search).get('_escaped_fragment_');
      
      if (fragment && fragment.includes('kurumsal')) {
        window.location.replace('https://www.gatetransfer.com/hizmetler/kurumsal-transfer');
        return;
      }
      
      // Diğer fragment'lar için ana sayfaya yönlendir
      window.location.replace('https://www.gatetransfer.com/');
      return;
    }
    
    // Legacy URL kontrolü
    if (legacyRedirects[pathname]) {
      window.location.replace('https://www.gatetransfer.com' + legacyRedirects[pathname]);
      return;
    }
    
    // Hash routing kontrolü
    if (hash && hash.startsWith('#!')) {
      // Tam eşleşme kontrolü
      if (hashRedirects[hash]) {
        window.location.replace('https://www.gatetransfer.com' + hashRedirects[hash]);
        return;
      }
      
      // Partial eşleşme kontrolü (örn: #!kurumsal/xxx)
      const baseHash = hash.split('/')[0];
      if (hashRedirects[baseHash]) {
        window.location.replace('https://www.gatetransfer.com' + hashRedirects[baseHash]);
        return;
      }
      
      // Hiç eşleşmezse ana sayfaya yönlendir
      window.location.replace('https://www.gatetransfer.com/');
    }
  }

  // Hash değişikliklerini dinle
  window.addEventListener('hashchange', handleHashRedirect);
  
  // Sayfa yüklendiğinde kontrol et
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleHashRedirect);
  } else {
    handleHashRedirect();
  }
})();
