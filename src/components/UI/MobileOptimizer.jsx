import { useEffect, useState } from 'react';

// Mobile-specific optimizations and touch improvements
const MobileOptimizer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };

    checkMobile();

    // Mobile-specific optimizations
    if (isMobile) {
      // Improve touch responsiveness
      const optimizeTouchResponse = () => {
        // Add touch-action CSS for better scrolling
        document.body.style.touchAction = 'manipulation';
        
        // Reduce 300ms click delay on mobile
        const style = document.createElement('style');
        style.textContent = `
          * {
            touch-action: manipulation;
          }
          
          /* Better touch targets - minimum 44px */
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Smoother scrolling on mobile */
          html {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
          
          /* Remove tap highlight on mobile */
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
          
          /* Better mobile form inputs */
          input, textarea, select {
            font-size: 16px; /* Prevents zoom on iOS */
            border-radius: 8px;
            padding: 12px;
          }
          
          /* Mobile-friendly hover states */
          @media (hover: none) and (pointer: coarse) {
            .hover\\:scale-105:hover {
              transform: none;
            }
            
            .hover\\:bg-blue-600:hover {
              background-color: inherit;
            }
          }
          
          /* Better mobile navigation */
          .mobile-nav-item {
            padding: 16px 20px;
            font-size: 18px;
            line-height: 1.5;
          }
          
          /* Improved mobile buttons */
          .mobile-button {
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 12px;
            min-height: 52px;
          }
          
          /* Better mobile cards */
          .mobile-card {
            padding: 20px;
            margin: 10px;
            border-radius: 16px;
          }
          
          /* Mobile-optimized text */
          .mobile-text-lg {
            font-size: 18px;
            line-height: 1.6;
          }
          
          .mobile-text-sm {
            font-size: 16px;
            line-height: 1.5;
          }
        `;
        document.head.appendChild(style);
      };

      // Add mobile-specific event listeners
      const addMobileEventListeners = () => {
        // Track touch performance
        document.addEventListener('touchstart', (e) => {
          setTouchStartTime(performance.now());
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
          const touchEndTime = performance.now();
          const touchDuration = touchEndTime - touchStartTime;
          
          // Log slow touch responses (> 100ms is considered slow)
          if (touchDuration > 100) {
            console.log(`Slow touch response: ${touchDuration.toFixed(2)}ms`);
          }
        }, { passive: true });

        // Prevent double-tap zoom on specific elements
        const preventDoubleTapZoom = (selector) => {
          document.querySelectorAll(selector).forEach(element => {
            let lastTouchEnd = 0;
            element.addEventListener('touchend', (e) => {
              const now = new Date().getTime();
              if (now - lastTouchEnd <= 300) {
                e.preventDefault();
              }
              lastTouchEnd = now;
            }, false);
          });
        };

        // Apply to buttons and interactive elements
        preventDoubleTapZoom('button, .btn, [role="button"]');
      };

      // Optimize mobile forms
      const optimizeMobileForms = () => {
        // Add mobile-friendly input types
        const phoneInputs = document.querySelectorAll('input[name*="phone"], input[name*="tel"]');
        phoneInputs.forEach(input => {
          input.type = 'tel';
          input.inputMode = 'tel';
        });

        const emailInputs = document.querySelectorAll('input[name*="email"]');
        emailInputs.forEach(input => {
          input.type = 'email';
          input.inputMode = 'email';
        });

        const numberInputs = document.querySelectorAll('input[name*="number"], input[name*="price"]');
        numberInputs.forEach(input => {
          input.inputMode = 'numeric';
        });

        // Auto-capitalize for name fields
        const nameInputs = document.querySelectorAll('input[name*="name"], input[name*="firstName"], input[name*="lastName"]');
        nameInputs.forEach(input => {
          input.autocapitalize = 'words';
        });
      };

      // Execute mobile optimizations
      optimizeTouchResponse();
      addMobileEventListeners();
      setTimeout(optimizeMobileForms, 1000); // Wait for form components to load

      // Add mobile-specific classes to body
      document.body.classList.add('mobile-optimized');
    }

    // Add viewport meta if not exists
    const addViewportMeta = () => {
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(viewportMeta);
      }
    };

    addViewportMeta();

    // Performance monitoring for mobile
    const monitorMobilePerformance = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        
        // Adapt to slow connections
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          console.log('Slow connection detected, optimizing...');
          
          // Reduce image quality for slow connections
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            if (img.srcset) {
              // Use lower resolution images
              img.loading = 'lazy';
            }
          });
          
          // Add slow connection class
          document.body.classList.add('slow-connection');
        }
      }
    };

    monitorMobilePerformance();

  }, [isMobile, touchStartTime]);

  // Add mobile-specific utility functions
  useEffect(() => {
    // Global mobile utility functions
    window.mobileUtils = {
      // Check if device is mobile
      isMobile: () => isMobile,
      
      // Smooth scroll with mobile optimization
      smoothScrollTo: (element, offset = 0) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      },
      
      // Mobile-friendly modal handling
      openModal: (modalId) => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      },
      
      closeModal: (modalId) => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      },
      
      // Touch feedback
      addTouchFeedback: (element) => {
        element.addEventListener('touchstart', () => {
          element.style.transform = 'scale(0.98)';
          element.style.opacity = '0.8';
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
          setTimeout(() => {
            element.style.transform = '';
            element.style.opacity = '';
          }, 150);
        }, { passive: true });
      }
    };
  }, [isMobile]);

  return null;
};

export default MobileOptimizer;
