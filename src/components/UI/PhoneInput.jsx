import React, { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

const PhoneInput = ({ value, onChange, placeholder, className, error }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'TR',
    dialCode: '+90',
    flag: '🇹🇷',
    name: 'Türkiye'
  });

  const countries = [
    { code: 'TR', dialCode: '+90', flag: '🇹🇷', name: 'Türkiye' },
    { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'Amerika' },
    { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'İngiltere' },
    { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Almanya' },
    { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'Fransa' },
    { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'İtalya' },
    { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'İspanya' },
    { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Hollanda' },
    { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Belçika' },
    { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'İsviçre' },
    { code: 'AT', dialCode: '+43', flag: '🇦🇹', name: 'Avusturya' },
    { code: 'SE', dialCode: '+46', flag: '🇸🇪', name: 'İsveç' },
    { code: 'NO', dialCode: '+47', flag: '🇳🇴', name: 'Norveç' },
    { code: 'DK', dialCode: '+45', flag: '🇩🇰', name: 'Danimarka' },
    { code: 'FI', dialCode: '+358', flag: '🇫🇮', name: 'Finlandiya' },
    { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: 'Rusya' },
    { code: 'UA', dialCode: '+380', flag: '🇺🇦', name: 'Ukrayna' },
    { code: 'PL', dialCode: '+48', flag: '🇵🇱', name: 'Polonya' },
    { code: 'CZ', dialCode: '+420', flag: '🇨🇿', name: 'Çekya' },
    { code: 'HU', dialCode: '+36', flag: '🇭🇺', name: 'Macaristan' },
    { code: 'GR', dialCode: '+30', flag: '🇬🇷', name: 'Yunanistan' },
    { code: 'BG', dialCode: '+359', flag: '🇧🇬', name: 'Bulgaristan' },
    { code: 'RO', dialCode: '+40', flag: '🇷🇴', name: 'Romanya' },
    { code: 'HR', dialCode: '+385', flag: '🇭🇷', name: 'Hırvatistan' },
    { code: 'RS', dialCode: '+381', flag: '🇷🇸', name: 'Sırbistan' },
    { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japonya' },
    { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'Güney Kore' },
    { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'Çin' },
    { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'Hindistan' },
    { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Avustralya' },
    { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Kanada' },
    { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brezilya' },
    { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'Meksika' },
    { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Arjantin' },
    { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'BAE' },
    { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Suudi Arabistan' },
    { code: 'EG', dialCode: '+20', flag: '🇪🇬', name: 'Mısır' },
    { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: 'Güney Afrika' }
  ];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    // Update phone number with new country code
    const currentNumber = value.replace(/^\+\d+\s*/, '');
    const newValue = `${country.dialCode} ${currentNumber}`.trim();
    onChange(newValue);
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    
    // If user starts typing without country code, prepend selected country's dial code
    if (!inputValue.startsWith('+')) {
      const formattedValue = `${selectedCountry.dialCode} ${inputValue}`.trim();
      onChange(formattedValue);
    } else {
      onChange(inputValue);
    }
  };

  const formatPhoneDisplay = (phoneValue) => {
    if (!phoneValue) return '';
    
    // Remove country code for display in input
    const withoutCountryCode = phoneValue.replace(/^\+\d+\s*/, '');
    
    // Format based on selected country
    if (selectedCountry.code === 'TR') {
      const digits = withoutCountryCode.replace(/\D/g, '');
      if (digits.length >= 10) {
        return digits.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      }
      return digits;
    }
    
    return withoutCountryCode;
  };

  return (
    <div className="relative">
      <div className="flex w-full h-12">
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-center px-3 h-12 border border-r-0 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-20 ${
              error ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
            }`}
          >
            <span className="text-base mr-1">{selectedCountry.flag}</span>
            <span className="text-xs font-medium text-gray-700">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base mr-3">{country.flag}</span>
                  <span className="text-sm text-gray-500 font-mono">
                    {country.dialCode}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Overlay to close dropdown */}
          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>

        {/* Phone Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <input
            type="tel"
            value={formatPhoneDisplay(value)}
            onChange={handlePhoneChange}
            placeholder={placeholder || "555 123 4567"}
            className={`w-full h-12 pl-10 pr-4 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
