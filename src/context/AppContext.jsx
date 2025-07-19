import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Initial State
const initialState = {
  // User State
  user: null,
  userRole: null,
  loading: true,
  
  // Reservations
  reservations: [],
  currentReservation: null,
  
  // Vehicles
  vehicles: [],
  
  // Drivers
  drivers: [],
  
  // Customers
  customers: [],
  
  // Extra Services
  extraServices: [],
  
  // System Settings
  settings: {
    companyInfo: {},
    paymentSettings: {},
    bankAccounts: [],
    commissionRates: {
      driverCommission: 70,
      companyCommission: 30
    }
  },
  
  // UI State
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  
  notification: {
    show: false,
    type: 'info',
    message: '',
    title: ''
  }
};

// Action Types
export const ACTION_TYPES = {
  // User Actions
  SET_USER: 'SET_USER',
  SET_USER_ROLE: 'SET_USER_ROLE',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  
  // Reservation Actions
  SET_RESERVATIONS: 'SET_RESERVATIONS',
  ADD_RESERVATION: 'ADD_RESERVATION',
  UPDATE_RESERVATION: 'UPDATE_RESERVATION',
  DELETE_RESERVATION: 'DELETE_RESERVATION',
  SET_CURRENT_RESERVATION: 'SET_CURRENT_RESERVATION',
  
  // Vehicle Actions
  SET_VEHICLES: 'SET_VEHICLES',
  ADD_VEHICLE: 'ADD_VEHICLE',
  UPDATE_VEHICLE: 'UPDATE_VEHICLE',
  DELETE_VEHICLE: 'DELETE_VEHICLE',
  
  // Driver Actions
  SET_DRIVERS: 'SET_DRIVERS',
  ADD_DRIVER: 'ADD_DRIVER',
  UPDATE_DRIVER: 'UPDATE_DRIVER',
  DELETE_DRIVER: 'DELETE_DRIVER',
  
  // Customer Actions
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  
  // Extra Services Actions
  SET_EXTRA_SERVICES: 'SET_EXTRA_SERVICES',
  ADD_EXTRA_SERVICE: 'ADD_EXTRA_SERVICE',
  UPDATE_EXTRA_SERVICE: 'UPDATE_EXTRA_SERVICE',
  DELETE_EXTRA_SERVICE: 'DELETE_EXTRA_SERVICE',
  
  // Settings Actions
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // UI Actions
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload, loading: false };
    
    case ACTION_TYPES.SET_USER_ROLE:
      return { ...state, userRole: action.payload };
    
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.LOGOUT:
      return { 
        ...state, 
        user: null, 
        userRole: null, 
        loading: false 
      };
    
    case ACTION_TYPES.SET_RESERVATIONS:
      return { ...state, reservations: action.payload };
    
    case ACTION_TYPES.ADD_RESERVATION:
      return { 
        ...state, 
        reservations: [...state.reservations, action.payload] 
      };
    
    case ACTION_TYPES.UPDATE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.map(reservation =>
          reservation.id === action.payload.id ? action.payload : reservation
        )
      };
    
    case ACTION_TYPES.DELETE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.filter(
          reservation => reservation.id !== action.payload
        )
      };
    
    case ACTION_TYPES.SET_CURRENT_RESERVATION:
      return { ...state, currentReservation: action.payload };
    
    case ACTION_TYPES.SET_VEHICLES:
      return { ...state, vehicles: action.payload };
    
    case ACTION_TYPES.ADD_VEHICLE:
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    
    case ACTION_TYPES.UPDATE_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        )
      };
    
    case ACTION_TYPES.DELETE_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== action.payload)
      };
    
    case ACTION_TYPES.SET_DRIVERS:
      return { ...state, drivers: action.payload };
    
    case ACTION_TYPES.ADD_DRIVER:
      return { ...state, drivers: [...state.drivers, action.payload] };
    
    case ACTION_TYPES.UPDATE_DRIVER:
      return {
        ...state,
        drivers: state.drivers.map(driver =>
          driver.id === action.payload.id ? action.payload : driver
        )
      };
    
    case ACTION_TYPES.DELETE_DRIVER:
      return {
        ...state,
        drivers: state.drivers.filter(driver => driver.id !== action.payload)
      };
    
    case ACTION_TYPES.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    
    case ACTION_TYPES.ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    
    case ACTION_TYPES.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        )
      };
    
    case ACTION_TYPES.SET_EXTRA_SERVICES:
      return { ...state, extraServices: action.payload };
    
    case ACTION_TYPES.ADD_EXTRA_SERVICE:
      return { 
        ...state, 
        extraServices: [...state.extraServices, action.payload] 
      };
    
    case ACTION_TYPES.UPDATE_EXTRA_SERVICE:
      return {
        ...state,
        extraServices: state.extraServices.map(service =>
          service.id === action.payload.id ? action.payload : service
        )
      };
    
    case ACTION_TYPES.DELETE_EXTRA_SERVICE:
      return {
        ...state,
        extraServices: state.extraServices.filter(
          service => service.id !== action.payload
        )
      };
    
    case ACTION_TYPES.SET_SETTINGS:
      return { ...state, settings: action.payload };
    
    case ACTION_TYPES.UPDATE_SETTINGS:
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    case ACTION_TYPES.SHOW_MODAL:
      return {
        ...state,
        modal: {
          isOpen: true,
          type: action.payload.type,
          data: action.payload.data
        }
      };
    
    case ACTION_TYPES.HIDE_MODAL:
      return {
        ...state,
        modal: { isOpen: false, type: null, data: null }
      };
    
    case ACTION_TYPES.SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: true,
          type: action.payload.type,
          message: action.payload.message,
          title: action.payload.title
        }
      };
    
    case ACTION_TYPES.HIDE_NOTIFICATION:
      return {
        ...state,
        notification: { show: false, type: 'info', message: '', title: '' }
      };
    
    default:
      return state;
  }
};

// Create Context
const AppContext = createContext();

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Firebase Operations
  const firebaseOperations = {
    // Generic CRUD operations
    async create(collectionName, data) {
      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return { id: docRef.id, ...data };
      } catch (error) {
        console.error(`Error creating ${collectionName}:`, error);
        throw error;
      }
    },

    async update(collectionName, id, data) {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date()
        });
        return { id, ...data };
      } catch (error) {
        console.error(`Error updating ${collectionName}:`, error);
        throw error;
      }
    },

    async delete(collectionName, id) {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        return id;
      } catch (error) {
        console.error(`Error deleting ${collectionName}:`, error);
        throw error;
      }
    },

    async getAll(collectionName, orderByField = 'createdAt') {
      try {
        const q = query(
          collection(db, collectionName),
          orderBy(orderByField, 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        throw error;
      }
    }
  };

  // Action Creators
  const actions = {
    // User Actions
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    setUserRole: (role) => dispatch({ type: ACTION_TYPES.SET_USER_ROLE, payload: role }),
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    logout: () => dispatch({ type: ACTION_TYPES.LOGOUT }),

    // Reservation Actions
    setReservations: (reservations) => 
      dispatch({ type: ACTION_TYPES.SET_RESERVATIONS, payload: reservations }),
    
    addReservation: async (reservationData) => {
      try {
        const newReservation = await firebaseOperations.create('reservations', reservationData);
        dispatch({ type: ACTION_TYPES.ADD_RESERVATION, payload: newReservation });
        return newReservation;
      } catch (error) {
        actions.showNotification('error', 'Rezervasyon oluşturulurken hata oluştu', 'Hata');
        throw error;
      }
    },

    updateReservation: async (id, data) => {
      try {
        const updatedReservation = await firebaseOperations.update('reservations', id, data);
        dispatch({ type: ACTION_TYPES.UPDATE_RESERVATION, payload: updatedReservation });
        return updatedReservation;
      } catch (error) {
        actions.showNotification('error', 'Rezervasyon güncellenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    deleteReservation: async (id) => {
      try {
        await firebaseOperations.delete('reservations', id);
        dispatch({ type: ACTION_TYPES.DELETE_RESERVATION, payload: id });
        actions.showNotification('success', 'Rezervasyon başarıyla silindi', 'Başarılı');
      } catch (error) {
        actions.showNotification('error', 'Rezervasyon silinirken hata oluştu', 'Hata');
        throw error;
      }
    },

    setCurrentReservation: (reservation) => 
      dispatch({ type: ACTION_TYPES.SET_CURRENT_RESERVATION, payload: reservation }),

    // Vehicle Actions
    setVehicles: (vehicles) => 
      dispatch({ type: ACTION_TYPES.SET_VEHICLES, payload: vehicles }),
    
    addVehicle: async (vehicleData) => {
      try {
        const newVehicle = await firebaseOperations.create('vehicles', vehicleData);
        dispatch({ type: ACTION_TYPES.ADD_VEHICLE, payload: newVehicle });
        actions.showNotification('success', 'Araç başarıyla eklendi', 'Başarılı');
        return newVehicle;
      } catch (error) {
        actions.showNotification('error', 'Araç eklenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    updateVehicle: async (id, data) => {
      try {
        const updatedVehicle = await firebaseOperations.update('vehicles', id, data);
        dispatch({ type: ACTION_TYPES.UPDATE_VEHICLE, payload: updatedVehicle });
        actions.showNotification('success', 'Araç başarıyla güncellendi', 'Başarılı');
        return updatedVehicle;
      } catch (error) {
        actions.showNotification('error', 'Araç güncellenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    deleteVehicle: async (id) => {
      try {
        await firebaseOperations.delete('vehicles', id);
        dispatch({ type: ACTION_TYPES.DELETE_VEHICLE, payload: id });
        actions.showNotification('success', 'Araç başarıyla silindi', 'Başarılı');
      } catch (error) {
        actions.showNotification('error', 'Araç silinirken hata oluştu', 'Hata');
        throw error;
      }
    },

    // Driver Actions
    setDrivers: (drivers) => 
      dispatch({ type: ACTION_TYPES.SET_DRIVERS, payload: drivers }),
    
    addDriver: async (driverData) => {
      try {
        const newDriver = await firebaseOperations.create('drivers', driverData);
        dispatch({ type: ACTION_TYPES.ADD_DRIVER, payload: newDriver });
        actions.showNotification('success', 'Şoför başarıyla eklendi', 'Başarılı');
        return newDriver;
      } catch (error) {
        actions.showNotification('error', 'Şoför eklenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    updateDriver: async (id, data) => {
      try {
        const updatedDriver = await firebaseOperations.update('drivers', id, data);
        dispatch({ type: ACTION_TYPES.UPDATE_DRIVER, payload: updatedDriver });
        actions.showNotification('success', 'Şoför başarıyla güncellendi', 'Başarılı');
        return updatedDriver;
      } catch (error) {
        actions.showNotification('error', 'Şoför güncellenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    deleteDriver: async (id) => {
      try {
        await firebaseOperations.delete('drivers', id);
        dispatch({ type: ACTION_TYPES.DELETE_DRIVER, payload: id });
        actions.showNotification('success', 'Şoför başarıyla silindi', 'Başarılı');
      } catch (error) {
        actions.showNotification('error', 'Şoför silinirken hata oluştu', 'Hata');
        throw error;
      }
    },

    // Customer Actions
    setCustomers: (customers) => 
      dispatch({ type: ACTION_TYPES.SET_CUSTOMERS, payload: customers }),
    
    addCustomer: async (customerData) => {
      try {
        const newCustomer = await firebaseOperations.create('customers', customerData);
        dispatch({ type: ACTION_TYPES.ADD_CUSTOMER, payload: newCustomer });
        return newCustomer;
      } catch (error) {
        actions.showNotification('error', 'Müşteri eklenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    updateCustomer: async (id, data) => {
      try {
        const updatedCustomer = await firebaseOperations.update('customers', id, data);
        dispatch({ type: ACTION_TYPES.UPDATE_CUSTOMER, payload: updatedCustomer });
        return updatedCustomer;
      } catch (error) {
        actions.showNotification('error', 'Müşteri güncellenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    // Extra Services Actions
    setExtraServices: (services) => 
      dispatch({ type: ACTION_TYPES.SET_EXTRA_SERVICES, payload: services }),
    
    addExtraService: async (serviceData) => {
      try {
        const newService = await firebaseOperations.create('extraServices', serviceData);
        dispatch({ type: ACTION_TYPES.ADD_EXTRA_SERVICE, payload: newService });
        actions.showNotification('success', 'Ek hizmet başarıyla eklendi', 'Başarılı');
        return newService;
      } catch (error) {
        actions.showNotification('error', 'Ek hizmet eklenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    updateExtraService: async (id, data) => {
      try {
        const updatedService = await firebaseOperations.update('extraServices', id, data);
        dispatch({ type: ACTION_TYPES.UPDATE_EXTRA_SERVICE, payload: updatedService });
        actions.showNotification('success', 'Ek hizmet başarıyla güncellendi', 'Başarılı');
        return updatedService;
      } catch (error) {
        actions.showNotification('error', 'Ek hizmet güncellenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    deleteExtraService: async (id) => {
      try {
        await firebaseOperations.delete('extraServices', id);
        dispatch({ type: ACTION_TYPES.DELETE_EXTRA_SERVICE, payload: id });
        actions.showNotification('success', 'Ek hizmet başarıyla silindi', 'Başarılı');
      } catch (error) {
        actions.showNotification('error', 'Ek hizmet silinirken hata oluştu', 'Hata');
        throw error;
      }
    },

    // Settings Actions
    setSettings: (settings) => 
      dispatch({ type: ACTION_TYPES.SET_SETTINGS, payload: settings }),
    
    updateSettings: async (settingsData) => {
      try {
        // 'main' id'li settings dokümanını güncelle
        const updatedSettings = await firebaseOperations.update('settings', 'main', settingsData);
        dispatch({ type: ACTION_TYPES.UPDATE_SETTINGS, payload: updatedSettings });
        actions.showNotification('success', 'Ayarlar başarıyla güncellendi', 'Başarılı');
        return updatedSettings;
      } catch (error) {
        actions.showNotification('error', 'Ayarlar güncellenirken hata oluştu', 'Hata');
        throw error;
      }
    },

    // UI Actions
    showModal: (type, data = null) => 
      dispatch({ type: ACTION_TYPES.SHOW_MODAL, payload: { type, data } }),
    
    hideModal: () => 
      dispatch({ type: ACTION_TYPES.HIDE_MODAL }),
    
    showNotification: (type, message, title = '') => 
      dispatch({ 
        type: ACTION_TYPES.SHOW_NOTIFICATION, 
        payload: { type, message, title } 
      }),
    
    hideNotification: () => 
      dispatch({ type: ACTION_TYPES.HIDE_NOTIFICATION }),

    // Data Loading Functions
    loadAllData: async () => {
      try {
        actions.setLoading(true);
        
        const [vehicles, drivers, customers, extraServices, reservations] = await Promise.all([
          firebaseOperations.getAll('vehicles'),
          firebaseOperations.getAll('drivers'),
          firebaseOperations.getAll('customers'),
          firebaseOperations.getAll('extraServices'),
          firebaseOperations.getAll('reservations')
        ]);

        actions.setVehicles(vehicles);
        actions.setDrivers(drivers);
        actions.setCustomers(customers);
        actions.setExtraServices(extraServices);
        actions.setReservations(reservations);
      } catch (error) {
        console.error('Error loading data:', error);
        actions.showNotification('error', 'Veriler yüklenirken hata oluştu', 'Hata');
      } finally {
        actions.setLoading(false);
      }
    }
  };

  // Load initial data
  useEffect(() => {
    actions.loadAllData();
  }, []);

  return (
    <AppContext.Provider value={{ state, actions, firebaseOperations }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
