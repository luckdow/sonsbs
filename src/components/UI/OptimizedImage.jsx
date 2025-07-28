import React, { useState, useCallback, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  priority = false,
  webpSrc = null,
  sizes = '',
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && imgRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = src;
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [src, priority]);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || baseSrc.includes('hizliresim.com')) return '';
    
    const sizes = [300, 600, 900, 1200];
    return sizes.map(size => {
      // For hizliresim.com, use direct URLs
      if (baseSrc.includes('hizliresim.com')) {
        return `${baseSrc} ${size}w`;
      }
      // For local images, assume we have different sizes
      const ext = baseSrc.split('.').pop();
      const nameWithoutExt = baseSrc.replace(`.${ext}`, '');
      return `${nameWithoutExt}-${size}w.${ext} ${size}w`;
    }).join(', ');
  };

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Resim yüklenemedi</span>
      </div>
    );
  }

  return (
    <picture>
      {webpSrc && (
        <source
          srcSet={webpSrc}
          type="image/webp"
        />
      )}
      <img
        ref={imgRef}
        src={priority ? src : undefined}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : loading}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '300px 200px',
          ...props.style
        }}
      />
      {!imageLoaded && !imageError && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}>
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;
