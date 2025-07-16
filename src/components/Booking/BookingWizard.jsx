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
    direction: 'airport-to-hotel',
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    
    // Route calculation
    routeInfo: null,
    
    // Vehicle selection
    selectedVehicle: null,
    totalPrice: 0,
    
    // Personal info
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passengerCount: 1,
      flightNumber: '',
      flightTime: '',
      specialRequests: '',
      acceptTerms: false
    },
    
    // Payment
    paymentMethod: 'credit_card'
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

  const nextStep = () => {
    if (validateCurrentStep()) {
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
        if (!bookingData.direction) {
          toast.error('Lütfen transfer yönü seçin');
          return false;
        }
        // Otel kontrolü
        const hotelLocation = bookingData.direction === 'airport-to-hotel' 
          ? bookingData.dropoffLocation 
          : bookingData.pickupLocation;
        if (!hotelLocation || (typeof hotelLocation === 'string' && !hotelLocation.trim())) {
          toast.error('Lütfen otel seçin');
          return false;
        }
        if (!bookingData.date || !bookingData.time) {
          toast.error('Lütfen tarih ve saat seçin');
          return false;
        }
        return true;
      
      case 2: // Vehicle Selection
        if (!bookingData.selectedVehicle) {
          toast.error('Lütfen bir araç seçin');
          return false;
        }
        return true;
      
      case 3: // Personal Info
        const { personalInfo } = bookingData;
        if (!personalInfo.firstName || !personalInfo.lastName) {
          toast.error('Lütfen ad ve soyad bilgilerini girin');
          return false;
        }
        if (!personalInfo.email || !personalInfo.phone) {
          toast.error('Lütfen iletişim bilgilerini girin');
          return false;
        }
        if (!personalInfo.acceptTerms) {
          toast.error('Lütfen kullanım şartlarını kabul edin');
          return false;
        }
        return true;
      
      case 4: // Payment
        if (!bookingData.paymentMethod) {
          toast.error('Lütfen ödeme yöntemi seçin');
          return false;
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
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <StepIcon className="w-7 h-7" />
                    </div>
                    
                    <div className="mt-4 text-center max-w-32">
                      <div className={`font-semibold ${
                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
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
