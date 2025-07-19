import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Car,
  Clock
} from 'lucide-react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FIREBASE_COLLECTIONS, RESERVATION_STATUS } from '../../config/constants';
import { useAuth } from '../../contexts/AuthContext';
import TransferDetails from './TransferDetails';
import VehicleSelection from './VehicleSelection';
import PersonalInfo from './PersonalInfo';
import PaymentMethods from './PaymentMethods';
import BookingConfirmation from './BookingConfirmation';
import toast from 'react-hot-toast';

const steps = [
  {
    id: 1,
    title: 'Transfer Detayları',
    description: 'Transfer bilgilerinizi girin',
    icon: MapPin,
    component: 'transfer-details'
  },
  {
    id: 2,
    title: 'Araç Seçimi',
    description: 'Size uygun aracı seçin',
    icon: Car,
    component: 'vehicle'
  },
  {
    id: 3,
    title: 'Kişisel Bilgiler',
    description: 'İletişim ve uçuş bilgileriniz',
    icon: Users,
    component: 'personal-info'
  },
  {
    id: 4,
    title: 'Ödeme',
    description: 'Ödeme yönteminizi seçin',
    icon: CreditCard,
    component: 'payment'
  },
  {
    id: 5,
    title: 'Onay',
    description: 'Rezervasyon tamamlandı',
    icon: CheckCircle,
    component: 'confirmation'
  }
];

const BookingWizard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // Transfer details
    direction: '', // 'airport-to-hotel' or 'hotel-to-airport'
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    passengerCount: 1,
    baggageCount: 1,
    
    // Route calculation
    routeInfo: null,
    
    // Vehicle selection
    selectedVehicle: null,
    selectedServices: [],
    totalPrice: 0,
    
    // Personal info
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      flightNumber: '',
      arrivalTime: '',
      departureTime: '',
      specialRequests: '',
      agreeToTerms: false,
      marketingConsent: false
    },
    
    // Payment
    paymentMethod: 'credit_card',
    cardData: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      saveCard: false
    }
  });

  // Initialize user data if logged in
  useEffect(() => {
    if (user && userProfile) {
      setBookingData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          email: userProfile.email || user.email || '',
          phone: userProfile.phone || ''
        }
      }));
    }
  }, [user, userProfile]);

  const updateBookingData = (key, value) => {
    setBookingData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveReservationToFirebase = async () => {
    try {
      console.log('🔍 BookingData before save:', bookingData);
      
      // Generate unique reservation ID
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const reservationId = `SBS${timestamp.toString().slice(-6)}${randomStr}`;

      // Helper function to format locations
      const formatLocation = (location) => {
        if (!location) return '';
        if (typeof location === 'string') return location;
        if (typeof location === 'object') {
          if (location.address) return String(location.address);
          if (location.name) return String(location.name);
          if (location.formatted_address) return String(location.formatted_address);
          if (location.description) return String(location.description);
          return 'Lokasyon belirtilmemiş';
        }
        return String(location);
      };

      // Create reservation data for Firebase - Admin panel uyumlu format
      const reservationData = {
        reservationId: reservationId,
        status: RESERVATION_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Admin panel beklenen format: tripDetails objesi
        tripDetails: {
          date: bookingData.date || '',
          time: bookingData.time || '',
          pickupLocation: formatLocation(bookingData.pickupLocation),
          dropoffLocation: formatLocation(bookingData.dropoffLocation),
          passengerCount: bookingData.personalInfo?.passengerCount || bookingData.passengerCount || 1,
          luggageCount: bookingData.baggageCount || 1,
          flightNumber: bookingData.personalInfo?.flightNumber || '',
          direction: bookingData.direction || ''
        },
        
        // Admin panel beklenen format: customerInfo objesi  
        customerInfo: {
          firstName: bookingData.personalInfo?.firstName || '',
          lastName: bookingData.personalInfo?.lastName || '',
          email: bookingData.personalInfo?.email || '',
          phone: bookingData.personalInfo?.phone || ''
        },
        
        // Diğer alanlar
        selectedVehicle: bookingData.selectedVehicle || null,
        selectedServices: bookingData.selectedServices || [],
        paymentMethod: bookingData.paymentMethod || '',
        totalPrice: bookingData.totalPrice || 0,
        
        // Route info
        distance: bookingData.routeInfo?.distance || null,
        duration: bookingData.routeInfo?.duration || null,
        
        // Müşteri paneli için backward compatibility
        personalInfo: bookingData.personalInfo || {},
        direction: bookingData.direction || '',
        pickupLocation: formatLocation(bookingData.pickupLocation),
        dropoffLocation: formatLocation(bookingData.dropoffLocation),
        date: bookingData.date || '',
        time: bookingData.time || '',
        passengerCount: bookingData.personalInfo?.passengerCount || bookingData.passengerCount || 1,
        
        // Assignment fields
        assignedDriver: null,
        assignedDriverId: null,
        assignedVehicle: null,
        driverAssigned: null,
        
        // User info if logged in
        userId: user?.uid || null,
        userEmail: user?.email || bookingData.personalInfo?.email || ''
      };

      // Save to Firebase with reservationId as document ID
      console.log('💾 Final reservation data to save:', reservationData);
      const docRef = doc(db, FIREBASE_COLLECTIONS.RESERVATIONS, reservationId);
      await setDoc(docRef, reservationData);
      console.log('Reservation saved to Firebase with ID:', reservationId);
      
      // Update booking data with Firebase document ID and reservation ID
      setBookingData(prev => ({
        ...prev,
        firebaseDocId: reservationId,
        id: reservationId, // Firestore doküman ID'si = rezervasyon ID'si
        reservationId: reservationId
      }));
      
      toast.success('Rezervasyon başarıyla oluşturuldu!');
      return true;
      
    } catch (error) {
      console.error('Error saving reservation to Firebase:', error);
      toast.error('Rezervasyon kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      return false;
    }
  };

  const nextStep = async () => {
    if (validateCurrentStep()) {
      // Eğer adım 4'ten adım 5'e geçiyorsak (ödeme -> onay), rezervasyonu kaydet
      if (currentStep === 4) {
        const saved = await saveReservationToFirebase();
        if (!saved) {
          return; // Rezervasyon kaydedilemezse adım geçişini engelle
        }
      }
      
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Transfer Details
        console.log('BookingWizard - Transfer Details Validation:', bookingData);
        if (!bookingData.direction) {
          toast.error('Lütfen transfer yönü seçin');
          return false;
        }
        
        // Lokasyon kontrolü
        if (bookingData.direction === 'airport-to-hotel' && !bookingData.dropoffLocation) {
          toast.error('Lütfen otel/konaklama yeri seçin');
          return false;
        }
        
        if (bookingData.direction === 'hotel-to-airport' && !bookingData.pickupLocation) {
          toast.error('Lütfen otel/konaklama yeri seçin');
          return false;
        }
        
        if (!bookingData.date || !bookingData.time) {
          toast.error('Lütfen tarih ve saat seçin');
          return false;
        }
        
        return true;
      
      case 2: // Vehicle Selection
        console.log('BookingWizard - Vehicle Selection Validation:', bookingData);
        if (!bookingData.selectedVehicle) {
          toast.error('Lütfen bir araç seçin');
          return false;
        }
        return true;
      
      case 3: // Personal Info
        const { personalInfo } = bookingData;
        console.log('BookingWizard - Personal Info Validation:', personalInfo);
        if (!personalInfo?.firstName || !personalInfo?.lastName) {
          toast.error('Lütfen ad ve soyad bilgilerini girin');
          return false;
        }
        if (!personalInfo?.email || !personalInfo?.phone) {
          toast.error('Lütfen iletişim bilgilerini girin');
          return false;
        }
        if (!personalInfo?.acceptTerms) {
          toast.error('Lütfen kullanım şartlarını kabul edin');
          return false;
        }
        return true;
      
      case 4: // Payment
        console.log('BookingWizard - Payment Validation:', bookingData);
        if (!bookingData.paymentMethod) {
          toast.error('Lütfen ödeme yöntemi seçin');
          return false;
        }
        if (bookingData.paymentMethod === 'credit_card') {
          const { creditCardInfo } = bookingData;
          if (!creditCardInfo || !creditCardInfo.cardNumber || !creditCardInfo.expiryDate || !creditCardInfo.cvv || !creditCardInfo.cardName) {
            toast.error('Lütfen kart bilgilerini tamamlayın');
            return false;
          }
        }
        return true;
      
      case 5: // Confirmation
        return true;
      
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TransferDetails
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={nextStep}
          />
        );
      
      case 2:
        return (
          <VehicleSelection
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 3:
        return (
          <PersonalInfo
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 4:
        return (
          <PaymentMethods
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      
      case 5:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onComplete={() => navigate('/')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transfer Rezervasyonu
          </h1>
          <p className="text-xl text-gray-600">
            Konforlu ve güvenli transfer hizmetimizle seyahatinizi planlayın
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    
                    <div className="mt-2 text-center max-w-20">
                      <div className={`text-xs font-medium ${
                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Booking Summary Sidebar */}
        {bookingData.totalPrice > 0 && currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-white rounded-xl shadow-xl p-6 max-w-sm border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Rezervasyon Özeti</h3>
            <div className="space-y-2 text-sm">
              {bookingData.routeInfo?.distance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mesafe:</span>
                  <span className="font-medium">{bookingData.routeInfo.distance}</span>
                </div>
              )}
              {bookingData.routeInfo?.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Süre:</span>
                  <span className="font-medium">{bookingData.routeInfo.duration}</span>
                </div>
              )}
              {bookingData.selectedVehicle && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Araç:</span>
                  <span className="font-medium">{bookingData.selectedVehicle.name}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-bold text-green-600">
                  ₺{bookingData.totalPrice}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;
