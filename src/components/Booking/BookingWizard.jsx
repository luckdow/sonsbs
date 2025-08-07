import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, User, CreditCard } from 'lucide-react';
import logger from '../../utils/logger';

// Import steps
import RouteStep from './steps/RouteStep';
import PersonalStep from './steps/PersonalStep';
import PaymentStep from './steps/PaymentStep';

const BookingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    // Route data
    tripType: 'one-way',
    pickupLocation: null,
    dropoffLocation: null,
    date: '',
    time: '',
    returnDate: '',
    returnTime: '',
    passengerCount: 1,
    baggageCount: 1,
    selectedVehicle: null,
    routeInfo: null,
    totalPrice: 0,
    
    // Personal data
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      flightNumber: '',
      flightTime: '',
      specialRequests: ''
    },
    
    // Payment data
    paymentMethod: '', // Kullanıcı kendi seçsin
    creditCardInfo: null,
    
    // Terms
    acceptedTerms: false
  });

  // Ana sayfadan gelen hızlı rezervasyon verilerini kontrol et
  useEffect(() => {
    const quickBookingData = localStorage.getItem('quickBookingData');
    if (quickBookingData) {
      try {
        const parsedData = JSON.parse(quickBookingData);
        
        // BookingData'yı güncelle
        setBookingData(prev => ({
          ...prev,
          ...parsedData
        }));
        
        // Eğer currentStep belirtilmişse o adıma geç
        if (parsedData.currentStep) {
          setCurrentStep(parsedData.currentStep);
        }
        
        // localStorage'ı temizle
        localStorage.removeItem('quickBookingData');
        
        logger.log('Hızlı rezervasyon verileri yüklendi:', parsedData);
      } catch (error) {
        logger.error('Hızlı rezervasyon verileri yüklenirken hata:', error);
      }
    }
  }, []);

  const steps = [
    { id: 1, name: 'Güzergah', component: RouteStep, icon: MapPin },
    { id: 2, name: 'Bilgiler', component: PersonalStep, icon: User },
    { id: 3, name: 'Ödeme', component: PaymentStep, icon: CreditCard }
  ];

  const updateBookingData = (newData) => {
    setBookingData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      // Sayfa başına scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Sayfa başına scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Generate reservation ID
      const reservationId = `RES${Date.now()}`;
      
      // Prepare reservation data for confirmation page
      const reservationData = {
        ...bookingData,
        id: reservationId,
        status: 'confirmed'
      };

      // Navigate to confirmation page with booking data
      // Actual Firebase save will happen in BookingConfirmationPage
      navigate('/booking-confirmation', {
        state: {
          bookingData: reservationData
        }
      });
    } catch (error) {
      logger.error('Error preparing reservation:', error);
      alert('Rezervasyon hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current step component
  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator - No Card Background */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          {/* Step Icons */}
          <div className="flex items-center justify-center space-x-1 sm:space-x-4 md:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle - Smaller sizing */}
                <div className={`
                  flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300
                  ${currentStep > step.id 
                    ? 'bg-green-500 text-white shadow-lg scale-105' 
                    : currentStep === step.id 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-white text-gray-500 border-2 border-gray-300'
                  }
                `}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    w-8 sm:w-12 lg:w-20 h-0.5 ml-2 sm:ml-4 transition-colors
                    ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Names - Properly Aligned */}
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 sm:gap-16 md:gap-24 w-full max-w-sm sm:max-w-md md:max-w-lg">
              {steps.map((step) => (
                <div key={step.id} className="flex justify-center">
                  <span className={`
                    text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap
                    ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {CurrentStepComponent && (
            <CurrentStepComponent
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              onNext={handleNext}
              onBack={handleBack}
              onComplete={handleComplete}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingWizard;
