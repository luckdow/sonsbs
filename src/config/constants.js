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
  name: "GATE Transfer",
  version: "1.0.0",
  baseURL: "https://gatetransfer.com",
  companyName: "SBS Turkey Turizm Sanayi ve Ticaret Limited Şirketi",
  supportEmail: "info@sbstravel.net",
  supportPhone: "+90 532 574 26 82",
  companyAddress: "Güzelyurt Mahallesi Serik Caddesi No: 138/2, Aksu / Antalya",
  website: "www.gatetransfer.com",
  testMode: true  // Geliştirme aşaması için test modu
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

// Vehicle types
export const VEHICLE_TYPES = {
  VIP_CAR: 'vip-car',
  MINIBUS: 'minibus',
  MIDIBUS: 'midibus',
  BUS: 'bus'
};

// Vehicle capacities
export const VEHICLE_CAPACITIES = {
  [VEHICLE_TYPES.VIP_CAR]: { min: 1, max: 4 },
  [VEHICLE_TYPES.MINIBUS]: { min: 5, max: 14 },
  [VEHICLE_TYPES.MIDIBUS]: { min: 15, max: 25 },
  [VEHICLE_TYPES.BUS]: { min: 26, max: 50 }
};

// Time slots for reservations
export const TIME_SLOTS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
  '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

// Firebase collections
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  RESERVATIONS: 'reservations',
  VEHICLES: 'vehicles',
  DRIVERS: 'drivers',
  PAYMENTS: 'payments',
  SETTINGS: 'settings'
};

// Transfer Directions
export const TRANSFER_DIRECTIONS = {
  AIRPORT_TO_HOTEL: "airport_to_hotel",
  HOTEL_TO_AIRPORT: "hotel_to_airport"
};
