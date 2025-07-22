// Telefon numarası utility fonksiyonları

// Ülke kodları ve bayrak emojileri
export const COUNTRY_CODES = {
  '+90': { flag: '🇹🇷', name: 'Turkey', code: 'TR' },
  '+1': { flag: '🇺🇸', name: 'United States', code: 'US' },
  '+44': { flag: '🇬🇧', name: 'United Kingdom', code: 'GB' },
  '+49': { flag: '🇩🇪', name: 'Germany', code: 'DE' },
  '+33': { flag: '🇫🇷', name: 'France', code: 'FR' },
  '+39': { flag: '🇮🇹', name: 'Italy', code: 'IT' },
  '+34': { flag: '🇪🇸', name: 'Spain', code: 'ES' },
  '+31': { flag: '🇳🇱', name: 'Netherlands', code: 'NL' },
  '+41': { flag: '🇨🇭', name: 'Switzerland', code: 'CH' },
  '+43': { flag: '🇦🇹', name: 'Austria', code: 'AT' },
  '+32': { flag: '🇧🇪', name: 'Belgium', code: 'BE' },
  '+45': { flag: '🇩🇰', name: 'Denmark', code: 'DK' },
  '+46': { flag: '🇸🇪', name: 'Sweden', code: 'SE' },
  '+47': { flag: '🇳🇴', name: 'Norway', code: 'NO' },
  '+358': { flag: '🇫🇮', name: 'Finland', code: 'FI' },
  '+7': { flag: '🇷🇺', name: 'Russia', code: 'RU' },
  '+86': { flag: '🇨🇳', name: 'China', code: 'CN' },
  '+81': { flag: '🇯🇵', name: 'Japan', code: 'JP' },
  '+82': { flag: '🇰🇷', name: 'South Korea', code: 'KR' },
  '+91': { flag: '🇮🇳', name: 'India', code: 'IN' },
  '+61': { flag: '🇦🇺', name: 'Australia', code: 'AU' },
  '+64': { flag: '🇳🇿', name: 'New Zealand', code: 'NZ' },
  '+55': { flag: '🇧🇷', name: 'Brazil', code: 'BR' },
  '+52': { flag: '🇲🇽', name: 'Mexico', code: 'MX' },
  '+54': { flag: '🇦🇷', name: 'Argentina', code: 'AR' },
  '+27': { flag: '🇿🇦', name: 'South Africa', code: 'ZA' },
  '+20': { flag: '🇪🇬', name: 'Egypt', code: 'EG' },
  '+971': { flag: '🇦🇪', name: 'UAE', code: 'AE' },
  '+966': { flag: '🇸🇦', name: 'Saudi Arabia', code: 'SA' },
  '+98': { flag: '🇮🇷', name: 'Iran', code: 'IR' },
  '+964': { flag: '🇮🇶', name: 'Iraq', code: 'IQ' },
  '+962': { flag: '🇯🇴', name: 'Jordan', code: 'JO' },
  '+961': { flag: '🇱🇧', name: 'Lebanon', code: 'LB' },
  '+963': { flag: '🇸🇾', name: 'Syria', code: 'SY' },
  '+212': { flag: '🇲🇦', name: 'Morocco', code: 'MA' },
  '+213': { flag: '🇩🇿', name: 'Algeria', code: 'DZ' },
  '+216': { flag: '🇹🇳', name: 'Tunisia', code: 'TN' },
  '+30': { flag: '🇬🇷', name: 'Greece', code: 'GR' },
  '+359': { flag: '🇧🇬', name: 'Bulgaria', code: 'BG' },
  '+40': { flag: '🇷🇴', name: 'Romania', code: 'RO' },
  '+385': { flag: '🇭🇷', name: 'Croatia', code: 'HR' },
  '+381': { flag: '🇷🇸', name: 'Serbia', code: 'RS' },
  '+387': { flag: '🇧🇦', name: 'Bosnia and Herzegovina', code: 'BA' },
  '+382': { flag: '🇲🇪', name: 'Montenegro', code: 'ME' },
  '+383': { flag: '🇽🇰', name: 'Kosovo', code: 'XK' },
  '+389': { flag: '🇲🇰', name: 'North Macedonia', code: 'MK' },
  '+355': { flag: '🇦🇱', name: 'Albania', code: 'AL' }
};

/**
 * Telefon numarasından ülke kodunu çıkarır
 * @param {string} phone - Telefon numarası (+90 555 123 45 67 formatında)
 * @returns {string|null} - Ülke kodu (+90, +1, vb.)
 */
export const extractCountryCode = (phone) => {
  if (!phone || typeof phone !== 'string') return null;
  
  // Telefon numarasını temizle (sadece + ve rakamlar kalsın)
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // + ile başlamıyorsa null döndür
  if (!cleanPhone.startsWith('+')) return null;
  
  // En uzun koddan başlayarak kontrol et (örn. +971 önce +9'den kontrol edilsin)
  const sortedCodes = Object.keys(COUNTRY_CODES).sort((a, b) => b.length - a.length);
  
  for (const code of sortedCodes) {
    if (cleanPhone.startsWith(code)) {
      return code;
    }
  }
  
  return null;
};

/**
 * Telefon numarasından ülke bilgisini alır
 * @param {string} phone - Telefon numarası
 * @returns {object|null} - Ülke bilgisi {flag, name, code} formatında
 */
export const getCountryFromPhone = (phone) => {
  const countryCode = extractCountryCode(phone);
  
  if (!countryCode || !COUNTRY_CODES[countryCode]) {
    // Varsayılan olarak Türkiye döndür
    return COUNTRY_CODES['+90'];
  }
  
  return COUNTRY_CODES[countryCode];
};

/**
 * Telefon numarasını formatlar (ülke kodu + numara şeklinde)
 * @param {string} phone - Telefon numarası
 * @returns {string} - Formatlanmış telefon numarası
 */
export const formatPhoneWithCountry = (phone) => {
  const country = getCountryFromPhone(phone);
  const countryCode = extractCountryCode(phone);
  
  if (!country || !countryCode) {
    return phone || '';
  }
  
  // Ülke kodunu çıkar, kalan numarayı al
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const number = cleanPhone.substring(countryCode.length);
  
  return `${country.flag} ${countryCode} ${number}`;
};

/**
 * Telefon numarası component'i için props hazırlar
 * @param {string} phone - Telefon numarası
 * @returns {object} - {flag, countryCode, number, fullNumber} formatında
 */
export const getPhoneDisplayData = (phone) => {
  const country = getCountryFromPhone(phone);
  const countryCode = extractCountryCode(phone);
  
  if (!country || !countryCode) {
    return {
      flag: '🇹🇷',
      countryCode: '+90',
      number: phone || '',
      fullNumber: phone || '',
      countryName: 'Turkey'
    };
  }
  
  // Ülke kodunu çıkar, kalan numarayı al
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const number = cleanPhone.substring(countryCode.length);
  
  return {
    flag: country.flag,
    countryCode: countryCode,
    number: number,
    fullNumber: phone,
    countryName: country.name
  };
};
