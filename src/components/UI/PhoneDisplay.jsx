import React from 'react';
import { getPhoneDisplayData } from '../../utils/phoneUtils';

const PhoneDisplay = ({ phone, className = '', showCountryName = false, size = 'md' }) => {
  const phoneData = getPhoneDisplayData(phone);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };
  
  const flagSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (!phone) {
    return (
      <span className={`text-gray-400 ${sizeClasses[size]} ${className}`}>
        Telefon belirtilmemiş
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`${flagSizes[size]}`}>
        {phoneData.flag}
      </span>
      <span className={`font-medium text-gray-900 ${sizeClasses[size]}`}>
        {phoneData.countryCode}
      </span>
      <span className={`text-gray-700 ${sizeClasses[size]}`}>
        {phoneData.number}
      </span>
      {showCountryName && (
        <span className={`text-gray-500 text-xs`}>
          ({phoneData.countryName})
        </span>
      )}
    </div>
  );
};

export default PhoneDisplay;
