import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config/constants';

const Logo = ({ isScrolled = false, location = { pathname: '/' }, size = 'normal' }) => {
  // Logo size variations - navbar için optimize edildi (küçültüldü)
  const sizeClasses = {
    small: 'h-6 w-auto md:h-8',
    normal: 'h-8 w-auto md:h-10',
    large: 'h-10 w-auto md:h-12'
  };

  // Logo URL - aynı logo ama scroll durumuna göre filter
  const logoUrl = "https://i.hizliresim.com/fyllowd.png";

  return (
    <Link to="/" className="flex items-center group">
      <div className={`${sizeClasses[size]} relative transition-all duration-300`}>
        {/* Logo - artık renk değişimi yok */}
        <img 
          src={logoUrl}
          alt="SBS Transfer Logo"
          className={`w-full h-full object-contain transition-all duration-300 group-hover:scale-105`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback logo */}
        <div 
          className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl items-center justify-center text-white font-bold hidden`}
          style={{ display: 'none' }}
        >
          <span className="text-xs sm:text-sm font-bold">SBS</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
