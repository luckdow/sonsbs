import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique reservation ID in format SBS-XXX
 */
export const generateReservationId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SBS-${timestamp}${random}`;
};

/**
 * Generates a secure temporary password
 */
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * Formats currency for Turkish Lira
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Formats date for Turkish locale
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('tr-TR', defaultOptions).format(new Date(date));
};

/**
 * Formats time for Turkish locale
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Formats full date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Validates Turkish phone number
 */
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone?.replace(/\s/g, ''));
};

/**
 * Validates email address
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('90')) {
    const formatted = cleaned.slice(2);
    return `+90 ${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 8)} ${formatted.slice(8)}`;
  }
  
  if (cleaned.startsWith('0')) {
    const formatted = cleaned.slice(1);
    return `+90 ${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 8)} ${formatted.slice(8)}`;
  }
  
  return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
};

/**
 * Calculates distance between two coordinates using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Calculates trip price based on distance and vehicle rates
 */
export const calculateTripPrice = (distance, pricePerKm, extraServices = []) => {
  const basePrice = distance * pricePerKm;
  const extraServicesTotal = extraServices.reduce((total, service) => {
    return total + (service.price * service.quantity);
  }, 0);
  
  return basePrice + extraServicesTotal;
};

/**
 * Gets reservation status in Turkish
 */
export const getReservationStatusText = (status) => {
  const statusMap = {
    pending: 'Bekleyen',
    assigned: 'Şoför Atandı',
    started: 'Yolculuk Başladı',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
  };
  
  return statusMap[status] || 'Bilinmeyen';
};

/**
 * Gets reservation status color
 */
export const getReservationStatusColor = (status) => {
  const colorMap = {
    pending: 'status-pending',
    assigned: 'status-assigned',
    started: 'status-started',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };
  
  return colorMap[status] || 'status-pending';
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for API calls
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Generate QR code data for reservation
 */
export const generateQRData = (reservation) => {
  return JSON.stringify({
    id: reservation.id,
    reservationId: reservation.reservationId,
    customerName: reservation.customerInfo.firstName + ' ' + reservation.customerInfo.lastName,
    date: reservation.tripDetails.date,
    time: reservation.tripDetails.time,
    timestamp: Date.now()
  });
};

/**
 * Parse QR code data
 */
export const parseQRData = (qrData) => {
  try {
    return JSON.parse(qrData);
  } catch (error) {
    return null;
  }
};

/**
 * Check if vehicle capacity is sufficient
 */
export const checkVehicleCapacity = (vehicle, passengerCount, luggageCount) => {
  return vehicle.passengerCapacity >= passengerCount && 
         vehicle.luggageCapacity >= luggageCount;
};

/**
 * Filter vehicles by capacity
 */
export const filterVehiclesByCapacity = (vehicles, passengerCount, luggageCount) => {
  return vehicles.filter(vehicle => 
    checkVehicleCapacity(vehicle, passengerCount, luggageCount)
  );
};

/**
 * Generate random avatar color
 */
export const generateAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get initials from full name
 */
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.toDateString() === checkDate.toDateString();
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  
  return tomorrow.toDateString() === checkDate.toDateString();
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date) => {
  if (isToday(date)) return 'Bugün';
  if (isTomorrow(date)) return 'Yarın';
  
  return formatDate(date, { month: 'short', day: 'numeric' });
};

/**
 * Generate unique identifier
 */
export const generateId = () => {
  return uuidv4();
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  return str?.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Mask sensitive information
 */
export const maskPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return phone;
  
  return `${cleaned.slice(0, 3)} *** ** ${cleaned.slice(-2)}`;
};

export const maskEmail = (email) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  return `${username.slice(0, 2)}***@${domain}`;
};
