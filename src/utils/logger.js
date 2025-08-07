/**
 * Production-safe logging utility
 * Bu dosya production modunda console.log'ları engeller
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    // Error'ları production'da da gösterebiliriz (ama hassas bilgi içermeyenler)
    if (isDevelopment) {
      console.error(...args);
    } else {
      // Production'da sadece genel hata mesajı
      console.error('Bir hata oluştu');
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

export default logger;
