// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: "AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw",
  libraries: ["places", "geometry", "drawing"],
  version: "weekly",
  language: "tr",
  region: "TR"
};

// Application Constants
export const APP_CONFIG = {
  name: "SBS Transfer",
  version: "1.0.0",
  companyName: "SBS Transfer Hizmetleri",
  supportEmail: "destek@sbstransfer.com",
  supportPhone: "+90 (555) 000 00 00"
};

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: "pending",           // Bekleyen
  DRIVER_ASSIGNED: "assigned",  // Şoför Atandı
  STARTED: "started",          // Yolculuk Başladı
  COMPLETED: "completed",      // Tamamlandı
  CANCELLED: "cancelled"       // İptal Edildi
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  DRIVER: "driver",
  CUSTOMER: "customer"
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card"
};

// Transfer Directions
export const TRANSFER_DIRECTIONS = {
  AIRPORT_TO_HOTEL: "airport_to_hotel",
  HOTEL_TO_AIRPORT: "hotel_to_airport"
};
