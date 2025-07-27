import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hemen scroll'u en üste al - smooth yerine instant
    window.scrollTo(0, 0);
    
    // Eğer sayfa yüklenmesi gecikirse, tekrar kontrol et
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
